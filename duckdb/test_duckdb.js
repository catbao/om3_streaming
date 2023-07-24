const duckdb = require('duckdb');
const path = require('path');
const { start } = require('repl');

async function connectToDuckDB() {
  try {
    // const dbPath = path.join(__dirname, 'database'); 
    // const dbPath = 'C:\Users\A\Desktop\duckdb\database';
    const dbPath = "C:\\Users\\A\\Desktop\\om3_streaming\\duck"
    const connection = new duckdb.Database(dbPath);

    con = connection.connect();
    console.log('Connected to DuckDB database.');

    // const query = 'SELECT * FROM main.sin_16';
    // const query = "create table sin_16(t INTEGER, v DOUBLE);"
    // const query2 = "copy sin_16 from 'sin_16.csv' (AUTO_DETECT TRUE);"
    // con.all(query);
    // con.all(query2);

    // let query_i = 1;
    // let sqlStr = `select t,v from main.sin_16 where t>? and t<? order by t asc`
    // const params = (query_i * 2048 - 1);
    // const params1 = ((query_i + 1) * 2048);
    // let stmt = con.prepare(sqlStr);

    // let queryData = [];

      const executeQuery = (query) => {
        return new Promise((resolve, reject) => {
          connection.all(query,function(err, res) {
            if (err) {
              reject(err);
              return;
            }
            resolve(res);
          });
        });
      };
      
      
      //测试加上order array_position用时会不会增加
      // let L_temp = 10;
      // let L = 10;
      // let query_i = 1;
      // let array = new Array(11);
      // array[L] = new Array(1);
      // array[L][0] = [];
      // array[L][0].push(2 ** (20) - 1);
      // for(let i = 9; i >= 0 ;--i){
      //     array[i] = new Array(2**(L - i));
      //     for(let j = 0; j < array[i+1].length; ++j){
      //         array[i][2*j] = [];
      //         array[i][2*j].push(array[i+1][j] - 2**(i+10));
      //         array[i][2*j+1] = [];
      //         array[i][2*j+1].push(array[i+1][j] - 1);
      //     }
      // }
      // let array_temp = new Array(11);  
      // array_temp[L_temp] = new Array(1);
      //   array_temp[L_temp][0] = [];
      //   array_temp[L_temp][0].push(parseInt(array[0][query_i-1]));
      //   for(let i = 9; i >= 0 ;--i){
      //       array_temp[i] = new Array(2**(L_temp - i));
      //       for(let j = 0; j < array_temp[i+1].length; ++j){
      //           array_temp[i][2*j] = [];
      //           array_temp[i][2*j].push(array_temp[i+1][j] - 2**(i));
      //           array_temp[i][2*j+1] = [];
      //           array_temp[i][2*j+1].push(array_temp[i+1][j] - 1);
      //       }
      //   }
      // let sqlStrLast = `select i,minvd,maxvd from main.encode2 where i in (`
      //   let tempStrLast = `${array_temp[L_temp][0][0]},`  
      //   for(let i = L_temp-1; i > 0; --i){ 
      //       for(let j = 0; j < array_temp[i+1].length; ++j){
      //           tempStrLast += `${array_temp[i][2*j][0]},`
      //           tempStrLast += `${array_temp[i][2*j+1][0]},`
      //       }
      //   }
      //   // tempStrLast += `-1) order by array_position(array[`
      //   tempStrLast += `-1)`
      //   // for(let i = L_temp-1; i > 0; --i){ 
      //   //     for(let j = 0; j < array_temp[i+1].length; ++j){
      //   //         tempStrLast += `${array_temp[i][2*j][0]},`
      //   //         tempStrLast += `${array_temp[i][2*j+1][0]},`
      //   //     }
      //   // }
      //   // let sqlQueryLast = sqlStrLast + tempStrLast + `-1],i)`;
      //   let sqlQueryLast = sqlStrLast + tempStrLast;
      //   const result = await executeQuery(sqlQueryLast);

      //测试insert的时间
      // const q3 = "create table test3(i INTEGER, minvd DOUBLE, maxvd DOUBLE);"
      // await executeQuery(q3);  
      // let sql = `select * from main.test3`
      // con.all(sql, function(err,res) {
      //   if(err) throw err;
      //   console.log(res);
      // })
      let start_time = new Date();
      // let insertTestSql = `insert into main.test3(i,minvd,maxvd) values `;
      // for(let i=1;i<2048;i++){
      //     insertTestSql += `(${i},${i*2.1},${i*3.1}),`
      // }  
      // insertTestSql += `(${-1},${123.4},${124.3})`
      // await executeQuery(insertTestSql);
      // let queryTestSql = `select * from main.sin_16 where t<2048`
      // await executeQuery(queryTestSql);
      const queryTime = new Date() - start_time;
      console.log("queryTime:" + queryTime);
        // let index = 0;
        // for(let i=0;i<12;i++){
        //   let insertTestSql = `insert into main.test(i,minvd,maxvd) values `;
        //   for(let j=0;j<2**i;j++){
        //     insertTestSql += `(${index++},${index*2.1},${index*3.1}),`
        //   }
        //   insertTestSql += `(${-1},${123.4},${124.3})`
        //   const start_time = new Date();
        //   await executeQuery(insertTestSql);
        //   const queryTime = new Date() - start_time;
        //   console.log("queryTime:" + queryTime);
        // }
        
    
      //测试on conflict
      // let queryTemp1 = `INSERT INTO main.encode2 values `
      // queryTemp1 += `(${2047},${2.2},${1}),`
      // queryTemp1 += `(${2046},${2},${3})`
      // queryTemp1 += ` ON CONFLICT(i) DO UPDATE SET minvd = excluded.minvd,maxvd = excluded.maxvd;`
      // con.all(queryTemp1);

      // let querySql = 'SELECT i,minvd,maxvd FROM main.encode2 order by i asc';
      // await con.all(querySql, function(err,res){
      //   if(err) throw err;
      //   console.log(res);
      // })
      // console.log(new Date() - start_time);
      let deleteQuery = `delete from main.encode2`
      con.all(deleteQuery);


    // const result = await connection.all(query);
    // console.log('Query result:',result);
    // result.each((err, row) => {
    //   if (err) {
    //     console.error('Error iterating over result:', err);
    //     return;
    //   }
    //   console.log(row);
    // });

    // await connection.close();
    console.log('Disconnected from DuckDB database.');
  } catch (error) {
    console.error('Error connecting to DuckDB:', error);
  }
}

connectToDuckDB();
