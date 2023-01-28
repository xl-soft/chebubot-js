const  { VK, resolveResource } = require('vk-io') 
const anecdote = require('./scripts/skills/anecdote')
const env = require('./scripts/env')
const { HearManager } = require('@vk-io/hear')
const random = require('./scripts/skills/random')
const description = require('./scripts/description')
const path = require('path')
const admin = require('./scripts/admin')
const os = require('os')
const mongoose = require('mongoose')
const print = require('./scripts/print')
const Cock = require('./models/Cock')
const Ban = require('./models/Ban')
const roll = require('./scripts/roll')
const { findOne } = require('./models/Cock')
const vk = new VK({
	token: env.VK_TOKEN,
    apiLimit: 20
});

const message = new HearManager()

async function checkban(id) {
    let ban = await Ban.findOne({id: id})
    if (ban) return false; else return true
}

vk.updates.on('message_new', message.middleware);
vk.updates.start()
print.ok('VK API connected')
mongoose.set('strictQuery', false);
mongoose.connect(env.MONGODB_URI_STRING, () => print.ok('MongoDB is ready'))

// "чебу ослепить" - ослепляет нахуй пользователей с темной темой

description.admin.add('помощь', 'список админ-комманд бота')
message.hear(/^чебу админ помощь$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let user = await vk.api.users.get({user_id: context.senderId});
    if (admin.includes(user[0].id)) {
        await context.send(`Привет ${user[0].first_name}, админ лучшего бота \n Вот список комманд для поддержания моей жизни:`);
        await context.send(`
        Команды:\n
        ${description.admin.get()}`);
    }
})

description.admin.add('чек', 'возвращает данные и статус сервера')
message.hear(/^чебу админ чек$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let user = await vk.api.users.get({user_id: context.senderId});
    if (admin.includes(user[0].id)) {
        await context.send(`Приветствую, о мой дорогой, и всемогущий хозяин - ${user[0].first_name} ${user[0].last_name}`, { 
            attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + '/public/img/admin.png') } }) 
        })
        await context.send(`Вот данные о моих внутренностях~~~`)
        await context.send(`
        В мой сокет влажно вошел ${os.cpus()[0].model} на частоте ${os.cpus()[0].speed / 1000} ГГц, а всем этим добром я играюсь в своей кроватке "${os.version()}"\n
        Моя любимая игрушка NodeJS ${process.version} и представляешь... я играюсь ей уже на протяжении ${Math.round(os.uptime() / 3600)} часов 🥰🥰🥰! \n
        Ладно хозяин, я рассказала как у меня дела, теперь я продолжу быть твоей рабыней, и пахать во славу артстоцки и растущих коков!
        `)
    }
})

description.admin.add('бан причина|ссылка', 'банит пользователя глобально')
message.hear(/^чебу админ бан (.+)$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let user = await vk.api.users.get({user_id: context.senderId});
    let data = {
        query: context.$match[1].split('|'),
        target: ''
    }
    if (admin.includes(user[0].id)) {
        if (context.hasReplyMessage) data.target = context.replyMessage.senderId
        if (data.query[1]) { 
            let link = await resolveResource({api: vk.api, resource: data.query[1]})
            data.target = link.id
        }
        if (admin.includes(data.target) == false) {
            let ban = await Ban.findOne({id: data.target})
            if(!ban) {
                await new Ban({id: data.target, reason: data.query[0]}).save()
                let user = await vk.api.users.get({user_id: data.target});
                await context.send(`Пользователь @id${data.target} (${user[0].first_name} ${user[0].last_name}) был успешно забанен нахуй по причине ${data.query[0]}`, { 
                    attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + '/public/img/ban.png') } }) 
                })
            } else {
                await context.send(`@id${data.target} (Кончелыга) уже был забанен, а забанить в квадрате не получается(`, { 
                    attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + '/public/img/alreadyban.png') } }) 
                })
            }

        }
    }
})

description.admin.add('анбан ссылка', 'разбанивает пользователя глобально')
message.hear(/^чебу админ анбан(.{0,30})$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let user = await vk.api.users.get({user_id: context.senderId});
    let data = {
        query: context.$match[1],
        target: ''
    }
    
    if (admin.includes(user[0].id)) {
        if (context.hasReplyMessage) data.target = context.replyMessage.senderId
        if (data.query) { 
            let link = await resolveResource({api: vk.api, resource: data.query})
            data.target = link.id
        }
        if (admin.includes(data.target) == false) {
            let user = await vk.api.users.get({user_id: data.target});
            let ban = await Ban.findOne({id: data.target})
            if(!ban) {
                await context.send(`Кажись пользователя @id${data.target} (${user[0].first_name} ${user[0].last_name}) в списке банов нет, но я бы забанил`, { 
                    attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + '/public/img/alreadyunban.png') } }) 
                })
            } else {
                await Ban.deleteOne({id: data.target})
                await context.send(`Пользователь @id${data.target} (${user[0].first_name} ${user[0].last_name}) был успешно разбанен и обещает больше не баловатся`, { 
                    attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + '/public/img/unban.png') } }) 
                })
            }

        }
    }
})




