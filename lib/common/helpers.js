"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _numeral = _interopRequireDefault(require("numeral"));

var _react = _interopRequireDefault(require("react"));

require("moment/locale/es-do");

var _moment = _interopRequireDefault(require("moment"));

var _pluralize = _interopRequireDefault(require("pluralize"));

String.prototype.capitalize = function () {
  return this.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};

String.prototype.plural = function () {
  return (0, _pluralize["default"])(this);
};

String.prototype.toWords = function () {
  return this.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
};

String.prototype.singular = function () {
  return (0, _pluralize["default"])(this, 1);
};

String.prototype.isPlural = function () {
  return this.charAt(this.length - 1).toLowerCase() === 's';
};

_moment["default"].locale('es-do');

var _default = {
  attachment: function attachment(value) {
    return _react["default"].createElement(Avatar, {
      src: value,
      size: 36
    });
  },
  units: function units(value, _ref) {
    var fractionDigits = _ref.fractionDigits,
        unit = _ref.unit;
    return "".concat(Number(value).toFixed(fractionDigits), " ").concat(unit);
  },
  wrapper: function wrapper(value) {
    return value;
  },
  getTZ: function getTZ() {
    return 'America/Mexico_City';
  },
  getRawValue: function getRawValue(value) {
    return value ? value : '';
  },
  createMarkup: function createMarkup(html) {
    return {
      __html: html
    };
  },
  hidden: function hidden(value) {
    var numChars = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

    var _char = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '&bull;';

    var text = Array(numChars).fill(_char).join('');
    return _react["default"].createElement("strong", {
      dangerouslySetInnerHTML: this.createMarkup(text)
    });
  },
  strong: function strong(value) {
    return _react["default"].createElement("strong", null, value);
  },
  upperCase: function upperCase(value) {
    return value.toUpperCase();
  },
  kilometers: function kilometers(value) {
    return "".concat((0, _numeral["default"])(value).format('0,0'), " kms");
  },
  capitalize: function capitalize(value) {
    return this.getRawValue(value).capitalize();
  },
  currentYear: function currentYear() {
    return (0, _moment["default"])().format('YYYY');
  },
  percentage: function percentage(value) {
    return "".concat(!!value ? value : '0', " %");
  },
  formattedDate: function formattedDate(value, _ref2) {
    var format = _ref2.format;
    return _moment["default"].tz(new Date(value), 'UTC').format(format);
  },
  formattedLocaleDate: function formattedLocaleDate(value, _ref3) {
    var format = _ref3.format;
    return (0, _moment["default"])(new Date(value)).format(format);
  },
  days: function days(value) {
    return "".concat(value, " d\xEDas");
  },
  formattedTime: function formattedTime(value) {
    return _moment["default"].tz(new Date(value), this.getTZ()).format('h:mm a');
  },
  time: function time(value) {
    return new Date(_moment["default"].tz(new Date(value), this.getTZ()));
  },
  dateFromSeconds: function dateFromSeconds(value) {
    return new Date((0, _moment["default"])().startOf('day').add(value, 'seconds'));
  },
  nextDay: function nextDay(value, _ref4) {
    var format = _ref4.format;
    return (0, _moment["default"])(new Date(value)).add(1, 'day').format(format);
  },
  booleanWord: function booleanWord(value) {
    return value == true ? 'Sí' : 'No';
  },
  currency: function currency(value) {
    return (0, _numeral["default"])(value).format('$0,0.00');
  },
  itemPrice: function itemPrice(instance, _ref5) {
    var price = _ref5.price,
        needPrice = _ref5.needPrice;
    return instance[needPrice] ? this.currency(instance[price]) : '';
  },
  mailTo: function mailTo(value) {
    return _react["default"].createElement("a", {
      href: "mailto:".concat(value),
      style: {
        textDecoration: "none",
        color: "#757575"
      }
    }, value);
  },
  avatar: function avatar(value) {
    return _react["default"].createElement(Avatar, {
      src: value
    });
  },
  coloredEnumBullet: function coloredEnumBullet(value, _ref6) {
    var enumValues = _ref6.enumValues;
    return _react["default"].createElement("span", {
      style: {
        verticalAlign: 'middle'
      }
    }, _react["default"].createElement(IconButton, {
      tooltip: this.getRawValue(value).capitalize(),
      tooltipPosition: "top-center"
    }, _react["default"].createElement(CircleIcon, {
      color: enumValues[value]
    })));
  },
  coloredEnumLabel: function coloredEnumLabel(value, _ref7) {
    var enumValues = _ref7.enumValues;
    return _react["default"].createElement("strong", {
      style: {
        color: enumValues[value]
      }
    }, this.getRawValue(value).capitalize());
  },
  colored: function colored(value, _ref8) {
    var color = _ref8.color;
    return _react["default"].createElement("span", {
      style: {
        color: color
      }
    }, value);
  },
  coloredCircle: function coloredCircle(value) {
    return _react["default"].createElement(CircleIcon, {
      color: value
    });
  },
  errorMessage: function errorMessage(message, cb) {
    return _react["default"].createElement(IconButton, {
      onTouchTap: cb
    }, !!message && message.length > 0 ? _react["default"].createElement(CircleIcon, {
      color: '#F44336'
    }) : _react["default"].createElement(CircleIcon, {
      color: '#4CAF50'
    }));
  },
  activeCircle: function activeCircle(value) {
    return value ? _react["default"].createElement(CircleIcon, {
      color: '#4CAF50'
    }) : _react["default"].createElement(CircleIcon, {
      color: '#F44336'
    });
  },
  alertCircle: function alertCircle(value) {
    return value ? _react["default"].createElement(CircleIcon, {
      color: '#F44336'
    }) : _react["default"].createElement(CircleIcon, {
      color: '#4CAF50'
    });
  },
  toWords: function toWords(value) {
    var result = '';

    if (value.length > 0) {
      result = this.getRawValue(value).capitalize().match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
    }

    return result;
  },
  namePrice: function namePrice(instance) {
    return "".concat(instance.name, " - ").concat(this.currency(instance.price));
  },
  menuItem: function menuItem(instance, _ref9) {
    var primaryText = _ref9.primaryText,
        secondaryText = _ref9.secondaryText;
    return _react["default"].createElement(MenuItem, {
      primaryText: instance[primaryText],
      secondaryText: instance[secondaryText]
    });
  },
  periodItem: function periodItem(instance, _ref10) {
    var startDate = _ref10.startDate,
        days = _ref10.days;
    return _react["default"].createElement(MenuItem, {
      primaryText: "".concat(this.formattedDate(instance[startDate], {
        format: 'YYYY-MM-DD'
      }), " / ").concat(instance[days], " d\xEDas")
    });
  },
  singleMenuItem: function singleMenuItem(instance, _ref11) {
    var primaryText = _ref11.primaryText;
    return _react["default"].createElement(MenuItem, {
      primaryText: instance[primaryText]
    });
  },
  namePriceMenuItem: function namePriceMenuItem(instance, _ref12) {
    var name = _ref12.name,
        price = _ref12.price,
        needPrice = _ref12.needPrice;
    return _react["default"].createElement(MenuItem, {
      primaryText: instance[name],
      secondaryText: this.itemPrice(instance, {
        needPrice: needPrice,
        price: price
      })
    });
  },
  namePricedMenuItem: function namePricedMenuItem(instance, _ref13) {
    var name = _ref13.name,
        price = _ref13.price;
    return _react["default"].createElement(MenuItem, {
      primaryText: instance[name],
      secondaryText: this.currency(instance[price])
    });
  },
  checkBoxListItem: function checkBoxListItem(instance, _ref14) {
    var primaryText = _ref14.primaryText,
        secondaryText = _ref14.secondaryText;
    return _react["default"].createElement(ListItem, {
      leftCheckbox: _react["default"].createElement(Checkbox, null),
      primaryText: instance[primaryText],
      secondaryText: instance[secondaryText]
    });
  },
  checkBoxListPriceItem: function checkBoxListPriceItem(instance, _ref15, handeItemSelection) {
    var name = _ref15.name,
        price = _ref15.price,
        needPrice = _ref15.needPrice;
    return _react["default"].createElement("div", null, _react["default"].createElement(ListItem, {
      key: instance.id,
      leftCheckbox: _react["default"].createElement(Checkbox, {
        onCheck: function onCheck(event, isInputChecked) {
          return handeItemSelection(event, isInputChecked, instance.id);
        }
      }),
      primaryText: instance[name],
      secondaryText: this.itemPrice(instance, {
        needPrice: needPrice,
        price: price
      })
    }), _react["default"].createElement(Divider, {
      inset: true
    }));
  },
  listPriceItem: function listPriceItem(instance, _ref16) {
    var name = _ref16.name,
        price = _ref16.price,
        needPrice = _ref16.needPrice;
    return _react["default"].createElement(ListItem, {
      key: instance.id,
      primaryText: instance[name],
      secondaryText: this.itemPrice(instance, {
        needPrice: needPrice,
        price: price
      }),
      disabled: true,
      style: {
        paddingTop: 4,
        paddingBottom: 4
      }
    });
  },
  listItem: function listItem(instance, _ref17) {
    var primaryText = _ref17.primaryText,
        secondaryText = _ref17.secondaryText;
    return _react["default"].createElement(ListItem, {
      key: instance.id,
      primaryText: instance[primaryText],
      secondaryText: instance[secondaryText],
      disabled: true,
      style: {
        paddingTop: 4,
        paddingBottom: 4
      }
    });
  },
  fullName: function fullName(instance, _ref18) {
    var firstName = _ref18.firstName,
        lastName = _ref18.lastName;
    return _react["default"].createElement("span", null, _react["default"].createElement("strong", null, instance[firstName]), instance[lastName]);
  },
  profileFullName: function profileFullName(profile) {
    return typeof profile != 'undefined' ? "".concat(profile.firstName.capitalize(), " ").concat(profile.lastName.capitalize()) : 'Sin perfil';
  },
  fieldValue: function fieldValue(modelName, fieldName, printAs) {
    var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var value = "".concat(prefix).concat(modelName, ".").concat(fieldName);

    if (printAs) {
      var args = printAs.args ? ", ".concat(JSON.stringify(printAs.args)) : '';
      value = "helpers.".concat(printAs.helper, "(").concat(prefix).concat(modelName, ".").concat(fieldName).concat(args, ")");
    }

    return value;
  },
  fieldViewValue: function fieldViewValue(viewName, modelName, fieldName, printAs) {
    var prefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var value = "".concat(viewName, ".").concat(prefix).concat(modelName, "_").concat(fieldName);

    if (printAs) {
      var args = printAs.args ? ", ".concat(JSON.stringify(printAs.args)) : '';
      value = "helpers.".concat(printAs.helper, "(").concat(viewName, ".").concat(prefix).concat(modelName, "_").concat(fieldName).concat(args, ")");
    }

    return value;
  },
  instanceValue: function instanceValue(model, modelName) {
    var result = "".concat(modelName, ".id");
    var printAs = model.printAs;

    if (printAs) {
      var args = printAs.args ? ", ".concat(JSON.stringify(printAs.args)) : '';
      result = "helpers.".concat(printAs.helper, "(").concat(modelName).concat(args, ")");
    }

    return result;
  },
  instanceCheckboxListItem: function instanceCheckboxListItem(model, modelName) {
    var result = "".concat(modelName, ".id");
    var printAs = model.printers.checkboxListItem;

    if (printAs) {
      var args = printAs.args ? ", ".concat(JSON.stringify(printAs.args)) : '';
      result = "helpers.".concat(printAs.helper, "(").concat(modelName).concat(args, ", this.handle").concat(modelName.capitalize(), "Selection)");
    }

    return result;
  },
  instanceListItem: function instanceListItem(model, modelName) {
    var result = "".concat(modelName, ".id");
    var printAs = model.printers.listItem;

    if (printAs) {
      var args = printAs.args ? ", ".concat(JSON.stringify(printAs.args)) : '';
      result = "helpers.".concat(printAs.helper, "(").concat(modelName).concat(args, ")");
    }

    return result;
  },
  onDate: function onDate(value) {
    return {
      $and: [{
        $gte: (0, _moment["default"])(new Date(value)).format('YYYY-MM-DD')
      }, {
        $lt: (0, _moment["default"])(new Date(value)).add(1, 'day').format('YYYY-MM-DD')
      }]
    };
  },
  printFirstN: function printFirstN(value, _ref19) {
    var n = _ref19.n;
    return "".concat(value.substring(0, n), " ...");
  }
};
exports["default"] = _default;