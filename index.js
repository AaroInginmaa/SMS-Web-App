const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 80;
const host = "localhost";

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

	sendsms(phone, msg)
		.then(result => {
            res.json({result});
        })
		.catch((error) => {
			res.status(500).json({ error: 'Error sending message' });
			console.error('Error sending message:', error);
		});
});

app.listen(port, () => {
		console.log(`Server listening at http://${host}:${port}`);
});

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

function sendsms(phone, msg) {
    return new Promise((resolve, reject) => {
        const outpath = "/var/spool/sms/outgoing/";
        const checkdir = "/var/spool/sms/checked/";
        const filename = makeid(10);
        const filepath = outpath + filename;
        const checkpath = checkdir + filename;
        const filecontents = "To: " + phone + "\nAlphabet: ISO\n\n" + msg;
        
        console.log(`File directory: ${outpath}`);
        console.log(`File name: ${filename}`);
        console.log(`Path: ${filepath}`);
        
        if (!fs.existsSync(outpath)) {
            reject(`Directory ${outpath} does not exist`);
            console.log(reject);
            return;
        }

        try {
            fs.writeFileSync(filepath, filecontents);
            console.log('File written successfully.');

            // Watch the checked directory for changes
	    	const watcher = fs.watch(checkdir, (event, watchedFilename) => {
                if (event === 'rename' && watchedFilename === filename + ".LOCK") {
                    console.log(`File: ${filename} | Event: ${event}`);	
                    resolve('Message queued');
                    console.log(resolve);
                    watcher.close(); // Close the watcher
	    		}
	    	})

            return;
        } catch (error) {
            console.error('Error writing file:', error);
            reject(error);
            return;
        } finally {
            return;
        }
    });
}
