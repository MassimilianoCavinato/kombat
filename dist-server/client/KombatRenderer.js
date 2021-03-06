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

var _Heal = _interopRequireDefault(require("../common/Heal2"));

var _DeadZone = _interopRequireDefault(require("../common/DeadZone"));

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
var QPI = Math.PI / 4;

var KombatRenderer =
/*#__PURE__*/
function (_Renderer) {
  _inherits(KombatRenderer, _Renderer);

  function KombatRenderer(gameEngine, clientEngine) {
    var _this;

    _classCallCheck(this, KombatRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatRenderer).call(this, gameEngine, clientEngine));
    game = gameEngine;
    canvas = document.getElementById('kc');
    ctx = canvas.getContext('2d');
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 15;
    _this.offset = new _lanceGg.TwoVector(0, 0);
    return _this;
  }

  _createClass(KombatRenderer, [{
    key: "setOffset",
    value: function setOffset(playerKombat) {
      this.offset.x = C_WIDTH / 2 / playerKombat.scope - playerKombat.position.x - playerKombat.width / 2;
      this.offset.y = C_HEIGHT / 2 / playerKombat.scope - playerKombat.position.y - playerKombat.height / 2;
    }
  }, {
    key: "draw",
    value: function draw(t, dt) {
      var _this2 = this;

      _get(_getPrototypeOf(KombatRenderer.prototype), "draw", this).call(this, t, dt);

      ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
      ctx.save();
      ctx.translate(0, 0); //draw blood stains first // layer 0

      var playerKombat = this.gameEngine.world.queryObject({
        playerId: this.gameEngine.playerId,
        instanceType: _Kombat.default
      });

      if (playerKombat) {
        ctx.lineWidth = 3 / playerKombat.scope;
        ctx.scale(playerKombat.scope, playerKombat.scope);
        this.setOffset(playerKombat);
      } else {
        ctx.lineWidth = 3 / this.clientEngine.zoom;
        ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom);
        this.offset.x = 0;
        this.offset.y = 0;
      }

      game.world.queryObjects({
        instanceType: _Blood.default
      }).forEach(function (obj) {
        return _this2.drawBlood(obj);
      });
      game.world.queryObjects({
        instanceType: _Wall.default
      }).forEach(function (obj) {
        return _this2.drawWall(obj);
      });
      game.world.forEachObject(function (id, obj) {
        if (obj instanceof _Kombat.default) _this2.drawKombat(obj);else if (obj instanceof _Bullet.default) _this2.drawBullet(obj);else if (obj instanceof _Granade.default) _this2.drawGranade(obj);else if (obj instanceof _Heal.default) _this2.drawHeal(obj);
      });
      game.world.queryObjects({
        instanceType: _Explosion.default
      }).forEach(function (obj) {
        return _this2.drawExplosion(obj);
      });
      this.drawDeadZone();

      if (playerKombat) {
        this.drawHUD(playerKombat);
      }

      ctx.restore();
    }
  }, {
    key: "drawDeadZone",
    value: function drawDeadZone() {
      var obj = this.gameEngine.world.queryObject({
        instanceType: _DeadZone.default
      });

      if (obj) {
        ctx.shadowColor = "rgba(100,0,200,.2)";
        ctx.fillStyle = "rgba(100,0,255,.4)";

        if (obj.radius > 0) {
          var center = new _lanceGg.TwoVector(obj.position.x + this.offset.x, obj.position.y + this.offset.y);
          ctx.beginPath();
          ctx.arc(center.x, center.y, obj.radius, 0, 2 * Math.PI);
          ctx.rect(800 / this.clientEngine.zoom, 0, -800 / this.clientEngine.zoom, 600 / this.clientEngine.zoom);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, 800 / this.clientEngine.zoom, 600 / this.clientEngine.zoom);
        }
      }
    }
  }, {
    key: "drawHUD",
    value: function drawHUD(obj) {
      //Bullets and reloading
      ctx.scale(1, 1);

      if (obj.ammo_loaded === -1) {
        ctx.fillStyle = "white";
        ctx.font = "1.8px 'Share Tech'";
        ctx.fillText("RELOADING . . .", 125, 564 / obj.scope);
      } else {
        ctx.shadowColor = 'white';
        ctx.fillStyle = "orange";

        for (var i = 0; i < obj.ammo_loaded; i++) {
          ctx.fillRect((125 + i * 6) / obj.scope, 543 / obj.scope, 2 / obj.scope, 2 / obj.scope);
          ctx.fillRect((124 + i * 6) / obj.scope, 545 / obj.scope, 4 / obj.scope, 20 / obj.scope);
        }
      } //Granades


      ctx.strokeStyle = "#ADFEAE";

      for (var j = 0; j < obj.granade_loaded; j++) {
        ctx.beginPath();
        ctx.arc((25 + j * 12) / obj.scope, 535 / obj.scope, 5 / obj.scope, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
      } //Throw Power


      ctx.strokeStyle = "white";
      ctx.fillStyle = "rgba(255, 255, 255, .9)";
      ctx.fillRect(20 / obj.scope, 544 / obj.scope, obj.throw_power * 100 / obj.scope, 18 / obj.scope);
      ctx.beginPath();
      ctx.rect(20 / obj.scope, 545 / obj.scope, 100 / obj.scope, 18 / obj.scope);
      ctx.closePath();
      ctx.stroke(); //Life

      ctx.strokeStyle = "white";
      ctx.fillStyle = "rgba(255, 0, 0, .5)";
      ctx.fillRect(20 / obj.scope, 570 / obj.scope, obj.health * (760 / obj.max_health) / obj.scope, 18 / obj.scope);
      ctx.beginPath();
      ctx.rect(20 / obj.scope, 570 / obj.scope, 760 / obj.scope, 16 / obj.scope);
      ctx.closePath();
      ctx.stroke();
    }
  }, {
    key: "updateDebugger",
    value: function updateDebugger(player, t, dt) {
      var debugContainer = document.getElementById('debug');
      debugContainer.innerHTML = "\n            Pos X: ".concat(player.position.x, "\n            <hr/> \n            Pos Y: ").concat(player.position.y, "\n            <hr/>\n            Is shooting: ").concat(this.mouseIsDown ? "true" : "false", "\n            <hr/>\n            Ammo: ").concat(player.ammo_loaded, "\n            <hr/>\n            Is reloading: ").concat(player.ammo_loaded === -1 ? "true" : "false", "\n            <hr/>\n            t: ").concat(t, "\n            <hr/>\n            dt: ").concat(dt, "\n        ");
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
      var color = obj.playerId === this.gameEngine.playerId ? "dodgerblue" : "crimson";
      ctx.shadowColor = color;
      ctx.strokeStyle = color; //base circle

      this.drawCircle(center.x, center.y, radius); //kombat name

      ctx.fillStyle = "white";
      ctx.font = '1px Arial';
      ctx.fillText(obj.name, center.x - obj.name.length / 4, center.y - 2); //directional line

      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + radius * Math.cos(obj.direction), center.y + radius * Math.sin(obj.direction));
      ctx.stroke(); //ammo reloading circle

      if (obj.ammo_loaded === -1) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, .1, QPI - .1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, 2 * QPI + .1, 3 * QPI - .1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, 4 * QPI + .1, 5 * QPI - .1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, 6 * QPI + .1, 7 * QPI - .1);
        ctx.stroke();
      }

      if (obj.throwing_granade === 1) {
        ctx.strokeStyle = "white";
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, QPI + .1, 2 * QPI - .1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, 3 * QPI + .1, 4 * QPI - .1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, 5 * QPI + .1, 6 * QPI - .1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + radius / 2, 7 * QPI + .1, 8 * QPI - .1);
        ctx.stroke();
      }
    }
  }, {
    key: "drawBullet",
    value: function drawBullet(obj) {
      ctx.shadowColor = "yellow";
      ctx.strokeStyle = "yellow";
      var center = this.getCenter(obj);
      ctx.beginPath();
      ctx.arc(center.x, center.y, .5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawGranade",
    value: function drawGranade(obj) {
      ctx.shadowColor = "lime";
      ctx.strokeStyle = "lime";
      var center = this.getCenter(obj);
      ctx.beginPath();
      ctx.arc(center.x, center.y, .8, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "drawHeal",
    value: function drawHeal(obj) {
      ctx.strokeStyle = "white";
      ctx.shadowColor = "white";
      var center = this.getCenter(obj);
      var a = .75;
      var b = .2;
      ctx.beginPath();
      ctx.arc(center.x, center.y, 1.2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke(); // ctx.beginPath();
      // ctx.rect(center.x - a, center.y - b, 2*a, .2*b);
      // ctx.closePath();
      // ctx.stroke();
      // ctx.beginPath();
      // ctx.rect(center.x - b, center.y - a, 2*b, 2*a);
      // ctx.closePath();
      // ctx.stroke();

      ctx.fillStyle = "red";
      ctx.shadowColor = "red";
      ctx.fillRect(center.x - a, center.y - b, 2 * a, 2 * b);
      ctx.fillRect(center.x - b, center.y - a, 2 * b, 2 * a);
    }
  }, {
    key: "drawWall",
    value: function drawWall(obj) {
      ctx.strokeStyle = "white";
      ctx.shadowColor = "white";
      var center = this.getCenter(obj);
      this.drawBox(center.x, center.y, obj.width, obj.height);
    }
  }, {
    key: "drawBlood",
    value: function drawBlood(obj) {
      ctx.fillStyle = "rgba(200,100,0,.4)";
      ctx.shadowColor = "red";
      var center = this.getCenter(obj);
      obj.splatter.forEach(function (sp) {
        ctx.beginPath();
        ctx.arc(center.x + 1 + sp[0], center.y + 1 + sp[1], sp[2], 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
      });
    }
  }, {
    key: "drawExplosion",
    value: function drawExplosion(obj) {
      ctx.fillStyle = "rgba(200, 200, 10, .4)";
      ctx.shadowColor = "rgba(200, 200, 10, .4)";
      ;
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