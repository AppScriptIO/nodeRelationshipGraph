"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAllDatabase = deleteAllDatabase;
exports.createDatabase = createDatabase;
exports.createTableAndInsertData = createTableAndInsertData;

async function deleteAllDatabase(connection, rethinkDB = rethinkDB) {
  let databaseList = await rethinkDB.dbList().run(connection);
  databaseList = await databaseList.filter(item => item != 'rethinkdb'); // remove default 'rethinkdb' database.

  for (let databaseName of databaseList) {
    await rethinkDB.dbDrop(databaseName).run(connection);
  }
}

async function createDatabase(databaseName, connection, rethinkDB = rethinkDB) {
  let databaseExists = await rethinkDB.dbList().contains(databaseName).run(connection);

  if (!databaseExists) {
    let dbCreationResponse = await rethinkDB.dbCreate(databaseName).run(connection); // .do(function(databaseExists) {
    //   return rethinkDB.branch(
    //     databaseExists,
    //     { dbs_created: 0 },
    //     rethinkDB.dbCreate('webapp')
    //   );
    // })

    if (dbCreationResponse.dbs_created > 0) console.log(`📢 ${databaseName} database created !`);
  } else {
    console.log(`📢📁 ${databaseName} database already exists !`);
  }
}

async function createTableAndInsertData(databaseName, databaseData, connection, rethinkDB = rethinkDB) {
  for (let tableData of databaseData) {
    await rethinkDB.db(databaseName).tableCreate(tableData.databaseTableName).run(connection).then(async tableCreationResponse => {
      if (tableCreationResponse.tables_created > 0) console.log(`📢 ${tableData.databaseTableName} table created.`);
      await rethinkDB.db(databaseName).table(tableData.databaseTableName).insert(tableData.data).run(connection).then(response => {
        console.log(`📢📥 ${response.inserted} documents inserted to ${tableData.databaseTableName}.`);
      }).catch(error => console.log(error));
    }).catch(error => {
      if (error.name == 'ReqlOpFailedError') {
        console.log(`📢 ${tableData.databaseTableName} table already exists.`);
      } else {
        console.error(error);
      }
    }); // create index

    if (tableData.index) {
      for (let indexField of tableData.index) {
        await rethinkDB.db(databaseName).table(tableData.databaseTableName).indexCreate(indexField).run(connection).then(response => {
          console.log(`📢 ${tableData.databaseTableName} - created index for field ${indexField}.`);
        }).catch(error => console.log(`📢 ${tableData.databaseTableName} - index for field ${indexField} already exists.`));
      }
    }
  }
}