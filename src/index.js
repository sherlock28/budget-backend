const express = require('express');
const config = require('./config/server');

/* Se crea una instancia de app express y se la pasa a la 
funcion config() que sera la encargada de primero configurarla 
y luego retornorla */
const app = config(express());

/* Se inicia la escucha del servidor en el puerto configurado */
// starting 
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});