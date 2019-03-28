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
/******/ 	return __webpack_require__(__webpack_require__.s = "5a74");
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

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
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

/***/ "1ab6":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("7aa2");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("1d350872", content, shadowRoot)
};

/***/ }),

/***/ "1d36":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7ecf");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

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

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


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

/***/ "35d6":
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

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesShadow.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addStylesToShadowDOM; });


function addStylesToShadowDOM (parentId, list, shadowRoot) {
  var styles = listToStyles(parentId, list)
  addStyles(styles, shadowRoot)
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

function addStyles (styles /* Array<StyleObject> */, shadowRoot) {
  const injectedStyles =
    shadowRoot._injectedStyles ||
    (shadowRoot._injectedStyles = {})
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var style = injectedStyles[item.id]
    if (!style) {
      for (var j = 0; j < item.parts.length; j++) {
        addStyle(item.parts[j], shadowRoot)
      }
      injectedStyles[item.id] = true
    }
  }
}

function createStyleElement (shadowRoot) {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  shadowRoot.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */, shadowRoot) {
  var styleElement = createStyleElement(shadowRoot)
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
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

/***/ "37c8":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("8b48");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("af30985c", content, shadowRoot)
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

/***/ "5a74":
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

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__("8bbf");
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// CONCATENATED MODULE: ./node_modules/@vue/web-component-wrapper/dist/vue-wc-wrapper.js
const camelizeRE = /-(\w)/g;
const camelize = str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
};

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
};

function getInitialProps (propsList) {
  const res = {};
  propsList.forEach(key => {
    res[key] = undefined;
  });
  return res
}

function injectHook (options, key, hook) {
  options[key] = [].concat(options[key] || []);
  options[key].unshift(hook);
}

function callHooks (vm, hook) {
  if (vm) {
    const hooks = vm.$options[hook] || [];
    hooks.forEach(hook => {
      hook.call(vm);
    });
  }
}

function createCustomEvent (name, args) {
  return new CustomEvent(name, {
    bubbles: false,
    cancelable: false,
    detail: args
  })
}

const isBoolean = val => /function Boolean/.test(String(val));
const isNumber = val => /function Number/.test(String(val));

function convertAttributeValue (value, name, { type } = {}) {
  if (isBoolean(type)) {
    if (value === 'true' || value === 'false') {
      return value === 'true'
    }
    if (value === '' || value === name) {
      return true
    }
    return value != null
  } else if (isNumber(type)) {
    const parsed = parseFloat(value, 10);
    return isNaN(parsed) ? value : parsed
  } else {
    return value
  }
}

function toVNodes (h, children) {
  const res = [];
  for (let i = 0, l = children.length; i < l; i++) {
    res.push(toVNode(h, children[i]));
  }
  return res
}

function toVNode (h, node) {
  if (node.nodeType === 3) {
    return node.data.trim() ? node.data : null
  } else if (node.nodeType === 1) {
    const data = {
      attrs: getAttributes(node),
      domProps: {
        innerHTML: node.innerHTML
      }
    };
    if (data.attrs.slot) {
      data.slot = data.attrs.slot;
      delete data.attrs.slot;
    }
    return h(node.tagName, data)
  } else {
    return null
  }
}

function getAttributes (node) {
  const res = {};
  for (let i = 0, l = node.attributes.length; i < l; i++) {
    const attr = node.attributes[i];
    res[attr.nodeName] = attr.nodeValue;
  }
  return res
}

function wrap (Vue, Component) {
  const isAsync = typeof Component === 'function' && !Component.cid;
  let isInitialized = false;
  let hyphenatedPropsList;
  let camelizedPropsList;
  let camelizedPropsMap;

  function initialize (Component) {
    if (isInitialized) return

    const options = typeof Component === 'function'
      ? Component.options
      : Component;

    // extract props info
    const propsList = Array.isArray(options.props)
      ? options.props
      : Object.keys(options.props || {});
    hyphenatedPropsList = propsList.map(hyphenate);
    camelizedPropsList = propsList.map(camelize);
    const originalPropsAsObject = Array.isArray(options.props) ? {} : options.props || {};
    camelizedPropsMap = camelizedPropsList.reduce((map, key, i) => {
      map[key] = originalPropsAsObject[propsList[i]];
      return map
    }, {});

    // proxy $emit to native DOM events
    injectHook(options, 'beforeCreate', function () {
      const emit = this.$emit;
      this.$emit = (name, ...args) => {
        this.$root.$options.customElement.dispatchEvent(createCustomEvent(name, args));
        return emit.call(this, name, ...args)
      };
    });

    injectHook(options, 'created', function () {
      // sync default props values to wrapper on created
      camelizedPropsList.forEach(key => {
        this.$root.props[key] = this[key];
      });
    });

    // proxy props as Element properties
    camelizedPropsList.forEach(key => {
      Object.defineProperty(CustomElement.prototype, key, {
        get () {
          return this._wrapper.props[key]
        },
        set (newVal) {
          this._wrapper.props[key] = newVal;
        },
        enumerable: false,
        configurable: true
      });
    });

    isInitialized = true;
  }

  function syncAttribute (el, key) {
    const camelized = camelize(key);
    const value = el.hasAttribute(key) ? el.getAttribute(key) : undefined;
    el._wrapper.props[camelized] = convertAttributeValue(
      value,
      key,
      camelizedPropsMap[camelized]
    );
  }

  class CustomElement extends HTMLElement {
    constructor () {
      super();
      this.attachShadow({ mode: 'open' });

      const wrapper = this._wrapper = new Vue({
        name: 'shadow-root',
        customElement: this,
        shadowRoot: this.shadowRoot,
        data () {
          return {
            props: {},
            slotChildren: []
          }
        },
        render (h) {
          return h(Component, {
            ref: 'inner',
            props: this.props
          }, this.slotChildren)
        }
      });

      // Use MutationObserver to react to future attribute & slot content change
      const observer = new MutationObserver(mutations => {
        let hasChildrenChange = false;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (isInitialized && m.type === 'attributes' && m.target === this) {
            syncAttribute(this, m.attributeName);
          } else {
            hasChildrenChange = true;
          }
        }
        if (hasChildrenChange) {
          wrapper.slotChildren = Object.freeze(toVNodes(
            wrapper.$createElement,
            this.childNodes
          ));
        }
      });
      observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    }

    get vueComponent () {
      return this._wrapper.$refs.inner
    }

    connectedCallback () {
      const wrapper = this._wrapper;
      if (!wrapper._isMounted) {
        // initialize attributes
        const syncInitialAttributes = () => {
          wrapper.props = getInitialProps(camelizedPropsList);
          hyphenatedPropsList.forEach(key => {
            syncAttribute(this, key);
          });
        };

        if (isInitialized) {
          syncInitialAttributes();
        } else {
          // async & unresolved
          Component().then(resolved => {
            if (resolved.__esModule || resolved[Symbol.toStringTag] === 'Module') {
              resolved = resolved.default;
            }
            initialize(resolved);
            syncInitialAttributes();
          });
        }
        // initialize children
        wrapper.slotChildren = Object.freeze(toVNodes(
          wrapper.$createElement,
          this.childNodes
        ));
        wrapper.$mount();
        this.shadowRoot.appendChild(wrapper.$el);
      } else {
        callHooks(this.vueComponent, 'activated');
      }
    }

    disconnectedCallback () {
      callHooks(this.vueComponent, 'deactivated');
    }
  }

  if (!isAsync) {
    initialize(Component);
  }

  return CustomElement
}

/* harmony default export */ var vue_wc_wrapper = (wrap);

// EXTERNAL MODULE: ./node_modules/css-loader/lib/css-base.js
var css_base = __webpack_require__("2350");

