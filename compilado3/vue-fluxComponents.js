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

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1059":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4d1d");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxCaption_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

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

/***/ "1f5d":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.flux-parallax img{position:absolute;visibility:hidden\n}", ""]);

// exports


/***/ }),

/***/ "22b4":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("caad");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("cfe76d22", content, shadowRoot)
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

/***/ "37c1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("645a");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxThumb_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

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

/***/ "3b1d":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-thumb{width:160px;height:90px\n}\n@media (max-width:386px){\n.vue-flux .flux-thumb{width:80px;height:45px\n}\n}\n@media (min-width:387px) and (max-width:576px){\n.vue-flux .flux-thumb{width:112px;height:63px\n}\n}", ""]);

// exports


/***/ }),

/***/ "3daa":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("f21a");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("590d17b7", content, shadowRoot)
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

/***/ "4d1d":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("6dbe");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("8d0c5fb2", content, shadowRoot)
};

/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5439":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux{position:relative\n}\n.vue-flux.fullscreen{width:100%;height:100%\n}\n.vue-flux img{position:absolute;visibility:hidden\n}\n.spinner{top:50%;left:50%;margin-top:-40px;margin-left:-40px;width:80px;z-index:12\n}\n.spinner,.spinner .pct{position:absolute;height:80px\n}\n.spinner .pct{right:0;left:0;line-height:80px;text-align:center;font-weight:700;z-index:1\n}\n.spinner .border{width:100%;height:100%;border:14px solid #f3f3f3;border-top-color:#3498db;border-bottom-color:#3498db;border-radius:50%;background-color:#f3f3f3;-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite\n}\n@-webkit-keyframes spin{\n0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)\n}\nto{-webkit-transform:rotate(1turn);transform:rotate(1turn)\n}\n}\n@keyframes spin{\n0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)\n}\nto{-webkit-transform:rotate(1turn);transform:rotate(1turn)\n}\n}\n.mask{position:relative;overflow:visible\n}", ""]);

// exports


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

/***/ "577d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("57e0");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxIndex_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "57e0":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("c19c");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("1122be27", content, shadowRoot)
};

/***/ }),

/***/ "5a74":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
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

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCaption.vue?vue&type=template&id=6a14ae14&shadow
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.caption)?_c('div',{staticClass:"flux-caption"},[_vm._v(_vm._s(_vm.caption))]):_vm._e()])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxCaption.vue?vue&type=template&id=6a14ae14&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCaption.vue?vue&type=script&lang=js&shadow
//
//
//
//
//
//
/* harmony default export */ var FluxCaptionvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxCaption.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxCaptionvue_type_script_lang_js_shadow = (FluxCaptionvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxCaption.vue?shadow



function injectStyles (context) {
  
  var style0 = __webpack_require__("1059")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = normalizeComponent(
  components_FluxCaptionvue_type_script_lang_js_shadow,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  null
  ,true
)

component.options.__file = "FluxCaption.vue"
/* harmony default export */ var FluxCaptionshadow = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxControls.vue?vue&type=template&id=ebbcb93c&shadow
var FluxControlsvue_type_template_id_ebbcb93c_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.display)?_c('div',{staticClass:"flux-controls"},[_c('div',{staticClass:"previous",on:{"click":function($event){_vm.vf.showImage('previous')}}}),_c('div',{class:_vm.autoplayClass,on:{"click":function($event){_vm.vf.toggleAutoplay()}}}),_c('div',{staticClass:"next",on:{"click":function($event){_vm.vf.showImage('next')}}})]):_vm._e()])}
var FluxControlsvue_type_template_id_ebbcb93c_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxControls.vue?vue&type=template&id=ebbcb93c&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxControls.vue?vue&type=script&lang=js&shadow
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FluxControlsvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxControls.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxControlsvue_type_script_lang_js_shadow = (FluxControlsvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxControls.vue?shadow



function FluxControlsshadow_injectStyles (context) {
  
  var style0 = __webpack_require__("d077")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var FluxControlsshadow_component = normalizeComponent(
  components_FluxControlsvue_type_script_lang_js_shadow,
  FluxControlsvue_type_template_id_ebbcb93c_shadow_render,
  FluxControlsvue_type_template_id_ebbcb93c_shadow_staticRenderFns,
  false,
  FluxControlsshadow_injectStyles,
  null,
  null
  ,true
)

FluxControlsshadow_component.options.__file = "FluxControls.vue"
/* harmony default export */ var FluxControlsshadow = (FluxControlsshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCube.vue?vue&type=template&id=45230b4f&shadow
var FluxCubevue_type_template_id_45230b4f_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"cube",style:(_vm.style)},[_c('flux-image',{ref:"front",attrs:{"slider":_vm.slider,"index":_vm.index.front,"css":_vm.getFrontSideCss()}}),(_vm.sideSet('top'))?_c('flux-image',{ref:"top",attrs:{"slider":_vm.slider,"index":_vm.index.top,"css":_vm.getTopSideCss()}}):_vm._e(),(_vm.sideSet('back'))?_c('flux-image',{ref:"back",attrs:{"slider":_vm.slider,"index":_vm.index.back,"css":_vm.getBackSideCss()}}):_vm._e(),(_vm.sideSet('bottom'))?_c('flux-image',{ref:"bottom",attrs:{"slider":_vm.slider,"index":_vm.index.bottom,"css":_vm.getBottomSideCss()}}):_vm._e(),(_vm.sideSet('left'))?_c('flux-image',{ref:"left",attrs:{"slider":_vm.slider,"index":_vm.index.left,"css":_vm.getLeftSideCss()}}):_vm._e(),(_vm.sideSet('right'))?_c('flux-image',{ref:"right",attrs:{"slider":_vm.slider,"index":_vm.index.right,"css":_vm.getRightSideCss()}}):_vm._e()],1)}
var FluxCubevue_type_template_id_45230b4f_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxCube.vue?vue&type=template&id=45230b4f&shadow

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxCube.vue?vue&type=script&lang=js&shadow

