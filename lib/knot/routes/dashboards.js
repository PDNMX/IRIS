"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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

router.get('/:dashboardId',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var dashboardId, id, dashboard;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dashboardId = req.params.dashboardId;

            if (!knot) {
              _context.next = 9;
              break;
            }

            id = new _mongodb.ObjectID(dashboardId);
            _context.next = 5;
            return knot.collection('__dashboards').findOne({
              _id: id
            });

          case 5:
            dashboard = _context.sent;
            res.json(dashboard);
            _context.next = 10;
            break;

          case 9:
            res.status(500).send('knot database not found!');

          case 10:
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
module.exports = router;