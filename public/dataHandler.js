var sendBtn, phoneInput, msgInput;

// Initializes variables and sets up the event listener for sendBtn
window.onload = () => {
    sendBtn = document.getElementById('submit');
    phoneInput = document.getElementById('phone');
    msgInput = document.getElementById('msg');

    sendBtn.addEventListener("click", send);
};

// Makes a POST request to server root where the phone number and message is handled and sent
function send() {
    
    let fileInput = document.getElementById('input');
    if (fileInput.files[0]) { return false;}
    
    disableElementForInterval(sendBtn, 5000);

    let data = {
        phone: phoneInput.value,
        msg: msgInput.value
    };

    let node = document.createElement("p");
        document.getElementById("status-message").appendChild(node);
        node.innerHTML = `Sending message to ${phone}`;
        node.setAttribute("class", "p-3 bg-warning bg-opacity-10 border border-warning rounded text-black");


    if (!validatePhone(phoneInput.value)) { return; }


    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
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
    .catch(err =>{
        confirm.error(err);
    })
}

// Validates given phone number
function validatePhone(phone) {
    let phonenoPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    
    if (phone.match(phonenoPattern)) {
        return true;
    }
    else {
        alert("Invalid phone number!");
        return false;
    }
}

// Disables an element for an interval
function disableElementForInterval(element, interval) {
    element.disabled = true;
    setTimeout(function() {
        element.disabled = false;
    }, interval);
}