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
        '         var dXML = new DOMParser();',
        '         dXML.async = false;',
        '         svgElement = dXML.parseFromString(\'<svg xmlns="http://www.w3.org/2000/svg" version="1.1">\' + content + \'</svg>\', "text/xml").documentElement;',
        '         svgElement.setAttribute("style", "position: absolute;left:-999px;top:-999px;width: 0px;height: 0px; overflow: hidden");',
        '         document.body.appendChild(svgElement);',
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
