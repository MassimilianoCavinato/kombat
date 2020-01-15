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

var Explosion2 =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Explosion2, _DynamicObject);

  _createClass(Explosion2, null, [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        radius: {
          type: _lanceGg.BaseTypes.TYPES.FLOAT32
        }
      }, _get(_getPrototypeOf(Explosion2), "netScheme", this));
    }
  }]);

  function Explosion2(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Explosion2);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Explosion2).call(this, gameEngine, options, props));
    _this.class = Explosion2;
    _this.type = "Explosion2";
    _this.isStatic = true; // this.splatter = [
    //     [Math.random()*5, Math.random()*5, 3+Math.random()*3],
    //     [Math.random()*5, -Math.random()*5, 3+Math.random()*3],
    //     [-Math.random()*5, Math.random()*5, 3+Math.random()*3],
    //     [-Math.random()*5, -Math.random()*5, 3+Math.random()*3],
    //     [Math.random()*5+2, Math.random()*5+2,, 3+Math.random()*3],
    //     [Math.random()*5+2,, -Math.random()*5-2, 3+Math.random()*3],
    //     [-Math.random()*5-2, Math.random()*5+2,, 3+Math.random()*3],
    //     [-Math.random()*5-2, -Math.random()*5-2, 3+Math.random()*3],
    //     [Math.random()*5+4, Math.random()*5+4, 3+Math.random()*3],
    //     [Math.random()*5+4, -Math.random()*5-4, 3+Math.random()*3],
    //     [-Math.random()*5-4, Math.random()*5+4, 3+Math.random()*3],
    //     [-Math.random()*5-4, -Math.random()*5+4, 3+Math.random()*3],
    // ]

    return _this;
  }

  _createClass(Explosion2, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Explosion2.prototype), "syncTo", this).call(this, other);
    }
  }, {
    key: "collidesWith",
    value: function collidesWith(other) {
      return false;
    }
  }]);

  return Explosion2;
}(_lanceGg.DynamicObject);

exports.default = Explosion2;
//# sourceMappingURL=Explosion2.js.map