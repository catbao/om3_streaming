const fs = require("fs");
const { Pool } = require('pg');

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

async function connectToDuckDB() {
    try {
        const start_time = new Date();
        let L_temp = 10;
        let L = 10;
        let query_i = 1;
        let array = new Array(11);
        array[L] = new Array(1);
        array[L][0] = [];
        array[L][0].push(2 ** (20) - 1);
        for(let i = 9; i >= 0 ;--i){
            array[i] = new Array(2**(L - i));
            for(let j = 0; j < array[i+1].length; ++j){
                array[i][2*j] = [];
                array[i][2*j].push(array[i+1][j] - 2**(i+10));
                array[i][2*j+1] = [];
                array[i][2*j+1].push(array[i+1][j] - 1);
            }
        }
        let array_temp = new Array(11);  
        array_temp[L_temp] = new Array(1);
          array_temp[L_temp][0] = [];
          array_temp[L_temp][0].push(parseInt(array[0][query_i-1]));
          for(let i = 9; i >= 0 ;--i){
              array_temp[i] = new Array(2**(L_temp - i));
              for(let j = 0; j < array_temp[i+1].length; ++j){
                  array_temp[i][2*j] = [];
                  array_temp[i][2*j].push(array_temp[i+1][j] - 2**(i));
                  array_temp[i][2*j+1] = [];
                  array_temp[i][2*j+1].push(array_temp[i+1][j] - 1);
              }
          }
        let sqlStrLast = `select i,minvd,maxvd from om3.encode2 where i in (`
          let tempStrLast = `${array_temp[L_temp][0][0]},`  
          for(let i = L_temp-1; i > 0; --i){ 
              for(let j = 0; j < array_temp[i+1].length; ++j){
                  tempStrLast += `${array_temp[i][2*j][0]},`
                  tempStrLast += `${array_temp[i][2*j+1][0]},`
              }
          }
          tempStrLast += `-1) order by array_positions(array[`
        //   tempStrLast += `-1)`
          for(let i = L_temp-1; i > 0; --i){ 
              for(let j = 0; j < array_temp[i+1].length; ++j){
                  tempStrLast += `${array_temp[i][2*j][0]},`
                  tempStrLast += `${array_temp[i][2*j+1][0]},`
              }
          }
          let sqlQueryLast = sqlStrLast + tempStrLast + `-1],i)`;
        //   let sqlQueryLast = sqlStrLast + tempStrLast;
          const result = await pool.query(sqlQueryLast);
          const queryTime = new Date() - start_time;
          console.log("queryTime:" + queryTime);
    } catch (error) {
      console.error('Error connecting to Postgres:', error);
    }
  }
  
  connectToDuckDB();