import LazyValue from './LazyValue';
import Bounce from '../async/Bounce';

var nu = function (baseFn) {
  var get = function(callback) {
    baseFn(Bounce.bounce(callback));
  };

  /** map :: this Future a -> (a -> b) -> Future b */
  var map = function (fab) {
    return nu(function (callback) {
      get(function (a) {
        var value = fab(a);
        callback(value);
      });
    });
  };

  /** bind :: this Future a -> (a -> Future b) -> Future b */
  var bind = function (aFutureB) {
    return nu(function (callback) {
      get(function (a) {
        aFutureB(a).get(callback);
      });
    });
  };

  /** anonBind :: this Future a -> Future b -> Future b
   *  Returns a future, which evaluates the first future, ignores the result, then evaluates the second.
   */
  var anonBind = function (futureB) {
    return nu(function (callback) {
      get(function (a) {
        futureB.get(callback);
      });
    });
  };

  var toLazy = function () {
    return LazyValue.nu(get);
  };

  return {
    map: map,
    bind: bind,
    anonBind: anonBind,
    toLazy: toLazy,
    get: get
  };

};

/** a -> Future a */
var pure = function (a) {
  return nu(function (callback) {
    callback(a);
  });
};

export default <any> {
  nu: nu,
  pure: pure
};