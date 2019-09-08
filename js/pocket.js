var wallets = []; //array of objects that holds all the information about the wallets
var currentWalletId = 0;

var exchangeRates;
var bitcoinRate;
var ethereumRate;
var rippleRate;

$(document).ready(function() {
  //////////////////////////////////
  //Add Bitcoin Wallet Button Clicked
  //////////////////////////////////

  $("#addBitcoinWallet").click(function() {
    $("#dialog").dialog({
      modal: true,
      width: 600,
      resizable: false,
      buttons: {
        "Add Account": function() {
          addBitcoinWallet($(".walletPublicKey").val());
          $(".walletPublicKey").val("");
          $(this).dialog("close");
        },
        Cancel: function() {
          $(".walletPublicKey").val("");
          $(this).dialog("close");
        }
      }
    });
  });

  //////////////////////////////////
  //Add Ethereum Wallet Button Clicked
  //////////////////////////////////

  $("#addEthereumWallet").click(function() {
    $("#dialog").dialog({
      modal: true,
      width: 600,
      resizable: false,
      buttons: {
        "Add Account": function() {
          addEthereumWallet($(".walletPublicKey").val());
          $(".walletPublicKey").val("");
          $(this).dialog("close");
        },
        Cancel: function() {
          $(".walletPublicKey").val("");
          $(this).dialog("close");
        }
      }
    });
  });

  //////////////////////////////////
  //Add Ripple Wallet Button Clicked
  //////////////////////////////////

  $("#addRippleWallet").click(function() {
    $("#dialog").dialog({
      modal: true,
      width: 600,
      resizable: false,
      buttons: {
        "Add Account": function() {
          addRippleWallet($(".walletPublicKey").val());
          $(".walletPublicKey").val("");
          $(this).dialog("close");
        },
        Cancel: function() {
          $(".walletPublicKey").val("");
          $(this).dialog("close");
        }
      }
    });
  });

  refreshTotalBal();

  getBitcoinExchangeRate().then(val => {
    bitcoinRate = val;
    $("#addBitcoinWallet .card-text").append(
      "<br>$" + Number(bitcoinRate).toFixed(2)
    );
  });
  getEthereumExchangeRate().then(val => {
    ethereumRate = val;
    $("#addEthereumWallet .card-text").append(
      "<br>$" + Number(ethereumRate).toFixed(2)
    );
  });
  getRippleExchangeRate().then(val => {
    rippleRate = val;
    $("#addRippleWallet .card-text").append(
      "<br>$" + Number(rippleRate).toFixed(2)
    );
  });

  function getBitcoinExchangeRate() {
    return new Promise(function(resolve, reject) {
      var btcURL = "https://api.cryptonator.com/api/full/btc-usd";
      $.getJSON(btcURL, function(json) {
        resolve(json.ticker.price);
      });
    });
  }

  function getEthereumExchangeRate() {
    return new Promise(function(resolve, reject) {
      var ethURL = "https://api.cryptonator.com/api/full/eth-usd";
      $.getJSON(ethURL, function(json) {
        resolve(json.ticker.price);
      });
    });
  }

  function getRippleExchangeRate() {
    return new Promise(function(resolve, reject) {
      var xrpURL = "https://api.cryptonator.com/api/full/xrp-usd";
      $.getJSON(xrpURL, function(json) {
        resolve(json.ticker.price);
      });
    });
  }

  //Clear saved wallets
  //localStorage.clear();

  /*
    //Example saved wallets
    localStorage.setItem("numSavedWallets", 2);
    
    localStorage.setItem("wallet0_type", "BTC");
    localStorage.setItem("wallet0_account", "1NDWqdmZczkvvfKRz3z9mQwyi46TooEp5A");
    
    localStorage.setItem("wallet1_type", "XRC");
    localStorage.setItem("wallet1_account", "rEaaL2rhur9XQhTizUo46Eq2WZxkkpRKiF");
    */

  var numSavedWallets = localStorage.getItem("numSavedWallets");

  if (numSavedWallets !== null) {
    //alert("Saved Wallets: " + numSavedWallets)
    for (var i = 0; i < numSavedWallets; i++) {
      var walletType = localStorage.getItem("wallet" + i + "_type");
      var walletAccount = localStorage.getItem("wallet" + i + "_account");
      //alert(walletType)
      //alert(walletAccount)

      if (walletType === "DELETED") {
      } else if (walletType === "BTC") {
        addBitcoinWallet(walletAccount);
      } else if (walletType === "ETH") {
        addEthereumWallet(walletAccount);
      } else if (walletType === "XRP") {
        addRippleWallet(walletAccount);
      }
    }
  }
});

