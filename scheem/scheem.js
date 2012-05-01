var arithmetic = function(expr, env) {
    switch (expr[0]) {
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) -
                   evalScheem(expr[2], env);
        case '*':
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) /
                   evalScheem(expr[2], env);
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

var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
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
            for(i=1;i<n; i++) {
                evalScheem(expr[i], env);
            }
            return evalScheem(expr[i], env);;
        case 'define':
            if (env[expr[1]]) throw new Error("Attempted re-definition of: " + expr[1]);
            env[expr[1]] = evalScheem(expr[2], env); return 0;
        case 'set!':
            if (!env[expr[1]]) throw new Error("Attempted set! of non-existing variable: " + expr[1]);
            env[expr[1]] = evalScheem(expr[2], env); return 0;
        case 'cons':
            return [evalScheem(expr[1], env)].concat(evalScheem(expr[2], env));
        case 'car':
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            return evalScheem(expr[1], env).slice(1);
    }
};



module.exports.evalScheem = evalScheem;
