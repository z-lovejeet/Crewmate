import asyncio
import time
import httpx
from backend.main import app
from backend.services.observability import (
    record_trace_span, get_recent_traces, get_traces_for_agent, get_observability_overview, SpanContext
)
from backend.services.runtime import create_runtime_task, get_task_status, update_task_progress, list_runtime_tasks
from backend.services.gemma_classifier import classify_content_and_safety

async def run_sprint_1c_audit():
    print("===================================================================")
    print("📊 EXHAUSTIVE AUDIT SUITE: SPRINT 1C (OBSERVABILITY, RUNTIME & GEMMA)")
    print("===================================================================")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:

        # -------------------------------------------------------------
        # 1. OPENTELEMETRY TRACES & OBSERVABILITY SPANS (TASK 1.9 & 1.10)
        # -------------------------------------------------------------
        print("\n[1/4] Testing Task 1.9 & 1.10: OpenTelemetry Reasoning Spans & Traces API...")
        
        # Test recording a rich span with tool calls
        test_trace_id = f"trace_audit_{int(time.time())}"
        span = SpanContext(test_trace_id, "contract_reviewer", "audit_exclusivity_clause")
        span.add_tool_call(
            tool_name="extract_clauses",
            arguments={"clause_type": "exclusivity", "document": "brand_deal.pdf"},
            output_summary="Found 12-month exclusivity clause in section 4.2",
            latency_ms=145.2
        )
        span.add_tool_call(
            tool_name="score_risk",
            arguments={"clause_id": "c1", "risk_level": "critical"},
            output_summary="Assigned severity 9/10 due to excessive exclusivity duration",
            latency_ms=88.7
        )
        finished_span = span.finish(status="success", output_summary="Exclusivity risk flagged. Proposed counter-clause: 30 days.")
        
        persisted = await record_trace_span(
            trace_id=finished_span["trace_id"],
            agent_id=finished_span["agent_id"],
            action=finished_span["action"],
            latency_ms=finished_span["latency_ms"],
            status=finished_span["status"],
            tool_calls=finished_span["tool_calls"],
            output_summary=finished_span["output_summary"]
        )
        assert persisted["trace_id"] == test_trace_id
        print(f"   - Span Created: [{persisted['agent_id']}] '{persisted['action']}' (latency: {persisted['latency_ms']}ms, {persisted['tool_calls_count']} tools)")

        # Query GET /api/traces
        traces_res = await client.get("/api/traces?limit=30")
        assert traces_res.status_code == 200
        traces_data = traces_res.json()
        print(f"   - Total Traces in Firestore: {traces_data.get('count')} traces loaded")
        assert traces_data.get("count", 0) > 0, "No traces found in Firestore"

        # Query GET /api/traces/overview
        overview_res = await client.get("/api/traces/overview")
        assert overview_res.status_code == 200
        overview_data = overview_res.json()
        print(f"   - Observability Overview:")
        print(f"        ↳ Total Recorded Operations: {overview_data.get('total_traces')}")
        print(f"        ↳ Average Execution Latency: {overview_data.get('avg_latency_ms')}ms")
        print(f"        ↳ Success Rate: {overview_data.get('success_rate_percent')}%")
        print(f"        ↳ Total Tool Calls Tracked: {overview_data.get('total_tool_calls')}")
        assert overview_data.get("total_traces", 0) > 0

        # Query GET /api/traces/agent/{agent_id}
        agent_traces_res = await client.get("/api/traces/agent/contract_reviewer")
        assert agent_traces_res.status_code == 200
        assert agent_traces_res.json().get("count") >= 1
        print("   ✅ Task 1.9 & 1.10 PASSED: OpenTelemetry spans & aggregate telemetry verified.")

        # -------------------------------------------------------------
        # 2. GEMMA CONTENT CLASSIFICATION & BRAND SAFETY (TASK 1.12)
        # -------------------------------------------------------------
        print("\n[2/4] Testing Task 1.12: Gemma Lightweight Content Classification...")
        
        sample_title = "Ultimate Guide to AI Coding Assistants in 2026 - Sponsored by NordVPN"
        sample_desc = "In this video we review top AI dev tools. Use code TECHVOYAGER for 70% off NordVPN. #ad"
        sample_tags = ["ai", "coding", "software", "vpn", "sponsorship"]

        t0 = time.time()
        classification = await classify_content_and_safety(sample_title, sample_desc, sample_tags)
        gemma_latency = (time.time() - t0) * 1000

        print(f"   - Analyzed Content: \"{sample_title[:50]}...\" ({gemma_latency:.0f}ms)")
        print(f"   - Category: {classification.get('category')}")
        print(f"   - Brand Safety Score: {classification.get('brand_safety_score')}/100 (Advertiser Friendly: {classification.get('advertiser_friendly')})")
        print(f"   - Tone: {classification.get('content_tone')}")
        print(f"   - FTC Tag Recommendation: {classification.get('suggested_ftc_tag')}")

        assert classification.get("category") is not None
        assert 0 <= classification.get("brand_safety_score", 0) <= 100
        assert classification.get("advertiser_friendly") is True
        print("   ✅ Task 1.12 PASSED: Gemma content classification & brand safety scoring verified.")

        # -------------------------------------------------------------
        # 3. AGENT RUNTIME ASYNC TASK LIFECYCLE (TASK 1.11)
        # -------------------------------------------------------------
        print("\n[3/4] Testing Task 1.11: Agent Runtime Asynchronous Task Execution...")
        
        # Submit async task
        submit_payload = {
            "agent_id": "revenue_optimizer",
            "goal": "Calculate sponsorship valuation and recommended counter-rate for a 2-video package with 180,000 views per video",
            "payload": {
                "brand_name": "HorizonTech",
                "deliverables": "2 dedicated YouTube videos (8-10 min)",
                "views_per_video": 180000,
                "initial_brand_offer_usd": 8000
            }
        }

        submit_res = await client.post("/api/runtime/submit", json=submit_payload)
        assert submit_res.status_code == 200
        submit_data = submit_res.json()
        task_id = submit_data.get("task_id")
        print(f"   - Async Task Submitted: task_id={task_id} (status: {submit_data.get('status')})")
        assert task_id is not None

        # Poll task status through completion
        print("   - Polling Agent Runtime state machine (pending -> running -> completed)...")
        max_polls = 20
        task_record = None
        for poll_idx in range(max_polls):
            await asyncio.sleep(1.5)
            poll_res = await client.get(f"/api/runtime/tasks/{task_id}")
            assert poll_res.status_code == 200
            task_record = poll_res.json()
            curr_status = task_record.get("status")
            progress = task_record.get("progress_percent")
            steps = task_record.get("steps_completed", [])
            print(f"        ↳ Poll #{poll_idx+1}: status='{curr_status}' (progress={progress}%, steps={len(steps)})")
            
            if curr_status in ["completed", "failed"]:
                break

        assert task_record is not None
        assert task_record.get("status") == "completed", f"Expected 'completed', got '{task_record.get('status')}' (error: {task_record.get('error')})"
        assert task_record.get("progress_percent") == 100
        assert task_record.get("result") is not None
        summary_snippet = task_record["result"].get("summary", "")[:120].replace("\n", " ")
        print(f"   ✅ Async Task Completed Successfully!")
        print(f"        ↳ Output Summary: \"{summary_snippet}...\"")
        print(f"        ↳ Steps Tracked: {[s.get('step') for s in task_record.get('steps_completed', [])]}")

        # List all runtime tasks
        list_res = await client.get("/api/runtime/tasks")
        assert list_res.status_code == 200
        assert list_res.json().get("count") >= 1
        print(f"   - Total Background Tasks in History: {list_res.json().get('count')}")
        print("   ✅ Task 1.11 PASSED: Agent Runtime state machine & async background workers verified.")

        # -------------------------------------------------------------
        # 4. DEPENDENCIES & PACKAGE VERIFICATION (TASK 1.13)
        # -------------------------------------------------------------
        print("\n[4/4] Testing Task 1.13: Dependencies & Package Verification...")
        import google.cloud.firestore
        import opentelemetry.trace
        import google.genai
        print(f"   - google-cloud-firestore: {google.cloud.firestore.__file__}")
        print(f"   - opentelemetry-api: {opentelemetry.trace.__file__}")
        print(f"   - google-genai: {google.genai.__file__}")
        print("   ✅ Task 1.13 PASSED: All enterprise SDKs verified in runtime environment.")

        print("\n===================================================================")
        print("🎉 SPRINT 1C AUDIT COMPLETE: OBSERVABILITY, RUNTIME & GEMMA 100% OPERATIONAL!")
        print("===================================================================")

if __name__ == "__main__":
    asyncio.run(run_sprint_1c_audit())
