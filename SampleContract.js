function log(input) {
    if (typeof input === 'object') {
        input = JSON.stringify(input, null, 2);
    }
    $('#log').html(input + '\n' + $('#log').html());
}

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var eth = web3.eth

var SampleContractAbi = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"setX","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getSum","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"y","type":"uint256"}],"name":"setY","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"AddXY","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_x","type":"uint256"}],"name":"EventForSetX","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_x","type":"uint256"}],"name":"EventForSetY","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_sum","type":"uint256"}],"name":"EventForAddXY","type":"event"}];

var SampleContract = web3.eth.contract(SampleContractAbi);
var SampleContractAddress = '0xf5c9198836d80688a0b1c22ce3482d8fec7f9e3d';
var Sample = SampleContract.at(SampleContractAddress);

document.getElementById('files').addEventListener('change', openKeyFile, false);

alert('Finish getting SampleContract Instance');

contractControl(Sample, eth)

function contractControl(Sample, eth) {

    $('#addXY').on('click', function() {

        input_X = $('#data_X').val();
        input_Y = $('#data_Y').val();

        doAdd(Sample, eth, input_X, input_Y);

    })

    $('#getNonce').on('click', function() {

        getNonce(eth);

    })

    $('#rawTxn').on('click', function() {

        doRawTxn(eth);

    })

    $('#getSum').on('click', function() {

        getSum(Sample, eth);

    })

    $('#sendRawTxn_setX').on('click', function() {

        sendRawTxn_setX(Sample, eth);

    })

    $('#sendRawTxn_setY').on('click', function() {

        sendRawTxn_setY(Sample, eth);

    })

    $('#sendRawTxn_addXY').on('click', function() {

        sendRawTxn_addXY(Sample, eth);

    })

    $('#generateWallet').on('click', function() {

        generateSingleWallet();

    })

}

function doAdd(Sample, eth, input_X, input_Y) {

    var txHash = Sample.setX(input_X,{
        from: eth.accounts[0],
        gas: 600000
    }, function(err, txhash) {
        if (!err) {
            var theEvent = Sample.EventForSetX({
                from: eth.accounts[0],
            });
            theEvent.watch(function(err, event) {
                if (!err) {
                    alert('SetX 完成');
                    log(event);
                    theEvent.stopWatching();
                    setY(Sample, eth, input_Y);
                } else {
                    log(err);
                }
            });
        } else {
            log(err);
        }
    });
}

function setY(Sample, eth, input_Y) {

    var txHash = Sample.setY(input_Y,{
        from: eth.accounts[0],
        gas: 600000
    }, function(err, txhash) {
        if (!err) {
            var theEvent = Sample.EventForSetY({
                from: eth.accounts[0],
            });
            theEvent.watch(function(err, event) {
                if (!err) {
                    alert('SetY 完成');
                    log(event);
                    theEvent.stopWatching();
                    addXY(Sample, eth);
                } else {
                    log(err);
                }
            });
        } else {
            log(err);
        }
    });

}

function addXY(Sample, eth) {

    var txHash = Sample.AddXY({
        from: eth.accounts[0],
        gas: 600000
    }, function(err, txhash) {
        if (!err) {
            var theEvent = Sample.EventForAddXY({
                from: eth.accounts[0],
            });
            theEvent.watch(function(err, event) {
                if (!err) {
                    alert('AddXY 完成');
                    log(event);
                    theEvent.stopWatching();
                    var sum = Sample.getSum();
                    $('#data_Sum').val(sum);
                    alert("X+Y="+sum)
                } else {
                    log(err);
                }
            });
        } else {
            log(err);
        }
    });


}

function getNonce(eth) {
    var nonce = eth.getTransactionCount(eth.accounts[0]);
    alert("Nonce="+nonce);
    $('#data_Nonce').val(nonce);
}

function getSum(Sample, eth) {
    var sum = Sample.getSum();
    alert("Sum="+sum);
    $('#data_Sum').val(sum);
}