description.add('помощь', 'список комманд бота')
message.hear(/^чебу помощь$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let user = await vk.api.users.get({user_id: context.senderId});
	await context.send(`Привет ${user[0].first_name}, помощи не будет, обосрись \n Ну хотя ладно, держи:`);
    await context.send(`
    Команды:\n
    ${description.get()}
    `);
})

description.add('аник', 'генерирует баянистый аник (99% говна)')
message.hear(/^чебу аник$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let id = random.between(1, 1142)
    await context.send(`Рандомный анекдот #${id}\n\n${await anecdote.generate(id)}`, { 
        attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + '/public/img/babka.png') } }) 
    })
})

description.add('пони', 'генерирует нейросетевую поняху')
message.hear(/^чебу пони$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let id = random.between(10000, 99999)
    await context.send(`Рандомная пони #${id}`, { 
        attachment: await vk.upload.messagePhoto({ source: { value: `https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed${id}.jpg` } }) 
    })
})

description.add('фурри', 'генерирует нейросетевую фурсону')
message.hear(/^чебу фурри$/, async context => {
    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let id = random.between(10000, 99999)
    await context.send(`Рандомная фурря #${id}`, { 
        attachment: await vk.upload.messagePhoto({ source: { value: `https://thisfursonadoesnotexist.com/v2/jpgs/seed${id}.jpg` } }) 
    })
})

