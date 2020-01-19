"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _KombatRenderer = _interopRequireDefault(require("../client/KombatRenderer"));

var _Kombat = _interopRequireDefault(require("../common/Kombat"));

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
    _this.controls = new _lanceGg.KeyboardControls(_assertThisInitialized(_this));
    _this.zoom = 10; //LISTENERS

    document.addEventListener('keydown', function (e) {
      return _this.handleKeyDown(e);
    });
    document.addEventListener('keyup', function (e) {
      return _this.handleKeyUp(e);
    });
    var GAME_CANVAS = document.getElementById('kc');
    GAME_CANVAS.width = 800;
    GAME_CANVAS.height = 600;
    GAME_CANVAS.addEventListener('mouseenter', function (e) {
      return _this.updateAngle(e);
    });
    GAME_CANVAS.addEventListener('mousemove', function (e) {
      return _this.updateAngle(e);
    });
    GAME_CANVAS.addEventListener('mousedown', function (e) {
      return _this.handleMouse(e);
    });
    GAME_CANVAS.addEventListener('mouseup', function (e) {
      return _this.handleMouse(e);
    });
    GAME_CANVAS.addEventListener('contextmenu', function (e) {
      return e.preventDefault();
    });
    var NI = document.getElementById('kombat-name');
    var PB = document.getElementById('kombat-play-button');
    NI.addEventListener('click', function (e) {
      NI.focus();
    });
    PB.addEventListener('click', function (e) {
      _this.sendInput('play', {
        repeat: false,
        playerId: _this.gameEngine.playerId,
        name: document.querySelector('#kombat-name').value
      });

      document.querySelector('#kombat-menu').style.display = "none";
    });

    _this.gameEngine.on('client__preStep', function () {
      return _this.preStep();
    });

    _this.gameEngine.on('objectDestroyed', function (obj) {
      if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
        document.querySelector('#kombat-menu').style.display = "block";
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
      var player = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId
      });

      if (player !== null) {
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
        } else if (e.key === "r") {
          this.sendInput('reload', {
            repeat: false
          });
        } else if (e.key === "f") {
          this.sendInput('pickup', {
            repeat: false
          });
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