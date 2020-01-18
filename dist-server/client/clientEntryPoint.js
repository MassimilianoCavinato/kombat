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
  delayInputCount: 10,
  scheduler: 'render-schedule',
  syncOptions: {
    sync: 'extrapolate',
    localObjBending: 0.6,
    remoteObjBending: 0.8,
    bendingIncrements: 6
  }
};
var options = Object.assign(defaults, qsOptions);
var gameEngine = new _KombatGameEngine.default(options);
;
var clientEngine = null;
document.addEventListener('DOMContentLoaded', function (e) {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    alert('mobile controllers not available');
  } else {
    var NI = document.getElementById('kombat-name');
    NI.addEventListener('click', function (e) {
      NI.focus();
    });
    var PB = document.getElementById('kombat-play-button');
    PB.addEventListener('click', function (e) {
      var kc = document.getElementById('kc');

      if (kc) {
        kc.remove();
      }

      var canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'kc');
      canvas.width = 800;
      canvas.height = 600;
      document.body.appendChild(canvas);
      clientEngine = new _KombatClientEngine.default(gameEngine, options);
      document.querySelector('#kombat-menu').style.display = "none";
      clientEngine.start();
    });
  }
});
//# sourceMappingURL=clientEntryPoint.js.map