module.exports = function greet(user) {
    let greetengs =  [`Доброе утро, ${user}`,`Добрый день, ${user}`,`Добрый вечер, ${user}`,`Доброй ночи, ${user}`]; let greetengsString
    let day = new Date(); let hour = day.getHours()
    if (hour>=5 && hour<12) { greetengsString = greetengs[0] }; if (hour>=0 && hour<5) { greetengsString = greetengs[3] }; if (hour>=12 && hour<18) { greetengsString = greetengs[1]}; if (hour>=18 && hour<24) {greetengsString = greetengs[2]}
    return greetengsString
}