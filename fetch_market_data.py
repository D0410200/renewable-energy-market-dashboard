"""
fetch_market_data.py

Pulls real stock/financial data for a basket of renewable energy companies
and reshapes it into the JSON structure the dashboard (market-dashboard.jsx)
expects. Produces data.json.

WHY THIS FILE MATTERS FOR YOUR PORTFOLIO:
This turns the dashboard from "a nice chart with fake numbers" into
"a data pipeline I built that pulls and reshapes real financial data."
That's the difference between a design exercise and an analyst-style project.

HOW TO RUN THIS:
1. Install dependencies:
       pip install yfinance pandas
2. Run:
       python fetch_market_data.py
3. It creates data.json in the same folder.
4. Import that JSON into market-dashboard.jsx instead of the hard-coded
   sample arrays (see the "Swapping in real data" section in README.md).

NOTE: This script needs a normal internet connection (Yahoo Finance).
It will NOT run inside this chat's sandbox because of network restrictions
here — but it works normally on your own machine.
"""

import json
from datetime import datetime

import pandas as pd
import yfinance as yf

# ---------------------------------------------------------------------------
# 1. DEFINE YOUR COMPANY BASKET
# Pick real, publicly-traded renewable energy companies. Tickers below are
# a starting basket — swap in whichever companies you want to profile.
# ---------------------------------------------------------------------------

TICKERS = {
    "FSLR": "First Solar",
    "ENPH": "Enphase Energy",
    "RUN": "Sunrun",
    "NEE": "NextEra Energy",
    "ORSTED.CO": "Orsted",
    "VWS.CO": "Vestas Wind Systems",
}


def fetch_company_snapshot(ticker: str, label: str) -> dict:
    """Pull key stats for one company using yfinance."""
    t = yf.Ticker(ticker)
    info = t.info  # dictionary of company fundamentals

    # yfinance field names vary by ticker/exchange; .get() keeps this safe
    return {
        "name": label,
        "ticker": ticker,
        "marketCapUSDm": round((info.get("marketCap") or 0) / 1_000_000, 1),
        "revenueUSDm": round((info.get("totalRevenue") or 0) / 1_000_000, 1),
        "revenueGrowthPct": round((info.get("revenueGrowth") or 0) * 100, 1),
        "profitMarginPct": round((info.get("profitMargins") or 0) * 100, 1),
        "sector": info.get("sector", "Unknown"),
        "country": info.get("country", "Unknown"),
    }


def fetch_price_history(ticker: str, period: str = "5y") -> pd.DataFrame:
    """Pull historical prices — used to build the market growth trend chart."""
    hist = yf.Ticker(ticker).history(period=period)
    return hist[["Close"]].reset_index()


def build_market_growth_series(tickers: dict) -> list:
    """
    Approximates 'market size' by summing market cap growth of the basket
    over time, indexed to a base year. This is a simplification — a real
    PE research team would use a licensed market-sizing data source
    (e.g. BloombergNEF, IEA) — but it's a reasonable, defensible proxy
    for a portfolio project.
    """
    yearly_totals = {}
    for ticker in tickers:
        hist = fetch_price_history(ticker)
        hist["year"] = hist["Date"].dt.year
        yearly_avg = hist.groupby("year")["Close"].mean()
        for year, price in yearly_avg.items():
            yearly_totals.setdefault(year, 0)
            yearly_totals[year] += price

    series = []
    for year in sorted(yearly_totals):
        series.append({"year": int(year), "indexValue": round(yearly_totals[year], 1)})
    return series


def build_competitor_table(tickers: dict) -> list:
    rows = []
    for ticker, label in tickers.items():
        try:
            rows.append(fetch_company_snapshot(ticker, label))
        except Exception as e:
            print(f"Skipping {ticker} ({label}): {e}")
    return rows


def main():
    print("Fetching company snapshots...")
    competitors = build_competitor_table(TICKERS)

    print("Fetching price history for market growth trend...")
    market_growth = build_market_growth_series(TICKERS)

    output = {
        "generatedAt": datetime.utcnow().isoformat(),
        "competitors": competitors,
        "marketGrowth": market_growth,
    }

    with open("data.json", "w") as f:
        json.dump(output, f, indent=2)

    print(f"Done. Wrote data.json with {len(competitors)} companies "
          f"and {len(market_growth)} years of trend data.")


if __name__ == "__main__":
    main()
