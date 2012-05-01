var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

fs.readFile('scheem.peg', 'ascii', function(err, data) {
    // Show the PEG grammar file
    console.log(data);
    // Create my parser
    parse = PEG.buildParser(data).parse;
    // Do a test
    assert.strictEqual(parse("56"), 56);
    assert.strictEqual(parse("0"), 0);
    assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
    assert.deepEqual( parse("(a (b c))"), ["a", ["b", "c"]] );
    assert.deepEqual( parse("(+ (* (+ b c) 5 6))"), ["+", ["*", ["+", "b", "c"], 5, 6]] );
    assert.deepEqual( parse("(+   (*  (+  b c)  5 6))"), ["+", ["*", ["+", "b", "c"], 5, 6]] );
    assert.deepEqual( parse("(+   (  *  ( +  b c  ) 5 6))"), ["+", ["*", ["+", "b", "c"], 5, 6]] );
    assert.deepEqual( parse("\
(+ (* \
   (+ b c)\
   5 6))"),
                    ["+", ["*", ["+", "b", "c"], 5, 6]] );
    assert.deepEqual( parse("\
;; factorial\n\
(define factorial (n) ;; takes one argument n \n\
    ;; this is the body of the function\n\
    (* n\
       (factorial (- n 1))))\
;; factorial\n\
"),
                    ["define", "factorial", ["n"], ["*", "n", ["factorial", ["-", "n", 1]]]]);
    assert.deepEqual(parse("'asdf"), ["quote", "asdf"]);
    assert.deepEqual(parse("'(a (b c))"), ["quote", ["a", ["b", "c"]]]);
    assert.deepEqual(parse("(a '(b c))"), ["a", ["quote", ["b", "c"]]]);
});



