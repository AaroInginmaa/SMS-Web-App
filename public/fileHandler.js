const fileInput = document.getElementById('input');
const sendBtn2 = document.getElementById('submit2');
sendBtn2.addEventListener("click", send);

let finalData = { };

fileInput.addEventListener("change", () => {
    let data = readFile(fileInput)
    data.then( (result) => {
        let parsed = parse(result, ',');

        finalData.phone = parsed;
        console.log(parsed);
    });
});

function send() {
    for (let i = 0; i < finalData.phone.length; i++) {

        let node = document.createElement("p");
        document.getElementById("status-message").appendChild(node);
        node.innerHTML = `Sending message to ${finalData.phone[i]}`;
        node.setAttribute("class", "p-3 bg-warning bg-opacity-10 border border-warning rounded text-black");

        finalData.msg = document.getElementById('msg').value;
        console.log(`Phone numbers: ${finalData.phone[i]}\nMessage: ${finalData.msg}`)

        data = {
            phone: finalData.phone[i],
            msg: finalData.msg
        }

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);

            if (result['error']) {
                node.innerHTML = result['error'];
                node.setAttribute("class", "p-3 bg-danger bg-opacity-10 border border-danger rounded text-black");
                return;
            }
            else if (result['result']) {
                node.innerHTML = result['result'];
                node.setAttribute("class", "p-3 bg-success bg-opacity-10 border border-success rounded text-black");
                return;
            }
        })
        .catch(error => {
            console.error(error);
        });
    }
}

function parse(csvText, delimiter) {
    const lines = csvText.split('\n');
    const result = [];

    lines.forEach(line => {
        const values = line.split(delimiter).map(value => {
            // Remove leading and trailing whitespace
            const trimmedValue = value.trim();

            // Remove escape sequences (e.g., double quotes around values)
            return trimmedValue.replace(/^"(.*)"$/, '$1');
        });

        // Remove empty values and concatenate non-empty values to the result array
        const nonEmptyValues = values.filter(value => value !== '');
        result.push(...nonEmptyValues);
    });

    return result;
}

function readFile(fileInput) {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];

        if (!file) {
            console.log('No file selected');
            reject(new Error('No file selected'));
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(String(event.target.result));
        };

        reader.onerror = (event) => {
            reject(event);
        };

        reader.readAsText(file);
    });
}
