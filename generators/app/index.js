'use strict';

var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    _ = require('underscore.string'),
    u = require('underscore');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.props = {};
    this.templateIncs = {
      _helpText: '',
      _form: '',
      _setUp: '',
      _columnHeaders: '',
      _tableData: '',
      _privateMethods: '',
      _tearDown: '',
      _inputField: this.templatePath('fields/_inputField.html'),
      _selectField: this.templatePath('fields/_selectField.html'),
      _textareaField: this.templatePath('fields/_textareaField.html'),
      _packageJson: this.templatePath('default/_package.json'),
      _travisYml: this.templatePath('default/_travis.yml')
    };

    // Add support for a `--demo` flag.
    this.option('demo');

    // Allow custom deployment via flags.
    this.option('deployTo');
  },

  initializing: function() {
    var that = this;

    this.pkg = require('../../package.json');
    this.author = this.user.git.name();

    // Helper function for use within templates to render sub-templates...
    this.include = function (path, context) {
      var compiled = u.template(this.fs.read(path));
      return compiled(context || that);
    };
  },

  prompting: function () {
    var done = this.async(),
        userWantsSelectList = function (props) {return props.hasSelectOption;},
        userWantsTextarea = function (props) {return props.hasTextarea;},
        userWantsInput = function (props) {return props.hasInput;},
        prompts = [{
          name: 'name',
          message: 'What would you like to call this connector?',
          default: 'My Web Data'
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
        }, {
          name: 'needsProxy',
          message: 'Are you connecting to a service with CORS restrictions?',
          type: 'list',
          choices: [{
            name: 'Nope, requests are not restricted / not applicable',
            value: false
          }, {
            name: 'Yep, I need a server-side proxy to account for CORS',
            value: true
          }],
          default: false
        },{
          name: 'hasInput',
          message: 'Does your connector need a text field?',
          type: 'confirm',
          default: false
        }, {
          name: 'inputName',
          message: "What's the input for?",
          default: 'Filter value',
          when: userWantsInput
        }, {
          name: 'hasSelectOption',
          message: 'Does your connector need an options list?',
          type: 'confirm',
          default: false
        }, {
          name: 'selectOptionName',
          message: "What's the list for?",
          default: 'Pizza toppings',
          when: userWantsSelectList
        }, {
          name: 'selectOptionValues',
          message: 'What options should be made available?',
          default: 'Cheese, Mushroom, Bacon',
          when: userWantsSelectList,
          filter: function (optionValues) {
            return optionValues.split(',').map(function(option) {
              return option.trim();
            });
          }
        }, {
          name: 'hasTextarea',
          message: 'Does your connector need a large text area?',
          type: 'confirm',
          default: false
        }, {
          name: 'textareaName',
          message: "What's the text area for?",
          default: 'JSON String',
          when: userWantsTextarea
        }, {
          name: 'deployTo',
          message: 'Where do you want to deploy this generator?',
          type: 'list',
          default: 'custom',
          when: !this.options.deployTo,
          choices: function (props) {
            var options = [{
                  name: "I'll roll my own later",
                  value: 'custom'
                }];

            if (props.needsProxy) {
              options.push({
                name: 'Heroku',
                value: 'heroku'
              });
            }
            else {
              options.push({
                name: 'GitHub Pages',
                value: 'gh-pages'
              })
            }

            return options;
          }
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

        if (props.hasInput) {
          props.inputLabel = props.inputName;
          props.inputName = _.classify(props.inputLabel);
        }
        if (props.hasSelectOption) {
          props.selectOptionLabel = props.selectOptionName;
          props.selectOptionName = _.classify(props.selectOptionLabel);
        }
        if (props.hasTextarea) {
          props.textareaLabel = props.textareaName;
          props.textareaName = _.classify(props.textareaLabel);
        }
        this.props = props;
        done();
      }.bind(this));
    }
    else {
      this.log('Generating demo connector for you...');
      this.props = {
        name: 'Google Spreadsheets Demo',
        appname: 'google-spreadsheets-demo',
        deployTo: this.options.deployTo || 'custom'
      };
      done();
    }
  },

  writing: {

    app: function () {
      this._populateTemplateIncs();
      this.template(this.templateIncs._packageJson, 'package.json');
      this.template('_bower.json', 'bower.json');
      this.template('_index.html', 'index.html');
      this.template('_wrapper.js', 'src/wrapper.js');
      this.template('_main.js', 'src/main.js');
      this.template('_main.css', 'src/main.css');
      this.template('default/test/_test-wdcw.js', 'test/test-wdcw.js');
      this.fs.copy(
        this.templatePath('default/test/util/connector.js'),
        this.destinationPath('test/util/connector.js')
      );
      this.fs.copy(
        this.templatePath('default/test/util/tableau.js'),
        this.destinationPath('test/util/tableau.js')
      );
      this.fs.copy(
        this.templatePath('default/test/jshintrc'),
        this.destinationPath('test/.jshintrc')
      );

      if (this.props.needsProxy) {
        this.template('_index.js', 'index.js');
      }
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
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.template(this.templateIncs._travisYml, '.travis.yml');
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

  _populateTemplateIncs: function () {
    var that = this,
        templateFiles = this._evaluateTemplateFolders();

    templateFiles.forEach(function (file) {
      var templateInc = file.name.split('.')[0],
          templateFile = that.templatePath(file.folder + '/' + file.name);

      if (that.fs.exists(templateFile)) {
        that.templateIncs[templateInc] = templateFile;
      }
    });
  },

  _evaluateTemplateFolders: function () {
    var that = this,
        templateFiles = [{
          name: '_helpText.html',
          folder: 'default'
        }, {
          name: '_form.html',
          folder: 'default'
        }, {
          name: '_setUp.js',
          folder: 'default'
        }, {
          name: '_columnHeaders.js',
          folder: 'default'
        }, {
          name: '_tableData.js',
          folder: 'default'
        }, {
          name: '_privateMethods.js',
          folder: 'default'
        }, {
          name: '_tearDown.js',
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
        if (['_columnHeaders.js', '_tableData.js'].indexOf(file.name) !== -1) {
          templateFiles[index].folder = 'auth-' + that.props.authentication;
        }
        if (file.name === '_privateMethods.js' && that.props.authentication === 'basic') {
          templateFiles[index].folder = 'auth-' + that.props.authentication;
        }
      });
    }

    // If OAuth-based authentication is requested, swap out a slightly different
    // set of files.
    if (this.props.authentication === 'oauth') {
      templateFiles.forEach(function (file, index) {
        if (['_form.html', '_privateMethods.js', '_setUp.js'].indexOf(file.name) !== -1) {
          templateFiles[index].folder = 'auth-oauth';
        }
      });
    }

    // Swap files according to deployment strategy.
    if (this.props.deployTo !== 'custom') {
      switch (this.props.deployTo) {
        case 'heroku':
          this.templateIncs._packageJson = this.templatePath('deploy-heroku/_package.json');
          this.templateIncs._travisYml = this.templatePath('deploy-heroku/_travis.yml');
          break;

        case 'gh-pages':
          this.templateIncs._travisYml = this.templatePath('deploy-gh-pages/_travis.yml');
          break;
      }
    }

    return templateFiles;
  }

});
