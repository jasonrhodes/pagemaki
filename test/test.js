var expect = require("chai").expect;
var fs = require("fs");
var path = require("path");
var Pagemaki = require("../pagemaki");

var raw = "---\n\
name: Test Name\n\
layout: default\n\
---\n\
<h1>Title</h1>";


describe("Parsing raw page data", function () {

	var maker = new Pagemaki({});

	it("should parse yaml options by default", function (done) {

		maker.parse(raw, function (err, parsed) {

			expect(err).to.be.null;
			expect(parsed).to.be.an('object');

			done();

		});

	});


	it("should parse options", function (done) {

		maker.parse(raw, function (err, parsed) {

			expect(parsed.options).to.be.an('object');
			expect(parsed.options.name).to.equal("Test Name");
			expect(parsed.options.layout).to.equal("default");

			done();

		});

	});


	it("should parse content", function (done) {

		maker.parse(raw, function (err, parsed) {

			expect(parsed.content).to.be.a('string');
			expect(parsed.content).to.equal("<h1>Title</h1>");

			done();

		});
	
	});


});


describe("Templates", function () {

  var testParsed = {
    test: "a test string"
  };

  var testRenderer = function () { 
    return "<h1><%= page.test %></h1>"; 
  };

	it("should render using underscore templates by default", function (done) {

    var maker = new Pagemaki({
      getTemplateString: testRenderer
    });

    maker.render(null, testParsed, function (err, rendered) {

      expect(rendered).to.equal("<h1>a test string</h1>");

      done();

    });

	});

  it("should accept a custom renderer", function (done) {

    var maker = new Pagemaki({
      getTemplateString: testRenderer,
      templateCompile: function (string) {
        return function () { 
          return "removed"; 
        };
      }
    });

    maker.render(null, testParsed, function (err, rendered) {

      expect(rendered).to.equal("removed");

      done();

    });
  
  });

});


// MOAR TESTS 
// var fs = require("fs");
// var Maker = require("./pagemaker");

// var maker = new Maker({
//   templateData: { site: { title: "Not Robotic Ok?" } }
// });

// maker.make(fs.readFileSync("./src/pages/index.html"), function (err, made) {

//   console.log(arguments);

// });