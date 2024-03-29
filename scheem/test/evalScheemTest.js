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
    test('exceptions', function() {
        assert.throws( function() { evalScheem(['+', 'a', 5], {}) });
        assert.throws( function() { evalScheem(['+', '4', 'bb'], {}) });
        assert.throws( function() { evalScheem(['-', '4', '5', '6'], {}) });
        assert.throws( function() { evalScheem(['-', '11'], {}) });
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

suite('List operations:', function() {
    test('Cons an element to a list', function() {
        assert.deepEqual(
            evalScheem(['cons', 1, ['quote', [2, 3, 4, 5]]], {}), [1,2,3,4,5]);
    });
    test('Get the first element of list (car)', function() {
        assert.deepEqual(
            evalScheem(['car', ['quote', [2, 3, 4, 5]]], {}), 2);
    });
    test('Get the rest of list (cdr)', function() {
        assert.deepEqual(
            evalScheem(['cdr', ['quote', [2, 3, 4, 5]]], {}), [3,4,5]);
    });
});

suite('List operations:', function() {
    test('Cons an element to a list', function() {
        assert.deepEqual(
            evalScheem(['cons', 1, ['quote', [2, 3, 4, 5]]], {}), [1,2,3,4,5]);
    });
    test('Get the first element of list (car)', function() {
        assert.deepEqual(
            evalScheem(['car', ['quote', [2, 3, 4, 5]]], {}), 2);
    });
    test('Get the rest of list (cdr)', function() {
        assert.deepEqual(
            evalScheem(['cdr', ['quote', [2, 3, 4, 5]]], {}), [3,4,5]);
    });
});

suite('Comparison:', function() {
    test('Equals', function() {
        assert.deepEqual(evalScheem(['=', 1, 1], {}), '#t');
        assert.deepEqual(evalScheem(['=', 1, 2], {}), '#f');
    });
    test('Greater than', function() {
        assert.deepEqual(evalScheem(['>', 2, 1], {}), '#t');
        assert.deepEqual(evalScheem(['>', 1, 2], {}), '#f');
    });
    test('Less than', function() {
        assert.deepEqual(evalScheem(['<', 1, 2], {}), '#t');
        assert.deepEqual(evalScheem(['<', 2, 1], {}), '#f');
    });
});

suite('Conditional if:', function() {
    test('Return different value depending on condition', function() {
        assert.deepEqual(evalScheem(['if', '#t', 1, 2], {}), 1);
        assert.deepEqual(evalScheem(['if', '#f', 1, 2], {}), 2);
    });
    test('Evaluate only one branch depending on condition', function() {
        assert.deepEqual(evalScheem(['begin',
                                        ['define', 'a', 1],
                                        ['define', 'b', 2],
                                        ['if', '#t',
                                            ['set!', 'a', 3],
                                            ['set!', 'b', 4]],
                                        ['+', 'a', 'b']],
        {}), 5);
        assert.deepEqual(evalScheem(['begin',
                                        ['define', 'a', 1],
                                        ['define', 'b', 2],
                                        ['if', '#f',
                                            ['set!', 'a', 3],
                                            ['set!', 'b', 4]],
                                        ['+', 'a', 'b']],
        {}), 5);
    });
});
