// Generated by CoffeeScript 1.7.1
(function() {
  require(['pinball_wizard'], function(pinball) {
    beforeEach(function() {
      pinball.debug();
      return pinball.reset();
    });
    describe('initialize', function() {
      return it('is defined', function() {
        return expect(pinball).toBeDefined();
      });
    });
    describe('#reset', function() {
      return it('removes all features', function() {
        pinball.add({
          a: 'active'
        });
        pinball.reset();
        return expect(pinball.state()).toEqual({});
      });
    });
    describe('#add', function() {
      it('activates if active', function() {
        pinball.add({
          a: 'active'
        });
        return expect(pinball.isActive('a')).toEqual(true);
      });
      it('does not activate if inactive', function() {
        pinball.add({
          a: 'inactive'
        });
        return expect(pinball.isActive('a')).toEqual(false);
      });
      it('does not activate if disabled', function() {
        pinball.add({
          a: 'disabled: reason'
        });
        return expect(pinball.isActive('a')).toEqual(false);
      });
      return describe('with a url param', function() {
        var originalPathname;
        originalPathname = null;
        beforeEach(function() {
          return originalPathname = window.location.pathname;
        });
        afterEach(function() {
          return window.history.replaceState(null, null, originalPathname);
        });
        it('is not active when mismatched', function() {
          var urlParam;
          urlParam = '?pinball_foo';
          window.history.replaceState(null, null, window.location.pathname + urlParam);
          pinball.add({
            a: 'inactive'
          });
          return expect(pinball.isActive('a')).toEqual(false);
        });
        return it('is active with a matching url param', function() {
          var urlParam;
          urlParam = '?pinball_a';
          window.history.replaceState(null, null, window.location.pathname + urlParam);
          pinball.add({
            a: 'inactive'
          });
          return expect(pinball.isActive('a')).toEqual(true);
        });
      });
    });
    describe('#state', function() {
      return it('displays a list based on state', function() {
        pinball.add({
          a: 'active',
          b: 'inactive',
          c: 'disabled: reason'
        });
        return expect(pinball.state()).toEqual({
          a: 'active',
          b: 'inactive',
          c: 'disabled: reason'
        });
      });
    });
    describe('#activate', function() {
      it('makes an inactive feature active', function() {
        pinball.add({
          a: 'inactive'
        });
        pinball.activate('a');
        return expect(pinball.get('a')).toEqual('inactive');
      });
      return it('does not make a disabled feature active', function() {
        pinball.add({
          a: 'disabled'
        });
        pinball.activate('a');
        return expect(pinball.get('a')).toEqual('disabled');
      });
    });
    describe('#deactivate', function() {
      return it('makes an active feature inactive', function() {
        pinball.add({
          a: 'active'
        });
        pinball.deactivate('a');
        return expect(pinball.get('a')).toEqual('inactive');
      });
    });
    describe('#isActive', function() {
      beforeEach(function() {
        return pinball.add({
          a: 'inactive'
        });
      });
      return it('is true after activating', function() {
        pinball.activate('a');
        return expect(pinball.isActive('a')).toEqual(true);
      });
    });
    describe('#subscribe', function() {
      var callback;
      callback = null;
      beforeEach(function() {
        return callback = jasmine.createSpy('callback');
      });
      describe('when the activate callback should be called', function() {
        it('calls after activating', function() {
          pinball.add({
            a: 'inactive'
          });
          pinball.subscribe('a', callback);
          pinball.activate('a');
          return expect(callback).toHaveBeenCalled();
        });
        it('calls it once on multiple activations', function() {
          pinball.add({
            a: 'inactive'
          });
          pinball.subscribe('a', callback);
          pinball.activate('a');
          pinball.activate('a');
          pinball.activate('a');
          return expect(callback.calls.count()).toEqual(1);
        });
        it('calls it twice when toggling activations', function() {
          pinball.add({
            a: 'inactive'
          });
          pinball.subscribe('a', callback);
          pinball.activate('a');
          pinball.deactivate('a');
          pinball.activate('a');
          return expect(callback.calls.count()).toEqual(2);
        });
        it('calls when subscribing then adding and then activating a feature', function() {
          pinball.subscribe('a', callback);
          pinball.add({
            a: 'inactive'
          });
          pinball.activate('a');
          return expect(callback).toHaveBeenCalled();
        });
        return it('calls when subscribing to an already active feature', function() {
          pinball.add({
            a: 'active'
          });
          pinball.subscribe('a', callback);
          return expect(callback).toHaveBeenCalled();
        });
      });
      describe('when the activate callback should not be called', function() {
        it('does not call when the feature is missing', function() {
          pinball.subscribe('a', callback);
          pinball.activate('a');
          return expect(callback).not.toHaveBeenCalled();
        });
        return it('does not call when the feature is disabled', function() {
          pinball.add({
            a: 'disabled: reason'
          });
          pinball.subscribe('a', callback);
          pinball.activate('a');
          return expect(callback).not.toHaveBeenCalled();
        });
      });
      describe('when the deactivate callback should be called', function() {
        it('calls after deactivate', function() {
          pinball.add({
            a: 'inactive'
          });
          pinball.subscribe('a', null, callback);
          pinball.activate('a');
          pinball.deactivate('a');
          return expect(callback).toHaveBeenCalled();
        });
        it('calls it once on multiple deactivations', function() {
          pinball.add({
            a: 'inactive'
          });
          pinball.subscribe('a', null, callback);
          pinball.activate('a');
          pinball.deactivate('a');
          pinball.deactivate('a');
          return expect(callback.calls.count()).toEqual(1);
        });
        it('calls it twice when toggling deactivations', function() {
          pinball.add({
            a: 'inactive'
          });
          pinball.subscribe('a', null, callback);
          pinball.activate('a');
          pinball.deactivate('a');
          pinball.activate('a');
          pinball.deactivate('a');
          return expect(callback.calls.count()).toEqual(2);
        });
        it('calls when subscribing, adding adding an active then deactivating', function() {
          pinball.subscribe('a', null, callback);
          pinball.add({
            a: 'active'
          });
          pinball.deactivate('a');
          return expect(callback).toHaveBeenCalled();
        });
        return it('calls when subscribing then adding and then deactivating a feature', function() {
          pinball.subscribe('a', null, callback);
          pinball.add({
            a: 'inactive'
          });
          pinball.activate('a');
          pinball.deactivate('a');
          return expect(callback).toHaveBeenCalled();
        });
      });
      describe('when the deactivate callback should not be called', function() {
        return it('does not call when subscribing then adding an active feature', function() {
          pinball.subscribe('a', null, callback);
          pinball.add({
            a: 'active'
          });
          return expect(callback).not.toHaveBeenCalled();
        });
      });
      it('does not call when the feature is missing', function() {
        pinball.subscribe('a', null, callback);
        pinball.activate('a');
        pinball.deactivate('a');
        return expect(callback).not.toHaveBeenCalled();
      });
      return it('does not call when the feature is disabled', function() {
        pinball.add({
          a: 'disabled'
        });
        pinball.subscribe('a', null, callback);
        pinball.activate('a');
        pinball.deactivate('a');
        return expect(callback).not.toHaveBeenCalled();
      });
    });
    describe('#push', function() {
      return it('calls the function with the first entry and the args for the rest', function() {
        spyOn(pinball, 'activate');
        pinball.push(['activate', 'my-feature']);
        return expect(pinball.activate).toHaveBeenCalledWith('my-feature');
      });
    });
    return jasmine.getEnv().execute();
  });

}).call(this);

//# sourceMappingURL=pinball_wizard_spec.map
