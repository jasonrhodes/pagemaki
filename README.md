![Sushi image by Benjamin Ang and Threadless](http://25.media.tumblr.com/tumblr_lrxx1h20581qzv89bo1_500.jpg)

pagemaki
=============

Very basic static page generation library with a preference for  
* browserify
* sass
* markdown
* gulp


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

Create a new pagemaki and parse this file:

```javascript
var maker = new Pagemaki();

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

```html
<html>
  <head>
    <title>Some title</title>
  </head>
  <body>
    <%= content %>
  </body>
</html>
```

Then when you ran the make function:

```javascript
var maker = new Pagemaki();

maker.make(fs.readFileSync("src/pages/index.html"), function (err, made) {
  console.log(made);
});
```

Results:

```html
<html>
  <head>
    <title>Some title</title>
  </head>
  <body>
    <h1>My Homepage</h1>
  </body>
</html>
```
