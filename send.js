const config = require('./config');
const fs = require('fs');

var date = new Date();
var today = formatDate(date, 'dd-mm-yyyy');

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

function formatDate(date, format) {
    const map = {
        dd: date.getDate(),
        mm: date.getMonth() + 1,
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy|yy/gi, matched => map[matched])
}

// Send SMS function
function sendsms(phone, msg) {
    return new Promise((resolve, reject) => {
        console.log('---------------------------------------------------------');
        console.log("Sending SMS...");

        const filename = today + '_' + makeid(config.message.idLength);
        const filepath = config.directories.outgoing + filename;
        const filecontents = `To: ${phone}\nAlphabet: ISO\n\n${msg}`;
        
        let errorMessage;

        console.log(`File name: ${filename}`);
        console.log(`File directory: ${config.directories.outgoing}`);
        console.log(`Full Path: ${filepath}`);

        if (!fs.existsSync(config.directories.outgoing)) {
            console.error(`Directory ${config.directories.outgoing} does not exist`);

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
            
            const watcherC = fs.watch(checkedDirectory, (event, watchedFilename) => {
                checkCheck(event, watchedFilename, filename, watcherC);
            });
    
            const watcherF = fs.watch(failedDirectory, (event, watchedFilename) => {
                failedCheck(event, watchedFilename, filename, watcherF, reject);
            });
    
            const watcherS = fs.watch(sentDirectory, (event, watchedFilename) => {
                sentCheck(event, watchedFilename, filename, watcherS, resolve);
            });
            
            return;
        }
        catch (error) {
            console.error('Error writing file:', error);
            
            reject(`Error writing file`);
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