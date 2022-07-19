import dbConnection from './connection.js';

export const getFoglalasok = (palyaID) => {
  const query = 'SELECT foglalasID, idopont, felhasznaloID FROM foglalasok where palyaID = ?';
  const options = [palyaID];
  return dbConnection.executeQuery(query, options);
};

export const getFoglalas = (req) => {
  const query = 'SELECT palyaID FROM foglalasok where palyaID = ? and idopont = ?';
  const options = [req.palyaID, req.idopont];
  return dbConnection.executeQuery(query, options);
};

export const insertFoglalas = (foglaloID, palyaID, idopont) => {
  const query = 'INSERT INTO foglalasok VALUES (default, ?, ?, ?);';
  const options = [foglaloID, palyaID, idopont];
  return dbConnection.executeQuery(query, options);
};

export const deleteFoglalas = (foglalasID) => {
  const query = 'DELETE FROM foglalasok where foglalasID = ?';
  const options = [foglalasID];
  return dbConnection.executeQuery(query, options);
};

export const deleteAllFoglalasok = () => {
  const query = 'DELETE FROM foglalasok';
  return dbConnection.executeQuery(query);
};
