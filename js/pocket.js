var wallets = []; //array of objects that holds all the information about the wallets
var currentWalletId = 0;


var exchangeRates;
var bitcoinRate;
var ethereumRate;
var rippleRate;


$(document).ready(function(){

    //////////////////////////////////
    //Add Bitcoin Wallet Button Clicked
    //////////////////////////////////

    $("#addBitcoinWallet").click(function () {
/*
        $("body").append("<div id='dialog' class='hidden' title='Add Wallet'>" +
            "<p>Enter public address for your cryptocurrency account.</p>" +
            "<input type='text' class='walletPublicKey' name='walletPublicKey'>" +
	        "</div>"
        );
*/
        $("#dialog").dialog({
            modal: true,
            width: 600,
            resizable: false,
            buttons: {
                "Add Account": function() {

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
/*
        $("body").append("<div id='dialog' class='hidden' title='Add Wallet'>" +
            "<p>Enter public address for your cryptocurrency account.</p>" +
            "<input type='text' class='walletPublicKey' name='walletPublicKey'>" +
	        "</div>"
        );
*/
        $("#dialog").dialog({
            modal: true,
            width: 600,
            resizable: false,
            buttons: {
                "Add Account": function() {

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
/*
        $("body").append("<div id='dialog' class='hidden' title='Add Wallet'>" +
            "<p>Enter public address for your cryptocurrency account.</p>" +
            "<input type='text' class='walletPublicKey' name='walletPublicKey'>" +
	        "</div>"
        );
*/
        $("#dialog").dialog({
            modal: true,
            width: 600,
            resizable: false,
            buttons: {
                "Add Account": function() {

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

    
    refreshTotalBal();
    
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

    /*
    localStorage.clear();

    
    
    if (localStorage.getItem('wallets') !== null) {
        wallets = localStorage.getItem('wallets');
        alert('wallets exists');
    }
    if (localStorage.getItem('currentWalletId') !== 'null') {
        currentWalletId = localStorage.getItem('currentWalletId');
        alert("currentWalletId exists");
    }
    
    alert(wallets);
    alert(currentWalletId);
    */
    /*
    wallets.forEach(function (wallet) {

        if (wallet.type === 'bitcoin') {
            addBitcoinWallet(wallet.account);
        }
        else if (wallet.type === 'ethereum') {
            addEthereumWallet(wallet.account);
        }
        else if (wallet.type === 'ripple') {
            addRippleWallet(wallet.account);
        }
    
    });*/
    
        
    //clear cookies    
    //document.cookie = "wallets=" + "clearing" + "; expires=Tue, 16 Jan 2018 12:00:00 UTC";
    //document.cookie = "currentWalletId=" + "clearing" + "; expires=Tue, 16 Jan 2018 12:00:00 UTC";

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

            "<div class='wallet' data-id=" + currentWalletId + " data-account=" + walletPublicKey + " data-balance=" + walletBalance + "><img class='wallet_icon' src='./images/bitcoin.png' alt='Bitcoin'><div class='wallet_account'>Account: " +           walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div class='wallet_balance'>USD: $" + (Number(walletBalance)).toFixed(2) + "</div><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close removeWalletButton' title='Close'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div>"

      );
      
    
      wallets.push({id: currentWalletId, type: 'bitcoin', account: walletPublicKey, balance: walletBalance});
      currentWalletId ++;
      //localStorage.setItem("wallets", wallets);
      //localStorage.setItem("currentWalletId", currentWalletId);

      
      setClickFunctionForWalletDelete();
      
      refreshTotalBal();
  });


}

function addEthereumWallet (walletPublicKey) {

  var url = "https://api.blockcypher.com/v1/eth/main/addrs/" + $('.walletPublicKey').val() + "/balance";
  $.getJSON(url).then(function(json) {

      var walletCoins = json.balance / 1000000000000000000;

      var walletBalance = walletCoins * ethereumRate;

      
      
      
      $('#wallets').append(

            "<div class='wallet' data-id=" + currentWalletId + " data-account=" + walletPublicKey + " data-balance=" + walletBalance + "><img class='wallet_icon' src='./images/ethereum.png' alt='Bitcoin'><div class='wallet_account'>Account: " +           walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div class='wallet_balance'>USD: $" + (Number(walletBalance)).toFixed(2) + "</div><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close removeWalletButton' title='Close'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div>"

      );
      
    
      wallets.push({id: currentWalletId, type: 'ethereum', account: walletPublicKey, balance: walletBalance});
      currentWalletId ++;
      //localStorage.setItem("wallets", wallets);
      //localStorage.setItem("currentWalletId", currentWalletId);

      
      setClickFunctionForWalletDelete();
      
      
      refreshTotalBal();
              
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

            "<div class='wallet' data-id=" + currentWalletId + " data-account=" + walletPublicKey + " data-balance=" + walletBalance + "><img class='wallet_icon' src='./images/ripple.png' alt='Bitcoin'><div class='wallet_account'>Account: " +           walletPublicKey + "</div><div>Coins: " + (Number(walletCoins)).toFixed(2) + "</div><div class='wallet_balance'>USD: $" + (Number(walletBalance)).toFixed(2) + "</div><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close removeWalletButton' title='Close'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div>"

        );
      
    
        wallets.push({id: currentWalletId, type: 'ripple', account: walletPublicKey, balance: walletBalance});
        currentWalletId ++;
        //localStorage.setItem("wallets", wallets);
        //localStorage.setItem("currentWalletId", currentWalletId);

      
        setClickFunctionForWalletDelete();
      
      
        refreshTotalBal();
        
        
    }).then(() => {
        return api.disconnect();
    }).then(() => {
        console.log('done and disconnected.');
    }).catch(console.error);

}

function setClickFunctionForWalletDelete() {

    $(".removeWalletButton").click(function() {
        
          
        var id = $(this).parent().data('id');
        var acct = $(this).parent().data('account');
        var balance = $(this).parent().data('balance');

        wallets.forEach(function (wallet) {
          if (wallet.id === id) {

              var index = wallets.indexOf(wallet);
              wallets.splice(index, 1);
          }
        })

        $(this).parent().remove();
        refreshTotalBal();
    });

}

function refreshTotalBal () {
    
    var totalBal = 0;
    
    wallets.forEach(function (wallet) {
        totalBal += wallet.balance;
    });

    $('#totalBal').html("<div class='wallet'>Total: $" + (Number(totalBal).toFixed(2)) + "</div>");
    
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
