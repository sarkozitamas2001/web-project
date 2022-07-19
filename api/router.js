import express from 'express';
import formidable from 'formidable';
import * as fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as auth from '../auth/middleware.js';
import * as palyakdb from '../db/palyak.js';
import * as felhasznalokdb from '../db/felhasznalok.js';
import * as foglalasokdb from '../db/foglalasok.js';
import * as fenykepekdb from '../db/fenykepek.js';
import { secret } from '../util/constants.js';

const router = express.Router();

router.post('/feldolgoz', auth.authorize(0), async (request, response) => {
  try {
    await palyakdb.insertPalya(request.body);
    response.status(200);
    response.set('Content-Type', 'text/plain;charset=utf-8');
    response.redirect('/');
  } catch (err) {
    response.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.post('/feltolt/:id', auth.authorize(0), async (request, response) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(request, async (err, fields, files) => {
      const oldpath = files.imageUpload.filepath;
      const newpath = `C:/Users/sarko/Desktop/WebProg/HF/lab-stim2076/static/uploadDir/${files.imageUpload.originalFilename}`;
      fs.rename(oldpath, newpath, async (error) => {
        if (error) throw error;

        await fenykepekdb.insertFenykep(request.params.id, files.imageUpload.originalFilename);

        response.status(200);
        response.set('Content-Type', 'text/plain;charset=utf-8');
        response.redirect(`/palyak/${request.params.id}`);
      });
    });
  } catch (error) {
    response.status(500).render('error', { message: `Selection unsuccessful: ${error.message}` });
  }
});

function checkHour(dateTime, existingTime) {
  if ((parseInt(existingTime[0], 10) === parseInt(dateTime[0], 10) + 1
  && parseInt(existingTime[1], 10) < parseInt(dateTime[1], 10))) {
    return true;
  }
  if ((parseInt(existingTime[0], 10) + 1 === parseInt(dateTime[0], 10)
  && parseInt(existingTime[1], 10) > parseInt(dateTime[1], 10))) {
    return true;
  }
  return false;
}

function checkIfFree(date, foglalasok) {
  for (let i = 0; i < foglalasok.length; i += 1) {
    if (date === foglalasok[i].idopont) {
      return false;
    }
    const tmp = foglalasok[i].idopont.split('T');
    const dateSplited = date.split('T');
    if (tmp[0] === dateSplited[0]) {
      const tmp1 = tmp[1].split(':');
      const time = dateSplited[1].split(':');
      if (tmp1[0] === time[0]) {
        return false;
      }
      if (checkHour(time, tmp1) === true) {
        return false;
      }
    }
  }
  return true;
}

router.use('/berel', auth.authorize(1), async (request, response) => {
  try {
    const userID = await felhasznalokdb.getFelhasznaloIDByUsername(response.locals.uname);
    const foglalasok = await foglalasokdb.getFoglalasok(request.body.palyaID);

    if (!checkIfFree(request.body.idopont, foglalasok)) {
      response.status(500).render('error', { message: 'Mar letezik foglalas ezen az idoponton!' });
    } else {
      await foglalasokdb.insertFoglalas(
        userID[0].felhasznaloID,
        request.body.palyaID,
        request.body.idopont,
      );

      response.status(200);
      response.set('Content-Type', 'text/plain;charset=utf-8');
      response.redirect('/foglalas');
    }
  } catch (err) {
    response.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.delete('/message/:reservationID', auth.authorize(1), async (req, res) => {
  try {
    await foglalasokdb.deleteFoglalas(req.params.reservationID);
    res.status(204);
    res.send();
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.get('/message/:palyaID', async (req, res) => {
  try {
    let userID = -1;
    if (req.cookies.auth) {
      const tmp = await felhasznalokdb.getFelhasznaloIDByUsername(res.locals.uname);
      userID = tmp[0].felhasznaloID;
    }
    const a = await foglalasokdb.getFoglalasok(req.params.palyaID);
    res.send(JSON.stringify({ a, userID }));
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.post('/modosit', auth.authorize(1), async (req, res) => {
  try {
    const felhasznalo = await felhasznalokdb.getFelhasznaloByUsername(res.locals.uname);
    let felhaszValtozott = 0;
    if (req.body.nevModosit !== '') {
      felhasznalo[0].Nev = req.body.nevModosit;
    }
    if (req.body.emailModosit !== '') {
      felhasznalo[0].email = req.body.emailModosit;
    }
    if (req.body.unameModosit !== '') {
      if (req.body.unameModosit !== felhasznalo[0].felhasznaloNev) {
        felhaszValtozott = 1;
      }
      felhasznalo[0].felhasznaloNev = req.body.unameModosit;
    }
    if (req.body.jelszoModosit !== '') {
      felhasznalo[0].jelszo = await bcrypt.hash(req.body.jelszoModosit, 10);
    }
    await felhasznalokdb.updateQuery(
      felhasznalo[0].Nev,
      felhasznalo[0].felhasznaloNev,
      felhasznalo[0].email,
      felhasznalo[0].jelszo,
      res.locals.uname,
    );
    if (felhaszValtozott === 1) {
      res.clearCookie('auth');
      const token = jwt.sign({
        username: felhasznalo[0].felhasznaloNev,
        role: felhasznalo[0].szerep,
      }, secret);
      res.cookie('auth', token, { httpOnly: true, sameSite: 'strict' });
    }
    res.redirect('/modositas');
  } catch (err) {
    console.error(err);
    res.status(500);
    res.render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

export default router;
