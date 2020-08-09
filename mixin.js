import { dispose, ownInitialize, ownOn, ownOff } from './helpers'
import vueName from './vueName'

export default {
  beforeCreate () {
    //  Override beforeCreate() hook or modify things in later lifecycle hooks.
    ownInitialize.call(this, vueName(this, true))
  },

  beforeDestroy () {
    this.dispose()
  },

  methods: { dispose, ownOn, ownOff }
}
