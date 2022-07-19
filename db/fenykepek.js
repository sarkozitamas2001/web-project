import dbConnection from './connection.js';

export const getFenykepek = () => {
  const query = 'SELECT * FROM fenykepek';
  return dbConnection.executeQuery(query);
};

export const getFenykepekBypalyaID = (id) => {
  const query = 'SELECT * FROM fenykepek where palyaID = ?';
  const options = [id];
  return dbConnection.executeQuery(query, options);
};

export const insertFenykep = (palyaID, fileName) => {
  const query = 'INSERT INTO fenykepek VALUES (default, ?, ?);';
  const options = [palyaID, fileName];
  return dbConnection.executeQuery(query, options);
};

export const deleteAllFenykepek = () => {
  const query = 'DELETE FROM fenykepek';
  return dbConnection.executeQuery(query);
};
