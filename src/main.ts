import { on, once, showUI } from '@create-figma-plugin/utilities'
import { createPaintstyles, formatTokens, updateExistingStyles } from './tokenHandler'
import { FetchJsonHandler } from './types'
import { flattenJsonObject } from './utils'

export default function () {

  once('IMPORT_ERROR', (msg) => {
    figma.notify(msg, { timeout: 3000, error: true })
  })

  on<FetchJsonHandler>('FETCH_JSON', (casing, tokenData) => {
    console.log(tokenData)
    // Flatten JSON objects (hierarchy) & returns formatted token names
    const flattenedData = flattenJsonObject(tokenData)
    const formattedData = formatTokens(flattenedData, casing);
    console.log(formattedData)
    // Ready to create figma styles
    // Check if existing styles match with tokens; update values if different
    const newTokens = updateExistingStyles(formattedData)
    // Take remainder of tokens (unmatched) to create figma styles
    createPaintstyles(newTokens)
  })

  const options = { width: 240, height: 400 }
  showUI(options)
}
