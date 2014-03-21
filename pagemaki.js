var fs = require("fs");
var yaml = require("js-yaml");
var _ = require("underscore");
var path = require("path");


/** 
 * Defaults object
 * 
 */
var defaults = {
  optionsCheck: true,
  optionsDelimiter: "---",
  optionsParse: function (string) {
    return yaml.safeLoad(string);
  },
  contentParse: function (string) {
    return string;
  },
  getTemplateString: function (name) {
    return fs.readFileSync(path.join(__dirname, "..", "src", "layouts", name + ".html")).toString();
  },
  templateCompile: function (string) {
    return _.template(string);
  },
  templateData: {}
};



/**
 * Constructor for the Pagemaki class
 * 
 * @param {[type]} config [description]
 */
var Pagemaki = function (config) {
  this.templates = {};
  this.config = _.extend({}, defaults, config);
  this.config.optionsRegex = new RegExp("^" + this.config.optionsDelimiter + "([\\S\\s]+)" + this.config.optionsDelimiter + "([\\S\\s]+)");
};



/**
 * Get a cached template by name, or from disk and then cache for later
 * 
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Pagemaki.prototype.getTemplate = function (name) {

  if (!this.templates[name]) {
    this.templates[name] = this.config.templateCompile(this.config.getTemplateString(name));
  }

  return this.templates[name];

};



/**
 * Parse out the string and look for options, content
 * 
 * @param  {[type]}   string   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Pagemaki.prototype.parse = function (string, callback) {

  var data = {};
  var matches = this.config.optionsCheck && this.config.optionsRegex.exec(string);

  if (matches) {
    data.options = this.config.optionsParse(matches[1]);
    data.content = this.config.contentParse(matches[2].trim());
  } else {
    data.options = false;
    data.content = this.config.contentParse(string.trim());
  }

  callback(null, data);

};



/**
 * Use the rendering function to create static string
 * 
 * @param  {[type]}   err      [description]
 * @param  {[type]}   parsed   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Pagemaki.prototype.render = function (err, parsed, callback) {

  if (err) {
    callback(err);
    return;
  }

  var layout = (parsed.options && parsed.options.layout) || "default";
  var render = this.getTemplate(layout);

  this.config.templateData.page = parsed;

  callback(null, render(this.config.templateData));

};



/**
 * Putting it all together using the parsed options, content,
 * and templates to compile static HTML
 * 
 * @param  {[type]}   string   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Pagemaki.prototype.make = function (string, callback) {

  var self = this;

  this.parse(string, function (err, parsed) {

    self.render(err, parsed, callback);

  });

};


module.exports = Pagemaki;
