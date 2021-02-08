const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

//const render = require('./web-build/render')

app.use(express.static('./web-build'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
