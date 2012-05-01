var assert = require('chai').assert;
var evalScheemString = require('../scheem').evalScheemString;

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
});

