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
// [START config]
const ds = new Datastore();

const query = ds.createQuery('Weather')
  .filter('title', '=', '124');

// [Datastore name]
const kind = "Weather";

ds.runQuery(query).then(results => {
  // Task entities found.
  const tasks = results[0];

  console.log('Tasks:');
  tasks.forEach(task => console.log(task));
});

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
runCreate();

async function addentity(content) {

  const taskKey = ds.key([kind]);
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

//addentity().catch(console.error);

// model.create(mdata, (err, msavedData) => {
//   if (err) {
//     next(err);
//     return;
//   }
//   console.log("msavedData");
//   console.log(msavedData);
// });

// // Automatically parse request body as form data
// router.use(bodyParser.urlencoded({extended: false}));

// // Set Content-Type for all responses for these routes
// router.use((req, res, next) => {
//   res.set('Content-Type', 'text/html');
//   next();
// });

// /**
//  * GET /books
//  *
//  * Display a page of books (up to ten at a time).
//  */

// const mdata = {

//   title: "a",
// }

// router.get('/', (req, res, next) => {
//   model.list(10, mdata , (err, entities, cursor) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     //req.query.pageToken
//     console.log("router.get");
//     console.log(req.query);
//     console.log(entities);
//     console.log(cursor);

//     // model.create(mdata, (err, msavedData) => {
//     //   if (err) {
//     //     next(err);
//     //     return;
//     //   }    
//     //   console.log("msavedData");
//     //   console.log(msavedData);
//     // });

//     res.render('books/list.pug', {
//       books: entities,
//       nextPageToken: cursor,
//     });


//   });
// });

// /**
//  * GET /books/add
//  *
//  * Display a form for creating a book.
//  */
// // [START add_get]
// router.get('/add', (req, res) => {
//   console.log("router add page");
//   res.render('books/form.pug', {
//     book: {},
//     action: 'Add',
//   });
// });
// // [END add_get]

// /**
//  * POST /books/add
//  *
//  * Create a book.
//  */
// // [START add_post]
// router.post('/add', (req, res, next) => {
//   const data = req.body;
//   console.log("add save");
//   // Save the data to the database.



//   model.create(data, (err, savedData) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     console.log("data:");
//     console.log(data);
//     // console.log("savedData:");
//     // console.log(savedData);
//     res.redirect(`${req.baseUrl}/${savedData.id}`);
//   });
// });
// // [END add_post]

// /**
//  * GET /books/:id/edit
//  *
//  * Display a book for editing.
//  */
// router.get('/:book/edit', (req, res, next) => {
//   model.read(req.params.book, (err, entity) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     console.log(req.params.book);
//     res.render('books/form.pug', {
//       book: entity,
//       action: 'Edit',
//     });
//   });
// });

// /**
//  * POST /books/:id/edit
//  *
//  * Update a book.
//  */
// router.post('/:book/edit', (req, res, next) => {
//   const data = req.body;

//   model.update(req.params.book, data, (err, savedData) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.redirect(`${req.baseUrl}/${savedData.id}`);
//   });
// });

// /**
//  * GET /books/:id
//  *
//  * Display a book.
//  */
// router.get('/:book', (req, res, next) => {
//   model.read(req.params.book, (err, entity) => {
//     if (err) {
//       next(err);
//       return;
//     }

//     res.render('books/view.pug', {
//       book: entity,
//     });
//     //  res.render('books/index.html', {
//     //   books: entities,     
//     // });
//   });
// });

// /**
//  * GET /books/:id/delete
//  *
//  * Delete a book.
//  */
// router.get('/:book/delete', (req, res, next) => {
//   model.delete(req.params.book, err => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.redirect(req.baseUrl);
//   });
// });

// /**
//  * Errors on "/books/*" routes.
//  */
// router.use((err, req, res, next) => {
//   // Format error and forward to generic error handler for logging and
//   // responding to the request
//   err.response = err.message;
//   next(err);
// });

// module.exports = router;
