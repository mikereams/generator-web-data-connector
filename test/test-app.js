'use strict';

var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test,
    wdcAssert = require('./assert.js');

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

describe ('web-data-connector:app-demo', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withOptions({ demo: true })
      .withOptions({ deployTo: 'gh-pages'})
      .on('end', done);
  });

  it('copied demo set up code to main.js', function () {
    wdcAssert.codeCopied('demo/_setUp.js', 'src/main.js');
  });

  it('copied demo column header code to main.js', function () {
    wdcAssert.codeCopied('demo/_columnHeaders.js', 'src/main.js');
  });

  it('copied demo table data code to main.js', function () {
    wdcAssert.codeCopied('demo/_tableData.js', 'src/main.js');
  });

  it('copied demo tear down code to main.js', function () {
    wdcAssert.codeCopied('demo/_tearDown.js', 'src/main.js');
  });

  it('copied demo private methods to main.js', function () {
    wdcAssert.codeCopied('demo/_privateMethods.js', 'src/main.js');
  });

  it('copied demo html form to index.html', function () {
    wdcAssert.codeCopied('demo/_form.html', 'index.html');
  });

  it('copied demo help text to index.html', function () {
    wdcAssert.codeCopied('demo/_helpText.html', 'index.html');
  });

  it('uses the demo app name', function () {
    var name = 'Google Spreadsheets Demo',
        appName = 'google-spreadsheets-demo';

    assert.fileContent('index.html', '<title>' + name + '</title>');
    assert.fileContent('src/wrapper.js', "tableau.connectionName = '" + name + "';");
    assert.fileContent('bower.json', '"name": "' + appName + '",');
    assert.fileContent('package.json', '"name": "' + appName + '",');
  });

  it('respects deployment options', function () {
    wdcAssert.codeCopied('/deploy-gh-pages/_travis.yml', '.travis.yml');
  });
});
