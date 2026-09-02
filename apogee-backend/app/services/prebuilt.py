from app.api.schemas import PrebuiltModel

PREBUILT_MODELS: list[PrebuiltModel] = [
    PrebuiltModel(
        key="revenue_forecast",
        name="Revenue Forecast",
        model_type="time_series",
        description="Forecast future revenue from historical patterns. Built for uncertain markets.",
        target_metric="Revenue",
    ),
    PrebuiltModel(
        key="churn_probability",
        name="Customer Churn Probability",
        model_type="classification",
        description="Estimate the likelihood that a customer will churn.",
        target_metric="Churn",
    ),
    PrebuiltModel(
        key="demand_forecast",
        name="Demand Forecast",
        model_type="time_series",
        description="Predict product or service demand over time.",
        target_metric="Demand",
    ),
    PrebuiltModel(
        key="marketing_roi",
        name="Marketing ROI",
        model_type="regression",
        description="Estimate return on marketing spend across channels.",
        target_metric="ROI",
    ),
    PrebuiltModel(
        key="scenario_base",
        name="Base vs Optimistic Scenario",
        model_type="scenario",
        description="Compare baseline and optimistic outcomes under different assumptions.",
        target_metric="Outcome",
    ),
    PrebuiltModel(
        key="reasoning_insights",
        name="Reasoning Insights",
        model_type="reasoning",
        description="Contextual reasoning over your essential metrics and drivers.",
        target_metric="Insight",
    ),
]


def get_prebuilt(key: str) -> PrebuiltModel | None:
    for m in PREBUILT_MODELS:
        if m.key == key:
            return m
    return None
