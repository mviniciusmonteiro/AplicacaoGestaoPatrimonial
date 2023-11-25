import express from 'express';
import { router } from './routes'

const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();
app.use('/uploads', express.static('uploads'));

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(8000, () => {console.log("Server is running on port 8000...")})