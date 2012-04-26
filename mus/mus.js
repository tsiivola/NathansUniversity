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
    assert.deepEqual( parse("d-4"),  { "tag" : "note", "pitch" : "d-4", "dur" : 496 });
    assert.deepEqual( parse("g+8"), { "tag" : "note", "pitch" : "g+4", "dur" : 248 });
    assert.deepEqual( parse("g+8 a''16"),
                      {"tag":"seq",
                       "left":{"tag":"note","pitch":"g+4","dur":248},
                       "right":{"tag":"note","pitch":"a6","dur":124}});
    assert.deepEqual( parse("(e'16 a+,32)"),
                      {"tag":"par",
                       "left":{"tag":"note","pitch":"e5","dur":124},
                       "right":{"tag":"note","pitch":"a+3","dur":62}});
    assert.deepEqual( parse("g+8 (e'16 a+,32 g+8) a''16"),
                      {"tag":"seq",
                       "left":{"tag":"note","pitch":"g+4","dur":248},
                       "right":{"tag":"seq",
                                "left":{"tag":"par",
                                        "left":{"tag":"note","pitch":"e5","dur":124},
                                        "right":{"tag":"par",
                                                 "left":{"tag":"note","pitch":"a+3","dur":62},
                                                 "right":{"tag":"note","pitch":"g+4","dur":248}}},
                                "right":{"tag":"note","pitch":"a6","dur":124}}});
    assert.deepEqual( parse("[ g+8 (e'16 a+,32 g+8) a''16 ]3"),
                      {"tag":"repeat",
                       "times":"3",
                       "section":{"tag":"seq",
                                  "left":{"tag":"note","pitch":"g+4","dur":248},
                                  "right":{"tag":"seq",
                                           "left":{"tag":"par",
                                                   "left":{"tag":"note","pitch":"e5","dur":124},
                                                   "right":{"tag":"par",
                                                            "left":{"tag":"note","pitch":"a+3","dur":62},
                                                            "right":{"tag":"note","pitch":"g+4","dur":248}}},
                                           "right":{"tag":"note","pitch":"a6","dur":124}}}});
});



