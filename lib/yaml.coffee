# honeycomb - lib/yaml.coffee
# yaml文件的管理
# Copyright(c) 2013 Taobao.com
# Author: jifeng.zjd <jifeng.zjd@taobao.com>

events     = require 'events'
path       = require 'path'
fs         = require 'fs'
yaml       = require 'yamljs'



class Yaml extends events.EventEmitter
  constructor : (options) ->
    @options = options || {};
    @file = @options.file;
    if false is fs.existsSync(@file)
      fs.writeFileSync(@file, '')
    
  keys: () ->
    info = yaml.load(@file)
    return info
    # has bug in this async function
    # yaml.load(@file, cb)

  get: (key) ->
    info = @keys()
    return  info && info[key]

  set: (key, value) ->
    info = @keys() || {}
    info[key] = value
    str = yaml.stringify(info, 4)
    fs.writeFileSync @file, str

  remove: (key)->
    info = @keys() || {}
    delete info[key]
    str = yaml.stringify(info, 4)
    fs.writeFileSync @file, str

module.exports = (options) ->
	new Yaml options

