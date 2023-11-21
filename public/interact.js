//const { response } = require("express");

window.onload = function() {
    let sendBtn = document.getElementById('submit');
    sendBtn.addEventListener("click", send);
}


function send() {
    let data = {
        phone: document.getElementById('phone').value,
        msg: document.getElementById('msg').value
    };
    
    let node = document.createElement("p");

    // Send the data to server via POST request
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    // Handle the results
    .then(response => {
        console.log(response)
    })
    .then(result => {
        console.log(result);

        node.textContent = result;
        node.setAttribute("class", "p-3 mb-3 bg-primary bg-opacity-10 border border-primary rounded text-black");
        document.getElementById("status-message").appendChild(node);

    })
    .catch(error => {
        console.error(error);
    });
}
