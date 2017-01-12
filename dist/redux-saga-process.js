(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("redux-saga/effects"), require("redux-saga"), require("reselect"));
	else if(typeof define === 'function' && define.amd)
		define("redux-saga-process", ["redux-saga/effects", "redux-saga", "reselect"], factory);
	else if(typeof exports === 'object')
		exports["redux-saga-process"] = factory(require("redux-saga/effects"), require("redux-saga"), require("reselect"));
	else
		root["redux-saga-process"] = factory(root["_"], root["_"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_62__, __WEBPACK_EXTERNAL_MODULE_122__, __WEBPACK_EXTERNAL_MODULE_123__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 124);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var store      = __webpack_require__(33)('wks')
  , uid        = __webpack_require__(22)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ },
/* 2 */
/***/ function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(4)
  , IE8_DOM_DEFINE = __webpack_require__(48)
  , toPrimitive    = __webpack_require__(36)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(5) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(11)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(13)
  , hide      = __webpack_require__(9)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(49)
  , defined = __webpack_require__(28);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ },
/* 8 */
/***/ function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(3)
  , createDesc = __webpack_require__(17);
module.exports = __webpack_require__(5) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(57)
  , enumBugKeys = __webpack_require__(30);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ },
/* 12 */
/***/ function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(27);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = {};

/***/ },
/* 16 */
/***/ function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ },
/* 17 */
/***/ function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(28);
module.exports = function(it){
  return Object(defined(it));
};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(42);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = true;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

var def = __webpack_require__(3).f
  , has = __webpack_require__(8)
  , TAG = __webpack_require__(1)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ },
/* 22 */
/***/ function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(106)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(52)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(70);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(44);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ },
/* 27 */
/***/ function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ },
/* 28 */
/***/ function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ },
/* 30 */
/***/ function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ },
/* 31 */
/***/ function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

var shared = __webpack_require__(33)('keys')
  , uid    = __webpack_require__(22);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ },
/* 34 */
/***/ function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(34)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(14);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(20)
  , wksExt         = __webpack_require__(38)
  , defineProperty = __webpack_require__(3).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(46)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(15);
module.exports = __webpack_require__(0).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(110);
var global        = __webpack_require__(2)
  , hide          = __webpack_require__(9)
  , Iterators     = __webpack_require__(15)
  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCreator = exports.toReduxType = exports.createActions = undefined;

var _values = __webpack_require__(68);

var _values2 = _interopRequireDefault(_values);

var _keys = __webpack_require__(25);

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = __webpack_require__(19);

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = __webpack_require__(24);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _typeof2 = __webpack_require__(26);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toReduxType = function toReduxType(str) {
  return str.replace(/(?!^)([A-Z])/g, '_$1').toUpperCase();
};
var isObjLiteral = function isObjLiteral(o) {
  return o !== null && !Array.isArray(o) && typeof o !== 'function' && (typeof o === 'undefined' ? 'undefined' : (0, _typeof3.default)(o)) === 'object';
};

var buildTypes = function buildTypes(types) {
  var compiled = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(types), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var type = _step.value;

      var snakeCase = toReduxType(type);
      compiled[snakeCase] = snakeCase;
      compiled[type] = snakeCase;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return compiled;
};

var buildCreator = function buildCreator(type, keys) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var i = 0,
        compiled = { type: type };
    if (Array.isArray(keys)) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(keys), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          compiled[key] = args[i++];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (args.length > keys.length && isObjLiteral(args[i + 1])) compiled = (0, _extends3.default)({}, compiled, args[i + 1]);
    } else if (typeof keys === 'function') {
      compiled = (0, _extends3.default)({}, compiled, keys.apply(undefined, args));
    } else if (isObjLiteral(keys)) {
      compiled = (0, _extends3.default)({}, compiled, keys, isObjLiteral(args[0]) && args[0]);
    } else {
      throw new Error('Dont know how to handle action: ', type, keys, args);
    }
    return compiled;
  };
};

var buildActions = function buildActions(actions) {
  var compiled = {};
  for (var type in actions) {
    compiled[type] = buildCreator(toReduxType(type), actions[type]);
  }
  return compiled;
};

var createActions = function createActions(actions) {
  if (!actions) {
    throw new Error('No Actions Received');
  }
  var _types = (0, _keys2.default)(actions),
      _actions = (0, _values2.default)(actions);

  var TYPES = buildTypes(_types),
      ACTIONS = buildActions(actions);
  return { TYPES: TYPES, ACTIONS: ACTIONS };
};

