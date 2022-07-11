import { Token } from "./types";
import { getRgbColor, removeValue } from "./utils";
import formatVariableName from "./variableFormatter";

/**
 * Find local paint styles and update them with fetched styles
 * 
 * @param {Array<Token}
 * @returns array of new tokens to create figma styles from
 */
export function updateExistingStyles(tokens: Array<Token>) {
    const paintStyles = figma.getLocalPaintStyles()
    // new tokens will update existing tokens
    // need this to create new styles later
    let newTokens = tokens

    // For each token, check if a paint style exists
    tokens.map(token => {
        const style = paintStyles.find(style => style.name === token.name)

        console.log(`token: ${token.name}, style: ${style?.name} `)
        // Found a match
        if (style) {
            // convert color format and update existing style
            const color = getRgbColor(token.value)
            if (color != null) {
                const tokenPaint: SolidPaint = { type: "SOLID", color }

                // style values don't match — update local style
                if (style.paints[0] !== tokenPaint) {
                    style.paints = [tokenPaint]
                    // once local style is updated, remove from new tokens
                    // this avoids creating a new (duplicate) style
                    newTokens = newTokens.filter(item => item !== token)
                }
            }
        }
    })
    return newTokens
}

/**
 * Creates local figma paint styles from tokens
* @param {Array<Token} token - list of 'new' tokens that don't exist as Figma styles yet
*/
export function createPaintstyles(tokens: Array<Token>) {
    tokens.map((token) => {
        const style = figma.createPaintStyle()
        style.name = token.name
        const color = getRgbColor(token.value)
        if (color !== null) {
            const paint: SolidPaint = { type: "SOLID", color }
            style.paints = [paint]
        }
    })
}

/**
     * Returns a list of formatted tokens.
     * Converts all "." separators to "-". 
     * Removes "color" prefix from token names.
     * 
     * @todo Convert 1st param.value to param/value?
     * 
     * @param {*} data flattened json object
     * @param {*} casing 
     * @returns {Array<Token>} formatted tokens list
     */
export function formatTokens(data, casing: string) {
    const values = Object.values(data)
    const keys = Object.keys(data)

    // to store & return formatted tokens list
    let colors: Array<Token> = []
    for (var i = 0; i < keys.length; i++) {
        var key = removeValue(keys[i])
        // remove "color." prefix at the start
        key = key.substring(key.indexOf('.') + 1)
        // remove "," at end of string (weird)
        key = key.substring(0, key.length - 1)

        // name is now ready to be transformed to any variable naming convention
        let formattedTokenName = formatVariableName(key, casing)

        colors.push({ name: formattedTokenName, value: String(values[i]) })
    }
    return colors
}