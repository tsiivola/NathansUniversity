if (typeof module !== 'undefined') {
    var PEG = require('pegjs');
    var fs = require('fs');
    var parse = PEG.buildParser(fs.readFileSync('turtle.peg').toString()).parse;
} else {
    parse = TURTLE.parse;
}

var lookup = function (env, v) {
    var found = env.bindings[v];
    if (found) { return found; }
    else { 
        if (env.outer)
            return lookup(env.outer, v);
        else return undefined;
    }
};

var update = function (env, variable, value) {
    if (env.bindings[variable] !== undefined)
        env.bindings[variable] = value;
    else {
        if (!env.outer) throw new Error("Attempted to change non-existing value " + variable);
        update(env.outer, variable, value);
    }
};

var declare = function (env, variable) {
    if (env.bindings[variable] === undefined)
        env.bindings[variable] = null;
    else throw new Error("Attempted to declare already declared variable "+ variable);
}

var add_binding = function(env, variable, value) {
    declare(env, variable);
    update(env, variable, value);
}

global_debug = undefined;


var evalExpr = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at tag to see what to do
    switch(expr.tag) {
        case '+': return evalExpr(expr.left, env) + evalExpr(expr.right, env);
        case '-': return evalExpr(expr.left, env) - evalExpr(expr.right, env);
        case '*': return evalExpr(expr.left, env) * evalExpr(expr.right, env);
        case '/': return evalExpr(expr.left, env) / evalExpr(expr.right, env);
        case '<': return evalExpr(expr.left, env) < evalExpr(expr.right, env);
        case '>': return evalExpr(expr.left, env) > evalExpr(expr.right, env);
        case '==': return evalExpr(expr.left, env) == evalExpr(expr.right, env);
        case '!=': return evalExpr(expr.left, env) != evalExpr(expr.right, env);
        case '<=': return evalExpr(expr.left, env) <= evalExpr(expr.right, env);
        case '>=': return evalExpr(expr.left, env) >= evalExpr(expr.right, env);
        case 'call':
            // Get function value
            var func = lookup(env, expr.name);
            // Evaluate arguments to pass
            var ev_args = [];
            for(var i = 0; i < expr.args.length; i+=1) {
                ev_args[i] = evalExpr(expr.args[i], env);
            }
            return func.apply(null, ev_args);
    }
};

var evalStatement = function (stmt, env) {
    switch(stmt.tag) {
        // Declare new variable
        case 'declaration':
            declare(env, stmt.ident);
            return;
        case 'assignment':
            update(env, stmt.variable, stmt.value);
            return;
        case 'call':
            evalExpr(stmt, env); 
            return;
        case 'repeat':
            var l = evalExpr(stmt.cond, env);
            for (var i=0; i<l; i+=1) {
                evalStatements(stmt.body, env);
            }
        case 'define':
            var new_func = function() {
                // This function takes any number of arguments
                var new_env;
                var new_bindings;
                new_bindings = { };
                for(var i = 0; i < stmt.args.length; i++) {
                    new_bindings[stmt.args[i]] = arguments[i];
                }
                new_env = { bindings: new_bindings, outer: env };
                return evalStatements(stmt.body, new_env);
            };
            declare(env, stmt.name);
            update(env, stmt.name, new_func);
            return;
    }
}

var evalStatements = function (seq, env) {
    for(var i = 0; i < seq.length; i++) {
        evalStatement(seq[i], env);
    }
};


// If we are used as Node module, export evalScheem
if (typeof module !== 'undefined') {
    module.exports.parse = parse;
    module.exports.evalExpr = evalExpr;
}
