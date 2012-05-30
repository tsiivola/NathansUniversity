var assert = require('chai').assert;
var parse = require('../turtle').parse;

suite('parse', function() {
    test('an assignment', function() {
        assert.deepEqual(parse("v := 56"), [{tag:"assignment", variable:"v", value: 56}]);
        assert.deepEqual(parse("v := 56 + a"), [{tag:"assignment", variable:"v", value: {tag:"+", left:56, right:"a"}}]);
    });
    test('function calls', function() {
        assert.deepEqual(parse("f(); b(fg, fg, fg)"), [{tag:"call", name:"f", args:[]}, {tag:"call", name:"b", args:["fg", "fg", "fg"]}]);
    });
    
});
