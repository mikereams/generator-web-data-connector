'use strict';

var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test,
    os = require('os');

describe('web-data-connector:app-noproxy', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc',
      '.gitignore',
      '.travis.yml',
      'index.html',
      'src/main.js',
      'src/wrapper.js',
      'src/main.css',
      'test/test-wdcw.js',
      'test/util/tableau.js',
      'test/util/connector.js'
    ]);
  });
});

describe('web-data-connector:app-proxy', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ needsProxy: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc',
      '.gitignore',
      '.travis.yml',
      'index.html',
      'src/main.js',
      'src/wrapper.js',
      'src/main.css',
      'index.js',
      'test/test-wdcw.js',
      'test/util/tableau.js',
      'test/util/connector.js'
    ]);
  });
});
