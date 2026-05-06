import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import roomRouter from './routers/room.router';
import authRouter from './routers/auth.router';
import chatRouter from './routers/chat.router';
import WebSocketClass from './socket/socket';
import http from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

if(!PORT) {
    console.error('PORT not found');
}

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/api/v1/room', roomRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);

const server = http.createServer(app);
new WebSocketClass(server);


server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});