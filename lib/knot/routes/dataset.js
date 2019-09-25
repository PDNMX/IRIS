"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

require('dotenv').config();

var router = _express["default"].Router(),
    url = process.env.MONGO_URL;

var knot;

_mongodb.MongoClient.connect(url, {
  useNewUrlParser: true
}, function (err, client) {
  if (err) throw err;
  knot = client.db(process.env.MONGO_DB_NAME);
});

router.post('/schemas',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var schema;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            schema = req.body;

            if (!knot) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return knot.collection('__schemas').insertOne(schema);

          case 4:
            res.json(schema);
            _context.next = 8;
            break;

          case 7:
            res.status(500).send('knot database not found!');

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/schemas/:schemaId',
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res) {
    var schemaId, id, schema;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            schemaId = req.params.schemaId;

            if (!knot) {
              _context2.next = 9;
              break;
            }

            id = new _mongodb.ObjectID(schemaId);
            _context2.next = 5;
            return knot.collection('__schemas').findOne({
              _id: id
            });

          case 5:
            schema = _context2.sent;
            res.json(schema);
            _context2.next = 10;
            break;

          case 9:
            res.status(500).send('knot database not found!');

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
router.post('/:dataSetId',
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res) {
    var dataSetId, selector, where, limit, skip, sort, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dataSetId = req.params.dataSetId, selector = req.body;

            if (!knot) {
              _context3.next = 54;
              break;
            }

            _context3.prev = 2;
            where = selector.where;
            limit = selector.limit;
            skip = selector.skip;
            sort = selector.sort;

            if (!limit) {
              _context3.next = 34;
              break;
            }

            if (!skip) {
              _context3.next = 21;
              break;
            }

            if (!sort) {
              _context3.next = 15;
              break;
            }

            _context3.next = 12;
            return knot.collection(dataSetId).find(where).sort(sort).skip(skip).limit(limit).toArray();

          case 12:
            _context3.t2 = _context3.sent;
            _context3.next = 18;
            break;

          case 15:
            _context3.next = 17;
            return knot.collection(dataSetId).find(where).skip(skip).limit(limit).toArray();

          case 17:
            _context3.t2 = _context3.sent;

          case 18:
            _context3.t1 = _context3.t2;
            _context3.next = 31;
            break;

          case 21:
            if (!sort) {
              _context3.next = 27;
              break;
            }

            _context3.next = 24;
            return knot.collection(dataSetId).find(where).sort(sort).limit(limit).toArray();

          case 24:
            _context3.t3 = _context3.sent;
            _context3.next = 30;
            break;

          case 27:
            _context3.next = 29;
            return knot.collection(dataSetId).find(where).limit(limit).toArray();

          case 29:
            _context3.t3 = _context3.sent;

          case 30:
            _context3.t1 = _context3.t3;

          case 31:
            _context3.t0 = _context3.t1;
            _context3.next = 44;
            break;

          case 34:
            if (!sort) {
              _context3.next = 40;
              break;
            }

            _context3.next = 37;
            return knot.collection(dataSetId).find(where).sort(sort).toArray();

          case 37:
            _context3.t4 = _context3.sent;
            _context3.next = 43;
            break;

          case 40:
            _context3.next = 42;
            return knot.collection(dataSetId).find(where).toArray();

          case 42:
            _context3.t4 = _context3.sent;

          case 43:
            _context3.t0 = _context3.t4;

          case 44:
            response = _context3.t0;
            res.json(response);
            _context3.next = 52;
            break;

          case 48:
            _context3.prev = 48;
            _context3.t5 = _context3["catch"](2);
            console.log(_context3.t5);
            res.status(500).send("Error working with mongo!");

          case 52:
            _context3.next = 55;
            break;

          case 54:
            res.status(500).send('knot database not found!');

          case 55:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 48]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/:dataSetId/aggregate',
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(req, res) {
    var dataSetId, aggregation, response;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            dataSetId = req.params.dataSetId, aggregation = req.body;

            if (!knot) {
              _context4.next = 15;
              break;
            }

            _context4.prev = 2;
            _context4.next = 5;
            return knot.collection(dataSetId).aggregate(aggregation).toArray();

          case 5:
            response = _context4.sent;
            res.json(response);
            _context4.next = 13;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            console.log(_context4.t0);
            res.status(500).send("Error aggregating ".concat(dataSetId, "!"));

          case 13:
            _context4.next = 16;
            break;

          case 15:
            res.status(500).send('knot database not found!');

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.post('/:dataSetId/count',
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(req, res) {
    var dataSetId, selector, where, limit, skip, response;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            dataSetId = req.params.dataSetId, selector = req.body;

            if (!knot) {
              _context5.next = 25;
              break;
            }

            where = selector.where;
            limit = selector.limit;
            skip = selector.skip;

            if (!limit) {
              _context5.next = 18;
              break;
            }

            if (!skip) {
              _context5.next = 12;
              break;
            }

            _context5.next = 9;
            return knot.collection(dataSetId).find(where).skip(skip).limit(limit).count();

          case 9:
            _context5.t1 = _context5.sent;
            _context5.next = 15;
            break;

          case 12:
            _context5.next = 14;
            return knot.collection(dataSetId).find(where).limit(limit).count();

          case 14:
            _context5.t1 = _context5.sent;

          case 15:
            _context5.t0 = _context5.t1;
            _context5.next = 21;
            break;

          case 18:
            _context5.next = 20;
            return knot.collection(dataSetId).find(where).count();

          case 20:
            _context5.t0 = _context5.sent;

          case 21:
            response = _context5.t0;
            res.json(response);
            _context5.next = 26;
            break;

          case 25:
            res.status(500).send('knot database not found!');

          case 26:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
module.exports = router;