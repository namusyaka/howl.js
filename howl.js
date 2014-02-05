//     Howl.js 0.0.1
//     (c) namusyaka
//     Howl is free software distributed under the MIT license.

var Howl = (function(global) {
  var Howl = function() {
    return (this instanceof Howl) ? this.init() : new Howl();
  };

  (function(prototype) {

    prototype.init = function() {
      this.routes = [];
      this.isCompiled = false;
      return this;
    };

    prototype.call = function(path) {
      var route = this.recognize(path);
      return route ? route.callback.apply(this, route.params) : null;
    };

    prototype.recognize = function(path) {
      if(!this.isCompiled)
        this.compile();
      var matchArray = this.compiledToken.exec(path);
      if(matchArray instanceof Array) {
        matchArray.shift();
        for(var i = 0; i < matchArray.length; ++i)
          if(matchArray[i]) {
            var route = this.routes[i];
            return route.match(path) ? route : null;
          }
      }
      return null;
    };

    // ref: https://github.com/jashkenas/backbone/blob/master/backbone.js#L1224-L1227
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(:\w+)/g;
    var splatParam = /\*\w*/g;
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    var groupRegExp = /\((\[\^\?\]\*\?|\[\^\/\?\]\+)\)/g

    prototype.compile = function() {
      var concatenatedRegExp = [];
      for(var i = 0, route; route = this.routes[i]; ++i) {
        var serializablePath = route.path.replace(groupRegExp, '$1');
        concatenatedRegExp.push('^(' + serializablePath + ')$');
      }
      this.compiledToken = new RegExp(concatenatedRegExp.join('|'));
      this.isCompiled = true;
      return this;
    };

    var Route = function() {
      this.conditions = [];
      this.captures   = [];
      this.path = this.callback = null;
      this.initParams();
      return this;
    };

    Route.prototype = {
      match : function(path) {
        var matchData = path.match(this.toRegExp());
        if(!(matchData instanceof Array))
          return false;

        this.initParams();
        matchData.shift();

        for(var i = 0, data, condition; i < matchData.length; ++i) {
          data = decodeURIComponent(matchData[i]);
          condition = this.conditions[i];
          if(condition && !condition.test(data))
            return false;
          else
            this.params.push(data);
        }
        return matchData;
      },

      toRegExp : function() {
        return (this.regexpPath || (this.regexpPath = new RegExp('^' + this.path + '$')));
      },

      to : function(func) {
        this.callback = func;
        return this;
      },

      initParams : function() { this.params = []; }
    };

    Howl.Route = Route;

    function compilePath(path, options, callback) {
      var route = new Route();
      var path = path.replace(escapeRegExp, '\\$&')
                     .replace(optionalParam, '(?:$1)?')
                     .replace(namedParam, function(match, name) {
                       name = name.substr(1);
                       route.conditions.push(options[name] || null);
                       route.captures.push(name);
                       return '([^/?]+)';
                     })
                     .replace(splatParam, '([^?]*?)');
      route.path = path;
      return route;
    }

    prototype.on = function(path, options, callback) {
      if(typeof options === 'function')
        var callback = options, options = {};
      var signature = compilePath(path, options);
      signature.callback = callback;
      this.routes.push(signature);
      return signature;
    };

  })(Howl.prototype);
  
  Howl.map = function(func) {
    var howl = new Howl();
    func(howl);
    return howl;
  };

  return Howl;

})(this);
