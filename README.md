# Web Data Connector Generator [![Build Status](https://secure.travis-ci.org/tableau-mkt/generator-web-data-connector.png?branch=master)](https://travis-ci.org/tableau-mkt/generator-web-data-connector)

A scaffolding tool for Tableau Web Data Connectors, built on [yeoman][].

Jump to the information you need:

__[Getting Started](#getting-started)__
- [Installation](#installation)
- [Usage](#usage)

__[Developing](#developing)__
- [Explanation of files](#explanation-of-files)
- [Workflow](#workflow)

__[WDC Wrapper](#wdc-wrapper)__
- [WDC lifecycle phases](#wdc-lifecycle-phases)
- [Wrapper helpers](#wrapper-helpers)

__[Deploying](#deploying)__
- [To Heroku](#heroku)
- [To GitHub Pages](#github-pages)

__[Contributing](#contributing)__


## Getting Started

You will need [NodeJS][], [yeoman][], [grunt-cli][], and [bower][]  installed.
If you already have those up and running, skip below and install the generator
itself.

#### Installation

- __On Windows__
  1. Install a console emulator like [cmder][],
  1. Download and [install NodeJS][],
  1. Run the following in your console to install yeoman, grunt, and bower:
     `npm install -g yo grunt-cli bower`
- __On OS X__
  1. Install [Homebrew][], then open up Terminal.app or your favorite console,
  1. Install NodeJS by running `brew install node`
  1. Install yeoman, grunt, and bower with `npm install -g yo grunt-cli bower`

Once all prerequisites are met, you can install the generator itself by running
`npm install -g generator-web-data-connector`

#### Usage

![gwdc](https://cloud.githubusercontent.com/assets/3496491/9558059/195c3a9e-4d96-11e5-9ee4-cad64a97c99e.png)

1. Create a new space to house your connector: `mkdir my-connector`
1. Change directories into the directory you created: `cd my-connector`
1. Run `yo web-data-connector` and answer a few questions about the web data
   connector you want to build.
1. Inspect the files it generated, make and save edits as necessary,
1. Run `grunt` to build and run your connector,
1. Open up your connector in a browser, the WDC SDK simulator, or Tableau itself
   at the following url: `http://localhost:9001`
1. When you're done, you can stop the local server by typing `ctrl+c`

Run all of these steps as often as you need in new directories to create and
prototype connectors for all of your web data needs.


## Developing

This generator attempts to take care of as much boilerplate and development
workflow best-practices on your behalf as possible. For an explanation of what's
available, continue reading.

#### Explanation of files

When you run `yo web-data-connector`, the generator will dynamically create
files and write them to your connector folder. The exact contents of the files
will vary depending on the answers you provide to the generator's prompts; below
is an overview of files and folders to help orient yourself.

- __`/index.html`__
  - This file contains the UI presented to Tableau users when connecting to your
    web data connector. A simple HTML page.
- __`/index.js`__
  - If your connector needs to make a connection to an HTTP resource with CORS
    restrictions, you'll see this file. It's a simple [ExpressJS][] app that
    your frontend can use as a proxy.
- __`/src/main.js`__
  - Holds all logic related to connecting to, extracting, and transforming data
    from your data source / API into a format digestible by Tableau. Most of
    the work you do will likely live here.
- __`/src/main.css`__
  - Holds all CSS style overrides loaded and applied to the connector UI. If you
    wish to make updates to the connector's look and feel, your work will likely
    go here.
- __`/src/wrapper.js`__
  - A helper library used to abstract away and simplify the Tableau WDC API. You
    should not need to update this file, though you may wish to refer to it from
    time to time. For complete details, jump to [WDC Wrapper](#wdc-wrapper).
- __`/Gruntfile.js`__
  - File that declares grunt tasks and configurations. For more details, jump to
    [workflow](#workflow).
- __`/build/`__
  - Once you've run `grunt` at least once, this folder will appear. It contains
    files built by grunt that your connector relies on, such as the concatenated
    JS file `all.min.js`.
- __`/bower_components/`__
  - This folder contains libraries that your connector depends on. By default,
    you might see jQuery, Bootstrap, and the Tableau SDK, but you can add your
    own dependencies by modifying bower.json and running `bower install`.
- __`/node_modules/`__
  - This folder contains libraries and dependencies necessary for workflow and
    development use. You can add your own dependencies by modifying package.json
    and running `npm install`.

#### Workflow

This generator attempts to offer you a smooth development workflow, encapsulated
in a single command: `grunt`. When you run `grunt`, the following is taken care
of for you:

- Runs [JSHint][] on your connector source code, detecting and alerting you to
  potential issues before you run your connector.
- For performance, concatenates and minifies your JavaScript source code and
  dependencies (like jQuery) into a single file.
- Starts a local development server, available at `http://localhost:9001`
- Backgrounds the server, and implements a "watch" task that detects when you
  make changes to your JavaScript source code. When you do, it re-runs all of
  the above (detects and alerts on JS issues, concats/minifies, etc), so you
  can just refresh the connector in browser, the SDK simulator, or Tableau, and
  all of your changes will be made and testable.

Of course, once initialized, you can make tweaks to your connector's workflow by
adding or editing tasks and task configurations in the generated Gruntfile.js
file at the root of your connector.


## WDC Wrapper

This generator comes packaged with a web data connector wrapper--a sort of
connector on training wheels--that allows you to focus on application logic
necessary to retrieve your data, not tedious tasks like registering your
connector, saving and retrieving connection details, stepping through Tableau's
connector phases, etc.

Rather than learning the Tableau Web Data Connector API, you can dive right into
the JavaScript in `src/main.js`. Although the file is heavily annotated, brief
explanations of the various hooks can be found below.

#### WDC lifecycle phases

The web data connector wrapper expects a global JS object called `wdcw`. Four
methods can be attached to the `wdcw` object, corresponding to the four phases
of a connection's lifecycle.

- __Initialization__ `wdwc.setup = function(phase, setUpComplete)`
  - This method is optional, but can be provided if resources need to be
    initialized or connections need to be verified.
  - Like all methods, the provided callback (`setUpComplete` in this case) must
    be called once all tasks associated with the phase are complete.
- __Retrieving columns__ - `wdwc.columnHeaders = function(registerHeaders)`
  - This method is required and is called when Tableau wants to know the names
    and data types of columns provided by your connector.
  - The expected format is outlined in `main.js`, and must be provided as the
    sole argument to the provided callback (`registerHeaders` in this case).
- __Retrieving data__ - `wdwc.tableData = function(registerData, lastRecord)`
  - This method is required and is called when Tableau is retrieving data from
    your connector.
  - The expected format is outlined in `main.js`, and must be provided as the
    first argument on the provided callback (`registerData` in this case).
  - If the API you're connecting to supports paging, and you wish to support
    incremental extract refreshing, you can pass a second argument to the
    `registerData` callback representing the last record that was retrieved. If
    provided, Tableau will call your `wdwc.tableData` method again, this time
    passing the token you provided for the `lastRecord` argument.
- __Teardown__ - `wdwc.teardown = function(tearDownComplete)`
  - This method is optional, but can be provided if resources need to be spun
    down or other cleanup tasks need to occur.
  - Like all methods, the provided callback (`tearDownComplete` in this case)
    must be called once all tasks associated with the phase are complete.

#### Wrapper helpers

The web data connector wrapper also provides some helper methods to simplify the
way you interact with Tableau. All methods are available on `this` within the
immediate scope of your `wdcw` methods.

- __Retrieving connection details__
  - Retrieve connection details using `this.getConnectionData()`. This will
    return an object whose keys correspond to form input names in `index.html`.
  - Retrieve the connection username with `this.getUsername()`.
  - Retrieve the connection password with `this.getPassword()`.
- __Error handling__
  - Use `this.ajaxErrorHandler` as the method called when jQuery AJAX requests
    fail. This will inform Tableau of the error, and pop an error dialog.


## Deploying

Great! You've built your web data connector, but how do you make it accessible
to Tableau users? Although this generator does setup and some boilerplate for
several deployment strategies, additional work is necessary to actually deploy
the app. Documentation for each option is provided below:

#### Heroku

[Heroku][] is a cloud platform for building, scaling, and delivering apps. You
can spin up a sandbox application for free, though paid tiers are available. If
you selected "Heroku" as your desired deployment strategy with this generator,
everything required to successfully deploy your connector as a NodeJS app on
Heroku is done for you. However, you'll need to perform some setup beforehand.
Details on that below:

- Be sure you have [git][] and the [heroku toolbelt][] installed, then
- Once you have your app working, initialize a git repository with `git init`
- Commit all of your changes: `git add . && git commit -m "Initial commit."`
- If you're not already logged in, do so: `heroku login`
- Create a heroku app: `heroku apps:create name-of-your-app`
- Deploy your app via git: `git push heroku master`
- Ensure at least one instance of the app is running: `heroku ps:scale web=1`
- Visit your connector in a browser: `heroku open`

#### GitHub Pages

[GitHub Pages][] is a free static file hosting service provided by GitHub. It
works by serving files from a special branch (`gh-pages`) on a repository hosted
on the service. If you selected "GitHub Pages" as your desired deployment
strategy with this generator, most everything is taken care of for you in a
special `grunt deploy` task. See below for complete setup details.

- Be sure you have a [GitHub account][] and [git][] installed, then
- Create a [new GitHub repository][] for your connector
- Note your repo's URL, something like `git@github.com:username/repo-name.git`
- If you haven't, initialize a git repo at the root of your connector with the
  following command: `git init`
- Add GitHub as your repo's origin remote with: `git remote add origin [url]`
  where `[url]` is the repo URL you noted above.
- To deploy, run `grunt deploy`
- Visit your connector in a browser at its GitHub pages URL. It will vary
  depending on your GitHub account name and repository name, but look something
  like this: `https://username.github.io/repo-name`


## Contributing

This generator is a perpetual work-in-progress. Your contributions are welcome
and encouraged! For full details, check [CONTRIBUTING.md](CONTRIBUTING.md).


[yeoman]: http://yeoman.io
[NodeJS]: https://nodejs.org/
[grunt-cli]: http://gruntjs.com/using-the-cli
[bower]: http://bower.io/
[cmder]: http://cmder.net/
[install NodeJS]: http://blog.teamtreehouse.com/install-node-js-npm-windows
[Homebrew]: http://brew.sh/
[ExpressJS]: http://expressjs.com/
[JSHint]: http://jshint.com/about/
[Heroku]: https://www.heroku.com
[git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[heroku toolbelt]: https://toolbelt.heroku.com/
[GitHub Pages]: https://pages.github.com/
[GitHub account]: https://github.com/join
[new GitHub repository]: https://github.com/new
