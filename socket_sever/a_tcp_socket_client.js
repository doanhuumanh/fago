// Import net module.
var net = require('net');

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName){

    var option = {
        host:'localhost',
        port: 6969
    }
    // Create TCP client.
    var client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        //console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        //console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    client.setTimeout(1000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        console.log('data : ' + data);
    });

    // When connection disconnected.
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        console.log('Client connection timeout. ');
    });

    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });

    return client;
}

function aes256_cipher(b)
{
    var crypto = require('crypto')
    , key = '1234567891234567'
    , plaintext = b
    , cipher = crypto.createCipher('aes-256-cbc', key)
    , decipher = crypto.createDecipher('aes-256-cbc', key);

    var encryptedPassword = cipher.update(b, 'utf8', 'base64');
    encryptedPassword += cipher.final('base64')
    //var decryptedPassword = decipher.update(b, 'base64', 'utf8');
    //decryptedPassword += decipher.final('utf8');
    return encryptedPassword;
    //  console.log('original  :', plaintext);
    //console.log('encrypted :', encryptedPassword);
    //  console.log('decrypted :', decryptedPassword);
}

    var javaClient = getConn('Java');
    var date = new Date();
    var hours = date.getHours();
    hours= hours < 10 ? '0'+hours : hours;
    var minutes = date.getMinutes();
    minutes= minutes < 10 ? '0'+minutes : minutes;
    var getSeconds = date.getSeconds();
    getSeconds= getSeconds < 10 ? '0'+getSeconds : getSeconds;
    var getFullYear = date.getFullYear();
    // do scrip lay tu 0 den 11
    var getMonth = date.getMonth()+1;
    getMonth = getMonth < 10 ? '0'+getMonth : getMonth;
    var getDate = date.getDate();
    getDate = getDate < 10 ? '0'+getDate : getDate;
    var x1 = Math.floor((Math.random() * 1001) + 1000) +'';
      var x2 = Math.floor((Math.random() * 1001) + 1000) +'';
    var times=getFullYear+getMonth + getDate+ hours + minutes + getSeconds;

    console.log('time : ' + times);
    var send=aes256_cipher(times+'"idtmp":"3432423423432","nd1":"33","nd2":"33","nd3":"33","nd4":"33","nd5":"33","nd6":"33","nd7":"33","nd8":"33","nd9":"33","nd10":"33","nd11":"33","nd12":"33","rl1":"0","rl2":"0","rl3":"0","rl4":"0","rl5":"0","rl6":"0","rl7":"0"');
    javaClient.write(x1+send);
