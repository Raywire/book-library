const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookContoller');

function bookContoller(nav) {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, {
          useNewUrlParser: true, useUnifiedTopology: true
        });
        debug('connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('books');

        const books = await col.find().toArray();
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }
  function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url, {
          useNewUrlParser: true, useUnifiedTopology: true
        });
        debug('connected correctly to server');

        const db = client.db(dbName);
        const col = await db.collection('books');

        const book = await col.findOne({
          _id: new ObjectID(id)
        });

        debug(book);
        res.render(
          'bookView',
          {
            nav,
            title: 'Library',
            book
          }
        );
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function authMiddleware(req, res, next) {
    // You can add req.user.admin etc etc
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  // Revealing module pattern
  return {
    getIndex,
    getById,
    authMiddleware
  };
}

module.exports = bookContoller;
