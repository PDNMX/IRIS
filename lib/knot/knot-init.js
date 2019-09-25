"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _knotTypes = require("./knot-types");

var maker = {
  id: 1,
  ownerId: 0,
  rootId: 1,
  role: 'maker'
};

var _default = function _default() {
  return (0, _knotTypes.syncDataBase)().then(function () {
    _knotTypes.hubModel.createHub({
      name: 'KNOT_HUB',
      rootId: 1
    }, maker).then(function (hub) {
      var adminData = {
        firstName: 'AntenaLabs',
        lastName: 'Company',
        email: 'info@antenalabs.com',
        password: '123abc',
        role: 'admin',
        active: true
      },
          rootId = hub.id;
      console.log('start knot');

      _knotTypes.userModel.createUserThatBelongsTo(rootId, adminData, hub.id, maker).then(function (admin) {
        (0, _knotTypes.authenticateApplicationUser)({
          email: admin.email,
          password: '123abc'
        }).then(function () {
          console.log('init done');
          [{
            'id': 'compranet',
            'name': 'CompraNet'
          }].map(function (source) {
            return _knotTypes.sourceModel.createSourceThatBelongsTo(admin.rootId, source, hub.id, admin);
          });
        });
      });
    });
  });
};

exports["default"] = _default;