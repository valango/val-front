# val-front

Simple code snippets for making front-end coding more fun.

## Usage
```
$ npm i -S https://github.com/valango/val-front
```
The package in intended for using with ES5+ source code. It has the following parts:

* [assert](#assertions) - enables debugger breakpoints for assertions;
* [debug](#debugging) - convenience wrapper around popular 
  [debug](https://github.com/visionmedia/debug]) package;
* [mixin](#vuejs-mixin) - Vue.js mix-in for cleaner and safer code;
* [Own](#own-baseclass) - ES5 base class for more maintainable code;
* [performance](#performance) - a simple API for code profiling;
* [vueName](#vuename-function) - get Vue.js comnponent instance name.

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
  import Own from 'val-front/Own'

  class A extends Own {}

  new A().debug('yay')  //  A#1 yay +0ms
```

**Debugging Vue.js components:**
Just make sure your component has _**`mixin`**_ imported from 'val-front' -
your component instance will have `debug()` method.

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
   * `method debug(...)  -` see [debugging](#debugging) for details.
   * `method dispose()   -` call this to free up all bound resources.
   Base class method cleans the _**`own`**_ container, firing _`dispose`_ method of every
   object instance having it. Then it un-registers all handlers set by _`ownOn`_ method.
   * `function ownOff (event : string) : this` -
   un-registers event handler previously set by `ownOn` method.
   In most cases you don't need to call it explicitly.
   * `function ownOn (event : string, handler, emitter, api=) : this` -
   registers _`event`_ _`handler`_ with _`emitter`_ object.
   If emitter API differs from `addEventListener/removeEventListener` or `$on/$off`,
   then you need explicitly define api, like `['on', 'off']`.
   The _`handler`_ parameter can be instance method name or a function.
   * `property debugOn : {boolean|undefined}  -` see [debugging](#debugging) for details.
   * `property own : {Object}                 -`
   a keyed container for private data, that should be gracefully cleaned up.
   * `property ownClass : {string}   -` class name.
   * `property ownNumber : {number}  -` globally unique class instance number.
   * `property ownName : {string}    -` initially set to `ownClass + '#' + ownNumber`.
   
Mutating `debugOn` or `className` property will re-generate `debug()` instance method.

### Performance
This is a simple wrapper for Windows User Timing API. In production mode it does nothing.
Usage example:
```javascript
  import {perfB, perfE, perfDump} from 'val-front/performance'

  perfB('crazy-effort')   //  Create begin mark.
  performCrazyEffort()
  perfE('crazy-effort')   //  Create end mark and measure.

  perfDump().forEach(d => console.log(d))   //  Get results
```

API methods:
   * `perfB(name : {string})  -` create begin mark.
   * `perfE(name : {string})  -` create end mark and measure entry. Throws exception,
   if tag does not match any pending begin mark.
   * `perfGet(sortBy : {string}) : {Object[]} -` returns sorted array of statistics.
   sortBy parameter defaults to `'total'`. Each entry is an object with fields:
      - `avg` average duration per call,
      - `count` calls count,
      - `max` maximum duration,
      - `name` set via perfB/perfE,
      - `total` total duration of all calls with this name.
   * `perfDump(sortBy : {string}) : {string[]} -` like perfGet, returning strings.
   * `perfReset()  -` resets measurements statistics..

### Vue.js mixin
This mix-in will provide a Vue.js component with _**`Own`**_ class API described above.

### vueName function
`vueName( vm, tryHarder = false ) : {string | undefined}`<br />
Try to get a meaningful name for a Vue.js component instance.
It returns '#root#' for root instance or value of `vm.name` if defined or value of
instance options _`name`_ property.

If all the above fails, but _`tryHarder`_ is set, it will try to use component tag or filename.
