export const rules = {
    required: value => !!value || 'Required.',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
    publicKey: value => {
        value = value || ''
        const correct = value.length == 66 && ['03', '02'].includes(value.slice(0, 2))
        return correct || "Not a public key."
    },
    minLength: n => value => (value || '').length >= n || "Too short.",
    addressPrefix: value => (value || '').length == 6 || "Not a valid address prefix."
}