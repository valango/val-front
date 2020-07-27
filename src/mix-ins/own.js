/**
 * src/lib/mix-ins/own.js
 *
 * Manage private variables and clean those up (hopefully).
 *
 */
import { dispose, ownInitialize, ownOn, ownOff } from '../own'

export default {
  beforeCreate () {
    //  NB: because methods are not set up yet, overloading the ownInitialize does not work.
    //  Use separate beforeCreate() hook instead.
    ownInitialize.call(this, 'ownData')
  },

  beforeDestroy () {
    this.dispose()
  },

  methods: { dispose, ownOn, ownOff }
}
