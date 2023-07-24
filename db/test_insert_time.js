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
    let sql = `select * from om3.encode2`
    await pool.query(sql);
    let start_time = new Date();
    // let insertTestSql = `insert into om3.encode5_dataset(i,minvd,maxvd) values `;
    // for(let i=1;i<1024;i++){
    //     insertTestSql += `(${i},${i*2.1},${i*3.1}),`
    // }  
    // insertTestSql += `(${-1},${123.4},${124.3})`
    // await pool.query(insertTestSql);
    let queryTestSql = `select * from raw_data.mock_guassian_sin_16 where t<2048`
    await pool.query(queryTestSql);
    const queryTime = new Date() - start_time;
    console.log("queryTime:" + queryTime);
    
        // let index = 0;
        // for(let i=1;i<12;i++){
        //   let insertTestSql = `insert into om3.encode5_dataset(i,minvd,maxvd) values `;
        //   for(let j=0;j<2**i;j++){
        //     insertTestSql += `(${index++},${index*2.1},${index*3.1}),`
        //   }
        //   insertTestSql += `(${-1},${123.4},${124.3})`
        //   const start_time = new Date();
        //   await pool.query(insertTestSql);
        //   const queryTime = new Date() - start_time;
        //   console.log("queryTime:" + queryTime);
        // }

    let deleteQuery = `delete from om3.encode5_dataset`;
    pool.query(deleteQuery);
}

nonuniformMinMaxEncode();