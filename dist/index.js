(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('util'), require('stream'), require('path'), require('http'), require('https'), require('url'), require('fs'), require('assert'), require('zlib'), require('events')) :
  typeof define === 'function' && define.amd ? define(['exports', 'util', 'stream', 'path', 'http', 'https', 'url', 'fs', 'assert', 'zlib', 'events'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TourCMSWrapper = {}, global.require$$1, global.stream, global.require$$1$1, global.require$$3, global.require$$4, global.require$$0$1, global.require$$6, global.require$$4$1, global.zlib, global.events$1));
})(this, (function (exports, require$$1, stream, require$$1$1, require$$3, require$$4, require$$0$1, require$$6, require$$4$1, zlib, events$1) { 'use strict';

  function bind(fn, thisArg) {
    return function wrap() {
      return fn.apply(thisArg, arguments);
    };
  }

  // utils is a library of generic helper functions non-specific to axios

  const {toString} = Object.prototype;
  const {getPrototypeOf} = Object;

  const kindOf = (cache => thing => {
      const str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  })(Object.create(null));

  const kindOfTest = (type) => {
    type = type.toLowerCase();
    return (thing) => kindOf(thing) === type
  };

  const typeOfTest = type => thing => typeof thing === type;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   *
   * @returns {boolean} True if value is an Array, otherwise false
   */
  const {isArray} = Array;

  /**
   * Determine if a value is undefined
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  const isUndefined = typeOfTest('undefined');

  /**
   * Determine if a value is a Buffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer$1(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  const isArrayBuffer = kindOfTest('ArrayBuffer');


  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    let result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a String, otherwise false
   */
  const isString$1 = typeOfTest('string');

  /**
   * Determine if a value is a Function
   *
   * @param {*} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  const isFunction$1 = typeOfTest('function');

  /**
   * Determine if a value is a Number
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Number, otherwise false
   */
  const isNumber = typeOfTest('number');

  /**
   * Determine if a value is an Object
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an Object, otherwise false
   */
  const isObject = (thing) => thing !== null && typeof thing === 'object';

  /**
   * Determine if a value is a Boolean
   *
   * @param {*} thing The value to test
   * @returns {boolean} True if value is a Boolean, otherwise false
   */
  const isBoolean = thing => thing === true || thing === false;

  /**
   * Determine if a value is a plain Object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a plain Object, otherwise false
   */
  const isPlainObject = (val) => {
    if (kindOf(val) !== 'object') {
      return false;
    }

    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
  };

  /**
   * Determine if a value is a Date
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Date, otherwise false
   */
  const isDate = kindOfTest('Date');

  /**
   * Determine if a value is a File
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  const isFile = kindOfTest('File');

  /**
   * Determine if a value is a Blob
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  const isBlob = kindOfTest('Blob');

  /**
   * Determine if a value is a FileList
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a File, otherwise false
   */
  const isFileList = kindOfTest('FileList');

  /**
   * Determine if a value is a Stream
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  const isStream = (val) => isObject(val) && isFunction$1(val.pipe);

  /**
   * Determine if a value is a FormData
   *
   * @param {*} thing The value to test
   *
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  const isFormData = (thing) => {
    let kind;
    return thing && (
      (typeof FormData === 'function' && thing instanceof FormData) || (
        isFunction$1(thing.append) && (
          (kind = kindOf(thing)) === 'formdata' ||
          // detect form-data instance
          (kind === 'object' && isFunction$1(thing.toString) && thing.toString() === '[object FormData]')
        )
      )
    )
  };

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  const isURLSearchParams = kindOfTest('URLSearchParams');

  const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   *
   * @returns {String} The String freed of excess whitespace
   */
  const trim = (str) => str.trim ?
    str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   *
   * @param {Boolean} [allOwnKeys = false]
   * @returns {any}
   */
  function forEach(obj, fn, {allOwnKeys = false} = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    let i;
    let l;

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
      const len = keys.length;
      let key;

      for (i = 0; i < len; i++) {
        key = keys[i];
        fn.call(null, obj[key], key, obj);
      }
    }
  }

  function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while (i-- > 0) {
      _key = keys[i];
      if (key === _key.toLowerCase()) {
        return _key;
      }
    }
    return null;
  }

  const _global = (() => {
    /*eslint no-undef:0*/
    if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
  })();

  const isContextDefined = (context) => !isUndefined(context) && context !== _global;

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   *
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    const {caseless} = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key) => {
      const targetKey = caseless && findKey(result, key) || key;
      if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
        result[targetKey] = merge(result[targetKey], val);
      } else if (isPlainObject(val)) {
        result[targetKey] = merge({}, val);
      } else if (isArray(val)) {
        result[targetKey] = val.slice();
      } else {
        result[targetKey] = val;
      }
    };

    for (let i = 0, l = arguments.length; i < l; i++) {
      arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   *
   * @param {Boolean} [allOwnKeys]
   * @returns {Object} The resulting value of object a
   */
  const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
    forEach(b, (val, key) => {
      if (thisArg && isFunction$1(val)) {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    }, {allOwnKeys});
    return a;
  };

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   *
   * @returns {string} content value without BOM
   */
  const stripBOM = (content) => {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  };

  /**
   * Inherit the prototype methods from one constructor into another
   * @param {function} constructor
   * @param {function} superConstructor
   * @param {object} [props]
   * @param {object} [descriptors]
   *
   * @returns {void}
   */
  const inherits = (constructor, superConstructor, props, descriptors) => {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, 'super', {
      value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
  };

  /**
   * Resolve object with deep prototype chain to a flat object
   * @param {Object} sourceObj source object
   * @param {Object} [destObj]
   * @param {Function|Boolean} [filter]
   * @param {Function} [propFilter]
   *
   * @returns {Object}
   */
  const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
    let props;
    let i;
    let prop;
    const merged = {};

    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;

    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
        if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = filter !== false && getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

    return destObj;
  };

  /**
   * Determines whether a string ends with the characters of a specified string
   *
   * @param {String} str
   * @param {String} searchString
   * @param {Number} [position= 0]
   *
   * @returns {boolean}
   */
  const endsWith = (str, searchString, position) => {
    str = String(str);
    if (position === undefined || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };


  /**
   * Returns new array from array like object or null if failed
   *
   * @param {*} [thing]
   *
   * @returns {?Array}
   */
  const toArray = (thing) => {
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  };

  /**
   * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
   * thing passed in is an instance of Uint8Array
   *
   * @param {TypedArray}
   *
   * @returns {Array}
   */
  // eslint-disable-next-line func-names
  const isTypedArray = (TypedArray => {
    // eslint-disable-next-line func-names
    return thing => {
      return TypedArray && thing instanceof TypedArray;
    };
  })(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

  /**
   * For each entry in the object, call the function with the key and value.
   *
   * @param {Object<any, any>} obj - The object to iterate over.
   * @param {Function} fn - The function to call for each entry.
   *
   * @returns {void}
   */
  const forEachEntry = (obj, fn) => {
    const generator = obj && obj[Symbol.iterator];

    const iterator = generator.call(obj);

    let result;

    while ((result = iterator.next()) && !result.done) {
      const pair = result.value;
      fn.call(obj, pair[0], pair[1]);
    }
  };

  /**
   * It takes a regular expression and a string, and returns an array of all the matches
   *
   * @param {string} regExp - The regular expression to match against.
   * @param {string} str - The string to search.
   *
   * @returns {Array<boolean>}
   */
  const matchAll = (regExp, str) => {
    let matches;
    const arr = [];

    while ((matches = regExp.exec(str)) !== null) {
      arr.push(matches);
    }

    return arr;
  };

  /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
  const isHTMLForm = kindOfTest('HTMLFormElement');

  const toCamelCase = str => {
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
      function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
      }
    );
  };

  /* Creating a function that will check if an object has a property. */
  const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

  /**
   * Determine if a value is a RegExp object
   *
   * @param {*} val The value to test
   *
   * @returns {boolean} True if value is a RegExp object, otherwise false
   */
  const isRegExp = kindOfTest('RegExp');

  const reduceDescriptors = (obj, reducer) => {
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};

    forEach(descriptors, (descriptor, name) => {
      let ret;
      if ((ret = reducer(descriptor, name, obj)) !== false) {
        reducedDescriptors[name] = ret || descriptor;
      }
    });

    Object.defineProperties(obj, reducedDescriptors);
  };

  /**
   * Makes all methods read-only
   * @param {Object} obj
   */

  const freezeMethods = (obj) => {
    reduceDescriptors(obj, (descriptor, name) => {
      // skip restricted props in strict mode
      if (isFunction$1(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
        return false;
      }

      const value = obj[name];

      if (!isFunction$1(value)) return;

      descriptor.enumerable = false;

      if ('writable' in descriptor) {
        descriptor.writable = false;
        return;
      }

      if (!descriptor.set) {
        descriptor.set = () => {
          throw Error('Can not rewrite read-only method \'' + name + '\'');
        };
      }
    });
  };

  const toObjectSet = (arrayOrString, delimiter) => {
    const obj = {};

    const define = (arr) => {
      arr.forEach(value => {
        obj[value] = true;
      });
    };

    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

    return obj;
  };

  const noop$1 = () => {};

  const toFiniteNumber = (value, defaultValue) => {
    return value != null && Number.isFinite(value = +value) ? value : defaultValue;
  };

  const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

  const DIGIT = '0123456789';

  const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
  };

  const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
    let str = '';
    const {length} = alphabet;
    while (size--) {
      str += alphabet[Math.random() * length|0];
    }

    return str;
  };

  /**
   * If the thing is a FormData object, return true, otherwise return false.
   *
   * @param {unknown} thing - The thing to check.
   *
   * @returns {boolean}
   */
  function isSpecCompliantForm(thing) {
    return !!(thing && isFunction$1(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
  }

  const toJSONObject = (obj) => {
    const stack = new Array(10);

    const visit = (source, i) => {

      if (isObject(source)) {
        if (stack.indexOf(source) >= 0) {
          return;
        }

        if(!('toJSON' in source)) {
          stack[i] = source;
          const target = isArray(source) ? [] : {};

          forEach(source, (value, key) => {
            const reducedValue = visit(value, i + 1);
            !isUndefined(reducedValue) && (target[key] = reducedValue);
          });

          stack[i] = undefined;

          return target;
        }
      }

      return source;
    };

    return visit(obj, 0);
  };

  const isAsyncFn = kindOfTest('AsyncFunction');

  const isThenable = (thing) =>
    thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);

  var utils$1 = {
    isArray,
    isArrayBuffer,
    isBuffer: isBuffer$1,
    isFormData,
    isArrayBufferView,
    isString: isString$1,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isReadableStream,
    isRequest,
    isResponse,
    isHeaders,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction: isFunction$1,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty,
    hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop: noop$1,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [config] The config.
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   *
   * @returns {Error} The created error.
   */
  function AxiosError(message, code, config, request, response) {
    Error.call(this);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }

    this.message = message;
    this.name = 'AxiosError';
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }

  utils$1.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: utils$1.toJSONObject(this.config),
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });

  const prototype$1 = AxiosError.prototype;
  const descriptors = {};

  [
    'ERR_BAD_OPTION_VALUE',
    'ERR_BAD_OPTION',
    'ECONNABORTED',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_FR_TOO_MANY_REDIRECTS',
    'ERR_DEPRECATED',
    'ERR_BAD_RESPONSE',
    'ERR_BAD_REQUEST',
    'ERR_CANCELED',
    'ERR_NOT_SUPPORT',
    'ERR_INVALID_URL'
  // eslint-disable-next-line func-names
  ].forEach(code => {
    descriptors[code] = {value: code};
  });

  Object.defineProperties(AxiosError, descriptors);
  Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

  // eslint-disable-next-line func-names
  AxiosError.from = (error, code, config, request, response, customProps) => {
    const axiosError = Object.create(prototype$1);

    utils$1.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    }, prop => {
      return prop !== 'isAxiosError';
    });

    AxiosError.call(axiosError, error.message, code, config, request, response);

    axiosError.cause = error;

    axiosError.name = error.name;

    customProps && Object.assign(axiosError, customProps);

    return axiosError;
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var Stream$2 = stream.Stream;
  var util$2 = require$$1;

  var delayed_stream = DelayedStream$1;
  function DelayedStream$1() {
    this.source = null;
    this.dataSize = 0;
    this.maxDataSize = 1024 * 1024;
    this.pauseStream = true;

    this._maxDataSizeExceeded = false;
    this._released = false;
    this._bufferedEvents = [];
  }
  util$2.inherits(DelayedStream$1, Stream$2);

  DelayedStream$1.create = function(source, options) {
    var delayedStream = new this();

    options = options || {};
    for (var option in options) {
      delayedStream[option] = options[option];
    }

    delayedStream.source = source;

    var realEmit = source.emit;
    source.emit = function() {
      delayedStream._handleEmit(arguments);
      return realEmit.apply(source, arguments);
    };

    source.on('error', function() {});
    if (delayedStream.pauseStream) {
      source.pause();
    }

    return delayedStream;
  };

  Object.defineProperty(DelayedStream$1.prototype, 'readable', {
    configurable: true,
    enumerable: true,
    get: function() {
      return this.source.readable;
    }
  });

  DelayedStream$1.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
  };

  DelayedStream$1.prototype.resume = function() {
    if (!this._released) {
      this.release();
    }

    this.source.resume();
  };

  DelayedStream$1.prototype.pause = function() {
    this.source.pause();
  };

  DelayedStream$1.prototype.release = function() {
    this._released = true;

    this._bufferedEvents.forEach(function(args) {
      this.emit.apply(this, args);
    }.bind(this));
    this._bufferedEvents = [];
  };

  DelayedStream$1.prototype.pipe = function() {
    var r = Stream$2.prototype.pipe.apply(this, arguments);
    this.resume();
    return r;
  };

  DelayedStream$1.prototype._handleEmit = function(args) {
    if (this._released) {
      this.emit.apply(this, args);
      return;
    }

    if (args[0] === 'data') {
      this.dataSize += args[1].length;
      this._checkIfMaxDataSizeExceeded();
    }

    this._bufferedEvents.push(args);
  };

  DelayedStream$1.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) {
      return;
    }

    if (this.dataSize <= this.maxDataSize) {
      return;
    }

    this._maxDataSizeExceeded = true;
    var message =
      'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this.emit('error', new Error(message));
  };

  var util$1 = require$$1;
  var Stream$1 = stream.Stream;
  var DelayedStream = delayed_stream;

  var combined_stream = CombinedStream$1;
  function CombinedStream$1() {
    this.writable = false;
    this.readable = true;
    this.dataSize = 0;
    this.maxDataSize = 2 * 1024 * 1024;
    this.pauseStreams = true;

    this._released = false;
    this._streams = [];
    this._currentStream = null;
    this._insideLoop = false;
    this._pendingNext = false;
  }
  util$1.inherits(CombinedStream$1, Stream$1);

  CombinedStream$1.create = function(options) {
    var combinedStream = new this();

    options = options || {};
    for (var option in options) {
      combinedStream[option] = options[option];
    }

    return combinedStream;
  };

  CombinedStream$1.isStreamLike = function(stream) {
    return (typeof stream !== 'function')
      && (typeof stream !== 'string')
      && (typeof stream !== 'boolean')
      && (typeof stream !== 'number')
      && (!Buffer.isBuffer(stream));
  };

  CombinedStream$1.prototype.append = function(stream) {
    var isStreamLike = CombinedStream$1.isStreamLike(stream);

    if (isStreamLike) {
      if (!(stream instanceof DelayedStream)) {
        var newStream = DelayedStream.create(stream, {
          maxDataSize: Infinity,
          pauseStream: this.pauseStreams,
        });
        stream.on('data', this._checkDataSize.bind(this));
        stream = newStream;
      }

      this._handleErrors(stream);

      if (this.pauseStreams) {
        stream.pause();
      }
    }

    this._streams.push(stream);
    return this;
  };

  CombinedStream$1.prototype.pipe = function(dest, options) {
    Stream$1.prototype.pipe.call(this, dest, options);
    this.resume();
    return dest;
  };

  CombinedStream$1.prototype._getNext = function() {
    this._currentStream = null;

    if (this._insideLoop) {
      this._pendingNext = true;
      return; // defer call
    }

    this._insideLoop = true;
    try {
      do {
        this._pendingNext = false;
        this._realGetNext();
      } while (this._pendingNext);
    } finally {
      this._insideLoop = false;
    }
  };

  CombinedStream$1.prototype._realGetNext = function() {
    var stream = this._streams.shift();


    if (typeof stream == 'undefined') {
      this.end();
      return;
    }

    if (typeof stream !== 'function') {
      this._pipeNext(stream);
      return;
    }

    var getStream = stream;
    getStream(function(stream) {
      var isStreamLike = CombinedStream$1.isStreamLike(stream);
      if (isStreamLike) {
        stream.on('data', this._checkDataSize.bind(this));
        this._handleErrors(stream);
      }

      this._pipeNext(stream);
    }.bind(this));
  };

  CombinedStream$1.prototype._pipeNext = function(stream) {
    this._currentStream = stream;

    var isStreamLike = CombinedStream$1.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('end', this._getNext.bind(this));
      stream.pipe(this, {end: false});
      return;
    }

    var value = stream;
    this.write(value);
    this._getNext();
  };

  CombinedStream$1.prototype._handleErrors = function(stream) {
    var self = this;
    stream.on('error', function(err) {
      self._emitError(err);
    });
  };

  CombinedStream$1.prototype.write = function(data) {
    this.emit('data', data);
  };

  CombinedStream$1.prototype.pause = function() {
    if (!this.pauseStreams) {
      return;
    }

    if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
    this.emit('pause');
  };

  CombinedStream$1.prototype.resume = function() {
    if (!this._released) {
      this._released = true;
      this.writable = true;
      this._getNext();
    }

    if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
    this.emit('resume');
  };

  CombinedStream$1.prototype.end = function() {
    this._reset();
    this.emit('end');
  };

  CombinedStream$1.prototype.destroy = function() {
    this._reset();
    this.emit('close');
  };

  CombinedStream$1.prototype._reset = function() {
    this.writable = false;
    this._streams = [];
    this._currentStream = null;
  };

  CombinedStream$1.prototype._checkDataSize = function() {
    this._updateDataSize();
    if (this.dataSize <= this.maxDataSize) {
      return;
    }

    var message =
      'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
    this._emitError(new Error(message));
  };

  CombinedStream$1.prototype._updateDataSize = function() {
    this.dataSize = 0;

    var self = this;
    this._streams.forEach(function(stream) {
      if (!stream.dataSize) {
        return;
      }

      self.dataSize += stream.dataSize;
    });

    if (this._currentStream && this._currentStream.dataSize) {
      this.dataSize += this._currentStream.dataSize;
    }
  };

  CombinedStream$1.prototype._emitError = function(err) {
    this._reset();
    this.emit('error', err);
  };

  var mimeTypes = {};

  var require$$0 = {
  	"application/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"application/3gpdash-qoe-report+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/3gpp-ims+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/3gpphal+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/3gpphalforms+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/a2l": {
  	source: "iana"
  },
  	"application/ace+cbor": {
  	source: "iana"
  },
  	"application/activemessage": {
  	source: "iana"
  },
  	"application/activity+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-costmap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-costmapfilter+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-directory+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointcost+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointcostparams+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointprop+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-endpointpropparams+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-error+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-networkmap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-networkmapfilter+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-updatestreamcontrol+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/alto-updatestreamparams+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/aml": {
  	source: "iana"
  },
  	"application/andrew-inset": {
  	source: "iana",
  	extensions: [
  		"ez"
  	]
  },
  	"application/applefile": {
  	source: "iana"
  },
  	"application/applixware": {
  	source: "apache",
  	extensions: [
  		"aw"
  	]
  },
  	"application/at+jwt": {
  	source: "iana"
  },
  	"application/atf": {
  	source: "iana"
  },
  	"application/atfx": {
  	source: "iana"
  },
  	"application/atom+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atom"
  	]
  },
  	"application/atomcat+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atomcat"
  	]
  },
  	"application/atomdeleted+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atomdeleted"
  	]
  },
  	"application/atomicmail": {
  	source: "iana"
  },
  	"application/atomsvc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"atomsvc"
  	]
  },
  	"application/atsc-dwd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dwd"
  	]
  },
  	"application/atsc-dynamic-event-message": {
  	source: "iana"
  },
  	"application/atsc-held+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"held"
  	]
  },
  	"application/atsc-rdt+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/atsc-rsat+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rsat"
  	]
  },
  	"application/atxml": {
  	source: "iana"
  },
  	"application/auth-policy+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/bacnet-xdd+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/batch-smtp": {
  	source: "iana"
  },
  	"application/bdoc": {
  	compressible: false,
  	extensions: [
  		"bdoc"
  	]
  },
  	"application/beep+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/calendar+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/calendar+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xcs"
  	]
  },
  	"application/call-completion": {
  	source: "iana"
  },
  	"application/cals-1840": {
  	source: "iana"
  },
  	"application/captive+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/cbor": {
  	source: "iana"
  },
  	"application/cbor-seq": {
  	source: "iana"
  },
  	"application/cccex": {
  	source: "iana"
  },
  	"application/ccmp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ccxml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ccxml"
  	]
  },
  	"application/cdfx+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"cdfx"
  	]
  },
  	"application/cdmi-capability": {
  	source: "iana",
  	extensions: [
  		"cdmia"
  	]
  },
  	"application/cdmi-container": {
  	source: "iana",
  	extensions: [
  		"cdmic"
  	]
  },
  	"application/cdmi-domain": {
  	source: "iana",
  	extensions: [
  		"cdmid"
  	]
  },
  	"application/cdmi-object": {
  	source: "iana",
  	extensions: [
  		"cdmio"
  	]
  },
  	"application/cdmi-queue": {
  	source: "iana",
  	extensions: [
  		"cdmiq"
  	]
  },
  	"application/cdni": {
  	source: "iana"
  },
  	"application/cea": {
  	source: "iana"
  },
  	"application/cea-2018+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cellml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cfw": {
  	source: "iana"
  },
  	"application/city+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/clr": {
  	source: "iana"
  },
  	"application/clue+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/clue_info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cms": {
  	source: "iana"
  },
  	"application/cnrp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/coap-group+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/coap-payload": {
  	source: "iana"
  },
  	"application/commonground": {
  	source: "iana"
  },
  	"application/conference-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cose": {
  	source: "iana"
  },
  	"application/cose-key": {
  	source: "iana"
  },
  	"application/cose-key-set": {
  	source: "iana"
  },
  	"application/cpl+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"cpl"
  	]
  },
  	"application/csrattrs": {
  	source: "iana"
  },
  	"application/csta+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/cstadata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/csvm+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/cu-seeme": {
  	source: "apache",
  	extensions: [
  		"cu"
  	]
  },
  	"application/cwt": {
  	source: "iana"
  },
  	"application/cybercash": {
  	source: "iana"
  },
  	"application/dart": {
  	compressible: true
  },
  	"application/dash+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpd"
  	]
  },
  	"application/dash-patch+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpp"
  	]
  },
  	"application/dashdelta": {
  	source: "iana"
  },
  	"application/davmount+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"davmount"
  	]
  },
  	"application/dca-rft": {
  	source: "iana"
  },
  	"application/dcd": {
  	source: "iana"
  },
  	"application/dec-dx": {
  	source: "iana"
  },
  	"application/dialog-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/dicom": {
  	source: "iana"
  },
  	"application/dicom+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/dicom+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/dii": {
  	source: "iana"
  },
  	"application/dit": {
  	source: "iana"
  },
  	"application/dns": {
  	source: "iana"
  },
  	"application/dns+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/dns-message": {
  	source: "iana"
  },
  	"application/docbook+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"dbk"
  	]
  },
  	"application/dots+cbor": {
  	source: "iana"
  },
  	"application/dskpp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/dssc+der": {
  	source: "iana",
  	extensions: [
  		"dssc"
  	]
  },
  	"application/dssc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xdssc"
  	]
  },
  	"application/dvcs": {
  	source: "iana"
  },
  	"application/ecmascript": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"es",
  		"ecma"
  	]
  },
  	"application/edi-consent": {
  	source: "iana"
  },
  	"application/edi-x12": {
  	source: "iana",
  	compressible: false
  },
  	"application/edifact": {
  	source: "iana",
  	compressible: false
  },
  	"application/efi": {
  	source: "iana"
  },
  	"application/elm+json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/elm+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.cap+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/emergencycalldata.comment+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.control+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.deviceinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.ecall.msd": {
  	source: "iana"
  },
  	"application/emergencycalldata.providerinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.serviceinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.subscriberinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emergencycalldata.veds+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/emma+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"emma"
  	]
  },
  	"application/emotionml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"emotionml"
  	]
  },
  	"application/encaprtp": {
  	source: "iana"
  },
  	"application/epp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/epub+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"epub"
  	]
  },
  	"application/eshop": {
  	source: "iana"
  },
  	"application/exi": {
  	source: "iana",
  	extensions: [
  		"exi"
  	]
  },
  	"application/expect-ct-report+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/express": {
  	source: "iana",
  	extensions: [
  		"exp"
  	]
  },
  	"application/fastinfoset": {
  	source: "iana"
  },
  	"application/fastsoap": {
  	source: "iana"
  },
  	"application/fdt+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"fdt"
  	]
  },
  	"application/fhir+json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/fhir+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/fido.trusted-apps+json": {
  	compressible: true
  },
  	"application/fits": {
  	source: "iana"
  },
  	"application/flexfec": {
  	source: "iana"
  },
  	"application/font-sfnt": {
  	source: "iana"
  },
  	"application/font-tdpfr": {
  	source: "iana",
  	extensions: [
  		"pfr"
  	]
  },
  	"application/font-woff": {
  	source: "iana",
  	compressible: false
  },
  	"application/framework-attributes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/geo+json": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"geojson"
  	]
  },
  	"application/geo+json-seq": {
  	source: "iana"
  },
  	"application/geopackage+sqlite3": {
  	source: "iana"
  },
  	"application/geoxacml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/gltf-buffer": {
  	source: "iana"
  },
  	"application/gml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"gml"
  	]
  },
  	"application/gpx+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"gpx"
  	]
  },
  	"application/gxf": {
  	source: "apache",
  	extensions: [
  		"gxf"
  	]
  },
  	"application/gzip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"gz"
  	]
  },
  	"application/h224": {
  	source: "iana"
  },
  	"application/held+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/hjson": {
  	extensions: [
  		"hjson"
  	]
  },
  	"application/http": {
  	source: "iana"
  },
  	"application/hyperstudio": {
  	source: "iana",
  	extensions: [
  		"stk"
  	]
  },
  	"application/ibe-key-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ibe-pkg-reply+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ibe-pp-data": {
  	source: "iana"
  },
  	"application/iges": {
  	source: "iana"
  },
  	"application/im-iscomposing+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/index": {
  	source: "iana"
  },
  	"application/index.cmd": {
  	source: "iana"
  },
  	"application/index.obj": {
  	source: "iana"
  },
  	"application/index.response": {
  	source: "iana"
  },
  	"application/index.vnd": {
  	source: "iana"
  },
  	"application/inkml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ink",
  		"inkml"
  	]
  },
  	"application/iotp": {
  	source: "iana"
  },
  	"application/ipfix": {
  	source: "iana",
  	extensions: [
  		"ipfix"
  	]
  },
  	"application/ipp": {
  	source: "iana"
  },
  	"application/isup": {
  	source: "iana"
  },
  	"application/its+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"its"
  	]
  },
  	"application/java-archive": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"jar",
  		"war",
  		"ear"
  	]
  },
  	"application/java-serialized-object": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"ser"
  	]
  },
  	"application/java-vm": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"class"
  	]
  },
  	"application/javascript": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"js",
  		"mjs"
  	]
  },
  	"application/jf2feed+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jose": {
  	source: "iana"
  },
  	"application/jose+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jrd+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jscalendar+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"json",
  		"map"
  	]
  },
  	"application/json-patch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/json-seq": {
  	source: "iana"
  },
  	"application/json5": {
  	extensions: [
  		"json5"
  	]
  },
  	"application/jsonml+json": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"jsonml"
  	]
  },
  	"application/jwk+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jwk-set+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/jwt": {
  	source: "iana"
  },
  	"application/kpml-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/kpml-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/ld+json": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"jsonld"
  	]
  },
  	"application/lgr+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lgr"
  	]
  },
  	"application/link-format": {
  	source: "iana"
  },
  	"application/load-control+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/lost+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lostxml"
  	]
  },
  	"application/lostsync+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/lpf+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/lxf": {
  	source: "iana"
  },
  	"application/mac-binhex40": {
  	source: "iana",
  	extensions: [
  		"hqx"
  	]
  },
  	"application/mac-compactpro": {
  	source: "apache",
  	extensions: [
  		"cpt"
  	]
  },
  	"application/macwriteii": {
  	source: "iana"
  },
  	"application/mads+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mads"
  	]
  },
  	"application/manifest+json": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"webmanifest"
  	]
  },
  	"application/marc": {
  	source: "iana",
  	extensions: [
  		"mrc"
  	]
  },
  	"application/marcxml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mrcx"
  	]
  },
  	"application/mathematica": {
  	source: "iana",
  	extensions: [
  		"ma",
  		"nb",
  		"mb"
  	]
  },
  	"application/mathml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mathml"
  	]
  },
  	"application/mathml-content+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mathml-presentation+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-associated-procedure-description+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-deregister+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-envelope+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-msk+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-msk-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-protection-description+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-reception-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-register+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-register-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-schedule+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbms-user-service-description+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mbox": {
  	source: "iana",
  	extensions: [
  		"mbox"
  	]
  },
  	"application/media-policy-dataset+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpf"
  	]
  },
  	"application/media_control+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mediaservercontrol+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mscml"
  	]
  },
  	"application/merge-patch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/metalink+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"metalink"
  	]
  },
  	"application/metalink4+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"meta4"
  	]
  },
  	"application/mets+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mets"
  	]
  },
  	"application/mf4": {
  	source: "iana"
  },
  	"application/mikey": {
  	source: "iana"
  },
  	"application/mipc": {
  	source: "iana"
  },
  	"application/missing-blocks+cbor-seq": {
  	source: "iana"
  },
  	"application/mmt-aei+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"maei"
  	]
  },
  	"application/mmt-usd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"musd"
  	]
  },
  	"application/mods+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mods"
  	]
  },
  	"application/moss-keys": {
  	source: "iana"
  },
  	"application/moss-signature": {
  	source: "iana"
  },
  	"application/mosskey-data": {
  	source: "iana"
  },
  	"application/mosskey-request": {
  	source: "iana"
  },
  	"application/mp21": {
  	source: "iana",
  	extensions: [
  		"m21",
  		"mp21"
  	]
  },
  	"application/mp4": {
  	source: "iana",
  	extensions: [
  		"mp4s",
  		"m4p"
  	]
  },
  	"application/mpeg4-generic": {
  	source: "iana"
  },
  	"application/mpeg4-iod": {
  	source: "iana"
  },
  	"application/mpeg4-iod-xmt": {
  	source: "iana"
  },
  	"application/mrb-consumer+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/mrb-publish+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/msc-ivr+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/msc-mixer+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/msword": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"doc",
  		"dot"
  	]
  },
  	"application/mud+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/multipart-core": {
  	source: "iana"
  },
  	"application/mxf": {
  	source: "iana",
  	extensions: [
  		"mxf"
  	]
  },
  	"application/n-quads": {
  	source: "iana",
  	extensions: [
  		"nq"
  	]
  },
  	"application/n-triples": {
  	source: "iana",
  	extensions: [
  		"nt"
  	]
  },
  	"application/nasdata": {
  	source: "iana"
  },
  	"application/news-checkgroups": {
  	source: "iana",
  	charset: "US-ASCII"
  },
  	"application/news-groupinfo": {
  	source: "iana",
  	charset: "US-ASCII"
  },
  	"application/news-transmission": {
  	source: "iana"
  },
  	"application/nlsml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/node": {
  	source: "iana",
  	extensions: [
  		"cjs"
  	]
  },
  	"application/nss": {
  	source: "iana"
  },
  	"application/oauth-authz-req+jwt": {
  	source: "iana"
  },
  	"application/oblivious-dns-message": {
  	source: "iana"
  },
  	"application/ocsp-request": {
  	source: "iana"
  },
  	"application/ocsp-response": {
  	source: "iana"
  },
  	"application/octet-stream": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"bin",
  		"dms",
  		"lrf",
  		"mar",
  		"so",
  		"dist",
  		"distz",
  		"pkg",
  		"bpk",
  		"dump",
  		"elc",
  		"deploy",
  		"exe",
  		"dll",
  		"deb",
  		"dmg",
  		"iso",
  		"img",
  		"msi",
  		"msp",
  		"msm",
  		"buffer"
  	]
  },
  	"application/oda": {
  	source: "iana",
  	extensions: [
  		"oda"
  	]
  },
  	"application/odm+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/odx": {
  	source: "iana"
  },
  	"application/oebps-package+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"opf"
  	]
  },
  	"application/ogg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ogx"
  	]
  },
  	"application/omdoc+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"omdoc"
  	]
  },
  	"application/onenote": {
  	source: "apache",
  	extensions: [
  		"onetoc",
  		"onetoc2",
  		"onetmp",
  		"onepkg"
  	]
  },
  	"application/opc-nodeset+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/oscore": {
  	source: "iana"
  },
  	"application/oxps": {
  	source: "iana",
  	extensions: [
  		"oxps"
  	]
  },
  	"application/p21": {
  	source: "iana"
  },
  	"application/p21+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/p2p-overlay+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"relo"
  	]
  },
  	"application/parityfec": {
  	source: "iana"
  },
  	"application/passport": {
  	source: "iana"
  },
  	"application/patch-ops-error+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xer"
  	]
  },
  	"application/pdf": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"pdf"
  	]
  },
  	"application/pdx": {
  	source: "iana"
  },
  	"application/pem-certificate-chain": {
  	source: "iana"
  },
  	"application/pgp-encrypted": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"pgp"
  	]
  },
  	"application/pgp-keys": {
  	source: "iana",
  	extensions: [
  		"asc"
  	]
  },
  	"application/pgp-signature": {
  	source: "iana",
  	extensions: [
  		"asc",
  		"sig"
  	]
  },
  	"application/pics-rules": {
  	source: "apache",
  	extensions: [
  		"prf"
  	]
  },
  	"application/pidf+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/pidf-diff+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/pkcs10": {
  	source: "iana",
  	extensions: [
  		"p10"
  	]
  },
  	"application/pkcs12": {
  	source: "iana"
  },
  	"application/pkcs7-mime": {
  	source: "iana",
  	extensions: [
  		"p7m",
  		"p7c"
  	]
  },
  	"application/pkcs7-signature": {
  	source: "iana",
  	extensions: [
  		"p7s"
  	]
  },
  	"application/pkcs8": {
  	source: "iana",
  	extensions: [
  		"p8"
  	]
  },
  	"application/pkcs8-encrypted": {
  	source: "iana"
  },
  	"application/pkix-attr-cert": {
  	source: "iana",
  	extensions: [
  		"ac"
  	]
  },
  	"application/pkix-cert": {
  	source: "iana",
  	extensions: [
  		"cer"
  	]
  },
  	"application/pkix-crl": {
  	source: "iana",
  	extensions: [
  		"crl"
  	]
  },
  	"application/pkix-pkipath": {
  	source: "iana",
  	extensions: [
  		"pkipath"
  	]
  },
  	"application/pkixcmp": {
  	source: "iana",
  	extensions: [
  		"pki"
  	]
  },
  	"application/pls+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"pls"
  	]
  },
  	"application/poc-settings+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/postscript": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ai",
  		"eps",
  		"ps"
  	]
  },
  	"application/ppsp-tracker+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/problem+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/problem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/provenance+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"provx"
  	]
  },
  	"application/prs.alvestrand.titrax-sheet": {
  	source: "iana"
  },
  	"application/prs.cww": {
  	source: "iana",
  	extensions: [
  		"cww"
  	]
  },
  	"application/prs.cyn": {
  	source: "iana",
  	charset: "7-BIT"
  },
  	"application/prs.hpub+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/prs.nprend": {
  	source: "iana"
  },
  	"application/prs.plucker": {
  	source: "iana"
  },
  	"application/prs.rdf-xml-crypt": {
  	source: "iana"
  },
  	"application/prs.xsf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/pskc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"pskcxml"
  	]
  },
  	"application/pvd+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/qsig": {
  	source: "iana"
  },
  	"application/raml+yaml": {
  	compressible: true,
  	extensions: [
  		"raml"
  	]
  },
  	"application/raptorfec": {
  	source: "iana"
  },
  	"application/rdap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/rdf+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rdf",
  		"owl"
  	]
  },
  	"application/reginfo+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rif"
  	]
  },
  	"application/relax-ng-compact-syntax": {
  	source: "iana",
  	extensions: [
  		"rnc"
  	]
  },
  	"application/remote-printing": {
  	source: "iana"
  },
  	"application/reputon+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/resource-lists+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rl"
  	]
  },
  	"application/resource-lists-diff+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rld"
  	]
  },
  	"application/rfc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/riscos": {
  	source: "iana"
  },
  	"application/rlmi+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/rls-services+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rs"
  	]
  },
  	"application/route-apd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rapd"
  	]
  },
  	"application/route-s-tsid+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sls"
  	]
  },
  	"application/route-usd+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rusd"
  	]
  },
  	"application/rpki-ghostbusters": {
  	source: "iana",
  	extensions: [
  		"gbr"
  	]
  },
  	"application/rpki-manifest": {
  	source: "iana",
  	extensions: [
  		"mft"
  	]
  },
  	"application/rpki-publication": {
  	source: "iana"
  },
  	"application/rpki-roa": {
  	source: "iana",
  	extensions: [
  		"roa"
  	]
  },
  	"application/rpki-updown": {
  	source: "iana"
  },
  	"application/rsd+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"rsd"
  	]
  },
  	"application/rss+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"rss"
  	]
  },
  	"application/rtf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rtf"
  	]
  },
  	"application/rtploopback": {
  	source: "iana"
  },
  	"application/rtx": {
  	source: "iana"
  },
  	"application/samlassertion+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/samlmetadata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sarif+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/sarif-external-properties+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/sbe": {
  	source: "iana"
  },
  	"application/sbml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sbml"
  	]
  },
  	"application/scaip+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/scim+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/scvp-cv-request": {
  	source: "iana",
  	extensions: [
  		"scq"
  	]
  },
  	"application/scvp-cv-response": {
  	source: "iana",
  	extensions: [
  		"scs"
  	]
  },
  	"application/scvp-vp-request": {
  	source: "iana",
  	extensions: [
  		"spq"
  	]
  },
  	"application/scvp-vp-response": {
  	source: "iana",
  	extensions: [
  		"spp"
  	]
  },
  	"application/sdp": {
  	source: "iana",
  	extensions: [
  		"sdp"
  	]
  },
  	"application/secevent+jwt": {
  	source: "iana"
  },
  	"application/senml+cbor": {
  	source: "iana"
  },
  	"application/senml+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/senml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"senmlx"
  	]
  },
  	"application/senml-etch+cbor": {
  	source: "iana"
  },
  	"application/senml-etch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/senml-exi": {
  	source: "iana"
  },
  	"application/sensml+cbor": {
  	source: "iana"
  },
  	"application/sensml+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/sensml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sensmlx"
  	]
  },
  	"application/sensml-exi": {
  	source: "iana"
  },
  	"application/sep+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sep-exi": {
  	source: "iana"
  },
  	"application/session-info": {
  	source: "iana"
  },
  	"application/set-payment": {
  	source: "iana"
  },
  	"application/set-payment-initiation": {
  	source: "iana",
  	extensions: [
  		"setpay"
  	]
  },
  	"application/set-registration": {
  	source: "iana"
  },
  	"application/set-registration-initiation": {
  	source: "iana",
  	extensions: [
  		"setreg"
  	]
  },
  	"application/sgml": {
  	source: "iana"
  },
  	"application/sgml-open-catalog": {
  	source: "iana"
  },
  	"application/shf+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"shf"
  	]
  },
  	"application/sieve": {
  	source: "iana",
  	extensions: [
  		"siv",
  		"sieve"
  	]
  },
  	"application/simple-filter+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/simple-message-summary": {
  	source: "iana"
  },
  	"application/simplesymbolcontainer": {
  	source: "iana"
  },
  	"application/sipc": {
  	source: "iana"
  },
  	"application/slate": {
  	source: "iana"
  },
  	"application/smil": {
  	source: "iana"
  },
  	"application/smil+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"smi",
  		"smil"
  	]
  },
  	"application/smpte336m": {
  	source: "iana"
  },
  	"application/soap+fastinfoset": {
  	source: "iana"
  },
  	"application/soap+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sparql-query": {
  	source: "iana",
  	extensions: [
  		"rq"
  	]
  },
  	"application/sparql-results+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"srx"
  	]
  },
  	"application/spdx+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/spirits-event+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/sql": {
  	source: "iana"
  },
  	"application/srgs": {
  	source: "iana",
  	extensions: [
  		"gram"
  	]
  },
  	"application/srgs+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"grxml"
  	]
  },
  	"application/sru+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sru"
  	]
  },
  	"application/ssdl+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"ssdl"
  	]
  },
  	"application/ssml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ssml"
  	]
  },
  	"application/stix+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/swid+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"swidtag"
  	]
  },
  	"application/tamp-apex-update": {
  	source: "iana"
  },
  	"application/tamp-apex-update-confirm": {
  	source: "iana"
  },
  	"application/tamp-community-update": {
  	source: "iana"
  },
  	"application/tamp-community-update-confirm": {
  	source: "iana"
  },
  	"application/tamp-error": {
  	source: "iana"
  },
  	"application/tamp-sequence-adjust": {
  	source: "iana"
  },
  	"application/tamp-sequence-adjust-confirm": {
  	source: "iana"
  },
  	"application/tamp-status-query": {
  	source: "iana"
  },
  	"application/tamp-status-response": {
  	source: "iana"
  },
  	"application/tamp-update": {
  	source: "iana"
  },
  	"application/tamp-update-confirm": {
  	source: "iana"
  },
  	"application/tar": {
  	compressible: true
  },
  	"application/taxii+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/td+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/tei+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"tei",
  		"teicorpus"
  	]
  },
  	"application/tetra_isi": {
  	source: "iana"
  },
  	"application/thraud+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"tfi"
  	]
  },
  	"application/timestamp-query": {
  	source: "iana"
  },
  	"application/timestamp-reply": {
  	source: "iana"
  },
  	"application/timestamped-data": {
  	source: "iana",
  	extensions: [
  		"tsd"
  	]
  },
  	"application/tlsrpt+gzip": {
  	source: "iana"
  },
  	"application/tlsrpt+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/tnauthlist": {
  	source: "iana"
  },
  	"application/token-introspection+jwt": {
  	source: "iana"
  },
  	"application/toml": {
  	compressible: true,
  	extensions: [
  		"toml"
  	]
  },
  	"application/trickle-ice-sdpfrag": {
  	source: "iana"
  },
  	"application/trig": {
  	source: "iana",
  	extensions: [
  		"trig"
  	]
  },
  	"application/ttml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ttml"
  	]
  },
  	"application/tve-trigger": {
  	source: "iana"
  },
  	"application/tzif": {
  	source: "iana"
  },
  	"application/tzif-leap": {
  	source: "iana"
  },
  	"application/ubjson": {
  	compressible: false,
  	extensions: [
  		"ubj"
  	]
  },
  	"application/ulpfec": {
  	source: "iana"
  },
  	"application/urc-grpsheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/urc-ressheet+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rsheet"
  	]
  },
  	"application/urc-targetdesc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"td"
  	]
  },
  	"application/urc-uisocketdesc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vcard+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vcard+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vemmi": {
  	source: "iana"
  },
  	"application/vividence.scriptfile": {
  	source: "apache"
  },
  	"application/vnd.1000minds.decision-model+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"1km"
  	]
  },
  	"application/vnd.3gpp-prose+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp-prose-pc3ch+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp-v2x-local-service-information": {
  	source: "iana"
  },
  	"application/vnd.3gpp.5gnas": {
  	source: "iana"
  },
  	"application/vnd.3gpp.access-transfer-events+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.bsf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.gmop+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.gtpc": {
  	source: "iana"
  },
  	"application/vnd.3gpp.interworking-data": {
  	source: "iana"
  },
  	"application/vnd.3gpp.lpp": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mc-signalling-ear": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mcdata-affiliation-command+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-payload": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mcdata-service-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-signalling": {
  	source: "iana"
  },
  	"application/vnd.3gpp.mcdata-ue-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcdata-user-profile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-affiliation-command+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-floor-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-location-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-service-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-signed+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-ue-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-ue-init-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcptt-user-profile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-location-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-service-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-transmission-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-ue-config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mcvideo-user-profile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.mid-call+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.ngap": {
  	source: "iana"
  },
  	"application/vnd.3gpp.pfcp": {
  	source: "iana"
  },
  	"application/vnd.3gpp.pic-bw-large": {
  	source: "iana",
  	extensions: [
  		"plb"
  	]
  },
  	"application/vnd.3gpp.pic-bw-small": {
  	source: "iana",
  	extensions: [
  		"psb"
  	]
  },
  	"application/vnd.3gpp.pic-bw-var": {
  	source: "iana",
  	extensions: [
  		"pvb"
  	]
  },
  	"application/vnd.3gpp.s1ap": {
  	source: "iana"
  },
  	"application/vnd.3gpp.sms": {
  	source: "iana"
  },
  	"application/vnd.3gpp.sms+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.srvcc-ext+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.srvcc-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.state-and-event-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp.ussd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp2.bcmcsinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.3gpp2.sms": {
  	source: "iana"
  },
  	"application/vnd.3gpp2.tcap": {
  	source: "iana",
  	extensions: [
  		"tcap"
  	]
  },
  	"application/vnd.3lightssoftware.imagescal": {
  	source: "iana"
  },
  	"application/vnd.3m.post-it-notes": {
  	source: "iana",
  	extensions: [
  		"pwn"
  	]
  },
  	"application/vnd.accpac.simply.aso": {
  	source: "iana",
  	extensions: [
  		"aso"
  	]
  },
  	"application/vnd.accpac.simply.imp": {
  	source: "iana",
  	extensions: [
  		"imp"
  	]
  },
  	"application/vnd.acucobol": {
  	source: "iana",
  	extensions: [
  		"acu"
  	]
  },
  	"application/vnd.acucorp": {
  	source: "iana",
  	extensions: [
  		"atc",
  		"acutc"
  	]
  },
  	"application/vnd.adobe.air-application-installer-package+zip": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"air"
  	]
  },
  	"application/vnd.adobe.flash.movie": {
  	source: "iana"
  },
  	"application/vnd.adobe.formscentral.fcdt": {
  	source: "iana",
  	extensions: [
  		"fcdt"
  	]
  },
  	"application/vnd.adobe.fxp": {
  	source: "iana",
  	extensions: [
  		"fxp",
  		"fxpl"
  	]
  },
  	"application/vnd.adobe.partial-upload": {
  	source: "iana"
  },
  	"application/vnd.adobe.xdp+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xdp"
  	]
  },
  	"application/vnd.adobe.xfdf": {
  	source: "iana",
  	extensions: [
  		"xfdf"
  	]
  },
  	"application/vnd.aether.imp": {
  	source: "iana"
  },
  	"application/vnd.afpc.afplinedata": {
  	source: "iana"
  },
  	"application/vnd.afpc.afplinedata-pagedef": {
  	source: "iana"
  },
  	"application/vnd.afpc.cmoca-cmresource": {
  	source: "iana"
  },
  	"application/vnd.afpc.foca-charset": {
  	source: "iana"
  },
  	"application/vnd.afpc.foca-codedfont": {
  	source: "iana"
  },
  	"application/vnd.afpc.foca-codepage": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-cmtable": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-formdef": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-mediummap": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-objectcontainer": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-overlay": {
  	source: "iana"
  },
  	"application/vnd.afpc.modca-pagesegment": {
  	source: "iana"
  },
  	"application/vnd.age": {
  	source: "iana",
  	extensions: [
  		"age"
  	]
  },
  	"application/vnd.ah-barcode": {
  	source: "iana"
  },
  	"application/vnd.ahead.space": {
  	source: "iana",
  	extensions: [
  		"ahead"
  	]
  },
  	"application/vnd.airzip.filesecure.azf": {
  	source: "iana",
  	extensions: [
  		"azf"
  	]
  },
  	"application/vnd.airzip.filesecure.azs": {
  	source: "iana",
  	extensions: [
  		"azs"
  	]
  },
  	"application/vnd.amadeus+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.amazon.ebook": {
  	source: "apache",
  	extensions: [
  		"azw"
  	]
  },
  	"application/vnd.amazon.mobi8-ebook": {
  	source: "iana"
  },
  	"application/vnd.americandynamics.acc": {
  	source: "iana",
  	extensions: [
  		"acc"
  	]
  },
  	"application/vnd.amiga.ami": {
  	source: "iana",
  	extensions: [
  		"ami"
  	]
  },
  	"application/vnd.amundsen.maze+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.android.ota": {
  	source: "iana"
  },
  	"application/vnd.android.package-archive": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"apk"
  	]
  },
  	"application/vnd.anki": {
  	source: "iana"
  },
  	"application/vnd.anser-web-certificate-issue-initiation": {
  	source: "iana",
  	extensions: [
  		"cii"
  	]
  },
  	"application/vnd.anser-web-funds-transfer-initiation": {
  	source: "apache",
  	extensions: [
  		"fti"
  	]
  },
  	"application/vnd.antix.game-component": {
  	source: "iana",
  	extensions: [
  		"atx"
  	]
  },
  	"application/vnd.apache.arrow.file": {
  	source: "iana"
  },
  	"application/vnd.apache.arrow.stream": {
  	source: "iana"
  },
  	"application/vnd.apache.thrift.binary": {
  	source: "iana"
  },
  	"application/vnd.apache.thrift.compact": {
  	source: "iana"
  },
  	"application/vnd.apache.thrift.json": {
  	source: "iana"
  },
  	"application/vnd.api+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.aplextor.warrp+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.apothekende.reservation+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.apple.installer+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mpkg"
  	]
  },
  	"application/vnd.apple.keynote": {
  	source: "iana",
  	extensions: [
  		"key"
  	]
  },
  	"application/vnd.apple.mpegurl": {
  	source: "iana",
  	extensions: [
  		"m3u8"
  	]
  },
  	"application/vnd.apple.numbers": {
  	source: "iana",
  	extensions: [
  		"numbers"
  	]
  },
  	"application/vnd.apple.pages": {
  	source: "iana",
  	extensions: [
  		"pages"
  	]
  },
  	"application/vnd.apple.pkpass": {
  	compressible: false,
  	extensions: [
  		"pkpass"
  	]
  },
  	"application/vnd.arastra.swi": {
  	source: "iana"
  },
  	"application/vnd.aristanetworks.swi": {
  	source: "iana",
  	extensions: [
  		"swi"
  	]
  },
  	"application/vnd.artisan+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.artsquare": {
  	source: "iana"
  },
  	"application/vnd.astraea-software.iota": {
  	source: "iana",
  	extensions: [
  		"iota"
  	]
  },
  	"application/vnd.audiograph": {
  	source: "iana",
  	extensions: [
  		"aep"
  	]
  },
  	"application/vnd.autopackage": {
  	source: "iana"
  },
  	"application/vnd.avalon+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.avistar+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.balsamiq.bmml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"bmml"
  	]
  },
  	"application/vnd.balsamiq.bmpr": {
  	source: "iana"
  },
  	"application/vnd.banana-accounting": {
  	source: "iana"
  },
  	"application/vnd.bbf.usp.error": {
  	source: "iana"
  },
  	"application/vnd.bbf.usp.msg": {
  	source: "iana"
  },
  	"application/vnd.bbf.usp.msg+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.bekitzur-stech+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.bint.med-content": {
  	source: "iana"
  },
  	"application/vnd.biopax.rdf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.blink-idb-value-wrapper": {
  	source: "iana"
  },
  	"application/vnd.blueice.multipass": {
  	source: "iana",
  	extensions: [
  		"mpm"
  	]
  },
  	"application/vnd.bluetooth.ep.oob": {
  	source: "iana"
  },
  	"application/vnd.bluetooth.le.oob": {
  	source: "iana"
  },
  	"application/vnd.bmi": {
  	source: "iana",
  	extensions: [
  		"bmi"
  	]
  },
  	"application/vnd.bpf": {
  	source: "iana"
  },
  	"application/vnd.bpf3": {
  	source: "iana"
  },
  	"application/vnd.businessobjects": {
  	source: "iana",
  	extensions: [
  		"rep"
  	]
  },
  	"application/vnd.byu.uapi+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cab-jscript": {
  	source: "iana"
  },
  	"application/vnd.canon-cpdl": {
  	source: "iana"
  },
  	"application/vnd.canon-lips": {
  	source: "iana"
  },
  	"application/vnd.capasystems-pg+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cendio.thinlinc.clientconf": {
  	source: "iana"
  },
  	"application/vnd.century-systems.tcp_stream": {
  	source: "iana"
  },
  	"application/vnd.chemdraw+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"cdxml"
  	]
  },
  	"application/vnd.chess-pgn": {
  	source: "iana"
  },
  	"application/vnd.chipnuts.karaoke-mmd": {
  	source: "iana",
  	extensions: [
  		"mmd"
  	]
  },
  	"application/vnd.ciedi": {
  	source: "iana"
  },
  	"application/vnd.cinderella": {
  	source: "iana",
  	extensions: [
  		"cdy"
  	]
  },
  	"application/vnd.cirpack.isdn-ext": {
  	source: "iana"
  },
  	"application/vnd.citationstyles.style+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"csl"
  	]
  },
  	"application/vnd.claymore": {
  	source: "iana",
  	extensions: [
  		"cla"
  	]
  },
  	"application/vnd.cloanto.rp9": {
  	source: "iana",
  	extensions: [
  		"rp9"
  	]
  },
  	"application/vnd.clonk.c4group": {
  	source: "iana",
  	extensions: [
  		"c4g",
  		"c4d",
  		"c4f",
  		"c4p",
  		"c4u"
  	]
  },
  	"application/vnd.cluetrust.cartomobile-config": {
  	source: "iana",
  	extensions: [
  		"c11amc"
  	]
  },
  	"application/vnd.cluetrust.cartomobile-config-pkg": {
  	source: "iana",
  	extensions: [
  		"c11amz"
  	]
  },
  	"application/vnd.coffeescript": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.document": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.document-template": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.presentation": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.presentation-template": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.spreadsheet": {
  	source: "iana"
  },
  	"application/vnd.collabio.xodocuments.spreadsheet-template": {
  	source: "iana"
  },
  	"application/vnd.collection+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.collection.doc+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.collection.next+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.comicbook+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.comicbook-rar": {
  	source: "iana"
  },
  	"application/vnd.commerce-battelle": {
  	source: "iana"
  },
  	"application/vnd.commonspace": {
  	source: "iana",
  	extensions: [
  		"csp"
  	]
  },
  	"application/vnd.contact.cmsg": {
  	source: "iana",
  	extensions: [
  		"cdbcmsg"
  	]
  },
  	"application/vnd.coreos.ignition+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cosmocaller": {
  	source: "iana",
  	extensions: [
  		"cmc"
  	]
  },
  	"application/vnd.crick.clicker": {
  	source: "iana",
  	extensions: [
  		"clkx"
  	]
  },
  	"application/vnd.crick.clicker.keyboard": {
  	source: "iana",
  	extensions: [
  		"clkk"
  	]
  },
  	"application/vnd.crick.clicker.palette": {
  	source: "iana",
  	extensions: [
  		"clkp"
  	]
  },
  	"application/vnd.crick.clicker.template": {
  	source: "iana",
  	extensions: [
  		"clkt"
  	]
  },
  	"application/vnd.crick.clicker.wordbank": {
  	source: "iana",
  	extensions: [
  		"clkw"
  	]
  },
  	"application/vnd.criticaltools.wbs+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wbs"
  	]
  },
  	"application/vnd.cryptii.pipe+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.crypto-shade-file": {
  	source: "iana"
  },
  	"application/vnd.cryptomator.encrypted": {
  	source: "iana"
  },
  	"application/vnd.cryptomator.vault": {
  	source: "iana"
  },
  	"application/vnd.ctc-posml": {
  	source: "iana",
  	extensions: [
  		"pml"
  	]
  },
  	"application/vnd.ctct.ws+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cups-pdf": {
  	source: "iana"
  },
  	"application/vnd.cups-postscript": {
  	source: "iana"
  },
  	"application/vnd.cups-ppd": {
  	source: "iana",
  	extensions: [
  		"ppd"
  	]
  },
  	"application/vnd.cups-raster": {
  	source: "iana"
  },
  	"application/vnd.cups-raw": {
  	source: "iana"
  },
  	"application/vnd.curl": {
  	source: "iana"
  },
  	"application/vnd.curl.car": {
  	source: "apache",
  	extensions: [
  		"car"
  	]
  },
  	"application/vnd.curl.pcurl": {
  	source: "apache",
  	extensions: [
  		"pcurl"
  	]
  },
  	"application/vnd.cyan.dean.root+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cybank": {
  	source: "iana"
  },
  	"application/vnd.cyclonedx+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.cyclonedx+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.d2l.coursepackage1p0+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.d3m-dataset": {
  	source: "iana"
  },
  	"application/vnd.d3m-problem": {
  	source: "iana"
  },
  	"application/vnd.dart": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dart"
  	]
  },
  	"application/vnd.data-vision.rdz": {
  	source: "iana",
  	extensions: [
  		"rdz"
  	]
  },
  	"application/vnd.datapackage+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dataresource+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dbf": {
  	source: "iana",
  	extensions: [
  		"dbf"
  	]
  },
  	"application/vnd.debian.binary-package": {
  	source: "iana"
  },
  	"application/vnd.dece.data": {
  	source: "iana",
  	extensions: [
  		"uvf",
  		"uvvf",
  		"uvd",
  		"uvvd"
  	]
  },
  	"application/vnd.dece.ttml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"uvt",
  		"uvvt"
  	]
  },
  	"application/vnd.dece.unspecified": {
  	source: "iana",
  	extensions: [
  		"uvx",
  		"uvvx"
  	]
  },
  	"application/vnd.dece.zip": {
  	source: "iana",
  	extensions: [
  		"uvz",
  		"uvvz"
  	]
  },
  	"application/vnd.denovo.fcselayout-link": {
  	source: "iana",
  	extensions: [
  		"fe_launch"
  	]
  },
  	"application/vnd.desmume.movie": {
  	source: "iana"
  },
  	"application/vnd.dir-bi.plate-dl-nosuffix": {
  	source: "iana"
  },
  	"application/vnd.dm.delegation+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dna": {
  	source: "iana",
  	extensions: [
  		"dna"
  	]
  },
  	"application/vnd.document+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dolby.mlp": {
  	source: "apache",
  	extensions: [
  		"mlp"
  	]
  },
  	"application/vnd.dolby.mobile.1": {
  	source: "iana"
  },
  	"application/vnd.dolby.mobile.2": {
  	source: "iana"
  },
  	"application/vnd.doremir.scorecloud-binary-document": {
  	source: "iana"
  },
  	"application/vnd.dpgraph": {
  	source: "iana",
  	extensions: [
  		"dpg"
  	]
  },
  	"application/vnd.dreamfactory": {
  	source: "iana",
  	extensions: [
  		"dfac"
  	]
  },
  	"application/vnd.drive+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ds-keypoint": {
  	source: "apache",
  	extensions: [
  		"kpxx"
  	]
  },
  	"application/vnd.dtg.local": {
  	source: "iana"
  },
  	"application/vnd.dtg.local.flash": {
  	source: "iana"
  },
  	"application/vnd.dtg.local.html": {
  	source: "iana"
  },
  	"application/vnd.dvb.ait": {
  	source: "iana",
  	extensions: [
  		"ait"
  	]
  },
  	"application/vnd.dvb.dvbisl+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.dvbj": {
  	source: "iana"
  },
  	"application/vnd.dvb.esgcontainer": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcdftnotifaccess": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcesgaccess": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcesgaccess2": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcesgpdd": {
  	source: "iana"
  },
  	"application/vnd.dvb.ipdcroaming": {
  	source: "iana"
  },
  	"application/vnd.dvb.iptv.alfec-base": {
  	source: "iana"
  },
  	"application/vnd.dvb.iptv.alfec-enhancement": {
  	source: "iana"
  },
  	"application/vnd.dvb.notif-aggregate-root+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-container+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-generic+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-ia-msglist+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-ia-registration-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-ia-registration-response+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.notif-init+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.dvb.pfr": {
  	source: "iana"
  },
  	"application/vnd.dvb.service": {
  	source: "iana",
  	extensions: [
  		"svc"
  	]
  },
  	"application/vnd.dxr": {
  	source: "iana"
  },
  	"application/vnd.dynageo": {
  	source: "iana",
  	extensions: [
  		"geo"
  	]
  },
  	"application/vnd.dzr": {
  	source: "iana"
  },
  	"application/vnd.easykaraoke.cdgdownload": {
  	source: "iana"
  },
  	"application/vnd.ecdis-update": {
  	source: "iana"
  },
  	"application/vnd.ecip.rlp": {
  	source: "iana"
  },
  	"application/vnd.eclipse.ditto+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ecowin.chart": {
  	source: "iana",
  	extensions: [
  		"mag"
  	]
  },
  	"application/vnd.ecowin.filerequest": {
  	source: "iana"
  },
  	"application/vnd.ecowin.fileupdate": {
  	source: "iana"
  },
  	"application/vnd.ecowin.series": {
  	source: "iana"
  },
  	"application/vnd.ecowin.seriesrequest": {
  	source: "iana"
  },
  	"application/vnd.ecowin.seriesupdate": {
  	source: "iana"
  },
  	"application/vnd.efi.img": {
  	source: "iana"
  },
  	"application/vnd.efi.iso": {
  	source: "iana"
  },
  	"application/vnd.emclient.accessrequest+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.enliven": {
  	source: "iana",
  	extensions: [
  		"nml"
  	]
  },
  	"application/vnd.enphase.envoy": {
  	source: "iana"
  },
  	"application/vnd.eprints.data+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.epson.esf": {
  	source: "iana",
  	extensions: [
  		"esf"
  	]
  },
  	"application/vnd.epson.msf": {
  	source: "iana",
  	extensions: [
  		"msf"
  	]
  },
  	"application/vnd.epson.quickanime": {
  	source: "iana",
  	extensions: [
  		"qam"
  	]
  },
  	"application/vnd.epson.salt": {
  	source: "iana",
  	extensions: [
  		"slt"
  	]
  },
  	"application/vnd.epson.ssf": {
  	source: "iana",
  	extensions: [
  		"ssf"
  	]
  },
  	"application/vnd.ericsson.quickcall": {
  	source: "iana"
  },
  	"application/vnd.espass-espass+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.eszigno3+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"es3",
  		"et3"
  	]
  },
  	"application/vnd.etsi.aoc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.asic-e+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.etsi.asic-s+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.etsi.cug+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvcommand+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvdiscovery+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsad-bc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsad-cod+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsad-npvr+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvservice+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvsync+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.iptvueprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.mcid+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.mheg5": {
  	source: "iana"
  },
  	"application/vnd.etsi.overload-control-policy-dataset+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.pstn+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.sci+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.simservs+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.timestamp-token": {
  	source: "iana"
  },
  	"application/vnd.etsi.tsl+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.etsi.tsl.der": {
  	source: "iana"
  },
  	"application/vnd.eu.kasparian.car+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.eudora.data": {
  	source: "iana"
  },
  	"application/vnd.evolv.ecig.profile": {
  	source: "iana"
  },
  	"application/vnd.evolv.ecig.settings": {
  	source: "iana"
  },
  	"application/vnd.evolv.ecig.theme": {
  	source: "iana"
  },
  	"application/vnd.exstream-empower+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.exstream-package": {
  	source: "iana"
  },
  	"application/vnd.ezpix-album": {
  	source: "iana",
  	extensions: [
  		"ez2"
  	]
  },
  	"application/vnd.ezpix-package": {
  	source: "iana",
  	extensions: [
  		"ez3"
  	]
  },
  	"application/vnd.f-secure.mobile": {
  	source: "iana"
  },
  	"application/vnd.familysearch.gedcom+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.fastcopy-disk-image": {
  	source: "iana"
  },
  	"application/vnd.fdf": {
  	source: "iana",
  	extensions: [
  		"fdf"
  	]
  },
  	"application/vnd.fdsn.mseed": {
  	source: "iana",
  	extensions: [
  		"mseed"
  	]
  },
  	"application/vnd.fdsn.seed": {
  	source: "iana",
  	extensions: [
  		"seed",
  		"dataless"
  	]
  },
  	"application/vnd.ffsns": {
  	source: "iana"
  },
  	"application/vnd.ficlab.flb+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.filmit.zfc": {
  	source: "iana"
  },
  	"application/vnd.fints": {
  	source: "iana"
  },
  	"application/vnd.firemonkeys.cloudcell": {
  	source: "iana"
  },
  	"application/vnd.flographit": {
  	source: "iana",
  	extensions: [
  		"gph"
  	]
  },
  	"application/vnd.fluxtime.clip": {
  	source: "iana",
  	extensions: [
  		"ftc"
  	]
  },
  	"application/vnd.font-fontforge-sfd": {
  	source: "iana"
  },
  	"application/vnd.framemaker": {
  	source: "iana",
  	extensions: [
  		"fm",
  		"frame",
  		"maker",
  		"book"
  	]
  },
  	"application/vnd.frogans.fnc": {
  	source: "iana",
  	extensions: [
  		"fnc"
  	]
  },
  	"application/vnd.frogans.ltf": {
  	source: "iana",
  	extensions: [
  		"ltf"
  	]
  },
  	"application/vnd.fsc.weblaunch": {
  	source: "iana",
  	extensions: [
  		"fsc"
  	]
  },
  	"application/vnd.fujifilm.fb.docuworks": {
  	source: "iana"
  },
  	"application/vnd.fujifilm.fb.docuworks.binder": {
  	source: "iana"
  },
  	"application/vnd.fujifilm.fb.docuworks.container": {
  	source: "iana"
  },
  	"application/vnd.fujifilm.fb.jfi+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.fujitsu.oasys": {
  	source: "iana",
  	extensions: [
  		"oas"
  	]
  },
  	"application/vnd.fujitsu.oasys2": {
  	source: "iana",
  	extensions: [
  		"oa2"
  	]
  },
  	"application/vnd.fujitsu.oasys3": {
  	source: "iana",
  	extensions: [
  		"oa3"
  	]
  },
  	"application/vnd.fujitsu.oasysgp": {
  	source: "iana",
  	extensions: [
  		"fg5"
  	]
  },
  	"application/vnd.fujitsu.oasysprs": {
  	source: "iana",
  	extensions: [
  		"bh2"
  	]
  },
  	"application/vnd.fujixerox.art-ex": {
  	source: "iana"
  },
  	"application/vnd.fujixerox.art4": {
  	source: "iana"
  },
  	"application/vnd.fujixerox.ddd": {
  	source: "iana",
  	extensions: [
  		"ddd"
  	]
  },
  	"application/vnd.fujixerox.docuworks": {
  	source: "iana",
  	extensions: [
  		"xdw"
  	]
  },
  	"application/vnd.fujixerox.docuworks.binder": {
  	source: "iana",
  	extensions: [
  		"xbd"
  	]
  },
  	"application/vnd.fujixerox.docuworks.container": {
  	source: "iana"
  },
  	"application/vnd.fujixerox.hbpl": {
  	source: "iana"
  },
  	"application/vnd.fut-misnet": {
  	source: "iana"
  },
  	"application/vnd.futoin+cbor": {
  	source: "iana"
  },
  	"application/vnd.futoin+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.fuzzysheet": {
  	source: "iana",
  	extensions: [
  		"fzs"
  	]
  },
  	"application/vnd.genomatix.tuxedo": {
  	source: "iana",
  	extensions: [
  		"txd"
  	]
  },
  	"application/vnd.gentics.grd+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.geo+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.geocube+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.geogebra.file": {
  	source: "iana",
  	extensions: [
  		"ggb"
  	]
  },
  	"application/vnd.geogebra.slides": {
  	source: "iana"
  },
  	"application/vnd.geogebra.tool": {
  	source: "iana",
  	extensions: [
  		"ggt"
  	]
  },
  	"application/vnd.geometry-explorer": {
  	source: "iana",
  	extensions: [
  		"gex",
  		"gre"
  	]
  },
  	"application/vnd.geonext": {
  	source: "iana",
  	extensions: [
  		"gxt"
  	]
  },
  	"application/vnd.geoplan": {
  	source: "iana",
  	extensions: [
  		"g2w"
  	]
  },
  	"application/vnd.geospace": {
  	source: "iana",
  	extensions: [
  		"g3w"
  	]
  },
  	"application/vnd.gerber": {
  	source: "iana"
  },
  	"application/vnd.globalplatform.card-content-mgt": {
  	source: "iana"
  },
  	"application/vnd.globalplatform.card-content-mgt-response": {
  	source: "iana"
  },
  	"application/vnd.gmx": {
  	source: "iana",
  	extensions: [
  		"gmx"
  	]
  },
  	"application/vnd.google-apps.document": {
  	compressible: false,
  	extensions: [
  		"gdoc"
  	]
  },
  	"application/vnd.google-apps.presentation": {
  	compressible: false,
  	extensions: [
  		"gslides"
  	]
  },
  	"application/vnd.google-apps.spreadsheet": {
  	compressible: false,
  	extensions: [
  		"gsheet"
  	]
  },
  	"application/vnd.google-earth.kml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"kml"
  	]
  },
  	"application/vnd.google-earth.kmz": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"kmz"
  	]
  },
  	"application/vnd.gov.sk.e-form+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.gov.sk.e-form+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.gov.sk.xmldatacontainer+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.grafeq": {
  	source: "iana",
  	extensions: [
  		"gqf",
  		"gqs"
  	]
  },
  	"application/vnd.gridmp": {
  	source: "iana"
  },
  	"application/vnd.groove-account": {
  	source: "iana",
  	extensions: [
  		"gac"
  	]
  },
  	"application/vnd.groove-help": {
  	source: "iana",
  	extensions: [
  		"ghf"
  	]
  },
  	"application/vnd.groove-identity-message": {
  	source: "iana",
  	extensions: [
  		"gim"
  	]
  },
  	"application/vnd.groove-injector": {
  	source: "iana",
  	extensions: [
  		"grv"
  	]
  },
  	"application/vnd.groove-tool-message": {
  	source: "iana",
  	extensions: [
  		"gtm"
  	]
  },
  	"application/vnd.groove-tool-template": {
  	source: "iana",
  	extensions: [
  		"tpl"
  	]
  },
  	"application/vnd.groove-vcard": {
  	source: "iana",
  	extensions: [
  		"vcg"
  	]
  },
  	"application/vnd.hal+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hal+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"hal"
  	]
  },
  	"application/vnd.handheld-entertainment+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"zmm"
  	]
  },
  	"application/vnd.hbci": {
  	source: "iana",
  	extensions: [
  		"hbci"
  	]
  },
  	"application/vnd.hc+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hcl-bireports": {
  	source: "iana"
  },
  	"application/vnd.hdt": {
  	source: "iana"
  },
  	"application/vnd.heroku+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hhe.lesson-player": {
  	source: "iana",
  	extensions: [
  		"les"
  	]
  },
  	"application/vnd.hl7cda+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.hl7v2+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.hp-hpgl": {
  	source: "iana",
  	extensions: [
  		"hpgl"
  	]
  },
  	"application/vnd.hp-hpid": {
  	source: "iana",
  	extensions: [
  		"hpid"
  	]
  },
  	"application/vnd.hp-hps": {
  	source: "iana",
  	extensions: [
  		"hps"
  	]
  },
  	"application/vnd.hp-jlyt": {
  	source: "iana",
  	extensions: [
  		"jlt"
  	]
  },
  	"application/vnd.hp-pcl": {
  	source: "iana",
  	extensions: [
  		"pcl"
  	]
  },
  	"application/vnd.hp-pclxl": {
  	source: "iana",
  	extensions: [
  		"pclxl"
  	]
  },
  	"application/vnd.httphone": {
  	source: "iana"
  },
  	"application/vnd.hydrostatix.sof-data": {
  	source: "iana",
  	extensions: [
  		"sfd-hdstx"
  	]
  },
  	"application/vnd.hyper+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hyper-item+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hyperdrive+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.hzn-3d-crossword": {
  	source: "iana"
  },
  	"application/vnd.ibm.afplinedata": {
  	source: "iana"
  },
  	"application/vnd.ibm.electronic-media": {
  	source: "iana"
  },
  	"application/vnd.ibm.minipay": {
  	source: "iana",
  	extensions: [
  		"mpy"
  	]
  },
  	"application/vnd.ibm.modcap": {
  	source: "iana",
  	extensions: [
  		"afp",
  		"listafp",
  		"list3820"
  	]
  },
  	"application/vnd.ibm.rights-management": {
  	source: "iana",
  	extensions: [
  		"irm"
  	]
  },
  	"application/vnd.ibm.secure-container": {
  	source: "iana",
  	extensions: [
  		"sc"
  	]
  },
  	"application/vnd.iccprofile": {
  	source: "iana",
  	extensions: [
  		"icc",
  		"icm"
  	]
  },
  	"application/vnd.ieee.1905": {
  	source: "iana"
  },
  	"application/vnd.igloader": {
  	source: "iana",
  	extensions: [
  		"igl"
  	]
  },
  	"application/vnd.imagemeter.folder+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.imagemeter.image+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.immervision-ivp": {
  	source: "iana",
  	extensions: [
  		"ivp"
  	]
  },
  	"application/vnd.immervision-ivu": {
  	source: "iana",
  	extensions: [
  		"ivu"
  	]
  },
  	"application/vnd.ims.imsccv1p1": {
  	source: "iana"
  },
  	"application/vnd.ims.imsccv1p2": {
  	source: "iana"
  },
  	"application/vnd.ims.imsccv1p3": {
  	source: "iana"
  },
  	"application/vnd.ims.lis.v2.result+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolproxy+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolproxy.id+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolsettings+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ims.lti.v2.toolsettings.simple+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.informedcontrol.rms+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.informix-visionary": {
  	source: "iana"
  },
  	"application/vnd.infotech.project": {
  	source: "iana"
  },
  	"application/vnd.infotech.project+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.innopath.wamp.notification": {
  	source: "iana"
  },
  	"application/vnd.insors.igm": {
  	source: "iana",
  	extensions: [
  		"igm"
  	]
  },
  	"application/vnd.intercon.formnet": {
  	source: "iana",
  	extensions: [
  		"xpw",
  		"xpx"
  	]
  },
  	"application/vnd.intergeo": {
  	source: "iana",
  	extensions: [
  		"i2g"
  	]
  },
  	"application/vnd.intertrust.digibox": {
  	source: "iana"
  },
  	"application/vnd.intertrust.nncp": {
  	source: "iana"
  },
  	"application/vnd.intu.qbo": {
  	source: "iana",
  	extensions: [
  		"qbo"
  	]
  },
  	"application/vnd.intu.qfx": {
  	source: "iana",
  	extensions: [
  		"qfx"
  	]
  },
  	"application/vnd.iptc.g2.catalogitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.conceptitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.knowledgeitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.newsitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.newsmessage+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.packageitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.iptc.g2.planningitem+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ipunplugged.rcprofile": {
  	source: "iana",
  	extensions: [
  		"rcprofile"
  	]
  },
  	"application/vnd.irepository.package+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"irp"
  	]
  },
  	"application/vnd.is-xpr": {
  	source: "iana",
  	extensions: [
  		"xpr"
  	]
  },
  	"application/vnd.isac.fcs": {
  	source: "iana",
  	extensions: [
  		"fcs"
  	]
  },
  	"application/vnd.iso11783-10+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.jam": {
  	source: "iana",
  	extensions: [
  		"jam"
  	]
  },
  	"application/vnd.japannet-directory-service": {
  	source: "iana"
  },
  	"application/vnd.japannet-jpnstore-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-payment-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-registration": {
  	source: "iana"
  },
  	"application/vnd.japannet-registration-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-setstore-wakeup": {
  	source: "iana"
  },
  	"application/vnd.japannet-verification": {
  	source: "iana"
  },
  	"application/vnd.japannet-verification-wakeup": {
  	source: "iana"
  },
  	"application/vnd.jcp.javame.midlet-rms": {
  	source: "iana",
  	extensions: [
  		"rms"
  	]
  },
  	"application/vnd.jisp": {
  	source: "iana",
  	extensions: [
  		"jisp"
  	]
  },
  	"application/vnd.joost.joda-archive": {
  	source: "iana",
  	extensions: [
  		"joda"
  	]
  },
  	"application/vnd.jsk.isdn-ngn": {
  	source: "iana"
  },
  	"application/vnd.kahootz": {
  	source: "iana",
  	extensions: [
  		"ktz",
  		"ktr"
  	]
  },
  	"application/vnd.kde.karbon": {
  	source: "iana",
  	extensions: [
  		"karbon"
  	]
  },
  	"application/vnd.kde.kchart": {
  	source: "iana",
  	extensions: [
  		"chrt"
  	]
  },
  	"application/vnd.kde.kformula": {
  	source: "iana",
  	extensions: [
  		"kfo"
  	]
  },
  	"application/vnd.kde.kivio": {
  	source: "iana",
  	extensions: [
  		"flw"
  	]
  },
  	"application/vnd.kde.kontour": {
  	source: "iana",
  	extensions: [
  		"kon"
  	]
  },
  	"application/vnd.kde.kpresenter": {
  	source: "iana",
  	extensions: [
  		"kpr",
  		"kpt"
  	]
  },
  	"application/vnd.kde.kspread": {
  	source: "iana",
  	extensions: [
  		"ksp"
  	]
  },
  	"application/vnd.kde.kword": {
  	source: "iana",
  	extensions: [
  		"kwd",
  		"kwt"
  	]
  },
  	"application/vnd.kenameaapp": {
  	source: "iana",
  	extensions: [
  		"htke"
  	]
  },
  	"application/vnd.kidspiration": {
  	source: "iana",
  	extensions: [
  		"kia"
  	]
  },
  	"application/vnd.kinar": {
  	source: "iana",
  	extensions: [
  		"kne",
  		"knp"
  	]
  },
  	"application/vnd.koan": {
  	source: "iana",
  	extensions: [
  		"skp",
  		"skd",
  		"skt",
  		"skm"
  	]
  },
  	"application/vnd.kodak-descriptor": {
  	source: "iana",
  	extensions: [
  		"sse"
  	]
  },
  	"application/vnd.las": {
  	source: "iana"
  },
  	"application/vnd.las.las+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.las.las+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lasxml"
  	]
  },
  	"application/vnd.laszip": {
  	source: "iana"
  },
  	"application/vnd.leap+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.liberty-request+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.llamagraphics.life-balance.desktop": {
  	source: "iana",
  	extensions: [
  		"lbd"
  	]
  },
  	"application/vnd.llamagraphics.life-balance.exchange+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"lbe"
  	]
  },
  	"application/vnd.logipipe.circuit+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.loom": {
  	source: "iana"
  },
  	"application/vnd.lotus-1-2-3": {
  	source: "iana",
  	extensions: [
  		"123"
  	]
  },
  	"application/vnd.lotus-approach": {
  	source: "iana",
  	extensions: [
  		"apr"
  	]
  },
  	"application/vnd.lotus-freelance": {
  	source: "iana",
  	extensions: [
  		"pre"
  	]
  },
  	"application/vnd.lotus-notes": {
  	source: "iana",
  	extensions: [
  		"nsf"
  	]
  },
  	"application/vnd.lotus-organizer": {
  	source: "iana",
  	extensions: [
  		"org"
  	]
  },
  	"application/vnd.lotus-screencam": {
  	source: "iana",
  	extensions: [
  		"scm"
  	]
  },
  	"application/vnd.lotus-wordpro": {
  	source: "iana",
  	extensions: [
  		"lwp"
  	]
  },
  	"application/vnd.macports.portpkg": {
  	source: "iana",
  	extensions: [
  		"portpkg"
  	]
  },
  	"application/vnd.mapbox-vector-tile": {
  	source: "iana",
  	extensions: [
  		"mvt"
  	]
  },
  	"application/vnd.marlin.drm.actiontoken+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.marlin.drm.conftoken+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.marlin.drm.license+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.marlin.drm.mdcf": {
  	source: "iana"
  },
  	"application/vnd.mason+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.maxar.archive.3tz+zip": {
  	source: "iana",
  	compressible: false
  },
  	"application/vnd.maxmind.maxmind-db": {
  	source: "iana"
  },
  	"application/vnd.mcd": {
  	source: "iana",
  	extensions: [
  		"mcd"
  	]
  },
  	"application/vnd.medcalcdata": {
  	source: "iana",
  	extensions: [
  		"mc1"
  	]
  },
  	"application/vnd.mediastation.cdkey": {
  	source: "iana",
  	extensions: [
  		"cdkey"
  	]
  },
  	"application/vnd.meridian-slingshot": {
  	source: "iana"
  },
  	"application/vnd.mfer": {
  	source: "iana",
  	extensions: [
  		"mwf"
  	]
  },
  	"application/vnd.mfmp": {
  	source: "iana",
  	extensions: [
  		"mfm"
  	]
  },
  	"application/vnd.micro+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.micrografx.flo": {
  	source: "iana",
  	extensions: [
  		"flo"
  	]
  },
  	"application/vnd.micrografx.igx": {
  	source: "iana",
  	extensions: [
  		"igx"
  	]
  },
  	"application/vnd.microsoft.portable-executable": {
  	source: "iana"
  },
  	"application/vnd.microsoft.windows.thumbnail-cache": {
  	source: "iana"
  },
  	"application/vnd.miele+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.mif": {
  	source: "iana",
  	extensions: [
  		"mif"
  	]
  },
  	"application/vnd.minisoft-hp3000-save": {
  	source: "iana"
  },
  	"application/vnd.mitsubishi.misty-guard.trustweb": {
  	source: "iana"
  },
  	"application/vnd.mobius.daf": {
  	source: "iana",
  	extensions: [
  		"daf"
  	]
  },
  	"application/vnd.mobius.dis": {
  	source: "iana",
  	extensions: [
  		"dis"
  	]
  },
  	"application/vnd.mobius.mbk": {
  	source: "iana",
  	extensions: [
  		"mbk"
  	]
  },
  	"application/vnd.mobius.mqy": {
  	source: "iana",
  	extensions: [
  		"mqy"
  	]
  },
  	"application/vnd.mobius.msl": {
  	source: "iana",
  	extensions: [
  		"msl"
  	]
  },
  	"application/vnd.mobius.plc": {
  	source: "iana",
  	extensions: [
  		"plc"
  	]
  },
  	"application/vnd.mobius.txf": {
  	source: "iana",
  	extensions: [
  		"txf"
  	]
  },
  	"application/vnd.mophun.application": {
  	source: "iana",
  	extensions: [
  		"mpn"
  	]
  },
  	"application/vnd.mophun.certificate": {
  	source: "iana",
  	extensions: [
  		"mpc"
  	]
  },
  	"application/vnd.motorola.flexsuite": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.adsi": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.fis": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.gotap": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.kmr": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.ttc": {
  	source: "iana"
  },
  	"application/vnd.motorola.flexsuite.wem": {
  	source: "iana"
  },
  	"application/vnd.motorola.iprm": {
  	source: "iana"
  },
  	"application/vnd.mozilla.xul+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xul"
  	]
  },
  	"application/vnd.ms-3mfdocument": {
  	source: "iana"
  },
  	"application/vnd.ms-artgalry": {
  	source: "iana",
  	extensions: [
  		"cil"
  	]
  },
  	"application/vnd.ms-asf": {
  	source: "iana"
  },
  	"application/vnd.ms-cab-compressed": {
  	source: "iana",
  	extensions: [
  		"cab"
  	]
  },
  	"application/vnd.ms-color.iccprofile": {
  	source: "apache"
  },
  	"application/vnd.ms-excel": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"xls",
  		"xlm",
  		"xla",
  		"xlc",
  		"xlt",
  		"xlw"
  	]
  },
  	"application/vnd.ms-excel.addin.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xlam"
  	]
  },
  	"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xlsb"
  	]
  },
  	"application/vnd.ms-excel.sheet.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xlsm"
  	]
  },
  	"application/vnd.ms-excel.template.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"xltm"
  	]
  },
  	"application/vnd.ms-fontobject": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"eot"
  	]
  },
  	"application/vnd.ms-htmlhelp": {
  	source: "iana",
  	extensions: [
  		"chm"
  	]
  },
  	"application/vnd.ms-ims": {
  	source: "iana",
  	extensions: [
  		"ims"
  	]
  },
  	"application/vnd.ms-lrm": {
  	source: "iana",
  	extensions: [
  		"lrm"
  	]
  },
  	"application/vnd.ms-office.activex+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-officetheme": {
  	source: "iana",
  	extensions: [
  		"thmx"
  	]
  },
  	"application/vnd.ms-opentype": {
  	source: "apache",
  	compressible: true
  },
  	"application/vnd.ms-outlook": {
  	compressible: false,
  	extensions: [
  		"msg"
  	]
  },
  	"application/vnd.ms-package.obfuscated-opentype": {
  	source: "apache"
  },
  	"application/vnd.ms-pki.seccat": {
  	source: "apache",
  	extensions: [
  		"cat"
  	]
  },
  	"application/vnd.ms-pki.stl": {
  	source: "apache",
  	extensions: [
  		"stl"
  	]
  },
  	"application/vnd.ms-playready.initiator+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-powerpoint": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ppt",
  		"pps",
  		"pot"
  	]
  },
  	"application/vnd.ms-powerpoint.addin.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"ppam"
  	]
  },
  	"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"pptm"
  	]
  },
  	"application/vnd.ms-powerpoint.slide.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"sldm"
  	]
  },
  	"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"ppsm"
  	]
  },
  	"application/vnd.ms-powerpoint.template.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"potm"
  	]
  },
  	"application/vnd.ms-printdevicecapabilities+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-printing.printticket+xml": {
  	source: "apache",
  	compressible: true
  },
  	"application/vnd.ms-printschematicket+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ms-project": {
  	source: "iana",
  	extensions: [
  		"mpp",
  		"mpt"
  	]
  },
  	"application/vnd.ms-tnef": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.devicepairing": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.nwprinting.oob": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.printerpairing": {
  	source: "iana"
  },
  	"application/vnd.ms-windows.wsd.oob": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.lic-chlg-req": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.lic-resp": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.meter-chlg-req": {
  	source: "iana"
  },
  	"application/vnd.ms-wmdrm.meter-resp": {
  	source: "iana"
  },
  	"application/vnd.ms-word.document.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"docm"
  	]
  },
  	"application/vnd.ms-word.template.macroenabled.12": {
  	source: "iana",
  	extensions: [
  		"dotm"
  	]
  },
  	"application/vnd.ms-works": {
  	source: "iana",
  	extensions: [
  		"wps",
  		"wks",
  		"wcm",
  		"wdb"
  	]
  },
  	"application/vnd.ms-wpl": {
  	source: "iana",
  	extensions: [
  		"wpl"
  	]
  },
  	"application/vnd.ms-xpsdocument": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"xps"
  	]
  },
  	"application/vnd.msa-disk-image": {
  	source: "iana"
  },
  	"application/vnd.mseq": {
  	source: "iana",
  	extensions: [
  		"mseq"
  	]
  },
  	"application/vnd.msign": {
  	source: "iana"
  },
  	"application/vnd.multiad.creator": {
  	source: "iana"
  },
  	"application/vnd.multiad.creator.cif": {
  	source: "iana"
  },
  	"application/vnd.music-niff": {
  	source: "iana"
  },
  	"application/vnd.musician": {
  	source: "iana",
  	extensions: [
  		"mus"
  	]
  },
  	"application/vnd.muvee.style": {
  	source: "iana",
  	extensions: [
  		"msty"
  	]
  },
  	"application/vnd.mynfc": {
  	source: "iana",
  	extensions: [
  		"taglet"
  	]
  },
  	"application/vnd.nacamar.ybrid+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.ncd.control": {
  	source: "iana"
  },
  	"application/vnd.ncd.reference": {
  	source: "iana"
  },
  	"application/vnd.nearst.inv+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nebumind.line": {
  	source: "iana"
  },
  	"application/vnd.nervana": {
  	source: "iana"
  },
  	"application/vnd.netfpx": {
  	source: "iana"
  },
  	"application/vnd.neurolanguage.nlu": {
  	source: "iana",
  	extensions: [
  		"nlu"
  	]
  },
  	"application/vnd.nimn": {
  	source: "iana"
  },
  	"application/vnd.nintendo.nitro.rom": {
  	source: "iana"
  },
  	"application/vnd.nintendo.snes.rom": {
  	source: "iana"
  },
  	"application/vnd.nitf": {
  	source: "iana",
  	extensions: [
  		"ntf",
  		"nitf"
  	]
  },
  	"application/vnd.noblenet-directory": {
  	source: "iana",
  	extensions: [
  		"nnd"
  	]
  },
  	"application/vnd.noblenet-sealer": {
  	source: "iana",
  	extensions: [
  		"nns"
  	]
  },
  	"application/vnd.noblenet-web": {
  	source: "iana",
  	extensions: [
  		"nnw"
  	]
  },
  	"application/vnd.nokia.catalogs": {
  	source: "iana"
  },
  	"application/vnd.nokia.conml+wbxml": {
  	source: "iana"
  },
  	"application/vnd.nokia.conml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.iptv.config+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.isds-radio-presets": {
  	source: "iana"
  },
  	"application/vnd.nokia.landmark+wbxml": {
  	source: "iana"
  },
  	"application/vnd.nokia.landmark+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.landmarkcollection+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.n-gage.ac+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ac"
  	]
  },
  	"application/vnd.nokia.n-gage.data": {
  	source: "iana",
  	extensions: [
  		"ngdat"
  	]
  },
  	"application/vnd.nokia.n-gage.symbian.install": {
  	source: "iana",
  	extensions: [
  		"n-gage"
  	]
  },
  	"application/vnd.nokia.ncd": {
  	source: "iana"
  },
  	"application/vnd.nokia.pcd+wbxml": {
  	source: "iana"
  },
  	"application/vnd.nokia.pcd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.nokia.radio-preset": {
  	source: "iana",
  	extensions: [
  		"rpst"
  	]
  },
  	"application/vnd.nokia.radio-presets": {
  	source: "iana",
  	extensions: [
  		"rpss"
  	]
  },
  	"application/vnd.novadigm.edm": {
  	source: "iana",
  	extensions: [
  		"edm"
  	]
  },
  	"application/vnd.novadigm.edx": {
  	source: "iana",
  	extensions: [
  		"edx"
  	]
  },
  	"application/vnd.novadigm.ext": {
  	source: "iana",
  	extensions: [
  		"ext"
  	]
  },
  	"application/vnd.ntt-local.content-share": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.file-transfer": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.ogw_remote-access": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.sip-ta_remote": {
  	source: "iana"
  },
  	"application/vnd.ntt-local.sip-ta_tcp_stream": {
  	source: "iana"
  },
  	"application/vnd.oasis.opendocument.chart": {
  	source: "iana",
  	extensions: [
  		"odc"
  	]
  },
  	"application/vnd.oasis.opendocument.chart-template": {
  	source: "iana",
  	extensions: [
  		"otc"
  	]
  },
  	"application/vnd.oasis.opendocument.database": {
  	source: "iana",
  	extensions: [
  		"odb"
  	]
  },
  	"application/vnd.oasis.opendocument.formula": {
  	source: "iana",
  	extensions: [
  		"odf"
  	]
  },
  	"application/vnd.oasis.opendocument.formula-template": {
  	source: "iana",
  	extensions: [
  		"odft"
  	]
  },
  	"application/vnd.oasis.opendocument.graphics": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"odg"
  	]
  },
  	"application/vnd.oasis.opendocument.graphics-template": {
  	source: "iana",
  	extensions: [
  		"otg"
  	]
  },
  	"application/vnd.oasis.opendocument.image": {
  	source: "iana",
  	extensions: [
  		"odi"
  	]
  },
  	"application/vnd.oasis.opendocument.image-template": {
  	source: "iana",
  	extensions: [
  		"oti"
  	]
  },
  	"application/vnd.oasis.opendocument.presentation": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"odp"
  	]
  },
  	"application/vnd.oasis.opendocument.presentation-template": {
  	source: "iana",
  	extensions: [
  		"otp"
  	]
  },
  	"application/vnd.oasis.opendocument.spreadsheet": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ods"
  	]
  },
  	"application/vnd.oasis.opendocument.spreadsheet-template": {
  	source: "iana",
  	extensions: [
  		"ots"
  	]
  },
  	"application/vnd.oasis.opendocument.text": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"odt"
  	]
  },
  	"application/vnd.oasis.opendocument.text-master": {
  	source: "iana",
  	extensions: [
  		"odm"
  	]
  },
  	"application/vnd.oasis.opendocument.text-template": {
  	source: "iana",
  	extensions: [
  		"ott"
  	]
  },
  	"application/vnd.oasis.opendocument.text-web": {
  	source: "iana",
  	extensions: [
  		"oth"
  	]
  },
  	"application/vnd.obn": {
  	source: "iana"
  },
  	"application/vnd.ocf+cbor": {
  	source: "iana"
  },
  	"application/vnd.oci.image.manifest.v1+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oftn.l10n+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.contentaccessdownload+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.contentaccessstreaming+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.cspg-hexbinary": {
  	source: "iana"
  },
  	"application/vnd.oipf.dae.svg+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.dae.xhtml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.mippvcontrolmessage+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.pae.gem": {
  	source: "iana"
  },
  	"application/vnd.oipf.spdiscovery+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.spdlist+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.ueprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oipf.userprofile+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.olpc-sugar": {
  	source: "iana",
  	extensions: [
  		"xo"
  	]
  },
  	"application/vnd.oma-scws-config": {
  	source: "iana"
  },
  	"application/vnd.oma-scws-http-request": {
  	source: "iana"
  },
  	"application/vnd.oma-scws-http-response": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.drm-trigger+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.imd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.ltkm": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.notification+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.provisioningtrigger": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.sgboot": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.sgdd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.sgdu": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.simple-symbol-container": {
  	source: "iana"
  },
  	"application/vnd.oma.bcast.smartcard-trigger+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.sprov+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.bcast.stkm": {
  	source: "iana"
  },
  	"application/vnd.oma.cab-address-book+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-feature-handler+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-pcc+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-subs-invite+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.cab-user-prefs+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.dcd": {
  	source: "iana"
  },
  	"application/vnd.oma.dcdc": {
  	source: "iana"
  },
  	"application/vnd.oma.dd2+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dd2"
  	]
  },
  	"application/vnd.oma.drm.risd+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.group-usage-list+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.lwm2m+cbor": {
  	source: "iana"
  },
  	"application/vnd.oma.lwm2m+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.lwm2m+tlv": {
  	source: "iana"
  },
  	"application/vnd.oma.pal+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.detailed-progress-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.final-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.groups+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.invocation-descriptor+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.poc.optimized-progress-report+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.push": {
  	source: "iana"
  },
  	"application/vnd.oma.scidm.messages+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oma.xcap-directory+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.omads-email+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.omads-file+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.omads-folder+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.omaloc-supl-init": {
  	source: "iana"
  },
  	"application/vnd.onepager": {
  	source: "iana"
  },
  	"application/vnd.onepagertamp": {
  	source: "iana"
  },
  	"application/vnd.onepagertamx": {
  	source: "iana"
  },
  	"application/vnd.onepagertat": {
  	source: "iana"
  },
  	"application/vnd.onepagertatp": {
  	source: "iana"
  },
  	"application/vnd.onepagertatx": {
  	source: "iana"
  },
  	"application/vnd.openblox.game+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"obgx"
  	]
  },
  	"application/vnd.openblox.game-binary": {
  	source: "iana"
  },
  	"application/vnd.openeye.oeb": {
  	source: "iana"
  },
  	"application/vnd.openofficeorg.extension": {
  	source: "apache",
  	extensions: [
  		"oxt"
  	]
  },
  	"application/vnd.openstreetmap.data+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"osm"
  	]
  },
  	"application/vnd.opentimestamps.ots": {
  	source: "iana"
  },
  	"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawing+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"pptx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slide": {
  	source: "iana",
  	extensions: [
  		"sldx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
  	source: "iana",
  	extensions: [
  		"ppsx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.template": {
  	source: "iana",
  	extensions: [
  		"potx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"xlsx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
  	source: "iana",
  	extensions: [
  		"xltx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.theme+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.vmldrawing": {
  	source: "iana"
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"docx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
  	source: "iana",
  	extensions: [
  		"dotx"
  	]
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-package.core-properties+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.openxmlformats-package.relationships+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oracle.resource+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.orange.indata": {
  	source: "iana"
  },
  	"application/vnd.osa.netdeploy": {
  	source: "iana"
  },
  	"application/vnd.osgeo.mapguide.package": {
  	source: "iana",
  	extensions: [
  		"mgp"
  	]
  },
  	"application/vnd.osgi.bundle": {
  	source: "iana"
  },
  	"application/vnd.osgi.dp": {
  	source: "iana",
  	extensions: [
  		"dp"
  	]
  },
  	"application/vnd.osgi.subsystem": {
  	source: "iana",
  	extensions: [
  		"esa"
  	]
  },
  	"application/vnd.otps.ct-kip+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.oxli.countgraph": {
  	source: "iana"
  },
  	"application/vnd.pagerduty+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.palm": {
  	source: "iana",
  	extensions: [
  		"pdb",
  		"pqa",
  		"oprc"
  	]
  },
  	"application/vnd.panoply": {
  	source: "iana"
  },
  	"application/vnd.paos.xml": {
  	source: "iana"
  },
  	"application/vnd.patentdive": {
  	source: "iana"
  },
  	"application/vnd.patientecommsdoc": {
  	source: "iana"
  },
  	"application/vnd.pawaafile": {
  	source: "iana",
  	extensions: [
  		"paw"
  	]
  },
  	"application/vnd.pcos": {
  	source: "iana"
  },
  	"application/vnd.pg.format": {
  	source: "iana",
  	extensions: [
  		"str"
  	]
  },
  	"application/vnd.pg.osasli": {
  	source: "iana",
  	extensions: [
  		"ei6"
  	]
  },
  	"application/vnd.piaccess.application-licence": {
  	source: "iana"
  },
  	"application/vnd.picsel": {
  	source: "iana",
  	extensions: [
  		"efif"
  	]
  },
  	"application/vnd.pmi.widget": {
  	source: "iana",
  	extensions: [
  		"wg"
  	]
  },
  	"application/vnd.poc.group-advertisement+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.pocketlearn": {
  	source: "iana",
  	extensions: [
  		"plf"
  	]
  },
  	"application/vnd.powerbuilder6": {
  	source: "iana",
  	extensions: [
  		"pbd"
  	]
  },
  	"application/vnd.powerbuilder6-s": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder7": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder7-s": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder75": {
  	source: "iana"
  },
  	"application/vnd.powerbuilder75-s": {
  	source: "iana"
  },
  	"application/vnd.preminet": {
  	source: "iana"
  },
  	"application/vnd.previewsystems.box": {
  	source: "iana",
  	extensions: [
  		"box"
  	]
  },
  	"application/vnd.proteus.magazine": {
  	source: "iana",
  	extensions: [
  		"mgz"
  	]
  },
  	"application/vnd.psfs": {
  	source: "iana"
  },
  	"application/vnd.publishare-delta-tree": {
  	source: "iana",
  	extensions: [
  		"qps"
  	]
  },
  	"application/vnd.pvi.ptid1": {
  	source: "iana",
  	extensions: [
  		"ptid"
  	]
  },
  	"application/vnd.pwg-multiplexed": {
  	source: "iana"
  },
  	"application/vnd.pwg-xhtml-print+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.qualcomm.brew-app-res": {
  	source: "iana"
  },
  	"application/vnd.quarantainenet": {
  	source: "iana"
  },
  	"application/vnd.quark.quarkxpress": {
  	source: "iana",
  	extensions: [
  		"qxd",
  		"qxt",
  		"qwd",
  		"qwt",
  		"qxl",
  		"qxb"
  	]
  },
  	"application/vnd.quobject-quoxdocument": {
  	source: "iana"
  },
  	"application/vnd.radisys.moml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-conf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-conn+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-dialog+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-audit-stream+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-conf+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-base+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-fax-detect+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-group+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-speech+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.radisys.msml-dialog-transform+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.rainstor.data": {
  	source: "iana"
  },
  	"application/vnd.rapid": {
  	source: "iana"
  },
  	"application/vnd.rar": {
  	source: "iana",
  	extensions: [
  		"rar"
  	]
  },
  	"application/vnd.realvnc.bed": {
  	source: "iana",
  	extensions: [
  		"bed"
  	]
  },
  	"application/vnd.recordare.musicxml": {
  	source: "iana",
  	extensions: [
  		"mxl"
  	]
  },
  	"application/vnd.recordare.musicxml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"musicxml"
  	]
  },
  	"application/vnd.renlearn.rlprint": {
  	source: "iana"
  },
  	"application/vnd.resilient.logic": {
  	source: "iana"
  },
  	"application/vnd.restful+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.rig.cryptonote": {
  	source: "iana",
  	extensions: [
  		"cryptonote"
  	]
  },
  	"application/vnd.rim.cod": {
  	source: "apache",
  	extensions: [
  		"cod"
  	]
  },
  	"application/vnd.rn-realmedia": {
  	source: "apache",
  	extensions: [
  		"rm"
  	]
  },
  	"application/vnd.rn-realmedia-vbr": {
  	source: "apache",
  	extensions: [
  		"rmvb"
  	]
  },
  	"application/vnd.route66.link66+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"link66"
  	]
  },
  	"application/vnd.rs-274x": {
  	source: "iana"
  },
  	"application/vnd.ruckus.download": {
  	source: "iana"
  },
  	"application/vnd.s3sms": {
  	source: "iana"
  },
  	"application/vnd.sailingtracker.track": {
  	source: "iana",
  	extensions: [
  		"st"
  	]
  },
  	"application/vnd.sar": {
  	source: "iana"
  },
  	"application/vnd.sbm.cid": {
  	source: "iana"
  },
  	"application/vnd.sbm.mid2": {
  	source: "iana"
  },
  	"application/vnd.scribus": {
  	source: "iana"
  },
  	"application/vnd.sealed.3df": {
  	source: "iana"
  },
  	"application/vnd.sealed.csf": {
  	source: "iana"
  },
  	"application/vnd.sealed.doc": {
  	source: "iana"
  },
  	"application/vnd.sealed.eml": {
  	source: "iana"
  },
  	"application/vnd.sealed.mht": {
  	source: "iana"
  },
  	"application/vnd.sealed.net": {
  	source: "iana"
  },
  	"application/vnd.sealed.ppt": {
  	source: "iana"
  },
  	"application/vnd.sealed.tiff": {
  	source: "iana"
  },
  	"application/vnd.sealed.xls": {
  	source: "iana"
  },
  	"application/vnd.sealedmedia.softseal.html": {
  	source: "iana"
  },
  	"application/vnd.sealedmedia.softseal.pdf": {
  	source: "iana"
  },
  	"application/vnd.seemail": {
  	source: "iana",
  	extensions: [
  		"see"
  	]
  },
  	"application/vnd.seis+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.sema": {
  	source: "iana",
  	extensions: [
  		"sema"
  	]
  },
  	"application/vnd.semd": {
  	source: "iana",
  	extensions: [
  		"semd"
  	]
  },
  	"application/vnd.semf": {
  	source: "iana",
  	extensions: [
  		"semf"
  	]
  },
  	"application/vnd.shade-save-file": {
  	source: "iana"
  },
  	"application/vnd.shana.informed.formdata": {
  	source: "iana",
  	extensions: [
  		"ifm"
  	]
  },
  	"application/vnd.shana.informed.formtemplate": {
  	source: "iana",
  	extensions: [
  		"itp"
  	]
  },
  	"application/vnd.shana.informed.interchange": {
  	source: "iana",
  	extensions: [
  		"iif"
  	]
  },
  	"application/vnd.shana.informed.package": {
  	source: "iana",
  	extensions: [
  		"ipk"
  	]
  },
  	"application/vnd.shootproof+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.shopkick+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.shp": {
  	source: "iana"
  },
  	"application/vnd.shx": {
  	source: "iana"
  },
  	"application/vnd.sigrok.session": {
  	source: "iana"
  },
  	"application/vnd.simtech-mindmapper": {
  	source: "iana",
  	extensions: [
  		"twd",
  		"twds"
  	]
  },
  	"application/vnd.siren+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.smaf": {
  	source: "iana",
  	extensions: [
  		"mmf"
  	]
  },
  	"application/vnd.smart.notebook": {
  	source: "iana"
  },
  	"application/vnd.smart.teacher": {
  	source: "iana",
  	extensions: [
  		"teacher"
  	]
  },
  	"application/vnd.snesdev-page-table": {
  	source: "iana"
  },
  	"application/vnd.software602.filler.form+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"fo"
  	]
  },
  	"application/vnd.software602.filler.form-xml-zip": {
  	source: "iana"
  },
  	"application/vnd.solent.sdkm+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"sdkm",
  		"sdkd"
  	]
  },
  	"application/vnd.spotfire.dxp": {
  	source: "iana",
  	extensions: [
  		"dxp"
  	]
  },
  	"application/vnd.spotfire.sfs": {
  	source: "iana",
  	extensions: [
  		"sfs"
  	]
  },
  	"application/vnd.sqlite3": {
  	source: "iana"
  },
  	"application/vnd.sss-cod": {
  	source: "iana"
  },
  	"application/vnd.sss-dtf": {
  	source: "iana"
  },
  	"application/vnd.sss-ntf": {
  	source: "iana"
  },
  	"application/vnd.stardivision.calc": {
  	source: "apache",
  	extensions: [
  		"sdc"
  	]
  },
  	"application/vnd.stardivision.draw": {
  	source: "apache",
  	extensions: [
  		"sda"
  	]
  },
  	"application/vnd.stardivision.impress": {
  	source: "apache",
  	extensions: [
  		"sdd"
  	]
  },
  	"application/vnd.stardivision.math": {
  	source: "apache",
  	extensions: [
  		"smf"
  	]
  },
  	"application/vnd.stardivision.writer": {
  	source: "apache",
  	extensions: [
  		"sdw",
  		"vor"
  	]
  },
  	"application/vnd.stardivision.writer-global": {
  	source: "apache",
  	extensions: [
  		"sgl"
  	]
  },
  	"application/vnd.stepmania.package": {
  	source: "iana",
  	extensions: [
  		"smzip"
  	]
  },
  	"application/vnd.stepmania.stepchart": {
  	source: "iana",
  	extensions: [
  		"sm"
  	]
  },
  	"application/vnd.street-stream": {
  	source: "iana"
  },
  	"application/vnd.sun.wadl+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wadl"
  	]
  },
  	"application/vnd.sun.xml.calc": {
  	source: "apache",
  	extensions: [
  		"sxc"
  	]
  },
  	"application/vnd.sun.xml.calc.template": {
  	source: "apache",
  	extensions: [
  		"stc"
  	]
  },
  	"application/vnd.sun.xml.draw": {
  	source: "apache",
  	extensions: [
  		"sxd"
  	]
  },
  	"application/vnd.sun.xml.draw.template": {
  	source: "apache",
  	extensions: [
  		"std"
  	]
  },
  	"application/vnd.sun.xml.impress": {
  	source: "apache",
  	extensions: [
  		"sxi"
  	]
  },
  	"application/vnd.sun.xml.impress.template": {
  	source: "apache",
  	extensions: [
  		"sti"
  	]
  },
  	"application/vnd.sun.xml.math": {
  	source: "apache",
  	extensions: [
  		"sxm"
  	]
  },
  	"application/vnd.sun.xml.writer": {
  	source: "apache",
  	extensions: [
  		"sxw"
  	]
  },
  	"application/vnd.sun.xml.writer.global": {
  	source: "apache",
  	extensions: [
  		"sxg"
  	]
  },
  	"application/vnd.sun.xml.writer.template": {
  	source: "apache",
  	extensions: [
  		"stw"
  	]
  },
  	"application/vnd.sus-calendar": {
  	source: "iana",
  	extensions: [
  		"sus",
  		"susp"
  	]
  },
  	"application/vnd.svd": {
  	source: "iana",
  	extensions: [
  		"svd"
  	]
  },
  	"application/vnd.swiftview-ics": {
  	source: "iana"
  },
  	"application/vnd.sycle+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.syft+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.symbian.install": {
  	source: "apache",
  	extensions: [
  		"sis",
  		"sisx"
  	]
  },
  	"application/vnd.syncml+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"xsm"
  	]
  },
  	"application/vnd.syncml.dm+wbxml": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"bdm"
  	]
  },
  	"application/vnd.syncml.dm+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"xdm"
  	]
  },
  	"application/vnd.syncml.dm.notification": {
  	source: "iana"
  },
  	"application/vnd.syncml.dmddf+wbxml": {
  	source: "iana"
  },
  	"application/vnd.syncml.dmddf+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"ddf"
  	]
  },
  	"application/vnd.syncml.dmtnds+wbxml": {
  	source: "iana"
  },
  	"application/vnd.syncml.dmtnds+xml": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true
  },
  	"application/vnd.syncml.ds.notification": {
  	source: "iana"
  },
  	"application/vnd.tableschema+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.tao.intent-module-archive": {
  	source: "iana",
  	extensions: [
  		"tao"
  	]
  },
  	"application/vnd.tcpdump.pcap": {
  	source: "iana",
  	extensions: [
  		"pcap",
  		"cap",
  		"dmp"
  	]
  },
  	"application/vnd.think-cell.ppttc+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.tmd.mediaflex.api+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.tml": {
  	source: "iana"
  },
  	"application/vnd.tmobile-livetv": {
  	source: "iana",
  	extensions: [
  		"tmo"
  	]
  },
  	"application/vnd.tri.onesource": {
  	source: "iana"
  },
  	"application/vnd.trid.tpt": {
  	source: "iana",
  	extensions: [
  		"tpt"
  	]
  },
  	"application/vnd.triscape.mxs": {
  	source: "iana",
  	extensions: [
  		"mxs"
  	]
  },
  	"application/vnd.trueapp": {
  	source: "iana",
  	extensions: [
  		"tra"
  	]
  },
  	"application/vnd.truedoc": {
  	source: "iana"
  },
  	"application/vnd.ubisoft.webplayer": {
  	source: "iana"
  },
  	"application/vnd.ufdl": {
  	source: "iana",
  	extensions: [
  		"ufd",
  		"ufdl"
  	]
  },
  	"application/vnd.uiq.theme": {
  	source: "iana",
  	extensions: [
  		"utz"
  	]
  },
  	"application/vnd.umajin": {
  	source: "iana",
  	extensions: [
  		"umj"
  	]
  },
  	"application/vnd.unity": {
  	source: "iana",
  	extensions: [
  		"unityweb"
  	]
  },
  	"application/vnd.uoml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"uoml"
  	]
  },
  	"application/vnd.uplanet.alert": {
  	source: "iana"
  },
  	"application/vnd.uplanet.alert-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.bearer-choice": {
  	source: "iana"
  },
  	"application/vnd.uplanet.bearer-choice-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.cacheop": {
  	source: "iana"
  },
  	"application/vnd.uplanet.cacheop-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.channel": {
  	source: "iana"
  },
  	"application/vnd.uplanet.channel-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.list": {
  	source: "iana"
  },
  	"application/vnd.uplanet.list-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.listcmd": {
  	source: "iana"
  },
  	"application/vnd.uplanet.listcmd-wbxml": {
  	source: "iana"
  },
  	"application/vnd.uplanet.signal": {
  	source: "iana"
  },
  	"application/vnd.uri-map": {
  	source: "iana"
  },
  	"application/vnd.valve.source.material": {
  	source: "iana"
  },
  	"application/vnd.vcx": {
  	source: "iana",
  	extensions: [
  		"vcx"
  	]
  },
  	"application/vnd.vd-study": {
  	source: "iana"
  },
  	"application/vnd.vectorworks": {
  	source: "iana"
  },
  	"application/vnd.vel+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.verimatrix.vcas": {
  	source: "iana"
  },
  	"application/vnd.veritone.aion+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.veryant.thin": {
  	source: "iana"
  },
  	"application/vnd.ves.encrypted": {
  	source: "iana"
  },
  	"application/vnd.vidsoft.vidconference": {
  	source: "iana"
  },
  	"application/vnd.visio": {
  	source: "iana",
  	extensions: [
  		"vsd",
  		"vst",
  		"vss",
  		"vsw"
  	]
  },
  	"application/vnd.visionary": {
  	source: "iana",
  	extensions: [
  		"vis"
  	]
  },
  	"application/vnd.vividence.scriptfile": {
  	source: "iana"
  },
  	"application/vnd.vsf": {
  	source: "iana",
  	extensions: [
  		"vsf"
  	]
  },
  	"application/vnd.wap.sic": {
  	source: "iana"
  },
  	"application/vnd.wap.slc": {
  	source: "iana"
  },
  	"application/vnd.wap.wbxml": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"wbxml"
  	]
  },
  	"application/vnd.wap.wmlc": {
  	source: "iana",
  	extensions: [
  		"wmlc"
  	]
  },
  	"application/vnd.wap.wmlscriptc": {
  	source: "iana",
  	extensions: [
  		"wmlsc"
  	]
  },
  	"application/vnd.webturbo": {
  	source: "iana",
  	extensions: [
  		"wtb"
  	]
  },
  	"application/vnd.wfa.dpp": {
  	source: "iana"
  },
  	"application/vnd.wfa.p2p": {
  	source: "iana"
  },
  	"application/vnd.wfa.wsc": {
  	source: "iana"
  },
  	"application/vnd.windows.devicepairing": {
  	source: "iana"
  },
  	"application/vnd.wmc": {
  	source: "iana"
  },
  	"application/vnd.wmf.bootstrap": {
  	source: "iana"
  },
  	"application/vnd.wolfram.mathematica": {
  	source: "iana"
  },
  	"application/vnd.wolfram.mathematica.package": {
  	source: "iana"
  },
  	"application/vnd.wolfram.player": {
  	source: "iana",
  	extensions: [
  		"nbp"
  	]
  },
  	"application/vnd.wordperfect": {
  	source: "iana",
  	extensions: [
  		"wpd"
  	]
  },
  	"application/vnd.wqd": {
  	source: "iana",
  	extensions: [
  		"wqd"
  	]
  },
  	"application/vnd.wrq-hp3000-labelled": {
  	source: "iana"
  },
  	"application/vnd.wt.stf": {
  	source: "iana",
  	extensions: [
  		"stf"
  	]
  },
  	"application/vnd.wv.csp+wbxml": {
  	source: "iana"
  },
  	"application/vnd.wv.csp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.wv.ssp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.xacml+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.xara": {
  	source: "iana",
  	extensions: [
  		"xar"
  	]
  },
  	"application/vnd.xfdl": {
  	source: "iana",
  	extensions: [
  		"xfdl"
  	]
  },
  	"application/vnd.xfdl.webform": {
  	source: "iana"
  },
  	"application/vnd.xmi+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/vnd.xmpie.cpkg": {
  	source: "iana"
  },
  	"application/vnd.xmpie.dpkg": {
  	source: "iana"
  },
  	"application/vnd.xmpie.plan": {
  	source: "iana"
  },
  	"application/vnd.xmpie.ppkg": {
  	source: "iana"
  },
  	"application/vnd.xmpie.xlim": {
  	source: "iana"
  },
  	"application/vnd.yamaha.hv-dic": {
  	source: "iana",
  	extensions: [
  		"hvd"
  	]
  },
  	"application/vnd.yamaha.hv-script": {
  	source: "iana",
  	extensions: [
  		"hvs"
  	]
  },
  	"application/vnd.yamaha.hv-voice": {
  	source: "iana",
  	extensions: [
  		"hvp"
  	]
  },
  	"application/vnd.yamaha.openscoreformat": {
  	source: "iana",
  	extensions: [
  		"osf"
  	]
  },
  	"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"osfpvg"
  	]
  },
  	"application/vnd.yamaha.remote-setup": {
  	source: "iana"
  },
  	"application/vnd.yamaha.smaf-audio": {
  	source: "iana",
  	extensions: [
  		"saf"
  	]
  },
  	"application/vnd.yamaha.smaf-phrase": {
  	source: "iana",
  	extensions: [
  		"spf"
  	]
  },
  	"application/vnd.yamaha.through-ngn": {
  	source: "iana"
  },
  	"application/vnd.yamaha.tunnel-udpencap": {
  	source: "iana"
  },
  	"application/vnd.yaoweme": {
  	source: "iana"
  },
  	"application/vnd.yellowriver-custom-menu": {
  	source: "iana",
  	extensions: [
  		"cmp"
  	]
  },
  	"application/vnd.youtube.yt": {
  	source: "iana"
  },
  	"application/vnd.zul": {
  	source: "iana",
  	extensions: [
  		"zir",
  		"zirz"
  	]
  },
  	"application/vnd.zzazz.deck+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"zaz"
  	]
  },
  	"application/voicexml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"vxml"
  	]
  },
  	"application/voucher-cms+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/vq-rtcpxr": {
  	source: "iana"
  },
  	"application/wasm": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wasm"
  	]
  },
  	"application/watcherinfo+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wif"
  	]
  },
  	"application/webpush-options+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/whoispp-query": {
  	source: "iana"
  },
  	"application/whoispp-response": {
  	source: "iana"
  },
  	"application/widget": {
  	source: "iana",
  	extensions: [
  		"wgt"
  	]
  },
  	"application/winhlp": {
  	source: "apache",
  	extensions: [
  		"hlp"
  	]
  },
  	"application/wita": {
  	source: "iana"
  },
  	"application/wordperfect5.1": {
  	source: "iana"
  },
  	"application/wsdl+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wsdl"
  	]
  },
  	"application/wspolicy+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"wspolicy"
  	]
  },
  	"application/x-7z-compressed": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"7z"
  	]
  },
  	"application/x-abiword": {
  	source: "apache",
  	extensions: [
  		"abw"
  	]
  },
  	"application/x-ace-compressed": {
  	source: "apache",
  	extensions: [
  		"ace"
  	]
  },
  	"application/x-amf": {
  	source: "apache"
  },
  	"application/x-apple-diskimage": {
  	source: "apache",
  	extensions: [
  		"dmg"
  	]
  },
  	"application/x-arj": {
  	compressible: false,
  	extensions: [
  		"arj"
  	]
  },
  	"application/x-authorware-bin": {
  	source: "apache",
  	extensions: [
  		"aab",
  		"x32",
  		"u32",
  		"vox"
  	]
  },
  	"application/x-authorware-map": {
  	source: "apache",
  	extensions: [
  		"aam"
  	]
  },
  	"application/x-authorware-seg": {
  	source: "apache",
  	extensions: [
  		"aas"
  	]
  },
  	"application/x-bcpio": {
  	source: "apache",
  	extensions: [
  		"bcpio"
  	]
  },
  	"application/x-bdoc": {
  	compressible: false,
  	extensions: [
  		"bdoc"
  	]
  },
  	"application/x-bittorrent": {
  	source: "apache",
  	extensions: [
  		"torrent"
  	]
  },
  	"application/x-blorb": {
  	source: "apache",
  	extensions: [
  		"blb",
  		"blorb"
  	]
  },
  	"application/x-bzip": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"bz"
  	]
  },
  	"application/x-bzip2": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"bz2",
  		"boz"
  	]
  },
  	"application/x-cbr": {
  	source: "apache",
  	extensions: [
  		"cbr",
  		"cba",
  		"cbt",
  		"cbz",
  		"cb7"
  	]
  },
  	"application/x-cdlink": {
  	source: "apache",
  	extensions: [
  		"vcd"
  	]
  },
  	"application/x-cfs-compressed": {
  	source: "apache",
  	extensions: [
  		"cfs"
  	]
  },
  	"application/x-chat": {
  	source: "apache",
  	extensions: [
  		"chat"
  	]
  },
  	"application/x-chess-pgn": {
  	source: "apache",
  	extensions: [
  		"pgn"
  	]
  },
  	"application/x-chrome-extension": {
  	extensions: [
  		"crx"
  	]
  },
  	"application/x-cocoa": {
  	source: "nginx",
  	extensions: [
  		"cco"
  	]
  },
  	"application/x-compress": {
  	source: "apache"
  },
  	"application/x-conference": {
  	source: "apache",
  	extensions: [
  		"nsc"
  	]
  },
  	"application/x-cpio": {
  	source: "apache",
  	extensions: [
  		"cpio"
  	]
  },
  	"application/x-csh": {
  	source: "apache",
  	extensions: [
  		"csh"
  	]
  },
  	"application/x-deb": {
  	compressible: false
  },
  	"application/x-debian-package": {
  	source: "apache",
  	extensions: [
  		"deb",
  		"udeb"
  	]
  },
  	"application/x-dgc-compressed": {
  	source: "apache",
  	extensions: [
  		"dgc"
  	]
  },
  	"application/x-director": {
  	source: "apache",
  	extensions: [
  		"dir",
  		"dcr",
  		"dxr",
  		"cst",
  		"cct",
  		"cxt",
  		"w3d",
  		"fgd",
  		"swa"
  	]
  },
  	"application/x-doom": {
  	source: "apache",
  	extensions: [
  		"wad"
  	]
  },
  	"application/x-dtbncx+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"ncx"
  	]
  },
  	"application/x-dtbook+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"dtb"
  	]
  },
  	"application/x-dtbresource+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"res"
  	]
  },
  	"application/x-dvi": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"dvi"
  	]
  },
  	"application/x-envoy": {
  	source: "apache",
  	extensions: [
  		"evy"
  	]
  },
  	"application/x-eva": {
  	source: "apache",
  	extensions: [
  		"eva"
  	]
  },
  	"application/x-font-bdf": {
  	source: "apache",
  	extensions: [
  		"bdf"
  	]
  },
  	"application/x-font-dos": {
  	source: "apache"
  },
  	"application/x-font-framemaker": {
  	source: "apache"
  },
  	"application/x-font-ghostscript": {
  	source: "apache",
  	extensions: [
  		"gsf"
  	]
  },
  	"application/x-font-libgrx": {
  	source: "apache"
  },
  	"application/x-font-linux-psf": {
  	source: "apache",
  	extensions: [
  		"psf"
  	]
  },
  	"application/x-font-pcf": {
  	source: "apache",
  	extensions: [
  		"pcf"
  	]
  },
  	"application/x-font-snf": {
  	source: "apache",
  	extensions: [
  		"snf"
  	]
  },
  	"application/x-font-speedo": {
  	source: "apache"
  },
  	"application/x-font-sunos-news": {
  	source: "apache"
  },
  	"application/x-font-type1": {
  	source: "apache",
  	extensions: [
  		"pfa",
  		"pfb",
  		"pfm",
  		"afm"
  	]
  },
  	"application/x-font-vfont": {
  	source: "apache"
  },
  	"application/x-freearc": {
  	source: "apache",
  	extensions: [
  		"arc"
  	]
  },
  	"application/x-futuresplash": {
  	source: "apache",
  	extensions: [
  		"spl"
  	]
  },
  	"application/x-gca-compressed": {
  	source: "apache",
  	extensions: [
  		"gca"
  	]
  },
  	"application/x-glulx": {
  	source: "apache",
  	extensions: [
  		"ulx"
  	]
  },
  	"application/x-gnumeric": {
  	source: "apache",
  	extensions: [
  		"gnumeric"
  	]
  },
  	"application/x-gramps-xml": {
  	source: "apache",
  	extensions: [
  		"gramps"
  	]
  },
  	"application/x-gtar": {
  	source: "apache",
  	extensions: [
  		"gtar"
  	]
  },
  	"application/x-gzip": {
  	source: "apache"
  },
  	"application/x-hdf": {
  	source: "apache",
  	extensions: [
  		"hdf"
  	]
  },
  	"application/x-httpd-php": {
  	compressible: true,
  	extensions: [
  		"php"
  	]
  },
  	"application/x-install-instructions": {
  	source: "apache",
  	extensions: [
  		"install"
  	]
  },
  	"application/x-iso9660-image": {
  	source: "apache",
  	extensions: [
  		"iso"
  	]
  },
  	"application/x-iwork-keynote-sffkey": {
  	extensions: [
  		"key"
  	]
  },
  	"application/x-iwork-numbers-sffnumbers": {
  	extensions: [
  		"numbers"
  	]
  },
  	"application/x-iwork-pages-sffpages": {
  	extensions: [
  		"pages"
  	]
  },
  	"application/x-java-archive-diff": {
  	source: "nginx",
  	extensions: [
  		"jardiff"
  	]
  },
  	"application/x-java-jnlp-file": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"jnlp"
  	]
  },
  	"application/x-javascript": {
  	compressible: true
  },
  	"application/x-keepass2": {
  	extensions: [
  		"kdbx"
  	]
  },
  	"application/x-latex": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"latex"
  	]
  },
  	"application/x-lua-bytecode": {
  	extensions: [
  		"luac"
  	]
  },
  	"application/x-lzh-compressed": {
  	source: "apache",
  	extensions: [
  		"lzh",
  		"lha"
  	]
  },
  	"application/x-makeself": {
  	source: "nginx",
  	extensions: [
  		"run"
  	]
  },
  	"application/x-mie": {
  	source: "apache",
  	extensions: [
  		"mie"
  	]
  },
  	"application/x-mobipocket-ebook": {
  	source: "apache",
  	extensions: [
  		"prc",
  		"mobi"
  	]
  },
  	"application/x-mpegurl": {
  	compressible: false
  },
  	"application/x-ms-application": {
  	source: "apache",
  	extensions: [
  		"application"
  	]
  },
  	"application/x-ms-shortcut": {
  	source: "apache",
  	extensions: [
  		"lnk"
  	]
  },
  	"application/x-ms-wmd": {
  	source: "apache",
  	extensions: [
  		"wmd"
  	]
  },
  	"application/x-ms-wmz": {
  	source: "apache",
  	extensions: [
  		"wmz"
  	]
  },
  	"application/x-ms-xbap": {
  	source: "apache",
  	extensions: [
  		"xbap"
  	]
  },
  	"application/x-msaccess": {
  	source: "apache",
  	extensions: [
  		"mdb"
  	]
  },
  	"application/x-msbinder": {
  	source: "apache",
  	extensions: [
  		"obd"
  	]
  },
  	"application/x-mscardfile": {
  	source: "apache",
  	extensions: [
  		"crd"
  	]
  },
  	"application/x-msclip": {
  	source: "apache",
  	extensions: [
  		"clp"
  	]
  },
  	"application/x-msdos-program": {
  	extensions: [
  		"exe"
  	]
  },
  	"application/x-msdownload": {
  	source: "apache",
  	extensions: [
  		"exe",
  		"dll",
  		"com",
  		"bat",
  		"msi"
  	]
  },
  	"application/x-msmediaview": {
  	source: "apache",
  	extensions: [
  		"mvb",
  		"m13",
  		"m14"
  	]
  },
  	"application/x-msmetafile": {
  	source: "apache",
  	extensions: [
  		"wmf",
  		"wmz",
  		"emf",
  		"emz"
  	]
  },
  	"application/x-msmoney": {
  	source: "apache",
  	extensions: [
  		"mny"
  	]
  },
  	"application/x-mspublisher": {
  	source: "apache",
  	extensions: [
  		"pub"
  	]
  },
  	"application/x-msschedule": {
  	source: "apache",
  	extensions: [
  		"scd"
  	]
  },
  	"application/x-msterminal": {
  	source: "apache",
  	extensions: [
  		"trm"
  	]
  },
  	"application/x-mswrite": {
  	source: "apache",
  	extensions: [
  		"wri"
  	]
  },
  	"application/x-netcdf": {
  	source: "apache",
  	extensions: [
  		"nc",
  		"cdf"
  	]
  },
  	"application/x-ns-proxy-autoconfig": {
  	compressible: true,
  	extensions: [
  		"pac"
  	]
  },
  	"application/x-nzb": {
  	source: "apache",
  	extensions: [
  		"nzb"
  	]
  },
  	"application/x-perl": {
  	source: "nginx",
  	extensions: [
  		"pl",
  		"pm"
  	]
  },
  	"application/x-pilot": {
  	source: "nginx",
  	extensions: [
  		"prc",
  		"pdb"
  	]
  },
  	"application/x-pkcs12": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"p12",
  		"pfx"
  	]
  },
  	"application/x-pkcs7-certificates": {
  	source: "apache",
  	extensions: [
  		"p7b",
  		"spc"
  	]
  },
  	"application/x-pkcs7-certreqresp": {
  	source: "apache",
  	extensions: [
  		"p7r"
  	]
  },
  	"application/x-pki-message": {
  	source: "iana"
  },
  	"application/x-rar-compressed": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"rar"
  	]
  },
  	"application/x-redhat-package-manager": {
  	source: "nginx",
  	extensions: [
  		"rpm"
  	]
  },
  	"application/x-research-info-systems": {
  	source: "apache",
  	extensions: [
  		"ris"
  	]
  },
  	"application/x-sea": {
  	source: "nginx",
  	extensions: [
  		"sea"
  	]
  },
  	"application/x-sh": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"sh"
  	]
  },
  	"application/x-shar": {
  	source: "apache",
  	extensions: [
  		"shar"
  	]
  },
  	"application/x-shockwave-flash": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"swf"
  	]
  },
  	"application/x-silverlight-app": {
  	source: "apache",
  	extensions: [
  		"xap"
  	]
  },
  	"application/x-sql": {
  	source: "apache",
  	extensions: [
  		"sql"
  	]
  },
  	"application/x-stuffit": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"sit"
  	]
  },
  	"application/x-stuffitx": {
  	source: "apache",
  	extensions: [
  		"sitx"
  	]
  },
  	"application/x-subrip": {
  	source: "apache",
  	extensions: [
  		"srt"
  	]
  },
  	"application/x-sv4cpio": {
  	source: "apache",
  	extensions: [
  		"sv4cpio"
  	]
  },
  	"application/x-sv4crc": {
  	source: "apache",
  	extensions: [
  		"sv4crc"
  	]
  },
  	"application/x-t3vm-image": {
  	source: "apache",
  	extensions: [
  		"t3"
  	]
  },
  	"application/x-tads": {
  	source: "apache",
  	extensions: [
  		"gam"
  	]
  },
  	"application/x-tar": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"tar"
  	]
  },
  	"application/x-tcl": {
  	source: "apache",
  	extensions: [
  		"tcl",
  		"tk"
  	]
  },
  	"application/x-tex": {
  	source: "apache",
  	extensions: [
  		"tex"
  	]
  },
  	"application/x-tex-tfm": {
  	source: "apache",
  	extensions: [
  		"tfm"
  	]
  },
  	"application/x-texinfo": {
  	source: "apache",
  	extensions: [
  		"texinfo",
  		"texi"
  	]
  },
  	"application/x-tgif": {
  	source: "apache",
  	extensions: [
  		"obj"
  	]
  },
  	"application/x-ustar": {
  	source: "apache",
  	extensions: [
  		"ustar"
  	]
  },
  	"application/x-virtualbox-hdd": {
  	compressible: true,
  	extensions: [
  		"hdd"
  	]
  },
  	"application/x-virtualbox-ova": {
  	compressible: true,
  	extensions: [
  		"ova"
  	]
  },
  	"application/x-virtualbox-ovf": {
  	compressible: true,
  	extensions: [
  		"ovf"
  	]
  },
  	"application/x-virtualbox-vbox": {
  	compressible: true,
  	extensions: [
  		"vbox"
  	]
  },
  	"application/x-virtualbox-vbox-extpack": {
  	compressible: false,
  	extensions: [
  		"vbox-extpack"
  	]
  },
  	"application/x-virtualbox-vdi": {
  	compressible: true,
  	extensions: [
  		"vdi"
  	]
  },
  	"application/x-virtualbox-vhd": {
  	compressible: true,
  	extensions: [
  		"vhd"
  	]
  },
  	"application/x-virtualbox-vmdk": {
  	compressible: true,
  	extensions: [
  		"vmdk"
  	]
  },
  	"application/x-wais-source": {
  	source: "apache",
  	extensions: [
  		"src"
  	]
  },
  	"application/x-web-app-manifest+json": {
  	compressible: true,
  	extensions: [
  		"webapp"
  	]
  },
  	"application/x-www-form-urlencoded": {
  	source: "iana",
  	compressible: true
  },
  	"application/x-x509-ca-cert": {
  	source: "iana",
  	extensions: [
  		"der",
  		"crt",
  		"pem"
  	]
  },
  	"application/x-x509-ca-ra-cert": {
  	source: "iana"
  },
  	"application/x-x509-next-ca-cert": {
  	source: "iana"
  },
  	"application/x-xfig": {
  	source: "apache",
  	extensions: [
  		"fig"
  	]
  },
  	"application/x-xliff+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xlf"
  	]
  },
  	"application/x-xpinstall": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"xpi"
  	]
  },
  	"application/x-xz": {
  	source: "apache",
  	extensions: [
  		"xz"
  	]
  },
  	"application/x-zmachine": {
  	source: "apache",
  	extensions: [
  		"z1",
  		"z2",
  		"z3",
  		"z4",
  		"z5",
  		"z6",
  		"z7",
  		"z8"
  	]
  },
  	"application/x400-bp": {
  	source: "iana"
  },
  	"application/xacml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xaml+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xaml"
  	]
  },
  	"application/xcap-att+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xav"
  	]
  },
  	"application/xcap-caps+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xca"
  	]
  },
  	"application/xcap-diff+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xdf"
  	]
  },
  	"application/xcap-el+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xel"
  	]
  },
  	"application/xcap-error+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xcap-ns+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xns"
  	]
  },
  	"application/xcon-conference-info+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xcon-conference-info-diff+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xenc+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xenc"
  	]
  },
  	"application/xhtml+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xhtml",
  		"xht"
  	]
  },
  	"application/xhtml-voice+xml": {
  	source: "apache",
  	compressible: true
  },
  	"application/xliff+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xlf"
  	]
  },
  	"application/xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xml",
  		"xsl",
  		"xsd",
  		"rng"
  	]
  },
  	"application/xml-dtd": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dtd"
  	]
  },
  	"application/xml-external-parsed-entity": {
  	source: "iana"
  },
  	"application/xml-patch+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xmpp+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/xop+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xop"
  	]
  },
  	"application/xproc+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xpl"
  	]
  },
  	"application/xslt+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xsl",
  		"xslt"
  	]
  },
  	"application/xspf+xml": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"xspf"
  	]
  },
  	"application/xv+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"mxml",
  		"xhvml",
  		"xvml",
  		"xvm"
  	]
  },
  	"application/yang": {
  	source: "iana",
  	extensions: [
  		"yang"
  	]
  },
  	"application/yang-data+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/yang-data+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/yang-patch+json": {
  	source: "iana",
  	compressible: true
  },
  	"application/yang-patch+xml": {
  	source: "iana",
  	compressible: true
  },
  	"application/yin+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"yin"
  	]
  },
  	"application/zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"zip"
  	]
  },
  	"application/zlib": {
  	source: "iana"
  },
  	"application/zstd": {
  	source: "iana"
  },
  	"audio/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"audio/32kadpcm": {
  	source: "iana"
  },
  	"audio/3gpp": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"3gpp"
  	]
  },
  	"audio/3gpp2": {
  	source: "iana"
  },
  	"audio/aac": {
  	source: "iana"
  },
  	"audio/ac3": {
  	source: "iana"
  },
  	"audio/adpcm": {
  	source: "apache",
  	extensions: [
  		"adp"
  	]
  },
  	"audio/amr": {
  	source: "iana",
  	extensions: [
  		"amr"
  	]
  },
  	"audio/amr-wb": {
  	source: "iana"
  },
  	"audio/amr-wb+": {
  	source: "iana"
  },
  	"audio/aptx": {
  	source: "iana"
  },
  	"audio/asc": {
  	source: "iana"
  },
  	"audio/atrac-advanced-lossless": {
  	source: "iana"
  },
  	"audio/atrac-x": {
  	source: "iana"
  },
  	"audio/atrac3": {
  	source: "iana"
  },
  	"audio/basic": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"au",
  		"snd"
  	]
  },
  	"audio/bv16": {
  	source: "iana"
  },
  	"audio/bv32": {
  	source: "iana"
  },
  	"audio/clearmode": {
  	source: "iana"
  },
  	"audio/cn": {
  	source: "iana"
  },
  	"audio/dat12": {
  	source: "iana"
  },
  	"audio/dls": {
  	source: "iana"
  },
  	"audio/dsr-es201108": {
  	source: "iana"
  },
  	"audio/dsr-es202050": {
  	source: "iana"
  },
  	"audio/dsr-es202211": {
  	source: "iana"
  },
  	"audio/dsr-es202212": {
  	source: "iana"
  },
  	"audio/dv": {
  	source: "iana"
  },
  	"audio/dvi4": {
  	source: "iana"
  },
  	"audio/eac3": {
  	source: "iana"
  },
  	"audio/encaprtp": {
  	source: "iana"
  },
  	"audio/evrc": {
  	source: "iana"
  },
  	"audio/evrc-qcp": {
  	source: "iana"
  },
  	"audio/evrc0": {
  	source: "iana"
  },
  	"audio/evrc1": {
  	source: "iana"
  },
  	"audio/evrcb": {
  	source: "iana"
  },
  	"audio/evrcb0": {
  	source: "iana"
  },
  	"audio/evrcb1": {
  	source: "iana"
  },
  	"audio/evrcnw": {
  	source: "iana"
  },
  	"audio/evrcnw0": {
  	source: "iana"
  },
  	"audio/evrcnw1": {
  	source: "iana"
  },
  	"audio/evrcwb": {
  	source: "iana"
  },
  	"audio/evrcwb0": {
  	source: "iana"
  },
  	"audio/evrcwb1": {
  	source: "iana"
  },
  	"audio/evs": {
  	source: "iana"
  },
  	"audio/flexfec": {
  	source: "iana"
  },
  	"audio/fwdred": {
  	source: "iana"
  },
  	"audio/g711-0": {
  	source: "iana"
  },
  	"audio/g719": {
  	source: "iana"
  },
  	"audio/g722": {
  	source: "iana"
  },
  	"audio/g7221": {
  	source: "iana"
  },
  	"audio/g723": {
  	source: "iana"
  },
  	"audio/g726-16": {
  	source: "iana"
  },
  	"audio/g726-24": {
  	source: "iana"
  },
  	"audio/g726-32": {
  	source: "iana"
  },
  	"audio/g726-40": {
  	source: "iana"
  },
  	"audio/g728": {
  	source: "iana"
  },
  	"audio/g729": {
  	source: "iana"
  },
  	"audio/g7291": {
  	source: "iana"
  },
  	"audio/g729d": {
  	source: "iana"
  },
  	"audio/g729e": {
  	source: "iana"
  },
  	"audio/gsm": {
  	source: "iana"
  },
  	"audio/gsm-efr": {
  	source: "iana"
  },
  	"audio/gsm-hr-08": {
  	source: "iana"
  },
  	"audio/ilbc": {
  	source: "iana"
  },
  	"audio/ip-mr_v2.5": {
  	source: "iana"
  },
  	"audio/isac": {
  	source: "apache"
  },
  	"audio/l16": {
  	source: "iana"
  },
  	"audio/l20": {
  	source: "iana"
  },
  	"audio/l24": {
  	source: "iana",
  	compressible: false
  },
  	"audio/l8": {
  	source: "iana"
  },
  	"audio/lpc": {
  	source: "iana"
  },
  	"audio/melp": {
  	source: "iana"
  },
  	"audio/melp1200": {
  	source: "iana"
  },
  	"audio/melp2400": {
  	source: "iana"
  },
  	"audio/melp600": {
  	source: "iana"
  },
  	"audio/mhas": {
  	source: "iana"
  },
  	"audio/midi": {
  	source: "apache",
  	extensions: [
  		"mid",
  		"midi",
  		"kar",
  		"rmi"
  	]
  },
  	"audio/mobile-xmf": {
  	source: "iana",
  	extensions: [
  		"mxmf"
  	]
  },
  	"audio/mp3": {
  	compressible: false,
  	extensions: [
  		"mp3"
  	]
  },
  	"audio/mp4": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"m4a",
  		"mp4a"
  	]
  },
  	"audio/mp4a-latm": {
  	source: "iana"
  },
  	"audio/mpa": {
  	source: "iana"
  },
  	"audio/mpa-robust": {
  	source: "iana"
  },
  	"audio/mpeg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"mpga",
  		"mp2",
  		"mp2a",
  		"mp3",
  		"m2a",
  		"m3a"
  	]
  },
  	"audio/mpeg4-generic": {
  	source: "iana"
  },
  	"audio/musepack": {
  	source: "apache"
  },
  	"audio/ogg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"oga",
  		"ogg",
  		"spx",
  		"opus"
  	]
  },
  	"audio/opus": {
  	source: "iana"
  },
  	"audio/parityfec": {
  	source: "iana"
  },
  	"audio/pcma": {
  	source: "iana"
  },
  	"audio/pcma-wb": {
  	source: "iana"
  },
  	"audio/pcmu": {
  	source: "iana"
  },
  	"audio/pcmu-wb": {
  	source: "iana"
  },
  	"audio/prs.sid": {
  	source: "iana"
  },
  	"audio/qcelp": {
  	source: "iana"
  },
  	"audio/raptorfec": {
  	source: "iana"
  },
  	"audio/red": {
  	source: "iana"
  },
  	"audio/rtp-enc-aescm128": {
  	source: "iana"
  },
  	"audio/rtp-midi": {
  	source: "iana"
  },
  	"audio/rtploopback": {
  	source: "iana"
  },
  	"audio/rtx": {
  	source: "iana"
  },
  	"audio/s3m": {
  	source: "apache",
  	extensions: [
  		"s3m"
  	]
  },
  	"audio/scip": {
  	source: "iana"
  },
  	"audio/silk": {
  	source: "apache",
  	extensions: [
  		"sil"
  	]
  },
  	"audio/smv": {
  	source: "iana"
  },
  	"audio/smv-qcp": {
  	source: "iana"
  },
  	"audio/smv0": {
  	source: "iana"
  },
  	"audio/sofa": {
  	source: "iana"
  },
  	"audio/sp-midi": {
  	source: "iana"
  },
  	"audio/speex": {
  	source: "iana"
  },
  	"audio/t140c": {
  	source: "iana"
  },
  	"audio/t38": {
  	source: "iana"
  },
  	"audio/telephone-event": {
  	source: "iana"
  },
  	"audio/tetra_acelp": {
  	source: "iana"
  },
  	"audio/tetra_acelp_bb": {
  	source: "iana"
  },
  	"audio/tone": {
  	source: "iana"
  },
  	"audio/tsvcis": {
  	source: "iana"
  },
  	"audio/uemclip": {
  	source: "iana"
  },
  	"audio/ulpfec": {
  	source: "iana"
  },
  	"audio/usac": {
  	source: "iana"
  },
  	"audio/vdvi": {
  	source: "iana"
  },
  	"audio/vmr-wb": {
  	source: "iana"
  },
  	"audio/vnd.3gpp.iufp": {
  	source: "iana"
  },
  	"audio/vnd.4sb": {
  	source: "iana"
  },
  	"audio/vnd.audiokoz": {
  	source: "iana"
  },
  	"audio/vnd.celp": {
  	source: "iana"
  },
  	"audio/vnd.cisco.nse": {
  	source: "iana"
  },
  	"audio/vnd.cmles.radio-events": {
  	source: "iana"
  },
  	"audio/vnd.cns.anp1": {
  	source: "iana"
  },
  	"audio/vnd.cns.inf1": {
  	source: "iana"
  },
  	"audio/vnd.dece.audio": {
  	source: "iana",
  	extensions: [
  		"uva",
  		"uvva"
  	]
  },
  	"audio/vnd.digital-winds": {
  	source: "iana",
  	extensions: [
  		"eol"
  	]
  },
  	"audio/vnd.dlna.adts": {
  	source: "iana"
  },
  	"audio/vnd.dolby.heaac.1": {
  	source: "iana"
  },
  	"audio/vnd.dolby.heaac.2": {
  	source: "iana"
  },
  	"audio/vnd.dolby.mlp": {
  	source: "iana"
  },
  	"audio/vnd.dolby.mps": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pl2": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pl2x": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pl2z": {
  	source: "iana"
  },
  	"audio/vnd.dolby.pulse.1": {
  	source: "iana"
  },
  	"audio/vnd.dra": {
  	source: "iana",
  	extensions: [
  		"dra"
  	]
  },
  	"audio/vnd.dts": {
  	source: "iana",
  	extensions: [
  		"dts"
  	]
  },
  	"audio/vnd.dts.hd": {
  	source: "iana",
  	extensions: [
  		"dtshd"
  	]
  },
  	"audio/vnd.dts.uhd": {
  	source: "iana"
  },
  	"audio/vnd.dvb.file": {
  	source: "iana"
  },
  	"audio/vnd.everad.plj": {
  	source: "iana"
  },
  	"audio/vnd.hns.audio": {
  	source: "iana"
  },
  	"audio/vnd.lucent.voice": {
  	source: "iana",
  	extensions: [
  		"lvp"
  	]
  },
  	"audio/vnd.ms-playready.media.pya": {
  	source: "iana",
  	extensions: [
  		"pya"
  	]
  },
  	"audio/vnd.nokia.mobile-xmf": {
  	source: "iana"
  },
  	"audio/vnd.nortel.vbk": {
  	source: "iana"
  },
  	"audio/vnd.nuera.ecelp4800": {
  	source: "iana",
  	extensions: [
  		"ecelp4800"
  	]
  },
  	"audio/vnd.nuera.ecelp7470": {
  	source: "iana",
  	extensions: [
  		"ecelp7470"
  	]
  },
  	"audio/vnd.nuera.ecelp9600": {
  	source: "iana",
  	extensions: [
  		"ecelp9600"
  	]
  },
  	"audio/vnd.octel.sbc": {
  	source: "iana"
  },
  	"audio/vnd.presonus.multitrack": {
  	source: "iana"
  },
  	"audio/vnd.qcelp": {
  	source: "iana"
  },
  	"audio/vnd.rhetorex.32kadpcm": {
  	source: "iana"
  },
  	"audio/vnd.rip": {
  	source: "iana",
  	extensions: [
  		"rip"
  	]
  },
  	"audio/vnd.rn-realaudio": {
  	compressible: false
  },
  	"audio/vnd.sealedmedia.softseal.mpeg": {
  	source: "iana"
  },
  	"audio/vnd.vmx.cvsd": {
  	source: "iana"
  },
  	"audio/vnd.wave": {
  	compressible: false
  },
  	"audio/vorbis": {
  	source: "iana",
  	compressible: false
  },
  	"audio/vorbis-config": {
  	source: "iana"
  },
  	"audio/wav": {
  	compressible: false,
  	extensions: [
  		"wav"
  	]
  },
  	"audio/wave": {
  	compressible: false,
  	extensions: [
  		"wav"
  	]
  },
  	"audio/webm": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"weba"
  	]
  },
  	"audio/x-aac": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"aac"
  	]
  },
  	"audio/x-aiff": {
  	source: "apache",
  	extensions: [
  		"aif",
  		"aiff",
  		"aifc"
  	]
  },
  	"audio/x-caf": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"caf"
  	]
  },
  	"audio/x-flac": {
  	source: "apache",
  	extensions: [
  		"flac"
  	]
  },
  	"audio/x-m4a": {
  	source: "nginx",
  	extensions: [
  		"m4a"
  	]
  },
  	"audio/x-matroska": {
  	source: "apache",
  	extensions: [
  		"mka"
  	]
  },
  	"audio/x-mpegurl": {
  	source: "apache",
  	extensions: [
  		"m3u"
  	]
  },
  	"audio/x-ms-wax": {
  	source: "apache",
  	extensions: [
  		"wax"
  	]
  },
  	"audio/x-ms-wma": {
  	source: "apache",
  	extensions: [
  		"wma"
  	]
  },
  	"audio/x-pn-realaudio": {
  	source: "apache",
  	extensions: [
  		"ram",
  		"ra"
  	]
  },
  	"audio/x-pn-realaudio-plugin": {
  	source: "apache",
  	extensions: [
  		"rmp"
  	]
  },
  	"audio/x-realaudio": {
  	source: "nginx",
  	extensions: [
  		"ra"
  	]
  },
  	"audio/x-tta": {
  	source: "apache"
  },
  	"audio/x-wav": {
  	source: "apache",
  	extensions: [
  		"wav"
  	]
  },
  	"audio/xm": {
  	source: "apache",
  	extensions: [
  		"xm"
  	]
  },
  	"chemical/x-cdx": {
  	source: "apache",
  	extensions: [
  		"cdx"
  	]
  },
  	"chemical/x-cif": {
  	source: "apache",
  	extensions: [
  		"cif"
  	]
  },
  	"chemical/x-cmdf": {
  	source: "apache",
  	extensions: [
  		"cmdf"
  	]
  },
  	"chemical/x-cml": {
  	source: "apache",
  	extensions: [
  		"cml"
  	]
  },
  	"chemical/x-csml": {
  	source: "apache",
  	extensions: [
  		"csml"
  	]
  },
  	"chemical/x-pdb": {
  	source: "apache"
  },
  	"chemical/x-xyz": {
  	source: "apache",
  	extensions: [
  		"xyz"
  	]
  },
  	"font/collection": {
  	source: "iana",
  	extensions: [
  		"ttc"
  	]
  },
  	"font/otf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"otf"
  	]
  },
  	"font/sfnt": {
  	source: "iana"
  },
  	"font/ttf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ttf"
  	]
  },
  	"font/woff": {
  	source: "iana",
  	extensions: [
  		"woff"
  	]
  },
  	"font/woff2": {
  	source: "iana",
  	extensions: [
  		"woff2"
  	]
  },
  	"image/aces": {
  	source: "iana",
  	extensions: [
  		"exr"
  	]
  },
  	"image/apng": {
  	compressible: false,
  	extensions: [
  		"apng"
  	]
  },
  	"image/avci": {
  	source: "iana",
  	extensions: [
  		"avci"
  	]
  },
  	"image/avcs": {
  	source: "iana",
  	extensions: [
  		"avcs"
  	]
  },
  	"image/avif": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"avif"
  	]
  },
  	"image/bmp": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"bmp"
  	]
  },
  	"image/cgm": {
  	source: "iana",
  	extensions: [
  		"cgm"
  	]
  },
  	"image/dicom-rle": {
  	source: "iana",
  	extensions: [
  		"drle"
  	]
  },
  	"image/emf": {
  	source: "iana",
  	extensions: [
  		"emf"
  	]
  },
  	"image/fits": {
  	source: "iana",
  	extensions: [
  		"fits"
  	]
  },
  	"image/g3fax": {
  	source: "iana",
  	extensions: [
  		"g3"
  	]
  },
  	"image/gif": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"gif"
  	]
  },
  	"image/heic": {
  	source: "iana",
  	extensions: [
  		"heic"
  	]
  },
  	"image/heic-sequence": {
  	source: "iana",
  	extensions: [
  		"heics"
  	]
  },
  	"image/heif": {
  	source: "iana",
  	extensions: [
  		"heif"
  	]
  },
  	"image/heif-sequence": {
  	source: "iana",
  	extensions: [
  		"heifs"
  	]
  },
  	"image/hej2k": {
  	source: "iana",
  	extensions: [
  		"hej2"
  	]
  },
  	"image/hsj2": {
  	source: "iana",
  	extensions: [
  		"hsj2"
  	]
  },
  	"image/ief": {
  	source: "iana",
  	extensions: [
  		"ief"
  	]
  },
  	"image/jls": {
  	source: "iana",
  	extensions: [
  		"jls"
  	]
  },
  	"image/jp2": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jp2",
  		"jpg2"
  	]
  },
  	"image/jpeg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jpeg",
  		"jpg",
  		"jpe"
  	]
  },
  	"image/jph": {
  	source: "iana",
  	extensions: [
  		"jph"
  	]
  },
  	"image/jphc": {
  	source: "iana",
  	extensions: [
  		"jhc"
  	]
  },
  	"image/jpm": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jpm"
  	]
  },
  	"image/jpx": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"jpx",
  		"jpf"
  	]
  },
  	"image/jxr": {
  	source: "iana",
  	extensions: [
  		"jxr"
  	]
  },
  	"image/jxra": {
  	source: "iana",
  	extensions: [
  		"jxra"
  	]
  },
  	"image/jxrs": {
  	source: "iana",
  	extensions: [
  		"jxrs"
  	]
  },
  	"image/jxs": {
  	source: "iana",
  	extensions: [
  		"jxs"
  	]
  },
  	"image/jxsc": {
  	source: "iana",
  	extensions: [
  		"jxsc"
  	]
  },
  	"image/jxsi": {
  	source: "iana",
  	extensions: [
  		"jxsi"
  	]
  },
  	"image/jxss": {
  	source: "iana",
  	extensions: [
  		"jxss"
  	]
  },
  	"image/ktx": {
  	source: "iana",
  	extensions: [
  		"ktx"
  	]
  },
  	"image/ktx2": {
  	source: "iana",
  	extensions: [
  		"ktx2"
  	]
  },
  	"image/naplps": {
  	source: "iana"
  },
  	"image/pjpeg": {
  	compressible: false
  },
  	"image/png": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"png"
  	]
  },
  	"image/prs.btif": {
  	source: "iana",
  	extensions: [
  		"btif"
  	]
  },
  	"image/prs.pti": {
  	source: "iana",
  	extensions: [
  		"pti"
  	]
  },
  	"image/pwg-raster": {
  	source: "iana"
  },
  	"image/sgi": {
  	source: "apache",
  	extensions: [
  		"sgi"
  	]
  },
  	"image/svg+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"svg",
  		"svgz"
  	]
  },
  	"image/t38": {
  	source: "iana",
  	extensions: [
  		"t38"
  	]
  },
  	"image/tiff": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"tif",
  		"tiff"
  	]
  },
  	"image/tiff-fx": {
  	source: "iana",
  	extensions: [
  		"tfx"
  	]
  },
  	"image/vnd.adobe.photoshop": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"psd"
  	]
  },
  	"image/vnd.airzip.accelerator.azv": {
  	source: "iana",
  	extensions: [
  		"azv"
  	]
  },
  	"image/vnd.cns.inf2": {
  	source: "iana"
  },
  	"image/vnd.dece.graphic": {
  	source: "iana",
  	extensions: [
  		"uvi",
  		"uvvi",
  		"uvg",
  		"uvvg"
  	]
  },
  	"image/vnd.djvu": {
  	source: "iana",
  	extensions: [
  		"djvu",
  		"djv"
  	]
  },
  	"image/vnd.dvb.subtitle": {
  	source: "iana",
  	extensions: [
  		"sub"
  	]
  },
  	"image/vnd.dwg": {
  	source: "iana",
  	extensions: [
  		"dwg"
  	]
  },
  	"image/vnd.dxf": {
  	source: "iana",
  	extensions: [
  		"dxf"
  	]
  },
  	"image/vnd.fastbidsheet": {
  	source: "iana",
  	extensions: [
  		"fbs"
  	]
  },
  	"image/vnd.fpx": {
  	source: "iana",
  	extensions: [
  		"fpx"
  	]
  },
  	"image/vnd.fst": {
  	source: "iana",
  	extensions: [
  		"fst"
  	]
  },
  	"image/vnd.fujixerox.edmics-mmr": {
  	source: "iana",
  	extensions: [
  		"mmr"
  	]
  },
  	"image/vnd.fujixerox.edmics-rlc": {
  	source: "iana",
  	extensions: [
  		"rlc"
  	]
  },
  	"image/vnd.globalgraphics.pgb": {
  	source: "iana"
  },
  	"image/vnd.microsoft.icon": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"ico"
  	]
  },
  	"image/vnd.mix": {
  	source: "iana"
  },
  	"image/vnd.mozilla.apng": {
  	source: "iana"
  },
  	"image/vnd.ms-dds": {
  	compressible: true,
  	extensions: [
  		"dds"
  	]
  },
  	"image/vnd.ms-modi": {
  	source: "iana",
  	extensions: [
  		"mdi"
  	]
  },
  	"image/vnd.ms-photo": {
  	source: "apache",
  	extensions: [
  		"wdp"
  	]
  },
  	"image/vnd.net-fpx": {
  	source: "iana",
  	extensions: [
  		"npx"
  	]
  },
  	"image/vnd.pco.b16": {
  	source: "iana",
  	extensions: [
  		"b16"
  	]
  },
  	"image/vnd.radiance": {
  	source: "iana"
  },
  	"image/vnd.sealed.png": {
  	source: "iana"
  },
  	"image/vnd.sealedmedia.softseal.gif": {
  	source: "iana"
  },
  	"image/vnd.sealedmedia.softseal.jpg": {
  	source: "iana"
  },
  	"image/vnd.svf": {
  	source: "iana"
  },
  	"image/vnd.tencent.tap": {
  	source: "iana",
  	extensions: [
  		"tap"
  	]
  },
  	"image/vnd.valve.source.texture": {
  	source: "iana",
  	extensions: [
  		"vtf"
  	]
  },
  	"image/vnd.wap.wbmp": {
  	source: "iana",
  	extensions: [
  		"wbmp"
  	]
  },
  	"image/vnd.xiff": {
  	source: "iana",
  	extensions: [
  		"xif"
  	]
  },
  	"image/vnd.zbrush.pcx": {
  	source: "iana",
  	extensions: [
  		"pcx"
  	]
  },
  	"image/webp": {
  	source: "apache",
  	extensions: [
  		"webp"
  	]
  },
  	"image/wmf": {
  	source: "iana",
  	extensions: [
  		"wmf"
  	]
  },
  	"image/x-3ds": {
  	source: "apache",
  	extensions: [
  		"3ds"
  	]
  },
  	"image/x-cmu-raster": {
  	source: "apache",
  	extensions: [
  		"ras"
  	]
  },
  	"image/x-cmx": {
  	source: "apache",
  	extensions: [
  		"cmx"
  	]
  },
  	"image/x-freehand": {
  	source: "apache",
  	extensions: [
  		"fh",
  		"fhc",
  		"fh4",
  		"fh5",
  		"fh7"
  	]
  },
  	"image/x-icon": {
  	source: "apache",
  	compressible: true,
  	extensions: [
  		"ico"
  	]
  },
  	"image/x-jng": {
  	source: "nginx",
  	extensions: [
  		"jng"
  	]
  },
  	"image/x-mrsid-image": {
  	source: "apache",
  	extensions: [
  		"sid"
  	]
  },
  	"image/x-ms-bmp": {
  	source: "nginx",
  	compressible: true,
  	extensions: [
  		"bmp"
  	]
  },
  	"image/x-pcx": {
  	source: "apache",
  	extensions: [
  		"pcx"
  	]
  },
  	"image/x-pict": {
  	source: "apache",
  	extensions: [
  		"pic",
  		"pct"
  	]
  },
  	"image/x-portable-anymap": {
  	source: "apache",
  	extensions: [
  		"pnm"
  	]
  },
  	"image/x-portable-bitmap": {
  	source: "apache",
  	extensions: [
  		"pbm"
  	]
  },
  	"image/x-portable-graymap": {
  	source: "apache",
  	extensions: [
  		"pgm"
  	]
  },
  	"image/x-portable-pixmap": {
  	source: "apache",
  	extensions: [
  		"ppm"
  	]
  },
  	"image/x-rgb": {
  	source: "apache",
  	extensions: [
  		"rgb"
  	]
  },
  	"image/x-tga": {
  	source: "apache",
  	extensions: [
  		"tga"
  	]
  },
  	"image/x-xbitmap": {
  	source: "apache",
  	extensions: [
  		"xbm"
  	]
  },
  	"image/x-xcf": {
  	compressible: false
  },
  	"image/x-xpixmap": {
  	source: "apache",
  	extensions: [
  		"xpm"
  	]
  },
  	"image/x-xwindowdump": {
  	source: "apache",
  	extensions: [
  		"xwd"
  	]
  },
  	"message/cpim": {
  	source: "iana"
  },
  	"message/delivery-status": {
  	source: "iana"
  },
  	"message/disposition-notification": {
  	source: "iana",
  	extensions: [
  		"disposition-notification"
  	]
  },
  	"message/external-body": {
  	source: "iana"
  },
  	"message/feedback-report": {
  	source: "iana"
  },
  	"message/global": {
  	source: "iana",
  	extensions: [
  		"u8msg"
  	]
  },
  	"message/global-delivery-status": {
  	source: "iana",
  	extensions: [
  		"u8dsn"
  	]
  },
  	"message/global-disposition-notification": {
  	source: "iana",
  	extensions: [
  		"u8mdn"
  	]
  },
  	"message/global-headers": {
  	source: "iana",
  	extensions: [
  		"u8hdr"
  	]
  },
  	"message/http": {
  	source: "iana",
  	compressible: false
  },
  	"message/imdn+xml": {
  	source: "iana",
  	compressible: true
  },
  	"message/news": {
  	source: "iana"
  },
  	"message/partial": {
  	source: "iana",
  	compressible: false
  },
  	"message/rfc822": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"eml",
  		"mime"
  	]
  },
  	"message/s-http": {
  	source: "iana"
  },
  	"message/sip": {
  	source: "iana"
  },
  	"message/sipfrag": {
  	source: "iana"
  },
  	"message/tracking-status": {
  	source: "iana"
  },
  	"message/vnd.si.simp": {
  	source: "iana"
  },
  	"message/vnd.wfa.wsc": {
  	source: "iana",
  	extensions: [
  		"wsc"
  	]
  },
  	"model/3mf": {
  	source: "iana",
  	extensions: [
  		"3mf"
  	]
  },
  	"model/e57": {
  	source: "iana"
  },
  	"model/gltf+json": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"gltf"
  	]
  },
  	"model/gltf-binary": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"glb"
  	]
  },
  	"model/iges": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"igs",
  		"iges"
  	]
  },
  	"model/mesh": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"msh",
  		"mesh",
  		"silo"
  	]
  },
  	"model/mtl": {
  	source: "iana",
  	extensions: [
  		"mtl"
  	]
  },
  	"model/obj": {
  	source: "iana",
  	extensions: [
  		"obj"
  	]
  },
  	"model/step": {
  	source: "iana"
  },
  	"model/step+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"stpx"
  	]
  },
  	"model/step+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"stpz"
  	]
  },
  	"model/step-xml+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"stpxz"
  	]
  },
  	"model/stl": {
  	source: "iana",
  	extensions: [
  		"stl"
  	]
  },
  	"model/vnd.collada+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"dae"
  	]
  },
  	"model/vnd.dwf": {
  	source: "iana",
  	extensions: [
  		"dwf"
  	]
  },
  	"model/vnd.flatland.3dml": {
  	source: "iana"
  },
  	"model/vnd.gdl": {
  	source: "iana",
  	extensions: [
  		"gdl"
  	]
  },
  	"model/vnd.gs-gdl": {
  	source: "apache"
  },
  	"model/vnd.gs.gdl": {
  	source: "iana"
  },
  	"model/vnd.gtw": {
  	source: "iana",
  	extensions: [
  		"gtw"
  	]
  },
  	"model/vnd.moml+xml": {
  	source: "iana",
  	compressible: true
  },
  	"model/vnd.mts": {
  	source: "iana",
  	extensions: [
  		"mts"
  	]
  },
  	"model/vnd.opengex": {
  	source: "iana",
  	extensions: [
  		"ogex"
  	]
  },
  	"model/vnd.parasolid.transmit.binary": {
  	source: "iana",
  	extensions: [
  		"x_b"
  	]
  },
  	"model/vnd.parasolid.transmit.text": {
  	source: "iana",
  	extensions: [
  		"x_t"
  	]
  },
  	"model/vnd.pytha.pyox": {
  	source: "iana"
  },
  	"model/vnd.rosette.annotated-data-model": {
  	source: "iana"
  },
  	"model/vnd.sap.vds": {
  	source: "iana",
  	extensions: [
  		"vds"
  	]
  },
  	"model/vnd.usdz+zip": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"usdz"
  	]
  },
  	"model/vnd.valve.source.compiled-map": {
  	source: "iana",
  	extensions: [
  		"bsp"
  	]
  },
  	"model/vnd.vtu": {
  	source: "iana",
  	extensions: [
  		"vtu"
  	]
  },
  	"model/vrml": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"wrl",
  		"vrml"
  	]
  },
  	"model/x3d+binary": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"x3db",
  		"x3dbz"
  	]
  },
  	"model/x3d+fastinfoset": {
  	source: "iana",
  	extensions: [
  		"x3db"
  	]
  },
  	"model/x3d+vrml": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"x3dv",
  		"x3dvz"
  	]
  },
  	"model/x3d+xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"x3d",
  		"x3dz"
  	]
  },
  	"model/x3d-vrml": {
  	source: "iana",
  	extensions: [
  		"x3dv"
  	]
  },
  	"multipart/alternative": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/appledouble": {
  	source: "iana"
  },
  	"multipart/byteranges": {
  	source: "iana"
  },
  	"multipart/digest": {
  	source: "iana"
  },
  	"multipart/encrypted": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/form-data": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/header-set": {
  	source: "iana"
  },
  	"multipart/mixed": {
  	source: "iana"
  },
  	"multipart/multilingual": {
  	source: "iana"
  },
  	"multipart/parallel": {
  	source: "iana"
  },
  	"multipart/related": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/report": {
  	source: "iana"
  },
  	"multipart/signed": {
  	source: "iana",
  	compressible: false
  },
  	"multipart/vnd.bint.med-plus": {
  	source: "iana"
  },
  	"multipart/voice-message": {
  	source: "iana"
  },
  	"multipart/x-mixed-replace": {
  	source: "iana"
  },
  	"text/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"text/cache-manifest": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"appcache",
  		"manifest"
  	]
  },
  	"text/calendar": {
  	source: "iana",
  	extensions: [
  		"ics",
  		"ifb"
  	]
  },
  	"text/calender": {
  	compressible: true
  },
  	"text/cmd": {
  	compressible: true
  },
  	"text/coffeescript": {
  	extensions: [
  		"coffee",
  		"litcoffee"
  	]
  },
  	"text/cql": {
  	source: "iana"
  },
  	"text/cql-expression": {
  	source: "iana"
  },
  	"text/cql-identifier": {
  	source: "iana"
  },
  	"text/css": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"css"
  	]
  },
  	"text/csv": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"csv"
  	]
  },
  	"text/csv-schema": {
  	source: "iana"
  },
  	"text/directory": {
  	source: "iana"
  },
  	"text/dns": {
  	source: "iana"
  },
  	"text/ecmascript": {
  	source: "iana"
  },
  	"text/encaprtp": {
  	source: "iana"
  },
  	"text/enriched": {
  	source: "iana"
  },
  	"text/fhirpath": {
  	source: "iana"
  },
  	"text/flexfec": {
  	source: "iana"
  },
  	"text/fwdred": {
  	source: "iana"
  },
  	"text/gff3": {
  	source: "iana"
  },
  	"text/grammar-ref-list": {
  	source: "iana"
  },
  	"text/html": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"html",
  		"htm",
  		"shtml"
  	]
  },
  	"text/jade": {
  	extensions: [
  		"jade"
  	]
  },
  	"text/javascript": {
  	source: "iana",
  	compressible: true
  },
  	"text/jcr-cnd": {
  	source: "iana"
  },
  	"text/jsx": {
  	compressible: true,
  	extensions: [
  		"jsx"
  	]
  },
  	"text/less": {
  	compressible: true,
  	extensions: [
  		"less"
  	]
  },
  	"text/markdown": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"markdown",
  		"md"
  	]
  },
  	"text/mathml": {
  	source: "nginx",
  	extensions: [
  		"mml"
  	]
  },
  	"text/mdx": {
  	compressible: true,
  	extensions: [
  		"mdx"
  	]
  },
  	"text/mizar": {
  	source: "iana"
  },
  	"text/n3": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"n3"
  	]
  },
  	"text/parameters": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/parityfec": {
  	source: "iana"
  },
  	"text/plain": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"txt",
  		"text",
  		"conf",
  		"def",
  		"list",
  		"log",
  		"in",
  		"ini"
  	]
  },
  	"text/provenance-notation": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/prs.fallenstein.rst": {
  	source: "iana"
  },
  	"text/prs.lines.tag": {
  	source: "iana",
  	extensions: [
  		"dsc"
  	]
  },
  	"text/prs.prop.logic": {
  	source: "iana"
  },
  	"text/raptorfec": {
  	source: "iana"
  },
  	"text/red": {
  	source: "iana"
  },
  	"text/rfc822-headers": {
  	source: "iana"
  },
  	"text/richtext": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rtx"
  	]
  },
  	"text/rtf": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"rtf"
  	]
  },
  	"text/rtp-enc-aescm128": {
  	source: "iana"
  },
  	"text/rtploopback": {
  	source: "iana"
  },
  	"text/rtx": {
  	source: "iana"
  },
  	"text/sgml": {
  	source: "iana",
  	extensions: [
  		"sgml",
  		"sgm"
  	]
  },
  	"text/shaclc": {
  	source: "iana"
  },
  	"text/shex": {
  	source: "iana",
  	extensions: [
  		"shex"
  	]
  },
  	"text/slim": {
  	extensions: [
  		"slim",
  		"slm"
  	]
  },
  	"text/spdx": {
  	source: "iana",
  	extensions: [
  		"spdx"
  	]
  },
  	"text/strings": {
  	source: "iana"
  },
  	"text/stylus": {
  	extensions: [
  		"stylus",
  		"styl"
  	]
  },
  	"text/t140": {
  	source: "iana"
  },
  	"text/tab-separated-values": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"tsv"
  	]
  },
  	"text/troff": {
  	source: "iana",
  	extensions: [
  		"t",
  		"tr",
  		"roff",
  		"man",
  		"me",
  		"ms"
  	]
  },
  	"text/turtle": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"ttl"
  	]
  },
  	"text/ulpfec": {
  	source: "iana"
  },
  	"text/uri-list": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"uri",
  		"uris",
  		"urls"
  	]
  },
  	"text/vcard": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"vcard"
  	]
  },
  	"text/vnd.a": {
  	source: "iana"
  },
  	"text/vnd.abc": {
  	source: "iana"
  },
  	"text/vnd.ascii-art": {
  	source: "iana"
  },
  	"text/vnd.curl": {
  	source: "iana",
  	extensions: [
  		"curl"
  	]
  },
  	"text/vnd.curl.dcurl": {
  	source: "apache",
  	extensions: [
  		"dcurl"
  	]
  },
  	"text/vnd.curl.mcurl": {
  	source: "apache",
  	extensions: [
  		"mcurl"
  	]
  },
  	"text/vnd.curl.scurl": {
  	source: "apache",
  	extensions: [
  		"scurl"
  	]
  },
  	"text/vnd.debian.copyright": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/vnd.dmclientscript": {
  	source: "iana"
  },
  	"text/vnd.dvb.subtitle": {
  	source: "iana",
  	extensions: [
  		"sub"
  	]
  },
  	"text/vnd.esmertec.theme-descriptor": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/vnd.familysearch.gedcom": {
  	source: "iana",
  	extensions: [
  		"ged"
  	]
  },
  	"text/vnd.ficlab.flt": {
  	source: "iana"
  },
  	"text/vnd.fly": {
  	source: "iana",
  	extensions: [
  		"fly"
  	]
  },
  	"text/vnd.fmi.flexstor": {
  	source: "iana",
  	extensions: [
  		"flx"
  	]
  },
  	"text/vnd.gml": {
  	source: "iana"
  },
  	"text/vnd.graphviz": {
  	source: "iana",
  	extensions: [
  		"gv"
  	]
  },
  	"text/vnd.hans": {
  	source: "iana"
  },
  	"text/vnd.hgl": {
  	source: "iana"
  },
  	"text/vnd.in3d.3dml": {
  	source: "iana",
  	extensions: [
  		"3dml"
  	]
  },
  	"text/vnd.in3d.spot": {
  	source: "iana",
  	extensions: [
  		"spot"
  	]
  },
  	"text/vnd.iptc.newsml": {
  	source: "iana"
  },
  	"text/vnd.iptc.nitf": {
  	source: "iana"
  },
  	"text/vnd.latex-z": {
  	source: "iana"
  },
  	"text/vnd.motorola.reflex": {
  	source: "iana"
  },
  	"text/vnd.ms-mediapackage": {
  	source: "iana"
  },
  	"text/vnd.net2phone.commcenter.command": {
  	source: "iana"
  },
  	"text/vnd.radisys.msml-basic-layout": {
  	source: "iana"
  },
  	"text/vnd.senx.warpscript": {
  	source: "iana"
  },
  	"text/vnd.si.uricatalogue": {
  	source: "iana"
  },
  	"text/vnd.sosi": {
  	source: "iana"
  },
  	"text/vnd.sun.j2me.app-descriptor": {
  	source: "iana",
  	charset: "UTF-8",
  	extensions: [
  		"jad"
  	]
  },
  	"text/vnd.trolltech.linguist": {
  	source: "iana",
  	charset: "UTF-8"
  },
  	"text/vnd.wap.si": {
  	source: "iana"
  },
  	"text/vnd.wap.sl": {
  	source: "iana"
  },
  	"text/vnd.wap.wml": {
  	source: "iana",
  	extensions: [
  		"wml"
  	]
  },
  	"text/vnd.wap.wmlscript": {
  	source: "iana",
  	extensions: [
  		"wmls"
  	]
  },
  	"text/vtt": {
  	source: "iana",
  	charset: "UTF-8",
  	compressible: true,
  	extensions: [
  		"vtt"
  	]
  },
  	"text/x-asm": {
  	source: "apache",
  	extensions: [
  		"s",
  		"asm"
  	]
  },
  	"text/x-c": {
  	source: "apache",
  	extensions: [
  		"c",
  		"cc",
  		"cxx",
  		"cpp",
  		"h",
  		"hh",
  		"dic"
  	]
  },
  	"text/x-component": {
  	source: "nginx",
  	extensions: [
  		"htc"
  	]
  },
  	"text/x-fortran": {
  	source: "apache",
  	extensions: [
  		"f",
  		"for",
  		"f77",
  		"f90"
  	]
  },
  	"text/x-gwt-rpc": {
  	compressible: true
  },
  	"text/x-handlebars-template": {
  	extensions: [
  		"hbs"
  	]
  },
  	"text/x-java-source": {
  	source: "apache",
  	extensions: [
  		"java"
  	]
  },
  	"text/x-jquery-tmpl": {
  	compressible: true
  },
  	"text/x-lua": {
  	extensions: [
  		"lua"
  	]
  },
  	"text/x-markdown": {
  	compressible: true,
  	extensions: [
  		"mkd"
  	]
  },
  	"text/x-nfo": {
  	source: "apache",
  	extensions: [
  		"nfo"
  	]
  },
  	"text/x-opml": {
  	source: "apache",
  	extensions: [
  		"opml"
  	]
  },
  	"text/x-org": {
  	compressible: true,
  	extensions: [
  		"org"
  	]
  },
  	"text/x-pascal": {
  	source: "apache",
  	extensions: [
  		"p",
  		"pas"
  	]
  },
  	"text/x-processing": {
  	compressible: true,
  	extensions: [
  		"pde"
  	]
  },
  	"text/x-sass": {
  	extensions: [
  		"sass"
  	]
  },
  	"text/x-scss": {
  	extensions: [
  		"scss"
  	]
  },
  	"text/x-setext": {
  	source: "apache",
  	extensions: [
  		"etx"
  	]
  },
  	"text/x-sfv": {
  	source: "apache",
  	extensions: [
  		"sfv"
  	]
  },
  	"text/x-suse-ymp": {
  	compressible: true,
  	extensions: [
  		"ymp"
  	]
  },
  	"text/x-uuencode": {
  	source: "apache",
  	extensions: [
  		"uu"
  	]
  },
  	"text/x-vcalendar": {
  	source: "apache",
  	extensions: [
  		"vcs"
  	]
  },
  	"text/x-vcard": {
  	source: "apache",
  	extensions: [
  		"vcf"
  	]
  },
  	"text/xml": {
  	source: "iana",
  	compressible: true,
  	extensions: [
  		"xml"
  	]
  },
  	"text/xml-external-parsed-entity": {
  	source: "iana"
  },
  	"text/yaml": {
  	compressible: true,
  	extensions: [
  		"yaml",
  		"yml"
  	]
  },
  	"video/1d-interleaved-parityfec": {
  	source: "iana"
  },
  	"video/3gpp": {
  	source: "iana",
  	extensions: [
  		"3gp",
  		"3gpp"
  	]
  },
  	"video/3gpp-tt": {
  	source: "iana"
  },
  	"video/3gpp2": {
  	source: "iana",
  	extensions: [
  		"3g2"
  	]
  },
  	"video/av1": {
  	source: "iana"
  },
  	"video/bmpeg": {
  	source: "iana"
  },
  	"video/bt656": {
  	source: "iana"
  },
  	"video/celb": {
  	source: "iana"
  },
  	"video/dv": {
  	source: "iana"
  },
  	"video/encaprtp": {
  	source: "iana"
  },
  	"video/ffv1": {
  	source: "iana"
  },
  	"video/flexfec": {
  	source: "iana"
  },
  	"video/h261": {
  	source: "iana",
  	extensions: [
  		"h261"
  	]
  },
  	"video/h263": {
  	source: "iana",
  	extensions: [
  		"h263"
  	]
  },
  	"video/h263-1998": {
  	source: "iana"
  },
  	"video/h263-2000": {
  	source: "iana"
  },
  	"video/h264": {
  	source: "iana",
  	extensions: [
  		"h264"
  	]
  },
  	"video/h264-rcdo": {
  	source: "iana"
  },
  	"video/h264-svc": {
  	source: "iana"
  },
  	"video/h265": {
  	source: "iana"
  },
  	"video/iso.segment": {
  	source: "iana",
  	extensions: [
  		"m4s"
  	]
  },
  	"video/jpeg": {
  	source: "iana",
  	extensions: [
  		"jpgv"
  	]
  },
  	"video/jpeg2000": {
  	source: "iana"
  },
  	"video/jpm": {
  	source: "apache",
  	extensions: [
  		"jpm",
  		"jpgm"
  	]
  },
  	"video/jxsv": {
  	source: "iana"
  },
  	"video/mj2": {
  	source: "iana",
  	extensions: [
  		"mj2",
  		"mjp2"
  	]
  },
  	"video/mp1s": {
  	source: "iana"
  },
  	"video/mp2p": {
  	source: "iana"
  },
  	"video/mp2t": {
  	source: "iana",
  	extensions: [
  		"ts"
  	]
  },
  	"video/mp4": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"mp4",
  		"mp4v",
  		"mpg4"
  	]
  },
  	"video/mp4v-es": {
  	source: "iana"
  },
  	"video/mpeg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"mpeg",
  		"mpg",
  		"mpe",
  		"m1v",
  		"m2v"
  	]
  },
  	"video/mpeg4-generic": {
  	source: "iana"
  },
  	"video/mpv": {
  	source: "iana"
  },
  	"video/nv": {
  	source: "iana"
  },
  	"video/ogg": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"ogv"
  	]
  },
  	"video/parityfec": {
  	source: "iana"
  },
  	"video/pointer": {
  	source: "iana"
  },
  	"video/quicktime": {
  	source: "iana",
  	compressible: false,
  	extensions: [
  		"qt",
  		"mov"
  	]
  },
  	"video/raptorfec": {
  	source: "iana"
  },
  	"video/raw": {
  	source: "iana"
  },
  	"video/rtp-enc-aescm128": {
  	source: "iana"
  },
  	"video/rtploopback": {
  	source: "iana"
  },
  	"video/rtx": {
  	source: "iana"
  },
  	"video/scip": {
  	source: "iana"
  },
  	"video/smpte291": {
  	source: "iana"
  },
  	"video/smpte292m": {
  	source: "iana"
  },
  	"video/ulpfec": {
  	source: "iana"
  },
  	"video/vc1": {
  	source: "iana"
  },
  	"video/vc2": {
  	source: "iana"
  },
  	"video/vnd.cctv": {
  	source: "iana"
  },
  	"video/vnd.dece.hd": {
  	source: "iana",
  	extensions: [
  		"uvh",
  		"uvvh"
  	]
  },
  	"video/vnd.dece.mobile": {
  	source: "iana",
  	extensions: [
  		"uvm",
  		"uvvm"
  	]
  },
  	"video/vnd.dece.mp4": {
  	source: "iana"
  },
  	"video/vnd.dece.pd": {
  	source: "iana",
  	extensions: [
  		"uvp",
  		"uvvp"
  	]
  },
  	"video/vnd.dece.sd": {
  	source: "iana",
  	extensions: [
  		"uvs",
  		"uvvs"
  	]
  },
  	"video/vnd.dece.video": {
  	source: "iana",
  	extensions: [
  		"uvv",
  		"uvvv"
  	]
  },
  	"video/vnd.directv.mpeg": {
  	source: "iana"
  },
  	"video/vnd.directv.mpeg-tts": {
  	source: "iana"
  },
  	"video/vnd.dlna.mpeg-tts": {
  	source: "iana"
  },
  	"video/vnd.dvb.file": {
  	source: "iana",
  	extensions: [
  		"dvb"
  	]
  },
  	"video/vnd.fvt": {
  	source: "iana",
  	extensions: [
  		"fvt"
  	]
  },
  	"video/vnd.hns.video": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.1dparityfec-1010": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.1dparityfec-2005": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.2dparityfec-1010": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.2dparityfec-2005": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.ttsavc": {
  	source: "iana"
  },
  	"video/vnd.iptvforum.ttsmpeg2": {
  	source: "iana"
  },
  	"video/vnd.motorola.video": {
  	source: "iana"
  },
  	"video/vnd.motorola.videop": {
  	source: "iana"
  },
  	"video/vnd.mpegurl": {
  	source: "iana",
  	extensions: [
  		"mxu",
  		"m4u"
  	]
  },
  	"video/vnd.ms-playready.media.pyv": {
  	source: "iana",
  	extensions: [
  		"pyv"
  	]
  },
  	"video/vnd.nokia.interleaved-multimedia": {
  	source: "iana"
  },
  	"video/vnd.nokia.mp4vr": {
  	source: "iana"
  },
  	"video/vnd.nokia.videovoip": {
  	source: "iana"
  },
  	"video/vnd.objectvideo": {
  	source: "iana"
  },
  	"video/vnd.radgamettools.bink": {
  	source: "iana"
  },
  	"video/vnd.radgamettools.smacker": {
  	source: "iana"
  },
  	"video/vnd.sealed.mpeg1": {
  	source: "iana"
  },
  	"video/vnd.sealed.mpeg4": {
  	source: "iana"
  },
  	"video/vnd.sealed.swf": {
  	source: "iana"
  },
  	"video/vnd.sealedmedia.softseal.mov": {
  	source: "iana"
  },
  	"video/vnd.uvvu.mp4": {
  	source: "iana",
  	extensions: [
  		"uvu",
  		"uvvu"
  	]
  },
  	"video/vnd.vivo": {
  	source: "iana",
  	extensions: [
  		"viv"
  	]
  },
  	"video/vnd.youtube.yt": {
  	source: "iana"
  },
  	"video/vp8": {
  	source: "iana"
  },
  	"video/vp9": {
  	source: "iana"
  },
  	"video/webm": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"webm"
  	]
  },
  	"video/x-f4v": {
  	source: "apache",
  	extensions: [
  		"f4v"
  	]
  },
  	"video/x-fli": {
  	source: "apache",
  	extensions: [
  		"fli"
  	]
  },
  	"video/x-flv": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"flv"
  	]
  },
  	"video/x-m4v": {
  	source: "apache",
  	extensions: [
  		"m4v"
  	]
  },
  	"video/x-matroska": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"mkv",
  		"mk3d",
  		"mks"
  	]
  },
  	"video/x-mng": {
  	source: "apache",
  	extensions: [
  		"mng"
  	]
  },
  	"video/x-ms-asf": {
  	source: "apache",
  	extensions: [
  		"asf",
  		"asx"
  	]
  },
  	"video/x-ms-vob": {
  	source: "apache",
  	extensions: [
  		"vob"
  	]
  },
  	"video/x-ms-wm": {
  	source: "apache",
  	extensions: [
  		"wm"
  	]
  },
  	"video/x-ms-wmv": {
  	source: "apache",
  	compressible: false,
  	extensions: [
  		"wmv"
  	]
  },
  	"video/x-ms-wmx": {
  	source: "apache",
  	extensions: [
  		"wmx"
  	]
  },
  	"video/x-ms-wvx": {
  	source: "apache",
  	extensions: [
  		"wvx"
  	]
  },
  	"video/x-msvideo": {
  	source: "apache",
  	extensions: [
  		"avi"
  	]
  },
  	"video/x-sgi-movie": {
  	source: "apache",
  	extensions: [
  		"movie"
  	]
  },
  	"video/x-smv": {
  	source: "apache",
  	extensions: [
  		"smv"
  	]
  },
  	"x-conference/x-cooltalk": {
  	source: "apache",
  	extensions: [
  		"ice"
  	]
  },
  	"x-shader/x-fragment": {
  	compressible: true
  },
  	"x-shader/x-vertex": {
  	compressible: true
  }
  };

  /*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   */

  /**
   * Module exports.
   */

  var mimeDb = require$$0;

  /*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   */

  (function (exports) {

  	/**
  	 * Module dependencies.
  	 * @private
  	 */

  	var db = mimeDb;
  	var extname = require$$1$1.extname;

  	/**
  	 * Module variables.
  	 * @private
  	 */

  	var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
  	var TEXT_TYPE_REGEXP = /^text\//i;

  	/**
  	 * Module exports.
  	 * @public
  	 */

  	exports.charset = charset;
  	exports.charsets = { lookup: charset };
  	exports.contentType = contentType;
  	exports.extension = extension;
  	exports.extensions = Object.create(null);
  	exports.lookup = lookup;
  	exports.types = Object.create(null);

  	// Populate the extensions/types maps
  	populateMaps(exports.extensions, exports.types);

  	/**
  	 * Get the default charset for a MIME type.
  	 *
  	 * @param {string} type
  	 * @return {boolean|string}
  	 */

  	function charset (type) {
  	  if (!type || typeof type !== 'string') {
  	    return false
  	  }

  	  // TODO: use media-typer
  	  var match = EXTRACT_TYPE_REGEXP.exec(type);
  	  var mime = match && db[match[1].toLowerCase()];

  	  if (mime && mime.charset) {
  	    return mime.charset
  	  }

  	  // default text/* to utf-8
  	  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
  	    return 'UTF-8'
  	  }

  	  return false
  	}

  	/**
  	 * Create a full Content-Type header given a MIME type or extension.
  	 *
  	 * @param {string} str
  	 * @return {boolean|string}
  	 */

  	function contentType (str) {
  	  // TODO: should this even be in this module?
  	  if (!str || typeof str !== 'string') {
  	    return false
  	  }

  	  var mime = str.indexOf('/') === -1
  	    ? exports.lookup(str)
  	    : str;

  	  if (!mime) {
  	    return false
  	  }

  	  // TODO: use content-type or other module
  	  if (mime.indexOf('charset') === -1) {
  	    var charset = exports.charset(mime);
  	    if (charset) mime += '; charset=' + charset.toLowerCase();
  	  }

  	  return mime
  	}

  	/**
  	 * Get the default extension for a MIME type.
  	 *
  	 * @param {string} type
  	 * @return {boolean|string}
  	 */

  	function extension (type) {
  	  if (!type || typeof type !== 'string') {
  	    return false
  	  }

  	  // TODO: use media-typer
  	  var match = EXTRACT_TYPE_REGEXP.exec(type);

  	  // get extensions
  	  var exts = match && exports.extensions[match[1].toLowerCase()];

  	  if (!exts || !exts.length) {
  	    return false
  	  }

  	  return exts[0]
  	}

  	/**
  	 * Lookup the MIME type for a file path/extension.
  	 *
  	 * @param {string} path
  	 * @return {boolean|string}
  	 */

  	function lookup (path) {
  	  if (!path || typeof path !== 'string') {
  	    return false
  	  }

  	  // get the extension ("ext" or ".ext" or full path)
  	  var extension = extname('x.' + path)
  	    .toLowerCase()
  	    .substr(1);

  	  if (!extension) {
  	    return false
  	  }

  	  return exports.types[extension] || false
  	}

  	/**
  	 * Populate the extensions and types maps.
  	 * @private
  	 */

  	function populateMaps (extensions, types) {
  	  // source preference (least -> most)
  	  var preference = ['nginx', 'apache', undefined, 'iana'];

  	  Object.keys(db).forEach(function forEachMimeType (type) {
  	    var mime = db[type];
  	    var exts = mime.extensions;

  	    if (!exts || !exts.length) {
  	      return
  	    }

  	    // mime -> extensions
  	    extensions[type] = exts;

  	    // extension -> mime
  	    for (var i = 0; i < exts.length; i++) {
  	      var extension = exts[i];

  	      if (types[extension]) {
  	        var from = preference.indexOf(db[types[extension]].source);
  	        var to = preference.indexOf(mime.source);

  	        if (types[extension] !== 'application/octet-stream' &&
  	          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
  	          // skip the remapping
  	          continue
  	        }
  	      }

  	      // set the extension -> mime
  	      types[extension] = type;
  	    }
  	  });
  	} 
  } (mimeTypes));

  var defer_1 = defer$1;

  /**
   * Runs provided function on next iteration of the event loop
   *
   * @param {function} fn - function to run
   */
  function defer$1(fn)
  {
    var nextTick = typeof setImmediate == 'function'
      ? setImmediate
      : (
        typeof process == 'object' && typeof process.nextTick == 'function'
        ? process.nextTick
        : null
      );

    if (nextTick)
    {
      nextTick(fn);
    }
    else
    {
      setTimeout(fn, 0);
    }
  }

  var defer = defer_1;

  // API
  var async_1 = async$2;

  /**
   * Runs provided callback asynchronously
   * even if callback itself is not
   *
   * @param   {function} callback - callback to invoke
   * @returns {function} - augmented callback
   */
  function async$2(callback)
  {
    var isAsync = false;

    // check if async happened
    defer(function() { isAsync = true; });

    return function async_callback(err, result)
    {
      if (isAsync)
      {
        callback(err, result);
      }
      else
      {
        defer(function nextTick_callback()
        {
          callback(err, result);
        });
      }
    };
  }

  // API
  var abort_1 = abort$2;

  /**
   * Aborts leftover active jobs
   *
   * @param {object} state - current state object
   */
  function abort$2(state)
  {
    Object.keys(state.jobs).forEach(clean.bind(state));

    // reset leftover jobs
    state.jobs = {};
  }

  /**
   * Cleans up leftover job by invoking abort function for the provided job id
   *
   * @this  state
   * @param {string|number} key - job id to abort
   */
  function clean(key)
  {
    if (typeof this.jobs[key] == 'function')
    {
      this.jobs[key]();
    }
  }

  var async$1 = async_1
    , abort$1 = abort_1
    ;

  // API
  var iterate_1 = iterate$2;

  /**
   * Iterates over each job object
   *
   * @param {array|object} list - array or object (named list) to iterate over
   * @param {function} iterator - iterator to run
   * @param {object} state - current job status
   * @param {function} callback - invoked when all elements processed
   */
  function iterate$2(list, iterator, state, callback)
  {
    // store current index
    var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

    state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
    {
      // don't repeat yourself
      // skip secondary callbacks
      if (!(key in state.jobs))
      {
        return;
      }

      // clean up jobs
      delete state.jobs[key];

      if (error)
      {
        // don't process rest of the results
        // stop still active jobs
        // and reset the list
        abort$1(state);
      }
      else
      {
        state.results[key] = output;
      }

      // return salvaged results
      callback(error, state.results);
    });
  }

  /**
   * Runs iterator over provided job element
   *
   * @param   {function} iterator - iterator to invoke
   * @param   {string|number} key - key/index of the element in the list of jobs
   * @param   {mixed} item - job description
   * @param   {function} callback - invoked after iterator is done with the job
   * @returns {function|mixed} - job abort function or something else
   */
  function runJob(iterator, key, item, callback)
  {
    var aborter;

    // allow shortcut if iterator expects only two arguments
    if (iterator.length == 2)
    {
      aborter = iterator(item, async$1(callback));
    }
    // otherwise go with full three arguments
    else
    {
      aborter = iterator(item, key, async$1(callback));
    }

    return aborter;
  }

  // API
  var state_1 = state;

  /**
   * Creates initial state object
   * for iteration over list
   *
   * @param   {array|object} list - list to iterate over
   * @param   {function|null} sortMethod - function to use for keys sort,
   *                                     or `null` to keep them as is
   * @returns {object} - initial state object
   */
  function state(list, sortMethod)
  {
    var isNamedList = !Array.isArray(list)
      , initState =
      {
        index    : 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs     : {},
        results  : isNamedList ? {} : [],
        size     : isNamedList ? Object.keys(list).length : list.length
      }
      ;

    if (sortMethod)
    {
      // sort array keys based on it's values
      // sort object's keys just on own merit
      initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
      {
        return sortMethod(list[a], list[b]);
      });
    }

    return initState;
  }

  var abort = abort_1
    , async = async_1
    ;

  // API
  var terminator_1 = terminator$2;

  /**
   * Terminates jobs in the attached state context
   *
   * @this  AsyncKitState#
   * @param {function} callback - final callback to invoke after termination
   */
  function terminator$2(callback)
  {
    if (!Object.keys(this.jobs).length)
    {
      return;
    }

    // fast forward iteration index
    this.index = this.size;

    // abort jobs
    abort(this);

    // send back results we have so far
    async(callback)(null, this.results);
  }

  var iterate$1    = iterate_1
    , initState$1  = state_1
    , terminator$1 = terminator_1
    ;

  // Public API
  var parallel_1 = parallel;

  /**
   * Runs iterator over provided array elements in parallel
   *
   * @param   {array|object} list - array or object (named list) to iterate over
   * @param   {function} iterator - iterator to run
   * @param   {function} callback - invoked when all elements processed
   * @returns {function} - jobs terminator
   */
  function parallel(list, iterator, callback)
  {
    var state = initState$1(list);

    while (state.index < (state['keyedList'] || list).length)
    {
      iterate$1(list, iterator, state, function(error, result)
      {
        if (error)
        {
          callback(error, result);
          return;
        }

        // looks like it's the last one
        if (Object.keys(state.jobs).length === 0)
        {
          callback(null, state.results);
          return;
        }
      });

      state.index++;
    }

    return terminator$1.bind(state, callback);
  }

  var serialOrdered$2 = {exports: {}};

  var iterate    = iterate_1
    , initState  = state_1
    , terminator = terminator_1
    ;

  // Public API
  serialOrdered$2.exports = serialOrdered$1;
  // sorting helpers
  serialOrdered$2.exports.ascending  = ascending;
  serialOrdered$2.exports.descending = descending;

  /**
   * Runs iterator over provided sorted array elements in series
   *
   * @param   {array|object} list - array or object (named list) to iterate over
   * @param   {function} iterator - iterator to run
   * @param   {function} sortMethod - custom sort function
   * @param   {function} callback - invoked when all elements processed
   * @returns {function} - jobs terminator
   */
  function serialOrdered$1(list, iterator, sortMethod, callback)
  {
    var state = initState(list, sortMethod);

    iterate(list, iterator, state, function iteratorHandler(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      state.index++;

      // are we there yet?
      if (state.index < (state['keyedList'] || list).length)
      {
        iterate(list, iterator, state, iteratorHandler);
        return;
      }

      // done here
      callback(null, state.results);
    });

    return terminator.bind(state, callback);
  }

  /*
   * -- Sort methods
   */

  /**
   * sort helper to sort array elements in ascending order
   *
   * @param   {mixed} a - an item to compare
   * @param   {mixed} b - an item to compare
   * @returns {number} - comparison result
   */
  function ascending(a, b)
  {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /**
   * sort helper to sort array elements in descending order
   *
   * @param   {mixed} a - an item to compare
   * @param   {mixed} b - an item to compare
   * @returns {number} - comparison result
   */
  function descending(a, b)
  {
    return -1 * ascending(a, b);
  }

  var serialOrderedExports = serialOrdered$2.exports;

  var serialOrdered = serialOrderedExports;

  // Public API
  var serial_1 = serial;

  /**
   * Runs iterator over provided array elements in series
   *
   * @param   {array|object} list - array or object (named list) to iterate over
   * @param   {function} iterator - iterator to run
   * @param   {function} callback - invoked when all elements processed
   * @returns {function} - jobs terminator
   */
  function serial(list, iterator, callback)
  {
    return serialOrdered(list, iterator, null, callback);
  }

  var asynckit$1 =
  {
    parallel      : parallel_1,
    serial        : serial_1,
    serialOrdered : serialOrderedExports
  };

  // populates missing values
  var populate$1 = function(dst, src) {

    Object.keys(src).forEach(function(prop)
    {
      dst[prop] = dst[prop] || src[prop];
    });

    return dst;
  };

  var CombinedStream = combined_stream;
  var util = require$$1;
  var path = require$$1$1;
  var http$1 = require$$3;
  var https$1 = require$$4;
  var parseUrl$2 = require$$0$1.parse;
  var fs = require$$6;
  var Stream = stream.Stream;
  var mime = mimeTypes;
  var asynckit = asynckit$1;
  var populate = populate$1;

  // Public API
  var form_data = FormData$1;

  // make it a Stream
  util.inherits(FormData$1, CombinedStream);

  /**
   * Create readable "multipart/form-data" streams.
   * Can be used to submit forms
   * and file uploads to other web applications.
   *
   * @constructor
   * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
   */
  function FormData$1(options) {
    if (!(this instanceof FormData$1)) {
      return new FormData$1(options);
    }

    this._overheadLength = 0;
    this._valueLength = 0;
    this._valuesToMeasure = [];

    CombinedStream.call(this);

    options = options || {};
    for (var option in options) {
      this[option] = options[option];
    }
  }

  FormData$1.LINE_BREAK = '\r\n';
  FormData$1.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

  FormData$1.prototype.append = function(field, value, options) {

    options = options || {};

    // allow filename as single option
    if (typeof options == 'string') {
      options = {filename: options};
    }

    var append = CombinedStream.prototype.append.bind(this);

    // all that streamy business can't handle numbers
    if (typeof value == 'number') {
      value = '' + value;
    }

    // https://github.com/felixge/node-form-data/issues/38
    if (util.isArray(value)) {
      // Please convert your array into string
      // the way web server expects it
      this._error(new Error('Arrays are not supported.'));
      return;
    }

    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();

    append(header);
    append(value);
    append(footer);

    // pass along options.knownLength
    this._trackLength(header, value, options);
  };

  FormData$1.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;

    // used w/ getLengthSync(), when length is known.
    // e.g. for streaming directly from a remote server,
    // w/ a known file a size, and not wanting to wait for
    // incoming file to finish to get its size.
    if (options.knownLength != null) {
      valueLength += +options.knownLength;
    } else if (Buffer.isBuffer(value)) {
      valueLength = value.length;
    } else if (typeof value === 'string') {
      valueLength = Buffer.byteLength(value);
    }

    this._valueLength += valueLength;

    // @check why add CRLF? does this account for custom/multiple CRLFs?
    this._overheadLength +=
      Buffer.byteLength(header) +
      FormData$1.LINE_BREAK.length;

    // empty or either doesn't have path or not an http response or not a stream
    if (!value || ( !value.path && !(value.readable && value.hasOwnProperty('httpVersion')) && !(value instanceof Stream))) {
      return;
    }

    // no need to bother with the length
    if (!options.knownLength) {
      this._valuesToMeasure.push(value);
    }
  };

  FormData$1.prototype._lengthRetriever = function(value, callback) {

    if (value.hasOwnProperty('fd')) {

      // take read range into a account
      // `end` = Infinity –> read file till the end
      //
      // TODO: Looks like there is bug in Node fs.createReadStream
      // it doesn't respect `end` options without `start` options
      // Fix it when node fixes it.
      // https://github.com/joyent/node/issues/7819
      if (value.end != undefined && value.end != Infinity && value.start != undefined) {

        // when end specified
        // no need to calculate range
        // inclusive, starts with 0
        callback(null, value.end + 1 - (value.start ? value.start : 0));

      // not that fast snoopy
      } else {
        // still need to fetch file size from fs
        fs.stat(value.path, function(err, stat) {

          var fileSize;

          if (err) {
            callback(err);
            return;
          }

          // update final size based on the range options
          fileSize = stat.size - (value.start ? value.start : 0);
          callback(null, fileSize);
        });
      }

    // or http response
    } else if (value.hasOwnProperty('httpVersion')) {
      callback(null, +value.headers['content-length']);

    // or request stream http://github.com/mikeal/request
    } else if (value.hasOwnProperty('httpModule')) {
      // wait till response come back
      value.on('response', function(response) {
        value.pause();
        callback(null, +response.headers['content-length']);
      });
      value.resume();

    // something else
    } else {
      callback('Unknown stream');
    }
  };

  FormData$1.prototype._multiPartHeader = function(field, value, options) {
    // custom header specified (as string)?
    // it becomes responsible for boundary
    // (e.g. to handle extra CRLFs on .NET servers)
    if (typeof options.header == 'string') {
      return options.header;
    }

    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);

    var contents = '';
    var headers  = {
      // add custom disposition as third element or keep it two elements if not
      'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
      // if no content type. allow it to be empty array
      'Content-Type': [].concat(contentType || [])
    };

    // allow custom headers.
    if (typeof options.header == 'object') {
      populate(headers, options.header);
    }

    var header;
    for (var prop in headers) {
      if (!headers.hasOwnProperty(prop)) continue;
      header = headers[prop];

      // skip nullish headers.
      if (header == null) {
        continue;
      }

      // convert all headers to arrays.
      if (!Array.isArray(header)) {
        header = [header];
      }

      // add non-empty headers.
      if (header.length) {
        contents += prop + ': ' + header.join('; ') + FormData$1.LINE_BREAK;
      }
    }

    return '--' + this.getBoundary() + FormData$1.LINE_BREAK + contents + FormData$1.LINE_BREAK;
  };

  FormData$1.prototype._getContentDisposition = function(value, options) {

    var filename
      , contentDisposition
      ;

    if (typeof options.filepath === 'string') {
      // custom filepath for relative paths
      filename = path.normalize(options.filepath).replace(/\\/g, '/');
    } else if (options.filename || value.name || value.path) {
      // custom filename take precedence
      // formidable and the browser add a name property
      // fs- and request- streams have path property
      filename = path.basename(options.filename || value.name || value.path);
    } else if (value.readable && value.hasOwnProperty('httpVersion')) {
      // or try http response
      filename = path.basename(value.client._httpMessage.path || '');
    }

    if (filename) {
      contentDisposition = 'filename="' + filename + '"';
    }

    return contentDisposition;
  };

  FormData$1.prototype._getContentType = function(value, options) {

    // use custom content-type above all
    var contentType = options.contentType;

    // or try `name` from formidable, browser
    if (!contentType && value.name) {
      contentType = mime.lookup(value.name);
    }

    // or try `path` from fs-, request- streams
    if (!contentType && value.path) {
      contentType = mime.lookup(value.path);
    }

    // or if it's http-reponse
    if (!contentType && value.readable && value.hasOwnProperty('httpVersion')) {
      contentType = value.headers['content-type'];
    }

    // or guess it from the filepath or filename
    if (!contentType && (options.filepath || options.filename)) {
      contentType = mime.lookup(options.filepath || options.filename);
    }

    // fallback to the default content type if `value` is not simple value
    if (!contentType && typeof value == 'object') {
      contentType = FormData$1.DEFAULT_CONTENT_TYPE;
    }

    return contentType;
  };

  FormData$1.prototype._multiPartFooter = function() {
    return function(next) {
      var footer = FormData$1.LINE_BREAK;

      var lastPart = (this._streams.length === 0);
      if (lastPart) {
        footer += this._lastBoundary();
      }

      next(footer);
    }.bind(this);
  };

  FormData$1.prototype._lastBoundary = function() {
    return '--' + this.getBoundary() + '--' + FormData$1.LINE_BREAK;
  };

  FormData$1.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {
      'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
    };

    for (header in userHeaders) {
      if (userHeaders.hasOwnProperty(header)) {
        formHeaders[header.toLowerCase()] = userHeaders[header];
      }
    }

    return formHeaders;
  };

  FormData$1.prototype.setBoundary = function(boundary) {
    this._boundary = boundary;
  };

  FormData$1.prototype.getBoundary = function() {
    if (!this._boundary) {
      this._generateBoundary();
    }

    return this._boundary;
  };

  FormData$1.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc( 0 );
    var boundary = this.getBoundary();

    // Create the form content. Add Line breaks to the end of data.
    for (var i = 0, len = this._streams.length; i < len; i++) {
      if (typeof this._streams[i] !== 'function') {

        // Add content to the buffer.
        if(Buffer.isBuffer(this._streams[i])) {
          dataBuffer = Buffer.concat( [dataBuffer, this._streams[i]]);
        }else {
          dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(this._streams[i])]);
        }

        // Add break after content.
        if (typeof this._streams[i] !== 'string' || this._streams[i].substring( 2, boundary.length + 2 ) !== boundary) {
          dataBuffer = Buffer.concat( [dataBuffer, Buffer.from(FormData$1.LINE_BREAK)] );
        }
      }
    }

    // Add the footer and return the Buffer object.
    return Buffer.concat( [dataBuffer, Buffer.from(this._lastBoundary())] );
  };

  FormData$1.prototype._generateBoundary = function() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    var boundary = '--------------------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    this._boundary = boundary;
  };

  // Note: getLengthSync DOESN'T calculate streams length
  // As workaround one can calculate file size manually
  // and add it as knownLength option
  FormData$1.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;

    // Don't get confused, there are 3 "internal" streams for each keyval pair
    // so it basically checks if there is any value added to the form
    if (this._streams.length) {
      knownLength += this._lastBoundary().length;
    }

    // https://github.com/form-data/form-data/issues/40
    if (!this.hasKnownLength()) {
      // Some async length retrievers are present
      // therefore synchronous length calculation is false.
      // Please use getLength(callback) to get proper length
      this._error(new Error('Cannot calculate proper length in synchronous way.'));
    }

    return knownLength;
  };

  // Public API to check if length of added values is known
  // https://github.com/form-data/form-data/issues/196
  // https://github.com/form-data/form-data/issues/262
  FormData$1.prototype.hasKnownLength = function() {
    var hasKnownLength = true;

    if (this._valuesToMeasure.length) {
      hasKnownLength = false;
    }

    return hasKnownLength;
  };

  FormData$1.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;

    if (this._streams.length) {
      knownLength += this._lastBoundary().length;
    }

    if (!this._valuesToMeasure.length) {
      process.nextTick(cb.bind(this, null, knownLength));
      return;
    }

    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
      if (err) {
        cb(err);
        return;
      }

      values.forEach(function(length) {
        knownLength += length;
      });

      cb(null, knownLength);
    });
  };

  FormData$1.prototype.submit = function(params, cb) {
    var request
      , options
      , defaults = {method: 'post'}
      ;

    // parse provided url if it's string
    // or treat it as options object
    if (typeof params == 'string') {

      params = parseUrl$2(params);
      options = populate({
        port: params.port,
        path: params.pathname,
        host: params.hostname,
        protocol: params.protocol
      }, defaults);

    // use custom params
    } else {

      options = populate(params, defaults);
      // if no port provided use default one
      if (!options.port) {
        options.port = options.protocol == 'https:' ? 443 : 80;
      }
    }

    // put that good code in getHeaders to some use
    options.headers = this.getHeaders(params.headers);

    // https if specified, fallback to http in any other case
    if (options.protocol == 'https:') {
      request = https$1.request(options);
    } else {
      request = http$1.request(options);
    }

    // get content length and fire away
    this.getLength(function(err, length) {
      if (err && err !== 'Unknown stream') {
        this._error(err);
        return;
      }

      // add content length
      if (length) {
        request.setHeader('Content-Length', length);
      }

      this.pipe(request);
      if (cb) {
        var onResponse;

        var callback = function (error, responce) {
          request.removeListener('error', callback);
          request.removeListener('response', onResponse);

          return cb.call(this, error, responce);
        };

        onResponse = callback.bind(this, null);

        request.on('error', callback);
        request.on('response', onResponse);
      }
    }.bind(this));

    return request;
  };

  FormData$1.prototype._error = function(err) {
    if (!this.error) {
      this.error = err;
      this.pause();
      this.emit('error', err);
    }
  };

  FormData$1.prototype.toString = function () {
    return '[object FormData]';
  };

  var FormData$2 = /*@__PURE__*/getDefaultExportFromCjs(form_data);

  /**
   * Determines if the given thing is a array or js object.
   *
   * @param {string} thing - The object or array to be visited.
   *
   * @returns {boolean}
   */
  function isVisitable(thing) {
    return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
  }

  /**
   * It removes the brackets from the end of a string
   *
   * @param {string} key - The key of the parameter.
   *
   * @returns {string} the key without the brackets.
   */
  function removeBrackets(key) {
    return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
  }

  /**
   * It takes a path, a key, and a boolean, and returns a string
   *
   * @param {string} path - The path to the current key.
   * @param {string} key - The key of the current object being iterated over.
   * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
   *
   * @returns {string} The path to the current key.
   */
  function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
      // eslint-disable-next-line no-param-reassign
      token = removeBrackets(token);
      return !dots && i ? '[' + token + ']' : token;
    }).join(dots ? '.' : '');
  }

  /**
   * If the array is an array and none of its elements are visitable, then it's a flat array.
   *
   * @param {Array<any>} arr - The array to check
   *
   * @returns {boolean}
   */
  function isFlatArray(arr) {
    return utils$1.isArray(arr) && !arr.some(isVisitable);
  }

  const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
  });

  /**
   * Convert a data object to FormData
   *
   * @param {Object} obj
   * @param {?Object} [formData]
   * @param {?Object} [options]
   * @param {Function} [options.visitor]
   * @param {Boolean} [options.metaTokens = true]
   * @param {Boolean} [options.dots = false]
   * @param {?Boolean} [options.indexes = false]
   *
   * @returns {Object}
   **/

  /**
   * It converts an object into a FormData object
   *
   * @param {Object<any, any>} obj - The object to convert to form data.
   * @param {string} formData - The FormData object to append to.
   * @param {Object<string, any>} options
   *
   * @returns
   */
  function toFormData(obj, formData, options) {
    if (!utils$1.isObject(obj)) {
      throw new TypeError('target must be an object');
    }

    // eslint-disable-next-line no-param-reassign
    formData = formData || new (FormData$2 || FormData)();

    // eslint-disable-next-line no-param-reassign
    options = utils$1.toFlatObject(options, {
      metaTokens: true,
      dots: false,
      indexes: false
    }, false, function defined(option, source) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      return !utils$1.isUndefined(source[option]);
    });

    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
    const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

    if (!utils$1.isFunction(visitor)) {
      throw new TypeError('visitor must be a function');
    }

    function convertValue(value) {
      if (value === null) return '';

      if (utils$1.isDate(value)) {
        return value.toISOString();
      }

      if (!useBlob && utils$1.isBlob(value)) {
        throw new AxiosError('Blob is not supported. Use a Buffer instead.');
      }

      if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
        return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
      }

      return value;
    }

    /**
     * Default visitor.
     *
     * @param {*} value
     * @param {String|Number} key
     * @param {Array<String|Number>} path
     * @this {FormData}
     *
     * @returns {boolean} return true to visit the each prop of the value recursively
     */
    function defaultVisitor(value, key, path) {
      let arr = value;

      if (value && !path && typeof value === 'object') {
        if (utils$1.endsWith(key, '{}')) {
          // eslint-disable-next-line no-param-reassign
          key = metaTokens ? key : key.slice(0, -2);
          // eslint-disable-next-line no-param-reassign
          value = JSON.stringify(value);
        } else if (
          (utils$1.isArray(value) && isFlatArray(value)) ||
          ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
          )) {
          // eslint-disable-next-line no-param-reassign
          key = removeBrackets(key);

          arr.forEach(function each(el, index) {
            !(utils$1.isUndefined(el) || el === null) && formData.append(
              // eslint-disable-next-line no-nested-ternary
              indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
              convertValue(el)
            );
          });
          return false;
        }
      }

      if (isVisitable(value)) {
        return true;
      }

      formData.append(renderKey(path, key, dots), convertValue(value));

      return false;
    }

    const stack = [];

    const exposedHelpers = Object.assign(predicates, {
      defaultVisitor,
      convertValue,
      isVisitable
    });

    function build(value, path) {
      if (utils$1.isUndefined(value)) return;

      if (stack.indexOf(value) !== -1) {
        throw Error('Circular reference detected in ' + path.join('.'));
      }

      stack.push(value);

      utils$1.forEach(value, function each(el, key) {
        const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
          formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
        );

        if (result === true) {
          build(el, path ? path.concat(key) : [key]);
        }
      });

      stack.pop();
    }

    if (!utils$1.isObject(obj)) {
      throw new TypeError('data must be an object');
    }

    build(obj);

    return formData;
  }

  /**
   * It encodes a string by replacing all characters that are not in the unreserved set with
   * their percent-encoded equivalents
   *
   * @param {string} str - The string to encode.
   *
   * @returns {string} The encoded string.
   */
  function encode$1(str) {
    const charMap = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
      return charMap[match];
    });
  }

  /**
   * It takes a params object and converts it to a FormData object
   *
   * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
   * @param {Object<string, any>} options - The options object passed to the Axios constructor.
   *
   * @returns {void}
   */
  function AxiosURLSearchParams(params, options) {
    this._pairs = [];

    params && toFormData(params, this, options);
  }

  const prototype = AxiosURLSearchParams.prototype;

  prototype.append = function append(name, value) {
    this._pairs.push([name, value]);
  };

  prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
      return encoder.call(this, value, encode$1);
    } : encode$1;

    return this._pairs.map(function each(pair) {
      return _encode(pair[0]) + '=' + _encode(pair[1]);
    }, '').join('&');
  };

  /**
   * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
   * URI encoded counterparts
   *
   * @param {string} val The value to be encoded.
   *
   * @returns {string} The encoded value.
   */
  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @param {?object} options
   *
   * @returns {string} The formatted url
   */
  function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }
    
    const _encode = options && options.encode || encode;

    const serializeFn = options && options.serialize;

    let serializedParams;

    if (serializeFn) {
      serializedParams = serializeFn(params, options);
    } else {
      serializedParams = utils$1.isURLSearchParams(params) ?
        params.toString() :
        new AxiosURLSearchParams(params, options).toString(_encode);
    }

    if (serializedParams) {
      const hashmarkIndex = url.indexOf("#");

      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  }

  class InterceptorManager {
    constructor() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    }

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
     */
    eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    }

    /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */
    clear() {
      if (this.handlers) {
        this.handlers = [];
      }
    }

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */
    forEach(fn) {
      utils$1.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    }
  }

  var transitionalDefaults = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };

  var URLSearchParams = require$$0$1.URLSearchParams;

  var platform$1 = {
    isNode: true,
    classes: {
      URLSearchParams,
      FormData: FormData$2,
      Blob: typeof Blob !== 'undefined' && Blob || null
    },
    protocols: [ 'http', 'https', 'file', 'data' ]
  };

  const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   *
   * @returns {boolean}
   */
  const hasStandardBrowserEnv = (
    (product) => {
      return hasBrowserEnv && ['ReactNative', 'NativeScript', 'NS'].indexOf(product) < 0
    })(typeof navigator !== 'undefined' && navigator.product);

  /**
   * Determine if we're running in a standard browser webWorker environment
   *
   * Although the `isStandardBrowserEnv` method indicates that
   * `allows axios to run in a web worker`, the WebWorker will still be
   * filtered out due to its judgment standard
   * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
   * This leads to a problem when axios post `FormData` in webWorker
   */
  const hasStandardBrowserWebWorkerEnv = (() => {
    return (
      typeof WorkerGlobalScope !== 'undefined' &&
      // eslint-disable-next-line no-undef
      self instanceof WorkerGlobalScope &&
      typeof self.importScripts === 'function'
    );
  })();

  const origin = hasBrowserEnv && window.location.href || 'http://localhost';

  var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hasBrowserEnv: hasBrowserEnv,
    hasStandardBrowserEnv: hasStandardBrowserEnv,
    hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
    origin: origin
  });

  var platform = {
    ...utils,
    ...platform$1
  };

  function toURLEncodedForm(data, options) {
    return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
      visitor: function(value, key, path, helpers) {
        if (platform.isNode && utils$1.isBuffer(value)) {
          this.append(key, value.toString('base64'));
          return false;
        }

        return helpers.defaultVisitor.apply(this, arguments);
      }
    }, options));
  }

  /**
   * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
   *
   * @param {string} name - The name of the property to get.
   *
   * @returns An array of strings.
   */
  function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
      return match[0] === '[]' ? '' : match[1] || match[0];
    });
  }

  /**
   * Convert an array to an object.
   *
   * @param {Array<any>} arr - The array to convert to an object.
   *
   * @returns An object with the same keys and values as the array.
   */
  function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      obj[key] = arr[key];
    }
    return obj;
  }

  /**
   * It takes a FormData object and returns a JavaScript object
   *
   * @param {string} formData The FormData object to convert to JSON.
   *
   * @returns {Object<string, any> | null} The converted object.
   */
  function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
      let name = path[index++];

      if (name === '__proto__') return true;

      const isNumericKey = Number.isFinite(+name);
      const isLast = index >= path.length;
      name = !name && utils$1.isArray(target) ? target.length : name;

      if (isLast) {
        if (utils$1.hasOwnProp(target, name)) {
          target[name] = [target[name], value];
        } else {
          target[name] = value;
        }

        return !isNumericKey;
      }

      if (!target[name] || !utils$1.isObject(target[name])) {
        target[name] = [];
      }

      const result = buildPath(path, value, target[name], index);

      if (result && utils$1.isArray(target[name])) {
        target[name] = arrayToObject(target[name]);
      }

      return !isNumericKey;
    }

    if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
      const obj = {};

      utils$1.forEachEntry(formData, (name, value) => {
        buildPath(parsePropPath(name), value, obj, 0);
      });

      return obj;
    }

    return null;
  }

  /**
   * It takes a string, tries to parse it, and if it fails, it returns the stringified version
   * of the input
   *
   * @param {any} rawValue - The value to be stringified.
   * @param {Function} parser - A function that parses a string into a JavaScript object.
   * @param {Function} encoder - A function that takes a value and returns a string.
   *
   * @returns {string} A stringified version of the rawValue.
   */
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$1.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$1.trim(rawValue);
      } catch (e) {
        if (e.name !== 'SyntaxError') {
          throw e;
        }
      }
    }

    return (encoder || JSON.stringify)(rawValue);
  }

  const defaults = {

    transitional: transitionalDefaults,

    adapter: ['xhr', 'http', 'fetch'],

    transformRequest: [function transformRequest(data, headers) {
      const contentType = headers.getContentType() || '';
      const hasJSONContentType = contentType.indexOf('application/json') > -1;
      const isObjectPayload = utils$1.isObject(data);

      if (isObjectPayload && utils$1.isHTMLForm(data)) {
        data = new FormData(data);
      }

      const isFormData = utils$1.isFormData(data);

      if (isFormData) {
        return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
      }

      if (utils$1.isArrayBuffer(data) ||
        utils$1.isBuffer(data) ||
        utils$1.isStream(data) ||
        utils$1.isFile(data) ||
        utils$1.isBlob(data) ||
        utils$1.isReadableStream(data)
      ) {
        return data;
      }
      if (utils$1.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils$1.isURLSearchParams(data)) {
        headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
        return data.toString();
      }

      let isFileList;

      if (isObjectPayload) {
        if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
          return toURLEncodedForm(data, this.formSerializer).toString();
        }

        if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
          const _FormData = this.env && this.env.FormData;

          return toFormData(
            isFileList ? {'files[]': data} : data,
            _FormData && new _FormData(),
            this.formSerializer
          );
        }
      }

      if (isObjectPayload || hasJSONContentType ) {
        headers.setContentType('application/json', false);
        return stringifySafely(data);
      }

      return data;
    }],

    transformResponse: [function transformResponse(data) {
      const transitional = this.transitional || defaults.transitional;
      const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
      const JSONRequested = this.responseType === 'json';

      if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
        return data;
      }

      if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
        const silentJSONParsing = transitional && transitional.silentJSONParsing;
        const strictJSONParsing = !silentJSONParsing && JSONRequested;

        try {
          return JSON.parse(data);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === 'SyntaxError') {
              throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }

      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    env: {
      FormData: platform.classes.FormData,
      Blob: platform.classes.Blob
    },

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },

    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': undefined
      }
    }
  };

  utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
    defaults.headers[method] = {};
  });

  // RawAxiosHeaders whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  const ignoreDuplicateOf = utils$1.toObjectSet([
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ]);

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} rawHeaders Headers needing to be parsed
   *
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = rawHeaders => {
    const parsed = {};
    let key;
    let val;
    let i;

    rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
      i = line.indexOf(':');
      key = line.substring(0, i).trim().toLowerCase();
      val = line.substring(i + 1).trim();

      if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
        return;
      }

      if (key === 'set-cookie') {
        if (parsed[key]) {
          parsed[key].push(val);
        } else {
          parsed[key] = [val];
        }
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });

    return parsed;
  };

  const $internals = Symbol('internals');

  function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
  }

  function normalizeValue(value) {
    if (value === false || value == null) {
      return value;
    }

    return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
  }

  function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;

    while ((match = tokensRE.exec(str))) {
      tokens[match[1]] = match[2];
    }

    return tokens;
  }

  const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

  function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils$1.isFunction(filter)) {
      return filter.call(this, value, header);
    }

    if (isHeaderNameFilter) {
      value = header;
    }

    if (!utils$1.isString(value)) return;

    if (utils$1.isString(filter)) {
      return value.indexOf(filter) !== -1;
    }

    if (utils$1.isRegExp(filter)) {
      return filter.test(value);
    }
  }

  function formatHeader(header) {
    return header.trim()
      .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
        return char.toUpperCase() + str;
      });
  }

  function buildAccessors(obj, header) {
    const accessorName = utils$1.toCamelCase(' ' + header);

    ['get', 'set', 'has'].forEach(methodName => {
      Object.defineProperty(obj, methodName + accessorName, {
        value: function(arg1, arg2, arg3) {
          return this[methodName].call(this, header, arg1, arg2, arg3);
        },
        configurable: true
      });
    });
  }

  class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }

    set(header, valueOrRewrite, rewrite) {
      const self = this;

      function setHeader(_value, _header, _rewrite) {
        const lHeader = normalizeHeader(_header);

        if (!lHeader) {
          throw new Error('header name must be a non-empty string');
        }

        const key = utils$1.findKey(self, lHeader);

        if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
          self[key || _header] = normalizeValue(_value);
        }
      }

      const setHeaders = (headers, _rewrite) =>
        utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

      if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
        setHeaders(header, valueOrRewrite);
      } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
        setHeaders(parseHeaders(header), valueOrRewrite);
      } else if (utils$1.isHeaders(header)) {
        for (const [key, value] of header.entries()) {
          setHeader(value, key, rewrite);
        }
      } else {
        header != null && setHeader(valueOrRewrite, header, rewrite);
      }

      return this;
    }

    get(header, parser) {
      header = normalizeHeader(header);

      if (header) {
        const key = utils$1.findKey(this, header);

        if (key) {
          const value = this[key];

          if (!parser) {
            return value;
          }

          if (parser === true) {
            return parseTokens(value);
          }

          if (utils$1.isFunction(parser)) {
            return parser.call(this, value, key);
          }

          if (utils$1.isRegExp(parser)) {
            return parser.exec(value);
          }

          throw new TypeError('parser must be boolean|regexp|function');
        }
      }
    }

    has(header, matcher) {
      header = normalizeHeader(header);

      if (header) {
        const key = utils$1.findKey(this, header);

        return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }

      return false;
    }

    delete(header, matcher) {
      const self = this;
      let deleted = false;

      function deleteHeader(_header) {
        _header = normalizeHeader(_header);

        if (_header) {
          const key = utils$1.findKey(self, _header);

          if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
            delete self[key];

            deleted = true;
          }
        }
      }

      if (utils$1.isArray(header)) {
        header.forEach(deleteHeader);
      } else {
        deleteHeader(header);
      }

      return deleted;
    }

    clear(matcher) {
      const keys = Object.keys(this);
      let i = keys.length;
      let deleted = false;

      while (i--) {
        const key = keys[i];
        if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
          delete this[key];
          deleted = true;
        }
      }

      return deleted;
    }

    normalize(format) {
      const self = this;
      const headers = {};

      utils$1.forEach(this, (value, header) => {
        const key = utils$1.findKey(headers, header);

        if (key) {
          self[key] = normalizeValue(value);
          delete self[header];
          return;
        }

        const normalized = format ? formatHeader(header) : String(header).trim();

        if (normalized !== header) {
          delete self[header];
        }

        self[normalized] = normalizeValue(value);

        headers[normalized] = true;
      });

      return this;
    }

    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }

    toJSON(asStrings) {
      const obj = Object.create(null);

      utils$1.forEach(this, (value, header) => {
        value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
      });

      return obj;
    }

    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }

    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
    }

    get [Symbol.toStringTag]() {
      return 'AxiosHeaders';
    }

    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }

    static concat(first, ...targets) {
      const computed = new this(first);

      targets.forEach((target) => computed.set(target));

      return computed;
    }

    static accessor(header) {
      const internals = this[$internals] = (this[$internals] = {
        accessors: {}
      });

      const accessors = internals.accessors;
      const prototype = this.prototype;

      function defineAccessor(_header) {
        const lHeader = normalizeHeader(_header);

        if (!accessors[lHeader]) {
          buildAccessors(prototype, _header);
          accessors[lHeader] = true;
        }
      }

      utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

      return this;
    }
  }

  AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

  // reserved names hotfix
  utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    }
  });

  utils$1.freezeMethods(AxiosHeaders);

  /**
   * Transform the data for a request or a response
   *
   * @param {Array|Function} fns A single function or Array of functions
   * @param {?Object} response The response object
   *
   * @returns {*} The resulting transformed data
   */
  function transformData(fns, response) {
    const config = this || defaults;
    const context = response || config;
    const headers = AxiosHeaders.from(context.headers);
    let data = context.data;

    utils$1.forEach(fns, function transform(fn) {
      data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });

    headers.normalize();

    return data;
  }

  function isCancel(value) {
    return !!(value && value.__CANCEL__);
  }

  /**
   * A `CanceledError` is an object that is thrown when an operation is canceled.
   *
   * @param {string=} message The message.
   * @param {Object=} config The config.
   * @param {Object=} request The request.
   *
   * @returns {CanceledError} The created error.
   */
  function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
    this.name = 'CanceledError';
  }

  utils$1.inherits(CanceledError, AxiosError, {
    __CANCEL__: true
  });

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   *
   * @returns {object} The response.
   */
  function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError(
        'Request failed with status code ' + response.status,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  }

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   *
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  }

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   *
   * @returns {string} The combined URL
   */
  function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  }

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   *
   * @returns {string} The combined full path
   */
  function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  }

  var parseUrl$1 = require$$0$1.parse;

  var DEFAULT_PORTS = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443,
  };

  var stringEndsWith = String.prototype.endsWith || function(s) {
    return s.length <= this.length &&
      this.indexOf(s, this.length - s.length) !== -1;
  };

  /**
   * @param {string|object} url - The URL, or the result from url.parse.
   * @return {string} The URL of the proxy that should handle the request to the
   *  given URL. If no proxy is set, this will be an empty string.
   */
  function getProxyForUrl(url) {
    var parsedUrl = typeof url === 'string' ? parseUrl$1(url) : url || {};
    var proto = parsedUrl.protocol;
    var hostname = parsedUrl.host;
    var port = parsedUrl.port;
    if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
      return '';  // Don't proxy URLs without a valid scheme or host.
    }

    proto = proto.split(':', 1)[0];
    // Stripping ports in this way instead of using parsedUrl.hostname to make
    // sure that the brackets around IPv6 addresses are kept.
    hostname = hostname.replace(/:\d*$/, '');
    port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
    if (!shouldProxy(hostname, port)) {
      return '';  // Don't proxy URLs that match NO_PROXY.
    }

    var proxy =
      getEnv('npm_config_' + proto + '_proxy') ||
      getEnv(proto + '_proxy') ||
      getEnv('npm_config_proxy') ||
      getEnv('all_proxy');
    if (proxy && proxy.indexOf('://') === -1) {
      // Missing scheme in proxy, default to the requested URL's scheme.
      proxy = proto + '://' + proxy;
    }
    return proxy;
  }

  /**
   * Determines whether a given URL should be proxied.
   *
   * @param {string} hostname - The host name of the URL.
   * @param {number} port - The effective port of the URL.
   * @returns {boolean} Whether the given URL should be proxied.
   * @private
   */
  function shouldProxy(hostname, port) {
    var NO_PROXY =
      (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
    if (!NO_PROXY) {
      return true;  // Always proxy if NO_PROXY is not set.
    }
    if (NO_PROXY === '*') {
      return false;  // Never proxy if wildcard is set.
    }

    return NO_PROXY.split(/[,\s]/).every(function(proxy) {
      if (!proxy) {
        return true;  // Skip zero-length hosts.
      }
      var parsedProxy = proxy.match(/^(.+):(\d+)$/);
      var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
      var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
      if (parsedProxyPort && parsedProxyPort !== port) {
        return true;  // Skip if ports don't match.
      }

      if (!/^[.*]/.test(parsedProxyHostname)) {
        // No wildcards, so stop proxying if there is an exact match.
        return hostname !== parsedProxyHostname;
      }

      if (parsedProxyHostname.charAt(0) === '*') {
        // Remove leading wildcard.
        parsedProxyHostname = parsedProxyHostname.slice(1);
      }
      // Stop proxying if the hostname ends with the no_proxy host.
      return !stringEndsWith.call(hostname, parsedProxyHostname);
    });
  }

  /**
   * Get the value for an environment variable.
   *
   * @param {string} key - The name of the environment variable.
   * @return {string} The value of the environment variable.
   * @private
   */
  function getEnv(key) {
    return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
  }

  var getProxyForUrl_1 = getProxyForUrl;

  var followRedirects$1 = {exports: {}};

  var debug$1;

  var debug_1 = function () {
    if (!debug$1) {
      try {
        /* eslint global-require: off */
        debug$1 = require("debug")("follow-redirects");
      }
      catch (error) { /* */ }
      if (typeof debug$1 !== "function") {
        debug$1 = function () { /* */ };
      }
    }
    debug$1.apply(null, arguments);
  };

  var url = require$$0$1;
  var URL$1 = url.URL;
  var http = require$$3;
  var https = require$$4;
  var Writable = stream.Writable;
  var assert = require$$4$1;
  var debug = debug_1;

  // Whether to use the native URL object or the legacy url module
  var useNativeURL = false;
  try {
    assert(new URL$1());
  }
  catch (error) {
    useNativeURL = error.code === "ERR_INVALID_URL";
  }

  // URL fields to preserve in copy operations
  var preservedUrlFields = [
    "auth",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "hash",
  ];

  // Create handlers that pass events from native requests
  var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
  var eventHandlers = Object.create(null);
  events.forEach(function (event) {
    eventHandlers[event] = function (arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });

  // Error types with codes
  var InvalidUrlError = createErrorType(
    "ERR_INVALID_URL",
    "Invalid URL",
    TypeError
  );
  var RedirectionError = createErrorType(
    "ERR_FR_REDIRECTION_FAILURE",
    "Redirected request failed"
  );
  var TooManyRedirectsError = createErrorType(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded",
    RedirectionError
  );
  var MaxBodyLengthExceededError = createErrorType(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  );
  var WriteAfterEndError = createErrorType(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  );

  // istanbul ignore next
  var destroy = Writable.prototype.destroy || noop;

  // An HTTP(S) request that can be redirected
  function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];

    // Attach a callback if passed
    if (responseCallback) {
      this.on("response", responseCallback);
    }

    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function (response) {
      try {
        self._processResponse(response);
      }
      catch (cause) {
        self.emit("error", cause instanceof RedirectionError ?
          cause : new RedirectionError({ cause: cause }));
      }
    };

    // Perform the first request
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);

  RedirectableRequest.prototype.abort = function () {
    destroyRequest(this._currentRequest);
    this._currentRequest.abort();
    this.emit("abort");
  };

  RedirectableRequest.prototype.destroy = function (error) {
    destroyRequest(this._currentRequest, error);
    destroy.call(this, error);
    return this;
  };

  // Writes buffered data to the current native request
  RedirectableRequest.prototype.write = function (data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
      throw new WriteAfterEndError();
    }

    // Validate input and shift parameters if necessary
    if (!isString(data) && !isBuffer(data)) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
      callback = encoding;
      encoding = null;
    }

    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({ data: data, encoding: encoding });
      this._currentRequest.write(data, encoding, callback);
    }
    // Error when we exceed the maximum body length
    else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };

  // Ends the current native request
  RedirectableRequest.prototype.end = function (data, encoding, callback) {
    // Shift parameters if necessary
    if (isFunction(data)) {
      callback = data;
      data = encoding = null;
    }
    else if (isFunction(encoding)) {
      callback = encoding;
      encoding = null;
    }

    // Write data if needed and end
    if (!data) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    }
    else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data, encoding, function () {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };

  // Sets a header value on the current native request
  RedirectableRequest.prototype.setHeader = function (name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };

  // Clears a header value on the current native request
  RedirectableRequest.prototype.removeHeader = function (name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };

  // Global timeout for all underlying requests
  RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
    var self = this;

    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
      socket.setTimeout(msecs);
      socket.removeListener("timeout", socket.destroy);
      socket.addListener("timeout", socket.destroy);
    }

    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
      if (self._timeout) {
        clearTimeout(self._timeout);
      }
      self._timeout = setTimeout(function () {
        self.emit("timeout");
        clearTimer();
      }, msecs);
      destroyOnTimeout(socket);
    }

    // Stops a timeout from triggering
    function clearTimer() {
      // Clear the timeout
      if (self._timeout) {
        clearTimeout(self._timeout);
        self._timeout = null;
      }

      // Clean up all attached listeners
      self.removeListener("abort", clearTimer);
      self.removeListener("error", clearTimer);
      self.removeListener("response", clearTimer);
      self.removeListener("close", clearTimer);
      if (callback) {
        self.removeListener("timeout", callback);
      }
      if (!self.socket) {
        self._currentRequest.removeListener("socket", startTimer);
      }
    }

    // Attach callback if passed
    if (callback) {
      this.on("timeout", callback);
    }

    // Start the timer if or when the socket is opened
    if (this.socket) {
      startTimer(this.socket);
    }
    else {
      this._currentRequest.once("socket", startTimer);
    }

    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);
    this.on("close", clearTimer);

    return this;
  };

  // Proxy all other public ClientRequest methods
  [
    "flushHeaders", "getHeader",
    "setNoDelay", "setSocketKeepAlive",
  ].forEach(function (method) {
    RedirectableRequest.prototype[method] = function (a, b) {
      return this._currentRequest[method](a, b);
    };
  });

  // Proxy all public ClientRequest properties
  ["aborted", "connection", "socket"].forEach(function (property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function () { return this._currentRequest[property]; },
    });
  });

  RedirectableRequest.prototype._sanitizeOptions = function (options) {
    // Ensure headers are always present
    if (!options.headers) {
      options.headers = {};
    }

    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
      // Use hostname if set, because it has precedence
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }

    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      }
      else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };


  // Executes the next native request (initial or redirect)
  RedirectableRequest.prototype._performRequest = function () {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      throw new TypeError("Unsupported protocol " + protocol);
    }

    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
      var scheme = protocol.slice(0, -1);
      this._options.agent = this._options.agents[scheme];
    }

    // Create the native request and set up its event handlers
    var request = this._currentRequest =
          nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events) {
      request.on(event, eventHandlers[event]);
    }

    // RFC7230§5.3.1: When making a request directly to an origin server, […]
    // a client MUST send only the absolute path […] as the request-target.
    this._currentUrl = /^\//.test(this._options.path) ?
      url.format(this._options) :
      // When making a request to a proxy, […]
      // a client MUST send the target URI in absolute-form […].
      this._options.path;

    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
      // Write the request entity and end
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        // Only write if this request has not been redirected yet
        /* istanbul ignore else */
        if (request === self._currentRequest) {
          // Report any write errors
          /* istanbul ignore if */
          if (error) {
            self.emit("error", error);
          }
          // Write the next buffer if there are still left
          else if (i < buffers.length) {
            var buffer = buffers[i++];
            /* istanbul ignore else */
            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          }
          // End the request if `end` has been called on us
          else if (self._ended) {
            request.end();
          }
        }
      }());
    }
  };

  // Processes a response from the current native request
  RedirectableRequest.prototype._processResponse = function (response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode: statusCode,
      });
    }

    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.

    // If the response is not a redirect; return it as-is
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false ||
        statusCode < 300 || statusCode >= 400) {
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);

      // Clean up
      this._requestBodyBuffers = [];
      return;
    }

    // The response is a redirect, so abort the current request
    destroyRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      throw new TooManyRedirectsError();
    }

    // Store the request headers if applicable
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
      requestHeaders = Object.assign({
        // The Host header was set by nativeProtocol.request
        Host: response.req.getHeader("host"),
      }, this._options.headers);
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = parseUrl(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
      url.format(Object.assign(currentUrlParts, { host: currentHost }));

    // Create the redirected request
    var redirectUrl = resolveUrl(location, currentUrl);
    debug("redirecting to", redirectUrl.href);
    this._isRedirect = true;
    spreadUrlObject(redirectUrl, this._options);

    // Drop confidential headers when redirecting to a less secure protocol
    // or to a different domain that is not a superdomain
    if (redirectUrl.protocol !== currentUrlParts.protocol &&
       redirectUrl.protocol !== "https:" ||
       redirectUrl.host !== currentHost &&
       !isSubdomain(redirectUrl.host, currentHost)) {
      removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (isFunction(beforeRedirect)) {
      var responseDetails = {
        headers: response.headers,
        statusCode: statusCode,
      };
      var requestDetails = {
        url: currentUrl,
        method: method,
        headers: requestHeaders,
      };
      beforeRedirect(this._options, responseDetails, requestDetails);
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    this._performRequest();
  };

  // Wraps the key/value object of protocols with redirect functionality
  function wrap(protocols) {
    // Default settings
    var exports = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024,
    };

    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function (scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

      // Executes a request, following redirects
      function request(input, options, callback) {
        // Parse parameters, ensuring that input is an object
        if (isURL(input)) {
          input = spreadUrlObject(input);
        }
        else if (isString(input)) {
          input = spreadUrlObject(parseUrl(input));
        }
        else {
          callback = options;
          options = validateUrl(input);
          input = { protocol: protocol };
        }
        if (isFunction(options)) {
          callback = options;
          options = null;
        }

        // Set defaults
        options = Object.assign({
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, input, options);
        options.nativeProtocols = nativeProtocols;
        if (!isString(options.host) && !isString(options.hostname)) {
          options.hostname = "::1";
        }

        assert.equal(options.protocol, protocol, "protocol mismatch");
        debug("options", options);
        return new RedirectableRequest(options, callback);
      }

      // Executes a GET request, following redirects
      function get(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        wrappedRequest.end();
        return wrappedRequest;
      }

      // Expose the properties on the wrapped protocol
      Object.defineProperties(wrappedProtocol, {
        request: { value: request, configurable: true, enumerable: true, writable: true },
        get: { value: get, configurable: true, enumerable: true, writable: true },
      });
    });
    return exports;
  }

  function noop() { /* empty */ }

  function parseUrl(input) {
    var parsed;
    /* istanbul ignore else */
    if (useNativeURL) {
      parsed = new URL$1(input);
    }
    else {
      // Ensure the URL is valid and absolute
      parsed = validateUrl(url.parse(input));
      if (!isString(parsed.protocol)) {
        throw new InvalidUrlError({ input });
      }
    }
    return parsed;
  }

  function resolveUrl(relative, base) {
    /* istanbul ignore next */
    return useNativeURL ? new URL$1(relative, base) : parseUrl(url.resolve(base, relative));
  }

  function validateUrl(input) {
    if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
      throw new InvalidUrlError({ input: input.href || input });
    }
    if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
      throw new InvalidUrlError({ input: input.href || input });
    }
    return input;
  }

  function spreadUrlObject(urlObject, target) {
    var spread = target || {};
    for (var key of preservedUrlFields) {
      spread[key] = urlObject[key];
    }

    // Fix IPv6 hostname
    if (spread.hostname.startsWith("[")) {
      spread.hostname = spread.hostname.slice(1, -1);
    }
    // Ensure port is a number
    if (spread.port !== "") {
      spread.port = Number(spread.port);
    }
    // Concatenate path
    spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;

    return spread;
  }

  function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for (var header in headers) {
      if (regex.test(header)) {
        lastValue = headers[header];
        delete headers[header];
      }
    }
    return (lastValue === null || typeof lastValue === "undefined") ?
      undefined : String(lastValue).trim();
  }

  function createErrorType(code, message, baseClass) {
    // Create constructor
    function CustomError(properties) {
      Error.captureStackTrace(this, this.constructor);
      Object.assign(this, properties || {});
      this.code = code;
      this.message = this.cause ? message + ": " + this.cause.message : message;
    }

    // Attach constructor and set default properties
    CustomError.prototype = new (baseClass || Error)();
    Object.defineProperties(CustomError.prototype, {
      constructor: {
        value: CustomError,
        enumerable: false,
      },
      name: {
        value: "Error [" + code + "]",
        enumerable: false,
      },
    });
    return CustomError;
  }

  function destroyRequest(request, error) {
    for (var event of events) {
      request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.destroy(error);
  }

  function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
  }

  function isString(value) {
    return typeof value === "string" || value instanceof String;
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function isBuffer(value) {
    return typeof value === "object" && ("length" in value);
  }

  function isURL(value) {
    return URL$1 && value instanceof URL$1;
  }

  // Exports
  followRedirects$1.exports = wrap({ http: http, https: https });
  followRedirects$1.exports.wrap = wrap;

  var followRedirectsExports = followRedirects$1.exports;
  var followRedirects = /*@__PURE__*/getDefaultExportFromCjs(followRedirectsExports);

  const VERSION = "1.7.2";

  function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || '';
  }

  const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

  /**
   * Parse data uri to a Buffer or Blob
   *
   * @param {String} uri
   * @param {?Boolean} asBlob
   * @param {?Object} options
   * @param {?Function} options.Blob
   *
   * @returns {Buffer|Blob}
   */
  function fromDataURI(uri, asBlob, options) {
    const _Blob = options && options.Blob || platform.classes.Blob;
    const protocol = parseProtocol(uri);

    if (asBlob === undefined && _Blob) {
      asBlob = true;
    }

    if (protocol === 'data') {
      uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

      const match = DATA_URL_PATTERN.exec(uri);

      if (!match) {
        throw new AxiosError('Invalid URL', AxiosError.ERR_INVALID_URL);
      }

      const mime = match[1];
      const isBase64 = match[2];
      const body = match[3];
      const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

      if (asBlob) {
        if (!_Blob) {
          throw new AxiosError('Blob is not supported', AxiosError.ERR_NOT_SUPPORT);
        }

        return new _Blob([buffer], {type: mime});
      }

      return buffer;
    }

    throw new AxiosError('Unsupported protocol ' + protocol, AxiosError.ERR_NOT_SUPPORT);
  }

  /**
   * Throttle decorator
   * @param {Function} fn
   * @param {Number} freq
   * @return {Function}
   */
  function throttle(fn, freq) {
    let timestamp = 0;
    const threshold = 1000 / freq;
    let timer = null;
    return function throttled() {
      const force = this === true;

      const now = Date.now();
      if (force || now - timestamp > threshold) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timestamp = now;
        return fn.apply(null, arguments);
      }
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          timestamp = Date.now();
          return fn.apply(null, arguments);
        }, threshold - (now - timestamp));
      }
    };
  }

  /**
   * Calculate data maxRate
   * @param {Number} [samplesCount= 10]
   * @param {Number} [min= 1000]
   * @returns {Function}
   */
  function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;

    min = min !== undefined ? min : 1000;

    return function push(chunkLength) {
      const now = Date.now();

      const startedAt = timestamps[tail];

      if (!firstSampleTS) {
        firstSampleTS = now;
      }

      bytes[head] = chunkLength;
      timestamps[head] = now;

      let i = tail;
      let bytesCount = 0;

      while (i !== head) {
        bytesCount += bytes[i++];
        i = i % samplesCount;
      }

      head = (head + 1) % samplesCount;

      if (head === tail) {
        tail = (tail + 1) % samplesCount;
      }

      if (now - firstSampleTS < min) {
        return;
      }

      const passed = startedAt && now - startedAt;

      return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
  }

  const kInternals = Symbol('internals');

  class AxiosTransformStream extends stream.Transform{
    constructor(options) {
      options = utils$1.toFlatObject(options, {
        maxRate: 0,
        chunkSize: 64 * 1024,
        minChunkSize: 100,
        timeWindow: 500,
        ticksRate: 2,
        samplesCount: 15
      }, null, (prop, source) => {
        return !utils$1.isUndefined(source[prop]);
      });

      super({
        readableHighWaterMark: options.chunkSize
      });

      const self = this;

      const internals = this[kInternals] = {
        length: options.length,
        timeWindow: options.timeWindow,
        ticksRate: options.ticksRate,
        chunkSize: options.chunkSize,
        maxRate: options.maxRate,
        minChunkSize: options.minChunkSize,
        bytesSeen: 0,
        isCaptured: false,
        notifiedBytesLoaded: 0,
        ts: Date.now(),
        bytes: 0,
        onReadCallback: null
      };

      const _speedometer = speedometer(internals.ticksRate * options.samplesCount, internals.timeWindow);

      this.on('newListener', event => {
        if (event === 'progress') {
          if (!internals.isCaptured) {
            internals.isCaptured = true;
          }
        }
      });

      let bytesNotified = 0;

      internals.updateProgress = throttle(function throttledHandler() {
        const totalBytes = internals.length;
        const bytesTransferred = internals.bytesSeen;
        const progressBytes = bytesTransferred - bytesNotified;
        if (!progressBytes || self.destroyed) return;

        const rate = _speedometer(progressBytes);

        bytesNotified = bytesTransferred;

        process.nextTick(() => {
          self.emit('progress', {
            loaded: bytesTransferred,
            total: totalBytes,
            progress: totalBytes ? (bytesTransferred / totalBytes) : undefined,
            bytes: progressBytes,
            rate: rate ? rate : undefined,
            estimated: rate && totalBytes && bytesTransferred <= totalBytes ?
              (totalBytes - bytesTransferred) / rate : undefined,
            lengthComputable: totalBytes != null
          });
        });
      }, internals.ticksRate);

      const onFinish = () => {
        internals.updateProgress.call(true);
      };

      this.once('end', onFinish);
      this.once('error', onFinish);
    }

    _read(size) {
      const internals = this[kInternals];

      if (internals.onReadCallback) {
        internals.onReadCallback();
      }

      return super._read(size);
    }

    _transform(chunk, encoding, callback) {
      const self = this;
      const internals = this[kInternals];
      const maxRate = internals.maxRate;

      const readableHighWaterMark = this.readableHighWaterMark;

      const timeWindow = internals.timeWindow;

      const divider = 1000 / timeWindow;
      const bytesThreshold = (maxRate / divider);
      const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;

      function pushChunk(_chunk, _callback) {
        const bytes = Buffer.byteLength(_chunk);
        internals.bytesSeen += bytes;
        internals.bytes += bytes;

        if (internals.isCaptured) {
          internals.updateProgress();
        }

        if (self.push(_chunk)) {
          process.nextTick(_callback);
        } else {
          internals.onReadCallback = () => {
            internals.onReadCallback = null;
            process.nextTick(_callback);
          };
        }
      }

      const transformChunk = (_chunk, _callback) => {
        const chunkSize = Buffer.byteLength(_chunk);
        let chunkRemainder = null;
        let maxChunkSize = readableHighWaterMark;
        let bytesLeft;
        let passed = 0;

        if (maxRate) {
          const now = Date.now();

          if (!internals.ts || (passed = (now - internals.ts)) >= timeWindow) {
            internals.ts = now;
            bytesLeft = bytesThreshold - internals.bytes;
            internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
            passed = 0;
          }

          bytesLeft = bytesThreshold - internals.bytes;
        }

        if (maxRate) {
          if (bytesLeft <= 0) {
            // next time window
            return setTimeout(() => {
              _callback(null, _chunk);
            }, timeWindow - passed);
          }

          if (bytesLeft < maxChunkSize) {
            maxChunkSize = bytesLeft;
          }
        }

        if (maxChunkSize && chunkSize > maxChunkSize && (chunkSize - maxChunkSize) > minChunkSize) {
          chunkRemainder = _chunk.subarray(maxChunkSize);
          _chunk = _chunk.subarray(0, maxChunkSize);
        }

        pushChunk(_chunk, chunkRemainder ? () => {
          process.nextTick(_callback, null, chunkRemainder);
        } : _callback);
      };

      transformChunk(chunk, function transformNextChunk(err, _chunk) {
        if (err) {
          return callback(err);
        }

        if (_chunk) {
          transformChunk(_chunk, transformNextChunk);
        } else {
          callback(null);
        }
      });
    }

    setLength(length) {
      this[kInternals].length = +length;
      return this;
    }
  }

  const {asyncIterator} = Symbol;

  const readBlob = async function* (blob) {
    if (blob.stream) {
      yield* blob.stream();
    } else if (blob.arrayBuffer) {
      yield await blob.arrayBuffer();
    } else if (blob[asyncIterator]) {
      yield* blob[asyncIterator]();
    } else {
      yield blob;
    }
  };

  const BOUNDARY_ALPHABET = utils$1.ALPHABET.ALPHA_DIGIT + '-_';

  const textEncoder = new require$$1.TextEncoder();

  const CRLF = '\r\n';
  const CRLF_BYTES = textEncoder.encode(CRLF);
  const CRLF_BYTES_COUNT = 2;

  class FormDataPart {
    constructor(name, value) {
      const {escapeName} = this.constructor;
      const isStringValue = utils$1.isString(value);

      let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

      if (isStringValue) {
        value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
      } else {
        headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
      }

      this.headers = textEncoder.encode(headers + CRLF);

      this.contentLength = isStringValue ? value.byteLength : value.size;

      this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

      this.name = name;
      this.value = value;
    }

    async *encode(){
      yield this.headers;

      const {value} = this;

      if(utils$1.isTypedArray(value)) {
        yield value;
      } else {
        yield* readBlob(value);
      }

      yield CRLF_BYTES;
    }

    static escapeName(name) {
        return String(name).replace(/[\r\n"]/g, (match) => ({
          '\r' : '%0D',
          '\n' : '%0A',
          '"' : '%22',
        }[match]));
    }
  }

  const formDataToStream = (form, headersHandler, options) => {
    const {
      tag = 'form-data-boundary',
      size = 25,
      boundary = tag + '-' + utils$1.generateString(size, BOUNDARY_ALPHABET)
    } = options || {};

    if(!utils$1.isFormData(form)) {
      throw TypeError('FormData instance required');
    }

    if (boundary.length < 1 || boundary.length > 70) {
      throw Error('boundary must be 10-70 characters long')
    }

    const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
    const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF + CRLF);
    let contentLength = footerBytes.byteLength;

    const parts = Array.from(form.entries()).map(([name, value]) => {
      const part = new FormDataPart(name, value);
      contentLength += part.size;
      return part;
    });

    contentLength += boundaryBytes.byteLength * parts.length;

    contentLength = utils$1.toFiniteNumber(contentLength);

    const computedHeaders = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    };

    if (Number.isFinite(contentLength)) {
      computedHeaders['Content-Length'] = contentLength;
    }

    headersHandler && headersHandler(computedHeaders);

    return stream.Readable.from((async function *() {
      for(const part of parts) {
        yield boundaryBytes;
        yield* part.encode();
      }

      yield footerBytes;
    })());
  };

  class ZlibHeaderTransformStream extends stream.Transform {
    __transform(chunk, encoding, callback) {
      this.push(chunk);
      callback();
    }

    _transform(chunk, encoding, callback) {
      if (chunk.length !== 0) {
        this._transform = this.__transform;

        // Add Default Compression headers if no zlib headers are present
        if (chunk[0] !== 120) { // Hex: 78
          const header = Buffer.alloc(2);
          header[0] = 120; // Hex: 78
          header[1] = 156; // Hex: 9C 
          this.push(header, encoding);
        }
      }

      this.__transform(chunk, encoding, callback);
    }
  }

  const callbackify = (fn, reducer) => {
    return utils$1.isAsyncFn(fn) ? function (...args) {
      const cb = args.pop();
      fn.apply(this, args).then((value) => {
        try {
          reducer ? cb(null, ...reducer(value)) : cb(null, value);
        } catch (err) {
          cb(err);
        }
      }, cb);
    } : fn;
  };

  const zlibOptions = {
    flush: zlib.constants.Z_SYNC_FLUSH,
    finishFlush: zlib.constants.Z_SYNC_FLUSH
  };

  const brotliOptions = {
    flush: zlib.constants.BROTLI_OPERATION_FLUSH,
    finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
  };

  const isBrotliSupported = utils$1.isFunction(zlib.createBrotliDecompress);

  const {http: httpFollow, https: httpsFollow} = followRedirects;

  const isHttps = /https:?/;

  const supportedProtocols = platform.protocols.map(protocol => {
    return protocol + ':';
  });

  /**
   * If the proxy or config beforeRedirects functions are defined, call them with the options
   * object.
   *
   * @param {Object<string, any>} options - The options object that was passed to the request.
   *
   * @returns {Object<string, any>}
   */
  function dispatchBeforeRedirect(options, responseDetails) {
    if (options.beforeRedirects.proxy) {
      options.beforeRedirects.proxy(options);
    }
    if (options.beforeRedirects.config) {
      options.beforeRedirects.config(options, responseDetails);
    }
  }

  /**
   * If the proxy or config afterRedirects functions are defined, call them with the options
   *
   * @param {http.ClientRequestArgs} options
   * @param {AxiosProxyConfig} configProxy configuration from Axios options object
   * @param {string} location
   *
   * @returns {http.ClientRequestArgs}
   */
  function setProxy(options, configProxy, location) {
    let proxy = configProxy;
    if (!proxy && proxy !== false) {
      const proxyUrl = getProxyForUrl_1(location);
      if (proxyUrl) {
        proxy = new URL(proxyUrl);
      }
    }
    if (proxy) {
      // Basic proxy authorization
      if (proxy.username) {
        proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
      }

      if (proxy.auth) {
        // Support proxy auth object form
        if (proxy.auth.username || proxy.auth.password) {
          proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
        }
        const base64 = Buffer
          .from(proxy.auth, 'utf8')
          .toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }

      options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
      const proxyHost = proxy.hostname || proxy.host;
      options.hostname = proxyHost;
      // Replace 'host' since options is not a URL object
      options.host = proxyHost;
      options.port = proxy.port;
      options.path = location;
      if (proxy.protocol) {
        options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
      }
    }

    options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
      // Configure proxy for redirected request, passing the original config proxy to apply
      // the exact same logic as if the redirected request was performed by axios directly.
      setProxy(redirectOptions, configProxy, redirectOptions.href);
    };
  }

  const isHttpAdapterSupported = typeof process !== 'undefined' && utils$1.kindOf(process) === 'process';

  // temporary hotfix

  const wrapAsync = (asyncExecutor) => {
    return new Promise((resolve, reject) => {
      let onDone;
      let isDone;

      const done = (value, isRejected) => {
        if (isDone) return;
        isDone = true;
        onDone && onDone(value, isRejected);
      };

      const _resolve = (value) => {
        done(value);
        resolve(value);
      };

      const _reject = (reason) => {
        done(reason, true);
        reject(reason);
      };

      asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
    })
  };

  const resolveFamily = ({address, family}) => {
    if (!utils$1.isString(address)) {
      throw TypeError('address must be a string');
    }
    return ({
      address,
      family: family || (address.indexOf('.') < 0 ? 6 : 4)
    });
  };

  const buildAddressEntry = (address, family) => resolveFamily(utils$1.isObject(address) ? address : {address, family});

  /*eslint consistent-return:0*/
  var httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
    return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
      let {data, lookup, family} = config;
      const {responseType, responseEncoding} = config;
      const method = config.method.toUpperCase();
      let isDone;
      let rejected = false;
      let req;

      if (lookup) {
        const _lookup = callbackify(lookup, (value) => utils$1.isArray(value) ? value : [value]);
        // hotfix to support opt.all option which is required for node 20.x
        lookup = (hostname, opt, cb) => {
          _lookup(hostname, opt, (err, arg0, arg1) => {
            if (err) {
              return cb(err);
            }

            const addresses = utils$1.isArray(arg0) ? arg0.map(addr => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];

            opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
          });
        };
      }

      // temporary internal emitter until the AxiosRequest class will be implemented
      const emitter = new events$1.EventEmitter();

      const onFinished = () => {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(abort);
        }

        if (config.signal) {
          config.signal.removeEventListener('abort', abort);
        }

        emitter.removeAllListeners();
      };

      onDone((value, isRejected) => {
        isDone = true;
        if (isRejected) {
          rejected = true;
          onFinished();
        }
      });

      function abort(reason) {
        emitter.emit('abort', !reason || reason.type ? new CanceledError(null, config, req) : reason);
      }

      emitter.once('abort', reject);

      if (config.cancelToken || config.signal) {
        config.cancelToken && config.cancelToken.subscribe(abort);
        if (config.signal) {
          config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
        }
      }

      // Parse url
      const fullPath = buildFullPath(config.baseURL, config.url);
      const parsed = new URL(fullPath, 'http://localhost');
      const protocol = parsed.protocol || supportedProtocols[0];

      if (protocol === 'data:') {
        let convertedData;

        if (method !== 'GET') {
          return settle(resolve, reject, {
            status: 405,
            statusText: 'method not allowed',
            headers: {},
            config
          });
        }

        try {
          convertedData = fromDataURI(config.url, responseType === 'blob', {
            Blob: config.env && config.env.Blob
          });
        } catch (err) {
          throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
        }

        if (responseType === 'text') {
          convertedData = convertedData.toString(responseEncoding);

          if (!responseEncoding || responseEncoding === 'utf8') {
            convertedData = utils$1.stripBOM(convertedData);
          }
        } else if (responseType === 'stream') {
          convertedData = stream.Readable.from(convertedData);
        }

        return settle(resolve, reject, {
          data: convertedData,
          status: 200,
          statusText: 'OK',
          headers: new AxiosHeaders(),
          config
        });
      }

      if (supportedProtocols.indexOf(protocol) === -1) {
        return reject(new AxiosError(
          'Unsupported protocol ' + protocol,
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }

      const headers = AxiosHeaders.from(config.headers).normalize();

      // Set User-Agent (required by some servers)
      // See https://github.com/axios/axios/issues/69
      // User-Agent is specified; handle case where no UA header is desired
      // Only set header if it hasn't been set in config
      headers.set('User-Agent', 'axios/' + VERSION, false);

      const onDownloadProgress = config.onDownloadProgress;
      const onUploadProgress = config.onUploadProgress;
      const maxRate = config.maxRate;
      let maxUploadRate = undefined;
      let maxDownloadRate = undefined;

      // support for spec compliant FormData objects
      if (utils$1.isSpecCompliantForm(data)) {
        const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

        data = formDataToStream(data, (formHeaders) => {
          headers.set(formHeaders);
        }, {
          tag: `axios-${VERSION}-boundary`,
          boundary: userBoundary && userBoundary[1] || undefined
        });
        // support for https://www.npmjs.com/package/form-data api
      } else if (utils$1.isFormData(data) && utils$1.isFunction(data.getHeaders)) {
        headers.set(data.getHeaders());

        if (!headers.hasContentLength()) {
          try {
            const knownLength = await require$$1.promisify(data.getLength).call(data);
            Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
            /*eslint no-empty:0*/
          } catch (e) {
          }
        }
      } else if (utils$1.isBlob(data)) {
        data.size && headers.setContentType(data.type || 'application/octet-stream');
        headers.setContentLength(data.size || 0);
        data = stream.Readable.from(readBlob(data));
      } else if (data && !utils$1.isStream(data)) {
        if (Buffer.isBuffer(data)) ; else if (utils$1.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils$1.isString(data)) {
          data = Buffer.from(data, 'utf-8');
        } else {
          return reject(new AxiosError(
            'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
            AxiosError.ERR_BAD_REQUEST,
            config
          ));
        }

        // Add Content-Length header if data exists
        headers.setContentLength(data.length, false);

        if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
          return reject(new AxiosError(
            'Request body larger than maxBodyLength limit',
            AxiosError.ERR_BAD_REQUEST,
            config
          ));
        }
      }

      const contentLength = utils$1.toFiniteNumber(headers.getContentLength());

      if (utils$1.isArray(maxRate)) {
        maxUploadRate = maxRate[0];
        maxDownloadRate = maxRate[1];
      } else {
        maxUploadRate = maxDownloadRate = maxRate;
      }

      if (data && (onUploadProgress || maxUploadRate)) {
        if (!utils$1.isStream(data)) {
          data = stream.Readable.from(data, {objectMode: false});
        }

        data = stream.pipeline([data, new AxiosTransformStream({
          length: contentLength,
          maxRate: utils$1.toFiniteNumber(maxUploadRate)
        })], utils$1.noop);

        onUploadProgress && data.on('progress', progress => {
          onUploadProgress(Object.assign(progress, {
            upload: true
          }));
        });
      }

      // HTTP basic authentication
      let auth = undefined;
      if (config.auth) {
        const username = config.auth.username || '';
        const password = config.auth.password || '';
        auth = username + ':' + password;
      }

      if (!auth && parsed.username) {
        const urlUsername = parsed.username;
        const urlPassword = parsed.password;
        auth = urlUsername + ':' + urlPassword;
      }

      auth && headers.delete('authorization');

      let path;

      try {
        path = buildURL(
          parsed.pathname + parsed.search,
          config.params,
          config.paramsSerializer
        ).replace(/^\?/, '');
      } catch (err) {
        const customErr = new Error(err.message);
        customErr.config = config;
        customErr.url = config.url;
        customErr.exists = true;
        return reject(customErr);
      }

      headers.set(
        'Accept-Encoding',
        'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''), false
        );

      const options = {
        path,
        method: method,
        headers: headers.toJSON(),
        agents: { http: config.httpAgent, https: config.httpsAgent },
        auth,
        protocol,
        family,
        beforeRedirect: dispatchBeforeRedirect,
        beforeRedirects: {}
      };

      // cacheable-lookup integration hotfix
      !utils$1.isUndefined(lookup) && (options.lookup = lookup);

      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
        setProxy(options, config.proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
      }

      let transport;
      const isHttpsRequest = isHttps.test(options.protocol);
      options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsRequest ? require$$4 : require$$3;
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        if (config.beforeRedirect) {
          options.beforeRedirects.config = config.beforeRedirect;
        }
        transport = isHttpsRequest ? httpsFollow : httpFollow;
      }

      if (config.maxBodyLength > -1) {
        options.maxBodyLength = config.maxBodyLength;
      } else {
        // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
        options.maxBodyLength = Infinity;
      }

      if (config.insecureHTTPParser) {
        options.insecureHTTPParser = config.insecureHTTPParser;
      }

      // Create the request
      req = transport.request(options, function handleResponse(res) {
        if (req.destroyed) return;

        const streams = [res];

        const responseLength = +res.headers['content-length'];

        if (onDownloadProgress) {
          const transformStream = new AxiosTransformStream({
            length: utils$1.toFiniteNumber(responseLength),
            maxRate: utils$1.toFiniteNumber(maxDownloadRate)
          });

          onDownloadProgress && transformStream.on('progress', progress => {
            onDownloadProgress(Object.assign(progress, {
              download: true
            }));
          });

          streams.push(transformStream);
        }

        // decompress the response body transparently if required
        let responseStream = res;

        // return the last request in case of redirects
        const lastRequest = res.req || req;

        // if decompress disabled we should not decompress
        if (config.decompress !== false && res.headers['content-encoding']) {
          // if no content, but headers still say that it is encoded,
          // remove the header not confuse downstream operations
          if (method === 'HEAD' || res.statusCode === 204) {
            delete res.headers['content-encoding'];
          }

          switch ((res.headers['content-encoding'] || '').toLowerCase()) {
          /*eslint default-case:0*/
          case 'gzip':
          case 'x-gzip':
          case 'compress':
          case 'x-compress':
            // add the unzipper to the body stream processing pipeline
            streams.push(zlib.createUnzip(zlibOptions));

            // remove the content-encoding in order to not confuse downstream operations
            delete res.headers['content-encoding'];
            break;
          case 'deflate':
            streams.push(new ZlibHeaderTransformStream());

            // add the unzipper to the body stream processing pipeline
            streams.push(zlib.createUnzip(zlibOptions));

            // remove the content-encoding in order to not confuse downstream operations
            delete res.headers['content-encoding'];
            break;
          case 'br':
            if (isBrotliSupported) {
              streams.push(zlib.createBrotliDecompress(brotliOptions));
              delete res.headers['content-encoding'];
            }
          }
        }

        responseStream = streams.length > 1 ? stream.pipeline(streams, utils$1.noop) : streams[0];

        const offListeners = stream.finished(responseStream, () => {
          offListeners();
          onFinished();
        });

        const response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: new AxiosHeaders(res.headers),
          config,
          request: lastRequest
        };

        if (responseType === 'stream') {
          response.data = responseStream;
          settle(resolve, reject, response);
        } else {
          const responseBuffer = [];
          let totalResponseBytes = 0;

          responseStream.on('data', function handleStreamData(chunk) {
            responseBuffer.push(chunk);
            totalResponseBytes += chunk.length;

            // make sure the content length is not over the maxContentLength if specified
            if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
              // stream.destroy() emit aborted event before calling reject() on Node.js v16
              rejected = true;
              responseStream.destroy();
              reject(new AxiosError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
                AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
            }
          });

          responseStream.on('aborted', function handlerStreamAborted() {
            if (rejected) {
              return;
            }

            const err = new AxiosError(
              'maxContentLength size of ' + config.maxContentLength + ' exceeded',
              AxiosError.ERR_BAD_RESPONSE,
              config,
              lastRequest
            );
            responseStream.destroy(err);
            reject(err);
          });

          responseStream.on('error', function handleStreamError(err) {
            if (req.destroyed) return;
            reject(AxiosError.from(err, null, config, lastRequest));
          });

          responseStream.on('end', function handleStreamEnd() {
            try {
              let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
              if (responseType !== 'arraybuffer') {
                responseData = responseData.toString(responseEncoding);
                if (!responseEncoding || responseEncoding === 'utf8') {
                  responseData = utils$1.stripBOM(responseData);
                }
              }
              response.data = responseData;
            } catch (err) {
              return reject(AxiosError.from(err, null, config, response.request, response));
            }
            settle(resolve, reject, response);
          });
        }

        emitter.once('abort', err => {
          if (!responseStream.destroyed) {
            responseStream.emit('error', err);
            responseStream.destroy();
          }
        });
      });

      emitter.once('abort', err => {
        reject(err);
        req.destroy(err);
      });

      // Handle errors
      req.on('error', function handleRequestError(err) {
        // @todo remove
        // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
        reject(AxiosError.from(err, null, config, req));
      });

      // set tcp keep alive to prevent drop connection by peer
      req.on('socket', function handleRequestSocket(socket) {
        // default interval of sending ack packet is 1 minute
        socket.setKeepAlive(true, 1000 * 60);
      });

      // Handle request timeout
      if (config.timeout) {
        // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
        const timeout = parseInt(config.timeout, 10);

        if (Number.isNaN(timeout)) {
          reject(new AxiosError(
            'error trying to parse `config.timeout` to int',
            AxiosError.ERR_BAD_OPTION_VALUE,
            config,
            req
          ));

          return;
        }

        // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
        // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
        // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
        // And then these socket which be hang up will devouring CPU little by little.
        // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
        req.setTimeout(timeout, function handleRequestTimeout() {
          if (isDone) return;
          let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          const transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError(
            timeoutErrorMessage,
            transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
            config,
            req
          ));
          abort();
        });
      }


      // Send the request
      if (utils$1.isStream(data)) {
        let ended = false;
        let errored = false;

        data.on('end', () => {
          ended = true;
        });

        data.once('error', err => {
          errored = true;
          req.destroy(err);
        });

        data.on('close', () => {
          if (!ended && !errored) {
            abort(new CanceledError('Request stream has been aborted', config, req));
          }
        });

        data.pipe(req);
      } else {
        req.end(data);
      }
    });
  };

  var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
    let bytesNotified = 0;
    const _speedometer = speedometer(50, 250);

    return throttle(e => {
      const loaded = e.loaded;
      const total = e.lengthComputable ? e.total : undefined;
      const progressBytes = loaded - bytesNotified;
      const rate = _speedometer(progressBytes);
      const inRange = loaded <= total;

      bytesNotified = loaded;

      const data = {
        loaded,
        total,
        progress: total ? (loaded / total) : undefined,
        bytes: progressBytes,
        rate: rate ? rate : undefined,
        estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
        event: e,
        lengthComputable: total != null
      };

      data[isDownloadStream ? 'download' : 'upload'] = true;

      listener(data);
    }, freq);
  };

  var isURLSameOrigin = platform.hasStandardBrowserEnv ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent);
      const urlParsingNode = document.createElement('a');
      let originURL;

      /**
      * Parse a URL to discover its components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
      function resolveURL(url) {
        let href = url;

        if (msie) {
          // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
      return function isURLSameOrigin(requestURL) {
        const parsed = (utils$1.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })();

  var cookies = platform.hasStandardBrowserEnv ?

    // Standard browser envs support document.cookie
    {
      write(name, value, expires, path, domain, secure) {
        const cookie = [name + '=' + encodeURIComponent(value)];

        utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

        utils$1.isString(path) && cookie.push('path=' + path);

        utils$1.isString(domain) && cookie.push('domain=' + domain);

        secure === true && cookie.push('secure');

        document.cookie = cookie.join('; ');
      },

      read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    }

    :

    // Non-standard browser env (web workers, react-native) lack needed support.
    {
      write() {},
      read() {
        return null;
      },
      remove() {}
    };

  const headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   *
   * @returns {Object} New object resulting from merging config2 to config1
   */
  function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};

    function getMergedValue(target, source, caseless) {
      if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
        return utils$1.merge.call({caseless}, target, source);
      } else if (utils$1.isPlainObject(source)) {
        return utils$1.merge({}, source);
      } else if (utils$1.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, caseless) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(a, b, caseless);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(undefined, a, caseless);
      }
    }

    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(undefined, b);
      }
    }

    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
      if (!utils$1.isUndefined(b)) {
        return getMergedValue(undefined, b);
      } else if (!utils$1.isUndefined(a)) {
        return getMergedValue(undefined, a);
      }
    }

    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
      if (prop in config2) {
        return getMergedValue(a, b);
      } else if (prop in config1) {
        return getMergedValue(undefined, a);
      }
    }

    const mergeMap = {
      url: valueFromConfig2,
      method: valueFromConfig2,
      data: valueFromConfig2,
      baseURL: defaultToConfig2,
      transformRequest: defaultToConfig2,
      transformResponse: defaultToConfig2,
      paramsSerializer: defaultToConfig2,
      timeout: defaultToConfig2,
      timeoutMessage: defaultToConfig2,
      withCredentials: defaultToConfig2,
      withXSRFToken: defaultToConfig2,
      adapter: defaultToConfig2,
      responseType: defaultToConfig2,
      xsrfCookieName: defaultToConfig2,
      xsrfHeaderName: defaultToConfig2,
      onUploadProgress: defaultToConfig2,
      onDownloadProgress: defaultToConfig2,
      decompress: defaultToConfig2,
      maxContentLength: defaultToConfig2,
      maxBodyLength: defaultToConfig2,
      beforeRedirect: defaultToConfig2,
      transport: defaultToConfig2,
      httpAgent: defaultToConfig2,
      httpsAgent: defaultToConfig2,
      cancelToken: defaultToConfig2,
      socketPath: defaultToConfig2,
      responseEncoding: defaultToConfig2,
      validateStatus: mergeDirectKeys,
      headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };

    utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
      const merge = mergeMap[prop] || mergeDeepProperties;
      const configValue = merge(config1[prop], config2[prop], prop);
      (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
    });

    return config;
  }

  var resolveConfig = (config) => {
    const newConfig = mergeConfig({}, config);

    let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

    newConfig.headers = headers = AxiosHeaders.from(headers);

    newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

    // HTTP basic authentication
    if (auth) {
      headers.set('Authorization', 'Basic ' +
        btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
      );
    }

    let contentType;

    if (utils$1.isFormData(data)) {
      if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
        headers.setContentType(undefined); // Let the browser set it
      } else if ((contentType = headers.getContentType()) !== false) {
        // fix semicolon duplication issue for ReactNative FormData implementation
        const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
        headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
      }
    }

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.

    if (platform.hasStandardBrowserEnv) {
      withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

      if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
        // Add xsrf header
        const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

        if (xsrfValue) {
          headers.set(xsrfHeaderName, xsrfValue);
        }
      }
    }

    return newConfig;
  };

  const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

  var xhrAdapter = isXHRAdapterSupported && function (config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      const _config = resolveConfig(config);
      let requestData = _config.data;
      const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
      let {responseType} = _config;
      let onCanceled;
      function done() {
        if (_config.cancelToken) {
          _config.cancelToken.unsubscribe(onCanceled);
        }

        if (_config.signal) {
          _config.signal.removeEventListener('abort', onCanceled);
        }
      }

      let request = new XMLHttpRequest();

      request.open(_config.method.toUpperCase(), _config.url, true);

      // Set the request timeout in MS
      request.timeout = _config.timeout;

      function onloadend() {
        if (!request) {
          return;
        }
        // Prepare the response
        const responseHeaders = AxiosHeaders.from(
          'getAllResponseHeaders' in request && request.getAllResponseHeaders()
        );
        const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
          request.responseText : request.response;
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };

        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);

        // Clean up request
        request = null;
      }

      if ('onloadend' in request) {
        // Use onloadend if available
        request.onloadend = onloadend;
      } else {
        // Listen for ready state to emulate onloadend
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          // readystate handler is calling before onerror or ontimeout handlers,
          // so we should call onloadend on the next 'tick'
          setTimeout(onloadend);
        };
      }

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, _config, request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, _config, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = _config.transitional || transitionalDefaults;
        if (_config.timeoutErrorMessage) {
          timeoutErrorMessage = _config.timeoutErrorMessage;
        }
        reject(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          _config,
          request));

        // Clean up request
        request = null;
      };

      // Remove Content-Type if data is undefined
      requestData === undefined && requestHeaders.setContentType(null);

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
          request.setRequestHeader(key, val);
        });
      }

      // Add withCredentials to request if needed
      if (!utils$1.isUndefined(_config.withCredentials)) {
        request.withCredentials = !!_config.withCredentials;
      }

      // Add responseType to request if needed
      if (responseType && responseType !== 'json') {
        request.responseType = _config.responseType;
      }

      // Handle progress if needed
      if (typeof _config.onDownloadProgress === 'function') {
        request.addEventListener('progress', progressEventReducer(_config.onDownloadProgress, true));
      }

      // Not all browsers support upload events
      if (typeof _config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', progressEventReducer(_config.onUploadProgress));
      }

      if (_config.cancelToken || _config.signal) {
        // Handle cancellation
        // eslint-disable-next-line func-names
        onCanceled = cancel => {
          if (!request) {
            return;
          }
          reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
          request.abort();
          request = null;
        };

        _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
        if (_config.signal) {
          _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
        }
      }

      const protocol = parseProtocol(_config.url);

      if (protocol && platform.protocols.indexOf(protocol) === -1) {
        reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
        return;
      }


      // Send the request
      request.send(requestData || null);
    });
  };

  const composeSignals = (signals, timeout) => {
    let controller = new AbortController();

    let aborted;

    const onabort = function (cancel) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = cancel instanceof Error ? cancel : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal &&
          (signal.removeEventListener ? signal.removeEventListener('abort', onabort) : signal.unsubscribe(onabort));
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal && signal.addEventListener && signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = unsubscribe;

    return [signal, () => {
      timer && clearTimeout(timer);
      timer = null;
    }];
  };

  const streamChunk = function* (chunk, chunkSize) {
    let len = chunk.byteLength;

    if (!chunkSize || len < chunkSize) {
      yield chunk;
      return;
    }

    let pos = 0;
    let end;

    while (pos < len) {
      end = pos + chunkSize;
      yield chunk.slice(pos, end);
      pos = end;
    }
  };

  const readBytes = async function* (iterable, chunkSize, encode) {
    for await (const chunk of iterable) {
      yield* streamChunk(ArrayBuffer.isView(chunk) ? chunk : (await encode(String(chunk))), chunkSize);
    }
  };

  const trackStream = (stream, chunkSize, onProgress, onFinish, encode) => {
    const iterator = readBytes(stream, chunkSize, encode);

    let bytes = 0;

    return new ReadableStream({
      type: 'bytes',

      async pull(controller) {
        const {done, value} = await iterator.next();

        if (done) {
          controller.close();
          onFinish();
          return;
        }

        let len = value.byteLength;
        onProgress && onProgress(bytes += len);
        controller.enqueue(new Uint8Array(value));
      },
      cancel(reason) {
        onFinish(reason);
        return iterator.return();
      }
    }, {
      highWaterMark: 2
    })
  };

  const fetchProgressDecorator = (total, fn) => {
    const lengthComputable = total != null;
    return (loaded) => setTimeout(() => fn({
      lengthComputable,
      total,
      loaded
    }));
  };

  const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
  const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

  // used only inside the fetch adapter
  const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
      ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
      async (str) => new Uint8Array(await new Response(str).arrayBuffer())
  );

  const supportsRequestStream = isReadableStreamSupported && (() => {
    let duplexAccessed = false;

    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream(),
      method: 'POST',
      get duplex() {
        duplexAccessed = true;
        return 'half';
      },
    }).headers.has('Content-Type');

    return duplexAccessed && !hasContentType;
  })();

  const DEFAULT_CHUNK_SIZE = 64 * 1024;

  const supportsResponseStream = isReadableStreamSupported && !!(()=> {
    try {
      return utils$1.isReadableStream(new Response('').body);
    } catch(err) {
      // return undefined
    }
  })();

  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };

  isFetchSupported && (((res) => {
    ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
      !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
        (_, config) => {
          throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
        });
    });
  })(new Response));

  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }

    if(utils$1.isBlob(body)) {
      return body.size;
    }

    if(utils$1.isSpecCompliantForm(body)) {
      return (await new Request(body).arrayBuffer()).byteLength;
    }

    if(utils$1.isArrayBufferView(body)) {
      return body.byteLength;
    }

    if(utils$1.isURLSearchParams(body)) {
      body = body + '';
    }

    if(utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };

  const resolveBodyLength = async (headers, body) => {
    const length = utils$1.toFiniteNumber(headers.getContentLength());

    return length == null ? getBodyLength(body) : length;
  };

  var fetchAdapter = isFetchSupported && (async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = 'same-origin',
      fetchOptions
    } = resolveConfig(config);

    responseType = responseType ? (responseType + '').toLowerCase() : 'text';

    let [composedSignal, stopTimeout] = (signal || cancelToken || timeout) ?
      composeSignals([signal, cancelToken], timeout) : [];

    let finished, request;

    const onFinish = () => {
      !finished && setTimeout(() => {
        composedSignal && composedSignal.unsubscribe();
      });

      finished = true;
    };

    let requestContentLength;

    try {
      if (
        onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
        (requestContentLength = await resolveBodyLength(headers, data)) !== 0
      ) {
        let _request = new Request(url, {
          method: 'POST',
          body: data,
          duplex: "half"
        });

        let contentTypeHeader;

        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
          headers.setContentType(contentTypeHeader);
        }

        if (_request.body) {
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, fetchProgressDecorator(
            requestContentLength,
            progressEventReducer(onUploadProgress)
          ), null, encodeText);
        }
      }

      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? 'cors' : 'omit';
      }

      request = new Request(url, {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        withCredentials
      });

      let response = await fetch(request);

      const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

      if (supportsResponseStream && (onDownloadProgress || isStreamResponse)) {
        const options = {};

        ['status', 'statusText', 'headers'].forEach(prop => {
          options[prop] = response[prop];
        });

        const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onDownloadProgress && fetchProgressDecorator(
            responseContentLength,
            progressEventReducer(onDownloadProgress, true)
          ), isStreamResponse && onFinish, encodeText),
          options
        );
      }

      responseType = responseType || 'text';

      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

      !isStreamResponse && onFinish();

      stopTimeout && stopTimeout();

      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      })
    } catch (err) {
      onFinish();

      if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        )
      }

      throw AxiosError.from(err, err && err.code, config, request);
    }
  });

  const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter,
    fetch: fetchAdapter
  };

  utils$1.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, 'name', {value});
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
      Object.defineProperty(fn, 'adapterName', {value});
    }
  });

  const renderReason = (reason) => `- ${reason}`;

  const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

  var adapters = {
    getAdapter: (adapters) => {
      adapters = utils$1.isArray(adapters) ? adapters : [adapters];

      const {length} = adapters;
      let nameOrAdapter;
      let adapter;

      const rejectedReasons = {};

      for (let i = 0; i < length; i++) {
        nameOrAdapter = adapters[i];
        let id;

        adapter = nameOrAdapter;

        if (!isResolvedHandle(nameOrAdapter)) {
          adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

          if (adapter === undefined) {
            throw new AxiosError(`Unknown adapter '${id}'`);
          }
        }

        if (adapter) {
          break;
        }

        rejectedReasons[id || '#' + i] = adapter;
      }

      if (!adapter) {

        const reasons = Object.entries(rejectedReasons)
          .map(([id, state]) => `adapter ${id} ` +
            (state === false ? 'is not supported by the environment' : 'is not available in the build')
          );

        let s = length ?
          (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
          'as no adapter specified';

        throw new AxiosError(
          `There is no suitable adapter to dispatch the request ` + s,
          'ERR_NOT_SUPPORT'
        );
      }

      return adapter;
    },
    adapters: knownAdapters
  };

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   *
   * @param {Object} config The config that is to be used for the request
   *
   * @returns {void}
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }

    if (config.signal && config.signal.aborted) {
      throw new CanceledError(null, config);
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    config.headers = AxiosHeaders.from(config.headers);

    // Transform request data
    config.data = transformData.call(
      config,
      config.transformRequest
    );

    if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
      config.headers.setContentType('application/x-www-form-urlencoded', false);
    }

    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );

      response.headers = AxiosHeaders.from(response.headers);

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders.from(reason.response.headers);
        }
      }

      return Promise.reject(reason);
    });
  }

  const validators$1 = {};

  // eslint-disable-next-line func-names
  ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
    validators$1[type] = function validator(thing) {
      return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
    };
  });

  const deprecatedWarnings = {};

  /**
   * Transitional option validator
   *
   * @param {function|boolean?} validator - set to false if the transitional option has been removed
   * @param {string?} version - deprecated version / removed since version
   * @param {string?} message - some message with additional info
   *
   * @returns {function}
   */
  validators$1.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
      return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
    }

    // eslint-disable-next-line func-names
    return (value, opt, opts) => {
      if (validator === false) {
        throw new AxiosError(
          formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
          AxiosError.ERR_DEPRECATED
        );
      }

      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        // eslint-disable-next-line no-console
        console.warn(
          formatMessage(
            opt,
            ' has been deprecated since v' + version + ' and will be removed in the near future'
          )
        );
      }

      return validator ? validator(value, opt, opts) : true;
    };
  };

  /**
   * Assert object's properties type
   *
   * @param {object} options
   * @param {object} schema
   * @param {boolean?} allowUnknown
   *
   * @returns {object}
   */

  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== 'object') {
      throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while (i-- > 0) {
      const opt = keys[i];
      const validator = schema[opt];
      if (validator) {
        const value = options[opt];
        const result = value === undefined || validator(value, opt, options);
        if (result !== true) {
          throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }

  var validator = {
    assertOptions,
    validators: validators$1
  };

  const validators = validator.validators;

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   *
   * @return {Axios} A new instance of Axios
   */
  class Axios {
    constructor(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */
    async request(configOrUrl, config) {
      try {
        return await this._request(configOrUrl, config);
      } catch (err) {
        if (err instanceof Error) {
          let dummy;

          Error.captureStackTrace ? Error.captureStackTrace(dummy = {}) : (dummy = new Error());

          // slice off the Error: ... line
          const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
          try {
            if (!err.stack) {
              err.stack = stack;
              // match without the 2 top stack lines
            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
              err.stack += '\n' + stack;
            }
          } catch (e) {
            // ignore the case where "stack" is an un-writable property
          }
        }

        throw err;
      }
    }

    _request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      const {transitional, paramsSerializer, headers} = config;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      if (paramsSerializer != null) {
        if (utils$1.isFunction(paramsSerializer)) {
          config.paramsSerializer = {
            serialize: paramsSerializer
          };
        } else {
          validator.assertOptions(paramsSerializer, {
            encode: validators.function,
            serialize: validators.function
          }, true);
        }
      }

      // Set config.method
      config.method = (config.method || this.defaults.method || 'get').toLowerCase();

      // Flatten headers
      let contextHeaders = headers && utils$1.merge(
        headers.common,
        headers[config.method]
      );

      headers && utils$1.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        (method) => {
          delete headers[method];
        }
      );

      config.headers = AxiosHeaders.concat(contextHeaders, headers);

      // filter out skipped interceptors
      const requestInterceptorChain = [];
      let synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      const responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      let promise;
      let i = 0;
      let len;

      if (!synchronousRequestInterceptors) {
        const chain = [dispatchRequest.bind(this), undefined];
        chain.unshift.apply(chain, requestInterceptorChain);
        chain.push.apply(chain, responseInterceptorChain);
        len = chain.length;

        promise = Promise.resolve(config);

        while (i < len) {
          promise = promise.then(chain[i++], chain[i++]);
        }

        return promise;
      }

      len = requestInterceptorChain.length;

      let newConfig = config;

      i = 0;

      while (i < len) {
        const onFulfilled = requestInterceptorChain[i++];
        const onRejected = requestInterceptorChain[i++];
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected.call(this, error);
          break;
        }
      }

      try {
        promise = dispatchRequest.call(this, newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      i = 0;
      len = responseInterceptorChain.length;

      while (i < len) {
        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
      }

      return promise;
    }

    getUri(config) {
      config = mergeConfig(this.defaults, config);
      const fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    }
  }

  // Provide aliases for supported request methods
  utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });

  utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/

    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method,
          headers: isForm ? {
            'Content-Type': 'multipart/form-data'
          } : {},
          url,
          data
        }));
      };
    }

    Axios.prototype[method] = generateHTTPMethod();

    Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
  });

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @param {Function} executor The executor function.
   *
   * @returns {CancelToken}
   */
  class CancelToken {
    constructor(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      let resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      const token = this;

      // eslint-disable-next-line func-names
      this.promise.then(cancel => {
        if (!token._listeners) return;

        let i = token._listeners.length;

        while (i-- > 0) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = onfulfilled => {
        let _resolve;
        // eslint-disable-next-line func-names
        const promise = new Promise(resolve => {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message, config, request) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError(message, config, request);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    }

    /**
     * Subscribe to the cancel signal
     */

    subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    }

    /**
     * Unsubscribe from the cancel signal
     */

    unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    }

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source() {
      let cancel;
      const token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel
      };
    }
  }

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   *
   * @returns {Function}
   */
  function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  }

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   *
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  function isAxiosError(payload) {
    return utils$1.isObject(payload) && (payload.isAxiosError === true);
  }

  const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
  };

  Object.entries(HttpStatusCode).forEach(([key, value]) => {
    HttpStatusCode[value] = key;
  });

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   *
   * @returns {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    const context = new Axios(defaultConfig);
    const instance = bind(Axios.prototype.request, context);

    // Copy axios.prototype to instance
    utils$1.extend(instance, Axios.prototype, context, {allOwnKeys: true});

    // Copy context to instance
    utils$1.extend(instance, context, null, {allOwnKeys: true});

    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };

    return instance;
  }

  // Create the default instance to be exported
  const axios = createInstance(defaults);

  // Expose Axios class to allow class inheritance
  axios.Axios = Axios;

  // Expose Cancel & CancelToken
  axios.CanceledError = CanceledError;
  axios.CancelToken = CancelToken;
  axios.isCancel = isCancel;
  axios.VERSION = VERSION;
  axios.toFormData = toFormData;

  // Expose AxiosError class
  axios.AxiosError = AxiosError;

  // alias for CanceledError for backward compatibility
  axios.Cancel = axios.CanceledError;

  // Expose all/spread
  axios.all = function all(promises) {
    return Promise.all(promises);
  };

  axios.spread = spread;

  // Expose isAxiosError
  axios.isAxiosError = isAxiosError;

  // Expose mergeConfig
  axios.mergeConfig = mergeConfig;

  axios.AxiosHeaders = AxiosHeaders;

  axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

  axios.getAdapter = adapters.getAdapter;

  axios.HttpStatusCode = HttpStatusCode;

  axios.default = axios;

  var rawurlencode = function rawurlencode (str) {
    //       discuss at: http://locutus.io/php/rawurlencode/
    //      original by: Brett Zamir (http://brett-zamir.me)
    //         input by: travc
    //         input by: Brett Zamir (http://brett-zamir.me)
    //         input by: Michael Grier
    //         input by: Ratheous
    //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: Joris
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    // reimplemented by: Brett Zamir (http://brett-zamir.me)
    //           note 1: This reflects PHP 5.3/6.0+ behavior
    //           note 1: Please be aware that this function expects \
    //           note 1: to encode into UTF-8 encoded strings, as found on
    //           note 1: pages served as UTF-8
    //        example 1: rawurlencode('Kevin van Zonneveld!')
    //        returns 1: 'Kevin%20van%20Zonneveld%21'
    //        example 2: rawurlencode('http://kvz.io/')
    //        returns 2: 'http%3A%2F%2Fkvz.io%2F'
    //        example 3: rawurlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
    //        returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'

    str = (str + '');

    // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
    // but if you want to reflect current
    // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
  };

  var rawurlencode$1 = /*@__PURE__*/getDefaultExportFromCjs(rawurlencode);

  var x2js = {exports: {}};

  var lib = {};

  var dom = {};

  var conventions = {};

  var hasRequiredConventions;

  function requireConventions () {
  	if (hasRequiredConventions) return conventions;
  	hasRequiredConventions = 1;

  	/**
  	 * Ponyfill for `Array.prototype.find` which is only available in ES6 runtimes.
  	 *
  	 * Works with anything that has a `length` property and index access properties, including NodeList.
  	 *
  	 * @template {unknown} T
  	 * @param {Array<T> | ({length:number, [number]: T})} list
  	 * @param {function (item: T, index: number, list:Array<T> | ({length:number, [number]: T})):boolean} predicate
  	 * @param {Partial<Pick<ArrayConstructor['prototype'], 'find'>>?} ac `Array.prototype` by default,
  	 * 				allows injecting a custom implementation in tests
  	 * @returns {T | undefined}
  	 *
  	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  	 * @see https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.find
  	 */
  	function find(list, predicate, ac) {
  		if (ac === undefined) {
  			ac = Array.prototype;
  		}
  		if (list && typeof ac.find === 'function') {
  			return ac.find.call(list, predicate);
  		}
  		for (var i = 0; i < list.length; i++) {
  			if (Object.prototype.hasOwnProperty.call(list, i)) {
  				var item = list[i];
  				if (predicate.call(undefined, item, i, list)) {
  					return item;
  				}
  			}
  		}
  	}

  	/**
  	 * "Shallow freezes" an object to render it immutable.
  	 * Uses `Object.freeze` if available,
  	 * otherwise the immutability is only in the type.
  	 *
  	 * Is used to create "enum like" objects.
  	 *
  	 * @template T
  	 * @param {T} object the object to freeze
  	 * @param {Pick<ObjectConstructor, 'freeze'> = Object} oc `Object` by default,
  	 * 				allows to inject custom object constructor for tests
  	 * @returns {Readonly<T>}
  	 *
  	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
  	 */
  	function freeze(object, oc) {
  		if (oc === undefined) {
  			oc = Object;
  		}
  		return oc && typeof oc.freeze === 'function' ? oc.freeze(object) : object
  	}

  	/**
  	 * Since we can not rely on `Object.assign` we provide a simplified version
  	 * that is sufficient for our needs.
  	 *
  	 * @param {Object} target
  	 * @param {Object | null | undefined} source
  	 *
  	 * @returns {Object} target
  	 * @throws TypeError if target is not an object
  	 *
  	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  	 * @see https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.assign
  	 */
  	function assign(target, source) {
  		if (target === null || typeof target !== 'object') {
  			throw new TypeError('target is not an object')
  		}
  		for (var key in source) {
  			if (Object.prototype.hasOwnProperty.call(source, key)) {
  				target[key] = source[key];
  			}
  		}
  		return target
  	}

  	/**
  	 * All mime types that are allowed as input to `DOMParser.parseFromString`
  	 *
  	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString#Argument02 MDN
  	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#domparsersupportedtype WHATWG HTML Spec
  	 * @see DOMParser.prototype.parseFromString
  	 */
  	var MIME_TYPE = freeze({
  		/**
  		 * `text/html`, the only mime type that triggers treating an XML document as HTML.
  		 *
  		 * @see DOMParser.SupportedType.isHTML
  		 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
  		 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
  		 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
  		 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring WHATWG HTML Spec
  		 */
  		HTML: 'text/html',

  		/**
  		 * Helper method to check a mime type if it indicates an HTML document
  		 *
  		 * @param {string} [value]
  		 * @returns {boolean}
  		 *
  		 * @see https://www.iana.org/assignments/media-types/text/html IANA MimeType registration
  		 * @see https://en.wikipedia.org/wiki/HTML Wikipedia
  		 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString MDN
  		 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-domparser-parsefromstring 	 */
  		isHTML: function (value) {
  			return value === MIME_TYPE.HTML
  		},

  		/**
  		 * `application/xml`, the standard mime type for XML documents.
  		 *
  		 * @see https://www.iana.org/assignments/media-types/application/xml IANA MimeType registration
  		 * @see https://tools.ietf.org/html/rfc7303#section-9.1 RFC 7303
  		 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
  		 */
  		XML_APPLICATION: 'application/xml',

  		/**
  		 * `text/html`, an alias for `application/xml`.
  		 *
  		 * @see https://tools.ietf.org/html/rfc7303#section-9.2 RFC 7303
  		 * @see https://www.iana.org/assignments/media-types/text/xml IANA MimeType registration
  		 * @see https://en.wikipedia.org/wiki/XML_and_MIME Wikipedia
  		 */
  		XML_TEXT: 'text/xml',

  		/**
  		 * `application/xhtml+xml`, indicates an XML document that has the default HTML namespace,
  		 * but is parsed as an XML document.
  		 *
  		 * @see https://www.iana.org/assignments/media-types/application/xhtml+xml IANA MimeType registration
  		 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument WHATWG DOM Spec
  		 * @see https://en.wikipedia.org/wiki/XHTML Wikipedia
  		 */
  		XML_XHTML_APPLICATION: 'application/xhtml+xml',

  		/**
  		 * `image/svg+xml`,
  		 *
  		 * @see https://www.iana.org/assignments/media-types/image/svg+xml IANA MimeType registration
  		 * @see https://www.w3.org/TR/SVG11/ W3C SVG 1.1
  		 * @see https://en.wikipedia.org/wiki/Scalable_Vector_Graphics Wikipedia
  		 */
  		XML_SVG_IMAGE: 'image/svg+xml',
  	});

  	/**
  	 * Namespaces that are used in this code base.
  	 *
  	 * @see http://www.w3.org/TR/REC-xml-names
  	 */
  	var NAMESPACE = freeze({
  		/**
  		 * The XHTML namespace.
  		 *
  		 * @see http://www.w3.org/1999/xhtml
  		 */
  		HTML: 'http://www.w3.org/1999/xhtml',

  		/**
  		 * Checks if `uri` equals `NAMESPACE.HTML`.
  		 *
  		 * @param {string} [uri]
  		 *
  		 * @see NAMESPACE.HTML
  		 */
  		isHTML: function (uri) {
  			return uri === NAMESPACE.HTML
  		},

  		/**
  		 * The SVG namespace.
  		 *
  		 * @see http://www.w3.org/2000/svg
  		 */
  		SVG: 'http://www.w3.org/2000/svg',

  		/**
  		 * The `xml:` namespace.
  		 *
  		 * @see http://www.w3.org/XML/1998/namespace
  		 */
  		XML: 'http://www.w3.org/XML/1998/namespace',

  		/**
  		 * The `xmlns:` namespace
  		 *
  		 * @see https://www.w3.org/2000/xmlns/
  		 */
  		XMLNS: 'http://www.w3.org/2000/xmlns/',
  	});

  	conventions.assign = assign;
  	conventions.find = find;
  	conventions.freeze = freeze;
  	conventions.MIME_TYPE = MIME_TYPE;
  	conventions.NAMESPACE = NAMESPACE;
  	return conventions;
  }

  var hasRequiredDom;

  function requireDom () {
  	if (hasRequiredDom) return dom;
  	hasRequiredDom = 1;
  	var conventions = requireConventions();

  	var find = conventions.find;
  	var NAMESPACE = conventions.NAMESPACE;

  	/**
  	 * A prerequisite for `[].filter`, to drop elements that are empty
  	 * @param {string} input
  	 * @returns {boolean}
  	 */
  	function notEmptyString (input) {
  		return input !== ''
  	}
  	/**
  	 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
  	 * @see https://infra.spec.whatwg.org/#ascii-whitespace
  	 *
  	 * @param {string} input
  	 * @returns {string[]} (can be empty)
  	 */
  	function splitOnASCIIWhitespace(input) {
  		// U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, U+0020 SPACE
  		return input ? input.split(/[\t\n\f\r ]+/).filter(notEmptyString) : []
  	}

  	/**
  	 * Adds element as a key to current if it is not already present.
  	 *
  	 * @param {Record<string, boolean | undefined>} current
  	 * @param {string} element
  	 * @returns {Record<string, boolean | undefined>}
  	 */
  	function orderedSetReducer (current, element) {
  		if (!current.hasOwnProperty(element)) {
  			current[element] = true;
  		}
  		return current;
  	}

  	/**
  	 * @see https://infra.spec.whatwg.org/#ordered-set
  	 * @param {string} input
  	 * @returns {string[]}
  	 */
  	function toOrderedSet(input) {
  		if (!input) return [];
  		var list = splitOnASCIIWhitespace(input);
  		return Object.keys(list.reduce(orderedSetReducer, {}))
  	}

  	/**
  	 * Uses `list.indexOf` to implement something like `Array.prototype.includes`,
  	 * which we can not rely on being available.
  	 *
  	 * @param {any[]} list
  	 * @returns {function(any): boolean}
  	 */
  	function arrayIncludes (list) {
  		return function(element) {
  			return list && list.indexOf(element) !== -1;
  		}
  	}

  	function copy(src,dest){
  		for(var p in src){
  			if (Object.prototype.hasOwnProperty.call(src, p)) {
  				dest[p] = src[p];
  			}
  		}
  	}

  	/**
  	^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
  	^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
  	 */
  	function _extends(Class,Super){
  		var pt = Class.prototype;
  		if(!(pt instanceof Super)){
  			function t(){}			t.prototype = Super.prototype;
  			t = new t();
  			copy(pt,t);
  			Class.prototype = pt = t;
  		}
  		if(pt.constructor != Class){
  			if(typeof Class != 'function'){
  				console.error("unknown Class:"+Class);
  			}
  			pt.constructor = Class;
  		}
  	}

  	// Node Types
  	var NodeType = {};
  	var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
  	var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
  	var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
  	var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
  	var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
  	var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
  	var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
  	var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
  	var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
  	var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
  	var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
  	var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

  	// ExceptionCode
  	var ExceptionCode = {};
  	var ExceptionMessage = {};
  	ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
  	ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
  	var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
  	ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
  	ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
  	ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
  	ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
  	var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
  	ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
  	var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
  	//level2
  	ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
  	ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
  	ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
  	ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
  	ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);

  	/**
  	 * DOM Level 2
  	 * Object DOMException
  	 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
  	 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
  	 */
  	function DOMException(code, message) {
  		if(message instanceof Error){
  			var error = message;
  		}else {
  			error = this;
  			Error.call(this, ExceptionMessage[code]);
  			this.message = ExceptionMessage[code];
  			if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
  		}
  		error.code = code;
  		if(message) this.message = this.message + ": " + message;
  		return error;
  	}	DOMException.prototype = Error.prototype;
  	copy(ExceptionCode,DOMException);

  	/**
  	 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
  	 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
  	 * The items in the NodeList are accessible via an integral index, starting from 0.
  	 */
  	function NodeList() {
  	}	NodeList.prototype = {
  		/**
  		 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
  		 * @standard level1
  		 */
  		length:0,
  		/**
  		 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
  		 * @standard level1
  		 * @param index  unsigned long
  		 *   Index into the collection.
  		 * @return Node
  		 * 	The node at the indexth position in the NodeList, or null if that is not a valid index.
  		 */
  		item: function(index) {
  			return index >= 0 && index < this.length ? this[index] : null;
  		},
  		toString:function(isHTML,nodeFilter){
  			for(var buf = [], i = 0;i<this.length;i++){
  				serializeToString(this[i],buf,isHTML,nodeFilter);
  			}
  			return buf.join('');
  		},
  		/**
  		 * @private
  		 * @param {function (Node):boolean} predicate
  		 * @returns {Node[]}
  		 */
  		filter: function (predicate) {
  			return Array.prototype.filter.call(this, predicate);
  		},
  		/**
  		 * @private
  		 * @param {Node} item
  		 * @returns {number}
  		 */
  		indexOf: function (item) {
  			return Array.prototype.indexOf.call(this, item);
  		},
  	};

  	function LiveNodeList(node,refresh){
  		this._node = node;
  		this._refresh = refresh;
  		_updateLiveList(this);
  	}
  	function _updateLiveList(list){
  		var inc = list._node._inc || list._node.ownerDocument._inc;
  		if (list._inc !== inc) {
  			var ls = list._refresh(list._node);
  			__set__(list,'length',ls.length);
  			if (!list.$$length || ls.length < list.$$length) {
  				for (var i = ls.length; i in list; i++) {
  					if (Object.prototype.hasOwnProperty.call(list, i)) {
  						delete list[i];
  					}
  				}
  			}
  			copy(ls,list);
  			list._inc = inc;
  		}
  	}
  	LiveNodeList.prototype.item = function(i){
  		_updateLiveList(this);
  		return this[i] || null;
  	};

  	_extends(LiveNodeList,NodeList);

  	/**
  	 * Objects implementing the NamedNodeMap interface are used
  	 * to represent collections of nodes that can be accessed by name.
  	 * Note that NamedNodeMap does not inherit from NodeList;
  	 * NamedNodeMaps are not maintained in any particular order.
  	 * Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index,
  	 * but this is simply to allow convenient enumeration of the contents of a NamedNodeMap,
  	 * and does not imply that the DOM specifies an order to these Nodes.
  	 * NamedNodeMap objects in the DOM are live.
  	 * used for attributes or DocumentType entities
  	 */
  	function NamedNodeMap() {
  	}
  	function _findNodeIndex(list,node){
  		var i = list.length;
  		while(i--){
  			if(list[i] === node){return i}
  		}
  	}

  	function _addNamedNode(el,list,newAttr,oldAttr){
  		if(oldAttr){
  			list[_findNodeIndex(list,oldAttr)] = newAttr;
  		}else {
  			list[list.length++] = newAttr;
  		}
  		if(el){
  			newAttr.ownerElement = el;
  			var doc = el.ownerDocument;
  			if(doc){
  				oldAttr && _onRemoveAttribute(doc,el,oldAttr);
  				_onAddAttribute(doc,el,newAttr);
  			}
  		}
  	}
  	function _removeNamedNode(el,list,attr){
  		//console.log('remove attr:'+attr)
  		var i = _findNodeIndex(list,attr);
  		if(i>=0){
  			var lastIndex = list.length-1;
  			while(i<lastIndex){
  				list[i] = list[++i];
  			}
  			list.length = lastIndex;
  			if(el){
  				var doc = el.ownerDocument;
  				if(doc){
  					_onRemoveAttribute(doc,el,attr);
  					attr.ownerElement = null;
  				}
  			}
  		}else {
  			throw new DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
  		}
  	}
  	NamedNodeMap.prototype = {
  		length:0,
  		item:NodeList.prototype.item,
  		getNamedItem: function(key) {
  	//		if(key.indexOf(':')>0 || key == 'xmlns'){
  	//			return null;
  	//		}
  			//console.log()
  			var i = this.length;
  			while(i--){
  				var attr = this[i];
  				//console.log(attr.nodeName,key)
  				if(attr.nodeName == key){
  					return attr;
  				}
  			}
  		},
  		setNamedItem: function(attr) {
  			var el = attr.ownerElement;
  			if(el && el!=this._ownerElement){
  				throw new DOMException(INUSE_ATTRIBUTE_ERR);
  			}
  			var oldAttr = this.getNamedItem(attr.nodeName);
  			_addNamedNode(this._ownerElement,this,attr,oldAttr);
  			return oldAttr;
  		},
  		/* returns Node */
  		setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
  			var el = attr.ownerElement, oldAttr;
  			if(el && el!=this._ownerElement){
  				throw new DOMException(INUSE_ATTRIBUTE_ERR);
  			}
  			oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
  			_addNamedNode(this._ownerElement,this,attr,oldAttr);
  			return oldAttr;
  		},

  		/* returns Node */
  		removeNamedItem: function(key) {
  			var attr = this.getNamedItem(key);
  			_removeNamedNode(this._ownerElement,this,attr);
  			return attr;


  		},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

  		//for level2
  		removeNamedItemNS:function(namespaceURI,localName){
  			var attr = this.getNamedItemNS(namespaceURI,localName);
  			_removeNamedNode(this._ownerElement,this,attr);
  			return attr;
  		},
  		getNamedItemNS: function(namespaceURI, localName) {
  			var i = this.length;
  			while(i--){
  				var node = this[i];
  				if(node.localName == localName && node.namespaceURI == namespaceURI){
  					return node;
  				}
  			}
  			return null;
  		}
  	};

  	/**
  	 * The DOMImplementation interface represents an object providing methods
  	 * which are not dependent on any particular document.
  	 * Such an object is returned by the `Document.implementation` property.
  	 *
  	 * __The individual methods describe the differences compared to the specs.__
  	 *
  	 * @constructor
  	 *
  	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation MDN
  	 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490 DOM Level 1 Core (Initial)
  	 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-102161490 DOM Level 2 Core
  	 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-102161490 DOM Level 3 Core
  	 * @see https://dom.spec.whatwg.org/#domimplementation DOM Living Standard
  	 */
  	function DOMImplementation() {
  	}

  	DOMImplementation.prototype = {
  		/**
  		 * The DOMImplementation.hasFeature() method returns a Boolean flag indicating if a given feature is supported.
  		 * The different implementations fairly diverged in what kind of features were reported.
  		 * The latest version of the spec settled to force this method to always return true, where the functionality was accurate and in use.
  		 *
  		 * @deprecated It is deprecated and modern browsers return true in all cases.
  		 *
  		 * @param {string} feature
  		 * @param {string} [version]
  		 * @returns {boolean} always true
  		 *
  		 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/hasFeature MDN
  		 * @see https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-5CED94D7 DOM Level 1 Core
  		 * @see https://dom.spec.whatwg.org/#dom-domimplementation-hasfeature DOM Living Standard
  		 */
  		hasFeature: function(feature, version) {
  				return true;
  		},
  		/**
  		 * Creates an XML Document object of the specified type with its document element.
  		 *
  		 * __It behaves slightly different from the description in the living standard__:
  		 * - There is no interface/class `XMLDocument`, it returns a `Document` instance.
  		 * - `contentType`, `encoding`, `mode`, `origin`, `url` fields are currently not declared.
  		 * - this implementation is not validating names or qualified names
  		 *   (when parsing XML strings, the SAX parser takes care of that)
  		 *
  		 * @param {string|null} namespaceURI
  		 * @param {string} qualifiedName
  		 * @param {DocumentType=null} doctype
  		 * @returns {Document}
  		 *
  		 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocument MDN
  		 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocument DOM Level 2 Core (initial)
  		 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocument  DOM Level 2 Core
  		 *
  		 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
  		 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
  		 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
  		 */
  		createDocument: function(namespaceURI,  qualifiedName, doctype){
  			var doc = new Document();
  			doc.implementation = this;
  			doc.childNodes = new NodeList();
  			doc.doctype = doctype || null;
  			if (doctype){
  				doc.appendChild(doctype);
  			}
  			if (qualifiedName){
  				var root = doc.createElementNS(namespaceURI, qualifiedName);
  				doc.appendChild(root);
  			}
  			return doc;
  		},
  		/**
  		 * Returns a doctype, with the given `qualifiedName`, `publicId`, and `systemId`.
  		 *
  		 * __This behavior is slightly different from the in the specs__:
  		 * - this implementation is not validating names or qualified names
  		 *   (when parsing XML strings, the SAX parser takes care of that)
  		 *
  		 * @param {string} qualifiedName
  		 * @param {string} [publicId]
  		 * @param {string} [systemId]
  		 * @returns {DocumentType} which can either be used with `DOMImplementation.createDocument` upon document creation
  		 * 				  or can be put into the document via methods like `Node.insertBefore()` or `Node.replaceChild()`
  		 *
  		 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation/createDocumentType MDN
  		 * @see https://www.w3.org/TR/DOM-Level-2-Core/core.html#Level-2-Core-DOM-createDocType DOM Level 2 Core
  		 * @see https://dom.spec.whatwg.org/#dom-domimplementation-createdocumenttype DOM Living Standard
  		 *
  		 * @see https://dom.spec.whatwg.org/#validate-and-extract DOM: Validate and extract
  		 * @see https://www.w3.org/TR/xml/#NT-NameStartChar XML Spec: Names
  		 * @see https://www.w3.org/TR/xml-names/#ns-qualnames XML Namespaces: Qualified names
  		 */
  		createDocumentType: function(qualifiedName, publicId, systemId){
  			var node = new DocumentType();
  			node.name = qualifiedName;
  			node.nodeName = qualifiedName;
  			node.publicId = publicId || '';
  			node.systemId = systemId || '';

  			return node;
  		}
  	};


  	/**
  	 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
  	 */

  	function Node() {
  	}
  	Node.prototype = {
  		firstChild : null,
  		lastChild : null,
  		previousSibling : null,
  		nextSibling : null,
  		attributes : null,
  		parentNode : null,
  		childNodes : null,
  		ownerDocument : null,
  		nodeValue : null,
  		namespaceURI : null,
  		prefix : null,
  		localName : null,
  		// Modified in DOM Level 2:
  		insertBefore:function(newChild, refChild){//raises
  			return _insertBefore(this,newChild,refChild);
  		},
  		replaceChild:function(newChild, oldChild){//raises
  			_insertBefore(this, newChild,oldChild, assertPreReplacementValidityInDocument);
  			if(oldChild){
  				this.removeChild(oldChild);
  			}
  		},
  		removeChild:function(oldChild){
  			return _removeChild(this,oldChild);
  		},
  		appendChild:function(newChild){
  			return this.insertBefore(newChild,null);
  		},
  		hasChildNodes:function(){
  			return this.firstChild != null;
  		},
  		cloneNode:function(deep){
  			return cloneNode(this.ownerDocument||this,this,deep);
  		},
  		// Modified in DOM Level 2:
  		normalize:function(){
  			var child = this.firstChild;
  			while(child){
  				var next = child.nextSibling;
  				if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
  					this.removeChild(next);
  					child.appendData(next.data);
  				}else {
  					child.normalize();
  					child = next;
  				}
  			}
  		},
  	  	// Introduced in DOM Level 2:
  		isSupported:function(feature, version){
  			return this.ownerDocument.implementation.hasFeature(feature,version);
  		},
  	    // Introduced in DOM Level 2:
  	    hasAttributes:function(){
  	    	return this.attributes.length>0;
  	    },
  		/**
  		 * Look up the prefix associated to the given namespace URI, starting from this node.
  		 * **The default namespace declarations are ignored by this method.**
  		 * See Namespace Prefix Lookup for details on the algorithm used by this method.
  		 *
  		 * _Note: The implementation seems to be incomplete when compared to the algorithm described in the specs._
  		 *
  		 * @param {string | null} namespaceURI
  		 * @returns {string | null}
  		 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespacePrefix
  		 * @see https://www.w3.org/TR/DOM-Level-3-Core/namespaces-algorithms.html#lookupNamespacePrefixAlgo
  		 * @see https://dom.spec.whatwg.org/#dom-node-lookupprefix
  		 * @see https://github.com/xmldom/xmldom/issues/322
  		 */
  	    lookupPrefix:function(namespaceURI){
  	    	var el = this;
  	    	while(el){
  	    		var map = el._nsMap;
  	    		//console.dir(map)
  	    		if(map){
  	    			for(var n in map){
  							if (Object.prototype.hasOwnProperty.call(map, n) && map[n] === namespaceURI) {
  								return n;
  							}
  	    			}
  	    		}
  	    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
  	    	}
  	    	return null;
  	    },
  	    // Introduced in DOM Level 3:
  	    lookupNamespaceURI:function(prefix){
  	    	var el = this;
  	    	while(el){
  	    		var map = el._nsMap;
  	    		//console.dir(map)
  	    		if(map){
  	    			if(Object.prototype.hasOwnProperty.call(map, prefix)){
  	    				return map[prefix] ;
  	    			}
  	    		}
  	    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
  	    	}
  	    	return null;
  	    },
  	    // Introduced in DOM Level 3:
  	    isDefaultNamespace:function(namespaceURI){
  	    	var prefix = this.lookupPrefix(namespaceURI);
  	    	return prefix == null;
  	    }
  	};


  	function _xmlEncoder(c){
  		return c == '<' && '&lt;' ||
  	         c == '>' && '&gt;' ||
  	         c == '&' && '&amp;' ||
  	         c == '"' && '&quot;' ||
  	         '&#'+c.charCodeAt()+';'
  	}


  	copy(NodeType,Node);
  	copy(NodeType,Node.prototype);

  	/**
  	 * @param callback return true for continue,false for break
  	 * @return boolean true: break visit;
  	 */
  	function _visitNode(node,callback){
  		if(callback(node)){
  			return true;
  		}
  		if(node = node.firstChild){
  			do{
  				if(_visitNode(node,callback)){return true}
  	        }while(node=node.nextSibling)
  	    }
  	}



  	function Document(){
  		this.ownerDocument = this;
  	}

  	function _onAddAttribute(doc,el,newAttr){
  		doc && doc._inc++;
  		var ns = newAttr.namespaceURI ;
  		if(ns === NAMESPACE.XMLNS){
  			//update namespace
  			el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value;
  		}
  	}

  	function _onRemoveAttribute(doc,el,newAttr,remove){
  		doc && doc._inc++;
  		var ns = newAttr.namespaceURI ;
  		if(ns === NAMESPACE.XMLNS){
  			//update namespace
  			delete el._nsMap[newAttr.prefix?newAttr.localName:''];
  		}
  	}

  	/**
  	 * Updates `el.childNodes`, updating the indexed items and it's `length`.
  	 * Passing `newChild` means it will be appended.
  	 * Otherwise it's assumed that an item has been removed,
  	 * and `el.firstNode` and it's `.nextSibling` are used
  	 * to walk the current list of child nodes.
  	 *
  	 * @param {Document} doc
  	 * @param {Node} el
  	 * @param {Node} [newChild]
  	 * @private
  	 */
  	function _onUpdateChild (doc, el, newChild) {
  		if(doc && doc._inc){
  			doc._inc++;
  			//update childNodes
  			var cs = el.childNodes;
  			if (newChild) {
  				cs[cs.length++] = newChild;
  			} else {
  				var child = el.firstChild;
  				var i = 0;
  				while (child) {
  					cs[i++] = child;
  					child = child.nextSibling;
  				}
  				cs.length = i;
  				delete cs[cs.length];
  			}
  		}
  	}

  	/**
  	 * Removes the connections between `parentNode` and `child`
  	 * and any existing `child.previousSibling` or `child.nextSibling`.
  	 *
  	 * @see https://github.com/xmldom/xmldom/issues/135
  	 * @see https://github.com/xmldom/xmldom/issues/145
  	 *
  	 * @param {Node} parentNode
  	 * @param {Node} child
  	 * @returns {Node} the child that was removed.
  	 * @private
  	 */
  	function _removeChild (parentNode, child) {
  		var previous = child.previousSibling;
  		var next = child.nextSibling;
  		if (previous) {
  			previous.nextSibling = next;
  		} else {
  			parentNode.firstChild = next;
  		}
  		if (next) {
  			next.previousSibling = previous;
  		} else {
  			parentNode.lastChild = previous;
  		}
  		child.parentNode = null;
  		child.previousSibling = null;
  		child.nextSibling = null;
  		_onUpdateChild(parentNode.ownerDocument, parentNode);
  		return child;
  	}

  	/**
  	 * Returns `true` if `node` can be a parent for insertion.
  	 * @param {Node} node
  	 * @returns {boolean}
  	 */
  	function hasValidParentNodeType(node) {
  		return (
  			node &&
  			(node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node.nodeType === Node.ELEMENT_NODE)
  		);
  	}

  	/**
  	 * Returns `true` if `node` can be inserted according to it's `nodeType`.
  	 * @param {Node} node
  	 * @returns {boolean}
  	 */
  	function hasInsertableNodeType(node) {
  		return (
  			node &&
  			(isElementNode(node) ||
  				isTextNode(node) ||
  				isDocTypeNode(node) ||
  				node.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
  				node.nodeType === Node.COMMENT_NODE ||
  				node.nodeType === Node.PROCESSING_INSTRUCTION_NODE)
  		);
  	}

  	/**
  	 * Returns true if `node` is a DOCTYPE node
  	 * @param {Node} node
  	 * @returns {boolean}
  	 */
  	function isDocTypeNode(node) {
  		return node && node.nodeType === Node.DOCUMENT_TYPE_NODE;
  	}

  	/**
  	 * Returns true if the node is an element
  	 * @param {Node} node
  	 * @returns {boolean}
  	 */
  	function isElementNode(node) {
  		return node && node.nodeType === Node.ELEMENT_NODE;
  	}
  	/**
  	 * Returns true if `node` is a text node
  	 * @param {Node} node
  	 * @returns {boolean}
  	 */
  	function isTextNode(node) {
  		return node && node.nodeType === Node.TEXT_NODE;
  	}

  	/**
  	 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
  	 * according to the presence and position of a doctype node on the same level.
  	 *
  	 * @param {Document} doc The document node
  	 * @param {Node} child the node that would become the nextSibling if the element would be inserted
  	 * @returns {boolean} `true` if an element can be inserted before child
  	 * @private
  	 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  	 */
  	function isElementInsertionPossible(doc, child) {
  		var parentChildNodes = doc.childNodes || [];
  		if (find(parentChildNodes, isElementNode) || isDocTypeNode(child)) {
  			return false;
  		}
  		var docTypeNode = find(parentChildNodes, isDocTypeNode);
  		return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
  	}

  	/**
  	 * Check if en element node can be inserted before `child`, or at the end if child is falsy,
  	 * according to the presence and position of a doctype node on the same level.
  	 *
  	 * @param {Node} doc The document node
  	 * @param {Node} child the node that would become the nextSibling if the element would be inserted
  	 * @returns {boolean} `true` if an element can be inserted before child
  	 * @private
  	 * https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  	 */
  	function isElementReplacementPossible(doc, child) {
  		var parentChildNodes = doc.childNodes || [];

  		function hasElementChildThatIsNotChild(node) {
  			return isElementNode(node) && node !== child;
  		}

  		if (find(parentChildNodes, hasElementChildThatIsNotChild)) {
  			return false;
  		}
  		var docTypeNode = find(parentChildNodes, isDocTypeNode);
  		return !(child && docTypeNode && parentChildNodes.indexOf(docTypeNode) > parentChildNodes.indexOf(child));
  	}

  	/**
  	 * @private
  	 * Steps 1-5 of the checks before inserting and before replacing a child are the same.
  	 *
  	 * @param {Node} parent the parent node to insert `node` into
  	 * @param {Node} node the node to insert
  	 * @param {Node=} child the node that should become the `nextSibling` of `node`
  	 * @returns {Node}
  	 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
  	 * @throws DOMException if `child` is provided but is not a child of `parent`.
  	 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  	 * @see https://dom.spec.whatwg.org/#concept-node-replace
  	 */
  	function assertPreInsertionValidity1to5(parent, node, child) {
  		// 1. If `parent` is not a Document, DocumentFragment, or Element node, then throw a "HierarchyRequestError" DOMException.
  		if (!hasValidParentNodeType(parent)) {
  			throw new DOMException(HIERARCHY_REQUEST_ERR, 'Unexpected parent node type ' + parent.nodeType);
  		}
  		// 2. If `node` is a host-including inclusive ancestor of `parent`, then throw a "HierarchyRequestError" DOMException.
  		// not implemented!
  		// 3. If `child` is non-null and its parent is not `parent`, then throw a "NotFoundError" DOMException.
  		if (child && child.parentNode !== parent) {
  			throw new DOMException(NOT_FOUND_ERR, 'child not in parent');
  		}
  		if (
  			// 4. If `node` is not a DocumentFragment, DocumentType, Element, or CharacterData node, then throw a "HierarchyRequestError" DOMException.
  			!hasInsertableNodeType(node) ||
  			// 5. If either `node` is a Text node and `parent` is a document,
  			// the sax parser currently adds top level text nodes, this will be fixed in 0.9.0
  			// || (node.nodeType === Node.TEXT_NODE && parent.nodeType === Node.DOCUMENT_NODE)
  			// or `node` is a doctype and `parent` is not a document, then throw a "HierarchyRequestError" DOMException.
  			(isDocTypeNode(node) && parent.nodeType !== Node.DOCUMENT_NODE)
  		) {
  			throw new DOMException(
  				HIERARCHY_REQUEST_ERR,
  				'Unexpected node type ' + node.nodeType + ' for parent node type ' + parent.nodeType
  			);
  		}
  	}

  	/**
  	 * @private
  	 * Step 6 of the checks before inserting and before replacing a child are different.
  	 *
  	 * @param {Document} parent the parent node to insert `node` into
  	 * @param {Node} node the node to insert
  	 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
  	 * @returns {Node}
  	 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
  	 * @throws DOMException if `child` is provided but is not a child of `parent`.
  	 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  	 * @see https://dom.spec.whatwg.org/#concept-node-replace
  	 */
  	function assertPreInsertionValidityInDocument(parent, node, child) {
  		var parentChildNodes = parent.childNodes || [];
  		var nodeChildNodes = node.childNodes || [];

  		// DocumentFragment
  		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
  			var nodeChildElements = nodeChildNodes.filter(isElementNode);
  			// If node has more than one element child or has a Text node child.
  			if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
  			}
  			// Otherwise, if `node` has one element child and either `parent` has an element child,
  			// `child` is a doctype, or `child` is non-null and a doctype is following `child`.
  			if (nodeChildElements.length === 1 && !isElementInsertionPossible(parent, child)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
  			}
  		}
  		// Element
  		if (isElementNode(node)) {
  			// `parent` has an element child, `child` is a doctype,
  			// or `child` is non-null and a doctype is following `child`.
  			if (!isElementInsertionPossible(parent, child)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
  			}
  		}
  		// DocumentType
  		if (isDocTypeNode(node)) {
  			// `parent` has a doctype child,
  			if (find(parentChildNodes, isDocTypeNode)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
  			}
  			var parentElementChild = find(parentChildNodes, isElementNode);
  			// `child` is non-null and an element is preceding `child`,
  			if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
  			}
  			// or `child` is null and `parent` has an element child.
  			if (!child && parentElementChild) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can not be appended since element is present');
  			}
  		}
  	}

  	/**
  	 * @private
  	 * Step 6 of the checks before inserting and before replacing a child are different.
  	 *
  	 * @param {Document} parent the parent node to insert `node` into
  	 * @param {Node} node the node to insert
  	 * @param {Node | undefined} child the node that should become the `nextSibling` of `node`
  	 * @returns {Node}
  	 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
  	 * @throws DOMException if `child` is provided but is not a child of `parent`.
  	 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  	 * @see https://dom.spec.whatwg.org/#concept-node-replace
  	 */
  	function assertPreReplacementValidityInDocument(parent, node, child) {
  		var parentChildNodes = parent.childNodes || [];
  		var nodeChildNodes = node.childNodes || [];

  		// DocumentFragment
  		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
  			var nodeChildElements = nodeChildNodes.filter(isElementNode);
  			// If `node` has more than one element child or has a Text node child.
  			if (nodeChildElements.length > 1 || find(nodeChildNodes, isTextNode)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'More than one element or text in fragment');
  			}
  			// Otherwise, if `node` has one element child and either `parent` has an element child that is not `child` or a doctype is following `child`.
  			if (nodeChildElements.length === 1 && !isElementReplacementPossible(parent, child)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Element in fragment can not be inserted before doctype');
  			}
  		}
  		// Element
  		if (isElementNode(node)) {
  			// `parent` has an element child that is not `child` or a doctype is following `child`.
  			if (!isElementReplacementPossible(parent, child)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one element can be added and only after doctype');
  			}
  		}
  		// DocumentType
  		if (isDocTypeNode(node)) {
  			function hasDoctypeChildThatIsNotChild(node) {
  				return isDocTypeNode(node) && node !== child;
  			}

  			// `parent` has a doctype child that is not `child`,
  			if (find(parentChildNodes, hasDoctypeChildThatIsNotChild)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Only one doctype is allowed');
  			}
  			var parentElementChild = find(parentChildNodes, isElementNode);
  			// or an element is preceding `child`.
  			if (child && parentChildNodes.indexOf(parentElementChild) < parentChildNodes.indexOf(child)) {
  				throw new DOMException(HIERARCHY_REQUEST_ERR, 'Doctype can only be inserted before an element');
  			}
  		}
  	}

  	/**
  	 * @private
  	 * @param {Node} parent the parent node to insert `node` into
  	 * @param {Node} node the node to insert
  	 * @param {Node=} child the node that should become the `nextSibling` of `node`
  	 * @returns {Node}
  	 * @throws DOMException for several node combinations that would create a DOM that is not well-formed.
  	 * @throws DOMException if `child` is provided but is not a child of `parent`.
  	 * @see https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  	 */
  	function _insertBefore(parent, node, child, _inDocumentAssertion) {
  		// To ensure pre-insertion validity of a node into a parent before a child, run these steps:
  		assertPreInsertionValidity1to5(parent, node, child);

  		// If parent is a document, and any of the statements below, switched on the interface node implements,
  		// are true, then throw a "HierarchyRequestError" DOMException.
  		if (parent.nodeType === Node.DOCUMENT_NODE) {
  			(_inDocumentAssertion || assertPreInsertionValidityInDocument)(parent, node, child);
  		}

  		var cp = node.parentNode;
  		if(cp){
  			cp.removeChild(node);//remove and update
  		}
  		if(node.nodeType === DOCUMENT_FRAGMENT_NODE){
  			var newFirst = node.firstChild;
  			if (newFirst == null) {
  				return node;
  			}
  			var newLast = node.lastChild;
  		}else {
  			newFirst = newLast = node;
  		}
  		var pre = child ? child.previousSibling : parent.lastChild;

  		newFirst.previousSibling = pre;
  		newLast.nextSibling = child;


  		if(pre){
  			pre.nextSibling = newFirst;
  		}else {
  			parent.firstChild = newFirst;
  		}
  		if(child == null){
  			parent.lastChild = newLast;
  		}else {
  			child.previousSibling = newLast;
  		}
  		do{
  			newFirst.parentNode = parent;
  		}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
  		_onUpdateChild(parent.ownerDocument||parent, parent);
  		//console.log(parent.lastChild.nextSibling == null)
  		if (node.nodeType == DOCUMENT_FRAGMENT_NODE) {
  			node.firstChild = node.lastChild = null;
  		}
  		return node;
  	}

  	/**
  	 * Appends `newChild` to `parentNode`.
  	 * If `newChild` is already connected to a `parentNode` it is first removed from it.
  	 *
  	 * @see https://github.com/xmldom/xmldom/issues/135
  	 * @see https://github.com/xmldom/xmldom/issues/145
  	 * @param {Node} parentNode
  	 * @param {Node} newChild
  	 * @returns {Node}
  	 * @private
  	 */
  	function _appendSingleChild (parentNode, newChild) {
  		if (newChild.parentNode) {
  			newChild.parentNode.removeChild(newChild);
  		}
  		newChild.parentNode = parentNode;
  		newChild.previousSibling = parentNode.lastChild;
  		newChild.nextSibling = null;
  		if (newChild.previousSibling) {
  			newChild.previousSibling.nextSibling = newChild;
  		} else {
  			parentNode.firstChild = newChild;
  		}
  		parentNode.lastChild = newChild;
  		_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
  		return newChild;
  	}

  	Document.prototype = {
  		//implementation : null,
  		nodeName :  '#document',
  		nodeType :  DOCUMENT_NODE,
  		/**
  		 * The DocumentType node of the document.
  		 *
  		 * @readonly
  		 * @type DocumentType
  		 */
  		doctype :  null,
  		documentElement :  null,
  		_inc : 1,

  		insertBefore :  function(newChild, refChild){//raises
  			if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
  				var child = newChild.firstChild;
  				while(child){
  					var next = child.nextSibling;
  					this.insertBefore(child,refChild);
  					child = next;
  				}
  				return newChild;
  			}
  			_insertBefore(this, newChild, refChild);
  			newChild.ownerDocument = this;
  			if (this.documentElement === null && newChild.nodeType === ELEMENT_NODE) {
  				this.documentElement = newChild;
  			}

  			return newChild;
  		},
  		removeChild :  function(oldChild){
  			if(this.documentElement == oldChild){
  				this.documentElement = null;
  			}
  			return _removeChild(this,oldChild);
  		},
  		replaceChild: function (newChild, oldChild) {
  			//raises
  			_insertBefore(this, newChild, oldChild, assertPreReplacementValidityInDocument);
  			newChild.ownerDocument = this;
  			if (oldChild) {
  				this.removeChild(oldChild);
  			}
  			if (isElementNode(newChild)) {
  				this.documentElement = newChild;
  			}
  		},
  		// Introduced in DOM Level 2:
  		importNode : function(importedNode,deep){
  			return importNode(this,importedNode,deep);
  		},
  		// Introduced in DOM Level 2:
  		getElementById :	function(id){
  			var rtv = null;
  			_visitNode(this.documentElement,function(node){
  				if(node.nodeType == ELEMENT_NODE){
  					if(node.getAttribute('id') == id){
  						rtv = node;
  						return true;
  					}
  				}
  			});
  			return rtv;
  		},

  		/**
  		 * The `getElementsByClassName` method of `Document` interface returns an array-like object
  		 * of all child elements which have **all** of the given class name(s).
  		 *
  		 * Returns an empty list if `classeNames` is an empty string or only contains HTML white space characters.
  		 *
  		 *
  		 * Warning: This is a live LiveNodeList.
  		 * Changes in the DOM will reflect in the array as the changes occur.
  		 * If an element selected by this array no longer qualifies for the selector,
  		 * it will automatically be removed. Be aware of this for iteration purposes.
  		 *
  		 * @param {string} classNames is a string representing the class name(s) to match; multiple class names are separated by (ASCII-)whitespace
  		 *
  		 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
  		 * @see https://dom.spec.whatwg.org/#concept-getelementsbyclassname
  		 */
  		getElementsByClassName: function(classNames) {
  			var classNamesSet = toOrderedSet(classNames);
  			return new LiveNodeList(this, function(base) {
  				var ls = [];
  				if (classNamesSet.length > 0) {
  					_visitNode(base.documentElement, function(node) {
  						if(node !== base && node.nodeType === ELEMENT_NODE) {
  							var nodeClassNames = node.getAttribute('class');
  							// can be null if the attribute does not exist
  							if (nodeClassNames) {
  								// before splitting and iterating just compare them for the most common case
  								var matches = classNames === nodeClassNames;
  								if (!matches) {
  									var nodeClassNamesSet = toOrderedSet(nodeClassNames);
  									matches = classNamesSet.every(arrayIncludes(nodeClassNamesSet));
  								}
  								if(matches) {
  									ls.push(node);
  								}
  							}
  						}
  					});
  				}
  				return ls;
  			});
  		},

  		//document factory method:
  		createElement :	function(tagName){
  			var node = new Element();
  			node.ownerDocument = this;
  			node.nodeName = tagName;
  			node.tagName = tagName;
  			node.localName = tagName;
  			node.childNodes = new NodeList();
  			var attrs	= node.attributes = new NamedNodeMap();
  			attrs._ownerElement = node;
  			return node;
  		},
  		createDocumentFragment :	function(){
  			var node = new DocumentFragment();
  			node.ownerDocument = this;
  			node.childNodes = new NodeList();
  			return node;
  		},
  		createTextNode :	function(data){
  			var node = new Text();
  			node.ownerDocument = this;
  			node.appendData(data);
  			return node;
  		},
  		createComment :	function(data){
  			var node = new Comment();
  			node.ownerDocument = this;
  			node.appendData(data);
  			return node;
  		},
  		createCDATASection :	function(data){
  			var node = new CDATASection();
  			node.ownerDocument = this;
  			node.appendData(data);
  			return node;
  		},
  		createProcessingInstruction :	function(target,data){
  			var node = new ProcessingInstruction();
  			node.ownerDocument = this;
  			node.tagName = node.nodeName = node.target = target;
  			node.nodeValue = node.data = data;
  			return node;
  		},
  		createAttribute :	function(name){
  			var node = new Attr();
  			node.ownerDocument	= this;
  			node.name = name;
  			node.nodeName	= name;
  			node.localName = name;
  			node.specified = true;
  			return node;
  		},
  		createEntityReference :	function(name){
  			var node = new EntityReference();
  			node.ownerDocument	= this;
  			node.nodeName	= name;
  			return node;
  		},
  		// Introduced in DOM Level 2:
  		createElementNS :	function(namespaceURI,qualifiedName){
  			var node = new Element();
  			var pl = qualifiedName.split(':');
  			var attrs	= node.attributes = new NamedNodeMap();
  			node.childNodes = new NodeList();
  			node.ownerDocument = this;
  			node.nodeName = qualifiedName;
  			node.tagName = qualifiedName;
  			node.namespaceURI = namespaceURI;
  			if(pl.length == 2){
  				node.prefix = pl[0];
  				node.localName = pl[1];
  			}else {
  				//el.prefix = null;
  				node.localName = qualifiedName;
  			}
  			attrs._ownerElement = node;
  			return node;
  		},
  		// Introduced in DOM Level 2:
  		createAttributeNS :	function(namespaceURI,qualifiedName){
  			var node = new Attr();
  			var pl = qualifiedName.split(':');
  			node.ownerDocument = this;
  			node.nodeName = qualifiedName;
  			node.name = qualifiedName;
  			node.namespaceURI = namespaceURI;
  			node.specified = true;
  			if(pl.length == 2){
  				node.prefix = pl[0];
  				node.localName = pl[1];
  			}else {
  				//el.prefix = null;
  				node.localName = qualifiedName;
  			}
  			return node;
  		}
  	};
  	_extends(Document,Node);


  	function Element() {
  		this._nsMap = {};
  	}	Element.prototype = {
  		nodeType : ELEMENT_NODE,
  		hasAttribute : function(name){
  			return this.getAttributeNode(name)!=null;
  		},
  		getAttribute : function(name){
  			var attr = this.getAttributeNode(name);
  			return attr && attr.value || '';
  		},
  		getAttributeNode : function(name){
  			return this.attributes.getNamedItem(name);
  		},
  		setAttribute : function(name, value){
  			var attr = this.ownerDocument.createAttribute(name);
  			attr.value = attr.nodeValue = "" + value;
  			this.setAttributeNode(attr);
  		},
  		removeAttribute : function(name){
  			var attr = this.getAttributeNode(name);
  			attr && this.removeAttributeNode(attr);
  		},

  		//four real opeartion method
  		appendChild:function(newChild){
  			if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
  				return this.insertBefore(newChild,null);
  			}else {
  				return _appendSingleChild(this,newChild);
  			}
  		},
  		setAttributeNode : function(newAttr){
  			return this.attributes.setNamedItem(newAttr);
  		},
  		setAttributeNodeNS : function(newAttr){
  			return this.attributes.setNamedItemNS(newAttr);
  		},
  		removeAttributeNode : function(oldAttr){
  			//console.log(this == oldAttr.ownerElement)
  			return this.attributes.removeNamedItem(oldAttr.nodeName);
  		},
  		//get real attribute name,and remove it by removeAttributeNode
  		removeAttributeNS : function(namespaceURI, localName){
  			var old = this.getAttributeNodeNS(namespaceURI, localName);
  			old && this.removeAttributeNode(old);
  		},

  		hasAttributeNS : function(namespaceURI, localName){
  			return this.getAttributeNodeNS(namespaceURI, localName)!=null;
  		},
  		getAttributeNS : function(namespaceURI, localName){
  			var attr = this.getAttributeNodeNS(namespaceURI, localName);
  			return attr && attr.value || '';
  		},
  		setAttributeNS : function(namespaceURI, qualifiedName, value){
  			var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
  			attr.value = attr.nodeValue = "" + value;
  			this.setAttributeNode(attr);
  		},
  		getAttributeNodeNS : function(namespaceURI, localName){
  			return this.attributes.getNamedItemNS(namespaceURI, localName);
  		},

  		getElementsByTagName : function(tagName){
  			return new LiveNodeList(this,function(base){
  				var ls = [];
  				_visitNode(base,function(node){
  					if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
  						ls.push(node);
  					}
  				});
  				return ls;
  			});
  		},
  		getElementsByTagNameNS : function(namespaceURI, localName){
  			return new LiveNodeList(this,function(base){
  				var ls = [];
  				_visitNode(base,function(node){
  					if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
  						ls.push(node);
  					}
  				});
  				return ls;

  			});
  		}
  	};
  	Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
  	Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


  	_extends(Element,Node);
  	function Attr() {
  	}	Attr.prototype.nodeType = ATTRIBUTE_NODE;
  	_extends(Attr,Node);


  	function CharacterData() {
  	}	CharacterData.prototype = {
  		data : '',
  		substringData : function(offset, count) {
  			return this.data.substring(offset, offset+count);
  		},
  		appendData: function(text) {
  			text = this.data+text;
  			this.nodeValue = this.data = text;
  			this.length = text.length;
  		},
  		insertData: function(offset,text) {
  			this.replaceData(offset,0,text);

  		},
  		appendChild:function(newChild){
  			throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
  		},
  		deleteData: function(offset, count) {
  			this.replaceData(offset,count,"");
  		},
  		replaceData: function(offset, count, text) {
  			var start = this.data.substring(0,offset);
  			var end = this.data.substring(offset+count);
  			text = start + text + end;
  			this.nodeValue = this.data = text;
  			this.length = text.length;
  		}
  	};
  	_extends(CharacterData,Node);
  	function Text() {
  	}	Text.prototype = {
  		nodeName : "#text",
  		nodeType : TEXT_NODE,
  		splitText : function(offset) {
  			var text = this.data;
  			var newText = text.substring(offset);
  			text = text.substring(0, offset);
  			this.data = this.nodeValue = text;
  			this.length = text.length;
  			var newNode = this.ownerDocument.createTextNode(newText);
  			if(this.parentNode){
  				this.parentNode.insertBefore(newNode, this.nextSibling);
  			}
  			return newNode;
  		}
  	};
  	_extends(Text,CharacterData);
  	function Comment() {
  	}	Comment.prototype = {
  		nodeName : "#comment",
  		nodeType : COMMENT_NODE
  	};
  	_extends(Comment,CharacterData);

  	function CDATASection() {
  	}	CDATASection.prototype = {
  		nodeName : "#cdata-section",
  		nodeType : CDATA_SECTION_NODE
  	};
  	_extends(CDATASection,CharacterData);


  	function DocumentType() {
  	}	DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
  	_extends(DocumentType,Node);

  	function Notation() {
  	}	Notation.prototype.nodeType = NOTATION_NODE;
  	_extends(Notation,Node);

  	function Entity() {
  	}	Entity.prototype.nodeType = ENTITY_NODE;
  	_extends(Entity,Node);

  	function EntityReference() {
  	}	EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
  	_extends(EntityReference,Node);

  	function DocumentFragment() {
  	}	DocumentFragment.prototype.nodeName =	"#document-fragment";
  	DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
  	_extends(DocumentFragment,Node);


  	function ProcessingInstruction() {
  	}
  	ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
  	_extends(ProcessingInstruction,Node);
  	function XMLSerializer(){}
  	XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
  		return nodeSerializeToString.call(node,isHtml,nodeFilter);
  	};
  	Node.prototype.toString = nodeSerializeToString;
  	function nodeSerializeToString(isHtml,nodeFilter){
  		var buf = [];
  		var refNode = this.nodeType == 9 && this.documentElement || this;
  		var prefix = refNode.prefix;
  		var uri = refNode.namespaceURI;

  		if(uri && prefix == null){
  			//console.log(prefix)
  			var prefix = refNode.lookupPrefix(uri);
  			if(prefix == null){
  				//isHTML = true;
  				var visibleNamespaces=[
  				{namespace:uri,prefix:null}
  				//{namespace:uri,prefix:''}
  				];
  			}
  		}
  		serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
  		//console.log('###',this.nodeType,uri,prefix,buf.join(''))
  		return buf.join('');
  	}

  	function needNamespaceDefine(node, isHTML, visibleNamespaces) {
  		var prefix = node.prefix || '';
  		var uri = node.namespaceURI;
  		// According to [Namespaces in XML 1.0](https://www.w3.org/TR/REC-xml-names/#ns-using) ,
  		// and more specifically https://www.w3.org/TR/REC-xml-names/#nsc-NoPrefixUndecl :
  		// > In a namespace declaration for a prefix [...], the attribute value MUST NOT be empty.
  		// in a similar manner [Namespaces in XML 1.1](https://www.w3.org/TR/xml-names11/#ns-using)
  		// and more specifically https://www.w3.org/TR/xml-names11/#nsc-NSDeclared :
  		// > [...] Furthermore, the attribute value [...] must not be an empty string.
  		// so serializing empty namespace value like xmlns:ds="" would produce an invalid XML document.
  		if (!uri) {
  			return false;
  		}
  		if (prefix === "xml" && uri === NAMESPACE.XML || uri === NAMESPACE.XMLNS) {
  			return false;
  		}

  		var i = visibleNamespaces.length;
  		while (i--) {
  			var ns = visibleNamespaces[i];
  			// get namespace prefix
  			if (ns.prefix === prefix) {
  				return ns.namespace !== uri;
  			}
  		}
  		return true;
  	}
  	/**
  	 * Well-formed constraint: No < in Attribute Values
  	 * > The replacement text of any entity referred to directly or indirectly
  	 * > in an attribute value must not contain a <.
  	 * @see https://www.w3.org/TR/xml11/#CleanAttrVals
  	 * @see https://www.w3.org/TR/xml11/#NT-AttValue
  	 *
  	 * Literal whitespace other than space that appear in attribute values
  	 * are serialized as their entity references, so they will be preserved.
  	 * (In contrast to whitespace literals in the input which are normalized to spaces)
  	 * @see https://www.w3.org/TR/xml11/#AVNormalize
  	 * @see https://w3c.github.io/DOM-Parsing/#serializing-an-element-s-attributes
  	 */
  	function addSerializedAttribute(buf, qualifiedName, value) {
  		buf.push(' ', qualifiedName, '="', value.replace(/[<>&"\t\n\r]/g, _xmlEncoder), '"');
  	}

  	function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
  		if (!visibleNamespaces) {
  			visibleNamespaces = [];
  		}

  		if(nodeFilter){
  			node = nodeFilter(node);
  			if(node){
  				if(typeof node == 'string'){
  					buf.push(node);
  					return;
  				}
  			}else {
  				return;
  			}
  			//buf.sort.apply(attrs, attributeSorter);
  		}

  		switch(node.nodeType){
  		case ELEMENT_NODE:
  			var attrs = node.attributes;
  			var len = attrs.length;
  			var child = node.firstChild;
  			var nodeName = node.tagName;

  			isHTML = NAMESPACE.isHTML(node.namespaceURI) || isHTML;

  			var prefixedNodeName = nodeName;
  			if (!isHTML && !node.prefix && node.namespaceURI) {
  				var defaultNS;
  				// lookup current default ns from `xmlns` attribute
  				for (var ai = 0; ai < attrs.length; ai++) {
  					if (attrs.item(ai).name === 'xmlns') {
  						defaultNS = attrs.item(ai).value;
  						break
  					}
  				}
  				if (!defaultNS) {
  					// lookup current default ns in visibleNamespaces
  					for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
  						var namespace = visibleNamespaces[nsi];
  						if (namespace.prefix === '' && namespace.namespace === node.namespaceURI) {
  							defaultNS = namespace.namespace;
  							break
  						}
  					}
  				}
  				if (defaultNS !== node.namespaceURI) {
  					for (var nsi = visibleNamespaces.length - 1; nsi >= 0; nsi--) {
  						var namespace = visibleNamespaces[nsi];
  						if (namespace.namespace === node.namespaceURI) {
  							if (namespace.prefix) {
  								prefixedNodeName = namespace.prefix + ':' + nodeName;
  							}
  							break
  						}
  					}
  				}
  			}

  			buf.push('<', prefixedNodeName);

  			for(var i=0;i<len;i++){
  				// add namespaces for attributes
  				var attr = attrs.item(i);
  				if (attr.prefix == 'xmlns') {
  					visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
  				}else if(attr.nodeName == 'xmlns'){
  					visibleNamespaces.push({ prefix: '', namespace: attr.value });
  				}
  			}

  			for(var i=0;i<len;i++){
  				var attr = attrs.item(i);
  				if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
  					var prefix = attr.prefix||'';
  					var uri = attr.namespaceURI;
  					addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
  					visibleNamespaces.push({ prefix: prefix, namespace:uri });
  				}
  				serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
  			}

  			// add namespace for current node
  			if (nodeName === prefixedNodeName && needNamespaceDefine(node, isHTML, visibleNamespaces)) {
  				var prefix = node.prefix||'';
  				var uri = node.namespaceURI;
  				addSerializedAttribute(buf, prefix ? 'xmlns:' + prefix : "xmlns", uri);
  				visibleNamespaces.push({ prefix: prefix, namespace:uri });
  			}

  			if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
  				buf.push('>');
  				//if is cdata child node
  				if(isHTML && /^script$/i.test(nodeName)){
  					while(child){
  						if(child.data){
  							buf.push(child.data);
  						}else {
  							serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
  						}
  						child = child.nextSibling;
  					}
  				}else
  				{
  					while(child){
  						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
  						child = child.nextSibling;
  					}
  				}
  				buf.push('</',prefixedNodeName,'>');
  			}else {
  				buf.push('/>');
  			}
  			// remove added visible namespaces
  			//visibleNamespaces.length = startVisibleNamespaces;
  			return;
  		case DOCUMENT_NODE:
  		case DOCUMENT_FRAGMENT_NODE:
  			var child = node.firstChild;
  			while(child){
  				serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces.slice());
  				child = child.nextSibling;
  			}
  			return;
  		case ATTRIBUTE_NODE:
  			return addSerializedAttribute(buf, node.name, node.value);
  		case TEXT_NODE:
  			/**
  			 * The ampersand character (&) and the left angle bracket (<) must not appear in their literal form,
  			 * except when used as markup delimiters, or within a comment, a processing instruction, or a CDATA section.
  			 * If they are needed elsewhere, they must be escaped using either numeric character references or the strings
  			 * `&amp;` and `&lt;` respectively.
  			 * The right angle bracket (>) may be represented using the string " &gt; ", and must, for compatibility,
  			 * be escaped using either `&gt;` or a character reference when it appears in the string `]]>` in content,
  			 * when that string is not marking the end of a CDATA section.
  			 *
  			 * In the content of elements, character data is any string of characters
  			 * which does not contain the start-delimiter of any markup
  			 * and does not include the CDATA-section-close delimiter, `]]>`.
  			 *
  			 * @see https://www.w3.org/TR/xml/#NT-CharData
  			 * @see https://w3c.github.io/DOM-Parsing/#xml-serializing-a-text-node
  			 */
  			return buf.push(node.data
  				.replace(/[<&>]/g,_xmlEncoder)
  			);
  		case CDATA_SECTION_NODE:
  			return buf.push( '<![CDATA[',node.data,']]>');
  		case COMMENT_NODE:
  			return buf.push( "<!--",node.data,"-->");
  		case DOCUMENT_TYPE_NODE:
  			var pubid = node.publicId;
  			var sysid = node.systemId;
  			buf.push('<!DOCTYPE ',node.name);
  			if(pubid){
  				buf.push(' PUBLIC ', pubid);
  				if (sysid && sysid!='.') {
  					buf.push(' ', sysid);
  				}
  				buf.push('>');
  			}else if(sysid && sysid!='.'){
  				buf.push(' SYSTEM ', sysid, '>');
  			}else {
  				var sub = node.internalSubset;
  				if(sub){
  					buf.push(" [",sub,"]");
  				}
  				buf.push(">");
  			}
  			return;
  		case PROCESSING_INSTRUCTION_NODE:
  			return buf.push( "<?",node.target," ",node.data,"?>");
  		case ENTITY_REFERENCE_NODE:
  			return buf.push( '&',node.nodeName,';');
  		//case ENTITY_NODE:
  		//case NOTATION_NODE:
  		default:
  			buf.push('??',node.nodeName);
  		}
  	}
  	function importNode(doc,node,deep){
  		var node2;
  		switch (node.nodeType) {
  		case ELEMENT_NODE:
  			node2 = node.cloneNode(false);
  			node2.ownerDocument = doc;
  			//var attrs = node2.attributes;
  			//var len = attrs.length;
  			//for(var i=0;i<len;i++){
  				//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
  			//}
  		case DOCUMENT_FRAGMENT_NODE:
  			break;
  		case ATTRIBUTE_NODE:
  			deep = true;
  			break;
  		//case ENTITY_REFERENCE_NODE:
  		//case PROCESSING_INSTRUCTION_NODE:
  		////case TEXT_NODE:
  		//case CDATA_SECTION_NODE:
  		//case COMMENT_NODE:
  		//	deep = false;
  		//	break;
  		//case DOCUMENT_NODE:
  		//case DOCUMENT_TYPE_NODE:
  		//cannot be imported.
  		//case ENTITY_NODE:
  		//case NOTATION_NODE：
  		//can not hit in level3
  		//default:throw e;
  		}
  		if(!node2){
  			node2 = node.cloneNode(false);//false
  		}
  		node2.ownerDocument = doc;
  		node2.parentNode = null;
  		if(deep){
  			var child = node.firstChild;
  			while(child){
  				node2.appendChild(importNode(doc,child,deep));
  				child = child.nextSibling;
  			}
  		}
  		return node2;
  	}
  	//
  	//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
  	//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
  	function cloneNode(doc,node,deep){
  		var node2 = new node.constructor();
  		for (var n in node) {
  			if (Object.prototype.hasOwnProperty.call(node, n)) {
  				var v = node[n];
  				if (typeof v != "object") {
  					if (v != node2[n]) {
  						node2[n] = v;
  					}
  				}
  			}
  		}
  		if(node.childNodes){
  			node2.childNodes = new NodeList();
  		}
  		node2.ownerDocument = doc;
  		switch (node2.nodeType) {
  		case ELEMENT_NODE:
  			var attrs	= node.attributes;
  			var attrs2	= node2.attributes = new NamedNodeMap();
  			var len = attrs.length;
  			attrs2._ownerElement = node2;
  			for(var i=0;i<len;i++){
  				node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
  			}
  			break;		case ATTRIBUTE_NODE:
  			deep = true;
  		}
  		if(deep){
  			var child = node.firstChild;
  			while(child){
  				node2.appendChild(cloneNode(doc,child,deep));
  				child = child.nextSibling;
  			}
  		}
  		return node2;
  	}

  	function __set__(object,key,value){
  		object[key] = value;
  	}
  	//do dynamic
  	try{
  		if(Object.defineProperty){
  			Object.defineProperty(LiveNodeList.prototype,'length',{
  				get:function(){
  					_updateLiveList(this);
  					return this.$$length;
  				}
  			});

  			Object.defineProperty(Node.prototype,'textContent',{
  				get:function(){
  					return getTextContent(this);
  				},

  				set:function(data){
  					switch(this.nodeType){
  					case ELEMENT_NODE:
  					case DOCUMENT_FRAGMENT_NODE:
  						while(this.firstChild){
  							this.removeChild(this.firstChild);
  						}
  						if(data || String(data)){
  							this.appendChild(this.ownerDocument.createTextNode(data));
  						}
  						break;

  					default:
  						this.data = data;
  						this.value = data;
  						this.nodeValue = data;
  					}
  				}
  			});

  			function getTextContent(node){
  				switch(node.nodeType){
  				case ELEMENT_NODE:
  				case DOCUMENT_FRAGMENT_NODE:
  					var buf = [];
  					node = node.firstChild;
  					while(node){
  						if(node.nodeType!==7 && node.nodeType !==8){
  							buf.push(getTextContent(node));
  						}
  						node = node.nextSibling;
  					}
  					return buf.join('');
  				default:
  					return node.nodeValue;
  				}
  			}

  			__set__ = function(object,key,value){
  				//console.log(value)
  				object['$$'+key] = value;
  			};
  		}
  	}catch(e){//ie8
  	}

  	//if(typeof require == 'function'){
  		dom.DocumentType = DocumentType;
  		dom.DOMException = DOMException;
  		dom.DOMImplementation = DOMImplementation;
  		dom.Element = Element;
  		dom.Node = Node;
  		dom.NodeList = NodeList;
  		dom.XMLSerializer = XMLSerializer;
  	//}
  	return dom;
  }

  var domParser = {};

  var entities = {};

  var hasRequiredEntities;

  function requireEntities () {
  	if (hasRequiredEntities) return entities;
  	hasRequiredEntities = 1;
  	(function (exports) {

  		var freeze = requireConventions().freeze;

  		/**
  		 * The entities that are predefined in every XML document.
  		 *
  		 * @see https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-predefined-ent W3C XML 1.1
  		 * @see https://www.w3.org/TR/2008/REC-xml-20081126/#sec-predefined-ent W3C XML 1.0
  		 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Predefined_entities_in_XML Wikipedia
  		 */
  		exports.XML_ENTITIES = freeze({
  			amp: '&',
  			apos: "'",
  			gt: '>',
  			lt: '<',
  			quot: '"',
  		});

  		/**
  		 * A map of all entities that are detected in an HTML document.
  		 * They contain all entries from `XML_ENTITIES`.
  		 *
  		 * @see XML_ENTITIES
  		 * @see DOMParser.parseFromString
  		 * @see DOMImplementation.prototype.createHTMLDocument
  		 * @see https://html.spec.whatwg.org/#named-character-references WHATWG HTML(5) Spec
  		 * @see https://html.spec.whatwg.org/entities.json JSON
  		 * @see https://www.w3.org/TR/xml-entity-names/ W3C XML Entity Names
  		 * @see https://www.w3.org/TR/html4/sgml/entities.html W3C HTML4/SGML
  		 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Character_entity_references_in_HTML Wikipedia (HTML)
  		 * @see https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references#Entities_representing_special_characters_in_XHTML Wikpedia (XHTML)
  		 */
  		exports.HTML_ENTITIES = freeze({
  			Aacute: '\u00C1',
  			aacute: '\u00E1',
  			Abreve: '\u0102',
  			abreve: '\u0103',
  			ac: '\u223E',
  			acd: '\u223F',
  			acE: '\u223E\u0333',
  			Acirc: '\u00C2',
  			acirc: '\u00E2',
  			acute: '\u00B4',
  			Acy: '\u0410',
  			acy: '\u0430',
  			AElig: '\u00C6',
  			aelig: '\u00E6',
  			af: '\u2061',
  			Afr: '\uD835\uDD04',
  			afr: '\uD835\uDD1E',
  			Agrave: '\u00C0',
  			agrave: '\u00E0',
  			alefsym: '\u2135',
  			aleph: '\u2135',
  			Alpha: '\u0391',
  			alpha: '\u03B1',
  			Amacr: '\u0100',
  			amacr: '\u0101',
  			amalg: '\u2A3F',
  			AMP: '\u0026',
  			amp: '\u0026',
  			And: '\u2A53',
  			and: '\u2227',
  			andand: '\u2A55',
  			andd: '\u2A5C',
  			andslope: '\u2A58',
  			andv: '\u2A5A',
  			ang: '\u2220',
  			ange: '\u29A4',
  			angle: '\u2220',
  			angmsd: '\u2221',
  			angmsdaa: '\u29A8',
  			angmsdab: '\u29A9',
  			angmsdac: '\u29AA',
  			angmsdad: '\u29AB',
  			angmsdae: '\u29AC',
  			angmsdaf: '\u29AD',
  			angmsdag: '\u29AE',
  			angmsdah: '\u29AF',
  			angrt: '\u221F',
  			angrtvb: '\u22BE',
  			angrtvbd: '\u299D',
  			angsph: '\u2222',
  			angst: '\u00C5',
  			angzarr: '\u237C',
  			Aogon: '\u0104',
  			aogon: '\u0105',
  			Aopf: '\uD835\uDD38',
  			aopf: '\uD835\uDD52',
  			ap: '\u2248',
  			apacir: '\u2A6F',
  			apE: '\u2A70',
  			ape: '\u224A',
  			apid: '\u224B',
  			apos: '\u0027',
  			ApplyFunction: '\u2061',
  			approx: '\u2248',
  			approxeq: '\u224A',
  			Aring: '\u00C5',
  			aring: '\u00E5',
  			Ascr: '\uD835\uDC9C',
  			ascr: '\uD835\uDCB6',
  			Assign: '\u2254',
  			ast: '\u002A',
  			asymp: '\u2248',
  			asympeq: '\u224D',
  			Atilde: '\u00C3',
  			atilde: '\u00E3',
  			Auml: '\u00C4',
  			auml: '\u00E4',
  			awconint: '\u2233',
  			awint: '\u2A11',
  			backcong: '\u224C',
  			backepsilon: '\u03F6',
  			backprime: '\u2035',
  			backsim: '\u223D',
  			backsimeq: '\u22CD',
  			Backslash: '\u2216',
  			Barv: '\u2AE7',
  			barvee: '\u22BD',
  			Barwed: '\u2306',
  			barwed: '\u2305',
  			barwedge: '\u2305',
  			bbrk: '\u23B5',
  			bbrktbrk: '\u23B6',
  			bcong: '\u224C',
  			Bcy: '\u0411',
  			bcy: '\u0431',
  			bdquo: '\u201E',
  			becaus: '\u2235',
  			Because: '\u2235',
  			because: '\u2235',
  			bemptyv: '\u29B0',
  			bepsi: '\u03F6',
  			bernou: '\u212C',
  			Bernoullis: '\u212C',
  			Beta: '\u0392',
  			beta: '\u03B2',
  			beth: '\u2136',
  			between: '\u226C',
  			Bfr: '\uD835\uDD05',
  			bfr: '\uD835\uDD1F',
  			bigcap: '\u22C2',
  			bigcirc: '\u25EF',
  			bigcup: '\u22C3',
  			bigodot: '\u2A00',
  			bigoplus: '\u2A01',
  			bigotimes: '\u2A02',
  			bigsqcup: '\u2A06',
  			bigstar: '\u2605',
  			bigtriangledown: '\u25BD',
  			bigtriangleup: '\u25B3',
  			biguplus: '\u2A04',
  			bigvee: '\u22C1',
  			bigwedge: '\u22C0',
  			bkarow: '\u290D',
  			blacklozenge: '\u29EB',
  			blacksquare: '\u25AA',
  			blacktriangle: '\u25B4',
  			blacktriangledown: '\u25BE',
  			blacktriangleleft: '\u25C2',
  			blacktriangleright: '\u25B8',
  			blank: '\u2423',
  			blk12: '\u2592',
  			blk14: '\u2591',
  			blk34: '\u2593',
  			block: '\u2588',
  			bne: '\u003D\u20E5',
  			bnequiv: '\u2261\u20E5',
  			bNot: '\u2AED',
  			bnot: '\u2310',
  			Bopf: '\uD835\uDD39',
  			bopf: '\uD835\uDD53',
  			bot: '\u22A5',
  			bottom: '\u22A5',
  			bowtie: '\u22C8',
  			boxbox: '\u29C9',
  			boxDL: '\u2557',
  			boxDl: '\u2556',
  			boxdL: '\u2555',
  			boxdl: '\u2510',
  			boxDR: '\u2554',
  			boxDr: '\u2553',
  			boxdR: '\u2552',
  			boxdr: '\u250C',
  			boxH: '\u2550',
  			boxh: '\u2500',
  			boxHD: '\u2566',
  			boxHd: '\u2564',
  			boxhD: '\u2565',
  			boxhd: '\u252C',
  			boxHU: '\u2569',
  			boxHu: '\u2567',
  			boxhU: '\u2568',
  			boxhu: '\u2534',
  			boxminus: '\u229F',
  			boxplus: '\u229E',
  			boxtimes: '\u22A0',
  			boxUL: '\u255D',
  			boxUl: '\u255C',
  			boxuL: '\u255B',
  			boxul: '\u2518',
  			boxUR: '\u255A',
  			boxUr: '\u2559',
  			boxuR: '\u2558',
  			boxur: '\u2514',
  			boxV: '\u2551',
  			boxv: '\u2502',
  			boxVH: '\u256C',
  			boxVh: '\u256B',
  			boxvH: '\u256A',
  			boxvh: '\u253C',
  			boxVL: '\u2563',
  			boxVl: '\u2562',
  			boxvL: '\u2561',
  			boxvl: '\u2524',
  			boxVR: '\u2560',
  			boxVr: '\u255F',
  			boxvR: '\u255E',
  			boxvr: '\u251C',
  			bprime: '\u2035',
  			Breve: '\u02D8',
  			breve: '\u02D8',
  			brvbar: '\u00A6',
  			Bscr: '\u212C',
  			bscr: '\uD835\uDCB7',
  			bsemi: '\u204F',
  			bsim: '\u223D',
  			bsime: '\u22CD',
  			bsol: '\u005C',
  			bsolb: '\u29C5',
  			bsolhsub: '\u27C8',
  			bull: '\u2022',
  			bullet: '\u2022',
  			bump: '\u224E',
  			bumpE: '\u2AAE',
  			bumpe: '\u224F',
  			Bumpeq: '\u224E',
  			bumpeq: '\u224F',
  			Cacute: '\u0106',
  			cacute: '\u0107',
  			Cap: '\u22D2',
  			cap: '\u2229',
  			capand: '\u2A44',
  			capbrcup: '\u2A49',
  			capcap: '\u2A4B',
  			capcup: '\u2A47',
  			capdot: '\u2A40',
  			CapitalDifferentialD: '\u2145',
  			caps: '\u2229\uFE00',
  			caret: '\u2041',
  			caron: '\u02C7',
  			Cayleys: '\u212D',
  			ccaps: '\u2A4D',
  			Ccaron: '\u010C',
  			ccaron: '\u010D',
  			Ccedil: '\u00C7',
  			ccedil: '\u00E7',
  			Ccirc: '\u0108',
  			ccirc: '\u0109',
  			Cconint: '\u2230',
  			ccups: '\u2A4C',
  			ccupssm: '\u2A50',
  			Cdot: '\u010A',
  			cdot: '\u010B',
  			cedil: '\u00B8',
  			Cedilla: '\u00B8',
  			cemptyv: '\u29B2',
  			cent: '\u00A2',
  			CenterDot: '\u00B7',
  			centerdot: '\u00B7',
  			Cfr: '\u212D',
  			cfr: '\uD835\uDD20',
  			CHcy: '\u0427',
  			chcy: '\u0447',
  			check: '\u2713',
  			checkmark: '\u2713',
  			Chi: '\u03A7',
  			chi: '\u03C7',
  			cir: '\u25CB',
  			circ: '\u02C6',
  			circeq: '\u2257',
  			circlearrowleft: '\u21BA',
  			circlearrowright: '\u21BB',
  			circledast: '\u229B',
  			circledcirc: '\u229A',
  			circleddash: '\u229D',
  			CircleDot: '\u2299',
  			circledR: '\u00AE',
  			circledS: '\u24C8',
  			CircleMinus: '\u2296',
  			CirclePlus: '\u2295',
  			CircleTimes: '\u2297',
  			cirE: '\u29C3',
  			cire: '\u2257',
  			cirfnint: '\u2A10',
  			cirmid: '\u2AEF',
  			cirscir: '\u29C2',
  			ClockwiseContourIntegral: '\u2232',
  			CloseCurlyDoubleQuote: '\u201D',
  			CloseCurlyQuote: '\u2019',
  			clubs: '\u2663',
  			clubsuit: '\u2663',
  			Colon: '\u2237',
  			colon: '\u003A',
  			Colone: '\u2A74',
  			colone: '\u2254',
  			coloneq: '\u2254',
  			comma: '\u002C',
  			commat: '\u0040',
  			comp: '\u2201',
  			compfn: '\u2218',
  			complement: '\u2201',
  			complexes: '\u2102',
  			cong: '\u2245',
  			congdot: '\u2A6D',
  			Congruent: '\u2261',
  			Conint: '\u222F',
  			conint: '\u222E',
  			ContourIntegral: '\u222E',
  			Copf: '\u2102',
  			copf: '\uD835\uDD54',
  			coprod: '\u2210',
  			Coproduct: '\u2210',
  			COPY: '\u00A9',
  			copy: '\u00A9',
  			copysr: '\u2117',
  			CounterClockwiseContourIntegral: '\u2233',
  			crarr: '\u21B5',
  			Cross: '\u2A2F',
  			cross: '\u2717',
  			Cscr: '\uD835\uDC9E',
  			cscr: '\uD835\uDCB8',
  			csub: '\u2ACF',
  			csube: '\u2AD1',
  			csup: '\u2AD0',
  			csupe: '\u2AD2',
  			ctdot: '\u22EF',
  			cudarrl: '\u2938',
  			cudarrr: '\u2935',
  			cuepr: '\u22DE',
  			cuesc: '\u22DF',
  			cularr: '\u21B6',
  			cularrp: '\u293D',
  			Cup: '\u22D3',
  			cup: '\u222A',
  			cupbrcap: '\u2A48',
  			CupCap: '\u224D',
  			cupcap: '\u2A46',
  			cupcup: '\u2A4A',
  			cupdot: '\u228D',
  			cupor: '\u2A45',
  			cups: '\u222A\uFE00',
  			curarr: '\u21B7',
  			curarrm: '\u293C',
  			curlyeqprec: '\u22DE',
  			curlyeqsucc: '\u22DF',
  			curlyvee: '\u22CE',
  			curlywedge: '\u22CF',
  			curren: '\u00A4',
  			curvearrowleft: '\u21B6',
  			curvearrowright: '\u21B7',
  			cuvee: '\u22CE',
  			cuwed: '\u22CF',
  			cwconint: '\u2232',
  			cwint: '\u2231',
  			cylcty: '\u232D',
  			Dagger: '\u2021',
  			dagger: '\u2020',
  			daleth: '\u2138',
  			Darr: '\u21A1',
  			dArr: '\u21D3',
  			darr: '\u2193',
  			dash: '\u2010',
  			Dashv: '\u2AE4',
  			dashv: '\u22A3',
  			dbkarow: '\u290F',
  			dblac: '\u02DD',
  			Dcaron: '\u010E',
  			dcaron: '\u010F',
  			Dcy: '\u0414',
  			dcy: '\u0434',
  			DD: '\u2145',
  			dd: '\u2146',
  			ddagger: '\u2021',
  			ddarr: '\u21CA',
  			DDotrahd: '\u2911',
  			ddotseq: '\u2A77',
  			deg: '\u00B0',
  			Del: '\u2207',
  			Delta: '\u0394',
  			delta: '\u03B4',
  			demptyv: '\u29B1',
  			dfisht: '\u297F',
  			Dfr: '\uD835\uDD07',
  			dfr: '\uD835\uDD21',
  			dHar: '\u2965',
  			dharl: '\u21C3',
  			dharr: '\u21C2',
  			DiacriticalAcute: '\u00B4',
  			DiacriticalDot: '\u02D9',
  			DiacriticalDoubleAcute: '\u02DD',
  			DiacriticalGrave: '\u0060',
  			DiacriticalTilde: '\u02DC',
  			diam: '\u22C4',
  			Diamond: '\u22C4',
  			diamond: '\u22C4',
  			diamondsuit: '\u2666',
  			diams: '\u2666',
  			die: '\u00A8',
  			DifferentialD: '\u2146',
  			digamma: '\u03DD',
  			disin: '\u22F2',
  			div: '\u00F7',
  			divide: '\u00F7',
  			divideontimes: '\u22C7',
  			divonx: '\u22C7',
  			DJcy: '\u0402',
  			djcy: '\u0452',
  			dlcorn: '\u231E',
  			dlcrop: '\u230D',
  			dollar: '\u0024',
  			Dopf: '\uD835\uDD3B',
  			dopf: '\uD835\uDD55',
  			Dot: '\u00A8',
  			dot: '\u02D9',
  			DotDot: '\u20DC',
  			doteq: '\u2250',
  			doteqdot: '\u2251',
  			DotEqual: '\u2250',
  			dotminus: '\u2238',
  			dotplus: '\u2214',
  			dotsquare: '\u22A1',
  			doublebarwedge: '\u2306',
  			DoubleContourIntegral: '\u222F',
  			DoubleDot: '\u00A8',
  			DoubleDownArrow: '\u21D3',
  			DoubleLeftArrow: '\u21D0',
  			DoubleLeftRightArrow: '\u21D4',
  			DoubleLeftTee: '\u2AE4',
  			DoubleLongLeftArrow: '\u27F8',
  			DoubleLongLeftRightArrow: '\u27FA',
  			DoubleLongRightArrow: '\u27F9',
  			DoubleRightArrow: '\u21D2',
  			DoubleRightTee: '\u22A8',
  			DoubleUpArrow: '\u21D1',
  			DoubleUpDownArrow: '\u21D5',
  			DoubleVerticalBar: '\u2225',
  			DownArrow: '\u2193',
  			Downarrow: '\u21D3',
  			downarrow: '\u2193',
  			DownArrowBar: '\u2913',
  			DownArrowUpArrow: '\u21F5',
  			DownBreve: '\u0311',
  			downdownarrows: '\u21CA',
  			downharpoonleft: '\u21C3',
  			downharpoonright: '\u21C2',
  			DownLeftRightVector: '\u2950',
  			DownLeftTeeVector: '\u295E',
  			DownLeftVector: '\u21BD',
  			DownLeftVectorBar: '\u2956',
  			DownRightTeeVector: '\u295F',
  			DownRightVector: '\u21C1',
  			DownRightVectorBar: '\u2957',
  			DownTee: '\u22A4',
  			DownTeeArrow: '\u21A7',
  			drbkarow: '\u2910',
  			drcorn: '\u231F',
  			drcrop: '\u230C',
  			Dscr: '\uD835\uDC9F',
  			dscr: '\uD835\uDCB9',
  			DScy: '\u0405',
  			dscy: '\u0455',
  			dsol: '\u29F6',
  			Dstrok: '\u0110',
  			dstrok: '\u0111',
  			dtdot: '\u22F1',
  			dtri: '\u25BF',
  			dtrif: '\u25BE',
  			duarr: '\u21F5',
  			duhar: '\u296F',
  			dwangle: '\u29A6',
  			DZcy: '\u040F',
  			dzcy: '\u045F',
  			dzigrarr: '\u27FF',
  			Eacute: '\u00C9',
  			eacute: '\u00E9',
  			easter: '\u2A6E',
  			Ecaron: '\u011A',
  			ecaron: '\u011B',
  			ecir: '\u2256',
  			Ecirc: '\u00CA',
  			ecirc: '\u00EA',
  			ecolon: '\u2255',
  			Ecy: '\u042D',
  			ecy: '\u044D',
  			eDDot: '\u2A77',
  			Edot: '\u0116',
  			eDot: '\u2251',
  			edot: '\u0117',
  			ee: '\u2147',
  			efDot: '\u2252',
  			Efr: '\uD835\uDD08',
  			efr: '\uD835\uDD22',
  			eg: '\u2A9A',
  			Egrave: '\u00C8',
  			egrave: '\u00E8',
  			egs: '\u2A96',
  			egsdot: '\u2A98',
  			el: '\u2A99',
  			Element: '\u2208',
  			elinters: '\u23E7',
  			ell: '\u2113',
  			els: '\u2A95',
  			elsdot: '\u2A97',
  			Emacr: '\u0112',
  			emacr: '\u0113',
  			empty: '\u2205',
  			emptyset: '\u2205',
  			EmptySmallSquare: '\u25FB',
  			emptyv: '\u2205',
  			EmptyVerySmallSquare: '\u25AB',
  			emsp: '\u2003',
  			emsp13: '\u2004',
  			emsp14: '\u2005',
  			ENG: '\u014A',
  			eng: '\u014B',
  			ensp: '\u2002',
  			Eogon: '\u0118',
  			eogon: '\u0119',
  			Eopf: '\uD835\uDD3C',
  			eopf: '\uD835\uDD56',
  			epar: '\u22D5',
  			eparsl: '\u29E3',
  			eplus: '\u2A71',
  			epsi: '\u03B5',
  			Epsilon: '\u0395',
  			epsilon: '\u03B5',
  			epsiv: '\u03F5',
  			eqcirc: '\u2256',
  			eqcolon: '\u2255',
  			eqsim: '\u2242',
  			eqslantgtr: '\u2A96',
  			eqslantless: '\u2A95',
  			Equal: '\u2A75',
  			equals: '\u003D',
  			EqualTilde: '\u2242',
  			equest: '\u225F',
  			Equilibrium: '\u21CC',
  			equiv: '\u2261',
  			equivDD: '\u2A78',
  			eqvparsl: '\u29E5',
  			erarr: '\u2971',
  			erDot: '\u2253',
  			Escr: '\u2130',
  			escr: '\u212F',
  			esdot: '\u2250',
  			Esim: '\u2A73',
  			esim: '\u2242',
  			Eta: '\u0397',
  			eta: '\u03B7',
  			ETH: '\u00D0',
  			eth: '\u00F0',
  			Euml: '\u00CB',
  			euml: '\u00EB',
  			euro: '\u20AC',
  			excl: '\u0021',
  			exist: '\u2203',
  			Exists: '\u2203',
  			expectation: '\u2130',
  			ExponentialE: '\u2147',
  			exponentiale: '\u2147',
  			fallingdotseq: '\u2252',
  			Fcy: '\u0424',
  			fcy: '\u0444',
  			female: '\u2640',
  			ffilig: '\uFB03',
  			fflig: '\uFB00',
  			ffllig: '\uFB04',
  			Ffr: '\uD835\uDD09',
  			ffr: '\uD835\uDD23',
  			filig: '\uFB01',
  			FilledSmallSquare: '\u25FC',
  			FilledVerySmallSquare: '\u25AA',
  			fjlig: '\u0066\u006A',
  			flat: '\u266D',
  			fllig: '\uFB02',
  			fltns: '\u25B1',
  			fnof: '\u0192',
  			Fopf: '\uD835\uDD3D',
  			fopf: '\uD835\uDD57',
  			ForAll: '\u2200',
  			forall: '\u2200',
  			fork: '\u22D4',
  			forkv: '\u2AD9',
  			Fouriertrf: '\u2131',
  			fpartint: '\u2A0D',
  			frac12: '\u00BD',
  			frac13: '\u2153',
  			frac14: '\u00BC',
  			frac15: '\u2155',
  			frac16: '\u2159',
  			frac18: '\u215B',
  			frac23: '\u2154',
  			frac25: '\u2156',
  			frac34: '\u00BE',
  			frac35: '\u2157',
  			frac38: '\u215C',
  			frac45: '\u2158',
  			frac56: '\u215A',
  			frac58: '\u215D',
  			frac78: '\u215E',
  			frasl: '\u2044',
  			frown: '\u2322',
  			Fscr: '\u2131',
  			fscr: '\uD835\uDCBB',
  			gacute: '\u01F5',
  			Gamma: '\u0393',
  			gamma: '\u03B3',
  			Gammad: '\u03DC',
  			gammad: '\u03DD',
  			gap: '\u2A86',
  			Gbreve: '\u011E',
  			gbreve: '\u011F',
  			Gcedil: '\u0122',
  			Gcirc: '\u011C',
  			gcirc: '\u011D',
  			Gcy: '\u0413',
  			gcy: '\u0433',
  			Gdot: '\u0120',
  			gdot: '\u0121',
  			gE: '\u2267',
  			ge: '\u2265',
  			gEl: '\u2A8C',
  			gel: '\u22DB',
  			geq: '\u2265',
  			geqq: '\u2267',
  			geqslant: '\u2A7E',
  			ges: '\u2A7E',
  			gescc: '\u2AA9',
  			gesdot: '\u2A80',
  			gesdoto: '\u2A82',
  			gesdotol: '\u2A84',
  			gesl: '\u22DB\uFE00',
  			gesles: '\u2A94',
  			Gfr: '\uD835\uDD0A',
  			gfr: '\uD835\uDD24',
  			Gg: '\u22D9',
  			gg: '\u226B',
  			ggg: '\u22D9',
  			gimel: '\u2137',
  			GJcy: '\u0403',
  			gjcy: '\u0453',
  			gl: '\u2277',
  			gla: '\u2AA5',
  			glE: '\u2A92',
  			glj: '\u2AA4',
  			gnap: '\u2A8A',
  			gnapprox: '\u2A8A',
  			gnE: '\u2269',
  			gne: '\u2A88',
  			gneq: '\u2A88',
  			gneqq: '\u2269',
  			gnsim: '\u22E7',
  			Gopf: '\uD835\uDD3E',
  			gopf: '\uD835\uDD58',
  			grave: '\u0060',
  			GreaterEqual: '\u2265',
  			GreaterEqualLess: '\u22DB',
  			GreaterFullEqual: '\u2267',
  			GreaterGreater: '\u2AA2',
  			GreaterLess: '\u2277',
  			GreaterSlantEqual: '\u2A7E',
  			GreaterTilde: '\u2273',
  			Gscr: '\uD835\uDCA2',
  			gscr: '\u210A',
  			gsim: '\u2273',
  			gsime: '\u2A8E',
  			gsiml: '\u2A90',
  			Gt: '\u226B',
  			GT: '\u003E',
  			gt: '\u003E',
  			gtcc: '\u2AA7',
  			gtcir: '\u2A7A',
  			gtdot: '\u22D7',
  			gtlPar: '\u2995',
  			gtquest: '\u2A7C',
  			gtrapprox: '\u2A86',
  			gtrarr: '\u2978',
  			gtrdot: '\u22D7',
  			gtreqless: '\u22DB',
  			gtreqqless: '\u2A8C',
  			gtrless: '\u2277',
  			gtrsim: '\u2273',
  			gvertneqq: '\u2269\uFE00',
  			gvnE: '\u2269\uFE00',
  			Hacek: '\u02C7',
  			hairsp: '\u200A',
  			half: '\u00BD',
  			hamilt: '\u210B',
  			HARDcy: '\u042A',
  			hardcy: '\u044A',
  			hArr: '\u21D4',
  			harr: '\u2194',
  			harrcir: '\u2948',
  			harrw: '\u21AD',
  			Hat: '\u005E',
  			hbar: '\u210F',
  			Hcirc: '\u0124',
  			hcirc: '\u0125',
  			hearts: '\u2665',
  			heartsuit: '\u2665',
  			hellip: '\u2026',
  			hercon: '\u22B9',
  			Hfr: '\u210C',
  			hfr: '\uD835\uDD25',
  			HilbertSpace: '\u210B',
  			hksearow: '\u2925',
  			hkswarow: '\u2926',
  			hoarr: '\u21FF',
  			homtht: '\u223B',
  			hookleftarrow: '\u21A9',
  			hookrightarrow: '\u21AA',
  			Hopf: '\u210D',
  			hopf: '\uD835\uDD59',
  			horbar: '\u2015',
  			HorizontalLine: '\u2500',
  			Hscr: '\u210B',
  			hscr: '\uD835\uDCBD',
  			hslash: '\u210F',
  			Hstrok: '\u0126',
  			hstrok: '\u0127',
  			HumpDownHump: '\u224E',
  			HumpEqual: '\u224F',
  			hybull: '\u2043',
  			hyphen: '\u2010',
  			Iacute: '\u00CD',
  			iacute: '\u00ED',
  			ic: '\u2063',
  			Icirc: '\u00CE',
  			icirc: '\u00EE',
  			Icy: '\u0418',
  			icy: '\u0438',
  			Idot: '\u0130',
  			IEcy: '\u0415',
  			iecy: '\u0435',
  			iexcl: '\u00A1',
  			iff: '\u21D4',
  			Ifr: '\u2111',
  			ifr: '\uD835\uDD26',
  			Igrave: '\u00CC',
  			igrave: '\u00EC',
  			ii: '\u2148',
  			iiiint: '\u2A0C',
  			iiint: '\u222D',
  			iinfin: '\u29DC',
  			iiota: '\u2129',
  			IJlig: '\u0132',
  			ijlig: '\u0133',
  			Im: '\u2111',
  			Imacr: '\u012A',
  			imacr: '\u012B',
  			image: '\u2111',
  			ImaginaryI: '\u2148',
  			imagline: '\u2110',
  			imagpart: '\u2111',
  			imath: '\u0131',
  			imof: '\u22B7',
  			imped: '\u01B5',
  			Implies: '\u21D2',
  			in: '\u2208',
  			incare: '\u2105',
  			infin: '\u221E',
  			infintie: '\u29DD',
  			inodot: '\u0131',
  			Int: '\u222C',
  			int: '\u222B',
  			intcal: '\u22BA',
  			integers: '\u2124',
  			Integral: '\u222B',
  			intercal: '\u22BA',
  			Intersection: '\u22C2',
  			intlarhk: '\u2A17',
  			intprod: '\u2A3C',
  			InvisibleComma: '\u2063',
  			InvisibleTimes: '\u2062',
  			IOcy: '\u0401',
  			iocy: '\u0451',
  			Iogon: '\u012E',
  			iogon: '\u012F',
  			Iopf: '\uD835\uDD40',
  			iopf: '\uD835\uDD5A',
  			Iota: '\u0399',
  			iota: '\u03B9',
  			iprod: '\u2A3C',
  			iquest: '\u00BF',
  			Iscr: '\u2110',
  			iscr: '\uD835\uDCBE',
  			isin: '\u2208',
  			isindot: '\u22F5',
  			isinE: '\u22F9',
  			isins: '\u22F4',
  			isinsv: '\u22F3',
  			isinv: '\u2208',
  			it: '\u2062',
  			Itilde: '\u0128',
  			itilde: '\u0129',
  			Iukcy: '\u0406',
  			iukcy: '\u0456',
  			Iuml: '\u00CF',
  			iuml: '\u00EF',
  			Jcirc: '\u0134',
  			jcirc: '\u0135',
  			Jcy: '\u0419',
  			jcy: '\u0439',
  			Jfr: '\uD835\uDD0D',
  			jfr: '\uD835\uDD27',
  			jmath: '\u0237',
  			Jopf: '\uD835\uDD41',
  			jopf: '\uD835\uDD5B',
  			Jscr: '\uD835\uDCA5',
  			jscr: '\uD835\uDCBF',
  			Jsercy: '\u0408',
  			jsercy: '\u0458',
  			Jukcy: '\u0404',
  			jukcy: '\u0454',
  			Kappa: '\u039A',
  			kappa: '\u03BA',
  			kappav: '\u03F0',
  			Kcedil: '\u0136',
  			kcedil: '\u0137',
  			Kcy: '\u041A',
  			kcy: '\u043A',
  			Kfr: '\uD835\uDD0E',
  			kfr: '\uD835\uDD28',
  			kgreen: '\u0138',
  			KHcy: '\u0425',
  			khcy: '\u0445',
  			KJcy: '\u040C',
  			kjcy: '\u045C',
  			Kopf: '\uD835\uDD42',
  			kopf: '\uD835\uDD5C',
  			Kscr: '\uD835\uDCA6',
  			kscr: '\uD835\uDCC0',
  			lAarr: '\u21DA',
  			Lacute: '\u0139',
  			lacute: '\u013A',
  			laemptyv: '\u29B4',
  			lagran: '\u2112',
  			Lambda: '\u039B',
  			lambda: '\u03BB',
  			Lang: '\u27EA',
  			lang: '\u27E8',
  			langd: '\u2991',
  			langle: '\u27E8',
  			lap: '\u2A85',
  			Laplacetrf: '\u2112',
  			laquo: '\u00AB',
  			Larr: '\u219E',
  			lArr: '\u21D0',
  			larr: '\u2190',
  			larrb: '\u21E4',
  			larrbfs: '\u291F',
  			larrfs: '\u291D',
  			larrhk: '\u21A9',
  			larrlp: '\u21AB',
  			larrpl: '\u2939',
  			larrsim: '\u2973',
  			larrtl: '\u21A2',
  			lat: '\u2AAB',
  			lAtail: '\u291B',
  			latail: '\u2919',
  			late: '\u2AAD',
  			lates: '\u2AAD\uFE00',
  			lBarr: '\u290E',
  			lbarr: '\u290C',
  			lbbrk: '\u2772',
  			lbrace: '\u007B',
  			lbrack: '\u005B',
  			lbrke: '\u298B',
  			lbrksld: '\u298F',
  			lbrkslu: '\u298D',
  			Lcaron: '\u013D',
  			lcaron: '\u013E',
  			Lcedil: '\u013B',
  			lcedil: '\u013C',
  			lceil: '\u2308',
  			lcub: '\u007B',
  			Lcy: '\u041B',
  			lcy: '\u043B',
  			ldca: '\u2936',
  			ldquo: '\u201C',
  			ldquor: '\u201E',
  			ldrdhar: '\u2967',
  			ldrushar: '\u294B',
  			ldsh: '\u21B2',
  			lE: '\u2266',
  			le: '\u2264',
  			LeftAngleBracket: '\u27E8',
  			LeftArrow: '\u2190',
  			Leftarrow: '\u21D0',
  			leftarrow: '\u2190',
  			LeftArrowBar: '\u21E4',
  			LeftArrowRightArrow: '\u21C6',
  			leftarrowtail: '\u21A2',
  			LeftCeiling: '\u2308',
  			LeftDoubleBracket: '\u27E6',
  			LeftDownTeeVector: '\u2961',
  			LeftDownVector: '\u21C3',
  			LeftDownVectorBar: '\u2959',
  			LeftFloor: '\u230A',
  			leftharpoondown: '\u21BD',
  			leftharpoonup: '\u21BC',
  			leftleftarrows: '\u21C7',
  			LeftRightArrow: '\u2194',
  			Leftrightarrow: '\u21D4',
  			leftrightarrow: '\u2194',
  			leftrightarrows: '\u21C6',
  			leftrightharpoons: '\u21CB',
  			leftrightsquigarrow: '\u21AD',
  			LeftRightVector: '\u294E',
  			LeftTee: '\u22A3',
  			LeftTeeArrow: '\u21A4',
  			LeftTeeVector: '\u295A',
  			leftthreetimes: '\u22CB',
  			LeftTriangle: '\u22B2',
  			LeftTriangleBar: '\u29CF',
  			LeftTriangleEqual: '\u22B4',
  			LeftUpDownVector: '\u2951',
  			LeftUpTeeVector: '\u2960',
  			LeftUpVector: '\u21BF',
  			LeftUpVectorBar: '\u2958',
  			LeftVector: '\u21BC',
  			LeftVectorBar: '\u2952',
  			lEg: '\u2A8B',
  			leg: '\u22DA',
  			leq: '\u2264',
  			leqq: '\u2266',
  			leqslant: '\u2A7D',
  			les: '\u2A7D',
  			lescc: '\u2AA8',
  			lesdot: '\u2A7F',
  			lesdoto: '\u2A81',
  			lesdotor: '\u2A83',
  			lesg: '\u22DA\uFE00',
  			lesges: '\u2A93',
  			lessapprox: '\u2A85',
  			lessdot: '\u22D6',
  			lesseqgtr: '\u22DA',
  			lesseqqgtr: '\u2A8B',
  			LessEqualGreater: '\u22DA',
  			LessFullEqual: '\u2266',
  			LessGreater: '\u2276',
  			lessgtr: '\u2276',
  			LessLess: '\u2AA1',
  			lesssim: '\u2272',
  			LessSlantEqual: '\u2A7D',
  			LessTilde: '\u2272',
  			lfisht: '\u297C',
  			lfloor: '\u230A',
  			Lfr: '\uD835\uDD0F',
  			lfr: '\uD835\uDD29',
  			lg: '\u2276',
  			lgE: '\u2A91',
  			lHar: '\u2962',
  			lhard: '\u21BD',
  			lharu: '\u21BC',
  			lharul: '\u296A',
  			lhblk: '\u2584',
  			LJcy: '\u0409',
  			ljcy: '\u0459',
  			Ll: '\u22D8',
  			ll: '\u226A',
  			llarr: '\u21C7',
  			llcorner: '\u231E',
  			Lleftarrow: '\u21DA',
  			llhard: '\u296B',
  			lltri: '\u25FA',
  			Lmidot: '\u013F',
  			lmidot: '\u0140',
  			lmoust: '\u23B0',
  			lmoustache: '\u23B0',
  			lnap: '\u2A89',
  			lnapprox: '\u2A89',
  			lnE: '\u2268',
  			lne: '\u2A87',
  			lneq: '\u2A87',
  			lneqq: '\u2268',
  			lnsim: '\u22E6',
  			loang: '\u27EC',
  			loarr: '\u21FD',
  			lobrk: '\u27E6',
  			LongLeftArrow: '\u27F5',
  			Longleftarrow: '\u27F8',
  			longleftarrow: '\u27F5',
  			LongLeftRightArrow: '\u27F7',
  			Longleftrightarrow: '\u27FA',
  			longleftrightarrow: '\u27F7',
  			longmapsto: '\u27FC',
  			LongRightArrow: '\u27F6',
  			Longrightarrow: '\u27F9',
  			longrightarrow: '\u27F6',
  			looparrowleft: '\u21AB',
  			looparrowright: '\u21AC',
  			lopar: '\u2985',
  			Lopf: '\uD835\uDD43',
  			lopf: '\uD835\uDD5D',
  			loplus: '\u2A2D',
  			lotimes: '\u2A34',
  			lowast: '\u2217',
  			lowbar: '\u005F',
  			LowerLeftArrow: '\u2199',
  			LowerRightArrow: '\u2198',
  			loz: '\u25CA',
  			lozenge: '\u25CA',
  			lozf: '\u29EB',
  			lpar: '\u0028',
  			lparlt: '\u2993',
  			lrarr: '\u21C6',
  			lrcorner: '\u231F',
  			lrhar: '\u21CB',
  			lrhard: '\u296D',
  			lrm: '\u200E',
  			lrtri: '\u22BF',
  			lsaquo: '\u2039',
  			Lscr: '\u2112',
  			lscr: '\uD835\uDCC1',
  			Lsh: '\u21B0',
  			lsh: '\u21B0',
  			lsim: '\u2272',
  			lsime: '\u2A8D',
  			lsimg: '\u2A8F',
  			lsqb: '\u005B',
  			lsquo: '\u2018',
  			lsquor: '\u201A',
  			Lstrok: '\u0141',
  			lstrok: '\u0142',
  			Lt: '\u226A',
  			LT: '\u003C',
  			lt: '\u003C',
  			ltcc: '\u2AA6',
  			ltcir: '\u2A79',
  			ltdot: '\u22D6',
  			lthree: '\u22CB',
  			ltimes: '\u22C9',
  			ltlarr: '\u2976',
  			ltquest: '\u2A7B',
  			ltri: '\u25C3',
  			ltrie: '\u22B4',
  			ltrif: '\u25C2',
  			ltrPar: '\u2996',
  			lurdshar: '\u294A',
  			luruhar: '\u2966',
  			lvertneqq: '\u2268\uFE00',
  			lvnE: '\u2268\uFE00',
  			macr: '\u00AF',
  			male: '\u2642',
  			malt: '\u2720',
  			maltese: '\u2720',
  			Map: '\u2905',
  			map: '\u21A6',
  			mapsto: '\u21A6',
  			mapstodown: '\u21A7',
  			mapstoleft: '\u21A4',
  			mapstoup: '\u21A5',
  			marker: '\u25AE',
  			mcomma: '\u2A29',
  			Mcy: '\u041C',
  			mcy: '\u043C',
  			mdash: '\u2014',
  			mDDot: '\u223A',
  			measuredangle: '\u2221',
  			MediumSpace: '\u205F',
  			Mellintrf: '\u2133',
  			Mfr: '\uD835\uDD10',
  			mfr: '\uD835\uDD2A',
  			mho: '\u2127',
  			micro: '\u00B5',
  			mid: '\u2223',
  			midast: '\u002A',
  			midcir: '\u2AF0',
  			middot: '\u00B7',
  			minus: '\u2212',
  			minusb: '\u229F',
  			minusd: '\u2238',
  			minusdu: '\u2A2A',
  			MinusPlus: '\u2213',
  			mlcp: '\u2ADB',
  			mldr: '\u2026',
  			mnplus: '\u2213',
  			models: '\u22A7',
  			Mopf: '\uD835\uDD44',
  			mopf: '\uD835\uDD5E',
  			mp: '\u2213',
  			Mscr: '\u2133',
  			mscr: '\uD835\uDCC2',
  			mstpos: '\u223E',
  			Mu: '\u039C',
  			mu: '\u03BC',
  			multimap: '\u22B8',
  			mumap: '\u22B8',
  			nabla: '\u2207',
  			Nacute: '\u0143',
  			nacute: '\u0144',
  			nang: '\u2220\u20D2',
  			nap: '\u2249',
  			napE: '\u2A70\u0338',
  			napid: '\u224B\u0338',
  			napos: '\u0149',
  			napprox: '\u2249',
  			natur: '\u266E',
  			natural: '\u266E',
  			naturals: '\u2115',
  			nbsp: '\u00A0',
  			nbump: '\u224E\u0338',
  			nbumpe: '\u224F\u0338',
  			ncap: '\u2A43',
  			Ncaron: '\u0147',
  			ncaron: '\u0148',
  			Ncedil: '\u0145',
  			ncedil: '\u0146',
  			ncong: '\u2247',
  			ncongdot: '\u2A6D\u0338',
  			ncup: '\u2A42',
  			Ncy: '\u041D',
  			ncy: '\u043D',
  			ndash: '\u2013',
  			ne: '\u2260',
  			nearhk: '\u2924',
  			neArr: '\u21D7',
  			nearr: '\u2197',
  			nearrow: '\u2197',
  			nedot: '\u2250\u0338',
  			NegativeMediumSpace: '\u200B',
  			NegativeThickSpace: '\u200B',
  			NegativeThinSpace: '\u200B',
  			NegativeVeryThinSpace: '\u200B',
  			nequiv: '\u2262',
  			nesear: '\u2928',
  			nesim: '\u2242\u0338',
  			NestedGreaterGreater: '\u226B',
  			NestedLessLess: '\u226A',
  			NewLine: '\u000A',
  			nexist: '\u2204',
  			nexists: '\u2204',
  			Nfr: '\uD835\uDD11',
  			nfr: '\uD835\uDD2B',
  			ngE: '\u2267\u0338',
  			nge: '\u2271',
  			ngeq: '\u2271',
  			ngeqq: '\u2267\u0338',
  			ngeqslant: '\u2A7E\u0338',
  			nges: '\u2A7E\u0338',
  			nGg: '\u22D9\u0338',
  			ngsim: '\u2275',
  			nGt: '\u226B\u20D2',
  			ngt: '\u226F',
  			ngtr: '\u226F',
  			nGtv: '\u226B\u0338',
  			nhArr: '\u21CE',
  			nharr: '\u21AE',
  			nhpar: '\u2AF2',
  			ni: '\u220B',
  			nis: '\u22FC',
  			nisd: '\u22FA',
  			niv: '\u220B',
  			NJcy: '\u040A',
  			njcy: '\u045A',
  			nlArr: '\u21CD',
  			nlarr: '\u219A',
  			nldr: '\u2025',
  			nlE: '\u2266\u0338',
  			nle: '\u2270',
  			nLeftarrow: '\u21CD',
  			nleftarrow: '\u219A',
  			nLeftrightarrow: '\u21CE',
  			nleftrightarrow: '\u21AE',
  			nleq: '\u2270',
  			nleqq: '\u2266\u0338',
  			nleqslant: '\u2A7D\u0338',
  			nles: '\u2A7D\u0338',
  			nless: '\u226E',
  			nLl: '\u22D8\u0338',
  			nlsim: '\u2274',
  			nLt: '\u226A\u20D2',
  			nlt: '\u226E',
  			nltri: '\u22EA',
  			nltrie: '\u22EC',
  			nLtv: '\u226A\u0338',
  			nmid: '\u2224',
  			NoBreak: '\u2060',
  			NonBreakingSpace: '\u00A0',
  			Nopf: '\u2115',
  			nopf: '\uD835\uDD5F',
  			Not: '\u2AEC',
  			not: '\u00AC',
  			NotCongruent: '\u2262',
  			NotCupCap: '\u226D',
  			NotDoubleVerticalBar: '\u2226',
  			NotElement: '\u2209',
  			NotEqual: '\u2260',
  			NotEqualTilde: '\u2242\u0338',
  			NotExists: '\u2204',
  			NotGreater: '\u226F',
  			NotGreaterEqual: '\u2271',
  			NotGreaterFullEqual: '\u2267\u0338',
  			NotGreaterGreater: '\u226B\u0338',
  			NotGreaterLess: '\u2279',
  			NotGreaterSlantEqual: '\u2A7E\u0338',
  			NotGreaterTilde: '\u2275',
  			NotHumpDownHump: '\u224E\u0338',
  			NotHumpEqual: '\u224F\u0338',
  			notin: '\u2209',
  			notindot: '\u22F5\u0338',
  			notinE: '\u22F9\u0338',
  			notinva: '\u2209',
  			notinvb: '\u22F7',
  			notinvc: '\u22F6',
  			NotLeftTriangle: '\u22EA',
  			NotLeftTriangleBar: '\u29CF\u0338',
  			NotLeftTriangleEqual: '\u22EC',
  			NotLess: '\u226E',
  			NotLessEqual: '\u2270',
  			NotLessGreater: '\u2278',
  			NotLessLess: '\u226A\u0338',
  			NotLessSlantEqual: '\u2A7D\u0338',
  			NotLessTilde: '\u2274',
  			NotNestedGreaterGreater: '\u2AA2\u0338',
  			NotNestedLessLess: '\u2AA1\u0338',
  			notni: '\u220C',
  			notniva: '\u220C',
  			notnivb: '\u22FE',
  			notnivc: '\u22FD',
  			NotPrecedes: '\u2280',
  			NotPrecedesEqual: '\u2AAF\u0338',
  			NotPrecedesSlantEqual: '\u22E0',
  			NotReverseElement: '\u220C',
  			NotRightTriangle: '\u22EB',
  			NotRightTriangleBar: '\u29D0\u0338',
  			NotRightTriangleEqual: '\u22ED',
  			NotSquareSubset: '\u228F\u0338',
  			NotSquareSubsetEqual: '\u22E2',
  			NotSquareSuperset: '\u2290\u0338',
  			NotSquareSupersetEqual: '\u22E3',
  			NotSubset: '\u2282\u20D2',
  			NotSubsetEqual: '\u2288',
  			NotSucceeds: '\u2281',
  			NotSucceedsEqual: '\u2AB0\u0338',
  			NotSucceedsSlantEqual: '\u22E1',
  			NotSucceedsTilde: '\u227F\u0338',
  			NotSuperset: '\u2283\u20D2',
  			NotSupersetEqual: '\u2289',
  			NotTilde: '\u2241',
  			NotTildeEqual: '\u2244',
  			NotTildeFullEqual: '\u2247',
  			NotTildeTilde: '\u2249',
  			NotVerticalBar: '\u2224',
  			npar: '\u2226',
  			nparallel: '\u2226',
  			nparsl: '\u2AFD\u20E5',
  			npart: '\u2202\u0338',
  			npolint: '\u2A14',
  			npr: '\u2280',
  			nprcue: '\u22E0',
  			npre: '\u2AAF\u0338',
  			nprec: '\u2280',
  			npreceq: '\u2AAF\u0338',
  			nrArr: '\u21CF',
  			nrarr: '\u219B',
  			nrarrc: '\u2933\u0338',
  			nrarrw: '\u219D\u0338',
  			nRightarrow: '\u21CF',
  			nrightarrow: '\u219B',
  			nrtri: '\u22EB',
  			nrtrie: '\u22ED',
  			nsc: '\u2281',
  			nsccue: '\u22E1',
  			nsce: '\u2AB0\u0338',
  			Nscr: '\uD835\uDCA9',
  			nscr: '\uD835\uDCC3',
  			nshortmid: '\u2224',
  			nshortparallel: '\u2226',
  			nsim: '\u2241',
  			nsime: '\u2244',
  			nsimeq: '\u2244',
  			nsmid: '\u2224',
  			nspar: '\u2226',
  			nsqsube: '\u22E2',
  			nsqsupe: '\u22E3',
  			nsub: '\u2284',
  			nsubE: '\u2AC5\u0338',
  			nsube: '\u2288',
  			nsubset: '\u2282\u20D2',
  			nsubseteq: '\u2288',
  			nsubseteqq: '\u2AC5\u0338',
  			nsucc: '\u2281',
  			nsucceq: '\u2AB0\u0338',
  			nsup: '\u2285',
  			nsupE: '\u2AC6\u0338',
  			nsupe: '\u2289',
  			nsupset: '\u2283\u20D2',
  			nsupseteq: '\u2289',
  			nsupseteqq: '\u2AC6\u0338',
  			ntgl: '\u2279',
  			Ntilde: '\u00D1',
  			ntilde: '\u00F1',
  			ntlg: '\u2278',
  			ntriangleleft: '\u22EA',
  			ntrianglelefteq: '\u22EC',
  			ntriangleright: '\u22EB',
  			ntrianglerighteq: '\u22ED',
  			Nu: '\u039D',
  			nu: '\u03BD',
  			num: '\u0023',
  			numero: '\u2116',
  			numsp: '\u2007',
  			nvap: '\u224D\u20D2',
  			nVDash: '\u22AF',
  			nVdash: '\u22AE',
  			nvDash: '\u22AD',
  			nvdash: '\u22AC',
  			nvge: '\u2265\u20D2',
  			nvgt: '\u003E\u20D2',
  			nvHarr: '\u2904',
  			nvinfin: '\u29DE',
  			nvlArr: '\u2902',
  			nvle: '\u2264\u20D2',
  			nvlt: '\u003C\u20D2',
  			nvltrie: '\u22B4\u20D2',
  			nvrArr: '\u2903',
  			nvrtrie: '\u22B5\u20D2',
  			nvsim: '\u223C\u20D2',
  			nwarhk: '\u2923',
  			nwArr: '\u21D6',
  			nwarr: '\u2196',
  			nwarrow: '\u2196',
  			nwnear: '\u2927',
  			Oacute: '\u00D3',
  			oacute: '\u00F3',
  			oast: '\u229B',
  			ocir: '\u229A',
  			Ocirc: '\u00D4',
  			ocirc: '\u00F4',
  			Ocy: '\u041E',
  			ocy: '\u043E',
  			odash: '\u229D',
  			Odblac: '\u0150',
  			odblac: '\u0151',
  			odiv: '\u2A38',
  			odot: '\u2299',
  			odsold: '\u29BC',
  			OElig: '\u0152',
  			oelig: '\u0153',
  			ofcir: '\u29BF',
  			Ofr: '\uD835\uDD12',
  			ofr: '\uD835\uDD2C',
  			ogon: '\u02DB',
  			Ograve: '\u00D2',
  			ograve: '\u00F2',
  			ogt: '\u29C1',
  			ohbar: '\u29B5',
  			ohm: '\u03A9',
  			oint: '\u222E',
  			olarr: '\u21BA',
  			olcir: '\u29BE',
  			olcross: '\u29BB',
  			oline: '\u203E',
  			olt: '\u29C0',
  			Omacr: '\u014C',
  			omacr: '\u014D',
  			Omega: '\u03A9',
  			omega: '\u03C9',
  			Omicron: '\u039F',
  			omicron: '\u03BF',
  			omid: '\u29B6',
  			ominus: '\u2296',
  			Oopf: '\uD835\uDD46',
  			oopf: '\uD835\uDD60',
  			opar: '\u29B7',
  			OpenCurlyDoubleQuote: '\u201C',
  			OpenCurlyQuote: '\u2018',
  			operp: '\u29B9',
  			oplus: '\u2295',
  			Or: '\u2A54',
  			or: '\u2228',
  			orarr: '\u21BB',
  			ord: '\u2A5D',
  			order: '\u2134',
  			orderof: '\u2134',
  			ordf: '\u00AA',
  			ordm: '\u00BA',
  			origof: '\u22B6',
  			oror: '\u2A56',
  			orslope: '\u2A57',
  			orv: '\u2A5B',
  			oS: '\u24C8',
  			Oscr: '\uD835\uDCAA',
  			oscr: '\u2134',
  			Oslash: '\u00D8',
  			oslash: '\u00F8',
  			osol: '\u2298',
  			Otilde: '\u00D5',
  			otilde: '\u00F5',
  			Otimes: '\u2A37',
  			otimes: '\u2297',
  			otimesas: '\u2A36',
  			Ouml: '\u00D6',
  			ouml: '\u00F6',
  			ovbar: '\u233D',
  			OverBar: '\u203E',
  			OverBrace: '\u23DE',
  			OverBracket: '\u23B4',
  			OverParenthesis: '\u23DC',
  			par: '\u2225',
  			para: '\u00B6',
  			parallel: '\u2225',
  			parsim: '\u2AF3',
  			parsl: '\u2AFD',
  			part: '\u2202',
  			PartialD: '\u2202',
  			Pcy: '\u041F',
  			pcy: '\u043F',
  			percnt: '\u0025',
  			period: '\u002E',
  			permil: '\u2030',
  			perp: '\u22A5',
  			pertenk: '\u2031',
  			Pfr: '\uD835\uDD13',
  			pfr: '\uD835\uDD2D',
  			Phi: '\u03A6',
  			phi: '\u03C6',
  			phiv: '\u03D5',
  			phmmat: '\u2133',
  			phone: '\u260E',
  			Pi: '\u03A0',
  			pi: '\u03C0',
  			pitchfork: '\u22D4',
  			piv: '\u03D6',
  			planck: '\u210F',
  			planckh: '\u210E',
  			plankv: '\u210F',
  			plus: '\u002B',
  			plusacir: '\u2A23',
  			plusb: '\u229E',
  			pluscir: '\u2A22',
  			plusdo: '\u2214',
  			plusdu: '\u2A25',
  			pluse: '\u2A72',
  			PlusMinus: '\u00B1',
  			plusmn: '\u00B1',
  			plussim: '\u2A26',
  			plustwo: '\u2A27',
  			pm: '\u00B1',
  			Poincareplane: '\u210C',
  			pointint: '\u2A15',
  			Popf: '\u2119',
  			popf: '\uD835\uDD61',
  			pound: '\u00A3',
  			Pr: '\u2ABB',
  			pr: '\u227A',
  			prap: '\u2AB7',
  			prcue: '\u227C',
  			prE: '\u2AB3',
  			pre: '\u2AAF',
  			prec: '\u227A',
  			precapprox: '\u2AB7',
  			preccurlyeq: '\u227C',
  			Precedes: '\u227A',
  			PrecedesEqual: '\u2AAF',
  			PrecedesSlantEqual: '\u227C',
  			PrecedesTilde: '\u227E',
  			preceq: '\u2AAF',
  			precnapprox: '\u2AB9',
  			precneqq: '\u2AB5',
  			precnsim: '\u22E8',
  			precsim: '\u227E',
  			Prime: '\u2033',
  			prime: '\u2032',
  			primes: '\u2119',
  			prnap: '\u2AB9',
  			prnE: '\u2AB5',
  			prnsim: '\u22E8',
  			prod: '\u220F',
  			Product: '\u220F',
  			profalar: '\u232E',
  			profline: '\u2312',
  			profsurf: '\u2313',
  			prop: '\u221D',
  			Proportion: '\u2237',
  			Proportional: '\u221D',
  			propto: '\u221D',
  			prsim: '\u227E',
  			prurel: '\u22B0',
  			Pscr: '\uD835\uDCAB',
  			pscr: '\uD835\uDCC5',
  			Psi: '\u03A8',
  			psi: '\u03C8',
  			puncsp: '\u2008',
  			Qfr: '\uD835\uDD14',
  			qfr: '\uD835\uDD2E',
  			qint: '\u2A0C',
  			Qopf: '\u211A',
  			qopf: '\uD835\uDD62',
  			qprime: '\u2057',
  			Qscr: '\uD835\uDCAC',
  			qscr: '\uD835\uDCC6',
  			quaternions: '\u210D',
  			quatint: '\u2A16',
  			quest: '\u003F',
  			questeq: '\u225F',
  			QUOT: '\u0022',
  			quot: '\u0022',
  			rAarr: '\u21DB',
  			race: '\u223D\u0331',
  			Racute: '\u0154',
  			racute: '\u0155',
  			radic: '\u221A',
  			raemptyv: '\u29B3',
  			Rang: '\u27EB',
  			rang: '\u27E9',
  			rangd: '\u2992',
  			range: '\u29A5',
  			rangle: '\u27E9',
  			raquo: '\u00BB',
  			Rarr: '\u21A0',
  			rArr: '\u21D2',
  			rarr: '\u2192',
  			rarrap: '\u2975',
  			rarrb: '\u21E5',
  			rarrbfs: '\u2920',
  			rarrc: '\u2933',
  			rarrfs: '\u291E',
  			rarrhk: '\u21AA',
  			rarrlp: '\u21AC',
  			rarrpl: '\u2945',
  			rarrsim: '\u2974',
  			Rarrtl: '\u2916',
  			rarrtl: '\u21A3',
  			rarrw: '\u219D',
  			rAtail: '\u291C',
  			ratail: '\u291A',
  			ratio: '\u2236',
  			rationals: '\u211A',
  			RBarr: '\u2910',
  			rBarr: '\u290F',
  			rbarr: '\u290D',
  			rbbrk: '\u2773',
  			rbrace: '\u007D',
  			rbrack: '\u005D',
  			rbrke: '\u298C',
  			rbrksld: '\u298E',
  			rbrkslu: '\u2990',
  			Rcaron: '\u0158',
  			rcaron: '\u0159',
  			Rcedil: '\u0156',
  			rcedil: '\u0157',
  			rceil: '\u2309',
  			rcub: '\u007D',
  			Rcy: '\u0420',
  			rcy: '\u0440',
  			rdca: '\u2937',
  			rdldhar: '\u2969',
  			rdquo: '\u201D',
  			rdquor: '\u201D',
  			rdsh: '\u21B3',
  			Re: '\u211C',
  			real: '\u211C',
  			realine: '\u211B',
  			realpart: '\u211C',
  			reals: '\u211D',
  			rect: '\u25AD',
  			REG: '\u00AE',
  			reg: '\u00AE',
  			ReverseElement: '\u220B',
  			ReverseEquilibrium: '\u21CB',
  			ReverseUpEquilibrium: '\u296F',
  			rfisht: '\u297D',
  			rfloor: '\u230B',
  			Rfr: '\u211C',
  			rfr: '\uD835\uDD2F',
  			rHar: '\u2964',
  			rhard: '\u21C1',
  			rharu: '\u21C0',
  			rharul: '\u296C',
  			Rho: '\u03A1',
  			rho: '\u03C1',
  			rhov: '\u03F1',
  			RightAngleBracket: '\u27E9',
  			RightArrow: '\u2192',
  			Rightarrow: '\u21D2',
  			rightarrow: '\u2192',
  			RightArrowBar: '\u21E5',
  			RightArrowLeftArrow: '\u21C4',
  			rightarrowtail: '\u21A3',
  			RightCeiling: '\u2309',
  			RightDoubleBracket: '\u27E7',
  			RightDownTeeVector: '\u295D',
  			RightDownVector: '\u21C2',
  			RightDownVectorBar: '\u2955',
  			RightFloor: '\u230B',
  			rightharpoondown: '\u21C1',
  			rightharpoonup: '\u21C0',
  			rightleftarrows: '\u21C4',
  			rightleftharpoons: '\u21CC',
  			rightrightarrows: '\u21C9',
  			rightsquigarrow: '\u219D',
  			RightTee: '\u22A2',
  			RightTeeArrow: '\u21A6',
  			RightTeeVector: '\u295B',
  			rightthreetimes: '\u22CC',
  			RightTriangle: '\u22B3',
  			RightTriangleBar: '\u29D0',
  			RightTriangleEqual: '\u22B5',
  			RightUpDownVector: '\u294F',
  			RightUpTeeVector: '\u295C',
  			RightUpVector: '\u21BE',
  			RightUpVectorBar: '\u2954',
  			RightVector: '\u21C0',
  			RightVectorBar: '\u2953',
  			ring: '\u02DA',
  			risingdotseq: '\u2253',
  			rlarr: '\u21C4',
  			rlhar: '\u21CC',
  			rlm: '\u200F',
  			rmoust: '\u23B1',
  			rmoustache: '\u23B1',
  			rnmid: '\u2AEE',
  			roang: '\u27ED',
  			roarr: '\u21FE',
  			robrk: '\u27E7',
  			ropar: '\u2986',
  			Ropf: '\u211D',
  			ropf: '\uD835\uDD63',
  			roplus: '\u2A2E',
  			rotimes: '\u2A35',
  			RoundImplies: '\u2970',
  			rpar: '\u0029',
  			rpargt: '\u2994',
  			rppolint: '\u2A12',
  			rrarr: '\u21C9',
  			Rrightarrow: '\u21DB',
  			rsaquo: '\u203A',
  			Rscr: '\u211B',
  			rscr: '\uD835\uDCC7',
  			Rsh: '\u21B1',
  			rsh: '\u21B1',
  			rsqb: '\u005D',
  			rsquo: '\u2019',
  			rsquor: '\u2019',
  			rthree: '\u22CC',
  			rtimes: '\u22CA',
  			rtri: '\u25B9',
  			rtrie: '\u22B5',
  			rtrif: '\u25B8',
  			rtriltri: '\u29CE',
  			RuleDelayed: '\u29F4',
  			ruluhar: '\u2968',
  			rx: '\u211E',
  			Sacute: '\u015A',
  			sacute: '\u015B',
  			sbquo: '\u201A',
  			Sc: '\u2ABC',
  			sc: '\u227B',
  			scap: '\u2AB8',
  			Scaron: '\u0160',
  			scaron: '\u0161',
  			sccue: '\u227D',
  			scE: '\u2AB4',
  			sce: '\u2AB0',
  			Scedil: '\u015E',
  			scedil: '\u015F',
  			Scirc: '\u015C',
  			scirc: '\u015D',
  			scnap: '\u2ABA',
  			scnE: '\u2AB6',
  			scnsim: '\u22E9',
  			scpolint: '\u2A13',
  			scsim: '\u227F',
  			Scy: '\u0421',
  			scy: '\u0441',
  			sdot: '\u22C5',
  			sdotb: '\u22A1',
  			sdote: '\u2A66',
  			searhk: '\u2925',
  			seArr: '\u21D8',
  			searr: '\u2198',
  			searrow: '\u2198',
  			sect: '\u00A7',
  			semi: '\u003B',
  			seswar: '\u2929',
  			setminus: '\u2216',
  			setmn: '\u2216',
  			sext: '\u2736',
  			Sfr: '\uD835\uDD16',
  			sfr: '\uD835\uDD30',
  			sfrown: '\u2322',
  			sharp: '\u266F',
  			SHCHcy: '\u0429',
  			shchcy: '\u0449',
  			SHcy: '\u0428',
  			shcy: '\u0448',
  			ShortDownArrow: '\u2193',
  			ShortLeftArrow: '\u2190',
  			shortmid: '\u2223',
  			shortparallel: '\u2225',
  			ShortRightArrow: '\u2192',
  			ShortUpArrow: '\u2191',
  			shy: '\u00AD',
  			Sigma: '\u03A3',
  			sigma: '\u03C3',
  			sigmaf: '\u03C2',
  			sigmav: '\u03C2',
  			sim: '\u223C',
  			simdot: '\u2A6A',
  			sime: '\u2243',
  			simeq: '\u2243',
  			simg: '\u2A9E',
  			simgE: '\u2AA0',
  			siml: '\u2A9D',
  			simlE: '\u2A9F',
  			simne: '\u2246',
  			simplus: '\u2A24',
  			simrarr: '\u2972',
  			slarr: '\u2190',
  			SmallCircle: '\u2218',
  			smallsetminus: '\u2216',
  			smashp: '\u2A33',
  			smeparsl: '\u29E4',
  			smid: '\u2223',
  			smile: '\u2323',
  			smt: '\u2AAA',
  			smte: '\u2AAC',
  			smtes: '\u2AAC\uFE00',
  			SOFTcy: '\u042C',
  			softcy: '\u044C',
  			sol: '\u002F',
  			solb: '\u29C4',
  			solbar: '\u233F',
  			Sopf: '\uD835\uDD4A',
  			sopf: '\uD835\uDD64',
  			spades: '\u2660',
  			spadesuit: '\u2660',
  			spar: '\u2225',
  			sqcap: '\u2293',
  			sqcaps: '\u2293\uFE00',
  			sqcup: '\u2294',
  			sqcups: '\u2294\uFE00',
  			Sqrt: '\u221A',
  			sqsub: '\u228F',
  			sqsube: '\u2291',
  			sqsubset: '\u228F',
  			sqsubseteq: '\u2291',
  			sqsup: '\u2290',
  			sqsupe: '\u2292',
  			sqsupset: '\u2290',
  			sqsupseteq: '\u2292',
  			squ: '\u25A1',
  			Square: '\u25A1',
  			square: '\u25A1',
  			SquareIntersection: '\u2293',
  			SquareSubset: '\u228F',
  			SquareSubsetEqual: '\u2291',
  			SquareSuperset: '\u2290',
  			SquareSupersetEqual: '\u2292',
  			SquareUnion: '\u2294',
  			squarf: '\u25AA',
  			squf: '\u25AA',
  			srarr: '\u2192',
  			Sscr: '\uD835\uDCAE',
  			sscr: '\uD835\uDCC8',
  			ssetmn: '\u2216',
  			ssmile: '\u2323',
  			sstarf: '\u22C6',
  			Star: '\u22C6',
  			star: '\u2606',
  			starf: '\u2605',
  			straightepsilon: '\u03F5',
  			straightphi: '\u03D5',
  			strns: '\u00AF',
  			Sub: '\u22D0',
  			sub: '\u2282',
  			subdot: '\u2ABD',
  			subE: '\u2AC5',
  			sube: '\u2286',
  			subedot: '\u2AC3',
  			submult: '\u2AC1',
  			subnE: '\u2ACB',
  			subne: '\u228A',
  			subplus: '\u2ABF',
  			subrarr: '\u2979',
  			Subset: '\u22D0',
  			subset: '\u2282',
  			subseteq: '\u2286',
  			subseteqq: '\u2AC5',
  			SubsetEqual: '\u2286',
  			subsetneq: '\u228A',
  			subsetneqq: '\u2ACB',
  			subsim: '\u2AC7',
  			subsub: '\u2AD5',
  			subsup: '\u2AD3',
  			succ: '\u227B',
  			succapprox: '\u2AB8',
  			succcurlyeq: '\u227D',
  			Succeeds: '\u227B',
  			SucceedsEqual: '\u2AB0',
  			SucceedsSlantEqual: '\u227D',
  			SucceedsTilde: '\u227F',
  			succeq: '\u2AB0',
  			succnapprox: '\u2ABA',
  			succneqq: '\u2AB6',
  			succnsim: '\u22E9',
  			succsim: '\u227F',
  			SuchThat: '\u220B',
  			Sum: '\u2211',
  			sum: '\u2211',
  			sung: '\u266A',
  			Sup: '\u22D1',
  			sup: '\u2283',
  			sup1: '\u00B9',
  			sup2: '\u00B2',
  			sup3: '\u00B3',
  			supdot: '\u2ABE',
  			supdsub: '\u2AD8',
  			supE: '\u2AC6',
  			supe: '\u2287',
  			supedot: '\u2AC4',
  			Superset: '\u2283',
  			SupersetEqual: '\u2287',
  			suphsol: '\u27C9',
  			suphsub: '\u2AD7',
  			suplarr: '\u297B',
  			supmult: '\u2AC2',
  			supnE: '\u2ACC',
  			supne: '\u228B',
  			supplus: '\u2AC0',
  			Supset: '\u22D1',
  			supset: '\u2283',
  			supseteq: '\u2287',
  			supseteqq: '\u2AC6',
  			supsetneq: '\u228B',
  			supsetneqq: '\u2ACC',
  			supsim: '\u2AC8',
  			supsub: '\u2AD4',
  			supsup: '\u2AD6',
  			swarhk: '\u2926',
  			swArr: '\u21D9',
  			swarr: '\u2199',
  			swarrow: '\u2199',
  			swnwar: '\u292A',
  			szlig: '\u00DF',
  			Tab: '\u0009',
  			target: '\u2316',
  			Tau: '\u03A4',
  			tau: '\u03C4',
  			tbrk: '\u23B4',
  			Tcaron: '\u0164',
  			tcaron: '\u0165',
  			Tcedil: '\u0162',
  			tcedil: '\u0163',
  			Tcy: '\u0422',
  			tcy: '\u0442',
  			tdot: '\u20DB',
  			telrec: '\u2315',
  			Tfr: '\uD835\uDD17',
  			tfr: '\uD835\uDD31',
  			there4: '\u2234',
  			Therefore: '\u2234',
  			therefore: '\u2234',
  			Theta: '\u0398',
  			theta: '\u03B8',
  			thetasym: '\u03D1',
  			thetav: '\u03D1',
  			thickapprox: '\u2248',
  			thicksim: '\u223C',
  			ThickSpace: '\u205F\u200A',
  			thinsp: '\u2009',
  			ThinSpace: '\u2009',
  			thkap: '\u2248',
  			thksim: '\u223C',
  			THORN: '\u00DE',
  			thorn: '\u00FE',
  			Tilde: '\u223C',
  			tilde: '\u02DC',
  			TildeEqual: '\u2243',
  			TildeFullEqual: '\u2245',
  			TildeTilde: '\u2248',
  			times: '\u00D7',
  			timesb: '\u22A0',
  			timesbar: '\u2A31',
  			timesd: '\u2A30',
  			tint: '\u222D',
  			toea: '\u2928',
  			top: '\u22A4',
  			topbot: '\u2336',
  			topcir: '\u2AF1',
  			Topf: '\uD835\uDD4B',
  			topf: '\uD835\uDD65',
  			topfork: '\u2ADA',
  			tosa: '\u2929',
  			tprime: '\u2034',
  			TRADE: '\u2122',
  			trade: '\u2122',
  			triangle: '\u25B5',
  			triangledown: '\u25BF',
  			triangleleft: '\u25C3',
  			trianglelefteq: '\u22B4',
  			triangleq: '\u225C',
  			triangleright: '\u25B9',
  			trianglerighteq: '\u22B5',
  			tridot: '\u25EC',
  			trie: '\u225C',
  			triminus: '\u2A3A',
  			TripleDot: '\u20DB',
  			triplus: '\u2A39',
  			trisb: '\u29CD',
  			tritime: '\u2A3B',
  			trpezium: '\u23E2',
  			Tscr: '\uD835\uDCAF',
  			tscr: '\uD835\uDCC9',
  			TScy: '\u0426',
  			tscy: '\u0446',
  			TSHcy: '\u040B',
  			tshcy: '\u045B',
  			Tstrok: '\u0166',
  			tstrok: '\u0167',
  			twixt: '\u226C',
  			twoheadleftarrow: '\u219E',
  			twoheadrightarrow: '\u21A0',
  			Uacute: '\u00DA',
  			uacute: '\u00FA',
  			Uarr: '\u219F',
  			uArr: '\u21D1',
  			uarr: '\u2191',
  			Uarrocir: '\u2949',
  			Ubrcy: '\u040E',
  			ubrcy: '\u045E',
  			Ubreve: '\u016C',
  			ubreve: '\u016D',
  			Ucirc: '\u00DB',
  			ucirc: '\u00FB',
  			Ucy: '\u0423',
  			ucy: '\u0443',
  			udarr: '\u21C5',
  			Udblac: '\u0170',
  			udblac: '\u0171',
  			udhar: '\u296E',
  			ufisht: '\u297E',
  			Ufr: '\uD835\uDD18',
  			ufr: '\uD835\uDD32',
  			Ugrave: '\u00D9',
  			ugrave: '\u00F9',
  			uHar: '\u2963',
  			uharl: '\u21BF',
  			uharr: '\u21BE',
  			uhblk: '\u2580',
  			ulcorn: '\u231C',
  			ulcorner: '\u231C',
  			ulcrop: '\u230F',
  			ultri: '\u25F8',
  			Umacr: '\u016A',
  			umacr: '\u016B',
  			uml: '\u00A8',
  			UnderBar: '\u005F',
  			UnderBrace: '\u23DF',
  			UnderBracket: '\u23B5',
  			UnderParenthesis: '\u23DD',
  			Union: '\u22C3',
  			UnionPlus: '\u228E',
  			Uogon: '\u0172',
  			uogon: '\u0173',
  			Uopf: '\uD835\uDD4C',
  			uopf: '\uD835\uDD66',
  			UpArrow: '\u2191',
  			Uparrow: '\u21D1',
  			uparrow: '\u2191',
  			UpArrowBar: '\u2912',
  			UpArrowDownArrow: '\u21C5',
  			UpDownArrow: '\u2195',
  			Updownarrow: '\u21D5',
  			updownarrow: '\u2195',
  			UpEquilibrium: '\u296E',
  			upharpoonleft: '\u21BF',
  			upharpoonright: '\u21BE',
  			uplus: '\u228E',
  			UpperLeftArrow: '\u2196',
  			UpperRightArrow: '\u2197',
  			Upsi: '\u03D2',
  			upsi: '\u03C5',
  			upsih: '\u03D2',
  			Upsilon: '\u03A5',
  			upsilon: '\u03C5',
  			UpTee: '\u22A5',
  			UpTeeArrow: '\u21A5',
  			upuparrows: '\u21C8',
  			urcorn: '\u231D',
  			urcorner: '\u231D',
  			urcrop: '\u230E',
  			Uring: '\u016E',
  			uring: '\u016F',
  			urtri: '\u25F9',
  			Uscr: '\uD835\uDCB0',
  			uscr: '\uD835\uDCCA',
  			utdot: '\u22F0',
  			Utilde: '\u0168',
  			utilde: '\u0169',
  			utri: '\u25B5',
  			utrif: '\u25B4',
  			uuarr: '\u21C8',
  			Uuml: '\u00DC',
  			uuml: '\u00FC',
  			uwangle: '\u29A7',
  			vangrt: '\u299C',
  			varepsilon: '\u03F5',
  			varkappa: '\u03F0',
  			varnothing: '\u2205',
  			varphi: '\u03D5',
  			varpi: '\u03D6',
  			varpropto: '\u221D',
  			vArr: '\u21D5',
  			varr: '\u2195',
  			varrho: '\u03F1',
  			varsigma: '\u03C2',
  			varsubsetneq: '\u228A\uFE00',
  			varsubsetneqq: '\u2ACB\uFE00',
  			varsupsetneq: '\u228B\uFE00',
  			varsupsetneqq: '\u2ACC\uFE00',
  			vartheta: '\u03D1',
  			vartriangleleft: '\u22B2',
  			vartriangleright: '\u22B3',
  			Vbar: '\u2AEB',
  			vBar: '\u2AE8',
  			vBarv: '\u2AE9',
  			Vcy: '\u0412',
  			vcy: '\u0432',
  			VDash: '\u22AB',
  			Vdash: '\u22A9',
  			vDash: '\u22A8',
  			vdash: '\u22A2',
  			Vdashl: '\u2AE6',
  			Vee: '\u22C1',
  			vee: '\u2228',
  			veebar: '\u22BB',
  			veeeq: '\u225A',
  			vellip: '\u22EE',
  			Verbar: '\u2016',
  			verbar: '\u007C',
  			Vert: '\u2016',
  			vert: '\u007C',
  			VerticalBar: '\u2223',
  			VerticalLine: '\u007C',
  			VerticalSeparator: '\u2758',
  			VerticalTilde: '\u2240',
  			VeryThinSpace: '\u200A',
  			Vfr: '\uD835\uDD19',
  			vfr: '\uD835\uDD33',
  			vltri: '\u22B2',
  			vnsub: '\u2282\u20D2',
  			vnsup: '\u2283\u20D2',
  			Vopf: '\uD835\uDD4D',
  			vopf: '\uD835\uDD67',
  			vprop: '\u221D',
  			vrtri: '\u22B3',
  			Vscr: '\uD835\uDCB1',
  			vscr: '\uD835\uDCCB',
  			vsubnE: '\u2ACB\uFE00',
  			vsubne: '\u228A\uFE00',
  			vsupnE: '\u2ACC\uFE00',
  			vsupne: '\u228B\uFE00',
  			Vvdash: '\u22AA',
  			vzigzag: '\u299A',
  			Wcirc: '\u0174',
  			wcirc: '\u0175',
  			wedbar: '\u2A5F',
  			Wedge: '\u22C0',
  			wedge: '\u2227',
  			wedgeq: '\u2259',
  			weierp: '\u2118',
  			Wfr: '\uD835\uDD1A',
  			wfr: '\uD835\uDD34',
  			Wopf: '\uD835\uDD4E',
  			wopf: '\uD835\uDD68',
  			wp: '\u2118',
  			wr: '\u2240',
  			wreath: '\u2240',
  			Wscr: '\uD835\uDCB2',
  			wscr: '\uD835\uDCCC',
  			xcap: '\u22C2',
  			xcirc: '\u25EF',
  			xcup: '\u22C3',
  			xdtri: '\u25BD',
  			Xfr: '\uD835\uDD1B',
  			xfr: '\uD835\uDD35',
  			xhArr: '\u27FA',
  			xharr: '\u27F7',
  			Xi: '\u039E',
  			xi: '\u03BE',
  			xlArr: '\u27F8',
  			xlarr: '\u27F5',
  			xmap: '\u27FC',
  			xnis: '\u22FB',
  			xodot: '\u2A00',
  			Xopf: '\uD835\uDD4F',
  			xopf: '\uD835\uDD69',
  			xoplus: '\u2A01',
  			xotime: '\u2A02',
  			xrArr: '\u27F9',
  			xrarr: '\u27F6',
  			Xscr: '\uD835\uDCB3',
  			xscr: '\uD835\uDCCD',
  			xsqcup: '\u2A06',
  			xuplus: '\u2A04',
  			xutri: '\u25B3',
  			xvee: '\u22C1',
  			xwedge: '\u22C0',
  			Yacute: '\u00DD',
  			yacute: '\u00FD',
  			YAcy: '\u042F',
  			yacy: '\u044F',
  			Ycirc: '\u0176',
  			ycirc: '\u0177',
  			Ycy: '\u042B',
  			ycy: '\u044B',
  			yen: '\u00A5',
  			Yfr: '\uD835\uDD1C',
  			yfr: '\uD835\uDD36',
  			YIcy: '\u0407',
  			yicy: '\u0457',
  			Yopf: '\uD835\uDD50',
  			yopf: '\uD835\uDD6A',
  			Yscr: '\uD835\uDCB4',
  			yscr: '\uD835\uDCCE',
  			YUcy: '\u042E',
  			yucy: '\u044E',
  			Yuml: '\u0178',
  			yuml: '\u00FF',
  			Zacute: '\u0179',
  			zacute: '\u017A',
  			Zcaron: '\u017D',
  			zcaron: '\u017E',
  			Zcy: '\u0417',
  			zcy: '\u0437',
  			Zdot: '\u017B',
  			zdot: '\u017C',
  			zeetrf: '\u2128',
  			ZeroWidthSpace: '\u200B',
  			Zeta: '\u0396',
  			zeta: '\u03B6',
  			Zfr: '\u2128',
  			zfr: '\uD835\uDD37',
  			ZHcy: '\u0416',
  			zhcy: '\u0436',
  			zigrarr: '\u21DD',
  			Zopf: '\u2124',
  			zopf: '\uD835\uDD6B',
  			Zscr: '\uD835\uDCB5',
  			zscr: '\uD835\uDCCF',
  			zwj: '\u200D',
  			zwnj: '\u200C',
  		});

  		/**
  		 * @deprecated use `HTML_ENTITIES` instead
  		 * @see HTML_ENTITIES
  		 */
  		exports.entityMap = exports.HTML_ENTITIES; 
  	} (entities));
  	return entities;
  }

  var sax = {};

  var hasRequiredSax;

  function requireSax () {
  	if (hasRequiredSax) return sax;
  	hasRequiredSax = 1;
  	var NAMESPACE = requireConventions().NAMESPACE;

  	//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
  	//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
  	//[5]   	Name	   ::=   	NameStartChar (NameChar)*
  	var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;//\u10000-\uEFFFF
  	var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
  	var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
  	//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
  	//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

  	//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
  	//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
  	var S_TAG = 0;//tag name offerring
  	var S_ATTR = 1;//attr name offerring
  	var S_ATTR_SPACE=2;//attr name end and space offer
  	var S_EQ = 3;//=space?
  	var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
  	var S_ATTR_END = 5;//attr value end and no space(quot end)
  	var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
  	var S_TAG_CLOSE = 7;//closed el<el />

  	/**
  	 * Creates an error that will not be caught by XMLReader aka the SAX parser.
  	 *
  	 * @param {string} message
  	 * @param {any?} locator Optional, can provide details about the location in the source
  	 * @constructor
  	 */
  	function ParseError(message, locator) {
  		this.message = message;
  		this.locator = locator;
  		if(Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
  	}
  	ParseError.prototype = new Error();
  	ParseError.prototype.name = ParseError.name;

  	function XMLReader(){

  	}

  	XMLReader.prototype = {
  		parse:function(source,defaultNSMap,entityMap){
  			var domBuilder = this.domBuilder;
  			domBuilder.startDocument();
  			_copy(defaultNSMap ,defaultNSMap = {});
  			parse(source,defaultNSMap,entityMap,
  					domBuilder,this.errorHandler);
  			domBuilder.endDocument();
  		}
  	};
  	function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
  		function fixedFromCharCode(code) {
  			// String.prototype.fromCharCode does not supports
  			// > 2 bytes unicode chars directly
  			if (code > 0xffff) {
  				code -= 0x10000;
  				var surrogate1 = 0xd800 + (code >> 10)
  					, surrogate2 = 0xdc00 + (code & 0x3ff);

  				return String.fromCharCode(surrogate1, surrogate2);
  			} else {
  				return String.fromCharCode(code);
  			}
  		}
  		function entityReplacer(a){
  			var k = a.slice(1,-1);
  			if (Object.hasOwnProperty.call(entityMap, k)) {
  				return entityMap[k];
  			}else if(k.charAt(0) === '#'){
  				return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
  			}else {
  				errorHandler.error('entity not found:'+a);
  				return a;
  			}
  		}
  		function appendText(end){//has some bugs
  			if(end>start){
  				var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
  				locator&&position(start);
  				domBuilder.characters(xt,0,end-start);
  				start = end;
  			}
  		}
  		function position(p,m){
  			while(p>=lineEnd && (m = linePattern.exec(source))){
  				lineStart = m.index;
  				lineEnd = lineStart + m[0].length;
  				locator.lineNumber++;
  				//console.log('line++:',locator,startPos,endPos)
  			}
  			locator.columnNumber = p-lineStart+1;
  		}
  		var lineStart = 0;
  		var lineEnd = 0;
  		var linePattern = /.*(?:\r\n?|\n)|.*$/g;
  		var locator = domBuilder.locator;

  		var parseStack = [{currentNSMap:defaultNSMapCopy}];
  		var closeMap = {};
  		var start = 0;
  		while(true){
  			try{
  				var tagStart = source.indexOf('<',start);
  				if(tagStart<0){
  					if(!source.substr(start).match(/^\s*$/)){
  						var doc = domBuilder.doc;
  		    			var text = doc.createTextNode(source.substr(start));
  		    			doc.appendChild(text);
  		    			domBuilder.currentElement = text;
  					}
  					return;
  				}
  				if(tagStart>start){
  					appendText(tagStart);
  				}
  				switch(source.charAt(tagStart+1)){
  				case '/':
  					var end = source.indexOf('>',tagStart+3);
  					var tagName = source.substring(tagStart + 2, end).replace(/[ \t\n\r]+$/g, '');
  					var config = parseStack.pop();
  					if(end<0){

  		        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
  		        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
  		        		end = tagStart+1+tagName.length;
  		        	}else if(tagName.match(/\s</)){
  		        		tagName = tagName.replace(/[\s<].*/,'');
  		        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
  		        		end = tagStart+1+tagName.length;
  					}
  					var localNSMap = config.localNSMap;
  					var endMatch = config.tagName == tagName;
  					var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase();
  			        if(endIgnoreCaseMach){
  			        	domBuilder.endElement(config.uri,config.localName,tagName);
  						if(localNSMap){
  							for (var prefix in localNSMap) {
  								if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
  									domBuilder.endPrefixMapping(prefix);
  								}
  							}
  						}
  						if(!endMatch){
  			            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName ); // No known test case
  						}
  			        }else {
  			        	parseStack.push(config);
  			        }

  					end++;
  					break;
  					// end elment
  				case '?':// <?...?>
  					locator&&position(tagStart);
  					end = parseInstruction(source,tagStart,domBuilder);
  					break;
  				case '!':// <!doctype,<![CDATA,<!--
  					locator&&position(tagStart);
  					end = parseDCC(source,tagStart,domBuilder,errorHandler);
  					break;
  				default:
  					locator&&position(tagStart);
  					var el = new ElementAttributes();
  					var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
  					//elStartEnd
  					var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
  					var len = el.length;


  					if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
  						el.closed = true;
  						if(!entityMap.nbsp){
  							errorHandler.warning('unclosed xml attribute');
  						}
  					}
  					if(locator && len){
  						var locator2 = copyLocator(locator,{});
  						//try{//attribute position fixed
  						for(var i = 0;i<len;i++){
  							var a = el[i];
  							position(a.offset);
  							a.locator = copyLocator(locator,{});
  						}
  						domBuilder.locator = locator2;
  						if(appendElement(el,domBuilder,currentNSMap)){
  							parseStack.push(el);
  						}
  						domBuilder.locator = locator;
  					}else {
  						if(appendElement(el,domBuilder,currentNSMap)){
  							parseStack.push(el);
  						}
  					}

  					if (NAMESPACE.isHTML(el.uri) && !el.closed) {
  						end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder);
  					} else {
  						end++;
  					}
  				}
  			}catch(e){
  				if (e instanceof ParseError) {
  					throw e;
  				}
  				errorHandler.error('element parse error: '+e);
  				end = -1;
  			}
  			if(end>start){
  				start = end;
  			}else {
  				//TODO: 这里有可能sax回退，有位置错误风险
  				appendText(Math.max(tagStart,start)+1);
  			}
  		}
  	}
  	function copyLocator(f,t){
  		t.lineNumber = f.lineNumber;
  		t.columnNumber = f.columnNumber;
  		return t;
  	}

  	/**
  	 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
  	 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
  	 */
  	function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){

  		/**
  		 * @param {string} qname
  		 * @param {string} value
  		 * @param {number} startIndex
  		 */
  		function addAttribute(qname, value, startIndex) {
  			if (el.attributeNames.hasOwnProperty(qname)) {
  				errorHandler.fatalError('Attribute ' + qname + ' redefined');
  			}
  			el.addValue(
  				qname,
  				// @see https://www.w3.org/TR/xml/#AVNormalize
  				// since the xmldom sax parser does not "interpret" DTD the following is not implemented:
  				// - recursive replacement of (DTD) entity references
  				// - trimming and collapsing multiple spaces into a single one for attributes that are not of type CDATA
  				value.replace(/[\t\n\r]/g, ' ').replace(/&#?\w+;/g, entityReplacer),
  				startIndex
  			);
  		}
  		var attrName;
  		var value;
  		var p = ++start;
  		var s = S_TAG;//status
  		while(true){
  			var c = source.charAt(p);
  			switch(c){
  			case '=':
  				if(s === S_ATTR){//attrName
  					attrName = source.slice(start,p);
  					s = S_EQ;
  				}else if(s === S_ATTR_SPACE){
  					s = S_EQ;
  				}else {
  					//fatalError: equal must after attrName or space after attrName
  					throw new Error('attribute equal must after attrName'); // No known test case
  				}
  				break;
  			case '\'':
  			case '"':
  				if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
  					){//equal
  					if(s === S_ATTR){
  						errorHandler.warning('attribute value must after "="');
  						attrName = source.slice(start,p);
  					}
  					start = p+1;
  					p = source.indexOf(c,start);
  					if(p>0){
  						value = source.slice(start, p);
  						addAttribute(attrName, value, start-1);
  						s = S_ATTR_END;
  					}else {
  						//fatalError: no end quot match
  						throw new Error('attribute value no end \''+c+'\' match');
  					}
  				}else if(s == S_ATTR_NOQUOT_VALUE){
  					value = source.slice(start, p);
  					addAttribute(attrName, value, start);
  					errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
  					start = p+1;
  					s = S_ATTR_END;
  				}else {
  					//fatalError: no equal before
  					throw new Error('attribute value must after "="'); // No known test case
  				}
  				break;
  			case '/':
  				switch(s){
  				case S_TAG:
  					el.setTagName(source.slice(start,p));
  				case S_ATTR_END:
  				case S_TAG_SPACE:
  				case S_TAG_CLOSE:
  					s =S_TAG_CLOSE;
  					el.closed = true;
  				case S_ATTR_NOQUOT_VALUE:
  				case S_ATTR:
  					break;
  					case S_ATTR_SPACE:
  						el.closed = true;
  					break;
  				//case S_EQ:
  				default:
  					throw new Error("attribute invalid close char('/')") // No known test case
  				}
  				break;
  			case ''://end document
  				errorHandler.error('unexpected end of input');
  				if(s == S_TAG){
  					el.setTagName(source.slice(start,p));
  				}
  				return p;
  			case '>':
  				switch(s){
  				case S_TAG:
  					el.setTagName(source.slice(start,p));
  				case S_ATTR_END:
  				case S_TAG_SPACE:
  				case S_TAG_CLOSE:
  					break;//normal
  				case S_ATTR_NOQUOT_VALUE://Compatible state
  				case S_ATTR:
  					value = source.slice(start,p);
  					if(value.slice(-1) === '/'){
  						el.closed  = true;
  						value = value.slice(0,-1);
  					}
  				case S_ATTR_SPACE:
  					if(s === S_ATTR_SPACE){
  						value = attrName;
  					}
  					if(s == S_ATTR_NOQUOT_VALUE){
  						errorHandler.warning('attribute "'+value+'" missed quot(")!');
  						addAttribute(attrName, value, start);
  					}else {
  						if(!NAMESPACE.isHTML(currentNSMap['']) || !value.match(/^(?:disabled|checked|selected)$/i)){
  							errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!');
  						}
  						addAttribute(value, value, start);
  					}
  					break;
  				case S_EQ:
  					throw new Error('attribute value missed!!');
  				}
  	//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
  				return p;
  			/*xml space '\x20' | #x9 | #xD | #xA; */
  			case '\u0080':
  				c = ' ';
  			default:
  				if(c<= ' '){//space
  					switch(s){
  					case S_TAG:
  						el.setTagName(source.slice(start,p));//tagName
  						s = S_TAG_SPACE;
  						break;
  					case S_ATTR:
  						attrName = source.slice(start,p);
  						s = S_ATTR_SPACE;
  						break;
  					case S_ATTR_NOQUOT_VALUE:
  						var value = source.slice(start, p);
  						errorHandler.warning('attribute "'+value+'" missed quot(")!!');
  						addAttribute(attrName, value, start);
  					case S_ATTR_END:
  						s = S_TAG_SPACE;
  						break;
  					//case S_TAG_SPACE:
  					//case S_EQ:
  					//case S_ATTR_SPACE:
  					//	void();break;
  					//case S_TAG_CLOSE:
  						//ignore warning
  					}
  				}else {//not space
  	//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
  	//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
  					switch(s){
  					//case S_TAG:void();break;
  					//case S_ATTR:void();break;
  					//case S_ATTR_NOQUOT_VALUE:void();break;
  					case S_ATTR_SPACE:
  						el.tagName;
  						if (!NAMESPACE.isHTML(currentNSMap['']) || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
  							errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!');
  						}
  						addAttribute(attrName, attrName, start);
  						start = p;
  						s = S_ATTR;
  						break;
  					case S_ATTR_END:
  						errorHandler.warning('attribute space is required"'+attrName+'"!!');
  					case S_TAG_SPACE:
  						s = S_ATTR;
  						start = p;
  						break;
  					case S_EQ:
  						s = S_ATTR_NOQUOT_VALUE;
  						start = p;
  						break;
  					case S_TAG_CLOSE:
  						throw new Error("elements closed character '/' and '>' must be connected to");
  					}
  				}
  			}//end outer switch
  			//console.log('p++',p)
  			p++;
  		}
  	}
  	/**
  	 * @return true if has new namespace define
  	 */
  	function appendElement(el,domBuilder,currentNSMap){
  		var tagName = el.tagName;
  		var localNSMap = null;
  		//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
  		var i = el.length;
  		while(i--){
  			var a = el[i];
  			var qName = a.qName;
  			var value = a.value;
  			var nsp = qName.indexOf(':');
  			if(nsp>0){
  				var prefix = a.prefix = qName.slice(0,nsp);
  				var localName = qName.slice(nsp+1);
  				var nsPrefix = prefix === 'xmlns' && localName;
  			}else {
  				localName = qName;
  				prefix = null;
  				nsPrefix = qName === 'xmlns' && '';
  			}
  			//can not set prefix,because prefix !== ''
  			a.localName = localName ;
  			//prefix == null for no ns prefix attribute
  			if(nsPrefix !== false){//hack!!
  				if(localNSMap == null){
  					localNSMap = {};
  					//console.log(currentNSMap,0)
  					_copy(currentNSMap,currentNSMap={});
  					//console.log(currentNSMap,1)
  				}
  				currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
  				a.uri = NAMESPACE.XMLNS;
  				domBuilder.startPrefixMapping(nsPrefix, value);
  			}
  		}
  		var i = el.length;
  		while(i--){
  			a = el[i];
  			var prefix = a.prefix;
  			if(prefix){//no prefix attribute has no namespace
  				if(prefix === 'xml'){
  					a.uri = NAMESPACE.XML;
  				}if(prefix !== 'xmlns'){
  					a.uri = currentNSMap[prefix || ''];

  					//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
  				}
  			}
  		}
  		var nsp = tagName.indexOf(':');
  		if(nsp>0){
  			prefix = el.prefix = tagName.slice(0,nsp);
  			localName = el.localName = tagName.slice(nsp+1);
  		}else {
  			prefix = null;//important!!
  			localName = el.localName = tagName;
  		}
  		//no prefix element has default namespace
  		var ns = el.uri = currentNSMap[prefix || ''];
  		domBuilder.startElement(ns,localName,tagName,el);
  		//endPrefixMapping and startPrefixMapping have not any help for dom builder
  		//localNSMap = null
  		if(el.closed){
  			domBuilder.endElement(ns,localName,tagName);
  			if(localNSMap){
  				for (prefix in localNSMap) {
  					if (Object.prototype.hasOwnProperty.call(localNSMap, prefix)) {
  						domBuilder.endPrefixMapping(prefix);
  					}
  				}
  			}
  		}else {
  			el.currentNSMap = currentNSMap;
  			el.localNSMap = localNSMap;
  			//parseStack.push(el);
  			return true;
  		}
  	}
  	function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
  		if(/^(?:script|textarea)$/i.test(tagName)){
  			var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
  			var text = source.substring(elStartEnd+1,elEndStart);
  			if(/[&<]/.test(text)){
  				if(/^script$/i.test(tagName)){
  					//if(!/\]\]>/.test(text)){
  						//lexHandler.startCDATA();
  						domBuilder.characters(text,0,text.length);
  						//lexHandler.endCDATA();
  						return elEndStart;
  					//}
  				}//}else{//text area
  					text = text.replace(/&#?\w+;/g,entityReplacer);
  					domBuilder.characters(text,0,text.length);
  					return elEndStart;
  				//}

  			}
  		}
  		return elStartEnd+1;
  	}
  	function fixSelfClosed(source,elStartEnd,tagName,closeMap){
  		//if(tagName in closeMap){
  		var pos = closeMap[tagName];
  		if(pos == null){
  			//console.log(tagName)
  			pos =  source.lastIndexOf('</'+tagName+'>');
  			if(pos<elStartEnd){//忘记闭合
  				pos = source.lastIndexOf('</'+tagName);
  			}
  			closeMap[tagName] =pos;
  		}
  		return pos<elStartEnd;
  		//}
  	}

  	function _copy (source, target) {
  		for (var n in source) {
  			if (Object.prototype.hasOwnProperty.call(source, n)) {
  				target[n] = source[n];
  			}
  		}
  	}

  	function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
  		var next= source.charAt(start+2);
  		switch(next){
  		case '-':
  			if(source.charAt(start + 3) === '-'){
  				var end = source.indexOf('-->',start+4);
  				//append comment source.substring(4,end)//<!--
  				if(end>start){
  					domBuilder.comment(source,start+4,end-start-4);
  					return end+3;
  				}else {
  					errorHandler.error("Unclosed comment");
  					return -1;
  				}
  			}else {
  				//error
  				return -1;
  			}
  		default:
  			if(source.substr(start+3,6) == 'CDATA['){
  				var end = source.indexOf(']]>',start+9);
  				domBuilder.startCDATA();
  				domBuilder.characters(source,start+9,end-start-9);
  				domBuilder.endCDATA();
  				return end+3;
  			}
  			//<!DOCTYPE
  			//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId)
  			var matchs = split(source,start);
  			var len = matchs.length;
  			if(len>1 && /!doctype/i.test(matchs[0][0])){
  				var name = matchs[1][0];
  				var pubid = false;
  				var sysid = false;
  				if(len>3){
  					if(/^public$/i.test(matchs[2][0])){
  						pubid = matchs[3][0];
  						sysid = len>4 && matchs[4][0];
  					}else if(/^system$/i.test(matchs[2][0])){
  						sysid = matchs[3][0];
  					}
  				}
  				var lastMatch = matchs[len-1];
  				domBuilder.startDTD(name, pubid, sysid);
  				domBuilder.endDTD();

  				return lastMatch.index+lastMatch[0].length
  			}
  		}
  		return -1;
  	}



  	function parseInstruction(source,start,domBuilder){
  		var end = source.indexOf('?>',start);
  		if(end){
  			var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
  			if(match){
  				match[0].length;
  				domBuilder.processingInstruction(match[1], match[2]) ;
  				return end+2;
  			}else {//error
  				return -1;
  			}
  		}
  		return -1;
  	}

  	function ElementAttributes(){
  		this.attributeNames = {};
  	}
  	ElementAttributes.prototype = {
  		setTagName:function(tagName){
  			if(!tagNamePattern.test(tagName)){
  				throw new Error('invalid tagName:'+tagName)
  			}
  			this.tagName = tagName;
  		},
  		addValue:function(qName, value, offset) {
  			if(!tagNamePattern.test(qName)){
  				throw new Error('invalid attribute:'+qName)
  			}
  			this.attributeNames[qName] = this.length;
  			this[this.length++] = {qName:qName,value:value,offset:offset};
  		},
  		length:0,
  		getLocalName:function(i){return this[i].localName},
  		getLocator:function(i){return this[i].locator},
  		getQName:function(i){return this[i].qName},
  		getURI:function(i){return this[i].uri},
  		getValue:function(i){return this[i].value}
  	//	,getIndex:function(uri, localName)){
  	//		if(localName){
  	//
  	//		}else{
  	//			var qName = uri
  	//		}
  	//	},
  	//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
  	//	getType:function(uri,localName){}
  	//	getType:function(i){},
  	};



  	function split(source,start){
  		var match;
  		var buf = [];
  		var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
  		reg.lastIndex = start;
  		reg.exec(source);//skip <
  		while(match = reg.exec(source)){
  			buf.push(match);
  			if(match[1])return buf;
  		}
  	}

  	sax.XMLReader = XMLReader;
  	sax.ParseError = ParseError;
  	return sax;
  }

  var hasRequiredDomParser;

  function requireDomParser () {
  	if (hasRequiredDomParser) return domParser;
  	hasRequiredDomParser = 1;
  	var conventions = requireConventions();
  	var dom = requireDom();
  	var entities = requireEntities();
  	var sax = requireSax();

  	var DOMImplementation = dom.DOMImplementation;

  	var NAMESPACE = conventions.NAMESPACE;

  	var ParseError = sax.ParseError;
  	var XMLReader = sax.XMLReader;

  	/**
  	 * Normalizes line ending according to https://www.w3.org/TR/xml11/#sec-line-ends:
  	 *
  	 * > XML parsed entities are often stored in computer files which,
  	 * > for editing convenience, are organized into lines.
  	 * > These lines are typically separated by some combination
  	 * > of the characters CARRIAGE RETURN (#xD) and LINE FEED (#xA).
  	 * >
  	 * > To simplify the tasks of applications, the XML processor must behave
  	 * > as if it normalized all line breaks in external parsed entities (including the document entity)
  	 * > on input, before parsing, by translating all of the following to a single #xA character:
  	 * >
  	 * > 1. the two-character sequence #xD #xA
  	 * > 2. the two-character sequence #xD #x85
  	 * > 3. the single character #x85
  	 * > 4. the single character #x2028
  	 * > 5. any #xD character that is not immediately followed by #xA or #x85.
  	 *
  	 * @param {string} input
  	 * @returns {string}
  	 */
  	function normalizeLineEndings(input) {
  		return input
  			.replace(/\r[\n\u0085]/g, '\n')
  			.replace(/[\r\u0085\u2028]/g, '\n')
  	}

  	/**
  	 * @typedef Locator
  	 * @property {number} [columnNumber]
  	 * @property {number} [lineNumber]
  	 */

  	/**
  	 * @typedef DOMParserOptions
  	 * @property {DOMHandler} [domBuilder]
  	 * @property {Function} [errorHandler]
  	 * @property {(string) => string} [normalizeLineEndings] used to replace line endings before parsing
  	 * 						defaults to `normalizeLineEndings`
  	 * @property {Locator} [locator]
  	 * @property {Record<string, string>} [xmlns]
  	 *
  	 * @see normalizeLineEndings
  	 */

  	/**
  	 * The DOMParser interface provides the ability to parse XML or HTML source code
  	 * from a string into a DOM `Document`.
  	 *
  	 * _xmldom is different from the spec in that it allows an `options` parameter,
  	 * to override the default behavior._
  	 *
  	 * @param {DOMParserOptions} [options]
  	 * @constructor
  	 *
  	 * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
  	 * @see https://html.spec.whatwg.org/multipage/dynamic-markup-insertion.html#dom-parsing-and-serialization
  	 */
  	function DOMParser(options){
  		this.options = options ||{locator:{}};
  	}

  	DOMParser.prototype.parseFromString = function(source,mimeType){
  		var options = this.options;
  		var sax =  new XMLReader();
  		var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
  		var errorHandler = options.errorHandler;
  		var locator = options.locator;
  		var defaultNSMap = options.xmlns||{};
  		var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	  	var entityMap = isHTML ? entities.HTML_ENTITIES : entities.XML_ENTITIES;
  		if(locator){
  			domBuilder.setDocumentLocator(locator);
  		}

  		sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
  		sax.domBuilder = options.domBuilder || domBuilder;
  		if(isHTML){
  			defaultNSMap[''] = NAMESPACE.HTML;
  		}
  		defaultNSMap.xml = defaultNSMap.xml || NAMESPACE.XML;
  		var normalize = options.normalizeLineEndings || normalizeLineEndings;
  		if (source && typeof source === 'string') {
  			sax.parse(
  				normalize(source),
  				defaultNSMap,
  				entityMap
  			);
  		} else {
  			sax.errorHandler.error('invalid doc source');
  		}
  		return domBuilder.doc;
  	};
  	function buildErrorHandler(errorImpl,domBuilder,locator){
  		if(!errorImpl){
  			if(domBuilder instanceof DOMHandler){
  				return domBuilder;
  			}
  			errorImpl = domBuilder ;
  		}
  		var errorHandler = {};
  		var isCallback = errorImpl instanceof Function;
  		locator = locator||{};
  		function build(key){
  			var fn = errorImpl[key];
  			if(!fn && isCallback){
  				fn = errorImpl.length == 2?function(msg){errorImpl(key,msg);}:errorImpl;
  			}
  			errorHandler[key] = fn && function(msg){
  				fn('[xmldom '+key+']\t'+msg+_locator(locator));
  			}||function(){};
  		}
  		build('warning');
  		build('error');
  		build('fatalError');
  		return errorHandler;
  	}

  	//console.log('#\n\n\n\n\n\n\n####')
  	/**
  	 * +ContentHandler+ErrorHandler
  	 * +LexicalHandler+EntityResolver2
  	 * -DeclHandler-DTDHandler
  	 *
  	 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
  	 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
  	 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
  	 */
  	function DOMHandler() {
  	    this.cdata = false;
  	}
  	function position(locator,node){
  		node.lineNumber = locator.lineNumber;
  		node.columnNumber = locator.columnNumber;
  	}
  	/**
  	 * @see org.xml.sax.ContentHandler#startDocument
  	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
  	 */
  	DOMHandler.prototype = {
  		startDocument : function() {
  	    	this.doc = new DOMImplementation().createDocument(null, null, null);
  	    	if (this.locator) {
  	        	this.doc.documentURI = this.locator.systemId;
  	    	}
  		},
  		startElement:function(namespaceURI, localName, qName, attrs) {
  			var doc = this.doc;
  		    var el = doc.createElementNS(namespaceURI, qName||localName);
  		    var len = attrs.length;
  		    appendElement(this, el);
  		    this.currentElement = el;

  			this.locator && position(this.locator,el);
  		    for (var i = 0 ; i < len; i++) {
  		        var namespaceURI = attrs.getURI(i);
  		        var value = attrs.getValue(i);
  		        var qName = attrs.getQName(i);
  				var attr = doc.createAttributeNS(namespaceURI, qName);
  				this.locator &&position(attrs.getLocator(i),attr);
  				attr.value = attr.nodeValue = value;
  				el.setAttributeNode(attr);
  		    }
  		},
  		endElement:function(namespaceURI, localName, qName) {
  			var current = this.currentElement;
  			current.tagName;
  			this.currentElement = current.parentNode;
  		},
  		startPrefixMapping:function(prefix, uri) {
  		},
  		endPrefixMapping:function(prefix) {
  		},
  		processingInstruction:function(target, data) {
  		    var ins = this.doc.createProcessingInstruction(target, data);
  		    this.locator && position(this.locator,ins);
  		    appendElement(this, ins);
  		},
  		ignorableWhitespace:function(ch, start, length) {
  		},
  		characters:function(chars, start, length) {
  			chars = _toString.apply(this,arguments);
  			//console.log(chars)
  			if(chars){
  				if (this.cdata) {
  					var charNode = this.doc.createCDATASection(chars);
  				} else {
  					var charNode = this.doc.createTextNode(chars);
  				}
  				if(this.currentElement){
  					this.currentElement.appendChild(charNode);
  				}else if(/^\s*$/.test(chars)){
  					this.doc.appendChild(charNode);
  					//process xml
  				}
  				this.locator && position(this.locator,charNode);
  			}
  		},
  		skippedEntity:function(name) {
  		},
  		endDocument:function() {
  			this.doc.normalize();
  		},
  		setDocumentLocator:function (locator) {
  		    if(this.locator = locator){// && !('lineNumber' in locator)){
  		    	locator.lineNumber = 0;
  		    }
  		},
  		//LexicalHandler
  		comment:function(chars, start, length) {
  			chars = _toString.apply(this,arguments);
  		    var comm = this.doc.createComment(chars);
  		    this.locator && position(this.locator,comm);
  		    appendElement(this, comm);
  		},

  		startCDATA:function() {
  		    //used in characters() methods
  		    this.cdata = true;
  		},
  		endCDATA:function() {
  		    this.cdata = false;
  		},

  		startDTD:function(name, publicId, systemId) {
  			var impl = this.doc.implementation;
  		    if (impl && impl.createDocumentType) {
  		        var dt = impl.createDocumentType(name, publicId, systemId);
  		        this.locator && position(this.locator,dt);
  		        appendElement(this, dt);
  						this.doc.doctype = dt;
  		    }
  		},
  		/**
  		 * @see org.xml.sax.ErrorHandler
  		 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
  		 */
  		warning:function(error) {
  			console.warn('[xmldom warning]\t'+error,_locator(this.locator));
  		},
  		error:function(error) {
  			console.error('[xmldom error]\t'+error,_locator(this.locator));
  		},
  		fatalError:function(error) {
  			throw new ParseError(error, this.locator);
  		}
  	};
  	function _locator(l){
  		if(l){
  			return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
  		}
  	}
  	function _toString(chars,start,length){
  		if(typeof chars == 'string'){
  			return chars.substr(start,length)
  		}else {//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
  			if(chars.length >= start+length || start){
  				return new java.lang.String(chars,start,length)+'';
  			}
  			return chars;
  		}
  	}

  	/*
  	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
  	 * used method of org.xml.sax.ext.LexicalHandler:
  	 *  #comment(chars, start, length)
  	 *  #startCDATA()
  	 *  #endCDATA()
  	 *  #startDTD(name, publicId, systemId)
  	 *
  	 *
  	 * IGNORED method of org.xml.sax.ext.LexicalHandler:
  	 *  #endDTD()
  	 *  #startEntity(name)
  	 *  #endEntity(name)
  	 *
  	 *
  	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
  	 * IGNORED method of org.xml.sax.ext.DeclHandler
  	 * 	#attributeDecl(eName, aName, type, mode, value)
  	 *  #elementDecl(name, model)
  	 *  #externalEntityDecl(name, publicId, systemId)
  	 *  #internalEntityDecl(name, value)
  	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
  	 * IGNORED method of org.xml.sax.EntityResolver2
  	 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
  	 *  #resolveEntity(publicId, systemId)
  	 *  #getExternalSubset(name, baseURI)
  	 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
  	 * IGNORED method of org.xml.sax.DTDHandler
  	 *  #notationDecl(name, publicId, systemId) {};
  	 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
  	 */
  	"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
  		DOMHandler.prototype[key] = function(){return null};
  	});

  	/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
  	function appendElement (hander,node) {
  	    if (!hander.currentElement) {
  	        hander.doc.appendChild(node);
  	    } else {
  	        hander.currentElement.appendChild(node);
  	    }
  	}//appendChild and setAttributeNS are preformance key

  	domParser.__DOMHandler = DOMHandler;
  	domParser.normalizeLineEndings = normalizeLineEndings;
  	domParser.DOMParser = DOMParser;
  	return domParser;
  }

  var hasRequiredLib;

  function requireLib () {
  	if (hasRequiredLib) return lib;
  	hasRequiredLib = 1;
  	var dom = requireDom();
  	lib.DOMImplementation = dom.DOMImplementation;
  	lib.XMLSerializer = dom.XMLSerializer;
  	lib.DOMParser = requireDomParser().DOMParser;
  	return lib;
  }

  /*
  	Copyright 2015 Axinom
  	Copyright 2011-2013 Abdulla Abdurakhmanov
  	Original sources are available at https://code.google.com/p/x2js/

  	Licensed under the Apache License, Version 2.0 (the "License");
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at

  	http://www.apache.org/licenses/LICENSE-2.0

  	Unless required by applicable law or agreed to in writing, software
  	distributed under the License is distributed on an "AS IS" BASIS,
  	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  	See the License for the specific language governing permissions and
  	limitations under the License.
  */

  (function (module) {
  	/*
  		Supported export methods:
  		* AMD
  		* <script> (window.X2JS)
  		* Node.js

  		Limitations:
  		* Attribute namespace prefixes are not parsed as such.
  		* Overall the serialization/deserializaton code is "best effort" and not foolproof.
  	*/

  	// Module definition pattern used is returnExports from https://github.com/umdjs/umd
  	(function (root, factory) {

  		/* global define */
  		if (module.exports) {
  			// Node. Does not work with strict CommonJS, but only CommonJS-like
  			// environments that support module.exports, like Node.
  			module.exports = factory(requireLib().DOMParser);
  		} else {
  			// Browser globals (root is window)
  			root.X2JS = factory();
  		}
  	})(commonjsGlobal, function (CustomDOMParser) {

  		// We return a constructor that can be used to make X2JS instances.
  		return function X2JS(config) {
  			var VERSION = "3.4.4";

  			config = config || {};

  			function initConfigDefaults() {
  				// If set to "property" then <element>_asArray will be created
  				// to allow you to access any element as an array (even if there is only one of it).
  				config.arrayAccessForm = config.arrayAccessForm || "none";

  				// If "text" then <empty></empty> will be transformed to "".
  				// If "object" then <empty></empty> will be transformed to {}.
  				config.emptyNodeForm = config.emptyNodeForm || "text";

  				// Function that will be called for each elements, if the function returns true, the element will be skipped
  				// function(name, value) { return true; };
  				config.jsAttributeFilter = config.jsAttributeFilter;

  				// Function that will be called for each elements, the element value will be replaced by the returned value
  				// function(name, value) { return parseFloat(value); };
  				config.jsAttributeConverter = config.jsAttributeConverter;

  				// Allows attribute values to be converted on the fly during parsing to objects.
  				// 	"test": function(name, value) { return true; }
  				//	"convert": function(name, value) { return parseFloat(value); };
  				// convert() will be called for every attribute where test() returns true
  				// and the return value from convert() will replace the original value of the attribute.
  				config.attributeConverters = config.attributeConverters || [];

  				// Any elements that match the paths here will have their text parsed
  				// as an XML datetime value (2011-11-12T13:00:00-07:00 style).
  				// The path can be a plain string (parent.child1.child2),
  				// a regex (/.*\.child2/) or function(elementPath).
  				config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];

  				// Any elements that match the paths listed here will be stored in JavaScript objects
  				// as arrays even if there is only one of them. The path can be a plain string
  				// (parent.child1.child2), a regex (/.*\.child2/) or function(elementName, elementPath).
  				config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];

  	            // xmldom constructor arguments
  	            // @see https://github.com/jindw/xmldom#api-reference
  				config.xmldomOptions = config.xmldomOptions || {};

  				// If true, a toString function is generated to print nodes containing text or cdata.
  				// Useful if you want to accept both plain text and CData as equivalent inputs.
  				if (config.enableToStringFunc === undefined) {
  					config.enableToStringFunc = true;
  				}

  				// If true, empty text tags are ignored for elements with child nodes.
  				if (config.skipEmptyTextNodesForObj === undefined) {
  					config.skipEmptyTextNodesForObj = true;
  				}

  				// If true, whitespace is trimmed from text nodes.
  				if (config.stripWhitespaces === undefined) {
  					config.stripWhitespaces = true;
  				}

  				// If true, double quotes are used in generated XML.
  				if (config.useDoubleQuotes === undefined) {
  					config.useDoubleQuotes = true;
  				}

  				// If true, the root element of the XML document is ignored when converting to objects.
  				// The result will directly have the root element's children as its own properties.
  				if (config.ignoreRoot === undefined) {
  					config.ignoreRoot = false;
  				}

  				// Whether XML characters in text are escaped when reading/writing XML.
  				if (config.escapeMode === undefined) {
  					config.escapeMode = true;
  				}

  				// Prefix to use for properties that are created to represent XML attributes.
  				if (config.attributePrefix === undefined) {
  					config.attributePrefix = "_";
  				}

  				// If true, empty elements will created as self closing elements (<element />)
  				// If false, empty elements will be created with start and end tags (<element></element>)
  				if (config.selfClosingElements === undefined) {
  					config.selfClosingElements = true;
  				}

  				// If this property defined as false and an XML element has CData node ONLY, it will be converted to text without additional property "__cdata"
  				if (config.keepCData === undefined) {
  					config.keepCData = false;
  				}

  				// If this property defined as true, use { __text: 'abc' } over 'abc'
  				if (config.keepText === undefined) {
  					config.keepText = false;
  				}

  				// If true, will output dates in UTC
  				if (config.jsDateUTC === undefined) {
  					config.jsDateUTC = false;
  				}
  			}

  			function initRequiredPolyfills() {
  				function pad(number) {
  					var r = String(number);
  					if (r.length === 1) {
  						r = '0' + r;
  					}
  					return r;
  				}
  				// Hello IE8-
  				if (typeof String.prototype.trim !== 'function') {
  					String.prototype.trim = function trim() {
  						return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
  					};
  				}
  				if (typeof Date.prototype.toISOString !== 'function') {
  					// Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
  					Date.prototype.toISOString = function toISOString() {
  						var MS_IN_S = 1000;

  						return this.getUTCFullYear()
  							+ '-' + pad(this.getUTCMonth() + 1)
  							+ '-' + pad(this.getUTCDate())
  							+ 'T' + pad(this.getUTCHours())
  							+ ':' + pad(this.getUTCMinutes())
  							+ ':' + pad(this.getUTCSeconds())
  							+ '.' + String((this.getUTCMilliseconds() / MS_IN_S).toFixed(3)).slice(2, 5)
  							+ 'Z';
  					};
  				}
  			}

  			initConfigDefaults();
  			initRequiredPolyfills();

  			var DOMNodeTypes = {
  				"ELEMENT_NODE": 1,
  				"TEXT_NODE": 3,
  				"CDATA_SECTION_NODE": 4,
  				"COMMENT_NODE": 8,
  				"DOCUMENT_NODE": 9
  			};

  			function getDomNodeLocalName(domNode) {
  				var localName = domNode.localName;
  				if (localName == null) {
  					// Yeah, this is IE!!
  					localName = domNode.baseName;
  				}
  				if (localName == null || localName === "") {
  					// ==="" is IE too
  					localName = domNode.nodeName;
  				}
  				return localName;
  			}

  			function getDomNodeNamespacePrefix(node) {
  				return node.prefix;
  			}

  			function escapeXmlChars(str) {
  				if (typeof str === "string")
  					return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  				else
  					return str;
  			}

  			function unescapeXmlChars(str) {
  				return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
  			}

  			function ensureProperArrayAccessForm(element, childName, elementPath) {
  				switch (config.arrayAccessForm) {
  					case "property":
  						if (!(element[childName] instanceof Array))
  							element[childName + "_asArray"] = [element[childName]];
  						else
  							element[childName + "_asArray"] = element[childName];
  						break;
  				}

  				if (!(element[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
  					var match = false;

  					for (var i = 0; i < config.arrayAccessFormPaths.length; i++) {
  						var arrayPath = config.arrayAccessFormPaths[i];
  						if (typeof arrayPath === "string") {
  							if (arrayPath === elementPath) {
  								match = true;
  								break;
  							}
  						} else if (arrayPath instanceof RegExp) {
  							if (arrayPath.test(elementPath)) {
  								match = true;
  								break;
  							}
  						} else if (typeof arrayPath === "function") {
  							if (arrayPath(childName, elementPath)) {
  								match = true;
  								break;
  							}
  						}
  					}

  					if (match)
  						element[childName] = [element[childName]];
  				}
  			}

  			function xmlDateTimeToDate(prop) {
  				// Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
  				// Improved to support full spec and optional parts
  				var MINUTES_PER_HOUR = 60;

  				var bits = prop.split(/[-T:+Z]/g);

  				var d = new Date(bits[0], bits[1] - 1, bits[2]);
  				var secondBits = bits[5].split("\.");
  				d.setHours(bits[3], bits[4], secondBits[0]);
  				if (secondBits.length > 1)
  					d.setMilliseconds(secondBits[1]);

  				// Get supplied time zone offset in minutes
  				if (bits[6] && bits[7]) {
  					var offsetMinutes = bits[6] * MINUTES_PER_HOUR + Number(bits[7]);
  					var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';

  					// Apply the sign
  					offsetMinutes = 0 + (sign === '-' ? -1 * offsetMinutes : offsetMinutes);

  					// Apply offset and local timezone
  					d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
  				} else if (prop.indexOf("Z", prop.length - 1) !== -1) {
  					d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
  				}

  				// d is now a local time equivalent to the supplied time
  				return d;
  			}

  			function convertToDateIfRequired(value, childName, fullPath) {
  				if (config.datetimeAccessFormPaths.length > 0) {
  					var pathWithoutTextNode = fullPath.split("\.#")[0];

  					for (var i = 0; i < config.datetimeAccessFormPaths.length; i++) {
  						var candidatePath = config.datetimeAccessFormPaths[i];
  						if (typeof candidatePath === "string") {
  							if (candidatePath === pathWithoutTextNode)
  								return xmlDateTimeToDate(value);
  						} else if (candidatePath instanceof RegExp) {
  							if (candidatePath.test(pathWithoutTextNode))
  								return xmlDateTimeToDate(value);
  						} else if (typeof candidatePath === "function") {
  							if (candidatePath(pathWithoutTextNode))
  								return xmlDateTimeToDate(value);
  						}
  					}
  				}

  				return value;
  			}

  			function deserializeRootElementChildren(rootElement) {
  				var result = {};
  				var children = rootElement.childNodes;

  				// Alternative for firstElementChild which is not supported in some environments
  				for (var i = 0; i < children.length; i++) {
  					var child = children.item(i);
  					if (child.nodeType === DOMNodeTypes.ELEMENT_NODE) {
  						var childName = getDomNodeLocalName(child);

  						if (config.ignoreRoot)
  							result = deserializeDomChildren(child, childName);
  						else
  							result[childName] = deserializeDomChildren(child, childName);
  					}
  				}

  				return result;
  			}

  			function deserializeElementChildren(element, elementPath) {
  				var result = {};
  				result.__cnt = 0;

  				var nodeChildren = element.childNodes;

  				// Child nodes.
  				for (var iChild = 0; iChild < nodeChildren.length; iChild++) {
  					var child = nodeChildren.item(iChild);
  					var childName = getDomNodeLocalName(child);

  					if (child.nodeType === DOMNodeTypes.COMMENT_NODE)
  						continue;

  					result.__cnt++;

  					// We deliberately do not accept everything falsey here because
  					// elements that resolve to empty string should still be preserved.
  					if (result[childName] == null) {
  						result[childName] = deserializeDomChildren(child, elementPath + "." + childName);
  						ensureProperArrayAccessForm(result, childName, elementPath + "." + childName);
  					} else {
  						if (!(result[childName] instanceof Array)) {
  							result[childName] = [result[childName]];
  							ensureProperArrayAccessForm(result, childName, elementPath + "." + childName);
  						}

  						result[childName][result[childName].length] = deserializeDomChildren(child, elementPath + "." + childName);
  					}
  				}

  				// Attributes
  				for (var iAttribute = 0; iAttribute < element.attributes.length; iAttribute++) {
  					var attribute = element.attributes.item(iAttribute);
  					result.__cnt++;

  					var adjustedValue = attribute.value;
  					for (var iConverter = 0; iConverter < config.attributeConverters.length; iConverter++) {
  						var converter = config.attributeConverters[iConverter];
  						if (converter.test.call(null, attribute.name, attribute.value))
  							adjustedValue = converter.convert.call(null, attribute.name, attribute.value);
  					}

  					result[config.attributePrefix + attribute.name] = adjustedValue;
  				}

  				// Node namespace prefix
  				var namespacePrefix = getDomNodeNamespacePrefix(element);
  				if (namespacePrefix) {
  					result.__cnt++;
  					result.__prefix = namespacePrefix;
  				}

  				if (result["#text"]) {
  					result.__text = result["#text"];

  					if (result.__text instanceof Array) {
  						result.__text = result.__text.join("\n");
  					}

  					if (config.escapeMode)
  						result.__text = unescapeXmlChars(result.__text);

  					if (config.stripWhitespaces)
  						result.__text = result.__text.trim();

  					delete result["#text"];

  					if (config.arrayAccessForm === "property")
  						delete result["#text_asArray"];

  					result.__text = convertToDateIfRequired(result.__text, "#text", elementPath + ".#text");
  				}

  				if (result.hasOwnProperty('#cdata-section')) {
  					result.__cdata = result["#cdata-section"];
  					delete result["#cdata-section"];

  					if (config.arrayAccessForm === "property")
  						delete result["#cdata-section_asArray"];
  				}

  				if (result.__cnt === 1 && result.__text && !config.keepText) {
  					result = result.__text;
  				} else if (result.__cnt === 0 && config.emptyNodeForm === "text") {
  					result = '';
  				} else if (result.__cnt > 1 && result.__text !== undefined && config.skipEmptyTextNodesForObj) {
  					if (config.stripWhitespaces && result.__text === "" || result.__text.trim() === "") {
  						delete result.__text;
  					}
  				}
  				delete result.__cnt;

  				/**
  				 * We are checking if we are creating a __cdata property or if we just add the content of cdata inside result.
  				 * But, if we have a property inside xml tag (<tag PROPERTY="1"></tag>), and a cdata inside, we can't ignore it.
  				 * In this case we are keeping __cdata property.
  				 */
  				if (!config.keepCData && (!result.hasOwnProperty('__text') && result.hasOwnProperty('__cdata') && Object.keys(result).length === 1)) {
  					return (result.__cdata ? result.__cdata : '');
  				}

  				if (config.enableToStringFunc && (result.__text || result.__cdata)) {
  					result.toString = function toString() {
  						return (this.__text ? this.__text : '') + (this.__cdata ? this.__cdata : '');
  					};
  				}

  				return result;
  			}

  			function deserializeDomChildren(node, parentPath) {
  				if (node.nodeType === DOMNodeTypes.DOCUMENT_NODE) {
  					return deserializeRootElementChildren(node);
  				} else if (node.nodeType === DOMNodeTypes.ELEMENT_NODE) {
  					return deserializeElementChildren(node, parentPath);
  				} else if (node.nodeType === DOMNodeTypes.TEXT_NODE || node.nodeType === DOMNodeTypes.CDATA_SECTION_NODE) {
  					return node.nodeValue;
  				} else {
  					return null;
  				}
  			}

  			function serializeStartTag(jsObject, elementName, attributeNames, selfClosing) {
  				var resultStr = "<" + ((jsObject && jsObject.__prefix) ? (jsObject.__prefix + ":") : "") + elementName;

  				if (attributeNames) {
  					for (var i = 0; i < attributeNames.length; i++) {
  						var attributeName = attributeNames[i];
  						var attributeValue = jsObject[attributeName];

  						if (config.escapeMode)
  							attributeValue = escapeXmlChars(attributeValue);

  						resultStr += " " + attributeName.substr(config.attributePrefix.length) + "=";

  						if (config.useDoubleQuotes)
  							resultStr += '"' + attributeValue + '"';
  						else
  							resultStr += "'" + attributeValue + "'";
  					}
  				}

  				if (!selfClosing)
  					resultStr += ">";
  				else
  					resultStr += " />";

  				return resultStr;
  			}

  			function serializeEndTag(jsObject, elementName) {
  				return "</" + ((jsObject && jsObject.__prefix) ? (jsObject.__prefix + ":") : "") + elementName + ">";
  			}

  			function endsWith(str, suffix) {
  				return str.indexOf(suffix, str.length - suffix.length) !== -1;
  			}

  			function isSpecialProperty(jsonObj, propertyName) {
  				if ((config.arrayAccessForm === "property" && endsWith(propertyName.toString(), ("_asArray")))
  					|| propertyName.toString().indexOf(config.attributePrefix) === 0
  					|| propertyName.toString().indexOf("__") === 0
  					|| (jsonObj[propertyName] instanceof Function))
  					return true;
  				else
  					return false;
  			}

  			function getDataElementCount(jsObject) {
  				var count = 0;

  				if (jsObject instanceof Object) {
  					for (var propertyName in jsObject) {
  						if (isSpecialProperty(jsObject, propertyName))
  							continue;

  						count++;
  					}
  				}

  				return count;
  			}

  			function getDataAttributeNames(jsObject) {
  				var names = [];

  				if (jsObject instanceof Object) {
  					for (var attributeName in jsObject) {
  						if (attributeName.toString().indexOf("__") === -1
  							&& attributeName.toString().indexOf(config.attributePrefix) === 0) {
  							names.push(attributeName);
  						}
  					}
  				}

  				return names;
  			}

  			function serializeComplexTextNodeContents(textNode) {
  				var result = "";

  				if (textNode.__cdata) {
  					result += "<![CDATA[" + textNode.__cdata + "]]>";
  				}

  				if (textNode.__text || typeof (textNode.__text) === 'number' || typeof (textNode.__text) === 'boolean') {
  					if (config.escapeMode)
  						result += escapeXmlChars(textNode.__text);
  					else
  						result += textNode.__text;
  				}

  				return result;
  			}

  			function serializeTextNodeContents(textNode) {
  				var result = "";

  				if (textNode instanceof Object) {
  					result += serializeComplexTextNodeContents(textNode);
  				} else if (textNode !== null) {
  					if (config.escapeMode)
  						result += escapeXmlChars(textNode);
  					else
  						result += textNode;
  				}

  				return result;
  			}

  			function serializeArray(elementArray, elementName, attributes) {
  				var result = "";

  				if (elementArray.length === 0) {
  					result += serializeStartTag(elementArray, elementName, attributes, true);
  				} else {
  					for (var i = 0; i < elementArray.length; i++) {
  						result += serializeJavaScriptObject(elementArray[i], elementName, getDataAttributeNames(elementArray[i]));
  					}
  				}

  				return result;
  			}

  			function serializeJavaScriptObject(element, elementName, attributes) {
  				var result = "";

  				// Filter out elements
  				if (config.jsAttributeFilter && config.jsAttributeFilter.call(null, elementName, element)) {
  					return result;
  				}
  				// Convert element
  				if (config.jsAttributeConverter) {
  					element = config.jsAttributeConverter.call(null, elementName, element);
  				}
  				if ((element === undefined || element === null || element === '') && config.selfClosingElements) {
  					result += serializeStartTag(element, elementName, attributes, true);
  				} else if (typeof element === 'object') {
  					if (Object.prototype.toString.call(element) === '[object Array]') {
  						result += serializeArray(element, elementName, attributes);
  					} else if (element instanceof Date) {
  						result += serializeStartTag(element, elementName, attributes, false);
  						// Serialize date
  						result += config.jsDateUTC ? element.toUTCString() : element.toISOString();
  						result += serializeEndTag(element, elementName);
  					} else {
  						var childElementCount = getDataElementCount(element);
  						if (childElementCount > 0 || typeof (element.__text) === 'number' || typeof (element.__text) === 'boolean' || element.__text || element.__cdata) {
  							result += serializeStartTag(element, elementName, attributes, false);
  							result += serializeJavaScriptObjectChildren(element);
  							result += serializeEndTag(element, elementName);
  						} else if (config.selfClosingElements) {
  							result += serializeStartTag(element, elementName, attributes, true);
  						} else {
  							result += serializeStartTag(element, elementName, attributes, false);
  							result += serializeEndTag(element, elementName);
  						}
  					}
  				} else {
  					result += serializeStartTag(element, elementName, attributes, false);
  					result += serializeTextNodeContents(element);
  					result += serializeEndTag(element, elementName);
  				}

  				return result;
  			}

  			function serializeJavaScriptObjectChildren(jsObject) {
  				var result = "";

  				var elementCount = getDataElementCount(jsObject);

  				if (elementCount > 0) {
  					for (var elementName in jsObject) {
  						if (isSpecialProperty(jsObject, elementName))
  							continue;

  						var element = jsObject[elementName];
  						var attributes = getDataAttributeNames(element);

  						result += serializeJavaScriptObject(element, elementName, attributes);
  					}
  				}

  				result += serializeTextNodeContents(jsObject);

  				return result;
  			}

  			function parseXml(xml) {
  				if (xml === undefined) {
  					return null;
  				}

  				if (typeof xml !== "string") {
  					return null;
  				}

  				var parser = null;
  				var domNode = null;

  				if (CustomDOMParser) {
  					// This branch is used for node.js, with the xmldom parser.
  					parser = new CustomDOMParser(config.xmldomOptions);

  					domNode = parser.parseFromString(xml, "text/xml");
  				} else if (window && window.DOMParser) {
  					parser = new window.DOMParser();
  					var parsererrorNS = null;

  					var isIEParser = window.ActiveXObject || "ActiveXObject" in window;

  					// IE9+ now is here
  					if (!isIEParser && document.all && !document.addEventListener) {
  						try {
  							parsererrorNS = parser.parseFromString("INVALID", "text/xml").childNodes[0].namespaceURI;
  						} catch (err) {
  							parsererrorNS = null;
  						}
  					}

  					try {
  						domNode = parser.parseFromString(xml, "text/xml");
  						if (parsererrorNS !== null && domNode.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
  							domNode = null;
  						}
  					} catch (err) {
  						domNode = null;
  					}
  				} else {
  					// IE :(
  					if (xml.indexOf("<?") === 0) {
  						xml = xml.substr(xml.indexOf("?>") + 2);
  					}

  					/* global ActiveXObject */
  					domNode = new ActiveXObject("Microsoft.XMLDOM");
  					domNode.async = "false";
  					domNode.loadXML(xml);
  				}

  				return domNode;
  			}

  			this.asArray = function asArray(prop) {
  				if (prop === undefined || prop === null) {
  					return [];
  				} else if (prop instanceof Array) {
  					return prop;
  				} else {
  					return [prop];
  				}
  			};

  			this.toXmlDateTime = function toXmlDateTime(dt) {
  				if (dt instanceof Date) {
  					return dt.toISOString();
  				} else if (typeof (dt) === 'number') {
  					return new Date(dt).toISOString();
  				} else {
  					return null;
  				}
  			};

  			this.asDateTime = function asDateTime(prop) {
  				if (typeof (prop) === "string") {
  					return xmlDateTimeToDate(prop);
  				} else {
  					return prop;
  				}
  			};

  			/*
  				Internally the logic works in a cycle:
  				DOM->JS - implemented by custom logic (deserialization).
  				JS->XML - implemented by custom logic (serialization).
  				XML->DOM - implemented by browser.
  			*/

  			// Transformns an XML string into DOM-tree
  			this.xml2dom = function xml2dom(xml) {
  				return parseXml(xml);
  			};

  			// Transforms a DOM tree to JavaScript objects.
  			this.dom2js = function dom2js(domNode) {
  				return deserializeDomChildren(domNode, null);
  			};

  			// Transforms JavaScript objects to a DOM tree.
  			this.js2dom = function js2dom(jsObject) {
  				var xml = this.js2xml(jsObject);
  				return parseXml(xml);
  			};

  			// Transformns an XML string into JavaScript objects.
  			this.xml2js = function xml2js(xml) {
  				var domNode = parseXml(xml);
  				if (domNode != null)
  					return this.dom2js(domNode);
  				else
  					return null;
  			};

  			// Transforms JavaScript objects into an XML string.
  			this.js2xml = function js2xml(jsObject) {
  				return serializeJavaScriptObjectChildren(jsObject);
  			};

  			this.getVersion = function getVersion() {
  				return VERSION;
  			};
  		};
  	}); 
  } (x2js));

  var x2jsExports = x2js.exports;
  var X2JS = /*@__PURE__*/getDefaultExportFromCjs(x2jsExports);

  var cryptoJs = {exports: {}};

  function commonjsRequire(path) {
  	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }

  var core = {exports: {}};

  var hasRequiredCore;

  function requireCore () {
  	if (hasRequiredCore) return core.exports;
  	hasRequiredCore = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory();
  			}
  		}(commonjsGlobal, function () {

  			/*globals window, global, require*/

  			/**
  			 * CryptoJS core components.
  			 */
  			var CryptoJS = CryptoJS || (function (Math, undefined$1) {

  			    var crypto;

  			    // Native crypto from window (Browser)
  			    if (typeof window !== 'undefined' && window.crypto) {
  			        crypto = window.crypto;
  			    }

  			    // Native crypto in web worker (Browser)
  			    if (typeof self !== 'undefined' && self.crypto) {
  			        crypto = self.crypto;
  			    }

  			    // Native crypto from worker
  			    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
  			        crypto = globalThis.crypto;
  			    }

  			    // Native (experimental IE 11) crypto from window (Browser)
  			    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
  			        crypto = window.msCrypto;
  			    }

  			    // Native crypto from global (NodeJS)
  			    if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
  			        crypto = commonjsGlobal.crypto;
  			    }

  			    // Native crypto import via require (NodeJS)
  			    if (!crypto && typeof commonjsRequire === 'function') {
  			        try {
  			            crypto = require('crypto');
  			        } catch (err) {}
  			    }

  			    /*
  			     * Cryptographically secure pseudorandom number generator
  			     *
  			     * As Math.random() is cryptographically not safe to use
  			     */
  			    var cryptoSecureRandomInt = function () {
  			        if (crypto) {
  			            // Use getRandomValues method (Browser)
  			            if (typeof crypto.getRandomValues === 'function') {
  			                try {
  			                    return crypto.getRandomValues(new Uint32Array(1))[0];
  			                } catch (err) {}
  			            }

  			            // Use randomBytes method (NodeJS)
  			            if (typeof crypto.randomBytes === 'function') {
  			                try {
  			                    return crypto.randomBytes(4).readInt32LE();
  			                } catch (err) {}
  			            }
  			        }

  			        throw new Error('Native crypto module could not be used to get secure random number.');
  			    };

  			    /*
  			     * Local polyfill of Object.create

  			     */
  			    var create = Object.create || (function () {
  			        function F() {}

  			        return function (obj) {
  			            var subtype;

  			            F.prototype = obj;

  			            subtype = new F();

  			            F.prototype = null;

  			            return subtype;
  			        };
  			    }());

  			    /**
  			     * CryptoJS namespace.
  			     */
  			    var C = {};

  			    /**
  			     * Library namespace.
  			     */
  			    var C_lib = C.lib = {};

  			    /**
  			     * Base object for prototypal inheritance.
  			     */
  			    var Base = C_lib.Base = (function () {


  			        return {
  			            /**
  			             * Creates a new object that inherits from this object.
  			             *
  			             * @param {Object} overrides Properties to copy into the new object.
  			             *
  			             * @return {Object} The new object.
  			             *
  			             * @static
  			             *
  			             * @example
  			             *
  			             *     var MyType = CryptoJS.lib.Base.extend({
  			             *         field: 'value',
  			             *
  			             *         method: function () {
  			             *         }
  			             *     });
  			             */
  			            extend: function (overrides) {
  			                // Spawn
  			                var subtype = create(this);

  			                // Augment
  			                if (overrides) {
  			                    subtype.mixIn(overrides);
  			                }

  			                // Create default initializer
  			                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
  			                    subtype.init = function () {
  			                        subtype.$super.init.apply(this, arguments);
  			                    };
  			                }

  			                // Initializer's prototype is the subtype object
  			                subtype.init.prototype = subtype;

  			                // Reference supertype
  			                subtype.$super = this;

  			                return subtype;
  			            },

  			            /**
  			             * Extends this object and runs the init method.
  			             * Arguments to create() will be passed to init().
  			             *
  			             * @return {Object} The new object.
  			             *
  			             * @static
  			             *
  			             * @example
  			             *
  			             *     var instance = MyType.create();
  			             */
  			            create: function () {
  			                var instance = this.extend();
  			                instance.init.apply(instance, arguments);

  			                return instance;
  			            },

  			            /**
  			             * Initializes a newly created object.
  			             * Override this method to add some logic when your objects are created.
  			             *
  			             * @example
  			             *
  			             *     var MyType = CryptoJS.lib.Base.extend({
  			             *         init: function () {
  			             *             // ...
  			             *         }
  			             *     });
  			             */
  			            init: function () {
  			            },

  			            /**
  			             * Copies properties into this object.
  			             *
  			             * @param {Object} properties The properties to mix in.
  			             *
  			             * @example
  			             *
  			             *     MyType.mixIn({
  			             *         field: 'value'
  			             *     });
  			             */
  			            mixIn: function (properties) {
  			                for (var propertyName in properties) {
  			                    if (properties.hasOwnProperty(propertyName)) {
  			                        this[propertyName] = properties[propertyName];
  			                    }
  			                }

  			                // IE won't copy toString using the loop above
  			                if (properties.hasOwnProperty('toString')) {
  			                    this.toString = properties.toString;
  			                }
  			            },

  			            /**
  			             * Creates a copy of this object.
  			             *
  			             * @return {Object} The clone.
  			             *
  			             * @example
  			             *
  			             *     var clone = instance.clone();
  			             */
  			            clone: function () {
  			                return this.init.prototype.extend(this);
  			            }
  			        };
  			    }());

  			    /**
  			     * An array of 32-bit words.
  			     *
  			     * @property {Array} words The array of 32-bit words.
  			     * @property {number} sigBytes The number of significant bytes in this word array.
  			     */
  			    var WordArray = C_lib.WordArray = Base.extend({
  			        /**
  			         * Initializes a newly created word array.
  			         *
  			         * @param {Array} words (Optional) An array of 32-bit words.
  			         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.lib.WordArray.create();
  			         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
  			         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
  			         */
  			        init: function (words, sigBytes) {
  			            words = this.words = words || [];

  			            if (sigBytes != undefined$1) {
  			                this.sigBytes = sigBytes;
  			            } else {
  			                this.sigBytes = words.length * 4;
  			            }
  			        },

  			        /**
  			         * Converts this word array to a string.
  			         *
  			         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
  			         *
  			         * @return {string} The stringified word array.
  			         *
  			         * @example
  			         *
  			         *     var string = wordArray + '';
  			         *     var string = wordArray.toString();
  			         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
  			         */
  			        toString: function (encoder) {
  			            return (encoder || Hex).stringify(this);
  			        },

  			        /**
  			         * Concatenates a word array to this word array.
  			         *
  			         * @param {WordArray} wordArray The word array to append.
  			         *
  			         * @return {WordArray} This word array.
  			         *
  			         * @example
  			         *
  			         *     wordArray1.concat(wordArray2);
  			         */
  			        concat: function (wordArray) {
  			            // Shortcuts
  			            var thisWords = this.words;
  			            var thatWords = wordArray.words;
  			            var thisSigBytes = this.sigBytes;
  			            var thatSigBytes = wordArray.sigBytes;

  			            // Clamp excess bits
  			            this.clamp();

  			            // Concat
  			            if (thisSigBytes % 4) {
  			                // Copy one byte at a time
  			                for (var i = 0; i < thatSigBytes; i++) {
  			                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  			                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
  			                }
  			            } else {
  			                // Copy one word at a time
  			                for (var j = 0; j < thatSigBytes; j += 4) {
  			                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
  			                }
  			            }
  			            this.sigBytes += thatSigBytes;

  			            // Chainable
  			            return this;
  			        },

  			        /**
  			         * Removes insignificant bits.
  			         *
  			         * @example
  			         *
  			         *     wordArray.clamp();
  			         */
  			        clamp: function () {
  			            // Shortcuts
  			            var words = this.words;
  			            var sigBytes = this.sigBytes;

  			            // Clamp
  			            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
  			            words.length = Math.ceil(sigBytes / 4);
  			        },

  			        /**
  			         * Creates a copy of this word array.
  			         *
  			         * @return {WordArray} The clone.
  			         *
  			         * @example
  			         *
  			         *     var clone = wordArray.clone();
  			         */
  			        clone: function () {
  			            var clone = Base.clone.call(this);
  			            clone.words = this.words.slice(0);

  			            return clone;
  			        },

  			        /**
  			         * Creates a word array filled with random bytes.
  			         *
  			         * @param {number} nBytes The number of random bytes to generate.
  			         *
  			         * @return {WordArray} The random word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.lib.WordArray.random(16);
  			         */
  			        random: function (nBytes) {
  			            var words = [];

  			            for (var i = 0; i < nBytes; i += 4) {
  			                words.push(cryptoSecureRandomInt());
  			            }

  			            return new WordArray.init(words, nBytes);
  			        }
  			    });

  			    /**
  			     * Encoder namespace.
  			     */
  			    var C_enc = C.enc = {};

  			    /**
  			     * Hex encoding strategy.
  			     */
  			    var Hex = C_enc.Hex = {
  			        /**
  			         * Converts a word array to a hex string.
  			         *
  			         * @param {WordArray} wordArray The word array.
  			         *
  			         * @return {string} The hex string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
  			         */
  			        stringify: function (wordArray) {
  			            // Shortcuts
  			            var words = wordArray.words;
  			            var sigBytes = wordArray.sigBytes;

  			            // Convert
  			            var hexChars = [];
  			            for (var i = 0; i < sigBytes; i++) {
  			                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  			                hexChars.push((bite >>> 4).toString(16));
  			                hexChars.push((bite & 0x0f).toString(16));
  			            }

  			            return hexChars.join('');
  			        },

  			        /**
  			         * Converts a hex string to a word array.
  			         *
  			         * @param {string} hexStr The hex string.
  			         *
  			         * @return {WordArray} The word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
  			         */
  			        parse: function (hexStr) {
  			            // Shortcut
  			            var hexStrLength = hexStr.length;

  			            // Convert
  			            var words = [];
  			            for (var i = 0; i < hexStrLength; i += 2) {
  			                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
  			            }

  			            return new WordArray.init(words, hexStrLength / 2);
  			        }
  			    };

  			    /**
  			     * Latin1 encoding strategy.
  			     */
  			    var Latin1 = C_enc.Latin1 = {
  			        /**
  			         * Converts a word array to a Latin1 string.
  			         *
  			         * @param {WordArray} wordArray The word array.
  			         *
  			         * @return {string} The Latin1 string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
  			         */
  			        stringify: function (wordArray) {
  			            // Shortcuts
  			            var words = wordArray.words;
  			            var sigBytes = wordArray.sigBytes;

  			            // Convert
  			            var latin1Chars = [];
  			            for (var i = 0; i < sigBytes; i++) {
  			                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  			                latin1Chars.push(String.fromCharCode(bite));
  			            }

  			            return latin1Chars.join('');
  			        },

  			        /**
  			         * Converts a Latin1 string to a word array.
  			         *
  			         * @param {string} latin1Str The Latin1 string.
  			         *
  			         * @return {WordArray} The word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
  			         */
  			        parse: function (latin1Str) {
  			            // Shortcut
  			            var latin1StrLength = latin1Str.length;

  			            // Convert
  			            var words = [];
  			            for (var i = 0; i < latin1StrLength; i++) {
  			                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  			            }

  			            return new WordArray.init(words, latin1StrLength);
  			        }
  			    };

  			    /**
  			     * UTF-8 encoding strategy.
  			     */
  			    var Utf8 = C_enc.Utf8 = {
  			        /**
  			         * Converts a word array to a UTF-8 string.
  			         *
  			         * @param {WordArray} wordArray The word array.
  			         *
  			         * @return {string} The UTF-8 string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
  			         */
  			        stringify: function (wordArray) {
  			            try {
  			                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
  			            } catch (e) {
  			                throw new Error('Malformed UTF-8 data');
  			            }
  			        },

  			        /**
  			         * Converts a UTF-8 string to a word array.
  			         *
  			         * @param {string} utf8Str The UTF-8 string.
  			         *
  			         * @return {WordArray} The word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
  			         */
  			        parse: function (utf8Str) {
  			            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  			        }
  			    };

  			    /**
  			     * Abstract buffered block algorithm template.
  			     *
  			     * The property blockSize must be implemented in a concrete subtype.
  			     *
  			     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
  			     */
  			    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
  			        /**
  			         * Resets this block algorithm's data buffer to its initial state.
  			         *
  			         * @example
  			         *
  			         *     bufferedBlockAlgorithm.reset();
  			         */
  			        reset: function () {
  			            // Initial values
  			            this._data = new WordArray.init();
  			            this._nDataBytes = 0;
  			        },

  			        /**
  			         * Adds new data to this block algorithm's buffer.
  			         *
  			         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
  			         *
  			         * @example
  			         *
  			         *     bufferedBlockAlgorithm._append('data');
  			         *     bufferedBlockAlgorithm._append(wordArray);
  			         */
  			        _append: function (data) {
  			            // Convert string to WordArray, else assume WordArray already
  			            if (typeof data == 'string') {
  			                data = Utf8.parse(data);
  			            }

  			            // Append
  			            this._data.concat(data);
  			            this._nDataBytes += data.sigBytes;
  			        },

  			        /**
  			         * Processes available data blocks.
  			         *
  			         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
  			         *
  			         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
  			         *
  			         * @return {WordArray} The processed data.
  			         *
  			         * @example
  			         *
  			         *     var processedData = bufferedBlockAlgorithm._process();
  			         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
  			         */
  			        _process: function (doFlush) {
  			            var processedWords;

  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;
  			            var dataSigBytes = data.sigBytes;
  			            var blockSize = this.blockSize;
  			            var blockSizeBytes = blockSize * 4;

  			            // Count blocks ready
  			            var nBlocksReady = dataSigBytes / blockSizeBytes;
  			            if (doFlush) {
  			                // Round up to include partial blocks
  			                nBlocksReady = Math.ceil(nBlocksReady);
  			            } else {
  			                // Round down to include only full blocks,
  			                // less the number of blocks that must remain in the buffer
  			                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
  			            }

  			            // Count words ready
  			            var nWordsReady = nBlocksReady * blockSize;

  			            // Count bytes ready
  			            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

  			            // Process blocks
  			            if (nWordsReady) {
  			                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
  			                    // Perform concrete-algorithm logic
  			                    this._doProcessBlock(dataWords, offset);
  			                }

  			                // Remove processed words
  			                processedWords = dataWords.splice(0, nWordsReady);
  			                data.sigBytes -= nBytesReady;
  			            }

  			            // Return processed words
  			            return new WordArray.init(processedWords, nBytesReady);
  			        },

  			        /**
  			         * Creates a copy of this object.
  			         *
  			         * @return {Object} The clone.
  			         *
  			         * @example
  			         *
  			         *     var clone = bufferedBlockAlgorithm.clone();
  			         */
  			        clone: function () {
  			            var clone = Base.clone.call(this);
  			            clone._data = this._data.clone();

  			            return clone;
  			        },

  			        _minBufferSize: 0
  			    });

  			    /**
  			     * Abstract hasher template.
  			     *
  			     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
  			     */
  			    C_lib.Hasher = BufferedBlockAlgorithm.extend({
  			        /**
  			         * Configuration options.
  			         */
  			        cfg: Base.extend(),

  			        /**
  			         * Initializes a newly created hasher.
  			         *
  			         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
  			         *
  			         * @example
  			         *
  			         *     var hasher = CryptoJS.algo.SHA256.create();
  			         */
  			        init: function (cfg) {
  			            // Apply config defaults
  			            this.cfg = this.cfg.extend(cfg);

  			            // Set initial values
  			            this.reset();
  			        },

  			        /**
  			         * Resets this hasher to its initial state.
  			         *
  			         * @example
  			         *
  			         *     hasher.reset();
  			         */
  			        reset: function () {
  			            // Reset data buffer
  			            BufferedBlockAlgorithm.reset.call(this);

  			            // Perform concrete-hasher logic
  			            this._doReset();
  			        },

  			        /**
  			         * Updates this hasher with a message.
  			         *
  			         * @param {WordArray|string} messageUpdate The message to append.
  			         *
  			         * @return {Hasher} This hasher.
  			         *
  			         * @example
  			         *
  			         *     hasher.update('message');
  			         *     hasher.update(wordArray);
  			         */
  			        update: function (messageUpdate) {
  			            // Append
  			            this._append(messageUpdate);

  			            // Update the hash
  			            this._process();

  			            // Chainable
  			            return this;
  			        },

  			        /**
  			         * Finalizes the hash computation.
  			         * Note that the finalize operation is effectively a destructive, read-once operation.
  			         *
  			         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  			         *
  			         * @return {WordArray} The hash.
  			         *
  			         * @example
  			         *
  			         *     var hash = hasher.finalize();
  			         *     var hash = hasher.finalize('message');
  			         *     var hash = hasher.finalize(wordArray);
  			         */
  			        finalize: function (messageUpdate) {
  			            // Final message update
  			            if (messageUpdate) {
  			                this._append(messageUpdate);
  			            }

  			            // Perform concrete-hasher logic
  			            var hash = this._doFinalize();

  			            return hash;
  			        },

  			        blockSize: 512/32,

  			        /**
  			         * Creates a shortcut function to a hasher's object interface.
  			         *
  			         * @param {Hasher} hasher The hasher to create a helper for.
  			         *
  			         * @return {Function} The shortcut function.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
  			         */
  			        _createHelper: function (hasher) {
  			            return function (message, cfg) {
  			                return new hasher.init(cfg).finalize(message);
  			            };
  			        },

  			        /**
  			         * Creates a shortcut function to the HMAC's object interface.
  			         *
  			         * @param {Hasher} hasher The hasher to use in this HMAC helper.
  			         *
  			         * @return {Function} The shortcut function.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
  			         */
  			        _createHmacHelper: function (hasher) {
  			            return function (message, key) {
  			                return new C_algo.HMAC.init(hasher, key).finalize(message);
  			            };
  			        }
  			    });

  			    /**
  			     * Algorithm namespace.
  			     */
  			    var C_algo = C.algo = {};

  			    return C;
  			}(Math));


  			return CryptoJS;

  		})); 
  	} (core));
  	return core.exports;
  }

  var x64Core = {exports: {}};

  var hasRequiredX64Core;

  function requireX64Core () {
  	if (hasRequiredX64Core) return x64Core.exports;
  	hasRequiredX64Core = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function (undefined$1) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var Base = C_lib.Base;
  			    var X32WordArray = C_lib.WordArray;

  			    /**
  			     * x64 namespace.
  			     */
  			    var C_x64 = C.x64 = {};

  			    /**
  			     * A 64-bit word.
  			     */
  			    C_x64.Word = Base.extend({
  			        /**
  			         * Initializes a newly created 64-bit word.
  			         *
  			         * @param {number} high The high 32 bits.
  			         * @param {number} low The low 32 bits.
  			         *
  			         * @example
  			         *
  			         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
  			         */
  			        init: function (high, low) {
  			            this.high = high;
  			            this.low = low;
  			        }

  			        /**
  			         * Bitwise NOTs this word.
  			         *
  			         * @return {X64Word} A new x64-Word object after negating.
  			         *
  			         * @example
  			         *
  			         *     var negated = x64Word.not();
  			         */
  			        // not: function () {
  			            // var high = ~this.high;
  			            // var low = ~this.low;

  			            // return X64Word.create(high, low);
  			        // },

  			        /**
  			         * Bitwise ANDs this word with the passed word.
  			         *
  			         * @param {X64Word} word The x64-Word to AND with this word.
  			         *
  			         * @return {X64Word} A new x64-Word object after ANDing.
  			         *
  			         * @example
  			         *
  			         *     var anded = x64Word.and(anotherX64Word);
  			         */
  			        // and: function (word) {
  			            // var high = this.high & word.high;
  			            // var low = this.low & word.low;

  			            // return X64Word.create(high, low);
  			        // },

  			        /**
  			         * Bitwise ORs this word with the passed word.
  			         *
  			         * @param {X64Word} word The x64-Word to OR with this word.
  			         *
  			         * @return {X64Word} A new x64-Word object after ORing.
  			         *
  			         * @example
  			         *
  			         *     var ored = x64Word.or(anotherX64Word);
  			         */
  			        // or: function (word) {
  			            // var high = this.high | word.high;
  			            // var low = this.low | word.low;

  			            // return X64Word.create(high, low);
  			        // },

  			        /**
  			         * Bitwise XORs this word with the passed word.
  			         *
  			         * @param {X64Word} word The x64-Word to XOR with this word.
  			         *
  			         * @return {X64Word} A new x64-Word object after XORing.
  			         *
  			         * @example
  			         *
  			         *     var xored = x64Word.xor(anotherX64Word);
  			         */
  			        // xor: function (word) {
  			            // var high = this.high ^ word.high;
  			            // var low = this.low ^ word.low;

  			            // return X64Word.create(high, low);
  			        // },

  			        /**
  			         * Shifts this word n bits to the left.
  			         *
  			         * @param {number} n The number of bits to shift.
  			         *
  			         * @return {X64Word} A new x64-Word object after shifting.
  			         *
  			         * @example
  			         *
  			         *     var shifted = x64Word.shiftL(25);
  			         */
  			        // shiftL: function (n) {
  			            // if (n < 32) {
  			                // var high = (this.high << n) | (this.low >>> (32 - n));
  			                // var low = this.low << n;
  			            // } else {
  			                // var high = this.low << (n - 32);
  			                // var low = 0;
  			            // }

  			            // return X64Word.create(high, low);
  			        // },

  			        /**
  			         * Shifts this word n bits to the right.
  			         *
  			         * @param {number} n The number of bits to shift.
  			         *
  			         * @return {X64Word} A new x64-Word object after shifting.
  			         *
  			         * @example
  			         *
  			         *     var shifted = x64Word.shiftR(7);
  			         */
  			        // shiftR: function (n) {
  			            // if (n < 32) {
  			                // var low = (this.low >>> n) | (this.high << (32 - n));
  			                // var high = this.high >>> n;
  			            // } else {
  			                // var low = this.high >>> (n - 32);
  			                // var high = 0;
  			            // }

  			            // return X64Word.create(high, low);
  			        // },

  			        /**
  			         * Rotates this word n bits to the left.
  			         *
  			         * @param {number} n The number of bits to rotate.
  			         *
  			         * @return {X64Word} A new x64-Word object after rotating.
  			         *
  			         * @example
  			         *
  			         *     var rotated = x64Word.rotL(25);
  			         */
  			        // rotL: function (n) {
  			            // return this.shiftL(n).or(this.shiftR(64 - n));
  			        // },

  			        /**
  			         * Rotates this word n bits to the right.
  			         *
  			         * @param {number} n The number of bits to rotate.
  			         *
  			         * @return {X64Word} A new x64-Word object after rotating.
  			         *
  			         * @example
  			         *
  			         *     var rotated = x64Word.rotR(7);
  			         */
  			        // rotR: function (n) {
  			            // return this.shiftR(n).or(this.shiftL(64 - n));
  			        // },

  			        /**
  			         * Adds this word with the passed word.
  			         *
  			         * @param {X64Word} word The x64-Word to add with this word.
  			         *
  			         * @return {X64Word} A new x64-Word object after adding.
  			         *
  			         * @example
  			         *
  			         *     var added = x64Word.add(anotherX64Word);
  			         */
  			        // add: function (word) {
  			            // var low = (this.low + word.low) | 0;
  			            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
  			            // var high = (this.high + word.high + carry) | 0;

  			            // return X64Word.create(high, low);
  			        // }
  			    });

  			    /**
  			     * An array of 64-bit words.
  			     *
  			     * @property {Array} words The array of CryptoJS.x64.Word objects.
  			     * @property {number} sigBytes The number of significant bytes in this word array.
  			     */
  			    C_x64.WordArray = Base.extend({
  			        /**
  			         * Initializes a newly created word array.
  			         *
  			         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
  			         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.x64.WordArray.create();
  			         *
  			         *     var wordArray = CryptoJS.x64.WordArray.create([
  			         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
  			         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
  			         *     ]);
  			         *
  			         *     var wordArray = CryptoJS.x64.WordArray.create([
  			         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
  			         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
  			         *     ], 10);
  			         */
  			        init: function (words, sigBytes) {
  			            words = this.words = words || [];

  			            if (sigBytes != undefined$1) {
  			                this.sigBytes = sigBytes;
  			            } else {
  			                this.sigBytes = words.length * 8;
  			            }
  			        },

  			        /**
  			         * Converts this 64-bit word array to a 32-bit word array.
  			         *
  			         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
  			         *
  			         * @example
  			         *
  			         *     var x32WordArray = x64WordArray.toX32();
  			         */
  			        toX32: function () {
  			            // Shortcuts
  			            var x64Words = this.words;
  			            var x64WordsLength = x64Words.length;

  			            // Convert
  			            var x32Words = [];
  			            for (var i = 0; i < x64WordsLength; i++) {
  			                var x64Word = x64Words[i];
  			                x32Words.push(x64Word.high);
  			                x32Words.push(x64Word.low);
  			            }

  			            return X32WordArray.create(x32Words, this.sigBytes);
  			        },

  			        /**
  			         * Creates a copy of this word array.
  			         *
  			         * @return {X64WordArray} The clone.
  			         *
  			         * @example
  			         *
  			         *     var clone = x64WordArray.clone();
  			         */
  			        clone: function () {
  			            var clone = Base.clone.call(this);

  			            // Clone "words" array
  			            var words = clone.words = this.words.slice(0);

  			            // Clone each X64Word object
  			            var wordsLength = words.length;
  			            for (var i = 0; i < wordsLength; i++) {
  			                words[i] = words[i].clone();
  			            }

  			            return clone;
  			        }
  			    });
  			}());


  			return CryptoJS;

  		})); 
  	} (x64Core));
  	return x64Core.exports;
  }

  var libTypedarrays = {exports: {}};

  var hasRequiredLibTypedarrays;

  function requireLibTypedarrays () {
  	if (hasRequiredLibTypedarrays) return libTypedarrays.exports;
  	hasRequiredLibTypedarrays = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Check if typed arrays are supported
  			    if (typeof ArrayBuffer != 'function') {
  			        return;
  			    }

  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;

  			    // Reference original init
  			    var superInit = WordArray.init;

  			    // Augment WordArray.init to handle typed arrays
  			    var subInit = WordArray.init = function (typedArray) {
  			        // Convert buffers to uint8
  			        if (typedArray instanceof ArrayBuffer) {
  			            typedArray = new Uint8Array(typedArray);
  			        }

  			        // Convert other array views to uint8
  			        if (
  			            typedArray instanceof Int8Array ||
  			            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
  			            typedArray instanceof Int16Array ||
  			            typedArray instanceof Uint16Array ||
  			            typedArray instanceof Int32Array ||
  			            typedArray instanceof Uint32Array ||
  			            typedArray instanceof Float32Array ||
  			            typedArray instanceof Float64Array
  			        ) {
  			            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
  			        }

  			        // Handle Uint8Array
  			        if (typedArray instanceof Uint8Array) {
  			            // Shortcut
  			            var typedArrayByteLength = typedArray.byteLength;

  			            // Extract bytes
  			            var words = [];
  			            for (var i = 0; i < typedArrayByteLength; i++) {
  			                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
  			            }

  			            // Initialize this word array
  			            superInit.call(this, words, typedArrayByteLength);
  			        } else {
  			            // Else call normal init
  			            superInit.apply(this, arguments);
  			        }
  			    };

  			    subInit.prototype = WordArray;
  			}());


  			return CryptoJS.lib.WordArray;

  		})); 
  	} (libTypedarrays));
  	return libTypedarrays.exports;
  }

  var encUtf16 = {exports: {}};

  var hasRequiredEncUtf16;

  function requireEncUtf16 () {
  	if (hasRequiredEncUtf16) return encUtf16.exports;
  	hasRequiredEncUtf16 = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var C_enc = C.enc;

  			    /**
  			     * UTF-16 BE encoding strategy.
  			     */
  			    C_enc.Utf16 = C_enc.Utf16BE = {
  			        /**
  			         * Converts a word array to a UTF-16 BE string.
  			         *
  			         * @param {WordArray} wordArray The word array.
  			         *
  			         * @return {string} The UTF-16 BE string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
  			         */
  			        stringify: function (wordArray) {
  			            // Shortcuts
  			            var words = wordArray.words;
  			            var sigBytes = wordArray.sigBytes;

  			            // Convert
  			            var utf16Chars = [];
  			            for (var i = 0; i < sigBytes; i += 2) {
  			                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
  			                utf16Chars.push(String.fromCharCode(codePoint));
  			            }

  			            return utf16Chars.join('');
  			        },

  			        /**
  			         * Converts a UTF-16 BE string to a word array.
  			         *
  			         * @param {string} utf16Str The UTF-16 BE string.
  			         *
  			         * @return {WordArray} The word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
  			         */
  			        parse: function (utf16Str) {
  			            // Shortcut
  			            var utf16StrLength = utf16Str.length;

  			            // Convert
  			            var words = [];
  			            for (var i = 0; i < utf16StrLength; i++) {
  			                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
  			            }

  			            return WordArray.create(words, utf16StrLength * 2);
  			        }
  			    };

  			    /**
  			     * UTF-16 LE encoding strategy.
  			     */
  			    C_enc.Utf16LE = {
  			        /**
  			         * Converts a word array to a UTF-16 LE string.
  			         *
  			         * @param {WordArray} wordArray The word array.
  			         *
  			         * @return {string} The UTF-16 LE string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
  			         */
  			        stringify: function (wordArray) {
  			            // Shortcuts
  			            var words = wordArray.words;
  			            var sigBytes = wordArray.sigBytes;

  			            // Convert
  			            var utf16Chars = [];
  			            for (var i = 0; i < sigBytes; i += 2) {
  			                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
  			                utf16Chars.push(String.fromCharCode(codePoint));
  			            }

  			            return utf16Chars.join('');
  			        },

  			        /**
  			         * Converts a UTF-16 LE string to a word array.
  			         *
  			         * @param {string} utf16Str The UTF-16 LE string.
  			         *
  			         * @return {WordArray} The word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
  			         */
  			        parse: function (utf16Str) {
  			            // Shortcut
  			            var utf16StrLength = utf16Str.length;

  			            // Convert
  			            var words = [];
  			            for (var i = 0; i < utf16StrLength; i++) {
  			                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
  			            }

  			            return WordArray.create(words, utf16StrLength * 2);
  			        }
  			    };

  			    function swapEndian(word) {
  			        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
  			    }
  			}());


  			return CryptoJS.enc.Utf16;

  		})); 
  	} (encUtf16));
  	return encUtf16.exports;
  }

  var encBase64 = {exports: {}};

  (function (module, exports) {
  (function (root, factory) {
  		{
  			// CommonJS
  			module.exports = factory(requireCore());
  		}
  	}(commonjsGlobal, function (CryptoJS) {

  		(function () {
  		    // Shortcuts
  		    var C = CryptoJS;
  		    var C_lib = C.lib;
  		    var WordArray = C_lib.WordArray;
  		    var C_enc = C.enc;

  		    /**
  		     * Base64 encoding strategy.
  		     */
  		    C_enc.Base64 = {
  		        /**
  		         * Converts a word array to a Base64 string.
  		         *
  		         * @param {WordArray} wordArray The word array.
  		         *
  		         * @return {string} The Base64 string.
  		         *
  		         * @static
  		         *
  		         * @example
  		         *
  		         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
  		         */
  		        stringify: function (wordArray) {
  		            // Shortcuts
  		            var words = wordArray.words;
  		            var sigBytes = wordArray.sigBytes;
  		            var map = this._map;

  		            // Clamp excess bits
  		            wordArray.clamp();

  		            // Convert
  		            var base64Chars = [];
  		            for (var i = 0; i < sigBytes; i += 3) {
  		                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
  		                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
  		                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

  		                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

  		                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
  		                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
  		                }
  		            }

  		            // Add padding
  		            var paddingChar = map.charAt(64);
  		            if (paddingChar) {
  		                while (base64Chars.length % 4) {
  		                    base64Chars.push(paddingChar);
  		                }
  		            }

  		            return base64Chars.join('');
  		        },

  		        /**
  		         * Converts a Base64 string to a word array.
  		         *
  		         * @param {string} base64Str The Base64 string.
  		         *
  		         * @return {WordArray} The word array.
  		         *
  		         * @static
  		         *
  		         * @example
  		         *
  		         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
  		         */
  		        parse: function (base64Str) {
  		            // Shortcuts
  		            var base64StrLength = base64Str.length;
  		            var map = this._map;
  		            var reverseMap = this._reverseMap;

  		            if (!reverseMap) {
  		                    reverseMap = this._reverseMap = [];
  		                    for (var j = 0; j < map.length; j++) {
  		                        reverseMap[map.charCodeAt(j)] = j;
  		                    }
  		            }

  		            // Ignore padding
  		            var paddingChar = map.charAt(64);
  		            if (paddingChar) {
  		                var paddingIndex = base64Str.indexOf(paddingChar);
  		                if (paddingIndex !== -1) {
  		                    base64StrLength = paddingIndex;
  		                }
  		            }

  		            // Convert
  		            return parseLoop(base64Str, base64StrLength, reverseMap);

  		        },

  		        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  		    };

  		    function parseLoop(base64Str, base64StrLength, reverseMap) {
  		      var words = [];
  		      var nBytes = 0;
  		      for (var i = 0; i < base64StrLength; i++) {
  		          if (i % 4) {
  		              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
  		              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
  		              var bitsCombined = bits1 | bits2;
  		              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
  		              nBytes++;
  		          }
  		      }
  		      return WordArray.create(words, nBytes);
  		    }
  		}());


  		return CryptoJS.enc.Base64;

  	})); 
  } (encBase64));

  var encBase64Exports = encBase64.exports;
  var Base64 = /*@__PURE__*/getDefaultExportFromCjs(encBase64Exports);

  var encBase64url = {exports: {}};

  var hasRequiredEncBase64url;

  function requireEncBase64url () {
  	if (hasRequiredEncBase64url) return encBase64url.exports;
  	hasRequiredEncBase64url = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var C_enc = C.enc;

  			    /**
  			     * Base64url encoding strategy.
  			     */
  			    C_enc.Base64url = {
  			        /**
  			         * Converts a word array to a Base64url string.
  			         *
  			         * @param {WordArray} wordArray The word array.
  			         *
  			         * @param {boolean} urlSafe Whether to use url safe
  			         *
  			         * @return {string} The Base64url string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
  			         */
  			        stringify: function (wordArray, urlSafe) {
  			            if (urlSafe === undefined) {
  			                urlSafe = true;
  			            }
  			            // Shortcuts
  			            var words = wordArray.words;
  			            var sigBytes = wordArray.sigBytes;
  			            var map = urlSafe ? this._safe_map : this._map;

  			            // Clamp excess bits
  			            wordArray.clamp();

  			            // Convert
  			            var base64Chars = [];
  			            for (var i = 0; i < sigBytes; i += 3) {
  			                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
  			                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
  			                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

  			                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

  			                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
  			                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
  			                }
  			            }

  			            // Add padding
  			            var paddingChar = map.charAt(64);
  			            if (paddingChar) {
  			                while (base64Chars.length % 4) {
  			                    base64Chars.push(paddingChar);
  			                }
  			            }

  			            return base64Chars.join('');
  			        },

  			        /**
  			         * Converts a Base64url string to a word array.
  			         *
  			         * @param {string} base64Str The Base64url string.
  			         *
  			         * @param {boolean} urlSafe Whether to use url safe
  			         *
  			         * @return {WordArray} The word array.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
  			         */
  			        parse: function (base64Str, urlSafe) {
  			            if (urlSafe === undefined) {
  			                urlSafe = true;
  			            }

  			            // Shortcuts
  			            var base64StrLength = base64Str.length;
  			            var map = urlSafe ? this._safe_map : this._map;
  			            var reverseMap = this._reverseMap;

  			            if (!reverseMap) {
  			                reverseMap = this._reverseMap = [];
  			                for (var j = 0; j < map.length; j++) {
  			                    reverseMap[map.charCodeAt(j)] = j;
  			                }
  			            }

  			            // Ignore padding
  			            var paddingChar = map.charAt(64);
  			            if (paddingChar) {
  			                var paddingIndex = base64Str.indexOf(paddingChar);
  			                if (paddingIndex !== -1) {
  			                    base64StrLength = paddingIndex;
  			                }
  			            }

  			            // Convert
  			            return parseLoop(base64Str, base64StrLength, reverseMap);

  			        },

  			        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  			        _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  			    };

  			    function parseLoop(base64Str, base64StrLength, reverseMap) {
  			        var words = [];
  			        var nBytes = 0;
  			        for (var i = 0; i < base64StrLength; i++) {
  			            if (i % 4) {
  			                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
  			                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
  			                var bitsCombined = bits1 | bits2;
  			                words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
  			                nBytes++;
  			            }
  			        }
  			        return WordArray.create(words, nBytes);
  			    }
  			}());


  			return CryptoJS.enc.Base64url;

  		})); 
  	} (encBase64url));
  	return encBase64url.exports;
  }

  var md5 = {exports: {}};

  var hasRequiredMd5;

  function requireMd5 () {
  	if (hasRequiredMd5) return md5.exports;
  	hasRequiredMd5 = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function (Math) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var Hasher = C_lib.Hasher;
  			    var C_algo = C.algo;

  			    // Constants table
  			    var T = [];

  			    // Compute constants
  			    (function () {
  			        for (var i = 0; i < 64; i++) {
  			            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
  			        }
  			    }());

  			    /**
  			     * MD5 hash algorithm.
  			     */
  			    var MD5 = C_algo.MD5 = Hasher.extend({
  			        _doReset: function () {
  			            this._hash = new WordArray.init([
  			                0x67452301, 0xefcdab89,
  			                0x98badcfe, 0x10325476
  			            ]);
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Swap endian
  			            for (var i = 0; i < 16; i++) {
  			                // Shortcuts
  			                var offset_i = offset + i;
  			                var M_offset_i = M[offset_i];

  			                M[offset_i] = (
  			                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
  			                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
  			                );
  			            }

  			            // Shortcuts
  			            var H = this._hash.words;

  			            var M_offset_0  = M[offset + 0];
  			            var M_offset_1  = M[offset + 1];
  			            var M_offset_2  = M[offset + 2];
  			            var M_offset_3  = M[offset + 3];
  			            var M_offset_4  = M[offset + 4];
  			            var M_offset_5  = M[offset + 5];
  			            var M_offset_6  = M[offset + 6];
  			            var M_offset_7  = M[offset + 7];
  			            var M_offset_8  = M[offset + 8];
  			            var M_offset_9  = M[offset + 9];
  			            var M_offset_10 = M[offset + 10];
  			            var M_offset_11 = M[offset + 11];
  			            var M_offset_12 = M[offset + 12];
  			            var M_offset_13 = M[offset + 13];
  			            var M_offset_14 = M[offset + 14];
  			            var M_offset_15 = M[offset + 15];

  			            // Working variables
  			            var a = H[0];
  			            var b = H[1];
  			            var c = H[2];
  			            var d = H[3];

  			            // Computation
  			            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
  			            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
  			            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
  			            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
  			            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
  			            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
  			            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
  			            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
  			            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
  			            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
  			            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
  			            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
  			            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
  			            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
  			            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
  			            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

  			            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
  			            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
  			            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
  			            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
  			            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
  			            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
  			            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
  			            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
  			            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
  			            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
  			            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
  			            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
  			            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
  			            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
  			            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
  			            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

  			            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
  			            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
  			            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
  			            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
  			            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
  			            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
  			            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
  			            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
  			            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
  			            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
  			            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
  			            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
  			            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
  			            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
  			            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
  			            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

  			            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
  			            d = II(d, a, b, c, M_offset_7,  10, T[49]);
  			            c = II(c, d, a, b, M_offset_14, 15, T[50]);
  			            b = II(b, c, d, a, M_offset_5,  21, T[51]);
  			            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
  			            d = II(d, a, b, c, M_offset_3,  10, T[53]);
  			            c = II(c, d, a, b, M_offset_10, 15, T[54]);
  			            b = II(b, c, d, a, M_offset_1,  21, T[55]);
  			            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
  			            d = II(d, a, b, c, M_offset_15, 10, T[57]);
  			            c = II(c, d, a, b, M_offset_6,  15, T[58]);
  			            b = II(b, c, d, a, M_offset_13, 21, T[59]);
  			            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
  			            d = II(d, a, b, c, M_offset_11, 10, T[61]);
  			            c = II(c, d, a, b, M_offset_2,  15, T[62]);
  			            b = II(b, c, d, a, M_offset_9,  21, T[63]);

  			            // Intermediate hash value
  			            H[0] = (H[0] + a) | 0;
  			            H[1] = (H[1] + b) | 0;
  			            H[2] = (H[2] + c) | 0;
  			            H[3] = (H[3] + d) | 0;
  			        },

  			        _doFinalize: function () {
  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;

  			            var nBitsTotal = this._nDataBytes * 8;
  			            var nBitsLeft = data.sigBytes * 8;

  			            // Add padding
  			            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

  			            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
  			            var nBitsTotalL = nBitsTotal;
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
  			                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
  			                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
  			            );
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
  			                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
  			                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
  			            );

  			            data.sigBytes = (dataWords.length + 1) * 4;

  			            // Hash final blocks
  			            this._process();

  			            // Shortcuts
  			            var hash = this._hash;
  			            var H = hash.words;

  			            // Swap endian
  			            for (var i = 0; i < 4; i++) {
  			                // Shortcut
  			                var H_i = H[i];

  			                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
  			                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  			            }

  			            // Return final computed hash
  			            return hash;
  			        },

  			        clone: function () {
  			            var clone = Hasher.clone.call(this);
  			            clone._hash = this._hash.clone();

  			            return clone;
  			        }
  			    });

  			    function FF(a, b, c, d, x, s, t) {
  			        var n = a + ((b & c) | (~b & d)) + x + t;
  			        return ((n << s) | (n >>> (32 - s))) + b;
  			    }

  			    function GG(a, b, c, d, x, s, t) {
  			        var n = a + ((b & d) | (c & ~d)) + x + t;
  			        return ((n << s) | (n >>> (32 - s))) + b;
  			    }

  			    function HH(a, b, c, d, x, s, t) {
  			        var n = a + (b ^ c ^ d) + x + t;
  			        return ((n << s) | (n >>> (32 - s))) + b;
  			    }

  			    function II(a, b, c, d, x, s, t) {
  			        var n = a + (c ^ (b | ~d)) + x + t;
  			        return ((n << s) | (n >>> (32 - s))) + b;
  			    }

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.MD5('message');
  			     *     var hash = CryptoJS.MD5(wordArray);
  			     */
  			    C.MD5 = Hasher._createHelper(MD5);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacMD5(message, key);
  			     */
  			    C.HmacMD5 = Hasher._createHmacHelper(MD5);
  			}(Math));


  			return CryptoJS.MD5;

  		})); 
  	} (md5));
  	return md5.exports;
  }

  var sha1 = {exports: {}};

  var hasRequiredSha1;

  function requireSha1 () {
  	if (hasRequiredSha1) return sha1.exports;
  	hasRequiredSha1 = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var Hasher = C_lib.Hasher;
  			    var C_algo = C.algo;

  			    // Reusable object
  			    var W = [];

  			    /**
  			     * SHA-1 hash algorithm.
  			     */
  			    var SHA1 = C_algo.SHA1 = Hasher.extend({
  			        _doReset: function () {
  			            this._hash = new WordArray.init([
  			                0x67452301, 0xefcdab89,
  			                0x98badcfe, 0x10325476,
  			                0xc3d2e1f0
  			            ]);
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Shortcut
  			            var H = this._hash.words;

  			            // Working variables
  			            var a = H[0];
  			            var b = H[1];
  			            var c = H[2];
  			            var d = H[3];
  			            var e = H[4];

  			            // Computation
  			            for (var i = 0; i < 80; i++) {
  			                if (i < 16) {
  			                    W[i] = M[offset + i] | 0;
  			                } else {
  			                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
  			                    W[i] = (n << 1) | (n >>> 31);
  			                }

  			                var t = ((a << 5) | (a >>> 27)) + e + W[i];
  			                if (i < 20) {
  			                    t += ((b & c) | (~b & d)) + 0x5a827999;
  			                } else if (i < 40) {
  			                    t += (b ^ c ^ d) + 0x6ed9eba1;
  			                } else if (i < 60) {
  			                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
  			                } else /* if (i < 80) */ {
  			                    t += (b ^ c ^ d) - 0x359d3e2a;
  			                }

  			                e = d;
  			                d = c;
  			                c = (b << 30) | (b >>> 2);
  			                b = a;
  			                a = t;
  			            }

  			            // Intermediate hash value
  			            H[0] = (H[0] + a) | 0;
  			            H[1] = (H[1] + b) | 0;
  			            H[2] = (H[2] + c) | 0;
  			            H[3] = (H[3] + d) | 0;
  			            H[4] = (H[4] + e) | 0;
  			        },

  			        _doFinalize: function () {
  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;

  			            var nBitsTotal = this._nDataBytes * 8;
  			            var nBitsLeft = data.sigBytes * 8;

  			            // Add padding
  			            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
  			            data.sigBytes = dataWords.length * 4;

  			            // Hash final blocks
  			            this._process();

  			            // Return final computed hash
  			            return this._hash;
  			        },

  			        clone: function () {
  			            var clone = Hasher.clone.call(this);
  			            clone._hash = this._hash.clone();

  			            return clone;
  			        }
  			    });

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.SHA1('message');
  			     *     var hash = CryptoJS.SHA1(wordArray);
  			     */
  			    C.SHA1 = Hasher._createHelper(SHA1);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacSHA1(message, key);
  			     */
  			    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
  			}());


  			return CryptoJS.SHA1;

  		})); 
  	} (sha1));
  	return sha1.exports;
  }

  var sha256 = {exports: {}};

  var hasRequiredSha256;

  function requireSha256 () {
  	if (hasRequiredSha256) return sha256.exports;
  	hasRequiredSha256 = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function (Math) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var Hasher = C_lib.Hasher;
  			    var C_algo = C.algo;

  			    // Initialization and round constants tables
  			    var H = [];
  			    var K = [];

  			    // Compute constants
  			    (function () {
  			        function isPrime(n) {
  			            var sqrtN = Math.sqrt(n);
  			            for (var factor = 2; factor <= sqrtN; factor++) {
  			                if (!(n % factor)) {
  			                    return false;
  			                }
  			            }

  			            return true;
  			        }

  			        function getFractionalBits(n) {
  			            return ((n - (n | 0)) * 0x100000000) | 0;
  			        }

  			        var n = 2;
  			        var nPrime = 0;
  			        while (nPrime < 64) {
  			            if (isPrime(n)) {
  			                if (nPrime < 8) {
  			                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
  			                }
  			                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

  			                nPrime++;
  			            }

  			            n++;
  			        }
  			    }());

  			    // Reusable object
  			    var W = [];

  			    /**
  			     * SHA-256 hash algorithm.
  			     */
  			    var SHA256 = C_algo.SHA256 = Hasher.extend({
  			        _doReset: function () {
  			            this._hash = new WordArray.init(H.slice(0));
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Shortcut
  			            var H = this._hash.words;

  			            // Working variables
  			            var a = H[0];
  			            var b = H[1];
  			            var c = H[2];
  			            var d = H[3];
  			            var e = H[4];
  			            var f = H[5];
  			            var g = H[6];
  			            var h = H[7];

  			            // Computation
  			            for (var i = 0; i < 64; i++) {
  			                if (i < 16) {
  			                    W[i] = M[offset + i] | 0;
  			                } else {
  			                    var gamma0x = W[i - 15];
  			                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
  			                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
  			                                   (gamma0x >>> 3);

  			                    var gamma1x = W[i - 2];
  			                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
  			                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
  			                                   (gamma1x >>> 10);

  			                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
  			                }

  			                var ch  = (e & f) ^ (~e & g);
  			                var maj = (a & b) ^ (a & c) ^ (b & c);

  			                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
  			                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

  			                var t1 = h + sigma1 + ch + K[i] + W[i];
  			                var t2 = sigma0 + maj;

  			                h = g;
  			                g = f;
  			                f = e;
  			                e = (d + t1) | 0;
  			                d = c;
  			                c = b;
  			                b = a;
  			                a = (t1 + t2) | 0;
  			            }

  			            // Intermediate hash value
  			            H[0] = (H[0] + a) | 0;
  			            H[1] = (H[1] + b) | 0;
  			            H[2] = (H[2] + c) | 0;
  			            H[3] = (H[3] + d) | 0;
  			            H[4] = (H[4] + e) | 0;
  			            H[5] = (H[5] + f) | 0;
  			            H[6] = (H[6] + g) | 0;
  			            H[7] = (H[7] + h) | 0;
  			        },

  			        _doFinalize: function () {
  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;

  			            var nBitsTotal = this._nDataBytes * 8;
  			            var nBitsLeft = data.sigBytes * 8;

  			            // Add padding
  			            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
  			            data.sigBytes = dataWords.length * 4;

  			            // Hash final blocks
  			            this._process();

  			            // Return final computed hash
  			            return this._hash;
  			        },

  			        clone: function () {
  			            var clone = Hasher.clone.call(this);
  			            clone._hash = this._hash.clone();

  			            return clone;
  			        }
  			    });

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.SHA256('message');
  			     *     var hash = CryptoJS.SHA256(wordArray);
  			     */
  			    C.SHA256 = Hasher._createHelper(SHA256);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacSHA256(message, key);
  			     */
  			    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
  			}(Math));


  			return CryptoJS.SHA256;

  		})); 
  	} (sha256));
  	return sha256.exports;
  }

  var sha224 = {exports: {}};

  var hasRequiredSha224;

  function requireSha224 () {
  	if (hasRequiredSha224) return sha224.exports;
  	hasRequiredSha224 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireSha256());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var C_algo = C.algo;
  			    var SHA256 = C_algo.SHA256;

  			    /**
  			     * SHA-224 hash algorithm.
  			     */
  			    var SHA224 = C_algo.SHA224 = SHA256.extend({
  			        _doReset: function () {
  			            this._hash = new WordArray.init([
  			                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
  			                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
  			            ]);
  			        },

  			        _doFinalize: function () {
  			            var hash = SHA256._doFinalize.call(this);

  			            hash.sigBytes -= 4;

  			            return hash;
  			        }
  			    });

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.SHA224('message');
  			     *     var hash = CryptoJS.SHA224(wordArray);
  			     */
  			    C.SHA224 = SHA256._createHelper(SHA224);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacSHA224(message, key);
  			     */
  			    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
  			}());


  			return CryptoJS.SHA224;

  		})); 
  	} (sha224));
  	return sha224.exports;
  }

  var sha512 = {exports: {}};

  var hasRequiredSha512;

  function requireSha512 () {
  	if (hasRequiredSha512) return sha512.exports;
  	hasRequiredSha512 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireX64Core());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var Hasher = C_lib.Hasher;
  			    var C_x64 = C.x64;
  			    var X64Word = C_x64.Word;
  			    var X64WordArray = C_x64.WordArray;
  			    var C_algo = C.algo;

  			    function X64Word_create() {
  			        return X64Word.create.apply(X64Word, arguments);
  			    }

  			    // Constants
  			    var K = [
  			        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
  			        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
  			        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
  			        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
  			        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
  			        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
  			        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
  			        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
  			        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
  			        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
  			        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
  			        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
  			        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
  			        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
  			        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
  			        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
  			        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
  			        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
  			        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
  			        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
  			        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
  			        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
  			        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
  			        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
  			        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
  			        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
  			        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
  			        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
  			        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
  			        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
  			        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
  			        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
  			        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
  			        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
  			        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
  			        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
  			        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
  			        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
  			        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
  			        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
  			    ];

  			    // Reusable objects
  			    var W = [];
  			    (function () {
  			        for (var i = 0; i < 80; i++) {
  			            W[i] = X64Word_create();
  			        }
  			    }());

  			    /**
  			     * SHA-512 hash algorithm.
  			     */
  			    var SHA512 = C_algo.SHA512 = Hasher.extend({
  			        _doReset: function () {
  			            this._hash = new X64WordArray.init([
  			                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
  			                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
  			                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
  			                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
  			            ]);
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Shortcuts
  			            var H = this._hash.words;

  			            var H0 = H[0];
  			            var H1 = H[1];
  			            var H2 = H[2];
  			            var H3 = H[3];
  			            var H4 = H[4];
  			            var H5 = H[5];
  			            var H6 = H[6];
  			            var H7 = H[7];

  			            var H0h = H0.high;
  			            var H0l = H0.low;
  			            var H1h = H1.high;
  			            var H1l = H1.low;
  			            var H2h = H2.high;
  			            var H2l = H2.low;
  			            var H3h = H3.high;
  			            var H3l = H3.low;
  			            var H4h = H4.high;
  			            var H4l = H4.low;
  			            var H5h = H5.high;
  			            var H5l = H5.low;
  			            var H6h = H6.high;
  			            var H6l = H6.low;
  			            var H7h = H7.high;
  			            var H7l = H7.low;

  			            // Working variables
  			            var ah = H0h;
  			            var al = H0l;
  			            var bh = H1h;
  			            var bl = H1l;
  			            var ch = H2h;
  			            var cl = H2l;
  			            var dh = H3h;
  			            var dl = H3l;
  			            var eh = H4h;
  			            var el = H4l;
  			            var fh = H5h;
  			            var fl = H5l;
  			            var gh = H6h;
  			            var gl = H6l;
  			            var hh = H7h;
  			            var hl = H7l;

  			            // Rounds
  			            for (var i = 0; i < 80; i++) {
  			                var Wil;
  			                var Wih;

  			                // Shortcut
  			                var Wi = W[i];

  			                // Extend message
  			                if (i < 16) {
  			                    Wih = Wi.high = M[offset + i * 2]     | 0;
  			                    Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
  			                } else {
  			                    // Gamma0
  			                    var gamma0x  = W[i - 15];
  			                    var gamma0xh = gamma0x.high;
  			                    var gamma0xl = gamma0x.low;
  			                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
  			                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

  			                    // Gamma1
  			                    var gamma1x  = W[i - 2];
  			                    var gamma1xh = gamma1x.high;
  			                    var gamma1xl = gamma1x.low;
  			                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
  			                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

  			                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
  			                    var Wi7  = W[i - 7];
  			                    var Wi7h = Wi7.high;
  			                    var Wi7l = Wi7.low;

  			                    var Wi16  = W[i - 16];
  			                    var Wi16h = Wi16.high;
  			                    var Wi16l = Wi16.low;

  			                    Wil = gamma0l + Wi7l;
  			                    Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
  			                    Wil = Wil + gamma1l;
  			                    Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
  			                    Wil = Wil + Wi16l;
  			                    Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

  			                    Wi.high = Wih;
  			                    Wi.low  = Wil;
  			                }

  			                var chh  = (eh & fh) ^ (~eh & gh);
  			                var chl  = (el & fl) ^ (~el & gl);
  			                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
  			                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

  			                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
  			                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
  			                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
  			                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

  			                // t1 = h + sigma1 + ch + K[i] + W[i]
  			                var Ki  = K[i];
  			                var Kih = Ki.high;
  			                var Kil = Ki.low;

  			                var t1l = hl + sigma1l;
  			                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
  			                var t1l = t1l + chl;
  			                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
  			                var t1l = t1l + Kil;
  			                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
  			                var t1l = t1l + Wil;
  			                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

  			                // t2 = sigma0 + maj
  			                var t2l = sigma0l + majl;
  			                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

  			                // Update working variables
  			                hh = gh;
  			                hl = gl;
  			                gh = fh;
  			                gl = fl;
  			                fh = eh;
  			                fl = el;
  			                el = (dl + t1l) | 0;
  			                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
  			                dh = ch;
  			                dl = cl;
  			                ch = bh;
  			                cl = bl;
  			                bh = ah;
  			                bl = al;
  			                al = (t1l + t2l) | 0;
  			                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
  			            }

  			            // Intermediate hash value
  			            H0l = H0.low  = (H0l + al);
  			            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
  			            H1l = H1.low  = (H1l + bl);
  			            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
  			            H2l = H2.low  = (H2l + cl);
  			            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
  			            H3l = H3.low  = (H3l + dl);
  			            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
  			            H4l = H4.low  = (H4l + el);
  			            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
  			            H5l = H5.low  = (H5l + fl);
  			            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
  			            H6l = H6.low  = (H6l + gl);
  			            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
  			            H7l = H7.low  = (H7l + hl);
  			            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
  			        },

  			        _doFinalize: function () {
  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;

  			            var nBitsTotal = this._nDataBytes * 8;
  			            var nBitsLeft = data.sigBytes * 8;

  			            // Add padding
  			            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  			            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
  			            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
  			            data.sigBytes = dataWords.length * 4;

  			            // Hash final blocks
  			            this._process();

  			            // Convert hash to 32-bit word array before returning
  			            var hash = this._hash.toX32();

  			            // Return final computed hash
  			            return hash;
  			        },

  			        clone: function () {
  			            var clone = Hasher.clone.call(this);
  			            clone._hash = this._hash.clone();

  			            return clone;
  			        },

  			        blockSize: 1024/32
  			    });

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.SHA512('message');
  			     *     var hash = CryptoJS.SHA512(wordArray);
  			     */
  			    C.SHA512 = Hasher._createHelper(SHA512);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacSHA512(message, key);
  			     */
  			    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
  			}());


  			return CryptoJS.SHA512;

  		})); 
  	} (sha512));
  	return sha512.exports;
  }

  var sha384 = {exports: {}};

  var hasRequiredSha384;

  function requireSha384 () {
  	if (hasRequiredSha384) return sha384.exports;
  	hasRequiredSha384 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireX64Core(), requireSha512());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_x64 = C.x64;
  			    var X64Word = C_x64.Word;
  			    var X64WordArray = C_x64.WordArray;
  			    var C_algo = C.algo;
  			    var SHA512 = C_algo.SHA512;

  			    /**
  			     * SHA-384 hash algorithm.
  			     */
  			    var SHA384 = C_algo.SHA384 = SHA512.extend({
  			        _doReset: function () {
  			            this._hash = new X64WordArray.init([
  			                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
  			                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
  			                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
  			                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
  			            ]);
  			        },

  			        _doFinalize: function () {
  			            var hash = SHA512._doFinalize.call(this);

  			            hash.sigBytes -= 16;

  			            return hash;
  			        }
  			    });

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.SHA384('message');
  			     *     var hash = CryptoJS.SHA384(wordArray);
  			     */
  			    C.SHA384 = SHA512._createHelper(SHA384);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacSHA384(message, key);
  			     */
  			    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
  			}());


  			return CryptoJS.SHA384;

  		})); 
  	} (sha384));
  	return sha384.exports;
  }

  var sha3 = {exports: {}};

  var hasRequiredSha3;

  function requireSha3 () {
  	if (hasRequiredSha3) return sha3.exports;
  	hasRequiredSha3 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireX64Core());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function (Math) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var Hasher = C_lib.Hasher;
  			    var C_x64 = C.x64;
  			    var X64Word = C_x64.Word;
  			    var C_algo = C.algo;

  			    // Constants tables
  			    var RHO_OFFSETS = [];
  			    var PI_INDEXES  = [];
  			    var ROUND_CONSTANTS = [];

  			    // Compute Constants
  			    (function () {
  			        // Compute rho offset constants
  			        var x = 1, y = 0;
  			        for (var t = 0; t < 24; t++) {
  			            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

  			            var newX = y % 5;
  			            var newY = (2 * x + 3 * y) % 5;
  			            x = newX;
  			            y = newY;
  			        }

  			        // Compute pi index constants
  			        for (var x = 0; x < 5; x++) {
  			            for (var y = 0; y < 5; y++) {
  			                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
  			            }
  			        }

  			        // Compute round constants
  			        var LFSR = 0x01;
  			        for (var i = 0; i < 24; i++) {
  			            var roundConstantMsw = 0;
  			            var roundConstantLsw = 0;

  			            for (var j = 0; j < 7; j++) {
  			                if (LFSR & 0x01) {
  			                    var bitPosition = (1 << j) - 1;
  			                    if (bitPosition < 32) {
  			                        roundConstantLsw ^= 1 << bitPosition;
  			                    } else /* if (bitPosition >= 32) */ {
  			                        roundConstantMsw ^= 1 << (bitPosition - 32);
  			                    }
  			                }

  			                // Compute next LFSR
  			                if (LFSR & 0x80) {
  			                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
  			                    LFSR = (LFSR << 1) ^ 0x71;
  			                } else {
  			                    LFSR <<= 1;
  			                }
  			            }

  			            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
  			        }
  			    }());

  			    // Reusable objects for temporary values
  			    var T = [];
  			    (function () {
  			        for (var i = 0; i < 25; i++) {
  			            T[i] = X64Word.create();
  			        }
  			    }());

  			    /**
  			     * SHA-3 hash algorithm.
  			     */
  			    var SHA3 = C_algo.SHA3 = Hasher.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {number} outputLength
  			         *   The desired number of bits in the output hash.
  			         *   Only values permitted are: 224, 256, 384, 512.
  			         *   Default: 512
  			         */
  			        cfg: Hasher.cfg.extend({
  			            outputLength: 512
  			        }),

  			        _doReset: function () {
  			            var state = this._state = [];
  			            for (var i = 0; i < 25; i++) {
  			                state[i] = new X64Word.init();
  			            }

  			            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Shortcuts
  			            var state = this._state;
  			            var nBlockSizeLanes = this.blockSize / 2;

  			            // Absorb
  			            for (var i = 0; i < nBlockSizeLanes; i++) {
  			                // Shortcuts
  			                var M2i  = M[offset + 2 * i];
  			                var M2i1 = M[offset + 2 * i + 1];

  			                // Swap endian
  			                M2i = (
  			                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
  			                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
  			                );
  			                M2i1 = (
  			                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
  			                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
  			                );

  			                // Absorb message into state
  			                var lane = state[i];
  			                lane.high ^= M2i1;
  			                lane.low  ^= M2i;
  			            }

  			            // Rounds
  			            for (var round = 0; round < 24; round++) {
  			                // Theta
  			                for (var x = 0; x < 5; x++) {
  			                    // Mix column lanes
  			                    var tMsw = 0, tLsw = 0;
  			                    for (var y = 0; y < 5; y++) {
  			                        var lane = state[x + 5 * y];
  			                        tMsw ^= lane.high;
  			                        tLsw ^= lane.low;
  			                    }

  			                    // Temporary values
  			                    var Tx = T[x];
  			                    Tx.high = tMsw;
  			                    Tx.low  = tLsw;
  			                }
  			                for (var x = 0; x < 5; x++) {
  			                    // Shortcuts
  			                    var Tx4 = T[(x + 4) % 5];
  			                    var Tx1 = T[(x + 1) % 5];
  			                    var Tx1Msw = Tx1.high;
  			                    var Tx1Lsw = Tx1.low;

  			                    // Mix surrounding columns
  			                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
  			                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
  			                    for (var y = 0; y < 5; y++) {
  			                        var lane = state[x + 5 * y];
  			                        lane.high ^= tMsw;
  			                        lane.low  ^= tLsw;
  			                    }
  			                }

  			                // Rho Pi
  			                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
  			                    var tMsw;
  			                    var tLsw;

  			                    // Shortcuts
  			                    var lane = state[laneIndex];
  			                    var laneMsw = lane.high;
  			                    var laneLsw = lane.low;
  			                    var rhoOffset = RHO_OFFSETS[laneIndex];

  			                    // Rotate lanes
  			                    if (rhoOffset < 32) {
  			                        tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
  			                        tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
  			                    } else /* if (rhoOffset >= 32) */ {
  			                        tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
  			                        tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
  			                    }

  			                    // Transpose lanes
  			                    var TPiLane = T[PI_INDEXES[laneIndex]];
  			                    TPiLane.high = tMsw;
  			                    TPiLane.low  = tLsw;
  			                }

  			                // Rho pi at x = y = 0
  			                var T0 = T[0];
  			                var state0 = state[0];
  			                T0.high = state0.high;
  			                T0.low  = state0.low;

  			                // Chi
  			                for (var x = 0; x < 5; x++) {
  			                    for (var y = 0; y < 5; y++) {
  			                        // Shortcuts
  			                        var laneIndex = x + 5 * y;
  			                        var lane = state[laneIndex];
  			                        var TLane = T[laneIndex];
  			                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
  			                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

  			                        // Mix rows
  			                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
  			                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
  			                    }
  			                }

  			                // Iota
  			                var lane = state[0];
  			                var roundConstant = ROUND_CONSTANTS[round];
  			                lane.high ^= roundConstant.high;
  			                lane.low  ^= roundConstant.low;
  			            }
  			        },

  			        _doFinalize: function () {
  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;
  			            this._nDataBytes * 8;
  			            var nBitsLeft = data.sigBytes * 8;
  			            var blockSizeBits = this.blockSize * 32;

  			            // Add padding
  			            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
  			            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
  			            data.sigBytes = dataWords.length * 4;

  			            // Hash final blocks
  			            this._process();

  			            // Shortcuts
  			            var state = this._state;
  			            var outputLengthBytes = this.cfg.outputLength / 8;
  			            var outputLengthLanes = outputLengthBytes / 8;

  			            // Squeeze
  			            var hashWords = [];
  			            for (var i = 0; i < outputLengthLanes; i++) {
  			                // Shortcuts
  			                var lane = state[i];
  			                var laneMsw = lane.high;
  			                var laneLsw = lane.low;

  			                // Swap endian
  			                laneMsw = (
  			                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
  			                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
  			                );
  			                laneLsw = (
  			                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
  			                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
  			                );

  			                // Squeeze state to retrieve hash
  			                hashWords.push(laneLsw);
  			                hashWords.push(laneMsw);
  			            }

  			            // Return final computed hash
  			            return new WordArray.init(hashWords, outputLengthBytes);
  			        },

  			        clone: function () {
  			            var clone = Hasher.clone.call(this);

  			            var state = clone._state = this._state.slice(0);
  			            for (var i = 0; i < 25; i++) {
  			                state[i] = state[i].clone();
  			            }

  			            return clone;
  			        }
  			    });

  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.SHA3('message');
  			     *     var hash = CryptoJS.SHA3(wordArray);
  			     */
  			    C.SHA3 = Hasher._createHelper(SHA3);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacSHA3(message, key);
  			     */
  			    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
  			}(Math));


  			return CryptoJS.SHA3;

  		})); 
  	} (sha3));
  	return sha3.exports;
  }

  var ripemd160 = {exports: {}};

  var hasRequiredRipemd160;

  function requireRipemd160 () {
  	if (hasRequiredRipemd160) return ripemd160.exports;
  	hasRequiredRipemd160 = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/** @preserve
  			(c) 2012 by Cédric Mesnil. All rights reserved.

  			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

  			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

  			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  			*/

  			(function (Math) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var Hasher = C_lib.Hasher;
  			    var C_algo = C.algo;

  			    // Constants table
  			    var _zl = WordArray.create([
  			        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
  			        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
  			        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
  			        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
  			        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
  			    var _zr = WordArray.create([
  			        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
  			        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
  			        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
  			        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
  			        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
  			    var _sl = WordArray.create([
  			         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
  			        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
  			        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
  			          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
  			        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
  			    var _sr = WordArray.create([
  			        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
  			        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
  			        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
  			        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
  			        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

  			    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
  			    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

  			    /**
  			     * RIPEMD160 hash algorithm.
  			     */
  			    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
  			        _doReset: function () {
  			            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
  			        },

  			        _doProcessBlock: function (M, offset) {

  			            // Swap endian
  			            for (var i = 0; i < 16; i++) {
  			                // Shortcuts
  			                var offset_i = offset + i;
  			                var M_offset_i = M[offset_i];

  			                // Swap
  			                M[offset_i] = (
  			                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
  			                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
  			                );
  			            }
  			            // Shortcut
  			            var H  = this._hash.words;
  			            var hl = _hl.words;
  			            var hr = _hr.words;
  			            var zl = _zl.words;
  			            var zr = _zr.words;
  			            var sl = _sl.words;
  			            var sr = _sr.words;

  			            // Working variables
  			            var al, bl, cl, dl, el;
  			            var ar, br, cr, dr, er;

  			            ar = al = H[0];
  			            br = bl = H[1];
  			            cr = cl = H[2];
  			            dr = dl = H[3];
  			            er = el = H[4];
  			            // Computation
  			            var t;
  			            for (var i = 0; i < 80; i += 1) {
  			                t = (al +  M[offset+zl[i]])|0;
  			                if (i<16){
  				            t +=  f1(bl,cl,dl) + hl[0];
  			                } else if (i<32) {
  				            t +=  f2(bl,cl,dl) + hl[1];
  			                } else if (i<48) {
  				            t +=  f3(bl,cl,dl) + hl[2];
  			                } else if (i<64) {
  				            t +=  f4(bl,cl,dl) + hl[3];
  			                } else {// if (i<80) {
  				            t +=  f5(bl,cl,dl) + hl[4];
  			                }
  			                t = t|0;
  			                t =  rotl(t,sl[i]);
  			                t = (t+el)|0;
  			                al = el;
  			                el = dl;
  			                dl = rotl(cl, 10);
  			                cl = bl;
  			                bl = t;

  			                t = (ar + M[offset+zr[i]])|0;
  			                if (i<16){
  				            t +=  f5(br,cr,dr) + hr[0];
  			                } else if (i<32) {
  				            t +=  f4(br,cr,dr) + hr[1];
  			                } else if (i<48) {
  				            t +=  f3(br,cr,dr) + hr[2];
  			                } else if (i<64) {
  				            t +=  f2(br,cr,dr) + hr[3];
  			                } else {// if (i<80) {
  				            t +=  f1(br,cr,dr) + hr[4];
  			                }
  			                t = t|0;
  			                t =  rotl(t,sr[i]) ;
  			                t = (t+er)|0;
  			                ar = er;
  			                er = dr;
  			                dr = rotl(cr, 10);
  			                cr = br;
  			                br = t;
  			            }
  			            // Intermediate hash value
  			            t    = (H[1] + cl + dr)|0;
  			            H[1] = (H[2] + dl + er)|0;
  			            H[2] = (H[3] + el + ar)|0;
  			            H[3] = (H[4] + al + br)|0;
  			            H[4] = (H[0] + bl + cr)|0;
  			            H[0] =  t;
  			        },

  			        _doFinalize: function () {
  			            // Shortcuts
  			            var data = this._data;
  			            var dataWords = data.words;

  			            var nBitsTotal = this._nDataBytes * 8;
  			            var nBitsLeft = data.sigBytes * 8;

  			            // Add padding
  			            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
  			            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
  			                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
  			                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
  			            );
  			            data.sigBytes = (dataWords.length + 1) * 4;

  			            // Hash final blocks
  			            this._process();

  			            // Shortcuts
  			            var hash = this._hash;
  			            var H = hash.words;

  			            // Swap endian
  			            for (var i = 0; i < 5; i++) {
  			                // Shortcut
  			                var H_i = H[i];

  			                // Swap
  			                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
  			                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
  			            }

  			            // Return final computed hash
  			            return hash;
  			        },

  			        clone: function () {
  			            var clone = Hasher.clone.call(this);
  			            clone._hash = this._hash.clone();

  			            return clone;
  			        }
  			    });


  			    function f1(x, y, z) {
  			        return ((x) ^ (y) ^ (z));

  			    }

  			    function f2(x, y, z) {
  			        return (((x)&(y)) | ((~x)&(z)));
  			    }

  			    function f3(x, y, z) {
  			        return (((x) | (~(y))) ^ (z));
  			    }

  			    function f4(x, y, z) {
  			        return (((x) & (z)) | ((y)&(~(z))));
  			    }

  			    function f5(x, y, z) {
  			        return ((x) ^ ((y) |(~(z))));

  			    }

  			    function rotl(x,n) {
  			        return (x<<n) | (x>>>(32-n));
  			    }


  			    /**
  			     * Shortcut function to the hasher's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     *
  			     * @return {WordArray} The hash.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hash = CryptoJS.RIPEMD160('message');
  			     *     var hash = CryptoJS.RIPEMD160(wordArray);
  			     */
  			    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

  			    /**
  			     * Shortcut function to the HMAC's object interface.
  			     *
  			     * @param {WordArray|string} message The message to hash.
  			     * @param {WordArray|string} key The secret key.
  			     *
  			     * @return {WordArray} The HMAC.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
  			     */
  			    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
  			}());


  			return CryptoJS.RIPEMD160;

  		})); 
  	} (ripemd160));
  	return ripemd160.exports;
  }

  var hmac = {exports: {}};

  var hasRequiredHmac;

  function requireHmac () {
  	if (hasRequiredHmac) return hmac.exports;
  	hasRequiredHmac = 1;
  	(function (module, exports) {
  (function (root, factory) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var Base = C_lib.Base;
  			    var C_enc = C.enc;
  			    var Utf8 = C_enc.Utf8;
  			    var C_algo = C.algo;

  			    /**
  			     * HMAC algorithm.
  			     */
  			    C_algo.HMAC = Base.extend({
  			        /**
  			         * Initializes a newly created HMAC.
  			         *
  			         * @param {Hasher} hasher The hash algorithm to use.
  			         * @param {WordArray|string} key The secret key.
  			         *
  			         * @example
  			         *
  			         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
  			         */
  			        init: function (hasher, key) {
  			            // Init hasher
  			            hasher = this._hasher = new hasher.init();

  			            // Convert string to WordArray, else assume WordArray already
  			            if (typeof key == 'string') {
  			                key = Utf8.parse(key);
  			            }

  			            // Shortcuts
  			            var hasherBlockSize = hasher.blockSize;
  			            var hasherBlockSizeBytes = hasherBlockSize * 4;

  			            // Allow arbitrary length keys
  			            if (key.sigBytes > hasherBlockSizeBytes) {
  			                key = hasher.finalize(key);
  			            }

  			            // Clamp excess bits
  			            key.clamp();

  			            // Clone key for inner and outer pads
  			            var oKey = this._oKey = key.clone();
  			            var iKey = this._iKey = key.clone();

  			            // Shortcuts
  			            var oKeyWords = oKey.words;
  			            var iKeyWords = iKey.words;

  			            // XOR keys with pad constants
  			            for (var i = 0; i < hasherBlockSize; i++) {
  			                oKeyWords[i] ^= 0x5c5c5c5c;
  			                iKeyWords[i] ^= 0x36363636;
  			            }
  			            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

  			            // Set initial values
  			            this.reset();
  			        },

  			        /**
  			         * Resets this HMAC to its initial state.
  			         *
  			         * @example
  			         *
  			         *     hmacHasher.reset();
  			         */
  			        reset: function () {
  			            // Shortcut
  			            var hasher = this._hasher;

  			            // Reset
  			            hasher.reset();
  			            hasher.update(this._iKey);
  			        },

  			        /**
  			         * Updates this HMAC with a message.
  			         *
  			         * @param {WordArray|string} messageUpdate The message to append.
  			         *
  			         * @return {HMAC} This HMAC instance.
  			         *
  			         * @example
  			         *
  			         *     hmacHasher.update('message');
  			         *     hmacHasher.update(wordArray);
  			         */
  			        update: function (messageUpdate) {
  			            this._hasher.update(messageUpdate);

  			            // Chainable
  			            return this;
  			        },

  			        /**
  			         * Finalizes the HMAC computation.
  			         * Note that the finalize operation is effectively a destructive, read-once operation.
  			         *
  			         * @param {WordArray|string} messageUpdate (Optional) A final message update.
  			         *
  			         * @return {WordArray} The HMAC.
  			         *
  			         * @example
  			         *
  			         *     var hmac = hmacHasher.finalize();
  			         *     var hmac = hmacHasher.finalize('message');
  			         *     var hmac = hmacHasher.finalize(wordArray);
  			         */
  			        finalize: function (messageUpdate) {
  			            // Shortcut
  			            var hasher = this._hasher;

  			            // Compute HMAC
  			            var innerHash = hasher.finalize(messageUpdate);
  			            hasher.reset();
  			            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

  			            return hmac;
  			        }
  			    });
  			}());


  		})); 
  	} (hmac));
  	return hmac.exports;
  }

  var pbkdf2 = {exports: {}};

  var hasRequiredPbkdf2;

  function requirePbkdf2 () {
  	if (hasRequiredPbkdf2) return pbkdf2.exports;
  	hasRequiredPbkdf2 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireSha256(), requireHmac());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var Base = C_lib.Base;
  			    var WordArray = C_lib.WordArray;
  			    var C_algo = C.algo;
  			    var SHA256 = C_algo.SHA256;
  			    var HMAC = C_algo.HMAC;

  			    /**
  			     * Password-Based Key Derivation Function 2 algorithm.
  			     */
  			    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
  			         * @property {Hasher} hasher The hasher to use. Default: SHA256
  			         * @property {number} iterations The number of iterations to perform. Default: 250000
  			         */
  			        cfg: Base.extend({
  			            keySize: 128/32,
  			            hasher: SHA256,
  			            iterations: 250000
  			        }),

  			        /**
  			         * Initializes a newly created key derivation function.
  			         *
  			         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
  			         *
  			         * @example
  			         *
  			         *     var kdf = CryptoJS.algo.PBKDF2.create();
  			         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
  			         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
  			         */
  			        init: function (cfg) {
  			            this.cfg = this.cfg.extend(cfg);
  			        },

  			        /**
  			         * Computes the Password-Based Key Derivation Function 2.
  			         *
  			         * @param {WordArray|string} password The password.
  			         * @param {WordArray|string} salt A salt.
  			         *
  			         * @return {WordArray} The derived key.
  			         *
  			         * @example
  			         *
  			         *     var key = kdf.compute(password, salt);
  			         */
  			        compute: function (password, salt) {
  			            // Shortcut
  			            var cfg = this.cfg;

  			            // Init HMAC
  			            var hmac = HMAC.create(cfg.hasher, password);

  			            // Initial values
  			            var derivedKey = WordArray.create();
  			            var blockIndex = WordArray.create([0x00000001]);

  			            // Shortcuts
  			            var derivedKeyWords = derivedKey.words;
  			            var blockIndexWords = blockIndex.words;
  			            var keySize = cfg.keySize;
  			            var iterations = cfg.iterations;

  			            // Generate key
  			            while (derivedKeyWords.length < keySize) {
  			                var block = hmac.update(salt).finalize(blockIndex);
  			                hmac.reset();

  			                // Shortcuts
  			                var blockWords = block.words;
  			                var blockWordsLength = blockWords.length;

  			                // Iterations
  			                var intermediate = block;
  			                for (var i = 1; i < iterations; i++) {
  			                    intermediate = hmac.finalize(intermediate);
  			                    hmac.reset();

  			                    // Shortcut
  			                    var intermediateWords = intermediate.words;

  			                    // XOR intermediate with block
  			                    for (var j = 0; j < blockWordsLength; j++) {
  			                        blockWords[j] ^= intermediateWords[j];
  			                    }
  			                }

  			                derivedKey.concat(block);
  			                blockIndexWords[0]++;
  			            }
  			            derivedKey.sigBytes = keySize * 4;

  			            return derivedKey;
  			        }
  			    });

  			    /**
  			     * Computes the Password-Based Key Derivation Function 2.
  			     *
  			     * @param {WordArray|string} password The password.
  			     * @param {WordArray|string} salt A salt.
  			     * @param {Object} cfg (Optional) The configuration options to use for this computation.
  			     *
  			     * @return {WordArray} The derived key.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var key = CryptoJS.PBKDF2(password, salt);
  			     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
  			     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
  			     */
  			    C.PBKDF2 = function (password, salt, cfg) {
  			        return PBKDF2.create(cfg).compute(password, salt);
  			    };
  			}());


  			return CryptoJS.PBKDF2;

  		})); 
  	} (pbkdf2));
  	return pbkdf2.exports;
  }

  var evpkdf = {exports: {}};

  var hasRequiredEvpkdf;

  function requireEvpkdf () {
  	if (hasRequiredEvpkdf) return evpkdf.exports;
  	hasRequiredEvpkdf = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireSha1(), requireHmac());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var Base = C_lib.Base;
  			    var WordArray = C_lib.WordArray;
  			    var C_algo = C.algo;
  			    var MD5 = C_algo.MD5;

  			    /**
  			     * This key derivation function is meant to conform with EVP_BytesToKey.
  			     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
  			     */
  			    var EvpKDF = C_algo.EvpKDF = Base.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
  			         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
  			         * @property {number} iterations The number of iterations to perform. Default: 1
  			         */
  			        cfg: Base.extend({
  			            keySize: 128/32,
  			            hasher: MD5,
  			            iterations: 1
  			        }),

  			        /**
  			         * Initializes a newly created key derivation function.
  			         *
  			         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
  			         *
  			         * @example
  			         *
  			         *     var kdf = CryptoJS.algo.EvpKDF.create();
  			         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
  			         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
  			         */
  			        init: function (cfg) {
  			            this.cfg = this.cfg.extend(cfg);
  			        },

  			        /**
  			         * Derives a key from a password.
  			         *
  			         * @param {WordArray|string} password The password.
  			         * @param {WordArray|string} salt A salt.
  			         *
  			         * @return {WordArray} The derived key.
  			         *
  			         * @example
  			         *
  			         *     var key = kdf.compute(password, salt);
  			         */
  			        compute: function (password, salt) {
  			            var block;

  			            // Shortcut
  			            var cfg = this.cfg;

  			            // Init hasher
  			            var hasher = cfg.hasher.create();

  			            // Initial values
  			            var derivedKey = WordArray.create();

  			            // Shortcuts
  			            var derivedKeyWords = derivedKey.words;
  			            var keySize = cfg.keySize;
  			            var iterations = cfg.iterations;

  			            // Generate key
  			            while (derivedKeyWords.length < keySize) {
  			                if (block) {
  			                    hasher.update(block);
  			                }
  			                block = hasher.update(password).finalize(salt);
  			                hasher.reset();

  			                // Iterations
  			                for (var i = 1; i < iterations; i++) {
  			                    block = hasher.finalize(block);
  			                    hasher.reset();
  			                }

  			                derivedKey.concat(block);
  			            }
  			            derivedKey.sigBytes = keySize * 4;

  			            return derivedKey;
  			        }
  			    });

  			    /**
  			     * Derives a key from a password.
  			     *
  			     * @param {WordArray|string} password The password.
  			     * @param {WordArray|string} salt A salt.
  			     * @param {Object} cfg (Optional) The configuration options to use for this computation.
  			     *
  			     * @return {WordArray} The derived key.
  			     *
  			     * @static
  			     *
  			     * @example
  			     *
  			     *     var key = CryptoJS.EvpKDF(password, salt);
  			     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
  			     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
  			     */
  			    C.EvpKDF = function (password, salt, cfg) {
  			        return EvpKDF.create(cfg).compute(password, salt);
  			    };
  			}());


  			return CryptoJS.EvpKDF;

  		})); 
  	} (evpkdf));
  	return evpkdf.exports;
  }

  var cipherCore = {exports: {}};

  var hasRequiredCipherCore;

  function requireCipherCore () {
  	if (hasRequiredCipherCore) return cipherCore.exports;
  	hasRequiredCipherCore = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireEvpkdf());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * Cipher core components.
  			 */
  			CryptoJS.lib.Cipher || (function (undefined$1) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var Base = C_lib.Base;
  			    var WordArray = C_lib.WordArray;
  			    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
  			    var C_enc = C.enc;
  			    C_enc.Utf8;
  			    var Base64 = C_enc.Base64;
  			    var C_algo = C.algo;
  			    var EvpKDF = C_algo.EvpKDF;

  			    /**
  			     * Abstract base cipher template.
  			     *
  			     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
  			     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
  			     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
  			     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
  			     */
  			    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {WordArray} iv The IV to use for this operation.
  			         */
  			        cfg: Base.extend(),

  			        /**
  			         * Creates this cipher in encryption mode.
  			         *
  			         * @param {WordArray} key The key.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @return {Cipher} A cipher instance.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
  			         */
  			        createEncryptor: function (key, cfg) {
  			            return this.create(this._ENC_XFORM_MODE, key, cfg);
  			        },

  			        /**
  			         * Creates this cipher in decryption mode.
  			         *
  			         * @param {WordArray} key The key.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @return {Cipher} A cipher instance.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
  			         */
  			        createDecryptor: function (key, cfg) {
  			            return this.create(this._DEC_XFORM_MODE, key, cfg);
  			        },

  			        /**
  			         * Initializes a newly created cipher.
  			         *
  			         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
  			         * @param {WordArray} key The key.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @example
  			         *
  			         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
  			         */
  			        init: function (xformMode, key, cfg) {
  			            // Apply config defaults
  			            this.cfg = this.cfg.extend(cfg);

  			            // Store transform mode and key
  			            this._xformMode = xformMode;
  			            this._key = key;

  			            // Set initial values
  			            this.reset();
  			        },

  			        /**
  			         * Resets this cipher to its initial state.
  			         *
  			         * @example
  			         *
  			         *     cipher.reset();
  			         */
  			        reset: function () {
  			            // Reset data buffer
  			            BufferedBlockAlgorithm.reset.call(this);

  			            // Perform concrete-cipher logic
  			            this._doReset();
  			        },

  			        /**
  			         * Adds data to be encrypted or decrypted.
  			         *
  			         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
  			         *
  			         * @return {WordArray} The data after processing.
  			         *
  			         * @example
  			         *
  			         *     var encrypted = cipher.process('data');
  			         *     var encrypted = cipher.process(wordArray);
  			         */
  			        process: function (dataUpdate) {
  			            // Append
  			            this._append(dataUpdate);

  			            // Process available blocks
  			            return this._process();
  			        },

  			        /**
  			         * Finalizes the encryption or decryption process.
  			         * Note that the finalize operation is effectively a destructive, read-once operation.
  			         *
  			         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
  			         *
  			         * @return {WordArray} The data after final processing.
  			         *
  			         * @example
  			         *
  			         *     var encrypted = cipher.finalize();
  			         *     var encrypted = cipher.finalize('data');
  			         *     var encrypted = cipher.finalize(wordArray);
  			         */
  			        finalize: function (dataUpdate) {
  			            // Final data update
  			            if (dataUpdate) {
  			                this._append(dataUpdate);
  			            }

  			            // Perform concrete-cipher logic
  			            var finalProcessedData = this._doFinalize();

  			            return finalProcessedData;
  			        },

  			        keySize: 128/32,

  			        ivSize: 128/32,

  			        _ENC_XFORM_MODE: 1,

  			        _DEC_XFORM_MODE: 2,

  			        /**
  			         * Creates shortcut functions to a cipher's object interface.
  			         *
  			         * @param {Cipher} cipher The cipher to create a helper for.
  			         *
  			         * @return {Object} An object with encrypt and decrypt shortcut functions.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
  			         */
  			        _createHelper: (function () {
  			            function selectCipherStrategy(key) {
  			                if (typeof key == 'string') {
  			                    return PasswordBasedCipher;
  			                } else {
  			                    return SerializableCipher;
  			                }
  			            }

  			            return function (cipher) {
  			                return {
  			                    encrypt: function (message, key, cfg) {
  			                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
  			                    },

  			                    decrypt: function (ciphertext, key, cfg) {
  			                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
  			                    }
  			                };
  			            };
  			        }())
  			    });

  			    /**
  			     * Abstract base stream cipher template.
  			     *
  			     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
  			     */
  			    C_lib.StreamCipher = Cipher.extend({
  			        _doFinalize: function () {
  			            // Process partial blocks
  			            var finalProcessedBlocks = this._process(!!'flush');

  			            return finalProcessedBlocks;
  			        },

  			        blockSize: 1
  			    });

  			    /**
  			     * Mode namespace.
  			     */
  			    var C_mode = C.mode = {};

  			    /**
  			     * Abstract base block cipher mode template.
  			     */
  			    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
  			        /**
  			         * Creates this mode for encryption.
  			         *
  			         * @param {Cipher} cipher A block cipher instance.
  			         * @param {Array} iv The IV words.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
  			         */
  			        createEncryptor: function (cipher, iv) {
  			            return this.Encryptor.create(cipher, iv);
  			        },

  			        /**
  			         * Creates this mode for decryption.
  			         *
  			         * @param {Cipher} cipher A block cipher instance.
  			         * @param {Array} iv The IV words.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
  			         */
  			        createDecryptor: function (cipher, iv) {
  			            return this.Decryptor.create(cipher, iv);
  			        },

  			        /**
  			         * Initializes a newly created mode.
  			         *
  			         * @param {Cipher} cipher A block cipher instance.
  			         * @param {Array} iv The IV words.
  			         *
  			         * @example
  			         *
  			         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
  			         */
  			        init: function (cipher, iv) {
  			            this._cipher = cipher;
  			            this._iv = iv;
  			        }
  			    });

  			    /**
  			     * Cipher Block Chaining mode.
  			     */
  			    var CBC = C_mode.CBC = (function () {
  			        /**
  			         * Abstract base CBC mode.
  			         */
  			        var CBC = BlockCipherMode.extend();

  			        /**
  			         * CBC encryptor.
  			         */
  			        CBC.Encryptor = CBC.extend({
  			            /**
  			             * Processes the data block at offset.
  			             *
  			             * @param {Array} words The data words to operate on.
  			             * @param {number} offset The offset where the block starts.
  			             *
  			             * @example
  			             *
  			             *     mode.processBlock(data.words, offset);
  			             */
  			            processBlock: function (words, offset) {
  			                // Shortcuts
  			                var cipher = this._cipher;
  			                var blockSize = cipher.blockSize;

  			                // XOR and encrypt
  			                xorBlock.call(this, words, offset, blockSize);
  			                cipher.encryptBlock(words, offset);

  			                // Remember this block to use with next block
  			                this._prevBlock = words.slice(offset, offset + blockSize);
  			            }
  			        });

  			        /**
  			         * CBC decryptor.
  			         */
  			        CBC.Decryptor = CBC.extend({
  			            /**
  			             * Processes the data block at offset.
  			             *
  			             * @param {Array} words The data words to operate on.
  			             * @param {number} offset The offset where the block starts.
  			             *
  			             * @example
  			             *
  			             *     mode.processBlock(data.words, offset);
  			             */
  			            processBlock: function (words, offset) {
  			                // Shortcuts
  			                var cipher = this._cipher;
  			                var blockSize = cipher.blockSize;

  			                // Remember this block to use with next block
  			                var thisBlock = words.slice(offset, offset + blockSize);

  			                // Decrypt and XOR
  			                cipher.decryptBlock(words, offset);
  			                xorBlock.call(this, words, offset, blockSize);

  			                // This block becomes the previous block
  			                this._prevBlock = thisBlock;
  			            }
  			        });

  			        function xorBlock(words, offset, blockSize) {
  			            var block;

  			            // Shortcut
  			            var iv = this._iv;

  			            // Choose mixing block
  			            if (iv) {
  			                block = iv;

  			                // Remove IV for subsequent blocks
  			                this._iv = undefined$1;
  			            } else {
  			                block = this._prevBlock;
  			            }

  			            // XOR blocks
  			            for (var i = 0; i < blockSize; i++) {
  			                words[offset + i] ^= block[i];
  			            }
  			        }

  			        return CBC;
  			    }());

  			    /**
  			     * Padding namespace.
  			     */
  			    var C_pad = C.pad = {};

  			    /**
  			     * PKCS #5/7 padding strategy.
  			     */
  			    var Pkcs7 = C_pad.Pkcs7 = {
  			        /**
  			         * Pads data using the algorithm defined in PKCS #5/7.
  			         *
  			         * @param {WordArray} data The data to pad.
  			         * @param {number} blockSize The multiple that the data should be padded to.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
  			         */
  			        pad: function (data, blockSize) {
  			            // Shortcut
  			            var blockSizeBytes = blockSize * 4;

  			            // Count padding bytes
  			            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

  			            // Create padding word
  			            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

  			            // Create padding
  			            var paddingWords = [];
  			            for (var i = 0; i < nPaddingBytes; i += 4) {
  			                paddingWords.push(paddingWord);
  			            }
  			            var padding = WordArray.create(paddingWords, nPaddingBytes);

  			            // Add padding
  			            data.concat(padding);
  			        },

  			        /**
  			         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
  			         *
  			         * @param {WordArray} data The data to unpad.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
  			         */
  			        unpad: function (data) {
  			            // Get number of padding bytes from last byte
  			            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

  			            // Remove padding
  			            data.sigBytes -= nPaddingBytes;
  			        }
  			    };

  			    /**
  			     * Abstract base block cipher template.
  			     *
  			     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
  			     */
  			    C_lib.BlockCipher = Cipher.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {Mode} mode The block mode to use. Default: CBC
  			         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
  			         */
  			        cfg: Cipher.cfg.extend({
  			            mode: CBC,
  			            padding: Pkcs7
  			        }),

  			        reset: function () {
  			            var modeCreator;

  			            // Reset cipher
  			            Cipher.reset.call(this);

  			            // Shortcuts
  			            var cfg = this.cfg;
  			            var iv = cfg.iv;
  			            var mode = cfg.mode;

  			            // Reset block mode
  			            if (this._xformMode == this._ENC_XFORM_MODE) {
  			                modeCreator = mode.createEncryptor;
  			            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
  			                modeCreator = mode.createDecryptor;
  			                // Keep at least one block in the buffer for unpadding
  			                this._minBufferSize = 1;
  			            }

  			            if (this._mode && this._mode.__creator == modeCreator) {
  			                this._mode.init(this, iv && iv.words);
  			            } else {
  			                this._mode = modeCreator.call(mode, this, iv && iv.words);
  			                this._mode.__creator = modeCreator;
  			            }
  			        },

  			        _doProcessBlock: function (words, offset) {
  			            this._mode.processBlock(words, offset);
  			        },

  			        _doFinalize: function () {
  			            var finalProcessedBlocks;

  			            // Shortcut
  			            var padding = this.cfg.padding;

  			            // Finalize
  			            if (this._xformMode == this._ENC_XFORM_MODE) {
  			                // Pad data
  			                padding.pad(this._data, this.blockSize);

  			                // Process final blocks
  			                finalProcessedBlocks = this._process(!!'flush');
  			            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
  			                // Process final blocks
  			                finalProcessedBlocks = this._process(!!'flush');

  			                // Unpad data
  			                padding.unpad(finalProcessedBlocks);
  			            }

  			            return finalProcessedBlocks;
  			        },

  			        blockSize: 128/32
  			    });

  			    /**
  			     * A collection of cipher parameters.
  			     *
  			     * @property {WordArray} ciphertext The raw ciphertext.
  			     * @property {WordArray} key The key to this ciphertext.
  			     * @property {WordArray} iv The IV used in the ciphering operation.
  			     * @property {WordArray} salt The salt used with a key derivation function.
  			     * @property {Cipher} algorithm The cipher algorithm.
  			     * @property {Mode} mode The block mode used in the ciphering operation.
  			     * @property {Padding} padding The padding scheme used in the ciphering operation.
  			     * @property {number} blockSize The block size of the cipher.
  			     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
  			     */
  			    var CipherParams = C_lib.CipherParams = Base.extend({
  			        /**
  			         * Initializes a newly created cipher params object.
  			         *
  			         * @param {Object} cipherParams An object with any of the possible cipher parameters.
  			         *
  			         * @example
  			         *
  			         *     var cipherParams = CryptoJS.lib.CipherParams.create({
  			         *         ciphertext: ciphertextWordArray,
  			         *         key: keyWordArray,
  			         *         iv: ivWordArray,
  			         *         salt: saltWordArray,
  			         *         algorithm: CryptoJS.algo.AES,
  			         *         mode: CryptoJS.mode.CBC,
  			         *         padding: CryptoJS.pad.PKCS7,
  			         *         blockSize: 4,
  			         *         formatter: CryptoJS.format.OpenSSL
  			         *     });
  			         */
  			        init: function (cipherParams) {
  			            this.mixIn(cipherParams);
  			        },

  			        /**
  			         * Converts this cipher params object to a string.
  			         *
  			         * @param {Format} formatter (Optional) The formatting strategy to use.
  			         *
  			         * @return {string} The stringified cipher params.
  			         *
  			         * @throws Error If neither the formatter nor the default formatter is set.
  			         *
  			         * @example
  			         *
  			         *     var string = cipherParams + '';
  			         *     var string = cipherParams.toString();
  			         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
  			         */
  			        toString: function (formatter) {
  			            return (formatter || this.formatter).stringify(this);
  			        }
  			    });

  			    /**
  			     * Format namespace.
  			     */
  			    var C_format = C.format = {};

  			    /**
  			     * OpenSSL formatting strategy.
  			     */
  			    var OpenSSLFormatter = C_format.OpenSSL = {
  			        /**
  			         * Converts a cipher params object to an OpenSSL-compatible string.
  			         *
  			         * @param {CipherParams} cipherParams The cipher params object.
  			         *
  			         * @return {string} The OpenSSL-compatible string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
  			         */
  			        stringify: function (cipherParams) {
  			            var wordArray;

  			            // Shortcuts
  			            var ciphertext = cipherParams.ciphertext;
  			            var salt = cipherParams.salt;

  			            // Format
  			            if (salt) {
  			                wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
  			            } else {
  			                wordArray = ciphertext;
  			            }

  			            return wordArray.toString(Base64);
  			        },

  			        /**
  			         * Converts an OpenSSL-compatible string to a cipher params object.
  			         *
  			         * @param {string} openSSLStr The OpenSSL-compatible string.
  			         *
  			         * @return {CipherParams} The cipher params object.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
  			         */
  			        parse: function (openSSLStr) {
  			            var salt;

  			            // Parse base64
  			            var ciphertext = Base64.parse(openSSLStr);

  			            // Shortcut
  			            var ciphertextWords = ciphertext.words;

  			            // Test for salt
  			            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
  			                // Extract salt
  			                salt = WordArray.create(ciphertextWords.slice(2, 4));

  			                // Remove salt from ciphertext
  			                ciphertextWords.splice(0, 4);
  			                ciphertext.sigBytes -= 16;
  			            }

  			            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
  			        }
  			    };

  			    /**
  			     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
  			     */
  			    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
  			         */
  			        cfg: Base.extend({
  			            format: OpenSSLFormatter
  			        }),

  			        /**
  			         * Encrypts a message.
  			         *
  			         * @param {Cipher} cipher The cipher algorithm to use.
  			         * @param {WordArray|string} message The message to encrypt.
  			         * @param {WordArray} key The key.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @return {CipherParams} A cipher params object.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
  			         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
  			         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  			         */
  			        encrypt: function (cipher, message, key, cfg) {
  			            // Apply config defaults
  			            cfg = this.cfg.extend(cfg);

  			            // Encrypt
  			            var encryptor = cipher.createEncryptor(key, cfg);
  			            var ciphertext = encryptor.finalize(message);

  			            // Shortcut
  			            var cipherCfg = encryptor.cfg;

  			            // Create and return serializable cipher params
  			            return CipherParams.create({
  			                ciphertext: ciphertext,
  			                key: key,
  			                iv: cipherCfg.iv,
  			                algorithm: cipher,
  			                mode: cipherCfg.mode,
  			                padding: cipherCfg.padding,
  			                blockSize: cipher.blockSize,
  			                formatter: cfg.format
  			            });
  			        },

  			        /**
  			         * Decrypts serialized ciphertext.
  			         *
  			         * @param {Cipher} cipher The cipher algorithm to use.
  			         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
  			         * @param {WordArray} key The key.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @return {WordArray} The plaintext.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  			         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
  			         */
  			        decrypt: function (cipher, ciphertext, key, cfg) {
  			            // Apply config defaults
  			            cfg = this.cfg.extend(cfg);

  			            // Convert string to CipherParams
  			            ciphertext = this._parse(ciphertext, cfg.format);

  			            // Decrypt
  			            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

  			            return plaintext;
  			        },

  			        /**
  			         * Converts serialized ciphertext to CipherParams,
  			         * else assumed CipherParams already and returns ciphertext unchanged.
  			         *
  			         * @param {CipherParams|string} ciphertext The ciphertext.
  			         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
  			         *
  			         * @return {CipherParams} The unserialized ciphertext.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
  			         */
  			        _parse: function (ciphertext, format) {
  			            if (typeof ciphertext == 'string') {
  			                return format.parse(ciphertext, this);
  			            } else {
  			                return ciphertext;
  			            }
  			        }
  			    });

  			    /**
  			     * Key derivation function namespace.
  			     */
  			    var C_kdf = C.kdf = {};

  			    /**
  			     * OpenSSL key derivation function.
  			     */
  			    var OpenSSLKdf = C_kdf.OpenSSL = {
  			        /**
  			         * Derives a key and IV from a password.
  			         *
  			         * @param {string} password The password to derive from.
  			         * @param {number} keySize The size in words of the key to generate.
  			         * @param {number} ivSize The size in words of the IV to generate.
  			         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
  			         *
  			         * @return {CipherParams} A cipher params object with the key, IV, and salt.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
  			         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
  			         */
  			        execute: function (password, keySize, ivSize, salt, hasher) {
  			            // Generate random salt
  			            if (!salt) {
  			                salt = WordArray.random(64/8);
  			            }

  			            // Derive key and IV
  			            if (!hasher) {
  			                var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
  			            } else {
  			                var key = EvpKDF.create({ keySize: keySize + ivSize, hasher: hasher }).compute(password, salt);
  			            }


  			            // Separate key and IV
  			            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
  			            key.sigBytes = keySize * 4;

  			            // Return params
  			            return CipherParams.create({ key: key, iv: iv, salt: salt });
  			        }
  			    };

  			    /**
  			     * A serializable cipher wrapper that derives the key from a password,
  			     * and returns ciphertext as a serializable cipher params object.
  			     */
  			    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
  			         */
  			        cfg: SerializableCipher.cfg.extend({
  			            kdf: OpenSSLKdf
  			        }),

  			        /**
  			         * Encrypts a message using a password.
  			         *
  			         * @param {Cipher} cipher The cipher algorithm to use.
  			         * @param {WordArray|string} message The message to encrypt.
  			         * @param {string} password The password.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @return {CipherParams} A cipher params object.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
  			         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
  			         */
  			        encrypt: function (cipher, message, password, cfg) {
  			            // Apply config defaults
  			            cfg = this.cfg.extend(cfg);

  			            // Derive key and other params
  			            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);

  			            // Add IV to config
  			            cfg.iv = derivedParams.iv;

  			            // Encrypt
  			            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

  			            // Mix in derived params
  			            ciphertext.mixIn(derivedParams);

  			            return ciphertext;
  			        },

  			        /**
  			         * Decrypts serialized ciphertext using a password.
  			         *
  			         * @param {Cipher} cipher The cipher algorithm to use.
  			         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
  			         * @param {string} password The password.
  			         * @param {Object} cfg (Optional) The configuration options to use for this operation.
  			         *
  			         * @return {WordArray} The plaintext.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
  			         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
  			         */
  			        decrypt: function (cipher, ciphertext, password, cfg) {
  			            // Apply config defaults
  			            cfg = this.cfg.extend(cfg);

  			            // Convert string to CipherParams
  			            ciphertext = this._parse(ciphertext, cfg.format);

  			            // Derive key and other params
  			            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);

  			            // Add IV to config
  			            cfg.iv = derivedParams.iv;

  			            // Decrypt
  			            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

  			            return plaintext;
  			        }
  			    });
  			}());


  		})); 
  	} (cipherCore));
  	return cipherCore.exports;
  }

  var modeCfb = {exports: {}};

  var hasRequiredModeCfb;

  function requireModeCfb () {
  	if (hasRequiredModeCfb) return modeCfb.exports;
  	hasRequiredModeCfb = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * Cipher Feedback block mode.
  			 */
  			CryptoJS.mode.CFB = (function () {
  			    var CFB = CryptoJS.lib.BlockCipherMode.extend();

  			    CFB.Encryptor = CFB.extend({
  			        processBlock: function (words, offset) {
  			            // Shortcuts
  			            var cipher = this._cipher;
  			            var blockSize = cipher.blockSize;

  			            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

  			            // Remember this block to use with next block
  			            this._prevBlock = words.slice(offset, offset + blockSize);
  			        }
  			    });

  			    CFB.Decryptor = CFB.extend({
  			        processBlock: function (words, offset) {
  			            // Shortcuts
  			            var cipher = this._cipher;
  			            var blockSize = cipher.blockSize;

  			            // Remember this block to use with next block
  			            var thisBlock = words.slice(offset, offset + blockSize);

  			            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

  			            // This block becomes the previous block
  			            this._prevBlock = thisBlock;
  			        }
  			    });

  			    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
  			        var keystream;

  			        // Shortcut
  			        var iv = this._iv;

  			        // Generate keystream
  			        if (iv) {
  			            keystream = iv.slice(0);

  			            // Remove IV for subsequent blocks
  			            this._iv = undefined;
  			        } else {
  			            keystream = this._prevBlock;
  			        }
  			        cipher.encryptBlock(keystream, 0);

  			        // Encrypt
  			        for (var i = 0; i < blockSize; i++) {
  			            words[offset + i] ^= keystream[i];
  			        }
  			    }

  			    return CFB;
  			}());


  			return CryptoJS.mode.CFB;

  		})); 
  	} (modeCfb));
  	return modeCfb.exports;
  }

  var modeCtr = {exports: {}};

  var hasRequiredModeCtr;

  function requireModeCtr () {
  	if (hasRequiredModeCtr) return modeCtr.exports;
  	hasRequiredModeCtr = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * Counter block mode.
  			 */
  			CryptoJS.mode.CTR = (function () {
  			    var CTR = CryptoJS.lib.BlockCipherMode.extend();

  			    var Encryptor = CTR.Encryptor = CTR.extend({
  			        processBlock: function (words, offset) {
  			            // Shortcuts
  			            var cipher = this._cipher;
  			            var blockSize = cipher.blockSize;
  			            var iv = this._iv;
  			            var counter = this._counter;

  			            // Generate keystream
  			            if (iv) {
  			                counter = this._counter = iv.slice(0);

  			                // Remove IV for subsequent blocks
  			                this._iv = undefined;
  			            }
  			            var keystream = counter.slice(0);
  			            cipher.encryptBlock(keystream, 0);

  			            // Increment counter
  			            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

  			            // Encrypt
  			            for (var i = 0; i < blockSize; i++) {
  			                words[offset + i] ^= keystream[i];
  			            }
  			        }
  			    });

  			    CTR.Decryptor = Encryptor;

  			    return CTR;
  			}());


  			return CryptoJS.mode.CTR;

  		})); 
  	} (modeCtr));
  	return modeCtr.exports;
  }

  var modeCtrGladman = {exports: {}};

  var hasRequiredModeCtrGladman;

  function requireModeCtrGladman () {
  	if (hasRequiredModeCtrGladman) return modeCtrGladman.exports;
  	hasRequiredModeCtrGladman = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/** @preserve
  			 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
  			 * derived from CryptoJS.mode.CTR
  			 * Jan Hruby jhruby.web@gmail.com
  			 */
  			CryptoJS.mode.CTRGladman = (function () {
  			    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

  				function incWord(word)
  				{
  					if (((word >> 24) & 0xff) === 0xff) { //overflow
  					var b1 = (word >> 16)&0xff;
  					var b2 = (word >> 8)&0xff;
  					var b3 = word & 0xff;

  					if (b1 === 0xff) // overflow b1
  					{
  					b1 = 0;
  					if (b2 === 0xff)
  					{
  						b2 = 0;
  						if (b3 === 0xff)
  						{
  							b3 = 0;
  						}
  						else
  						{
  							++b3;
  						}
  					}
  					else
  					{
  						++b2;
  					}
  					}
  					else
  					{
  					++b1;
  					}

  					word = 0;
  					word += (b1 << 16);
  					word += (b2 << 8);
  					word += b3;
  					}
  					else
  					{
  					word += (0x01 << 24);
  					}
  					return word;
  				}

  				function incCounter(counter)
  				{
  					if ((counter[0] = incWord(counter[0])) === 0)
  					{
  						// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
  						counter[1] = incWord(counter[1]);
  					}
  					return counter;
  				}

  			    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
  			        processBlock: function (words, offset) {
  			            // Shortcuts
  			            var cipher = this._cipher;
  			            var blockSize = cipher.blockSize;
  			            var iv = this._iv;
  			            var counter = this._counter;

  			            // Generate keystream
  			            if (iv) {
  			                counter = this._counter = iv.slice(0);

  			                // Remove IV for subsequent blocks
  			                this._iv = undefined;
  			            }

  						incCounter(counter);

  						var keystream = counter.slice(0);
  			            cipher.encryptBlock(keystream, 0);

  			            // Encrypt
  			            for (var i = 0; i < blockSize; i++) {
  			                words[offset + i] ^= keystream[i];
  			            }
  			        }
  			    });

  			    CTRGladman.Decryptor = Encryptor;

  			    return CTRGladman;
  			}());




  			return CryptoJS.mode.CTRGladman;

  		})); 
  	} (modeCtrGladman));
  	return modeCtrGladman.exports;
  }

  var modeOfb = {exports: {}};

  var hasRequiredModeOfb;

  function requireModeOfb () {
  	if (hasRequiredModeOfb) return modeOfb.exports;
  	hasRequiredModeOfb = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * Output Feedback block mode.
  			 */
  			CryptoJS.mode.OFB = (function () {
  			    var OFB = CryptoJS.lib.BlockCipherMode.extend();

  			    var Encryptor = OFB.Encryptor = OFB.extend({
  			        processBlock: function (words, offset) {
  			            // Shortcuts
  			            var cipher = this._cipher;
  			            var blockSize = cipher.blockSize;
  			            var iv = this._iv;
  			            var keystream = this._keystream;

  			            // Generate keystream
  			            if (iv) {
  			                keystream = this._keystream = iv.slice(0);

  			                // Remove IV for subsequent blocks
  			                this._iv = undefined;
  			            }
  			            cipher.encryptBlock(keystream, 0);

  			            // Encrypt
  			            for (var i = 0; i < blockSize; i++) {
  			                words[offset + i] ^= keystream[i];
  			            }
  			        }
  			    });

  			    OFB.Decryptor = Encryptor;

  			    return OFB;
  			}());


  			return CryptoJS.mode.OFB;

  		})); 
  	} (modeOfb));
  	return modeOfb.exports;
  }

  var modeEcb = {exports: {}};

  var hasRequiredModeEcb;

  function requireModeEcb () {
  	if (hasRequiredModeEcb) return modeEcb.exports;
  	hasRequiredModeEcb = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * Electronic Codebook block mode.
  			 */
  			CryptoJS.mode.ECB = (function () {
  			    var ECB = CryptoJS.lib.BlockCipherMode.extend();

  			    ECB.Encryptor = ECB.extend({
  			        processBlock: function (words, offset) {
  			            this._cipher.encryptBlock(words, offset);
  			        }
  			    });

  			    ECB.Decryptor = ECB.extend({
  			        processBlock: function (words, offset) {
  			            this._cipher.decryptBlock(words, offset);
  			        }
  			    });

  			    return ECB;
  			}());


  			return CryptoJS.mode.ECB;

  		})); 
  	} (modeEcb));
  	return modeEcb.exports;
  }

  var padAnsix923 = {exports: {}};

  var hasRequiredPadAnsix923;

  function requirePadAnsix923 () {
  	if (hasRequiredPadAnsix923) return padAnsix923.exports;
  	hasRequiredPadAnsix923 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * ANSI X.923 padding strategy.
  			 */
  			CryptoJS.pad.AnsiX923 = {
  			    pad: function (data, blockSize) {
  			        // Shortcuts
  			        var dataSigBytes = data.sigBytes;
  			        var blockSizeBytes = blockSize * 4;

  			        // Count padding bytes
  			        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

  			        // Compute last byte position
  			        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

  			        // Pad
  			        data.clamp();
  			        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
  			        data.sigBytes += nPaddingBytes;
  			    },

  			    unpad: function (data) {
  			        // Get number of padding bytes from last byte
  			        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

  			        // Remove padding
  			        data.sigBytes -= nPaddingBytes;
  			    }
  			};


  			return CryptoJS.pad.Ansix923;

  		})); 
  	} (padAnsix923));
  	return padAnsix923.exports;
  }

  var padIso10126 = {exports: {}};

  var hasRequiredPadIso10126;

  function requirePadIso10126 () {
  	if (hasRequiredPadIso10126) return padIso10126.exports;
  	hasRequiredPadIso10126 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * ISO 10126 padding strategy.
  			 */
  			CryptoJS.pad.Iso10126 = {
  			    pad: function (data, blockSize) {
  			        // Shortcut
  			        var blockSizeBytes = blockSize * 4;

  			        // Count padding bytes
  			        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

  			        // Pad
  			        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
  			             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
  			    },

  			    unpad: function (data) {
  			        // Get number of padding bytes from last byte
  			        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

  			        // Remove padding
  			        data.sigBytes -= nPaddingBytes;
  			    }
  			};


  			return CryptoJS.pad.Iso10126;

  		})); 
  	} (padIso10126));
  	return padIso10126.exports;
  }

  var padIso97971 = {exports: {}};

  var hasRequiredPadIso97971;

  function requirePadIso97971 () {
  	if (hasRequiredPadIso97971) return padIso97971.exports;
  	hasRequiredPadIso97971 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * ISO/IEC 9797-1 Padding Method 2.
  			 */
  			CryptoJS.pad.Iso97971 = {
  			    pad: function (data, blockSize) {
  			        // Add 0x80 byte
  			        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

  			        // Zero pad the rest
  			        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
  			    },

  			    unpad: function (data) {
  			        // Remove zero padding
  			        CryptoJS.pad.ZeroPadding.unpad(data);

  			        // Remove one more byte -- the 0x80 byte
  			        data.sigBytes--;
  			    }
  			};


  			return CryptoJS.pad.Iso97971;

  		})); 
  	} (padIso97971));
  	return padIso97971.exports;
  }

  var padZeropadding = {exports: {}};

  var hasRequiredPadZeropadding;

  function requirePadZeropadding () {
  	if (hasRequiredPadZeropadding) return padZeropadding.exports;
  	hasRequiredPadZeropadding = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * Zero padding strategy.
  			 */
  			CryptoJS.pad.ZeroPadding = {
  			    pad: function (data, blockSize) {
  			        // Shortcut
  			        var blockSizeBytes = blockSize * 4;

  			        // Pad
  			        data.clamp();
  			        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
  			    },

  			    unpad: function (data) {
  			        // Shortcut
  			        var dataWords = data.words;

  			        // Unpad
  			        var i = data.sigBytes - 1;
  			        for (var i = data.sigBytes - 1; i >= 0; i--) {
  			            if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
  			                data.sigBytes = i + 1;
  			                break;
  			            }
  			        }
  			    }
  			};


  			return CryptoJS.pad.ZeroPadding;

  		})); 
  	} (padZeropadding));
  	return padZeropadding.exports;
  }

  var padNopadding = {exports: {}};

  var hasRequiredPadNopadding;

  function requirePadNopadding () {
  	if (hasRequiredPadNopadding) return padNopadding.exports;
  	hasRequiredPadNopadding = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			/**
  			 * A noop padding strategy.
  			 */
  			CryptoJS.pad.NoPadding = {
  			    pad: function () {
  			    },

  			    unpad: function () {
  			    }
  			};


  			return CryptoJS.pad.NoPadding;

  		})); 
  	} (padNopadding));
  	return padNopadding.exports;
  }

  var formatHex = {exports: {}};

  var hasRequiredFormatHex;

  function requireFormatHex () {
  	if (hasRequiredFormatHex) return formatHex.exports;
  	hasRequiredFormatHex = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function (undefined$1) {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var CipherParams = C_lib.CipherParams;
  			    var C_enc = C.enc;
  			    var Hex = C_enc.Hex;
  			    var C_format = C.format;

  			    C_format.Hex = {
  			        /**
  			         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
  			         *
  			         * @param {CipherParams} cipherParams The cipher params object.
  			         *
  			         * @return {string} The hexadecimally encoded string.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
  			         */
  			        stringify: function (cipherParams) {
  			            return cipherParams.ciphertext.toString(Hex);
  			        },

  			        /**
  			         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
  			         *
  			         * @param {string} input The hexadecimally encoded string.
  			         *
  			         * @return {CipherParams} The cipher params object.
  			         *
  			         * @static
  			         *
  			         * @example
  			         *
  			         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
  			         */
  			        parse: function (input) {
  			            var ciphertext = Hex.parse(input);
  			            return CipherParams.create({ ciphertext: ciphertext });
  			        }
  			    };
  			}());


  			return CryptoJS.format.Hex;

  		})); 
  	} (formatHex));
  	return formatHex.exports;
  }

  var aes = {exports: {}};

  var hasRequiredAes;

  function requireAes () {
  	if (hasRequiredAes) return aes.exports;
  	hasRequiredAes = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), encBase64Exports, requireMd5(), requireEvpkdf(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var BlockCipher = C_lib.BlockCipher;
  			    var C_algo = C.algo;

  			    // Lookup tables
  			    var SBOX = [];
  			    var INV_SBOX = [];
  			    var SUB_MIX_0 = [];
  			    var SUB_MIX_1 = [];
  			    var SUB_MIX_2 = [];
  			    var SUB_MIX_3 = [];
  			    var INV_SUB_MIX_0 = [];
  			    var INV_SUB_MIX_1 = [];
  			    var INV_SUB_MIX_2 = [];
  			    var INV_SUB_MIX_3 = [];

  			    // Compute lookup tables
  			    (function () {
  			        // Compute double table
  			        var d = [];
  			        for (var i = 0; i < 256; i++) {
  			            if (i < 128) {
  			                d[i] = i << 1;
  			            } else {
  			                d[i] = (i << 1) ^ 0x11b;
  			            }
  			        }

  			        // Walk GF(2^8)
  			        var x = 0;
  			        var xi = 0;
  			        for (var i = 0; i < 256; i++) {
  			            // Compute sbox
  			            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
  			            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
  			            SBOX[x] = sx;
  			            INV_SBOX[sx] = x;

  			            // Compute multiplication
  			            var x2 = d[x];
  			            var x4 = d[x2];
  			            var x8 = d[x4];

  			            // Compute sub bytes, mix columns tables
  			            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
  			            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
  			            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
  			            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
  			            SUB_MIX_3[x] = t;

  			            // Compute inv sub bytes, inv mix columns tables
  			            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
  			            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
  			            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
  			            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
  			            INV_SUB_MIX_3[sx] = t;

  			            // Compute next counter
  			            if (!x) {
  			                x = xi = 1;
  			            } else {
  			                x = x2 ^ d[d[d[x8 ^ x2]]];
  			                xi ^= d[d[xi]];
  			            }
  			        }
  			    }());

  			    // Precomputed Rcon lookup
  			    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

  			    /**
  			     * AES block cipher algorithm.
  			     */
  			    var AES = C_algo.AES = BlockCipher.extend({
  			        _doReset: function () {
  			            var t;

  			            // Skip reset of nRounds has been set before and key did not change
  			            if (this._nRounds && this._keyPriorReset === this._key) {
  			                return;
  			            }

  			            // Shortcuts
  			            var key = this._keyPriorReset = this._key;
  			            var keyWords = key.words;
  			            var keySize = key.sigBytes / 4;

  			            // Compute number of rounds
  			            var nRounds = this._nRounds = keySize + 6;

  			            // Compute number of key schedule rows
  			            var ksRows = (nRounds + 1) * 4;

  			            // Compute key schedule
  			            var keySchedule = this._keySchedule = [];
  			            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
  			                if (ksRow < keySize) {
  			                    keySchedule[ksRow] = keyWords[ksRow];
  			                } else {
  			                    t = keySchedule[ksRow - 1];

  			                    if (!(ksRow % keySize)) {
  			                        // Rot word
  			                        t = (t << 8) | (t >>> 24);

  			                        // Sub word
  			                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

  			                        // Mix Rcon
  			                        t ^= RCON[(ksRow / keySize) | 0] << 24;
  			                    } else if (keySize > 6 && ksRow % keySize == 4) {
  			                        // Sub word
  			                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
  			                    }

  			                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
  			                }
  			            }

  			            // Compute inv key schedule
  			            var invKeySchedule = this._invKeySchedule = [];
  			            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
  			                var ksRow = ksRows - invKsRow;

  			                if (invKsRow % 4) {
  			                    var t = keySchedule[ksRow];
  			                } else {
  			                    var t = keySchedule[ksRow - 4];
  			                }

  			                if (invKsRow < 4 || ksRow <= 4) {
  			                    invKeySchedule[invKsRow] = t;
  			                } else {
  			                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
  			                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
  			                }
  			            }
  			        },

  			        encryptBlock: function (M, offset) {
  			            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
  			        },

  			        decryptBlock: function (M, offset) {
  			            // Swap 2nd and 4th rows
  			            var t = M[offset + 1];
  			            M[offset + 1] = M[offset + 3];
  			            M[offset + 3] = t;

  			            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

  			            // Inv swap 2nd and 4th rows
  			            var t = M[offset + 1];
  			            M[offset + 1] = M[offset + 3];
  			            M[offset + 3] = t;
  			        },

  			        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
  			            // Shortcut
  			            var nRounds = this._nRounds;

  			            // Get input, add round key
  			            var s0 = M[offset]     ^ keySchedule[0];
  			            var s1 = M[offset + 1] ^ keySchedule[1];
  			            var s2 = M[offset + 2] ^ keySchedule[2];
  			            var s3 = M[offset + 3] ^ keySchedule[3];

  			            // Key schedule row counter
  			            var ksRow = 4;

  			            // Rounds
  			            for (var round = 1; round < nRounds; round++) {
  			                // Shift rows, sub bytes, mix columns, add round key
  			                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
  			                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
  			                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
  			                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

  			                // Update state
  			                s0 = t0;
  			                s1 = t1;
  			                s2 = t2;
  			                s3 = t3;
  			            }

  			            // Shift rows, sub bytes, add round key
  			            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
  			            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
  			            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
  			            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

  			            // Set output
  			            M[offset]     = t0;
  			            M[offset + 1] = t1;
  			            M[offset + 2] = t2;
  			            M[offset + 3] = t3;
  			        },

  			        keySize: 256/32
  			    });

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
  			     */
  			    C.AES = BlockCipher._createHelper(AES);
  			}());


  			return CryptoJS.AES;

  		})); 
  	} (aes));
  	return aes.exports;
  }

  var tripledes = {exports: {}};

  var hasRequiredTripledes;

  function requireTripledes () {
  	if (hasRequiredTripledes) return tripledes.exports;
  	hasRequiredTripledes = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), encBase64Exports, requireMd5(), requireEvpkdf(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var WordArray = C_lib.WordArray;
  			    var BlockCipher = C_lib.BlockCipher;
  			    var C_algo = C.algo;

  			    // Permuted Choice 1 constants
  			    var PC1 = [
  			        57, 49, 41, 33, 25, 17, 9,  1,
  			        58, 50, 42, 34, 26, 18, 10, 2,
  			        59, 51, 43, 35, 27, 19, 11, 3,
  			        60, 52, 44, 36, 63, 55, 47, 39,
  			        31, 23, 15, 7,  62, 54, 46, 38,
  			        30, 22, 14, 6,  61, 53, 45, 37,
  			        29, 21, 13, 5,  28, 20, 12, 4
  			    ];

  			    // Permuted Choice 2 constants
  			    var PC2 = [
  			        14, 17, 11, 24, 1,  5,
  			        3,  28, 15, 6,  21, 10,
  			        23, 19, 12, 4,  26, 8,
  			        16, 7,  27, 20, 13, 2,
  			        41, 52, 31, 37, 47, 55,
  			        30, 40, 51, 45, 33, 48,
  			        44, 49, 39, 56, 34, 53,
  			        46, 42, 50, 36, 29, 32
  			    ];

  			    // Cumulative bit shift constants
  			    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

  			    // SBOXes and round permutation constants
  			    var SBOX_P = [
  			        {
  			            0x0: 0x808200,
  			            0x10000000: 0x8000,
  			            0x20000000: 0x808002,
  			            0x30000000: 0x2,
  			            0x40000000: 0x200,
  			            0x50000000: 0x808202,
  			            0x60000000: 0x800202,
  			            0x70000000: 0x800000,
  			            0x80000000: 0x202,
  			            0x90000000: 0x800200,
  			            0xa0000000: 0x8200,
  			            0xb0000000: 0x808000,
  			            0xc0000000: 0x8002,
  			            0xd0000000: 0x800002,
  			            0xe0000000: 0x0,
  			            0xf0000000: 0x8202,
  			            0x8000000: 0x0,
  			            0x18000000: 0x808202,
  			            0x28000000: 0x8202,
  			            0x38000000: 0x8000,
  			            0x48000000: 0x808200,
  			            0x58000000: 0x200,
  			            0x68000000: 0x808002,
  			            0x78000000: 0x2,
  			            0x88000000: 0x800200,
  			            0x98000000: 0x8200,
  			            0xa8000000: 0x808000,
  			            0xb8000000: 0x800202,
  			            0xc8000000: 0x800002,
  			            0xd8000000: 0x8002,
  			            0xe8000000: 0x202,
  			            0xf8000000: 0x800000,
  			            0x1: 0x8000,
  			            0x10000001: 0x2,
  			            0x20000001: 0x808200,
  			            0x30000001: 0x800000,
  			            0x40000001: 0x808002,
  			            0x50000001: 0x8200,
  			            0x60000001: 0x200,
  			            0x70000001: 0x800202,
  			            0x80000001: 0x808202,
  			            0x90000001: 0x808000,
  			            0xa0000001: 0x800002,
  			            0xb0000001: 0x8202,
  			            0xc0000001: 0x202,
  			            0xd0000001: 0x800200,
  			            0xe0000001: 0x8002,
  			            0xf0000001: 0x0,
  			            0x8000001: 0x808202,
  			            0x18000001: 0x808000,
  			            0x28000001: 0x800000,
  			            0x38000001: 0x200,
  			            0x48000001: 0x8000,
  			            0x58000001: 0x800002,
  			            0x68000001: 0x2,
  			            0x78000001: 0x8202,
  			            0x88000001: 0x8002,
  			            0x98000001: 0x800202,
  			            0xa8000001: 0x202,
  			            0xb8000001: 0x808200,
  			            0xc8000001: 0x800200,
  			            0xd8000001: 0x0,
  			            0xe8000001: 0x8200,
  			            0xf8000001: 0x808002
  			        },
  			        {
  			            0x0: 0x40084010,
  			            0x1000000: 0x4000,
  			            0x2000000: 0x80000,
  			            0x3000000: 0x40080010,
  			            0x4000000: 0x40000010,
  			            0x5000000: 0x40084000,
  			            0x6000000: 0x40004000,
  			            0x7000000: 0x10,
  			            0x8000000: 0x84000,
  			            0x9000000: 0x40004010,
  			            0xa000000: 0x40000000,
  			            0xb000000: 0x84010,
  			            0xc000000: 0x80010,
  			            0xd000000: 0x0,
  			            0xe000000: 0x4010,
  			            0xf000000: 0x40080000,
  			            0x800000: 0x40004000,
  			            0x1800000: 0x84010,
  			            0x2800000: 0x10,
  			            0x3800000: 0x40004010,
  			            0x4800000: 0x40084010,
  			            0x5800000: 0x40000000,
  			            0x6800000: 0x80000,
  			            0x7800000: 0x40080010,
  			            0x8800000: 0x80010,
  			            0x9800000: 0x0,
  			            0xa800000: 0x4000,
  			            0xb800000: 0x40080000,
  			            0xc800000: 0x40000010,
  			            0xd800000: 0x84000,
  			            0xe800000: 0x40084000,
  			            0xf800000: 0x4010,
  			            0x10000000: 0x0,
  			            0x11000000: 0x40080010,
  			            0x12000000: 0x40004010,
  			            0x13000000: 0x40084000,
  			            0x14000000: 0x40080000,
  			            0x15000000: 0x10,
  			            0x16000000: 0x84010,
  			            0x17000000: 0x4000,
  			            0x18000000: 0x4010,
  			            0x19000000: 0x80000,
  			            0x1a000000: 0x80010,
  			            0x1b000000: 0x40000010,
  			            0x1c000000: 0x84000,
  			            0x1d000000: 0x40004000,
  			            0x1e000000: 0x40000000,
  			            0x1f000000: 0x40084010,
  			            0x10800000: 0x84010,
  			            0x11800000: 0x80000,
  			            0x12800000: 0x40080000,
  			            0x13800000: 0x4000,
  			            0x14800000: 0x40004000,
  			            0x15800000: 0x40084010,
  			            0x16800000: 0x10,
  			            0x17800000: 0x40000000,
  			            0x18800000: 0x40084000,
  			            0x19800000: 0x40000010,
  			            0x1a800000: 0x40004010,
  			            0x1b800000: 0x80010,
  			            0x1c800000: 0x0,
  			            0x1d800000: 0x4010,
  			            0x1e800000: 0x40080010,
  			            0x1f800000: 0x84000
  			        },
  			        {
  			            0x0: 0x104,
  			            0x100000: 0x0,
  			            0x200000: 0x4000100,
  			            0x300000: 0x10104,
  			            0x400000: 0x10004,
  			            0x500000: 0x4000004,
  			            0x600000: 0x4010104,
  			            0x700000: 0x4010000,
  			            0x800000: 0x4000000,
  			            0x900000: 0x4010100,
  			            0xa00000: 0x10100,
  			            0xb00000: 0x4010004,
  			            0xc00000: 0x4000104,
  			            0xd00000: 0x10000,
  			            0xe00000: 0x4,
  			            0xf00000: 0x100,
  			            0x80000: 0x4010100,
  			            0x180000: 0x4010004,
  			            0x280000: 0x0,
  			            0x380000: 0x4000100,
  			            0x480000: 0x4000004,
  			            0x580000: 0x10000,
  			            0x680000: 0x10004,
  			            0x780000: 0x104,
  			            0x880000: 0x4,
  			            0x980000: 0x100,
  			            0xa80000: 0x4010000,
  			            0xb80000: 0x10104,
  			            0xc80000: 0x10100,
  			            0xd80000: 0x4000104,
  			            0xe80000: 0x4010104,
  			            0xf80000: 0x4000000,
  			            0x1000000: 0x4010100,
  			            0x1100000: 0x10004,
  			            0x1200000: 0x10000,
  			            0x1300000: 0x4000100,
  			            0x1400000: 0x100,
  			            0x1500000: 0x4010104,
  			            0x1600000: 0x4000004,
  			            0x1700000: 0x0,
  			            0x1800000: 0x4000104,
  			            0x1900000: 0x4000000,
  			            0x1a00000: 0x4,
  			            0x1b00000: 0x10100,
  			            0x1c00000: 0x4010000,
  			            0x1d00000: 0x104,
  			            0x1e00000: 0x10104,
  			            0x1f00000: 0x4010004,
  			            0x1080000: 0x4000000,
  			            0x1180000: 0x104,
  			            0x1280000: 0x4010100,
  			            0x1380000: 0x0,
  			            0x1480000: 0x10004,
  			            0x1580000: 0x4000100,
  			            0x1680000: 0x100,
  			            0x1780000: 0x4010004,
  			            0x1880000: 0x10000,
  			            0x1980000: 0x4010104,
  			            0x1a80000: 0x10104,
  			            0x1b80000: 0x4000004,
  			            0x1c80000: 0x4000104,
  			            0x1d80000: 0x4010000,
  			            0x1e80000: 0x4,
  			            0x1f80000: 0x10100
  			        },
  			        {
  			            0x0: 0x80401000,
  			            0x10000: 0x80001040,
  			            0x20000: 0x401040,
  			            0x30000: 0x80400000,
  			            0x40000: 0x0,
  			            0x50000: 0x401000,
  			            0x60000: 0x80000040,
  			            0x70000: 0x400040,
  			            0x80000: 0x80000000,
  			            0x90000: 0x400000,
  			            0xa0000: 0x40,
  			            0xb0000: 0x80001000,
  			            0xc0000: 0x80400040,
  			            0xd0000: 0x1040,
  			            0xe0000: 0x1000,
  			            0xf0000: 0x80401040,
  			            0x8000: 0x80001040,
  			            0x18000: 0x40,
  			            0x28000: 0x80400040,
  			            0x38000: 0x80001000,
  			            0x48000: 0x401000,
  			            0x58000: 0x80401040,
  			            0x68000: 0x0,
  			            0x78000: 0x80400000,
  			            0x88000: 0x1000,
  			            0x98000: 0x80401000,
  			            0xa8000: 0x400000,
  			            0xb8000: 0x1040,
  			            0xc8000: 0x80000000,
  			            0xd8000: 0x400040,
  			            0xe8000: 0x401040,
  			            0xf8000: 0x80000040,
  			            0x100000: 0x400040,
  			            0x110000: 0x401000,
  			            0x120000: 0x80000040,
  			            0x130000: 0x0,
  			            0x140000: 0x1040,
  			            0x150000: 0x80400040,
  			            0x160000: 0x80401000,
  			            0x170000: 0x80001040,
  			            0x180000: 0x80401040,
  			            0x190000: 0x80000000,
  			            0x1a0000: 0x80400000,
  			            0x1b0000: 0x401040,
  			            0x1c0000: 0x80001000,
  			            0x1d0000: 0x400000,
  			            0x1e0000: 0x40,
  			            0x1f0000: 0x1000,
  			            0x108000: 0x80400000,
  			            0x118000: 0x80401040,
  			            0x128000: 0x0,
  			            0x138000: 0x401000,
  			            0x148000: 0x400040,
  			            0x158000: 0x80000000,
  			            0x168000: 0x80001040,
  			            0x178000: 0x40,
  			            0x188000: 0x80000040,
  			            0x198000: 0x1000,
  			            0x1a8000: 0x80001000,
  			            0x1b8000: 0x80400040,
  			            0x1c8000: 0x1040,
  			            0x1d8000: 0x80401000,
  			            0x1e8000: 0x400000,
  			            0x1f8000: 0x401040
  			        },
  			        {
  			            0x0: 0x80,
  			            0x1000: 0x1040000,
  			            0x2000: 0x40000,
  			            0x3000: 0x20000000,
  			            0x4000: 0x20040080,
  			            0x5000: 0x1000080,
  			            0x6000: 0x21000080,
  			            0x7000: 0x40080,
  			            0x8000: 0x1000000,
  			            0x9000: 0x20040000,
  			            0xa000: 0x20000080,
  			            0xb000: 0x21040080,
  			            0xc000: 0x21040000,
  			            0xd000: 0x0,
  			            0xe000: 0x1040080,
  			            0xf000: 0x21000000,
  			            0x800: 0x1040080,
  			            0x1800: 0x21000080,
  			            0x2800: 0x80,
  			            0x3800: 0x1040000,
  			            0x4800: 0x40000,
  			            0x5800: 0x20040080,
  			            0x6800: 0x21040000,
  			            0x7800: 0x20000000,
  			            0x8800: 0x20040000,
  			            0x9800: 0x0,
  			            0xa800: 0x21040080,
  			            0xb800: 0x1000080,
  			            0xc800: 0x20000080,
  			            0xd800: 0x21000000,
  			            0xe800: 0x1000000,
  			            0xf800: 0x40080,
  			            0x10000: 0x40000,
  			            0x11000: 0x80,
  			            0x12000: 0x20000000,
  			            0x13000: 0x21000080,
  			            0x14000: 0x1000080,
  			            0x15000: 0x21040000,
  			            0x16000: 0x20040080,
  			            0x17000: 0x1000000,
  			            0x18000: 0x21040080,
  			            0x19000: 0x21000000,
  			            0x1a000: 0x1040000,
  			            0x1b000: 0x20040000,
  			            0x1c000: 0x40080,
  			            0x1d000: 0x20000080,
  			            0x1e000: 0x0,
  			            0x1f000: 0x1040080,
  			            0x10800: 0x21000080,
  			            0x11800: 0x1000000,
  			            0x12800: 0x1040000,
  			            0x13800: 0x20040080,
  			            0x14800: 0x20000000,
  			            0x15800: 0x1040080,
  			            0x16800: 0x80,
  			            0x17800: 0x21040000,
  			            0x18800: 0x40080,
  			            0x19800: 0x21040080,
  			            0x1a800: 0x0,
  			            0x1b800: 0x21000000,
  			            0x1c800: 0x1000080,
  			            0x1d800: 0x40000,
  			            0x1e800: 0x20040000,
  			            0x1f800: 0x20000080
  			        },
  			        {
  			            0x0: 0x10000008,
  			            0x100: 0x2000,
  			            0x200: 0x10200000,
  			            0x300: 0x10202008,
  			            0x400: 0x10002000,
  			            0x500: 0x200000,
  			            0x600: 0x200008,
  			            0x700: 0x10000000,
  			            0x800: 0x0,
  			            0x900: 0x10002008,
  			            0xa00: 0x202000,
  			            0xb00: 0x8,
  			            0xc00: 0x10200008,
  			            0xd00: 0x202008,
  			            0xe00: 0x2008,
  			            0xf00: 0x10202000,
  			            0x80: 0x10200000,
  			            0x180: 0x10202008,
  			            0x280: 0x8,
  			            0x380: 0x200000,
  			            0x480: 0x202008,
  			            0x580: 0x10000008,
  			            0x680: 0x10002000,
  			            0x780: 0x2008,
  			            0x880: 0x200008,
  			            0x980: 0x2000,
  			            0xa80: 0x10002008,
  			            0xb80: 0x10200008,
  			            0xc80: 0x0,
  			            0xd80: 0x10202000,
  			            0xe80: 0x202000,
  			            0xf80: 0x10000000,
  			            0x1000: 0x10002000,
  			            0x1100: 0x10200008,
  			            0x1200: 0x10202008,
  			            0x1300: 0x2008,
  			            0x1400: 0x200000,
  			            0x1500: 0x10000000,
  			            0x1600: 0x10000008,
  			            0x1700: 0x202000,
  			            0x1800: 0x202008,
  			            0x1900: 0x0,
  			            0x1a00: 0x8,
  			            0x1b00: 0x10200000,
  			            0x1c00: 0x2000,
  			            0x1d00: 0x10002008,
  			            0x1e00: 0x10202000,
  			            0x1f00: 0x200008,
  			            0x1080: 0x8,
  			            0x1180: 0x202000,
  			            0x1280: 0x200000,
  			            0x1380: 0x10000008,
  			            0x1480: 0x10002000,
  			            0x1580: 0x2008,
  			            0x1680: 0x10202008,
  			            0x1780: 0x10200000,
  			            0x1880: 0x10202000,
  			            0x1980: 0x10200008,
  			            0x1a80: 0x2000,
  			            0x1b80: 0x202008,
  			            0x1c80: 0x200008,
  			            0x1d80: 0x0,
  			            0x1e80: 0x10000000,
  			            0x1f80: 0x10002008
  			        },
  			        {
  			            0x0: 0x100000,
  			            0x10: 0x2000401,
  			            0x20: 0x400,
  			            0x30: 0x100401,
  			            0x40: 0x2100401,
  			            0x50: 0x0,
  			            0x60: 0x1,
  			            0x70: 0x2100001,
  			            0x80: 0x2000400,
  			            0x90: 0x100001,
  			            0xa0: 0x2000001,
  			            0xb0: 0x2100400,
  			            0xc0: 0x2100000,
  			            0xd0: 0x401,
  			            0xe0: 0x100400,
  			            0xf0: 0x2000000,
  			            0x8: 0x2100001,
  			            0x18: 0x0,
  			            0x28: 0x2000401,
  			            0x38: 0x2100400,
  			            0x48: 0x100000,
  			            0x58: 0x2000001,
  			            0x68: 0x2000000,
  			            0x78: 0x401,
  			            0x88: 0x100401,
  			            0x98: 0x2000400,
  			            0xa8: 0x2100000,
  			            0xb8: 0x100001,
  			            0xc8: 0x400,
  			            0xd8: 0x2100401,
  			            0xe8: 0x1,
  			            0xf8: 0x100400,
  			            0x100: 0x2000000,
  			            0x110: 0x100000,
  			            0x120: 0x2000401,
  			            0x130: 0x2100001,
  			            0x140: 0x100001,
  			            0x150: 0x2000400,
  			            0x160: 0x2100400,
  			            0x170: 0x100401,
  			            0x180: 0x401,
  			            0x190: 0x2100401,
  			            0x1a0: 0x100400,
  			            0x1b0: 0x1,
  			            0x1c0: 0x0,
  			            0x1d0: 0x2100000,
  			            0x1e0: 0x2000001,
  			            0x1f0: 0x400,
  			            0x108: 0x100400,
  			            0x118: 0x2000401,
  			            0x128: 0x2100001,
  			            0x138: 0x1,
  			            0x148: 0x2000000,
  			            0x158: 0x100000,
  			            0x168: 0x401,
  			            0x178: 0x2100400,
  			            0x188: 0x2000001,
  			            0x198: 0x2100000,
  			            0x1a8: 0x0,
  			            0x1b8: 0x2100401,
  			            0x1c8: 0x100401,
  			            0x1d8: 0x400,
  			            0x1e8: 0x2000400,
  			            0x1f8: 0x100001
  			        },
  			        {
  			            0x0: 0x8000820,
  			            0x1: 0x20000,
  			            0x2: 0x8000000,
  			            0x3: 0x20,
  			            0x4: 0x20020,
  			            0x5: 0x8020820,
  			            0x6: 0x8020800,
  			            0x7: 0x800,
  			            0x8: 0x8020000,
  			            0x9: 0x8000800,
  			            0xa: 0x20800,
  			            0xb: 0x8020020,
  			            0xc: 0x820,
  			            0xd: 0x0,
  			            0xe: 0x8000020,
  			            0xf: 0x20820,
  			            0x80000000: 0x800,
  			            0x80000001: 0x8020820,
  			            0x80000002: 0x8000820,
  			            0x80000003: 0x8000000,
  			            0x80000004: 0x8020000,
  			            0x80000005: 0x20800,
  			            0x80000006: 0x20820,
  			            0x80000007: 0x20,
  			            0x80000008: 0x8000020,
  			            0x80000009: 0x820,
  			            0x8000000a: 0x20020,
  			            0x8000000b: 0x8020800,
  			            0x8000000c: 0x0,
  			            0x8000000d: 0x8020020,
  			            0x8000000e: 0x8000800,
  			            0x8000000f: 0x20000,
  			            0x10: 0x20820,
  			            0x11: 0x8020800,
  			            0x12: 0x20,
  			            0x13: 0x800,
  			            0x14: 0x8000800,
  			            0x15: 0x8000020,
  			            0x16: 0x8020020,
  			            0x17: 0x20000,
  			            0x18: 0x0,
  			            0x19: 0x20020,
  			            0x1a: 0x8020000,
  			            0x1b: 0x8000820,
  			            0x1c: 0x8020820,
  			            0x1d: 0x20800,
  			            0x1e: 0x820,
  			            0x1f: 0x8000000,
  			            0x80000010: 0x20000,
  			            0x80000011: 0x800,
  			            0x80000012: 0x8020020,
  			            0x80000013: 0x20820,
  			            0x80000014: 0x20,
  			            0x80000015: 0x8020000,
  			            0x80000016: 0x8000000,
  			            0x80000017: 0x8000820,
  			            0x80000018: 0x8020820,
  			            0x80000019: 0x8000020,
  			            0x8000001a: 0x8000800,
  			            0x8000001b: 0x0,
  			            0x8000001c: 0x20800,
  			            0x8000001d: 0x820,
  			            0x8000001e: 0x20020,
  			            0x8000001f: 0x8020800
  			        }
  			    ];

  			    // Masks that select the SBOX input
  			    var SBOX_MASK = [
  			        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
  			        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
  			    ];

  			    /**
  			     * DES block cipher algorithm.
  			     */
  			    var DES = C_algo.DES = BlockCipher.extend({
  			        _doReset: function () {
  			            // Shortcuts
  			            var key = this._key;
  			            var keyWords = key.words;

  			            // Select 56 bits according to PC1
  			            var keyBits = [];
  			            for (var i = 0; i < 56; i++) {
  			                var keyBitPos = PC1[i] - 1;
  			                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
  			            }

  			            // Assemble 16 subkeys
  			            var subKeys = this._subKeys = [];
  			            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
  			                // Create subkey
  			                var subKey = subKeys[nSubKey] = [];

  			                // Shortcut
  			                var bitShift = BIT_SHIFTS[nSubKey];

  			                // Select 48 bits according to PC2
  			                for (var i = 0; i < 24; i++) {
  			                    // Select from the left 28 key bits
  			                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

  			                    // Select from the right 28 key bits
  			                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
  			                }

  			                // Since each subkey is applied to an expanded 32-bit input,
  			                // the subkey can be broken into 8 values scaled to 32-bits,
  			                // which allows the key to be used without expansion
  			                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
  			                for (var i = 1; i < 7; i++) {
  			                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
  			                }
  			                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
  			            }

  			            // Compute inverse subkeys
  			            var invSubKeys = this._invSubKeys = [];
  			            for (var i = 0; i < 16; i++) {
  			                invSubKeys[i] = subKeys[15 - i];
  			            }
  			        },

  			        encryptBlock: function (M, offset) {
  			            this._doCryptBlock(M, offset, this._subKeys);
  			        },

  			        decryptBlock: function (M, offset) {
  			            this._doCryptBlock(M, offset, this._invSubKeys);
  			        },

  			        _doCryptBlock: function (M, offset, subKeys) {
  			            // Get input
  			            this._lBlock = M[offset];
  			            this._rBlock = M[offset + 1];

  			            // Initial permutation
  			            exchangeLR.call(this, 4,  0x0f0f0f0f);
  			            exchangeLR.call(this, 16, 0x0000ffff);
  			            exchangeRL.call(this, 2,  0x33333333);
  			            exchangeRL.call(this, 8,  0x00ff00ff);
  			            exchangeLR.call(this, 1,  0x55555555);

  			            // Rounds
  			            for (var round = 0; round < 16; round++) {
  			                // Shortcuts
  			                var subKey = subKeys[round];
  			                var lBlock = this._lBlock;
  			                var rBlock = this._rBlock;

  			                // Feistel function
  			                var f = 0;
  			                for (var i = 0; i < 8; i++) {
  			                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
  			                }
  			                this._lBlock = rBlock;
  			                this._rBlock = lBlock ^ f;
  			            }

  			            // Undo swap from last round
  			            var t = this._lBlock;
  			            this._lBlock = this._rBlock;
  			            this._rBlock = t;

  			            // Final permutation
  			            exchangeLR.call(this, 1,  0x55555555);
  			            exchangeRL.call(this, 8,  0x00ff00ff);
  			            exchangeRL.call(this, 2,  0x33333333);
  			            exchangeLR.call(this, 16, 0x0000ffff);
  			            exchangeLR.call(this, 4,  0x0f0f0f0f);

  			            // Set output
  			            M[offset] = this._lBlock;
  			            M[offset + 1] = this._rBlock;
  			        },

  			        keySize: 64/32,

  			        ivSize: 64/32,

  			        blockSize: 64/32
  			    });

  			    // Swap bits across the left and right words
  			    function exchangeLR(offset, mask) {
  			        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
  			        this._rBlock ^= t;
  			        this._lBlock ^= t << offset;
  			    }

  			    function exchangeRL(offset, mask) {
  			        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
  			        this._lBlock ^= t;
  			        this._rBlock ^= t << offset;
  			    }

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
  			     */
  			    C.DES = BlockCipher._createHelper(DES);

  			    /**
  			     * Triple-DES block cipher algorithm.
  			     */
  			    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
  			        _doReset: function () {
  			            // Shortcuts
  			            var key = this._key;
  			            var keyWords = key.words;
  			            // Make sure the key length is valid (64, 128 or >= 192 bit)
  			            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
  			                throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
  			            }

  			            // Extend the key according to the keying options defined in 3DES standard
  			            var key1 = keyWords.slice(0, 2);
  			            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
  			            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

  			            // Create DES instances
  			            this._des1 = DES.createEncryptor(WordArray.create(key1));
  			            this._des2 = DES.createEncryptor(WordArray.create(key2));
  			            this._des3 = DES.createEncryptor(WordArray.create(key3));
  			        },

  			        encryptBlock: function (M, offset) {
  			            this._des1.encryptBlock(M, offset);
  			            this._des2.decryptBlock(M, offset);
  			            this._des3.encryptBlock(M, offset);
  			        },

  			        decryptBlock: function (M, offset) {
  			            this._des3.decryptBlock(M, offset);
  			            this._des2.encryptBlock(M, offset);
  			            this._des1.decryptBlock(M, offset);
  			        },

  			        keySize: 192/32,

  			        ivSize: 64/32,

  			        blockSize: 64/32
  			    });

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
  			     */
  			    C.TripleDES = BlockCipher._createHelper(TripleDES);
  			}());


  			return CryptoJS.TripleDES;

  		})); 
  	} (tripledes));
  	return tripledes.exports;
  }

  var rc4 = {exports: {}};

  var hasRequiredRc4;

  function requireRc4 () {
  	if (hasRequiredRc4) return rc4.exports;
  	hasRequiredRc4 = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), encBase64Exports, requireMd5(), requireEvpkdf(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var StreamCipher = C_lib.StreamCipher;
  			    var C_algo = C.algo;

  			    /**
  			     * RC4 stream cipher algorithm.
  			     */
  			    var RC4 = C_algo.RC4 = StreamCipher.extend({
  			        _doReset: function () {
  			            // Shortcuts
  			            var key = this._key;
  			            var keyWords = key.words;
  			            var keySigBytes = key.sigBytes;

  			            // Init sbox
  			            var S = this._S = [];
  			            for (var i = 0; i < 256; i++) {
  			                S[i] = i;
  			            }

  			            // Key setup
  			            for (var i = 0, j = 0; i < 256; i++) {
  			                var keyByteIndex = i % keySigBytes;
  			                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

  			                j = (j + S[i] + keyByte) % 256;

  			                // Swap
  			                var t = S[i];
  			                S[i] = S[j];
  			                S[j] = t;
  			            }

  			            // Counters
  			            this._i = this._j = 0;
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            M[offset] ^= generateKeystreamWord.call(this);
  			        },

  			        keySize: 256/32,

  			        ivSize: 0
  			    });

  			    function generateKeystreamWord() {
  			        // Shortcuts
  			        var S = this._S;
  			        var i = this._i;
  			        var j = this._j;

  			        // Generate keystream word
  			        var keystreamWord = 0;
  			        for (var n = 0; n < 4; n++) {
  			            i = (i + 1) % 256;
  			            j = (j + S[i]) % 256;

  			            // Swap
  			            var t = S[i];
  			            S[i] = S[j];
  			            S[j] = t;

  			            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
  			        }

  			        // Update counters
  			        this._i = i;
  			        this._j = j;

  			        return keystreamWord;
  			    }

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
  			     */
  			    C.RC4 = StreamCipher._createHelper(RC4);

  			    /**
  			     * Modified RC4 stream cipher algorithm.
  			     */
  			    var RC4Drop = C_algo.RC4Drop = RC4.extend({
  			        /**
  			         * Configuration options.
  			         *
  			         * @property {number} drop The number of keystream words to drop. Default 192
  			         */
  			        cfg: RC4.cfg.extend({
  			            drop: 192
  			        }),

  			        _doReset: function () {
  			            RC4._doReset.call(this);

  			            // Drop
  			            for (var i = this.cfg.drop; i > 0; i--) {
  			                generateKeystreamWord.call(this);
  			            }
  			        }
  			    });

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
  			     */
  			    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
  			}());


  			return CryptoJS.RC4;

  		})); 
  	} (rc4));
  	return rc4.exports;
  }

  var rabbit = {exports: {}};

  var hasRequiredRabbit;

  function requireRabbit () {
  	if (hasRequiredRabbit) return rabbit.exports;
  	hasRequiredRabbit = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), encBase64Exports, requireMd5(), requireEvpkdf(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var StreamCipher = C_lib.StreamCipher;
  			    var C_algo = C.algo;

  			    // Reusable objects
  			    var S  = [];
  			    var C_ = [];
  			    var G  = [];

  			    /**
  			     * Rabbit stream cipher algorithm
  			     */
  			    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
  			        _doReset: function () {
  			            // Shortcuts
  			            var K = this._key.words;
  			            var iv = this.cfg.iv;

  			            // Swap endian
  			            for (var i = 0; i < 4; i++) {
  			                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
  			                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
  			            }

  			            // Generate initial state values
  			            var X = this._X = [
  			                K[0], (K[3] << 16) | (K[2] >>> 16),
  			                K[1], (K[0] << 16) | (K[3] >>> 16),
  			                K[2], (K[1] << 16) | (K[0] >>> 16),
  			                K[3], (K[2] << 16) | (K[1] >>> 16)
  			            ];

  			            // Generate initial counter values
  			            var C = this._C = [
  			                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
  			                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
  			                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
  			                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
  			            ];

  			            // Carry bit
  			            this._b = 0;

  			            // Iterate the system four times
  			            for (var i = 0; i < 4; i++) {
  			                nextState.call(this);
  			            }

  			            // Modify the counters
  			            for (var i = 0; i < 8; i++) {
  			                C[i] ^= X[(i + 4) & 7];
  			            }

  			            // IV setup
  			            if (iv) {
  			                // Shortcuts
  			                var IV = iv.words;
  			                var IV_0 = IV[0];
  			                var IV_1 = IV[1];

  			                // Generate four subvectors
  			                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
  			                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
  			                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
  			                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

  			                // Modify counter values
  			                C[0] ^= i0;
  			                C[1] ^= i1;
  			                C[2] ^= i2;
  			                C[3] ^= i3;
  			                C[4] ^= i0;
  			                C[5] ^= i1;
  			                C[6] ^= i2;
  			                C[7] ^= i3;

  			                // Iterate the system four times
  			                for (var i = 0; i < 4; i++) {
  			                    nextState.call(this);
  			                }
  			            }
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Shortcut
  			            var X = this._X;

  			            // Iterate the system
  			            nextState.call(this);

  			            // Generate four keystream words
  			            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
  			            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
  			            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
  			            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

  			            for (var i = 0; i < 4; i++) {
  			                // Swap endian
  			                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
  			                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

  			                // Encrypt
  			                M[offset + i] ^= S[i];
  			            }
  			        },

  			        blockSize: 128/32,

  			        ivSize: 64/32
  			    });

  			    function nextState() {
  			        // Shortcuts
  			        var X = this._X;
  			        var C = this._C;

  			        // Save old counter values
  			        for (var i = 0; i < 8; i++) {
  			            C_[i] = C[i];
  			        }

  			        // Calculate new counter values
  			        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
  			        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
  			        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
  			        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
  			        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
  			        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
  			        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
  			        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
  			        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

  			        // Calculate the g-values
  			        for (var i = 0; i < 8; i++) {
  			            var gx = X[i] + C[i];

  			            // Construct high and low argument for squaring
  			            var ga = gx & 0xffff;
  			            var gb = gx >>> 16;

  			            // Calculate high and low result of squaring
  			            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
  			            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

  			            // High XOR low
  			            G[i] = gh ^ gl;
  			        }

  			        // Calculate new state values
  			        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
  			        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
  			        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
  			        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
  			        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
  			        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
  			        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
  			        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
  			    }

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
  			     */
  			    C.Rabbit = StreamCipher._createHelper(Rabbit);
  			}());


  			return CryptoJS.Rabbit;

  		})); 
  	} (rabbit));
  	return rabbit.exports;
  }

  var rabbitLegacy = {exports: {}};

  var hasRequiredRabbitLegacy;

  function requireRabbitLegacy () {
  	if (hasRequiredRabbitLegacy) return rabbitLegacy.exports;
  	hasRequiredRabbitLegacy = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), encBase64Exports, requireMd5(), requireEvpkdf(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var StreamCipher = C_lib.StreamCipher;
  			    var C_algo = C.algo;

  			    // Reusable objects
  			    var S  = [];
  			    var C_ = [];
  			    var G  = [];

  			    /**
  			     * Rabbit stream cipher algorithm.
  			     *
  			     * This is a legacy version that neglected to convert the key to little-endian.
  			     * This error doesn't affect the cipher's security,
  			     * but it does affect its compatibility with other implementations.
  			     */
  			    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
  			        _doReset: function () {
  			            // Shortcuts
  			            var K = this._key.words;
  			            var iv = this.cfg.iv;

  			            // Generate initial state values
  			            var X = this._X = [
  			                K[0], (K[3] << 16) | (K[2] >>> 16),
  			                K[1], (K[0] << 16) | (K[3] >>> 16),
  			                K[2], (K[1] << 16) | (K[0] >>> 16),
  			                K[3], (K[2] << 16) | (K[1] >>> 16)
  			            ];

  			            // Generate initial counter values
  			            var C = this._C = [
  			                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
  			                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
  			                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
  			                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
  			            ];

  			            // Carry bit
  			            this._b = 0;

  			            // Iterate the system four times
  			            for (var i = 0; i < 4; i++) {
  			                nextState.call(this);
  			            }

  			            // Modify the counters
  			            for (var i = 0; i < 8; i++) {
  			                C[i] ^= X[(i + 4) & 7];
  			            }

  			            // IV setup
  			            if (iv) {
  			                // Shortcuts
  			                var IV = iv.words;
  			                var IV_0 = IV[0];
  			                var IV_1 = IV[1];

  			                // Generate four subvectors
  			                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
  			                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
  			                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
  			                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

  			                // Modify counter values
  			                C[0] ^= i0;
  			                C[1] ^= i1;
  			                C[2] ^= i2;
  			                C[3] ^= i3;
  			                C[4] ^= i0;
  			                C[5] ^= i1;
  			                C[6] ^= i2;
  			                C[7] ^= i3;

  			                // Iterate the system four times
  			                for (var i = 0; i < 4; i++) {
  			                    nextState.call(this);
  			                }
  			            }
  			        },

  			        _doProcessBlock: function (M, offset) {
  			            // Shortcut
  			            var X = this._X;

  			            // Iterate the system
  			            nextState.call(this);

  			            // Generate four keystream words
  			            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
  			            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
  			            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
  			            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

  			            for (var i = 0; i < 4; i++) {
  			                // Swap endian
  			                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
  			                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

  			                // Encrypt
  			                M[offset + i] ^= S[i];
  			            }
  			        },

  			        blockSize: 128/32,

  			        ivSize: 64/32
  			    });

  			    function nextState() {
  			        // Shortcuts
  			        var X = this._X;
  			        var C = this._C;

  			        // Save old counter values
  			        for (var i = 0; i < 8; i++) {
  			            C_[i] = C[i];
  			        }

  			        // Calculate new counter values
  			        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
  			        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
  			        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
  			        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
  			        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
  			        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
  			        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
  			        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
  			        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

  			        // Calculate the g-values
  			        for (var i = 0; i < 8; i++) {
  			            var gx = X[i] + C[i];

  			            // Construct high and low argument for squaring
  			            var ga = gx & 0xffff;
  			            var gb = gx >>> 16;

  			            // Calculate high and low result of squaring
  			            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
  			            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

  			            // High XOR low
  			            G[i] = gh ^ gl;
  			        }

  			        // Calculate new state values
  			        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
  			        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
  			        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
  			        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
  			        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
  			        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
  			        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
  			        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
  			    }

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
  			     */
  			    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
  			}());


  			return CryptoJS.RabbitLegacy;

  		})); 
  	} (rabbitLegacy));
  	return rabbitLegacy.exports;
  }

  var blowfish = {exports: {}};

  var hasRequiredBlowfish;

  function requireBlowfish () {
  	if (hasRequiredBlowfish) return blowfish.exports;
  	hasRequiredBlowfish = 1;
  	(function (module, exports) {
  (function (root, factory, undef) {
  			{
  				// CommonJS
  				module.exports = factory(requireCore(), encBase64Exports, requireMd5(), requireEvpkdf(), requireCipherCore());
  			}
  		}(commonjsGlobal, function (CryptoJS) {

  			(function () {
  			    // Shortcuts
  			    var C = CryptoJS;
  			    var C_lib = C.lib;
  			    var BlockCipher = C_lib.BlockCipher;
  			    var C_algo = C.algo;

  			    const N = 16;

  			    //Origin pbox and sbox, derived from PI
  			    const ORIG_P = [
  			        0x243F6A88, 0x85A308D3, 0x13198A2E, 0x03707344,
  			        0xA4093822, 0x299F31D0, 0x082EFA98, 0xEC4E6C89,
  			        0x452821E6, 0x38D01377, 0xBE5466CF, 0x34E90C6C,
  			        0xC0AC29B7, 0xC97C50DD, 0x3F84D5B5, 0xB5470917,
  			        0x9216D5D9, 0x8979FB1B
  			    ];

  			    const ORIG_S = [
  			        [   0xD1310BA6, 0x98DFB5AC, 0x2FFD72DB, 0xD01ADFB7,
  			            0xB8E1AFED, 0x6A267E96, 0xBA7C9045, 0xF12C7F99,
  			            0x24A19947, 0xB3916CF7, 0x0801F2E2, 0x858EFC16,
  			            0x636920D8, 0x71574E69, 0xA458FEA3, 0xF4933D7E,
  			            0x0D95748F, 0x728EB658, 0x718BCD58, 0x82154AEE,
  			            0x7B54A41D, 0xC25A59B5, 0x9C30D539, 0x2AF26013,
  			            0xC5D1B023, 0x286085F0, 0xCA417918, 0xB8DB38EF,
  			            0x8E79DCB0, 0x603A180E, 0x6C9E0E8B, 0xB01E8A3E,
  			            0xD71577C1, 0xBD314B27, 0x78AF2FDA, 0x55605C60,
  			            0xE65525F3, 0xAA55AB94, 0x57489862, 0x63E81440,
  			            0x55CA396A, 0x2AAB10B6, 0xB4CC5C34, 0x1141E8CE,
  			            0xA15486AF, 0x7C72E993, 0xB3EE1411, 0x636FBC2A,
  			            0x2BA9C55D, 0x741831F6, 0xCE5C3E16, 0x9B87931E,
  			            0xAFD6BA33, 0x6C24CF5C, 0x7A325381, 0x28958677,
  			            0x3B8F4898, 0x6B4BB9AF, 0xC4BFE81B, 0x66282193,
  			            0x61D809CC, 0xFB21A991, 0x487CAC60, 0x5DEC8032,
  			            0xEF845D5D, 0xE98575B1, 0xDC262302, 0xEB651B88,
  			            0x23893E81, 0xD396ACC5, 0x0F6D6FF3, 0x83F44239,
  			            0x2E0B4482, 0xA4842004, 0x69C8F04A, 0x9E1F9B5E,
  			            0x21C66842, 0xF6E96C9A, 0x670C9C61, 0xABD388F0,
  			            0x6A51A0D2, 0xD8542F68, 0x960FA728, 0xAB5133A3,
  			            0x6EEF0B6C, 0x137A3BE4, 0xBA3BF050, 0x7EFB2A98,
  			            0xA1F1651D, 0x39AF0176, 0x66CA593E, 0x82430E88,
  			            0x8CEE8619, 0x456F9FB4, 0x7D84A5C3, 0x3B8B5EBE,
  			            0xE06F75D8, 0x85C12073, 0x401A449F, 0x56C16AA6,
  			            0x4ED3AA62, 0x363F7706, 0x1BFEDF72, 0x429B023D,
  			            0x37D0D724, 0xD00A1248, 0xDB0FEAD3, 0x49F1C09B,
  			            0x075372C9, 0x80991B7B, 0x25D479D8, 0xF6E8DEF7,
  			            0xE3FE501A, 0xB6794C3B, 0x976CE0BD, 0x04C006BA,
  			            0xC1A94FB6, 0x409F60C4, 0x5E5C9EC2, 0x196A2463,
  			            0x68FB6FAF, 0x3E6C53B5, 0x1339B2EB, 0x3B52EC6F,
  			            0x6DFC511F, 0x9B30952C, 0xCC814544, 0xAF5EBD09,
  			            0xBEE3D004, 0xDE334AFD, 0x660F2807, 0x192E4BB3,
  			            0xC0CBA857, 0x45C8740F, 0xD20B5F39, 0xB9D3FBDB,
  			            0x5579C0BD, 0x1A60320A, 0xD6A100C6, 0x402C7279,
  			            0x679F25FE, 0xFB1FA3CC, 0x8EA5E9F8, 0xDB3222F8,
  			            0x3C7516DF, 0xFD616B15, 0x2F501EC8, 0xAD0552AB,
  			            0x323DB5FA, 0xFD238760, 0x53317B48, 0x3E00DF82,
  			            0x9E5C57BB, 0xCA6F8CA0, 0x1A87562E, 0xDF1769DB,
  			            0xD542A8F6, 0x287EFFC3, 0xAC6732C6, 0x8C4F5573,
  			            0x695B27B0, 0xBBCA58C8, 0xE1FFA35D, 0xB8F011A0,
  			            0x10FA3D98, 0xFD2183B8, 0x4AFCB56C, 0x2DD1D35B,
  			            0x9A53E479, 0xB6F84565, 0xD28E49BC, 0x4BFB9790,
  			            0xE1DDF2DA, 0xA4CB7E33, 0x62FB1341, 0xCEE4C6E8,
  			            0xEF20CADA, 0x36774C01, 0xD07E9EFE, 0x2BF11FB4,
  			            0x95DBDA4D, 0xAE909198, 0xEAAD8E71, 0x6B93D5A0,
  			            0xD08ED1D0, 0xAFC725E0, 0x8E3C5B2F, 0x8E7594B7,
  			            0x8FF6E2FB, 0xF2122B64, 0x8888B812, 0x900DF01C,
  			            0x4FAD5EA0, 0x688FC31C, 0xD1CFF191, 0xB3A8C1AD,
  			            0x2F2F2218, 0xBE0E1777, 0xEA752DFE, 0x8B021FA1,
  			            0xE5A0CC0F, 0xB56F74E8, 0x18ACF3D6, 0xCE89E299,
  			            0xB4A84FE0, 0xFD13E0B7, 0x7CC43B81, 0xD2ADA8D9,
  			            0x165FA266, 0x80957705, 0x93CC7314, 0x211A1477,
  			            0xE6AD2065, 0x77B5FA86, 0xC75442F5, 0xFB9D35CF,
  			            0xEBCDAF0C, 0x7B3E89A0, 0xD6411BD3, 0xAE1E7E49,
  			            0x00250E2D, 0x2071B35E, 0x226800BB, 0x57B8E0AF,
  			            0x2464369B, 0xF009B91E, 0x5563911D, 0x59DFA6AA,
  			            0x78C14389, 0xD95A537F, 0x207D5BA2, 0x02E5B9C5,
  			            0x83260376, 0x6295CFA9, 0x11C81968, 0x4E734A41,
  			            0xB3472DCA, 0x7B14A94A, 0x1B510052, 0x9A532915,
  			            0xD60F573F, 0xBC9BC6E4, 0x2B60A476, 0x81E67400,
  			            0x08BA6FB5, 0x571BE91F, 0xF296EC6B, 0x2A0DD915,
  			            0xB6636521, 0xE7B9F9B6, 0xFF34052E, 0xC5855664,
  			            0x53B02D5D, 0xA99F8FA1, 0x08BA4799, 0x6E85076A   ],
  			        [   0x4B7A70E9, 0xB5B32944, 0xDB75092E, 0xC4192623,
  			            0xAD6EA6B0, 0x49A7DF7D, 0x9CEE60B8, 0x8FEDB266,
  			            0xECAA8C71, 0x699A17FF, 0x5664526C, 0xC2B19EE1,
  			            0x193602A5, 0x75094C29, 0xA0591340, 0xE4183A3E,
  			            0x3F54989A, 0x5B429D65, 0x6B8FE4D6, 0x99F73FD6,
  			            0xA1D29C07, 0xEFE830F5, 0x4D2D38E6, 0xF0255DC1,
  			            0x4CDD2086, 0x8470EB26, 0x6382E9C6, 0x021ECC5E,
  			            0x09686B3F, 0x3EBAEFC9, 0x3C971814, 0x6B6A70A1,
  			            0x687F3584, 0x52A0E286, 0xB79C5305, 0xAA500737,
  			            0x3E07841C, 0x7FDEAE5C, 0x8E7D44EC, 0x5716F2B8,
  			            0xB03ADA37, 0xF0500C0D, 0xF01C1F04, 0x0200B3FF,
  			            0xAE0CF51A, 0x3CB574B2, 0x25837A58, 0xDC0921BD,
  			            0xD19113F9, 0x7CA92FF6, 0x94324773, 0x22F54701,
  			            0x3AE5E581, 0x37C2DADC, 0xC8B57634, 0x9AF3DDA7,
  			            0xA9446146, 0x0FD0030E, 0xECC8C73E, 0xA4751E41,
  			            0xE238CD99, 0x3BEA0E2F, 0x3280BBA1, 0x183EB331,
  			            0x4E548B38, 0x4F6DB908, 0x6F420D03, 0xF60A04BF,
  			            0x2CB81290, 0x24977C79, 0x5679B072, 0xBCAF89AF,
  			            0xDE9A771F, 0xD9930810, 0xB38BAE12, 0xDCCF3F2E,
  			            0x5512721F, 0x2E6B7124, 0x501ADDE6, 0x9F84CD87,
  			            0x7A584718, 0x7408DA17, 0xBC9F9ABC, 0xE94B7D8C,
  			            0xEC7AEC3A, 0xDB851DFA, 0x63094366, 0xC464C3D2,
  			            0xEF1C1847, 0x3215D908, 0xDD433B37, 0x24C2BA16,
  			            0x12A14D43, 0x2A65C451, 0x50940002, 0x133AE4DD,
  			            0x71DFF89E, 0x10314E55, 0x81AC77D6, 0x5F11199B,
  			            0x043556F1, 0xD7A3C76B, 0x3C11183B, 0x5924A509,
  			            0xF28FE6ED, 0x97F1FBFA, 0x9EBABF2C, 0x1E153C6E,
  			            0x86E34570, 0xEAE96FB1, 0x860E5E0A, 0x5A3E2AB3,
  			            0x771FE71C, 0x4E3D06FA, 0x2965DCB9, 0x99E71D0F,
  			            0x803E89D6, 0x5266C825, 0x2E4CC978, 0x9C10B36A,
  			            0xC6150EBA, 0x94E2EA78, 0xA5FC3C53, 0x1E0A2DF4,
  			            0xF2F74EA7, 0x361D2B3D, 0x1939260F, 0x19C27960,
  			            0x5223A708, 0xF71312B6, 0xEBADFE6E, 0xEAC31F66,
  			            0xE3BC4595, 0xA67BC883, 0xB17F37D1, 0x018CFF28,
  			            0xC332DDEF, 0xBE6C5AA5, 0x65582185, 0x68AB9802,
  			            0xEECEA50F, 0xDB2F953B, 0x2AEF7DAD, 0x5B6E2F84,
  			            0x1521B628, 0x29076170, 0xECDD4775, 0x619F1510,
  			            0x13CCA830, 0xEB61BD96, 0x0334FE1E, 0xAA0363CF,
  			            0xB5735C90, 0x4C70A239, 0xD59E9E0B, 0xCBAADE14,
  			            0xEECC86BC, 0x60622CA7, 0x9CAB5CAB, 0xB2F3846E,
  			            0x648B1EAF, 0x19BDF0CA, 0xA02369B9, 0x655ABB50,
  			            0x40685A32, 0x3C2AB4B3, 0x319EE9D5, 0xC021B8F7,
  			            0x9B540B19, 0x875FA099, 0x95F7997E, 0x623D7DA8,
  			            0xF837889A, 0x97E32D77, 0x11ED935F, 0x16681281,
  			            0x0E358829, 0xC7E61FD6, 0x96DEDFA1, 0x7858BA99,
  			            0x57F584A5, 0x1B227263, 0x9B83C3FF, 0x1AC24696,
  			            0xCDB30AEB, 0x532E3054, 0x8FD948E4, 0x6DBC3128,
  			            0x58EBF2EF, 0x34C6FFEA, 0xFE28ED61, 0xEE7C3C73,
  			            0x5D4A14D9, 0xE864B7E3, 0x42105D14, 0x203E13E0,
  			            0x45EEE2B6, 0xA3AAABEA, 0xDB6C4F15, 0xFACB4FD0,
  			            0xC742F442, 0xEF6ABBB5, 0x654F3B1D, 0x41CD2105,
  			            0xD81E799E, 0x86854DC7, 0xE44B476A, 0x3D816250,
  			            0xCF62A1F2, 0x5B8D2646, 0xFC8883A0, 0xC1C7B6A3,
  			            0x7F1524C3, 0x69CB7492, 0x47848A0B, 0x5692B285,
  			            0x095BBF00, 0xAD19489D, 0x1462B174, 0x23820E00,
  			            0x58428D2A, 0x0C55F5EA, 0x1DADF43E, 0x233F7061,
  			            0x3372F092, 0x8D937E41, 0xD65FECF1, 0x6C223BDB,
  			            0x7CDE3759, 0xCBEE7460, 0x4085F2A7, 0xCE77326E,
  			            0xA6078084, 0x19F8509E, 0xE8EFD855, 0x61D99735,
  			            0xA969A7AA, 0xC50C06C2, 0x5A04ABFC, 0x800BCADC,
  			            0x9E447A2E, 0xC3453484, 0xFDD56705, 0x0E1E9EC9,
  			            0xDB73DBD3, 0x105588CD, 0x675FDA79, 0xE3674340,
  			            0xC5C43465, 0x713E38D8, 0x3D28F89E, 0xF16DFF20,
  			            0x153E21E7, 0x8FB03D4A, 0xE6E39F2B, 0xDB83ADF7   ],
  			        [   0xE93D5A68, 0x948140F7, 0xF64C261C, 0x94692934,
  			            0x411520F7, 0x7602D4F7, 0xBCF46B2E, 0xD4A20068,
  			            0xD4082471, 0x3320F46A, 0x43B7D4B7, 0x500061AF,
  			            0x1E39F62E, 0x97244546, 0x14214F74, 0xBF8B8840,
  			            0x4D95FC1D, 0x96B591AF, 0x70F4DDD3, 0x66A02F45,
  			            0xBFBC09EC, 0x03BD9785, 0x7FAC6DD0, 0x31CB8504,
  			            0x96EB27B3, 0x55FD3941, 0xDA2547E6, 0xABCA0A9A,
  			            0x28507825, 0x530429F4, 0x0A2C86DA, 0xE9B66DFB,
  			            0x68DC1462, 0xD7486900, 0x680EC0A4, 0x27A18DEE,
  			            0x4F3FFEA2, 0xE887AD8C, 0xB58CE006, 0x7AF4D6B6,
  			            0xAACE1E7C, 0xD3375FEC, 0xCE78A399, 0x406B2A42,
  			            0x20FE9E35, 0xD9F385B9, 0xEE39D7AB, 0x3B124E8B,
  			            0x1DC9FAF7, 0x4B6D1856, 0x26A36631, 0xEAE397B2,
  			            0x3A6EFA74, 0xDD5B4332, 0x6841E7F7, 0xCA7820FB,
  			            0xFB0AF54E, 0xD8FEB397, 0x454056AC, 0xBA489527,
  			            0x55533A3A, 0x20838D87, 0xFE6BA9B7, 0xD096954B,
  			            0x55A867BC, 0xA1159A58, 0xCCA92963, 0x99E1DB33,
  			            0xA62A4A56, 0x3F3125F9, 0x5EF47E1C, 0x9029317C,
  			            0xFDF8E802, 0x04272F70, 0x80BB155C, 0x05282CE3,
  			            0x95C11548, 0xE4C66D22, 0x48C1133F, 0xC70F86DC,
  			            0x07F9C9EE, 0x41041F0F, 0x404779A4, 0x5D886E17,
  			            0x325F51EB, 0xD59BC0D1, 0xF2BCC18F, 0x41113564,
  			            0x257B7834, 0x602A9C60, 0xDFF8E8A3, 0x1F636C1B,
  			            0x0E12B4C2, 0x02E1329E, 0xAF664FD1, 0xCAD18115,
  			            0x6B2395E0, 0x333E92E1, 0x3B240B62, 0xEEBEB922,
  			            0x85B2A20E, 0xE6BA0D99, 0xDE720C8C, 0x2DA2F728,
  			            0xD0127845, 0x95B794FD, 0x647D0862, 0xE7CCF5F0,
  			            0x5449A36F, 0x877D48FA, 0xC39DFD27, 0xF33E8D1E,
  			            0x0A476341, 0x992EFF74, 0x3A6F6EAB, 0xF4F8FD37,
  			            0xA812DC60, 0xA1EBDDF8, 0x991BE14C, 0xDB6E6B0D,
  			            0xC67B5510, 0x6D672C37, 0x2765D43B, 0xDCD0E804,
  			            0xF1290DC7, 0xCC00FFA3, 0xB5390F92, 0x690FED0B,
  			            0x667B9FFB, 0xCEDB7D9C, 0xA091CF0B, 0xD9155EA3,
  			            0xBB132F88, 0x515BAD24, 0x7B9479BF, 0x763BD6EB,
  			            0x37392EB3, 0xCC115979, 0x8026E297, 0xF42E312D,
  			            0x6842ADA7, 0xC66A2B3B, 0x12754CCC, 0x782EF11C,
  			            0x6A124237, 0xB79251E7, 0x06A1BBE6, 0x4BFB6350,
  			            0x1A6B1018, 0x11CAEDFA, 0x3D25BDD8, 0xE2E1C3C9,
  			            0x44421659, 0x0A121386, 0xD90CEC6E, 0xD5ABEA2A,
  			            0x64AF674E, 0xDA86A85F, 0xBEBFE988, 0x64E4C3FE,
  			            0x9DBC8057, 0xF0F7C086, 0x60787BF8, 0x6003604D,
  			            0xD1FD8346, 0xF6381FB0, 0x7745AE04, 0xD736FCCC,
  			            0x83426B33, 0xF01EAB71, 0xB0804187, 0x3C005E5F,
  			            0x77A057BE, 0xBDE8AE24, 0x55464299, 0xBF582E61,
  			            0x4E58F48F, 0xF2DDFDA2, 0xF474EF38, 0x8789BDC2,
  			            0x5366F9C3, 0xC8B38E74, 0xB475F255, 0x46FCD9B9,
  			            0x7AEB2661, 0x8B1DDF84, 0x846A0E79, 0x915F95E2,
  			            0x466E598E, 0x20B45770, 0x8CD55591, 0xC902DE4C,
  			            0xB90BACE1, 0xBB8205D0, 0x11A86248, 0x7574A99E,
  			            0xB77F19B6, 0xE0A9DC09, 0x662D09A1, 0xC4324633,
  			            0xE85A1F02, 0x09F0BE8C, 0x4A99A025, 0x1D6EFE10,
  			            0x1AB93D1D, 0x0BA5A4DF, 0xA186F20F, 0x2868F169,
  			            0xDCB7DA83, 0x573906FE, 0xA1E2CE9B, 0x4FCD7F52,
  			            0x50115E01, 0xA70683FA, 0xA002B5C4, 0x0DE6D027,
  			            0x9AF88C27, 0x773F8641, 0xC3604C06, 0x61A806B5,
  			            0xF0177A28, 0xC0F586E0, 0x006058AA, 0x30DC7D62,
  			            0x11E69ED7, 0x2338EA63, 0x53C2DD94, 0xC2C21634,
  			            0xBBCBEE56, 0x90BCB6DE, 0xEBFC7DA1, 0xCE591D76,
  			            0x6F05E409, 0x4B7C0188, 0x39720A3D, 0x7C927C24,
  			            0x86E3725F, 0x724D9DB9, 0x1AC15BB4, 0xD39EB8FC,
  			            0xED545578, 0x08FCA5B5, 0xD83D7CD3, 0x4DAD0FC4,
  			            0x1E50EF5E, 0xB161E6F8, 0xA28514D9, 0x6C51133C,
  			            0x6FD5C7E7, 0x56E14EC4, 0x362ABFCE, 0xDDC6C837,
  			            0xD79A3234, 0x92638212, 0x670EFA8E, 0x406000E0  ],
  			        [   0x3A39CE37, 0xD3FAF5CF, 0xABC27737, 0x5AC52D1B,
  			            0x5CB0679E, 0x4FA33742, 0xD3822740, 0x99BC9BBE,
  			            0xD5118E9D, 0xBF0F7315, 0xD62D1C7E, 0xC700C47B,
  			            0xB78C1B6B, 0x21A19045, 0xB26EB1BE, 0x6A366EB4,
  			            0x5748AB2F, 0xBC946E79, 0xC6A376D2, 0x6549C2C8,
  			            0x530FF8EE, 0x468DDE7D, 0xD5730A1D, 0x4CD04DC6,
  			            0x2939BBDB, 0xA9BA4650, 0xAC9526E8, 0xBE5EE304,
  			            0xA1FAD5F0, 0x6A2D519A, 0x63EF8CE2, 0x9A86EE22,
  			            0xC089C2B8, 0x43242EF6, 0xA51E03AA, 0x9CF2D0A4,
  			            0x83C061BA, 0x9BE96A4D, 0x8FE51550, 0xBA645BD6,
  			            0x2826A2F9, 0xA73A3AE1, 0x4BA99586, 0xEF5562E9,
  			            0xC72FEFD3, 0xF752F7DA, 0x3F046F69, 0x77FA0A59,
  			            0x80E4A915, 0x87B08601, 0x9B09E6AD, 0x3B3EE593,
  			            0xE990FD5A, 0x9E34D797, 0x2CF0B7D9, 0x022B8B51,
  			            0x96D5AC3A, 0x017DA67D, 0xD1CF3ED6, 0x7C7D2D28,
  			            0x1F9F25CF, 0xADF2B89B, 0x5AD6B472, 0x5A88F54C,
  			            0xE029AC71, 0xE019A5E6, 0x47B0ACFD, 0xED93FA9B,
  			            0xE8D3C48D, 0x283B57CC, 0xF8D56629, 0x79132E28,
  			            0x785F0191, 0xED756055, 0xF7960E44, 0xE3D35E8C,
  			            0x15056DD4, 0x88F46DBA, 0x03A16125, 0x0564F0BD,
  			            0xC3EB9E15, 0x3C9057A2, 0x97271AEC, 0xA93A072A,
  			            0x1B3F6D9B, 0x1E6321F5, 0xF59C66FB, 0x26DCF319,
  			            0x7533D928, 0xB155FDF5, 0x03563482, 0x8ABA3CBB,
  			            0x28517711, 0xC20AD9F8, 0xABCC5167, 0xCCAD925F,
  			            0x4DE81751, 0x3830DC8E, 0x379D5862, 0x9320F991,
  			            0xEA7A90C2, 0xFB3E7BCE, 0x5121CE64, 0x774FBE32,
  			            0xA8B6E37E, 0xC3293D46, 0x48DE5369, 0x6413E680,
  			            0xA2AE0810, 0xDD6DB224, 0x69852DFD, 0x09072166,
  			            0xB39A460A, 0x6445C0DD, 0x586CDECF, 0x1C20C8AE,
  			            0x5BBEF7DD, 0x1B588D40, 0xCCD2017F, 0x6BB4E3BB,
  			            0xDDA26A7E, 0x3A59FF45, 0x3E350A44, 0xBCB4CDD5,
  			            0x72EACEA8, 0xFA6484BB, 0x8D6612AE, 0xBF3C6F47,
  			            0xD29BE463, 0x542F5D9E, 0xAEC2771B, 0xF64E6370,
  			            0x740E0D8D, 0xE75B1357, 0xF8721671, 0xAF537D5D,
  			            0x4040CB08, 0x4EB4E2CC, 0x34D2466A, 0x0115AF84,
  			            0xE1B00428, 0x95983A1D, 0x06B89FB4, 0xCE6EA048,
  			            0x6F3F3B82, 0x3520AB82, 0x011A1D4B, 0x277227F8,
  			            0x611560B1, 0xE7933FDC, 0xBB3A792B, 0x344525BD,
  			            0xA08839E1, 0x51CE794B, 0x2F32C9B7, 0xA01FBAC9,
  			            0xE01CC87E, 0xBCC7D1F6, 0xCF0111C3, 0xA1E8AAC7,
  			            0x1A908749, 0xD44FBD9A, 0xD0DADECB, 0xD50ADA38,
  			            0x0339C32A, 0xC6913667, 0x8DF9317C, 0xE0B12B4F,
  			            0xF79E59B7, 0x43F5BB3A, 0xF2D519FF, 0x27D9459C,
  			            0xBF97222C, 0x15E6FC2A, 0x0F91FC71, 0x9B941525,
  			            0xFAE59361, 0xCEB69CEB, 0xC2A86459, 0x12BAA8D1,
  			            0xB6C1075E, 0xE3056A0C, 0x10D25065, 0xCB03A442,
  			            0xE0EC6E0E, 0x1698DB3B, 0x4C98A0BE, 0x3278E964,
  			            0x9F1F9532, 0xE0D392DF, 0xD3A0342B, 0x8971F21E,
  			            0x1B0A7441, 0x4BA3348C, 0xC5BE7120, 0xC37632D8,
  			            0xDF359F8D, 0x9B992F2E, 0xE60B6F47, 0x0FE3F11D,
  			            0xE54CDA54, 0x1EDAD891, 0xCE6279CF, 0xCD3E7E6F,
  			            0x1618B166, 0xFD2C1D05, 0x848FD2C5, 0xF6FB2299,
  			            0xF523F357, 0xA6327623, 0x93A83531, 0x56CCCD02,
  			            0xACF08162, 0x5A75EBB5, 0x6E163697, 0x88D273CC,
  			            0xDE966292, 0x81B949D0, 0x4C50901B, 0x71C65614,
  			            0xE6C6C7BD, 0x327A140A, 0x45E1D006, 0xC3F27B9A,
  			            0xC9AA53FD, 0x62A80F00, 0xBB25BFE2, 0x35BDD2F6,
  			            0x71126905, 0xB2040222, 0xB6CBCF7C, 0xCD769C2B,
  			            0x53113EC0, 0x1640E3D3, 0x38ABBD60, 0x2547ADF0,
  			            0xBA38209C, 0xF746CE76, 0x77AFA1C5, 0x20756060,
  			            0x85CBFE4E, 0x8AE88DD8, 0x7AAAF9B0, 0x4CF9AA7E,
  			            0x1948C25C, 0x02FB8A8C, 0x01C36AE4, 0xD6EBE1F9,
  			            0x90D4F869, 0xA65CDEA0, 0x3F09252D, 0xC208E69F,
  			            0xB74E6132, 0xCE77E25B, 0x578FDFE3, 0x3AC372E6  ]
  			    ];

  			    var BLOWFISH_CTX = {
  			        pbox: [],
  			        sbox: []
  			    };

  			    function F(ctx, x){
  			        let a = (x >> 24) & 0xFF;
  			        let b = (x >> 16) & 0xFF;
  			        let c = (x >> 8) & 0xFF;
  			        let d = x & 0xFF;

  			        let y = ctx.sbox[0][a] + ctx.sbox[1][b];
  			        y = y ^ ctx.sbox[2][c];
  			        y = y + ctx.sbox[3][d];

  			        return y;
  			    }

  			    function BlowFish_Encrypt(ctx, left, right){
  			        let Xl = left;
  			        let Xr = right;
  			        let temp;

  			        for(let i = 0; i < N; ++i){
  			            Xl = Xl ^ ctx.pbox[i];
  			            Xr = F(ctx, Xl) ^ Xr;

  			            temp = Xl;
  			            Xl = Xr;
  			            Xr = temp;
  			        }

  			        temp = Xl;
  			        Xl = Xr;
  			        Xr = temp;

  			        Xr = Xr ^ ctx.pbox[N];
  			        Xl = Xl ^ ctx.pbox[N + 1];

  			        return {left: Xl, right: Xr};
  			    }

  			    function BlowFish_Decrypt(ctx, left, right){
  			        let Xl = left;
  			        let Xr = right;
  			        let temp;

  			        for(let i = N + 1; i > 1; --i){
  			            Xl = Xl ^ ctx.pbox[i];
  			            Xr = F(ctx, Xl) ^ Xr;

  			            temp = Xl;
  			            Xl = Xr;
  			            Xr = temp;
  			        }

  			        temp = Xl;
  			        Xl = Xr;
  			        Xr = temp;

  			        Xr = Xr ^ ctx.pbox[1];
  			        Xl = Xl ^ ctx.pbox[0];

  			        return {left: Xl, right: Xr};
  			    }

  			    /**
  			     * Initialization ctx's pbox and sbox.
  			     *
  			     * @param {Object} ctx The object has pbox and sbox.
  			     * @param {Array} key An array of 32-bit words.
  			     * @param {int} keysize The length of the key.
  			     *
  			     * @example
  			     *
  			     *     BlowFishInit(BLOWFISH_CTX, key, 128/32);
  			     */
  			    function BlowFishInit(ctx, key, keysize)
  			    {
  			        for(let Row = 0; Row < 4; Row++)
  			        {
  			            ctx.sbox[Row] = [];
  			            for(let Col = 0; Col < 256; Col++)
  			            {
  			                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
  			            }
  			        }

  			        let keyIndex = 0;
  			        for(let index = 0; index < N + 2; index++)
  			        {
  			            ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
  			            keyIndex++;
  			            if(keyIndex >= keysize)
  			            {
  			                keyIndex = 0;
  			            }
  			        }

  			        let Data1 = 0;
  			        let Data2 = 0;
  			        let res = 0;
  			        for(let i = 0; i < N + 2; i += 2)
  			        {
  			            res = BlowFish_Encrypt(ctx, Data1, Data2);
  			            Data1 = res.left;
  			            Data2 = res.right;
  			            ctx.pbox[i] = Data1;
  			            ctx.pbox[i + 1] = Data2;
  			        }

  			        for(let i = 0; i < 4; i++)
  			        {
  			            for(let j = 0; j < 256; j += 2)
  			            {
  			                res = BlowFish_Encrypt(ctx, Data1, Data2);
  			                Data1 = res.left;
  			                Data2 = res.right;
  			                ctx.sbox[i][j] = Data1;
  			                ctx.sbox[i][j + 1] = Data2;
  			            }
  			        }

  			        return true;
  			    }

  			    /**
  			     * Blowfish block cipher algorithm.
  			     */
  			    var Blowfish = C_algo.Blowfish = BlockCipher.extend({
  			        _doReset: function () {
  			            // Skip reset of nRounds has been set before and key did not change
  			            if (this._keyPriorReset === this._key) {
  			                return;
  			            }

  			            // Shortcuts
  			            var key = this._keyPriorReset = this._key;
  			            var keyWords = key.words;
  			            var keySize = key.sigBytes / 4;

  			            //Initialization pbox and sbox
  			            BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
  			        },

  			        encryptBlock: function (M, offset) {
  			            var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
  			            M[offset] = res.left;
  			            M[offset + 1] = res.right;
  			        },

  			        decryptBlock: function (M, offset) {
  			            var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
  			            M[offset] = res.left;
  			            M[offset + 1] = res.right;
  			        },

  			        blockSize: 64/32,

  			        keySize: 128/32,

  			        ivSize: 64/32
  			    });

  			    /**
  			     * Shortcut functions to the cipher's object interface.
  			     *
  			     * @example
  			     *
  			     *     var ciphertext = CryptoJS.Blowfish.encrypt(message, key, cfg);
  			     *     var plaintext  = CryptoJS.Blowfish.decrypt(ciphertext, key, cfg);
  			     */
  			    C.Blowfish = BlockCipher._createHelper(Blowfish);
  			}());


  			return CryptoJS.Blowfish;

  		})); 
  	} (blowfish));
  	return blowfish.exports;
  }

  (function (module, exports) {
  (function (root, factory, undef) {
  		{
  			// CommonJS
  			module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), encBase64Exports, requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
  		}
  	}(commonjsGlobal, function (CryptoJS) {

  		return CryptoJS;

  	})); 
  } (cryptoJs));

  var cryptoJsExports = cryptoJs.exports;

  class TourCMS {

      // HTTP VERBS
      static HTTP_VERB_GET = 'GET'
      static HTTP_VERB_POST = 'POST'

      // ACCOUNT
      static P_ACCOUNT_CREATE = '/p/account/create.xml'
      static P_ACCOUNT_UPDATE = '/p/account/update.xml'
      static P_ACCOUNT_SHOW = '/p/account/show.xml'
      static ACCOUNT_CUSTOM_FIELDS_GET = '/api/account/custom_fields/get.xml';

      // AGENTS 
      static C_AGENTS_SEARCH = '/c/agents/search.xml'
      static P_AGENTS_SEARCH = '/p/agents/search.xml'
      static C_AGENTS_UPDATE = '/c/agents/update.xml'

      // API
      static API_RATE_LIMIT = '/api/rate_limit_status.xml'

      // CHANNELS
      static P_CHANNELS_LIST = '/p/channels/list.xml'
      static C_CHANNEL_SHOW = '/c/channel/show.xml'
      static C_CHANNEL_LOGO_UPLOAD_GET_URL = '/c/channel/logo/upload/url.xml'
      static C_CHANNEL_LOGO_UPLOAD_PROCESS = '/c/channel/logo/upload/process.xml'
      static P_CHANNEL_PERFORMANCE = '/p/channels/performance.xml'
      static C_CHANNEL_PERFORMANCE = '/c/channels/performance.xml'
      static P_CHANNEL_CREATE = '/p/channel/create.xml'
      static P_CHANNEL_UPDATE = '/p/channel/update.xml'

      // TOURS / HOTELS
      static C_TOURS_SEARCH = '/c/tours/search.xml'
      static P_TOURS_SEARCH = '/p/tours/search.xml'
      static P_HOTELS_SEARCH_RANGE = '/p/hotels/search_range.xml'
      static C_HOTELS_SEARCH_RANGE = '/c/hotels/search_range.xml'
      static P_HOTELS_SEARCH_AVAIL = '/p/hotels/search_avail.xml'
      static C_HOTELS_SEARCH_AVAIL = '/c/hotels/search_avail.xml'
      static C_TOURS_FILTERS = '/c/tours/filters.xml'
      static C_TOUR_UPDATE = '/c/tour/update.xml'
      static C_TOURS_LIST = '/c/tours/list.xml'
      static P_TOURS_LIST = '/p/tours/list.xml'
      static P_TOUR_IMAGES_LIST = '/p/tours/images/list.xml'
      static C_TOUR_IMAGES_LIST = '/c/tours/images/list.xml'
      static P_TOURS_LOCATIONS = '/p/tours/locations.xml'
      static C_TOURS_LOCATIONS = '/c/tours/locations.xml'
      static C_TOUR_DELETE = '/c/tour/delete.xml'
      static C_TOUR_SHOW = '/c/tour/show.xml'
      static C_TOURS_FILES_UPLOAD_GET_URL = '/c/tours/files/upload/url.xml'
      static C_TOURS_FILES_UPLOAD_PROCESS = '/c/tours/files/upload/process.xml'
      static C_TOUR_IMAGES_DELETE = '/c/tour/images/delete.xml'
      static C_TOUUR_DOCUMENT_DELETE = '/c/tour/document/delete.xml'
      static C_TOUR_CHECKAVAIL = '/c/tour/datesprices/checkavail.xml'

      // TOUR IMPORTER
      static TOURS_IMPORTER_FACETS_GET = "/api/tours/importer/get_tour_facets.xml";
      static TOURS_IMPORTER_LIST_GET = "/api/tours/importer/get_tour_list.xml";
      static TOURS_IMPORTER_IMPORT_STATUS = "/api/tours/importer/get_import_tours_status.xml";
      static TOUR_BOOKINGS_RESTRICTIONS_LIST = "/api/tours/restrictions/list_tour_bookings_restrictions.xml";

      // DATES AND PRICES
      static C_TOUR_DATESPRICES_SEARCH = '/c/tour/datesprices/datesndeals/search.xml'
      static C_TOUR_DATESPRICES_DEPARTURES_SHOW = '/c/tour/datesprices/dep/show.xml'
      static C_TOUR_DATESPRICES_FREESALE_SHOW = '/c/tour/datesprices/freesale/show.xml'
      static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SEARCH = '/c/tour/datesprices/dep/manage/search.xml'
      static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SHOW = '/c/tour/datesprices/dep/manage/show.xml'
      static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_NEW = '/c/tour/datesprices/dep/manage/new.xml'
      static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_UPDATE = '/c/tour/datesprices/dep/manage/update.xml'
      static C_TOUR_DATESPRICES_DEPARTURES_MANAGE_DELETE = '/c/tour/datesprices/dep/manage/delete.xml'

      // PICKUPS
      static C_PICKUPS_NEW = '/c/pickups/new.xml'
      static C_PICKUPS_LIST = '/c/pickups/list.xml'
      static C_PICKUPS_UPDATE = '/c/pickups/update.xml'
      static C_PICKUPS_DELETE = '/c/pickups/delete.xml'

      // PICKUP ROUTES
      static TOUR_PICKUP_ROUTES_SHOW = '/api/tours/pickup/routes/show.xml'
      static TOUR_PICKUP_ROUTES_UPDATE = '/api/tours/pickup/routes/update.xml'
      static TOUR_PICKUP_ROUTES_ADD_PICKUP = '/api/tours/pickup/routes/pickup_add.xml'
      static TOUR_PICKUP_ROUTES_UPDATE_PICKUP = '/api/tours/pickup/routes/pickup_update.xml'
      static TOUR_PICKUP_ROUTES_DELETE_PICKUP = '/api/tours/pickup/routes/pickup_delete.xml'

      // GEOCODES
      static TOUR_GEOS_CREATE = '/api/tours/geos/create.xml'
      static TOUR_GEOS_UPDATE = '/api/tours/geos/update.xml'
      static TOUR_GEOS_DELETE = '/api/tours/geos/delete.xml'

      // PROMO
      static C_PROMO_SHOW = '/c/promo/show.xml'

      // MARKUPS
      static C_MARKUPS_SHOW = '/c/markups/show.xml'

      // BOOKINGS
      static C_BOOKINGS_LIST = '/c/bookings/list.xml'
      static P_BOOKINGS_LIST = '/p/bookings/list.xml'
      static C_BOOKING_SHOW = '/c/booking/show.xml'
      static C_BOOKING_SEND_EMAIL = '/c/booking/email/send.xml'
      static C_BOOKING_CANCEL = '/c/booking/cancel.xml'
      static C_BOOKING_COMMIT = '/c/booking/new/commit.xml'
      static C_BOOKING_DELETE = '/c/booking/delete.xml'
      static C_BOOKING_NOTE_NEW = '/c/booking/note/new.xml'
      static C_BOOKING_NEW_REDIRECT_URL = '/c/booking/new/get_redirect_url.xml'
      static C_START_NEW_BOOKING = '/c/booking/new/start.xml'
      static P_BOOKING_SEARCH = '/p/bookings/search.xml'
      static C_BOOKING_SEARCH = '/c/bookings/search.xml'
      static P_VOUCHER_SEARCH = '/p/voucher/search.xml'
      static C_VOUCHER_SEARCH = '/c/voucher/search.xml'
      static C_BOOKING_UPDATE = '/c/booking/update.xml'
      static C_BOOKING_PAYMENT_NEW = '/c/booking/payment/new.xml'
      static C_BOOKING_PAYMENT_FAIL = '/c/booking/payment/fail.xml'
      static C_BOOKING_PAYMENT_SPREEDLY_NEW = '/c/booking/payment/spreedly/new.xml'
      static C_BOOKING_PAYMENT_SPREEDLY_COMPLETE = '/c/booking/gatewaytransaction/spreedlycomplete.xml'
      static C_BOOKING_OPTIONS_CHECKAVAIL = '/c/booking/options/checkavail.xml'
      static C_BOOKING_COMPONENT_NEW = '/c/booking/component/new.xml'
      static C_BOOKING_COMPONENT_UPDATE = '/c/booking/component/update.xml'
      static C_BOOKING_COMPONENT_DELETE = '/c/booking/component/delete.xml'

      // ENQUIRIES
      static C_ENQUIRY_NEW = '/c/enquiry/new.xml'
      static C_ENQUIRY_SHOW = '/c/enquiry/show.xml'
      static C_ENQUIRIES_SEARCH = '/c/enquiries/search.xml'
      static P_ENQUIRIES_SEARCH = '/p/enquiries/search.xml'
      
      // VOUCHERS
      static C_VOUCHER_REEDEM = '/c/voucher/redeem.xml'

      // CUSTOMERS
      static C_CUSTOMER_SHOW = '/c/customer/show.xml'
      static C_CUSTOMER_UPDATE = '/c/customer/update.xml'
      static C_CUSTOMER_LOGIN_SEARCH = '/c/customers/login_search.xml'

      // MIXED
      static C_START_AGENT_LOGIN = '/c/start_agent_login.xml'
      static C_RETRIEVE_AGENT_BOOKING_KEY = '/c/retrieve_agent_booking_key.xml'
      static C_BOOKING_PAYMENT_LIST = '/c/booking/payment/list.xml'
      static C_BOOKING_PAYMENT_PAYWORKS_NEW = '/c/booking/payment/payworks/new.xml'
      static C_SUPPLIER_SHOW = '/c/supplier/show.xml'
      static C_STAFF_LIST = '/c/staff/list.xml'

      // HMAC
      static HMAC_MD5 = 'MD5'
      static HMAC_SHA1 = 'SHA1'
      static HMAC_SHA3 = 'SHA3'
      static HMAC_SHA256 = 'SHA256'
      static HMAC_SHA512 = 'SHA512'
          
      axios
      baseURL = ''
      marketplaceId = ''
      APIKey = ''
      lastResponseHeaders = []
      userAgent = 'TourCMS JS Wrapper v2.0.0'
      x2js = null

      constructor(marketplaceId, APIKey) {

          this.baseURL = 'https://api.tourcms.com';
          this.marketplaceId = marketplaceId;
          this.APIKey = APIKey;
          this.axios = axios.create({
              baseURL: this.baseURL,
              headers: {
                  'Content-Type': 'application/xml'
              }
          });
          this.x2js = new X2JS();
      }

      setBaseURL(baseURL)
      {
          this.baseURL = baseURL;
      }

      request(path, channelId, verb, postData = null) {

          channelId = channelId ?? 0;
          verb = verb ?? TourCMS.HTTP_VERB_GET;

          let endpoint = this.baseURL + path;
          let outboundTime = this.time();
          let signature = this.generateSignature(path, channelId, verb, outboundTime);

          if (postData) {
              if (typeof postData !== 'string') {
                  let s = new XMLSerializer();
                  postData = s.serializeToString(postData);
              }
          }

          let config = {
              headers: {
                  'Content-type': 'Content-typear: text/xml;charset="utf-8"',
                  'x-tourcms-date': outboundTime,
                  'Authorization': 'TourCMS ' + channelId + ':' + this.marketplaceId + ':' + signature,
              }
          };

          let response = false;
          if (TourCMS.HTTP_VERB_GET === verb.toUpperCase()) {
              response = axios.get(endpoint, config);
          } else if (TourCMS.HTTP_VERB_POST === verb.toUpperCase()) {
              response = axios.post(endpoint, postData, config);
          } else {
              throw new Error('HTTP Method not allowed')
          }

          return response;
      }

      // API methods (Housekeeping)

      listChannels() {
          return this.request(TourCMS.P_CHANNELS_LIST)
      }

      APIRateLimitStatus(channel = 0) {
          return this.request(TourCMS.APIRateLimitStatus, channel)
      }

      // Channel Methods

      channelUploadLogoGetUrl(channel) {
          return this.request(TourCMS.C_CHANNEL_LOGO_UPLOAD_GET_URL, channel)
      }

      channelUploadLogoProcess(channel, uploadInfo) {
          return this.request(TourCMS.C_CHANNEL_LOGO_UPLOAD_PROCESS, channel, TourCMS.HTTP_VERB_POST, uploadInfo);
      }

      showChannel(channel) {
          return this.request(TourCMS.C_CHANNEL_SHOW, channel)
      }

      channelPerformance(channel = 0) {
          if (channel == 0)
              return (this.request(TourCMS.P_CHANNEL_PERFORMANCE));
          else
              return (this.request(TourCMS.C_CHANNEL_PERFORMANCE, channel));
      }


      // Tours Methods

      searchTours(channel = 0, params = '') {
          params = this.validateParams(params);
          if (channel == 0) {
              return this.request(TourCMS.P_TOURS_SEARCH + params, channel)
          } else {
              return this.request(TourCMS.C_TOURS_SEARCH + params, channel)
          }
      }

      searchHotelsRange(channel = 0, tour = '', params = '') {

          params = this.validateParams(params);

          if (tour) {
              if (!params) {
                  params = '?single_tour_id=';
              } else {
                  params += "&single_tour_id=";
              }
              params += tour;
          }

          if (channel == 0)
              return (this.request(TourCMS.P_HOTELS_SEARCH_RANGE + params));
          else
              return (this.request(TourCMS.P_HOTELS_SEARCH_RANGE + params, channel));
      }

      searchHotelsSpecific(channel = 0, tour = '', params = '') {
          params = this.validateParams(params);

          if (tour) {
              if (!params) {
                  params = '?single_tour_id=';
              } else {
                  params += "&single_tour_id=";
              }
              params += tour;
          }

          if (channel == 0)
              return (this.request(TourCMS.P_HOTELS_SEARCH_AVAIL + params));
          else
              return (this.request(TourCMS.C_HOTELS_SEARCH_AVAIL + params, channel));
      }

      listProductFilters(channel = 0) {
          return (this.request(TourCMS.C_TOURS_FILTERS, channel));
      }

      updateTour(channel, tourData) {
          return (this.request(TourCMS.C_TOUR_UPDATE, channel, TourCMS.HTTP_VERB_POST, tourData));
      }

      updateTourUrl(channel, tour, tourUrl) {

          let xmlString = "<tour><tour_id>" + tour + "</tour_id><tour_url>" + tourUrl + "</tour_url></tour>";
          let postData = this.parseXML(xmlString);

          return (this.updateTour(postData, channel));
      }

      listTours(channel = 0, params = '') {
          if (channel == 0) {
              return this.request(TourCMS.P_TOURS_LIST + params, channel)
          } else {
              return this.request(TourCMS.C_TOURS_LIST + params, channel)
          }
      }

      listTourImages(channel = 0, params = '') {
          params = this.validateParams(params);
          if (channel == 0)
              return (this.request(TourCMS.P_TOUR_IMAGES_LIST + params));
          else
              return (this.request(TourCMS.C_TOUR_IMAGES_LIST + params, channel));
      }

      listTourLocations(channel = 0, params = '') {
          params = this.validateParams(params);
          if (channel == 0)
              return (this.request(TourCMS.P_TOURS_LOCATIONS + params));
          else
              return (this.request(TourCMS.C_TOURS_LOCATIONS + params, channel));

      }

      deletetour(channel, tour) {
          let endpoint = this.TOUR_DELETE + '?id=' + tour;
          return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
      }

      showTour(channel, tour, params = '') {
          let endpoint = TourCMS.C_TOUR_SHOW + '?id=' + tour;
          if (params) {
              endpoint += "&" + params;
          }
          return this.request(endpoint, channel)
      }

      tourUploadFileGetUrl(channel, tour, fileType, fileId) {
          let endpoint = TourCMS.C_TOURS_FILES_UPLOAD_GET_URL + '?id=' + tour + '&file_type=' + fileType + '&file_id=' + fileId;
          return this.request(endpoint, channel)
      }

      tourUploadFileProcess(channel, uploadInfo) {
          return this.request(TourCMS.C_TOURS_FILES_UPLOAD_PROCESS, channel, TourCMS.HTTP_VERB_POST, uploadInfo)
      }

      deletetourimage(channel, imageInfo) {
          return this.request(TourCMS.C_TOUR_IMAGES_DELETE, channel, TourCMS.HTTP_VERB_POST, imageInfo)
      }

      deleteTourDocument(channel, documentXml) {
          return this.request(TourCMS.C_TOUUR_DOCUMENT_DELETE, channel, TourCMS.HTTP_VERB_POST, documentXml)
      }

      checkTourAvailability(channel, tourId, params = '') {
          let endpoint = TourCMS.C_TOUR_CHECKAVAIL + '?id=' + tourId;
          if (params) {
              endpoint += "&" + params;
          }
          return this.request(endpoint, channel)
      }

      showTourDatesAndDeals(channel, tour, params = '') {
          if (params) params = "&".params;
          let endpoint = TourCMS.C_TOUR_DATESPRICES_SEARCH + '?id=' + tour + params;
          return this.request(endpoint, channel)
      }

      showTourDepartures(channel, tour, params = '') {
          if (params) params = "&".params;
          return this.request(TourCMS.C_TOUR_DATESPRICES_DEPARTURES_SHOW + '?id=' + tour + params, channel)
      }

      showTourFreesale(channel, tour) {
          return this.request(TourCMS.C_TOUR_DATESPRICES_FREESALE_SHOW + '?id=' + tour, channel)
      }

      // Raw departure methods


      searchRawDepartures(channel, tour, params = '') {
          let endpoint = TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SEARCH + '?id=' + tour;
          if (params) {
              endpoint += params;
          }
          return (this.request(endpoint, channel));
      }

      showDeparture(channel, tour, departure) {
          let endpoint = TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_SHOW + '?id=' + tour + '&departure_id=' + departure;
          return this.request(endpoint, channel)
      }

      createDeparture(channel, departureData) {
          return this.request(TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_NEW, channel, TourCMS.HTTP_VERB_POST, departureData)
      }

      updateDeparture(channel, departureData) {
          return this.request(TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_UPDATE, channel, TourCMS.HTTP_VERB_POST, departureData)
      }

      deleteDeparture(channel, tour, departure) {
          let endpoint = TourCMS.C_TOUR_DATESPRICES_DEPARTURES_MANAGE_DELETE + '?id=' + tour + '&departure_id=' + departure;
          return this.request(endpoint, channel, TourCMS.HTTP_VERB_POST)
      }

      // Promo methods

      showPromo(channel, promoCode) {
          let endpoint = TourCMS.C_PROMO_SHOW + '?promo_code=' + promoCode;
          return this.request(endpoint, channel)
      }


      // Bookings methods

      getBookingRedirectUrl(channel, urlData) {
          return this.request(TourCMS.C_BOOKING_NEW_REDIRECT_URL, channel, TourCMS.HTTP_VERB_POST, urlData)
      }

      startNewBooking(channel, bookingData) {
          return this.request(TourCMS.C_START_NEW_BOOKING, channel, TourCMS.HTTP_VERB_POST, bookingData)
      }

      commitBooking(channel, bookingId) {
          let xmlString = "<booking><booking_id>" + bookingId + "</booking_id></booking>";
          let postData = this.parseXML(xmlString);
          return this.request(TourCMS.C_BOOKING_COMMIT, channel, TourCMS.HTTP_VERB_POST, postData);
      }


      // Retrieving bookings

      searchBookings(channel = 0, params = '') {
          params = this.validateParams(params);
          if (channel == 0)
              return (this.request(TourCMS.P_BOOKING_SEARCH + params));
          else
              return (this.request(TourCMS.C_BOOKING_SEARCH + params, channel));
      }

      listBookings(channel = 0, params = '') {
          let endpoint = TourCMS.C_BOOKINGS_LIST;
          if (channel == 0) {
              endpoint = TourCMS.P_BOOKINGS_LIST;
          }
          if (params) {
              params = this.validateParams(params);
              endpoint += params;
          }
          return this.request(endpoint, channel)

      }

      showBooking(channel, bookingId, params = '') {
          let endpoint = TourCMS.C_BOOKING_SHOW + '?booking_id=' + bookingId;
          if (params) {
              endpoint += '&' + params;
          }
          return this.request(endpoint, channel)
      }

      searchVoucher(channel = 0, voucherData = null) {

          if (!voucherData) {
              voucherData = '<voucher><barcode_data></barcode_data></voucher>';
          }
          let postData = this.parseXML(voucherData);

          if (channel == 0) {
              return (this.request(TourCMS.P_VOUCHER_SEARCH, channel, TourCMS.HTTP_VERB_POST, postData));
          } else {
              return (this.request(TourCMS.C_VOUCHER_SEARCH, channel, TourCMS.HTTP_VERB_POST, postData));
          }
      }

      // Updating bookings

      updateBooking(channel, bookingData) {
          return (this.request(TourCMS.C_BOOKING_UPDATE, channel, TourCMS.HTTP_VERB_POST, bookingData));
      }

      createPayment(channel, paymentData) {
          return (this.request(TourCMS.C_BOOKING_PAYMENT_NEW, channel, TourCMS.HTTP_VERB_POST, paymentData));
      }

      logFailedPayment(channel, paymentData) {
          return (this.request(TourCMS.C_BOOKING_PAYMENT_FAIL, channel, TourCMS.HTTP_VERB_POST, paymentData));
      }

      spreedlyCreatePayment(channel, paymentData) {
          return (this.request(TourCMS.C_BOOKING_PAYMENT_SPREEDLY_NEW, channel, TourCMS.HTTP_VERB_POST, paymentData));
      }

      spreedlyCompletePayment(channel, transactionId) {
          let endpoint = TourCMS.C_BOOKING_PAYMENT_SPREEDLY_COMPLETE + '?id=' + transactionId;
          return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
      }

      cancelBooking(channel, bookingData) {
          return this.request(TourCMS.C_BOOKING_CANCEL, channel, TourCMS.HTTP_VERB_POST, bookingData);
      }

      deleteBooking(channel, booking) {
          let endpoint = TourCMS.C_BOOKING_DELETE + '?booking_id=' + booking;
          return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
      }

      checkOptionAvailability(channel, booking, tourComponentId) {
          let endpoint = TourCMS.C_BOOKING_OPTIONS_CHECKAVAIL + '?booking_id=' + booking + '&tour_component_id=' + tourComponentId;
          return (this.request(endpoint , channel));
      }

      bookingAddComponent(channel, componentData) {
          return (this.request(TourCMS.C_BOOKING_COMPONENT_NEW, channel, TourCMS.HTTP_VERB_POST, componentData));
      }

      bookingUpdateComponent(channel, componentData) {
          return (this.request(TourCMS.C_BOOKING_COMPONENT_UPDATE, channel, TourCMS.HTTP_VERB_POST, componentData));
      }

      bookingRemoveComponent(channel, componentData) {
          return (this.request(TourCMS.C_BOOKING_COMPONENT_DELETE, channel, TourCMS.HTTP_VERB_POST, componentData));
      }

      addNoteToBooking(channel, booking, text, type) {
          let xmlString = "<booking><booking_id>"+booking+"</booking_id><note><text>"+text+"</text><type>"+type+"</type></note></booking>";
          let postData = this.parseXML(xmlString);
          return (this.request(TourCMS.C_BOOKING_NOTE_NEW, channel, TourCMS.HTTP_VERB_POST, postData));
      }

      sendBookingEmail(channel, postData) {
          return this.request(TourCMS.C_BOOKING_SEND_EMAIL, channel, TourCMS.HTTP_VERB_POST, postData)
      }

      redeemVoucher(channel = 0, voucherData) {
          return (this.request(TourCMS.C_VOUCHER_REEDEM, channel, TourCMS.HTTP_VERB_POST, voucherData));
      }

      // Enquiry and customer methods

      createEnquiry(channel, enquiryData) {
          return (this.request(TourCMS.C_ENQUIRY_NEW, channel, TourCMS.HTTP_VERB_POST, enquiryData));
      }

      updateCustomer(channel, customerData) {
          return (this.request(TourCMS.C_CUSTOMER_UPDATE, channel, TourCMS.HTTP_VERB_POST, customerData));
      }

      searchEnquiries(channel = 0, params = '') {
          params = this.validateParams(params);
          if (channel == 0)
              return (this.request(TourCMS.P_ENQUIRIES_SEARCH + params));
          else
              return (this.request(TourCMS.C_ENQUIRIES_SEARCH + params, channel));
      }

      showEnquiry(channel, enquiry) {
          return (this.request(TourCMS.C_ENQUIRY_SHOW + '?enquiry_id=' + enquiry, channel));
      }

      showCustomer(channel, customer) {
          let endpoint = TourCMS.C_CUSTOMER_SHOW + '?customer_id=' + customer;
          return (this.request(endpoint, channel));
      }

      checkCustomerLogin(channel, customer, password) {
          let endpoint = TourCMS.C_CUSTOMER_LOGIN_SEARCH + '?customer_username=' + customer + '&customer_password=' + password;
          return (this.request(endpoint, channel));
      }

      // Agents methods 
      searchAgents(channel) {
          if (channel == 0) {
              return this.request(TourCMS.P_AGENTS_SEARCH, channel)
          } else {
              return this.request(TourCMS.C_AGENTS_SEARCH, channel)
          }
      }

      startNewAgentLogin(channel, params) {
          params = this.validateParams(params);
          let endpoint = TourCMS.C_START_AGENT_LOGIN + params;
          return (this.request(endpoint, channel, TourCMS.HTTP_VERB_POST));
      }

      retrieveAgentBookingKey(channel, privateToken) {
          let endpoint = TourCMS.C_RETRIEVE_AGENT_BOOKING_KEY + '?k=' + privateToken;
          return (this.request(endpoint, channel));
      }

      updateAgent(channel, agentData) {
          return (this.request(TourCMS.C_AGENTS_UPDATE, channel, TourCMS.HTTP_VERB_POST, agentData));
      }

      // Payments
      listPayments(channel, params) {
          params = this.validateParams(params);
          let endpoint = TourCMS.C_BOOKING_PAYMENT_LIST + params;
          return (this.request(endpoint, channel));
      }

      payworksBookingPaymentNew(channel, payment) {
          return (this.request(TourCMS.C_BOOKING_PAYMENT_PAYWORKS_NEW, channel, TourCMS.HTTP_VERB_POST, payment));
      }

      // Staff members
      listStaffMembers(channel) {
          return (this.request(TourCMS.C_STAFF_LIST, channel));
      }

      // Internal supplier methods
      showSupplier(channel, supplier) {
          let endpoint = TourCMS.C_SUPPLIER_SHOW + '?supplier_id=' + supplier;
          return (this.request(endpoint, channel));
      }

      // CRUD Pickup points
      listPickups(channel, params) {
          params = this.validateParams(params);
          let endpoint = TourCMS.C_PICKUPS_LIST + params;
          return (this.request(endpoint, channel));
      }

      createPickup(channel, pickupData) {
          return (this.request(TourCMS.C_PICKUPS_NEW, channel, TourCMS.HTTP_VERB_POST, pickupData));
      }

      updatePickup(channel, pickupData) {
          return (this.request(TourCMS.C_PICKUPS_UPDATE, channel, TourCMS.HTTP_VERB_POST, pickupData));
      }

      deletePickup(channel, pickupData) {
          return (this.request(TourCMS.C_PICKUPS_DELETE, channel, TourCMS.HTTP_VERB_POST, pickupData));
      }

      showToursPickupRoutes(channel, tour) {
          let endpoint = TourCMS.TOUR_PICKUP_ROUTES_SHOW + '?id=' + tour;
          return this.request(endpoint, channel);
      }

      updateToursPickupRoutes(channel, data) {
          return this.request(TourCMS.TOUR_PICKUP_ROUTES_UPDATE, channel, TourCMS.HTTP_VERB_POST, data);
      }

      toursPickupRoutesAddPickup(channel, data) {
          return this.request(TourCMS.TOUR_PICKUP_ROUTES_ADD_PICKUP, channel, TourCMS.HTTP_VERB_POST, data);
      }

      toursPickupRoutesUpdatePickup(channel, data) {
          return this.request(TourCMS.TOUR_PICKUP_ROUTES_UPDATE_PICKUP, channel, TourCMS.HTTP_VERB_POST, data);
      }

      toursPickupRoutesDeletePickup(channel, data) {
          return this.request(TourCMS.TOUR_PICKUP_ROUTES_DELETE_PICKUP, channel, TourCMS.HTTP_VERB_POST, data);
      }

      // Account methods
      createAccount(uploadInfo) {
          return (this.request(TourCMS.P_ACCOUNT_CREATE, 0, TourCMS.HTTP_VERB_POST, uploadInfo));
      }

      updateAccount(channel, uploadInfo) {
          return (this.request(TourCMS.P_ACCOUNT_UPDATE, channel, TourCMS.HTTP_VERB_POST, uploadInfo));
      }

      showAccount(accountId) {
          let endpoint = TourCMS.P_ACCOUNT_SHOW + '?account_id=' + accountId;
          return this.request(endpoint, 0);
      }

      createChannel(channel, channelInfo) {
          return (this.request(TourCMS.P_CHANNEL_CREATE, channel, TourCMS.HTTP_VERB_POST, channelInfo));
      }

      updateChannel(channel, channelInfo) {
          return (this.request(TourCMS.P_CHANNEL_UPDATE, channel, TourCMS.HTTP_VERB_POST, channelInfo));
      }

      showMarkupScheme(channel) {
          return (this.request(TourCMS.C_MARKUPS_SHOW, channel, TourCMS.HTTP_VERB_GET));
      }

      createTourGeopoint(channel, geopoint) {
          return this.request(TourCMS.TOUR_GEOS_CREATE, channel, TourCMS.HTTP_VERB_POST, geopoint);
      }

      updateTourGeopoint(channel, geopoint) {
          return this.request(TourCMS.TOUR_GEOS_UPDATE, channel, TourCMS.HTTP_VERB_POST, geopoint);
      }

      deleteTourGeopoint(channel, geopoint) {
          return this.request(TourCMS.TOUR_GEOS_DELETE, channel, TourCMS.HTTP_VERB_POST, geopoint);
      }

      getCustomFields(channel) {
          return this.request(TourCMS.ACCOUNT_CUSTOM_FIELDS_GET, channel, TourCMS.HTTP_VERB_GET);
      }

      getTourFacets(channel) {
          return this.request(TourCMS.TOURS_IMPORTER_FACETS_GET, channel, TourCMS.HTTP_VERB_GET);
      }

      getListTours(channel, params) {
          params = this.validateParams(params);
          let endpoint = TourCMS.TOURS_LIST_GET + params;
          return this.request(endpoint, channel, TourCMS.HTTP_VERB_GET);
      }

      getImportToursStatus(channel, codes) {
          return this.request(TourCMS.TOURS_IMPORTER_IMPORT_STATUS, channel, TourCMS.HTTP_VERB_POST, codes);
      }

      listTourBookingRestrictions(channel, params) {
          params = this.validateParams(params);
          let endpoint = TourCMS.TOUR_BOOKINGS_RESTRICTIONS_LIST + params;
          return this.request(endpoint, channel, TourCMS.HTTP_VERB_GET);
      }

      showTourPickupRoutes(channel, tourId) {
          let endpoint = TourCMS.TOUR_PICKUP_ROUTES_SHOW + '?id=' + tourId;
          return this.request(endpoint, channel)
      }

      // Auxiliary method

      generateSignature(path, channelId, verb, outboundTime) {

          let stringToSign = channelId + '/' + this.marketplaceId + '/' + verb + '/' + outboundTime + path;
          let signature = rawurlencode$1(Base64.stringify(cryptoJsExports.HmacSHA256(stringToSign, this.APIKey)));

          return signature
      }

      validateParams(params) {
          if (!params || typeof (params) !== 'string') {
              return '';
          }

          if (params && params.substring(0, 1) !== '?') {
              params = '?' + params;
          }

          return params;
      }

      time() {
          return Math.floor(new Date().getTime() / 1000)
      }

      parseXML(text) {
          let xmlDoc = '';
          if (window.DOMParser) {
              let parser = new DOMParser();
              xmlDoc = parser.parseFromString(text, 'text/xml');
          } else {
              xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
              xmlDoc.async = 'false';
              xmlDoc.loadXML(text);
          }
          return xmlDoc
      }

      XMLToJson(xml)
      {
          return this.x2js.xml2js(xml);
      }

      JSONToXML(json)
      {
          return this.x2js.js2xml(json);
      }

      XMLStringToJson(XMLString)
      {
          let xml = this.parseXML(XMLString);
          return this.XMLToJson(xml)
      }

      setLastResponseHeaders(headers) {
          let arr = headers.trim().split(/[\r\n]+/);
          this.lastResponseHeaders = arr;
      }

      getLastResponseHeaders() {
          return this.lastResponseHeaders
      }

      // Used for validating webhook signatures
      validateXMLHash(xml) {

          return this.generateXMLHash(xml) == xml.signed.hash;

      }

      generateXMLHash(xml) {

          let algorithm = xml.signed.algorithm;

          let fields = xml.signed.hash_fields.split(" ");

          let values = [];

          for (let field of fields) {

              let xpathResult = xml.xpath(field);

              for (let result of xpathResult) {
                  values.push(result[0].toString());
              }
          }

          let stringToHash = values.join("|");

          let hash = this.getHash(algorithm, stringToHash);

          return hash;

      }

      getHash(algorithm, stringToHash, key=null) {

          let hash = "";
          key = key ?? this.APIKey;

          switch (algorithm) {
              case TourCMS.HMAC_MD5:
                  hash = cryptoJsExports.HmacMD5(stringToHash, key);
                  break;
              case TourCMS.HMAC_SHA1:
                  hash = cryptoJsExports.HmacSHA1(stringToHash, key);
                  break;
              case TourCMS.HMAC_SHA3:
                  hash = cryptoJsExports.HmacSHA3(stringToHash, key);
                  break;
              case TourCMS.HMAC_SHA256:
                  hash = cryptoJsExports.HmacSHA256(stringToHash, key);
                  break;
              case TourCMS.HMAC_SHA512:
                  hash = cryptoJsExports.HmacSHA512(stringToHash, key);
                  break;
              default:
                  hash = cryptoJsExports.HmacSHA256(stringToHash, key);
                  break;
          }

          return hash;
      }
  }

  let tourCMS = new TourCMS(0, 'abc');
  tourCMS.listBookings().catch((e) => console.error(e));
  console.log('CARGADO');

  exports.tourCMS = tourCMS;

}));
