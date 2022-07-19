import dbConnection from './connection.js';

export const createTable = async () => {
  try {
    const palyak = `create table if not exists palyak (
      palyaID int primary key auto_increment,
      palyaTipus varchar(40),
      oraBerar int,
      cim varchar(100),
      leiras text)`;
    const felhasznalok = `create table if not exists felhasznalok (
      felhasznaloID int primary key auto_increment,
      Nev varchar(40),
      email varchar(50),
      felhasznaloNev varchar(25),
      jelszo varchar(100),
      szerep int,
      unique (felhasznaloNev)
      )`;
    const foglalasok = `create table if not exists foglalasok (
      foglalasID int primary key auto_increment,
      felhasznaloID int,
      palyaID int,
      idopont varchar(100),

      constraint FK_felhasnzaloID foreign key(felhasznaloID)
      references felhasznalok(felhasznaloID),

      constraint FK_palyaID foreign key(palyaID)
      references palyak(palyaID)
      )`;
    const fenykepek = `create table if not exists fenykepek (
      kepID int primary key auto_increment,
      palyaID int,
      Nev varchar(1000),

      constraint FK_palyaID_fenykepek foreign key(palyaID)
      references palyak(palyaID)
      )`;

    await Promise.all([dbConnection.executeQuery(palyak), dbConnection.executeQuery(felhasznalok),
      dbConnection.executeQuery(foglalasok), dbConnection.executeQuery(fenykepek)]);

    console.log('Tables created successfully');
  } catch (err) {
    console.error(`Create table error: ${err}`);
    process.exit(1);
  }
};

export default createTable;
