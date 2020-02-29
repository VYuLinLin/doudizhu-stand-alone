import myglobal from './mygolbal.js'

const common = require('common')
const ddzData = require('ddzData')
const ddzServers = require('ddzServers')
const gameRule = require('gameRule')

const start = cc.Class({
  extends: cc.Component,
  __preload() {
    window.myglobal = window.myglobal || myglobal
    window.common = window.common || common
    window.G = window.G || {
      gameRule: new gameRule()
    }
    !CC_EDITOR && ddzData.initData()
    !CC_EDITOR && ddzServers.initServer()
  }
})
module.extends = start
