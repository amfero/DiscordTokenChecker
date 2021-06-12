var request = require("request");
var chalk = require('chalk');
var fs = require('fs');

fs.writeFileSync('./output/nitro.txt', '');
fs.writeFileSync('./output/invalid.txt', '');
fs.writeFileSync('./output/verified.txt', '');
fs.writeFileSync('./output/unverified.txt', '');

const tokens = fs.readFileSync('tokens.txt', 'utf-8').replace(/\r/gi, '').split("\n");

var verified = 0;
var unverified = 0;
var invalid = 0;
var nitro = 0;

var i = 0;

setInterval(function()
{
    if(i >= tokens.length) 
    {
        console.log("Finished!");
        process.exit(1);
    }
    check(tokens[i]);
    console.clear();
    console.log("[" + chalk.yellow("Nitro: ") + nitro +"] " + "[" + chalk.blue("Verified: ") + verified +"] [" + chalk.red("Invalid: ") + invalid +"] [" + chalk.gray("Unverified: ") + unverified +"] ");
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
            unverified++;
            fs.appendFile('./output/unverified.txt', token + "\n", (err) => { if (err) throw err; });
        }
        else if(!json.verified) 
        {
            invalid++;
            fs.appendFile('./output/invalid.txt', token + "\n", (err) => { if (err) throw err; });
        }
        else
        {
            verified++;
            fs.appendFile('./output/verified.txt', token + "\n", (err) => { if (err) throw err; });
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
            nitro++;
            fs.appendFile('./output/nitro.txt', token + "\n", (err) => { if (err) throw err; });
        }
    });
}