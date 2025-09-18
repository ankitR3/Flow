import express from 'express';
import dotenv from 'dotenv';
import WebSocketClass from './socket/socket';
import http from 'http';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
    console.error('PORT not found!');
    process.exit(1);
}

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Websocket is running...'
    });
});

const server = http.createServer(app);
new WebSocketClass(server);


server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})