function sendRawTxn_setX(Sample, eth) {
    var tx_hash = eth.sendRawTransaction($('#txn_signed_setX').val()
        , function(err, txhash) {
            if (!err) {
                var theEvent = Sample.EventForSetX({
                    from: eth.accounts[0],
                });
                theEvent.watch(function(err, event) {
                    if (!err) {
                        alert('sendRawTxn SetX 完成');
                        log(event);
                        theEvent.stopWatching();
                    } else {
                        log(err);
                    }
                });
            } else {
                log(err);
            }
        }
    );
    //log("setX = "+tx_hash)
}

function sendRawTxn_setY(Sample, eth) {
    var tx_hash = eth.sendRawTransaction($('#txn_signed_setY').val()
        , function(err, txhash) {
            if (!err) {
                var theEvent = Sample.EventForSetY({
                    from: eth.accounts[0],
                });
                theEvent.watch(function(err, event) {
                    if (!err) {
                        alert('sendRawTxn SetY 完成');
                        log(event);
                        theEvent.stopWatching();
                        addXY(Sample, eth);
                    } else {
                        log(err);
                    }
                });
            } else {
                log(err);
            }
        }
    );
    //log("setY = "+tx_hash)
}

function sendRawTxn_addXY(Sample, eth) {
    var tx_hash = eth.sendRawTransaction($('#txn_signed_addXY').val(),
        function(err, txhash) {
        if (!err) {
            var theEvent = Sample.EventForAddXY({
                from: eth.accounts[0],
            });
            theEvent.watch(function(err, event) {
                if (!err) {
                    alert('AddXY 完成');
                    log(event);
                    theEvent.stopWatching();
                    var sum = Sample.getSum();
                    $('#data_Sum').val(sum);
                    alert("X+Y="+sum)
                } else {
                    log(err);
                }
            });
        } else {
            log(err);
        }
    });
    //log("addXY = "+tx_hash)
}

function openKeyFile(event) {

    const keythereum = require('keythereum')

    var files = event.target.files; // FileList object
    f = files[0];
    var reader = new FileReader();

    var JsonObj;

    reader.onload = (function(theFile) {
        return function(e) {

            var JsonObj = JSON.parse(e.target.result);

            var password = $('#inp_pass').val();

            if(password.length == 0) {
                alert("no password provided")
                throw new Error("no password provided");
                return
            }

            var privateKey = keythereum.recover(password, JsonObj)

            if(privateKey.length == 0) {
                alert("decrypt failed! input password might be wrong!")
                throw new Error("decrypt failed! input password might be wrong!");
                return
            }
            else {
                window.sessionStorage["private_key"] = privateKey;
                //alert(window.sessionStorage["private_key"])
                //alert("decrypt success!");
                //alert(privateKey.toString('base64'));
                //var publicKey = keythereum.privateKeyToAddress(privateKey);
                $('#showpubkey').val(keythereum.privateKeyToAddress(privateKey));
                $('#showprivkey').val(privateKey.toString('hex'));
            }

            //setTimeout(function() { alert("start decrypting .... "); }, 3000);

        };
    })(f);

    //log(JsonObj);

    reader.readAsText(f);


}



