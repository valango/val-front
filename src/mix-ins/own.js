import { dispose, ownInitialize, ownOn, ownOff } from '../own'
import vueName from '../vueName'

export default {
  beforeCreate () {
    //  NB: because methods are not set up yet, overloading the ownInitialize does not work.
    //  Use separate beforeCreate() hook instead.
    ownInitialize.call(this, vueName(this, true))
  },

  beforeDestroy () {
    this.dispose()
  },

  methods: { dispose, ownOn, ownOff }
}
