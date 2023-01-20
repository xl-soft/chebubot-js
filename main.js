const  { VK } = require('vk-io') 
const anecdote = require('./scripts/anecdote')
const env = require('./scripts/env')
const { HearManager } = require('@vk-io/hear')
const random = require('./scripts/random')
const description = require('./scripts/description')


const vk = new VK({
	token: env.VK_TOKEN,
    apiLimit: 20
});

const message = new HearManager()

vk.updates.on('message_new', message.middleware);

vk.updates.start().catch(console.error);


description.add('помощь', 'список комманд бота')
message.hear(/^чебу помощь$/, async context => {
    if (await context.isGroup) return
    let user = await vk.api.users.get({user_id: context.senderId});
	await context.send(`Привет ${user[0].first_name}, помощи не будет, обосрись \n Ну хотя ладно, держи:`);
    await context.send(`
    Команды:\n
    ${description.get()}
    `);
})

// "чебу кок" - раз в день позволяет измерить размер кока
// "чебу ослепить" - ослепляет нахуй пользователей с темной темой

description.add('аник', 'рандомный баянистый аник (99% говна)')
message.hear(/^чебу аник$/, async context => {
    if (await context.isGroup) return
    let id = random.between(1, 1142)
    await context.send(`Рандомный анекдот #${id}\n\n${await anecdote.generate(id)}`)
    await context.sendPhotos({ value: './public/img/babka.png'})
})
