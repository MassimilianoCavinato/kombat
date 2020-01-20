"use strict";

var _queryString = _interopRequireDefault(require("query-string"));

var _lanceGg = require("lance-gg");

var _KombatClientEngine = _interopRequireDefault(require("../client/KombatClientEngine"));

var _KombatGameEngine = _interopRequireDefault(require("../common/KombatGameEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var qsOptions = _queryString.default.parse(location.search); // default options, overwritten by query-string options
// is sent to both game engine and client engine


var defaults = {
  traceLevel: _lanceGg.Lib.Trace.TRACE_NONE,
  delayInputCount: 2,
  scheduler: 'render-schedule',
  syncOptions: {
    sync: 'extrapolate',
    localObjBending: 0.9,
    remoteObjBending: 0.3,
    bendingIncrements: 1
  }
};
var options = Object.assign(defaults, qsOptions);
document.addEventListener('DOMContentLoaded', function (e) {
  var gameEngine = new _KombatGameEngine.default(options);
  var clientEngine = new _KombatClientEngine.default(gameEngine, options);

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    alert('mobile controllers not available');
  } else {
    clientEngine.start();
  }
});
//# sourceMappingURL=clientEntryPoint.js.map