var assert = require('chai').assert;
var evalExpr = require('../turtle').evalExpr;

suite('eval', function() {
    test('expressions', function() {
        assert.deepEqual(
            evalExpr({tag:'+', left:34, right:23}, {}),
            57
        );
        assert.deepEqual(
            evalExpr({tag:'+', left:"a", right:23}, {bindings:{"a":34}}),
            57
        );
    });
});

