const fileInput = document.getElementById('input');
const sendBtn2 = document.getElementById('submit2');
sendBtn2.addEventListener("click", send);

let finalData = { phone, msg };

fileInput.addEventListener("change", () => {
	let data = readFile()
	data.then( (result) => {
		let parsed = parse(result, ',');
		finalData.phone = parsed;
		console.log(parsed);
	});
});

function send() {
	finalData.msg = document.getElementById('msg').value;
	console.log(`Phone numbers: ${finalData.phone}\nMessage: ${finalData.msg}`)

	fetch('/', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
		body: JSON.stringify(finalData)
	})
	.then(response => response.json())
    .then(result => {
        console.log(result);
        
        handleResponse(result);
        
    })
    .catch(error => {
        console.error(error);
    });
}

function parse (data, delimiter) {
	parsedData = data
	.replaceAll(' ', '')
	.replaceAll(/(\r\n|\n|\r)/gm, '')
	.split(delimiter)

	if (parsedData[parsedData.length - 1] == '') { parsedData.pop(); }

	return parsedData;
}

function readFile() {
	return new Promise((resolve, reject) => {

		file = fileInput.files[0];
		
		if (file) {
			let reader = new FileReader();
			
			reader.onload = (event) => {
				resolve(String(event.target.result));
			};
			reader.onerror = (event) => {
				reject(event);
			}
			reader.readAsText(file);
		}
		else {
			console.log('No file selected');
			return;
		}
	});
}
