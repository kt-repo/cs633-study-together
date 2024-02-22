const express = require('express');
const path = require("path");

const app = express();
const port = 8080;

// Serve Angular static files
app.use(express.static('./dist/meetup-app-angular'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/meetup-app-angular/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