//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxCubevue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxCube.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxCubevue_type_script_lang_js_shadow = (FluxCubevue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxCube.vue?shadow





/* normalize component */

var FluxCubeshadow_component = normalizeComponent(
  components_FluxCubevue_type_script_lang_js_shadow,
  FluxCubevue_type_template_id_45230b4f_shadow_render,
  FluxCubevue_type_template_id_45230b4f_shadow_staticRenderFns,
  false,
  null,
  null,
  null
  ,true
)

FluxCubeshadow_component.options.__file = "FluxCube.vue"
/* harmony default export */ var FluxCubeshadow = (FluxCubeshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxGrid.vue?vue&type=template&id=f5f4c216&shadow
var FluxGridvue_type_template_id_f5f4c216_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.style)},_vm._l((_vm.numTiles),function(i){return _c('flux-cube',{key:i,ref:"tiles",refInFor:true,attrs:{"slider":_vm.slider,"index":_vm.index,"css":_vm.getTileCss(i)}})}))}
var FluxGridvue_type_template_id_f5f4c216_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxGrid.vue?vue&type=template&id=f5f4c216&shadow

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxGrid.vue?vue&type=script&lang=js&shadow


//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxGridvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxGrid.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxGridvue_type_script_lang_js_shadow = (FluxGridvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxGrid.vue?shadow





/* normalize component */

var FluxGridshadow_component = normalizeComponent(
  components_FluxGridvue_type_script_lang_js_shadow,
  FluxGridvue_type_template_id_f5f4c216_shadow_render,
  FluxGridvue_type_template_id_f5f4c216_shadow_staticRenderFns,
  false,
  null,
  null,
  null
  ,true
)

FluxGridshadow_component.options.__file = "FluxGrid.vue"
/* harmony default export */ var FluxGridshadow = (FluxGridshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxImage.vue?vue&type=template&id=469c1a08&shadow
var FluxImagevue_type_template_id_469c1a08_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"image",style:(_vm.style)})}
var FluxImagevue_type_template_id_469c1a08_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxImage.vue?vue&type=template&id=469c1a08&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxImage.vue?vue&type=script&lang=js&shadow

