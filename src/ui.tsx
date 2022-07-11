import { render, Container, Text, VerticalSpace, Textbox, Button, RadioButtonsOption, RadioButtons, Bold } from '@create-figma-plugin/ui'
import { emit, formatErrorMessage } from '@create-figma-plugin/utilities'
import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import { FetchJsonHandler } from './types'
import { isValidURL } from './utils'


function Plugin() {
    const [url, setUrl] = useState<string>('')
    const [disabled, setDisabled] = useState<boolean>(true)
    const [showLoader, setShowLoader] = useState<boolean>(false)
    const [radioValue, setRadioValue] = useState<string>('kebab')
    const options: Array<RadioButtonsOption> = [
        { children: <Text>Camel</Text>, value: 'camel' },
        { children: <Text>Kebab</Text>, value: 'kebab' },
        { children: <Text>Pascal</Text>, value: 'pascal' },
        { children: <Text>Snake</Text>, value: 'snake' },
    ]

    function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
        const newValue = event.currentTarget.value
        setUrl(newValue)
        setDisabled(newValue.length < 1)
    }

    function handleImportBtnClick() {
        setShowLoader(true)
        // Check if url is valid before executing request
        if (!isValidURL(url)) {
            setShowLoader(false)
            emit('IMPORT_ERROR', formatErrorMessage('URL is not valid!'))
        }
        else
            fetch(url)
                .then(response => {
                    if (response.ok) return response.json()
                    else throw response
                })
                .then(data => {
                    emit<FetchJsonHandler>('FETCH_JSON', radioValue, data)
                })
                .catch(e => {
                    console.error(e.message)
                    emit('IMPORT_ERROR', e.message)
                })
                .finally(() => setShowLoader(false))
    }

    function handleRadioChange(newValue: string) {
        setRadioValue(newValue)
    }

    return (
        <Container space='medium'>
            <VerticalSpace space='medium' />
            <Text><Bold>Tokens json file url</Bold> <span style={{ 'color': 'red' }}>*</span></Text>
            <VerticalSpace space='extraSmall' />
            <Textbox
                required
                variant="border"
                placeholder='https://path/tokens.json'
                value={url}
                onInput={handleInput}
            />
            <VerticalSpace space='large' />

            <Text><Bold>Case type</Bold></Text>
            <VerticalSpace space='medium' />
            <RadioButtons
                onValueChange={handleRadioChange}
                options={options}
                value={radioValue}
            />
            <VerticalSpace space='large' />

            <Button
                fullWidth
                disabled={disabled}
                onClick={handleImportBtnClick}
                loading={showLoader}>
                Import Tokens
            </Button>
        </Container>
    )
}

export default render(Plugin)