import express from 'express';
import morgan from 'morgan';
import { join } from 'path';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import apiRouter from './api/router.js';
import * as db from './db/createTables.js';
import authRouter from './auth/auth.js';
import requestsRouter from './requests/requests.js';
import { checkJWT } from './auth/middleware.js';

const app = express();

app.use(express.static(join(process.cwd(), 'static/')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'views'));

app.use(morgan('tiny'));

const uploadDir = join(process.cwd(), 'static/uploadDir');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(checkJWT);

app.use('/', requestsRouter);

app.use('/details', requestsRouter);

app.use('/foglalas', requestsRouter);

app.use('/palyak/:id', requestsRouter);

app.use('/modositas', requestsRouter);

app.use('/feldolgoz', apiRouter);

app.use('/feltolt/:id', apiRouter);

app.use('/berel', apiRouter);

app.use('/message/:id', apiRouter);

app.use('/modosit', apiRouter);

app.use('/login', authRouter);

app.use('/logout', authRouter);

app.use('/regis', authRouter);

db.createTable().then(() => {
  app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
});
