#! /usr/bin/env node

var fs = require("fs");
var u2 = require("uglify-js");

require("../tweeg.js");
require("../runtime.js");
var runtime = TWEEG_RUNTIME();
var t = TWEEG(runtime).init();

var tmpl = fs.readFileSync("./test.html.twig", "utf8");
var ast = t.parse(tmpl);
var code = t.compile(ast);
console.log(code);
var ugly = uglify(code);
console.log(beautify(ugly));
console.log(ugly.length, code.length);
fs.writeFileSync("/tmp/crap.js", beautify(code), "utf8");

var compiled = new Function("return " + code)()(runtime);
console.log("---------------------------");
console.log(compiled.$main({
    links: [
        { url: "http://google.com/", title: "Google" },
        { url: "#", title: "BOGUS" },
        { url: "http://lisperator.net/", title: "Lisperator" },
    ],
    hello: "Hello",
    world: "world"
}));










function beautify(code) {
    var ast = u2.parse(code, {
        expression: true
    });
    return ast.print_to_string({ beautify: true });
}

function uglify(code) {
    var ast = u2.parse(code);
    ast.figure_out_scope();
    ast = ast.transform(u2.Compressor({
        negate_iife  : false,
        pure_getters : true,
        unsafe       : true,
        unsafe_comps : true,
        sequences    : false
    }));
    ast.figure_out_scope();
    ast.compute_char_frequency();
    ast.mangle_names();
    return ast.print_to_string();
}
