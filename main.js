var request = require("request");
var chalk = require('chalk');
var fs = require('fs');

fs.writeFileSync('./output/nitro.txt', '');
fs.writeFileSync('./output/invalid.txt', '');
fs.writeFileSync('./output/verified.txt', '');
fs.writeFileSync('./output/unverified.txt', '');

const tokens = fs.readFileSync('tokens.txt', 'utf-8').replace(/\r/gi, '').split("\n");

var verifiedArr = [];
var unverifiedArr = [];
var invalidArr = [];
var nitroArr = [];

var i = 0;

setInterval(function()
{
    if(i >= tokens.length) 
    {
        fs.writeFileSync('./output/unverified.txt', unverifiedArr.toString().replaceAll(",", ""));
        fs.writeFileSync('./output/invalid.txt', invalidArr.toString().replaceAll(",", ""));
        fs.writeFileSync('./output/verified.txt', verifiedArr.toString().replaceAll(",", ""));
        fs.writeFileSync('./output/nitro.txt', nitroArr.toString().replaceAll(",", ""));
        console.log("Finished!");
        process.exit(1);
    }
    check(tokens[i]);
    console.clear();
    console.log("[" + chalk.yellow("Nitro: ") + nitroArr.length +"] " + "[" + chalk.blue("Verified: ") + verifiedArr.length +"] [" + chalk.red("Invalid: ") + invalidArr.length +"] [" + chalk.gray("Unverified: ") + unverifiedArr.length +"] ");
    i++;
}, 500);

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
        if(!json.id)  
        {
            unverifiedArr.push(token + "\n");
        }
        else if(!json.verified) 
        {
            invalidArr.push(token + "\n");
        }
        else
        {
            verifiedArr.push(token + "\n");
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
            nitroArr.push(token + "\n");
        }
    });
}