module.exports = {
    randomize: (cock) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}