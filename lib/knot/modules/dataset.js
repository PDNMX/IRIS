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

var _bson = require("bson");

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _serverHelpers = _interopRequireDefault(require("../../common/server-helpers"));

var _default = {
  dropCollection: function () {
    var _dropCollection = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(collectionName) {
      var knot;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return (0, _db["default"])();

            case 3:
              knot = _context.sent;
              _context.next = 6;
              return knot.collection(collectionName).drop();

            case 6:
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8]]);
    }));

    function dropCollection(_x) {
      return _dropCollection.apply(this, arguments);
    }

    return dropCollection;
  }(),
  deleteSchema: function () {
    var _deleteSchema = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2(knot, dataSet) {
      var schema;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return knot.collection('__schemas').deleteOne({
                _id: new _bson.ObjectId(dataSet.schema)
              });

            case 3:
              schema = _context2.sent;
              console.log('removed schema:', schema);
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));

    function deleteSchema(_x2, _x3) {
      return _deleteSchema.apply(this, arguments);
    }

    return deleteSchema;
  }(),
  destroyDocuments: function () {
    var _destroyDocuments = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(dataSet, user) {
      var knot, removedDocuments;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return (0, _db["default"])();

            case 3:
              knot = _context3.sent;
              _context3.next = 6;
              return knot.collection(dataSet.id).deleteMany({
                dataSetId: dataSet.id
              });

            case 6:
              removedDocuments = _context3.sent;
              console.log('removed documents:', removedDocuments);
              _context3.next = 10;
              return this.deleteSchema(knot, dataSet);

            case 10:
              _context3.next = 12;
              return this.dropCollection(dataSet.id);

            case 12:
              return _context3.abrupt("return", dataSet);

            case 15:
              _context3.prev = 15;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              throw new Error("Error deleting: schema: collection: ".concat(dataSet.id, " / schema: ").concat(dataSet.schema));

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 15]]);
    }));

    function destroyDocuments(_x4, _x5) {
      return _destroyDocuments.apply(this, arguments);
    }

    return destroyDocuments;
  }(),
  update: function () {
    var _update = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4(params) {
      var dataSetId, dataSet;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              dataSetId = params.dataSetId;
              _context4.next = 3;
              return _knotTypes.dataSetModel.findById(dataSetId);

            case 3:
              dataSet = _context4.sent;

              if (!dataSet) {
                _context4.next = 16;
                break;
              }

              _context4.prev = 5;
              _context4.next = 8;
              return (0, _requestPromise["default"])({
                method: 'POST',
                uri: 'http://localhost:8080/update',
                body: dataSet.get({
                  raw: true
                }),
                json: true
              });

            case 8:
              return _context4.abrupt("return", _context4.sent);

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](5);
              throw new Error('Error indexing data set load');

            case 14:
              _context4.next = 17;
              break;

            case 16:
              throw new Error("Can not find data set: ".concat(dataSetId));

            case 17:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[5, 11]]);
    }));

    function update(_x6) {
      return _update.apply(this, arguments);
    }

    return update;
  }(),
  destroyOrAdoptEntitiesAndKeys: function () {
    var _destroyOrAdoptEntitiesAndKeys = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee7(dataSet) {
      var entities, keys;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              console.log('start process for entities');
              _context7.next = 3;
              return dataSet.getEntities();

            case 3:
              entities = _context7.sent;
              console.log('processing', entities.length, 'entities');
              _context7.next = 7;
              return _serverHelpers["default"].sequence(entities.map(function (entity) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee5() {
                    var documents, document;
                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return entity.getDocuments({
                              where: {
                                dataSetId: {
                                  $ne: dataSet.id
                                }
                              },
                              order: [['createdAt', 'ASC']]
                            });

                          case 2:
                            documents = _context5.sent;

                            if (!(documents.length > 0)) {
                              _context5.next = 10;
                              break;
                            }

                            document = documents[0];
                            _context5.next = 7;
                            return entity.update({
                              genesis: document.id,
                              dataSetId: document.dataSetId,
                              loadId: document.loadId
                            });

                          case 7:
                            return _context5.abrupt("return", _context5.sent);

                          case 10:
                            _context5.next = 12;
                            return _serverHelpers["default"].promise(entity);

                          case 12:
                            return _context5.abrupt("return", _context5.sent);

                          case 13:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }))
                );
              }));

            case 7:
              console.log('process done!');
              console.log('start process for keys');
              _context7.next = 11;
              return dataSet.getKeys();

            case 11:
              keys = _context7.sent;
              console.log('processing', keys.length, 'keys');
              _context7.next = 15;
              return _serverHelpers["default"].sequence(keys.map(function (key) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee6() {
                    var documents, document;
                    return _regenerator["default"].wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            _context6.next = 2;
                            return key.getDocuments({
                              where: {
                                dataSetId: {
                                  $ne: dataSet.id
                                }
                              },
                              order: [['createdAt', 'ASC']]
                            });

                          case 2:
                            documents = _context6.sent;

                            if (!(documents.length > 0)) {
                              _context6.next = 10;
                              break;
                            }

                            document = documents[0];
                            _context6.next = 7;
                            return key.update({
                              genesis: document.id,
                              dataSetId: document.dataSetId,
                              loadId: document.loadId
                            });

                          case 7:
                            return _context6.abrupt("return", _context6.sent);

                          case 10:
                            _context6.next = 12;
                            return _serverHelpers["default"].promise(key);

                          case 12:
                            return _context6.abrupt("return", _context6.sent);

                          case 13:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }))
                );
              }));

            case 15:
              console.log('process done!');
              return _context7.abrupt("return", dataSet);

            case 17:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    function destroyOrAdoptEntitiesAndKeys(_x7) {
      return _destroyOrAdoptEntitiesAndKeys.apply(this, arguments);
    }

    return destroyOrAdoptEntitiesAndKeys;
  }()
};
exports["default"] = _default;