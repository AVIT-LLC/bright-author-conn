/******/ var __webpack_modules__ = ({

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BroadcastChannel: () => (/* binding */ BroadcastChannel),
/* harmony export */   OPEN_BROADCAST_CHANNELS: () => (/* binding */ OPEN_BROADCAST_CHANNELS),
/* harmony export */   clearNodeFolder: () => (/* binding */ clearNodeFolder),
/* harmony export */   enforceOptions: () => (/* binding */ enforceOptions)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/util.js");
/* harmony import */ var _method_chooser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/method-chooser.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/options.js");




/**
 * Contains all open channels,
 * used in tests to ensure everything is closed.
 */
var OPEN_BROADCAST_CHANNELS = new Set();
var lastId = 0;
var BroadcastChannel = function BroadcastChannel(name, options) {
  // identifier of the channel to debug stuff
  this.id = lastId++;
  OPEN_BROADCAST_CHANNELS.add(this);
  this.name = name;
  if (ENFORCED_OPTIONS) {
    options = ENFORCED_OPTIONS;
  }
  this.options = (0,_options_js__WEBPACK_IMPORTED_MODULE_2__.fillOptionsWithDefaults)(options);
  this.method = (0,_method_chooser_js__WEBPACK_IMPORTED_MODULE_1__.chooseMethod)(this.options);

  // isListening
  this._iL = false;

  /**
   * _onMessageListener
   * setting onmessage twice,
   * will overwrite the first listener
   */
  this._onML = null;

  /**
   * _addEventListeners
   */
  this._addEL = {
    message: [],
    internal: []
  };

  /**
   * Unsent message promises
   * where the sending is still in progress
   * @type {Set<Promise>}
   */
  this._uMP = new Set();

  /**
   * _beforeClose
   * array of promises that will be awaited
   * before the channel is closed
   */
  this._befC = [];

  /**
   * _preparePromise
   */
  this._prepP = null;
  _prepareChannel(this);
};

// STATICS

/**
 * used to identify if someone overwrites
 * window.BroadcastChannel with this
 * See methods/native.js
 */
BroadcastChannel._pubkey = true;

/**
 * clears the tmp-folder if is node
 * @return {Promise<boolean>} true if has run, false if not node
 */
function clearNodeFolder(options) {
  options = (0,_options_js__WEBPACK_IMPORTED_MODULE_2__.fillOptionsWithDefaults)(options);
  var method = (0,_method_chooser_js__WEBPACK_IMPORTED_MODULE_1__.chooseMethod)(options);
  if (method.type === 'node') {
    return method.clearNodeFolder().then(function () {
      return true;
    });
  } else {
    return _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_FALSE;
  }
}

/**
 * if set, this method is enforced,
 * no mather what the options are
 */
var ENFORCED_OPTIONS;
function enforceOptions(options) {
  ENFORCED_OPTIONS = options;
}

// PROTOTYPE
BroadcastChannel.prototype = {
  postMessage: function postMessage(msg) {
    if (this.closed) {
      throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed ' +
      /**
       * In the past when this error appeared, it was really hard to debug.
       * So now we log the msg together with the error so it at least
       * gives some clue about where in your application this happens.
       */
      JSON.stringify(msg));
    }
    return _post(this, 'message', msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, 'internal', msg);
  },
  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };
    _removeListenerObject(this, 'message', this._onML);
    if (fn && typeof fn === 'function') {
      this._onML = listenObj;
      _addListenerObject(this, 'message', listenObj);
    } else {
      this._onML = null;
    }
  },
  addEventListener: function addEventListener(type, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };
    _addListenerObject(this, type, listenObj);
  },
  removeEventListener: function removeEventListener(type, fn) {
    var obj = this._addEL[type].find(function (obj) {
      return obj.fn === fn;
    });
    _removeListenerObject(this, type, obj);
  },
  close: function close() {
    var _this = this;
    if (this.closed) {
      return;
    }
    OPEN_BROADCAST_CHANNELS["delete"](this);
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID;
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare
    // wait until all current sending are processed
    .then(function () {
      return Promise.all(Array.from(_this._uMP));
    })
    // run before-close hooks
    .then(function () {
      return Promise.all(_this._befC.map(function (fn) {
        return fn();
      }));
    })
    // close the channel
    .then(function () {
      return _this.method.close(_this._state);
    });
  },
  get type() {
    return this.method.type;
  },
  get isClosed() {
    return this.closed;
  }
};

/**
 * Post a message over the channel
 * @returns {Promise} that resolved when the message sending is done
 */
function _post(broadcastChannel, type, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time: time,
    type: type,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID;
  return awaitPrepare.then(function () {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);

    // add/remove to unsent messages list
    broadcastChannel._uMP.add(sendPromise);
    sendPromise["catch"]().then(function () {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
  });
}
function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);
  if ((0,_util_js__WEBPACK_IMPORTED_MODULE_0__.isPromise)(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function (s) {
      // used in tests to simulate slow runtime
      /*if (channel.options.prepareDelay) {
           await new Promise(res => setTimeout(res, this.options.prepareDelay));
      }*/
      channel._state = s;
    });
  } else {
    channel._state = maybePromise;
  }
}
function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}
function _addListenerObject(channel, type, obj) {
  channel._addEL[type].push(obj);
  _startListening(channel);
}
function _removeListenerObject(channel, type, obj) {
  channel._addEL[type] = channel._addEL[type].filter(function (o) {
    return o !== obj;
  });
  _stopListening(channel);
}
function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    // someone is listening, start subscribing

    var listenerFn = function listenerFn(msgObj) {
      channel._addEL[msgObj.type].forEach(function (listenerObject) {
        if (msgObj.time >= listenerObject.time) {
          listenerObject.fn(msgObj.data);
        }
      });
    };
    var time = channel.method.microSeconds();
    if (channel._prepP) {
      channel._prepP.then(function () {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}
function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    // no one is listening, stop subscribing
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/method-chooser.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   chooseMethod: () => (/* binding */ chooseMethod)
/* harmony export */ });
/* harmony import */ var _methods_native_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/methods/native.js");
/* harmony import */ var _methods_indexed_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js");
/* harmony import */ var _methods_localstorage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js");
/* harmony import */ var _methods_simulate_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js");




// the line below will be removed from es5/browser builds

// order is important
var METHODS = [_methods_native_js__WEBPACK_IMPORTED_MODULE_0__.NativeMethod,
// fastest
_methods_indexed_db_js__WEBPACK_IMPORTED_MODULE_1__.IndexedDBMethod, _methods_localstorage_js__WEBPACK_IMPORTED_MODULE_2__.LocalstorageMethod];
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);

  // the line below will be removed from es5/browser builds

  // directly chosen
  if (options.type) {
    if (options.type === 'simulate') {
      // only use simulate-method if directly chosen
      return _methods_simulate_js__WEBPACK_IMPORTED_MODULE_3__.SimulateMethod;
    }
    var ret = chooseMethods.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }

  /**
   * if no webworker support is needed,
   * remove idb from the list so that localstorage will be chosen
   */
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function (m) {
      return m.type !== 'idb';
    });
  }
  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed();
  });
  if (!useMethod) {
    throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function (m) {
      return m.type;
    })));
  } else {
    return useMethod;
  }
}

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IndexedDBMethod: () => (/* binding */ IndexedDBMethod),
/* harmony export */   TRANSACTION_SETTINGS: () => (/* binding */ TRANSACTION_SETTINGS),
/* harmony export */   averageResponseTime: () => (/* binding */ averageResponseTime),
/* harmony export */   canBeUsed: () => (/* binding */ canBeUsed),
/* harmony export */   cleanOldMessages: () => (/* binding */ cleanOldMessages),
/* harmony export */   close: () => (/* binding */ close),
/* harmony export */   commitIndexedDBTransaction: () => (/* binding */ commitIndexedDBTransaction),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   createDatabase: () => (/* binding */ createDatabase),
/* harmony export */   getAllMessages: () => (/* binding */ getAllMessages),
/* harmony export */   getIdb: () => (/* binding */ getIdb),
/* harmony export */   getMessagesHigherThan: () => (/* binding */ getMessagesHigherThan),
/* harmony export */   getOldMessages: () => (/* binding */ getOldMessages),
/* harmony export */   microSeconds: () => (/* binding */ microSeconds),
/* harmony export */   onMessage: () => (/* binding */ onMessage),
/* harmony export */   postMessage: () => (/* binding */ postMessage),
/* harmony export */   removeMessagesById: () => (/* binding */ removeMessagesById),
/* harmony export */   type: () => (/* binding */ type),
/* harmony export */   writeMessage: () => (/* binding */ writeMessage)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/util.js");
/* harmony import */ var oblivious_set__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/oblivious-set/dist/esm/src/index.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/options.js");
/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 * 
 * When working on this, ensure to use these performance optimizations:
 * @link https://rxdb.info/slow-indexeddb.html
 */


var microSeconds = _util_js__WEBPACK_IMPORTED_MODULE_0__.microSeconds;


var DB_PREFIX = 'pubkey.broadcast-channel-0-';
var OBJECT_STORE_ID = 'messages';

/**
 * Use relaxed durability for faster performance on all transactions.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
var TRANSACTION_SETTINGS = {
  durability: 'relaxed'
};
var type = 'idb';
function getIdb() {
  if (typeof indexedDB !== 'undefined') return indexedDB;
  if (typeof window !== 'undefined') {
    if (typeof window.mozIndexedDB !== 'undefined') return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB !== 'undefined') return window.webkitIndexedDB;
    if (typeof window.msIndexedDB !== 'undefined') return window.msIndexedDB;
  }
  return false;
}

/**
 * If possible, we should explicitly commit IndexedDB transactions
 * for better performance.
 * @link https://nolanlawson.com/2021/08/22/speeding-up-indexeddb-reads-and-writes/
 */
function commitIndexedDBTransaction(tx) {
  if (tx.commit) {
    tx.commit();
  }
}
function createDatabase(channelName) {
  var IndexedDB = getIdb();

  // create table
  var dbName = DB_PREFIX + channelName;

  /**
   * All IndexedDB databases are opened without version
   * because it is a bit faster, especially on firefox
   * @link http://nparashuram.com/IndexedDB/perf/#Open%20Database%20with%20version
   */
  var openRequest = IndexedDB.open(dbName);
  openRequest.onupgradeneeded = function (ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: 'id',
      autoIncrement: true
    });
  };
  return new Promise(function (res, rej) {
    openRequest.onerror = function (ev) {
      return rej(ev);
    };
    openRequest.onsuccess = function () {
      res(openRequest.result);
    };
  });
}

/**
 * writes the new message to the database
 * so other readers can find it
 */
function writeMessage(db, readerUuid, messageJson) {
  var time = Date.now();
  var writeObject = {
    uuid: readerUuid,
    time: time,
    data: messageJson
  };
  var tx = db.transaction([OBJECT_STORE_ID], 'readwrite', TRANSACTION_SETTINGS);
  return new Promise(function (res, rej) {
    tx.oncomplete = function () {
      return res();
    };
    tx.onerror = function (ev) {
      return rej(ev);
    };
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
    commitIndexedDBTransaction(tx);
  });
}
function getAllMessages(db) {
  var tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;
      if (cursor) {
        ret.push(cursor.value);
        //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
        cursor["continue"]();
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function getMessagesHigherThan(db, lastCursorId) {
  var tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);

  /**
   * Optimization shortcut,
   * if getAll() can be used, do not use a cursor.
   * @link https://rxdb.info/slow-indexeddb.html
   */
  if (objectStore.getAll) {
    var getAllRequest = objectStore.getAll(keyRangeValue);
    return new Promise(function (res, rej) {
      getAllRequest.onerror = function (err) {
        return rej(err);
      };
      getAllRequest.onsuccess = function (e) {
        res(e.target.result);
      };
    });
  }
  function openCursor() {
    // Occasionally Safari will fail on IDBKeyRange.bound, this
    // catches that error, having it open the cursor to the first
    // item. When it gets data it will advance to the desired key.
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e) {
      return objectStore.openCursor();
    }
  }
  return new Promise(function (res, rej) {
    var openCursorRequest = openCursor();
    openCursorRequest.onerror = function (err) {
      return rej(err);
    };
    openCursorRequest.onsuccess = function (ev) {
      var cursor = ev.target.result;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor["continue"](lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor["continue"]();
        }
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function removeMessagesById(channelState, ids) {
  if (channelState.closed) {
    return Promise.resolve([]);
  }
  var tx = channelState.db.transaction(OBJECT_STORE_ID, 'readwrite', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  return Promise.all(ids.map(function (id) {
    var deleteRequest = objectStore["delete"](id);
    return new Promise(function (res) {
      deleteRequest.onsuccess = function () {
        return res();
      };
    });
  }));
}
function getOldMessages(db, ttl) {
  var olderThen = Date.now() - ttl;
  var tx = db.transaction(OBJECT_STORE_ID, 'readonly', TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;
      if (cursor) {
        var msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);
          cursor["continue"]();
        } else {
          // no more old messages,
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(channelState) {
  return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function (tooOld) {
    return removeMessagesById(channelState, tooOld.map(function (msg) {
      return msg.id;
    }));
  });
}
function create(channelName, options) {
  options = (0,_options_js__WEBPACK_IMPORTED_MODULE_2__.fillOptionsWithDefaults)(options);
  return createDatabase(channelName).then(function (db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName: channelName,
      options: options,
      uuid: (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.randomToken)(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new oblivious_set__WEBPACK_IMPORTED_MODULE_1__.ObliviousSet(options.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID,
      messagesCallback: null,
      readQueuePromises: [],
      db: db
    };

    /**
     * Handle abrupt closes that do not originate from db.close().
     * This could happen, for example, if the underlying storage is
     * removed or if the user clears the database in the browser's
     * history preferences.
     */
    db.onclose = function () {
      state.closed = true;
      if (options.idb.onclose) options.idb.onclose();
    };

    /**
     * if service-workers are used,
     * we have no 'storage'-event if they post a message,
     * therefore we also have to set an interval
     */
    _readLoop(state);
    return state;
  });
}
function _readLoop(state) {
  if (state.closed) return;
  readNewMessages(state).then(function () {
    return (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.sleep)(state.options.idb.fallbackInterval);
  }).then(function () {
    return _readLoop(state);
  });
}
function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false; // send by own
  if (state.eMIs.has(msgObj.id)) return false; // already emitted
  if (msgObj.data.time < state.messagesCallbackTime) return false; // older then onMessageCallback
  return true;
}

/**
 * reads all new messages from the database and emits them
 */
function readNewMessages(state) {
  // channel already closed
  if (state.closed) return _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID;

  // if no one is listening, we do not need to scan for new messages
  if (!state.messagesCallback) return _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID;
  return getMessagesHigherThan(state.db, state.lastCursorId).then(function (newerMessages) {
    var useMessages = newerMessages
    /**
     * there is a bug in iOS where the msgObj can be undefined sometimes
     * so we filter them out
     * @link https://github.com/pubkey/broadcast-channel/issues/19
     */.filter(function (msgObj) {
      return !!msgObj;
    }).map(function (msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }
      return msgObj;
    }).filter(function (msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function (msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    }); // sort by time
    useMessages.forEach(function (msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID;
  });
}
function close(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function () {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function () {
    if ((0,_util_js__WEBPACK_IMPORTED_MODULE_0__.randomInt)(0, 10) === 0) {
      /* await (do not await) */
      cleanOldMessages(channelState);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed() {
  return !!getIdb();
}
function averageResponseTime(options) {
  return options.idb.fallbackInterval * 2;
}
var IndexedDBMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocalstorageMethod: () => (/* binding */ LocalstorageMethod),
/* harmony export */   addStorageEventListener: () => (/* binding */ addStorageEventListener),
/* harmony export */   averageResponseTime: () => (/* binding */ averageResponseTime),
/* harmony export */   canBeUsed: () => (/* binding */ canBeUsed),
/* harmony export */   close: () => (/* binding */ close),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   getLocalStorage: () => (/* binding */ getLocalStorage),
/* harmony export */   microSeconds: () => (/* binding */ microSeconds),
/* harmony export */   onMessage: () => (/* binding */ onMessage),
/* harmony export */   postMessage: () => (/* binding */ postMessage),
/* harmony export */   removeStorageEventListener: () => (/* binding */ removeStorageEventListener),
/* harmony export */   storageKey: () => (/* binding */ storageKey),
/* harmony export */   type: () => (/* binding */ type)
/* harmony export */ });
/* harmony import */ var oblivious_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/oblivious-set/dist/esm/src/index.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/options.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/util.js");
/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside webworkers because they have no access to localstorage
 * This is basically implemented to support IE9 or your grandmother's toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */




var microSeconds = _util_js__WEBPACK_IMPORTED_MODULE_2__.microSeconds;
var KEY_PREFIX = 'pubkey.broadcastChannel-';
var type = 'localstorage';

/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */
function getLocalStorage() {
  var localStorage;
  if (typeof window === 'undefined') return null;
  try {
    localStorage = window.localStorage;
    localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
  } catch (e) {
    // New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }
  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}

/**
* writes the new message to the storage
* and fires the storage-event so other readers can find it
*/
function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.sleep)().then(function () {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.randomToken)(),
        time: Date.now(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      getLocalStorage().setItem(key, value);

      /**
       * StorageEvent does not fire the 'storage' event
       * in the window that changes the state of the local storage.
       * So we fire it manually
       */
      var ev = document.createEvent('Event');
      ev.initEvent('storage', true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var listener = function listener(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener('storage', listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener('storage', listener);
}
function create(channelName, options) {
  options = (0,_options_js__WEBPACK_IMPORTED_MODULE_1__.fillOptionsWithDefaults)(options);
  if (!canBeUsed()) {
    throw new Error('BroadcastChannel: localstorage cannot be used');
  }
  var uuid = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.randomToken)();

  /**
   * eMIs
   * contains all messages that have been emitted before
   * @type {ObliviousSet}
   */
  var eMIs = new oblivious_set__WEBPACK_IMPORTED_MODULE_0__.ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    channelName: channelName,
    uuid: uuid,
    eMIs: eMIs // emittedMessagesIds
  };
  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener
    if (msgObj.uuid === uuid) return; // own message
    if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted
    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  var ls = getLocalStorage();
  if (!ls) return false;
  try {
    var key = '__broadcastchannel_check';
    ls.setItem(key, 'works');
    ls.removeItem(key);
  } catch (e) {
    // Safari 10 in private mode will not allow write access to local
    // storage and fail with a QuotaExceededError. See
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API#Private_Browsing_Incognito_modes
    return false;
  }
  return true;
}
function averageResponseTime() {
  var defaultTime = 120;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    // safari is much slower so this time is higher
    return defaultTime * 2;
  }
  return defaultTime;
}
var LocalstorageMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/methods/native.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NativeMethod: () => (/* binding */ NativeMethod),
/* harmony export */   averageResponseTime: () => (/* binding */ averageResponseTime),
/* harmony export */   canBeUsed: () => (/* binding */ canBeUsed),
/* harmony export */   close: () => (/* binding */ close),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   microSeconds: () => (/* binding */ microSeconds),
/* harmony export */   onMessage: () => (/* binding */ onMessage),
/* harmony export */   postMessage: () => (/* binding */ postMessage),
/* harmony export */   type: () => (/* binding */ type)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/util.js");

var microSeconds = _util_js__WEBPACK_IMPORTED_MODULE_0__.microSeconds;
var type = 'native';
function create(channelName) {
  var state = {
    time: (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.microSeconds)(),
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: [] // subscriberFunctions
  };
  state.bc.onmessage = function (msgEvent) {
    if (state.messagesCallback) {
      state.messagesCallback(msgEvent.data);
    }
  };
  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return _util_js__WEBPACK_IMPORTED_MODULE_0__.PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  // Deno runtime
  // eslint-disable-next-line
  if (typeof globalThis !== 'undefined' && globalThis.Deno && globalThis.Deno.args) {
    return true;
  }

  // Browser runtime
  if ((typeof window !== 'undefined' || typeof self !== 'undefined') && typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }
    return true;
  } else {
    return false;
  }
}
function averageResponseTime() {
  return 150;
}
var NativeMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SIMULATE_DELAY_TIME: () => (/* binding */ SIMULATE_DELAY_TIME),
/* harmony export */   SimulateMethod: () => (/* binding */ SimulateMethod),
/* harmony export */   averageResponseTime: () => (/* binding */ averageResponseTime),
/* harmony export */   canBeUsed: () => (/* binding */ canBeUsed),
/* harmony export */   close: () => (/* binding */ close),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   microSeconds: () => (/* binding */ microSeconds),
/* harmony export */   onMessage: () => (/* binding */ onMessage),
/* harmony export */   postMessage: () => (/* binding */ postMessage),
/* harmony export */   type: () => (/* binding */ type)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/util.js");

var microSeconds = _util_js__WEBPACK_IMPORTED_MODULE_0__.microSeconds;
var type = 'simulate';
var SIMULATE_CHANNELS = new Set();
function create(channelName) {
  var state = {
    time: microSeconds(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
var SIMULATE_DELAY_TIME = 5;
function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    return setTimeout(function () {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.forEach(function (channel) {
        if (channel.name === channelState.name &&
        // has same name
        channel !== channelState &&
        // not own channel
        !!channel.messagesCallback &&
        // has subscribers
        channel.time < messageJson.time // channel not created after postMessage() call
        ) {
          channel.messagesCallback(messageJson);
        }
      });
      res();
    }, SIMULATE_DELAY_TIME);
  });
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  return true;
}
function averageResponseTime() {
  return SIMULATE_DELAY_TIME;
}
var SimulateMethod = {
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
};

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/options.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fillOptionsWithDefaults: () => (/* binding */ fillOptionsWithDefaults)
/* harmony export */ });
function fillOptionsWithDefaults() {
  var originalOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions));

  // main
  if (typeof options.webWorkerSupport === 'undefined') options.webWorkerSupport = true;

  // indexed-db
  if (!options.idb) options.idb = {};
  //  after this time the messages get deleted
  if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
  //  handles abrupt db onclose events.
  if (originalOptions.idb && typeof originalOptions.idb.onclose === 'function') options.idb.onclose = originalOptions.idb.onclose;

  // localstorage
  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60;

  // custom methods
  if (originalOptions.methods) options.methods = originalOptions.methods;

  // node
  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1000 * 60 * 2; // 2 minutes;
  /**
   * On linux use 'ulimit -Hn' to get the limit of open files.
   * On ubuntu this was 4096 for me, so we use half of that as maxParallelWrites default.
   */
  if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
  if (typeof options.node.useFastPath === 'undefined') options.node.useFastPath = true;
  return options;
}

/***/ }),

/***/ "../../node_modules/broadcast-channel/dist/esbrowser/util.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PROMISE_RESOLVED_FALSE: () => (/* binding */ PROMISE_RESOLVED_FALSE),
/* harmony export */   PROMISE_RESOLVED_TRUE: () => (/* binding */ PROMISE_RESOLVED_TRUE),
/* harmony export */   PROMISE_RESOLVED_VOID: () => (/* binding */ PROMISE_RESOLVED_VOID),
/* harmony export */   isPromise: () => (/* binding */ isPromise),
/* harmony export */   microSeconds: () => (/* binding */ microSeconds),
/* harmony export */   randomInt: () => (/* binding */ randomInt),
/* harmony export */   randomToken: () => (/* binding */ randomToken),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   supportsWebLockAPI: () => (/* binding */ supportsWebLockAPI)
/* harmony export */ });
/**
 * returns true if the given object is a promise
 */
function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}
var PROMISE_RESOLVED_FALSE = Promise.resolve(false);
var PROMISE_RESOLVED_TRUE = Promise.resolve(true);
var PROMISE_RESOLVED_VOID = Promise.resolve();
function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(function () {
      return res(resolveWith);
    }, time);
  });
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * https://stackoverflow.com/a/8084248
 */
