# Contribute

Great to have you here! Here's how you can help make this project better.


## Reporting bugs and proposing new features

* Please report any and all bugs to the [issue tracker][]; be sure
  that you label your issue with "bug."
* You can look through the [existing bugs here][]; please be sure to search
  through existing bugs before reporting your own.
* You can help us diagnose and fix existing bugs by asking and providing answers
  for the following:
  * Is the bug reproducible as explained?
  * Is it reproducible in other environments (for instance, on different
    versions of PHP, operating systems, with different packaged libraries, etc)?
  * Are the steps to reproduce the bug clear? If not, can you describe how you
    might reproduce it?
  * Is this bug something you have run into? Would you appreciate it being
    looked into faster?
* You can close fixed bugs by testing old tickets to see if they are still happening.
* You can help bring duplicate bug reports to our attention by cross-linking
  issues.

We'd also love your feedback on features! Please add feature requests in the
same way you add bugs, but use the "enhancement" tag instead. You should also
check [existing feature requests here][] before submitting yours.


## Contributing fixes and features

Pull requests for bug fixes and features are greatly appreciated! Before you
open that pull request up, here are a few tips to make the process smooth:

* Your change should be made in a feature branch based on the default branch. We
  prefer you not commit directly to master or a version branch in your fork.
* A good PR probably includes tests. Details on our test suite and how to run it
  can be found below.

Don't be discouraged! Maintenance for this project is done on work time as
sprint planning and time allows, and on personal time when necessary. Don't
hesitate to ping us via @mention if we're taking unduly long.


## Running tests locally

Although tests run automatically on Travis CI, you probably want to run them
locally as you're developing. Here's a quick guide:

Before you run any tests, be sure you've

* Ensure you've [installed node and npm][],
* Ensure you've `npm install`'d or `npm update`'d,

#### Mocha

Running unit tests couldn't be simpler:

* From the project root, run `npm test`

New tests should be added under `test`.


## Local development...

Run the following commands to clone the repo and allow npm to reference the
local copy, rather than the copy from the upstream.
```sh
git clone git@github.com:tableau-mkt/generator-web-data-connector.git generator-web-data-connector
cd generator-web-data-connector
npm link
```

This allows you to test things out locally by running `yo web-data-connector`.

Once you've run `yo web-data-connector`, you can run `grunt` to start up a local
server that watches for changes to JavaScript files. You can point Tableau at
`http://localhost:9001` to see things in context, or use the simulator provided
by the Tableau Web Data Connector SDK.

[issue tracker]: https://github.com/tableau-mkt/generator-web-data-connector/issues
[existing bugs here]: https://github.com/tableau-mkt/generator-web-data-connector/issues?q=is%3Aopen+is%3Aissue+label%3Abug
[existing feature requests here]: https://github.com/tableau-mkt/generator-web-data-connector/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement
[installed node and npm]: https://docs.npmjs.com/getting-started/installing-node
