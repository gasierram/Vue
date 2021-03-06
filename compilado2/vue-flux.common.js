module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fae3");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "06d9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dac9");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "088e":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.flux-parallax img{position:absolute;visibility:hidden\n}", ""]);

// exports


/***/ }),

/***/ "097d":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var speciesConstructor = __webpack_require__("ebd6");
var promiseResolve = __webpack_require__("bcaa");

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1ab6":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("7aa2");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("1d350872", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "1d36":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7ecf");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2350":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "281b":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("77e2");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "285f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8360");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__("aae3");
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "304b":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-controls{position:absolute;top:50%;left:0;right:0;margin-top:-25px;text-align:center;z-index:100\n}\n.vue-flux .flux-controls.fade-enter,.vue-flux .flux-controls.fade-leave-to{opacity:0\n}\n.vue-flux .flux-controls.fade-enter-active,.vue-flux .flux-controls.fade-leave-active{-webkit-transition:opacity .3s ease-in;transition:opacity .3s ease-in\n}\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{position:absolute;top:0;width:50px;height:50px;cursor:pointer;border-radius:50%;background-color:rgba(0,0,0,.6);background-repeat:no-repeat;background-position:50%;background-size:40%;-webkit-transition:background-color .2s ease-in;transition:background-color .2s ease-in\n}\n.vue-flux .flux-controls .previous{left:25px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEX///////////////////////////////////////////9/gMdvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAuUAAALlARv+XnsAAABUSURBVEjH7dYxCgAgEAPB8weX/39WFBtBbsFSY2sYyzXicDLq0wQDKQGQAKiJAZTEvC+IRgPBYAEyYOB1AAf4hAkTXxB5nySOGmaRw4pp5rhv34MOQwscJ7/MrxQAAAAASUVORK5CYII=)\n}\n.vue-flux .flux-controls .play{position:relative;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAs6AAALOgFkf1cNAAACy0lEQVR42uWbS2hUVxyHv78PLKKiFgXBiIgvBEVKwZWL4kJrF7oQCSpoAlYkuhCyq4hQ2goqSBFBsNBCoXShbgp15XsTQSGKqKj1QdTYFCVQiuDic5FcGkQhj0nm3vl/6+Ge+X3zO2fumTkXhoi6S51NVtQbapfallVAh//Toc7KLED1jbpPnZJVQMF99fPMAgqOqZ9mFqD6UP06s4CC8+r0MucZN8rX/wJ4pu5VP8nYgIHcU5dna8BAFgM31e8rvUiOoAHvt2FHZgEFf6iTs0yBD/EV0K3uVidkFAAwFTgB3FKXZBRQsBS4q+5XZ2YUUPAtcEVtzioAYBnwm/q7OimjgILNwAt1Z1YBADOAk+ptdUFGAQDRPy0equ213GBVRcBADgOX1Y1ZBQAsB86qP4/0BqqqAgq292+3W7IKAJgNnFI71XkZBRQ5VgBP1DZ1WjYBAzkOXFLXZhUAsBI4p55Qx2cUULAbeKxuyyoAYC7wi3pdnZNRQJHzs/5FslWdmk1AwUTgJ+Ciui6jAACBWcDfGQX0At8A8yPiBsCEROHPA80R0ZNtEXwKtETEmvfDZ2jAIeDHiHjxsRc0ogCBl8DGiOjIdiv8H3AQaBpM+EZrwFVgU0S8zLYd7gLaImL1UMM3QgOOAUcjomu4F6iqgH+AzRFxoRabhCrxlr6/zppqEb5qDbgGbIiI7lpvE8vOc6A9IlbVOnwVGnAS+CEinozWAGUV8BrYGhF/jvZAZZwCh4B5YxG+bA3oBNZHxPOxHLQMDegG9kfEyrEOX4YG/AociIhH9XoD9RLQC7RGxJl6168eU+Aofb/JnSnB9BvTBtwBvhzN7/SyNqAH+C4ilpUt/LAY4lnh0+pCGolBCuhVt9CIDPKhqco8WVrLRfAvYG1EPKjSB1qLRfAVcARYVLXwtZgC5+pxxL3eAq6p/47kaFrVBexRmxolzzsZ+iOF4pXTWQAAAABJRU5ErkJggg==)\n}\n.vue-flux .flux-controls .pause{position:relative;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI0OTk3MkUwNjY1NzExRThBMjA5QkQ5QTNFMUM4NDcxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI0OTk3MkUxNjY1NzExRThBMjA5QkQ5QTNFMUM4NDcxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjQ5OTcyREU2NjU3MTFFOEEyMDlCRDlBM0UxQzg0NzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjQ5OTcyREY2NjU3MTFFOEEyMDlCRDlBM0UxQzg0NzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz77QUaQAAAACVBMVEUAAAD///////9zeKVjAAAAA3RSTlP//wDXyg1BAAAANElEQVR42uzMsQkAMAwEsY/3H9qViwS8QNC1B0pN56mu1hsAAAAAAAAAAAAAAAAAvwMtwAAbrRgBOJHO/gAAAABJRU5ErkJggg==)\n}\n.vue-flux .flux-controls .next{right:25px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEX///////////////////////////////////////////9/gMdvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAuUAAALlARv+XnsAAABYSURBVEjH7dYxDoAwDEPR5Ab1/S8LVEgsyL8SG3XWWK/dnKpnumA0/L4lAOSJE/DEtXfEBBxxBwYFBH8IEWJbggL4RIAAPwFWC+VDqXEtYrFyNWO5v58HB4q9HAkl7KTYAAAAAElFTkSuQmCC)\n}\n.vue-flux .flux-controls .next:hover,.vue-flux .flux-controls .pause:hover,.vue-flux .flux-controls .play:hover,.vue-flux .flux-controls .previous:hover{background-color:rgba(0,0,0,.9)\n}\n@media (max-width:576px){\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{width:27.5px;height:27.5px;background-size:31%\n}\n}\n@media (min-width:577px) and (max-width:768px){\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{width:35px;height:35px;background-size:34%\n}\n}\n@media (min-width:769px) and (max-width:992px){\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{width:42.5px;height:42.5px;background-size:37%\n}\n}", ""]);

// exports


/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
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
  } return fn.apply(that, args);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "42b2":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux{position:relative\n}\n.vue-flux.fullscreen{width:100%;height:100%\n}\n.vue-flux img{position:absolute;visibility:hidden\n}\n.spinner{top:50%;left:50%;margin-top:-40px;margin-left:-40px;width:80px;z-index:12\n}\n.spinner,.spinner .pct{position:absolute;height:80px\n}\n.spinner .pct{right:0;left:0;line-height:80px;text-align:center;font-weight:700;z-index:1\n}\n.spinner .border{width:100%;height:100%;border:14px solid #f3f3f3;border-top-color:#3498db;border-bottom-color:#3498db;border-radius:50%;background-color:#f3f3f3;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite\n}\n@-webkit-keyframes spin{\n0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)\n}\nto{-webkit-transform:rotate(1turn);transform:rotate(1turn)\n}\n}\n@keyframes spin{\n0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)\n}\nto{-webkit-transform:rotate(1turn);transform:rotate(1turn)\n}\n}\n.mask{position:relative;overflow:visible\n}", ""]);

// exports


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesClient; });
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
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


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77e2":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("088e");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("2ff4fd11", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7aa2":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-caption{position:absolute;top:0;left:0;right:0;padding:8px;color:#fff;text-align:center;background-color:rgba(0,0,0,.65);z-index:100\n}\n.vue-flux .flux-caption.fade-enter,.vue-flux .flux-caption.fade-leave-to{opacity:0\n}\n.vue-flux .flux-caption.fade-enter-active,.vue-flux .flux-caption.fade-leave-active{-webkit-transition:opacity .3s ease-in;transition:opacity .3s ease-in\n}", ""]);

// exports


/***/ }),

/***/ "7ba9":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-pagination{position:absolute;left:50px;right:50px;bottom:20px;z-index:100\n}\n.vue-flux .flux-pagination ul{display:block;margin:0;padding:0;list-style-type:none;text-align:center\n}\n.vue-flux .flux-pagination li{display:inline-block;margin:0 8px;cursor:pointer\n}\n.vue-flux .flux-pagination li span.pagination-item{display:inline-block;width:16px;height:16px;border:2px solid #fff;border-radius:50%;background-color:rgba(0,0,0,.7);-webkit-transition:background-color .2s ease-in,border .2s ease-in;transition:background-color .2s ease-in,border .2s ease-in\n}\n.vue-flux .flux-pagination li span.pagination-item:hover{border:2px solid #000;background-color:#fff\n}\n.vue-flux .flux-pagination li.active span.pagination-item{background-color:#fff\n}", ""]);

// exports


/***/ }),

/***/ "7ecf":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("42b2");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("39193587", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "8256":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("98f5");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "8360":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("9216");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("f72cfe72", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "841f":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ad6e");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9216":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-index .fade-enter,.vue-flux .flux-index .fade-leave-to{opacity:0\n}\n.vue-flux .flux-index .fade-enter-active,.vue-flux .flux-index .fade-leave-active{-webkit-transition:opacity .3s ease-in;transition:opacity .3s ease-in\n}\n.vue-flux .flux-index .toggle{position:absolute;left:50%;bottom:55px;margin-left:-25px;width:50px;height:50px;cursor:pointer;border-radius:50%;background-color:rgba(0,0,0,.6);background-repeat:no-repeat;background-position:50%;background-size:40%;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAA6ElEQVRYhe2ZUQ2DMBRFK6ESkFAJSEBCJSABB0iYBCRUAlKQcPexLtlHW+4Ly7Ju9yTvj3ffCQktUAdgBZCIurkCADyAjcyIlYxI9icAwcHGWBi4GPqPinQyZCyfloakSSQt6QaSlnSDUBgYDf17RXozZMwOwIjH3TqrqTQwD53JjKHS78n+ueYgRPfkh/GsfKN/YDJOHAKRMTwv3sml5iiJ5zCWtSK8GjKmv9hcJC3pBpKWdANJX5Hub0d8GdzPu4cQvwZ6/Bo3LDXAF/33sDAWBmpHJJA0haRJJC3pBlel33Zi293Z+B2f9cNhdwgb0QAAAABJRU5ErkJggg==\");z-index:101\n}\n.vue-flux .flux-index .toggle:hover{-webkit-transition:background-color .2s ease-in;transition:background-color .2s ease-in;background-color:rgba(0,0,0,.9)\n}\n@media (max-width:576px){\n.vue-flux .flux-index .toggle{width:27.5px;height:27.5px;margin-left:-13.75px;background-size:31%\n}\n}\n@media (min-width:577px) and (max-width:768px){\n.vue-flux .flux-index .toggle{width:35px;height:35px;margin-left:-17.5px;background-size:34%\n}\n}\n@media (min-width:769px) and (max-width:992px){\n.vue-flux .flux-index .toggle{width:42.5px;height:42.5px;margin-left:-21.25px;background-size:37%\n}\n}\n.vue-flux .flux-index nav{position:absolute;top:0;left:0;right:0;bottom:0;display:block;margin:0;overflow:hidden;visibility:hidden\n}\n.vue-flux .flux-index nav.visible{z-index:101;visibility:visible\n}\n.vue-flux .flux-index ul{display:block;height:100%;margin:0;margin-top:100%;padding:18px 10px;list-style-type:none;text-align:center;overflow-y:auto;background-color:rgba(0,0,0,.8);-webkit-transition:all .5s linear;transition:all .5s linear\n}\n.vue-flux .flux-index li{position:relative;display:inline-block;margin:8px 8px;cursor:pointer;-webkit-transition:all .3s ease;transition:all .3s ease\n}\n.vue-flux .flux-index .mouse-over li:hover{-webkit-box-shadow:0 0 3px 2px hsla(0,0%,100%,.6);box-shadow:0 0 3px 2px hsla(0,0%,100%,.6)\n}\n.vue-flux .flux-index li.current{cursor:auto;border:1px solid #fff;-webkit-box-shadow:none;box-shadow:none\n}\n.vue-flux .flux-index ul>li:last-child{margin-bottom:26px\n}", ""]);

// exports


/***/ }),

/***/ "98f5":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("a425");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("65693972", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "9a04":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("1ab6");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a425":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-thumb{width:160px;height:90px\n}\n@media (max-width:386px){\n.vue-flux .flux-thumb{width:80px;height:45px\n}\n}\n@media (min-width:387px) and (max-width:576px){\n.vue-flux .flux-thumb{width:112px;height:63px\n}\n}", ""]);

// exports