exports.createActions = createActions;
exports.toReduxType = toReduxType;
exports.buildCreator = buildCreator;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(78), __esModule: true };

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(120);


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(12)
  , TAG = __webpack_require__(1)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(5) && !__webpack_require__(11)(function(){
  return Object.defineProperty(__webpack_require__(29)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(12);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(15)
  , ITERATOR   = __webpack_require__(1)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(4);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(20)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(59)
  , hide           = __webpack_require__(9)
  , has            = __webpack_require__(8)
  , Iterators      = __webpack_require__(15)
  , $iterCreate    = __webpack_require__(93)
  , setToStringTag = __webpack_require__(21)
  , getPrototypeOf = __webpack_require__(56)
  , ITERATOR       = __webpack_require__(1)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(1)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(4)
  , dPs         = __webpack_require__(99)
  , enumBugKeys = __webpack_require__(30)
  , IE_PROTO    = __webpack_require__(32)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(29)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(47).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(57)
  , hiddenKeys = __webpack_require__(30).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(8)
  , toObject    = __webpack_require__(18)
  , IE_PROTO    = __webpack_require__(32)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

var has          = __webpack_require__(8)
  , toIObject    = __webpack_require__(7)
  , arrayIndexOf = __webpack_require__(87)(false)
  , IE_PROTO     = __webpack_require__(32)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(6)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(11);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(13)
  , invoke             = __webpack_require__(91)
  , html               = __webpack_require__(47)
  , cel                = __webpack_require__(29)
  , global             = __webpack_require__(2)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(12)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ },
/* 61 */
/***/ function(module, exports) {



/***/ },
/* 62 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_62__;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processName = exports.buildProcesses = exports.runProcess = exports.runProcesses = undefined;

var _extends2 = __webpack_require__(19);

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = __webpack_require__(74);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = __webpack_require__(42);

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = __webpack_require__(24);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = __webpack_require__(25);

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = __webpack_require__(45);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = __webpack_require__(26);

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = __webpack_require__(67);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _effects = __webpack_require__(62);

var _createActions = __webpack_require__(41);

var _reselect = __webpack_require__(123);

var _reducerGenerators = __webpack_require__(65);

var generate = _interopRequireWildcard(_reducerGenerators);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [runProcesses, runProcess].map(_regenerator2.default.mark);

var props = { compiled: false, mergeReducers: true };

var processName = function processName(o) {
  return (0, _getPrototypeOf2.default)(o) && (0, _getPrototypeOf2.default)(o).name;
};
var isObjLiteral = function isObjLiteral(o) {
  return o !== null && !Array.isArray(o) && typeof o !== 'function' && (typeof o === 'undefined' ? 'undefined' : (0, _typeof3.default)(o)) === 'object';
};

function runProcesses(categories) {
  var categoryID, category, processID, _process;

  return _regenerator2.default.wrap(function runProcesses$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = _regenerator2.default.keys(categories);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 25;
            break;
          }

          categoryID = _context.t1.value;
          category = categories[categoryID];

          if (!((typeof category === 'undefined' ? 'undefined' : (0, _typeof3.default)(category)) !== 'object')) {
            _context.next = 6;
            break;
          }

          return _context.abrupt('continue', 1);

        case 6:
          if (!(processName(category) === 'Process')) {
            _context.next = 11;
            break;
          }

          _context.next = 9;
          return (0, _effects.fork)(runProcess, category);

        case 9:
          _context.next = 23;
          break;

        case 11:
          _context.t2 = _regenerator2.default.keys(category);

        case 12:
          if ((_context.t3 = _context.t2()).done) {
            _context.next = 23;
            break;
          }

          processID = _context.t3.value;
          _process = category[processID];

          if (!(processName(_process) === 'Process')) {
            _context.next = 20;
            break;
          }

          _context.next = 18;
          return (0, _effects.fork)(runProcess, _process);

        case 18:
          _context.next = 21;
          break;

        case 20:
          return _context.abrupt('continue', 12);

        case 21:
          _context.next = 12;
          break;

        case 23:
          _context.next = 1;
          break;

        case 25:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function runProcess(process) {
  var _process$config, config, SagaProcess;

  return _regenerator2.default.wrap(function runProcess$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!props.compiled) {
            console.warn('Did not connect to reducers before calling runProcesses, building the process now');
            buildProcess(process);
          }
          _process$config = process.config, config = _process$config === undefined ? {} : _process$config;
          SagaProcess = new process(config);
          _context2.next = 5;
          return (0, _effects.spawn)(SagaProcess.__utils.init, process);

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

var buildProcesses = function buildProcesses(categories) {
  if (!isObjLiteral(categories)) {
    throw new Error('buildProcesses expects an object');
  }
  var processes = {
    reducers: {},
    initialState: {},
    context: {}
  };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(categories)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var categoryID = _step.value;

      var category = categories[categoryID];
      if ((typeof category === 'undefined' ? 'undefined' : (0, _typeof3.default)(category)) !== 'object') {
        continue;
      }
      if (processName(category) === 'Process') {
        var compiled = buildProcess(process);
        parseCompiledProcess(compiled, processes);
      } else {
        for (var processID in category) {
          var _process2 = category[processID];
          if (processName(_process2) === 'Process') {
            var _compiled = buildProcess(_process2);
            parseCompiledProcess(_compiled, processes);
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  for (var reducerName in processes.reducers) {
    var reducer = processes.reducers[reducerName];
    if (typeof reducer === 'function') {
      continue;
    } else if (Array.isArray(reducer)) {
      processes.reducers[reducerName] = generate.arrayMapReducer(processes.initialState[reducerName], reducer.map(function (r) {
        return generate.objectMapReducer(undefined, r, undefined);
      }), processes.context[reducerName]);
    } else if (isObjLiteral(reducer)) {
      processes.reducers[reducerName] = generate.objectMapReducer(processes.initialState[reducerName], reducer, processes.context[reducerName]);
    } else if (typeof reducer === 'function') {
      processes.reducers[reducerName] = generate.reducerReducer(processes.initialState[reducerName], reducer, processes.context[reducerName]);
    } else {
      throw new Error('Failed to Build Reducer: ', reducerName, processes.reducers);
    }
  }
  props.compiled = true;
  return {
    reducerNames: (0, _keys2.default)(processes.reducers),
    processReducers: processes.reducers,
    initialStates: processes.initialState
  };
};

var buildProcess = function buildProcess(process) {
  var compiled = {};
  if (!props.compiled) {
    buildReducer(process, compiled);
    buildSelectors(process, compiled);
    buildActions(process, compiled);
    mutateProcess(process, compiled);
  }
  compiled.initialState = process.initialState;
  return compiled;
};

var buildReducer = function buildReducer(_ref) {
  var _ref$config = _ref.config,
      config = _ref$config === undefined ? {} : _ref$config,
      initialState = _ref.initialState,
      reducer = _ref.reducer;
  var compiled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (config.reduces) {
    compiled.reducer = {
      name: config.reduces,
      reducer: reducer
    };
    compiled.initialState = isObjLiteral(initialState) ? (0, _assign2.default)({}, initialState) : initialState;
  }
  return compiled;
};

var buildSelectors = function buildSelectors(_ref2) {
  var selectors = _ref2.selectors,
      _ref2$config = _ref2.config,
      config = _ref2$config === undefined ? {} : _ref2$config;
  var compiled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!props.compiled && selectors) {
    if (!compiled.selectors) {
      compiled.selectors = {};
    }
    for (var selector in selectors) {
      var selectorValue = selectors[selector];
      if (Array.isArray(selectorValue)) {
        if (selectorValue.length === 1) {
          var coreSelector = config.reduces ? function (state) {
            return state[config.reduces];
          } : function (state) {
            return state;
          };
          compiled.selectors[selector] = _reselect.createSelector.apply(undefined, [coreSelector].concat((0, _toConsumableArray3.default)(selectors[selector])));
        } else {
          compiled.selectors[selector] = _reselect.createSelector.apply(undefined, (0, _toConsumableArray3.default)(selectors[selector]));
        }
      } else {
        throw new Error('Process Selectors must be an array of selectors');
      }
    }
  }
  return compiled;
};

var buildActions = function buildActions(process) {
  var compiled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var creators = process.actionCreators || process.actions;
  var actions = creators && (0, _createActions.createActions)(creators);
  if (actions) {
    compiled.actions = actions.ACTIONS;
    compiled.types = (0, _extends3.default)({}, compiled.types, actions.TYPES);
  }
  return compiled;
};

var mutateProcess = function mutateProcess(process, compiled) {
  if (compiled.actions) {
    process.actions = compiled.actions;
  }
  if (compiled.selectors) {
    process.selectors = compiled.selectors;
  }
  if (compiled.types) {
    process.types = compiled.types;
  }
};

var mergeReducers = function mergeReducers(compiled, processes) {
  var name = compiled.reducer.name;
  if (!props.mergeReducers) {
    throw new Error('Two processes are attempting to reduce the same key (' + name + ') in the state but mergeReducers is disabled.');
  }
  if (Array.isArray(processes.reducers[name])) {
    processes.reducers[name].push(compiled.reducer.reducer);
  } else {
    processes.reducers[name] = [processes.reducers[name], compiled.reducer.reducer];
  }
  if (processes.initialState[name]) {
    processes.initialState[name] = (0, _extends3.default)({}, processes.initialState[name], compiled.initialState);
  } else {
    processes.initialState[name] = compiled.initialState;
  }
};

var parseCompiledProcess = function parseCompiledProcess(compiled, processes) {
  if (compiled.reducer && compiled.reducer.name && compiled.reducer.reducer) {
    var name = compiled.reducer.name;
    if (!name) {
      throw new Error('Reducer Does Not Have a Name? ', compiled);
    }
    if (processes.reducers[name]) {
      mergeReducers(compiled, processes);
    } else if (name) {
      processes.reducers[name] = compiled.reducer.reducer;
      processes.initialState[name] = compiled.initialState;
    }
  }
};

exports.runProcesses = runProcesses;
exports.runProcess = runProcess;
exports.buildProcesses = buildProcesses;
exports.processName = processName;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = __webpack_require__(69);

var _promise2 = _interopRequireDefault(_promise);

var _symbol = __webpack_require__(44);

var _symbol2 = _interopRequireDefault(_symbol);

var _defineProperty2 = __webpack_require__(73);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = __webpack_require__(19);

var _extends5 = _interopRequireDefault(_extends4);

var _getIterator2 = __webpack_require__(24);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = __webpack_require__(25);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(26);

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = __webpack_require__(45);

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = __webpack_require__(71);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(72);

var _createClass3 = _interopRequireDefault(_createClass2);

var _reduxSaga = __webpack_require__(122);

var _effects = __webpack_require__(62);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-constant-condition */

function cancellablePromise(p, onCancel) {
  p[_reduxSaga.CANCEL] = onCancel; // eslint-disable-line
  return p;
}

var Process = function () {
  function Process(config, State) {
    (0, _classCallCheck3.default)(this, Process);
    this.__utils = {
      refs: {},
      init: _regenerator2.default.mark(function init(target) {
        var staticsTask, startTask;
        return _regenerator2.default.wrap(function init$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.name = this.name || target.name || 'ANONYMOUS_SAGA_PROCESS';
                _context.next = 3;
                return (0, _effects.fork)([this, this.__utils.checkStatics], target);

              case 3:
                staticsTask = _context.sent;
                startTask = void 0;

                if (!(typeof this.processStarts === 'function')) {
                  _context.next = 9;
                  break;
                }

                _context.next = 8;
                return (0, _effects.fork)([this, this.processStarts]);

              case 8:
                startTask = _context.sent;

              case 9:
                this.task.classTasks.push(staticsTask, startTask);

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, init, this);
      }),
      getPattern: function getPattern(_types) {
        var patterns = [];
        var types = void 0,
            isObject = void 0;
        if (Array.isArray(_types) === false && (typeof _types === 'undefined' ? 'undefined' : (0, _typeof3.default)(_types)) === 'object') {
          types = (0, _keys2.default)(_types);
          isObject = true;
        } else {
          types = _types;
          isObject = false;
        }

        if (types === undefined || types.length === 0) {
          return '_DONT_MONITOR_TYPE_';
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var type = _step.value;

            var fn = void 0;
            var params = isObject ? _types[type] : _types;
            switch (typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) {
              case 'string':
                fn = function fn(action) {
                  return action.type === type;
                };
                patterns.push(fn);
                break;

              case 'object':
                if (Array.isArray(type)) {
                  console.error('Array is not supported type');
                  break;
                }
                fn = function fn(action) {
                  return (0, _keys2.default)(type).every(function (x) {
                    return type[x] === action[x];
                  });
                };
                patterns.push(fn);
                break;

              case 'function':
                patterns.push(fn);
                break;

              default:
                console.error('Unsupported type ' + type);
            }
          };

          for (var _iterator = (0, _getIterator3.default)(types), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return function (action) {
          return patterns.some(function (func) {
            return func(action);
          });
        };
      },

      /*
        __utils.checkStatics
          Checks the static properties that we have received
      */
      checkStatics: _regenerator2.default.mark(function checkStatics(target) {
        var actions, types, actionRoutes, selectors, cancelTypes, name, monitorPattern, cancelPattern, stopCheck, _ref, monitorAction, stopAction, route, task, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _task;

        return _regenerator2.default.wrap(function checkStatics$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                actions = target.actions, types = target.types, actionRoutes = target.actionRoutes, selectors = target.selectors, cancelTypes = target.cancelTypes, name = target.name;
                monitorPattern = this.__utils.getPattern(actionRoutes), cancelPattern = this.__utils.getPattern(cancelTypes);


                this.__utils.selectors = selectors;
                this.__utils.actions = actions;
                if (types) {
                  this.types = types;
                }

                _context2.prev = 5;
                stopCheck = void 0;

              case 7:
                if (stopCheck) {
                  _context2.next = 36;
                  break;
                }

                _context2.next = 10;
                return (0, _effects.race)({
                  monitorAction: (0, _effects.take)(monitorPattern),
                  cancelAction: (0, _effects.take)(cancelPattern)
                });

              case 10:
                _ref = _context2.sent;
                monitorAction = _ref.monitorAction;
                stopAction = _ref.stopAction;

                if (!monitorAction) {
                  _context2.next = 22;
                  break;
                }

                route = actionRoutes[monitorAction.type];

                if (!(typeof this[route] !== 'function')) {
                  _context2.next = 18;
                  break;
                }

                console.error(name + '\'s Action Route ' + route + ' is not a function');
                return _context2.abrupt('continue', 7);

              case 18:
                _context2.next = 20;
                return (0, _effects.fork)([this, this[route]], monitorAction);

              case 20:
                task = _context2.sent;
                return _context2.abrupt('continue', 7);

              case 22:
                if (!stopAction) {
                  _context2.next = 34;
                  break;
                }

                if (!(typeof this.shouldProcessCancel === 'function')) {
                  _context2.next = 29;
                  break;
                }

                _context2.next = 26;
                return (0, _effects.apply)(this, this.shouldProcessCancel, [stopAction]);

              case 26:
                stopCheck = _context2.sent;
                _context2.next = 30;
                break;

              case 29:
                stopCheck = true;

              case 30:
                if (!stopCheck) {
                  _context2.next = 34;
                  break;
                }

                if (!(typeof this.processCancels === 'function')) {
                  _context2.next = 34;
                  break;
                }

                _context2.next = 34;
                return (0, _effects.apply)(this, this.processCancels, [stopAction]);

              case 34:
                _context2.next = 7;
                break;

              case 36:
                _context2.next = 42;
                break;

              case 38:
                _context2.prev = 38;
                _context2.t0 = _context2['catch'](5);

                console.error(name + ' Error: e.message');
                throw new Error(_context2.t0);

              case 42:
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 45;
                _iterator2 = (0, _getIterator3.default)(this.task.classTasks);

              case 47:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context2.next = 55;
                  break;
                }

                _task = _step2.value;

                if (!_task.isRunning()) {
                  _context2.next = 52;
                  break;
                }

                _context2.next = 52;
                return (0, _effects.cancel)(_task);

              case 52:
                _iteratorNormalCompletion2 = true;
                _context2.next = 47;
                break;

              case 55:
                _context2.next = 61;
                break;

              case 57:
                _context2.prev = 57;
                _context2.t1 = _context2['catch'](45);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t1;

              case 61:
                _context2.prev = 61;
                _context2.prev = 62;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 64:
                _context2.prev = 64;

                if (!_didIteratorError2) {
                  _context2.next = 67;
                  break;
                }

                throw _iteratorError2;

              case 67:
                return _context2.finish(64);

              case 68:
                return _context2.finish(61);

              case 69:
                this.task.classTasks = [];

              case 70:
              case 'end':
                return _context2.stop();
            }
          }
        }, checkStatics, this, [[5, 38], [45, 57, 61, 69], [62,, 64, 68]]);
      })
    };
    this.task = {
      save: _regenerator2.default.mark(function save(task, category, id) {
        var prevTasks;
        return _regenerator2.default.wrap(function save$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                prevTasks = this.task.savedTasks;

                if (!(prevTasks[category] && prevTasks[category][id])) {
                  _context3.next = 5;
                  break;
                }

                console.warn('You must cancel a task before you set a new task with same category and id. We are cancelling it for you');
                _context3.next = 5;
                return (0, _effects.apply)(this, this.task.cancel, [category, id]);

              case 5:
                this.task.savedTasks = (0, _extends5.default)({}, prevTasks, (0, _defineProperty3.default)({}, category, (0, _extends5.default)({}, prevTasks[category], (0, _defineProperty3.default)({}, id, task))));

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, save, this);
      }),
      cancel: _regenerator2.default.mark(function cancel(category, id) {
        var task;
        return _regenerator2.default.wrap(function cancel$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.task.savedTasks[category] && this.task.savedTasks[category][id])) {
                  _context4.next = 7;
                  break;
                }

                task = this.task.savedTasks[category][id];

                if (!task.isRunning()) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 5;
                return (0, _effects.cancel)(task);

              case 5:
                _context4.next = 8;
                break;

              case 7:
                console.warn('Attempted to cancel a task that doesnt exist', category, id);

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, cancel, this);
      }),
      cancelCategory: _regenerator2.default.mark(function cancelCategory(category) {
        var ids, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, id;

        return _regenerator2.default.wrap(function cancelCategory$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this.task.savedTasks[category]) {
                  _context5.next = 30;
                  break;
                }

                ids = (0, _keys2.default)(this.task.savedTasks[category]);
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context5.prev = 5;
                _iterator3 = (0, _getIterator3.default)(ids);

              case 7:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context5.next = 14;
                  break;
                }

                id = _step3.value;
                _context5.next = 11;
                return (0, _effects.apply)(this, this.task.cancel, [category, id]);

              case 11:
                _iteratorNormalCompletion3 = true;
                _context5.next = 7;
                break;

              case 14:
                _context5.next = 20;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5['catch'](5);
                _didIteratorError3 = true;
                _iteratorError3 = _context5.t0;

              case 20:
                _context5.prev = 20;
                _context5.prev = 21;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 23:
                _context5.prev = 23;

                if (!_didIteratorError3) {
                  _context5.next = 26;
                  break;
                }

                throw _iteratorError3;

              case 26:
                return _context5.finish(23);

              case 27:
                return _context5.finish(20);

              case 28:
                _context5.next = 31;
                break;

              case 30:
                console.warn('Attempted to cancel tasks of a category that doesnt exist', category);

              case 31:
              case 'end':
                return _context5.stop();
            }
          }
        }, cancelCategory, this, [[5, 16, 20, 28], [21,, 23, 27]]);
      }),
      cancelAll: _regenerator2.default.mark(function cancelAll() {
        var categories, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, category;

        return _regenerator2.default.wrap(function cancelAll$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                categories = (0, _keys2.default)(this.task.savedTasks);
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context6.prev = 4;
                _iterator4 = (0, _getIterator3.default)(categories);

              case 6:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context6.next = 13;
                  break;
                }

                category = _step4.value;
                _context6.next = 10;
                return (0, _effects.apply)(this, this.task.cancelCategory, [category]);

              case 10:
                _iteratorNormalCompletion4 = true;
                _context6.next = 6;
                break;

              case 13:
                _context6.next = 19;
                break;

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](4);
                _didIteratorError4 = true;
                _iteratorError4 = _context6.t0;

              case 19:
                _context6.prev = 19;
                _context6.prev = 20;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 22:
                _context6.prev = 22;

                if (!_didIteratorError4) {
                  _context6.next = 25;
                  break;
                }

                throw _iteratorError4;

              case 25:
                return _context6.finish(22);

              case 26:
                return _context6.finish(19);

              case 27:
              case 'end':
                return _context6.stop();
            }
          }
        }, cancelAll, this, [[4, 15, 19, 27], [20,, 22, 26]]);
      })
    };
    this.observable = {
      create: function create(name, handleCancel) {
        for (var _len = arguments.length, cancelArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          cancelArgs[_key - 2] = arguments[_key];
        }

        var _this = this;

        var actionQueue = [];
        var dispatchQueue = [];
        var observerRef = (0, _symbol2.default)(name);
        this.observable[observerRef] = function () {
          for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            values[_key2] = arguments[_key2];
          }

          var queued = actionQueue.length + dispatchQueue.length;
          if (dispatchQueue.length) {
            var nextDispatch = dispatchQueue.shift();
            nextDispatch({ values: values, name: name, queued: queued });
          } else {
            actionQueue.push({ values: values, name: name, queued: queued });
          }
        };

        var _onCancel = function _onCancel() {
          delete _this.observable[observerRef];
          handleCancel.apply(undefined, cancelArgs.concat([name]));
        };

        return {
          onData: this.observable[observerRef],
          onCancel: function onCancel() {
            _onCancel();
            return _effects.cancelled;
          },
          getNext: function getNext() {
            var promise = void 0;
            if (actionQueue.length) {
              promise = _promise2.default.resolve(actionQueue.shift());
            } else {
              promise = new _promise2.default(function (resolve) {
                return dispatchQueue.push(resolve);
              });
            }
            return cancellablePromise(promise, _onCancel);
          }
        };
      }
    };

    this.config = config;
    this.state = State;

    this.task.classTasks = [];
    this.task.savedTasks = {};

    this.__utils.init = this.__utils.init.bind(this);

    this.task.save = this.task.save.bind(this);
    this.task.cancel = this.task.cancel.bind(this);
    this.task.cancelCategory = this.task.cancelCategory.bind(this);
    this.task.cancelAll = this.task.cancelAll.bind(this);

    this.observable.create = this.observable.create.bind(this);

    this.select = this.select.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  (0, _createClass3.default)(Process, [{
    key: 'select',
    value: _regenerator2.default.mark(function select(selector) {
      var _this2 = this;

      var results, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, selected;

      return _regenerator2.default.wrap(function select$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              results = void 0;

              if (!(typeof selector === 'string' && this.__utils.selectors && (0, _keys2.default)(this.__utils.selectors).includes(selector))) {
                _context7.next = 7;
                break;
              }

              _context7.next = 4;
              return (0, _effects.select)(this.__utils.selectors[selector]);

            case 4:
              return _context7.abrupt('return', _context7.sent);

            case 7:
              if (!(typeof selector === 'function')) {
                _context7.next = 13;
                break;
              }

              _context7.next = 10;
              return (0, _effects.select)(selector);

            case 10:
              return _context7.abrupt('return', _context7.sent);

            case 13:
              if (!Array.isArray(selector)) {
                _context7.next = 46;
                break;
              }

              results = [];
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context7.prev = 18;
              _iterator5 = (0, _getIterator3.default)(selector);

            case 20:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context7.next = 30;
                break;
              }

              selected = _step5.value;
              _context7.t0 = results;
              _context7.next = 25;
              return (0, _effects.apply)(this, this.select, [selected]);

            case 25:
              _context7.t1 = _context7.sent;

              _context7.t0.push.call(_context7.t0, _context7.t1);

            case 27:
              _iteratorNormalCompletion5 = true;
              _context7.next = 20;
              break;

            case 30:
              _context7.next = 36;
              break;

            case 32:
              _context7.prev = 32;
              _context7.t2 = _context7['catch'](18);
              _didIteratorError5 = true;
              _iteratorError5 = _context7.t2;

            case 36:
              _context7.prev = 36;
              _context7.prev = 37;

              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }

            case 39:
              _context7.prev = 39;

              if (!_didIteratorError5) {
                _context7.next = 42;
                break;
              }

              throw _iteratorError5;

            case 42:
              return _context7.finish(39);

            case 43:
              return _context7.finish(36);

            case 44:
              _context7.next = 50;
              break;

            case 46:
              if (!(typeof selector === 'string' && this.config && this.config.reduces)) {
                _context7.next = 50;
                break;
              }

              _context7.next = 49;
              return (0, _effects.select)(function (state) {
                return state[_this2.config.reduces][selector];
              });

            case 49:
              return _context7.abrupt('return', _context7.sent);

            case 50:
              return _context7.abrupt('return', results);

            case 51:
            case 'end':
              return _context7.stop();
          }
        }
      }, select, this, [[18, 32, 36, 44], [37,, 39, 43]]);
    })
  }, {
    key: 'dispatch',
    value: _regenerator2.default.mark(function dispatch(action) {
      var _utils$actions,
          _len3,
          args,
          _key3,
          _args8 = arguments;

      return _regenerator2.default.wrap(function dispatch$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(typeof action === 'string' && this.__utils.actions && (0, _keys2.default)(this.__utils.actions).includes(action))) {
                _context8.next = 6;
                break;
              }

              for (_len3 = _args8.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = _args8[_key3];
              }

              _context8.next = 4;
              return (0, _effects.put)((_utils$actions = this.__utils.actions)[action].apply(_utils$actions, args));

            case 4:
              _context8.next = 12;
              break;

            case 6:
              if (!(action && action.type)) {
                _context8.next = 11;
                break;
              }

              _context8.next = 9;
              return (0, _effects.put)(action);

            case 9:
              _context8.next = 12;
              break;

            case 11:
              throw new Error('Must dispatch either a registered action or a valid redux action object.');

            case 12:
            case 'end':
              return _context8.stop();
          }
        }
      }, dispatch, this);
    })
  }]);
  return Process;
}();

