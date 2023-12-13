const config = require('./config');
const fs = require('fs');

var date = new Date();
var today = formatDate(date, 'dd-mm-yyyy');

function formatDate(date, format) {
    const map = {
        dd: date.getDate(),
        mm: date.getMonth() + 1,
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy|yy/gi, matched => map[matched])
}

// Generate a random string with custom length
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

// Send SMS function
function sendsms(phone, msg) {
    return new Promise((resolve, reject) => {
        console.log('---------------------------------------------------------');
        console.log("Sending SMS...");
        console.log(phone);

        const filename = today + '_' + makeid(config.message.idLength);
        const filepath = config.directories.test + filename;
        const filecontents = `To: ${phone}\nAlphabet: ${config.message.alphabet}\n\n${msg}`;
        
        let errorMessage;

        console.log(`File name: ${filename}`);
        console.log(`File directory: ${config.directories.test}`);
        console.log(`Full Path: ${filepath}`);

        if (!fs.existsSync(config.directories.test)) {
            console.error(`Directory ${config.directories.test} does not exist`);

            reject("Internal Server Error");
            return;
        }

        if (phone == '' || msg == '') {
            errorMessage = "Empty phone number or message";
            console.error(errorMessage);

            reject(errorMessage);
            return;
        }

        try {
            fs.writeFileSync(filepath, filecontents);
            console.log('File written successfully.');

            const watcherC = fs.watch(config.directories.checked, (event, watchedFilename) => {
                checkCheck(event, watchedFilename, filename, watcherC);
            });

            const watcherF = fs.watch(config.directories.failed, (event, watchedFilename) => {
                failedCheck(event, watchedFilename, filename, watcherF, reject);
            });
    
            const watcherS = fs.watch(config.directories.sent, (event, watchedFilename) => {
                sentCheck(event, watchedFilename, filename, watcherS, resolve);
            });

            return;
        }
        catch (error) {
            //console.error(error);

            reject(`Internal Server Error`);
            return;
        }
    });
}

function failedCheck(event, watchedFilename, filename, watcher, reject) {
    if (event === 'rename' && watchedFilename === filename) {
        console.log(`Failed to send message ${filename}`);
        watcher.close();
        reject(`Failed to send message`);
    }
    return false;
}

function sentCheck(event, watchedFilename, filename, watcher, resolve) {
    if (event === 'rename' && watchedFilename === filename) {
        console.log(`Message ${filename} sent`);
        watcher.close();
        resolve(`Message sent`);
    }
    return false;
}

function checkCheck(event, watchedFilename, filename, watcher) {
    if (event === 'rename' && watchedFilename === filename) {
        console.log(`Message ${filename} checked`);
        watcher.close();
    }
    return false;
}

module.exports = { sendsms };