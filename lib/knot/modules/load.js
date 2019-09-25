"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _knotTypes = require("../knot-types");

var _db = _interopRequireDefault(require("../db"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _serverHelpers = _interopRequireDefault(require("../../common/server-helpers"));

var _default = {
  destroyOrAdoptEntitiesAndKeys: function () {
    var _destroyOrAdoptEntitiesAndKeys = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(load) {
      var entities, keys;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log('start process for entities');
              _context3.next = 3;
              return load.getEntities();

            case 3:
              entities = _context3.sent;
              console.log('processing', entities.length, 'entities');
              _context3.next = 7;
              return _serverHelpers["default"].sequence(entities.map(function (entity) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee() {
                    var documents, document;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return entity.getDocuments({
                              where: {
                                loadId: {
                                  $ne: load.id
                                }
                              },
                              order: [['createdAt', 'ASC']]
                            });

                          case 2:
                            documents = _context.sent;

                            if (!(documents.length > 0)) {
                              _context.next = 10;
                              break;
                            }

                            document = documents[0];
                            _context.next = 7;
                            return entity.update({
                              genesis: document.id,
                              dataSetId: document.dataSetId,
                              loadId: document.loadId
                            });

                          case 7:
                            return _context.abrupt("return", _context.sent);

                          case 10:
                            _context.next = 12;
                            return entity.destroy();

                          case 12:
                            return _context.abrupt("return", _context.sent);

                          case 13:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }))
                );
              }));

            case 7:
              console.log('process done!');
              console.log('start process for keys');
              _context3.next = 11;
              return load.getKeys();

            case 11:
              keys = _context3.sent;
              console.log('processing', keys.length, 'keys');
              _context3.next = 15;
              return _serverHelpers["default"].sequence(keys.map(function (key) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee2() {
                    var documents, document;
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return key.getDocuments({
                              where: {
                                loadId: {
                                  $ne: load.id
                                }
                              },
                              order: [['createdAt', 'ASC']]
                            });

                          case 2:
                            documents = _context2.sent;

                            if (!(documents.length > 0)) {
                              _context2.next = 10;
                              break;
                            }

                            document = documents[0];
                            _context2.next = 7;
                            return key.update({
                              genesis: document.id,
                              dataSetId: document.dataSetId,
                              loadId: document.loadId
                            });

                          case 7:
                            return _context2.abrupt("return", _context2.sent);

                          case 10:
                            _context2.next = 12;
                            return key.destroy();

                          case 12:
                            return _context2.abrupt("return", _context2.sent);

                          case 13:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }))
                );
              }));

            case 15:
              console.log('process done!');
              return _context3.abrupt("return", load);

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    function destroyOrAdoptEntitiesAndKeys(_x) {
      return _destroyOrAdoptEntitiesAndKeys.apply(this, arguments);
    }

    return destroyOrAdoptEntitiesAndKeys;
  }(),
  destroyDocuments: function () {
    var _destroyDocuments = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4(load, user) {
      var knot, removed;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _db["default"])();

            case 2:
              knot = _context4.sent;
              _context4.next = 5;
              return knot.collection(load.dataSetId).deleteMany({
                dataSetId: load.dataSetId,
                loadId: load.id
              });

            case 5:
              removed = _context4.sent;
              console.log('removed:', removed);
              return _context4.abrupt("return", load);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function destroyDocuments(_x2, _x3) {
      return _destroyDocuments.apply(this, arguments);
    }

    return destroyDocuments;
  }(),
  index: function () {
    var _index = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5(params, user) {
      var dataSetId, loadId, load, loadData, result;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              dataSetId = params.dataSetId;
              loadId = params.loadId;
              _context5.next = 4;
              return _knotTypes.loadModel.findOne({
                where: {
                  id: loadId,
                  dataSetId: dataSetId
                },
                include: [{
                  model: _knotTypes.dataSetModel
                }]
              });

            case 4:
              load = _context5.sent;

              if (!load) {
                _context5.next = 23;
                break;
              }

              loadData = load.get({
                raw: true
              });
              _context5.next = 9;
              return _knotTypes.loadModel.updateLoad(loadId, {
                status: 'Indexando'
              }, user);

            case 9:
              _context5.prev = 9;
              _context5.next = 12;
              return (0, _requestPromise["default"])({
                method: 'POST',
                uri: 'http://localhost:8080/index',
                body: loadData,
                json: true
              });

            case 12:
              result = _context5.sent;
              _context5.next = 15;
              return _knotTypes.loadModel.updateLoad(loadId, {
                status: 'Indexado'
              }, user);

            case 15:
              return _context5.abrupt("return", loadData);

            case 18:
              _context5.prev = 18;
              _context5.t0 = _context5["catch"](9);
              throw new Error('Error indexing data set load');

            case 21:
              _context5.next = 24;
              break;

            case 23:
              throw new Error("Can't find load: ".concat(loadId));

            case 24:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[9, 18]]);
    }));

    function index(_x4, _x5) {
      return _index.apply(this, arguments);
    }

    return index;
  }(),
  relateAnalytics: function () {
    var _relateAnalytics = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee7(load, user) {
      var ds, analytics;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return load.getDataSet();

            case 2:
              ds = _context7.sent;
              _context7.next = 5;
              return ds.getAnalytics();

            case 5:
              analytics = _context7.sent;
              _context7.next = 8;
              return _serverHelpers["default"].sequence(analytics.map(function (analytic) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee6() {
                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            return _context6.abrupt("return", _knotTypes.loadModel.addAnalyticThatBelongsTo({
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
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }))
                );
              }));

            case 8:
              return _context7.abrupt("return", load);

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    function relateAnalytics(_x6, _x7) {
      return _relateAnalytics.apply(this, arguments);
    }

    return relateAnalytics;
  }()
};
exports["default"] = _default;