$(document).ready(function(){
   
    $( "#accordion" ).accordion({
      collapsible: true
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
    }) 
        
    
    
    
    
    
});


function addRippleWallet (walletPublicKey) {
    console.log(ripple);
    var api = new ripple.RippleAPI({server:'wss://s1.ripple.com/'});
    
    //const myAddress = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'; //connect textbox to this
    var myAddress = walletPublicKey;
    
    api.connect().then(function() {
        
        console.log('getting account info for', myAddress);
        return api.getAccountInfo(myAddress);
        
    }).then(function(account_info) {
        /*document.body.innerHTML += "<p>Connected to rippled server!</p>" +
        "      <div>" +
        "        <h3>XRP Account: " + myAddress + "</h3>" +
        "          </div><div>Balance: " + account_info.xrpBalance + //command to retrieve xrp balance from myAddress
        "      </div>";*/
        
        $('body').append ("<p>Connected to rippled server!</p>" +
        "      <div>" +
        "        <h3>XRP Account: " + myAddress + "</h3>" +
        "          </div><div>Balance: " + account_info.xrpBalance + //command to retrieve xrp balance from myAddress
        "      </div>");
    }).then(() => {
        return api.disconnect();
    }).then(() => {
        console.log('done and disconnected.');
    }).catch(console.error);

}