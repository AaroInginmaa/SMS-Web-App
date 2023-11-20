window.onload = function() {
    let sendBtn = document.getElementById('submit');
    sendBtn.addEventListener("click", send);
}

const node = document.createElement("p");

function send() {
    let data = {
        phone: document.getElementById('phone').value,
        msg: document.getElementById('msg').value
    };

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
            node.textContent = result['error']
            node.setAttribute("class", "p-3 mb-3 bg-danger bg-opacity-10 border border-danger rounded text-black");
            document.getElementById("form").appendChild(node);
        }
        else {
            node.textContent = result['status']
            document.getElementById("form").appendChild(node);
        }

    })
    .catch(error => {
        console.error(error);
    });
}