//
//
//
//
/* harmony default export */ var FluxImagevue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxImage.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxImagevue_type_script_lang_js_shadow = (FluxImagevue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxImage.vue?shadow





/* normalize component */

var FluxImageshadow_component = normalizeComponent(
  components_FluxImagevue_type_script_lang_js_shadow,
  FluxImagevue_type_template_id_469c1a08_shadow_render,
  FluxImagevue_type_template_id_469c1a08_shadow_staticRenderFns,
  false,
  null,
  null,
  null
  ,true
)

FluxImageshadow_component.options.__file = "FluxImage.vue"
/* harmony default export */ var FluxImageshadow = (FluxImageshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxIndex.vue?vue&type=template&id=9aaef978&shadow
var FluxIndexvue_type_template_id_9aaef978_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"flux-index"},[_c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.displayButton),expression:"displayButton"}],staticClass:"toggle",on:{"click":_vm.toggle}})]),_c('nav',{class:_vm.indexClass,on:{"click":_vm.click,"&touchstart":function($event){return _vm.touchStart($event)},"&touchend":function($event){return _vm.touchEnd($event)}}},[_c('ul',{ref:"thumbs"},_vm._l((_vm.images),function(image,index){return _c('li',{key:index,class:_vm.current(index),on:{"click":function($event){_vm.click($event, index)}}},[_c('flux-thumb',{attrs:{"slider":_vm.vf,"index":index}})],1)}))])],1)}
var FluxIndexvue_type_template_id_9aaef978_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxIndex.vue?vue&type=template&id=9aaef978&shadow

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
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxIndex.vue?vue&type=script&lang=js&shadow
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxIndexvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxIndex.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxIndexvue_type_script_lang_js_shadow = (FluxIndexvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxIndex.vue?shadow



function FluxIndexshadow_injectStyles (context) {
  
  var style0 = __webpack_require__("577d")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var FluxIndexshadow_component = normalizeComponent(
  components_FluxIndexvue_type_script_lang_js_shadow,
  FluxIndexvue_type_template_id_9aaef978_shadow_render,
  FluxIndexvue_type_template_id_9aaef978_shadow_staticRenderFns,
  false,
  FluxIndexshadow_injectStyles,
  null,
  null
  ,true
)

FluxIndexshadow_component.options.__file = "FluxIndex.vue"
/* harmony default export */ var FluxIndexshadow = (FluxIndexshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxPagination.vue?vue&type=template&id=83f177c2&shadow
var FluxPaginationvue_type_template_id_83f177c2_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.vf !== undefined)?_c('nav',{staticClass:"flux-pagination"},[_c('ul',_vm._l((_vm.vf.properties.length),function(i){return _c('li',{key:i,class:_vm.getClass(i - 1),attrs:{"title":_vm.getTitle(i - 1)},on:{"click":function($event){_vm.showImage(i - 1)},"touchend":function($event){_vm.showImage(i - 1, $event)}}},[_c('span',{staticClass:"pagination-item"})])}))]):_vm._e()}
var FluxPaginationvue_type_template_id_83f177c2_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxPagination.vue?vue&type=template&id=83f177c2&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxPagination.vue?vue&type=script&lang=js&shadow
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FluxPaginationvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxPagination.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxPaginationvue_type_script_lang_js_shadow = (FluxPaginationvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxPagination.vue?shadow



function FluxPaginationshadow_injectStyles (context) {
  
  var style0 = __webpack_require__("d4c3")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var FluxPaginationshadow_component = normalizeComponent(
  components_FluxPaginationvue_type_script_lang_js_shadow,
  FluxPaginationvue_type_template_id_83f177c2_shadow_render,
  FluxPaginationvue_type_template_id_83f177c2_shadow_staticRenderFns,
  false,
  FluxPaginationshadow_injectStyles,
  null,
  null
  ,true
)

FluxPaginationshadow_component.options.__file = "FluxPagination.vue"
/* harmony default export */ var FluxPaginationshadow = (FluxPaginationshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxParallax.vue?vue&type=template&id=76587472&shadow
var FluxParallaxvue_type_template_id_76587472_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"parallax",staticClass:"flux-parallax",style:(_vm.style)},[(_vm.loaded === false)?_c('img',{ref:"image",attrs:{"src":_vm.src,"alt":""},on:{"load":_vm.setProperties,"error":_vm.setProperties}}):_vm._e(),_vm._t("default")],2)}
var FluxParallaxvue_type_template_id_76587472_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxParallax.vue?vue&type=template&id=76587472&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxParallax.vue?vue&type=script&lang=js&shadow

//
//
//
//
//
//
//
/* harmony default export */ var FluxParallaxvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxParallax.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxParallaxvue_type_script_lang_js_shadow = (FluxParallaxvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxParallax.vue?shadow



function FluxParallaxshadow_injectStyles (context) {
  
  var style0 = __webpack_require__("d176")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var FluxParallaxshadow_component = normalizeComponent(
  components_FluxParallaxvue_type_script_lang_js_shadow,
  FluxParallaxvue_type_template_id_76587472_shadow_render,
  FluxParallaxvue_type_template_id_76587472_shadow_staticRenderFns,
  false,
  FluxParallaxshadow_injectStyles,
  null,
  null
  ,true
)

FluxParallaxshadow_component.options.__file = "FluxParallax.vue"
/* harmony default export */ var FluxParallaxshadow = (FluxParallaxshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxThumb.vue?vue&type=template&id=0a4343d0&shadow
var FluxThumbvue_type_template_id_0a4343d0_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"thumb",staticClass:"flux-thumb",style:(_vm.style),attrs:{"title":_vm.caption}})}
var FluxThumbvue_type_template_id_0a4343d0_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxThumb.vue?vue&type=template&id=0a4343d0&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxThumb.vue?vue&type=script&lang=js&shadow

//
//
//
//
/* harmony default export */ var FluxThumbvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxThumb.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxThumbvue_type_script_lang_js_shadow = (FluxThumbvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxThumb.vue?shadow



function FluxThumbshadow_injectStyles (context) {
  
  var style0 = __webpack_require__("37c1")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var FluxThumbshadow_component = normalizeComponent(
  components_FluxThumbvue_type_script_lang_js_shadow,
  FluxThumbvue_type_template_id_0a4343d0_shadow_render,
  FluxThumbvue_type_template_id_0a4343d0_shadow_staticRenderFns,
  false,
  FluxThumbshadow_injectStyles,
  null,
  null
  ,true
)

FluxThumbshadow_component.options.__file = "FluxThumb.vue"
/* harmony default export */ var FluxThumbshadow = (FluxThumbshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxVortex.vue?vue&type=template&id=5195486e&shadow
var FluxVortexvue_type_template_id_5195486e_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{style:(_vm.style)},_vm._l((_vm.numCircles),function(i){return _c('flux-image',{key:i,ref:"tiles",refInFor:true,attrs:{"slider":_vm.slider,"index":_vm.index,"css":_vm.getTileCss(i)}})}))}
var FluxVortexvue_type_template_id_5195486e_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxVortex.vue?vue&type=template&id=5195486e&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxVortex.vue?vue&type=script&lang=js&shadow


//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var FluxVortexvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxVortex.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxVortexvue_type_script_lang_js_shadow = (FluxVortexvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxVortex.vue?shadow





/* normalize component */

var FluxVortexshadow_component = normalizeComponent(
  components_FluxVortexvue_type_script_lang_js_shadow,
  FluxVortexvue_type_template_id_5195486e_shadow_render,
  FluxVortexvue_type_template_id_5195486e_shadow_staticRenderFns,
  false,
  null,
  null,
  null
  ,true
)

FluxVortexshadow_component.options.__file = "FluxVortex.vue"
/* harmony default export */ var FluxVortexshadow = (FluxVortexshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxWrapper.vue?vue&type=template&id=67811e6a&shadow
var FluxWrappervue_type_template_id_67811e6a_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"wrapper",style:(_vm.style)},[_vm._t("default")],2)}
var FluxWrappervue_type_template_id_67811e6a_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FluxWrapper.vue?vue&type=template&id=67811e6a&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FluxWrapper.vue?vue&type=script&lang=js&shadow

