"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _KombatRenderer = _interopRequireDefault(require("../client/KombatRenderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var KombatClientEngine =
/*#__PURE__*/
function (_ClientEngine) {
  _inherits(KombatClientEngine, _ClientEngine);

  function KombatClientEngine(gameEngine, options) {
    var _this;

    _classCallCheck(this, KombatClientEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatClientEngine).call(this, gameEngine, options, _KombatRenderer.default));
    _this.controls = new _lanceGg.KeyboardControls(_assertThisInitialized(_this));

    _this.controls.bindKey('w', 'up', {
      repeat: true
    });

    _this.controls.bindKey('s', 'down', {
      repeat: true
    });

    _this.controls.bindKey('a', 'left', {
      repeat: true
    });

    _this.controls.bindKey('d', 'right', {
      repeat: true
    });

    _this.mouseIsDown = false; // restart game

    document.querySelector('#try-again').addEventListener('click', function () {
      window.location.reload();
    }); // show try-again button

    gameEngine.on('objectDestroyed', function (obj) {
      if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
        document.querySelector('#try-again').style.display = "block";
      }
    });
    _this.mouseX = null;
    _this.mouseY = null;
    document.addEventListener('mouseenter', _this.updateMouseXY.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('mousemove', _this.updateMouseXY.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('mousedown', function () {
      return _this.mouseIsDown = true;
    });
    document.addEventListener('mouseup', function () {
      return _this.mouseIsDown = false;
    });

    _this.gameEngine.on('client__preStep', _this.preStep.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(KombatClientEngine, [{
    key: "updateMouseXY",
    value: function updateMouseXY(e) {
      e.preventDefault();
      this.mouseX = e.pageX - 400;
      this.mouseY = e.pageY - 300;
    }
  }, {
    key: "preStep",
    value: function preStep() {
      var debugContainer = document.getElementById('debug');
      var player = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId
      });

      if (player === null) {
        debugContainer.innerHTML = "";
      } else {
        if (this.mouseY) {
          var angle = Math.atan2(this.mouseY, this.mouseX);
          this.sendInput(angle, {
            movement: true
          });

          if (this.mouseIsDown === true) {
            this.sendInput("shoot", {
              repeat: true
            });
          }

          debugContainer.innerHTML = "\n                PlayerPos:\n                <br/> \n                X: ".concat(player.position.x, "\n                <br/> \n                Y: ").concat(player.position.y, "\n                <br/>\n                ----------------------------\n                <br/>\n                MousePos: \n                <br/> \n                X: ").concat(this.mouseX, "\n                <br/> \n                Y: ").concat(this.mouseY, "\n                <br/> \n                ----------------------------\n                <br/>\n                Angle: ").concat(angle, "\n                <br/>\n                ----------------------------\n                <br/>\n                IsShooting: ").concat(this.mouseIsDown ? "true" : "false", "\n                <br/>\n                ----------------------------\n            ");
        }
      }
    }
  }]);

  return KombatClientEngine;
}(_lanceGg.ClientEngine);

exports.default = KombatClientEngine;
//# sourceMappingURL=KombatClientEngine.js.map