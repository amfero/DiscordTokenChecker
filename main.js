var request = require("request");
var chalk = require('chalk');
var fs = require('fs');
var config = require("./config.json");

fs.writeFileSync('./output/nitro.txt', '');
fs.writeFileSync('./output/invalid.txt', '');
fs.writeFileSync('./output/verified.txt', '');
fs.writeFileSync('./output/unverified.txt', '');

const tokens = fs.readFileSync('tokens.txt', 'utf-8').replace(/\r/gi, '').split("\n");

var verifiedArr = [];
var unverifiedArr = [];
var invalidArr = [];
var nitroArr = [];

var acc;

var i = 0;

setInterval(function()
{
    if(i >= tokens.length) 
    {
        fs.writeFileSync('./output/unverified.txt', unverifiedArr.toString().split(",").join(""));
        fs.writeFileSync('./output/invalid.txt', invalidArr.toString().split(",").join(""));
        fs.writeFileSync('./output/verified.txt', verifiedArr.toString().split(",").join(""));
        fs.writeFileSync('./output/nitro.txt', nitroArr.toString().split(",").join(""));
        console.log("Finished!");
        process.exit(1);
    }
    check(tokens[i]);
    console.clear();
    console.log("[" + chalk.yellow("Nitro: ") + nitroArr.length +"] " + "[" + chalk.blue("Verified: ") + verifiedArr.length +"] [" + chalk.red("Invalid: ") + invalidArr.length +"] [" + chalk.gray("Unverified: ") + unverifiedArr.length +"] ");
    i++;
}, config.interval);

function check(token)
{
    request({
        method: "GET",
        url: "https://discordapp.com/api/v7/users/@me",
        headers: 
        {
            authorization: token
        }
    }, (error, response, body) => {
        if(!body) return;
        var json = JSON.parse(body);
        acc = json;
        if(!json.id)  
        {
            invalidArr.push(token + "\n");
        }
        else if(!json.verified) 
        {
            unverifiedArr.push(token + "\n");
        }
        else
        {
            if(config.usernames) verifiedArr.push(token + " | username: " + json.username + "#" + json.discriminator + "\n");
            else verifiedArr.push(token + "\n");
        }
    });

    request({
        method: "GET",
        url: "https://discord.com/api/v7/users/@me/billing/subscriptions",
        headers: 
        {
            authorization: token
        }
    }, (error, response, body) => {
        if(!body) return;
        var json = JSON.parse(body);
        if(json.length == 1) 
        {
            if(config.usernames) nitroArr.push(token + " | username: " + acc.username + "#" + acc.discriminator + "\n");
            else nitroArr.push(token + "\n");
        }
    });
}
