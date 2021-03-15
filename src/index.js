const express = require('express');
const config = require('./config/server');

const app = config(express());

// starting 
app.listen(app.get('port'), () => {
    console.log(`Server listening on port 4000`);
});