// require nodeJS 內建 http 模組.
var http = require("http");

//var url = 'http://graph.facebook.com/517267866/?fields=picture';
var apikey = 'CWB-7670A6DA-3D26-410D-870C-C7D39A47955D';
var dataid = 'F-C0032-001'
var url = 'http://opendata.cwb.gov.tw/api/v1/rest/datastore/'+dataid+'?Authorization='+apikey;//'&format=JSON'

var request = require("request");

request.get({
    "headers": { "content-type": "application/json" },
    "url": url
    // "body": JSON.stringify({
    //     "firstname": "Nic",
    //     "lastname": "Raboy"
    // })
}, (error, response, body) => {
    if(error) {     
        return console.dir(error);
    }  
    console.log(JSON.parse(body));
});