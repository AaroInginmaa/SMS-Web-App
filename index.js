const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 80;
const host = "localhost";

const outgoingDirectory = "/var/spool/sms/outgoing/";
const sentDirectory = "/var/spool/sms/sent/";

app.use(bodyParser.json());

app.use(express.static('public'));

// Handle the root path
app.get('/', (req, res) => {
    // Send your HTML file or whatever is appropriate
    res.sendFile(__dirname + '/public/index.html');
});

// Handle POST requests
app.post('/', (req, res) => {
    const receivedData = req.body;
    console.log(receivedData);

    const { phone, msg } = req.body;

    sendsms(phone, msg)
        .then(result => {
            res.json({ result });
            console.log(result);
        })
        .catch((error) => {
            res.status(500).json({ error: `Error sending message` });
            console.error('Error sending message:', error);
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://${host}:${port}`);
});

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
        const filename = makeid(10);
        const filepath = outgoingDirectory + filename;
        const filecontents = `To: ${phone}\nAlphabet: ISO\n\n${msg}`;

        console.log(`File directory: ${outgoingDirectory}`);
        console.log(`File name: ${filename}`);
        console.log(`Path: ${filepath}`);

        if (!fs.existsSync(outgoingDirectory)) {
            reject(`Directory ${outgoingDirectory} does not exist`);
            return;
        }

        if (phone == '' || msg == '') {
            reject("Empty phone number or message");
            return;
        }

        try {
            fs.writeFileSync(filepath, filecontents);
            console.log('File written successfully.');

            // Watch the checked directory for changes
            const watcher = fs.watch(sentDirectory, (event, watchedFilename) => {
                handleFileEvent(event, watchedFilename, filename, watcher, resolve);
            });

            return;
        } catch (error) {
            reject(error);
            return;
        }
    });
}

// Handle file events for the watcher
function handleFileEvent(event, watchedFilename, filename, watcher, resolve) {
    if (event === 'rename' && watchedFilename === filename) {
        console.log(`File: ${filename}\nEvent: ${event}\nPath: ${sentDirectory}`);
        watcher.close(); // Close the watcher
        resolve(`Message ${filename} sent`);
    }
}
