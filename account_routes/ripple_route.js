$(document).ready(function() {
  console.log(ripple);
  var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});
  const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'; //connect textbox to this
  api.connect().then(function() {
    console.log('getting account info for', myAddress);
    return api.getAccountInfo(myAddress);
  }).then(function(account_info) {
    document.body.innerHTML += "<p>Connected to rippled server!</p>" +
    "      <div>" +
    "        <h3>XRP Account: " + myAddress + "</h3>" +
    "          </div><div>Balance: " + account_info.xrpBalance + //command to retrieve xrp balance from myAddress
    "      </div>";
  }).then(() => {
    return api.disconnect();
  }).then(() => {
    console.log('done and disconnected.');
  }).catch(console.error);
})