exports.default = Process;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducerReducer = exports.objectMapReducer = exports.arrayMapReducer = undefined;

var _extends2 = __webpack_require__(19);

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var arrayMapReducer = function arrayMapReducer(initialState, reducers, pcontext) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];
    var context = arguments[2];
    return reducers.reduce(function (p, c) {
      return c(p, action, (0, _extends3.default)({}, pcontext, context));
    }, state);
  };
};

var objectMapReducer = function objectMapReducer(initialState) {
  var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var pcontext = arguments[2];
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];
    var context = arguments[2];

    if (!action || !action.type || !handlers[action.type]) return state;
    return handlers[action.type](state, action, (0, _extends3.default)({}, pcontext, context));
  };
};

var reducerReducer = function reducerReducer(initialState, reducer, pcontext) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];
    var context = arguments[2];
    return reducer(state, action, (0, _extends3.default)({}, pcontext, context));
  };
};

exports.arrayMapReducer = arrayMapReducer;
exports.objectMapReducer = objectMapReducer;
exports.reducerReducer = reducerReducer;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(81), __esModule: true };

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(43);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(43);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(66);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(23);
__webpack_require__(109);
module.exports = __webpack_require__(0).Array.from;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(40);
__webpack_require__(23);
module.exports = __webpack_require__(108);

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(111);
module.exports = __webpack_require__(0).Object.assign;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(112);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(113);
module.exports = __webpack_require__(0).Object.getPrototypeOf;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(114);
module.exports = __webpack_require__(0).Object.keys;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(117);
module.exports = __webpack_require__(0).Object.values;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(61);
__webpack_require__(23);
__webpack_require__(40);
__webpack_require__(115);
module.exports = __webpack_require__(0).Promise;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(116);
__webpack_require__(61);
__webpack_require__(118);
__webpack_require__(119);
module.exports = __webpack_require__(0).Symbol;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(23);
__webpack_require__(40);
module.exports = __webpack_require__(38).f('iterator');