// EXTERNAL MODULE: ./node_modules/vue-style-loader/lib/addStylesShadow.js + 1 modules
var addStylesShadow = __webpack_require__("35d6");

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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=3ef147ee&scoped=true&shadow
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_c('div',{staticClass:"container mx-auto"},[_c('h1',{staticClass:"my-4"},[_vm._v("Vue flux")]),_c('p',[_vm._v("You can use arrow keys to show next image (when no transition running). Double click to switch full screen mode.")]),_c('div',{staticClass:"sm:block md:block lg:flex xl:flex"},[_c('div',{staticClass:"lg:w-3/5 px-2 mb-4"},[_c('vue-flux',{ref:"slider",attrs:{"options":_vm.fluxOptions,"images":_vm.fluxImages,"transitions":_vm.fluxTransitions,"captions":_vm.fluxCaptions}},[_c('flux-caption',{attrs:{"slot":"caption"},slot:"caption"}),_c('flux-controls',{attrs:{"slot":"controls"},slot:"controls"}),_c('flux-index',{attrs:{"slot":"index"},slot:"index"}),_c('flux-pagination',{attrs:{"slot":"pagination"},slot:"pagination"})],1)],1),_c('div',{staticClass:"lg:w-2/5 px-2 mb-4 transitions"},[_c('h4',{staticClass:"mb-2"},[_vm._v("2D Transitions")]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionFade'),on:{"click":function($event){_vm.showNext('transitionFade')}}},[_vm._v("Fade")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionKenburn'),on:{"click":function($event){_vm.showNext('transitionKenburn')}}},[_vm._v("Kenburn")])])]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionSwipe'),on:{"click":function($event){_vm.showNext('transitionSwipe')}}},[_vm._v("Swipe")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionSlide'),on:{"click":function($event){_vm.showNext('transitionSlide')}}},[_vm._v("Slide")])])]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionWaterfall'),on:{"click":function($event){_vm.showNext('transitionWaterfall')}}},[_vm._v("Waterfall")])]),_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionZip'),on:{"click":function($event){_vm.showNext('transitionZip')}}},[_vm._v("Zip")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionBlinds2d'),on:{"click":function($event){_vm.showNext('transitionBlinds2d')}}},[_vm._v("Blinds 2D")])])]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionBlocks1'),on:{"click":function($event){_vm.showNext('transitionBlocks1')}}},[_vm._v("Blocks 1")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionBlocks2'),on:{"click":function($event){_vm.showNext('transitionBlocks2')}}},[_vm._v("Blocks 2")])])]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionConcentric'),on:{"click":function($event){_vm.showNext('transitionConcentric')}}},[_vm._v("Concentric")])]),_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionWarp'),on:{"click":function($event){_vm.showNext('transitionWarp')}}},[_vm._v("Warp")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionCamera'),on:{"click":function($event){_vm.showNext('transitionCamera')}}},[_vm._v("Camera")])])]),_c('h4',{staticClass:"mt-5 mb-2"},[_vm._v("3D Transitions")]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionCube'),on:{"click":function($event){_vm.showNext('transitionCube')}}},[_vm._v("Cube")])]),_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionBook'),on:{"click":function($event){_vm.showNext('transitionBook')}}},[_vm._v("Book")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionFall'),on:{"click":function($event){_vm.showNext('transitionFall')}}},[_vm._v("Fall")])])]),_c('ul',{staticClass:"list-reset flex mb-2"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionWave'),on:{"click":function($event){_vm.showNext('transitionWave')}}},[_vm._v("Wave")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionBlinds3d'),on:{"click":function($event){_vm.showNext('transitionBlinds3d')}}},[_vm._v("Blinds 3D")])])]),_c('ul',{staticClass:"list-reset flex"},[_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionRound1'),on:{"click":function($event){_vm.showNext('transitionRound1')}}},[_vm._v("Round 1")])]),_c('li',{staticClass:"flex-1 mr-2"},[_c('a',{class:_vm.transitionClass('transitionRound2'),on:{"click":function($event){_vm.showNext('transitionRound2')}}},[_vm._v("Round 2")])]),_c('li',{staticClass:"flex-1"},[_c('a',{class:_vm.transitionClass('transitionExplode'),on:{"click":function($event){_vm.showNext('transitionExplode')}}},[_vm._v("Explode")])])])])]),_c('p',[_vm._v("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam turpis enim, scelerisque vitae tellus quis, vulputate pulvinar lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a lobortis enim. Donec pellentesque enim at vulputate tempus. Suspendisse ultricies elementum sem id porta. Suspendisse arcu nisi, luctus et malesuada at, dignissim et tortor. Sed ullamcorper sapien lacinia eros commodo, ut vestibulum metus gravida. Morbi at est sollicitudin, viverra mauris et, tincidunt felis. Morbi et ornare lorem. Praesent vel consequat enim. Nunc urna ante, consequat eget egestas et, mollis et lacus. Donec sed fringilla nunc, ut vestibulum metus. Vivamus suscipit efficitur efficitur. Nunc id feugiat ante, non faucibus arcu.")]),_c('p',[_vm._v("Curabitur vitae leo bibendum, ullamcorper dui ut, scelerisque orci. Curabitur volutpat consectetur ligula eu venenatis. Nulla vitae tellus nisi. Donec ac velit augue. Integer vel turpis suscipit, vehicula turpis cursus, dapibus metus. Sed dictum ex eget enim dictum, vitae lobortis urna finibus. Nulla vestibulum rhoncus arcu sit amet maximus. Morbi semper porttitor pulvinar.")]),_c('p',[_vm._v("Cras at dolor fringilla purus consequat fringilla. Cras maximus sem sapien, aliquam egestas enim feugiat quis. Fusce et ante elementum, tristique nisl ac, convallis turpis. Fusce dui eros, blandit sit amet ante sit amet, bibendum mollis neque. Morbi varius tincidunt massa vitae molestie. Phasellus posuere non sapien ac condimentum. Aliquam tempor eu libero et vehicula. Morbi quis mi nec neque porttitor porttitor vel vel sem. Duis pretium felis sit amet tortor tristique vehicula. Morbi gravida tempus neque, et hendrerit urna suscipit a. Curabitur finibus tellus at sapien placerat, et dapibus nisi gravida. Sed sit amet dapibus sem. Ut dapibus turpis mi, sit amet vestibulum metus rutrum sed. Pellentesque posuere sollicitudin ipsum quis euismod.")]),_c('p',[_vm._v("Nunc efficitur ut quam sit amet dictum. Curabitur vitae aliquet tellus. Nam eu tristique urna. Curabitur vel ligula pharetra, sodales ex at, eleifend nulla. Phasellus neque eros, venenatis sit amet enim sed, mollis tincidunt arcu. Praesent non arcu sodales dui malesuada tincidunt vitae sed sem. Proin sodales risus leo, nec rhoncus libero pretium et. Praesent ullamcorper elit elit, eu condimentum felis imperdiet non. Cras volutpat elit sit amet est volutpat, auctor laoreet lorem posuere. Nullam tempus viverra blandit. Mauris vitae euismod justo, et aliquam enim. Etiam finibus enim vitae metus egestas efficitur. Vivamus eu ultrices mi. Mauris tempus mauris ac diam sagittis, eget varius est imperdiet. Proin molestie congue velit, vitae malesuada eros bibendum sed. Nunc consectetur, turpis quis dictum elementum, mi erat euismod justo, sit amet posuere ante turpis nec orci.")]),_c('p',[_vm._v("Duis faucibus nunc tellus, eget lobortis erat vulputate a. Nulla tincidunt est sed nisi lacinia eleifend. Maecenas semper in sem volutpat condimentum. Integer scelerisque justo enim, at tincidunt urna feugiat vitae. Quisque consectetur ex felis, auctor mattis magna iaculis sit amet. Donec nulla sapien, hendrerit eget nulla at, elementum scelerisque tortor. Donec sodales mauris porta nisi eleifend, non hendrerit purus rhoncus. Etiam feugiat justo vel tortor congue elementum vitae vitae nunc. Praesent faucibus convallis dictum. Maecenas ac nulla nisi. In at purus hendrerit, auctor velit in, lobortis sem. Ut eu justo erat. Pellentesque sapien dui, elementum a magna nec, porta placerat felis. Nunc vel nunc nec nisl venenatis imperdiet.")]),_c('p',[_vm._v("Integer augue risus, varius et ante a, ornare cursus nulla. Nullam ultrices varius justo, sed ultricies dui pulvinar ac. Phasellus vehicula luctus sem, nec porta quam venenatis quis. Vestibulum commodo nulla eget est interdum dignissim. Nunc ultricies arcu a neque egestas, non pulvinar nunc semper. Vivamus nec ante nec est imperdiet rhoncus et vel sapien. Aenean iaculis ornare leo sit amet ornare. Nulla facilisi. Vivamus id eros tempus, auctor dolor et, sodales enim. Morbi gravida tempus est, ac rhoncus arcu placerat nec. Nunc consectetur turpis at metus placerat, quis ultricies mi tempus. Curabitur eget tortor quis erat rhoncus feugiat at at sapien.")]),_c('p',[_vm._v("Proin consectetur non ipsum quis tempus. Cras quis condimentum tellus. Curabitur quis efficitur urna, sit amet pellentesque diam. Nullam ante turpis, finibus eu quam ut, euismod dapibus justo. Fusce libero massa, fringilla quis leo at, varius imperdiet sem. Fusce facilisis commodo diam, sit amet ornare sapien commodo a. Vestibulum porttitor venenatis augue id pretium. Integer et eleifend nisl, id aliquet mi. Vestibulum luctus viverra eros. In eu nisi non magna ultrices cursus. Donec ut pellentesque risus, vel feugiat elit. Ut non dignissim elit. Sed eget lacus ullamcorper, cursus orci vel, aliquet tortor.")]),_c('p',[_vm._v("Duis dapibus gravida urna eu dapibus. Donec convallis laoreet lacus condimentum efficitur. Donec egestas pellentesque rhoncus. Quisque luctus dignissim mi in condimentum. Ut blandit placerat fringilla. Sed arcu velit, consequat et vestibulum vitae, molestie vel odio. Aliquam eu quam accumsan, vestibulum est vitae, congue eros. Cras porta nec tortor at convallis. Nam lobortis libero et elit dictum, sit amet dignissim libero aliquet. Aenean pellentesque enim sit amet diam sollicitudin vulputate. Suspendisse venenatis velit ligula, at faucibus magna sollicitudin eu. Aenean tincidunt ipsum vitae dui accumsan rutrum. Nulla ut magna nibh. Nullam posuere, purus vel tincidunt dapibus, sem magna malesuada eros, semper rhoncus urna ligula nec dui.")]),_c('p',[_vm._v("Suspendisse elit felis, vehicula a feugiat eget, auctor id urna. Aliquam erat volutpat. Donec sit amet ligula sed turpis consequat malesuada. Vestibulum quis tellus pulvinar, convallis ex a, dapibus tortor. Proin pellentesque augue ut justo porttitor malesuada. Duis ac quam tristique dui venenatis rutrum. Vivamus sit amet porta ligula, non scelerisque tortor. Sed vel libero malesuada augue aliquet molestie. Maecenas ut velit at sapien tincidunt consectetur. Vivamus condimentum pretium odio, suscipit varius tellus porttitor et. Etiam pretium condimentum congue. Duis viverra, est id laoreet vehicula, magna ipsum efficitur velit, non maximus sapien enim et tortor. Morbi iaculis odio a eros fringilla, nec iaculis nibh ullamcorper.")]),_c('p',[_vm._v("Donec lobortis, ligula eget euismod accumsan, magna ligula fermentum elit, id cursus tortor purus id sem. Praesent dignissim nulla et ligula feugiat ultricies. Nam vel dignissim massa. Fusce porttitor posuere orci. Cras laoreet diam est, sed efficitur libero fermentum ac. Phasellus cursus tincidunt arcu, faucibus iaculis velit imperdiet vel. Sed iaculis purus tellus, vel semper ipsum consectetur a. Phasellus eget nunc risus. Donec iaculis eu mi vitae viverra. Curabitur porta bibendum orci, et efficitur dolor molestie et. Nullam convallis egestas nulla in scelerisque. Cras hendrerit, nulla id lacinia molestie, elit justo vulputate eros, sed volutpat massa velit vitae felis. Cras efficitur sem vitae lorem fermentum, at rhoncus diam elementum. Mauris auctor ornare ipsum, in suscipit arcu tincidunt tincidunt.")]),_c('p',[_vm._v("Nulla hendrerit eu arcu non rhoncus. Mauris sed enim lorem. Nulla facilisi. Phasellus lacinia aliquam turpis, eu efficitur lacus ornare vel. Maecenas finibus tortor egestas, convallis augue at, blandit odio. Nunc efficitur accumsan aliquet. Sed facilisis erat sed magna rhoncus lobortis. Nunc bibendum tempor dolor, eu viverra felis sagittis vel. Fusce at ultrices ligula. Duis convallis, nulla at porta ultricies, lorem dolor consectetur massa, ac pellentesque tellus lectus quis leo. Integer id ipsum eu orci porttitor volutpat. Etiam et commodo tortor, in sagittis arcu. Vivamus tristique vestibulum leo, ut ultrices enim mollis ac.")]),_c('h2',[_vm._v("Relative")]),_c('flux-parallax',{attrs:{"src":"slides/1.jpg","height":"300px","type":"relative","offset":"80%"}},[_c('div',[_vm._v("CONTENT")])]),_c('h2',{staticClass:"mt-4"},[_vm._v("Static")]),_c('flux-parallax',{attrs:{"src":"slides/1.jpg","height":"300px","type":"static","offset":"80%"}},[_c('div',[_vm._v("CONTENT")])]),_c('h2',{staticClass:"mt-4"},[_vm._v("Fixed")]),_c('flux-parallax',{attrs:{"src":"slides/1.jpg","height":"300px","type":"fixed","offset":"80%"}},[_c('div',[_vm._v("CONTENT")])]),_c('p',[_vm._v("Aenean vestibulum egestas ipsum quis interdum. Fusce semper tincidunt sem, ut posuere nisl porta sed. Quisque pharetra imperdiet nulla sed cursus. Fusce fringilla tempor lacinia. In condimentum felis diam, quis hendrerit nisl dapibus ut. Quisque placerat ex sed accumsan volutpat. Nunc pellentesque dui eget quam tempus lacinia. Sed convallis sed neque suscipit consectetur. Etiam vehicula luctus dui ut pulvinar. Vestibulum mattis consectetur purus ut aliquet. Proin placerat consectetur blandit. Mauris sagittis ultricies felis in porttitor.")]),_c('p',[_vm._v("Vivamus ac sodales sapien. Vestibulum malesuada ultricies nisl, eget convallis quam lacinia a. Ut eget dolor nisi. Donec nec augue tincidunt, ultricies metus sed, pretium turpis. Ut maximus, dolor non imperdiet finibus, sapien est maximus urna, tristique euismod erat nisl finibus erat. Nullam facilisis, risus eget dapibus blandit, orci nunc cursus mi, at luctus urna libero nec odio. In a diam nunc.")]),_c('p',[_vm._v("Vestibulum vestibulum dictum ultricies. Nullam facilisis non massa vitae pretium. Nulla posuere ipsum at sollicitudin fringilla. Fusce ultrices molestie elit, id dignissim ipsum vestibulum nec. Pellentesque dignissim quam non dolor luctus finibus. Donec consectetur, lectus tristique hendrerit ornare, orci quam lobortis nibh, non volutpat risus neque non quam. Donec bibendum dolor sed risus convallis fermentum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu quam dapibus, blandit ex at, fermentum libero. Cras ut fermentum eros. Aenean metus elit, commodo sit amet erat non, consequat lobortis enim. Aliquam iaculis ipsum ut felis condimentum, non iaculis est sodales. Nulla rutrum, urna eu elementum egestas, nisi neque vestibulum orci, vitae gravida enim metus vitae felis. Nulla mattis purus commodo nisi luctus, ac ornare enim cursus.")]),_c('p',[_vm._v("Pellentesque eu ex sit amet felis commodo eleifend ut quis turpis. Praesent rhoncus pharetra risus, in sodales sapien dictum sit amet. Maecenas id ex auctor, ultricies diam sit amet, tempor nisi. Cras nec molestie erat. Pellentesque non mauris condimentum, placerat dui at, imperdiet dolor. Cras erat nisl, ullamcorper at odio id, pharetra lobortis lacus. Quisque turpis urna, porta vel urna at, pellentesque iaculis odio. Maecenas id rhoncus orci. Nullam elementum mi at interdum blandit. Pellentesque et tincidunt augue, a interdum dolor. Aenean quis quam mi. Nullam molestie, tellus blandit bibendum maximus, elit nisl imperdiet nunc, sit amet egestas ipsum nisl vel turpis. Nunc non eleifend augue. Fusce nec ligula felis. Sed sed luctus nunc. Etiam dapibus eros vel metus consequat condimentum.")]),_c('p',[_vm._v("Donec vel felis quam. Mauris convallis sed augue ac gravida. Duis in lorem dolor. Sed velit metus, molestie vitae lectus eu, pellentesque sollicitudin sapien. Aliquam venenatis consequat posuere. In iaculis, nibh vel finibus varius, diam sapien vehicula lectus, iaculis dictum lacus lorem quis libero. Morbi in sollicitudin diam. Praesent vitae eros sapien.")]),_c('p',[_vm._v("Praesent ut lorem eget nunc imperdiet molestie quis ac tellus. Fusce massa ex, egestas luctus aliquam id, sagittis id justo. Phasellus congue dolor dolor, id blandit diam malesuada non. Morbi sed risus vel mi dignissim varius. Nunc dignissim justo pharetra neque porta, malesuada posuere nulla rhoncus. Aliquam id orci sed orci varius accumsan. Nam eu tortor est. Vestibulum gravida, enim in hendrerit hendrerit, ante tellus malesuada libero, pulvinar rhoncus neque ex nec purus. Vivamus consequat volutpat quam, non sodales erat vestibulum quis.")]),_c('p',[_vm._v("Aliquam quis sem ut purus eleifend accumsan. Aenean consectetur lacus ac nibh condimentum, vel ultricies sapien laoreet. Pellentesque turpis arcu, convallis non tortor vitae, vulputate convallis risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla id eros id diam varius feugiat nec eget dolor. Mauris sollicitudin nibh lorem, laoreet fermentum nunc iaculis sit amet. Nullam ultricies pellentesque nisl rhoncus ultrices. Nulla facilisi. Suspendisse blandit ante dapibus, mollis neque id, finibus nulla. Donec id nibh interdum, aliquet nisl ut, faucibus enim. Cras luctus purus vel elit rhoncus, et lobortis orci hendrerit. Quisque facilisis sollicitudin sapien, at pretium massa luctus non. Integer id est dapibus, tincidunt neque id, elementum nunc. Fusce egestas lorem ac venenatis tempor.")]),_c('p',[_vm._v("Quisque leo justo, bibendum vel suscipit non, dapibus ut nisl. Etiam vehicula ultricies imperdiet. Curabitur venenatis condimentum iaculis. Aliquam lorem erat, lobortis vitae nunc tempor, rutrum tempus mi. Nunc blandit suscipit tortor, at efficitur quam vehicula id. Morbi a est ac tortor malesuada consectetur. Fusce tellus lorem, aliquet non facilisis in, fringilla ut augue. Proin eu viverra lectus. Pellentesque gravida mauris eu orci convallis porttitor. Quisque interdum eu odio et accumsan. Sed ac ex mattis, imperdiet nunc vel, tempor lorem. Pellentesque tincidunt id mauris non tincidunt. Fusce a auctor nulla. Donec eu porta sem. Sed tristique massa massa, non porttitor lorem lobortis ac. Nulla pretium posuere gravida.")]),_c('p',[_vm._v("Donec vitae malesuada risus, in varius nunc. Nulla ut nibh vitae nulla ultricies tempor. Proin mattis felis felis, ac dapibus nunc sollicitudin facilisis. Ut sit amet turpis ac metus malesuada auctor. Nunc vulputate dictum nisi, a vulputate nunc eleifend ut. Nulla viverra turpis at fermentum consectetur. Integer varius consectetur sapien non posuere. Nullam venenatis mattis orci vitae tincidunt. Donec imperdiet lacus sed risus sagittis, a interdum sapien mollis. Donec ac aliquet velit. Quisque luctus urna vel urna fringilla accumsan sit amet ut nibh. Donec scelerisque massa id ligula dictum ullamcorper.")])],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/App.vue?vue&type=template&id=3ef147ee&scoped=true&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueFlux.vue?vue&type=template&id=227147aa&
var VueFluxvue_type_template_id_227147aa_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",staticClass:"vue-flux",class:_vm.inFullscreen()? 'fullscreen' : '',on:{"mousemove":function($event){_vm.toggleMouseOver(true)},"mouseleave":function($event){_vm.toggleMouseOver(false)},"dblclick":function($event){_vm.toggleFullscreen()},"touchstart":_vm.touchStart,"touchend":_vm.touchEnd}},[_vm._l((_vm.preload),function(src,index){return _c('img',{key:index,ref:"images",refInFor:true,attrs:{"src":_vm.path + src,"alt":""},on:{"load":function($event){_vm.addImage(index)},"error":function($event){_vm.addImage(index)}}})}),_c('div',{ref:"mask",staticClass:"mask",style:(_vm.sizePx)},[(_vm.transition.current)?_c(_vm.transition.current,{ref:"transition",tag:"component",attrs:{"slider":_vm.slider}}):_vm._e(),_c('flux-image',{ref:"image1",attrs:{"slider":_vm.slider,"index":_vm.image1Index}}),_c('flux-image',{ref:"image2",attrs:{"slider":_vm.slider,"index":_vm.image2Index}})],1),_vm._t("spinner",[(!_vm.loaded)?_c('div',{staticClass:"spinner"},[_c('div',{staticClass:"pct"},[_vm._v(_vm._s(_vm.loadPct)+"%")]),_c('div',{staticClass:"border"})]):_vm._e()]),_vm._t("caption"),_vm._t("controls"),_vm._t("index"),(_vm.loaded)?_vm._t("pagination"):_vm._e()],2)}
var VueFluxvue_type_template_id_227147aa_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VueFlux.vue?vue&type=template&id=227147aa&

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxImage.vue?vue&type=template&id=04e589c1&
var FluxImagevue_type_template_id_04e589c1_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"image",style:(_vm.style)})}
var FluxImagevue_type_template_id_04e589c1_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxImage.vue?vue&type=template&id=04e589c1&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxImage.vue?vue&type=script&lang=js&

