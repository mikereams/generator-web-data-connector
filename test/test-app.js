'use strict';

var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test,
    given = require('mocha-testdata'),
    jshint = require('jshint/src/cli'),
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
      'test/.jshintrc',
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

  it('copies demo set up code to main.js', function () {
    wdcAssert.codeCopied('demo/_setUp.js', 'src/main.js');
  });

  it('copies demo column header code to main.js', function () {
    wdcAssert.codeCopied('demo/_columnHeaders.js', 'src/main.js');
  });

  it('copies demo table data code to main.js', function () {
    wdcAssert.codeCopied('demo/_tableData.js', 'src/main.js');
  });

  it('copies demo tear down code to main.js', function () {
    wdcAssert.codeCopied('demo/_tearDown.js', 'src/main.js');
  });

  it('copies demo private methods to main.js', function () {
    wdcAssert.codeCopied('demo/_privateMethods.js', 'src/main.js');
  });

  it('copies demo html form to index.html', function () {
    wdcAssert.codeCopied('demo/_form.html', 'index.html');
  });

  it('copies demo help text to index.html', function () {
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

describe('web-data-connector:fields-input', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ hasInput: true, inputName: 'Generator Test Input'})
      .on('end', done);
  });

  it('adds expected markup to index.html', function () {
    assert.fileContent('index.html', '<input class="form-control" type="text" name="GeneratorTestInput" id="GeneratorTestInput" placeholder="Generator Test Input" />');
    assert.fileContent('index.html', '<label class="sr-only" for="GeneratorTestInput">Generator Test Input</label>');
  });

  it('uses input within main.js', function () {
    assert.fileContent('src/main.js', "if (this.getConnectionData().GeneratorTestInput) {");
  });
});

describe('web-data-connector:fields-textarea', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ hasTextarea: true, textareaName: 'Generator Test Area'})
      .on('end', done);
  });

  it('adds expected markup to index.html', function () {
    assert.fileContent('index.html', '<textarea class="form-control" type="text" rows="3" name="GeneratorTestArea" id="GeneratorTestArea" placeholder="Generator Test Area"></textarea>');
    assert.fileContent('index.html', '<label class="sr-only" for="GeneratorTestArea">Generator Test Area</label>');
  });

  it('uses input within main.js', function () {
    assert.fileContent('src/main.js', "if (this.getConnectionData().GeneratorTestArea) {");
  });
});

describe('web-data-connector:auth-basic', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ authentication: 'basic'})
      .on('end', done);
  });

  it('places username and password fields in index.html', function () {
    assert.fileContent('index.html', '<input class="form-control" type="text" name="username" id="username" placeholder="Username" />')
    assert.fileContent('index.html', '<input class="form-control" type="password" name="password" id="password" placeholder="Password or token" />');
  });

  it('uses username and password getters in main.js', function () {
    assert.fileContent('src/main.js', 'this.getUsername()');
    assert.fileContent('src/main.js', 'this.getPassword()');
  });

  it('copies basic auth header code to main.js', function () {
    wdcAssert.codeCopied('auth-basic/_columnHeaders.js', 'src/main.js');
  });

  it('copies basic auth private method code to main.js', function () {
    assert.fileContent('src/main.js', 'function btoa(');
  });
});

describe('web-data-connector:auth-token', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ authentication: 'token'})
      .on('end', done);
  });

  it('places token field in index.html', function () {
    assert.fileContent('index.html', '<input class="form-control" type="password" name="password" id="password" placeholder="Password or token" />');
  });

  it('uses username and password getters in main.js', function () {
    assert.fileContent('src/main.js', 'this.getPassword()');
  });

  it('copies token auth header code to main.js', function () {
    wdcAssert.codeCopied('auth-token/_columnHeaders.js', 'src/main.js');
  });
});

describe('web-data-connector:auth-oauth', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ authentication: 'oauth'})
      .on('end', done);
  });

  it('places oauth authorize link in index.html', function () {
    assert.fileContent('index.html', '<a href="https://api.example.com/oauth/authorize');
  });

  it('copies setup code to main.js', function () {
    wdcAssert.codeCopied('auth-oauth/_setUp.js', 'src/main.js');
  });
});

describe('web-data-connector:deployment-gh-pages', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ deployTo: 'gh-pages'})
      .on('end', done);
  });

  it('copies gh-pages .travis.yml to project root', function () {
    wdcAssert.codeCopied('deploy-gh-pages/_travis.yml', '.travis.yml');
  });

  it('includes appropriate commands in gruntfile.js', function () {
    assert.fileContent('Gruntfile.js', 'gh-pages:travisDeploy');
    assert.fileContent('Gruntfile.js', "grunt.registerTask('deploy'");
    assert.fileContent('Gruntfile.js', "grunt.registerTask('autoDeploy'");
  });
});

describe('web-data-connector:deployment-heroku', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ deployTo: 'heroku'})
      .on('end', done);
  });

  it('includes appropriate steps in .travis.yml', function () {
    assert.fileContent('.travis.yml', 'npm install -g grunt-cli');
    assert.fileContent('.travis.yml', "deploy:\n  provider: heroku");
  });

  it('includes appropriate package.json file', function () {
    assert.fileContent('package.json', '"postinstall": "grunt build"');
  });
});

describe('web-data-connector:needs-proxy', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ needsProxy: true})
      .on('end', done);
  });

  it('sets up gruntfile.js as expected', function () {
    assert.fileContent('Gruntfile.js', "express: {\n      server: {\n        options: {\n          script: 'index.js',\n            port: 9001");
    assert.fileContent('Gruntfile.js', "grunt.registerTask('run', [\n    'express:server'");
  });

  it('sets up package.json as expected', function () {
    assert.fileContent('package.json', '"express": "^4.13.3"');
    assert.fileContent('package.json', 'request": "^2.61.0"');
    assert.fileContent('package.json', '"grunt-express-server": "~0.5"');
  });

  it('sets up index.js as expected', function () {
    assert.fileContent('index.js', "app.get('/proxy', function (req, res) {");
  });
});

describe('web-data-connector:valid-javascript', function () {
  var combinations = {
        default: {},
        justNeedsProxy: {needsProxy: true},
        tokenAuth: {authentication: 'token'},
        basicAuth: {authentication: 'basic'},
        oAuth: {authentication: 'oauth'},
        deployHeroku: {deployTo: 'heroku'},
        deployGithubPages: {deployTo: 'gh-pages'},
        includesInput: {hasInput: true, inputName: 'Input Name'},
        includesTextarea: {hasTextarea: true, textAreaName: 'Textarea Name'}
      };

  given.async(Object.keys(combinations)).it('produces valid javascript', function (done, prompt) {
    var prompts = combinations[prompt],
        files = [
          'Gruntfile.js',
          'src/wrapper.js',
          'src/main.js',
          'test/test-wdcw.js'
        ];

    // Only run jshint on index.js if a proxy is needed.
    if (prompts.needsProxy || prompts.deployHeroku) {
      files.push('index.js');
    }

    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts(prompts)
      .on('end', function () {
        var passed = jshint.run({
          args: files,
          reporter: function(results, data) {
            if (results.length) {
              console.error(results);
            }
          }
        });

        assert.strictEqual(passed, true);
        done();
      });
  });
});
