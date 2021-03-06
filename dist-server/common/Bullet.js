"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Bullet =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Bullet, _DynamicObject);

  _createClass(Bullet, null, [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        width: {
          type: _lanceGg.BaseTypes.TYPES.FLOAT32
        },
        height: {
          type: _lanceGg.BaseTypes.TYPES.FLOAT32
        },
        direction: {
          type: _lanceGg.BaseTypes.TYPES.FLOAT32
        },
        ownerId: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        }
      }, _get(_getPrototypeOf(Bullet), "netScheme", this));
    }
  }]);

  function Bullet(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Bullet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bullet).call(this, gameEngine, options, props));
    _this.class = Bullet;
    _this.type = "Bullet";
    return _this;
  }

  _createClass(Bullet, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Bullet.prototype), "syncTo", this).call(this, other);
    }
  }, {
    key: "collidesWith",
    value: function collidesWith(other) {
      if (other.type === "Kombat") {
        if (this.playerId === other.playerId) {
          return false;
        } else {
          return true;
        }
      } else if (other.type === "Wall") {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Bullet";
    }
  }]);

  return Bullet;
}(_lanceGg.DynamicObject);

exports.default = Bullet;
//# sourceMappingURL=Bullet.js.map