//
//
//
//
/* harmony default export */ var FluxImagevue_type_script_lang_js_ = ({
  data: () => ({
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
  }),
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
      default: () => {
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

  created() {
    this.init();
  },

  methods: {
    init() {
      this.setCss(this.css);
      if (typeof this.index === 'number') this.initImage();else if (/^#/.test(this.index)) this.initColor();
    },

    initColor() {
      this.setCss({
        backgroundColor: this.index
      });
    },

    initImage() {
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

    setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },

    transform(css) {
      this.$nextTick(() => {
        this.$refs.image.clientHeight;
        this.setCss(css);
      });
    },

    show() {
      this.setCss({
        visibility: 'visible'
      });
    },

    hide() {
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

var component = normalizeComponent(
  components_FluxImagevue_type_script_lang_js_,
  FluxImagevue_type_template_id_04e589c1_render,
  FluxImagevue_type_template_id_04e589c1_staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "FluxImage.vue"
/* harmony default export */ var FluxImage = (component.exports);
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
  data: () => ({
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
  }),
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    transitions: {
      type: Object,
      required: true
    },
    transitionOptions: {
      type: Object,
      default: () => {}
    },
    path: {
      type: String,
      default: ''
    },
    images: {
      type: Array,
      default: () => []
    },
    captions: {
      type: Array,
      default: () => []
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
      var wasPlaying = this.config.autoplay;
      this.stop();
      this.$nextTick(() => {
        this.preloadImages();
        this.config.autoplay = wasPlaying;
      });
    }
  },

  created() {
    this.updateOptions();
    this.updateTransitions();
  },

  mounted() {
    this.resize();
    this.preloadImages();
    if (this.config.autohideTime === 0) this.mouseOver = true;
    window.addEventListener('resize', this.resize);
    if (this.config.bindKeys) window.addEventListener('keydown', this.keydown);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.config.bindKeys) window.removeEventListener('keydown', this.keydown);
    if (this.timer) clearTimeout(this.timer);
  },

  methods: {
    preloadImages() {
      if (this.images.length < 2 || this.transitionNames.length === 0) return;
      this.loaded = false;
      this.image1Index = 0;
      this.image2Index = 1;
      this.imagesLoaded = 0;
      this.$nextTick(() => {
        this.$refs.image1.setCss({
          zIndex: 11
        });
        this.$refs.image2.setCss({
          zIndex: 10
        });
      });
      this.preload = this.images.slice(0);
    },

    addImage(i) {
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

    updateOptions() {
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

    updateTransitions() {
      Object.assign(this.$options.components, this.transitions);
      this.transitionNames = Object.keys(this.transitions);
      if (this.transitionNames.length > 0) this.transition.last = this.transitionNames.length - 1;
    },

    currentImage() {
      if (this.$refs.image1 === undefined) return undefined;
      return this.$refs.image2.style.zIndex === 11 ? this.$refs.image2 : this.$refs.image1;
    },

    nextImage() {
      return this.$refs.image1.style.zIndex === 10 ? this.$refs.image1 : this.$refs.image2;
    },

    setTransitionOptions(transition) {
      var defaultValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var transitionOptions = this.transitionOptions || {};
      var options = transitionOptions[this.transition.current] || {};
      var direction = 'right';
      if (this.currentImage().index > this.nextImage().index) direction = 'left';
      Object.assign(transition, {
        direction: direction
      }, defaultValues, options);
    },

    resize() {
      this.size.width = undefined;
      this.size.height = undefined;
      if (this.config.width.indexOf('px') !== -1) this.size.width = parseInt(this.config.width);
      if (this.config.height.indexOf('px') !== -1) this.size.height = parseInt(this.config.height);
      if (this.size.width && this.size.height) return;
      this.$nextTick(() => {
        // Find width
        if (!this.size.width) {
          var width = window.getComputedStyle(this.$refs.container).width;
          this.size.width = parseFloat(width);
        } // Find height


        if (this.config.height === 'auto') {
          var height = this.size.width / 16 * 9;
          if (this.$refs.container.clientHeight) height = window.getComputedStyle(this.$refs.container).height;else if (this.$refs.container.parentNode.clientHeight) height = window.getComputedStyle(this.$refs.container.parentNode).height;
          this.size.height = parseFloat(height);
        }

        this.$refs.image1.init();
        this.$refs.image2.init();
      });
    },

    init() {
      this.properties = this.properties.filter(p => p);
      this.preload = [];
      this.loaded = true;
      this.$refs.image2.init();
      this.$nextTick(() => {
        this.$refs.image1.setCss({
          zIndex: 11
        });
        this.$refs.image2.setCss({
          zIndex: 10
        });
        this.$refs.image1.reference = 'image1Index';
        this.$refs.image2.reference = 'image2Index';
        if (this.config.autoplay === true) this.play();
      });
    },

    toggleMouseOver(over) {
      if (this.config.autohideTime === 0) return;
      clearTimeout(this.mouseOverTimer);

      if (over) {
        this.mouseOverTimer = setTimeout(() => {
          this.mouseOver = false;
        }, this.config.autohideTime);
      }

      this.mouseOver = over;
    },

    inFullscreen() {
      return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) !== undefined;
    },

    requestFullscreen() {
      var container = this.$refs.container;
      if (container.requestFullscreen) container.requestFullscreen();else if (container.mozRequestFullScreen) container.mozRequestFullScreen();else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();else if (container.msRequestFullscreen) container.msRequestFullscreen();
    },

    exitFullscreen() {
      if (document.exitFullscreen) document.exitFullscreen();else if (document.mozCancelFullScreen) document.mozCancelFullScreen();else if (document.webkitExitFullscreen) document.webkitExitFullscreen();else if (document.msExitFullscreen) document.msExitFullscreen();
    },

    toggleFullscreen() {
      if (this.config.fullscreen === false) return;
      if (this.inFullscreen()) this.exitFullscreen();else this.requestFullscreen();
      this.resize();
    },

    play() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'next';
      var delay = arguments.length > 1 ? arguments[1] : undefined;
      this.config.autoplay = true;
      this.timer = setTimeout(() => {
        this.showImage(index);
      }, delay || this.config.delay);
    },

    stop() {
      this.config.autoplay = false;
      if (this.transition.current) this.transition.current = undefined;
      clearTimeout(this.timer);
    },

    toggleAutoplay() {
      if (this.config.autoplay) this.stop();else this.play(undefined, 1);
    },

    getIndex(index) {
      if (typeof index === 'number') return index;
      var currentIndex = this.currentImage().index;
      if (index === 'previous') return currentIndex > 0 ? currentIndex - 1 : this.properties.length - 1;
      return currentIndex + 1 < this.properties.length ? currentIndex + 1 : 0;
    },

    setTransition(transition) {
      if (transition === undefined) transition = this.nextTransition;

      if (transition) {
        this.transition.last = this.transitionNames.indexOf(transition);
        this.transition.current = transition;
      }

      this.$nextTick(() => {
        this.transitionStart(transition);
      });
    },

    transitionStart(transition) {
      this.$emit('vueFlux-transitionStart');
      var timeout = 0;
      if (transition !== undefined) timeout = this.$refs.transition.totalDuration;
      this.timer = setTimeout(() => {
        this.transitionEnd();
      }, timeout);
    },

    transitionEnd() {
      var currentImage = this.currentImage();
      var nextImage = this.nextImage();
      currentImage.setCss({
        zIndex: 10
      });
      nextImage.setCss({
        zIndex: 11
      });
      this.transition.current = undefined;
      this.$nextTick(() => {
        if (this.config.infinite === false && nextImage.index === this.properties.length - 1) {
          this.stop();
          return;
        }

        if (this.config.autoplay === true) {
          this.timer = setTimeout(() => {
            this.showImage('next');
          }, this.config.delay);
        }

        this.$emit('vueFlux-transitionEnd');
      });
    },

    showImage(index, transition) {
      if (!this.loaded || this.$refs.image1 === undefined) return;
      if (this.transition.current !== undefined) return;
      if (this.currentImage().index === index) return;
      clearTimeout(this.timer);
      var nextImage = this.nextImage();
      this[nextImage.reference] = this.getIndex(index);
      nextImage.show();
      this.$nextTick(() => {
        this.setTransition(transition);
      });
    },

    keydown(event) {
      if (/ArrowLeft|Left/.test(event.key)) this.showImage('previous');else if (/ArrowRight|Right/.test(event.key)) this.showImage('next');
    },

    touchStart(event) {
      if (!this.config.enableGestures) return;
      if (event.path[1].matches('.mask') || event.path[1].matches('.vue-flux')) event.preventDefault();
      this.touchStartTime = Date.now();
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },

    touchEnd(event) {
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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCaption.vue?vue&type=template&id=1659540e&
var FluxCaptionvue_type_template_id_1659540e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.caption)?_c('div',{staticClass:"flux-caption"},[_vm._v(_vm._s(_vm.caption))]):_vm._e()])}
var FluxCaptionvue_type_template_id_1659540e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxCaption.vue?vue&type=template&id=1659540e&

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

// CONCATENATED MODULE: ./src/components/FluxCaption.vue






/* normalize component */

var FluxCaption_component = normalizeComponent(
  components_FluxCaptionvue_type_script_lang_js_,
  FluxCaptionvue_type_template_id_1659540e_render,
  FluxCaptionvue_type_template_id_1659540e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

FluxCaption_component.options.__file = "FluxCaption.vue"
/* harmony default export */ var FluxCaption = (FluxCaption_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxControls.vue?vue&type=template&id=77edd03a&
var FluxControlsvue_type_template_id_77edd03a_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.display)?_c('div',{staticClass:"flux-controls"},[_c('div',{staticClass:"previous",on:{"click":function($event){_vm.vf.showImage('previous')}}}),_c('div',{class:_vm.autoplayClass,on:{"click":function($event){_vm.vf.toggleAutoplay()}}}),_c('div',{staticClass:"next",on:{"click":function($event){_vm.vf.showImage('next')}}})]):_vm._e()])}
var FluxControlsvue_type_template_id_77edd03a_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxControls.vue?vue&type=template&id=77edd03a&

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
  data: () => ({
    style: {
      overflow: 'hidden'
    }
  }),
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
      default: () => {
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

  mounted() {
    this.init();
  },

  methods: {
    init() {
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

    setCss(css) {
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
  data: () => ({
    visible: false,
    delay: 500,
    touchStartTime: 0
  }),
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
    touchStart(event) {
      if (!this.vf.config.enableGestures) return;
      event.stopPropagation();
      this.touchStartTime = Date.now();
    },

    touchEnd(event) {
      if (!this.vf.config.enableGestures) return;
      event.stopPropagation();
      var offsetTime = Date.now() - this.touchStartTime;
      if (offsetTime < 100) this.toggle();
    },

    click(event, index) {
      event.stopPropagation();
      if (index === undefined) this.toggle();else this.showImage(index);
    },

    toggle() {
      if (!this.vf.index) return;
      if (!this.visible) this.show();else this.hide();
    },

    show() {
      this.vf.stop();
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.thumbs.clientHeight;
        this.$refs.thumbs.style.marginTop = 0;
      });
    },

    showImage(index) {
      if (this.vf.index && this.visible) {
        this.hide(index);
        return;
      }

      this.vf.showImage(index);
    },

    hide(index) {
      this.$refs.thumbs.clientHeight;
      this.$refs.thumbs.style.marginTop = '100%';
      setTimeout(() => {
        this.visible = false;
        if (typeof index !== 'undefined') this.showImage(index);
      }, this.delay);
    },

    current(index) {
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
    getClass(i) {
      if (this.currentTransition !== undefined && this.nextImageIndex === i) return 'active';
      if (this.currentTransition === undefined && this.currentImageIndex === i) return 'active';
      return '';
    },

    getTitle(i) {
      return this.vf.captions[i] || '';
    },

    showImage(index, event) {
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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/fade.vue?vue&type=template&id=0412b1c1&
var fadevue_type_template_id_0412b1c1_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c("div")}
var fadevue_type_template_id_0412b1c1_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/transitions/fade.vue?vue&type=template&id=0412b1c1&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/transitions/fade.vue?vue&type=script&lang=js&
//
//
/* harmony default export */ var fadevue_type_script_lang_js_ = ({
  name: 'transitionFade',
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    totalDuration: 1200,
    easing: 'ease-in'
  }),
  props: {
    slider: Object
  },

  created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
  },

  mounted() {
    this.currentImage.setCss({
      transition: 'opacity ' + this.totalDuration + 'ms ' + this.easing,
      opacity: 0
    });
  },

  destroyed() {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    totalDuration: 6000,
    easing: 'cubic-bezier(0.600, 0.040, 0.780, 0.335)',
    index: undefined
  }),
  props: {
    slider: Object
  },

  created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
    this.index = this.currentImage.index;
    if (this.direction === 'left') this.index = this.nextImage.index;
  },

  mounted() {
    this.slider.mask.style.overflow = 'hidden';
    var transform = this.getTransform();
    if (this.direction !== 'left') this.focusIn(transform);else this.focusOut(transform);
  },

  destroyed() {
    this.slider.mask.style.overflow = 'visible';
    this.currentImage.setCss({
      transition: 'none',
      opacity: 1
    });
  },

  methods: {
    focusIn(transform) {
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

    focusOut(transform) {
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

    getTransform() {
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
  data: () => ({
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 12
    }
  }),
  methods: {
    setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },

    transform(css) {
      this.$refs.wrapper.clientHeight;
      this.$nextTick(() => {
        this.setCss(css);
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    totalDuration: 1400,
    easing: 'ease-in-out',
    wrapperCss: {
      overflow: 'hidden'
    }
  }),
  props: {
    slider: Object
  },
  computed: {
    wrapper: function wrapper() {
      return this.$refs.wrapper;
    }
  },

  created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);

    if (this.direction === 'left') {
      this.wrapperCss.left = 'auto';
      this.wrapperCss.right = 0;
    }
  },

  mounted() {
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

  destroyed() {
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
  data: () => ({
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
  }),
  props: {
    slider: Object
  },
  computed: {
    wrapper: function wrapper() {
      return this.$refs.wrapper;
    }
  },

  created() {
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

  mounted() {
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

  destroyed() {
    this.slider.mask.style.overflow = 'visible';
  },

  methods: {
    getTx() {
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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxGrid.vue?vue&type=template&id=8eb22a18&
var FluxGridvue_type_template_id_8eb22a18_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.style)},_vm._l((_vm.numTiles),function(i){return _c('flux-cube',{key:i,ref:"tiles",refInFor:true,attrs:{"slider":_vm.slider,"index":_vm.index,"css":_vm.getTileCss(i)}})}))}
var FluxGridvue_type_template_id_8eb22a18_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxGrid.vue?vue&type=template&id=8eb22a18&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCube.vue?vue&type=template&id=ea839f68&
var FluxCubevue_type_template_id_ea839f68_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"cube",style:(_vm.style)},[_c('flux-image',{ref:"front",attrs:{"slider":_vm.slider,"index":_vm.index.front,"css":_vm.getFrontSideCss()}}),(_vm.sideSet('top'))?_c('flux-image',{ref:"top",attrs:{"slider":_vm.slider,"index":_vm.index.top,"css":_vm.getTopSideCss()}}):_vm._e(),(_vm.sideSet('back'))?_c('flux-image',{ref:"back",attrs:{"slider":_vm.slider,"index":_vm.index.back,"css":_vm.getBackSideCss()}}):_vm._e(),(_vm.sideSet('bottom'))?_c('flux-image',{ref:"bottom",attrs:{"slider":_vm.slider,"index":_vm.index.bottom,"css":_vm.getBottomSideCss()}}):_vm._e(),(_vm.sideSet('left'))?_c('flux-image',{ref:"left",attrs:{"slider":_vm.slider,"index":_vm.index.left,"css":_vm.getLeftSideCss()}}):_vm._e(),(_vm.sideSet('right'))?_c('flux-image',{ref:"right",attrs:{"slider":_vm.slider,"index":_vm.index.right,"css":_vm.getRightSideCss()}}):_vm._e()],1)}
var FluxCubevue_type_template_id_ea839f68_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxCube.vue?vue&type=template&id=ea839f68&

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
  data: () => ({
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      overflow: 'visible',
      transformStyle: 'preserve-3d'
    }
  }),
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
      default: () => ({
        top: 0,
        left: 0
      })
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

  created() {
    var css = this.css;
    if (!css.width) css.width = this.slider.size.width + 'px';
    if (!css.height) css.height = this.slider.size.height + 'px';
    this.setCss(css);
  },

  methods: {
    sideSet(side) {
      return this.index[side] !== undefined;
    },

    setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },

    getBasicSideCss(side) {
      var css = {};

      if (typeof this.index[side] === 'number') {
        css.top = this.css.top;
        css.left = this.css.left;
      }

      return css;
    },

    getFrontSideCss() {
      var css = this.getBasicSideCss('front');
      return css;
    },

    getTopSideCss() {
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

    getBackSideCss() {
      var css = this.getBasicSideCss('back');
      css.transform = 'rotateY(180deg)';
      css.backfaceVisibility = 'hidden';
      return css;
    },

    getBottomSideCss() {
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

    getLeftSideCss() {
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

    getRightSideCss() {
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

    transform(css) {
      this.$refs.cube.clientHeight;
      this.$nextTick(() => {
        this.setCss(css);
      });
    },

    turn(direction, to) {
      if (direction === 'top') this.turnTop();else if (direction === 'back') this.turnBack(to);else if (direction === 'bottom') this.turnBottom();else if (direction === 'left') this.turnLeft();else if (direction === 'right') this.turnRight();
    },

    turnTop() {
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

    turnBack(to) {
      var deg = '180';
      if (to === 'left') deg = '-180';
      this.transform({
        transform: 'rotateY(' + deg + 'deg)'
      });
    },

    turnBottom() {
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

    turnLeft() {
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

    turnRight() {
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
  data: () => ({
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
  }),
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
      default: () => {}
    }
  },
  computed: {
    tiles: function tiles() {
      return this.$refs.tiles;
    }
  },

  created() {
    this.numTiles = this.numRows * this.numCols;
    this.tile.width = Math.ceil(this.slider.size.width / this.numCols);
    this.tile.height = Math.ceil(this.slider.size.height / this.numRows);
  },

  methods: {
    getRow(i) {
      var row = Math.floor(i / this.numCols);
      return row;
    },

    getCol(i) {
      var col = i % this.numCols;
      return col;
    },

    getTileCss(i) {
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

    setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },

    transform(func) {
      this.$nextTick(() => {
        this.tiles.forEach((tile, i) => func(tile, i));
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 1,
    numCols: 0,
    tileDuration: 600,
    totalDuration: 0,
    easing: 'ease-in',
    tileDelay: 80
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.grid.setCss({
      overflow: 'hidden'
    });
    this.grid.transform((tile, i) => {
      tile.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0.1',
        transform: 'translateY(' + this.slider.size.height + 'px)'
      });
    });
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 1,
    numCols: 0,
    tileDuration: 600,
    totalDuration: 0,
    easing: 'ease-in',
    tileDelay: 80
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.grid.setCss({
      overflow: 'hidden'
    });
    this.grid.transform((tile, i) => {
      tile.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0.1',
        transform: 'translateY(' + (i % 2 === 0 ? '-' : '') + this.slider.size.height + 'px)'
      });
    });
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 1,
    numCols: 0,
    tileDuration: 800,
    totalDuration: 0,
    easing: 'linear',
    tileDelay: 100
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.grid.transform((tile, i) => {
      tile.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0.1',
        transform: 'scaleX(0)'
      });
    });
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 0,
    numCols: 0,
    tileDuration: 300,
    totalDuration: 0,
    easing: 'linear',
    tileDelay: 1000
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.grid.transform((tile, i) => {
      tile.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay() + 'ms',
        opacity: '0',
        transform: 'scale(0.4, 0.4)'
      });
    });
  },

  methods: {
    getDelay() {
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
  data: () => ({
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
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
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

    this.grid.transform((tile, i) => {
      tile.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: opacity,
        transform: transform
      });
    });
  },

  destroyed() {
    this.nextImage.show();
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
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
  }),
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

  created() {
    var width = this.size.width;
    var height = this.size.height;
    this.diag = Math.ceil(Math.sqrt(width * width + height * height));
    this.radius = Math.ceil(this.diag / 2 / this.numCircles);
    this.tile.top = Math.ceil(height / 2 - this.radius * this.numCircles);
    this.tile.left = Math.ceil(width / 2 - this.radius * this.numCircles);
  },

  mounted() {
    this.tiles.forEach((tile, i) => {
      tile.setCss({
        top: this.getTileTop(i) + 'px',
        left: this.getTileLeft(i) + 'px',
        backgroundRepeat: 'repeat'
      });
    });
  },

  methods: {
    getTileTop(i) {
      return this.tile.top + this.radius * i;
    },

    getTileLeft(i) {
      return this.tile.left + this.radius * i;
    },

    getTileCss(i) {
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

    setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },

    transform(func) {
      this.$nextTick(() => {
        this.tiles.forEach((tile, i) => func(tile, i));
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: undefined,
    numCircles: undefined,
    tileDuration: 800,
    totalDuration: 0,
    easing: 'linear',
    tileDelay: 150
  }),
  props: {
    slider: Object
  },
  computed: {
    vortex: function vortex() {
      return this.$refs.vortex;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.vortex.setCss({
      overflow: 'hidden'
    });
    this.vortex.transform((circle, i) => {
      circle.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'rotateZ(' + this.getDeg() + 'deg)'
      });
    });
  },

  methods: {
    getDelay(i) {
      return i * this.tileDelay;
    },

    getDeg() {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: undefined,
    numCircles: undefined,
    tileDuration: 800,
    totalDuration: 0,
    easing: 'linear',
    tileDelay: 150
  }),
  props: {
    slider: Object
  },
  computed: {
    vortex: function vortex() {
      return this.$refs.vortex;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.vortex.setCss({
      overflow: 'hidden'
    });
    this.vortex.transform((circle, i) => {
      circle.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'rotateZ(' + this.getDeg(i) + 'deg)'
      });
    });
  },

  methods: {
    getDelay(i) {
      return i * this.tileDelay;
    },

    getDeg(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: undefined,
    numCircles: undefined,
    tileDuration: 400,
    totalDuration: 0,
    easing: 'ease',
    tileDelay: 80
  }),
  props: {
    slider: Object
  },
  computed: {
    vortex: function vortex() {
      return this.$refs.vortex;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.vortex.setCss({
      overflow: 'hidden'
    });
    this.vortex.transform((circle, i) => {
      circle.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'scale(0, 0)'
      });
    });
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    totalDuration: 1400,
    perspective: '1600px',
    easing: 'ease-out'
  }),
  props: {
    slider: Object
  },
  computed: {
    cube: function cube() {
      return this.$refs.cube;
    }
  },

  created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
    this.index = {
      front: this.currentImage.index,
      left: this.nextImage.index,
      right: this.nextImage.index
    };
  },

  mounted() {
    this.slider.mask.style.perspective = this.perspective;
    this.currentImage.hide();
    this.nextImage.hide();
    this.cube.setCss({
      transition: 'all ' + this.totalDuration + 'ms ' + this.easing
    });
    this.cube.turn(this.direction);
  },

  destroyed() {
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
  data: () => ({
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
  }),
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

  created() {
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

  mounted() {
    this.setCubeCss();
    this.setCubeBackCss();
    this.setImageCss();
    this.slider.mask.style.perspective = '1600px';
    this.$nextTick(() => {
      this.cube.transform({
        transition: 'transform ' + this.totalDuration + 'ms ' + this.easing,
        transform: 'rotateY(' + this.getDeg() + 'deg)'
      });
    });
  },

  destroyed() {
    this.slider.mask.style.perspective = 'none';
  },

  methods: {
    setCubeCss() {
      if (this.direction === 'left') {
        this.cube.setCss({
          transformOrigin: 'right center'
        });
      }
    },

    setCubeBackCss() {
      var _this$cube$back$style = this.cube.back.style.backgroundPosition.split(' '),
          _this$cube$back$style2 = _slicedToArray(_this$cube$back$style, 1),
          backgroundPositionX = _this$cube$back$style2[0];

      backgroundPositionX = parseFloat(backgroundPositionX);
      if (this.direction !== 'left') backgroundPositionX += this.pageWidth;else backgroundPositionX -= this.pageWidth;
      this.cube.back.setCss({
        backgroundPositionX: backgroundPositionX + 'px'
      });
    },

    setImageCss() {
      if (this.direction !== 'left') {
        this.image.setCss({
          left: Math.ceil(this.pageWidth) + 'px'
        });
      }
    },

    getDeg() {
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
  data: () => ({
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
  }),
  props: {
    slider: Object
  },
  computed: {
    image: function image() {
      return this.$refs.image;
    }
  },

  created() {
    this.currentImage = this.slider.currentImage();
    this.nextImage = this.slider.nextImage();
    this.slider.setTransitionOptions(this);
  },

  mounted() {
    this.currentImage.hide();
    this.slider.mask.style.perspective = '1600px';
    this.$nextTick(() => {
      this.image.transform({
        transition: 'transform ' + this.totalDuration + 'ms ' + this.easing,
        transform: 'rotateX(-90deg)'
      });
    });
  },

  destroyed() {
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
  data: () => ({
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
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.nextImage.hide();
    this.grid.setCss({
      perspective: '1200px'
    });
    this.grid.transform((tile, i) => {
      tile.setCss({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms'
      });
      tile.turn(this.direction === 'right' ? 'bottom' : 'top');
    });
  },

  destroyed() {
    this.nextImage.show();
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 1,
    numCols: 0,
    tileDuration: 800,
    totalDuration: 0,
    easing: 'ease-out',
    tileDelay: 150
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.nextImage.hide();
    this.grid.setCss({
      perspective: '800px'
    });
    var deg = this.getDeg();
    this.grid.transform((tile, i) => {
      tile.setCss({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms'
      });
      tile.turn('back', this.direction);
    });
  },

  destroyed() {
    this.nextImage.show();
  },

  methods: {
    getDelay(i) {
      var delay = i;
      if (this.direction === 'left') delay = this.numCols - i - 1;
      return delay * this.tileDelay;
    },

    getDeg() {
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
  data: () => ({
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
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.nextImage.hide();
    this.grid.setCss({
      perspective: '800px'
    });
    this.grid.transform((tile, i) => {
      tile.setCss({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms'
      });
      tile.turn('back', this.direction);
    });
  },

  destroyed() {
    this.nextImage.show();
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 0,
    numCols: 0,
    tileDuration: 800,
    totalDuration: 0,
    easing: 'linear',
    tileDelay: 100
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.grid.setCss({
      perspective: '1200px'
    });
    this.grid.transform((tile, i) => {
      tile.front.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        opacity: '0',
        transform: 'rotateX(-540deg)'
      });
    });
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
    currentImage: undefined,
    nextImage: undefined,
    index: {},
    numRows: 0,
    numCols: 0,
    tileDuration: 300,
    totalDuration: 0,
    easing: 'linear',
    tileDelay: 100
  }),
  props: {
    slider: Object
  },
  computed: {
    grid: function grid() {
      return this.$refs.grid;
    }
  },

  created() {
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

  mounted() {
    this.currentImage.hide();
    this.grid.transform((tile, i) => {
      tile.front.transform({
        transition: 'all ' + this.tileDuration + 'ms ' + this.easing + ' ' + this.getDelay(i) + 'ms',
        borderRadius: '100%',
        opacity: '0',
        transform: 'scale(1.6, 1.6)'
      });
    });
  },

  destroyed() {
    this.slider.mask.style.perspective = 'none';
  },

  methods: {
    getDelay(i) {
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
  data: () => ({
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
  }),
  props: {
    src: {
      type: String,
      required: true
    },
    holder: {
      default: () => window
    },
    type: {
      type: String,
      default: () => 'relative'
    },
    height: {
      type: String,
      default: () => 'auto'
    },
    offset: {
      type: [Number, String],
      default: () => '60%'
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

  mounted() {
    window.addEventListener('resize', this.resize);
    if (this.type !== 'fixed') this.holder.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.type !== 'fixed') this.holder.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    setProperties() {
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

    resize() {
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
      this.$nextTick(() => {
        Object.assign(this.parallax, {
          top: parallax.offsetTop,
          width: parallax.clientWidth
        });
        var css = {
          width: this.parallax.width + 'px',
          backgroundImage: 'url("' + this.properties.src + '")',
          backgroundRepeat: 'no-repeat'
        };

        if (this.type === 'fixed') {
          Object.assign(css, {
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
          });
        } else {
          var image = {
            width: this.properties.width,
            height: this.properties.height
          };
          this.background.height = this.backgroundHeight.px;
          this.background.width = Math.floor(this.background.height * image.width / image.height);
          this.background.top = 0;

          if (this.background.width < this.parallax.width) {
            this.background.width = this.parallax.width;
            this.background.height = Math.floor(this.parallax.width * image.height / image.width);
          }

          Object.assign(css, {
            backgroundSize: this.background.width + 'px ' + this.background.height + 'px',
            backgroundPosition: 'center ' + this.background.top + 'px'
          });
        }

        this.setCss(css);
        this.handleScroll();
      });
    },

    init() {
      if (!this.properties.src) return;
      this.resize();
    },

    setCss(css) {
      this.style = Object.assign({}, this.style, css);
    },

    moveBackgroundByPct(pct) {
      if (this.remainderHeight.px > 0) pct = pct * this.offsetHeight.pct / 100 + 50 - this.offsetHeight.pct / 2;
      this.setCss({
        backgroundPositionY: pct.toFixed(2) + '%'
      });
    },

    handleScroll() {
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

    handleStatic(positionY) {
      var pct = 0;
      if (positionY < this.parallax.height) pct = 0;else if (positionY > this.view.height) pct = 100;else pct = (positionY - this.parallax.height) * 100 / (this.view.height - this.parallax.height);
      this.moveBackgroundByPct(pct);
    },

    handleRelative(positionY) {
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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=js&shadow
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
//
//
//
//
//
//







/* harmony default export */ var Appvue_type_script_lang_js_shadow = ({
  name: 'app',
  components: {
    VueFlux: VueFlux,
    FluxCaption: FluxCaption,
    FluxControls: FluxControls,
    FluxIndex: FluxIndex,
    FluxPagination: FluxPagination,
    FluxParallax: FluxParallax
  },
  data: () => ({
    rendered: false,
    baseTransitionClass: 'text-center whitespace-no-wrap block border border-grey-light rounded text-white cursor-pointer py-2 px-4 shadow-md',
    activeTransitionClass: 'bg-black',
    inactiveTransitionClass: 'bg-grey-darkest hover:bg-black',
    fluxOptions: {
      autoplay: true,
      bindKeys: true,
      fullscreen: true
    },
    fluxImages: ['slides/1.jpg', 'slides/2.jpg', 'slides/3.jpg', 'slides/4.jpg', 'slides/5.jpg', 'slides/6.jpg'],
    fluxTransitions: transitions,
    fluxCaptions: ['First caption', 'Second caption', undefined, 'Fourth caption']
  }),
  computed: {
    currentTransition: function currentTransition() {
      if (!this.rendered || !this.$refs.slider || !this.$refs.slider.transition) return undefined;
      return this.$refs.slider.transition.current;
    }
  },

  mounted() {
    this.rendered = true;
  },

  methods: {
    showNext(transition) {
      this.$refs.slider.showImage('next', transition);
    },

    transitionClass(transition) {
      var tClass = this.baseTransitionClass;
      if (this.currentTransition === transition) tClass += ' ' + this.activeTransitionClass;else tClass += ' ' + this.inactiveTransitionClass;
      return tClass;
    }

  }
});
// CONCATENATED MODULE: ./src/App.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var src_Appvue_type_script_lang_js_shadow = (Appvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/App.vue?shadow



function injectStyles (context) {
  
  var style0 = __webpack_require__("ea28")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var Appshadow_component = normalizeComponent(
  src_Appvue_type_script_lang_js_shadow,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "3ef147ee",
  null
  ,true
)

Appshadow_component.options.__file = "App.vue"
/* harmony default export */ var Appshadow = (Appshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-wc.js




// runtime shared by every component chunk





window.customElements.define('vue-flux', vue_wc_wrapper(external_Vue_default.a, Appshadow))

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
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("2ff4fd11", content, shadowRoot)
};

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
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("39193587", content, shadowRoot)
};

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
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("f72cfe72", content, shadowRoot)
};

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

/***/ "8b48":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux[data-v-3ef147ee]{-webkit-box-shadow:0 0 12px 2px rgba(34,36,38,.85);box-shadow:0 0 12px 2px rgba(34,36,38,.85)\n}\n.transitions a[data-v-3ef147ee]{font-size:.975rem\n}\n.flux-parallax[data-v-3ef147ee]{display:-webkit-box;display:-ms-flexbox;display:flex;position:relative;font-size:3rem;color:#fff;font-weight:700;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;text-shadow:-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000\n}\np[data-v-3ef147ee]{margin:24px 0\n}", ""]);

// exports


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = Vue;

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
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("65693972", content, shadowRoot)
};

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

/***/ "a425":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-thumb{width:160px;height:90px\n}\n@media (max-width:386px){\n.vue-flux .flux-thumb{width:80px;height:45px\n}\n}\n@media (min-width:387px) and (max-width:576px){\n.vue-flux .flux-thumb{width:112px;height:63px\n}\n}", ""]);

// exports


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
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("0817594f", content, shadowRoot)
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
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("5e9c3a97", content, shadowRoot)
};

/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "ea28":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_3ef147ee_lang_scss_scoped_true_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("37c8");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_3ef147ee_lang_scss_scoped_true_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_3ef147ee_lang_scss_scoped_true_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_3ef147ee_lang_scss_scoped_true_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_3ef147ee_lang_scss_scoped_true_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_id_3ef147ee_lang_scss_scoped_true_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

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


/***/ })

/******/ });
//# sourceMappingURL=vue-flux.js.map