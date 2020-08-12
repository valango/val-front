//  src/Own   --  a helpful base class.
'use strict'
const { dispose, ownInitialize, ownOff, ownOn } = require('./helpers')

/**
 * @param {string=} className
 * @constructor
 */

/**
 * @class Own
 * @property (string} ownName
 */
function Own (className) {
  ownInitialize.call(this, className)
  /** @property {string} ownName */
}

Own.prototype.dispose = dispose
Own.prototype.ownOn = ownOn
Own.prototype.ownOff = ownOff

module.exports = Own