function randomToken() {
  return Math.random().toString(36).substring(2);
}
var lastMs = 0;

/**
 * Returns the current unix time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */
function microSeconds() {
  var ret = Date.now() * 1000; // milliseconds to microseconds
  if (ret <= lastMs) {
    ret = lastMs + 1;
  }
  lastMs = ret;
  return ret;
}

/**
 * Check if WebLock API is supported.
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
 */
function supportsWebLockAPI() {
  if (typeof navigator !== 'undefined' && typeof navigator.locks !== 'undefined' && typeof navigator.locks.request === 'function') {
    return true;
  } else {
    return false;
  }
}

/***/ }),

/***/ "../../node_modules/oblivious-set/dist/esm/src/index.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObliviousSet: () => (/* binding */ ObliviousSet),
/* harmony export */   now: () => (/* binding */ now),
/* harmony export */   removeTooOldValues: () => (/* binding */ removeTooOldValues)
/* harmony export */ });
/**
 * this is a set which automatically forgets
 * a given entry when a new entry is set and the ttl
 * of the old one is over
 */
class ObliviousSet {
    ttl;
    map = new Map();
    /**
     * Creating calls to setTimeout() is expensive,
     * so we only do that if there is not timeout already open.
     */
    _to = false;
    constructor(ttl) {
        this.ttl = ttl;
    }
    has(value) {
        return this.map.has(value);
    }
    add(value) {
        this.map.set(value, now());
        /**
         * When a new value is added,
         * start the cleanup at the next tick
         * to not block the cpu for more important stuff
         * that might happen.
         */
        if (!this._to) {
            this._to = true;
            setTimeout(() => {
                this._to = false;
                removeTooOldValues(this);
            }, 0);
        }
    }
    clear() {
        this.map.clear();
    }
}
/**
 * Removes all entries from the set
 * where the TTL has expired
 */
function removeTooOldValues(obliviousSet) {
    const olderThen = now() - obliviousSet.ttl;
    const iterator = obliviousSet.map[Symbol.iterator]();
    /**
     * Because we can assume the new values are added at the bottom,
     * we start from the top and stop as soon as we reach a non-too-old value.
     */
    while (true) {
        const next = iterator.next().value;
        if (!next) {
            return; // no more elements
        }
        const value = next[0];
        const time = next[1];
        if (time < olderThen) {
            obliviousSet.map.delete(value);
        }
        else {
            // We reached a value that is not old enough
            return;
        }
    }
}
function now() {
    return Date.now();
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./src/channels.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GlobalChannel: () => (/* binding */ GlobalChannel),
/* harmony export */   PrivateChannel: () => (/* binding */ PrivateChannel)
/* harmony export */ });
/* harmony import */ var _chooseMethod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/chooseMethod.ts");
/* harmony import */ var _localstorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/localstorage.ts");
/* harmony import */ var broadcast_channel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../../node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js");



const pendingPromises = (() => {
  const promises = /* @__PURE__ */ new Map();
  const incrementId = (() => {
    let increment = 0;
    return () => {
      increment += 1;
      return String(Date.now() + increment);
    };
  })();
  return {
    add(resolve, reject) {
      const key = incrementId();
      promises.set(key, { resolve, reject });
      return key;
    },
    resolve(key, data) {
      var _a;
      (_a = promises.get(key)) == null ? void 0 : _a.resolve(data);
      promises.delete(key);
    },
    reject(key, data) {
      var _a;
      (_a = promises.get(key)) == null ? void 0 : _a.reject(data);
      promises.delete(key);
    }
  };
})();
class PrivateChannel {
  constructor(channelId) {
    this.globalCloseChannelId = "close-channel-broadcaster";
    this.id = channelId;
    this.subscribedEventTypes = {};
    this.broadcastChannelType = (0,_chooseMethod__WEBPACK_IMPORTED_MODULE_0__.chooseMethod)();
    this.broadcastChannel = new broadcast_channel__WEBPACK_IMPORTED_MODULE_2__.BroadcastChannel(this.id, {
      type: this.broadcastChannelType
    });
    this.channelMessageHandler();
    this.globalCloseChannel = new GlobalChannel(this.globalCloseChannelId);
    this.initializeGlobalCloseChannel();
  }
  publishAsync(type, payload) {
    return new Promise((resolve, reject) => {
      const publishId = pendingPromises.add(resolve, reject);
      this.publishMessage(type, payload, publishId);
    });
  }
  publish(type, payload) {
    this.publishMessage(type, payload);
  }
  subscribe(type, callback) {
    this.subscribedEventTypes[type] = callback;
  }
  unsubscribe(type) {
    this.subscribedEventTypes[type] = void 0;
  }
  close() {
    this.closeBroadcastChannel();
    this.broadcastChannelClosing();
  }
  isClosed() {
    return this.broadcastChannel.isClosed && this.globalCloseChannel.isClosed();
  }
  publishMessage(type, payload, publishId) {
    const eventMessage = {
      type,
      payload
    };
    if (publishId) {
      eventMessage["publishId"] = publishId;
    }
    this.broadcastChannel.postMessage(eventMessage).catch(() => {
      throw new Error(`<event-bus> ${this.id} channel has been closed`);
    });
  }
  initializeGlobalCloseChannel() {
    this.globalCloseChannel.subscribe(
      ({
        channelName,
        killAll
      }) => {
        if (killAll && channelName && channelName === this.id && this.broadcastChannel) {
          this.closeBroadcastChannel();
          if (!this.globalCloseChannel.isClosed()) {
            this.globalCloseChannel.close();
          }
        }
      }
    );
  }
  closeBroadcastChannel() {
    if (!this.broadcastChannel.isClosed) {
      this.broadcastChannel.close();
    }
    if (this.broadcastChannelType === "localstorage") {
      (0,_localstorage__WEBPACK_IMPORTED_MODULE_1__.deleteLocalStorage)(this.id);
    }
  }
  broadcastChannelClosing() {
    if (!this.globalCloseChannel.isClosed()) {
      this.globalCloseChannel.publish({
        channelName: this.id,
        killAll: false
      });
      this.globalCloseChannel.close();
    }
  }
  channelMessageHandler() {
    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (messagePayload) => {
        if (messagePayload) {
          const { type, payload, publishId } = messagePayload;
          this.eventTypesCallbackHandler(type, payload, publishId);
        }
      };
    }
  }
  eventTypesCallbackHandler(type, payload, publishId) {
    const mappedEvent = this.subscribedEventTypes[type];
    if (mappedEvent) {
      const mappedEventRes = mappedEvent(payload);
      if (publishId) {
        if (mappedEventRes instanceof Promise) {
          mappedEventRes.then((res) => pendingPromises.resolve(publishId, res)).catch(
            (error) => pendingPromises.reject(publishId, error)
          );
        } else {
          pendingPromises.resolve(publishId, mappedEventRes);
        }
      }
    }
  }
}
class GlobalChannel {
  constructor(channelId) {
    this.id = channelId;
    this.broadcastChannelType = (0,_chooseMethod__WEBPACK_IMPORTED_MODULE_0__.chooseMethod)();
    this.broadcastChannel = new broadcast_channel__WEBPACK_IMPORTED_MODULE_2__.BroadcastChannel(this.id, {
      type: this.broadcastChannelType
    });
  }
  publish(payload) {
    if (!this.isClosed()) {
      this.broadcastChannel.postMessage(payload);
    }
  }
  subscribe(callback) {
    this.broadcastChannel.onmessage = ({
      channelName,
      killAll
    }) => {
      callback({ channelName, killAll });
    };
  }
  close() {
    this.broadcastChannel.close();
  }
  isClosed() {
    return this.broadcastChannel.isClosed;
  }
}


/***/ }),

/***/ "./src/chooseMethod.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   chooseMethod: () => (/* binding */ chooseMethod)
/* harmony export */ });
const chooseMethod = () => {
  if ((typeof window !== "undefined" || typeof self !== "undefined") && typeof BroadcastChannel === "function" && !window.navigator.userAgent.includes("Tizen")) {
    return "native";
  }
  return "localstorage";
};


/***/ }),

/***/ "./src/localstorage.ts":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteLocalStorage: () => (/* binding */ deleteLocalStorage)
/* harmony export */ });
const getLocalStorageNameForId = (id) => {
  const localStorageKeys = Object.keys(window.localStorage);
  const keyNameWithId = localStorageKeys.find((key) => key.includes(id));
  if (!keyNameWithId) {
    console.error(`getLocalStorageNameForId - No key with this name: ${id}`);
    return null;
  }
  return keyNameWithId;
};
const deleteLocalStorage = (id) => {
  const localStorageKey = getLocalStorageNameForId(id);
  if (!localStorageKey) {
    console.error(`deleteLocalStorage - No key with this name: ${id}`);
    const localStorageKeys = Object.keys(window.localStorage);
    const concatenatedKeys = localStorageKeys.join(",");
    console.error(`deleteLocalStorage - Stored keys: ${concatenatedKeys}`);
    return;
  }
  window.localStorage.removeItem(localStorageKey);
};


/***/ }),

/***/ "./src/types.ts":
/***/ (() => {



/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventBus: () => (/* binding */ EventBus),
/* harmony export */   GlobalEventBusChannel: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_1__.GlobalEventBusChannel),
/* harmony export */   PrivateEventBusChannel: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_1__.PrivateEventBusChannel)
/* harmony export */ });
/* harmony import */ var _channels__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/channels.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/types.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_1__);


class EventBus {
  constructor(globalChannelId = "ChannelOpened") {
    this.globalCloseChannelId = "close-channel-broadcaster";
    this.globalOpenChannelId = globalChannelId;
    this.globalOpenChannel = new _channels__WEBPACK_IMPORTED_MODULE_0__.GlobalChannel(this.globalOpenChannelId);
    this.globalCloseChannel = new _channels__WEBPACK_IMPORTED_MODULE_0__.GlobalChannel(this.globalCloseChannelId);
  }
  createChannel(privateChannelId) {
    const createdChannel = new _channels__WEBPACK_IMPORTED_MODULE_0__.PrivateChannel(privateChannelId);
    this.globalOpenChannel.publish({ channelName: createdChannel.id });
    return createdChannel;
  }
  closeChannel(channelName) {
    this.globalCloseChannel.publish({ channelName, killAll: true });
  }
  onChannelOpen(callback) {
    const openChannelBroadcastChannel = new _channels__WEBPACK_IMPORTED_MODULE_0__.GlobalChannel(
      this.globalOpenChannelId
    );
    const createNewChannelCallback = ({
      channelName
    }) => {
      return callback({ id: channelName });
    };
    openChannelBroadcastChannel.subscribe(createNewChannelCallback);
    return openChannelBroadcastChannel;
  }
  onChannelClose(callback) {
    const closeChannelBroadcastChannel = new _channels__WEBPACK_IMPORTED_MODULE_0__.GlobalChannel(
      this.globalCloseChannelId
    );
    const internalCallback = ({
      channelName,
      killAll
    }) => {
      if (!killAll) {
        callback(channelName);
      }
    };
    closeChannelBroadcastChannel.subscribe(internalCallback);
    return closeChannelBroadcastChannel;
  }
}


})();

