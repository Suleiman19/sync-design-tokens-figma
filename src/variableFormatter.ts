
export default function formatVariableName(name: string, casing: string) {
    switch (casing) {
        case 'camel':
            return toCamelCase(name)
        case 'kebab':
            return toKebabCase(name)
        case 'pascal':
            return toPascalCase(name)
        case 'snake':
            return toSnakeCase(name)
        default:
            return toKebabCase(name)
    }
}

export function toPascalCase(str: string) {
    return (' ' + str).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
        return chr.toUpperCase()
    });
}

export function toKebabCase(str: string) {
    // return replaceAll(str, '.', '-')
    return str.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('-');
}

export function toCamelCase(str: string) {
    let newStr = str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (leftTrim: string, index: number) =>
            index === 0 ? leftTrim.toLowerCase() : leftTrim.toUpperCase(),
        )
        .replace(/\s+/g, "")

    return newStr.replace(/[.]+/g, '')
}

export function toSnakeCase(str: string) {
    return str.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map(word => word.toLowerCase())
        .join('_');
}