function doRawTxn(eth) {

    var nonce_1 = parseInt($('#data_Nonce').val());
    var nonce_1_hex = '0x'.concat(nonce_1.toString(16));

    var nonce_2 = nonce_1 + 1;
    var nonce_2_hex = '0x'.concat(nonce_2.toString(16));

    var nonce_3 = nonce_1 + 2;
    var nonce_3_hex = '0x'.concat(nonce_3.toString(16));

    //alert(nonce_1_hex)
    //alert(nonce_2_hex)
    //alert(nonce_3_hex)

    var x = $('#data_X').val();
    if(x>255) {
        alert("輸入需小於256")
        x=255;
        $('#data_X').val(255);
    }
    
    var x_hex = parseInt(x).toString(16);

    if(x_hex.length==1) {x_hex='0'.concat(x_hex)}

    var y = $('#data_Y').val();
    if(y>255) {
        alert("輸入需小於256")
        y=255;
        $('#data_Y').val(255);
    }
    
    var y_hex = parseInt(y).toString(16);
    if(y_hex.length==1) {y_hex='0'.concat(y_hex)}

    // '0x4018d9aa000000000000000000000000000000000000000000000000000000000000000b'
    var data_setX = '0x4018d9aa00000000000000000000000000000000000000000000000000000000000000'.concat(x_hex)
   // alert(data_setX)
    
    // '0x68d466b80000000000000000000000000000000000000000000000000000000000000001'
    var data_setY = '0x68d466b800000000000000000000000000000000000000000000000000000000000000'.concat(y_hex)
    //alert(data_setY)


    //const privateKey = Buffer.from('ad77af99b808cc9dabf93176539ab39cbafed65bd36debc3a9695813eaa9c750', 'hex')
    const privateKey = Buffer.from($('#showprivkey').val(), 'hex')
    if(privateKey.length == 0) {
        alert("no private key!!")
        throw new Error("no private key!!");
        return
    }
    alert("private key for signing txn :" + privateKey)

    /*** reproduce correct example */
    const Transaction = require("./index.js")

    const txParam_setX = {
        nonce: nonce_1_hex,
        gasPrice: '0x04e3b29200',
        gasLimit: '0x6de3',
        to: '0xf5c9198836d80688a0b1c22ce3482d8fec7f9e3d',
        value: '0x00',
        data: data_setX,
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 1
    }

    const txParam_setY = {
        nonce: nonce_2_hex,
        gasPrice: '0x04e3b29200',
        gasLimit: '0x6de3',
        to: '0xf5c9198836d80688a0b1c22ce3482d8fec7f9e3d',
        value: '0x00',
        data: data_setY,
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 1
    }

    const txParam_addXY = {
        nonce: nonce_3_hex,
        gasPrice: '0x04e3b29200',
        gasLimit: '0x6de3',
        to: '0xf5c9198836d80688a0b1c22ce3482d8fec7f9e3d',
        value: '0x00',
        data: '0xf80d2ba1',
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 1
    }

    $('#txn_parm_setX').val(JSON.stringify(txParam_setX));
    $('#txn_parm_setY').val(JSON.stringify(txParam_setY));
    $('#txn_parm_addXY').val(JSON.stringify(txParam_addXY));

    const tx1 = new Transaction(txParam_setX);
    tx1.sign(privateKey);
    const serializedTx1 = tx1.serialize();

    const tx2 = new Transaction(txParam_setY);
    tx2.sign(privateKey);
    const serializedTx2 = tx2.serialize();
 
    const tx3 = new Transaction(txParam_addXY);
    tx3.sign(privateKey);
    const serializedTx3 = tx3.serialize();

    $('#txn_signed_setX').val('0x'.concat(serializedTx1.toString("hex")));
    $('#txn_signed_setY').val('0x'.concat(serializedTx2.toString("hex")));
    $('#txn_signed_addXY').val('0x'.concat(serializedTx3.toString("hex")));


    //alert(serializedTx.toString("hex"));
}

function generateSingleWallet() {

    const keythereum = require("keythereum");

    var params = { keyBytes: 32, ivBytes: 16 };

    // synchronous generate a random private key
    var dk = keythereum.create(params);

    var password = $('#inp_pass2').val();
    if(password.length < 6) {
        alert("need at least 6 characters for a password")
        throw new Error("password length too short");
        return;
    }

    var kdf = "pbkdf2"; // or "scrypt" to use the scrypt kdf

    // Note: if options is unspecified, the values in keythereum.constants are used.
    var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };

    var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options);


    $('#show_wallet').val(JSON.stringify(keyObject));

    var privKey = dk.privateKey;

    $('#showprivkey2').val( privKey.toString('hex'));

    //keythereum.exportToFile(keyObject);
}