const __webpack_exports__EventBus = __webpack_exports__.EventBus;
const __webpack_exports__GlobalEventBusChannel = __webpack_exports__.GlobalEventBusChannel;
const __webpack_exports__PrivateEventBusChannel = __webpack_exports__.PrivateEventBusChannel;
export { __webpack_exports__EventBus as EventBus, __webpack_exports__GlobalEventBusChannel as GlobalEventBusChannel, __webpack_exports__PrivateEventBusChannel as PrivateEventBusChannel };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsZ0JBQWdCO0FBQzFELFNBQUssa0JBQWtCLFFBQVEsRUFBRSxhQUFhLGVBQWUsR0FBRyxDQUFDO0FBRWpFLFdBQU87QUFBQSxFQUNYO0FBQUEsRUFFTyxhQUFhLGFBQTJCO0FBQzNDLFNBQUssbUJBQW1CLFFBQVEsRUFBRSxhQUFhLFNBQVMsS0FBSyxDQUFDO0FBQUEsRUFDbEU7QUFBQSxFQUVPLGNBQWMsVUFBZ0Q7QUFDakUsVUFBTSw4QkFBOEIsSUFBSSxvREFBYTtBQUFiLE1BQ3BDLEtBQUs7QUFBQSxJQUNUO0FBQ0EsVUFBTSwyQkFBMkIsQ0FBQztBQUFBLE1BQzlCO0FBQUEsSUFDSixNQUVNO0FBQ0YsYUFBTyxTQUFTLEVBQUUsSUFBSSxZQUFZLENBQUM7QUFBQSxJQUN2QztBQUNBLGdDQUE0QixVQUFVLHdCQUF3QjtBQUM5RCxXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRU8sZUFBZSxVQUFpRDtBQUNuRSxVQUFNLCtCQUErQixJQUFJLG9EQUFhO0FBQWIsTUFDckMsS0FBSztBQUFBLElBQ1Q7QUFDQSxVQUFNLG1CQUFtQixDQUFDO0FBQUEsTUFDdEI7QUFBQSxNQUNBO0FBQUEsSUFDSixNQUdNO0FBQ0YsVUFBSSxDQUFDLFNBQVM7QUFDVixpQkFBUyxXQUFXO0FBQUEsTUFDeEI7QUFBQSxJQUNKO0FBQ0EsaUNBQTZCLFVBQVUsZ0JBQWdCO0FBQ3ZELFdBQU87QUFBQSxFQUNYO0FBQ0o7QUFFeUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4uLy4uL25vZGVfbW9kdWxlcy9icm9hZGNhc3QtY2hhbm5lbC9kaXN0L2VzYnJvd3Nlci9icm9hZGNhc3QtY2hhbm5lbC5qcyIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4uLy4uL25vZGVfbW9kdWxlcy9icm9hZGNhc3QtY2hhbm5lbC9kaXN0L2VzYnJvd3Nlci9tZXRob2QtY2hvb3Nlci5qcyIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4uLy4uL25vZGVfbW9kdWxlcy9icm9hZGNhc3QtY2hhbm5lbC9kaXN0L2VzYnJvd3Nlci9tZXRob2RzL2luZGV4ZWQtZGIuanMiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS8uLi8uLi9ub2RlX21vZHVsZXMvYnJvYWRjYXN0LWNoYW5uZWwvZGlzdC9lc2Jyb3dzZXIvbWV0aG9kcy9sb2NhbHN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS8uLi8uLi9ub2RlX21vZHVsZXMvYnJvYWRjYXN0LWNoYW5uZWwvZGlzdC9lc2Jyb3dzZXIvbWV0aG9kcy9uYXRpdmUuanMiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS8uLi8uLi9ub2RlX21vZHVsZXMvYnJvYWRjYXN0LWNoYW5uZWwvZGlzdC9lc2Jyb3dzZXIvbWV0aG9kcy9zaW11bGF0ZS5qcyIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4uLy4uL25vZGVfbW9kdWxlcy9icm9hZGNhc3QtY2hhbm5lbC9kaXN0L2VzYnJvd3Nlci9vcHRpb25zLmpzIiwid2VicGFjazovL0BzdXBlcm5vdmEvd2luZS1hcGkvLi4vLi4vbm9kZV9tb2R1bGVzL2Jyb2FkY2FzdC1jaGFubmVsL2Rpc3QvZXNicm93c2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS8uLi8uLi9ub2RlX21vZHVsZXMvb2JsaXZpb3VzLXNldC9kaXN0L2VzbS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS8uL3NyYy9jaGFubmVscy50cyIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4vc3JjL2Nob29zZU1ldGhvZC50cyIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4vc3JjL2xvY2Fsc3RvcmFnZS50cyIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BzdXBlcm5vdmEvd2luZS1hcGkvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vQHN1cGVybm92YS93aW5lLWFwaS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BzdXBlcm5vdmEvd2luZS1hcGkvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac3VwZXJub3ZhL3dpbmUtYXBpLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUHJvbWlzZSwgUFJPTUlTRV9SRVNPTFZFRF9GQUxTRSwgUFJPTUlTRV9SRVNPTFZFRF9WT0lEIH0gZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCB7IGNob29zZU1ldGhvZCB9IGZyb20gJy4vbWV0aG9kLWNob29zZXIuanMnO1xuaW1wb3J0IHsgZmlsbE9wdGlvbnNXaXRoRGVmYXVsdHMgfSBmcm9tICcuL29wdGlvbnMuanMnO1xuXG4vKipcbiAqIENvbnRhaW5zIGFsbCBvcGVuIGNoYW5uZWxzLFxuICogdXNlZCBpbiB0ZXN0cyB0byBlbnN1cmUgZXZlcnl0aGluZyBpcyBjbG9zZWQuXG4gKi9cbmV4cG9ydCB2YXIgT1BFTl9CUk9BRENBU1RfQ0hBTk5FTFMgPSBuZXcgU2V0KCk7XG52YXIgbGFzdElkID0gMDtcbmV4cG9ydCB2YXIgQnJvYWRjYXN0Q2hhbm5lbCA9IGZ1bmN0aW9uIEJyb2FkY2FzdENoYW5uZWwobmFtZSwgb3B0aW9ucykge1xuICAvLyBpZGVudGlmaWVyIG9mIHRoZSBjaGFubmVsIHRvIGRlYnVnIHN0dWZmXG4gIHRoaXMuaWQgPSBsYXN0SWQrKztcbiAgT1BFTl9CUk9BRENBU1RfQ0hBTk5FTFMuYWRkKHRoaXMpO1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICBpZiAoRU5GT1JDRURfT1BUSU9OUykge1xuICAgIG9wdGlvbnMgPSBFTkZPUkNFRF9PUFRJT05TO1xuICB9XG4gIHRoaXMub3B0aW9ucyA9IGZpbGxPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMpO1xuICB0aGlzLm1ldGhvZCA9IGNob29zZU1ldGhvZCh0aGlzLm9wdGlvbnMpO1xuXG4gIC8vIGlzTGlzdGVuaW5nXG4gIHRoaXMuX2lMID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIF9vbk1lc3NhZ2VMaXN0ZW5lclxuICAgKiBzZXR0aW5nIG9ubWVzc2FnZSB0d2ljZSxcbiAgICogd2lsbCBvdmVyd3JpdGUgdGhlIGZpcnN0IGxpc3RlbmVyXG4gICAqL1xuICB0aGlzLl9vbk1MID0gbnVsbDtcblxuICAvKipcbiAgICogX2FkZEV2ZW50TGlzdGVuZXJzXG4gICAqL1xuICB0aGlzLl9hZGRFTCA9IHtcbiAgICBtZXNzYWdlOiBbXSxcbiAgICBpbnRlcm5hbDogW11cbiAgfTtcblxuICAvKipcbiAgICogVW5zZW50IG1lc3NhZ2UgcHJvbWlzZXNcbiAgICogd2hlcmUgdGhlIHNlbmRpbmcgaXMgc3RpbGwgaW4gcHJvZ3Jlc3NcbiAgICogQHR5cGUge1NldDxQcm9taXNlPn1cbiAgICovXG4gIHRoaXMuX3VNUCA9IG5ldyBTZXQoKTtcblxuICAvKipcbiAgICogX2JlZm9yZUNsb3NlXG4gICAqIGFycmF5IG9mIHByb21pc2VzIHRoYXQgd2lsbCBiZSBhd2FpdGVkXG4gICAqIGJlZm9yZSB0aGUgY2hhbm5lbCBpcyBjbG9zZWRcbiAgICovXG4gIHRoaXMuX2JlZkMgPSBbXTtcblxuICAvKipcbiAgICogX3ByZXBhcmVQcm9taXNlXG4gICAqL1xuICB0aGlzLl9wcmVwUCA9IG51bGw7XG4gIF9wcmVwYXJlQ2hhbm5lbCh0aGlzKTtcbn07XG5cbi8vIFNUQVRJQ1NcblxuLyoqXG4gKiB1c2VkIHRvIGlkZW50aWZ5IGlmIHNvbWVvbmUgb3ZlcndyaXRlc1xuICogd2luZG93LkJyb2FkY2FzdENoYW5uZWwgd2l0aCB0aGlzXG4gKiBTZWUgbWV0aG9kcy9uYXRpdmUuanNcbiAqL1xuQnJvYWRjYXN0Q2hhbm5lbC5fcHVia2V5ID0gdHJ1ZTtcblxuLyoqXG4gKiBjbGVhcnMgdGhlIHRtcC1mb2xkZXIgaWYgaXMgbm9kZVxuICogQHJldHVybiB7UHJvbWlzZTxib29sZWFuPn0gdHJ1ZSBpZiBoYXMgcnVuLCBmYWxzZSBpZiBub3Qgbm9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJOb2RlRm9sZGVyKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGZpbGxPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMpO1xuICB2YXIgbWV0aG9kID0gY2hvb3NlTWV0aG9kKG9wdGlvbnMpO1xuICBpZiAobWV0aG9kLnR5cGUgPT09ICdub2RlJykge1xuICAgIHJldHVybiBtZXRob2QuY2xlYXJOb2RlRm9sZGVyKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gUFJPTUlTRV9SRVNPTFZFRF9GQUxTRTtcbiAgfVxufVxuXG4vKipcbiAqIGlmIHNldCwgdGhpcyBtZXRob2QgaXMgZW5mb3JjZWQsXG4gKiBubyBtYXRoZXIgd2hhdCB0aGUgb3B0aW9ucyBhcmVcbiAqL1xudmFyIEVORk9SQ0VEX09QVElPTlM7XG5leHBvcnQgZnVuY3Rpb24gZW5mb3JjZU9wdGlvbnMob3B0aW9ucykge1xuICBFTkZPUkNFRF9PUFRJT05TID0gb3B0aW9ucztcbn1cblxuLy8gUFJPVE9UWVBFXG5Ccm9hZGNhc3RDaGFubmVsLnByb3RvdHlwZSA9IHtcbiAgcG9zdE1lc3NhZ2U6IGZ1bmN0aW9uIHBvc3RNZXNzYWdlKG1zZykge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm9hZGNhc3RDaGFubmVsLnBvc3RNZXNzYWdlKCk6ICcgKyAnQ2Fubm90IHBvc3QgbWVzc2FnZSBhZnRlciBjaGFubmVsIGhhcyBjbG9zZWQgJyArXG4gICAgICAvKipcbiAgICAgICAqIEluIHRoZSBwYXN0IHdoZW4gdGhpcyBlcnJvciBhcHBlYXJlZCwgaXQgd2FzIHJlYWxseSBoYXJkIHRvIGRlYnVnLlxuICAgICAgICogU28gbm93IHdlIGxvZyB0aGUgbXNnIHRvZ2V0aGVyIHdpdGggdGhlIGVycm9yIHNvIGl0IGF0IGxlYXN0XG4gICAgICAgKiBnaXZlcyBzb21lIGNsdWUgYWJvdXQgd2hlcmUgaW4geW91ciBhcHBsaWNhdGlvbiB0aGlzIGhhcHBlbnMuXG4gICAgICAgKi9cbiAgICAgIEpTT04uc3RyaW5naWZ5KG1zZykpO1xuICAgIH1cbiAgICByZXR1cm4gX3Bvc3QodGhpcywgJ21lc3NhZ2UnLCBtc2cpO1xuICB9LFxuICBwb3N0SW50ZXJuYWw6IGZ1bmN0aW9uIHBvc3RJbnRlcm5hbChtc2cpIHtcbiAgICByZXR1cm4gX3Bvc3QodGhpcywgJ2ludGVybmFsJywgbXNnKTtcbiAgfSxcbiAgc2V0IG9ubWVzc2FnZShmbikge1xuICAgIHZhciB0aW1lID0gdGhpcy5tZXRob2QubWljcm9TZWNvbmRzKCk7XG4gICAgdmFyIGxpc3Rlbk9iaiA9IHtcbiAgICAgIHRpbWU6IHRpbWUsXG4gICAgICBmbjogZm5cbiAgICB9O1xuICAgIF9yZW1vdmVMaXN0ZW5lck9iamVjdCh0aGlzLCAnbWVzc2FnZScsIHRoaXMuX29uTUwpO1xuICAgIGlmIChmbiAmJiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuX29uTUwgPSBsaXN0ZW5PYmo7XG4gICAgICBfYWRkTGlzdGVuZXJPYmplY3QodGhpcywgJ21lc3NhZ2UnLCBsaXN0ZW5PYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vbk1MID0gbnVsbDtcbiAgICB9XG4gIH0sXG4gIGFkZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4pIHtcbiAgICB2YXIgdGltZSA9IHRoaXMubWV0aG9kLm1pY3JvU2Vjb25kcygpO1xuICAgIHZhciBsaXN0ZW5PYmogPSB7XG4gICAgICB0aW1lOiB0aW1lLFxuICAgICAgZm46IGZuXG4gICAgfTtcbiAgICBfYWRkTGlzdGVuZXJPYmplY3QodGhpcywgdHlwZSwgbGlzdGVuT2JqKTtcbiAgfSxcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmbikge1xuICAgIHZhciBvYmogPSB0aGlzLl9hZGRFTFt0eXBlXS5maW5kKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiBvYmouZm4gPT09IGZuO1xuICAgIH0pO1xuICAgIF9yZW1vdmVMaXN0ZW5lck9iamVjdCh0aGlzLCB0eXBlLCBvYmopO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgT1BFTl9CUk9BRENBU1RfQ0hBTk5FTFNbXCJkZWxldGVcIl0odGhpcyk7XG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgIHZhciBhd2FpdFByZXBhcmUgPSB0aGlzLl9wcmVwUCA/IHRoaXMuX3ByZXBQIDogUFJPTUlTRV9SRVNPTFZFRF9WT0lEO1xuICAgIHRoaXMuX29uTUwgPSBudWxsO1xuICAgIHRoaXMuX2FkZEVMLm1lc3NhZ2UgPSBbXTtcbiAgICByZXR1cm4gYXdhaXRQcmVwYXJlXG4gICAgLy8gd2FpdCB1bnRpbCBhbGwgY3VycmVudCBzZW5kaW5nIGFyZSBwcm9jZXNzZWRcbiAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShfdGhpcy5fdU1QKSk7XG4gICAgfSlcbiAgICAvLyBydW4gYmVmb3JlLWNsb3NlIGhvb2tzXG4gICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKF90aGlzLl9iZWZDLm1hcChmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICB9KSk7XG4gICAgfSlcbiAgICAvLyBjbG9zZSB0aGUgY2hhbm5lbFxuICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5tZXRob2QuY2xvc2UoX3RoaXMuX3N0YXRlKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0aG9kLnR5cGU7XG4gIH0sXG4gIGdldCBpc0Nsb3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9zZWQ7XG4gIH1cbn07XG5cbi8qKlxuICogUG9zdCBhIG1lc3NhZ2Ugb3ZlciB0aGUgY2hhbm5lbFxuICogQHJldHVybnMge1Byb21pc2V9IHRoYXQgcmVzb2x2ZWQgd2hlbiB0aGUgbWVzc2FnZSBzZW5kaW5nIGlzIGRvbmVcbiAqL1xuZnVuY3Rpb24gX3Bvc3QoYnJvYWRjYXN0Q2hhbm5lbCwgdHlwZSwgbXNnKSB7XG4gIHZhciB0aW1lID0gYnJvYWRjYXN0Q2hhbm5lbC5tZXRob2QubWljcm9TZWNvbmRzKCk7XG4gIHZhciBtc2dPYmogPSB7XG4gICAgdGltZTogdGltZSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IG1zZ1xuICB9O1xuICB2YXIgYXdhaXRQcmVwYXJlID0gYnJvYWRjYXN0Q2hhbm5lbC5fcHJlcFAgPyBicm9hZGNhc3RDaGFubmVsLl9wcmVwUCA6IFBST01JU0VfUkVTT0xWRURfVk9JRDtcbiAgcmV0dXJuIGF3YWl0UHJlcGFyZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VuZFByb21pc2UgPSBicm9hZGNhc3RDaGFubmVsLm1ldGhvZC5wb3N0TWVzc2FnZShicm9hZGNhc3RDaGFubmVsLl9zdGF0ZSwgbXNnT2JqKTtcblxuICAgIC8vIGFkZC9yZW1vdmUgdG8gdW5zZW50IG1lc3NhZ2VzIGxpc3RcbiAgICBicm9hZGNhc3RDaGFubmVsLl91TVAuYWRkKHNlbmRQcm9taXNlKTtcbiAgICBzZW5kUHJvbWlzZVtcImNhdGNoXCJdKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYnJvYWRjYXN0Q2hhbm5lbC5fdU1QW1wiZGVsZXRlXCJdKHNlbmRQcm9taXNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2VuZFByb21pc2U7XG4gIH0pO1xufVxuZnVuY3Rpb24gX3ByZXBhcmVDaGFubmVsKGNoYW5uZWwpIHtcbiAgdmFyIG1heWJlUHJvbWlzZSA9IGNoYW5uZWwubWV0aG9kLmNyZWF0ZShjaGFubmVsLm5hbWUsIGNoYW5uZWwub3B0aW9ucyk7XG4gIGlmIChpc1Byb21pc2UobWF5YmVQcm9taXNlKSkge1xuICAgIGNoYW5uZWwuX3ByZXBQID0gbWF5YmVQcm9taXNlO1xuICAgIG1heWJlUHJvbWlzZS50aGVuKGZ1bmN0aW9uIChzKSB7XG4gICAgICAvLyB1c2VkIGluIHRlc3RzIHRvIHNpbXVsYXRlIHNsb3cgcnVudGltZVxuICAgICAgLyppZiAoY2hhbm5lbC5vcHRpb25zLnByZXBhcmVEZWxheSkge1xuICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIHRoaXMub3B0aW9ucy5wcmVwYXJlRGVsYXkpKTtcbiAgICAgIH0qL1xuICAgICAgY2hhbm5lbC5fc3RhdGUgPSBzO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNoYW5uZWwuX3N0YXRlID0gbWF5YmVQcm9taXNlO1xuICB9XG59XG5mdW5jdGlvbiBfaGFzTWVzc2FnZUxpc3RlbmVycyhjaGFubmVsKSB7XG4gIGlmIChjaGFubmVsLl9hZGRFTC5tZXNzYWdlLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuICBpZiAoY2hhbm5lbC5fYWRkRUwuaW50ZXJuYWwubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7XG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lck9iamVjdChjaGFubmVsLCB0eXBlLCBvYmopIHtcbiAgY2hhbm5lbC5fYWRkRUxbdHlwZV0ucHVzaChvYmopO1xuICBfc3RhcnRMaXN0ZW5pbmcoY2hhbm5lbCk7XG59XG5mdW5jdGlvbiBfcmVtb3ZlTGlzdGVuZXJPYmplY3QoY2hhbm5lbCwgdHlwZSwgb2JqKSB7XG4gIGNoYW5uZWwuX2FkZEVMW3R5cGVdID0gY2hhbm5lbC5fYWRkRUxbdHlwZV0uZmlsdGVyKGZ1bmN0aW9uIChvKSB7XG4gICAgcmV0dXJuIG8gIT09IG9iajtcbiAgfSk7XG4gIF9zdG9wTGlzdGVuaW5nKGNoYW5uZWwpO1xufVxuZnVuY3Rpb24gX3N0YXJ0TGlzdGVuaW5nKGNoYW5uZWwpIHtcbiAgaWYgKCFjaGFubmVsLl9pTCAmJiBfaGFzTWVzc2FnZUxpc3RlbmVycyhjaGFubmVsKSkge1xuICAgIC8vIHNvbWVvbmUgaXMgbGlzdGVuaW5nLCBzdGFydCBzdWJzY3JpYmluZ1xuXG4gICAgdmFyIGxpc3RlbmVyRm4gPSBmdW5jdGlvbiBsaXN0ZW5lckZuKG1zZ09iaikge1xuICAgICAgY2hhbm5lbC5fYWRkRUxbbXNnT2JqLnR5cGVdLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyT2JqZWN0KSB7XG4gICAgICAgIGlmIChtc2dPYmoudGltZSA+PSBsaXN0ZW5lck9iamVjdC50aW1lKSB7XG4gICAgICAgICAgbGlzdGVuZXJPYmplY3QuZm4obXNnT2JqLmRhdGEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciB0aW1lID0gY2hhbm5lbC5tZXRob2QubWljcm9TZWNvbmRzKCk7XG4gICAgaWYgKGNoYW5uZWwuX3ByZXBQKSB7XG4gICAgICBjaGFubmVsLl9wcmVwUC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hhbm5lbC5faUwgPSB0cnVlO1xuICAgICAgICBjaGFubmVsLm1ldGhvZC5vbk1lc3NhZ2UoY2hhbm5lbC5fc3RhdGUsIGxpc3RlbmVyRm4sIHRpbWUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoYW5uZWwuX2lMID0gdHJ1ZTtcbiAgICAgIGNoYW5uZWwubWV0aG9kLm9uTWVzc2FnZShjaGFubmVsLl9zdGF0ZSwgbGlzdGVuZXJGbiwgdGltZSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBfc3RvcExpc3RlbmluZyhjaGFubmVsKSB7XG4gIGlmIChjaGFubmVsLl9pTCAmJiAhX2hhc01lc3NhZ2VMaXN0ZW5lcnMoY2hhbm5lbCkpIHtcbiAgICAvLyBubyBvbmUgaXMgbGlzdGVuaW5nLCBzdG9wIHN1YnNjcmliaW5nXG4gICAgY2hhbm5lbC5faUwgPSBmYWxzZTtcbiAgICB2YXIgdGltZSA9IGNoYW5uZWwubWV0aG9kLm1pY3JvU2Vjb25kcygpO1xuICAgIGNoYW5uZWwubWV0aG9kLm9uTWVzc2FnZShjaGFubmVsLl9zdGF0ZSwgbnVsbCwgdGltZSk7XG4gIH1cbn0iLCJpbXBvcnQgeyBOYXRpdmVNZXRob2QgfSBmcm9tICcuL21ldGhvZHMvbmF0aXZlLmpzJztcbmltcG9ydCB7IEluZGV4ZWREQk1ldGhvZCB9IGZyb20gJy4vbWV0aG9kcy9pbmRleGVkLWRiLmpzJztcbmltcG9ydCB7IExvY2Fsc3RvcmFnZU1ldGhvZCB9IGZyb20gJy4vbWV0aG9kcy9sb2NhbHN0b3JhZ2UuanMnO1xuaW1wb3J0IHsgU2ltdWxhdGVNZXRob2QgfSBmcm9tICcuL21ldGhvZHMvc2ltdWxhdGUuanMnO1xuLy8gdGhlIGxpbmUgYmVsb3cgd2lsbCBiZSByZW1vdmVkIGZyb20gZXM1L2Jyb3dzZXIgYnVpbGRzXG5cbi8vIG9yZGVyIGlzIGltcG9ydGFudFxudmFyIE1FVEhPRFMgPSBbTmF0aXZlTWV0aG9kLFxuLy8gZmFzdGVzdFxuSW5kZXhlZERCTWV0aG9kLCBMb2NhbHN0b3JhZ2VNZXRob2RdO1xuZXhwb3J0IGZ1bmN0aW9uIGNob29zZU1ldGhvZChvcHRpb25zKSB7XG4gIHZhciBjaG9vc2VNZXRob2RzID0gW10uY29uY2F0KG9wdGlvbnMubWV0aG9kcywgTUVUSE9EUykuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIC8vIHRoZSBsaW5lIGJlbG93IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIGVzNS9icm93c2VyIGJ1aWxkc1xuXG4gIC8vIGRpcmVjdGx5IGNob3NlblxuICBpZiAob3B0aW9ucy50eXBlKSB7XG4gICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ3NpbXVsYXRlJykge1xuICAgICAgLy8gb25seSB1c2Ugc2ltdWxhdGUtbWV0aG9kIGlmIGRpcmVjdGx5IGNob3NlblxuICAgICAgcmV0dXJuIFNpbXVsYXRlTWV0aG9kO1xuICAgIH1cbiAgICB2YXIgcmV0ID0gY2hvb3NlTWV0aG9kcy5maW5kKGZ1bmN0aW9uIChtKSB7XG4gICAgICByZXR1cm4gbS50eXBlID09PSBvcHRpb25zLnR5cGU7XG4gICAgfSk7XG4gICAgaWYgKCFyZXQpIHRocm93IG5ldyBFcnJvcignbWV0aG9kLXR5cGUgJyArIG9wdGlvbnMudHlwZSArICcgbm90IGZvdW5kJyk7ZWxzZSByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIGlmIG5vIHdlYndvcmtlciBzdXBwb3J0IGlzIG5lZWRlZCxcbiAgICogcmVtb3ZlIGlkYiBmcm9tIHRoZSBsaXN0IHNvIHRoYXQgbG9jYWxzdG9yYWdlIHdpbGwgYmUgY2hvc2VuXG4gICAqL1xuICBpZiAoIW9wdGlvbnMud2ViV29ya2VyU3VwcG9ydCkge1xuICAgIGNob29zZU1ldGhvZHMgPSBjaG9vc2VNZXRob2RzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgcmV0dXJuIG0udHlwZSAhPT0gJ2lkYic7XG4gICAgfSk7XG4gIH1cbiAgdmFyIHVzZU1ldGhvZCA9IGNob29zZU1ldGhvZHMuZmluZChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgcmV0dXJuIG1ldGhvZC5jYW5CZVVzZWQoKTtcbiAgfSk7XG4gIGlmICghdXNlTWV0aG9kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdXNhYmxlIG1ldGhvZCBmb3VuZCBpbiBcIiArIEpTT04uc3RyaW5naWZ5KE1FVEhPRFMubWFwKGZ1bmN0aW9uIChtKSB7XG4gICAgICByZXR1cm4gbS50eXBlO1xuICAgIH0pKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHVzZU1ldGhvZDtcbiAgfVxufSIsIi8qKlxuICogdGhpcyBtZXRob2QgdXNlcyBpbmRleGVkZGIgdG8gc3RvcmUgdGhlIG1lc3NhZ2VzXG4gKiBUaGVyZSBpcyBjdXJyZW50bHkgbm8gb2JzZXJ2ZXJBUEkgZm9yIGlkYlxuICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL3czYy9JbmRleGVkREIvaXNzdWVzLzUxXG4gKiBcbiAqIFdoZW4gd29ya2luZyBvbiB0aGlzLCBlbnN1cmUgdG8gdXNlIHRoZXNlIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbnM6XG4gKiBAbGluayBodHRwczovL3J4ZGIuaW5mby9zbG93LWluZGV4ZWRkYi5odG1sXG4gKi9cblxuaW1wb3J0IHsgc2xlZXAsIHJhbmRvbUludCwgcmFuZG9tVG9rZW4sIG1pY3JvU2Vjb25kcyBhcyBtaWNybywgUFJPTUlTRV9SRVNPTFZFRF9WT0lEIH0gZnJvbSAnLi4vdXRpbC5qcyc7XG5leHBvcnQgdmFyIG1pY3JvU2Vjb25kcyA9IG1pY3JvO1xuaW1wb3J0IHsgT2JsaXZpb3VzU2V0IH0gZnJvbSAnb2JsaXZpb3VzLXNldCc7XG5pbXBvcnQgeyBmaWxsT3B0aW9uc1dpdGhEZWZhdWx0cyB9IGZyb20gJy4uL29wdGlvbnMuanMnO1xudmFyIERCX1BSRUZJWCA9ICdwdWJrZXkuYnJvYWRjYXN0LWNoYW5uZWwtMC0nO1xudmFyIE9CSkVDVF9TVE9SRV9JRCA9ICdtZXNzYWdlcyc7XG5cbi8qKlxuICogVXNlIHJlbGF4ZWQgZHVyYWJpbGl0eSBmb3IgZmFzdGVyIHBlcmZvcm1hbmNlIG9uIGFsbCB0cmFuc2FjdGlvbnMuXG4gKiBAbGluayBodHRwczovL25vbGFubGF3c29uLmNvbS8yMDIxLzA4LzIyL3NwZWVkaW5nLXVwLWluZGV4ZWRkYi1yZWFkcy1hbmQtd3JpdGVzL1xuICovXG5leHBvcnQgdmFyIFRSQU5TQUNUSU9OX1NFVFRJTkdTID0ge1xuICBkdXJhYmlsaXR5OiAncmVsYXhlZCdcbn07XG5leHBvcnQgdmFyIHR5cGUgPSAnaWRiJztcbmV4cG9ydCBmdW5jdGlvbiBnZXRJZGIoKSB7XG4gIGlmICh0eXBlb2YgaW5kZXhlZERCICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIGluZGV4ZWREQjtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cubW96SW5kZXhlZERCICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHdpbmRvdy5tb3pJbmRleGVkREI7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cud2Via2l0SW5kZXhlZERCICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHdpbmRvdy53ZWJraXRJbmRleGVkREI7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cubXNJbmRleGVkREIgIT09ICd1bmRlZmluZWQnKSByZXR1cm4gd2luZG93Lm1zSW5kZXhlZERCO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBJZiBwb3NzaWJsZSwgd2Ugc2hvdWxkIGV4cGxpY2l0bHkgY29tbWl0IEluZGV4ZWREQiB0cmFuc2FjdGlvbnNcbiAqIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXG4gKiBAbGluayBodHRwczovL25vbGFubGF3c29uLmNvbS8yMDIxLzA4LzIyL3NwZWVkaW5nLXVwLWluZGV4ZWRkYi1yZWFkcy1hbmQtd3JpdGVzL1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29tbWl0SW5kZXhlZERCVHJhbnNhY3Rpb24odHgpIHtcbiAgaWYgKHR4LmNvbW1pdCkge1xuICAgIHR4LmNvbW1pdCgpO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGF0YWJhc2UoY2hhbm5lbE5hbWUpIHtcbiAgdmFyIEluZGV4ZWREQiA9IGdldElkYigpO1xuXG4gIC8vIGNyZWF0ZSB0YWJsZVxuICB2YXIgZGJOYW1lID0gREJfUFJFRklYICsgY2hhbm5lbE5hbWU7XG5cbiAgLyoqXG4gICAqIEFsbCBJbmRleGVkREIgZGF0YWJhc2VzIGFyZSBvcGVuZWQgd2l0aG91dCB2ZXJzaW9uXG4gICAqIGJlY2F1c2UgaXQgaXMgYSBiaXQgZmFzdGVyLCBlc3BlY2lhbGx5IG9uIGZpcmVmb3hcbiAgICogQGxpbmsgaHR0cDovL25wYXJhc2h1cmFtLmNvbS9JbmRleGVkREIvcGVyZi8jT3BlbiUyMERhdGFiYXNlJTIwd2l0aCUyMHZlcnNpb25cbiAgICovXG4gIHZhciBvcGVuUmVxdWVzdCA9IEluZGV4ZWREQi5vcGVuKGRiTmFtZSk7XG4gIG9wZW5SZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uIChldikge1xuICAgIHZhciBkYiA9IGV2LnRhcmdldC5yZXN1bHQ7XG4gICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX0lELCB7XG4gICAgICBrZXlQYXRoOiAnaWQnLFxuICAgICAgYXV0b0luY3JlbWVudDogdHJ1ZVxuICAgIH0pO1xuICB9O1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlcywgcmVqKSB7XG4gICAgb3BlblJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIChldikge1xuICAgICAgcmV0dXJuIHJlaihldik7XG4gICAgfTtcbiAgICBvcGVuUmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXMob3BlblJlcXVlc3QucmVzdWx0KTtcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiB3cml0ZXMgdGhlIG5ldyBtZXNzYWdlIHRvIHRoZSBkYXRhYmFzZVxuICogc28gb3RoZXIgcmVhZGVycyBjYW4gZmluZCBpdFxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVNZXNzYWdlKGRiLCByZWFkZXJVdWlkLCBtZXNzYWdlSnNvbikge1xuICB2YXIgdGltZSA9IERhdGUubm93KCk7XG4gIHZhciB3cml0ZU9iamVjdCA9IHtcbiAgICB1dWlkOiByZWFkZXJVdWlkLFxuICAgIHRpbWU6IHRpbWUsXG4gICAgZGF0YTogbWVzc2FnZUpzb25cbiAgfTtcbiAgdmFyIHR4ID0gZGIudHJhbnNhY3Rpb24oW09CSkVDVF9TVE9SRV9JRF0sICdyZWFkd3JpdGUnLCBUUkFOU0FDVElPTl9TRVRUSU5HUyk7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzLCByZWopIHtcbiAgICB0eC5vbmNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlcygpO1xuICAgIH07XG4gICAgdHgub25lcnJvciA9IGZ1bmN0aW9uIChldikge1xuICAgICAgcmV0dXJuIHJlaihldik7XG4gICAgfTtcbiAgICB2YXIgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfSUQpO1xuICAgIG9iamVjdFN0b3JlLmFkZCh3cml0ZU9iamVjdCk7XG4gICAgY29tbWl0SW5kZXhlZERCVHJhbnNhY3Rpb24odHgpO1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxNZXNzYWdlcyhkYikge1xuICB2YXIgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfSUQsICdyZWFkb25seScsIFRSQU5TQUNUSU9OX1NFVFRJTkdTKTtcbiAgdmFyIG9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX0lEKTtcbiAgdmFyIHJldCA9IFtdO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlcykge1xuICAgIG9iamVjdFN0b3JlLm9wZW5DdXJzb3IoKS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIHZhciBjdXJzb3IgPSBldi50YXJnZXQucmVzdWx0O1xuICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICByZXQucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAvL2FsZXJ0KFwiTmFtZSBmb3IgU1NOIFwiICsgY3Vyc29yLmtleSArIFwiIGlzIFwiICsgY3Vyc29yLnZhbHVlLm5hbWUpO1xuICAgICAgICBjdXJzb3JbXCJjb250aW51ZVwiXSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tbWl0SW5kZXhlZERCVHJhbnNhY3Rpb24odHgpO1xuICAgICAgICByZXMocmV0KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlc0hpZ2hlclRoYW4oZGIsIGxhc3RDdXJzb3JJZCkge1xuICB2YXIgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfSUQsICdyZWFkb25seScsIFRSQU5TQUNUSU9OX1NFVFRJTkdTKTtcbiAgdmFyIG9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX0lEKTtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIga2V5UmFuZ2VWYWx1ZSA9IElEQktleVJhbmdlLmJvdW5kKGxhc3RDdXJzb3JJZCArIDEsIEluZmluaXR5KTtcblxuICAvKipcbiAgICogT3B0aW1pemF0aW9uIHNob3J0Y3V0LFxuICAgKiBpZiBnZXRBbGwoKSBjYW4gYmUgdXNlZCwgZG8gbm90IHVzZSBhIGN1cnNvci5cbiAgICogQGxpbmsgaHR0cHM6Ly9yeGRiLmluZm8vc2xvdy1pbmRleGVkZGIuaHRtbFxuICAgKi9cbiAgaWYgKG9iamVjdFN0b3JlLmdldEFsbCkge1xuICAgIHZhciBnZXRBbGxSZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0QWxsKGtleVJhbmdlVmFsdWUpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzLCByZWopIHtcbiAgICAgIGdldEFsbFJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJlaihlcnIpO1xuICAgICAgfTtcbiAgICAgIGdldEFsbFJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmVzKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9wZW5DdXJzb3IoKSB7XG4gICAgLy8gT2NjYXNpb25hbGx5IFNhZmFyaSB3aWxsIGZhaWwgb24gSURCS2V5UmFuZ2UuYm91bmQsIHRoaXNcbiAgICAvLyBjYXRjaGVzIHRoYXQgZXJyb3IsIGhhdmluZyBpdCBvcGVuIHRoZSBjdXJzb3IgdG8gdGhlIGZpcnN0XG4gICAgLy8gaXRlbS4gV2hlbiBpdCBnZXRzIGRhdGEgaXQgd2lsbCBhZHZhbmNlIHRvIHRoZSBkZXNpcmVkIGtleS5cbiAgICB0cnkge1xuICAgICAga2V5UmFuZ2VWYWx1ZSA9IElEQktleVJhbmdlLmJvdW5kKGxhc3RDdXJzb3JJZCArIDEsIEluZmluaXR5KTtcbiAgICAgIHJldHVybiBvYmplY3RTdG9yZS5vcGVuQ3Vyc29yKGtleVJhbmdlVmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RTdG9yZS5vcGVuQ3Vyc29yKCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzLCByZWopIHtcbiAgICB2YXIgb3BlbkN1cnNvclJlcXVlc3QgPSBvcGVuQ3Vyc29yKCk7XG4gICAgb3BlbkN1cnNvclJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHJldHVybiByZWooZXJyKTtcbiAgICB9O1xuICAgIG9wZW5DdXJzb3JSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldikge1xuICAgICAgdmFyIGN1cnNvciA9IGV2LnRhcmdldC5yZXN1bHQ7XG4gICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgIGlmIChjdXJzb3IudmFsdWUuaWQgPCBsYXN0Q3Vyc29ySWQgKyAxKSB7XG4gICAgICAgICAgY3Vyc29yW1wiY29udGludWVcIl0obGFzdEN1cnNvcklkICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0LnB1c2goY3Vyc29yLnZhbHVlKTtcbiAgICAgICAgICBjdXJzb3JbXCJjb250aW51ZVwiXSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21taXRJbmRleGVkREJUcmFuc2FjdGlvbih0eCk7XG4gICAgICAgIHJlcyhyZXQpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU1lc3NhZ2VzQnlJZChjaGFubmVsU3RhdGUsIGlkcykge1xuICBpZiAoY2hhbm5lbFN0YXRlLmNsb3NlZCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICB9XG4gIHZhciB0eCA9IGNoYW5uZWxTdGF0ZS5kYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfSUQsICdyZWFkd3JpdGUnLCBUUkFOU0FDVElPTl9TRVRUSU5HUyk7XG4gIHZhciBvYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9JRCk7XG4gIHJldHVybiBQcm9taXNlLmFsbChpZHMubWFwKGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBkZWxldGVSZXF1ZXN0ID0gb2JqZWN0U3RvcmVbXCJkZWxldGVcIl0oaWQpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzKSB7XG4gICAgICBkZWxldGVSZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlcygpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldE9sZE1lc3NhZ2VzKGRiLCB0dGwpIHtcbiAgdmFyIG9sZGVyVGhlbiA9IERhdGUubm93KCkgLSB0dGw7XG4gIHZhciB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9JRCwgJ3JlYWRvbmx5JywgVFJBTlNBQ1RJT05fU0VUVElOR1MpO1xuICB2YXIgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfSUQpO1xuICB2YXIgcmV0ID0gW107XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzKSB7XG4gICAgb2JqZWN0U3RvcmUub3BlbkN1cnNvcigpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uIChldikge1xuICAgICAgdmFyIGN1cnNvciA9IGV2LnRhcmdldC5yZXN1bHQ7XG4gICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgIHZhciBtc2dPYmsgPSBjdXJzb3IudmFsdWU7XG4gICAgICAgIGlmIChtc2dPYmsudGltZSA8IG9sZGVyVGhlbikge1xuICAgICAgICAgIHJldC5wdXNoKG1zZ09iayk7XG4gICAgICAgICAgLy9hbGVydChcIk5hbWUgZm9yIFNTTiBcIiArIGN1cnNvci5rZXkgKyBcIiBpcyBcIiArIGN1cnNvci52YWx1ZS5uYW1lKTtcbiAgICAgICAgICBjdXJzb3JbXCJjb250aW51ZVwiXSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG5vIG1vcmUgb2xkIG1lc3NhZ2VzLFxuICAgICAgICAgIGNvbW1pdEluZGV4ZWREQlRyYW5zYWN0aW9uKHR4KTtcbiAgICAgICAgICByZXMocmV0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzKHJldCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2xlYW5PbGRNZXNzYWdlcyhjaGFubmVsU3RhdGUpIHtcbiAgcmV0dXJuIGdldE9sZE1lc3NhZ2VzKGNoYW5uZWxTdGF0ZS5kYiwgY2hhbm5lbFN0YXRlLm9wdGlvbnMuaWRiLnR0bCkudGhlbihmdW5jdGlvbiAodG9vT2xkKSB7XG4gICAgcmV0dXJuIHJlbW92ZU1lc3NhZ2VzQnlJZChjaGFubmVsU3RhdGUsIHRvb09sZC5tYXAoZnVuY3Rpb24gKG1zZykge1xuICAgICAgcmV0dXJuIG1zZy5pZDtcbiAgICB9KSk7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShjaGFubmVsTmFtZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gZmlsbE9wdGlvbnNXaXRoRGVmYXVsdHMob3B0aW9ucyk7XG4gIHJldHVybiBjcmVhdGVEYXRhYmFzZShjaGFubmVsTmFtZSkudGhlbihmdW5jdGlvbiAoZGIpIHtcbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICBjbG9zZWQ6IGZhbHNlLFxuICAgICAgbGFzdEN1cnNvcklkOiAwLFxuICAgICAgY2hhbm5lbE5hbWU6IGNoYW5uZWxOYW1lLFxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIHV1aWQ6IHJhbmRvbVRva2VuKCksXG4gICAgICAvKipcbiAgICAgICAqIGVtaXR0ZWRNZXNzYWdlc0lkc1xuICAgICAgICogY29udGFpbnMgYWxsIG1lc3NhZ2VzIHRoYXQgaGF2ZSBiZWVuIGVtaXR0ZWQgYmVmb3JlXG4gICAgICAgKiBAdHlwZSB7T2JsaXZpb3VzU2V0fVxuICAgICAgICovXG4gICAgICBlTUlzOiBuZXcgT2JsaXZpb3VzU2V0KG9wdGlvbnMuaWRiLnR0bCAqIDIpLFxuICAgICAgLy8gZW5zdXJlcyB3ZSBkbyBub3QgcmVhZCBtZXNzYWdlcyBpbiBwYXJhbGxlbFxuICAgICAgd3JpdGVCbG9ja1Byb21pc2U6IFBST01JU0VfUkVTT0xWRURfVk9JRCxcbiAgICAgIG1lc3NhZ2VzQ2FsbGJhY2s6IG51bGwsXG4gICAgICByZWFkUXVldWVQcm9taXNlczogW10sXG4gICAgICBkYjogZGJcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGFicnVwdCBjbG9zZXMgdGhhdCBkbyBub3Qgb3JpZ2luYXRlIGZyb20gZGIuY2xvc2UoKS5cbiAgICAgKiBUaGlzIGNvdWxkIGhhcHBlbiwgZm9yIGV4YW1wbGUsIGlmIHRoZSB1bmRlcmx5aW5nIHN0b3JhZ2UgaXNcbiAgICAgKiByZW1vdmVkIG9yIGlmIHRoZSB1c2VyIGNsZWFycyB0aGUgZGF0YWJhc2UgaW4gdGhlIGJyb3dzZXInc1xuICAgICAqIGhpc3RvcnkgcHJlZmVyZW5jZXMuXG4gICAgICovXG4gICAgZGIub25jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0YXRlLmNsb3NlZCA9IHRydWU7XG4gICAgICBpZiAob3B0aW9ucy5pZGIub25jbG9zZSkgb3B0aW9ucy5pZGIub25jbG9zZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBpZiBzZXJ2aWNlLXdvcmtlcnMgYXJlIHVzZWQsXG4gICAgICogd2UgaGF2ZSBubyAnc3RvcmFnZSctZXZlbnQgaWYgdGhleSBwb3N0IGEgbWVzc2FnZSxcbiAgICAgKiB0aGVyZWZvcmUgd2UgYWxzbyBoYXZlIHRvIHNldCBhbiBpbnRlcnZhbFxuICAgICAqL1xuICAgIF9yZWFkTG9vcChzdGF0ZSk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIF9yZWFkTG9vcChzdGF0ZSkge1xuICBpZiAoc3RhdGUuY2xvc2VkKSByZXR1cm47XG4gIHJlYWROZXdNZXNzYWdlcyhzdGF0ZSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHNsZWVwKHN0YXRlLm9wdGlvbnMuaWRiLmZhbGxiYWNrSW50ZXJ2YWwpO1xuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gX3JlYWRMb29wKHN0YXRlKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBfZmlsdGVyTWVzc2FnZShtc2dPYmosIHN0YXRlKSB7XG4gIGlmIChtc2dPYmoudXVpZCA9PT0gc3RhdGUudXVpZCkgcmV0dXJuIGZhbHNlOyAvLyBzZW5kIGJ5IG93blxuICBpZiAoc3RhdGUuZU1Jcy5oYXMobXNnT2JqLmlkKSkgcmV0dXJuIGZhbHNlOyAvLyBhbHJlYWR5IGVtaXR0ZWRcbiAgaWYgKG1zZ09iai5kYXRhLnRpbWUgPCBzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrVGltZSkgcmV0dXJuIGZhbHNlOyAvLyBvbGRlciB0aGVuIG9uTWVzc2FnZUNhbGxiYWNrXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIHJlYWRzIGFsbCBuZXcgbWVzc2FnZXMgZnJvbSB0aGUgZGF0YWJhc2UgYW5kIGVtaXRzIHRoZW1cbiAqL1xuZnVuY3Rpb24gcmVhZE5ld01lc3NhZ2VzKHN0YXRlKSB7XG4gIC8vIGNoYW5uZWwgYWxyZWFkeSBjbG9zZWRcbiAgaWYgKHN0YXRlLmNsb3NlZCkgcmV0dXJuIFBST01JU0VfUkVTT0xWRURfVk9JRDtcblxuICAvLyBpZiBubyBvbmUgaXMgbGlzdGVuaW5nLCB3ZSBkbyBub3QgbmVlZCB0byBzY2FuIGZvciBuZXcgbWVzc2FnZXNcbiAgaWYgKCFzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrKSByZXR1cm4gUFJPTUlTRV9SRVNPTFZFRF9WT0lEO1xuICByZXR1cm4gZ2V0TWVzc2FnZXNIaWdoZXJUaGFuKHN0YXRlLmRiLCBzdGF0ZS5sYXN0Q3Vyc29ySWQpLnRoZW4oZnVuY3Rpb24gKG5ld2VyTWVzc2FnZXMpIHtcbiAgICB2YXIgdXNlTWVzc2FnZXMgPSBuZXdlck1lc3NhZ2VzXG4gICAgLyoqXG4gICAgICogdGhlcmUgaXMgYSBidWcgaW4gaU9TIHdoZXJlIHRoZSBtc2dPYmogY2FuIGJlIHVuZGVmaW5lZCBzb21ldGltZXNcbiAgICAgKiBzbyB3ZSBmaWx0ZXIgdGhlbSBvdXRcbiAgICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vcHVia2V5L2Jyb2FkY2FzdC1jaGFubmVsL2lzc3Vlcy8xOVxuICAgICAqLy5maWx0ZXIoZnVuY3Rpb24gKG1zZ09iaikge1xuICAgICAgcmV0dXJuICEhbXNnT2JqO1xuICAgIH0pLm1hcChmdW5jdGlvbiAobXNnT2JqKSB7XG4gICAgICBpZiAobXNnT2JqLmlkID4gc3RhdGUubGFzdEN1cnNvcklkKSB7XG4gICAgICAgIHN0YXRlLmxhc3RDdXJzb3JJZCA9IG1zZ09iai5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtc2dPYmo7XG4gICAgfSkuZmlsdGVyKGZ1bmN0aW9uIChtc2dPYmopIHtcbiAgICAgIHJldHVybiBfZmlsdGVyTWVzc2FnZShtc2dPYmosIHN0YXRlKTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uIChtc2dPYmpBLCBtc2dPYmpCKSB7XG4gICAgICByZXR1cm4gbXNnT2JqQS50aW1lIC0gbXNnT2JqQi50aW1lO1xuICAgIH0pOyAvLyBzb3J0IGJ5IHRpbWVcbiAgICB1c2VNZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChtc2dPYmopIHtcbiAgICAgIGlmIChzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrKSB7XG4gICAgICAgIHN0YXRlLmVNSXMuYWRkKG1zZ09iai5pZCk7XG4gICAgICAgIHN0YXRlLm1lc3NhZ2VzQ2FsbGJhY2sobXNnT2JqLmRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBQUk9NSVNFX1JFU09MVkVEX1ZPSUQ7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlKGNoYW5uZWxTdGF0ZSkge1xuICBjaGFubmVsU3RhdGUuY2xvc2VkID0gdHJ1ZTtcbiAgY2hhbm5lbFN0YXRlLmRiLmNsb3NlKCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcG9zdE1lc3NhZ2UoY2hhbm5lbFN0YXRlLCBtZXNzYWdlSnNvbikge1xuICBjaGFubmVsU3RhdGUud3JpdGVCbG9ja1Byb21pc2UgPSBjaGFubmVsU3RhdGUud3JpdGVCbG9ja1Byb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHdyaXRlTWVzc2FnZShjaGFubmVsU3RhdGUuZGIsIGNoYW5uZWxTdGF0ZS51dWlkLCBtZXNzYWdlSnNvbik7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgIGlmIChyYW5kb21JbnQoMCwgMTApID09PSAwKSB7XG4gICAgICAvKiBhd2FpdCAoZG8gbm90IGF3YWl0KSAqL1xuICAgICAgY2xlYW5PbGRNZXNzYWdlcyhjaGFubmVsU3RhdGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjaGFubmVsU3RhdGUud3JpdGVCbG9ja1Byb21pc2U7XG59XG5leHBvcnQgZnVuY3Rpb24gb25NZXNzYWdlKGNoYW5uZWxTdGF0ZSwgZm4sIHRpbWUpIHtcbiAgY2hhbm5lbFN0YXRlLm1lc3NhZ2VzQ2FsbGJhY2tUaW1lID0gdGltZTtcbiAgY2hhbm5lbFN0YXRlLm1lc3NhZ2VzQ2FsbGJhY2sgPSBmbjtcbiAgcmVhZE5ld01lc3NhZ2VzKGNoYW5uZWxTdGF0ZSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FuQmVVc2VkKCkge1xuICByZXR1cm4gISFnZXRJZGIoKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdmVyYWdlUmVzcG9uc2VUaW1lKG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuaWRiLmZhbGxiYWNrSW50ZXJ2YWwgKiAyO1xufVxuZXhwb3J0IHZhciBJbmRleGVkREJNZXRob2QgPSB7XG4gIGNyZWF0ZTogY3JlYXRlLFxuICBjbG9zZTogY2xvc2UsXG4gIG9uTWVzc2FnZTogb25NZXNzYWdlLFxuICBwb3N0TWVzc2FnZTogcG9zdE1lc3NhZ2UsXG4gIGNhbkJlVXNlZDogY2FuQmVVc2VkLFxuICB0eXBlOiB0eXBlLFxuICBhdmVyYWdlUmVzcG9uc2VUaW1lOiBhdmVyYWdlUmVzcG9uc2VUaW1lLFxuICBtaWNyb1NlY29uZHM6IG1pY3JvU2Vjb25kc1xufTsiLCIvKipcbiAqIEEgbG9jYWxTdG9yYWdlLW9ubHkgbWV0aG9kIHdoaWNoIHVzZXMgbG9jYWxzdG9yYWdlIGFuZCBpdHMgJ3N0b3JhZ2UnLWV2ZW50XG4gKiBUaGlzIGRvZXMgbm90IHdvcmsgaW5zaWRlIHdlYndvcmtlcnMgYmVjYXVzZSB0aGV5IGhhdmUgbm8gYWNjZXNzIHRvIGxvY2Fsc3RvcmFnZVxuICogVGhpcyBpcyBiYXNpY2FsbHkgaW1wbGVtZW50ZWQgdG8gc3VwcG9ydCBJRTkgb3IgeW91ciBncmFuZG1vdGhlcidzIHRvYXN0ZXIuXG4gKiBAbGluayBodHRwczovL2Nhbml1c2UuY29tLyNmZWF0PW5hbWV2YWx1ZS1zdG9yYWdlXG4gKiBAbGluayBodHRwczovL2Nhbml1c2UuY29tLyNmZWF0PWluZGV4ZWRkYlxuICovXG5cbmltcG9ydCB7IE9ibGl2aW91c1NldCB9IGZyb20gJ29ibGl2aW91cy1zZXQnO1xuaW1wb3J0IHsgZmlsbE9wdGlvbnNXaXRoRGVmYXVsdHMgfSBmcm9tICcuLi9vcHRpb25zLmpzJztcbmltcG9ydCB7IHNsZWVwLCByYW5kb21Ub2tlbiwgbWljcm9TZWNvbmRzIGFzIG1pY3JvIH0gZnJvbSAnLi4vdXRpbC5qcyc7XG5leHBvcnQgdmFyIG1pY3JvU2Vjb25kcyA9IG1pY3JvO1xudmFyIEtFWV9QUkVGSVggPSAncHVia2V5LmJyb2FkY2FzdENoYW5uZWwtJztcbmV4cG9ydCB2YXIgdHlwZSA9ICdsb2NhbHN0b3JhZ2UnO1xuXG4vKipcbiAqIGNvcGllZCBmcm9tIGNyb3NzdGFiXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vdGVqYWNxdWVzL2Nyb3NzdGFiL2Jsb2IvbWFzdGVyL3NyYy9jcm9zc3RhYi5qcyNMMzJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZSgpIHtcbiAgdmFyIGxvY2FsU3RvcmFnZTtcbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gbnVsbDtcbiAgdHJ5IHtcbiAgICBsb2NhbFN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICAgIGxvY2FsU3RvcmFnZSA9IHdpbmRvd1snaWU4LWV2ZW50bGlzdGVuZXIvc3RvcmFnZSddIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBOZXcgdmVyc2lvbnMgb2YgRmlyZWZveCB0aHJvdyBhIFNlY3VyaXR5IGV4Y2VwdGlvblxuICAgIC8vIGlmIGNvb2tpZXMgYXJlIGRpc2FibGVkLiBTZWVcbiAgICAvLyBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD0xMDI4MTUzXG4gIH1cbiAgcmV0dXJuIGxvY2FsU3RvcmFnZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdG9yYWdlS2V5KGNoYW5uZWxOYW1lKSB7XG4gIHJldHVybiBLRVlfUFJFRklYICsgY2hhbm5lbE5hbWU7XG59XG5cbi8qKlxuKiB3cml0ZXMgdGhlIG5ldyBtZXNzYWdlIHRvIHRoZSBzdG9yYWdlXG4qIGFuZCBmaXJlcyB0aGUgc3RvcmFnZS1ldmVudCBzbyBvdGhlciByZWFkZXJzIGNhbiBmaW5kIGl0XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHBvc3RNZXNzYWdlKGNoYW5uZWxTdGF0ZSwgbWVzc2FnZUpzb24pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBzbGVlcCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGtleSA9IHN0b3JhZ2VLZXkoY2hhbm5lbFN0YXRlLmNoYW5uZWxOYW1lKTtcbiAgICAgIHZhciB3cml0ZU9iaiA9IHtcbiAgICAgICAgdG9rZW46IHJhbmRvbVRva2VuKCksXG4gICAgICAgIHRpbWU6IERhdGUubm93KCksXG4gICAgICAgIGRhdGE6IG1lc3NhZ2VKc29uLFxuICAgICAgICB1dWlkOiBjaGFubmVsU3RhdGUudXVpZFxuICAgICAgfTtcbiAgICAgIHZhciB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHdyaXRlT2JqKTtcbiAgICAgIGdldExvY2FsU3RvcmFnZSgpLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogU3RvcmFnZUV2ZW50IGRvZXMgbm90IGZpcmUgdGhlICdzdG9yYWdlJyBldmVudFxuICAgICAgICogaW4gdGhlIHdpbmRvdyB0aGF0IGNoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSBsb2NhbCBzdG9yYWdlLlxuICAgICAgICogU28gd2UgZmlyZSBpdCBtYW51YWxseVxuICAgICAgICovXG4gICAgICB2YXIgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgIGV2LmluaXRFdmVudCgnc3RvcmFnZScsIHRydWUsIHRydWUpO1xuICAgICAgZXYua2V5ID0ga2V5O1xuICAgICAgZXYubmV3VmFsdWUgPSB2YWx1ZTtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgICAgIHJlcygpO1xuICAgIH0pO1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRTdG9yYWdlRXZlbnRMaXN0ZW5lcihjaGFubmVsTmFtZSwgZm4pIHtcbiAgdmFyIGtleSA9IHN0b3JhZ2VLZXkoY2hhbm5lbE5hbWUpO1xuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihldikge1xuICAgIGlmIChldi5rZXkgPT09IGtleSkge1xuICAgICAgZm4oSlNPTi5wYXJzZShldi5uZXdWYWx1ZSkpO1xuICAgIH1cbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBsaXN0ZW5lcik7XG4gIHJldHVybiBsaXN0ZW5lcjtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdG9yYWdlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcikge1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIGxpc3RlbmVyKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoY2hhbm5lbE5hbWUsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGZpbGxPcHRpb25zV2l0aERlZmF1bHRzKG9wdGlvbnMpO1xuICBpZiAoIWNhbkJlVXNlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCcm9hZGNhc3RDaGFubmVsOiBsb2NhbHN0b3JhZ2UgY2Fubm90IGJlIHVzZWQnKTtcbiAgfVxuICB2YXIgdXVpZCA9IHJhbmRvbVRva2VuKCk7XG5cbiAgLyoqXG4gICAqIGVNSXNcbiAgICogY29udGFpbnMgYWxsIG1lc3NhZ2VzIHRoYXQgaGF2ZSBiZWVuIGVtaXR0ZWQgYmVmb3JlXG4gICAqIEB0eXBlIHtPYmxpdmlvdXNTZXR9XG4gICAqL1xuICB2YXIgZU1JcyA9IG5ldyBPYmxpdmlvdXNTZXQob3B0aW9ucy5sb2NhbHN0b3JhZ2UucmVtb3ZlVGltZW91dCk7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICBjaGFubmVsTmFtZTogY2hhbm5lbE5hbWUsXG4gICAgdXVpZDogdXVpZCxcbiAgICBlTUlzOiBlTUlzIC8vIGVtaXR0ZWRNZXNzYWdlc0lkc1xuICB9O1xuICBzdGF0ZS5saXN0ZW5lciA9IGFkZFN0b3JhZ2VFdmVudExpc3RlbmVyKGNoYW5uZWxOYW1lLCBmdW5jdGlvbiAobXNnT2JqKSB7XG4gICAgaWYgKCFzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrKSByZXR1cm47IC8vIG5vIGxpc3RlbmVyXG4gICAgaWYgKG1zZ09iai51dWlkID09PSB1dWlkKSByZXR1cm47IC8vIG93biBtZXNzYWdlXG4gICAgaWYgKCFtc2dPYmoudG9rZW4gfHwgZU1Jcy5oYXMobXNnT2JqLnRva2VuKSkgcmV0dXJuOyAvLyBhbHJlYWR5IGVtaXR0ZWRcbiAgICBpZiAobXNnT2JqLmRhdGEudGltZSAmJiBtc2dPYmouZGF0YS50aW1lIDwgc3RhdGUubWVzc2FnZXNDYWxsYmFja1RpbWUpIHJldHVybjsgLy8gdG9vIG9sZFxuXG4gICAgZU1Jcy5hZGQobXNnT2JqLnRva2VuKTtcbiAgICBzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrKG1zZ09iai5kYXRhKTtcbiAgfSk7XG4gIHJldHVybiBzdGF0ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZShjaGFubmVsU3RhdGUpIHtcbiAgcmVtb3ZlU3RvcmFnZUV2ZW50TGlzdGVuZXIoY2hhbm5lbFN0YXRlLmxpc3RlbmVyKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbk1lc3NhZ2UoY2hhbm5lbFN0YXRlLCBmbiwgdGltZSkge1xuICBjaGFubmVsU3RhdGUubWVzc2FnZXNDYWxsYmFja1RpbWUgPSB0aW1lO1xuICBjaGFubmVsU3RhdGUubWVzc2FnZXNDYWxsYmFjayA9IGZuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbkJlVXNlZCgpIHtcbiAgdmFyIGxzID0gZ2V0TG9jYWxTdG9yYWdlKCk7XG4gIGlmICghbHMpIHJldHVybiBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIga2V5ID0gJ19fYnJvYWRjYXN0Y2hhbm5lbF9jaGVjayc7XG4gICAgbHMuc2V0SXRlbShrZXksICd3b3JrcycpO1xuICAgIGxzLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFNhZmFyaSAxMCBpbiBwcml2YXRlIG1vZGUgd2lsbCBub3QgYWxsb3cgd3JpdGUgYWNjZXNzIHRvIGxvY2FsXG4gICAgLy8gc3RvcmFnZSBhbmQgZmFpbCB3aXRoIGEgUXVvdGFFeGNlZWRlZEVycm9yLiBTZWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX1N0b3JhZ2VfQVBJI1ByaXZhdGVfQnJvd3NpbmdfSW5jb2duaXRvX21vZGVzXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGF2ZXJhZ2VSZXNwb25zZVRpbWUoKSB7XG4gIHZhciBkZWZhdWx0VGltZSA9IDEyMDtcbiAgdmFyIHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiAgaWYgKHVzZXJBZ2VudC5pbmNsdWRlcygnc2FmYXJpJykgJiYgIXVzZXJBZ2VudC5pbmNsdWRlcygnY2hyb21lJykpIHtcbiAgICAvLyBzYWZhcmkgaXMgbXVjaCBzbG93ZXIgc28gdGhpcyB0aW1lIGlzIGhpZ2hlclxuICAgIHJldHVybiBkZWZhdWx0VGltZSAqIDI7XG4gIH1cbiAgcmV0dXJuIGRlZmF1bHRUaW1lO1xufVxuZXhwb3J0IHZhciBMb2NhbHN0b3JhZ2VNZXRob2QgPSB7XG4gIGNyZWF0ZTogY3JlYXRlLFxuICBjbG9zZTogY2xvc2UsXG4gIG9uTWVzc2FnZTogb25NZXNzYWdlLFxuICBwb3N0TWVzc2FnZTogcG9zdE1lc3NhZ2UsXG4gIGNhbkJlVXNlZDogY2FuQmVVc2VkLFxuICB0eXBlOiB0eXBlLFxuICBhdmVyYWdlUmVzcG9uc2VUaW1lOiBhdmVyYWdlUmVzcG9uc2VUaW1lLFxuICBtaWNyb1NlY29uZHM6IG1pY3JvU2Vjb25kc1xufTsiLCJpbXBvcnQgeyBtaWNyb1NlY29uZHMgYXMgbWljcm8sIFBST01JU0VfUkVTT0xWRURfVk9JRCB9IGZyb20gJy4uL3V0aWwuanMnO1xuZXhwb3J0IHZhciBtaWNyb1NlY29uZHMgPSBtaWNybztcbmV4cG9ydCB2YXIgdHlwZSA9ICduYXRpdmUnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShjaGFubmVsTmFtZSkge1xuICB2YXIgc3RhdGUgPSB7XG4gICAgdGltZTogbWljcm8oKSxcbiAgICBtZXNzYWdlc0NhbGxiYWNrOiBudWxsLFxuICAgIGJjOiBuZXcgQnJvYWRjYXN0Q2hhbm5lbChjaGFubmVsTmFtZSksXG4gICAgc3ViRm5zOiBbXSAvLyBzdWJzY3JpYmVyRnVuY3Rpb25zXG4gIH07XG4gIHN0YXRlLmJjLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChtc2dFdmVudCkge1xuICAgIGlmIChzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrKSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlc0NhbGxiYWNrKG1zZ0V2ZW50LmRhdGEpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlKGNoYW5uZWxTdGF0ZSkge1xuICBjaGFubmVsU3RhdGUuYmMuY2xvc2UoKTtcbiAgY2hhbm5lbFN0YXRlLnN1YkZucyA9IFtdO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBvc3RNZXNzYWdlKGNoYW5uZWxTdGF0ZSwgbWVzc2FnZUpzb24pIHtcbiAgdHJ5IHtcbiAgICBjaGFubmVsU3RhdGUuYmMucG9zdE1lc3NhZ2UobWVzc2FnZUpzb24sIGZhbHNlKTtcbiAgICByZXR1cm4gUFJPTUlTRV9SRVNPTFZFRF9WT0lEO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIG9uTWVzc2FnZShjaGFubmVsU3RhdGUsIGZuKSB7XG4gIGNoYW5uZWxTdGF0ZS5tZXNzYWdlc0NhbGxiYWNrID0gZm47XG59XG5leHBvcnQgZnVuY3Rpb24gY2FuQmVVc2VkKCkge1xuICAvLyBEZW5vIHJ1bnRpbWVcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcy5EZW5vICYmIGdsb2JhbFRoaXMuRGVuby5hcmdzKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBCcm93c2VyIHJ1bnRpbWVcbiAgaWYgKCh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpICYmIHR5cGVvZiBCcm9hZGNhc3RDaGFubmVsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKEJyb2FkY2FzdENoYW5uZWwuX3B1YmtleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCcm9hZGNhc3RDaGFubmVsOiBEbyBub3Qgb3ZlcndyaXRlIHdpbmRvdy5Ccm9hZGNhc3RDaGFubmVsIHdpdGggdGhpcyBtb2R1bGUsIHRoaXMgaXMgbm90IGEgcG9seWZpbGwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gYXZlcmFnZVJlc3BvbnNlVGltZSgpIHtcbiAgcmV0dXJuIDE1MDtcbn1cbmV4cG9ydCB2YXIgTmF0aXZlTWV0aG9kID0ge1xuICBjcmVhdGU6IGNyZWF0ZSxcbiAgY2xvc2U6IGNsb3NlLFxuICBvbk1lc3NhZ2U6IG9uTWVzc2FnZSxcbiAgcG9zdE1lc3NhZ2U6IHBvc3RNZXNzYWdlLFxuICBjYW5CZVVzZWQ6IGNhbkJlVXNlZCxcbiAgdHlwZTogdHlwZSxcbiAgYXZlcmFnZVJlc3BvbnNlVGltZTogYXZlcmFnZVJlc3BvbnNlVGltZSxcbiAgbWljcm9TZWNvbmRzOiBtaWNyb1NlY29uZHNcbn07IiwiaW1wb3J0IHsgbWljcm9TZWNvbmRzIGFzIG1pY3JvIH0gZnJvbSAnLi4vdXRpbC5qcyc7XG5leHBvcnQgdmFyIG1pY3JvU2Vjb25kcyA9IG1pY3JvO1xuZXhwb3J0IHZhciB0eXBlID0gJ3NpbXVsYXRlJztcbnZhciBTSU1VTEFURV9DSEFOTkVMUyA9IG5ldyBTZXQoKTtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoY2hhbm5lbE5hbWUpIHtcbiAgdmFyIHN0YXRlID0ge1xuICAgIHRpbWU6IG1pY3JvU2Vjb25kcygpLFxuICAgIG5hbWU6IGNoYW5uZWxOYW1lLFxuICAgIG1lc3NhZ2VzQ2FsbGJhY2s6IG51bGxcbiAgfTtcbiAgU0lNVUxBVEVfQ0hBTk5FTFMuYWRkKHN0YXRlKTtcbiAgcmV0dXJuIHN0YXRlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlKGNoYW5uZWxTdGF0ZSkge1xuICBTSU1VTEFURV9DSEFOTkVMU1tcImRlbGV0ZVwiXShjaGFubmVsU3RhdGUpO1xufVxuZXhwb3J0IHZhciBTSU1VTEFURV9ERUxBWV9USU1FID0gNTtcbmV4cG9ydCBmdW5jdGlvbiBwb3N0TWVzc2FnZShjaGFubmVsU3RhdGUsIG1lc3NhZ2VKc29uKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNoYW5uZWxBcnJheSA9IEFycmF5LmZyb20oU0lNVUxBVEVfQ0hBTk5FTFMpO1xuICAgICAgY2hhbm5lbEFycmF5LmZvckVhY2goZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgICAgICAgaWYgKGNoYW5uZWwubmFtZSA9PT0gY2hhbm5lbFN0YXRlLm5hbWUgJiZcbiAgICAgICAgLy8gaGFzIHNhbWUgbmFtZVxuICAgICAgICBjaGFubmVsICE9PSBjaGFubmVsU3RhdGUgJiZcbiAgICAgICAgLy8gbm90IG93biBjaGFubmVsXG4gICAgICAgICEhY2hhbm5lbC5tZXNzYWdlc0NhbGxiYWNrICYmXG4gICAgICAgIC8vIGhhcyBzdWJzY3JpYmVyc1xuICAgICAgICBjaGFubmVsLnRpbWUgPCBtZXNzYWdlSnNvbi50aW1lIC8vIGNoYW5uZWwgbm90IGNyZWF0ZWQgYWZ0ZXIgcG9zdE1lc3NhZ2UoKSBjYWxsXG4gICAgICAgICkge1xuICAgICAgICAgIGNoYW5uZWwubWVzc2FnZXNDYWxsYmFjayhtZXNzYWdlSnNvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVzKCk7XG4gICAgfSwgU0lNVUxBVEVfREVMQVlfVElNRSk7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uTWVzc2FnZShjaGFubmVsU3RhdGUsIGZuKSB7XG4gIGNoYW5uZWxTdGF0ZS5tZXNzYWdlc0NhbGxiYWNrID0gZm47XG59XG5leHBvcnQgZnVuY3Rpb24gY2FuQmVVc2VkKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhdmVyYWdlUmVzcG9uc2VUaW1lKCkge1xuICByZXR1cm4gU0lNVUxBVEVfREVMQVlfVElNRTtcbn1cbmV4cG9ydCB2YXIgU2ltdWxhdGVNZXRob2QgPSB7XG4gIGNyZWF0ZTogY3JlYXRlLFxuICBjbG9zZTogY2xvc2UsXG4gIG9uTWVzc2FnZTogb25NZXNzYWdlLFxuICBwb3N0TWVzc2FnZTogcG9zdE1lc3NhZ2UsXG4gIGNhbkJlVXNlZDogY2FuQmVVc2VkLFxuICB0eXBlOiB0eXBlLFxuICBhdmVyYWdlUmVzcG9uc2VUaW1lOiBhdmVyYWdlUmVzcG9uc2VUaW1lLFxuICBtaWNyb1NlY29uZHM6IG1pY3JvU2Vjb25kc1xufTsiLCJleHBvcnQgZnVuY3Rpb24gZmlsbE9wdGlvbnNXaXRoRGVmYXVsdHMoKSB7XG4gIHZhciBvcmlnaW5hbE9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICB2YXIgb3B0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxPcHRpb25zKSk7XG5cbiAgLy8gbWFpblxuICBpZiAodHlwZW9mIG9wdGlvbnMud2ViV29ya2VyU3VwcG9ydCA9PT0gJ3VuZGVmaW5lZCcpIG9wdGlvbnMud2ViV29ya2VyU3VwcG9ydCA9IHRydWU7XG5cbiAgLy8gaW5kZXhlZC1kYlxuICBpZiAoIW9wdGlvbnMuaWRiKSBvcHRpb25zLmlkYiA9IHt9O1xuICAvLyAgYWZ0ZXIgdGhpcyB0aW1lIHRoZSBtZXNzYWdlcyBnZXQgZGVsZXRlZFxuICBpZiAoIW9wdGlvbnMuaWRiLnR0bCkgb3B0aW9ucy5pZGIudHRsID0gMTAwMCAqIDQ1O1xuICBpZiAoIW9wdGlvbnMuaWRiLmZhbGxiYWNrSW50ZXJ2YWwpIG9wdGlvbnMuaWRiLmZhbGxiYWNrSW50ZXJ2YWwgPSAxNTA7XG4gIC8vICBoYW5kbGVzIGFicnVwdCBkYiBvbmNsb3NlIGV2ZW50cy5cbiAgaWYgKG9yaWdpbmFsT3B0aW9ucy5pZGIgJiYgdHlwZW9mIG9yaWdpbmFsT3B0aW9ucy5pZGIub25jbG9zZSA9PT0gJ2Z1bmN0aW9uJykgb3B0aW9ucy5pZGIub25jbG9zZSA9IG9yaWdpbmFsT3B0aW9ucy5pZGIub25jbG9zZTtcblxuICAvLyBsb2NhbHN0b3JhZ2VcbiAgaWYgKCFvcHRpb25zLmxvY2Fsc3RvcmFnZSkgb3B0aW9ucy5sb2NhbHN0b3JhZ2UgPSB7fTtcbiAgaWYgKCFvcHRpb25zLmxvY2Fsc3RvcmFnZS5yZW1vdmVUaW1lb3V0KSBvcHRpb25zLmxvY2Fsc3RvcmFnZS5yZW1vdmVUaW1lb3V0ID0gMTAwMCAqIDYwO1xuXG4gIC8vIGN1c3RvbSBtZXRob2RzXG4gIGlmIChvcmlnaW5hbE9wdGlvbnMubWV0aG9kcykgb3B0aW9ucy5tZXRob2RzID0gb3JpZ2luYWxPcHRpb25zLm1ldGhvZHM7XG5cbiAgLy8gbm9kZVxuICBpZiAoIW9wdGlvbnMubm9kZSkgb3B0aW9ucy5ub2RlID0ge307XG4gIGlmICghb3B0aW9ucy5ub2RlLnR0bCkgb3B0aW9ucy5ub2RlLnR0bCA9IDEwMDAgKiA2MCAqIDI7IC8vIDIgbWludXRlcztcbiAgLyoqXG4gICAqIE9uIGxpbnV4IHVzZSAndWxpbWl0IC1IbicgdG8gZ2V0IHRoZSBsaW1pdCBvZiBvcGVuIGZpbGVzLlxuICAgKiBPbiB1YnVudHUgdGhpcyB3YXMgNDA5NiBmb3IgbWUsIHNvIHdlIHVzZSBoYWxmIG9mIHRoYXQgYXMgbWF4UGFyYWxsZWxXcml0ZXMgZGVmYXVsdC5cbiAgICovXG4gIGlmICghb3B0aW9ucy5ub2RlLm1heFBhcmFsbGVsV3JpdGVzKSBvcHRpb25zLm5vZGUubWF4UGFyYWxsZWxXcml0ZXMgPSAyMDQ4O1xuICBpZiAodHlwZW9mIG9wdGlvbnMubm9kZS51c2VGYXN0UGF0aCA9PT0gJ3VuZGVmaW5lZCcpIG9wdGlvbnMubm9kZS51c2VGYXN0UGF0aCA9IHRydWU7XG4gIHJldHVybiBvcHRpb25zO1xufSIsIi8qKlxuICogcmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgYSBwcm9taXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2Uob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIG9iai50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0IHZhciBQUk9NSVNFX1JFU09MVkVEX0ZBTFNFID0gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKTtcbmV4cG9ydCB2YXIgUFJPTUlTRV9SRVNPTFZFRF9UUlVFID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuZXhwb3J0IHZhciBQUk9NSVNFX1JFU09MVkVEX1ZPSUQgPSBQcm9taXNlLnJlc29sdmUoKTtcbmV4cG9ydCBmdW5jdGlvbiBzbGVlcCh0aW1lLCByZXNvbHZlV2l0aCkge1xuICBpZiAoIXRpbWUpIHRpbWUgPSAwO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlcykge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXMocmVzb2x2ZVdpdGgpO1xuICAgIH0sIHRpbWUpO1xuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21JbnQobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59XG5cbi8qKlxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzgwODQyNDhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVRva2VuKCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIpO1xufVxudmFyIGxhc3RNcyA9IDA7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY3VycmVudCB1bml4IHRpbWUgaW4gbWljcm8tc2Vjb25kcyxcbiAqIFdBUk5JTkc6IFRoaXMgaXMgYSBwc2V1ZG8tZnVuY3Rpb25cbiAqIFBlcmZvcm1hbmNlLm5vdyBpcyBub3QgcmVsaWFibGUgaW4gd2Vid29ya2Vycywgc28gd2UganVzdCBtYWtlIHN1cmUgdG8gbmV2ZXIgcmV0dXJuIHRoZSBzYW1lIHRpbWUuXG4gKiBUaGlzIGlzIGVub3VnaCBpbiBicm93c2VycywgYW5kIHRoaXMgZnVuY3Rpb24gd2lsbCBub3QgYmUgdXNlZCBpbiBub2RlanMuXG4gKiBUaGUgbWFpbiByZWFzb24gZm9yIHRoaXMgaGFjayBpcyB0byBlbnN1cmUgdGhhdCBCcm9hZGNhc3RDaGFubmVsIGJlaGF2ZXMgZXF1YWwgdG8gcHJvZHVjdGlvbiB3aGVuIGl0IGlzIHVzZWQgaW4gZmFzdC1ydW5uaW5nIHVuaXQgdGVzdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaWNyb1NlY29uZHMoKSB7XG4gIHZhciByZXQgPSBEYXRlLm5vdygpICogMTAwMDsgLy8gbWlsbGlzZWNvbmRzIHRvIG1pY3Jvc2Vjb25kc1xuICBpZiAocmV0IDw9IGxhc3RNcykge1xuICAgIHJldCA9IGxhc3RNcyArIDE7XG4gIH1cbiAgbGFzdE1zID0gcmV0O1xuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIFdlYkxvY2sgQVBJIGlzIHN1cHBvcnRlZC5cbiAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XZWJfTG9ja3NfQVBJXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdXBwb3J0c1dlYkxvY2tBUEkoKSB7XG4gIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbmF2aWdhdG9yLmxvY2tzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbmF2aWdhdG9yLmxvY2tzLnJlcXVlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0iLCIvKipcbiAqIHRoaXMgaXMgYSBzZXQgd2hpY2ggYXV0b21hdGljYWxseSBmb3JnZXRzXG4gKiBhIGdpdmVuIGVudHJ5IHdoZW4gYSBuZXcgZW50cnkgaXMgc2V0IGFuZCB0aGUgdHRsXG4gKiBvZiB0aGUgb2xkIG9uZSBpcyBvdmVyXG4gKi9cbmV4cG9ydCBjbGFzcyBPYmxpdmlvdXNTZXQge1xuICAgIHR0bDtcbiAgICBtYXAgPSBuZXcgTWFwKCk7XG4gICAgLyoqXG4gICAgICogQ3JlYXRpbmcgY2FsbHMgdG8gc2V0VGltZW91dCgpIGlzIGV4cGVuc2l2ZSxcbiAgICAgKiBzbyB3ZSBvbmx5IGRvIHRoYXQgaWYgdGhlcmUgaXMgbm90IHRpbWVvdXQgYWxyZWFkeSBvcGVuLlxuICAgICAqL1xuICAgIF90byA9IGZhbHNlO1xuICAgIGNvbnN0cnVjdG9yKHR0bCkge1xuICAgICAgICB0aGlzLnR0bCA9IHR0bDtcbiAgICB9XG4gICAgaGFzKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5oYXModmFsdWUpO1xuICAgIH1cbiAgICBhZGQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5tYXAuc2V0KHZhbHVlLCBub3coKSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVuIGEgbmV3IHZhbHVlIGlzIGFkZGVkLFxuICAgICAgICAgKiBzdGFydCB0aGUgY2xlYW51cCBhdCB0aGUgbmV4dCB0aWNrXG4gICAgICAgICAqIHRvIG5vdCBibG9jayB0aGUgY3B1IGZvciBtb3JlIGltcG9ydGFudCBzdHVmZlxuICAgICAgICAgKiB0aGF0IG1pZ2h0IGhhcHBlbi5cbiAgICAgICAgICovXG4gICAgICAgIGlmICghdGhpcy5fdG8pIHtcbiAgICAgICAgICAgIHRoaXMuX3RvID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVtb3ZlVG9vT2xkVmFsdWVzKHRoaXMpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMubWFwLmNsZWFyKCk7XG4gICAgfVxufVxuLyoqXG4gKiBSZW1vdmVzIGFsbCBlbnRyaWVzIGZyb20gdGhlIHNldFxuICogd2hlcmUgdGhlIFRUTCBoYXMgZXhwaXJlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVG9vT2xkVmFsdWVzKG9ibGl2aW91c1NldCkge1xuICAgIGNvbnN0IG9sZGVyVGhlbiA9IG5vdygpIC0gb2JsaXZpb3VzU2V0LnR0bDtcbiAgICBjb25zdCBpdGVyYXRvciA9IG9ibGl2aW91c1NldC5tYXBbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgIC8qKlxuICAgICAqIEJlY2F1c2Ugd2UgY2FuIGFzc3VtZSB0aGUgbmV3IHZhbHVlcyBhcmUgYWRkZWQgYXQgdGhlIGJvdHRvbSxcbiAgICAgKiB3ZSBzdGFydCBmcm9tIHRoZSB0b3AgYW5kIHN0b3AgYXMgc29vbiBhcyB3ZSByZWFjaCBhIG5vbi10b28tb2xkIHZhbHVlLlxuICAgICAqL1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBpdGVyYXRvci5uZXh0KCkudmFsdWU7XG4gICAgICAgIGlmICghbmV4dCkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBubyBtb3JlIGVsZW1lbnRzXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWUgPSBuZXh0WzBdO1xuICAgICAgICBjb25zdCB0aW1lID0gbmV4dFsxXTtcbiAgICAgICAgaWYgKHRpbWUgPCBvbGRlclRoZW4pIHtcbiAgICAgICAgICAgIG9ibGl2aW91c1NldC5tYXAuZGVsZXRlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlIHJlYWNoZWQgYSB2YWx1ZSB0aGF0IGlzIG5vdCBvbGQgZW5vdWdoXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gbm93KCkge1xuICAgIHJldHVybiBEYXRlLm5vdygpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiLyoqXG4gKiBAZmlsZSAgICAgICAgY29udGFpbnMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHR3byBFdmVudCBCdXMnIGNoYW5uZWwgdHlwZXM6XG4gKlxuICogICAgICAgICAgICAgIFByaXZhdGVDaGFubmVsIC0gY2hhbm5lbCB1c2VkIHRvIDF2MSBjb21tdW5pY2F0aW9uIGJldHdlZW4gZm9yIGV4YW1wbGUgY2FudmFzIGFuZCB3aWRnZXQgaW5zdGFuY2UuXG4gKlxuICogICAgICAgICAgICAgIEdsb2JhbENoYW5uZWwgLSBjaGFubmVsIHVzZWQgdG8gYnJvYWRjYXN0IHRoZSBpbmZvcm1hdGlvbiBhYm91dCBjcmVhdGluZyBhbmQgY2xvc2luZyBuZXcgUHJpdmF0ZUNoYW5uZWwuXG4gKlxuICogQGF1dGhvciAgICAgIE1pY2hhxYIgV8WCb2RhcmN6eWsgPG0ud2xvZGFyY3p5M0BzYW1zdW5nLmNvbT5cbiAqIEBjb3B5cmlnaHQgICBDb3B5cmlnaHQgKGMpIDIwMjMgU2Ftc3VuZyBFbGVjdHJvbmljcywgQjJCICYgQ2xvdWQgRGl2aXNpb24uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKi9cblxuaW1wb3J0IHsgY2hvb3NlTWV0aG9kIH0gZnJvbSAnLi9jaG9vc2VNZXRob2QnO1xuaW1wb3J0IHsgZGVsZXRlTG9jYWxTdG9yYWdlIH0gZnJvbSAnLi9sb2NhbHN0b3JhZ2UnO1xuaW1wb3J0IHtcbiAgICBQcml2YXRlRXZlbnRCdXNDaGFubmVsLFxuICAgIFN1YnNjcmliZWRFdmVudFR5cGVzLFxuICAgIEV2ZW50VHlwZSxcbiAgICBTdWJzY3JpYmVDYWxsYmFjayxcbiAgICBFdmVudEJ1c0NoYW5uZWxNZXNzYWdlLFxuICAgIEdsb2JhbEV2ZW50QnVzQ2hhbm5lbCxcbiAgICBHbG9iYWxDaGFubmVsUHVibGlzaFBheWxvYWQsXG4gICAgR2xvYmFsQ2hhbm5lbFN1YnNjcmliZUNhbGxiYWNrLFxuICAgIFBlbmRpbmdQcm9taXNlc1xufSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IEJyb2FkY2FzdENoYW5uZWwsIE1ldGhvZFR5cGUgfSBmcm9tICdicm9hZGNhc3QtY2hhbm5lbCc7XG5cbmNvbnN0IHBlbmRpbmdQcm9taXNlcyA9ICgoKTogUGVuZGluZ1Byb21pc2VzID0+IHtcbiAgICBjb25zdCBwcm9taXNlczogTWFwPHN0cmluZywgeyByZXNvbHZlOiBGdW5jdGlvbjsgcmVqZWN0OiBGdW5jdGlvbiB9PiA9XG4gICAgICAgIG5ldyBNYXAoKTtcblxuICAgIGNvbnN0IGluY3JlbWVudElkOiAoKSA9PiBzdHJpbmcgPSAoKCkgPT4ge1xuICAgICAgICBsZXQgaW5jcmVtZW50ID0gMDtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGluY3JlbWVudCArPSAxO1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhEYXRlLm5vdygpICsgaW5jcmVtZW50KTtcbiAgICAgICAgfTtcbiAgICB9KSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWRkKHJlc29sdmU6IEZ1bmN0aW9uLCByZWplY3Q6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBpbmNyZW1lbnRJZCgpO1xuICAgICAgICAgICAgcHJvbWlzZXMuc2V0KGtleSwgeyByZXNvbHZlLCByZWplY3QgfSk7XG4gICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlKGtleTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICAgICAgICAgIHByb21pc2VzLmdldChrZXkpPy5yZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgcHJvbWlzZXMuZGVsZXRlKGtleSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlamVjdChrZXk6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgICAgICAgICBwcm9taXNlcy5nZXQoa2V5KT8ucmVqZWN0KGRhdGEpO1xuICAgICAgICAgICAgcHJvbWlzZXMuZGVsZXRlKGtleSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IGNsYXNzIFByaXZhdGVDaGFubmVsIGltcGxlbWVudHMgUHJpdmF0ZUV2ZW50QnVzQ2hhbm5lbCB7XG4gICAgcHVibGljIGlkOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIHN1YnNjcmliZWRFdmVudFR5cGVzOiBTdWJzY3JpYmVkRXZlbnRUeXBlcztcbiAgICBwcml2YXRlIGJyb2FkY2FzdENoYW5uZWw6IEJyb2FkY2FzdENoYW5uZWw7XG5cbiAgICBwcml2YXRlIGdsb2JhbENsb3NlQ2hhbm5lbElkOiBzdHJpbmcgPSAnY2xvc2UtY2hhbm5lbC1icm9hZGNhc3Rlcic7XG4gICAgcHJpdmF0ZSBnbG9iYWxDbG9zZUNoYW5uZWw6IEdsb2JhbEV2ZW50QnVzQ2hhbm5lbDtcbiAgICBwcml2YXRlIGJyb2FkY2FzdENoYW5uZWxUeXBlOiBNZXRob2RUeXBlO1xuXG4gICAgY29uc3RydWN0b3IoY2hhbm5lbElkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5pZCA9IGNoYW5uZWxJZDtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVkRXZlbnRUeXBlcyA9IHt9O1xuXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0Q2hhbm5lbFR5cGUgPSBjaG9vc2VNZXRob2QoKTtcblxuICAgICAgICB0aGlzLmJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbCh0aGlzLmlkLCB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLmJyb2FkY2FzdENoYW5uZWxUeXBlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoYW5uZWxNZXNzYWdlSGFuZGxlcigpO1xuXG4gICAgICAgIHRoaXMuZ2xvYmFsQ2xvc2VDaGFubmVsID0gbmV3IEdsb2JhbENoYW5uZWwodGhpcy5nbG9iYWxDbG9zZUNoYW5uZWxJZCk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplR2xvYmFsQ2xvc2VDaGFubmVsKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHB1Ymxpc2hBc3luYzxUPih0eXBlOiBFdmVudFR5cGUsIHBheWxvYWQ6IFQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHVibGlzaElkID0gcGVuZGluZ1Byb21pc2VzLmFkZChyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgdGhpcy5wdWJsaXNoTWVzc2FnZTxUPih0eXBlLCBwYXlsb2FkLCBwdWJsaXNoSWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVibGlzaDxUPih0eXBlOiBFdmVudFR5cGUsIHBheWxvYWQ6IFQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoTWVzc2FnZTxUPih0eXBlLCBwYXlsb2FkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3Vic2NyaWJlKHR5cGU6IEV2ZW50VHlwZSwgY2FsbGJhY2s6IFN1YnNjcmliZUNhbGxiYWNrKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlZEV2ZW50VHlwZXNbdHlwZV0gPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5zdWJzY3JpYmUodHlwZTogRXZlbnRUeXBlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlZEV2ZW50VHlwZXNbdHlwZV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsb3NlQnJvYWRjYXN0Q2hhbm5lbCgpO1xuICAgICAgICB0aGlzLmJyb2FkY2FzdENoYW5uZWxDbG9zaW5nKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzQ2xvc2VkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsLmlzQ2xvc2VkICYmIHRoaXMuZ2xvYmFsQ2xvc2VDaGFubmVsLmlzQ2xvc2VkKClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHB1Ymxpc2hNZXNzYWdlPFQ+KFxuICAgICAgICB0eXBlOiBFdmVudFR5cGUsXG4gICAgICAgIHBheWxvYWQ6IFQsXG4gICAgICAgIHB1Ymxpc2hJZD86IHN0cmluZ1xuICAgICk6IHZvaWQge1xuICAgICAgICBjb25zdCBldmVudE1lc3NhZ2U6IEV2ZW50QnVzQ2hhbm5lbE1lc3NhZ2U8VD4gPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgICAgICB9O1xuICAgICAgICBpZiAocHVibGlzaElkKSB7XG4gICAgICAgICAgICBldmVudE1lc3NhZ2VbJ3B1Ymxpc2hJZCddID0gcHVibGlzaElkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsLnBvc3RNZXNzYWdlKGV2ZW50TWVzc2FnZSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8ZXZlbnQtYnVzPiAke3RoaXMuaWR9IGNoYW5uZWwgaGFzIGJlZW4gY2xvc2VkYCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZUdsb2JhbENsb3NlQ2hhbm5lbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5nbG9iYWxDbG9zZUNoYW5uZWwuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgICBjaGFubmVsTmFtZSxcbiAgICAgICAgICAgICAgICBraWxsQWxsXG4gICAgICAgICAgICB9OiB7XG4gICAgICAgICAgICAgICAgY2hhbm5lbE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgICAgICBraWxsQWxsPzogYm9vbGVhbjtcbiAgICAgICAgICAgIH0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGtpbGxBbGwgJiZcbiAgICAgICAgICAgICAgICAgICAgY2hhbm5lbE5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgY2hhbm5lbE5hbWUgPT09IHRoaXMuaWQgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VCcm9hZGNhc3RDaGFubmVsKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5nbG9iYWxDbG9zZUNoYW5uZWwuaXNDbG9zZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxDbG9zZUNoYW5uZWwuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsb3NlQnJvYWRjYXN0Q2hhbm5lbCgpOiB2b2lkIHtcbiAgICAgICAgLy8gQ2xvc2VzIHRoZSBwcml2YXRlIGJyb2FkY2FzdENoYW5uZWwgdXNlZCBpbiAxIHRvIDEgY29tbXVuaWNhdGlvbi5cbiAgICAgICAgaWYgKCF0aGlzLmJyb2FkY2FzdENoYW5uZWwuaXNDbG9zZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0Q2hhbm5lbC5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbG9jYWxTdG9yYWdlIG11c3QgYmUgY2xlYXJlZCBzbyB0aGF0IGl0IGRvZXMgbm90IG92ZXJmbG93IGl0cyBjYXBhY2l0eSAodGhlIGNhcGFjaXR5IG9mIGxvY2FsU3RvcmFnZSBpcyAxME1iKVxuICAgICAgICBpZiAodGhpcy5icm9hZGNhc3RDaGFubmVsVHlwZSA9PT0gJ2xvY2Fsc3RvcmFnZScpIHtcbiAgICAgICAgICAgIGRlbGV0ZUxvY2FsU3RvcmFnZSh0aGlzLmlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYnJvYWRjYXN0Q2hhbm5lbENsb3NpbmcoKTogdm9pZCB7XG4gICAgICAgIC8vIENsb3NpbmcgdGhlIGdsb2JhbENsb3NlQ2hhbm5lbCBpZiBpdCB3YXNuJ3QgY2xvc2VkIGZyb20gb25tZXNzYWdlLlxuICAgICAgICBpZiAoIXRoaXMuZ2xvYmFsQ2xvc2VDaGFubmVsLmlzQ2xvc2VkKCkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBwb3N0TWVzc2FnZSBpcyBiZWluZyBmaXJlZCBvbiB0aGUgZ2xvYmFsQ2xvc2VDaGFubmVsIHRvIGluZm9ybSBhYm91dCBjbG9zaW5nIG9mIHRoaXMgY2hhbm5lbC5cbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xvc2VDaGFubmVsLnB1Ymxpc2goe1xuICAgICAgICAgICAgICAgIGNoYW5uZWxOYW1lOiB0aGlzLmlkLFxuICAgICAgICAgICAgICAgIGtpbGxBbGw6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIENsb3NpbmcgdGhlIGdsb2JhbENsb3NlQ2hhbm5lbC5cbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xvc2VDaGFubmVsLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNoYW5uZWxNZXNzYWdlSGFuZGxlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYnJvYWRjYXN0Q2hhbm5lbCkge1xuICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsLm9ubWVzc2FnZSA9IChcbiAgICAgICAgICAgICAgICBtZXNzYWdlUGF5bG9hZDogRXZlbnRCdXNDaGFubmVsTWVzc2FnZTxhbnk+XG4gICAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobWVzc2FnZVBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyB0eXBlLCBwYXlsb2FkLCBwdWJsaXNoSWQgfSA9IG1lc3NhZ2VQYXlsb2FkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50VHlwZXNDYWxsYmFja0hhbmRsZXIodHlwZSwgcGF5bG9hZCwgcHVibGlzaElkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBldmVudFR5cGVzQ2FsbGJhY2tIYW5kbGVyKFxuICAgICAgICB0eXBlOiBFdmVudFR5cGUsXG4gICAgICAgIHBheWxvYWQ6IGFueSxcbiAgICAgICAgcHVibGlzaElkPzogc3RyaW5nXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1hcHBlZEV2ZW50ID0gdGhpcy5zdWJzY3JpYmVkRXZlbnRUeXBlc1t0eXBlXTtcbiAgICAgICAgaWYgKG1hcHBlZEV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCBtYXBwZWRFdmVudFJlcyA9IG1hcHBlZEV2ZW50KHBheWxvYWQpO1xuICAgICAgICAgICAgaWYgKHB1Ymxpc2hJZCkge1xuICAgICAgICAgICAgICAgIGlmIChtYXBwZWRFdmVudFJlcyBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwcGVkRXZlbnRSZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHBlbmRpbmdQcm9taXNlcy5yZXNvbHZlKHB1Ymxpc2hJZCwgcmVzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVuZGluZ1Byb21pc2VzLnJlamVjdChwdWJsaXNoSWQsIGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nUHJvbWlzZXMucmVzb2x2ZShwdWJsaXNoSWQsIG1hcHBlZEV2ZW50UmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHbG9iYWxDaGFubmVsIGltcGxlbWVudHMgR2xvYmFsRXZlbnRCdXNDaGFubmVsIHtcbiAgICBwdWJsaWMgaWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGJyb2FkY2FzdENoYW5uZWw6IEJyb2FkY2FzdENoYW5uZWw7XG4gICAgcHJpdmF0ZSBicm9hZGNhc3RDaGFubmVsVHlwZTogTWV0aG9kVHlwZTtcblxuICAgIGNvbnN0cnVjdG9yKGNoYW5uZWxJZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaWQgPSBjaGFubmVsSWQ7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0Q2hhbm5lbFR5cGUgPSBjaG9vc2VNZXRob2QoKTtcbiAgICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsID0gbmV3IEJyb2FkY2FzdENoYW5uZWwodGhpcy5pZCwge1xuICAgICAgICAgICAgdHlwZTogdGhpcy5icm9hZGNhc3RDaGFubmVsVHlwZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHVibGlzaChwYXlsb2FkOiBHbG9iYWxDaGFubmVsUHVibGlzaFBheWxvYWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQ2xvc2VkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0Q2hhbm5lbC5wb3N0TWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdWJzY3JpYmUoY2FsbGJhY2s6IEdsb2JhbENoYW5uZWxTdWJzY3JpYmVDYWxsYmFjayk6IHZvaWQge1xuICAgICAgICB0aGlzLmJyb2FkY2FzdENoYW5uZWwub25tZXNzYWdlID0gKHtcbiAgICAgICAgICAgIGNoYW5uZWxOYW1lLFxuICAgICAgICAgICAga2lsbEFsbFxuICAgICAgICB9OiBHbG9iYWxDaGFubmVsUHVibGlzaFBheWxvYWQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHsgY2hhbm5lbE5hbWUsIGtpbGxBbGwgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGNsb3NlKCkge1xuICAgICAgICB0aGlzLmJyb2FkY2FzdENoYW5uZWwuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNDbG9zZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJyb2FkY2FzdENoYW5uZWwuaXNDbG9zZWQ7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBAZmlsZSBjaG9vc2VNZXRob2QudHNcbiAqIEBhdXRob3IgUGF3ZcWCIEt1YmFsYSA8cC5rdWJhbGFAc2Ftc3VuZy5jb20+XG4gKiBAZGF0ZSAyMDIzLTA4LTI5IFxuICogQGNvcHlyaWdodCAgIENvcHlyaWdodCAoYykgMjAyMyBTYW1zdW5nIEVsZWN0cm9uaWNzLCBCMkIgJiBDbG91ZCBEaXZpc2lvbi4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIEBkZXNjcmlwdGlvbiB1dGlsaXR5IGZ1bmN0aW9uIHRvIGNob29zZSB0aGUgdHlwZSBvZiBtZXRob2QgdG8gdXNlIGZyb20gYnJvYWRjYXN0LWNoYW5uZWwgcGFja2FnZS5cbiAqIERlZmF1bHRzIHRvICduYXRpdmUnIGZvciBicm93c2VyL2FuZHJvaWQgYW5kICdsb2NhbHN0b3JhZ2UnIGZvciB0aXplbiBkZXZpY2VzLlxuICovXG5cbmltcG9ydCB0eXBlIHsgTWV0aG9kVHlwZSB9IGZyb20gJ2Jyb2FkY2FzdC1jaGFubmVsJztcblxuZXhwb3J0IGNvbnN0IGNob29zZU1ldGhvZDogKCkgPT4gTWV0aG9kVHlwZSA9ICgpID0+IHtcbiAgICAvLyBpZiB3ZSBjYW4gdXNlIG5hdGl2ZSBCcm9hZGNhc3RDaGFubmVsLCB0aGVuIGxldCdzIHVzZSBpdFxuICAgIGlmIChcbiAgICAgICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgdHlwZW9mIEJyb2FkY2FzdENoYW5uZWwgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgIXdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdUaXplbicpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiAnbmF0aXZlJztcbiAgICB9XG5cbiAgICByZXR1cm4gJ2xvY2Fsc3RvcmFnZSc7XG59O1xuIiwiLyoqXG4gKiBAZmlsZSBsb2NhbHN0b3JhZ2UudHNcbiAqIEBhdXRob3IgUGF3ZcWCIEt1YmFsYSA8cC5rdWJhbGFAc2Ftc3VuZy5jb20+XG4gKiBAZGF0ZSAyMDIzLTA4LTI5XG4gKiBAY29weXJpZ2h0ICAgQ29weXJpZ2h0IChjKSAyMDIzIFNhbXN1bmcgRWxlY3Ryb25pY3MsIEIyQiAmIENsb3VkIERpdmlzaW9uLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogQGRlc2NyaXB0aW9uIGZpbGUgd2l0aCBmdW5jdGlvbiB0byBkZWxldGUgbG9jYWxTdG9yYWdlIGRhdGEgZm9yIGdpdmVuIGNoYW5uZWwgXG4gKi9cblxuXG5jb25zdCBnZXRMb2NhbFN0b3JhZ2VOYW1lRm9ySWQgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGxvY2FsU3RvcmFnZUtleXMgPSBPYmplY3Qua2V5cyh3aW5kb3cubG9jYWxTdG9yYWdlKTtcblxuICAgIGNvbnN0IGtleU5hbWVXaXRoSWQgPSBsb2NhbFN0b3JhZ2VLZXlzLmZpbmQoKGtleSkgPT4ga2V5LmluY2x1ZGVzKGlkKSk7XG5cbiAgICBpZiAoIWtleU5hbWVXaXRoSWQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgZ2V0TG9jYWxTdG9yYWdlTmFtZUZvcklkIC0gTm8ga2V5IHdpdGggdGhpcyBuYW1lOiAke2lkfWApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5TmFtZVdpdGhJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBkZWxldGVMb2NhbFN0b3JhZ2UgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGxvY2FsU3RvcmFnZUtleSA9IGdldExvY2FsU3RvcmFnZU5hbWVGb3JJZChpZCk7XG5cbiAgICBpZiAoIWxvY2FsU3RvcmFnZUtleSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBkZWxldGVMb2NhbFN0b3JhZ2UgLSBObyBrZXkgd2l0aCB0aGlzIG5hbWU6ICR7aWR9YCk7XG4gICAgICAgIGNvbnN0IGxvY2FsU3RvcmFnZUtleXMgPSBPYmplY3Qua2V5cyh3aW5kb3cubG9jYWxTdG9yYWdlKTtcbiAgICAgICAgY29uc3QgY29uY2F0ZW5hdGVkS2V5cyA9IGxvY2FsU3RvcmFnZUtleXMuam9pbignLCcpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGBkZWxldGVMb2NhbFN0b3JhZ2UgLSBTdG9yZWQga2V5czogJHtjb25jYXRlbmF0ZWRLZXlzfWApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGxvY2FsU3RvcmFnZUtleSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qKlxuICogQGZpbGUgICAgICAgIGNvbnRhaW5zIGFuIGltcGxlbWVudGF0aW9uIG9mIHRoZSBFdmVudCBCdXMgb2JqZWN0IHdoaWNoIG9yZ2FuaXplcyB0aGUgV2lORSBBUEkgY29tbXVuaWNhdGlvbiBjaGFubmVscy5cbiAqICAgICAgICAgICAgICBFeHBvc2VzIDMgZGlmZmVyZW50IG1ldGhvZHM6XG4gKlxuICogICAgICAgICAgICAgIEBwYXJhbSBwcml2YXRlQ2hhbm5lbElkIC0gaWQgZm9yIHRoZSBuZXcgY2hhbm5lbCwgdXNlZCB0byBkaWZmZXJlbnRpYXRlIGl0IGJldHdlZW4gb3RoZXIgcHJpdmF0ZVxuICogICAgICAgICAgICAgIGNoYW5uZWxzLlxuICogICAgICAgICAgICAgIEByZXR1cm4gbmV3IFByaXZhdGVDaGFubmVsIG9iamVjdCB3aXRoIHRoZSBwcm92aWRlZCBpZC5cbiAqICAgICAgICAgICAgICBjcmVhdGVDaGFubmVsKHByaXZhdGVDaGFubmVsSWQpXG4gKlxuICogICAgICAgICAgICAgIEBwYXJhbSBjaGFubmVsSWQgLSBpZCBvZiB0aGUgY2hhbm5lbCB0byBiZSBjbG9zZWRcbiAqICAgICAgICAgICAgICBjbG9zZUNoYW5uZWwoY2hhbm5lbElkKVxuICpcbiAqICAgICAgICAgICAgICBAcGFyYW0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvbiB3aGljaCBpcyBnb2luZyB0byBiZSBleGVjdHVlZCB3aGVuIGEgbmV3IGNoYW5uZWwgaXMgYmVpbmcgY3JlYXRlZFxuICogICAgICAgICAgICAgIEByZXR1cm5zIG5ldyBHbG9iYWxDaGFubmVsIG9iamVjdCBzdWJzY3JpYmVkIHRvIHRoZSBDaGFubmVsT3BlbmVkIGV2ZW50ICh1c2VkIHRvIGJyb2FkY2FzdCB0aGVcbiAqICAgICAgICAgICAgICBpbmZvcm1hdGlvbiBhYm91dCBuZXdseSBjcmVhdGVkIGNoYW5uZWxzKSB3aXRoIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAqICAgICAgICAgICAgICBvbkNoYW5uZWxPcGVuKGNhbGxiYWNrKVxuICpcbiAqIEBhdXRob3IgICAgICBNaWNoYcWCIFfFgm9kYXJjenlrIDxtLndsb2RhcmN6eTNAc2Ftc3VuZy5jb20+XG4gKiBAY29weXJpZ2h0ICAgQ29weXJpZ2h0IChjKSAyMDIzIFNhbXN1bmcgRWxlY3Ryb25pY3MsIEIyQiAmIENsb3VkIERpdmlzaW9uLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICovXG5cbmltcG9ydCB7IFByaXZhdGVDaGFubmVsLCBHbG9iYWxDaGFubmVsIH0gZnJvbSAnLi9jaGFubmVscyc7XG5pbXBvcnQge1xuICAgIEV2ZW50QnVzSW50ZXJmYWNlLFxuICAgIEdsb2JhbEV2ZW50QnVzQ2hhbm5lbCxcbiAgICBPbkNoYW5uZWxDbG9zZUNhbGxiYWNrLFxuICAgIE9uQ2hhbm5lbE9wZW5DYWxsYmFjayxcbiAgICBQcml2YXRlRXZlbnRCdXNDaGFubmVsXG59IGZyb20gJy4vdHlwZXMnO1xuXG5kZWNsYXJlIGNvbnN0IHdpbmRvdzogV2luZG93ICZcbiAgICB0eXBlb2YgZ2xvYmFsVGhpcyAmIHtcbiAgICAgICAgJHZ4dFN1YkNoYW5uZWxJZDogc3RyaW5nO1xuICAgIH07XG5cbmV4cG9ydCBjbGFzcyBFdmVudEJ1cyBpbXBsZW1lbnRzIEV2ZW50QnVzSW50ZXJmYWNlIHtcbiAgICBwcml2YXRlIGdsb2JhbE9wZW5DaGFubmVsSWQ6IHN0cmluZztcbiAgICBwcml2YXRlIGdsb2JhbE9wZW5DaGFubmVsOiBHbG9iYWxDaGFubmVsO1xuXG4gICAgcHJpdmF0ZSBnbG9iYWxDbG9zZUNoYW5uZWxJZDogc3RyaW5nID0gJ2Nsb3NlLWNoYW5uZWwtYnJvYWRjYXN0ZXInO1xuICAgIHByaXZhdGUgZ2xvYmFsQ2xvc2VDaGFubmVsOiBHbG9iYWxDaGFubmVsO1xuXG4gICAgY29uc3RydWN0b3IoZ2xvYmFsQ2hhbm5lbElkOiBzdHJpbmcgPSAnQ2hhbm5lbE9wZW5lZCcpIHtcbiAgICAgICAgdGhpcy5nbG9iYWxPcGVuQ2hhbm5lbElkID0gZ2xvYmFsQ2hhbm5lbElkO1xuICAgICAgICB0aGlzLmdsb2JhbE9wZW5DaGFubmVsID0gbmV3IEdsb2JhbENoYW5uZWwodGhpcy5nbG9iYWxPcGVuQ2hhbm5lbElkKTtcbiAgICAgICAgdGhpcy5nbG9iYWxDbG9zZUNoYW5uZWwgPSBuZXcgR2xvYmFsQ2hhbm5lbCh0aGlzLmdsb2JhbENsb3NlQ2hhbm5lbElkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlQ2hhbm5lbChwcml2YXRlQ2hhbm5lbElkOiBzdHJpbmcpOiBQcml2YXRlQ2hhbm5lbCB7XG4gICAgICAgIGNvbnN0IGNyZWF0ZWRDaGFubmVsID0gbmV3IFByaXZhdGVDaGFubmVsKHByaXZhdGVDaGFubmVsSWQpO1xuICAgICAgICB0aGlzLmdsb2JhbE9wZW5DaGFubmVsLnB1Ymxpc2goeyBjaGFubmVsTmFtZTogY3JlYXRlZENoYW5uZWwuaWQgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZWRDaGFubmVsO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbG9zZUNoYW5uZWwoY2hhbm5lbE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmdsb2JhbENsb3NlQ2hhbm5lbC5wdWJsaXNoKHsgY2hhbm5lbE5hbWUsIGtpbGxBbGw6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uQ2hhbm5lbE9wZW4oY2FsbGJhY2s6IE9uQ2hhbm5lbE9wZW5DYWxsYmFjayk6IEdsb2JhbENoYW5uZWwge1xuICAgICAgICBjb25zdCBvcGVuQ2hhbm5lbEJyb2FkY2FzdENoYW5uZWwgPSBuZXcgR2xvYmFsQ2hhbm5lbChcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsT3BlbkNoYW5uZWxJZFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjcmVhdGVOZXdDaGFubmVsQ2FsbGJhY2sgPSAoe1xuICAgICAgICAgICAgY2hhbm5lbE5hbWVcbiAgICAgICAgfToge1xuICAgICAgICAgICAgY2hhbm5lbE5hbWU6IHN0cmluZztcbiAgICAgICAgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHsgaWQ6IGNoYW5uZWxOYW1lIH0pO1xuICAgICAgICB9O1xuICAgICAgICBvcGVuQ2hhbm5lbEJyb2FkY2FzdENoYW5uZWwuc3Vic2NyaWJlKGNyZWF0ZU5ld0NoYW5uZWxDYWxsYmFjayk7XG4gICAgICAgIHJldHVybiBvcGVuQ2hhbm5lbEJyb2FkY2FzdENoYW5uZWw7XG4gICAgfVxuXG4gICAgcHVibGljIG9uQ2hhbm5lbENsb3NlKGNhbGxiYWNrOiBPbkNoYW5uZWxDbG9zZUNhbGxiYWNrKTogR2xvYmFsQ2hhbm5lbCB7XG4gICAgICAgIGNvbnN0IGNsb3NlQ2hhbm5lbEJyb2FkY2FzdENoYW5uZWwgPSBuZXcgR2xvYmFsQ2hhbm5lbChcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsQ2xvc2VDaGFubmVsSWRcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxDYWxsYmFjayA9ICh7XG4gICAgICAgICAgICBjaGFubmVsTmFtZSxcbiAgICAgICAgICAgIGtpbGxBbGxcbiAgICAgICAgfToge1xuICAgICAgICAgICAgY2hhbm5lbE5hbWU6IHN0cmluZztcbiAgICAgICAgICAgIGtpbGxBbGw/OiBib29sZWFuO1xuICAgICAgICB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIWtpbGxBbGwpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjaGFubmVsTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNsb3NlQ2hhbm5lbEJyb2FkY2FzdENoYW5uZWwuc3Vic2NyaWJlKGludGVybmFsQ2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gY2xvc2VDaGFubmVsQnJvYWRjYXN0Q2hhbm5lbDtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEdsb2JhbEV2ZW50QnVzQ2hhbm5lbCwgUHJpdmF0ZUV2ZW50QnVzQ2hhbm5lbCB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9