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

var KombatServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(KombatServerEngine, _ServerEngine);

  function KombatServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, KombatServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatServerEngine).call(this, io, gameEngine, inputOptions));

    _this.gameEngine.on('shoot', _this.shoot.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(KombatServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "start", this).call(this); // let testBox = new Box(this.gameEngine, null, { position: new TwoVector(0, 0) });
      // this.gameEngine.addObjectToWorld(testBox);

    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      var playerKombat = new _Kombat.default(this.gameEngine, null, {
        position: new _lanceGg.TwoVector(10, 10)
      });
      playerKombat.direction = 0;
      playerKombat.playerId = socket.playerId;
      this.gameEngine.addObjectToWorld(playerKombat);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var playerKombat = this.gameEngine.world.queryObject({
        playerId: playerId,
        instanceType: _Kombat.default
      });
      if (playerKombat) this.gameEngine.removeObjectFromWorld(playerKombat.id);
    }
  }, {
    key: "shoot",
    value: function shoot(player) {
      var speed = 0.01;
      var bullet = new _Bullet.default(this.gameEngine, null, {
        direction: player.direction,
        playerId: player.playerId,
        ownerId: player.id,
        position: new _lanceGg.TwoVector(player.position.x + player.width / 4, player.position.y + player.height / 4),
        velocity: new _lanceGg.TwoVector(Math.cos(player.direction) * speed, Math.sin(player.direction) * speed)
      });
      this.gameEngine.addObjectToWorld(bullet);
      this.gameEngine.timer.add(60, this.destroyBullet, this, [bullet.id]);
    }
  }, {
    key: "destroyBullet",
    value: function destroyBullet(bulletId) {
      if (this.gameEngine.world.objects[bulletId]) {
        this.gameEngine.removeObjectFromWorld(bulletId);
      }
    }
  }]);

  return KombatServerEngine;
}(_lanceGg.ServerEngine);

exports.default = KombatServerEngine;
//# sourceMappingURL=KombatServerEngine.js.map