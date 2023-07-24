"use strict";
exports.__esModule = true;
exports.constructMinMaxMissTrendTree = void 0;
var level_index_obj_1 = require("../model/level-index-obj");
var tend_query_tree_1 = require("../helper/tend-query-tree");
var level_data_manager_1 = require("../model/level-data-manager");

const fs = require("fs");
const { Pool } = require('pg');
const { unsubscribe } = require("diagnostics_channel");

const dbConfig = JSON.parse(fs.readFileSync("./helper/dbconfig.json").toString());
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
// import LevelIndexObj from "../model/level-index-obj"
// import TrendTree from "./tend-query-tree"
// import LevelDataManager from "../model/level-data-manager"

// / <reference types="node" />
// var Papa = require('papaparse');
// const fs = require('fs');
// const csv = require('csv-parser');
// // 读取CSV文件
// let results = [];


// fs.createReadStream('./encoded_data/encode.csv')
//   .pipe(csv())
//   .on('data', (data) => results.push(data))
//   .on('end', () => {
//     // console.log(results.length);
//     results.sort(function(a, b) {
//         if (parseInt(a.i) < parseInt(b.i)) {
//           return -1; 
//         } else if (parseInt(a.i) > parseInt(b.i)) {
//           return 1; 
//         } else {
//           return 0; 
//         }
//       });
//     constructMinMaxMissTrendTree(results)
//     // updateMinMaxMissTrendTree(results)
//   });


// console.log(results.length)
// constructMinMaxMissTrendTree(results)

constructMinMaxMissTrendTree()

async function constructMinMaxMissTrendTree() {
    // console.log(results)
    const querySQL = `SELECT i,minvd,maxvd FROM "om3"."encode" order by i asc`
    const queryData = await pool.query(querySQL);
    let data = queryData.rows;

    var levelIndex = new Array(Math.ceil(Math.log2(data.length)));
    let maxL = Math.ceil(Math.log2(data.length))+1; //+1是因为coeff与data的倍数关系
    var minvd = [];
    var maxvd = [];
    data.forEach(function (v) {
        // minvd.push(parseFloat(v.minvd));
        // maxvd.push(parseFloat(v.maxvd));
        minvd[v.i] = v.minvd;
        maxvd[v.i] = v.maxvd;
    });
    // var tempLast = minvd.pop();
    // minvd.unshift(tempLast);
    // tempLast = maxvd.pop();
    // maxvd.unshift(tempLast);
    var lastLevelNodes = new Array();
    var currentLevelNodes = new Array();
    var nodeNum = 1;
    //@ts-ignore
    var root = new tend_query_tree_1["default"](null, true, 0, [undefined, minvd[-1], maxvd[-1], undefined], [undefined, minvd[15], maxvd[15], undefined]);
    lastLevelNodes.push(root);
    levelIndex[0] = new level_index_obj_1["default"](0, true);
    levelIndex[0].addLoadedDataRange(root, [0, 0]);
    // let array = new Array([],[],[1,2,4,5],[3,6],[7]);
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
    console.log(array);
    for (var i = 1; i <= Math.log2(data.length); i++) {
        for (var j = 0; j < Math.pow(2, (i - 1)); j++) {
            let level_dif = maxL - (i);
            var lastNode = lastLevelNodes[j];
            var dif = lastNode.difference;
            var curNodeType = 'O';
            if (dif[1] === undefined && dif[2] === undefined) {
                curNodeType = "NULL";
            }
            // else if (dif[0] === null && dif[1] === null) {
            else if (dif[1] === null) {
                curNodeType = "LEFTNULL";
            }
            //else if (dif[2] === null && dif[3] === null) {
            else if (dif[2] === null) { 
                curNodeType = "RIGHTNULL";
            }
            lastNode.nodeType = curNodeType;
            // curNodeType = lastNode.nodeType;
            var yArray1 = [undefined, undefined, undefined, undefined];
            var yArray2 = [undefined, undefined, undefined, undefined];
            if (curNodeType === 'O') {
                if (lastNode.difference[1] < 0) {
                    yArray1[1] = lastNode.yArray[1];
                    yArray2[1] = lastNode.yArray[1] - lastNode.difference[1];
                }
                else {
                    yArray1[1] = lastNode.yArray[1] + lastNode.difference[1];
                    yArray2[1] = lastNode.yArray[1];
                }
                if (lastNode.difference[2] < 0) {
                    yArray1[2] = lastNode.yArray[2] + lastNode.difference[2];
                    yArray2[2] = lastNode.yArray[2];
                }
                else {
                    yArray1[2] = lastNode.yArray[2];
                    yArray2[2] = lastNode.yArray[2] - lastNode.difference[2];
                }
            }
            else if (curNodeType == "LEFTNULL") {
                yArray2[1] = lastNode.yArray[1];
                yArray2[2] = lastNode.yArray[2];
            }
            else if (curNodeType == "RIGHTNULL") {
                yArray1[1] = lastNode.yArray[1];
                yArray1[2] = lastNode.yArray[2];
            }
            else if (curNodeType === 'NULL') {
                //console.log("null node")
            }
            else {
                throw new Error("type error");
            }
            //@ts-ignore
            var firstNode = new tend_query_tree_1["default"](lastNode, true, lastNode.index, yArray1, i === Math.log2(data.length) ? null : [undefined, minvd[array[maxL-i][2*j]], maxvd[array[maxL-i][2*j]], undefined]);
            if (lastNode.nodeType === 'LEFTNULL' || lastNode.nodeType === 'NULL') {
                firstNode.nodeType = 'NULL';
            }
            //@ts-ignore
            var secondNode = new tend_query_tree_1["default"](lastNode, false, lastNode.index, yArray2, i === Math.log2(data.length) ? null : [undefined, minvd[array[maxL-i][2*j+1]], maxvd[array[maxL-i][2*j+1]], undefined]);
            if (lastNode.nodeType === 'RIGHTNULL' || lastNode.nodeType == 'NULL') {
                secondNode.nodeType = 'NULL';
            }
            currentLevelNodes.push(firstNode);
            currentLevelNodes.push(secondNode);
            nodeNum += 2;
        }
        levelIndex[i] = new level_index_obj_1["default"](currentLevelNodes[0].level, true);
        levelIndex[i].addLoadedDataRange(currentLevelNodes[0], [0, currentLevelNodes.length - 1]);
        for (var i_1 = 0; i_1 < currentLevelNodes.length - 1; i_1++) {
            currentLevelNodes[i_1].nextSibling = currentLevelNodes[i_1 + 1];
            currentLevelNodes[i_1 + 1].previousSibling = currentLevelNodes[i_1];
        }
        lastLevelNodes = currentLevelNodes;
        currentLevelNodes = [];
    }
    var levelDataManager = new level_data_manager_1["default"](levelIndex);
    // console.log(levelDataManager)
    // outputTree(root)
    console.log(root)
    // let result = []
    // fs.createReadStream('./encoded_data/bao1.csv')
    // .pipe(csv())
    // .on('data', (data) => result.push(data))
    // .on('end', () => {
    //     // console.log(results.length);
    //     result.sort(function(a, b) {
    //         if (parseInt(a.i) < parseInt(b.i)) {
    //         return -1; 
    //         } else if (parseInt(a.i) > parseInt(b.i)) {
    //         return 1; 
    //         } else {
    //         return 0; 
    //         }
    //     });
    //     // constructMinMaxMissTrendTree(results)
    //     updateMinMaxMissTrendTree(result,root)
    // });
    // updateMinMaxMissTrendTree(root,results)
    // return {
    //     dataManager: levelDataManager,
    //     trendTree: root
    // };
}

