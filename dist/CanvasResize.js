"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Canvas = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _moremathJs = require("moremath-js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Canvas = /*#__PURE__*/function (_React$Component) {
  _inherits(Canvas, _React$Component);

  var _super = _createSuper(Canvas);

  function Canvas(props) {
    var _this;

    _classCallCheck(this, Canvas);

    _this = _super.call(this, props);
    _this.loopCount = -1;
    _this.canvasRef = _react["default"].createRef();
    return _this;
  }

  _createClass(Canvas, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      cancelAnimationFrame(this.drawCanvasI);
      this.drawCanvasI = 'STOP';
    }
  }, {
    key: "drawCanvas",
    value: function drawCanvas() {
      var now = Date.now();
      cancelAnimationFrame(this.drawCanvasI);
      delete this.drawCanvasI;
      this.requestDrawCanvas();
      var props = this.props,
          canvasRef = this.canvasRef,
          loopCount = this.loopCount;
      var onInit = props.onInit,
          onDraw = props.onDraw;
      this.loopCount++;
      var canvas = canvasRef.current;

      if (!this.sentInit) {
        this.sentInit = true;
        onInit({
          canvas: canvas
        });
      }

      onDraw({
        canvas: canvas,
        now: now,
        count: loopCount
      });
    }
  }, {
    key: "requestDrawCanvas",
    value: function requestDrawCanvas() {
      var _this2 = this;

      if (this.drawCanvasI) return;
      this.drawCanvasI = requestAnimationFrame(function () {
        return _this2.drawCanvas();
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.requestDrawCanvas();
      var props = this.props,
          canvasRef = this.canvasRef;

      var width = props.width,
          height = props.height,
          onInit = props.onInit,
          onDraw = props.onDraw,
          otherProps = _objectWithoutProperties(props, ["width", "height", "onInit", "onDraw"]);

      return /*#__PURE__*/_react["default"].createElement("canvas", _extends({
        ref: canvasRef,
        width: width,
        height: height
      }, otherProps));
    }
  }]);

  return Canvas;
}(_react["default"].Component);

exports.Canvas = Canvas;
Canvas.defaultProps = {
  onInit: function onInit() {},
  onDraw: function onDraw() {}
};
Canvas.propTypes = {
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  onInit: _propTypes["default"].func,
  onDraw: _propTypes["default"].func
};

var CanvasResize = /*#__PURE__*/function (_React$Component2) {
  _inherits(CanvasResize, _React$Component2);

  var _super2 = _createSuper(CanvasResize);

  function CanvasResize(props) {
    var _this3;

    _classCallCheck(this, CanvasResize);

    _this3 = _super2.call(this, props);
    _this3.state = {
      left: 0,
      top: 0,
      width: 1,
      height: 1
    };
    _this3.rootRef = _react["default"].createRef();
    _this3.canvasRef = _react["default"].createRef();
    return _this3;
  }

  _createClass(CanvasResize, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(props, state) {
      for (var _i = 0, _arr = ['left', 'top', 'width', 'height']; _i < _arr.length; _i++) {
        var key = _arr[_i];
        if (this.state[key] !== state[key]) return true;
      }

      for (var _i2 = 0, _Object$keys = Object.keys(props); _i2 < _Object$keys.length; _i2++) {
        var _key = _Object$keys[_i2];
        if (this.props[_key] !== props[_key]) return true;
      }

      return false;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      cancelAnimationFrame(this.drawCanvasI);
      this.drawCanvasI = 'STOP';
    }
  }, {
    key: "handleDraw",
    value: function handleDraw(opts) {
      this.checkResize();
      this.props.onDraw(opts);
    }
  }, {
    key: "checkResize",
    value: function checkResize() {
      var rootRef = this.rootRef,
          props = this.props,
          state = this.state;
      var ratio = props.ratio,
          onResize = props.onResize;
      var root = rootRef.current;
      if (!root) return;
      var offsetWidth = root.offsetWidth,
          offsetHeight = root.offsetHeight;
      var size = {
        left: 0,
        top: 0,
        width: offsetWidth,
        height: offsetHeight
      };

      if (ratio.length === 2 && ratio.every(Boolean)) {
        var _containBox = (0, _moremathJs.containBox)(ratio, [offsetWidth, offsetHeight]);

        var _containBox2 = _slicedToArray(_containBox, 2);

        size.width = _containBox2[0];
        size.height = _containBox2[1];
        size.left = (offsetWidth - size.width) / 2;
        size.top = (offsetHeight - size.height) / 2;

        for (var _i3 = 0, _Object$keys2 = Object.keys(size); _i3 < _Object$keys2.length; _i3++) {
          var key = _Object$keys2[_i3];
          size[key] = Math.floor(size[key]);
        }
      }

      if (Object.entries(size).some(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return value !== state[key];
      })) {
        onResize(_objectSpread({}, size));
        this.setState(size);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var props = this.props,
          state = this.state,
          rootRef = this.rootRef,
          canvasRef = this.canvasRef;

      var style = props.style,
          ratio = props.ratio,
          canvasProps = props.canvasProps,
          onInit = props.onInit,
          onResize = props.onResize,
          onDraw = props.onDraw,
          otherProps = _objectWithoutProperties(props, ["style", "ratio", "canvasProps", "onInit", "onResize", "onDraw"]);

      var left = state.left,
          top = state.top,
          width = state.width,
          height = state.height;
      return /*#__PURE__*/_react["default"].createElement("div", _extends({
        ref: rootRef,
        style: _objectSpread({}, style, {
          padding: 0
        })
      }, otherProps), /*#__PURE__*/_react["default"].createElement(Canvas, _extends({
        ref: canvasRef,
        style: {
          margin: 0,
          marginLeft: left,
          marginTop: top
        },
        width: width,
        height: height,
        onDraw: function onDraw(opts) {
          return _this4.handleDraw(opts);
        }
      }, canvasProps)));
    }
  }]);

  return CanvasResize;
}(_react["default"].Component);

CanvasResize.defaultProps = {
  style: {},
  canvasProps: {},
  ratio: [],
  onInit: function onInit() {},
  onDraw: function onDraw() {},
  onResize: function onResize() {}
};
CanvasResize.propTypes = {
  style: _propTypes["default"].object,
  canvasProps: _propTypes["default"].object,
  ratio: _propTypes["default"].array,
  onInit: _propTypes["default"].func,
  onDraw: _propTypes["default"].func,
  onResize: _propTypes["default"].func
};
var _default = CanvasResize;
exports["default"] = _default;
