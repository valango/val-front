# val-front

Simple code snippets for making front-end coding more fun.

## Usage
```
$ npm i -S https://github.com/valango/val-front
```
The package in intended for using with ES5+ source code. It has the following parts:

* [assert](#assertions)
* [debug](#debugging)
* [format](#format-function)
* [mixin](#vuejs-mixin)
* [Own](#own-baseclass)
* [vueName](#vuename-function)

These parts can be loaded individually, like `import dbg from 'val-front/debug'`<br />
or together, like `import {assert, mixin} frpm 'val-front'`

### Assertions
```javascript
import { assert } from 'val-front'

//  You can this to find out what causes seemingly random assertions.
assert.callback((...args) => {
  //  Great place for debugger breakpoint!
})

assert( someCondition, ... )  // Optional extra arguments for console.assert() 
```
In production mode, _`assert()`_ will throw an exception.

### Debugging
Debugging machinery is based on [debug](https://github.com/visionmedia/debug])
NPM package and is available only in development mode. In production mode all it's API
methods will be just empty functions. Here are simple examples:

**Debugging plain javascript code:**
```javascript
  const debug = require('val-front/debug')('main.js')

  debug('try(%d, %o)', 1, 2, 3)  // main.js try(1, 2) +0ms 3
```

**Debugging class instances:**
```javascript
  import { Own } from 'val-front'

  class A extends Own {}

  new A().debug('yay')  //  A#1 yay +0ms
```

**Debugging Vue.js components:**
Just make sure your component has _**`ownMixin`**_ imported from 'val-front' and
your component instance will have debug() method.

#### Fine control of debugging
By default, call to debug() method will generate console output.
It may generate quite a mess on console, as your code grows.

To be more selective, you may do the following:
   1. assign a mask to debug.enabled in your app root module:<br />
   ` require('val-front').debug.enabled = '*, -proven*'`;
   1. use DEBUG environment variable (may be a bit less convenient);
   1. explicitly set _`debugOn`_ instance variable to _true_ or _false_;
   1. in plain javascript: `const debug = require('val-front').debug('main.js', trueOrFalse)`

Tricks #2, #3 will override the effects of #1, #2.

### Own baseclass
`constructor Own(className= : {string})`

This baseclass provides API for safer code and some diagnostic support as well:
   * `method debug(...)` - see [debugging](#debugging) for details.
   * `method dispose()` - will free up all bound resources, when instance is destroyed.
   Base class method cleans the _**`own`**_ container, firing _`dispose`_ method of every
   object instance found in there.
   * `function ownOff (event : string, method = '$off') : this` -
   cleans event handlers previously set by `ownOn()` method.
   * `function ownOn (event : string, handler, emitter, method = '$on') : this` -
   registers _`event`_ _`handler`_ with _`emitter`_ object using _`method`_.
   The _`handler`_ parameter can be handler function or instance method name.
   * `property debugOn : {boolean|undefined}` - see [debugging](#debugging) for details.
   * `property own : {Object}`
   a keyed container for private data, that should be gracefully cleaned up.
   * `property ownClass : {string}` - class name.
   * `property ownNumber : {number}` - globally unique class instance number.
   * `property ownName : {string}` - initially set to ownClass + '#' + ownNumber.
   
Mutating `debugOn` or `className` property will re-generate `debug()` instance method.

### Vue.js mixin
This mix-in will provide a Vue.js component with _**`Own`**_ class API described above.

### format function
`format( fmt, ...args ) : {string}`<br />
is similar to Node.js format() function, but not quite reliable yet.

### vueName function
`vueName( vm, tryHarder = false ) : {string | undefined}`<br />
Try to get a meaningful name for a Vue.js component instance.
It returns '#root#' for root instance or value of `vm.name` if defined or value of
instance options _`name`_ property.

If all the above fails, but _`tryHarder`_ is set, it will try to use component tag or filename.
