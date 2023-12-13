let node;
function handleResponse(result) {
    node = document.createElement("p");
    document.getElementById("status-message").appendChild(node);
    node.textContent = 'Sending message';
    node.setAttribute("class", "p-3 bg-warning bg-opacity-10 border border-warning rounded text-black");

    if (result['error']) {
        node.textContent = result['error'];
        node.setAttribute("class", "p-3 bg-danger bg-opacity-10 border border-danger rounded text-black");
        return;
    }
    else {
        node.textContent = result['result'];
        node.setAttribute("class", "p-3 bg-success bg-opacity-10 border border-success rounded text-black");
        return;
    }
}