let hints = {
    user: [],
    admin: []
}


module.exports = {
    add: (command, description) => {
        hints.user.push(`"чебу ${command}" - ${description}\n`)
    },
    get: () => {
        return hints.user.join('')
    },
    admin: {
        add: (command, description) => {
            hints.admin.push(`"чебу админ ${command}" - ${description}\n`)
        },
        get: () => {
            return hints.admin.join('')
        }
    }
}