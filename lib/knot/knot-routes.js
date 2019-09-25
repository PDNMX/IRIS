"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _knotTypes = require("./knot-types.js");

var router = _express["default"].Router();

router.post('/hubs/:hubId/logs', function (req, res) {
  res.json(_knotTypes.logModel.createLogThatBelongsTo(parseInt(req.params.hubId), req.body, parseInt(req.params.hubId), (0, _knotTypes.getUserFromHeader)(req)));
});
module.exports = router;