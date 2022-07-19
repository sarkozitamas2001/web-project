import dbConnection from './connection.js';

export const getFelhasznalok = () => {
  const query = 'SELECT * FROM felhasznalok';
  return dbConnection.executeQuery(query);
};

export const getFelhasznaloIDByUsername = (username) => {
  const query = 'SELECT felhasznaloID FROM felhasznalok where felhasznaloNev = ?';
  const options = [username];
  return dbConnection.executeQuery(query, options);
};

export const getFelhasznaloByUsername = (username) => {
  const query = 'SELECT felhasznaloID, felhasznaloNev, jelszo, email, Nev, szerep FROM felhasznalok where felhasznaloNev = ?';
  const options = [username];
  return dbConnection.executeQuery(query, options);
};

export const insertFelhasznalo = (nev, email, felhasznaloNev, jelszo, szerep) => {
  const query = `INSERT INTO felhasznalok VALUES (default,
    ?, ?, ?, ?, ?);`;
  const options = [nev, email, felhasznaloNev, jelszo, szerep];
  return dbConnection.executeQuery(query, options);
};

export const deleteAllFelhasznalok = () => {
  const query = 'DELETE FROM felhasznalok';
  return dbConnection.executeQuery(query);
};

export const updateQuery = (name, uname, email, passw, olduname) => {
  const query = 'update felhasznalok set Nev = ?, felhasznaloNev = ?, email = ?, jelszo = ? where felhasznaloNev = ?';
  const options = [name, uname, email, passw, olduname];
  return dbConnection.executeQuery(query, options);
};
