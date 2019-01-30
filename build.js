/**
 * 编译项目
 */
const rollup = require('rollup');

let version = require('./package.json').version;
let banner =
`/**
 * html-filter
 *
 * @version ${version}
 */`;

async function build() {
    // main
    const bundle = await rollup.rollup({
        input: './src/HtmlFilter.js'
    });
    
    await bundle.write({
        banner: banner,
        format: 'umd',
        name: 'HtmlFilter',
        file: 'index.js'
    });
    
    // dom
    const bundle2 = await rollup.rollup({
        input: './src/XDom.js'
    });
    
    await bundle2.write({
        format: 'iife',
        name: 'XDom',
        file: 'dom.js'
    });
}

// run
build();