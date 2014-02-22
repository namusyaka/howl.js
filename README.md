# Howl.js

Howl.js is a simple path router for use in client side

## Usage

### Class methods

#### `Howl.map`

```javascript
var router = Howl.map(function(router) {
  function commonCallback(bar, baz) {
    console.log('bar : ' + bar + ', baz : ' + baz);
  }
  router.on('/foo/:bar/:baz', { bar : /^\d+$/, baz : /^\w+$/ }).to(commonCallback);
  router.on('/hoge/:bar/:baz', commonCallback);
});

// Calls commonCallback, and then returns returned value of callback function.
router.call('/foo/123/test'); // 'bar : 123, baz : test'

// Returns `null` if cannot find a matched route.
router.call('/foo/test/123'); // null;
```

### Instance methods

#### `#on`

Registers route to routes.

```javascript
var howl = new Howl();

// Quick usage
howl.on('/foo/', function() { console.log('this is foo') });
howl.on('/users/:name/:action', { name : /^\w+$/, action : /^post$|^get$/ }, function(name, action) {
  console.log('Hello, ' + name);
  console.log('Let us' + action + '!');
});
```

### `#call`

Calls recognized route, and then executes callback function.

```javascript
var howl = new Howl();

// Quick usage
howl.on('/foo/', function() { console.log('this is foo') });
howl.on('/users/:name/:action', { name : /^\w+$/, action : /^post$|^get$/ }, function(name, action) {
  console.log('Hello, ' + name);
  console.log('Let us' + action + '!');
});

howl.call('/users/namusyaka/post'); // 'Hello, namusyaka'
                                    // 'Let us post!'
```

## License

The MIT License

## Author

namusyaka
