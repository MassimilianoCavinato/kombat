"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Kombat = _interopRequireDefault(require("../common/Kombat"));

var _Bullet = _interopRequireDefault(require("../common/Bullet"));

var _Granade = _interopRequireDefault(require("../common/Granade"));

var _Wall = _interopRequireDefault(require("../common/Wall"));

var _Blood = _interopRequireDefault(require("../common/Blood"));

var _Explosion = _interopRequireDefault(require("../common/Explosion2"));

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
    canvas.setAttribute('id', 'kc');
    canvas.width = C_WIDTH;
    canvas.height = C_HEIGHT;
    document.body.appendChild(canvas);
    clientEngine.zoom = 10;
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 3 / clientEngine.zoom;
    _this.offset = new _lanceGg.TwoVector(0, 0);
    return _this;
  }

  _createClass(KombatRenderer, [{
    key: "setOffset",
    value: function setOffset(playerKombat) {
      var c = document.getElementById('kc');
      this.offset.x = C_WIDTH / 2 / this.clientEngine.zoom - playerKombat.position.x - playerKombat.width / 2;
      this.offset.y = C_HEIGHT / 2 / this.clientEngine.zoom - playerKombat.position.y - playerKombat.height / 2;
    }
  }, {
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(KombatRenderer.prototype), "draw", this).call(this, t, dt);

      this.resetRender();
      var playerKombat = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId,
        instanceType: _Kombat.default
      });

      if (playerKombat) {
        this.setOffset(playerKombat); //draw blood stains first // layer 0

        game.world.queryObjects({
          instanceType: _Blood.default
        }).forEach(function (obj) {
          _this2.drawBlood(obj);
        });
        game.world.forEachObject(function (id, obj) {
          if (obj instanceof _Kombat.default) _this2.drawKombat(obj);else if (obj instanceof _Bullet.default) _this2.drawBullet(obj);else if (obj instanceof _Granade.default) _this2.drawGranade(obj);else if (obj instanceof _Wall.default) _this2.drawWall(obj);else if (obj instanceof _Explosion.default) _this2.drawExplosion(obj);
        });
        this.drawHUD(playerKombat);
      }

      ctx.restore();
    }
  }, {
    key: "resetRender",
    value: function resetRender() {
      ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom); // Zoom in and flip y axis
    }
  }, {
    key: "drawHUD",
    value: function drawHUD(obj) {
      //Bullets
      ctx.fillStyle = "orange";

      for (var i = 0; i < obj.ammo_loaded; i++) {
        ctx.fillRect((125 + i * 6) / this.clientEngine.zoom, 543 / this.clientEngine.zoom, 2 / this.clientEngine.zoom, 2 / this.clientEngine.zoom);
        ctx.fillRect((124 + i * 6) / this.clientEngine.zoom, 545 / this.clientEngine.zoom, 4 / this.clientEngine.zoom, 20 / this.clientEngine.zoom);
      } //Throw Power


      ctx.strokeStyle = "white";
      ctx.fillStyle = "rgba(255, 255, 255, .9)";
      ctx.fillRect(20 / this.clientEngine.zoom, 544 / this.clientEngine.zoom, obj.throw_power * 100 / this.clientEngine.zoom, 18 / this.clientEngine.zoom);
      ctx.beginPath();
      ctx.rect(20 / this.clientEngine.zoom, 545 / this.clientEngine.zoom, 100 / this.clientEngine.zoom, 18 / this.clientEngine.zoom);
      ctx.closePath();
      ctx.stroke(); //Life

      ctx.strokeStyle = "white";
      ctx.fillStyle = "rgba(255, 0, 0, .5)";
      ctx.fillRect(20 / this.clientEngine.zoom, 570 / this.clientEngine.zoom, obj.health * (760 / obj.max_health) / this.clientEngine.zoom, 18 / this.clientEngine.zoom);
      ctx.beginPath();
      ctx.rect(20 / this.clientEngine.zoom, 570 / this.clientEngine.zoom, 760 / this.clientEngine.zoom, 16 / this.clientEngine.zoom);
      ctx.closePath();
      ctx.stroke();
    }
  }, {
    key: "getCenter",
    value: function getCenter(obj) {
      return new _lanceGg.TwoVector(obj.position.x + this.offset.x + obj.width / 2, obj.position.y + this.offset.y + obj.height / 2);
    }
  }, {
    key: "getCircumscribedRadiusLength",
    value: function getCircumscribedRadiusLength(edge) {
      return edge * Math.SQRT2 / 2;
    }
  }, {
    key: "drawKombat",
    value: function drawKombat(obj) {
      var center = this.getCenter(obj);
      var radius = this.getCircumscribedRadiusLength(obj.width);
      ctx.fillStyle = "transparent";
      ctx.strokeStyle = obj.playerId === this.gameEngine.playerId ? "dodgerblue" : "crimson"; //base circle

      this.drawCircle(center.x, center.y, radius); //kombat name

      ctx.fillStyle = "white";
      ctx.font = '1px Arial';
      ctx.fillText(obj.name, center.x - obj.name.length / 4, center.y - 2); //directional line

      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + radius * Math.cos(obj.direction), center.y + radius * Math.sin(obj.direction));
      ctx.stroke(); //ammo reloading circle

      if (obj.ammo_loaded === -1) {
        this.drawCircle(center.x, center.y, radius + .4);
      }
    }
  }, {
    key: "drawBullet",
    value: function drawBullet(obj) {
      ctx.fillStyle = "orange";
      ctx.strokeStyle = "white";
      var center = this.getCenter(obj);
      var radius = this.getCircumscribedRadiusLength(obj.width);
      ctx.beginPath();
      ctx.arc(center.x, center.y, .5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawGranade",
    value: function drawGranade(obj) {
      ctx.fillStyle = "olive";
      ctx.strokeStyle = "green";
      var center = this.getCenter(obj);
      ctx.beginPath();
      ctx.arc(center.x, center.y, .8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawWall",
    value: function drawWall(obj) {
      ctx.strokeStyle = "white";
      var center = this.getCenter(obj);
      this.drawBox(center.x, center.y, obj.width, obj.height);
    }
  }, {
    key: "drawBlood",
    value: function drawBlood(obj) {
      ctx.fillStyle = 'rgba(255,0,0,.5)';
      var center = this.getCenter(obj);
      obj.splatter.forEach(function (sp) {
        ctx.beginPath();
        ctx.arc(center.x + 1 + sp[0], center.y + 1 + sp[1], sp[2], 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      });
    }
  }, {
    key: "drawExplosion",
    value: function drawExplosion(obj) {
      ctx.fillStyle = "rgba(200,100,0,.4)";
      var center = new _lanceGg.TwoVector(obj.position.x + this.offset.x, obj.position.y + this.offset.y);
      ctx.beginPath();
      ctx.arc(center.x, center.y, obj.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(x, y, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
  }, {
    key: "drawBox",
    value: function drawBox(x, y, w, h) {
      ctx.beginPath();
      ctx.rect(x - w / 2, y - h / 2, w, h);
      ctx.closePath();
      ctx.stroke();
    }
  }]);

  return KombatRenderer;
}(_lanceGg.Renderer);

exports.default = KombatRenderer;
//# sourceMappingURL=KombatRenderer.js.map