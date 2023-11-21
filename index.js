const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { error } = require('console');

const app = express();
const port = 80;
const host = "localhost";

const sentdir = "/var/spool/sms/sent/";
const outdir = "/var/spool/sms/outgoing/";

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
	// Handle the root path (send your HTML file or whatever is appropriate)
	res.sendFile(__dirname + '/public/index.html');
});


app.post('/', (req, res) => {
	const receivedData = req.body;
	console.log(receivedData);
	const { phone, msg } = req.body;

    let filename = makeid(10);

	send(filename, phone, msg)
		.then(result => {
            res.write({result});
            console.log(result);
        })
		.catch(error => {
			res.write(500).json({ error: `Error queueing message: ${error}` });
			console.error('Error queueing message:', error);
		});
    check(filename, sentdir)
        .then(result => {
            res.write({result});
            console.log(result);
        })
        .catch(error => {
            res.write(500).json({ error: `Error sending message: ${error}` });
        });
});

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



function send(filename, phone, msg) {
    const filepath = outdir + filename;
    let filecontents = `To: ${phone}\nAlphabet: ISO\n\n${msg}`;

    try {
        fs.writeFileSync(filepath, filecontents);
        console.log('File written successfully.');
        return Promise.resolve(`Message ${filename} queued`);
    } catch (error) {
        return Promise.reject(`Error queueing message ${filename}`);
        //throw error;
    }
}

// Function to check and send SMS
function check(filename) {
    return new Promise((resolve, reject) => {
        try {
            const watcher = fs.watch(sentdir, (event, watchedFilename) => {
                if (event === 'rename' && watchedFilename === filename) {
                    console.log(`File: ${filename}\nEvent: ${event}\nPath: ${sentdir}`);
                    resolve(`Message ${filename} sent`);
                    watcher.close(); // Close the watcher
                }
            });
        }
        catch(error) {
            reject(`Error sending message ${filename}`);
            throw error;
        }
    });
}