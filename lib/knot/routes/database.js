"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _knotTypes = require("../knot-types");

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var router = _express["default"].Router(),
    url = process.env.MONGO_URL;

var knot;

_mongodb.MongoClient.connect(url, {
  useNewUrlParser: true
}, function (err, client) {
  if (err) throw err;
  knot = client.db(process.env.MONGO_DB_NAME);
});

router.post('/:dataSetId/load',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var dataSetId, _req$body, documents, loadId, user, load, updatedDocuments, insertedDocuments, numberOfErrors, response, result, updatedLoad;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dataSetId = req.params.dataSetId;
            _req$body = req.body;
            documents = _req$body.documents;
            loadId = _req$body.loadId;
            user = (0, _knotTypes.getUserFromHeader)(req);
            _context.next = 7;
            return _knotTypes.loadModel.findById(loadId);

          case 7:
            load = _context.sent;

            if (!knot) {
              _context.next = 37;
              break;
            }

            if (!load) {
              _context.next = 34;
              break;
            }

            if (!documents) {
              _context.next = 31;
              break;
            }

            updatedDocuments = documents.map(function (d) {
              return (0, _objectSpread2["default"])({}, d, {
                loadId: loadId,
                dataSetId: dataSetId
              });
            });
            insertedDocuments = 0, numberOfErrors = 0;
            _context.prev = 13;
            _context.next = 16;
            return knot.collection(dataSetId).insertMany(updatedDocuments, {
              ordered: false
            });

          case 16:
            response = _context.sent;
            insertedDocuments = response.insertedCount;
            _context.next = 25;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](13);
            result = _context.t0.result;
            insertedDocuments = result.result.nInserted;
            numberOfErrors = result.result.writeErrors.length;

          case 25:
            _context.next = 27;
            return _knotTypes.loadModel.updateLoad(loadId, {
              total: load.total + insertedDocuments,
              insertedDocuments: load.insertedDocuments + insertedDocuments,
              numberOfErrors: load.numberOfErrors + numberOfErrors
            }, user);

          case 27:
            updatedLoad = _context.sent;
            res.json(updatedLoad);
            _context.next = 32;
            break;

          case 31:
            res.status(500).send('Documents not found!');

          case 32:
            _context.next = 35;
            break;

          case 34:
            res.status(500).send("Dataset ".concat(dataSetId, " not found!"));

          case 35:
            _context.next = 38;
            break;

          case 37:
            res.status(500).send('knot database not found!');

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[13, 20]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;