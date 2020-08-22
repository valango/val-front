'use strict'
const { dispose, ownInitialize, ownOn, ownOff } = require('./helpers')
const vueName = require('./vueName')

module.exports = {
  beforeCreate () {
    //  Override beforeCreate() hook or modify things in later lifecycle hooks.
    ownInitialize.call(this, vueName(this, true))
  },

  beforeDestroy () {
    this.dispose()
  },

  methods: { dispose, ownOn, ownOff }
}
