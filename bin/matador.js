#!/usr/bin/env node
var fs = require('fs')
  , exec = require('child_process').exec

var methods = {
  init: function (path) {
    console.log('installing Matador into ' + path)
    fs.mkdirSync('./' + path)
    exec('cp -R ' + __dirname + '/../src/all/ ' + path, function (err, out) {
      if (err) return console.log('error', err)
      console.log('Success!')
    })
  }
, controller: function (name) {
    if (name.match(/([^\/]+)\//)) {
      exec('mkdir -p ' + RegExp.$1, copyContents)
    }
    else {
      copyContents()
    }
    function copyContents() {
      var destinationFile = './app/controllers/' + name.replace(/(?:[^\/]+)$/, function (m) {
        return m.replace(/(.{1})/, function (m, l) {
          return l.toUpperCase()
        })
      }) + 'Controller.js'
      console.log('generating controller ' + destinationFile)
      var stub = __dirname + '/../src/StubController.js'
      exec('cp ' + stub + ' ' + destinationFile, function (er, out) {
        console.log('Successfully created ' + destinationFile)
      })
    }
  }
, model: function (name) {
    console.log('generating model ' + name)
    var destinationFile = './app/models/' + name.replace(/^(.{1})/, function (m, l) {
      return l.toUpperCase()
    }) + 'Model.js'
    var stub = __dirname + '/../src/StubModel.js'
    exec('cp ' + stub + ' ' + destinationFile, function (er, out) {
      console.log('Successfully created ' + destinationFile)
    })
  }
, help: function () {
    console.log("Matador - a clean, organized framework for Node.js\n")
    console.log("usage:")
    console.log("\tinit <name> - Generate a new app called <name>")
    console.log("\tcontroller <name> - Generate a new controller called <name>")
    console.log("\tmodel <name> - Generate a new model called <name>\n")
  }
}

!function (args) {
  var command = args.shift()
  ;(methods[command] && methods[command].apply(methods, args)) || methods.help.apply(methods, args)
}(process.argv.slice(2))
