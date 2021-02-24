const app = require("./app");

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto', process.env.PORT);
})