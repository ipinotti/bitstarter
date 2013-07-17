#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var sys = require('util');
var rest = require('restler');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var HTMLURL_DEFAULT = "http://agile-tundra-3038.herokuapp.com";
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var HTMLTEMP = "temp.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(exUrl) {
    var instr = rest.get(exUrl).on('complete', function(result) {
		if (result instanceof Error) {
//    			sys.puts('Error: ' + result.message);
		        console.log("%s does not exist. Exiting.", exUrl);
//    			this.retry(5000); // try again after 5 sec
			process.exit(1);
  		}
		//else {
    		//	sys.puts(result);
  		//}
		});
    return instr.toString();
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;	
};

var getJson = function(checkJson) {
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};

var checkUrl = function(result, response) {
//    console.log ("Inside CheckUrl");
    var checksfile = program.checks;
    $ = cheerio.load(result);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
	    out[checks[ii]] = present;
	}
//    console.log("before getJson");
    getJson(out);
    return checkUrl;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))		
    	.option('-u, --url <http://>', 'URL')
        .parse(process.argv);
    
    if (program.file) {
//	console.log ("checkHtmlFile");
	var checkJson = checkHtmlFile(program.file, program.checks);
   	getJson(checkJson);
    	process.exit(1);
    }
    
    if (program.url) {
 //   	console.log ("checkUrl");
        rest.get(program.url).on('complete', checkUrl);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
