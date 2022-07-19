import dbConnection from './connection.js';

export const getPalyak = () => {
  const query = 'SELECT * FROM palyak';
  return dbConnection.executeQuery(query);
};

export const getPalya = (id) => {
  const query = 'SELECT * FROM palyak where palyaID = ?';
  const options = [id];
  return dbConnection.executeQuery(query, options);
};

export const getLastPalya = () => {
  const query = 'SELECT palyaID FROM palyak order by palyaID desc limit 1';
  return dbConnection.executeQuery(query);
};

export const palyaExists = (id) => {
  const query = 'select palyaID from palyak where palyaID = ?';
  const options = [id];
  return dbConnection.executeQuery(query, options);
};

export const insertPalya = (req) => {
  const query = `INSERT INTO palyak VALUES (default,
    ?, ?, ?, ?);`;
  const options = [req.palyaTipus, req.oraBer, req.cim, req.leiras];
  return dbConnection.executeQuery(query, options);
};

export const deleteAllPalyak = () => {
  const query = 'DELETE FROM palyak';
  return dbConnection.executeQuery(query);
};
