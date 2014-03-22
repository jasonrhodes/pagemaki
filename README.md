![Sushi image by Benjamin Ang and Threadless](http://25.media.tumblr.com/tumblr_lrxx1h20581qzv89bo1_500.jpg)  
_Illustration credit: Benjamin Ang/Threadless_

pagemaki
=============

Pagemaki is a very basic static page generation library, meant to convert a combination of static content files with meta data (very much like basic Jekyll) and templated layout files into static HTML files that work for GitHub Pages hosting and other static HTML web servers.

_Note: If you use gulp, be sure to checkout the [gulp-pagemaki plugin](https://github.com/jasonrhodes/gulp-pagemaki)_


## More of this shit? Why?

I built pagemaki because I needed to get quick little sites up on GitHub Pages but I still wanted to use CommonJS and Browserify, Sass for CSS, and let gulp do my builds so that I don't have to repeat template boilerplate.

This library doesn't do much out of the box--you have to set it up to do what you want.

## Quick Start

Assume you have a file structure something like this:

```
gulpfile.js
package.json
public/
src/
  sass/
  js/
  pages/
    index.html
    dir/
      subpage.html
```

You can easily write a gulp task to stream your sass and js to be compiled and dropped into some 'assets' folder in your public folder, but if you want to manage those pages easily, tough.

With pagemaki, you can tell your build system to take everything in the src/pages directory and copy it over to your public folder, too, keeping the folder structure intact. You can also use layout templates and jekyll-like YAML variables in your page files, like so:

```
# src/pages/index.html

---
title: Homepage
layout: default
---
# My Homepage
```

Create a new pagemaki and parse this file (currently, by default content is unparsed but you can pass in a content parser function to convert Markdown, for instance, as seen below):

```javascript
var maker = new Pagemaki({
  contentParse: function (string) {
    return myFavoriteMarkdownParser.parse(string);
  }
});

maker.parse(fs.readFileSync("src/pages/index.html"), function (err, parsed) {
  console.log(parsed);
});
```

Would print the following:

```javascript
{
  options: {
    title: "Homepage",
    layout: "default"
  },
  content: "<h1>My Homepage</h1>"
}
```

Whereas you can also tell pagemaki to "make" a page, too, which parses and then attempts to drop the content into the layout described in the options. So if you had a `layouts/default.html` file like this:

```underscore
<html>
  <head>
    <title><%= page.title || "Untitled" %></title>
  </head>
  <body>
    <%= content %>
  </body>
</html>
```

Then when you ran the make function:

```javascript
var maker = new Pagemaki({
  contentParse: function (string) {
    return myFavoriteMarkdownParser.parse(string);
  }
});

maker.make(fs.readFileSync("src/pages/index.html"), function (err, made) {
  console.log(made);
});
```

Results:

```html
<html>
  <head>
    <title>Homepage</title>
  </head>
  <body>
    <h1>My Homepage</h1>
  </body>
</html>
```

## API

### `var maki = new Pagemaki(options)`

Constructor function sets up the Pagemaki instance you'll use for 'parsing' input files and 'making' output files.

##### Available options

**optionsCheck** _(boolean)_  
default: true

> Set to false if you don't want Pagemaki to look for options content in the input files.

**optionsDelimiter** _(string)_  
default: "---"

> If you're parsing options, you can set the regex delimiter to whatever you want. Anything _between_ the delimiters will be passed to the `optionsParse` function. 
> 
> _Note: If you want to use JSON, you can't use `{` as a delimiter since the delimiters are stripped from the options string before it's passed to_ `optionsParse`

**optionsParse** _(function)_
```javascript
// default
function (string) {
  return yaml.safeLoad(string);
}
```

> Pass in a custom parsing function that takes a string and returns an options object. `options.layout` needs to be set if you're going to use the `make` function available in Pagemaki, but if you only want to use `parse`, you can pass back any kind of object you want.

**contentParse** _(function)_
```javascript
// default
function (string) {
  return string;
}
```

> Pass in a custom content-parsing function that takes a string and returns a template-parsed string. Very useful for dropping page content into an outer layout. By default, it just passes the string back but if you want to parse for markdown, do that here.
>
> TODO: Make this function able to parse in different ways according to a file's .extension

**templatesDir** _(string)_  
default: path.join(process.cwd(), "src", "layouts")

> Where Pagemaki can find the layout templates accessed by the `layout` option, which has to be returned as a string with the key of 'layout' in the options object that is returned by `optionsParse`

**templateCompile** _(function)_
```javascript
// default
function (string) {
  return _.template(string);
}
```

> Pass in a custom template compiling function that takes a template string, compiles it, and returns a function with a signature of fn({})

**templateData** _(object)_  
default: {}

> Any data passed in here will be passed along to every template (don't use 'content', 'page', or 'layout' as they will be overwritten)
>
> TODO: Maybe put these in a nested object to avoid overwrite problems with content, page, layout, etc.
