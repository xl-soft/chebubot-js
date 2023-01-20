const random = require("./random")


module.exports = {
    generate: async (id) => {
        let response = await fetch('https://baneks.ru/' + id)
        let text = await response.text()
        return text.split('<meta name="description" content="')[1].split('">')[0]
    }
}

// всего 1142 анекдота 