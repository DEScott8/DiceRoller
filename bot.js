var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'intro':
                bot.sendMessage({
                    to: channelID,
                    message: 'This bot is designed to make skill checks using the Shadowrun 5e rules and can make simple success tests, opposed tests, and extended tests. Type !help for info on how to use each one. Written by Daniel Scott, based on the Digital Trends Discord bot tutorial (https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/).'
                });
            break;
            // !help
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Type either !successtest, !opposedtest, or !extendedtest to do skill checks. Type help after each command for help on that command.'
                });
            break;
            // !successtest
            case 'successtest':
                var regexValues = /\d+/g; //Looks for any numbers in the message string.
                var values = message.match(regexValues); //Puts all the digits in regex into an array.
                if (message.substr(13) == 'help') {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Displays the results of a success test and determines whether it was successful or failed. Format: "skill"+"attribute"["limit"]("threshold")'
                    });
                } else if (values.length != 4) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Please insert a value for the skill, attribute, limit, and threshold. (e.g. !successtest 2+2[4](3) or !successtest 2+2 4 3)'
                    });
                } else {
                    var skill = parseInt(values[0]); //Gets skill from text.
                    var attr = parseInt(values[1]); //Gets attribute from text.
                    var limit = parseInt(values[2]); //Gets attribute from text.
                    var thresh = parseInt(values[3]); //Gets threshold from text.
                    var dicePool = skill + attr;
                    var min = 1;
                    var max = 7;
                    var rolls = [];
                    var hits = 0;
                    function wait(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }
                    async function wait2() {
                        await wait(2000);
                    }
                    for (dice = 0; dice < dicePool; dice++) {
                        var random = Math.floor(Math.random() * (+max - +min) + +min);
                        rolls[dice] = random;
                    }
                    for (i = 0; i < rolls.length; i++) {
                        if (rolls[i] >=5) {
                            if (hits < limit) {
                                hits += 1;
                            }
                        }
                    }
                    for (i == 0; i < rolls.length; i++) {
                        if (rolls[i] == 1) {
                            ones += 1;
                        }
                    }
                    var displayRolls = 'Rolls: '
                    rolls.forEach(function(element){
                        displayRolls += element + ' ';
                    });
                    bot.sendMessage({
                        to: channelID,
                        message: '' + displayRolls
                    });
                    wait2();
                    if (hits >= thresh) {
                        if (ones >= (dicePool / 2)) {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You succeeded, but you glitched. Something went wrong...'
                            });
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You succeeded!'
                            });
                        }
                    }
                    else if (ones >= dicePool / 2){
                        if (hits == 0) {
                            bot.sendMessage({
                            to: channelID,
                            message: 'You failed and critically glitched! The drek hits the fan!'
                            });
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You failed and glitched. Something has gone wrong...'
                            })
                        }
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: 'You failed...'
                        });
                    }
                }
            break;
            // !opposedtest
            case 'opposedtest':
                var regexValues = /\d+/g; //Looks for any numbers in the message string.
                var values = message.match(regexValues); //Puts all the digits in regex into an array.
                // Checks to see if the help switch is used
                if (message.substr(13) == 'help') {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Displays number of successes and glitches in an opposed test. Format: "skill"+"attribute"["limit"]'
                    });
                // Checks to make sure text is in the right format.
                } else if (values.length != 3) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Please insert a value for the skill, attribute, and limit (e.g. !opposedtest 2+2[3] or 2 2 3)'
                        });
                } else {
                    var skill = parseInt(values[0]); // Gets skill from text.
                    var attr = parseInt(values[1]); // Gets attribute from text.
                    var limit = parseInt(values[2]); // Gets limit from text.
                    // Sets the dice pool value.
                    var dicePool = skill + attr;
                    // Checks to see if the dice pool is greater than the limit.
                    var min = 1; // Minimum roll on a 6d.
                    var max = 7; // Maximum roll on a 6d.
                    var rolls = []; // Array to store the result of rolls.
                    var hits = 0;
                    var ones = 0;
                    function wait(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }
                    async function wait2() {
                        await wait(2000);
                    }
                    for (dice = 0; dice < dicePool; dice++) {
                        // Generates a random number from 1-6
                        var random = Math.floor(Math.random() * (+max - +min) + +min);
                        // Adds the result of the roll to the array
                        rolls[dice] = random;
                    }
                    // Gets the amount of hits
                    for (i = 0; i < rolls.length; i++) {
                        if (rolls[i] >= 5) {
                            if (hits < limit) {
                                hits += 1;
                            }

                        }
                    }
                    // Counts the amount of 1s rolled
                    for (i = 0; i < rolls.length; i++) {
                        if (rolls[i] == 1) {
                            ones += 1;
                        }
                    }
                    // Displays the result of each roll in chat
                    var displayRolls = 'Rolls: '
                    rolls.forEach(function(element){
                        displayRolls += element + ' ';
                    });
                    bot.sendMessage({
                        to: channelID,
                        message: '' + displayRolls
                    });
                    bot.sendMessage({
                        to: channelID,
                        message: 'You scored ' + hits + ' hits.'
                    });
                    wait2();
                    // Checks for glitches
                    if (ones >= (dicePool / 2)) {
                        // Checks for a critical glitch
                        if (hits == 0) {
                            bot.sendMessage({
                                to: channelID,
                                message: 'CRITICAL GLITCH!!!'
                            });
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: 'You glitched.'
                            });
                        }
                    }
                }
            break;
            // !extendedtest
            case 'extendedtest':
                var regexValues = /\d+/g;
                var values = message.match(regexValues);
                if (message.substr(14) == 'help') {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Determines the result of an extended test. The player may burn edge on any roll. The program assumes 1D6 will be subtracted on a glitch. Format: "skill"+"attribute"["limit"]("threshold")'
                    });
                } else if (values.length != 4) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Please insert a value for the skill, attribute, limit, and threshold. (e.g. !extendedtest 2+2[4](5) or 2+2 4 5)'
                    });
                } else {
                    var skill = parseInt(values[0]);
                    var attr = parseInt(values[1]);
                    var limit = parseInt(values[2]);
                    var thresh = parseInt(values[3]);
                    var dicePool = skill + attr;
                    var min = 1;
                    var max = 7;
                    var rolls = [];
                    var hits = 0;
                    var currentHits = 0;
                    var ones = 0;
                    var timeInterval = 0;
                    var dice = 0;
                    function wait(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }
                    async function wait2() {
                        await wait(2000);
                    }
                    do {
                        timeInterval += 1;
                        for (dice = 0; dice < dicePool; dice++) {
                            var random = Math.floor(Math.random() * (+max - +min) + +min);
                            rolls[dice] = random;
                        }
                        for (i = 0; i < rolls.length; i++) {
                            if (rolls[i] >= 5) {
                                if (currentHits < limit) {
                                    currentHits += 1;
                                    hits += 1;
                                }
                            }
                        }
                        for (i = 0; i < rolls.length; i++) {
                            if (rolls[i] == 1) {
                                ones += 1;
                            }
                        }
                        var displayRolls = 'Rolls for interval ' + timeInterval + ': '
                        rolls.forEach(function(element){
                            displayRolls += element + ' ';
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: '' + displayRolls
                        });
                        wait2();
                        if (ones >= (dicePool / 2)) {
                            if (currentHits == 0) {
                                bot.sendMessage ({
                                    to: channelID,
                                    message: 'You critically glitched!'
                                });
                                wait2();
                                break;
                            } else {
                                random = Math.floor(Math.random() * (+max - +min) + +min);
                                hits -= random;
                                bot.sendMessage ({
                                    to: channelID,
                                    message: 'You glitch and something goes wrong. Your task gets delayed!'
                                });
                                wait2();
                                if (hits <= 0) {
                                    break;
                                }
                            }
                        }
                        if (hits >= thresh) {
                            break;
                        }
                        currentHits = 0;
                        ones = 0;
                        dicePool -= 1;
                        rolls.length = 0;
                    } while(dicePool > 0);
                    if (hits >= thresh) {
                        bot.sendMessage ({
                            to: channelID,
                            message: 'You succeeded completing the task! It took you ' + timeInterval + ' intervals.'
                        });
                    } else {
                        bot.sendMessage ({
                            to: channelID,
                            message: 'You failed the task and wasted ' + timeInterval + ' intervals...'
                        });
                    }
                }
            break;
            default:
                bot.sendMessage ({
                    to: channelID,
                    message: 'Unknown command. Valid commands for this bot include !intro, !help, !successtest, !opposedtest, and !extendedtest.'
                })
         }
     }
});