/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "ad6e":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("304b");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("0817594f", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dac9":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("7ba9");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("5e9c3a97", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fae3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCaption.vue?vue&type=template&id=1659540e&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.caption)?_c('div',{staticClass:"flux-caption"},[_vm._v(_vm._s(_vm.caption))]):_vm._e()])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxCaption.vue?vue&type=template&id=1659540e&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCaption.vue?vue&type=script&lang=js&

//
//
//
//
//
//
/* harmony default export */ var FluxCaptionvue_type_script_lang_js_ = ({
  props: {
    slider: {
      type: Object
    }
  },
  computed: {
    vf: function vf() {
      if (this.slider) return this.slider;
      if (this.$parent.$options.name === 'VueFlux') return this.$parent.loaded ? this.$parent : undefined;
      console.warn('slider not referenced, check https://github.com/deulos/vue-flux/wiki/FluxCaption for help');
      return undefined;
    },
    caption: function caption() {
      if (!this.vf) return '';
      if (this.vf.transition.current !== undefined) return '';
      var currentImage = this.vf.currentImage();
      if (currentImage === undefined) return '';
      if (this.captions[currentImage.index] === undefined) return '';
      return this.captions[currentImage.index];
    },
    captions: function captions() {
      return this.vf.captions;
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxCaption.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxCaptionvue_type_script_lang_js_ = (FluxCaptionvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FluxCaption.vue?vue&type=style&index=0&lang=scss&
var FluxCaptionvue_type_style_index_0_lang_scss_ = __webpack_require__("9a04");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/FluxCaption.vue






/* normalize component */

var component = normalizeComponent(
  components_FluxCaptionvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "FluxCaption.vue"
/* harmony default export */ var FluxCaption = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxControls.vue?vue&type=template&id=77edd03a&
var FluxControlsvue_type_template_id_77edd03a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.display)?_c('div',{staticClass:"flux-controls"},[_c('div',{staticClass:"previous",on:{"click":function($event){_vm.vf.showImage('previous')}}}),_c('div',{class:_vm.autoplayClass,on:{"click":function($event){_vm.vf.toggleAutoplay()}}}),_c('div',{staticClass:"next",on:{"click":function($event){_vm.vf.showImage('next')}}})]):_vm._e()])}
var FluxControlsvue_type_template_id_77edd03a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxControls.vue?vue&type=template&id=77edd03a&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.promise.finally.js
var es7_promise_finally = __webpack_require__("097d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxControls.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FluxControlsvue_type_script_lang_js_ = ({
  props: {
    slider: {
      type: Object
    }
  },
  computed: {
    vf: function vf() {
      if (this.slider) return this.slider;
      if (this.$parent.$options.name === 'VueFlux') return this.$parent.loaded ? this.$parent : undefined;
      console.warn('slider not referenced, check https://github.com/deulos/vue-flux/wiki/FluxControls for help');
      return undefined;
    },
    display: function display() {
      if (!this.vf) return false;
      if (this.vf.mouseOver === false) return false;
      if (this.vf.transition.current !== undefined) return false;
      return true;
    },
    autoplayClass: function autoplayClass() {
      return this.vf.config.autoplay ? 'pause' : 'play';
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxControls.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxControlsvue_type_script_lang_js_ = (FluxControlsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FluxControls.vue?vue&type=style&index=0&lang=scss&
var FluxControlsvue_type_style_index_0_lang_scss_ = __webpack_require__("841f");

// CONCATENATED MODULE: ./src/components/FluxControls.vue






/* normalize component */

var FluxControls_component = normalizeComponent(
  components_FluxControlsvue_type_script_lang_js_,
  FluxControlsvue_type_template_id_77edd03a_render,
  FluxControlsvue_type_template_id_77edd03a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxControls_component.options.__file = "FluxControls.vue"
/* harmony default export */ var FluxControls = (FluxControls_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCube.vue?vue&type=template&id=ea839f68&
var FluxCubevue_type_template_id_ea839f68_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"cube",style:(_vm.style)},[_c('flux-image',{ref:"front",attrs:{"slider":_vm.slider,"index":_vm.index.front,"css":_vm.getFrontSideCss()}}),(_vm.sideSet('top'))?_c('flux-image',{ref:"top",attrs:{"slider":_vm.slider,"index":_vm.index.top,"css":_vm.getTopSideCss()}}):_vm._e(),(_vm.sideSet('back'))?_c('flux-image',{ref:"back",attrs:{"slider":_vm.slider,"index":_vm.index.back,"css":_vm.getBackSideCss()}}):_vm._e(),(_vm.sideSet('bottom'))?_c('flux-image',{ref:"bottom",attrs:{"slider":_vm.slider,"index":_vm.index.bottom,"css":_vm.getBottomSideCss()}}):_vm._e(),(_vm.sideSet('left'))?_c('flux-image',{ref:"left",attrs:{"slider":_vm.slider,"index":_vm.index.left,"css":_vm.getLeftSideCss()}}):_vm._e(),(_vm.sideSet('right'))?_c('flux-image',{ref:"right",attrs:{"slider":_vm.slider,"index":_vm.index.right,"css":_vm.getRightSideCss()}}):_vm._e()],1)}
var FluxCubevue_type_template_id_ea839f68_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxCube.vue?vue&type=template&id=ea839f68&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxImage.vue?vue&type=template&id=04e589c1&
var FluxImagevue_type_template_id_04e589c1_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"image",style:(_vm.style)})}
var FluxImagevue_type_template_id_04e589c1_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxImage.vue?vue&type=template&id=04e589c1&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxImage.vue?vue&type=script&lang=js&


//
//
//
//
/* harmony default export */ var FluxImagevue_type_script_lang_js_ = ({
  data: function data() {
    return {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        zIndex: 'auto'
      }
    };
  },
  props: {
    slider: {
      type: Object,
      required: true
    },
    index: {
      type: [Number, String],
      required: true
    },
    css: {
      type: Object,
      default: function _default() {
        return {
          top: 0,
          left: 0
        };
      }
    }
  },
  watch: {
    index: function index() {
      this.init();
    }
  },
  created: function created() {
    this.init();
  },
  methods: {
    init: function init() {
      this.setCss(this.css);
      if (typeof this.index === 'number') this.initImage();else if (/^#/.test(this.index)) this.initColor();
    },
    initColor: function initColor() {
      this.setCss({
        backgroundColor: this.index
      });
    },
    initImage: function initImage() {
      var properties = this.slider.properties[this.index];

      if (!properties) {
        this.setCss({
          backgroundColor: 'transparent',
          backgroundImage: 'none'
        });
        return;
      }

      var image = {
        top: 0,
        left: 0,
        width: properties.width,
        height: properties.height,
        src: 'url("' + properties.src + '")'
      };

      if (image.height / image.width >= this.slider.size.height / this.slider.size.width) {
        image.height = Math.ceil(this.slider.size.width * image.height / image.width);
        image.width = Math.ceil(this.slider.size.width);
        image.top = Math.ceil((this.slider.size.height - image.height) / 2);
      } else {
        image.width = Math.ceil(this.slider.size.height * image.width / image.height);
        image.height = Math.ceil(this.slider.size.height);
        image.left = Math.ceil((this.slider.size.width - image.width) / 2);
      }

      image.top -= parseFloat(this.css.top);
      image.left -= parseFloat(this.css.left);
      this.setCss({
        top: 0,
        left: 0,
        backgroundImage: image.src,
        backgroundSize: image.width + 'px ' + image.height + 'px',
        backgroundPosition: image.left + 'px ' + image.top + 'px',
        backgroundRepeat: 'no-repeat'
      });
    },
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },
    transform: function transform(css) {
      var _this = this;

      this.$nextTick(function () {
        _this.$refs.image.clientHeight;

        _this.setCss(css);
      });
    },
    show: function show() {
      this.setCss({
        visibility: 'visible'
      });
    },
    hide: function hide() {
      this.setCss({
        visibility: 'hidden'
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxImagevue_type_script_lang_js_ = (FluxImagevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/FluxImage.vue





/* normalize component */

var FluxImage_component = normalizeComponent(
  components_FluxImagevue_type_script_lang_js_,
  FluxImagevue_type_template_id_04e589c1_render,
  FluxImagevue_type_template_id_04e589c1_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxImage_component.options.__file = "FluxImage.vue"
/* harmony default export */ var FluxImage = (FluxImage_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCube.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxCubevue_type_script_lang_js_ = ({
  name: 'FluxCube',
  components: {
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: 'visible',
        transformStyle: 'preserve-3d'
      }
    };
  },
  props: {
    slider: {
      type: Object,
      required: true
    },
    index: {
      type: Object,
      required: true
    },
    css: {
      type: Object,
      default: function _default() {
        return {
          top: 0,
          left: 0
        };
      }
    }
  },
  computed: {
    front: function front() {
      return this.$refs.front;
    },
    top: function top() {
      return this.$refs.top;
    },
    back: function back() {
      return this.$refs.back;
    },
    bottom: function bottom() {
      return this.$refs.bottom;
    },
    left: function left() {
      return this.$refs.left;
    },
    right: function right() {
      return this.$refs.right;
    }
  },
  created: function created() {
    var css = this.css;
    if (!css.width) css.width = this.slider.size.width + 'px';
    if (!css.height) css.height = this.slider.size.height + 'px';
    this.setCss(css);
  },
  methods: {
    sideSet: function sideSet(side) {
      return this.index[side] !== undefined;
    },
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },
    getBasicSideCss: function getBasicSideCss(side) {
      var css = {};

      if (typeof this.index[side] === 'number') {
        css.top = this.css.top;
        css.left = this.css.left;
      }

      return css;
    },
    getFrontSideCss: function getFrontSideCss() {
      var css = this.getBasicSideCss('front');
      return css;
    },
    getTopSideCss: function getTopSideCss() {
      var css = this.getBasicSideCss('top');
      var t = {
        rx: '90deg',
        tx: '0',
        ty: '-50%',
        tz: (this.slider.size.height / 2).toFixed(2) + 'px'
      };
      css.transform = 'rotateX(' + t.rx + ') translate3d(' + t.tx + ', ' + t.ty + ', ' + t.tz + ')';
      return css;
    },
    getBackSideCss: function getBackSideCss() {
      var css = this.getBasicSideCss('back');
      css.transform = 'rotateY(180deg)';
      css.backfaceVisibility = 'hidden';
      return css;
    },
    getBottomSideCss: function getBottomSideCss() {
      var css = this.getBasicSideCss('bottom');
      var t = {
        rx: '-90deg',
        tx: '0',
        ty: '50%',
        tz: (this.slider.size.height / 2).toFixed(2) + 'px'
      };
      css.transform = 'rotateX(' + t.rx + ') translate3d(' + t.tx + ', ' + t.ty + ', ' + t.tz + ')';
      return css;
    },
    getLeftSideCss: function getLeftSideCss() {
      var css = this.getBasicSideCss('left');
      var size = {
        width: parseInt(typeof this.index.left === 'number' ? this.style.width : this.style.height),
        height: parseInt(this.style.height)
      };
      css.width = size.width + 'px';
      css.height = size.height + 'px';
      var t = {
        ry: '-90deg',
        tx: '-50%',
        ty: '0',
        tz: (size.width / 2).toFixed(2) + 'px'
      };
      css.transform = 'rotateY(' + t.ry + ') translate3d(' + t.tx + ', ' + t.ty + ', ' + t.tz + ')';
      return css;
    },
    getRightSideCss: function getRightSideCss() {
      var css = this.getBasicSideCss('right');
      var size = {
        width: parseInt(typeof this.index.right === 'number' ? this.style.width : this.style.height),
        height: parseInt(this.style.height)
      };
      css.width = size.width + 'px';
      css.height = size.height + 'px';
      var t = {
        ry: '90deg',
        tx: '50%',
        ty: '0',
        tz: (parseInt(this.style.width) - size.width / 2).toFixed(2) + 'px'
      };
      css.transform = 'rotateY(' + t.ry + ') translate3d(' + t.tx + ', ' + t.ty + ', ' + t.tz + ')';
      return css;
    },
    transform: function transform(css) {
      var _this = this;

      this.$refs.cube.clientHeight;
      this.$nextTick(function () {
        _this.setCss(css);
      });
    },
    turn: function turn(direction, to) {
      if (direction === 'top') this.turnTop();else if (direction === 'back') this.turnBack(to);else if (direction === 'bottom') this.turnBottom();else if (direction === 'left') this.turnLeft();else if (direction === 'right') this.turnRight();
    },
    turnTop: function turnTop() {
      var height = parseInt(this.style.height);
      var t = {
        rx: '90deg',
        ty: '-50%',
        tz: (height / 2).toFixed(2) + 'px'
      };
      this.transform({
        transform: 'rotateX(' + t.rx + ') translate3d(0, ' + t.ty + ', ' + t.tz + ')'
      });
    },
    turnBack: function turnBack(to) {
      var deg = '180';
      if (to === 'left') deg = '-180';
      this.transform({
        transform: 'rotateY(' + deg + 'deg)'
      });
    },
    turnBottom: function turnBottom() {
      var height = parseInt(this.style.height);
      var t = {
        rx: '-90deg',
        ty: '50%',
        tz: (height / 2).toFixed(2) + 'px'
      };
      this.transform({
        transform: 'rotateX(' + t.rx + ') translate3d(0, ' + t.ty + ', ' + t.tz + ')'
      });
    },
    turnLeft: function turnLeft() {
      var width = parseInt(this.style.width);
      var t = {
        ry: '90deg',
        tx: '50%',
        tz: (width / 2).toFixed(2) + 'px'
      };
      this.transform({
        transform: 'rotateY(' + t.ry + ') translate3d(' + t.tx + ', 0, ' + t.tz + ')'
      });
    },
    turnRight: function turnRight() {
      var width = parseInt(this.style.width);
      var t = {
        ry: '-90deg',
        tx: '-50%',
        tz: (width / 2).toFixed(2) + 'px'
      };
      this.transform({
        transform: 'rotateY(' + t.ry + ') translate3d(' + t.tx + ', 0, ' + t.tz + ')'
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxCube.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxCubevue_type_script_lang_js_ = (FluxCubevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/FluxCube.vue





/* normalize component */

var FluxCube_component = normalizeComponent(
  components_FluxCubevue_type_script_lang_js_,
  FluxCubevue_type_template_id_ea839f68_render,
  FluxCubevue_type_template_id_ea839f68_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxCube_component.options.__file = "FluxCube.vue"
/* harmony default export */ var FluxCube = (FluxCube_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxGrid.vue?vue&type=template&id=8eb22a18&
var FluxGridvue_type_template_id_8eb22a18_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.style)},_vm._l((_vm.numTiles),function(i){return _c('flux-cube',{key:i,ref:"tiles",refInFor:true,attrs:{"slider":_vm.slider,"index":_vm.index,"css":_vm.getTileCss(i)}})}))}
var FluxGridvue_type_template_id_8eb22a18_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxGrid.vue?vue&type=template&id=8eb22a18&

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxGrid.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxGridvue_type_script_lang_js_ = ({
  name: 'FluxGrid',
  components: {
    FluxCube: FluxCube
  },
  data: function data() {
    return {
      numTiles: 0,
      tile: {
        width: 1,
        height: 1
      },
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: '12'
      }
    };
  },
  props: {
    slider: {
      type: Object,
      required: true
    },
    numRows: {
      type: Number,
      required: true
    },
    numCols: {
      type: Number,
      required: true
    },
    index: {
      type: Object,
      required: true
    },
    tileCss: {
      type: Object,
      default: function _default() {}
    }
  },
  computed: {
    tiles: function tiles() {
      return this.$refs.tiles;
    }
  },
  created: function created() {
    this.numTiles = this.numRows * this.numCols;
    this.tile.width = Math.ceil(this.slider.size.width / this.numCols);
    this.tile.height = Math.ceil(this.slider.size.height / this.numRows);
  },
  methods: {
    getRow: function getRow(i) {
      var row = Math.floor(i / this.numCols);
      return row;
    },
    getCol: function getCol(i) {
      var col = i % this.numCols;
      return col;
    },
    getTileCss: function getTileCss(i) {
      i--;
      var row = this.getRow(i);
      var col = this.getCol(i);
      var width = this.tile.width;
      var height = this.tile.height;
      if (col + 1 == this.numCols) width = this.slider.size.width - col * this.tile.width;
      if (row + 1 == this.numRows) height = this.slider.size.height - row * this.tile.height;
      var top = row * this.tile.height;
      var left = col * this.tile.width;
      var zIndex = i + 1 < this.numCols / 2 ? 13 + i : 13 + this.numCols - i;
      return Object.assign({}, this.tileCss, {
        width: width + 'px',
        height: height + 'px',
        top: top + 'px',
        left: left + 'px',
        zIndex: zIndex
      });
    },
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },
    transform: function transform(func) {
      var _this = this;

      this.$nextTick(function () {
        _this.tiles.forEach(function (tile, i) {
          return func(tile, i);
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxGrid.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxGridvue_type_script_lang_js_ = (FluxGridvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/FluxGrid.vue





/* normalize component */

var FluxGrid_component = normalizeComponent(
  components_FluxGridvue_type_script_lang_js_,
  FluxGridvue_type_template_id_8eb22a18_render,
  FluxGridvue_type_template_id_8eb22a18_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxGrid_component.options.__file = "FluxGrid.vue"
/* harmony default export */ var FluxGrid = (FluxGrid_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxIndex.vue?vue&type=template&id=b809cdd2&
var FluxIndexvue_type_template_id_b809cdd2_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"flux-index"},[_c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.displayButton),expression:"displayButton"}],staticClass:"toggle",on:{"click":_vm.toggle}})]),_c('nav',{class:_vm.indexClass,on:{"click":_vm.click,"&touchstart":function($event){return _vm.touchStart($event)},"&touchend":function($event){return _vm.touchEnd($event)}}},[_c('ul',{ref:"thumbs"},_vm._l((_vm.images),function(image,index){return _c('li',{key:index,class:_vm.current(index),on:{"click":function($event){_vm.click($event, index)}}},[_c('flux-thumb',{attrs:{"slider":_vm.vf,"index":index}})],1)}))])],1)}
var FluxIndexvue_type_template_id_b809cdd2_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxIndex.vue?vue&type=template&id=b809cdd2&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxThumb.vue?vue&type=template&id=470e252a&
var FluxThumbvue_type_template_id_470e252a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"thumb",staticClass:"flux-thumb",style:(_vm.style),attrs:{"title":_vm.caption}})}
var FluxThumbvue_type_template_id_470e252a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxThumb.vue?vue&type=template&id=470e252a&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxThumb.vue?vue&type=script&lang=js&


//
//
//
//
/* harmony default export */ var FluxThumbvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      style: {
        overflow: 'hidden'
      }
    };
  },
  props: {
    slider: {
      type: Object,
      required: true
    },
    index: {
      type: [Number, String],
      required: true
    },
    css: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  },
  computed: {
    properties: function properties() {
      return this.slider.properties[this.index];
    },
    caption: function caption() {
      return this.slider.captions[this.index] || '';
    }
  },
  mounted: function mounted() {
    this.init();
  },
  methods: {
    init: function init() {
      this.setCss(this.css);
      if (!this.properties) return;
      var image = {
        width: this.properties.width,
        height: this.properties.height,
        src: 'url("' + this.properties.src + '")'
      };
      var thumb = {
        width: parseInt(this.$refs.thumb.clientWidth),
        height: parseInt(this.$refs.thumb.clientHeight)
      };

      if (image.height / image.width >= thumb.height / thumb.width) {
        image.height = Math.ceil(thumb.width * image.height / image.width);
        image.width = thumb.width;
        image.top = Math.floor((thumb.height - image.height) / 2);
      } else {
        image.width = Math.ceil(thumb.height * image.width / image.height);
        image.height = thumb.height;
        image.left = Math.floor((thumb.width - image.width) / 2);
      }

      this.setCss({
        backgroundImage: image.src,
        backgroundSize: image.width + 'px ' + image.height + 'px',
        backgroundPosition: image.left + 'px ' + image.top + 'px',
        backgroundRepeat: 'no-repeat'
      });
    },
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxThumb.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxThumbvue_type_script_lang_js_ = (FluxThumbvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FluxThumb.vue?vue&type=style&index=0&lang=scss&
var FluxThumbvue_type_style_index_0_lang_scss_ = __webpack_require__("8256");

// CONCATENATED MODULE: ./src/components/FluxThumb.vue






/* normalize component */

var FluxThumb_component = normalizeComponent(
  components_FluxThumbvue_type_script_lang_js_,
  FluxThumbvue_type_template_id_470e252a_render,
  FluxThumbvue_type_template_id_470e252a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxThumb_component.options.__file = "FluxThumb.vue"
/* harmony default export */ var FluxThumb = (FluxThumb_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxIndex.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxIndexvue_type_script_lang_js_ = ({
  name: 'FluxIndex',
  components: {
    FluxThumb: FluxThumb
  },
  data: function data() {
    return {
      visible: false,
      delay: 500,
      touchStartTime: 0
    };
  },
  props: {
    slider: {
      type: Object
    }
  },
  computed: {
    vf: function vf() {
      if (this.slider) return this.slider;
      if (this.$parent.$options.name === 'VueFlux') return this.$parent.loaded ? this.$parent : undefined;
      console.warn('slider not referenced, check https://github.com/deulos/vue-flux/wiki/FluxIndex for help');
      return undefined;
    },
    images: function images() {
      if (!this.vf) return [];
      return this.vf.properties;
    },
    displayButton: function displayButton() {
      if (!this.vf) return false;
      if (!this.vf.index) return false;
      if (this.vf.mouseOver === false) return false;
      if (this.vf.transition.current !== undefined) return false;
      return true;
    },
    indexClass: function indexClass() {
      if (!this.vf) return '';
      var indexClass = '';
      if (this.visible && this.vf.index) indexClass += 'visible';
      if (this.vf.mouseOver) indexClass += ' mouse-over';
      return indexClass;
    }
  },
  methods: {
    touchStart: function touchStart(event) {
      if (!this.vf.config.enableGestures) return;
      event.stopPropagation();
      this.touchStartTime = Date.now();
    },
    touchEnd: function touchEnd(event) {
      if (!this.vf.config.enableGestures) return;
      event.stopPropagation();
      var offsetTime = Date.now() - this.touchStartTime;
      if (offsetTime < 100) this.toggle();
    },
    click: function click(event, index) {
      event.stopPropagation();
      if (index === undefined) this.toggle();else this.showImage(index);
    },
    toggle: function toggle() {
      if (!this.vf.index) return;
      if (!this.visible) this.show();else this.hide();
    },
    show: function show() {
      var _this = this;

      this.vf.stop();
      this.visible = true;
      this.$nextTick(function () {
        _this.$refs.thumbs.clientHeight;
        _this.$refs.thumbs.style.marginTop = 0;
      });
    },
    showImage: function showImage(index) {
      if (this.vf.index && this.visible) {
        this.hide(index);
        return;
      }

      this.vf.showImage(index);
    },
    hide: function hide(index) {
      var _this2 = this;

      this.$refs.thumbs.clientHeight;
      this.$refs.thumbs.style.marginTop = '100%';
      setTimeout(function () {
        _this2.visible = false;
        if (typeof index !== 'undefined') _this2.showImage(index);
      }, this.delay);
    },
    current: function current(index) {
      return this.vf.currentImage().index === index ? 'current' : '';
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxIndex.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxIndexvue_type_script_lang_js_ = (FluxIndexvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FluxIndex.vue?vue&type=style&index=0&lang=scss&
var FluxIndexvue_type_style_index_0_lang_scss_ = __webpack_require__("285f");

// CONCATENATED MODULE: ./src/components/FluxIndex.vue






/* normalize component */

var FluxIndex_component = normalizeComponent(
  components_FluxIndexvue_type_script_lang_js_,
  FluxIndexvue_type_template_id_b809cdd2_render,
  FluxIndexvue_type_template_id_b809cdd2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxIndex_component.options.__file = "FluxIndex.vue"
/* harmony default export */ var FluxIndex = (FluxIndex_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxPagination.vue?vue&type=template&id=b5f59df4&
var FluxPaginationvue_type_template_id_b5f59df4_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.vf !== undefined)?_c('nav',{staticClass:"flux-pagination"},[_c('ul',_vm._l((_vm.vf.properties.length),function(i){return _c('li',{key:i,class:_vm.getClass(i - 1),attrs:{"title":_vm.getTitle(i - 1)},on:{"click":function($event){_vm.showImage(i - 1)},"touchend":function($event){_vm.showImage(i - 1, $event)}}},[_c('span',{staticClass:"pagination-item"})])}))]):_vm._e()}
var FluxPaginationvue_type_template_id_b5f59df4_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxPagination.vue?vue&type=template&id=b5f59df4&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxPagination.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FluxPaginationvue_type_script_lang_js_ = ({
  props: {
    slider: {
      type: Object
    }
  },
  computed: {
    vf: function vf() {
      if (this.slider) return this.slider;
      if (this.$parent.$options.name === 'VueFlux') return this.$parent.loaded ? this.$parent : undefined;
      console.warn('slider not referenced, check https://github.com/deulos/vue-flux/wiki/FluxPagination for help');
      return undefined;
    },
    currentTransition: function currentTransition() {
      return this.vf.transition.current;
    },
    currentImageIndex: function currentImageIndex() {
      var currentImage = this.vf.currentImage();
      if (currentImage === undefined) return undefined;
      return currentImage.index;
    },
    nextImageIndex: function nextImageIndex() {
      var nextImage = this.vf.nextImage();
      return nextImage.index;
    }
  },
  methods: {
    getClass: function getClass(i) {
      if (this.currentTransition !== undefined && this.nextImageIndex === i) return 'active';
      if (this.currentTransition === undefined && this.currentImageIndex === i) return 'active';
      return '';
    },
    getTitle: function getTitle(i) {
      return this.vf.captions[i] || '';
    },
    showImage: function showImage(index, event) {
      this.vf.showImage(index);
      if (event) event.preventDefault();
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxPagination.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxPaginationvue_type_script_lang_js_ = (FluxPaginationvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FluxPagination.vue?vue&type=style&index=0&lang=scss&
var FluxPaginationvue_type_style_index_0_lang_scss_ = __webpack_require__("06d9");

// CONCATENATED MODULE: ./src/components/FluxPagination.vue






/* normalize component */

var FluxPagination_component = normalizeComponent(
  components_FluxPaginationvue_type_script_lang_js_,
  FluxPaginationvue_type_template_id_b5f59df4_render,
  FluxPaginationvue_type_template_id_b5f59df4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxPagination_component.options.__file = "FluxPagination.vue"
/* harmony default export */ var FluxPagination = (FluxPagination_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxParallax.vue?vue&type=template&id=309fa151&
var FluxParallaxvue_type_template_id_309fa151_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"parallax",staticClass:"flux-parallax",style:(_vm.style)},[(_vm.loaded === false)?_c('img',{ref:"image",attrs:{"src":_vm.src,"alt":""},on:{"load":_vm.setProperties,"error":_vm.setProperties}}):_vm._e(),_vm._t("default")],2)}
var FluxParallaxvue_type_template_id_309fa151_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxParallax.vue?vue&type=template&id=309fa151&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxParallax.vue?vue&type=script&lang=js&





//
//
//
//
//
//
//
/* harmony default export */ var FluxParallaxvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      loaded: false,
      view: {
        height: undefined
      },
      parallax: {
        top: undefined,
        width: undefined,
        height: undefined
      },
      background: {
        top: undefined,
        left: undefined,
        width: undefined,
        height: undefined
      },
      properties: {
        src: undefined,
        width: undefined,
        height: undefined
      },
      style: {}
    };
  },
  props: {
    src: {
      type: String,
      required: true
    },
    holder: {
      default: function _default() {
        return window;
      }
    },
    type: {
      type: String,
      default: function _default() {
        return 'relative';
      }
    },
    height: {
      type: String,
      default: function _default() {
        return 'auto';
      }
    },
    offset: {
      type: [Number, String],
      default: function _default() {
        return '60%';
      }
    }
  },
  computed: {
    parallaxHeight: function parallaxHeight() {
      if (/^[0-9]+px$/.test(this.height) === true) return parseInt(this.height);
      return this.$refs.parallax.clientHeight;
    },
    offsetHeight: function offsetHeight() {
      var height = {
        px: 0
      };
      if (/^[0-9]+px$/.test(this.offset) === true) height.px = parseInt(this.offset);
      if (/^[0-9]+%$/.test(this.offset) === true) height.px = Math.ceil(this.parallaxHeight * parseInt(this.offset) / 100);
      height.pct = height.px * 100 / this.background.height;
      return height;
    },
    backgroundHeight: function backgroundHeight() {
      var height = {
        px: this.parallaxHeight + this.offsetHeight.px
      };
      height.pct = height.px * 100 / this.background.height;
      return height;
    },
    remainderHeight: function remainderHeight() {
      var height = {
        px: this.background.height - this.backgroundHeight.px
      };
      height.pct = height.px * 100 / this.background.height;
      return height;
    }
  },
  mounted: function mounted() {
    window.addEventListener('resize', this.resize);
    if (this.type !== 'fixed') this.holder.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.type !== 'fixed') this.holder.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    setProperties: function setProperties() {
      var img = this.$refs.image;

      if (img.naturalWidth || img.width) {
        Object.assign(this.properties, {
          src: img.src,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height
        });
      }

      this.loaded = true;
      this.init();
    },
    resize: function resize() {
      var _this = this;

      var parallax = this.$refs.parallax;
      this.view.height = this.holder.innerHeight;
      Object.assign(this.parallax, {
        width: 'auto',
        height: this.parallaxHeight
      });
      this.setCss({
        width: this.parallax.width,
        height: this.parallax.height + 'px'
      });
      this.$nextTick(function () {
        Object.assign(_this.parallax, {
          top: parallax.offsetTop,
          width: parallax.clientWidth
        });
        var css = {
          width: _this.parallax.width + 'px',
          backgroundImage: 'url("' + _this.properties.src + '")',
          backgroundRepeat: 'no-repeat'
        };

        if (_this.type === 'fixed') {
          Object.assign(css, {
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
          });
        } else {
          var image = {
            width: _this.properties.width,
            height: _this.properties.height
          };
          _this.background.height = _this.backgroundHeight.px;
          _this.background.width = Math.floor(_this.background.height * image.width / image.height);
          _this.background.top = 0;

          if (_this.background.width < _this.parallax.width) {
            _this.background.width = _this.parallax.width;
            _this.background.height = Math.floor(_this.parallax.width * image.height / image.width);
          }

          Object.assign(css, {
            backgroundSize: _this.background.width + 'px ' + _this.background.height + 'px',
            backgroundPosition: 'center ' + _this.background.top + 'px'
          });
        }

        _this.setCss(css);

        _this.handleScroll();
      });
    },
    init: function init() {
      if (!this.properties.src) return;
      this.resize();
    },
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },
    moveBackgroundByPct: function moveBackgroundByPct(pct) {
      if (this.remainderHeight.px > 0) pct = pct * this.offsetHeight.pct / 100 + 50 - this.offsetHeight.pct / 2;
      this.setCss({
        backgroundPositionY: pct.toFixed(2) + '%'
      });
    },
    handleScroll: function handleScroll() {
      if (this.loaded === false) return;
      var scrollTop = this.holder.scrollY || this.holder.scrollTop || this.holder.pageYOffset || 0;
      if (scrollTop + this.view.height < this.parallax.top) return;
      if (scrollTop > this.parallax.top + this.parallax.height) return;
      var positionY = scrollTop - this.parallax.top + this.view.height;

      if (this.type === 'static') {
        this.handleStatic(positionY);
        return;
      }

      if (this.type === 'relative') {
        this.handleRelative(positionY);
        return;
      }
    },
    handleStatic: function handleStatic(positionY) {
      var pct = 0;
      if (positionY < this.parallax.height) pct = 0;else if (positionY > this.view.height) pct = 100;else pct = (positionY - this.parallax.height) * 100 / (this.view.height - this.parallax.height);
      this.moveBackgroundByPct(pct);
    },
    handleRelative: function handleRelative(positionY) {
      var pct;
      pct = positionY * 100 / (this.view.height + this.parallax.height);
      this.moveBackgroundByPct(pct);
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxParallax.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxParallaxvue_type_script_lang_js_ = (FluxParallaxvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FluxParallax.vue?vue&type=style&index=0&lang=scss&
var FluxParallaxvue_type_style_index_0_lang_scss_ = __webpack_require__("281b");

// CONCATENATED MODULE: ./src/components/FluxParallax.vue






/* normalize component */

var FluxParallax_component = normalizeComponent(
  components_FluxParallaxvue_type_script_lang_js_,
  FluxParallaxvue_type_template_id_309fa151_render,
  FluxParallaxvue_type_template_id_309fa151_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxParallax_component.options.__file = "FluxParallax.vue"
/* harmony default export */ var FluxParallax = (FluxParallax_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxVortex.vue?vue&type=template&id=16b9143f&
var FluxVortexvue_type_template_id_16b9143f_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.style)},_vm._l((_vm.numCircles),function(i){return _c('flux-image',{key:i,ref:"tiles",refInFor:true,attrs:{"slider":_vm.slider,"index":_vm.index,"css":_vm.getTileCss(i)}})}))}
var FluxVortexvue_type_template_id_16b9143f_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxVortex.vue?vue&type=template&id=16b9143f&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxVortex.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxVortexvue_type_script_lang_js_ = ({
  name: 'FluxVortex',
  components: {
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      diag: undefined,
      radius: undefined,
      tile: {
        top: undefined,
        left: undefined
      },
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: '12'
      }
    };
  },
  props: {
    slider: {
      type: Object,
      required: true
    },
    numCircles: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    size: function size() {
      return this.slider.size;
    },
    tiles: function tiles() {
      return this.$refs.tiles;
    }
  },
  created: function created() {
    var width = this.size.width;
    var height = this.size.height;
    this.diag = Math.ceil(Math.sqrt(width * width + height * height));
    this.radius = Math.ceil(this.diag / 2 / this.numCircles);
    this.tile.top = Math.ceil(height / 2 - this.radius * this.numCircles);
    this.tile.left = Math.ceil(width / 2 - this.radius * this.numCircles);
  },
  mounted: function mounted() {
    var _this = this;

    this.tiles.forEach(function (tile, i) {
      tile.setCss({
        top: _this.getTileTop(i) + 'px',
        left: _this.getTileLeft(i) + 'px',
        backgroundRepeat: 'repeat'
      });
    });
  },
  methods: {
    getTileTop: function getTileTop(i) {
      return this.tile.top + this.radius * i;
    },
    getTileLeft: function getTileLeft(i) {
      return this.tile.left + this.radius * i;
    },
    getTileCss: function getTileCss(i) {
      i--;
      var width = (this.numCircles - i) * this.radius * 2;
      var height = width;
      var zIndex = 13 + i;
      return Object.assign({}, this.tileCss, {
        top: this.getTileTop(i) + 'px',
        left: this.getTileLeft(i) + 'px',
        width: width + 'px',
        height: height + 'px',
        borderRadius: Math.ceil(width / 2) + 'px',
        zIndex: zIndex
      });
    },
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },
    transform: function transform(func) {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.tiles.forEach(function (tile, i) {
          return func(tile, i);
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxVortex.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxVortexvue_type_script_lang_js_ = (FluxVortexvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/FluxVortex.vue





/* normalize component */

var FluxVortex_component = normalizeComponent(
  components_FluxVortexvue_type_script_lang_js_,
  FluxVortexvue_type_template_id_16b9143f_render,
  FluxVortexvue_type_template_id_16b9143f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxVortex_component.options.__file = "FluxVortex.vue"
/* harmony default export */ var FluxVortex = (FluxVortex_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxWrapper.vue?vue&type=template&id=36575b36&
var FluxWrappervue_type_template_id_36575b36_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"wrapper",style:(_vm.style)},[_vm._t("default")],2)}
var FluxWrappervue_type_template_id_36575b36_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxWrapper.vue?vue&type=template&id=36575b36&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxWrapper.vue?vue&type=script&lang=js&

//
//
//
//
//
//
/* harmony default export */ var FluxWrappervue_type_script_lang_js_ = ({
  data: function data() {
    return {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 12
      }
    };
  },
  methods: {
    setCss: function setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },
    transform: function transform(css) {
      var _this = this;

      this.$refs.wrapper.clientHeight;
      this.$nextTick(function () {
        _this.setCss(css);
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/FluxWrapper.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FluxWrappervue_type_script_lang_js_ = (FluxWrappervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/FluxWrapper.vue





/* normalize component */

var FluxWrapper_component = normalizeComponent(
  components_FluxWrappervue_type_script_lang_js_,
  FluxWrappervue_type_template_id_36575b36_render,
  FluxWrappervue_type_template_id_36575b36_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxWrapper_component.options.__file = "FluxWrapper.vue"
/* harmony default export */ var FluxWrapper = (FluxWrapper_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueFlux.vue?vue&type=template&id=227147aa&
var VueFluxvue_type_template_id_227147aa_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",staticClass:"vue-flux",class:_vm.inFullscreen()? 'fullscreen' : '',on:{"mousemove":function($event){_vm.toggleMouseOver(true)},"mouseleave":function($event){_vm.toggleMouseOver(false)},"dblclick":function($event){_vm.toggleFullscreen()},"touchstart":_vm.touchStart,"touchend":_vm.touchEnd}},[_vm._l((_vm.preload),function(src,index){return _c('img',{key:index,ref:"images",refInFor:true,attrs:{"src":_vm.path + src,"alt":""},on:{"load":function($event){_vm.addImage(index)},"error":function($event){_vm.addImage(index)}}})}),_c('div',{ref:"mask",staticClass:"mask",style:(_vm.sizePx)},[(_vm.transition.current)?_c(_vm.transition.current,{ref:"transition",tag:"component",attrs:{"slider":_vm.slider}}):_vm._e(),_c('flux-image',{ref:"image1",attrs:{"slider":_vm.slider,"index":_vm.image1Index}}),_c('flux-image',{ref:"image2",attrs:{"slider":_vm.slider,"index":_vm.image2Index}})],1),_vm._t("spinner",[(!_vm.loaded)?_c('div',{staticClass:"spinner"},[_c('div',{staticClass:"pct"},[_vm._v(_vm._s(_vm.loadPct)+"%")]),_c('div',{staticClass:"border"})]):_vm._e()]),_vm._t("caption"),_vm._t("controls"),_vm._t("index"),(_vm.loaded)?_vm._t("pagination"):_vm._e()],2)}
var VueFluxvue_type_template_id_227147aa_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VueFlux.vue?vue&type=template&id=227147aa&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueFlux.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VueFluxvue_type_script_lang_js_ = ({
  name: 'VueFlux',
  components: {
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      config: {
        autoplay: false,
        bindKeys: false,
        enableGestures: false,
        fullscreen: false,
        infinite: true,
        delay: 5000,
        width: '100%',
        height: 'auto',
        autohideTime: 1500
      },
      size: {
        width: undefined,
        height: undefined
      },
      timer: undefined,
      mouseOverTimer: undefined,
      transitionNames: [],
      transition: {
        current: undefined,
        last: undefined
      },
      mouseOver: false,
      touchStartX: 0,
      touchStartY: 0,
      touchStartTime: 0,
      touchEndTime: 0,
      image1Index: 0,
      image2Index: 1,
      imagesLoaded: 0,
      loaded: false,
      preload: [],
      properties: []
    };
  },
  props: {
    options: {
      type: Object,
      default: function _default() {}
    },
    transitions: {
      type: Object,
      required: true
    },
    transitionOptions: {
      type: Object,
      default: function _default() {}
    },
    path: {
      type: String,
      default: ''
    },
    images: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    captions: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    slider: function slider() {
      return this;
    },
    caption: function caption() {
      if (this.$slots['caption']) return this.$slots['caption'][0].componentInstance;
      return undefined;
    },
    controls: function controls() {
      if (this.$slots['controls']) return this.$slots['controls'][0].componentInstance;
      return undefined;
    },
    index: function index() {
      if (this.$slots['index']) return this.$slots['index'][0].componentInstance;
      return undefined;
    },
    pagination: function pagination() {
      if (this.$slots['pagination']) return this.$slots['pagination'][0].componentInstance;
      return undefined;
    },
    mask: function mask() {
      return this.$refs.mask;
    },
    sizePx: function sizePx() {
      if (typeof this.size.width !== 'number' || typeof this.size.height !== 'number') return {};
      return {
        width: this.size.width + 'px',
        height: this.size.height + 'px'
      };
    },
    loadPct: function loadPct() {
      return Math.ceil(this.imagesLoaded * 100 / this.images.slice(0).length);
    },
    nextTransition: function nextTransition() {
      if (!this.transitionNames.length) return undefined;
      var nextIndex = this.transition.last + 1;
      if (nextIndex >= this.transitionNames.length) nextIndex = 0;
      return this.transitionNames[nextIndex];
    }
  },
  watch: {
    options: function options() {
      this.setOptions();
    },
    transitions: function transitions() {
      var wasPlaying = this.config.autoplay;
      this.stop();
      this.updateTransitions();
      if (wasPlaying) this.start();
    },
    images: function images() {
      var _this = this;

      var wasPlaying = this.config.autoplay;
      this.stop();
      this.$nextTick(function () {
        _this.preloadImages();

        _this.config.autoplay = wasPlaying;
      });
    }
  },
  created: function created() {
    this.updateOptions();
    this.updateTransitions();
  },
  mounted: function mounted() {
    this.resize();
    this.preloadImages();
    if (this.config.autohideTime === 0) this.mouseOver = true;
    window.addEventListener('resize', this.resize);
    if (this.config.bindKeys) window.addEventListener('keydown', this.keydown);
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.config.bindKeys) window.removeEventListener('keydown', this.keydown);
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    preloadImages: function preloadImages() {
      var _this2 = this;

      if (this.images.length < 2 || this.transitionNames.length === 0) return;
      this.loaded = false;
      this.image1Index = 0;
      this.image2Index = 1;
      this.imagesLoaded = 0;
      this.$nextTick(function () {
        _this2.$refs.image1.setCss({
          zIndex: 11
        });

        _this2.$refs.image2.setCss({
          zIndex: 10
        });
      });
      this.preload = this.images.slice(0);
    },
    addImage: function addImage(i) {
      this.imagesLoaded++;
      var img = this.$refs.images[i];

      if (img.naturalWidth || img.width) {
        this.properties[i] = {
          src: img.src,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height
        };
      } else {
        console.warn('Image ' + this.images[i] + ' could not be loaded');
      }

      if (i === 0) this.$refs.image1.init();
      if (this.imagesLoaded === this.preload.length) this.init();
    },
    updateOptions: function updateOptions() {
      var currentSize = {
        width: this.config.width,
        height: this.config.height
      };
      this.config = Object.assign({}, this.config, this.options);

      if (currentSize.width !== this.config.width || currentSize.height !== this.config.height) {
        this.size.width = this.config.width;
        this.size.height = this.config.height;
        this.resize();
      }
    },
    updateTransitions: function updateTransitions() {
      Object.assign(this.$options.components, this.transitions);
      this.transitionNames = Object.keys(this.transitions);
      if (this.transitionNames.length > 0) this.transition.last = this.transitionNames.length - 1;
    },
    currentImage: function currentImage() {
      if (this.$refs.image1 === undefined) return undefined;
      return this.$refs.image2.style.zIndex === 11 ? this.$refs.image2 : this.$refs.image1;
    },
    nextImage: function nextImage() {
      return this.$refs.image1.style.zIndex === 10 ? this.$refs.image1 : this.$refs.image2;
    },
    setTransitionOptions: function setTransitionOptions(transition) {
      var defaultValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var transitionOptions = this.transitionOptions || {};
      var options = transitionOptions[this.transition.current] || {};
      var direction = 'right';
      if (this.currentImage().index > this.nextImage().index) direction = 'left';
      Object.assign(transition, {
        direction: direction
      }, defaultValues, options);
    },
    resize: function resize() {
      var _this3 = this;

      this.size.width = undefined;
      this.size.height = undefined;
      if (this.config.width.indexOf('px') !== -1) this.size.width = parseInt(this.config.width);
      if (this.config.height.indexOf('px') !== -1) this.size.height = parseInt(this.config.height);
      if (this.size.width && this.size.height) return;
      this.$nextTick(function () {
        // Find width
        if (!_this3.size.width) {
          var width = window.getComputedStyle(_this3.$refs.container).width;
          _this3.size.width = parseFloat(width);
        } // Find height


        if (_this3.config.height === 'auto') {
          var height = _this3.size.width / 16 * 9;
          if (_this3.$refs.container.clientHeight) height = window.getComputedStyle(_this3.$refs.container).height;else if (_this3.$refs.container.parentNode.clientHeight) height = window.getComputedStyle(_this3.$refs.container.parentNode).height;
          _this3.size.height = parseFloat(height);
        }

        _this3.$refs.image1.init();

        _this3.$refs.image2.init();
      });
    },
    init: function init() {
      var _this4 = this;

      this.properties = this.properties.filter(function (p) {
        return p;
      });
      this.preload = [];
      this.loaded = true;
      this.$refs.image2.init();
      this.$nextTick(function () {
        _this4.$refs.image1.setCss({
          zIndex: 11
        });

        _this4.$refs.image2.setCss({
          zIndex: 10
        });

        _this4.$refs.image1.reference = 'image1Index';
        _this4.$refs.image2.reference = 'image2Index';
        if (_this4.config.autoplay === true) _this4.play();
      });
    },
    toggleMouseOver: function toggleMouseOver(over) {
      var _this5 = this;

      if (this.config.autohideTime === 0) return;
      clearTimeout(this.mouseOverTimer);

      if (over) {
        this.mouseOverTimer = setTimeout(function () {
          _this5.mouseOver = false;
        }, this.config.autohideTime);
      }

      this.mouseOver = over;
    },
    inFullscreen: function inFullscreen() {
      return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) !== undefined;
    },
    requestFullscreen: function requestFullscreen() {
      var container = this.$refs.container;
      if (container.requestFullscreen) container.requestFullscreen();else if (container.mozRequestFullScreen) container.mozRequestFullScreen();else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();else if (container.msRequestFullscreen) container.msRequestFullscreen();
    },
    exitFullscreen: function exitFullscreen() {
      if (document.exitFullscreen) document.exitFullscreen();else if (document.mozCancelFullScreen) document.mozCancelFullScreen();else if (document.webkitExitFullscreen) document.webkitExitFullscreen();else if (document.msExitFullscreen) document.msExitFullscreen();
    },
    toggleFullscreen: function toggleFullscreen() {
      if (this.config.fullscreen === false) return;
      if (this.inFullscreen()) this.exitFullscreen();else this.requestFullscreen();
      this.resize();
    },
    play: function play() {
      var _this6 = this;

      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'next';
      var delay = arguments.length > 1 ? arguments[1] : undefined;
      this.config.autoplay = true;
      this.timer = setTimeout(function () {
        _this6.showImage(index);
      }, delay || this.config.delay);
    },
    stop: function stop() {
      this.config.autoplay = false;
      if (this.transition.current) this.transition.current = undefined;
      clearTimeout(this.timer);
    },
    toggleAutoplay: function toggleAutoplay() {
      if (this.config.autoplay) this.stop();else this.play(undefined, 1);
    },
    getIndex: function getIndex(index) {
      if (typeof index === 'number') return index;
      var currentIndex = this.currentImage().index;
      if (index === 'previous') return currentIndex > 0 ? currentIndex - 1 : this.properties.length - 1;
      return currentIndex + 1 < this.properties.length ? currentIndex + 1 : 0;
    },
    setTransition: function setTransition(transition) {
      var _this7 = this;

      if (transition === undefined) transition = this.nextTransition;

      if (transition) {
        this.transition.last = this.transitionNames.indexOf(transition);
        this.transition.current = transition;
      }

      this.$nextTick(function () {
        _this7.transitionStart(transition);
      });
    },
    transitionStart: function transitionStart(transition) {
      var _this8 = this;

      this.$emit('vueFlux-transitionStart');
      var timeout = 0;
      if (transition !== undefined) timeout = this.$refs.transition.totalDuration;
      this.timer = setTimeout(function () {
        _this8.transitionEnd();
      }, timeout);
    },
    transitionEnd: function transitionEnd() {
      var _this9 = this;

      var currentImage = this.currentImage();
      var nextImage = this.nextImage();
      currentImage.setCss({
        zIndex: 10
      });
      nextImage.setCss({
        zIndex: 11
      });
      this.transition.current = undefined;
      this.$nextTick(function () {
        if (_this9.config.infinite === false && nextImage.index === _this9.properties.length - 1) {
          _this9.stop();

          return;
        }

        if (_this9.config.autoplay === true) {
          _this9.timer = setTimeout(function () {
            _this9.showImage('next');
          }, _this9.config.delay);
        }

        _this9.$emit('vueFlux-transitionEnd');
      });
    },
    showImage: function showImage(index, transition) {
      var _this10 = this;

      if (!this.loaded || this.$refs.image1 === undefined) return;
      if (this.transition.current !== undefined) return;
      if (this.currentImage().index === index) return;
      clearTimeout(this.timer);
      var nextImage = this.nextImage();
      this[nextImage.reference] = this.getIndex(index);
      nextImage.show();
      this.$nextTick(function () {
        _this10.setTransition(transition);
      });
    },
    keydown: function keydown(event) {
      if (/ArrowLeft|Left/.test(event.key)) this.showImage('previous');else if (/ArrowRight|Right/.test(event.key)) this.showImage('next');
    },
    touchStart: function touchStart(event) {
      if (!this.config.enableGestures) return;
      if (event.path[1].matches('.mask') || event.path[1].matches('.vue-flux')) event.preventDefault();
      this.touchStartTime = Date.now();
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },
    touchEnd: function touchEnd(event) {
      var previousTouchTime = this.touchEndTime;
      this.touchEndTime = Date.now();
      var offsetX = event.changedTouches[0].clientX - this.touchStartX;
      var offsetY = event.changedTouches[0].clientY - this.touchStartY;

      if (this.touchEndTime - previousTouchTime < 200) {
        this.toggleFullscreen();
        return;
      }

      if (Math.abs(offsetX) < 5 && Math.abs(offsetY) < 5) {
        this.toggleMouseOver(true);
        return;
      }

      if (!this.config.enableGestures) return;
      event.preventDefault();
      var triggerX = Math.floor(this.size.width / 3);

      if (offsetX > 0 && offsetX > triggerX) {
        this.showImage('previous');
        return;
      }

      if (offsetX < 0 && offsetX < -triggerX) {
        this.showImage('next');
        return;
      }

      if (this.index === undefined) return;
      var triggerY = Math.floor(this.size.height / 3);

      if (offsetY < 0 && offsetY < -triggerY) {
        this.index.show();
        return;
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/VueFlux.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VueFluxvue_type_script_lang_js_ = (VueFluxvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/VueFlux.vue?vue&type=style&index=0&lang=scss&
var VueFluxvue_type_style_index_0_lang_scss_ = __webpack_require__("1d36");

// CONCATENATED MODULE: ./src/components/VueFlux.vue






/* normalize component */

var VueFlux_component = normalizeComponent(
  components_VueFluxvue_type_script_lang_js_,
  VueFluxvue_type_template_id_227147aa_render,
  VueFluxvue_type_template_id_227147aa_staticRenderFns,
  false,
  null,
  null,
  null
  
)

VueFlux_component.options.__file = "VueFlux.vue"
/* harmony default export */ var VueFlux = (VueFlux_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/fade.vue?vue&type=template&id=0412b1c1&
var fadevue_type_template_id_0412b1c1_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c("div")}
var fadevue_type_template_id_0412b1c1_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/fade.vue?vue&type=template&id=0412b1c1&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/fade.vue?vue&type=script&lang=js&
//
//
/* harmony default export */ var fadevue_type_script_lang_js_ = ({
  name: 'transitionFade',
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      totalDuration: 1200,
      easing: 'ease-in'
    };
  },
  props: {
    slider: Object
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
  },
  mounted: function mounted() {
    this.currentImage.setCss({
      transition: 'opacity ' + this.totalDuration + 'ms ' + this.easing,
      opacity: 0
    });
  },
  destroyed: function destroyed() {
    this.currentImage.hide();
    this.currentImage.setCss({
      transition: 'none',
      opacity: 1
    });
  }
});
// CONCATENATED MODULE: ./src/components/transitions/fade.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_fadevue_type_script_lang_js_ = (fadevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/fade.vue





/* normalize component */

var fade_component = normalizeComponent(
  transitions_fadevue_type_script_lang_js_,
  fadevue_type_template_id_0412b1c1_render,
  fadevue_type_template_id_0412b1c1_staticRenderFns,
  false,
  null,
  null,
  null
  
)

fade_component.options.__file = "fade.vue"
/* harmony default export */ var fade = (fade_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/kenburn.vue?vue&type=template&id=1473f698&
var kenburnvue_type_template_id_1473f698_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-image',{ref:"image",attrs:{"slider":_vm.slider,"index":_vm.index}})}
var kenburnvue_type_template_id_1473f698_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/kenburn.vue?vue&type=template&id=1473f698&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/kenburn.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var kenburnvue_type_script_lang_js_ = ({
  name: 'transitionKenburn',
  components: {
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      totalDuration: 6000,
      easing: 'cubic-bezier(0.600, 0.040, 0.780, 0.335)',
      index: undefined
    };
  },
  props: {
    slider: Object
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
    this.index = this.currentImage.index;
    if (this.direction === 'left') this.index = this.nextImage.index;
  },
  mounted: function mounted() {
    this.slider.mask.style.overflow = 'hidden';
    var transform = this.getTransform();
    if (this.direction !== 'left') this.focusIn(transform);else this.focusOut(transform);
  },
  destroyed: function destroyed() {
    this.slider.mask.style.overflow = 'visible';
    this.currentImage.setCss({
      transition: 'none',
      opacity: 1
    });
  },
  methods: {
    focusIn: function focusIn(transform) {
      this.$refs.image.setCss({
        transformOrigin: transform.originX + ' ' + transform.originY,
        zIndex: 12
      });
      this.currentImage.hide();
      this.$refs.image.transform({
        transition: 'all ' + this.totalDuration + 'ms ' + this.easing,
        transform: 'scale(' + transform.scale + ') translate(' + transform.translateX + ', ' + transform.translateY + ')',
        opacity: 0
      });
    },
    focusOut: function focusOut(transform) {
      this.currentImage.setCss({
        transition: 'opacity ' + this.totalDuration + 'ms ' + this.easing,
        opacity: 0
      });
      this.$refs.image.setCss({
        transform: 'scale(' + transform.scale + ') translate(' + transform.translateX + ', ' + transform.translateY + ')',
        transformOrigin: transform.originX + ' ' + transform.originY,
        zIndex: 11
      });
      this.$refs.image.transform({
        transition: 'all ' + this.totalDuration + 'ms ' + this.easing,
        transform: 'scale(1) translate(0, 0)'
      });
    },
    getTransform: function getTransform() {
      var origin = Math.floor(Math.random() * 4 + 1);

      if (origin === 1) {
        return {
          scale: '2',
          translateX: '-50%',
          translateY: '-50%',
          originX: 'top',
          originY: 'left'
        };
      }

      if (origin === 2) {
        return {
          scale: '2',
          translateX: '50%',
          translateY: '-50%',
          originX: 'top',
          originY: 'right'
        };
      }

      if (origin === 3) {
        return {
          scale: '2',
          translateX: '-50%',
          translateY: '50%',
          originX: 'bottom',
          originY: 'left'
        };
      }

      return {
        scale: '2',
        translateX: '50%',
        translateY: '50%',
        originX: 'bottom',
        originY: 'right'
      };
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/kenburn.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_kenburnvue_type_script_lang_js_ = (kenburnvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/kenburn.vue





/* normalize component */

var kenburn_component = normalizeComponent(
  transitions_kenburnvue_type_script_lang_js_,
  kenburnvue_type_template_id_1473f698_render,
  kenburnvue_type_template_id_1473f698_staticRenderFns,
  false,
  null,
  null,
  null
  
)

kenburn_component.options.__file = "kenburn.vue"
/* harmony default export */ var kenburn = (kenburn_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/swipe.vue?vue&type=template&id=ac348e94&
var swipevue_type_template_id_ac348e94_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-wrapper',{ref:"wrapper"},[_c('flux-image',{ref:"image",attrs:{"slider":_vm.slider,"index":_vm.currentImage.index}})],1)}
var swipevue_type_template_id_ac348e94_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/swipe.vue?vue&type=template&id=ac348e94&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/swipe.vue?vue&type=script&lang=js&
//
//
//
//
//
//


/* harmony default export */ var swipevue_type_script_lang_js_ = ({
  name: 'transitionSwipe',
  components: {
    FluxWrapper: FluxWrapper,
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      totalDuration: 1400,
      easing: 'ease-in-out',
      wrapperCss: {
        overflow: 'hidden'
      }
    };
  },
  props: {
    slider: Object
  },
  computed: {
    wrapper: function wrapper() {
      return this.$refs.wrapper;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);

    if (this.direction === 'left') {
      this.wrapperCss.left = 'auto';
      this.wrapperCss.right = 0;
    }
  },
  mounted: function mounted() {
    this.wrapper.setCss(this.wrapperCss);

    if (this.direction === 'left') {
      this.$refs.image.setCss({
        left: 'auto',
        right: 0,
        width: this.slider.size.width + 'px'
      });
    }

    this.currentImage.hide();
    this.wrapper.transform({
      transition: 'width ' + this.totalDuration + 'ms ' + this.easing,
      width: 0
    });
  },
  destroyed: function destroyed() {
    this.nextImage.show();
  }
});
// CONCATENATED MODULE: ./src/components/transitions/swipe.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_swipevue_type_script_lang_js_ = (swipevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/swipe.vue





/* normalize component */

var swipe_component = normalizeComponent(
  transitions_swipevue_type_script_lang_js_,
  swipevue_type_template_id_ac348e94_render,
  swipevue_type_template_id_ac348e94_staticRenderFns,
  false,
  null,
  null,
  null
  
)

swipe_component.options.__file = "swipe.vue"
/* harmony default export */ var swipe = (swipe_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/slide.vue?vue&type=template&id=1ebcc78b&
var slidevue_type_template_id_1ebcc78b_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-wrapper',{ref:"wrapper"},[_c('flux-image',{ref:"imageLeft",attrs:{"slider":_vm.slider,"index":_vm.index.left}}),_c('flux-image',{ref:"imageRight",attrs:{"slider":_vm.slider,"index":_vm.index.right}})],1)}
var slidevue_type_template_id_1ebcc78b_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/slide.vue?vue&type=template&id=1ebcc78b&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/slide.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//


/* harmony default export */ var slidevue_type_script_lang_js_ = ({
  name: 'transitionSlide',
  components: {
    FluxWrapper: FluxWrapper,
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      totalDuration: 1400,
      easing: 'ease-in-out',
      wrapperCss: {
        width: '200%'
      },
      index: {
        left: undefined,
        right: undefined
      }
    };
  },
  props: {
    slider: Object
  },
  computed: {
    wrapper: function wrapper() {
      return this.$refs.wrapper;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
    this.index.left = this.currentImage.index;
    this.index.right = this.nextImage.index;

    if (this.direction === 'left') {
      this.index.left = this.nextImage.index;
      this.index.right = this.currentImage.index;
      this.wrapperCss.left = 'auto';
      this.wrapperCss.right = 0;
    }
  },
  mounted: function mounted() {
    this.currentImage.hide();
    this.slider.mask.style.overflow = 'hidden';
    this.wrapper.setCss(this.wrapperCss);
    this.$refs.imageLeft.setCss({
      width: '50%'
    });
    this.$refs.imageRight.setCss({
      left: 'auto',
      right: 0,
      width: '50%'
    });
    this.wrapper.transform({
      transition: 'transform ' + this.totalDuration + 'ms ' + this.easing,
      transform: 'translateX(' + this.getTx() + 'px)'
    });
  },
  destroyed: function destroyed() {
    this.slider.mask.style.overflow = 'visible';
  },
  methods: {
    getTx: function getTx() {
      var tx = -this.slider.size.width;
      if (this.direction === 'left') tx = Math.abs(tx);
      return tx;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/slide.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_slidevue_type_script_lang_js_ = (slidevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/slide.vue





/* normalize component */

var slide_component = normalizeComponent(
  transitions_slidevue_type_script_lang_js_,
  slidevue_type_template_id_1ebcc78b_render,
  slidevue_type_template_id_1ebcc78b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

slide_component.options.__file = "slide.vue"
/* harmony default export */ var slide = (slide_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/waterfall.vue?vue&type=template&id=d47b0694&
var waterfallvue_type_template_id_d47b0694_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var waterfallvue_type_template_id_d47b0694_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/waterfall.vue?vue&type=template&id=d47b0694&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/waterfall.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var waterfallvue_type_script_lang_js_ = ({
  name: 'transitionWaterfall',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 600,
      totalDuration: 0,
      easing: 'ease-in',
      tileDelay: 80
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 10;
    this.slider.setTransitionOptions(this, {
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * this.numCols + this.tileDuration;
    this.index = {
      front: this.currentImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.grid.setCss({
      overflow: 'hidden'
    });
    this.grid.transform(function (tile, i) {
      tile.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0.1',
        transform: 'translateY(' + _this.slider.size.height + 'px)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      var delay = i;
      if (this.direction === 'left') delay = this.numCols - i - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/waterfall.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_waterfallvue_type_script_lang_js_ = (waterfallvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/waterfall.vue





/* normalize component */

var waterfall_component = normalizeComponent(
  transitions_waterfallvue_type_script_lang_js_,
  waterfallvue_type_template_id_d47b0694_render,
  waterfallvue_type_template_id_d47b0694_staticRenderFns,
  false,
  null,
  null,
  null
  
)

waterfall_component.options.__file = "waterfall.vue"
/* harmony default export */ var waterfall = (waterfall_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/zip.vue?vue&type=template&id=1f89ffcf&
var zipvue_type_template_id_1f89ffcf_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var zipvue_type_template_id_1f89ffcf_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/zip.vue?vue&type=template&id=1f89ffcf&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/zip.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var zipvue_type_script_lang_js_ = ({
  name: 'transitionZip',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 600,
      totalDuration: 0,
      easing: 'ease-in',
      tileDelay: 80
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 10;
    this.slider.setTransitionOptions(this, {
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * this.numCols + this.tileDuration;
    this.index = {
      front: this.currentImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.grid.setCss({
      overflow: 'hidden'
    });
    this.grid.transform(function (tile, i) {
      tile.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0.1',
        transform: 'translateY(' + (i % 2 === 0 ? '-' : '') + _this.slider.size.height + 'px)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      var delay = i;
      if (this.direction === 'left') delay = this.numCols - i - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/zip.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_zipvue_type_script_lang_js_ = (zipvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/zip.vue





/* normalize component */

var zip_component = normalizeComponent(
  transitions_zipvue_type_script_lang_js_,
  zipvue_type_template_id_1f89ffcf_render,
  zipvue_type_template_id_1f89ffcf_staticRenderFns,
  false,
  null,
  null,
  null
  
)

zip_component.options.__file = "zip.vue"
/* harmony default export */ var zip = (zip_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blinds2d.vue?vue&type=template&id=0c3fe172&
var blinds2dvue_type_template_id_0c3fe172_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var blinds2dvue_type_template_id_0c3fe172_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/blinds2d.vue?vue&type=template&id=0c3fe172&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blinds2d.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var blinds2dvue_type_script_lang_js_ = ({
  name: 'transitionBlinds2d',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'linear',
      tileDelay: 100
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 10;
    this.slider.setTransitionOptions(this, {
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * this.numCols + this.tileDuration;
    this.index = {
      front: this.currentImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.grid.transform(function (tile, i) {
      tile.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0.1',
        transform: 'scaleX(0)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      var delay = i;
      if (this.direction === 'left') delay = this.numCols - i - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/blinds2d.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_blinds2dvue_type_script_lang_js_ = (blinds2dvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/blinds2d.vue





/* normalize component */

var blinds2d_component = normalizeComponent(
  transitions_blinds2dvue_type_script_lang_js_,
  blinds2dvue_type_template_id_0c3fe172_render,
  blinds2dvue_type_template_id_0c3fe172_staticRenderFns,
  false,
  null,
  null,
  null
  
)

blinds2d_component.options.__file = "blinds2d.vue"
/* harmony default export */ var blinds2d = (blinds2d_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blocks1.vue?vue&type=template&id=e0120842&
var blocks1vue_type_template_id_e0120842_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var blocks1vue_type_template_id_e0120842_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/blocks1.vue?vue&type=template&id=e0120842&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blocks1.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var blocks1vue_type_script_lang_js_ = ({
  name: 'transitionBlocks1',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 0,
      numCols: 0,
      tileDuration: 300,
      totalDuration: 0,
      easing: 'linear',
      tileDelay: 1000
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 8;
    this.slider.setTransitionOptions(this, {
      numRows: Math.floor(this.slider.size.height / divider),
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay + this.tileDuration;
    this.index = {
      front: this.currentImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.grid.transform(function (tile, i) {
      tile.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay() + 'ms',
        opacity: '0',
        transform: 'scale(0.4, 0.4)'
      });
    });
  },
  methods: {
    getDelay: function getDelay() {
      var delay = Math.random() * this.tileDelay;
      return Math.floor(delay);
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/blocks1.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_blocks1vue_type_script_lang_js_ = (blocks1vue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/blocks1.vue





/* normalize component */

var blocks1_component = normalizeComponent(
  transitions_blocks1vue_type_script_lang_js_,
  blocks1vue_type_template_id_e0120842_render,
  blocks1vue_type_template_id_e0120842_staticRenderFns,
  false,
  null,
  null,
  null
  
)

blocks1_component.options.__file = "blocks1.vue"
/* harmony default export */ var blocks1 = (blocks1_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blocks2.vue?vue&type=template&id=05dbdd92&
var blocks2vue_type_template_id_05dbdd92_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index,"tile-css":_vm.tileCss}})}
var blocks2vue_type_template_id_05dbdd92_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/blocks2.vue?vue&type=template&id=05dbdd92&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blocks2.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var blocks2vue_type_script_lang_js_ = ({
  name: 'transitionBlocks2',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'ease',
      tileDelay: 80,
      tileCss: {}
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 8;
    this.slider.setTransitionOptions(this, {
      numRows: Math.floor(this.slider.size.height / divider),
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * (this.numRows + this.numCols) + this.tileDuration;
    this.index = {
      front: this.currentImage.index
    };

    if (this.direction === 'left') {
      this.index.front = this.nextImage.index;
      this.tileCss = {
        opacity: 0,
        transform: 'scale(0.4, 0.4)'
      };
    }
  },
  mounted: function mounted() {
    var _this = this;

    var opacity, transform;

    if (this.direction === 'right') {
      opacity = 0;
      transform = 'scale(0.4, 0.4)';
      this.currentImage.hide();
    } else {
      opacity = 1;
      transform = 'scale(1, 1)';
      this.nextImage.hide();
    }

    this.grid.transform(function (tile, i) {
      tile.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: opacity,
        transform: transform
      });
    });
  },
  destroyed: function destroyed() {
    this.nextImage.show();
  },
  methods: {
    getDelay: function getDelay(i) {
      var row = this.grid.getRow(i);
      var col = this.grid.getCol(i);
      var delay = col + row;
      if (this.direction === 'left') delay = this.numRows + this.numCols - delay - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/blocks2.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_blocks2vue_type_script_lang_js_ = (blocks2vue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/blocks2.vue





/* normalize component */

var blocks2_component = normalizeComponent(
  transitions_blocks2vue_type_script_lang_js_,
  blocks2vue_type_template_id_05dbdd92_render,
  blocks2vue_type_template_id_05dbdd92_staticRenderFns,
  false,
  null,
  null,
  null
  
)

blocks2_component.options.__file = "blocks2.vue"
/* harmony default export */ var blocks2 = (blocks2_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/concentric.vue?vue&type=template&id=fbcd248c&
var concentricvue_type_template_id_fbcd248c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-vortex',{ref:"vortex",attrs:{"slider":_vm.slider,"num-circles":_vm.numCircles,"index":_vm.index}})}
var concentricvue_type_template_id_fbcd248c_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/concentric.vue?vue&type=template&id=fbcd248c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/concentric.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var concentricvue_type_script_lang_js_ = ({
  name: 'transitionConcentric',
  components: {
    FluxVortex: FluxVortex
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: undefined,
      numCircles: undefined,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'linear',
      tileDelay: 150
    };
  },
  props: {
    slider: Object
  },
  computed: {
    vortex: function vortex() {
      return this.$refs.vortex;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var size = this.slider.size;
    var diag = Math.sqrt(Math.pow(size.width, 2) + Math.pow(size.height, 2));
    var divider = this.slider.size.width / 8;
    this.slider.setTransitionOptions(this, {
      numCircles: Math.ceil(diag / 2 / divider) + 1
    });
    this.totalDuration = this.tileDelay * this.numCircles + this.tileDuration;
    this.index = this.currentImage.index;
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.vortex.setCss({
      overflow: 'hidden'
    });
    this.vortex.transform(function (circle, i) {
      circle.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'rotateZ(' + _this.getDeg() + 'deg)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      return i * this.tileDelay;
    },
    getDeg: function getDeg() {
      return this.direction === 'left' ? '-90' : '90';
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/concentric.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_concentricvue_type_script_lang_js_ = (concentricvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/concentric.vue





/* normalize component */

var concentric_component = normalizeComponent(
  transitions_concentricvue_type_script_lang_js_,
  concentricvue_type_template_id_fbcd248c_render,
  concentricvue_type_template_id_fbcd248c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

concentric_component.options.__file = "concentric.vue"
/* harmony default export */ var concentric = (concentric_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/warp.vue?vue&type=template&id=2f576604&
var warpvue_type_template_id_2f576604_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-vortex',{ref:"vortex",attrs:{"slider":_vm.slider,"num-circles":_vm.numCircles,"index":_vm.index}})}
var warpvue_type_template_id_2f576604_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/warp.vue?vue&type=template&id=2f576604&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/warp.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var warpvue_type_script_lang_js_ = ({
  name: 'transitionWarp',
  components: {
    FluxVortex: FluxVortex
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: undefined,
      numCircles: undefined,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'linear',
      tileDelay: 150
    };
  },
  props: {
    slider: Object
  },
  computed: {
    vortex: function vortex() {
      return this.$refs.vortex;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var size = this.slider.size;
    var diag = Math.sqrt(Math.pow(size.width, 2) + Math.pow(size.height, 2));
    var divider = this.slider.size.width / 8;
    this.slider.setTransitionOptions(this, {
      numCircles: Math.ceil(diag / 2 / divider) + 1
    });
    this.totalDuration = this.tileDelay * this.numCircles + this.tileDuration;
    this.index = this.currentImage.index;
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.vortex.setCss({
      overflow: 'hidden'
    });
    this.vortex.transform(function (circle, i) {
      circle.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'rotateZ(' + _this.getDeg(i) + 'deg)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      return i * this.tileDelay;
    },
    getDeg: function getDeg(i) {
      return i % 2 === 0 ? '-90' : '90';
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/warp.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_warpvue_type_script_lang_js_ = (warpvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/warp.vue





/* normalize component */

var warp_component = normalizeComponent(
  transitions_warpvue_type_script_lang_js_,
  warpvue_type_template_id_2f576604_render,
  warpvue_type_template_id_2f576604_staticRenderFns,
  false,
  null,
  null,
  null
  
)

warp_component.options.__file = "warp.vue"
/* harmony default export */ var warp = (warp_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/camera.vue?vue&type=template&id=5df63b2e&
var cameravue_type_template_id_5df63b2e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-vortex',{ref:"vortex",attrs:{"slider":_vm.slider,"num-circles":_vm.numCircles,"index":_vm.index}})}
var cameravue_type_template_id_5df63b2e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/camera.vue?vue&type=template&id=5df63b2e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/camera.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var cameravue_type_script_lang_js_ = ({
  name: 'transitionCamera',
  components: {
    FluxVortex: FluxVortex
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: undefined,
      numCircles: undefined,
      tileDuration: 400,
      totalDuration: 0,
      easing: 'ease',
      tileDelay: 80
    };
  },
  props: {
    slider: Object
  },
  computed: {
    vortex: function vortex() {
      return this.$refs.vortex;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var size = this.slider.size;
    var diag = Math.sqrt(Math.pow(size.width, 2) + Math.pow(size.height, 2));
    var divider = this.slider.size.width / 8;
    this.slider.setTransitionOptions(this, {
      numCircles: Math.ceil(diag / 2 / divider) + 1
    });
    this.totalDuration = this.tileDelay * this.numCircles + this.tileDuration;
    this.index = this.currentImage.index;
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.vortex.setCss({
      overflow: 'hidden'
    });
    this.vortex.transform(function (circle, i) {
      circle.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'scale(0, 0)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      return i * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/camera.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_cameravue_type_script_lang_js_ = (cameravue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/camera.vue





/* normalize component */

var camera_component = normalizeComponent(
  transitions_cameravue_type_script_lang_js_,
  cameravue_type_template_id_5df63b2e_render,
  cameravue_type_template_id_5df63b2e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

camera_component.options.__file = "camera.vue"
/* harmony default export */ var camera = (camera_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/cube.vue?vue&type=template&id=60bb2606&
var cubevue_type_template_id_60bb2606_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-cube',{ref:"cube",attrs:{"slider":_vm.slider,"index":_vm.index}})}
var cubevue_type_template_id_60bb2606_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/cube.vue?vue&type=template&id=60bb2606&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/cube.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var cubevue_type_script_lang_js_ = ({
  name: 'transitionCube',
  components: {
    FluxCube: FluxCube
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      totalDuration: 1400,
      perspective: '1600px',
      easing: 'ease-out'
    };
  },
  props: {
    slider: Object
  },
  computed: {
    cube: function cube() {
      return this.$refs.cube;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
    this.index = {
      front: this.currentImage.index,
      left: this.nextImage.index,
      right: this.nextImage.index
    };
  },
  mounted: function mounted() {
    this.slider.mask.style.perspective = this.perspective;
    this.currentImage.hide();
    this.nextImage.hide();
    this.cube.setCss({
      transition: 'all ' + this.totalDuration + 'ms ' + this.easing
    });
    this.cube.turn(this.direction);
  },
  destroyed: function destroyed() {
    this.slider.mask.style.perspective = 'none';
    this.nextImage.show();
  }
});
// CONCATENATED MODULE: ./src/components/transitions/cube.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_cubevue_type_script_lang_js_ = (cubevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/cube.vue





/* normalize component */

var cube_component = normalizeComponent(
  transitions_cubevue_type_script_lang_js_,
  cubevue_type_template_id_60bb2606_render,
  cubevue_type_template_id_60bb2606_staticRenderFns,
  false,
  null,
  null,
  null
  
)

cube_component.options.__file = "cube.vue"
/* harmony default export */ var cube = (cube_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/book.vue?vue&type=template&id=6a3cc2f6&
var bookvue_type_template_id_6a3cc2f6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('flux-cube',{ref:"cube",attrs:{"slider":_vm.slider,"index":_vm.index,"css":_vm.cubeCss}}),_c('flux-image',{ref:"image",attrs:{"slider":_vm.slider,"index":_vm.index.back,"css":_vm.imageCss}})],1)}
var bookvue_type_template_id_6a3cc2f6_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/book.vue?vue&type=template&id=6a3cc2f6&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/slicedToArray.js



function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/book.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//


/* harmony default export */ var bookvue_type_script_lang_js_ = ({
  name: 'transitionBook',
  components: {
    FluxCube: FluxCube,
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      totalDuration: 1200,
      easing: 'ease-out',
      pageWidth: 0,
      cubeCss: {
        top: 0,
        left: 0,
        width: 0,
        transformOrigin: 'left center',
        zIndex: 13
      },
      imageCss: {
        top: 0,
        left: 0,
        width: 0,
        zIndex: 12
      },
      index: {
        front: undefined,
        back: undefined
      }
    };
  },
  props: {
    slider: Object
  },
  computed: {
    cube: function cube() {
      return this.$refs.cube;
    },
    image: function image() {
      return this.$refs.image;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
    this.pageWidth = this.slider.size.width / 2;
    this.imageCss.width = Math.ceil(this.pageWidth) + 'px';
    this.cubeCss.width = Math.ceil(this.pageWidth) + 'px';

    if (this.direction !== 'left') {
      this.cubeCss.left = Math.ceil(this.pageWidth) + 'px';
      this.imageCss.left = Math.ceil(this.pageWidth) + 'px';
    }

    this.index.front = this.currentImage.index;
    this.index.back = this.nextImage.index;
  },
  mounted: function mounted() {
    var _this = this;

    this.setCubeCss();
    this.setCubeBackCss();
    this.setImageCss();
    this.slider.mask.style.perspective = '1600px';
    this.$nextTick(function () {
      _this.cube.transform({
        transition: 'transform ' + _this.totalDuration + 'ms ' + _this.easing,
        transform: 'rotateY(' + _this.getDeg() + 'deg)'
      });
    });
  },
  destroyed: function destroyed() {
    this.slider.mask.style.perspective = 'none';
  },
  methods: {
    setCubeCss: function setCubeCss() {
      if (this.direction === 'left') {
        this.cube.setCss({
          transformOrigin: 'right center'
        });
      }
    },
    setCubeBackCss: function setCubeBackCss() {
      var _this$cube$back$style = this.cube.back.style.backgroundPosition.split(' '),
          _this$cube$back$style2 = _slicedToArray(_this$cube$back$style, 1),
          backgroundPositionX = _this$cube$back$style2[0];

      backgroundPositionX = parseFloat(backgroundPositionX);
      if (this.direction !== 'left') backgroundPositionX += this.pageWidth;else backgroundPositionX -= this.pageWidth;
      this.cube.back.setCss({
        backgroundPositionX: backgroundPositionX + 'px'
      });
    },
    setImageCss: function setImageCss() {
      if (this.direction !== 'left') {
        this.image.setCss({
          left: Math.ceil(this.pageWidth) + 'px'
        });
      }
    },
    getDeg: function getDeg() {
      return this.direction !== 'left' ? '-180' : '180';
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/book.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_bookvue_type_script_lang_js_ = (bookvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/book.vue





/* normalize component */

var book_component = normalizeComponent(
  transitions_bookvue_type_script_lang_js_,
  bookvue_type_template_id_6a3cc2f6_render,
  bookvue_type_template_id_6a3cc2f6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

book_component.options.__file = "book.vue"
/* harmony default export */ var book = (book_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/fall.vue?vue&type=template&id=63facc10&
var fallvue_type_template_id_63facc10_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-image',{ref:"image",attrs:{"slider":_vm.slider,"index":_vm.currentImage.index,"css":_vm.imageCss}})}
var fallvue_type_template_id_63facc10_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/fall.vue?vue&type=template&id=63facc10&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/fall.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var fallvue_type_script_lang_js_ = ({
  name: 'transitionFall',
  components: {
    FluxImage: FluxImage
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      totalDuration: 1600,
      easing: 'ease-in',
      imageCss: {
        top: 0,
        left: 0,
        transformOrigin: 'center bottom',
        zIndex: 12
      }
    };
  },
  props: {
    slider: Object
  },
  computed: {
    image: function image() {
      return this.$refs.image;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.slider.mask.style.perspective = '1600px';
    this.$nextTick(function () {
      _this.image.transform({
        transition: 'transform ' + _this.totalDuration + 'ms ' + _this.easing,
        transform: 'rotateX(-90deg)'
      });
    });
  },
  destroyed: function destroyed() {
    this.nextImage.show();
    this.slider.mask.style.perspective = 'none';
  }
});
// CONCATENATED MODULE: ./src/components/transitions/fall.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_fallvue_type_script_lang_js_ = (fallvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/fall.vue





/* normalize component */

var fall_component = normalizeComponent(
  transitions_fallvue_type_script_lang_js_,
  fallvue_type_template_id_63facc10_render,
  fallvue_type_template_id_63facc10_staticRenderFns,
  false,
  null,
  null,
  null
  
)

fall_component.options.__file = "fall.vue"
/* harmony default export */ var fall = (fall_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/wave.vue?vue&type=template&id=733bf098&
var wavevue_type_template_id_733bf098_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var wavevue_type_template_id_733bf098_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/wave.vue?vue&type=template&id=733bf098&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/wave.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var wavevue_type_script_lang_js_ = ({
  name: 'transitionWave',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'ease-out',
      tileDelay: 150,
      sideColor: '#333'
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 8;
    this.slider.setTransitionOptions(this, {
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * this.numCols + this.tileDuration;
    this.index = {
      front: this.currentImage.index,
      top: this.nextImage.index,
      bottom: this.nextImage.index,
      left: this.sideColor,
      right: this.sideColor
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.nextImage.hide();
    this.grid.setCss({
      perspective: '1200px'
    });
    this.grid.transform(function (tile, i) {
      tile.setCss({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms'
      });
      tile.turn(_this.direction === 'right' ? 'bottom' : 'top');
    });
  },
  destroyed: function destroyed() {
    this.nextImage.show();
  },
  methods: {
    getDelay: function getDelay(i) {
      var delay = i;
      if (this.direction === 'left') delay = this.numCols - i - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/wave.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_wavevue_type_script_lang_js_ = (wavevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/wave.vue





/* normalize component */

var wave_component = normalizeComponent(
  transitions_wavevue_type_script_lang_js_,
  wavevue_type_template_id_733bf098_render,
  wavevue_type_template_id_733bf098_staticRenderFns,
  false,
  null,
  null,
  null
  
)

wave_component.options.__file = "wave.vue"
/* harmony default export */ var wave = (wave_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blinds3d.vue?vue&type=template&id=29278114&
var blinds3dvue_type_template_id_29278114_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var blinds3dvue_type_template_id_29278114_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/blinds3d.vue?vue&type=template&id=29278114&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/blinds3d.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var blinds3dvue_type_script_lang_js_ = ({
  name: 'transitionBlinds3d',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'ease-out',
      tileDelay: 150
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 6;
    this.slider.setTransitionOptions(this, {
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * this.numCols + this.tileDuration;
    this.index = {
      front: this.currentImage.index,
      back: this.nextImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.nextImage.hide();
    this.grid.setCss({
      perspective: '800px'
    });
    var deg = this.getDeg();
    this.grid.transform(function (tile, i) {
      tile.setCss({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms'
      });
      tile.turn('back', _this.direction);
    });
  },
  destroyed: function destroyed() {
    this.nextImage.show();
  },
  methods: {
    getDelay: function getDelay(i) {
      var delay = i;
      if (this.direction === 'left') delay = this.numCols - i - 1;
      return delay * this.tileDelay;
    },
    getDeg: function getDeg() {
      return this.direction === 'right' ? '180' : '-180';
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/blinds3d.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_blinds3dvue_type_script_lang_js_ = (blinds3dvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/blinds3d.vue





/* normalize component */

var blinds3d_component = normalizeComponent(
  transitions_blinds3dvue_type_script_lang_js_,
  blinds3dvue_type_template_id_29278114_render,
  blinds3dvue_type_template_id_29278114_staticRenderFns,
  false,
  null,
  null,
  null
  
)

blinds3d_component.options.__file = "blinds3d.vue"
/* harmony default export */ var blinds3d = (blinds3d_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/round1.vue?vue&type=template&id=3977a130&
var round1vue_type_template_id_3977a130_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index,"tile-css":_vm.tileCss}})}
var round1vue_type_template_id_3977a130_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/round1.vue?vue&type=template&id=3977a130&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/round1.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var round1vue_type_script_lang_js_ = ({
  name: 'transitionRound1',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 1,
      numCols: 0,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'ease-out',
      tileDelay: 150,
      tileCss: {}
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 6;
    this.slider.setTransitionOptions(this, {
      numRows: Math.floor(this.slider.size.height / divider),
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = this.tileDelay * (this.numRows > this.numCols ? this.numRows : this.numCols) * 2 + this.tileDelay;
    this.index = {
      front: this.currentImage.index,
      back: this.nextImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.nextImage.hide();
    this.grid.setCss({
      perspective: '800px'
    });
    this.grid.transform(function (tile, i) {
      tile.setCss({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms'
      });
      tile.turn('back', _this.direction);
    });
  },
  destroyed: function destroyed() {
    this.nextImage.show();
  },
  methods: {
    getDelay: function getDelay(i) {
      var row = this.grid.getRow(i);
      var col = this.grid.getCol(i);
      var delay = col + row;
      if (this.direction === 'left') delay = this.numRows + this.numCols - delay - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/round1.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_round1vue_type_script_lang_js_ = (round1vue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/round1.vue





/* normalize component */

var round1_component = normalizeComponent(
  transitions_round1vue_type_script_lang_js_,
  round1vue_type_template_id_3977a130_render,
  round1vue_type_template_id_3977a130_staticRenderFns,
  false,
  null,
  null,
  null
  
)

round1_component.options.__file = "round1.vue"
/* harmony default export */ var round1 = (round1_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/round2.vue?vue&type=template&id=a02cae9e&
var round2vue_type_template_id_a02cae9e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var round2vue_type_template_id_a02cae9e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/round2.vue?vue&type=template&id=a02cae9e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/round2.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var round2vue_type_script_lang_js_ = ({
  name: 'transitionRound2',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 0,
      numCols: 0,
      tileDuration: 800,
      totalDuration: 0,
      easing: 'linear',
      tileDelay: 100
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 9;
    this.slider.setTransitionOptions(this, {
      numRows: Math.floor(this.slider.size.height / divider),
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = (this.numCols / 2 + this.numRows) * (this.tileDelay * 2);
    this.index = {
      front: this.currentImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.grid.setCss({
      perspective: '1200px'
    });
    this.grid.transform(function (tile, i) {
      tile.front.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'rotateX(-540deg)'
      });
    });
  },
  methods: {
    getDelay: function getDelay(i) {
      var row = this.grid.getRow(i);
      var col = this.grid.getCol(i);
      var delay = Math.abs(this.numRows - row) + Math.abs(this.numCols / 2 - 0.5 - col) - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/round2.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_round2vue_type_script_lang_js_ = (round2vue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/round2.vue





/* normalize component */

var round2_component = normalizeComponent(
  transitions_round2vue_type_script_lang_js_,
  round2vue_type_template_id_a02cae9e_render,
  round2vue_type_template_id_a02cae9e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

round2_component.options.__file = "round2.vue"
/* harmony default export */ var round2 = (round2_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/explode.vue?vue&type=template&id=f15350f6&
var explodevue_type_template_id_f15350f6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('flux-grid',{ref:"grid",attrs:{"slider":_vm.slider,"num-rows":_vm.numRows,"num-cols":_vm.numCols,"index":_vm.index}})}
var explodevue_type_template_id_f15350f6_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/explode.vue?vue&type=template&id=f15350f6&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/explode.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var explodevue_type_script_lang_js_ = ({
  name: 'transitionExplode',
  components: {
    FluxGrid: FluxGrid
  },
  data: function data() {
    return {
      currentImage: undefined,
      nextImage: undefined,
      index: {},
      numRows: 0,
      numCols: 0,
      tileDuration: 300,
      totalDuration: 0,
      easing: 'linear',
      tileDelay: 100
    };
  },
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },
  created: function created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    var divider = this.slider.size.width / 9;
    this.slider.setTransitionOptions(this, {
      numRows: Math.floor(this.slider.size.height / divider),
      numCols: Math.floor(this.slider.size.width / divider)
    });
    this.totalDuration = (this.numCols / 2 + this.numRows / 2) * (this.tileDelay * 2);
    this.index = {
      front: this.currentImage.index
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.currentImage.hide();
    this.grid.transform(function (tile, i) {
      tile.front.transform({
        transition: 'all ' + _this.tileDuration + 'ms ' + _this.easing + ' ' + _this.getDelay(i) + 'ms',
        borderRadius: '100%',
        opacity: '0',
        transform: 'scale(1.6, 1.6)'
      });
    });
  },
  destroyed: function destroyed() {
    this.slider.mask.style.perspective = 'none';
  },
  methods: {
    getDelay: function getDelay(i) {
      var row = this.grid.getRow(i);
      var col = this.grid.getCol(i);
      var delay = Math.abs(this.numRows / 2 - 0.5 - row) + Math.abs(this.numCols / 2 - 0.5 - col) - 1;
      return delay * this.tileDelay;
    }
  }
});
// CONCATENATED MODULE: ./src/components/transitions/explode.vue?vue&type=script&lang=js&
 /* harmony default export */ var transitions_explodevue_type_script_lang_js_ = (explodevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/transitions/explode.vue





/* normalize component */

var explode_component = normalizeComponent(
  transitions_explodevue_type_script_lang_js_,
  explodevue_type_template_id_f15350f6_render,
  explodevue_type_template_id_f15350f6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

explode_component.options.__file = "explode.vue"
/* harmony default export */ var explode = (explode_component.exports);
// CONCATENATED MODULE: ./src/components/transitions/index.js




















/* harmony default export */ var transitions = ({
  transitionFade: fade,
  transitionKenburn: kenburn,
  transitionSwipe: swipe,
  transitionSlide: slide,
  transitionWaterfall: waterfall,
  transitionZip: zip,
  transitionBlinds2d: blinds2d,
  transitionBlocks1: blocks1,
  transitionBlocks2: blocks2,
  transitionConcentric: concentric,
  transitionWarp: warp,
  transitionCamera: camera,
  transitionCube: cube,
  transitionBook: book,
  transitionFall: fall,
  transitionWave: wave,
  transitionBlinds3d: blinds3d,
  transitionRound1: round1,
  transitionRound2: round2,
  transitionExplode: explode
});
// CONCATENATED MODULE: ./src/components/index.js














// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js
/* concated harmony reexport FluxCaption */__webpack_require__.d(__webpack_exports__, "FluxCaption", function() { return FluxCaption; });
/* concated harmony reexport FluxControls */__webpack_require__.d(__webpack_exports__, "FluxControls", function() { return FluxControls; });
/* concated harmony reexport FluxCube */__webpack_require__.d(__webpack_exports__, "FluxCube", function() { return FluxCube; });
/* concated harmony reexport FluxGrid */__webpack_require__.d(__webpack_exports__, "FluxGrid", function() { return FluxGrid; });
/* concated harmony reexport FluxImage */__webpack_require__.d(__webpack_exports__, "FluxImage", function() { return FluxImage; });
/* concated harmony reexport FluxIndex */__webpack_require__.d(__webpack_exports__, "FluxIndex", function() { return FluxIndex; });
/* concated harmony reexport FluxPagination */__webpack_require__.d(__webpack_exports__, "FluxPagination", function() { return FluxPagination; });
/* concated harmony reexport FluxParallax */__webpack_require__.d(__webpack_exports__, "FluxParallax", function() { return FluxParallax; });
/* concated harmony reexport FluxThumb */__webpack_require__.d(__webpack_exports__, "FluxThumb", function() { return FluxThumb; });
/* concated harmony reexport FluxVortex */__webpack_require__.d(__webpack_exports__, "FluxVortex", function() { return FluxVortex; });
/* concated harmony reexport FluxWrapper */__webpack_require__.d(__webpack_exports__, "FluxWrapper", function() { return FluxWrapper; });
/* concated harmony reexport VueFlux */__webpack_require__.d(__webpack_exports__, "VueFlux", function() { return VueFlux; });
/* concated harmony reexport Transitions */__webpack_require__.d(__webpack_exports__, "Transitions", function() { return transitions; });




/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
//# sourceMappingURL=vue-flux.common.js.map