/***/ },
/* 85 */
/***/ function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ },
/* 86 */
/***/ function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(7)
  , toLength  = __webpack_require__(35)
  , toIndex   = __webpack_require__(107);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(3)
  , createDesc      = __webpack_require__(17);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(10)
  , gOPS    = __webpack_require__(31)
  , pIE     = __webpack_require__(16);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(13)
  , call        = __webpack_require__(51)
  , isArrayIter = __webpack_require__(50)
  , anObject    = __webpack_require__(4)
  , toLength    = __webpack_require__(35)
  , getIterFn   = __webpack_require__(39)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ },
/* 91 */
/***/ function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(12);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(54)
  , descriptor     = __webpack_require__(17)
  , setToStringTag = __webpack_require__(21)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(9)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ },
/* 94 */
/***/ function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(10)
  , toIObject = __webpack_require__(7);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

var META     = __webpack_require__(22)('meta')
  , isObject = __webpack_require__(14)
  , has      = __webpack_require__(8)
  , setDesc  = __webpack_require__(3).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(11)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , macrotask = __webpack_require__(60).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(12)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(10)
  , gOPS     = __webpack_require__(31)
  , pIE      = __webpack_require__(16)
  , toObject = __webpack_require__(18)
  , IObject  = __webpack_require__(49)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(11)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(3)
  , anObject = __webpack_require__(4)
  , getKeys  = __webpack_require__(10);

