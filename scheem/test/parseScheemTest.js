var assert = require('chai').assert;
var parseScheem = require('../scheem').parseScheem;

suite('parse', function() {
    test('a number', function() {
        assert.strictEqual(parseScheem("56"), 56);
        assert.strictEqual(parseScheem("0"), 0);
    });
    
    test('a list', function() {
        assert.deepEqual( parseScheem("(a b c)"), ["a", "b", "c"] );
        assert.deepEqual( parseScheem("(a (b c))"), ["a", ["b", "c"]] );
    });
    
    test('whitespace', function() {
        assert.deepEqual( parseScheem("(+   (*  (+  b c)  5 6))"), ["+", ["*", ["+", "b", "c"], 5, 6]] );
        assert.deepEqual( parseScheem("(+   (  *  ( +  b c  ) 5 6))"), ["+", ["*", ["+", "b", "c"], 5, 6]] );
    });
    
    test('comments', function() {
        assert.deepEqual( parseScheem("\
;; factorial\n\
(define factorial (n) ;; takes one argument n \n\
    ;; this is the body of the function\n\
    (* n\
       (factorial (- n 1))))\
;; factorial\n\
"), ["define", "factorial", ["n"], ["*", "n", ["factorial", ["-", "n", 1]]]]);
    });
    
    test('quote', function() {
        assert.deepEqual(parseScheem("'asdf"), ["quote", "asdf"]);
        assert.deepEqual(parseScheem("'(a (b c))"), ["quote", ["a", ["b", "c"]]]);
        assert.deepEqual(parseScheem("(a '(b c))"), ["a", ["quote", ["b", "c"]]]);
    });
    
});
