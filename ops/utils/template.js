////////////////////////////////////////////////////
//// Move to utils or something.
////////////////////////////////////////////////////

/**
 * Parse query string into object.
 * @param   {String|undefined} query String to parse
 *                                   If undefined, location search
 *                                   is used.
 * @return  {Object}       Query string object.
 * @private
 */
function _resolvePropertyChain(target, path, defaultValue) {
    if (!target || !path) return defaultValue;
    path = path.split('.');
    // console.warn('path', path, target);
    var l = path.length,
        i = 0,
        p = '';
    for (; i < l; ++i) {
        p = path[i];
        if (target.hasOwnProperty(p)) target = target[p];
        else return defaultValue;
    }
    return target;
};

/**
 * Simplte string interpolation function.
 * @param   {String} template
 * @param   {Object} context
 * @param   {String} otag     Open tag
 * @param   {String} ctag     Close tag
 * @return  {String}
 * @private
 */
function _template(template, context, otag, ctag) {
    if (!template) return '';
    if (!context) return template;

    otag = otag || '{{', ctag = ctag || '}}';

    template = template.split('.').join('\\.');

    function replaceTokens() {
        var prop = arguments[1];
        prop = prop.replace(/\\/g, '');
        return _resolvePropertyChain(context, prop, otag + prop + ctag);
    }

    return template.replace(new RegExp(otag + '([^}\\r\\n]*)' + ctag, 'g'), replaceTokens)
                   .replace(/\\./g, '.');
};

function _needsInterpolation(key, otag, ctag) {
    otag = otag || '{{', ctag = ctag || '}}';
    if (!key || typeof key !== 'string') return false;
    return !!key.match(new RegExp(otag + '([^}\\r\\n]*)' + ctag, 'g'));
};

module.exports = _template;