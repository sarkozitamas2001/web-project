import express from 'express';
import * as auth from '../auth/middleware.js';
import * as palyakdb from '../db/palyak.js';
import * as felhasznalokdb from '../db/felhasznalok.js';
import * as fenykepekdb from '../db/fenykepek.js';

const router = express.Router();

router.get(['/', '/index'], async (req, res) => {
  try {
    const palyak = await palyakdb.getPalyak();
    res.render('index', { palyak });
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.get('/palyak/:id', async (req, res) => {
  try {
    const [palya, kepek] = await Promise.all([palyakdb.getPalya(req.params.id),
      fenykepekdb.getFenykepekBypalyaID(req.params.id)]);
    res.render('details', {
      palya: palya[0],
      kepek,
    });
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.get('/foglalas', auth.authorize(1), async (req, res) => {
  try {
    const [palyak, felhasznalok] = await Promise.all([palyakdb.getPalyak(),
      felhasznalokdb.getFelhasznalok()]);
    res.render('foglalas', {
      palyak,
      felhasznalok,
    });
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.get('/modositas', auth.authorize(1), async (req, res) => {
  try {
    res.render('modositas', { message: '' });
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

export default router;
