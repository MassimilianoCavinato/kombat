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

var KombatServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(KombatServerEngine, _ServerEngine);

  function KombatServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, KombatServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatServerEngine).call(this, io, gameEngine, inputOptions));

    _this.gameEngine.on('shoot', _this.shoot.bind(_assertThisInitialized(_this)));

    _this.gameEngine.on('granade', _this.granade.bind(_assertThisInitialized(_this)));

    return _this;
  }

  _createClass(KombatServerEngine, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      _get(_getPrototypeOf(KombatServerEngine.prototype), "start", this).call(this);

      var sideA = 50;
      var sideB = 3;
      var wallNorth = new _Wall.default(this.gameEngine, null, {
        position: new _lanceGg.TwoVector(0, 0),
        width: sideA,
        height: sideB
      });
      this.gameEngine.addObjectToWorld(wallNorth);
      var wallEast = new _Wall.default(this.gameEngine, null, {
        position: new _lanceGg.TwoVector(sideA, 0),
        width: sideB,
        height: sideA
      });
      this.gameEngine.addObjectToWorld(wallEast);
      var wallSouth = new _Wall.default(this.gameEngine, null, {
        position: new _lanceGg.TwoVector(sideB, sideA),
        width: sideA,
        height: sideB
      });
      this.gameEngine.addObjectToWorld(wallSouth);
      var wallWest = new _Wall.default(this.gameEngine, null, {
        position: new _lanceGg.TwoVector(0, sideB),
        width: sideB,
        height: sideA
      });
      this.gameEngine.addObjectToWorld(wallWest);
      var walls = [[8, 8, 3, 9], [32, 18, 8, 3], [25, 25, 2, 2], [42, 36, 3, 9], [12, 32, 8, 3]];
      walls.forEach(function (w) {
        var wall = new _Wall.default(_this2.gameEngine, null, {
          position: new _lanceGg.TwoVector(w[0], w[1]),
          width: w[2],
          height: w[3]
        });

        _this2.gameEngine.addObjectToWorld(wall);
      });
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "onPlayerConnected", this).call(this, socket);

      var kombat = new _Kombat.default(this.gameEngine, null, {
        position: new _lanceGg.TwoVector(10, 10)
      });
      kombat.playerId = socket.playerId;
      kombat.max_health = 10;
      kombat.health = 10;
      kombat.ammo_capacity = 21;
      kombat.ammo_loaded = 21;
      kombat.last_shot = 0;
      kombat.throw_power = 0;
      this.gameEngine.addObjectToWorld(kombat);
    }
  }, {
    key: "onPlayerDisconnected",
    value: function onPlayerDisconnected(socketId, playerId) {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "onPlayerDisconnected", this).call(this, socketId, playerId);

      var kombat = this.gameEngine.world.queryObject({
        playerId: playerId,
        instanceType: _Kombat.default
      });
      if (kombat) this.gameEngine.removeObjectFromWorld(kombat.id);
    }
  }, {
    key: "shoot",
    value: function shoot(kombat) {
      if (kombat.ammo_loaded > 0) {
        kombat.ammo_loaded--;
        var speed = 0.4;
        var liveTimer = 100; //gameloops

        var bullet = new _Bullet.default(this.gameEngine, null, {
          direction: kombat.direction,
          playerId: kombat.playerId,
          ownerId: kombat.id,
          position: new _lanceGg.TwoVector(kombat.position.x + kombat.width / 4, kombat.position.y + kombat.height / 4),
          velocity: new _lanceGg.TwoVector(Math.cos(kombat.direction) * speed, Math.sin(kombat.direction) * speed)
        });
        this.gameEngine.addObjectToWorld(bullet);
        this.gameEngine.timer.add(liveTimer, this.destroyObjectById, this, [bullet.id]);
      } else if (kombat.ammo_loaded === 0) {
        kombat.ammo_loaded--;
        this.gameEngine.timer.add(240, this.reloadAmmo, this, [kombat.id]);
      }
    }
  }, {
    key: "granade",
    value: function granade(kombat) {
      var speed = .4 * kombat.throw_power;
      var granade = new _Granade.default(this.gameEngine, null, {
        direction: kombat.direction,
        position: new _lanceGg.TwoVector(kombat.position.x + kombat.width / 4, kombat.position.y + kombat.height / 4),
        velocity: new _lanceGg.TwoVector(Math.cos(kombat.direction) * speed, Math.sin(kombat.direction) * speed)
      });
      kombat.throw_power = 0;
      granade.playerId = kombat.playerId;
      this.gameEngine.addObjectToWorld(granade);
      this.gameEngine.timer.add(100, this.explode, this, [granade.id]);
    }
  }, {
    key: "destroyObjectById",
    value: function destroyObjectById(id) {
      if (this.gameEngine.world.objects[id]) {
        this.gameEngine.removeObjectFromWorld(id);
      }
    }
  }, {
    key: "reloadAmmo",
    value: function reloadAmmo(kombatId) {
      var kombat = this.gameEngine.world.queryObject({
        id: kombatId,
        instanceType: _Kombat.default
      });

      if (kombat) {
        kombat.ammo_loaded = kombat.ammo_capacity;
      }
    }
  }, {
    key: "explode",
    value: function explode(granadeId) {
      var granade = this.gameEngine.world.queryObject({
        id: granadeId,
        instanceType: _Granade.default
      });

      if (granade) {
        var explosion = new _Explosion.default(this.gameEngine, null, {
          position: granade.position.clone()
        });
        this.destroyObjectById(granadeId);
        explosion.radius = 10;
        this.gameEngine.addObjectToWorld(explosion);
        this.gameEngine.timer.add(150, this.destroyObjectById, this, [explosion.id]);
      }
    }
  }]);

  return KombatServerEngine;
}(_lanceGg.ServerEngine);

exports.default = KombatServerEngine;
//# sourceMappingURL=KombatServerEngine.js.map