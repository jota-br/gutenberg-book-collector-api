const https = require('https');
const fs = require('fs');

require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 3000;

const server = https.createServer({
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem'),
}, app);

async function startServer() {
    try {
        await mongoConnect();
        server.listen(PORT,  () => {
            console.log(`Server listening to port ${PORT}...`);
        });

    } catch (err) {
        console.log({ error: err });
    }
}

startServer();