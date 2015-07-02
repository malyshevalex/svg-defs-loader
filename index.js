function getExtractedSVG (svgStr) {
    return svgStr.replace(/<\?xml[\s\S]*?>/gi, '')
        .replace(/<!doctype[\s\S]*?>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
}


module.exports = function(content) {
    if (this.cacheable) {
        this.cacheable();
    }
    return [
        'var refs = 0;',
        'var dispose;',
        'var content = ' + JSON.stringify(getExtractedSVG(content)) + ';',
        'module.exports.use = module.exports.ref = function() {',
        '    var svgElement;',
        '    if (!(refs++)) {',
        '         svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");',
        '         document.body.appendChild(svgElement);',
        '         svgElement.innerHTML += content;',
        '         dispose = function() {',
        '              document.body.removeChild(svgElement);',
        '              svgElement = null;',
        '         };',
        '    }',
        '};',
        'module.exports.unuse = module.exports.unref = function() {',
        '    if (!(--refs)) {',
        '        dispose();',
        '        dispose = null;',
        '    }',
        '};',
        'if (module.hot) {',
        '    var lastRefs = module.hot.data && module.hot.data.refs || 0;',
        '    if (lastRefs) {',
        '        exports.ref();',
        '        refs = lastRefs;',
        '    }',
        '    module.hot.accept();',
        '    module.hot.dispose(function(data) {',
        '        data.refs = refs;',
        '        if (dispose) {',
        '            dispose();',
        '        }',
        '    });',
        '}'
    ].join('\n');
};
