'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('underscore.string');

module.exports = yeoman.generators.Base.extend({

  initializing: function() {
    this.pkg = require('../../package.json');
    this.author = this.user.git.name();
    this.props = {};
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

    this.currentYear = (new Date()).getFullYear();

    this.prompt(prompts, function (props) {
      props.name = props.name.replace(/\"/g, '\\"');
      props.appname = _.slugify(props.name);
      this.props = props;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.template('_package.json', 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_index.html', 'index.html');
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
  }

});
