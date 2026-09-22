# ORCA Money Bot integration for Gemini CLI

This helper lets Gemini CLI call the main ORCA Money Bot through the local JSON bridge.

Environment:

```bash
export ORCA_MONEY_BOT_PATH=/absolute/path/to/ORCA-MONEY-BOT
node tools/orca-money-bot.mjs health
node tools/orca-money-bot.mjs config
node tools/orca-money-bot.mjs signal BTCUSDT
node tools/orca-money-bot.mjs market_data BTCUSDT
```

The bridge is read-only by default. Binance credentials and the live risk gate remain in
`ORCA-MONEY-BOT`. Live execution requires explicit opt-in in the main project.
