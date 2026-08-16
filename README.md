# Renewable Energy Infrastructure — Market Intelligence Dashboard

An investment-research dashboard built in the style of a PE sector briefing:
market sizing, competitive landscape, regulatory risk by region, and a
due-diligence flag list — the kind of one-page briefing an analyst would
prepare ahead of an investment committee meeting.

Built as a portfolio piece for private equity / market research roles
(sector chosen to reflect the kind of asset-rich, regulation-heavy
industries PE firms like Terra Firma Capital Partners target).

## Why this project

Most market-research portfolio pieces are static reports (PDF/Word). This
one is interactive — closer to what an analyst actually hands an
investment committee, and it demonstrates technical ability (data
pipeline + frontend) alongside market-research thinking.

## Tech stack

- **React** — dashboard UI
- **Recharts** — charts (area, scatter, bar, radial gauge)
- **Tailwind CSS** — styling
- **Python / pandas** *(next step, see below)* — for pulling and reshaping real market data

## Data note

The dashboard currently runs on illustrative sample data (clearly labeled
in the footer). This was intentional for a first version — it lets you
demo the whole dashboard without needing an API key.

### Swapping in real data — `fetch_market_data.py`

This repo now includes `fetch_market_data.py`, a script that:

1. Pulls real fundamentals (market cap, revenue, revenue growth, margins)
   for a basket of publicly-traded renewable energy companies using
   `yfinance`
2. Pulls 5 years of price history to build an approximate market growth
   trend
3. Reshapes everything into `data.json`, in the same structure the
   dashboard expects

**To run it:**

```bash
pip install yfinance pandas
python fetch_market_data.py
```

This needs a normal internet connection — it pulls live data from Yahoo
Finance, so run it on your own machine, not in a restricted sandbox.

Once you have `data.json`, import it into `market-dashboard.jsx` in place
of the hard-coded `marketGrowth` and `competitors` arrays at the top of
the file.

This step turns the project from "a nice chart" into "a data pipeline I
built" — worth doing before you share the final link.

## Running locally

```bash
npx create-react-app market-dashboard
cd market-dashboard
npm install recharts lucide-react
# replace src/App.js with market-dashboard.jsx content
npm start
```

## What I'd say about this in an interview / cover letter

> "I built an interactive market-intelligence dashboard modeling how a PE
> analyst would brief an investment committee on a sector — market growth,
> competitive landscape, regional regulatory risk, and diligence flags —
> to combine my technical background with investment research thinking."
