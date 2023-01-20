let array = []

module.exports = {
    add: (command, description) => {
        array.push(`"чебу ${command}" - ${description}\n`)
    },
    get: () => {
        return array.join('')
    }
}