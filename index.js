const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('/index.html')
})

app.listen(port, () => {
  console.log(`Server up on port ${port}`)
})
