!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.SimpleVueValidator=e():t.SimpleVueValidator=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=4)}([function(t,e,r){"use strict";var n=r(8);t.exports.debounce=function(t,e,r){var n;return function(){var i=this,s=arguments,o=function(){n=null,r||t.apply(i,s)},a=r&&!n;clearTimeout(n),n=setTimeout(o,e),a&&t.apply(i,s)}},t.exports.format=function(t){var e=Array.prototype.slice.call(arguments,1);return t.replace(/{(\d+)}/g,function(t,r){return void 0!==e[r]?e[r]:t})},t.exports.isArray=function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===Object.prototype.toString.call(t)},t.exports.isEmpty=function(e){return t.exports.isArray(e)?!e.length:void 0===e||null===e||!String(e).trim().length},t.exports.isEqual=function(t,e){return n(t,e)},t.exports.isFunction=function(t){return"function"==typeof t},t.exports.isNaN=function(t){return/^\s*$/.test(t)||isNaN(t)},t.exports.isNull=function(t){return null===t},t.exports.isString=function(t){return"string"==typeof t||t instanceof String},t.exports.isUndefined=function(t){return void 0===t},t.exports.omit=function(t,e){var r={};for(var n in t)n!==e&&(r[n]=t[n]);return r},t.exports.templates=r(11),t.exports.mode="interactive"},function(t,e,r){"use strict";function n(){this.sessionId=0,this.resetting=0,this.errors=[],this.validatingRecords=[],this.passedRecords=[],this.touchedRecords=[],this.activated=!1}function i(t,e){var r=t.filter(function(t){return t.field===e});u.isEmpty(r)?t.push({field:e,value:!0}):r[0].value=!0}function s(t,e){if(!e)return void t.splice(0,t.length);var r=t.filter(function(t){return t.field===e});u.isEmpty(r)||(r[0].value=!1)}function o(t,e){var r=t.filter(function(t){return t.field===e});return!u.isEmpty(r)&&r[0].value}var a=r(2).Promise,u=r(0);n.prototype._setVM=function(t){this._vm=t},n.prototype.addError=function(t,e){this.resetting||this.errors.push({field:t,message:e})},n.prototype.removeErrors=function(t){u.isUndefined(t)?this.errors=[]:this.errors=this.errors.filter(function(e){return e.field!==t})},n.prototype.hasError=function(t){return u.isUndefined(t)?!!this.errors.length:!!this.firstError(t)},n.prototype.firstError=function(t){for(var e=0;e<this.errors.length;e++)if(u.isUndefined(t)||this.errors[e].field===t)return this.errors[e].message;return null},n.prototype.allErrors=function(t){return this.errors.filter(function(e){return u.isUndefined(t)||e.field===t}).map(function(t){return t.message})},n.prototype.countErrors=function(t){return u.isUndefined(t)?this.errors.length:this.errors.filter(function(e){return t===e.field}).length},n.prototype.setValidating=function(t,e){if(!this.resetting){e=e||n.newValidatingId();var r=this.validatingRecords.filter(function(r){return r.field===t&&r.id===e});if(!u.isEmpty(r))throw new Error("Validating id already set: "+e);return this.validatingRecords.push({field:t,id:e}),e}},n.prototype.resetValidating=function(t,e){if(!t)return void(this.validatingRecords=[]);for(var r=!0;r;){for(var n=-1,i=0;i<this.validatingRecords.length;i++)if(this.validatingRecords[i].field===t&&function(t){return!!u.isUndefined(e)||t.id===e}(this.validatingRecords[i])){n=i;break}n>=0?this.validatingRecords.splice(n,1):r=!1}},n.prototype.isValidating=function(t,e){function r(t){return!!u.isUndefined(e)||t.id===e}var n=this.validatingRecords.filter(function(e){return(u.isUndefined(t)||e.field===t)&&r(e)});return!u.isEmpty(n)},n.prototype.setPassed=function(t){this.resetting||i(this.passedRecords,t)},n.prototype.resetPassed=function(t){s(this.passedRecords,t)},n.prototype.isPassed=function(t){return o(this.passedRecords,t)},n.prototype.setTouched=function(t){this.resetting||i(this.touchedRecords,t)},n.prototype.resetTouched=function(t){s(this.touchedRecords,t)},n.prototype.isTouched=function(t){return o(this.touchedRecords,t)},n.prototype.reset=function(){this.sessionId++,this.errors=[],this.validatingRecords=[],this.passedRecords=[],this.touchedRecords=[],this._vm&&(this.resetting++,this._vm.$nextTick(function(){this.resetting--}.bind(this))),this.activated=!1},n.prototype.setError=function(t,e){if(!this.resetting){this.removeErrors(t),this.resetPassed(t);var r=u.isArray(e)?e:[e],n=function(e){var r=!1;return e.forEach(function(e){e&&(this.addError(t,e),r=!0)},this),r||this.setPassed(t),r}.bind(this);if(r.filter(function(t){return t&&t.then}).length>0){this.resetValidating(t);var i=this.setValidating(t),s=function(){this.resetValidating(t,i)}.bind(this);return a.all(r).then(function(e){return!!this.isValidating(t,i)&&n(e)}.bind(this)).then(function(t){return s(),t}).catch(function(t){return s(),a.reject(t)}.bind(this))}return a.resolve(n(r))}},n.prototype.checkRule=function(t){if(!this.resetting)return this.setError(t._field,t._messages)};var c=0;n.newValidatingId=function(){return(++c).toString()},t.exports=n},function(t,e,r){(function(e,n){/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */
!function(e,r){t.exports=r()}(0,function(){"use strict";function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function i(t){return"function"==typeof t}function s(t){Y=t}function o(t){Z=t}function a(){return void 0!==D?function(){D(c)}:u()}function u(){var t=setTimeout;return function(){return t(c,1)}}function c(){for(var t=0;t<B;t+=2){(0,Q[t])(Q[t+1]),Q[t]=void 0,Q[t+1]=void 0}B=0}function h(t,e){var r=arguments,n=this,i=new this.constructor(f);void 0===i[tt]&&M(i);var s=n._state;return s?function(){var t=r[s-1];Z(function(){return k(s,i,t,n._result)})}():T(n,i,t,e),i}function l(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var r=new e(f);return b(r,t),r}function f(){}function p(){return new TypeError("You cannot resolve a promise with itself")}function d(){return new TypeError("A promises callback cannot return that same promise.")}function m(t){try{return t.then}catch(t){return it.error=t,it}}function v(t,e,r,n){try{t.call(e,r,n)}catch(t){return t}}function y(t,e,r){Z(function(t){var n=!1,i=v(r,e,function(r){n||(n=!0,e!==r?b(t,r):E(t,r))},function(e){n||(n=!0,x(t,e))},"Settle: "+(t._label||" unknown promise"));!n&&i&&(n=!0,x(t,i))},t)}function g(t,e){e._state===rt?E(t,e._result):e._state===nt?x(t,e._result):T(e,void 0,function(e){return b(t,e)},function(e){return x(t,e)})}function _(t,e,r){e.constructor===t.constructor&&r===h&&e.constructor.resolve===l?g(t,e):r===it?x(t,it.error):void 0===r?E(t,e):i(r)?y(t,e,r):E(t,e)}function b(e,r){e===r?x(e,p()):t(r)?_(e,r,m(r)):E(e,r)}function w(t){t._onerror&&t._onerror(t._result),V(t)}function E(t,e){t._state===et&&(t._result=e,t._state=rt,0!==t._subscribers.length&&Z(V,t))}function x(t,e){t._state===et&&(t._state=nt,t._result=e,Z(w,t))}function T(t,e,r,n){var i=t._subscribers,s=i.length;t._onerror=null,i[s]=e,i[s+rt]=r,i[s+nt]=n,0===s&&t._state&&Z(V,t)}function V(t){var e=t._subscribers,r=t._state;if(0!==e.length){for(var n=void 0,i=void 0,s=t._result,o=0;o<e.length;o+=3)n=e[o],i=e[o+r],n?k(r,n,i,s):i(s);t._subscribers.length=0}}function j(){this.error=null}function A(t,e){try{return t(e)}catch(t){return st.error=t,st}}function k(t,e,r,n){var s=i(r),o=void 0,a=void 0,u=void 0,c=void 0;if(s){if(o=A(r,n),o===st?(c=!0,a=o.error,o=null):u=!0,e===o)return void x(e,d())}else o=n,u=!0;e._state!==et||(s&&u?b(e,o):c?x(e,a):t===rt?E(e,o):t===nt&&x(e,o))}function O(t,e){try{e(function(e){b(t,e)},function(e){x(t,e)})}catch(e){x(t,e)}}function S(){return ot++}function M(t){t[tt]=ot++,t._state=void 0,t._result=void 0,t._subscribers=[]}function R(t,e){this._instanceConstructor=t,this.promise=new t(f),this.promise[tt]||M(this.promise),z(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?E(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&E(this.promise,this._result))):x(this.promise,P())}function P(){return new Error("Array Methods must be provided an Array")}function I(t){return new R(this,t).promise}function N(t){var e=this;return new e(z(t)?function(r,n){for(var i=t.length,s=0;s<i;s++)e.resolve(t[s]).then(r,n)}:function(t,e){return e(new TypeError("You must pass an array to race."))})}function U(t){var e=this,r=new e(f);return x(r,t),r}function $(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function q(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function C(t){this[tt]=S(),this._result=this._state=void 0,this._subscribers=[],f!==t&&("function"!=typeof t&&$(),this instanceof C?O(this,t):q())}function L(){var t=void 0;if(void 0!==n)t=n;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var r=null;try{r=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===r&&!e.cast)return}t.Promise=C}var F=void 0;F=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var z=F,B=0,D=void 0,Y=void 0,Z=function(t,e){Q[B]=t,Q[B+1]=e,2===(B+=2)&&(Y?Y(c):X())},K="undefined"!=typeof window?window:void 0,W=K||{},G=W.MutationObserver||W.WebKitMutationObserver,H="undefined"==typeof self&&void 0!==e&&"[object process]"==={}.toString.call(e),J="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,Q=new Array(1e3),X=void 0;X=H?function(){return function(){return e.nextTick(c)}}():G?function(){var t=0,e=new G(c),r=document.createTextNode("");return e.observe(r,{characterData:!0}),function(){r.data=t=++t%2}}():J?function(){var t=new MessageChannel;return t.port1.onmessage=c,function(){return t.port2.postMessage(0)}}():void 0===K?function(){try{var t=r(7);return D=t.runOnLoop||t.runOnContext,a()}catch(t){return u()}}():u();var tt=Math.random().toString(36).substring(16),et=void 0,rt=1,nt=2,it=new j,st=new j,ot=0;return R.prototype._enumerate=function(){for(var t=this.length,e=this._input,r=0;this._state===et&&r<t;r++)this._eachEntry(e[r],r)},R.prototype._eachEntry=function(t,e){var r=this._instanceConstructor,n=r.resolve;if(n===l){var i=m(t);if(i===h&&t._state!==et)this._settledAt(t._state,e,t._result);else if("function"!=typeof i)this._remaining--,this._result[e]=t;else if(r===C){var s=new r(f);_(s,t,i),this._willSettleAt(s,e)}else this._willSettleAt(new r(function(e){return e(t)}),e)}else this._willSettleAt(n(t),e)},R.prototype._settledAt=function(t,e,r){var n=this.promise;n._state===et&&(this._remaining--,t===nt?x(n,r):this._result[e]=r),0===this._remaining&&E(n,this._result)},R.prototype._willSettleAt=function(t,e){var r=this;T(t,void 0,function(t){return r._settledAt(rt,e,t)},function(t){return r._settledAt(nt,e,t)})},C.all=I,C.race=N,C.resolve=l,C.reject=U,C._setScheduler=s,C._setAsap=o,C._asap=Z,C.prototype={constructor:C,then:h,catch:function(t){return this.then(null,t)}},C.polyfill=L,C.Promise=C,C})}).call(e,r(5),r(6))},function(t,e,r){"use strict";function n(t){this._field="",this._value=void 0,this._messages=[],t?(this.templates={},Object.keys(i.templates).forEach(function(t){this.templates[t]=i.templates[t]}.bind(this)),Object.keys(t).forEach(function(e){this.templates[e]=t[e]}.bind(this))):this.templates=i.templates}var i=r(0);n.prototype.field=function(t){return this._field=t,this},n.prototype.value=function(t){return this._value=t,this},n.prototype.custom=function(t,e){var r=e?t.call(e):t();if(r){if(r.then){var n=this;r=Promise.resolve(r).then(function(t){return t}).catch(function(t){return console.error(t.toString()),n.templates.error})}this._messages.push(r)}return this},n.prototype._checkValue=function(){if(void 0===this._value)throw new Error("Validator.value not set");return this._value},n.prototype.required=function(t){var e=this._checkValue();return i.isEmpty(e)&&this._messages.push(t||this.templates.required),this},n.prototype.float=function(t){var e=this._checkValue(),r=/^([-+])?([0-9]+(\.[0-9]+)?|Infinity)$/;return i.isEmpty(e)||r.test(e)||this._messages.push(t||this.templates.float),this},n.prototype.integer=function(t){var e=this._checkValue(),r=/^([-+])?([0-9]+|Infinity)$/;return i.isEmpty(e)||r.test(e)||this._messages.push(t||this.templates.integer),this},n.prototype.lessThan=function(t,e){var r=this._checkValue();if(!i.isEmpty(r)){var n=parseFloat(r);i.isNaN(n)?this._messages.push(e||this.templates.number):n>=t&&this._messages.push(e||i.format(this.templates.lessThan,t))}return this},n.prototype.lessThanOrEqualTo=function(t,e){var r=this._checkValue();if(!i.isEmpty(r)){var n=parseFloat(r);i.isNaN(n)?this._messages.push(e||this.templates.number):n>t&&this._messages.push(e||i.format(this.templates.lessThanOrEqualTo,t))}return this},n.prototype.greaterThan=function(t,e){var r=this._checkValue();if(!i.isEmpty(r)){var n=parseFloat(r);i.isNaN(n)?this._messages.push(e||this.templates.number):n<=t&&this._messages.push(e||i.format(this.templates.greaterThan,t))}return this},n.prototype.greaterThanOrEqualTo=function(t,e){var r=this._checkValue();if(!i.isEmpty(r)){var n=parseFloat(r);i.isNaN(n)?this._messages.push(e||this.templates.number):n<t&&this._messages.push(e||i.format(this.templates.greaterThanOrEqualTo,t))}return this},n.prototype.between=function(t,e,r){var n=this._checkValue();if(!i.isEmpty(n)){var s=parseFloat(n);i.isNaN(s)?this._messages.push(r||this.templates.number):(s<t||s>e)&&this._messages.push(r||i.format(this.templates.between,t,e))}return this},n.prototype.size=function(t,e){var r=this._checkValue();return!i.isEmpty(r)&&i.isArray(r)&&r.length!==t&&this._messages.push(e||i.format(this.templates.size,t)),this},n.prototype.length=function(t,e){var r=this._checkValue();return i.isEmpty(r)||String(r).length===t||this._messages.push(e||i.format(this.templates.length,t)),this},n.prototype.minLength=function(t,e){var r=this._checkValue();return!i.isEmpty(r)&&String(r).length<t&&this._messages.push(e||i.format(this.templates.minLength,t)),this},n.prototype.maxLength=function(t,e){var r=this._checkValue();return!i.isEmpty(r)&&String(r).length>t&&this._messages.push(e||i.format(this.templates.maxLength,t)),this},n.prototype.lengthBetween=function(t,e,r){var n=this._checkValue();if(!i.isEmpty(n)){var s=String(n);(s.length<t||s.length>e)&&this._messages.push(r||i.format(this.templates.lengthBetween,t,e))}return this},n.prototype.in=function(t,e){var r=this._checkValue();return!i.isEmpty(r)&&t.indexOf(r)<0&&this._messages.push(e||i.format(this.templates.in,this.templates.optionCombiner(t))),this},n.prototype.notIn=function(t,e){var r=this._checkValue();return!i.isEmpty(r)&&t.indexOf(r)>=0&&this._messages.push(e||i.format(this.templates.notIn,this.templates.optionCombiner(t))),this},n.prototype.match=function(t,e){var r=this._checkValue();return i.isEmpty(r)||r===t||this._messages.push(e||this.templates.match),this},n.prototype.regex=function(t,e){var r=this._checkValue();return i.isEmpty(r)||(i.isString(t)&&(t=new RegExp(t)),t.test(r)||this._messages.push(e||this.templates.regex)),this},n.prototype.digit=function(t){return this.regex(/^\d*$/,t||this.templates.digit)},n.prototype.email=function(t){return this.regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,t||this.templates.email)},n.prototype.url=function(t){return this.regex(/(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,t||this.templates.url)},n.prototype.hasImmediateError=function(){for(var t=0;t<this._messages.length;t++)if(this._messages[t]&&!this._messages[t].then)return!0;return!1},t.exports=n},function(t,e,r){"use strict";function n(t,e){t.mixin(c),e&&e.templates&&i(e.templates),e&&e.mode&&s(e.mode),e&&e.Promise&&(c.Promise=e.Promise)}function i(t){Object.keys(t).forEach(function(e){h.templates[e]=t[e]})}function s(t){if("interactive"!==t&&"conservative"!==t&&"manual"!==t)throw new Error("Invalid mode: "+t);h.mode=t}var o=r(1),a=r(3),u=r(12),c=r(13),h=r(0);t.exports.name="SimpleVueValidator",t.exports.ValidationBag=o,t.exports.Rule=a,t.exports.Validator=u,t.exports.mixin=c,t.exports.install=n,t.exports.extendTemplates=i,t.exports.setMode=s},function(t,e){function r(){throw new Error("setTimeout has not been defined")}function n(){throw new Error("clearTimeout has not been defined")}function i(t){if(h===setTimeout)return setTimeout(t,0);if((h===r||!h)&&setTimeout)return h=setTimeout,setTimeout(t,0);try{return h(t,0)}catch(e){try{return h.call(null,t,0)}catch(e){return h.call(this,t,0)}}}function s(t){if(l===clearTimeout)return clearTimeout(t);if((l===n||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(t);try{return l(t)}catch(e){try{return l.call(null,t)}catch(e){return l.call(this,t)}}}function o(){m&&p&&(m=!1,p.length?d=p.concat(d):v=-1,d.length&&a())}function a(){if(!m){var t=i(o);m=!0;for(var e=d.length;e;){for(p=d,d=[];++v<e;)p&&p[v].run();v=-1,e=d.length}p=null,m=!1,s(t)}}function u(t,e){this.fun=t,this.array=e}function c(){}var h,l,f=t.exports={};!function(){try{h="function"==typeof setTimeout?setTimeout:r}catch(t){h=r}try{l="function"==typeof clearTimeout?clearTimeout:n}catch(t){l=n}}();var p,d=[],m=!1,v=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];d.push(new u(t,e)),1!==d.length||m||i(a)},u.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=c,f.addListener=c,f.once=c,f.off=c,f.removeListener=c,f.removeAllListeners=c,f.emit=c,f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e){},function(t,e,r){function n(t){return null===t||void 0===t}function i(t){return!(!t||"object"!=typeof t||"number"!=typeof t.length)&&("function"==typeof t.copy&&"function"==typeof t.slice&&!(t.length>0&&"number"!=typeof t[0]))}function s(t,e,r){var s,h;if(n(t)||n(e))return!1;if(t.prototype!==e.prototype)return!1;if(u(t))return!!u(e)&&(t=o.call(t),e=o.call(e),c(t,e,r));if(i(t)){if(!i(e))return!1;if(t.length!==e.length)return!1;for(s=0;s<t.length;s++)if(t[s]!==e[s])return!1;return!0}try{var l=a(t),f=a(e)}catch(t){return!1}if(l.length!=f.length)return!1;for(l.sort(),f.sort(),s=l.length-1;s>=0;s--)if(l[s]!=f[s])return!1;for(s=l.length-1;s>=0;s--)if(h=l[s],!c(t[h],e[h],r))return!1;return typeof t==typeof e}var o=Array.prototype.slice,a=r(9),u=r(10),c=t.exports=function(t,e,r){return r||(r={}),t===e||(t instanceof Date&&e instanceof Date?t.getTime()===e.getTime():!t||!e||"object"!=typeof t&&"object"!=typeof e?r.strict?t===e:t==e:s(t,e,r))}},function(t,e){function r(t){var e=[];for(var r in t)e.push(r);return e}e=t.exports="function"==typeof Object.keys?Object.keys:r,e.shim=r},function(t,e){function r(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function n(t){return t&&"object"==typeof t&&"number"==typeof t.length&&Object.prototype.hasOwnProperty.call(t,"callee")&&!Object.prototype.propertyIsEnumerable.call(t,"callee")||!1}var i="[object Arguments]"==function(){return Object.prototype.toString.call(arguments)}();e=t.exports=i?r:n,e.supported=r,e.unsupported=n},function(t,e,r){"use strict";t.exports={error:"Error.",required:"Required.",float:"Must be a number.",integer:"Must be an integer.",number:"Must be a number.",lessThan:"Must be less than {0}.",lessThanOrEqualTo:"Must be less than or equal to {0}.",greaterThan:"Must be greater than {0}.",greaterThanOrEqualTo:"Must greater than or equal to {0}.",between:"Must be between {0} and {1}.",size:"Size must be {0}.",length:"Length must be {0}.",minLength:"Must have at least {0} characters.",maxLength:"Must have up to {0} characters.",lengthBetween:"Length must between {0} and {1}.",in:"Must be {0}.",notIn:"Must not be {0}.",match:"Not matched.",regex:"Invalid format.",digit:"Must be a digit.",email:"Invalid email.",url:"Invalid url.",optionCombiner:function(t){return t.length>2&&(t=[t.slice(0,t.length-1).join(", "),t[t.length-1]]),t.join(" or ")}}},function(t,e,r){"use strict";function n(t){t=t||{};var e={};return Object.keys(s.prototype).forEach(function(r){e[r]=function(){var e=new s(t.templates);return e[r].apply(e,arguments)}}),e.isEmpty=i.isEmpty,e.format=i.format,e}var i=r(0),s=r(3),o=n();o.create=function(t){return n(t)},t.exports=o},function(t,e,r){"use strict";function n(t){t&&t.forEach(function(t){t()})}function i(t,e){var r=e.split(".");return function(){for(var e=t,n=0;n<r.length&&(!c.isNull(e)&&!c.isUndefined(e));n++)e=e[r[n]];return e}}function s(t,e,r){return e.map(function(e){return t.$watch(e,function(){t.validation.setTouched(e),r.call()})})}function o(t,e){return function(){var r=t.cache;r||(r=[],t.cache=r);var n=Array.prototype.slice.call(arguments),i=u(r,n);if(!c.isUndefined(i))return i;var s=t.apply(this,n);return c.isUndefined(s)?void 0:s.then?s.tab(function(t){c.isUndefined(t)||("all"!==e&&r.splice(0,r.length),r.push({args:n,result:t}))}):("all"!==e&&r.splice(0,r.length),r.push({args:n,result:s}),s)}}function a(){return l.Promise?l.Promise:r(2).Promise}function u(t,e){var r=t.filter(function(t){return c.isEqual(e,t.args)});if(!c.isEmpty(r))return r[0].result}var c=r(0),h=r(1),l={Promise:null,beforeMount:function(){this.$setValidators(this.$options.validators),this.validation&&this.validation._setVM(this)},beforeDestroy:function(){n(this.$options.validatorsUnwatchCallbacks)},data:function(){return this.$options.validators?{validation:new h}:{}},methods:{$setValidators:function(t){n(this.$options.validatorsUnwatchCallbacks);var e={};this.$options.validateMethods=e;var r=[];this.$options.validatorsUnwatchCallbacks=r,t&&Object.keys(t).forEach(function(n){var u=n.split(",");u=u.map(function(t){return t.trim()});var h=u.map(function(t){return i(this,t)},this),l=t[n],f={};if(c.isFunction(l)||(f=c.omit(l,"validator"),l=l.validator),f.cache){var p="last"===f.cache?"last":"all";l=o(l,p)}var d=this.validation,m=function(){if("conservative"===c.mode&&!d.activated)return a().resolve(!1);var t=h.map(function(t){return t()}),e=l.apply(this,t);return e?(e._field||e.field(u[0]),this.validation.checkRule(e)):a().resolve(!1)}.bind(this);e[u[0]]=m;var v=m;if(f.debounce){var y=function(){return y.sessionId!==this.validation.sessionId?a().resolve(!1):m.apply(this,arguments)}.bind(this),g=c.debounce(y,parseInt(f.debounce)),_=u[0];v=function(){this.validation.resetPassed(_),y.sessionId=this.validation.sessionId,g.apply(this,arguments)}.bind(this)}"manual"!==c.mode&&s(this,u,v).forEach(function(t){r.push(t)})},this)},$validate:function(t){if(this.validation._validate)return this.validation._validate;this.validation.activated=!0;var e=this.$options.validateMethods;if(c.isUndefined(t)?e=Object.keys(e).map(function(t){return e[t]}):(t=c.isArray(t)?t:[t],e=t.map(function(t){return e[t]})),c.isEmpty(e))return a().resolve(!0);var r=function(){this.validation._validate=null}.bind(this);return this.validation._validate=a().all(e.map(function(t){return t()})).then(function(t){return r(),t.filter(function(t){return!!t}).length<=0}.bind(this)).catch(function(t){throw r(),t}),this.validation._validate}}};t.exports=l}])});