const express = require('express');
console.log('Express loaded successfully');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(3001, () => {
  console.log('Test server running on port 3001');
});