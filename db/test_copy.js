const fs = require("fs");
const { Pool } = require('pg');
const { start } = require("repl");

const dbConfig = JSON.parse(fs.readFileSync('./db/dbconfig.json').toString());
console.log(dbConfig)
if (!dbConfig['username'] || !dbConfig['hostname'] || !dbConfig['password'] || !dbConfig['db']) {
    throw new Error("db config error");
}
const pool = new Pool({
    user: dbConfig['username'],
    host: dbConfig["hostname"],
    database: dbConfig['db'],
    password: dbConfig['password'],
});

async function nonuniformMinMaxEncode() {
    // let sql = `select * from om3.encode2`
    // await pool.query(sql);
    let start_time = new Date();
    let sql = `COPY (SELECT * FROM om3.encode2 WHERE i<2048) TO 'C:/Users/A/Desktop/om3_streaming/db/encode.csv' CSV HEADER`;
    await pool.query(sql);
    // let sql2 = `COPY`
    // let insertTestSql = `insert into om3.encode5_dataset(i,minvd,maxvd) values `;
    // for(let i=1;i<2048;i++){
    //     insertTestSql += `(${i},${i*2.1},${i*3.1}),`
    // }  
    // insertTestSql += `(${-1},${123.4},${124.3})`
    // await pool.query(insertTestSql);
    const queryTime = new Date() - start_time;
    console.log("queryTime:" + queryTime);

    let deleteQuery = `delete from om3.encode5_dataset`;
    pool.query(deleteQuery);
}

nonuniformMinMaxEncode();