function updateMinMaxMissTrendTree(data,origin_root){
    // console.log(length(levelDataManager))
    var levelIndex = new Array(Math.ceil(Math.log2(data.length)))
    var minvd = []
    var maxvd = []
    data.forEach(function(v){
        minvd.push(parseFloat(v.minvd))
        maxvd.push(parseFloat(v.maxvd))
    })
    var lastLevelNodes = new Array()
    var currentLevelNodes = new Array()
    var nodeNum = 1
    var root = new tend_query_tree_1["default"](null, true, 0, [undefined, minvd[0], maxvd[0], undefined], [undefined, minvd[1], maxvd[1], undefined])
    lastLevelNodes.push(root)
    levelIndex[0] = new level_index_obj_1["default"](0,true)
    levelIndex[0].addLoadedDataRange(root,[0,0])
    root._leftChild = origin_root
    // var root_right = new tend_query_tree_1(root,true,3,[undefined,minvd[3],maxvd[3],undefined])
    for(var i=1;i<=Math.log2(data.length);++i){
        for(var j=0;j<Math.pow(2,(i-1))/2;++j){
            var lastNode = lastLevelNodes[j]
            var dif = lastNode.difference
            var curNodeType = 'O';
            if (dif[1] === null && dif[2] === null) {
                curNodeType = "NULL";
            }
            else if (dif[0] === null && dif[1] === null) {
                curNodeType = "LEFTNULL";
            }
            else if (dif[2] === null && dif[3] === null) {
                curNodeType = "RIGHTNULL";
            }
            lastNode.nodeType = curNodeType
            var yArray1 = [undefined, undefined, undefined, undefined];
            var yArray2 = [undefined, undefined, undefined, undefined];
            if (curNodeType === 'O') {
                if (lastNode.difference[1] < 0) {
                    yArray1[1] = lastNode.yArray[1];
                    yArray2[1] = lastNode.yArray[1] - lastNode.difference[1];
                }
                else {
                    yArray1[1] = lastNode.yArray[1] + lastNode.difference[1];
                    yArray2[1] = lastNode.yArray[1];
                }
                if (lastNode.difference[2] < 0) {
                    yArray1[2] = lastNode.yArray[2] + lastNode.difference[2];
                    yArray2[2] = lastNode.yArray[2];
                }
                else {
                    yArray1[2] = lastNode.yArray[2];
                    yArray2[2] = lastNode.yArray[2] - lastNode.difference[2];
                }
            }
            else if (curNodeType == "LEFTNULL") {
                yArray2[1] = lastNode.yArray[1];
                yArray2[2] = lastNode.yArray[2];
            }
            else if (curNodeType == "RIGHTNULL") {
                yArray1[1] = lastNode.yArray[1];
                yArray1[2] = lastNode.yArray[2];
            }
            else if (curNodeType === 'NULL') {
                //console.log("null node")
            }
            else {
                throw new Error("type error");
            }

            if(i==1 && j==0){
                var secondNode = new tend_query_tree_1["default"](lastNode, false, lastNode.index, yArray2, i === Math.log2(data.length) ? null : [undefined, minvd[j * 2 + 1 + Math.pow(2, i)], maxvd[j * 2 + 1 + Math.pow(2, i)], undefined]);
                if (lastNode.nodeType === 'RIGHTNULL' || lastNode.nodeType == 'NULL') {
                    secondNode.nodeType = 'NULL';
                }
                currentLevelNodes.push(secondNode);
                nodeNum += 1;
                // levelIndex[i] = new level_index_obj_1["default"](currentLevelNodes[0].level, true);
                // levelIndex[i].addLoadedDataRange(currentLevelNodes[0], [0, currentLevelNodes.length - 1]);
                // for (var i_1 = 0; i_1 < currentLevelNodes.length - 1; i_1++) {
                //     currentLevelNodes[i_1].nextSibling = currentLevelNodes[i_1 + 1];
                //     currentLevelNodes[i_1 + 1].previousSibling = currentLevelNodes[i_1];
                // }
                // lastLevelNodes = currentLevelNodes;
                // currentLevelNodes = [];
            }
            else{
                var firstNode = new tend_query_tree_1["default"](lastNode, true, lastNode.index, yArray1, i === Math.log2(data.length) ? null : [undefined, minvd[j * 2 + Math.pow(2,i-1) + Math.pow(2, i)], maxvd[j * 2 + Math.pow(2,i-1) + Math.pow(2, i)], undefined]);
                if (lastNode.nodeType === 'LEFTNULL' || lastNode.nodeType === 'NULL') {
                    firstNode.nodeType = 'NULL';
                }
                //@ts-ignore
                var secondNode = new tend_query_tree_1["default"](lastNode, false, lastNode.index, yArray2, i === Math.log2(data.length) ? null : [undefined, minvd[j * 2 + 1+ Math.pow(2,i-1) + Math.pow(2, i)], maxvd[j * 2 + 1+ Math.pow(2,i-1) + Math.pow(2, i)], undefined]);
                if (lastNode.nodeType === 'RIGHTNULL' || lastNode.nodeType == 'NULL') {
                    secondNode.nodeType = 'NULL';
                }
                currentLevelNodes.push(firstNode);
                currentLevelNodes.push(secondNode);
                nodeNum += 2;
            }
            
        }
        levelIndex[i] = new level_index_obj_1["default"](currentLevelNodes[0].level, true);
        levelIndex[i].addLoadedDataRange(currentLevelNodes[0], [0, currentLevelNodes.length - 1]);
        for (var i_1 = 0; i_1 < currentLevelNodes.length - 1; i_1++) {
            currentLevelNodes[i_1].nextSibling = currentLevelNodes[i_1 + 1];
            currentLevelNodes[i_1 + 1].previousSibling = currentLevelNodes[i_1];
        }
        lastLevelNodes = currentLevelNodes;
        currentLevelNodes = [];
    }
    console.log(root)
}

let arr = []
function outputTree(root){
    // console.log(root)
    let queue = []
    queue.push(root)
    while(queue.length > 0){
        let temp = queue.shift()
        if(!temp._leftChild && !temp._rightChild) arr.push(temp)
        // console.log(temp._leftChild)
        if(temp._leftChild) queue.push(temp._leftChild)
        if(temp._rightChild) queue.push(temp._rightChild)
    }
    console.log(arr)
}

// exports.constructMinMaxMissTrendTree = constructMinMaxMissTrendTree;
// exports["default"] = constructMinMaxMissTrendTree;
