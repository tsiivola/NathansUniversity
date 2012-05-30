/*var assert = require('chai').assert;
var evalScheemString = require('../turtle').evalScheemString;

suite('eval', function() {
    test('a number', function() {
        assert.deepEqual(evalScheemString("34"), 34);
        assert.deepEqual(evalScheemString("0"), 0);
    });
    test('an arithmetic expression', function() {
        assert.deepEqual(evalScheemString("(+ 3 4)"), 7);
        assert.deepEqual(evalScheemString("(* 0 (+ 5 4))"), 0);
    });
    test('a comparison', function() {
        assert.deepEqual(evalScheemString("(= 3 3)"), '#t');
        assert.deepEqual(evalScheemString("(< 3 3)"), '#f');
    });
    test('a begin expression', function() {
        assert.deepEqual(evalScheemString("(begin (define a 5) (define b 6) (+ a b))"), 11);
    });
    test('a lambda expression', function() {
        assert.deepEqual(evalScheemString("( (lambda a b c (+ (* a b) c)) 3 4 5 6  7)"), 17);
    });
    test('a stored lambda expression', function() {
        assert.deepEqual(evalScheemString(
"(begin (define min-of-two (lambda a b (if (< a b) a b)))\
 (min-of-two 6 36))"), 6);
    });
    test('a recursive function definition', function() {
        assert.deepEqual(evalScheemString(
"(begin \
  (define factorial \
    (lambda n (if (= n 0) 1 \
                          (* n (factorial (- n 1)))))) \
(factorial 12))"), 479001600);
});
});
*/
