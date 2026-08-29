from google.adk import Agent
from .contract_reviewer import contract_reviewer_agent
from .content_compliance import content_compliance_agent
from .distribution_manager import distribution_manager_agent
from .report_generator import report_generator_agent
from .revenue_optimizer import revenue_optimizer_agent
from .brand_safety import brand_safety_agent
from .content_calendar import content_calendar_agent
from .threat_sentinel import threat_sentinel_agent
from .audience_analyst import audience_analyst_agent
from .trend_radar import trend_radar_agent
from .hook_architect import hook_architect_agent
from .clipping_director import clipping_director_agent
from .community_guardian import community_guardian_agent

fleet_orchestrator = Agent(
    name="fleet_orchestrator",
    model="gemini-3.1-pro-preview",
    description="Fleet Orchestrator for Crewmate.",
    instruction="""You are the Fleet Orchestrator for Crewmate. When a creator sends a request, analyze it and delegate to the appropriate specialist agent. You can delegate to multiple agents if needed. Provide detailed instructions on which agent handles: contracts, compliance, distribution, reports, revenue, brand safety, calendar, threats, audience, trends, hooks/scripts, clipping, and community.""",
    tools=[],
    sub_agents=[
        contract_reviewer_agent,
        content_compliance_agent,
        distribution_manager_agent,
        report_generator_agent,
        revenue_optimizer_agent,
        brand_safety_agent,
        content_calendar_agent,
        threat_sentinel_agent,
        audience_analyst_agent,
        trend_radar_agent,
        hook_architect_agent,
        clipping_director_agent,
        community_guardian_agent
    ]
)
