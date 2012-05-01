var assert = require('chai').assert;
var evalScheem = require('../scheem').evalScheem;

suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });
});

suite('Arithmetic:', function() {
    test('addition', function() {
        assert.deepEqual(
            evalScheem(['+', 4, 3], {}),
            7
        );
    });
    test('subtraction', function() {
        assert.deepEqual(
            evalScheem(['-', 4, 3], {}),
            1
        );
    });
    test('multiplication', function() {
        assert.deepEqual(
            evalScheem(['*', 3, 4], {}),
            12
        );
    });
    test('division', function() {
        assert.deepEqual(
            evalScheem(['/', 3, 4], {}),
            3/4
        );
    });
    test('+,-,*,/ combination', function() {
        assert.deepEqual(
            evalScheem(['+', ['-', 3, ['/', ['*', 3, 5], 15]], 4], {}),
            6
        );
    });
});

suite('Begin and varibles:', function() {
    test('Define variables and perform arithmetic', function() {
        assert.deepEqual(
            evalScheem(['begin',
                            ['define', 'a', 7],
                            ['define', 'b', 8],
                            ['+', 'a', 'b']], {}),
            15
        );
    });
    test('Change a variable and perform arithmetic', function() {
        assert.deepEqual(
            evalScheem(['begin',
                            ['define', 'a', 7],
                            ['set!', 'a', 8],
                            ['+', 'a', 7]], {}),
            15
        );
    });
    test('Throw error if try to change using define', function() {
        assert.throws(
            function() { evalScheem(['begin',
                            ['define', 'a', 7],
                            ['define', 'a', 8],
                            ['+', 'a', 7]], {}); }
        );
    });
    test('Throw error if try to define using set!', function() {
        assert.throws(
            function() { evalScheem(['begin',
                            ['define', 'a', 7],
                            ['set!', 'b', 8],
                            ['+', 'a', 'b']], {}); }
        );
    });
});