module.exports = __webpack_require__(5) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(16)
  , createDesc     = __webpack_require__(17)
  , toIObject      = __webpack_require__(7)
  , toPrimitive    = __webpack_require__(36)
  , has            = __webpack_require__(8)
  , IE8_DOM_DEFINE = __webpack_require__(48)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(5) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(7)
  , gOPN      = __webpack_require__(55).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(10)
  , toIObject = __webpack_require__(7)
  , isEnum    = __webpack_require__(16).f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

var hide = __webpack_require__(9);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(2)
  , core        = __webpack_require__(0)
  , dP          = __webpack_require__(3)
  , DESCRIPTORS = __webpack_require__(5)
  , SPECIES     = __webpack_require__(1)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(4)
  , aFunction = __webpack_require__(27)
  , SPECIES   = __webpack_require__(1)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(34)
  , defined   = __webpack_require__(28);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(34)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(4)
  , get      = __webpack_require__(39);
module.exports = __webpack_require__(0).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var ctx            = __webpack_require__(13)
  , $export        = __webpack_require__(6)
  , toObject       = __webpack_require__(18)
  , call           = __webpack_require__(51)
  , isArrayIter    = __webpack_require__(50)
  , toLength       = __webpack_require__(35)
  , createProperty = __webpack_require__(88)
  , getIterFn      = __webpack_require__(39);