//
//
//
//
//
//
/* harmony default export */ var FluxWrappervue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/FluxWrapper.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_FluxWrappervue_type_script_lang_js_shadow = (FluxWrappervue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/FluxWrapper.vue?shadow





/* normalize component */

var FluxWrappershadow_component = normalizeComponent(
  components_FluxWrappervue_type_script_lang_js_shadow,
  FluxWrappervue_type_template_id_67811e6a_shadow_render,
  FluxWrappervue_type_template_id_67811e6a_shadow_staticRenderFns,
  false,
  null,
  null,
  null
  ,true
)

FluxWrappershadow_component.options.__file = "FluxWrapper.vue"
/* harmony default export */ var FluxWrappershadow = (FluxWrappershadow_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"2867f158-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueFlux.vue?vue&type=template&id=4fbf64ac&shadow
var VueFluxvue_type_template_id_4fbf64ac_shadow_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",staticClass:"vue-flux",class:_vm.inFullscreen()? 'fullscreen' : '',on:{"mousemove":function($event){_vm.toggleMouseOver(true)},"mouseleave":function($event){_vm.toggleMouseOver(false)},"dblclick":function($event){_vm.toggleFullscreen()},"touchstart":_vm.touchStart,"touchend":_vm.touchEnd}},[_vm._l((_vm.preload),function(src,index){return _c('img',{key:index,ref:"images",refInFor:true,attrs:{"src":_vm.path + src,"alt":""},on:{"load":function($event){_vm.addImage(index)},"error":function($event){_vm.addImage(index)}}})}),_c('div',{ref:"mask",staticClass:"mask",style:(_vm.sizePx)},[(_vm.transition.current)?_c(_vm.transition.current,{ref:"transition",tag:"component",attrs:{"slider":_vm.slider}}):_vm._e(),_c('flux-image',{ref:"image1",attrs:{"slider":_vm.slider,"index":_vm.image1Index}}),_c('flux-image',{ref:"image2",attrs:{"slider":_vm.slider,"index":_vm.image2Index}})],1),_vm._t("spinner",[(!_vm.loaded)?_c('div',{staticClass:"spinner"},[_c('div',{staticClass:"pct"},[_vm._v(_vm._s(_vm.loadPct)+"%")]),_c('div',{staticClass:"border"})]):_vm._e()]),_vm._t("caption"),_vm._t("controls"),_vm._t("index"),(_vm.loaded)?_vm._t("pagination"):_vm._e()],2)}
var VueFluxvue_type_template_id_4fbf64ac_shadow_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/VueFlux.vue?vue&type=template&id=4fbf64ac&shadow

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/VueFlux.vue?vue&type=script&lang=js&shadow


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VueFluxvue_type_script_lang_js_shadow = ({
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
// CONCATENATED MODULE: ./src/components/VueFlux.vue?vue&type=script&lang=js&shadow
 /* harmony default export */ var components_VueFluxvue_type_script_lang_js_shadow = (VueFluxvue_type_script_lang_js_shadow); 
// CONCATENATED MODULE: ./src/components/VueFlux.vue?shadow



function VueFluxshadow_injectStyles (context) {
  
  var style0 = __webpack_require__("5e26")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var VueFluxshadow_component = normalizeComponent(
  components_VueFluxvue_type_script_lang_js_shadow,
  VueFluxvue_type_template_id_4fbf64ac_shadow_render,
  VueFluxvue_type_template_id_4fbf64ac_shadow_staticRenderFns,
  false,
  VueFluxshadow_injectStyles,
  null,
  null
  ,true
)

VueFluxshadow_component.options.__file = "VueFlux.vue"
/* harmony default export */ var VueFluxshadow = (VueFluxshadow_component.exports);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-wc.js




// runtime shared by every component chunk





window.customElements.define('vue-fluxComponents-flux-caption', vue_wc_wrapper(external_Vue_default.a, FluxCaptionshadow))


window.customElements.define('vue-fluxComponents-flux-controls', vue_wc_wrapper(external_Vue_default.a, FluxControlsshadow))


window.customElements.define('vue-fluxComponents-flux-cube', vue_wc_wrapper(external_Vue_default.a, FluxCubeshadow))


window.customElements.define('vue-fluxComponents-flux-grid', vue_wc_wrapper(external_Vue_default.a, FluxGridshadow))


window.customElements.define('vue-fluxComponents-flux-image', vue_wc_wrapper(external_Vue_default.a, FluxImageshadow))


window.customElements.define('vue-fluxComponents-flux-index', vue_wc_wrapper(external_Vue_default.a, FluxIndexshadow))


window.customElements.define('vue-fluxComponents-flux-pagination', vue_wc_wrapper(external_Vue_default.a, FluxPaginationshadow))


window.customElements.define('vue-fluxComponents-flux-parallax', vue_wc_wrapper(external_Vue_default.a, FluxParallaxshadow))


window.customElements.define('vue-fluxComponents-flux-thumb', vue_wc_wrapper(external_Vue_default.a, FluxThumbshadow))


window.customElements.define('vue-fluxComponents-flux-vortex', vue_wc_wrapper(external_Vue_default.a, FluxVortexshadow))


window.customElements.define('vue-fluxComponents-flux-wrapper', vue_wc_wrapper(external_Vue_default.a, FluxWrappershadow))


window.customElements.define('vue-fluxComponents-vue-flux', vue_wc_wrapper(external_Vue_default.a, VueFluxshadow))

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

/***/ "5e26":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e8af");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueFlux_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

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

/***/ "645a":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("3b1d");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("737dd8b2", content, shadowRoot)
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

/***/ "6dbe":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-caption{position:absolute;top:0;left:0;right:0;padding:8px;color:#fff;text-align:center;background-color:rgba(0,0,0,.65);z-index:100\n}\n.vue-flux .flux-caption.fade-enter,.vue-flux .flux-caption.fade-leave-to{opacity:0\n}\n.vue-flux .flux-caption.fade-enter-active,.vue-flux .flux-caption.fade-leave-active{-webkit-transition:opacity .3s ease-in;transition:opacity .3s ease-in\n}", ""]);

// exports


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

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


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

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = Vue;

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

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c19c":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-index .fade-enter,.vue-flux .flux-index .fade-leave-to{opacity:0\n}\n.vue-flux .flux-index .fade-enter-active,.vue-flux .flux-index .fade-leave-active{-webkit-transition:opacity .3s ease-in;transition:opacity .3s ease-in\n}\n.vue-flux .flux-index .toggle{position:absolute;left:50%;bottom:55px;margin-left:-25px;width:50px;height:50px;cursor:pointer;border-radius:50%;background-color:rgba(0,0,0,.6);background-repeat:no-repeat;background-position:50%;background-size:40%;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAA6ElEQVRYhe2ZUQ2DMBRFK6ESkFAJSEBCJSABB0iYBCRUAlKQcPexLtlHW+4Ly7Ju9yTvj3ffCQktUAdgBZCIurkCADyAjcyIlYxI9icAwcHGWBi4GPqPinQyZCyfloakSSQt6QaSlnSDUBgYDf17RXozZMwOwIjH3TqrqTQwD53JjKHS78n+ueYgRPfkh/GsfKN/YDJOHAKRMTwv3sml5iiJ5zCWtSK8GjKmv9hcJC3pBpKWdANJX5Hub0d8GdzPu4cQvwZ6/Bo3LDXAF/33sDAWBmpHJJA0haRJJC3pBlel33Zi293Z+B2f9cNhdwgb0QAAAABJRU5ErkJggg==\");z-index:101\n}\n.vue-flux .flux-index .toggle:hover{-webkit-transition:background-color .2s ease-in;transition:background-color .2s ease-in;background-color:rgba(0,0,0,.9)\n}\n@media (max-width:576px){\n.vue-flux .flux-index .toggle{width:27.5px;height:27.5px;margin-left:-13.75px;background-size:31%\n}\n}\n@media (min-width:577px) and (max-width:768px){\n.vue-flux .flux-index .toggle{width:35px;height:35px;margin-left:-17.5px;background-size:34%\n}\n}\n@media (min-width:769px) and (max-width:992px){\n.vue-flux .flux-index .toggle{width:42.5px;height:42.5px;margin-left:-21.25px;background-size:37%\n}\n}\n.vue-flux .flux-index nav{position:absolute;top:0;left:0;right:0;bottom:0;display:block;margin:0;overflow:hidden;visibility:hidden\n}\n.vue-flux .flux-index nav.visible{z-index:101;visibility:visible\n}\n.vue-flux .flux-index ul{display:block;height:100%;margin:0;margin-top:100%;padding:18px 10px;list-style-type:none;text-align:center;overflow-y:auto;background-color:rgba(0,0,0,.8);-webkit-transition:all .5s linear;transition:all .5s linear\n}\n.vue-flux .flux-index li{position:relative;display:inline-block;margin:8px 8px;cursor:pointer;-webkit-transition:all .3s ease;transition:all .3s ease\n}\n.vue-flux .flux-index .mouse-over li:hover{-webkit-box-shadow:0 0 3px 2px hsla(0,0%,100%,.6);box-shadow:0 0 3px 2px hsla(0,0%,100%,.6)\n}\n.vue-flux .flux-index li.current{cursor:auto;border:1px solid #fff;-webkit-box-shadow:none;box-shadow:none\n}\n.vue-flux .flux-index ul>li:last-child{margin-bottom:26px\n}", ""]);

// exports


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

/***/ "c68f":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("1f5d");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("5942a071", content, shadowRoot)
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

/***/ "caad":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-controls{position:absolute;top:50%;left:0;right:0;margin-top:-25px;text-align:center;z-index:100\n}\n.vue-flux .flux-controls.fade-enter,.vue-flux .flux-controls.fade-leave-to{opacity:0\n}\n.vue-flux .flux-controls.fade-enter-active,.vue-flux .flux-controls.fade-leave-active{-webkit-transition:opacity .3s ease-in;transition:opacity .3s ease-in\n}\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{position:absolute;top:0;width:50px;height:50px;cursor:pointer;border-radius:50%;background-color:rgba(0,0,0,.6);background-repeat:no-repeat;background-position:50%;background-size:40%;-webkit-transition:background-color .2s ease-in;transition:background-color .2s ease-in\n}\n.vue-flux .flux-controls .previous{left:25px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEX///////////////////////////////////////////9/gMdvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAuUAAALlARv+XnsAAABUSURBVEjH7dYxCgAgEAPB8weX/39WFBtBbsFSY2sYyzXicDLq0wQDKQGQAKiJAZTEvC+IRgPBYAEyYOB1AAf4hAkTXxB5nySOGmaRw4pp5rhv34MOQwscJ7/MrxQAAAAASUVORK5CYII=)\n}\n.vue-flux .flux-controls .play{position:relative;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAs6AAALOgFkf1cNAAACy0lEQVR42uWbS2hUVxyHv78PLKKiFgXBiIgvBEVKwZWL4kJrF7oQCSpoAlYkuhCyq4hQ2goqSBFBsNBCoXShbgp15XsTQSGKqKj1QdTYFCVQiuDic5FcGkQhj0nm3vl/6+Ge+X3zO2fumTkXhoi6S51NVtQbapfallVAh//Toc7KLED1jbpPnZJVQMF99fPMAgqOqZ9mFqD6UP06s4CC8+r0MucZN8rX/wJ4pu5VP8nYgIHcU5dna8BAFgM31e8rvUiOoAHvt2FHZgEFf6iTs0yBD/EV0K3uVidkFAAwFTgB3FKXZBRQsBS4q+5XZ2YUUPAtcEVtzioAYBnwm/q7OimjgILNwAt1Z1YBADOAk+ptdUFGAQDRPy0equ213GBVRcBADgOX1Y1ZBQAsB86qP4/0BqqqAgq292+3W7IKAJgNnFI71XkZBRQ5VgBP1DZ1WjYBAzkOXFLXZhUAsBI4p55Qx2cUULAbeKxuyyoAYC7wi3pdnZNRQJHzs/5FslWdmk1AwUTgJ+Ciui6jAACBWcDfGQX0At8A8yPiBsCEROHPA80R0ZNtEXwKtETEmvfDZ2jAIeDHiHjxsRc0ogCBl8DGiOjIdiv8H3AQaBpM+EZrwFVgU0S8zLYd7gLaImL1UMM3QgOOAUcjomu4F6iqgH+AzRFxoRabhCrxlr6/zppqEb5qDbgGbIiI7lpvE8vOc6A9IlbVOnwVGnAS+CEinozWAGUV8BrYGhF/jvZAZZwCh4B5YxG+bA3oBNZHxPOxHLQMDegG9kfEyrEOX4YG/AociIhH9XoD9RLQC7RGxJl6168eU+Aofb/JnSnB9BvTBtwBvhzN7/SyNqAH+C4ilpUt/LAY4lnh0+pCGolBCuhVt9CIDPKhqco8WVrLRfAvYG1EPKjSB1qLRfAVcARYVLXwtZgC5+pxxL3eAq6p/47kaFrVBexRmxolzzsZ+iOF4pXTWQAAAABJRU5ErkJggg==)\n}\n.vue-flux .flux-controls .pause{position:relative;display:inline-block;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI0OTk3MkUwNjY1NzExRThBMjA5QkQ5QTNFMUM4NDcxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI0OTk3MkUxNjY1NzExRThBMjA5QkQ5QTNFMUM4NDcxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjQ5OTcyREU2NjU3MTFFOEEyMDlCRDlBM0UxQzg0NzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjQ5OTcyREY2NjU3MTFFOEEyMDlCRDlBM0UxQzg0NzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz77QUaQAAAACVBMVEUAAAD///////9zeKVjAAAAA3RSTlP//wDXyg1BAAAANElEQVR42uzMsQkAMAwEsY/3H9qViwS8QNC1B0pN56mu1hsAAAAAAAAAAAAAAAAAvwMtwAAbrRgBOJHO/gAAAABJRU5ErkJggg==)\n}\n.vue-flux .flux-controls .next{right:25px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEX///////////////////////////////////////////9/gMdvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAuUAAALlARv+XnsAAABYSURBVEjH7dYxDoAwDEPR5Ab1/S8LVEgsyL8SG3XWWK/dnKpnumA0/L4lAOSJE/DEtXfEBBxxBwYFBH8IEWJbggL4RIAAPwFWC+VDqXEtYrFyNWO5v58HB4q9HAkl7KTYAAAAAElFTkSuQmCC)\n}\n.vue-flux .flux-controls .next:hover,.vue-flux .flux-controls .pause:hover,.vue-flux .flux-controls .play:hover,.vue-flux .flux-controls .previous:hover{background-color:rgba(0,0,0,.9)\n}\n@media (max-width:576px){\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{width:27.5px;height:27.5px;background-size:31%\n}\n}\n@media (min-width:577px) and (max-width:768px){\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{width:35px;height:35px;background-size:34%\n}\n}\n@media (min-width:769px) and (max-width:992px){\n.vue-flux .flux-controls .next,.vue-flux .flux-controls .pause,.vue-flux .flux-controls .play,.vue-flux .flux-controls .previous{width:42.5px;height:42.5px;background-size:37%\n}\n}", ""]);

// exports


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

/***/ "d077":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("22b4");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxControls_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "d176":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c68f");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxParallax_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d4c3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3daa");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_vue_style_loader_index_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_3_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FluxPagination_vue_vue_type_style_index_0_lang_scss_shadow__WEBPACK_IMPORTED_MODULE_0___default.a); 

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

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e8af":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("5439");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to Shadow Root
var add = __webpack_require__("35d6").default
module.exports.__inject__ = function (shadowRoot) {
  add("32decf67", content, shadowRoot)
};

/***/ }),

/***/ "f21a":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("2350")(false);
// imports


// module
exports.push([module.i, "\n.vue-flux .flux-pagination{position:absolute;left:50px;right:50px;bottom:20px;z-index:100\n}\n.vue-flux .flux-pagination ul{display:block;margin:0;padding:0;list-style-type:none;text-align:center\n}\n.vue-flux .flux-pagination li{display:inline-block;margin:0 8px;cursor:pointer\n}\n.vue-flux .flux-pagination li span.pagination-item{display:inline-block;width:16px;height:16px;border:2px solid #fff;border-radius:50%;background-color:rgba(0,0,0,.7);-webkit-transition:background-color .2s ease-in,border .2s ease-in;transition:background-color .2s ease-in,border .2s ease-in\n}\n.vue-flux .flux-pagination li span.pagination-item:hover{border:2px solid #000;background-color:#fff\n}\n.vue-flux .flux-pagination li.active span.pagination-item{background-color:#fff\n}", ""]);

// exports


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
//# sourceMappingURL=vue-fluxComponents.js.map