from google.adk import Agent

def compile_report(report_type: str, data_summary: str) -> dict:
    """Compile report."""
    return {"status": "success", "report": f"# {report_type.capitalize()} Report\\n\\n{data_summary}"}

def generate_executive_summary(findings: str) -> dict:
    """Generate executive summary."""
    return {"status": "success", "summary": "Overall positive growth with a few compliance items to address."}

report_generator_agent = Agent(
    name="report_generator_agent",
    model="gemini-3.7-flash",
    description="Professional report writer.",
    instruction="""Professional report writer creating compliance reports, revenue analyses, and fleet activity summaries.""",
    tools=[compile_report, generate_executive_summary],
)
