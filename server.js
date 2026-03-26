const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// Conexión con reintentos y tiempo de espera aumentado
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log('-----------------------------------------');
        console.log('✅ ¡CONEXIÓN EXITOSA A MONGODB ATLAS!');
        console.log('-----------------------------------------');
    })
    .catch(err => {
        console.log('❌ ERROR DE CONEXIÓN:');
        console.error(err.message);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en: http://localhost:${PORT}`);
});