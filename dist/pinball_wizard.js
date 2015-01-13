(function() {
  'use strict';
  var __slice = [].slice;

  define(function() {
    var activate, add, addCSSClassName, cssClassName, deactivate, debug, exports, features, get, isActive, logPrefix, push, removeCSSClassName, reset, showLog, state, subscribe, subscribers, update, urlValues, _buildSubscriber, _log, _notifySubscriberOnActivate, _notifySubscribersOnActivate, _notifySubscribersOnDeactivate, _urlValueMatches, _urlValues;
    features = {};
    subscribers = {};
    showLog = false;
    logPrefix = '[PinballWizard]';
    _log = function() {
      var args, message;
      message = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (showLog && window.console && window.console.log) {
        console.log.apply(console, ["" + logPrefix + " " + message].concat(__slice.call(args)));
      }
    };
    _notifySubscribersOnActivate = function(name) {
      var subscriber, _i, _len, _ref, _results;
      if (subscribers[name] == null) {
        subscribers[name] = [];
      }
      _ref = subscribers[name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subscriber = _ref[_i];
        _results.push(_notifySubscriberOnActivate(subscriber, name));
      }
      return _results;
    };
    _notifySubscriberOnActivate = function(subscriber, name) {
      _log('Notify subscriber that %s is active', name);
      return subscriber.onActivate();
    };
    _notifySubscribersOnDeactivate = function(name) {
      var subscriber, _i, _len, _ref, _results;
      if (subscribers[name] == null) {
        subscribers[name] = [];
      }
      _ref = subscribers[name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subscriber = _ref[_i];
        _results.push(subscriber.onDeactivate());
      }
      return _results;
    };
    _urlValueMatches = function(value) {
      var v, _i, _len, _ref;
      _ref = _urlValues();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (value === v) {
          return true;
        }
      }
      return false;
    };
    _urlValues = function(search) {
      var key, pair, pairs, value, _i, _len, _ref;
      if (search == null) {
        search = window.location.search;
      }
      pairs = search.substr(1).split('&');
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        pair = pairs[_i];
        _ref = pair.split('='), key = _ref[0], value = _ref[1];
        if (key === 'pinball' && (value != null)) {
          return value.split(',');
        }
      }
      return [];
    };
    urlValues = _urlValues();
    cssClassName = function(name, prefix) {
      if (prefix == null) {
        prefix = 'use-';
      }
      return prefix + name.split('_').join('-');
    };
    addCSSClassName = function(name, ele) {
      var cN;
      if (ele == null) {
        ele = document.documentElement;
      }
      cN = cssClassName(name);
      if (ele.className.indexOf(cN) < 0) {
        return ele.className += ' ' + cN;
      }
    };
    removeCSSClassName = function(name, ele) {
      var cN;
      if (ele == null) {
        ele = document.documentElement;
      }
      cN = cssClassName(name);
      if (ele.className.indexOf(cN) >= 0) {
        return ele.className = ele.className.replace(cN, '');
      }
    };
    add = function(list) {
      var name, state, _results;
      _results = [];
      for (name in list) {
        state = list[name];
        features[name] = state;
        _log("Added %s: %s.", name, state);
        if (isActive(name)) {
          _results.push(activate(name, "automatic. added as '" + state + "'"));
        } else if (_urlValueMatches(name, urlValues)) {
          _results.push(activate(name, 'URL'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    get = function(name) {
      return features[name];
    };
    update = function(name, state) {
      return features[name] = state;
    };
    activate = function(name, sourceName) {
      var source, state;
      if (sourceName == null) {
        sourceName = null;
      }
      state = get(name);
      source = sourceName != null ? " (source: " + sourceName + ")" : '';
      switch (state) {
        case void 0:
          return _log("Attempted to activate %s, but it was not found%s.", name, source);
        case 'inactive':
          _log("Activate %s%s.", name, source);
          update(name, 'active');
          addCSSClassName(name);
          return _notifySubscribersOnActivate(name);
        case 'active':
          return _log("Attempted to activate %s, but it is already active%s.", name, source);
        default:
          return _log("Attempted to activate %s, but it is %s%s.", name, state, source);
      }
    };
    deactivate = function(name, source) {
      var state;
      if (source == null) {
        source = null;
      }
      state = get(name);
      source = typeof sourceName !== "undefined" && sourceName !== null ? " (source: " + sourceName + ")" : '';
      switch (state) {
        case void 0:
          return _log("Attempted to deactivate %s, but it was not found%s.", name, source);
        case 'active':
          _log("Dectivate %s%s.", name, source);
          update(name, 'inactive');
          removeCSSClassName(name);
          return _notifySubscribersOnDeactivate(name);
        default:
          return _log("Attempted to deactivate %s, but it is %s%s.", name, state, source);
      }
    };
    isActive = function(name) {
      return get(name) === 'active';
    };
    _buildSubscriber = function(onActivate, onDeactivate) {
      return {
        onActivate: onActivate != null ? onActivate : function() {},
        onDeactivate: onDeactivate != null ? onDeactivate : function() {}
      };
    };
    subscribe = function(name, onActivate, onDeactivate) {
      var subscriber;
      _log('Added subscriber to %s', name);
      subscriber = _buildSubscriber(onActivate, onDeactivate);
      if (subscribers[name] == null) {
        subscribers[name] = [];
      }
      subscribers[name].push(subscriber);
      if (isActive(name)) {
        return _notifySubscriberOnActivate(subscriber, name);
      }
    };
    push = function(params) {
      var method;
      method = params.shift();
      return this[method].apply(this, params);
    };
    state = function() {
      return features;
    };
    reset = function() {
      return features = {};
    };
    debug = function() {
      return showLog = true;
    };
    exports = {
      add: add,
      get: get,
      activate: activate,
      deactivate: deactivate,
      isActive: isActive,
      subscribe: subscribe,
      push: push,
      state: state,
      reset: reset,
      debug: debug,
      cssClassName: cssClassName,
      addCSSClassName: addCSSClassName,
      removeCSSClassName: removeCSSClassName,
      _urlValues: _urlValues
    };
    if (typeof window !== "undefined" && window !== null ? window.pinball : void 0) {
      if (_urlValueMatches('debug')) {
        debug();
      }
      while (window.pinball.length) {
        exports.push(window.pinball.shift());
      }
      window.pinball = exports;
    }
    return exports;
  });

}).call(this);
