var sendBtn = document.getElementById('submit');

window.onload = function() {
    sendBtn = document.getElementById('submit');
    sendBtn.addEventListener("click", send);
}

function send() {
    timeout(sendBtn, 5000);

    let data = {
        phone: document.getElementById('phone').value,
        msg: document.getElementById('msg').value
    };
    
    let node = document.createElement("p");
    document.getElementById("status-message").appendChild(node);
    node.textContent = 'Sending message';
    node.setAttribute("class", "p-3 bg-warning bg-opacity-10 border border-warning rounded text-black");

    // Send the data to server via POST request
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // Handle the results
    .then(response => response.json())
    .then(result => {
        console.log(result);

        if (result['error']) {
            node.textContent = result['error']
            node.setAttribute("class", "p-3 bg-danger bg-opacity-10 border border-danger rounded text-black");
        }
        else {
            node.textContent = result['result']
            node.setAttribute("class", "p-3 bg-success bg-opacity-10 border border-success rounded text-black");
        }

    })
    .catch(error => {
        console.error(error);
    });
}

function timeout(obj, interval) {
    obj.disabled = true;
    setTimeout(function() {
        obj.disabled = false;
    }, interval);
}