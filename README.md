# val-front

Simple code snippets for making front-end coding more fun.

## Usage
```
$ npm i -S https://github.com/valango/val-front
```
The package in intended for using with ES5+ source code. It has named exports:

* assert
* debug
* debugMixin
* format
* own
* ownMixin
* vueName

So, in your code you can use both import or old-fashioned require(), which may be even more flexible
in some cases.

NB: when using both debug and own Vue mix-ins, then right sequence is: `mixins: [ownMixin, debugMixin]`.


