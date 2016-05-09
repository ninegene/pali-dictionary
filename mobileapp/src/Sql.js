import SQLite from "react-native-sqlite-storage";
import Global from "./Global";

SQLite.DEBUG(Global.isDevEnv);
SQLite.enablePromise(true);

const DBNAME = 'pali_dict.db';
const FROM_LOCATION = '~pali_dict.db';

let Sql = {};
let db;

Sql.openDB = () => {
  return SQLite.openDatabase({name: DBNAME, createFromLocation: FROM_LOCATION})
    .then(instance => {
      db = instance;
      console.log("SQLite.openDatabase() successful!");
    })
    .catch(() => {
      console.log("SQLite.openDatabase() failed!");
    });
};

Sql.closeDB = () => {
  if (db) {
    console.log("Closing database ...");
    db.close().then(status => {
      console.log("db closed successfully! ", status);
    }).catch(error => {
      console.log("db closed failed! ", error);
    });
  }
};

Sql.query = (sql = 'SELECT 1', params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error(DBNAME + ' not opened!'));
      return;
    }

    db.executeSql(sql, params)
      .then(([results]) => {
        let rows = [];
        let len = results.rows.length;
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          rows.push(row);
        }
        resolve(rows);
      })
      .catch(error => {
        reject(error);
      })
      .done();
  });
};

Sql.pali_myanmar_contains = (substring, limit = 50, skip = 0) => {
  substring = '%' + substring + '%';
  let sql = 'SELECT pali, mm FROM pali_mm WHERE pali like ? or mm like ? LIMIT ? OFFSET ?';
  let params = [substring, substring, limit, skip];
  return Sql.query(sql, params)
};

Sql.pali_contains = (substring, limit = 50, skip = 0) => {
  substring = '%' + substring + '%';
  let sql = 'SELECT pali, mm FROM pali_mm WHERE pali like ? LIMIT ? OFFSET ?';
  let params = [substring, limit, skip];
  return Sql.query(sql, params)
};

Sql.pali_starts_with = (prefix, limit = 50, skip = 0) => {
  prefix = '%' + prefix;
  let sql = 'SELECT pali, mm FROM pali_mm WHERE pali like ? LIMIT ? OFFSET ?';
  let params = [prefix, limit, skip];
  return Sql.query(sql, params)
};

export default Sql;
