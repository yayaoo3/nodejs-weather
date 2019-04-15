// require nodeJS 內建 http 模組.
var http = require("http");
const { URL } = require('url');

var apikey = 'CWB-7670A6DA-3D26-410D-870C-C7D39A47955D';
var dataid = 'F-C0032-001'
var url = new URL('http://opendata.cwb.gov.tw/api/v1/rest/datastore/' + dataid + '?Authorization=' + apikey + '&locationName=臺北市');//'&format=JSON'

var request = require("request");
function get(cb) {
    request.get({
        "headers": { "content-type": "application/json" },
        "url": url
        // "body": JSON.stringify({
        //     "firstname": "Nic",

        //     "lastname": "Raboy"
        // })    
    }, (error, response, body) => {
        if (error) {
            console.dir(error);
            cb(false,null);
        }
        var pdata = JSON.parse(body);
       
        // console.log(pdata.records.location[0].weatherElement);
        cb(null,pdata.records.location[0].weatherElement);
       
    });
    
}

// [START exports]
module.exports = {
    get,

};
  // [END exports]
