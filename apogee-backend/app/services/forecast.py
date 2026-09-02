"""
Minimal, dependency-free time-series forecasting.

Fits a simple linear trend (ordinary least squares) on a chronological
train split, evaluates it on a held-out test split, and reports real
error metrics (MAE, MAPE). This is intentionally simple — a baseline,
not a production forecasting model — but every number it returns is
computed from the data passed in, not sampled from a random range.
"""

from dataclasses import dataclass


class InsufficientDataError(Exception):
    pass


@dataclass
class ForecastResult:
    mae: float
    mape: float
    training_points: int
    test_points: int
    slope: float
    intercept: float
    forecast_next: float


def _least_squares(xs: list[float], ys: list[float]) -> tuple[float, float]:
    """Ordinary least squares for y = slope * x + intercept."""
    n = len(xs)
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    num = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    den = sum((x - mean_x) ** 2 for x in xs)
    if den == 0:
        return 0.0, mean_y
    slope = num / den
    intercept = mean_y - slope * mean_x
    return slope, intercept


def train_and_evaluate(values: list[float], min_points: int = 8, test_fraction: float = 0.2) -> ForecastResult:
    """values must already be sorted chronologically (oldest first)."""
    n = len(values)
    if n < min_points:
        raise InsufficientDataError(
            f"Need at least {min_points} historical data points to train, got {n}."
        )

    split = max(1, int(n * (1 - test_fraction)))
    train_vals = values[:split]
    test_vals = values[split:]
    if not test_vals:
        # guarantee at least one held-out point to evaluate against
        train_vals, test_vals = values[:-1], values[-1:]

    train_xs = list(range(len(train_vals)))
    slope, intercept = _least_squares(train_xs, train_vals)

    test_xs = list(range(len(train_vals), len(train_vals) + len(test_vals)))
    preds = [slope * x + intercept for x in test_xs]

    abs_errors = [abs(y - p) for y, p in zip(test_vals, preds)]
    mae = sum(abs_errors) / len(abs_errors)

    pct_errors = [
        abs((y - p) / y) for y, p in zip(test_vals, preds) if y != 0
    ]
    mape = (sum(pct_errors) / len(pct_errors) * 100) if pct_errors else float("nan")

    next_x = len(values)
    forecast_next = slope * next_x + intercept

    return ForecastResult(
        mae=round(mae, 2),
        mape=round(mape, 2) if mape == mape else 0.0,  # nan check
        training_points=len(train_vals),
        test_points=len(test_vals),
        slope=round(slope, 4),
        intercept=round(intercept, 4),
        forecast_next=round(forecast_next, 2),
    )
