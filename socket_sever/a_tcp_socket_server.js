var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;

// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(function(client) {
  //  console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);
//  console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
  console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    client.setEncoding('utf-8');
    client.setTimeout(100);
    // When receive client data.
    client.on('data', function (data) {
        // Print received client data and length.
      //  console.log('data: ' + data + ', size : ' + client.bytesRead);

        data=  data.substring(4, data.length);
        var decipher=aes256_decipher(data);

        var time_data=decipher.substring(0, 14);
        var decipher='{'+ decipher.substring(14, decipher.length)+'}';
      //  console.log('time_data: ' + time_data);
        console.log('varend: ' + decipher);
        var time_sever= gettime_sever();
      //  console.log('time_sever : ' +time_sever);

          if(time_data==time_sever) {

          try {
                var obj = JSON.parse(decipher);
                 insert_sever(obj);
                   console.log('QKIS: OK,1, size');
                client.end('OK,1, size : ' + client.bytesRead);

          } catch (e) {
              console.log('QKIS:'+e);
              client.end('OK,0, size : ' + client.bytesRead);
          }

          }
          else {
             console.log('QKIS: NO,0, size');
              client.end('NO,0, size : ' + client.bytesRead);
          }
        // Server send data back to client use client net.Socket object.
    });
    // When client send data complete.
        client.on('end', function () {
            console.log('Client disconnect.');
            // Get current connections count.
            server.getConnections(function (err, count) {
                if(!err)
                {
                    // Print current connection count in server console.
                  //  console.log("There are %d connections now. ", count);
                }else
                {
                    console.error(JSON.stringify(err));
                }

            });
        });

    // When client timeout.
    client.on('timeout', function () {
        console.log('Client request time out. ');
    })
});


function aes256_decipher(b)
{
  try{
    var crypto = require('crypto')
    , key = '1234567891234567'
    , plaintext = b
    , cipher = crypto.createCipher('aes-256-cbc', key)
    , decipher = crypto.createDecipher('aes-256-cbc', key);

    //  var encryptedPassword = cipher.update(b, 'utf8', 'base64');
    //  encryptedPassword += cipher.final('base64')

    var decryptedPassword = decipher.update(b, 'base64', 'utf8');
    decryptedPassword += decipher.final('utf8');
    return decryptedPassword;
    //  console.log('original  :', plaintext);
    //console.log('encrypted :', encryptedPassword);
    //  console.log('decrypted :', decryptedPassword);
  }
  catch(err) {
  return '';
}
}
function gettime_sever()
{
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
return times;

}



// Make the server a TCP server listening on port 9999.
server.listen(PORT, HOST, function () {

      // Get server address info.
      var serverInfo = server.address();
      var serverInfoJson = JSON.stringify(serverInfo);
      //  console.log('TCP server : ' + serverInfoJson);
      console.log('TCP server ' + HOST +':'+ PORT);
      server.on('close', function () {
      console.log('TCP server socket is closed.');
      });
      server.on('error', function (error) {
      console.error(JSON.stringify(error));
      });

});

function insert_sever(obj)
{
  //lets require/import the mongodb native drivers.
  var mongodb = require('mongodb');
  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;
  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://localhost:27017';

  // Use connect method to connect to the Server
  MongoClient.connect(url,{ useNewUrlParser: true },function(err,client){
      if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
      }
      else
      {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);
  try {
      var db = client.db('demo');
      // Get the documents collection
      var collection = db.collection('log');
      //Create some document
      //var smartjob1 = {city: 'smartjob.vn', pop: 1242, state: 'MA', loc: [-72.936114, -72.936114]};
    //  var smartjob1 ={idtmp:3432423423432,nd1:33,nd2:33,nd3:33,nd4:33,nd5:33,nd6:33,nd7:33,nd8:33,nd9:33,nd10:33,nd11:33,nd12:33,rl1:0,rl2:0,rl3:0,rl4:0,rl5:0,rl6:0,rl7:0};
      // Insert some users
      collection.insert([obj], function (err, result) {
      //  console.log("insert_:"+err);
      //console.log('kq1:',err);
      //  if (err || err==null) {
      console.log("insert:"+err);
      // } else {
      //        console.log("insert_notok");
      // console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      //  }

        client.close();

      });
    } catch (e) {
    }
  }
  });

}
