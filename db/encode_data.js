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

// async function computeTableFlag(data) {
//     // const maxT = data.rows[data.rows.length - 1]['t'];
//     const maxT = 9

//     const bufLen = 2 ** Math.ceil(Math.log2(maxT));
//     const tempArray = new Array(bufLen);
//     data.rows.forEach(item => {
//         tempArray[item['date']] = item['value'];
//     });
//     const arrayBuffer = new Buffer.alloc(bufLen);

//     for (let j = 0; j < tempArray.length; j += 2) {
//         if (tempArray[j] === undefined && tempArray[j + 1] === undefined) {
//             continue;
//         } else if (tempArray[j] === undefined) {
//             arrayBuffer[j] = 1;
//             arrayBuffer[j + 1] = 0;
//             continue;
//         } else if (tempArray[j + 1] === undefined) {
//             arrayBuffer[j] = 1;
//             arrayBuffer[j + 1] = 1;
//             continue
//         }
//         if (tempArray[j] < tempArray[j + 1]) {
//             arrayBuffer[j] = 0;
//             arrayBuffer[j + 1] = 0;
//         } else {
//             arrayBuffer[j] = 0;
//             arrayBuffer[j + 1] = 1;
//         }
//     }
//     // fs.writeFileSync(`./${"mock_guassian_sin_om3_8m"}.flagz`, arrayBuffer);
//     console.log("compute ordering flag finished")
//     //pool.end()
// }

