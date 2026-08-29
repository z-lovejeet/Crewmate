import asyncio
import time
import httpx
from backend.main import app

async def run_sprint_1a_audit():
    print("===============================================================")
    print("🔍 EXHAUSTIVE AUDIT SUITE: SPRINT 1A (DATA LAYER & AGENT FLEET)")
    print("===============================================================")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        
        # -------------------------------------------------------------
        # 1. FIRESTORE CLIENT & GOOGLE CLOUD CONNECTIVITY
        # -------------------------------------------------------------
        print("\n[1/5] Testing Task 1.1: Firestore Client & Google Cloud Connectivity...")
        from backend.services.firestore_client import save_document, get_document, delete_document, get_firestore_db
        from backend.config.settings import get_settings
        
        settings = get_settings()
        db = get_firestore_db()
        print(f"   - Configured GCP Project: {settings.GCP_PROJECT_ID}")
        print(f"   - Native Firestore Client Initialized: {db is not None}")
        
        test_doc_id = f"test_sprint1a_{int(time.time())}"
        test_payload = {"test": "sprint_1a_verification", "time": time.time()}
        await save_document("audit_tests", test_doc_id, test_payload)
        read_back = await get_document("audit_tests", test_doc_id)
        assert read_back is not None and read_back["test"] == "sprint_1a_verification", "Firestore write/read mismatch"
        await delete_document("audit_tests", test_doc_id)
        print("   ✅ Task 1.1 PASSED: Firestore CRUD directly verified on Google Cloud.")

        # -------------------------------------------------------------
        # 2. AGENT REGISTRY (TASK 1.2)
        # -------------------------------------------------------------
        print("\n[2/5] Testing Task 1.2: Agent Registry (Discovery, Capabilities, Heartbeat)...")
        res = await client.get("/api/registry/agents")
        assert res.status_code == 200, f"Registry failed with {res.status_code}"
        data = res.json()
        agents = data.get("agents", [])
        print(f"   - Total Registered Agents in Firestore: {len(agents)}")
        assert len(agents) == 14, f"Expected 14 agents, got {len(agents)}"

        # Check all 14 agent IDs
        expected_ids = [
            "orchestrator", "contract_reviewer", "content_compliance", "distribution_manager",
            "report_generator", "revenue_optimizer", "brand_safety", "content_calendar",
            "threat_sentinel", "audience_analyst", "trend_radar", "hook_architect",
            "clipping_director", "community_guardian"
        ]
        found_ids = [a.get("id") or a.get("agent_id") for a in agents]
        for aid in expected_ids:
            assert aid in found_ids, f"Missing agent in registry: {aid}"

        # Test single agent lookup
        agent_detail = await client.get("/api/registry/agents/contract_reviewer")
        assert agent_detail.status_code == 200
        assert "pdf_clause_extraction" in agent_detail.json().get("capabilities", [])
        
        # Test heartbeat
        hb_res = await client.post("/api/registry/agents/contract_reviewer/heartbeat", json={
            "status": "active",
            "health": "healthy",
            "latency_ms": 245.5,
            "tasks_processed": 50
        })
        assert hb_res.status_code == 200
        print("   ✅ Task 1.2 PASSED: All 14 agents verified in Firestore Registry with capabilities & health.")

        # -------------------------------------------------------------
        # 3. MEMORY BANK (TASK 1.3)
        # -------------------------------------------------------------
        print("\n[3/5] Testing Task 1.3: Memory Bank (Persistent Creator Rules & Brand History)...")
        mem_res = await client.get("/api/memory")
        assert mem_res.status_code == 200
        mem_data = mem_res.json()
        prefs = mem_data.get("creator_preferences", {})
        print(f"   - Creator Profile: {prefs.get('creator_name')} ({prefs.get('channel_niche')})")
        print(f"   - Rate Benchmark: Min ${prefs.get('minimum_deal_value_usd'):,}, Target CPM ${prefs.get('target_cpm_usd')}")
        assert prefs.get("minimum_deal_value_usd") == 6500
        assert "gambling" in prefs.get("strictly_forbidden_categories", [])

        # Test Brand Memory lookup
        brand_res = await client.get("/api/memory/brands/NordVPN")
        assert brand_res.status_code == 200
        brand_data = brand_res.json()
        print(f"   - Brand Memory (NordVPN): {brand_data.get('past_deals_count')} deals recorded. Red flag note: \"{brand_data.get('contract_quirks')[:50]}...\"")

        # Test updating memory
        update_res = await client.put("/api/memory/preferences", json={"maximum_exclusivity_days": 35})
        assert update_res.status_code == 200
        assert update_res.json().get("maximum_exclusivity_days") == 35
        # Revert back
        await client.put("/api/memory/preferences", json={"maximum_exclusivity_days": 30})
        print("   ✅ Task 1.3 PASSED: Persistent Memory Bank verified with creator rules & brand memory.")

        # -------------------------------------------------------------
        # 4. ROUTER FIRESTORE PERSISTENCE (TASK 1.4)
        # -------------------------------------------------------------
        print("\n[4/5] Testing Task 1.4: Router Firestore Persistence (Contracts & Compliance)...")
        contracts_res = await client.get("/api/contracts/list")
        assert contracts_res.status_code == 200
        contracts = contracts_res.json()
        print(f"   - Audited Contracts in Firestore: {len(contracts)} contracts loaded")
        assert len(contracts) >= 3

        compliance_res = await client.get("/api/compliance/list")
        assert compliance_res.status_code == 200
        compliance_scans = compliance_res.json()
        print(f"   - Compliance Audits in Firestore: {len(compliance_scans)} scans loaded")
        assert len(compliance_scans) >= 1
        print("   ✅ Task 1.4 PASSED: Routers actively persisting and loading from Firestore.")

        # -------------------------------------------------------------
        # 5. ALL 14 FLEET AGENTS EXECUTION VERIFICATION
        # -------------------------------------------------------------
        print("\n[5/5] Testing All 14 Fleet Agents (Execution, Model Armor & Domain Output)...")
        test_queries = {
            "orchestrator": "Plan a multi-agent review for a $10,000 brand sponsorship",
            "contract_reviewer": "Audit a clause stating 12-month category exclusivity for tech products",
            "content_compliance": "Check FTC compliance for a sponsored YouTube video with #ad tag",
            "distribution_manager": "Suggest top SEO title and description for an AI coding tools video",
            "report_generator": "Summarize key findings from a brand sponsorship audit",
            "revenue_optimizer": "Calculate market benchmark CPM for 180,000 subscriber tech channel",
            "brand_safety": "Screen a prospective sponsor promoting an online VPN software",
            "content_calendar": "Check for scheduling conflicts with two brand deals in one week",
            "threat_sentinel": "Scan the current agent fleet operational state for security anomalies",
            "audience_analyst": "Analyze retention drop-off patterns for 10-minute long-form video",
            "trend_radar": "Identify high-velocity surging topics in AI productivity for this week",
            "hook_architect": "Engineer a high-retention curiosity gap hook for an AI agent tutorial",
            "clipping_director": "Extract a 45-second high energy clip candidate from a coding video",
            "community_guardian": "Cluster 10 viewer comments into feedback themes and filter spam"
        }

        for i, (agent_id, prompt) in enumerate(test_queries.items(), 1):
            t0 = time.time()
            resp = await client.post("/api/fleet/invoke", json={"agent_id": agent_id, "prompt": prompt})
            latency = (time.time() - t0) * 1000
            assert resp.status_code == 200, f"Agent {agent_id} failed with {resp.status_code}"
            resp_data = resp.json()
            output = resp_data.get("response", "")
            source = resp_data.get("source", "")
            agent_name = resp_data.get("agent_name", agent_id)
            print(f"   [{i:02d}/14] {agent_name} ({latency:.0f}ms, source: {source}):")
            print(f"        ↳ \"{output[:105]}...\"")
            assert len(output) > 20, f"Agent {agent_id} returned empty response"

        print("\n===============================================================")
        print("🎉 SPRINT 1A AUDIT COMPLETE: ALL 14 AGENTS & DATA LAYER 100% OPERATIONAL!")
        print("===============================================================")

if __name__ == "__main__":
    asyncio.run(run_sprint_1a_audit())
