var convertPitch = function(p) {
    return { "c":0,
      "d":2,
      "e":4,
      "f":5,
      "g":7,
      "a":9,
      "b":11 }[p[0]] + (p[1]*1+1)*12;
};

var endTime = function(t, e) {
    if (e.tag === 'note' || e.tag === 'res')
        return t+e.dur;
    if (e.tag === 'seq')
        return endTime(endTime(t, e.left), e.right);
    if (e.tag === 'par') {
        return Math.max(
            endTime(t, e.left), endTime(t, e.right));
    }
    if (e.tag === 'repeat')
        return t + e.count * endTime(0, e.section);
};

var compileT = function(t, e) {
    if (e.tag === 'note')
        return [ { tag: 'note', pitch: convertPitch(e.pitch),
                 start: t, dur: e.dur } ];
    if (e.tag === 'seq') 
        return compileT(t, e.left).concat( compileT(endTime(t, e.left), e.right) );
    if (e.tag === 'par')
        return compileT(t, e.left).concat( compileT(t, e.right) );
    if (e.tag === 'res')
        return [];
    if (e.tag === 'repeat') {
        var tmp_a = [];
        var tmp_t = endTime(0, e.section);
        for (var i=0; i < e.count; i+=1) {
            tmp_a = tmp_a.concat( compileT(t, e.section ) );
            t += tmp_t;
        }
        return tmp_a;
    }
};

var compile = function (musexpr) {
    return compileT(0, musexpr);
};


var melody_mus =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'res', dur: 250 } },
      right: {
        tag: 'repeat',
        section: { tag: 'seq',
            left: { tag: 'note', pitch: 'c4', dur: 500 },
            right: { tag: 'note', pitch: 'd4', dur: 500 } },
        count: 2 }
};

var repeat_mus = { tag: 'repeat',
  section: { tag: 'note', pitch: 'c4', dur: 250 },
  count: 3 };

console.log(melody_mus);
console.log(compile(melody_mus));
console.log(endTime(0, repeat_mus));
console.log(compile(repeat_mus));
