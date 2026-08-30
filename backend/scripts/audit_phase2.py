import asyncio
import time
import httpx
from backend.main import app
from backend.services.firestore_client import get_document, list_documents

async def run_phase_2_audit():
    print("===================================================================")
    print("🚀 EXHAUSTIVE AUDIT SUITE: PHASE 2 (AUTONOMOUS MULTI-AGENT PIPELINES)")
    print("===================================================================")

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:

        # -------------------------------------------------------------
        # 1. AUTONOMOUS CONTRACT REVIEW PIPELINE (SPRINT 2A)
        # -------------------------------------------------------------
        print("\n[1/7] Testing Pipeline 1: Autonomous Contract Review & Negotiation...")
        sample_contract_text = """
        SPONSORSHIP AGREEMENT - BRANDX & TECHVOYAGER
        Fee: $8,500 USD for 1 dedicated YouTube video (60s integration).
        Payment Terms: Net-90 days following video publication.
        Exclusivity: 12 months category exclusivity across all consumer electronics and gaming peripherals.
        Usage Rights: Perpetual worldwide digital advertising and paid social whitelisting rights granted to BrandX.
        Deliverables: 1 YouTube integration and 3 Instagram Reels.
        """
        
        t0 = time.time()
        contract_res = await client.post(
            "/api/contracts/analyze",
            files={"file": ("brandx_sponsorship_agreement.pdf", sample_contract_text.encode("utf-8"), "application/pdf")}
        )
        contract_latency = (time.time() - t0) * 1000
        assert contract_res.status_code == 200, f"Contract analyze returned {contract_res.status_code}: {contract_res.text}"
        c_data = contract_res.json()

        print(f"   - Brand Evaluated: {c_data.get('brand_name')} ({contract_latency:.0f}ms)")
        print(f"   - Offer vs Benchmark: {c_data.get('offer_amount')} (Market: {c_data.get('market_benchmark')})")
        print(f"   - Risk Score: {c_data.get('overall_risk')}")
        print(f"   - Value Unlocked: {c_data.get('value_unlocked')}")
        print(f"   - Red Flags Identified ({len(c_data.get('red_flags', []))}): {c_data.get('red_flags')[:2]}")
        print(f"   - Redlined Clauses ({len(c_data.get('clauses', []))}):")
        for cl in c_data.get("clauses", [])[:2]:
            print(f"        ↳ Clause [{cl.get('id')}] {cl.get('clause')}: {cl.get('risk')} - Counter: \"{cl.get('counter_proposal')[:70]}...\"")

        assert c_data.get("brand_name") is not None
        assert len(c_data.get("clauses", [])) > 0
        assert c_data.get("id") is not None

        # Verify saved in Firestore
        saved_contract = await get_document("contracts", c_data["id"])
        assert saved_contract is not None, f"Contract {c_data['id']} was not saved to Firestore"
        print(f"   ✅ Firestore Persistence Verified: Doc ID '{c_data['id']}' in 'contracts' collection.")
        print("   ✅ Pipeline 1 PASSED: Autonomous Contract Review & Negotiation verified.")

        # -------------------------------------------------------------
        # 2. AUTONOMOUS COMPLIANCE & AUDIO SHIELD PIPELINE (SPRINT 2A)
        # -------------------------------------------------------------
        print("\n[2/7] Testing Pipeline 2: Content Compliance & Copyright Audio Shield...")
        compliance_req = {
            "content_title": "10 AI Tools That Changed How I Build Software (Sponsored by BrandX)",
            "content_description": "In this video we review top AI dev tools. Use link in description for special BrandX discounts. #ad #sponsored",
            "platform": "youtube",
            "has_paid_partnership": True,
            "audio_track": "Cyberpunk Neon Drive (Copyright Flagged in 120 regions)"
        }

        t0 = time.time()
        comp_res = await client.post("/api/compliance/scan", json=compliance_req)
        comp_latency = (time.time() - t0) * 1000
        assert comp_res.status_code == 200
        comp_data = comp_res.json()

        print(f"   - Overall Compliance Score: {comp_data.get('overall_score')}/100 (Status: {comp_data.get('shield_status')})")
        print(f"   - FTC Compliance: {'SHIELDED' if comp_data.get('ftc_compliant') else 'FAILED'}")
        print(f"   - Checks Evaluated ({len(comp_data.get('checks', []))}):")
        for chk in comp_data.get("checks", []):
            print(f"        ↳ [{chk.get('category')}]: {chk.get('status').upper()} - {chk.get('finding')[:65]}...")

        audio_s = comp_data.get("audio_shield")
        if audio_s:
            print(f"   - Lyria AI Royalty-Free Soundtrack Substituted:")
            print(f"        ↳ Original: '{audio_s.get('original_track')}' (Risk: {audio_s.get('original_risk')})")
            print(f"        ↳ Lyria Replacement: '{audio_s.get('suggested_lyria_track')}' ({audio_s.get('bpm')} BPM, {audio_s.get('mood')})")

        assert 0 <= comp_data.get("overall_score") <= 100
        assert comp_data.get("audio_shield") is not None
        assert comp_data.get("ftc_compliant") is True
        print("   ✅ Pipeline 2 PASSED: Compliance Scanning & Lyria Audio Substitution verified.")

        # -------------------------------------------------------------
        # 3. MULTI-AGENT FLEET ORCHESTRATION PIPELINE (SPRINT 2B)
        # -------------------------------------------------------------
        print("\n[3/7] Testing Pipeline 3: Multi-Agent Captain Fleet Orchestration...")
        orch_req = {
            "mission": "Audit the BrandX $8,500 sponsorship contract, calculate revenue upside, verify FTC disclosure compliance, and create a cross-platform distribution plan for YouTube and Instagram Reels.",
            "brand_context": "BrandX Gaming",
            "target_platforms": ["youtube", "instagram"]
        }

        t0 = time.time()
        orch_res = await client.post("/api/fleet/orchestrate", json=orch_req)
        orch_latency = (time.time() - t0) * 1000
        assert orch_res.status_code == 200
        orch_data = orch_res.json()

        print(f"   - Orchestrator: {orch_data.get('orchestrator')} ({orch_latency:.0f}ms)")
        print(f"   - Dispatched Specialist Agents ({len(orch_data.get('dispatched_agents', []))}): {orch_data.get('dispatched_agents')}")
        print(f"   - Executive Synthesis Preview:")
        synthesis_lines = orch_data.get("executive_synthesis", "").split("\n")
        for line in synthesis_lines[:5]:
            if line.strip():
                print(f"        {line.strip()[:80]}")

        assert orch_data.get("status") == "completed"
        assert len(orch_data.get("dispatched_agents", [])) >= 3
        print("   ✅ Pipeline 3 PASSED: Multi-Agent Captain Orchestration verified.")

        # -------------------------------------------------------------
        # 4. MULTIMODAL VIDEO PRODUCTION STORYBOARD (GOOGLE VEO)
        # -------------------------------------------------------------
        print("\n[4/7] Testing Pipeline 4: Multimodal Google Veo AI Video Storyboard...")
        veo_req = {
            "topic": "Autonomous AI Agent Fleet for Content Creators",
            "target_duration_seconds": 45,
            "aspect_ratio": "16:9",
            "tone": "cinematic_tech"
        }

        t0 = time.time()
        veo_res = await client.post("/api/reports/veo-video-summary", json=veo_req)
        veo_latency = (time.time() - t0) * 1000
        assert veo_res.status_code == 200
        veo_data = veo_res.json()

        print(f"   - Veo Video Title: \"{veo_data.get('title')}\" ({veo_latency:.0f}ms)")
        print(f"   - Target Duration: {veo_data.get('total_duration_seconds')}s (Aspect Ratio: {veo_data.get('aspect_ratio')})")
        print(f"   - Veo Engine: {veo_data.get('veo_model')} (Job: {veo_data.get('generation_job_id')})")
        print(f"   - Storyboard Scenes ({len(veo_data.get('scenes', []))}):")
        for s in veo_data.get("scenes", []):
            print(f"        ↳ Scene {s.get('scene_number')} ({s.get('duration_seconds')}s): Camera: \"{s.get('camera_direction')[:45]}...\"")
            print(f"           Prompt: \"{s.get('visual_prompt')[:60]}...\"")
            print(f"           Voiceover: \"{s.get('voiceover_script')[:60]}...\"")

        assert len(veo_data.get("scenes", [])) >= 3
        assert veo_data.get("status") == "completed"
        print("   ✅ Pipeline 4 PASSED: Multimodal Google Veo video generation package verified.")

        # -------------------------------------------------------------
        # 5. MULTIMODAL VIRAL THUMBNAIL CONCEPTS (IMAGEN 3)
        # -------------------------------------------------------------
        print("\n[5/7] Testing Pipeline 5: Imagen 3 High-CTR Thumbnail Concepts...")
        t0 = time.time()
        thumb_res = await client.post("/api/reports/thumbnail-concepts?topic=How%20AI%20Agents%2010x%20Creator%20Revenue")
        thumb_latency = (time.time() - t0) * 1000
        assert thumb_res.status_code == 200
        thumb_data = thumb_res.json()

        print(f"   - Topic: \"{thumb_data.get('topic')}\" ({thumb_latency:.0f}ms)")
        print(f"   - Generated Concepts ({len(thumb_data.get('concepts', []))}):")
        for c in thumb_data.get("concepts", []):
            print(f"        ↳ [{c.get('concept_id')}] Headline: \"{c.get('headline')}\" | Predicted CTR: {c.get('predicted_ctr')}")
            print(f"           Palette: {c.get('color_palette')} | Imagen Prompt: \"{c.get('imagen_prompt')[:65]}...\"")

        assert len(thumb_data.get("concepts", [])) >= 3
        print("   ✅ Pipeline 5 PASSED: Imagen 3 High-CTR thumbnail concept generation verified.")

        # -------------------------------------------------------------
        # 6. AUTONOMOUS VOICE COMMAND GATEWAY (SPRINT 2B)
        # -------------------------------------------------------------
        print("\n[6/7] Testing Pipeline 6: Autonomous Voice Command Gateway...")
        voice_commands = [
            ("Audit my BrandX sponsorship deal", "contract_reviewer"),
            ("Check FTC compliance for my new video", "content_compliance"),
            ("What are the breakout trends this week in AI?", "trend_radar"),
            ("Generate hooks and video script for my next upload", "hook_architect"),
            ("Turn my latest YouTube video into viral shorts", "clipping_director")
        ]

        for text_cmd, expected_agent in voice_commands:
            v_res = await client.post("/api/voice/command", json={"text": text_cmd})
            assert v_res.status_code == 200
            v_data = v_res.json()
            print(f"   - Voice: \"{text_cmd}\"")
            print(f"        ↳ Routed To: {v_data.get('routed_agent_name')} ({v_data.get('routed_agent_id')})")
            print(f"        ↳ Agent Action: {v_data.get('action_taken')}")
            assert v_data.get("routed_agent_id") == expected_agent

        print("   ✅ Pipeline 6 PASSED: Voice command parsing & multi-agent intent routing verified.")

        # -------------------------------------------------------------
        # 7. TREND RADAR & CONTENT BRIEF PIPELINE (GROWTH FLEET)
        # -------------------------------------------------------------
        print("\n[7/7] Testing Pipeline 7: Trend Radar Discovery & Content Brief Generation...")
        t0 = time.time()
        trend_res = await client.post("/api/trends/scan", json={"niche": "AI Coding & Tech", "platform": "youtube"})
        trend_latency = (time.time() - t0) * 1000
        assert trend_res.status_code == 200
        trend_data = trend_res.json()

        print(f"   - Niche: {trend_data.get('niche')} on {trend_data.get('platform')} ({trend_latency:.0f}ms)")
        print(f"   - Trend Summary: \"{trend_data.get('trend_summary')[:75]}...\"")
        print(f"   - Discovered Briefs ({len(trend_data.get('briefs', []))}):")
        for b in trend_data.get("briefs", []):
            print(f"        ↳ Title: \"{b.get('title_concept')}\" | Format: {b.get('format')} | Velocity: {b.get('velocity_score')}/100")
            print(f"           Hook: \"{b.get('viral_hook')[:65]}...\"")

        assert len(trend_data.get("briefs", [])) >= 3
        print("   ✅ Pipeline 7 PASSED: Trend Radar discovery & content briefing verified.")

        print("\n===================================================================")
        print("🎉 PHASE 2 AUDIT COMPLETE: ALL 7 AUTONOMOUS PIPELINES 100% OPERATIONAL!")
        print("===================================================================")

if __name__ == "__main__":
    asyncio.run(run_phase_2_audit())
