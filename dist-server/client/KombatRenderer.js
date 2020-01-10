"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Kombat = _interopRequireDefault(require("../common/Kombat"));

var _Bullet = _interopRequireDefault(require("../common/Bullet"));

var _Box = _interopRequireDefault(require("../common/Box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ctx = null;
var canvas = null;
var game = null;
var c = 0;
var C_WIDTH = 800;
var C_HEIGHT = 600;

var KombatRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(KombatRenderer, _Renderer);

  function KombatRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, KombatRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine;
    canvas = document.createElement('canvas');
    canvas.width = C_WIDTH;
    canvas.height = C_HEIGHT;
    document.body.insertBefore(canvas, document.getElementById('logo'));
    game.w = canvas.width;
    game.h = canvas.height;
    clientEngine.zoom = 15; // if (game.w / game.spaceWidth < clientEngine.zoom) clientEngine.zoom = game.w / game.spaceWidth;

    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2 / clientEngine.zoom;
    ctx.strokeStyle = 'white';
    ctx.fildlStyle = "red";
    _this.viewPort = new _lanceGg.TwoVector(0, 0);
    return _this;
  }

  _createClass(KombatRenderer, [{
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(KombatRenderer.prototype), "draw", this).call(this, t, dt);

      ctx.clearRect(0, 0, game.w, game.h);
      ctx.save();
      ctx.fillRect(0, 0, 800, 600);
      ctx.translate(0, 0);
      ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom); // Zoom in and flip y axis

      this.drawBounds();
      var playerKombat = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId,
        instanceType: _Kombat.default
      });

      if (playerKombat) {
        this.offsetX = C_WIDTH / 2 / this.clientEngine.zoom - playerKombat.position.x - playerKombat.width / 2;
        this.offsetY = C_HEIGHT / 2 / this.clientEngine.zoom - playerKombat.position.y - playerKombat.height / 2;
      }

      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Kombat.default) _this2.drawKombat(obj);else if (obj instanceof _Bullet.default) _this2.drawBullet(obj);else if (obj instanceof _Box.default) _this2.drawBox(obj.position.x, obj.position.y, obj.width, obj.height);
      }); // ctx.translate(game.w/2 - 2, game.h/2 - 2);

      ctx.restore();
    }
  }, {
    key: "drawKombat",
    value: function drawKombat(obj) {
      this.drawCircumscribedCircle(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width);
      this.drawBox(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width, obj.height);
    }
  }, {
    key: "drawBullet",
    value: function drawBullet(obj) {
      this.drawCircumscribedCircle(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width);
      this.drawBox(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width, obj.height);
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(x, y, r) {
      ctx.beginPath();
      ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawCircumscribedCircle",
    value: function drawCircumscribedCircle(x, y, l) {
      ctx.beginPath();
      ctx.arc(x + l / 2, y + l / 2, l * Math.SQRT2 / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawBox",
    value: function drawBox(x, y, w, h) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawBounds",
    value: function drawBounds() {
      ctx.strokeRect(0 + this.offsetX, 0 + this.offsetY, 30, 12);
    }
  }]);

  return KombatRenderer;
}(_lanceGg.Renderer);

exports.default = KombatRenderer;
//# sourceMappingURL=KombatRenderer.js.map