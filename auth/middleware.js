import jwt from 'jsonwebtoken';
import { secret } from '../util/constants.js';

// roles: 0 = admin, 1 = user

export function checkJWT(req, res, next) {
  if (req.cookies.auth) {
    res.locals.role = -1;
    if (!res.locals.uname) {
      const decode = jwt.verify(req.cookies.auth, secret);
      res.locals.uname = decode.username;
      res.locals.role = decode.role;
    }
    next();
  } else {
    res.locals.role = -1;
    next();
  }
}

export function authorize(role = [0, 1]) {
  return (req, res, next) => {
    if (!req.cookies.auth) {
      res.status(401);
    } else {
      try {
        if (res.locals.role === 1 && role === 0) {
          res.status(403);
          res.render('error', { message: 'Nincs jogosultsagod!' });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.clearCookie('auth');
        res.status(401).render('error', { message: `${err.message}` });
      }
    }
  };
}