description.add('кок', 'раз в день позволяет измерить размер кока')
message.hear(/^чебу кок$/, async context => {
    let chat
    chat = "global"
    // if (context.isChat) {
    //      chat = await vk.api.messages.getConversationsById({
    //         peer_ids: context.peerId
    //     }); chat = chat.items[0].chat_settings.title
    // } else {
        
    // }


    let status = {
        location: 'overworld',
        death: false,
        bonus: 0,
        growed: 0,
        current: 0,
        string: {
            start: 'продолжаются',
            state: 'вырос',
            buff: 'не были наложены баффы',
            debuff: 'не были наложены дебаффы',
            history: 'Кок начинает свое приключение, вы очнулись в лесу, что же ожидает вас на этом долгом пути?'
        },
        image: '1_20'
    }


    if (await context.isGroup) return
    if(checkban(context.senderId) == true) return
    let user = await vk.api.users.get({user_id: context.senderId})
    let check = await Cock.findOne({id: user[0].id})
    let next = 86400000
    if (admin.includes(user[0].id)) next = 100
    if (!check) { await new Cock({id: user[0].id, name: `${user[0].first_name}`, next: Date.now(), chat: chat, lenght: 0}).save(); status.string.start = 'начинаются' }
    let cock = await Cock.findOne({id: user[0].id})
    if (cock.next > Date.now()) {
        await context.send(`@id${user[0].id} (${cock.name}), сегодня вы уже измеряли кок.\n Кстати у вас ${cock.lenght}см`)
        return
    }
    status.current = cock.lenght
    status.location = cock.location

    async function trykill(reason) {
        if (roll.death() == true) {
            status.growed = Number(`-${status.current}`)
            status.bonus = 0
            status.current = 0
            status.string.buff = 'положили венок'
            status.string.debuff = 'вы умерли нахуй'
            status.image = '_death'
            if (cock.record < cock.lenght) {
                await Cock.updateOne({id: cock.id}, {next: Date.now() + next, record: cock.lenght})
                status.string.history = `${reason} \n\n Ваш прогресс сброшен с новым рекордом: ${cock.lenght}\n"чебу кок" - начать заново`
            } else {
                await Cock.updateOne({id: cock.id}, {next: Date.now() + next})
                status.string.history = `${reason} \n\n Ваш прогресс сброшен с рекордом: ${cock.record}\n"чебу кок" - начать заново`
            }
        }
    }

    // 0 - 20 см (Внешний мир - 1 часть)
    if (0 <= status.current && status.current <= 20) {
        status.growed = random.between(1, 15)
        status.string.history = `Кок начинает свое приключение, вы очнулись в лесу, что же ожидает вас на этом долгом пути?`
        status.image = '1_20'
    }

    // 21 - 40 см (Внешний мир - 1 часть)
    if (21 <= status.current && status.current <= 40) {
        status.growed = random.between(1, 10)
        status.bonus = random.between(1, 3)
        status.string.buff = `был наложен эффект очищения (+${status.bonus})`
        status.string.history = `Ваши яички заметно вспотели, и вы решили искупнутся. Водичка приятно омывает ваши волосики и вы чувствуете прилив сил`
        status.image = '21_40'
    }

    // 41 - 60 см (Внешний мир - 1 часть)
    if (41 <= status.current && status.current <= 60) {
        status.growed = random.between(1, 15)
        status.string.history = `Ваш кишмиш наконец то был смыт, вы заразили спидом, раком и спидораком реку в которой искупались, а сами боясь позора вылезли в пещере. Тут темно, но вы вытащили из уретры факела и осветили свой путь, надо выбиратся...`
        status.image = '41_60'
        if (roll.buff() == true) {
            status.bonus = random.between(1, 2)
            status.string.buff = `был наложен эффект очищения (+${status.bonus})`
        }
        await trykill(`Пока вы вылезали из реки, ваш яички зацепились за коралл, попытаясь выбратся вы запутались еще сильнее и нахуй задохнулись испустив свои последние соки.`)
    }

    // 61 - 100 см (Внешний мир - 1 часть)
    if (61 <= status.current && status.current <= 100) {
        status.growed = random.between(1, 20)
        status.string.history = `Пещера оказалась глубже чем пизда твоей мамаши, выбратся отсюда будет непросто, но с количеством факелов которое ты вытащил из своей уретры сделать это можно относительно безопасно. И как ты себе пенис ими не обжигаешь...`
        status.image = '61_100'
        if (roll.buff() == true) {
            status.bonus = random.between(1, 1)
            status.string.buff = `был наложен эффект бодрости от капельки холодной воды упавшей на вашу головку с потолка пещеры (+${status.bonus})`
        }
    }

    // 101 - 120 см (Внешний мир - 1 часть)
    if (101 <= status.current && status.current <= 120) {
        status.growed = random.between(-5, 10)
        status.string.history = `Вы выбрались из пещеры и прямо у выхода заметили большое заброшенное поместье. Без раздумий вы зашли туда, но пока выбирались заметно выросли, и гордо выпрямив стоячий пенис пробили головкой потолок, было, немного больно...`
        status.image = '101_120'
        if (roll.debuff() == true) {
            status.bonus = random.between(-3, -1)
            status.string.debuff = `был наложен эффект удара (-${status.bonus})`
        }
    }

    // 121 - 140 см (Внешний мир - 1 часть)
    if (121 <= status.current && status.current <= 140) {
        status.growed = random.between(1, 5)
        status.string.history = `Изучив поместье вы нашли кровать, она слишком мала для вас, но отдохнуть все же получилось`
        status.image = '121_140'
        if (roll.buff() == true) {
            status.bonus = random.between(1, 5)
            status.string.debuff = `был наложен эффект сна (${status.bonus})`
        }
    }

    // 141 - 160 см (Внешний мир - 1 часть)
    if (121 <= status.current && status.current <= 140) {
        status.growed = random.between(1, 5)
        status.string.history = `Изучив поместье вы нашли кровать, она слишком мала для вас, но отдохнуть все же получилось`
        status.image = '121_140'
        if (roll.buff() == true) {
            status.bonus = random.between(1, 5)
            status.string.debuff = `был наложен эффект сна (${status.bonus})`
        }
    }
    
    status.current = status.current + status.growed + status.bonus
    if (status.growed <= 0) status.string.state = 'уменьшился'
    if (status.current <= 0) status.current = 0
    await Cock.updateOne({id: cock.id}, {lenght: status.current, location: status.location, next: Date.now() + next})
    await context.send(`
        @id${user[0].id} (${cock.name}), приключения вашего кока ${status.string.start}\n
        Сегодня на вас ${status.string.buff} и ${status.string.debuff}\n
        Ваш член ${status.string.state} на ${status.growed + status.bonus}см. Теперь его длинна составляет: ${status.current}см\n
        ${status.string.history}\n
        `, 
    { 
        attachment: await vk.upload.messagePhoto({ source: { value: path.join(__dirname + `/public/img/cock/${status.location}/cock${status.image}.png`) } }) 
    })

})

