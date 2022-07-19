import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as felhaszdb from '../db/felhasznalok.js';
import { secret } from '../util/constants.js';

const router = express.Router();

// roles: 0 = admin, 1 = user

router.post('/login', async (req, res) => {
  try {
    const felhasznalo = await felhaszdb.getFelhasznaloByUsername(req.body.felhasznalonev);
    if (felhasznalo.length === 1) {
      if (req.body.felhasznalonev === felhasznalo[0].felhasznaloNev
         && await bcrypt.compare(req.body.jelszo, felhasznalo[0].jelszo)) {
        const token = jwt.sign({
          username: felhasznalo[0].felhasznaloNev,
          role: felhasznalo[0].szerep,
        }, secret);
        res.cookie('auth', token, { httpOnly: true, sameSite: 'strict' });
        res.redirect('/index');
      } else {
        res.redirect('../login.html');
      }
    } else {
      res.redirect('../login.html');
    }
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
});

router.post('/logout', async (req, res) => {
  if (req.cookies.auth) {
    res.clearCookie('auth');
    res.status(200).redirect('/index');
  } else {
    res.status(200).redirect('/index');
  }
});

router.post('/regis', async (req, res) => {
  try {
    const hashedPassw = await bcrypt.hash(req.body.jelszo, 10);
    await felhaszdb.insertFelhasznalo(
      req.body.nev,
      req.body.email,
      req.body.felhasznalonev,
      hashedPassw,
      1,
    );
    res.status(200).redirect('/index');
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

export default router;
