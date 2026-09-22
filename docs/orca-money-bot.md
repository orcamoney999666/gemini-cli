# ORCA Money Bot direct integration

```bash
export ORCA_MONEY_BOT_PATH=/absolute/path/to/ORCA-MONEY-BOT
node tools/orca-money-bot.mjs health
node tools/orca-money-bot.mjs config
node tools/orca-money-bot.mjs signal BTCUSDT
node tools/orca-money-bot.mjs market_data BTCUSDT
```

The helper calls the main repository's local bridge. Read-only operations are enabled by
default; credentials and live trading remain in the main bot.
