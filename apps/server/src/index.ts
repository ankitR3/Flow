import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router';
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

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use('/api/v1', router);

const server = http.createServer(app);
new WebSocketClass(server);


server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})