# Tableau web data connector generator [![Build Status](https://secure.travis-ci.org/tableau-mkt/generator-web-data-connector.png?branch=master)](https://travis-ci.org/tableau-mkt/generator-web-data-connector)

## Notes while in development...

Once cloned, run `npm link` within the working directory. This will allow you to
test things out locally by running `yo web-data-connector`.

Once you've run `yo web-data-connector`, you can run `grunt` to start up a local
server that watches for changes to JavaScript files. You can point Tableau at
`http://localhost:9001` to see things in context.

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-web-data-connector from npm, run:

```bash
npm install -g generator-web-data-connector
```

Finally, initiate the generator:

```bash
yo web-data-connector
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).