async function insertStreamingData(){
    // const querySQL = `INSERT INTO test(t,value) values (5)`
    // pool.query(querySQL);
    // realLen += newData.length
    // maxL += 1 
    // dataArray.push(parseFloat(newData.v['value']))
    let realLen = 16
    let maxL = 4
    dataArray = [23,3,28,23,26,28,22,5]
    dataArray = dataArray.concat([12,38,11,22,28,34,23,24])
    console.log(dataArray)
    minV = dataArray
    maxV = dataArray

    let curL = 1
    for(let l = curL; l <= maxL; l++){
        let curMinVDiff = new Array(2 ** (maxL - l));
        let curMaxVDiff = new Array(2 ** (maxL - l));

        let curMinV = new Array(2 ** (maxL - l));
        let curMaxV = new Array(2 ** (maxL - l));
        for(let i = 2 ** (maxL-l); i < 2**(maxL-l+1); i+=2){
            //Min
            if (minV[i] === undefined && minV[i + 1] !== undefined) {
                curV = minV[i + 1]
                curDif = undefined;
            } else if (minV[i] !== undefined && minV[i + 1] === undefined) {
                curV = minV[i];
                curDif = 0;
            } else if (minV[i] === undefined && minV[i + 1] === undefined) {
                curV = undefined;
                curDif = undefined;
            } else {
                curV = Math.min(minV[i], minV[i + 1]);
                curDif = minV[i] - minV[i + 1];
            }
            curMinV[i / 2] = curV;
            curMinVDiff[i / 2] = curDif;

            //Max
            if (maxV[i] === undefined && maxV[i + 1] !== undefined) {
                curV = maxV[i + 1];
                curDif = 0;
            } else if (maxV[i] !== undefined && maxV[i + 1] === undefined) {
                curV = maxV[i];
                curDif = undefined;
            } else if (maxV[i] === undefined && maxV[i + 1] === undefined) {
                curV = undefined;
                curDif = undefined;
            } else {
                curV = Math.max(maxV[i], maxV[i + 1]);
                curDif = maxV[i] - maxV[i + 1];
            }
            curMaxV[i / 2] = curV;
            curMaxVDiff[i / 2] = curDif;
        }
        // minV = minV.concat(curMinV)
        // maxV = maxV.concat(curMaxV)
        minV = curMinV;
        maxV = curMaxV;

        console.log(curMaxVDiff)
        console.log(curMinVDiff)

        if (l === 1) {
            continue
            // console.log(minV,maxV)
        }          
        
        let sqlStr = "insert into om3.bao(i,minvd,maxvd) values "
        let i = 2 ** (maxL-l-1);
        while (i < curMaxVDiff.length) {
            const usedL = maxL - l
            let tempStr = ''
            if (i + 1000 < curMaxVDiff.length) {
                for (let j = i; j < i + 1000; j++) {
                    if (curMinVDiff[j] === undefined && curMaxVDiff[j] === undefined) {
                        continue;
                    }

                    if (tempStr === '') {
                        tempStr += ` (${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    } else {
                        tempStr += `,(${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    }
                }

            } else {
                for (let j = i; j < curMaxVDiff.length; j++) {
                    if (curMinVDiff[j] === undefined && curMaxVDiff[j] === undefined) {
                        continue;
                    }

                    if (tempStr === '') {
                        tempStr += ` (${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    } else {
                        tempStr += `,(${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    }
                }
            }
            i += 1000
            let sql = sqlStr + tempStr;
            try {
                await pool.query(sql)
            } catch (err) {
                pool.end();
                console.log("cuowu")
                throw err
            }
        }
    }
}

async function nonuniformMinMaxEncode() {
    // const querySQL = `SELECT t,v FROM "raw_data"."mock_guassian_sin_8m" WHERE t >= 0 AND t < 10240`
    const querySQL = `SELECT t,v FROM "raw_data"."mock_guassian_sin_16" where t<2048`
    const queryData = await pool.query(querySQL);
    // console.log(queryData)
    // computeTableFlag(queryData);
    let data = queryData.rows;
    // console.log(data)

    let min = data[0]['v'];
    let max = data[0]['v'];
    // let maxTime = data[0]['t'];
    let maxTime = data.length
    for (let i = 0; i < data.length; i++) {
        if ((data[i]['v']) < (min)) {
            min = data[i]['v'];
        }
        if ((data[i]['v']) > (max)) {
            max = data[i]['v'];
        }
    }
    const realLen = 2 ** Math.ceil(Math.log2(maxTime));
    const maxL = Math.ceil(Math.log2(maxTime));
    const dataArray = new Array(realLen)
    let count = 0
    data.forEach((v, i) => {
        dataArray[parseInt(v['t'])] = parseFloat(v['v']);
    });
        let curL = 1;
        let minV = dataArray
        let maxV = dataArray

        let curMinVDiff = new Array(maxL+1);
        let curMaxVDiff = new Array(maxL+1);
        let curMinV = new Array(maxL+1);
        let curMaxV = new Array(maxL+1);

        for (let l = curL; l <= maxL; l++) {
            console.log("compute level:", l)

            curMinVDiff[l] = new Array(2 ** (maxL - l));
            curMaxVDiff[l] = new Array(2 ** (maxL - l));
            curMinV[l] = new Array(2 ** (maxL - l));
            curMaxV[l] = new Array(2 ** (maxL - l));

            //encode differece
            for (let i = 0; i < 2 ** (maxL - l + 1); i += 2) {

                //Min
                if (minV[i] === undefined && minV[i + 1] !== undefined) {
                    curV = minV[i + 1]
                    curDif = undefined;
                } else if (minV[i] !== undefined && minV[i + 1] === undefined) {
                    curV = minV[i];
                    curDif = 0;
                } else if (minV[i] === undefined && minV[i + 1] === undefined) {
                    curV = undefined;
                    curDif = undefined;
                } else {
                    curV = Math.min(minV[i], minV[i + 1]);
                    curDif = minV[i] - minV[i + 1];
                }
                curMinV[l][i / 2] = curV;
                curMinVDiff[l][i / 2] = curDif;

                //Max
                if (maxV[i] === undefined && maxV[i + 1] !== undefined) {
                    curV = maxV[i + 1];
                    curDif = 0;
                } else if (maxV[i] !== undefined && maxV[i + 1] === undefined) {
                    curV = maxV[i];
                    curDif = undefined;
                } else if (maxV[i] === undefined && maxV[i + 1] === undefined) {
                    curV = undefined;
                    curDif = undefined;
                } else {
                    curV = Math.max(maxV[i], maxV[i + 1]);
                    curDif = maxV[i] - maxV[i + 1];
                }
                curMaxV[l][i / 2] = curV;
                curMaxVDiff[l][i / 2] = curDif;
            }
            minV = curMinV[l];
            maxV = curMaxV[l];
        }

        let start_time = new Date()
        for(let l = maxL-1; l>=2; l--){
            let sqlStr = "insert into om3.encode5_dataset(i,minvd,maxvd) values ";
            // let sqlStr = "insert into om3.encode3(i,minvd,maxvd) values ";
            
            let array = new Array(maxL+1);
            array[maxL] = new Array(1);
            array[maxL][0] = 2 ** (maxL-1) - 1;
            for(let i = maxL - 1; i >= 2 ;--i){
                array[i] = new Array(2**(maxL - i));
                for(let j = 0; j < array[i+1].length; ++j){
                    array[i][2*j] = array[i+1][j] - 2**(i-1);
                    array[i][2*j+1] = array[i+1][j] - 1;
                }
            }

            let i = 0;
            while(i < curMaxVDiff[l].length){
                let tempStr = '';
                if(i + 10000 < curMaxVDiff[l].length){
                    for(let j = i; j < i + 10000; j++){
                        if(curMinVDiff[l][j] === undefined && curMaxVDiff[l][j] === undefined){
                            continue;
                        }
                        if(tempStr === ''){
                                tempStr += ` (${array[l][j]},${curMinVDiff[l][j] === undefined ? "NULL" : curMinVDiff[l][j]},${curMaxVDiff[l][j] === undefined ? "NULL" : curMaxVDiff[l][j]})`
                        }
                        else{
                                tempStr += `,(${array[l][j]},${curMinVDiff[l][j] === undefined ? "NULL" : curMinVDiff[l][j]},${curMaxVDiff[l][j] === undefined ? "NULL" : curMaxVDiff[l][j]})`
                        }
                    }
                }
                else{
                    for(let j = i; j < curMaxVDiff[l].length; j++){
                        if(curMinVDiff[l][j] === undefined && curMaxVDiff[l][j] === undefined){
                            continue;
                        }
                        if(tempStr === ''){
                                tempStr += ` (${array[l][j]},${curMinVDiff[l][j] === undefined ? "NULL" : curMinVDiff[l][j]},${curMaxVDiff[l][j] === undefined ? "NULL" : curMaxVDiff[l][j]})`
                        }
                        else{
                                tempStr += `,(${array[l][j]},${curMinVDiff[l][j] === undefined ? "NULL" : curMinVDiff[l][j]},${curMaxVDiff[l][j] === undefined ? "NULL" : curMaxVDiff[l][j]})`
                        }
                    }
                }
                i += 10000;
                let sql = sqlStr + tempStr;
                try {
                    await pool.query(sql)
                } catch (err) {
                    pool.end();
                    throw err
                }
            }
        }

    const lSql = `insert into om3.encode5_dataset(i,minvd,maxvd) values(${2**(maxL-1)-1},${curMinVDiff[maxL][0]},${curMaxVDiff[maxL][0]})`
    // const lSql = `insert into om3.encode3(i,minvd,maxvd) values(${2**(maxL-1)-1},${curMinVDiff[maxL][0]},${curMaxVDiff[maxL][0]})`
    await pool.query(lSql);
    const l0Sql = `insert into om3.encode5_dataset(i,minvd,maxvd) values(${-1},${min},${max})`
    // const l0Sql = `insert into om3.encode3(i,minvd,maxvd) values(${-1},${min},${max})`
    await pool.query(l0Sql);
    console.log(new Date() - start_time);
    
    pool.end()
}

async function updateStreamingData(){
    // let sqlDeleteStr = "truncate table om3.bao"
    await pool.query(sqlDeleteStr)
    // const querySQL = `INSERT INTO test(t,value) values (5)`
    // pool.query(querySQL);
    // realLen += newData.length
    // maxL += 1 
    // dataArray.push(parseFloat(newData.v['value']))
    let realLen = 16
    let maxL = 4
    dataArray = [23,3,28,23,26,28,22,5]
    dataArray = dataArray.concat([12,38,11,22,28,34,23,24])
    // console.log(dataArray)

    // for (let i = 0; i < data.length; i++) {
    //     // console.log(min+' '+max)
    //     // console.log('data=' + data[i]['value'])
    //     if (parseFloat(data[i]['value']) < parseFloat(min)) {
    //         min = data[i]['value'];
    //     }
    //     if (parseFloat(data[i]['value']) > parseFloat(max)) {
    //         max = data[i]['value'];
    //     }
    //     // if (data[i]['t'] > maxTime) {
    //     //     maxTime = data[i]['t'];
    //     // }
    // }

    minV = dataArray
    maxV = dataArray

    let curL = 1
    for(let l = curL; l <= maxL; l++){
        let curMinVDiff = new Array(2 ** (maxL - l));
        let curMaxVDiff = new Array(2 ** (maxL - l));

        let curMinV = new Array(2 ** (maxL - l));
        let curMaxV = new Array(2 ** (maxL - l));
        for(let i = 0; i < 2**(maxL-l+1); i+=2){
            //Min
            if (minV[i] === undefined && minV[i + 1] !== undefined) {
                curV = minV[i + 1]
                curDif = undefined;
            } else if (minV[i] !== undefined && minV[i + 1] === undefined) {
                curV = minV[i];
                curDif = 0;
            } else if (minV[i] === undefined && minV[i + 1] === undefined) {
                curV = undefined;
                curDif = undefined;
            } else {
                curV = Math.min(minV[i], minV[i + 1]);
                curDif = minV[i] - minV[i + 1];
            }
            curMinV[i / 2] = curV;
            curMinVDiff[i / 2] = curDif;

            //Max
            if (maxV[i] === undefined && maxV[i + 1] !== undefined) {
                curV = maxV[i + 1];
                curDif = 0;
            } else if (maxV[i] !== undefined && maxV[i + 1] === undefined) {
                curV = maxV[i];
                curDif = undefined;
            } else if (maxV[i] === undefined && maxV[i + 1] === undefined) {
                curV = undefined;
                curDif = undefined;
            } else {
                curV = Math.max(maxV[i], maxV[i + 1]);
                curDif = maxV[i] - maxV[i + 1];
            }
            curMaxV[i / 2] = curV;
            curMaxVDiff[i / 2] = curDif;
        }
        // minV = minV.concat(curMinV)
        // maxV = maxV.concat(curMaxV)
        minV = curMinV;
        maxV = curMaxV;

        console.log(curMaxVDiff)
        console.log(curMinVDiff)

        if (l === 1) {
            continue
            // console.log(minV,maxV)
        }          
        
        let sqlStr = "insert into om3.bao(i,minvd,maxvd) values "
        let i = 0;
        while (i < curMaxVDiff.length) {
            const usedL = maxL - l
            let tempStr = ''
            if (i + 1000 < curMaxVDiff.length) {
                for (let j = i; j < i + 1000; j++) {
                    if (curMinVDiff[j] === undefined && curMaxVDiff[j] === undefined) {
                        continue;
                    }

                    if (tempStr === '') {
                        tempStr += ` (${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    } else {
                        tempStr += `,(${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    }
                }

            } else {
                for (let j = i; j < curMaxVDiff.length; j++) {
                    if (curMinVDiff[j] === undefined && curMaxVDiff[j] === undefined) {
                        continue;
                    }

                    if (tempStr === '') {
                        tempStr += ` (${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    } else {
                        tempStr += `,(${(2 ** usedL) + j},${curMinVDiff[j] === undefined ? "NULL" : curMinVDiff[j]},${curMaxVDiff[j] === undefined ? "NULL" : curMaxVDiff[j]})`;
                    }
                }
            }
            i += 1000
            let sql = sqlStr + tempStr;
            try {
                await pool.query(sql)
            } catch (err) {
                pool.end();
                console.log("cuowu")
                throw err
            }
        }
    }
    const l0Sql = `insert into om3.bao(i,minvd,maxvd) values(${-1},${min},${max})`
    await pool.query(l0Sql);
    pool.end()
}

nonuniformMinMaxEncode()
// insertStreamingData()
// updateStreamingData()