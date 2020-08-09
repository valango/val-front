//  src/Own   --  a helpful base class.
import { dispose, ownInitialize, ownOff, ownOn } from './helpers'
import vueName from './vueName'

/**
 * @param {string=} className
 * @constructor
 */
export default function Own (className) {
  ownInitialize.call(this, className)
}

Own.prototype.debug = () => undefined
Own.prototype.dispose = dispose
Own.prototype.ownOn = ownOn
Own.prototype.ownOff = ownOff
