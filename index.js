/*INSTRUCTIONS:
    - Install Node.js
    - Place the entire "nodeServer" folder in your htdocs folder inside XAMPP
    - Start Apache and MySQL services on XAMPP
    - Place files you wish to serve in the "public" subfolder
    - Run the "npm i" commands on rows 12 -> 14 to install dependencies
    - Start the server by running "node .\index.js" while inside the "nodeServer" folder
    - mysql package can be omitted from the code if no database functionality is required
        - To omit mysql, delete rows 14, 19 -> 24
        - Starting up the MySQL service within XAMPP isn't required in this case either
*/

const express = require('express'); //run "npm i express" to include
const cors = require('cors'); //run "npm i corse" to include

const app=express();

const port = 8080;

app.use(cors()); //enable ALL cors requests

//Set app to serve files from this location within the server
app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.send("GET request");
});

app.post("/mail.php", (req,res)=>{
    res.send("POST to mail.php");
})

app.listen(port, '0.0.0.0', ()=>{
    console.log("Server up at port: " + port);
});
