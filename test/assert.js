"use strict";

var path = require('path'),
    assert = require('yeoman-generator').assert,
    fs = require('fs');

module.exports = {
  codeCopied: function codeCopied(from, to) {
    var demoRoot = path.join(__dirname, '../generators/app') + '/templates',
        fileContents = fs.readFileSync(demoRoot + '/' + from, 'utf-8');

    assert.fileContent(to, fileContents);
  }
};
