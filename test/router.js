$(document).ready(function() {

  module('Router');

  test('map', function() {
    var result = Howl.map(function(router) {
      router.on('/test', function() { return 'hello world'; });
    });
    equal((result instanceof Howl), true, 'should be an instance of Howl');
  });

  test('constructor', function() {
    equal(Howl() instanceof Howl, true, 'should construct without `new`');
  });

  test('#on', function() {
    var howl = new Howl(), i;
    var foo = howl.on('/foo/:bar', function() {});
    equal((foo instanceof Howl.Route), true, 'should be an instance of Howl.Route');
  });

  test('#compile', function() {
    var howl = new Howl();
    howl.on('/foo/:test', function() {});
    howl.on('/bar/:test', function() {});
    howl.on('/baz/:test', function() {});
    equal(howl.isCompiled, false, 'should set false to #isCompiled');
    howl.compile();
    equal(howl.isCompiled, true, 'should set true to #isCompiled');
    equal(!!howl.compiledToken, true, 'should generate #compiledToken');
  });

  test('#recognize', function() {
    var howl = new Howl(), routes = [];
    routes[routes.length] = howl.on('/foo/:test', function() { return 'foo' });
    routes[routes.length] = howl.on('/a/:b/c/:d', function(b, d) { return 'a' + b + 'c' + d });
    routes[routes.length] = howl.on('/bar/:baz', { baz : /^\d+$/ }, function(baz) { return baz });
    routes[routes.length] = howl.on('/test/:text', function(text) { return text });
    routes[routes.length] = howl.on('/params/:params', { params : /^あいうえお$/ }, function(params) { return params });
    routes[routes.length] = howl.on('/params2/:params', { params : /^%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A$/ }, function(params) { return params });
    routes[routes.length] = howl.on('/splat/*', function(splat) { return splat });
    equal(howl.recognize('/foo/test') === routes[0], true, 'should recognize correct route');
    equal(howl.recognize('/a/b/c/d') === routes[1], true, 'should recognize correct route if defined multiple captures');
    equal(howl.recognize('/bar/123') === routes[2], true, 'should recognize correct route if defined a filter');
    equal(howl.recognize('/bar/baz') === null, true, 'should not recognize correct route if parameter do not match the filter');
    equal(howl.recognize('/foo/test/test2') === null, true, 'should return `null` if cannot recognize');
    equal(howl.recognize('/test/%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A').callback(routes[3].params), 'あいうえお', 'should decode values if value was encoded')
    equal(howl.recognize('/params/%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A').callback(routes[4].params), 'あいうえお', 'should match decoded value');
    equal(howl.recognize('/params2/%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A') === null, true, 'should not match encoded value');
    equal(howl.recognize('/splat/hello/world').callback(routes[6].params), 'hello/world', 'should support splat style');
  });

  test('#call', function() {
    var howl = new Howl();
    howl.on('/foo/:bar/:baz', { bar : /asdf/, baz : /^ghjk$/ }, function(bar, baz) {
      return 'bar : ' + bar + ', baz : ' + baz;
    });
    equal(howl.call('/foo/asdf/ghjk'), 'bar : asdf, baz : ghjk', "Returned value should be callback's returned value")
    equal(howl.call('/foo/bar/baz'), null, "Returned value should be callback's returned value if cannot recognize")
  });
});
