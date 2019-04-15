// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const { Datastore } = require('@google-cloud/datastore');
const Weatherapi = require('./weatherapi');
var express = require('express');

var schedule = require('node-schedule');
const router = express.Router();

// [START config]
const ds = new Datastore();
// [Datastore name]
const kind = "Weather";

// [Example => just return 1 row]
const query = ds.createQuery('Weather').limit(1);
//.filter('title', '=', '124');


var async = require('async');
// waterfall 會按照順序執行 function
// 而且可以傳參數

function runCreate() {
  console.log('===========use EachSeries Start===========');
  async.waterfall(
    [
      function (callback) {
        Weatherapi.get(function (err, dataA) {
          console.log('get Weather API data');
          callback(err, dataA);     //如果发生err， 则瀑布就完了，后续流程都不会执行，B和C都不会执行
        });
      },
      function (arg1, callback) {
        //Put data into google datastore
        addentity(arg1).catch(console.error);
        callback(null, arg1);
      },
    ],
    function (err, arg1) {
      if (err) {
        console.log('runCreate 處理錯誤!');
      }
      else {
        console.log('runCreate 處理成功！');
      }
    }
  );
}
//runCreate();

async function addentity(content) {

  const taskKey = ds.key([kind, new Date().toISOString().slice(0, 13)]);
  const weather = {
    key: taskKey,
    data: {
      content: content,
    },
  };

  // Saves the entity
  await ds.save(weather);
  console.log(`Saved ${weather.key.id}: ${weather.data}`);
}



router.get('/', (req, res, next) => {
  ds.runQuery(query).then(results => {
    // Task entities found.
    const tasks = results[0];

    console.log('Query Tasks:');
    //tasks.forEach(task => console.log(task));

    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });//设置response编码为utf-8
    res.end(JSON.stringify(tasks));


  });
});




//每小時的0分0秒執行一次
schedule.scheduleJob('0 0 * * * *', function () {
  runCreate();
  console.log('Get Data', new Date());

});


module.exports = router;
