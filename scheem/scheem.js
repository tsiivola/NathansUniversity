var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('scheem.peg', 'ascii', function(err, data) {
    // Show the PEG grammar file
    console.log(data);
    // Create my parser
    parse = PEG.buildParser(data).parse;
    // Do a test
    assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
    assert.deepEqual( parse("(a (b c))"), ["a", ["b", "c"]] );
    assert.deepEqual( parse("(+ (* (+ b c) 5 6))"), ["+", ["*", ["+", "b", "c"], "5", "6"]] );
    
});



