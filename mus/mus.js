var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('mus.peg', 'ascii', function(err, data) {
    // Show the PEG grammar file
    console.log(data);
    // Create my parser
    parse = PEG.buildParser(data).parse;
    // Do a test
    assert.deepEqual( parse("d,4"), { "tag" : "note", "pitch" : "d3", "dur" : 496 });
    assert.deepEqual( parse("d-"),  { "tag" : "note", "pitch" : "d-4", "dur" : 496 });
    assert.deepEqual( parse("g+8"), { "tag" : "note", "pitch" : "g+4", "dur" : 248 });
});



