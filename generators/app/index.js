'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.props = {};
    this.templateVars = {
      helpText: '',
      form: '',
      setUp: '',
      columnHeaders: '',
      tableData: '',
      privateMethods: '',
      tearDown: ''
    };

    // Add support for a `--demo` flag.
    this.option('demo');
  },

  initializing: function() {
    this.pkg = require('../../package.json');
    this.author = this.user.git.name();
  },

  prompting: function () {
    var done = this.async(),
        prompts = [{
          name: 'name',
          message: 'What would you like to call this connector?',
          default: 'My Web Data Connector'
        }, {
          name: 'authentication',
          type: 'list',
          message: 'Does your connector require user authentication?',
          choices: [{
            name: 'No authentication required',
            value: 'none'
          }, {
            name: 'Token-based authentication (bearer token, JWT, etc.)',
            value: 'token'
          }, {
            name: 'Basic/digest authentication (username and password)',
            value: 'basic'
          }, {
            name: 'OAuth',
            value: 'oauth'
          }],
          default: 'none'
        }];

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('Tableau Web Data Connector') +
      ' app generator!'
    ));

    if (!this.options.demo) {
      this.prompt(prompts, function (props) {
        props.name = props.name.replace(/\"/g, '\\"');
        props.appname = _.slugify(props.name);
        this.props = props;
        done();
      }.bind(this));
    }
    else {
      this.log('Generating demo connector for you...');
      this.props = {
        name: 'Google Spreadsheets Connector Demo',
        appname: 'google-spreadsheets-connector-demo'
      };
      done();
    }
  },

  writing: {

    app: function () {
      this._populateTemplateVars();
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_index.html', 'index.html');
      this.template('_wrapper.js', 'src/wrapper.js');
      this.template('_main.js', 'src/main.js');
    },

    gruntfile: function () {
      this.template('Gruntfile.js');
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies();

    // WDC SDK isn't distributed via bower, so copy in our local copy.
    this.fs.copy(
      this.templatePath('tableauwdc-1.1.0.js'),
      this.destinationPath('/bower_components/tableau/dist/tableauwdc-1.1.0.js')
    );
  },

  _populateTemplateVars: function () {
    var that = this,
        templateFiles = this._evaluateTemplateFolders();

    templateFiles.forEach(function (file) {
      var templateVar = file.name.split('.')[0];
      try {
        that.templateVars[templateVar] = that.fs.read(that.templatePath(file.folder + '/' + file.name));
      }
      catch (e) {
        // Do nothing. Defaults are already populated.
      }
    });
  },

  _evaluateTemplateFolders: function () {
    var that = this,
        templateFiles = [{
          name: 'helpText.html',
          folder: 'default'
        }, {
          name: 'form.html',
          folder: 'default'
        }, {
          name: 'setUp.js',
          folder: 'default'
        }, {
          name: 'columnHeaders.js',
          folder: 'default'
        }, {
          name: 'tableData.js',
          folder: 'default'
        }, {
          name: 'privateMethods.js',
          folder: 'default'
        }, {
          name: 'tearDown.js',
          folder: 'default'
        }];

    // If a simple demo was requested, swap to the demo folder.
    if (this.options.demo) {
      templateFiles.forEach(function (file, index) {
        templateFiles[index].folder = 'demo';
      });
    }

    // If token-based or basic authentication is requested, swap out the files.
    if (['token', 'basic'].indexOf(this.props.authentication) !== -1) {
      templateFiles.forEach(function (file, index) {
        if (['columnHeaders.js', 'form.html', 'tableData.js'].indexOf(file.name) !== -1) {
          templateFiles[index].folder = 'auth-' + that.props.authentication;
        }
      });
    }

    // If OAuth-based authentication is requested, swap out a slightly different
    // set of files.
    if (this.props.authentication === 'oauth') {
      templateFiles.forEach(function (file, index) {
        if (['form.html', 'privateMethods.js', 'setUp.js'].indexOf(file.name) !== -1) {
          templateFiles[index].folder = 'auth-oauth';
        }
      });
    }

    return templateFiles;
  }

});
