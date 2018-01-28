// this is to support both browser and node
var SDK = typeof window !== 'undefined' ? window.COIN_API_SDK : require("./coinapi_v1")["default"]

var sdk = new SDK("8C879755-3B35-4388-A9A9-CE889474ADC5")

function run() {
  var t = new Date(Date.now())
  sdk.exchange_rates_get_specific_rate("BTC", "USD", t).then(function (BTC_rate) {
    console.log('Exchange_rates_get_specific_rate:')
    console.log(Exchange_rates_get_specific_rate)
  });
  sdk.exchange_rates_get_specific_rate("ETH", "USD", t).then(function (ETH_rate) {
    console.log('Exchange_rates_get_specific_rate:')
    console.log(Exchange_rates_get_specific_rate)
  });
  sdk.exchange_rates_get_specific_rate("XRP", "USD", t).then(function (XRP_rate) {
    console.log('Exchange_rates_get_specific_rate:')
    console.log(Exchange_rates_get_specific_rate)
  });
}

run();
