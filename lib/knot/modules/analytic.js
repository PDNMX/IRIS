"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _serverHelpers = _interopRequireDefault(require("../../common/server-helpers"));

var _knotTypes = require("../knot-types");

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _default = {
  relateLoads: function () {
    var _relateLoads = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(analytic, user) {
      var ds, loads;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return analytic.getDataSet();

            case 2:
              ds = _context2.sent;
              _context2.next = 5;
              return ds.getLoads();

            case 5:
              loads = _context2.sent;
              _context2.next = 8;
              return _serverHelpers["default"].sequence(loads.map(function (load) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee() {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            return _context.abrupt("return", _knotTypes.loadModel.addAnalyticThatBelongsTo({
                              analytic: analytic.id,
                              analyticLoad: {
                                status: 'Listo',
                                executionTime: 0,
                                numberOfOutputs: 0,
                                numberOfErrors: 0
                              }
                            }, load.id, user));

                          case 1:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }))
                );
              }));

            case 8:
              return _context2.abrupt("return", analytic);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function relateLoads(_x, _x2) {
      return _relateLoads.apply(this, arguments);
    }

    return relateLoads;
  }(),
  run: function () {
    var _run = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(params, user) {
      var analyticId, loadId, load, analytic;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              analyticId = params.analyticId;
              loadId = params.loadId;
              _context3.next = 4;
              return _knotTypes.loadModel.findOne({
                where: {
                  id: loadId
                },
                include: [{
                  model: _knotTypes.dataSetModel
                }]
              });

            case 4:
              load = _context3.sent;
              _context3.next = 7;
              return _knotTypes.analyticModel.findById(analyticId);

            case 7:
              analytic = _context3.sent;

              if (!(!!load && !!analytic)) {
                _context3.next = 20;
                break;
              }

              _context3.prev = 9;
              _context3.next = 12;
              return _knotTypes.loadModel.addAnalyticThatBelongsTo({
                analytic: analytic.id,
                analyticLoad: {
                  status: 'Ejecutando'
                }
              }, load.id, user);

            case 12:
              (0, _requestPromise["default"])({
                method: 'POST',
                uri: 'http://localhost:8080/run',
                body: {
                  load: load.get({
                    raw: true
                  }),
                  analytic: analytic.get({
                    raw: true
                  })
                },
                json: true
              });
              return _context3.abrupt("return", analytic);

            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3["catch"](9);
              console.log(_context3.t0);
              throw new Error('Error indexing data set load');

            case 20:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[9, 16]]);
    }));

    function run(_x3, _x4) {
      return _run.apply(this, arguments);
    }

    return run;
  }()
};
exports["default"] = _default;