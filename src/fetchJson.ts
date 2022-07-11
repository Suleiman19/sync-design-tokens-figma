// empty for noe

export function getTokens(url: string) {
    fetch(url)
        .then(response => {
            if (response.ok) return response.json()
            else throw response
        })
        .then(data => {
            // emit<FetchJsonHandler>('FETCH_JSON', data)
        })
        .catch(e => console.error(e.message))
    // .finally(() => setshowLoader(false))
}