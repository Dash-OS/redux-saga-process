!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(require("lodash"),require("redux-saga/effects"),require("to-redux-type"),require("invoke-if"),require("react"),require("saga-task-manager"),require("hoist-non-react-statics"),require("reducer-generator-object-map"),require("reducer-generator-array-map"),require("reducer-generator-reducer"),require("reducer-generator-wildcard"),require("redux-saga"),require("wildcard-utils"),require("promise-map-es6")):"function"==typeof define&&define.amd?define("redux-saga-process",["lodash","redux-saga/effects","to-redux-type","invoke-if","react","saga-task-manager","hoist-non-react-statics","reducer-generator-object-map","reducer-generator-array-map","reducer-generator-reducer","reducer-generator-wildcard","redux-saga","wildcard-utils","promise-map-es6"],r):"object"==typeof exports?exports["redux-saga-process"]=r(require("lodash"),require("redux-saga/effects"),require("to-redux-type"),require("invoke-if"),require("react"),require("saga-task-manager"),require("hoist-non-react-statics"),require("reducer-generator-object-map"),require("reducer-generator-array-map"),require("reducer-generator-reducer"),require("reducer-generator-wildcard"),require("redux-saga"),require("wildcard-utils"),require("promise-map-es6")):e["redux-saga-process"]=r(e.lodash,e["redux-saga/effects"],e["to-redux-type"],e["invoke-if"],e.react,e["saga-task-manager"],e["hoist-non-react-statics"],e["reducer-generator-object-map"],e["reducer-generator-array-map"],e["reducer-generator-reducer"],e["reducer-generator-wildcard"],e["redux-saga"],e["wildcard-utils"],e["promise-map-es6"])}(this,function(e,r,t,n,a,o,c,i,s,u,f,l,p,d){return function(e){function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}var t={};return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p="",r(r.s=8)}([function(e,r,t){"use strict";function n(e){return"function"==typeof e&&Object.getPrototypeOf(e)&&Object.getPrototypeOf(e).isProcess===d}function a(e){var r;return o?(r=i.killAllTaskManagers(),o.set("hot",!0)):o=new Map(v()),c=i.createTaskManager("root",{name:"ROOT",log:e.log}),l.set("config",g(e)),r}t.d(r,"d",function(){return y}),t.d(r,"f",function(){return u}),t.d(r,"e",function(){return f}),t.d(r,"a",function(){return l}),t.d(r,"h",function(){return o}),t.d(r,"g",function(){return c}),t.d(r,"k",function(){return a}),t.d(r,"i",function(){return h}),t.d(r,"j",function(){return n}),t.d(r,"b",function(){return p}),t.d(r,"c",function(){return d});var o,c,i=t(11),s=(t.n(i),Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e}),u=new Map,f=new WeakMap,l=new Map,p=Symbol.for("@@saga-process-manager/$DO_NOT_MONITOR"),d=Symbol.for("@@saga-process-manager/$isProcess"),y=["config","actionRoutes","actionCreators","initialState","reducer","selectors","cancelTypes","startOnAction","loadProcess","loadOnAction"],v=function(){return new Map([["initialState",new Map],["reducer",new Map]])},h=function(){return{config:{}}},g=function(e){return s({log:!1,transformTypes:!0,wildcard:!0,optimizeReducers:!0,hasReducerWildcardTypes:!1,promise:Promise},e)}},function(e,r){e.exports=require("lodash")},function(e,r){e.exports=require("redux-saga/effects")},function(e,r){e.exports=require("to-redux-type")},function(e,r,t){"use strict";function n(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function a(e){var r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},t=void 0,a=[];if(e instanceof Map)t=[n(e.keys())];else if(i.a.isPlainObject(e))t=r.handleObject&&"match"===r.handleObject?[e]:Object.keys(e);else{if("function"!=typeof e&&"string"!=typeof e)return l.b;t=[e]}var c=!0,s=!1,u=void 0;try{for(var f,p,d=t[Symbol.iterator]();!(c=(f=d.next()).done);c=!0)p=f.value,o(p,a,r)}catch(e){s=!0,u=e}finally{try{!c&&d.return&&d.return()}finally{if(s)throw u}}return a}function o(e,r,t){if("function"==typeof e)r.push(e);else if("string"==typeof e)if(e=f.a(e),s.hasWildcard(e)&&!0===t.wildcard){t.hasWildcard=!0;var n=new s.Wildcard(e);r.push(function(e){return n.match(e.type)})}else r.push(e);else if(Array.isArray(e))if(e=f.a(e),!0===t.wildcard&&s.hasWildcard(e)){t.hasWildcard=!0;var a=new s.Wildcard(e);r.push(function(e){return a.match(e.type)})}else r.push(e);else i.a.isPlainObject(e)&&r.push(function(r){return Object.keys(e).every(function(t){return e[t]===r[t]})})}r.a=a;var c=t(1),i=t.n(c),s=t(30),u=(t.n(s),t(3)),f=t.n(u),l=t(0)},function(e,r,t){"use strict";function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function a(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function o(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}function c(e,r){return console.log("Selected: ",e),"function"==typeof r?r(v(e)):null===r?v(e):function(e){return i(e)}}function i(e){var r=function(r){function t(){var e,r,o,c;n(this,t);for(var i=arguments.length,s=Array(i),u=0;u<i;u++)s[u]=arguments[u];return r=o=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this,s])),o.addExtraProps=function(e){return e},c=r,a(o,c)}return o(t,r),y(t,[{key:"render",value:function(){return u.createElement(e,this.addExtraProps(this.props))}}]),t}(u.Component);return r.WrappedComponent=e,p.a(r,e)}function s(e,r,t){if(console.log("Reduction: ",e),console.log(f.f.get(t)),!f.f.has(t))return r;var n=f.e.get(f.f.get(t));if(console.log(n),!n.compiled||!n.compiled.public)return r;var a=!0,o=!1,c=void 0;try{for(var i,s=e[t][Symbol.iterator]();!(a=(i=s.next()).done);a=!0){var u=i.value,l=n.compiled.public[u];l||"actions"!==u||(l=n.compiled.public.actionCreators),l&&(r[u]=d({},r[u],l))}}catch(e){o=!0,c=e}finally{try{!a&&s.return&&s.return()}finally{if(o)throw c}}return r}r.a=c;var u=t(10),f=(t.n(u),t(0)),l=t(12),p=t.n(l),d=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e},y=function(){function e(e,r){for(var t,n=0;n<r.length;n++)t=r[n],t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}return function(r,t,n){return t&&e(r.prototype,t),n&&e(r,n),r}}(),v=function(e){var r=Object.keys(e).reduce(function(){for(var r=arguments.length,t=Array(r),n=0;n<r;n++)t[n]=arguments[n];return s.apply(void 0,[e,t])},{});return console.log(f.f),r}},function(e,r){e.exports=require("invoke-if")},function(e,r,t){"use strict";function n(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function a(e,r,t,a){var o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:"object",i=t.schema,s=i.processID,u=c.a.get(i,e+"."+r);if(u){var f,l=a.get(r)||new Map;"object"===o?f=Object.assign({},l.get(s),u):"array"===o&&(f=[[n(l.get(s)),n(u)]]),l.set(s,f),a.set(r,l)}}r.a=a;var o=t(1),c=t.n(o)},function(e,r,t){t(9),e.exports=t(13)},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(5);r.default=n.a},function(e,r){e.exports=require("react")},function(e,r){e.exports=require("saga-task-manager")},function(e,r){e.exports=require("hoist-non-react-statics")},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(14),a=t(5),o=t(15),c=t(27);t.d(r,"buildProcesses",function(){return o.a}),t.d(r,"runProcesses",function(){return c.a}),t.d(r,"Process",function(){return n.a}),t.d(r,"connectProcesses",function(){return a.a})},function(e,r,t){"use strict";function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}var a=t(0),o=function e(){n(this,e)};o.isProcess=a.c,r.a=o},function(e,r,t){"use strict";function n(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function a(e,r,t){if(p.k(r),!h.a.isPlainObject(e))throw new Error("[saga-process] buildProcesses expects a plain object");return o(e,t),l(),console.log("Reducer"),{processIDs:new Set([n(p.f.keys())]),processReducers:p.a.get("reducers")}}function o(e,r,t){for(var n in e){var a=e[n];c(t,n,""+(t&&t+"."||"")+n,a,r)}}function c(e,r,t,n,a){return p.j(n)?u(t,n):"function"==typeof n&&"function"==typeof a?i(n,r,t,a):h.a.isPlainObject(n)?o(n,a,t):void 0}function i(e,r,t,n){var a=n(e,r,t);return p.j(a)?u(t,a):h.a.isPlainObject(a)&&p.j(a.process)?u(t,s(a)):void 0}function s(e){var r=e.process,t=!0,n=!1,a=void 0;try{for(var o,c,i=Object.keys(e)[Symbol.iterator]();!(t=(o=i.next()).done);t=!0)"process"!==(c=o.value)&&(r[c]=e[c])}catch(e){n=!0,a=e}finally{try{!t&&i.return&&i.return()}finally{if(n)throw a}}return r}function u(e,r){if(p.e.has(r))return void console.warn("ProcessSchema Found! Already Running?");var t=r.config&&r.config.pid||e,n=b({},p.i(),{processPath:e,processID:t},h.a.pick(r,p.d));return r.actions&&!n.actionCreators&&(n.actionCreators=r.actions),p.f.set(t,r),p.e.set(r,n),f({processor:r,schema:n})}function f(e){var r=!0,t=!1,n=void 0;try{for(var a,o,c=Object.keys(e.schema)[Symbol.iterator]();!(r=(a=c.next()).done);r=!0)o=a.value,"function"==typeof d[o]&&d[o](e,p.h,p.a)}catch(e){t=!0,n=e}finally{try{!r&&c.return&&c.return()}finally{if(t)throw n}}}function l(){var e=!0,r=!1,t=void 0;try{for(var n,a=p.h[Symbol.iterator]();!(e=(n=a.next()).done);e=!0){var o=n.value,c=g(o,2),i=c[0],s=c[1];"function"==typeof y[i]&&y[i](s,p.f,p.e,p.h,p.a)}}catch(e){r=!0,t=e}finally{try{!e&&a.return&&a.return()}finally{if(r)throw t}}}r.a=a;var p=t(0),d=t(16),y=t(21),v=t(1),h=t.n(v),g=function(){function e(e,r){var t=[],n=!0,a=!1,o=void 0;try{for(var c,i=e[Symbol.iterator]();!((n=(c=i.next()).done)||(t.push(c.value),r&&t.length===r));n=!0);}catch(e){a=!0,o=e}finally{try{!n&&i.return&&i.return()}finally{if(a)throw o}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),b=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e}},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(17);t.d(r,"reducer",function(){return n.a});var a=t(18);t.d(r,"actionCreators",function(){return a.a});var o=t(19);t.d(r,"selectors",function(){return o.a});var c=t(20);t.d(r,"loadProcess",function(){return c.a})},function(e,r,t){"use strict";function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r,t){var a=e.schema;if(a.config.reduces){var c,s,u;if(Array.isArray(a.config.reduces)){if(!i.a.isPlainObject(a.reducer))throw new Error(a.processID+" compiltation failed.  When providing an array for config.reducers, the reducer should be a plain object mapping each provided reducer key to a valid process reducer.");c=a.config.reduces,s=a.reducer,u=a.initialState||{}}else"string"==typeof a.config.reduces&&(c=[a.config.reduces],s=n({},a.config.reduces,a.reducer),u=n({},a.config.reduces,a.initialState));var f=!0,l=!1,p=void 0;try{for(var d,y,v=c[Symbol.iterator]();!(f=(d=v.next()).done);f=!0)y=d.value,o(y,s,u,e,r,t)}catch(e){l=!0,p=e}finally{try{!f&&v.return&&v.return()}finally{if(l)throw p}}}}function o(e,r,t,n,a,o){var c=r[e];if(c){var i=n.schema.processID,s=o.get("config"),f=t[e],l=a.get("reducer"),p=a.get("initialState"),d=void 0,y={},v={wildcard:!1!==s.wildcard&&!0===n.schema.config.wildcard};u.a([l.has(e),function(){d=l.get(e)}],[f,function(){return u.a([p.has(e),function(){y=p.get(e)}],[!0,function(){Object.assign(y,f),p.set(e,y)}])}]),d||(d=new Map),d.set(i,{config:v,reducer:c}),l.set(e,d)}}r.a=a;var c=t(1),i=t.n(c),s=t(6),u=t.n(s)},function(e,r,t){"use strict";function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=e.schema,n=t.actionCreators,a=void 0===n?{}:n;for(var o in t.compiled||(t.compiled={}),a)c(o,a[o],e);return d.a("compiled.public","actionCreators",e,r)}function o(e){var r=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},n=y({type:e},t);return function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];var o=!0,c=!1,i=void 0;try{for(var s,u,f=r[Symbol.iterator]();!(o=(s=f.next()).done);o=!0)u=s.value,n[u]=t.shift()}catch(e){c=!0,i=e}finally{try{!o&&f.return&&f.return()}finally{if(c)throw i}}return Object.assign.apply(Object,[n,t]),n}}function c(e,r,t){var a=t.schema,c=e.startsWith("!")?"private":"public";f.a(["private"==c,function(){e=e.slice(1)}],[function(){return!a.compiled[c]},function(){a.compiled[c]={}}],[function(){return!a.compiled[c].actionCreators},function(){a.compiled[c].actionCreators={}}]);var i,u=p.a(e);i=Array.isArray(r)?o(u,r):s.a.isPlainObject(r)?o(u,[],r):o(u),Object.assign(a.compiled[c].actionCreators,n({},e,i))}r.a=a;var i=t(1),s=t.n(i),u=t(6),f=t.n(u),l=t(3),p=t.n(l),d=t(7),y=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e}},function(e,r,t){"use strict";function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=e.schema,n=t.selectors,a=void 0===n?{}:n;t.compiled||(t.compiled={});var i=!0,s=!1,u=void 0;try{for(var f,l,p=Object.keys(a)[Symbol.iterator]();!(i=(f=p.next()).done);i=!0)l=f.value,o(l,a[l],t)}catch(e){s=!0,u=e}finally{try{!i&&p.return&&p.return()}finally{if(s)throw u}}c.a("compiled.public","selectors",e,r)}function o(e,r,t){if(r){var a=e.startsWith("!")?"private":"public";"private"==a&&(e=e.slice(1)),t.compiled[a]||(t.compiled[a]={}),r.recomputations?(!t.compiled[a].selectors&&(t.compiled[a].selectors={}),Object.assign(t.compiled[a].selectors,n({},e,r))):(!t.compiled[a].selectorCreators&&(t.compiled[a].selectorCreators={}),Object.assign(t.compiled[a].selectorCreators,n({},e,r)))}}r.a=a;var c=t(7)},function(e,r,t){"use strict";function n(e){e.schema.isAsync=!0}r.a=n},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n=t(22);t.d(r,"reducer",function(){return n.a})},function(e,r,t){"use strict";function n(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function a(e,r,t,n,a){var c=a.get("reducers")||{},i=!0,s=!1,u=void 0;try{for(var f,l=e[Symbol.iterator]();!(i=(f=l.next()).done);i=!0){var p=f.value,y=b(p,2),v=y[0],h=y[1],g=n.get("initialState").get(v);c[v]=d.a(g||{},o(v,h,a))}}catch(e){s=!0,u=e}finally{try{!i&&l.return&&l.return()}finally{if(s)throw u}}a.set("reducers",c)}function o(e,r,t){var a=3<arguments.length&&void 0!==arguments[3]?arguments[3]:{},c=t.get("config"),s=[],f=!1,p=Object.assign({},a),d=!0,y=!1,h=void 0;try{for(var b,m=r[Symbol.iterator]();!(d=(b=m.next()).done);d=!0){var x=b.value,w=x[1],O=void 0;if(w.config?(p=Object.assign(p,w.config),O=w.reducer):O=w,"function"==typeof O)c.optimizeReducers=!1,s.push(v.a(void 0,O));else if(Array.isArray(O))s.push.apply(s,n(o(e,O,t,p)));else if(i.a.isPlainObject(O)){if(!1!==c.transformTypes&&(O=u.a(O)),!0===c.wildcard&&!0===p.wildcard){var k=!0,j=!1,P=void 0;try{for(var A,q,S=Object.keys(O)[Symbol.iterator]();!(k=(A=S.next()).done);k=!0)if(q=A.value,q.includes("*")){f=!0;break}}catch(e){j=!0,P=e}finally{try{!k&&S.return&&S.return()}finally{if(j)throw P}}}f?s.push(g.a(void 0,O)):s.push(l.a(void 0,O))}}}catch(e){y=!0,h=e}finally{try{!d&&m.return&&m.return()}finally{if(y)throw h}}return t.set("config",c),s}r.a=a;var c=t(1),i=t.n(c),s=t(3),u=t.n(s),f=t(23),l=t.n(f),p=t(24),d=t.n(p),y=t(25),v=t.n(y),h=t(26),g=t.n(h),b=function(){function e(e,r){var t=[],n=!0,a=!1,o=void 0;try{for(var c,i=e[Symbol.iterator]();!((n=(c=i.next()).done)||(t.push(c.value),r&&t.length===r));n=!0);}catch(e){a=!0,o=e}finally{try{!n&&i.return&&i.return()}finally{if(a)throw o}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()},function(e,r){e.exports=require("reducer-generator-object-map")},function(e,r){e.exports=require("reducer-generator-array-map")},function(e,r){e.exports=require("reducer-generator-reducer")},function(e,r){e.exports=require("reducer-generator-wildcard")},function(e,r,t){"use strict";function n(){var e,r,t,n,i,s,u,f,l,y;return regeneratorRuntime.wrap(function(d){for(;;)switch(d.prev=d.next){case 0:d.prev=0,e=!0,r=!1,t=void 0,d.prev=4,n=o.f[Symbol.iterator]();case 6:if(e=(i=n.next()).done){d.next=17;break}return s=i.value,u=p(s,2),f=u[0],l=u[1],y={processID:f,processor:l,schema:o.e.get(l)},d.next=14,c.call([o.g,o.g.create],"processes",f,a,y);case 14:e=!0,d.next=6;break;case 17:d.next=23;break;case 19:d.prev=19,d.t0=d.catch(4),r=!0,t=d.t0;case 23:d.prev=23,d.prev=24,!e&&n.return&&n.return();case 26:if(d.prev=26,!r){d.next=29;break}throw t;case 29:return d.finish(26);case 30:return d.finish(23);case 31:d.next=36;break;case 33:d.prev=33,d.t1=d.catch(0),console.error(d.t1.message);case 36:case"end":return d.stop()}},d[0],this,[[0,33],[4,19,23,31],[24,,26,30]])}function a(e){var r,t,n,a,p,y,v,h,g;return regeneratorRuntime.wrap(function(d){for(;;)switch(d.prev=d.next){case 0:if(r=e.processID,t=e.processor,n=e.schema,a=void 0,p=o.h.get("instances"),p&&p.has(r)&&(y=p.get(r),a=y.state),!o.h.get("hot")){d.next=7;break}return d.next=7,c.call(i.delay,0);case 7:if(p=o.h.get("instances")||new Map,n.instance||(n.instance=new t(r,a,e)),p.set(r,n.instance),o.h.set("instances",p),v=o.a.get("config"),h={wildcard:!0===v.wildcard&&!0===n.config.wildcard,hasWildcard:!1},!(n.loadOnAction||n.loadProcess)){d.next=17;break}return g=n.loadOnAction&&f.a(n.loadOnAction,l({},h,{plainObject:"matches"})),d.next=17,c.call([n.instance,u.a],e,g,o.h);case 17:if(!n.actionRoutes&&!n.cancelTypes){d.next=20;break}return d.next=20,c.call([o.g,o.g.create],r,"subscribeToTypes",[n.instance,s.a],e,h,v);case 20:if(n.async||"function"!=typeof n.instance.processStarts){d.next=23;break}return d.next=23,c.call([o.g,o.g.create],r,"processStarts",[n.instance,n.instance.processStarts],r);case 23:case"end":return d.stop()}},d[1],this)}r.a=n;var o=t(0),c=t(2),i=(t.n(c),t(28)),s=(t.n(i),t(29)),u=t(38),f=t(4),l=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e},p=function(){function e(e,r){var t=[],n=!0,a=!1,o=void 0;try{for(var c,i=e[Symbol.iterator]();!((n=(c=i.next()).done)||(t.push(c.value),r&&t.length===r));n=!0);}catch(e){a=!0,o=e}finally{try{!n&&i.return&&i.return()}finally{if(a)throw o}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),d=[n,a].map(regeneratorRuntime.mark)},function(e,r){e.exports=require("redux-saga")},function(e,r,t){"use strict";function n(e,r){var t,n,p;return regeneratorRuntime.wrap(function(l){for(;;)switch(l.prev=l.next){case 0:if(t=e.schema,t.monitor={},n=void 0,p=void 0,!(t.startOnAction&&"function"==typeof t.instance.processStarts)){l.next=6;break}return l.next=6,a.call([t.instance,u.a],e,r);case 6:if(n=t.actionRoutes?o.a(t.actionRoutes,r):f.b,p=t.cancelTypes?o.a(t.cancelTypes,r):f.b,t.monitor.config=r,t.monitor.pattern=n,n===f.b&&p===f.b){l.next=14;break}return l.next=13,a.fork([this,c.a],n,p,e,{monitor:i.a,cancel:s.a});case 13:return l.abrupt("return",l.sent);case 14:case"end":return l.stop()}},l[0],this)}r.a=n;var a=t(2),o=(t.n(a),t(4)),c=t(31),i=t(32),s=t(36),u=t(37),f=t(0),l=[n].map(regeneratorRuntime.mark)},function(e,r){e.exports=require("wildcard-utils")},function(e,r,t){"use strict";function n(e,r,t,n){var c,i,s,u,f;return regeneratorRuntime.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:c=t.schema.instance,i=!0,o.prev=2;case 3:if(!i){o.next=20;break}return o.next=6,a.race({monitorAction:a.take(e),cancelAction:a.take(r)});case 6:if(s=o.sent,u=s.monitorAction,f=s.cancelAction,!u){o.next=14;break}return o.next=12,a.fork([c,n.monitor],u,t);case 12:o.next=18;break;case 14:if(!f){o.next=18;break}return o.next=17,a.call([c,n.cancel],f,t);case 17:i=o.sent;case 18:o.next=3;break;case 20:o.next=25;break;case 22:o.prev=22,o.t0=o.catch(2),console.error("[monitorTypes]: "+o.t0.message);case 25:return o.prev=25,o.next=28,a.cancelled();case 28:if(!o.sent){o.next=30;break}console.info("MonitorTypes Cancelled: ",t);case 30:if("function"!=typeof c.processCancelled){o.next=33;break}return o.next=33,a.call([c,c.processCancelled]);case 33:return o.finish(25);case 34:case"end":return o.stop()}},o[0],this,[[2,22,25,34]])}r.a=n;var a=t(2),o=(t.n(a),[n].map(regeneratorRuntime.mark))},function(e,r,t){"use strict";function n(e,r){var t,n,s,u,f,l,p,d,y,v,h,g,b,m;return regeneratorRuntime.wrap(function(i){for(;;)switch(i.prev=i.next){case 0:t=r.schema,n=t.processID,s=t.actionRoutes,u=t.instance,f=t.processPath,l=[],o.a(e,s,r,l),p=!0,d=!1,y=void 0,i.prev=6,v=l[Symbol.iterator]();case 8:if(p=(h=v.next()).done){i.next=21;break}if(g=h.value,b=g,"function"!=typeof g&&(g=u[g]),"function"!=typeof g){i.next=17;break}return m=Symbol(e.type),i.delegateYield(a.g.create("actionRouteRunner",m,[u,c.a],r,g,e,b),"t0",15);case 15:i.next=18;break;case 17:console.error("[process-manager]: action route | "+n+" -> "+f+"."+b+" | is not a function");case 18:p=!0,i.next=8;break;case 21:i.next=27;break;case 23:i.prev=23,i.t1=i.catch(6),d=!0,y=i.t1;case 27:i.prev=27,i.prev=28,!p&&v.return&&v.return();case 30:if(i.prev=30,!d){i.next=33;break}throw y;case 33:return i.finish(30);case 34:return i.finish(27);case 35:case"end":return i.stop()}},i[0],this,[[6,23,27,35],[28,,30,34]])}r.a=n;var a=t(0),o=t(33),c=t(35),i=[n].map(regeneratorRuntime.mark)},function(e,r,t){"use strict";function n(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function a(e,r,t,a){var o,s=0;if(r instanceof Map)o=[n(r.values())];else{if(!c.a.isPlainObject(r))return;o=Object.keys(r).map(function(e){return r[e]})}var u=t.schema.monitor,f=!0,l=!1,p=void 0;try{for(var d,y,v=u.pattern[Symbol.iterator]();!(f=(d=v.next()).done);f=!0)y=d.value,i.a(e,y,t)&&a.push(o[s]),s++}catch(e){l=!0,p=e}finally{try{!f&&v.return&&v.return()}finally{if(l)throw p}}}r.a=a;var o=t(1),c=t.n(o),i=t(34)},function(e,r,t){"use strict";function n(e,r){var t;return"function"==typeof r?t=r(e):"string"==typeof r&&o.a(r)===e.type&&(t=!0),t}r.a=n;var a=t(3),o=t.n(a)},function(e,r,t){"use strict";function n(e,r,t,n){var c,i,s;return regeneratorRuntime.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.prev=0,o.next=3,a.call([e.schema.instance,r],t);case 3:o.next=9;break;case 5:o.prev=5,o.t0=o.catch(0),c=e.schema,i=c.processID,s=c.processPath,console.error("[process-manager]: action route | "+i+" -> "+s+"."+n+" | uncaught error: "+o.t0.message);case 9:case"end":return o.stop()}},o[0],this,[[0,5]])}r.a=n;var a=t(2),o=(t.n(a),[n].map(regeneratorRuntime.mark))},function(e,r,t){"use strict";function n(e,r){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if("function"!=typeof r.schema.instance.shouldProcessCancel){t.next=6;break}return t.next=3,a.call([r.schema.instance,r.schema.instance.shouldProcessCancel],e);case 3:return t.abrupt("return",t.sent);case 6:return t.abrupt("return",!0);case 7:case"end":return t.stop()}},o[0],this)}r.a=n;var a=t(2),o=(t.n(a),[n].map(regeneratorRuntime.mark))},function(e,r,t){"use strict";function n(e,r){var t,n,u;return regeneratorRuntime.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(t=e.processID,n=e.schema,s.prev=1,!(n.instance&&"function"==typeof n.instance.processStarts)){s.next=10;break}return u=c.a(n.startOnAction,i({},r,{parseObject:"matches"})),s.next=6,o.take(u);case 6:return s.next=8,o.call([a.g,a.g.create],t,"processStarts",[n.instance,n.instance.processStarts],t);case 8:s.next=11;break;case 10:console.warn("[saga-process-manager]: You specified an await startup action but * processStarts does not exist.  This is an anti-pattern.  ",t);case 11:s.next=16;break;case 13:s.prev=13,s.t0=s.catch(1),console.error("Error while awaiting startup: ",s.t0.message);case 16:return s.prev=16,s.next=19,o.cancelled();case 19:if(!s.sent){s.next=21;break}console.warn("Process Cancelled while awaiting Startup ",t);case 21:return s.finish(16);case 22:case"end":return s.stop()}},s[0],this,[[1,13,16,22]])}r.a=n;var a=t(0),o=t(2),c=(t.n(o),t(4)),i=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e},s=[n].map(regeneratorRuntime.mark)},function(e,r,t){"use strict";(function(e){function n(r,t,n){var o,f,l,p,d,y,v,h,g,b;return regeneratorRuntime.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:if(o=r.schema,f=o.processID,l=o.loadOnAction,p=o.loadProcess,d=o.instance,y=void 0,!l){s.next=9;break}if(t){s.next=6;break}throw new Error("Failed to Asynchronously Load "+f+" | Invalid loadOnAction property: "+l);case 6:return s.next=8,a.take(t);case 8:y=s.sent;case 9:if(p){s.next=11;break}return s.abrupt("return");case 11:if(v=n.get("scope")||new Map,h=void 0,e.hot){s.next=18;break}if(!(h=v.get(f))){s.next=18;break}return o.instance.scope=h,s.abrupt("return",h);case 18:if(g=new c.a,"function"!=typeof p){s.next=24;break}return s.next=22,a.call([d,p],g,u,y);case 22:s.next=27;break;case 24:if(!p||"function"!=typeof p.then){s.next=27;break}return s.next=27,a.call(function(){return p(g,u,y)});case 27:if(s.t0=g.size,!s.t0){s.next=32;break}return s.next=31,a.call(function(){return g});case 31:s.t0=s.sent;case 32:return b=s.t0,b&&(h=i({},b),o.instance.scope=h,v.set(f,h),n.set("scope",v)),s.abrupt("return",h);case 35:case"end":return s.stop()}},s[0],this)}r.a=n;var a=t(2),o=(t.n(a),t(40)),c=t.n(o),i=Object.assign||function(e){for(var r,t=1;t<arguments.length;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e},s=[n].map(regeneratorRuntime.mark),u=function(e){return e.default}}).call(r,t(39)(e))},function(e,r){e.exports=function(e){if(!e.webpackPolyfill){var r=Object.create(e);r.children||(r.children=[]),Object.defineProperty(r,"loaded",{enumerable:!0,get:function(){return r.l}}),Object.defineProperty(r,"id",{enumerable:!0,get:function(){return r.i}}),Object.defineProperty(r,"exports",{enumerable:!0}),r.webpackPolyfill=1}return r}},function(e,r){e.exports=require("promise-map-es6")}])});