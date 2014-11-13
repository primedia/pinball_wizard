// Generated by CoffeeScript 1.7.1
(function() {
  define(function() {
    return function(ele, pinballQueue, searchQuery) {
      var add, classNames, entry, feature, featureNames, matches, state, _i, _j, _len, _len1, _ref;
      classNames = [];
      add = function(name) {
        return classNames.push('use-' + name.split('_').join('-'));
      };
      for (_i = 0, _len = pinballQueue.length; _i < _len; _i++) {
        entry = pinballQueue[_i];
        if (!entry.length) {
          continue;
        }
        switch (entry[0]) {
          case 'activate':
            add(entry[1]);
            break;
          case 'add':
            _ref = entry[1];
            for (feature in _ref) {
              state = _ref[feature];
              if (state === 'active') {
                add(feature);
              }
            }
        }
      }
      matches = searchQuery.match(/pinball=([a-z-_,]+)/i);
      if (matches && matches.length > 1) {
        featureNames = (matches[1] + '').split(',');
        for (_j = 0, _len1 = featureNames.length; _j < _len1; _j++) {
          feature = featureNames[_j];
          add(feature);
        }
      }
      if (ele) {
        ele.className += classNames.join(' ');
      }
    };
  });

}).call(this);

//# sourceMappingURL=css_tagger.map