function addBitcoinWallet(walletPublicKey) {
  var url =
    "https://api.blockcypher.com/v1/btc/main/addrs/" +
    walletPublicKey +
    "/balance";
  $.getJSON(url).then(function(json) {
    var walletCoins = json.balance / 100000000;

    var walletBalance = walletCoins * bitcoinRate;

    $("#wallets").append(
      "<div class='wallet' data-id=" +
        currentWalletId +
        " data-account=" +
        walletPublicKey +
        " data-balance=" +
        walletBalance +
        "><img class='wallet_icon' src='./images/bitcoin.png' alt='Bitcoin'><div class='wallet_account'>Account: " +
        walletPublicKey +
        "</div><div>Coins: " +
        Number(walletCoins).toFixed(2) +
        "</div><div class='wallet_balance'>USD: $" +
        Number(walletBalance).toFixed(2) +
        "</div><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close removeWalletButton' title='Remove'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div>"
    );

    wallets.push({
      id: currentWalletId,
      type: "bitcoin",
      account: walletPublicKey,
      balance: walletBalance
    });

    localStorage.setItem("wallet" + currentWalletId + "_type", "BTC");
    localStorage.setItem(
      "wallet" + currentWalletId + "_account",
      walletPublicKey
    );

    currentWalletId++;
    localStorage.setItem("numSavedWallets", currentWalletId);

    setClickFunctionForWalletDelete();

    refreshTotalBal();
  });
}

function addEthereumWallet(walletPublicKey) {
  var url =
    "https://api.blockcypher.com/v1/eth/main/addrs/" +
    walletPublicKey +
    "/balance";
  $.getJSON(url).then(function(json) {
    var walletCoins = json.balance / 1000000000000000000;

    var walletBalance = walletCoins * ethereumRate;

    $("#wallets").append(
      "<div class='wallet' data-id=" +
        currentWalletId +
        " data-account=" +
        walletPublicKey +
        " data-balance=" +
        walletBalance +
        "><img class='wallet_icon' src='./images/ethereum.png' alt='Bitcoin'><div class='wallet_account'>Account: " +
        walletPublicKey +
        "</div><div>Coins: " +
        Number(walletCoins).toFixed(2) +
        "</div><div class='wallet_balance'>USD: $" +
        Number(walletBalance).toFixed(2) +
        "</div><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close removeWalletButton' title='Remove'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div>"
    );

    wallets.push({
      id: currentWalletId,
      type: "ethereum",
      account: walletPublicKey,
      balance: walletBalance
    });

    localStorage.setItem("wallet" + currentWalletId + "_type", "ETH");
    localStorage.setItem(
      "wallet" + currentWalletId + "_account",
      walletPublicKey
    );

    currentWalletId++;
    localStorage.setItem("numSavedWallets", currentWalletId);

    setClickFunctionForWalletDelete();

    refreshTotalBal();
  });
}

function addRippleWallet(walletPublicKey) {
  var api = new ripple.RippleAPI({ server: "wss://s1.ripple.com/" });

  //const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'; //connect textbox to this

  api
    .connect()
    .then(function() {
      console.log("getting account info for", walletPublicKey);
      return api.getAccountInfo(walletPublicKey);
    })
    .then(function(account_info) {
      var walletCoins = account_info.xrpBalance;

      var walletBalance = walletCoins * rippleRate;

      $("#wallets").append(
        "<div class='wallet' data-id=" +
          currentWalletId +
          " data-account=" +
          walletPublicKey +
          " data-balance=" +
          walletBalance +
          "><img class='wallet_icon' src='./images/ripple.png' alt='Bitcoin'><div class='wallet_account'>Account: " +
          walletPublicKey +
          "</div><div>Coins: " +
          Number(walletCoins).toFixed(2) +
          "</div><div class='wallet_balance'>USD: $" +
          Number(walletBalance).toFixed(2) +
          "</div><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close removeWalletButton' title='Remove'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div>"
      );

      wallets.push({
        id: currentWalletId,
        type: "ripple",
        account: walletPublicKey,
        balance: walletBalance
      });

      localStorage.setItem("wallet" + currentWalletId + "_type", "XRP");
      localStorage.setItem(
        "wallet" + currentWalletId + "_account",
        walletPublicKey
      );

      currentWalletId++;
      localStorage.setItem("numSavedWallets", currentWalletId);

      setClickFunctionForWalletDelete();

      refreshTotalBal();
    })
    .then(() => {
      return api.disconnect();
    })
    .then(() => {
      console.log("done and disconnected.");
    })
    .catch(console.error);
}

function setClickFunctionForWalletDelete() {
  $(".removeWalletButton").click(function() {
    var id = $(this)
      .parent()
      .data("id");
    var acct = $(this)
      .parent()
      .data("account");
    var balance = $(this)
      .parent()
      .data("balance");

    wallets.forEach(function(wallet) {
      if (wallet.id === id) {
        var index = wallets.indexOf(wallet);
        wallets.splice(index, 1);
      }
    });

    localStorage.setItem("wallet" + id + "_type", "DELETED");

    $(this)
      .parent()
      .remove();
    refreshTotalBal();
  });
}

function refreshTotalBal() {
  var totalBal = 0;

  wallets.forEach(function(wallet) {
    totalBal += wallet.balance;
  });

  $("#totalBal").html(
    "<div class='wallet'>Total: $" + Number(totalBal).toFixed(2) + "</div>"
  );
}
