if (typeof module !== 'undefined') {
    var PEG = require('pegjs');
    var fs = require('fs');
    var parseScheem = PEG.buildParser(fs.readFileSync('scheem.peg').toString()).parse;
} else {
    parseScheem = Scheem.parse;
}

var arithmetic = function(expr, env) {
    if (expr.length != 3) throw new Error("Expected 2 arguments to " + expr[0]);
    var e1 = evalScheem(expr[1], env);
    var e2 = evalScheem(expr[2], env);
    if (typeof e1 != 'number' || typeof e2 != 'number')
        throw new Error("Expected numbers for " + expr[0]);
    switch (expr[0]) {
        case '+':
            return e1 + e2;
        case '-':
            return e1 - e2;
        case '*':
            return e1 * e2;
        case '/':
            return e1 / e2;
    }
}

var comparison = function(expr, env) {
    switch (expr[0]) {
        case '=':
            return (evalScheem(expr[1], env) === evalScheem(expr[2], env)) ?
                '#t' : '#f';
        case '<':
            return (evalScheem(expr[1], env) < evalScheem(expr[2], env)) ?
                '#t' : '#f';
        case '>':
            return (evalScheem(expr[1], env) > evalScheem(expr[2], env)) ?
                '#t' : '#f';
    }
}

var lookup = function (env, v) {
    if (env.name === v) return env.value;
    else {
        if (env.outer === undefined) return undefined;
        return lookup(env.outer, v);
    }
};

var env_to_s = function (env) {
    if (env.name === undefined) return "";
    if (env.outer === undefined) return env.name + ":" + env.value;
    return env.name + ":" + env.value + "\n" + env_to_s(env.outer);
};

var expr_to_s = function (expr) {
    if (expr instanceof Array) {
        var s = "(";
        for (var i=0; i<expr.length; i+=1) {
            s += expr_to_s(expr[i]) + " ";
        }
        return s + ")";
    }
    else return "" + expr;
};

var update = function (env, v, val) {
    if (env.name === v) 
        env.value = val;
    else {
        if (!env.outer) throw new Error("Attempted to change non-existing value " + v);
        update(env.outer, v, val);
    }
    return 0;
};

var add_binding = function (env, v, val) {
    return { outer: env, name: v, value: val };
};

var _add_binding = function (env, v, val) {
    env.outer = { outer: env.outer, name: env.name, value: env.value };
    env.name = v;
    env.value = val;
    return env;
};

global_debug = undefined;

var evalScheem = function (expr, env) {
    if (global_debug == true) {
        global_debug = confirm("Evaluating:\n" + expr_to_s(expr) + "\n\nEnvironment:\n" + env_to_s(env));
    }
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        // support for boolean values
        if (expr === '#t' || expr === '#f') return expr;
        var v = lookup(env, expr);
        if (v === undefined) throw new Error(expr + " undefined!");
        return v;
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
        case '-':
        case '*':
        case '/':
            return arithmetic(expr, env);
        case '=':
        case '<':
        case '>':
            return comparison(expr, env);
        case 'quote':
            return expr[1];
        case 'begin':
            var i, n = (expr.length - 1);
            for(i=1;i<n; i+=1) {
                evalScheem(expr[i], env);
            }
            return evalScheem(expr[i], env);
        case 'define':
            if (lookup(env, expr[1])) throw new Error("Attempted re-definition of: " + expr[1]);
            _add_binding(env, expr[1], evalScheem(expr[2], env));
        case 'set!':
            if (!lookup(env, expr[1])) throw new Error("Attempted set! of non-existing variable: " + expr[1]);
            update(env, expr[1], evalScheem(expr[2], env));
        case 'cons':
            return [evalScheem(expr[1], env)].concat(evalScheem(expr[2], env));
        case 'car':
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            return evalScheem(expr[1], env).slice(1);
        case 'if':
            if (evalScheem(expr[1], env) === '#t') return evalScheem(expr[2], env);
            else return evalScheem(expr[3], env);
        case 'lambda':
            return function() {
                var l = expr.length;
                var e = env;
                for (i=1; i<(l-1); i+=1) {
                    e = add_binding(e, expr[i], evalScheem(arguments[i-1], env));
                }
                return evalScheem(expr[i], e);
            };
        default:
            var f = evalScheem(expr[0], env);
            var args = [];
            var l = expr.length;
            for (i=1; i<l; i+=1) {
                args.push(evalScheem(expr[i], env));
            }
            return f.apply(this, args);
    }
};

var evalScheemString = function(scheem_string, env) {
    env = env || {};
    return evalScheem(parseScheem(scheem_string), {});
}

// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.parseScheem = parseScheem;
    module.exports.evalScheem = evalScheem;
    module.exports.evalScheemString = evalScheemString;
}
