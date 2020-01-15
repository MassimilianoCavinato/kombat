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
    _this.angle = 0;
    _this.up = false;
    _this.down = false;
    _this.left = false;
    _this.down = false;
    _this.mouseIsDown = false;
    _this.controls = new _lanceGg.KeyboardControls(_assertThisInitialized(_this)); // restart game

    document.querySelector('#try-again').addEventListener('click', function () {
      window.location.reload();
    }); // show try-again button

    document.addEventListener('mouseenter', _this.updateAngle.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('mousemove', _this.updateAngle.bind(_assertThisInitialized(_this)), false);
    document.addEventListener('mousedown', function (e) {
      return _this.handleMouse(e);
    });
    document.addEventListener('mouseup', function (e) {
      return _this.handleMouse(e);
    });
    document.addEventListener('contextmenu', function (e) {
      return e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
      return _this.handleKeyDown(e);
    });
    document.addEventListener('keyup', function (e) {
      return _this.handleKeyUp(e);
    });

    _this.gameEngine.on('client__preStep', function (step) {
      return _this.preStep(step);
    });

    _this.gameEngine.on('objectDestroyed', function (obj) {
      if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
        document.querySelector('#try-again').style.display = "block";
      }
    });

    return _this;
  }

  _createClass(KombatClientEngine, [{
    key: "updateAngle",
    value: function updateAngle(e) {
      e.preventDefault();
      this.angle = Math.atan2(e.pageY - window.innerHeight / 2, e.pageX - window.innerWidth / 2);
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
        this.sendInput('step', {
          up: this.up,
          left: this.left,
          down: this.down,
          right: this.right,
          angle: this.angle
        });

        if (this.mouseIsDown === true) {
          this.sendInput("shoot", {
            repeat: true
          });
        }

        debugContainer.innerHTML = "\n            PlayerPos:\n            <br/> \n            X: ".concat(player.position.x, "\n            <br/> \n            Y: ").concat(player.position.y, "\n            <br/>\n            ----------------------------\n            <br/>\n            MousePos: \n            <br/> \n            X: ").concat(this.mouseX, "\n            <br/> \n            Y: ").concat(this.mouseY, "\n            <br/> \n            ----------------------------\n            <br/>\n            Angle: ").concat(this.angle, "\n            <br/>\n            ----------------------------\n            <br/>\n            Is shooting: ").concat(this.mouseIsDown ? "true" : "false", "\n            <br/>\n            ----------------------------\n            <br/>\n            Ammo: ").concat(player.ammo_loaded, "\n            <br/>\n            ----------------------------\n            <br/>\n            Is reloading: ").concat(player.ammo_loaded === 0 ? "true" : "false", "\n            <br/>\n            ----------------------------\n        ");
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.isTrusted === true) {
        if (e.key === "w" || e.key === "ArrowUp") {
          this.up = true;
        } else if (e.key === "a" || e.key === "ArrowLeft") {
          this.left = true;
        } else if (e.key === "s" || e.key === "ArrowDown") {
          this.down = true;
        } else if (e.key === "d" || e.key === "ArrowRight") {
          this.right = true;
        }
      }
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(e) {
      if (e.isTrusted === true) {
        if (e.key === "w" || e.key === "ArrowUp") {
          this.up = false;
        } else if (e.key === "a" || e.key === "ArrowLeft") {
          this.left = false;
        } else if (e.key === "s" || e.key === "ArrowDown") {
          this.down = false;
        } else if (e.key === "d" || e.key === "ArrowRight") {
          this.right = false;
        }
      }
    }
  }, {
    key: "handleMouse",
    value: function handleMouse(e) {
      e.preventDefault();

      if (e.isTrusted === true) {
        if (e.which === 1) {
          this.mouseIsDown = e.type === "mousedown";
        } else if (e.which === 3) {
          if (e.type === 'mousedown') {
            this.sendInput('throw_power', {
              repeat: false
            });
          }

          if (e.type === 'mouseup') {
            this.sendInput('granade', {
              repeat: false
            });
          }
        }
      }
    }
  }]);

  return KombatClientEngine;
}(_lanceGg.ClientEngine);

exports.default = KombatClientEngine;
//# sourceMappingURL=KombatClientEngine.js.map