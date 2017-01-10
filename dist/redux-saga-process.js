(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("redux-saga/effects"), require("redux-saga"), require("reduxsauce"), require("reselect"));
	else if(typeof define === 'function' && define.amd)
		define("redux-saga-process", ["redux-saga/effects", "redux-saga", "reduxsauce", "reselect"], factory);
	else if(typeof exports === 'object')
		exports["redux-saga-process"] = factory(require("redux-saga/effects"), require("redux-saga"), require("reduxsauce"), require("reselect"));
	else
		root["redux-saga-process"] = factory(root["_"], root["_"], root["_"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runProcesses = exports.connectReducers = undefined;

var _effects = __webpack_require__(0);

var _reduxsauce = __webpack_require__(4);

var _reselect = __webpack_require__(5);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _marked = [runProcesses].map(regeneratorRuntime.mark);

function runProcesses(categories) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, categoryID, category, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, processID, process, _process$config, config, SagaProcess;

  return regeneratorRuntime.wrap(function runProcesses$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = Object.keys(categories)[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 40;
            break;
          }

          categoryID = _step.value;
          category = categories[categoryID];
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 11;
          _iterator2 = Object.keys(category)[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 23;
            break;
          }

          processID = _step2.value;
          process = category[processID];
          _process$config = process.config, config = _process$config === undefined ? {} : _process$config;
          SagaProcess = new process(config);
          _context.next = 20;
          return (0, _effects.spawn)(SagaProcess.call(SagaProcess.processInit, process));

        case 20:
          _iteratorNormalCompletion2 = true;
          _context.next = 13;
          break;

        case 23:
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context['catch'](11);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t0;

        case 29:
          _context.prev = 29;
          _context.prev = 30;

          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }

        case 32:
          _context.prev = 32;

          if (!_didIteratorError2) {
            _context.next = 35;
            break;
          }

          throw _iteratorError2;

        case 35:
          return _context.finish(32);

        case 36:
          return _context.finish(29);

        case 37:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 40:
          _context.next = 46;
          break;

        case 42:
          _context.prev = 42;
          _context.t1 = _context['catch'](3);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 46:
          _context.prev = 46;
          _context.prev = 47;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 49:
          _context.prev = 49;

          if (!_didIteratorError) {
            _context.next = 52;
            break;
          }

          throw _iteratorError;

        case 52:
          return _context.finish(49);

        case 53:
          return _context.finish(46);

        case 54:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[3, 42, 46, 54], [11, 25, 29, 37], [30,, 32, 36], [47,, 49, 53]]);
}

