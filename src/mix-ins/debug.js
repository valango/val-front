import Debug from '../debug'
import nameOf from '../vueName'

export default {
  beforeCreate () {
    //  Instance variable to control debugging.
    this.debugOn = true

    this._debugFn = Debug(nameOf(this, true), true)
  },

  methods: {
    //  Use this instance method.
    debug (...args) {
      if (this.debugOn) this._debugFn.apply(this, args)
    }
  }
}
