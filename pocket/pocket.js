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
            "<p>Enter public address for your Bitcoin account.</p>" +
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
                    $('.walletPublicKey').val('');
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $('.walletPublicKey').val('');
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
            "<p>Enter public address for your Ethereum account.</p>" +
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
                    $('.walletPublicKey').val('');
                    $(this).dialog("close");
                },
                "Cancel": function() {
                    $('.walletPublicKey').val('');
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
            "<p>Enter public address for your Ripple account.</p>" +
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
                     $('.walletPublicKey').val('');
                    $(this).dialog("close");
                },
                "Cancel": function() {
                     $('.walletPublicKey').val('');
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


        $("#addBitcoinWallet .card-text").append("<br>$" + (Number(bitcoinRate)).toFixed(2));
        $("#addEthereumWallet .card-text").append("<br>$" + (Number(ethereumRate)).toFixed(2));
        $("#addRippleWallet .card-text").append("<br>$" + (Number(rippleRate)).toFixed(2));

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

      var walletCoins = json.balance / 100000000;

      var walletBalance = walletCoins * bitcoinRate;


      $('#wallets').append(

            "<div class='wallet'><img class='wallet_icon' src='../images/bitcoin.png' alt='Bitcoin'><div class='wallet_accountId'>Account: " +           walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div>USD: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"

      );

      updateTotalBal(walletBalance);
  });


}

function addEthereumWallet (walletPublicKey) {

  var url = "https://api.blockcypher.com/v1/eth/main/addrs/" + $('.walletPublicKey').val() + "/balance";
  $.getJSON(url).then(function(json) {

      var walletCoins = json.balance / 1000000000000000000;

      var walletBalance = walletCoins * ethereumRate;

      $('#wallets').append(

        "<div class='wallet'><img class='wallet_icon' src='../images/ethereum.png' alt='Bitcoin'><div class='wallet_accountId'>Account: " + walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div>USD: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"

    );

    updateTotalBal(walletBalance);

  });

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

        var walletBalance = walletCoins * rippleRate;

        $('#wallets').append(

            "<div class='wallet'><img class='wallet_icon' src='../images/ripple.png' alt='Ripple'><div class='wallet_accountId'>Account: " + walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div>USD: $" + (Number(walletBalance)).toFixed(2) + "</div></div>"
        );

        updateTotalBal(walletBalance);

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
