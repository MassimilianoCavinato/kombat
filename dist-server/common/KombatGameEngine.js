"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

var _Kombat = _interopRequireDefault(require("./Kombat"));

var _Wall = _interopRequireDefault(require("./Wall"));

var _Bullet = _interopRequireDefault(require("./Bullet"));

var _Blood = _interopRequireDefault(require("./Blood"));

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

var KombatGameEngine =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(KombatGameEngine, _GameEngine);

  function KombatGameEngine(options) {
    var _this;

    _classCallCheck(this, KombatGameEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(KombatGameEngine).call(this, options));
    _this.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this),
      collisions: {
        autoResolve: true
      }
    });

    _this.on('preStep', _this.moveAll.bind(_assertThisInitialized(_this)));

    _this.on('postStep', function (e) {// console.log('poststep', e);
    });

    _this.on('collisionStart', function (e) {
      return _this.handleCollision(e);
    }); // game variables


    Object.assign(_assertThisInitialized(_this), {
      foodRadius: 0.1,
      headRadius: 0.25,
      bodyRadius: 0.1,
      eyeDist: 0.08,
      eyeRadius: 0.03,
      eyeAngle: 0.5,
      spaceWidth: 16,
      spaceHeight: 9,
      moveDist: 0.06,
      foodCount: 16,
      eatDistance: 0.3,
      startBodyLength: 10,
      aiCount: 3,
      directionStop: 100,
      collideDistance: 1
    });
    return _this;
  }

  _createClass(KombatGameEngine, [{
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(_Kombat.default);
      serializer.registerClass(_Bullet.default);
      serializer.registerClass(_Wall.default);
      serializer.registerClass(_Blood.default);
    }
  }, {
    key: "start",
    value: function start() {
      _get(_getPrototypeOf(KombatGameEngine.prototype), "start", this).call(this);
    }
  }, {
    key: "randPos",
    value: function randPos() {
      var x = (Math.random() - 0.5) * this.spaceWidth;
      var y = (Math.random() - 0.5) * this.spaceHeight;
      return new _lanceGg.TwoVector(x, y);
    }
  }, {
    key: "moveAll",
    value: function moveAll(stepInfo) {
      return;
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(KombatGameEngine.prototype), "processInput", this).call(this, inputData, playerId);

      var player = this.world.queryObject({
        playerId: playerId
      });
      var speed = 0.25;

      if (player) {
        if (inputData.input === 'up') {
          player.position.y -= speed;
        } else if (inputData.input === 'down') {
          player.position.y += speed;
        } else if (inputData.input === 'right') {
          player.position.x += speed;
        } else if (inputData.input === 'left') {
          player.position.x -= speed;
        } else if (inputData.input === 'shoot') {
          this.emit('shoot', player);
        } else {
          player.direction = inputData.input;
        }
      }
    }
  }, {
    key: "handleCollision",
    value: function handleCollision(e) {
      if (e.o1 instanceof _Kombat.default) {
        if (e.o2 instanceof _Bullet.default) {
          this.handleBulletHit(e.o1, e.o2);
        }
      } else if (e.o1 instanceof _Bullet.default) {
        if (e.o2 instanceof _Kombat.default) {
          this.handleBulletHit(e.o2, e.o1);
        } else if (e.o2 instanceof _Wall.default) {
          this.destroyObjectById(e.o1.id);
        }
      } else if (e.o1 instanceof _Wall.default) {
        if (e.o2 instanceof _Bullet.default) {
          this.destroyObjectById(e.o2.id);
        }
      }
    }
  }, {
    key: "handleBulletHit",
    value: function handleBulletHit(kombat, bullet) {
      this.destroyObjectById(bullet.id);
      kombat.health--;
      var blood = new _Blood.default(this, null, {
        position: kombat.position.clone()
      });
      this.addObjectToWorld(blood);
      this.timer.add(120, this.destroyObjectById, this, [blood.id]);

      if (kombat.health === 0) {
        this.destroyObjectById(kombat.id);
      }
    }
  }, {
    key: "destroyObjectById",
    value: function destroyObjectById(id) {
      if (this.world.objects[id]) {
        this.removeObjectFromWorld(id);
      }
    }
  }]);

  return KombatGameEngine;
}(_lanceGg.GameEngine);

exports.default = KombatGameEngine;
//# sourceMappingURL=KombatGameEngine.js.map