const discord = require("discord.js");
const fs = require('fs');
const { join } = require("path");
const { fileURLToPath } = require("url");
const config = require("./config.json")
const client = new discord.Client();
var counter = 0;
client.on("ready", () =>{
    console.log(`${client.user.tag} is up and running`)
    console.log(`Prefix = ${config.prefix}`)
    console.log("----------------------------------------")
    client.user.setActivity(`Prefix = ${config.prefix}`,{type:"PLAYING"});
    setInterval(() => {
        counter++;
        var time = counter * 15;
        console.log(`The bot has been running for ${time} minutes`)
    }, 900000);
})
client.on("message", cmd =>{
    if(cmd.content === `${config.prefix}connect`){
        cmd.channel.send({embed: {
            color: 12617727,
            title: "Connection",
            fields: [{
                name: `Put this in your fivem-console`, 
                value: `connect ${config.ip}`
              }
            ],
          }
        });
    }
})
//Cleanup
client.on("message", cmd =>{
  if(cmd.content === `${config.prefix}cleanup`){
    cmd.delete();
    cmd.channel.bulkDelete(10);
    cmd.author.send(`Cleaned 10 messages.`)
  }
})
//Kick/Ban
client.on('message', cmd =>{
  if(cmd.content.startsWith(`${config.prefix}ban`)){
      cmd.delete();
      if(cmd.member.hasPermission("BAN_MEMBERS")){
          const mentioned = cmd.mentions.users.first();
          if(mentioned){
              const member = cmd.guild.members.resolve(mentioned);
              if(member){
                  member.ban();
                  const logcha = cmd.guild.channels.cache.find(channel => channel.name === `${config.botlog}`)
                  logcha.send({embed: {
                      color: 12617727,
                      title: `${member.user.tag}`,
                      fields: [{
                          name: `${member.user.tag} recieved a ban.`, 
                          value: `${cmd.author} = ${cmd.content}`
                        }
                      ],
                    }
                  });
              }
          }else{
            cmd.author.send({embed: {
              color: 12617727,
              title: "No User Specified",
              fields: [{
                  name: `${config.prefix}ban`, 
                  value: `You did not specify a user`
                }
              ],
            }
          });
          }
      }else{
        cmd.author.send({embed: {
          color: 12617727,
          title: "No Permission",
          fields: [{
              name: `${config.prefix}ban`, 
              value: `You do not have permission to ban people.`
            }
          ],
        }
      }); 
      }
  }
})
client.on('message', cmd =>{
  if(cmd.content.startsWith(`${config.prefix}kick`)){
      cmd.delete();
      if(cmd.member.hasPermission("KICK_MEMBERS")){
          const mentioned = cmd.mentions.users.first();
          if(mentioned){
              const member = cmd.guild.members.resolve(mentioned);
              if(member){
                  member.kick();
                  const logcha = cmd.guild.channels.cache.find(channel => channel.name === `${config.botlog}`)
                  logcha.send({embed: {
                      color: 12617727,
                      title: `${member.user.tag}`,
                      fields: [{
                          name: `${member.user.tag} recieved a kick.`, 
                          value: `${cmd.author} = ${cmd.content}`
                        }
                      ],
                    }
                  });
              }
          }else{
            cmd.author.send({embed: {
              color: 12617727,
              title: "No User Specified",
              fields: [{
                  name: `${config.prefix}kick`, 
                  value: `You did not specify a user`
                }
              ],
            }
          });
          }
      }else{
        cmd.author.send({embed: {
          color: 12617727,
          title: "No Permission",
          fields: [{
              name: `${config.prefix}kick`, 
              value: `You do not have permission to kick people.`
            }
          ],
        }
      });
      }
  }
})
//WARNING-SYSTEM
client.on("guildMemberAdd", member =>{
    if (fs.existsSync(`./wdatabase/${member.id}.txt`)) {
        
    } else {
        fs.createWriteStream(`./wdatabase/${member.id}.txt`)   
    }
    const rank = member.guild.roles.cache.find(role => role.name === `${config.joinrank}`);
    member.roles.add(rank);
})

client.on("message", cmd =>{
    if(cmd.content.startsWith(`${config.prefix}warn`)){
        if(cmd.member.hasPermission("KICK_MEMBERS")){
            const mentioned = cmd.mentions.users.first();
            if(mentioned){
                cmd.delete();
                const member = cmd.guild.members.resolve(mentioned);
                const doc = member.id;
                const oldw = fs.readFileSync(`./wdatabase/${doc}.txt`);
                fs.writeFileSync(`./wdatabase/${doc}.txt`, `${oldw}\n${cmd.content}`);
                cmd.author.send(`${member} has been warned.`)
                const logcha = cmd.guild.channels.cache.find(channel => channel.name === `${config.botlog}`)
                logcha.send({embed: {
                    color: 12617727,
                    title: `${member.user.tag}`,
                    fields: [{
                        name: `${member.user.tag} recieved a warning.`, 
                        value: `${cmd.content}`
                      }
                    ],
                  }
                });
            }else{
            cmd.delete();
            cmd.author.send({embed: {
                color: 12617727,
                title: "No User Specified",
                fields: [{
                    name: `${config.prefix}warn`, 
                    value: `You did not specify a user`
                  }
                ],
              }
            });
        }
        }else{
            cmd.delete();
            cmd.author.send({embed: {
                color: 12617727,
                title: "No Permission",
                fields: [{
                    name: `${config.prefix}warn`, 
                    value: `You do not have permission to warn people.`
                  }
                ],
              }
            });
        }
    }
})
client.on("message", cmd =>{
    if(cmd.content.startsWith(`${config.prefix}wdata`)){
        if(cmd.member.hasPermission("KICK_MEMBERS")){
            const mentioned = cmd.mentions.users.first();
            if(mentioned){
                cmd.delete();
                const member = cmd.guild.members.resolve(mentioned);
                const doc = member.id;
                const data = fs.readFileSync(`./wdatabase/${doc}.txt`);
                cmd.author.send({embed: {
                    color: 12617727,
                    title: `${member.user.tag} warnings`,
                    fields: [{
                        name: `${doc}`, 
                        value: `${data}`
                      }
                    ],
                  }
                });
            }else{
            cmd.delete();
            cmd.author.send({embed: {
                color: 12617727,
                title: "No User Specified",
                fields: [{
                    name: `${config.prefix}warndata`, 
                    value: `You did not specify a user`
                  }
                ],
              }
            });
        }
        }else{
            cmd.delete();
            cmd.author.send({embed: {
                color: 12617727,
                title: "No Permission",
                fields: [{
                    name: `${config.prefix}warndata`, 
                    value: `You do not have permission to check peoples warnings.`
                  }
                ],
              }
            });
        }
    }
})
client.login(config.token)