function connectReducers(categories) {
  var processReducers = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = Object.keys(categories)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var categoryID = _step3.value;

      var category = categories[categoryID];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        var _loop = function _loop() {
          var processID = _step4.value;

          var process = category[processID];
          var _process$config2 = process.config,
              config = _process$config2 === undefined ? {} : _process$config2,
              reducer = process.reducer,
              _process$initialState = process.initialState,
              initialState = _process$initialState === undefined ? {} : _process$initialState,
              actionRoutes = process.actionRoutes,
              selectors = process.selectors;

          if (config.reduces && reducer) {
            processReducers[config.reduces] = (0, _reduxsauce.createReducer)(initialState, reducer);
          }
          if (selectors) {
            for (var selector in selectors) {
              var selectorValue = selectors[selector];
              if (Array.isArray(selectorValue)) {
                if (selectorValue.length === 1) {
                  var coreSelector = config.reduces ? function (state) {
                    return state[config.reduces];
                  } : function (state) {
                    return state;
                  };
                  selectors[selector] = _reselect.createSelector.apply(undefined, [coreSelector].concat(_toConsumableArray(selectors[selector])));
                } else {
                  selectors[selector] = _reselect.createSelector.apply(undefined, _toConsumableArray(selectors[selector]));
                }
              } else {
                throw new Error('Process Selectors must be an array of selectors');
              }
            }
          }
        };

        for (var _iterator4 = Object.keys(category)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return processReducers;
}

exports.connectReducers = connectReducers;
exports.runProcesses = runProcesses;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-constant-condition */

var _reduxSaga = __webpack_require__(3);

var _effects = __webpack_require__(0);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function cancellablePromise(p, onCancel) {
  p[_reduxSaga.CANCEL] = onCancel; // eslint-disable-line
  return p;
}

var Process = function () {
  function Process(props, State) {
    _classCallCheck(this, Process);

    this.props = props;
    this.__classTasks = [];
    this.__savedTasks = {};
    this.__checkStatics = this.__checkStatics;
    this.__getPattern = this.__getPattern;
    this.state = State;
  }

  _createClass(Process, [{
    key: '__getPattern',
    value: function __getPattern(_types) {
      var patterns = [];

      var types = void 0;
      var isObject = void 0;
      if (Array.isArray(_types) === false && (typeof _types === 'undefined' ? 'undefined' : _typeof(_types)) === 'object') {
        types = Object.keys(_types);
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
          switch (typeof params === 'undefined' ? 'undefined' : _typeof(params)) {
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
                return Object.keys(type).every(function (x) {
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

        for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    }
  }, {
    key: '__checkStatics',
    value: regeneratorRuntime.mark(function __checkStatics(target) {
      var actionRoutes, selectors, cancelTypes, name, monitorPattern, cancelPattern, stopCheck, _ref, monitorAction, stopAction, route, task, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _task;

      return regeneratorRuntime.wrap(function __checkStatics$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              actionRoutes = target.actionRoutes, selectors = target.selectors, cancelTypes = target.cancelTypes, name = target.name;
              monitorPattern = this.__getPattern(actionRoutes), cancelPattern = this.__getPattern(cancelTypes);


              this.__selectors = selectors;

              _context.prev = 3;
              stopCheck = void 0;

            case 5:
              if (stopCheck) {
                _context.next = 35;
                break;
              }

              _context.next = 8;
              return (0, _effects.race)({
                monitorAction: (0, _effects.take)(monitorPattern),
                cancelAction: (0, _effects.take)(cancelPattern)
              });

            case 8:
              _ref = _context.sent;
              monitorAction = _ref.monitorAction;
              stopAction = _ref.stopAction;

              if (!monitorAction) {
                _context.next = 21;
                break;
              }

              route = actionRoutes[monitorAction.type];

              if (!(typeof this[route] !== 'function')) {
                _context.next = 16;
                break;
              }

              console.warn(name + '\'s Action Route ' + route + ' is not a function');
              return _context.abrupt('continue', 5);

            case 16:
              _context.next = 18;
              return (0, _effects.fork)([this, this[route]], monitorAction);

            case 18:
              task = _context.sent;

              this.__classTasks.push(task);
              return _context.abrupt('continue', 5);

            case 21:
              if (!stopAction) {
                _context.next = 33;
                break;
              }

              if (!(typeof this.shouldProcessCancel === 'function')) {
                _context.next = 28;
                break;
              }

              _context.next = 25;
              return (0, _effects.apply)(this, this.shouldProcessCancel, [stopAction]);

            case 25:
              stopCheck = _context.sent;
              _context.next = 29;
              break;

            case 28:
              stopCheck = true;

            case 29:
              if (!stopCheck) {
                _context.next = 33;
                break;
              }

              if (!(typeof this.processCancels === 'function')) {
                _context.next = 33;
                break;
              }

              _context.next = 33;
              return (0, _effects.apply)(this, this.processCancels);

            case 33:
              _context.next = 5;
              break;

            case 35:
              _context.next = 40;
              break;

            case 37:
              _context.prev = 37;
              _context.t0 = _context['catch'](3);

              console.error(name + '\'s Check Statics is cancelling', _context.t0.message);

            case 40:

              console.log('Cancelling Process: ' + name);

              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 44;
              _iterator2 = this.__classTasks[Symbol.iterator]();

            case 46:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 54;
                break;
              }

              _task = _step2.value;

              if (!_task.isRunning()) {
                _context.next = 51;
                break;
              }

              _context.next = 51;
              return (0, _effects.cancel)(_task);

            case 51:
              _iteratorNormalCompletion2 = true;
              _context.next = 46;
              break;

            case 54:
              _context.next = 60;
              break;

            case 56:
              _context.prev = 56;
              _context.t1 = _context['catch'](44);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t1;

            case 60:
              _context.prev = 60;
              _context.prev = 61;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 63:
              _context.prev = 63;

              if (!_didIteratorError2) {
                _context.next = 66;
                break;
              }

              throw _iteratorError2;

            case 66:
              return _context.finish(63);

            case 67:
              return _context.finish(60);

            case 68:

              this.__classTasks = [];

            case 69:
            case 'end':
              return _context.stop();
          }
        }
      }, __checkStatics, this, [[3, 37], [44, 56, 60, 68], [61,, 63, 67]]);
    })
  }, {
    key: 'saveTask',
    value: regeneratorRuntime.mark(function saveTask(task, category, id) {
      var prevTasks;
      return regeneratorRuntime.wrap(function saveTask$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              prevTasks = this.__savedTasks;

              if (!(prevTasks[category] && prevTasks[category][id])) {
                _context2.next = 5;
                break;
              }

              console.warn('You must cancel a task before you set a new task with same category and id. We are cancelling it for you');
              _context2.next = 5;
              return (0, _effects.apply)(this, this.cancelTask, [category, id]);

            case 5:

              this.__savedTasks = _extends({}, prevTasks, _defineProperty({}, category, _extends({}, prevTasks[category], _defineProperty({}, id, task))));

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, saveTask, this);
    })
  }, {
    key: 'cancelTask',
    value: regeneratorRuntime.mark(function cancelTask(category, id) {
      var task;
      return regeneratorRuntime.wrap(function cancelTask$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(this.__savedTasks[category] && this.__savedTasks[category][id])) {
                _context3.next = 7;
                break;
              }

              task = this.__savedTasks[category][id];

              if (!task.isRunning()) {
                _context3.next = 5;
                break;
              }

              _context3.next = 5;
              return (0, _effects.cancel)(task);

            case 5:
              _context3.next = 8;
              break;

            case 7:
              console.warn('Attempted to cancel a task that doesnt exist', category, id);

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, cancelTask, this);
    })
  }, {
    key: 'cancelCategory',
    value: regeneratorRuntime.mark(function cancelCategory(category) {
      var ids, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, id;

      return regeneratorRuntime.wrap(function cancelCategory$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.__savedTasks[category]) {
                _context4.next = 30;
                break;
              }

              ids = Object.keys(this.__savedTasks[category]);
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context4.prev = 5;
              _iterator3 = ids[Symbol.iterator]();

            case 7:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context4.next = 14;
                break;
              }

              id = _step3.value;
              _context4.next = 11;
              return (0, _effects.apply)(this, this.cancelTask, [category, id]);

            case 11:
              _iteratorNormalCompletion3 = true;
              _context4.next = 7;
              break;

            case 14:
              _context4.next = 20;
              break;

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4['catch'](5);
              _didIteratorError3 = true;
              _iteratorError3 = _context4.t0;

            case 20:
              _context4.prev = 20;
              _context4.prev = 21;

              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }

            case 23:
              _context4.prev = 23;

              if (!_didIteratorError3) {
                _context4.next = 26;
                break;
              }

              throw _iteratorError3;

            case 26:
              return _context4.finish(23);

            case 27:
              return _context4.finish(20);

            case 28:
              _context4.next = 31;
              break;

            case 30:
              console.warn('Attempted to cancel tasks of a category that doesnt exist', category);

            case 31:
            case 'end':
              return _context4.stop();
          }
        }
      }, cancelCategory, this, [[5, 16, 20, 28], [21,, 23, 27]]);
    })
  }, {
    key: 'cancelAllTasks',
    value: regeneratorRuntime.mark(function cancelAllTasks() {
      var categories, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, category;

      return regeneratorRuntime.wrap(function cancelAllTasks$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              categories = Object.keys(this.__saveTasks);
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context5.prev = 4;
              _iterator4 = categories[Symbol.iterator]();

            case 6:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context5.next = 13;
                break;
              }

              category = _step4.value;
              _context5.next = 10;
              return (0, _effects.apply)(this, this.cancelCategory, [category]);

            case 10:
              _iteratorNormalCompletion4 = true;
              _context5.next = 6;
              break;

            case 13:
              _context5.next = 19;
              break;

            case 15:
              _context5.prev = 15;
              _context5.t0 = _context5['catch'](4);
              _didIteratorError4 = true;
              _iteratorError4 = _context5.t0;

            case 19:
              _context5.prev = 19;
              _context5.prev = 20;

              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }

            case 22:
              _context5.prev = 22;

              if (!_didIteratorError4) {
                _context5.next = 25;
                break;
              }

              throw _iteratorError4;

            case 25:
              return _context5.finish(22);

            case 26:
              return _context5.finish(19);

            case 27:
            case 'end':
              return _context5.stop();
          }
        }
      }, cancelAllTasks, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    })
  }, {
    key: 'select',
    value: regeneratorRuntime.mark(function select(selector) {
      var results, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, selected;

      return regeneratorRuntime.wrap(function select$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!(typeof selector === 'string' && this.__selectors && Object.keys(this.__selectors).includes(selector))) {
                _context6.next = 6;
                break;
              }

              _context6.next = 3;
              return (0, _effects.select)(this.__selectors[selector]);

            case 3:
              return _context6.abrupt('return', _context6.sent);

            case 6:
              if (!(typeof selector === 'function')) {
                _context6.next = 12;
                break;
              }

              _context6.next = 9;
              return (0, _effects.select)(selector);

            case 9:
              return _context6.abrupt('return', _context6.sent);

            case 12:
              if (!Array.isArray(selector)) {
                _context6.next = 43;
                break;
              }

              results = [];
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context6.prev = 17;
              _iterator5 = selector[Symbol.iterator]();

            case 19:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context6.next = 29;
                break;
              }

              selected = _step5.value;
              _context6.t0 = results;
              _context6.next = 24;
              return (0, _effects.apply)(this, this.select, [selected]);

            case 24:
              _context6.t1 = _context6.sent;

              _context6.t0.push.call(_context6.t0, _context6.t1);

            case 26:
              _iteratorNormalCompletion5 = true;
              _context6.next = 19;
              break;

            case 29:
              _context6.next = 35;
              break;

            case 31:
              _context6.prev = 31;
              _context6.t2 = _context6['catch'](17);
              _didIteratorError5 = true;
              _iteratorError5 = _context6.t2;

            case 35:
              _context6.prev = 35;
              _context6.prev = 36;

              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }

            case 38:
              _context6.prev = 38;

              if (!_didIteratorError5) {
                _context6.next = 41;
                break;
              }

              throw _iteratorError5;

            case 41:
              return _context6.finish(38);

            case 42:
              return _context6.finish(35);

            case 43:
            case 'end':
              return _context6.stop();
          }
        }
      }, select, this, [[17, 31, 35, 43], [36,, 38, 42]]);
    })
  }, {
    key: 'createObservable',
    value: function createObservable(name, handleCancel) {
      for (var _len = arguments.length, cancelArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        cancelArgs[_key - 2] = arguments[_key];
      }

      var _this = this;

      var actionQueue = [];
      var dispatchQueue = [];
      var observerRef = Symbol(name);
      this[observerRef] = function () {
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
        delete _this[observerRef];
        handleCancel.apply(undefined, cancelArgs.concat([name]));
      };

      return {
        onData: this[observerRef],
        onCancel: function onCancel() {
          _onCancel();
          return _effects.cancelled;
        },
        getNext: function getNext() {
          var promise = void 0;
          if (actionQueue.length) {
            promise = Promise.resolve(actionQueue.shift());
          } else {
            promise = new Promise(function (resolve) {
              return dispatchQueue.push(resolve);
            });
          }
          return cancellablePromise(promise, _onCancel);
        }
      };
    }
  }, {
    key: 'processInit',
    value: regeneratorRuntime.mark(function processInit(target) {
      var name, staticsTask, startTask;
      return regeneratorRuntime.wrap(function processInit$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              name = target.name;
              _context7.next = 3;
              return (0, _effects.put)({ type: 'PROCESS_STARTS', name: name });

            case 3:
              _context7.next = 5;
              return (0, _effects.fork)([this, this.__checkStatics], target);

            case 5:
              staticsTask = _context7.sent;
              startTask = void 0;

              if (!(typeof this.processStarts === 'function')) {
                _context7.next = 11;
                break;
              }

              _context7.next = 10;
              return (0, _effects.fork)([this, this.processStarts]);

            case 10:
              startTask = _context7.sent;

            case 11:
              this.__classTasks.push(staticsTask, startTask);
              _context7.next = 14;
              return (0, _effects.put)({ type: 'WAIT' });

            case 14:
            case 'end':
              return _context7.stop();
          }
        }
      }, processInit, this);
    })
  }]);

  return Process;
}();

exports.default = Process;

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = __webpack_require__(1);

Object.defineProperty(exports, 'runProcesses', {
  enumerable: true,
  get: function get() {
    return _effects.runProcesses;
  }
});
Object.defineProperty(exports, 'connectReducers', {
  enumerable: true,
  get: function get() {
    return _effects.connectReducers;
  }
});

var _process = __webpack_require__(2);

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