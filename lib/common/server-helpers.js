"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _babyparse = _interopRequireDefault(require("babyparse"));

var _lodash = _interopRequireDefault(require("lodash"));

var _base = _interopRequireDefault(require("base-64"));

var _utf = _interopRequireDefault(require("utf8"));

var transporter;

var Pipeline =
/*#__PURE__*/
function () {
  function Pipeline(handlers) {
    (0, _classCallCheck2["default"])(this, Pipeline);
    if (!handlers) this.handlers = [];else this.handlers = handlers;
  }

  (0, _createClass2["default"])(Pipeline, [{
    key: "use",
    value: function use(handler) {
      this.handlers.push(handler);
      return this;
    }
  }, {
    key: "start",
    value: function start(output) {
      var _this = this;

      if (!output) {
        output = {};
      }

      return new _bluebird["default"](function (resolve) {
        var index = 0;

        var next = function () {
          if (index === this.handlers.length || output.pass || !output.pass && !!output.required && output.required) {
            resolve(output);
          } else {
            var h = this.handlers[index++];
            h(output, next);
          }
        }.bind(_this);

        next();
      });
    }
  }]);
  return Pipeline;
}();

var _default = {
  isPositive: function isPositive(value) {
    if (parseInt(value) < 0) {
      throw new Error('Solo valores positivos son permitidos');
    }
  },
  isInRange: function isInRange(value, a, b) {
    var numValue = parseInt(value);

    if (!(numValue >= a && numValue <= b)) {
      throw new Error("El valor no est\xE1 dentro del rango [".concat(a, ", ").concat(b, "]"));
    }
  },
  minLength: function minLength(value, minLengthArg) {
    if (value.length < minLengthArg) {
      throw new Error("El tama\xF1o m\xEDnimo es de ".concat(minLengthArg, " car\xE1cteres"));
    }
  },
  maxLength: function maxLength(value, maxLengthArg) {
    if (value.length > maxLengthArg) {
      throw new Error("El tama\xF1o m\xE1ximo es de ".concat(maxLengthArg, " car\xE1cteres"));
    }
  },
  notStartsEndsWithBlanks: function notStartsEndsWithBlanks(value) {
    if (value.trim().length != value.length) {
      throw new Error("El campo no puede comenzar o terminar con caracteres en blanco");
    }
  },
  pipeline: function pipeline(handlers) {
    return new Pipeline(handlers).start();
  },
  sequence: function sequence(callbacks) {
    return new Pipeline(callbacks.map(function (cb) {
      return function (output, next) {
        cb().then(function (result) {
          output.pass = false;
          output.result.push(result);
          next();
        });
      };
    })).start({
      result: []
    });
  },
  sendEmail: function sendEmail(mailOptions, smtpConfig) {
    console.log('SMTP', smtpConfig);

    if (!transporter) {
      transporter = _nodemailer["default"].createTransport(smtpConfig);
    }

    return transporter.sendMail(mailOptions);
  },
  dataToCSV: function dataToCSV(data, fields) {
    if (data instanceof Array) {
      return _babyparse["default"].unparse(data.map(function (row) {
        var dict = {};

        _lodash["default"].map(row, function (r, n) {
          return dict[fields[n]] = r;
        });

        return dict;
      }), {
        quotes: true
      });
    }
  },
  csvToData: function csvToData(content) {
    var encoded = content.split(",").pop(),
        bytes = _base["default"].decode(encoded),
        text = _utf["default"].decode(bytes),
        parsedData = _babyparse["default"].parse(text, {
      header: true
    });

    return !!parsedData ? parsedData.data : undefined;
  },
  createInstances: function () {
    var _createInstances = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3(content, fields, parentId, registeredUser, createCallback) {
      var ignoreFields,
          table,
          rootId,
          _args3 = arguments;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              ignoreFields = _args3.length > 5 && _args3[5] !== undefined ? _args3[5] : false;
              table = this.csvToData(content), rootId = registeredUser.rootId;

              if (!ignoreFields) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt("return", this.sequence(table.map(function (instance) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee() {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return createCallback(rootId, instance, parentId, registeredUser);

                          case 3:
                            return _context.abrupt("return", _context.sent);

                          case 6:
                            _context.prev = 6;
                            _context.t0 = _context["catch"](0);
                            return _context.abrupt("return", instance);

                          case 9:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, null, [[0, 6]]);
                  }))
                );
              })));

            case 6:
              return _context3.abrupt("return", this.sequence(table.map(function (row) {
                return (
                  /*#__PURE__*/
                  (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee2() {
                    var instance;
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            instance = {};

                            _lodash["default"].map(row, function (c, n) {
                              return instance[fields[n]] = c;
                            });

                            _context2.prev = 2;
                            _context2.next = 5;
                            return createCallback(rootId, instance, parentId, registeredUser);

                          case 5:
                            return _context2.abrupt("return", _context2.sent);

                          case 8:
                            _context2.prev = 8;
                            _context2.t0 = _context2["catch"](2);
                            return _context2.abrupt("return", instance);

                          case 11:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, null, [[2, 8]]);
                  }))
                );
              })));

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function createInstances(_x, _x2, _x3, _x4, _x5) {
      return _createInstances.apply(this, arguments);
    }

    return createInstances;
  }(),
  promise: function promise(res) {
    return new _bluebird["default"](function (resolve) {
      return resolve(res);
    });
  },
  equal: function equal(a, b) {
    if (a != b) throw new Error("".concat(a, " no es igual a ").concat(b));
  },
  greater: function greater(a, b) {
    if (a <= b) throw new Error("".concat(a, " es menor igual a ").concat(b));
  },
  less: function less(a, b) {
    if (a >= b) throw new Error("".concat(a, " es mayor igual a ").concat(b));
  },
  greaterEqual: function greaterEqual(a, b) {
    if (a < b) throw new Error("".concat(a, " es menor a ").concat(b));
  },
  lessEqual: function lessEqual(a, b) {
    if (a > b) throw new Error("".concat(a, " es mayor a ").concat(b));
  },
  regexp: function regexp(value, re) {
    if (!(!(value !== null && value !== undefined) || value === '' || new RegExp(re).test(value))) {
      throw new Error("El campo no cumple el patr\xF3n [".concat(re, "]"));
    }
  }
};
exports["default"] = _default;