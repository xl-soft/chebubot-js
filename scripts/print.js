const   moment = require('moment'),
        colors = require('@colors/colors'),
        env = require('./env')
        moment.locale('ru')

let emoji = {
    ok: '✅',
    warn: '🚸',
    info: '🔄',
    error: '⛔',
}

let stack = []

function time() {
    let timeStamp = moment().format('LTS');
    return `[${timeStamp}] [${env.PRODUCT_NAME}]`
}

module.exports = {
    ok: (data) => {
        let str = `${time()} ${emoji.ok} ${data}`
        console.log(str.brightGreen);
        stack.push(`[${moment().format('LTS')}] ` + 'OK: ' + str)
    },
    warn: (data) => {
        let str = `${time()} ${emoji.warn} ${data}`
        console.log(str.brightYellow);
        stack.push(`[${moment().format('LTS')}] ` + 'WARN: ' + str)
    },
    info: (data) => {
        let str = `${time()} ${emoji.info} ${data}`
        console.log(str.brightBlue);
        stack.push(`[${moment().format('LTS')}] ` + 'INFO: ' + str)
    },
    error: (data) => {
        let str = `${time()} ${emoji.error} ${data}`
        console.log(str.brightRed);
        stack.push(`[${moment().format('LTS')}] ` + 'ERROR: ' + str)
    },
    line: () => {
        console.log('')
    },
    clear: () => {
        console.clear('')
    },
    stack: () => {
        return stack
    }
} 