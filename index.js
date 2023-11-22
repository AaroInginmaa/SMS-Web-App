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
    console.log("GET request received for the root path.");
    // Send your HTML file or whatever is appropriate
    res.sendFile(__dirname + '/public/index.html');
});

// Handle POST requests
app.post('/', (req, res) => {
    console.log("POST request received.");

    const receivedData = req.body;
    console.log("Received data:", receivedData);

    const { phone, msg } = req.body;

    sendsms(phone, msg)
        .then(result => {
            console.log("Message sent successfully:", result);
            res.json({ result });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).json({ error: `Error sending message - ${error}` });
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
        console.log("Sending SMS...");

        const filename = makeid(10);
        const filepath = outgoingDirectory + filename;
        const filecontents = `To: ${phone}\nAlphabet: ISO\n\n${msg}`;

        console.log(`File directory: ${outgoingDirectory}`);
        console.log(`File name: ${filename}`);
        console.log(`Path: ${filepath}`);

        if (!fs.existsSync(outgoingDirectory)) {
            const errorMessage = `Directory ${outgoingDirectory} does not exist`;
            console.error(errorMessage);

            reject(errorMessage);
            return;
        }

        if (phone == '' || msg == '') {
            const errorMessage = "Empty phone number or message";
            console.error(errorMessage);
            
            reject(errorMessage);
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
            console.error('Error writing file:', error);
            
            reject(`Error writing file - ${error}`);
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
    return;
}
