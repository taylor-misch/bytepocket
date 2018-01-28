var totalBalance = 0;

var exchangeRates;
var bitcoinRate;
var ethereumRate;
var rippleRate;


$(document).ready(function(){


    //$( "#accordion" ).accordion({
      //collapsible: true
    //});

    //////////////////////////////////
    //Add Bitcoin Wallet Button Clicked
    //////////////////////////////////

    $("#addBitcoinWallet").click(function () {

        $("body").append("<div id='dialog' class='hidden' title='Add Wallet'>" +
            "<p>Enter in the public key for your wallet.</p>" +
            "<input type='text' class='walletPublicKey' name='walletPublicKey'>" +
	        "</div>"
        );

        $("#dialog").dialog({
            modal: true,
            width: 600,
            resizable: false,
            buttons: {
                "Add Wallet": function() {

                    addBitcoinWallet( $('.walletPublicKey').val() );
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    })

    //////////////////////////////////
    //Add Ethereum Wallet Button Clicked
    //////////////////////////////////

    $("#addEthereumWallet").click(function () {

        $("body").append("<div id='dialog' class='hidden' title='Add Wallet'>" +
            "<p>Enter in the public key for your wallet.</p>" +
            "<input type='text' class='walletPublicKey' name='walletPublicKey'>" +
	        "</div>"
        );

        $("#dialog").dialog({
            modal: true,
            width: 600,
            resizable: false,
            buttons: {
                "Add Wallet": function() {

                    addEthereumWallet( $('.walletPublicKey').val() );
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    });

    //////////////////////////////////
    //Add Ripple Wallet Button Clicked
    //////////////////////////////////

    $("#addRippleWallet").click(function () {

        $("body").append("<div id='dialog' class='hidden' title='Add Wallet'>" +
            "<p>Enter in the public key for your wallet.</p>" +
            "<input type='text' class='walletPublicKey' name='walletPublicKey'>" +
	        "</div>"
        );

        $("#dialog").dialog({
            modal: true,
            width: 600,
            resizable: false,
            buttons: {
                "Add Wallet": function() {

                    addRippleWallet( $('.walletPublicKey').val() );
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $(this).dialog("close");
                }
            }
        });
    });


    getExchangeRates().then(function(val) {
        exchangeRates = val;
        console.log(exchangeRates);


        $.each(exchangeRates, function (key, value) {

            if (value.id === "bitcoin") {
               bitcoinRate = value.price_usd;
            }
            if (value.id === "ethereum") {
                ethereumRate = value.price_usd;
            }
            if (value.id === "ripple") {
                rippleRate = value.price_usd;
            }
        });

        console.log(bitcoinRate);
        console.log(ethereumRate);
        console.log(rippleRate);
    })


});


function getExchangeRates () {

    return new Promise(function (resolve, reject) {

        var url = "https://api.coinmarketcap.com/v1/ticker/";

        $.getJSON( url, function(json) {

            //var obj = JSON.parse(json);
            console.log(json);
            console.log(json[0]);
            resolve(json);
        });
    });
}

function addBitcoinWallet (walletPublicKey) {

  var url = "https://api.blockcypher.com/v1/btc/main/addrs/" + $('.walletPublicKey').val() + "/balance";
  $.getJSON(url).then(function(json) {

      //var obj = JSON.parse(json);
      console.log(json.balance / 100000000);
  });

    //code for getting
    var walletCoins = 45.67;
    var walletBalance = 67.90;

    $('#wallets').append(

        "<div class='wallet'><img class='wallet_icon' src='../images/bitcoin.png' alt='Bitcoin'><div>Bitcoin Wallet</div><div class='wallet_accountId'>Account: " + walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div>USD: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"

    );

    updateTotalBal(walletBalance);
}

function addEthereumWallet (walletPublicKey) {

  var url = "https://api.blockcypher.com/v1/eth/main/addrs/" + $('.walletPublicKey').val() + "/balance";
  $.getJSON(url).then(function(json) {

      //var obj = JSON.parse(json);
      console.log(json.balance / 1000000000000000000);
  });

    //code for getting
    var walletCoins = 45.67;
    var walletBalance = 67.90;

    $('#wallets').append(

        "<div class='wallet'><img class='wallet_icon' src='../images/ethereum.png' alt='Bitcoin'><div>Ethereum Wallet</div><div class='wallet_accountId'>Account: " + walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div>USD: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"

    );

    updateTotalBal(walletBalance);
}

function addRippleWallet (walletPublicKey) {
    console.log(ripple);
    var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});

    //const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'; //connect textbox to this

    api.connect().then(function() {

        console.log('getting account info for', walletPublicKey);
        return api.getAccountInfo(walletPublicKey);

    }).then(function(account_info) {

        var walletCoins = account_info.xrpBalance;


         getRippleRate().then(function(rate) {

            //roundedRate = (Number(rate)).toFixed(2);

             var walletBalance = walletCoins * rate;

            $('#wallets').append(

                "<div class='wallet'><img class='wallet_icon' src='../images/ripple.png' alt='Ripple'><div>Ripple Wallet</div><div class='wallet_accountId'>Account: " + walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div>USD: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"
            );

            updateTotalBal(walletBalance);
        });


        /*
        var walletBalance = 65.80;

        $('#wallets').append(

            "<div class='wallet'><img class='wallet_icon' src='../images/ripple.png' alt='Ripple'><div>Ripple Wallet</div><div class='wallet_accountId'>Account: " + walletPublicKey + "</div><div>Coins: " + (Number(account_info.xrpBalance)).toFixed(2) + "</div><div>Balance: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"

        );

        updateTotalBal(walletBalance);
        */
    }).then(() => {
        return api.disconnect();
    }).then(() => {
        console.log('done and disconnected.');
    }).catch(console.error);

}


function updateTotalBal (balanceToAdd) {

    totalBalance += balanceToAdd;
    $('#totalBal').html("<div class='wallet'>Total: $" + (Number(totalBalance).toFixed(2)) + "</div>");
}
