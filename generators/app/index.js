'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.props = {};

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
      this.template('_helper.js', 'src/helper.js');
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
        templateFiles = [
          'helpText.html',
          'form.html',
          'setUp.js',
          'columnHeaders.js',
          'tableData.js',
          'privateMethods.js',
          'tearDown.js'
        ],
        folder = this.options.demo ? 'demo' : 'default';

    templateFiles.forEach(function (file) {
      var templateVar = file.split('.')[0];
      try {
        that.props[templateVar] = that.fs.read(that.templatePath(folder + '/' + file));
      }
      catch (e) {
        that.props[templateVar] = '';
      }
    });
  }

});
