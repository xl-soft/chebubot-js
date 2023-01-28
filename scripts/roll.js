const random = require("./skills/random");

module.exports = {

    death: () => {
        let rand = random.between(1,17)
        if (rand == random.between(1,17)) return true; else return false
    },
    buff: () => {
        let rand = random.between(1,5)
        if (rand == random.between(1,5)) return true; else return false
    },
    debuff: () => {
        let rand = random.between(1,5)
        if (rand == random.between(1,5)) return true; else return false
    },
    grow: (max) => {
        let lenght = random.between(1,max)
        let boolean = random.between(1,2)
        if (boolean == 1) return Number(lenght); else return Number('-' + lenght)
    },
}