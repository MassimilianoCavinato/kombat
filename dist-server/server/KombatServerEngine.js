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

var _Blood = _interopRequireDefault(require("../common/Blood"));

var _DeadZone = _interopRequireDefault(require("../common/DeadZone"));

var _Heal = _interopRequireDefault(require("../common/Heal2"));

var _map = require("./map1");

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

var RANDOM_SPAWNS = [new _lanceGg.TwoVector(10, 10), new _lanceGg.TwoVector(40, 10), new _lanceGg.TwoVector(10, 40), new _lanceGg.TwoVector(40, 40)];

var KombatServerEngine =
/*#__PURE__*/
function (_ServerEngine) {
  _inherits(KombatServerEngine, _ServerEngine);

  function KombatServerEngine(io, gameEngine, inputOptions) {
    var _this;

    _classCallCheck(this, KombatServerEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatServerEngine).call(this, io, gameEngine, inputOptions));

    _this.gameEngine.on('play', function (e) {
      return _this.play(e);
    });

    _this.gameEngine.on('shoot', function (e) {
      return _this.shoot(e);
    });

    _this.gameEngine.on('granade', function (e) {
      return _this.granade(e);
    });

    _this.gameEngine.on('pickup', function (e) {
      return _this.pickup(e);
    });

    _this.gameEngine.on('bullethit', function (e) {
      return _this.handleBulletHit(e);
    });

    _this.gameEngine.on('postStep', function (stepInfo) {
      return _this.postStep(stepInfo);
    });

    _this.deadzoneTimer = 0;
    return _this;
  }

  _createClass(KombatServerEngine, [{
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "start", this).call(this);

      this.add_Map(_map.map);
      this.add_DeadZone();
    }
  }, {
    key: "play",
    value: function play(obj) {
      var kombat = new _Kombat.default(this.gameEngine, null, {
        position: this.get_randomVectorInBound(100, 100)
      });
      kombat.playerId = obj.playerId;
      kombat.name = obj.name.trim().length < 1 ? 'Kombat ' + obj.playerId : obj.name;
      kombat.max_health = 100;
      kombat.health = 100;
      kombat.ammo_capacity = 64;
      kombat.ammo_loaded = 64;
      kombat.granade_capacity = 32;
      kombat.granade_loaded = 32;
      kombat.throw_power = 0;
      kombat.throwing_granade = false;
      kombat.timer_shot = 0;
      kombat.timer_deadzone = 0;
      kombat._shoot_side = 'l';
      kombat.scope = 15;
      this.gameEngine.addObjectToWorld(kombat);
    }
  }, {
    key: "handleBulletHit",
    value: function handleBulletHit(kombat) {
      kombat.health -= 3;

      if (kombat.health <= 0) {
        this.destroyObjectById(kombat.id);
      }

      var blood = new _Blood.default(this.gameEngine, null, {
        position: kombat.position.clone()
      });
      this.gameEngine.addObjectToWorld(blood);
      this.gameEngine.timer.add(600, this.destroyObjectById, this, [blood.id]);
    }
  }, {
    key: "get_randomVectorInBound",
    value: function get_randomVectorInBound(w, h) {
      return new _lanceGg.TwoVector(Math.floor(Math.random() * (w - 16)) + 8, Math.floor(Math.random() * (h - 16)) + 8);
    }
  }, {
    key: "add_Map",
    value: function add_Map(map) {
      var _this2 = this;

      map.forEach(function (w) {
        var wall = new _Wall.default(_this2.gameEngine, null, {
          position: new _lanceGg.TwoVector(w.x, w.y),
          width: w.width,
          height: w.height
        });

        _this2.gameEngine.addObjectToWorld(wall);
      });
    }
  }, {
    key: "add_DeadZone",
    value: function add_DeadZone() {
      var _this3 = this;

      var prev_deadZone = this.gameEngine.world.queryObject({
        instanceType: _DeadZone.default
      });

      if (prev_deadZone) {
        this.destroyObjectById(prev_deadZone.id);
      }

      var deadZone = new _DeadZone.default(this.gameEngine, null, {
        position: this.get_randomVectorInBound(100, 100)
      });
      deadZone.radius = 150;
      this.gameEngine.addObjectToWorld(deadZone);
      var heals = this.gameEngine.world.queryObjects({
        instanceType: _Heal.default
      });

      if (heals.length >= 10) {
        heals.forEach(function (h) {
          return _this3.destroyObjectById(h.id);
        });
      } //add heal


      var heal = new _Heal.default(this.gameEngine, null, {
        position: this.get_randomVectorInBound(100, 100)
      });
      this.gameEngine.addObjectToWorld(heal);
    }
  }, {
    key: "onPlayerConnected",
    value: function onPlayerConnected(socket) {
      _get(_getPrototypeOf(KombatServerEngine.prototype), "onPlayerConnected", this).call(this, socket);
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
        var speed = 0.5;
        var kombatPos = kombat.position.clone();
        var kombatDir = kombat.direction;
        kombatPos.add(new _lanceGg.TwoVector(.5, .5));
        var position;

        if (kombat.shoot_side === 'l') {
          position = new _lanceGg.TwoVector(kombatPos.x + 1 * Math.cos(kombatDir - 1.5), kombatPos.y + 1 * Math.sin(kombatDir - 1.5));
          kombat.shoot_side = "r";
        } else {
          position = new _lanceGg.TwoVector(kombatPos.x + 1 * Math.cos(kombatDir + 1.5), kombatPos.y + 1 * Math.sin(kombatDir + 1.5));
          kombat.shoot_side = "l";
        }

        var liveTimer = 100; //gameloops

        var bullet = new _Bullet.default(this.gameEngine, null, {
          direction: kombatDir,
          playerId: kombat.playerId,
          ownerId: kombat.id,
          position: position,
          velocity: new _lanceGg.TwoVector(Math.cos(kombatDir) * speed, Math.sin(kombatDir) * speed)
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
      if (kombat.granade_loaded > 0) {
        kombat.granade_loaded--;
        var speed = .4 * kombat.throw_power;
        var velocity = new _lanceGg.TwoVector(Math.cos(kombat.direction) * speed, Math.sin(kombat.direction) * speed);
        var granade = new _Granade.default(this.gameEngine, null, {
          direction: kombat.direction,
          position: new _lanceGg.TwoVector(kombat.position.x + kombat.width / 4, kombat.position.y + kombat.height / 4),
          velocity: velocity
        });
        kombat.throw_power = 0;
        granade.playerId = kombat.playerId;
        granade.prevVelocity = velocity.clone();
        this.gameEngine.addObjectToWorld(granade);
        this.gameEngine.timer.add(100, this.explode, this, [granade.id]);
      }
    }
  }, {
    key: "pickup",
    value: function pickup(kombat) {
      var heals = this.gameEngine.world.queryObjects({
        instanceType: _Heal.default
      });

      for (var i = 0; i < heals.length; i++) {
        var h = heals[i];
        var d = Math.sqrt(Math.pow(kombat.position.x + kombat.width / 2 - h.position.x, 2) + Math.pow(kombat.position.y + kombat.height / 2 - h.position.y, 2));

        if (d < 1.5) {
          kombat.health += 30;

          if (kombat.health > kombat.max_health) {
            kombat.health = kombat.max_health;
          }

          this.gameEngine.removeObjectFromWorld(h.id);
          return false;
        }
      }
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
      var _this4 = this;

      var granade = this.gameEngine.world.queryObject({
        id: granadeId,
        instanceType: _Granade.default
      });

      if (granade) {
        var position = granade.position.clone();
        var explosion = new _Explosion.default(this.gameEngine, null, {
          position: position
        });
        this.destroyObjectById(granadeId);
        explosion.radius = 10;
        this.gameEngine.addObjectToWorld(explosion);
        this.gameEngine.timer.add(150, this.destroyObjectById, this, [explosion.id]);
        var kombats = this.gameEngine.world.queryObjects({
          instanceType: _Kombat.default
        });
        kombats.forEach(function (k) {
          var d = Math.sqrt(Math.pow(k.position.x + k.width / 2 - position.x, 2) + Math.pow(k.position.y + k.height / 2 - position.y, 2));

          if (d <= explosion.radius) {
            k.health -= 3;

            if (d <= explosion.radius / 2) {
              k.health -= 3;
            }

            if (d <= explosion.radius / 4) {
              k.health -= 3;
            }

            var blood = new _Blood.default(_this4.gameEngine, null, {
              position: k.position.clone()
            });

            if (k.health <= 0) {
              _this4.destroyObjectById(k.id);
            }

            _this4.gameEngine.addObjectToWorld(blood);

            _this4.gameEngine.timer.add(600, _this4.destroyObjectById, _this4, [blood.id]);
          }
        });
      }
    }
  }, {
    key: "postStep",
    value: function postStep(stepInfo) {
      var _this5 = this;

      var deadZone = this.gameEngine.world.queryObject({
        instanceType: _DeadZone.default
      });

      if (deadZone) {
        if (deadZone.radius < -10) {
          deadZone.position.x = Math.floor(Math.random() * 90) + 10;
          deadZone.position.y = Math.floor(Math.random() * 90) + 10;
          this.add_DeadZone();
        } else if (stepInfo.step - this.deadzoneTimer > 60) {
          this.deadzoneTimer = stepInfo.step;
          var kombats = this.gameEngine.world.queryObjects({
            instanceType: _Kombat.default
          });
          var damage = 2;

          if (deadZone.radius < 50) {
            damage += 2;
          } else if (deadZone.radius < 30) {
            damage += 4;
          } else if (deadZone.radius < 10) {
            damage += 6;
          }

          kombats.forEach(function (k) {
            var distance = Math.sqrt(Math.pow(k.position.x + k.width / 2 - deadZone.x, 2) + Math.pow(k.position.y + k.height / 2 - deadZone.position.y, 2));

            if (distance >= deadZone.radius) {
              k.health -= damage;
              var blood = new _Blood.default(_this5.gameEngine, null, {
                position: k.position.clone()
              });

              if (k.health <= 0) {
                _this5.destroyObjectById(k.id);
              }

              _this5.gameEngine.addObjectToWorld(blood);

              _this5.gameEngine.timer.add(600, _this5.destroyObjectById, _this5, [blood.id]);
            }
          });
        }
      }
    }
  }]);

  return KombatServerEngine;
}(_lanceGg.ServerEngine);

exports.default = KombatServerEngine;
//# sourceMappingURL=KombatServerEngine.js.map