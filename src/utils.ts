import { convertHexColorToRgbColor, isValidHexColor } from '@create-figma-plugin/utilities';

/**
 * Takes json object and efficiently flattens it
 * 
 * @param data json Object
 * @returns flattened Object
 */
export function flattenJsonObject(data) {
    var result = {}
    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + "[" + i + "]")
            if (l == 0)
                result[prop] = []
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false
                recurse(cur[p], prop ? prop + "." + p : p)
            }
            if (isEmpty && prop)
                result[prop] = {}
        }
    }
    recurse(data, '')
    return result
}

/**
 * Fallback method for older browsers that don't support String.replaceAll() method
 * 
 * @see https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
 * 
 * @param string 
 * @returns 
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Fallback method for older browsers that don't support String.replaceAll() method
 * @param str 
 * @param find 
 * @param replace 
 * @returns 
 */
export function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 * Every token has ".value" appended. Removes that
 * @param {*} key - token name
 * @returns {String} Token name with "value" label removed
 */
export function removeValue(key) {
    return String(key.split(".value"))
}


/**
 * Takes a hex color string example: '#000000` and returns color in RGB format for Figma
 * 
 * @param color 
 */
export function getRgbColor(hexColor: string) {
    // If hex string has '#' character, remove it
    if (hexColor.charAt(0) === '#')
        hexColor = hexColor.substring(1)

    // Check color validity
    if (isValidHexColor(hexColor))
        return convertHexColorToRgbColor(hexColor)
    else
        return null
}

/**
 * @see https://www.tutorialsrack.com/articles/452/how-to-validate-the-url-in-javascript
 * 
 * @param str 
 * @returns
 */
export function isValidURL(str) {
    var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    } else {
        return false;
    }
}