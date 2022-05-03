import {
	Client,
	Intents,
	MessageEmbed
} from 'discord.js';
import ipv4 from 'public-ip';
import 'dotenv/config';
import gdig from 'gamedig';
import moment from 'moment';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS]
});

client.on('ready', async () => {
    const channel = client.channels.cache.get(process.env.channel_id);
	await channel.bulkDelete(100, true);
    const timeStart = new Date();

    function truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    };

    const embeded = new MessageEmbed()
        .setColor('#ffeb3b')
        .setTitle("PH Ascendants Minecraft Server")
        .setDescription("Battle mobs, construct shelter, and explore the landscape—it’s all in a day’s work when you try to survive and thrive in Survival Mode.")
        .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROBPr8KuYanX3FwExoxcePgjy007yyhcgHuQ&usqp=CAU")


    channel.send({
        embeds: [embeded]
    }).then((msg) => {
        setInterval(async function() {
            var ip = await ipv4.v4();
            await gdig.query({
                type: 'minecraftping',
                host: ip,
                port: process.env.port
            }).then(async (state) => {
                const embed = new MessageEmbed()
                    .setColor('#ffeb3b')
                    .setTitle("PH Ascendants Minecraft Server")
                    .setDescription("Battle mobs, construct shelter, and explore the landscape—it’s all in a day’s work when you try to survive and thrive in Survival Mode.")
                    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROBPr8KuYanX3FwExoxcePgjy007yyhcgHuQ&usqp=CAU")
                    .addFields({
                        name: 'Status',
                        value: (state)? 'Online' : 'Offline',
                        inline: true
                    }, {
                        name: 'Server IP',
                        value: '' + state.connect,
                        inline: true
                    },   {
                        name: 'Vote Link',
                        value: '[Vote Now!](https://minecraftlist.org/)',
                        inline: true
                    },{
                        name: 'Players',
                        value: '' + state.players.length + '/'+state.maxplayers,
                        inline: true
                    });
                    
                if(state.players.length > 0){
                embed.addField('\u200B', '**Player List**', false);
                }

                state.players.slice(-13).forEach(element => {
                    if(element.name === '' ) return embed.addField('<:man_detective:961722924329488424> Unknown', '<:clock1:961922700069203988> 00:00', true);
                    embed.addField('<:man_detective:961722924329488424> ' + truncate(element.name), '<:clock1:961922700069203988> ' + moment(timeStart).fromNow() , true);
                })

                await msg.edit({
                    embeds: [embed]
                });
            })
        }, 5000);
    });
});


client.login(process.env.token);