$export($export.S + $export.F * !__webpack_require__(53)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(85)
  , step             = __webpack_require__(94)
  , Iterators        = __webpack_require__(15)
  , toIObject        = __webpack_require__(7);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(52)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(6);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(98)});

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(5), 'Object', {defineProperty: __webpack_require__(3).f});

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(18)
  , $getPrototypeOf = __webpack_require__(56);

__webpack_require__(58)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(18)
  , $keys    = __webpack_require__(10);

__webpack_require__(58)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(20)
  , global             = __webpack_require__(2)
  , ctx                = __webpack_require__(13)
  , classof            = __webpack_require__(46)
  , $export            = __webpack_require__(6)
  , isObject           = __webpack_require__(14)
  , aFunction          = __webpack_require__(27)
  , anInstance         = __webpack_require__(86)
  , forOf              = __webpack_require__(90)
  , speciesConstructor = __webpack_require__(105)
  , task               = __webpack_require__(60).set
  , microtask          = __webpack_require__(97)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(103)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(21)($Promise, PROMISE);
__webpack_require__(104)(PROMISE);
Wrapper = __webpack_require__(0)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(53)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(8)
  , DESCRIPTORS    = __webpack_require__(5)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(59)
  , META           = __webpack_require__(96).KEY
  , $fails         = __webpack_require__(11)
  , shared         = __webpack_require__(33)
  , setToStringTag = __webpack_require__(21)
  , uid            = __webpack_require__(22)
  , wks            = __webpack_require__(1)
  , wksExt         = __webpack_require__(38)
  , wksDefine      = __webpack_require__(37)
  , keyOf          = __webpack_require__(95)
  , enumKeys       = __webpack_require__(89)
  , isArray        = __webpack_require__(92)
  , anObject       = __webpack_require__(4)
  , toIObject      = __webpack_require__(7)
  , toPrimitive    = __webpack_require__(36)
  , createDesc     = __webpack_require__(17)
  , _create        = __webpack_require__(54)
  , gOPNExt        = __webpack_require__(101)
  , $GOPD          = __webpack_require__(100)
  , $DP            = __webpack_require__(3)
  , $keys          = __webpack_require__(10)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(55).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(16).f  = $propertyIsEnumerable;
  __webpack_require__(31).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(20)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(6)
  , $values = __webpack_require__(102)(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(37)('asyncIterator');

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(37)('observable');

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(121);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ },
/* 121 */
/***/ function(module, exports) {

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);


/***/ },
/* 122 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_122__;

/***/ },
/* 123 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_123__;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = __webpack_require__(63);

Object.defineProperty(exports, 'runProcesses', {
  enumerable: true,
  get: function get() {
    return _effects.runProcesses;
  }
});
Object.defineProperty(exports, 'runProcess', {
  enumerable: true,
  get: function get() {
    return _effects.runProcess;
  }
});
Object.defineProperty(exports, 'buildProcesses', {
  enumerable: true,
  get: function get() {
    return _effects.buildProcesses;
  }
});
Object.defineProperty(exports, 'processName', {
  enumerable: true,
  get: function get() {
    return _effects.processName;
  }
});

var _createActions = __webpack_require__(41);

Object.defineProperty(exports, 'createActions', {
  enumerable: true,
  get: function get() {
    return _createActions.createActions;
  }
});
Object.defineProperty(exports, 'toReduxType', {
  enumerable: true,
  get: function get() {
    return _createActions.toReduxType;
  }
});
Object.defineProperty(exports, 'buildCreator', {
  enumerable: true,
  get: function get() {
    return _createActions.buildCreator;
  }
});

var _process = __webpack_require__(64);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_process).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }
/******/ ]);
});
//# sourceMappingURL=redux-saga-process.js.map