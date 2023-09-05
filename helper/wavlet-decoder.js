"use strict";
exports.__esModule = true;
exports.constructMinMaxMissTrendTree = void 0;
var level_index_obj_1 = require("../model/level-index-obj");
var tend_query_tree_1 = require("./tend-query-tree");
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

constructMinMaxMissTrendTree();

async function constructMinMaxMissTrendTree() {
    const querySQL = `SELECT i,minvd,maxvd,avevd FROM "om3"."mock_guassian_sin_test_om3_test" order by i asc`
    const queryData = await pool.query(querySQL);
    let data = queryData.rows;

    var levelIndex = new Array(Math.ceil(Math.log2(data.length)));
    // let maxL = Math.ceil(Math.log2(data.length))+1; //+1是因为coeff与data的倍数关系
    // var initLevel = Math.ceil(Math.log2(width));
    // var levelIndex = new Array(Math.ceil(Math.log2(data.length)) + 1);
    var minvd = [];
    var maxvd = [];
    var avevd = [];
    data.forEach(function (v) {
        minvd[v.i] = v.minvd;
        maxvd[v.i] = v.maxvd;
        avevd[v.i] = v.avevd;
    });
    // data.forEach(function (v) {
    //     minvd.push(v.minvd);
    //     maxvd.push(v.maxvd);
    //     avevd.push(v.avevd);
    // });
    // var tempLast = minvd.pop();
    // minvd.unshift(tempLast);
    // tempLast = maxvd.pop();
    // maxvd.unshift(tempLast);
    // tempLast = avevd.pop();
    // avevd.unshift(tempLast);
    var lastLevelNodes = new Array();
    var currentLevelNodes = new Array();
    var nodeNum = 1;
    //@ts-ignore
    var root = new tend_query_tree_1["default"](null, true, 0, [undefined, minvd[-1], maxvd[-1], avevd[-1], undefined], [undefined, minvd[1], maxvd[1], avevd[1], undefined]);
    lastLevelNodes.push(root);
    levelIndex[0] = new level_index_obj_1["default"](0, true);
    levelIndex[0].addLoadedDataRange(root, [0, 0]);
    var difIndex = 1;
    for (var i = 1; i <= Math.log2(data.length); i++) {
        for (var j = 0; j < lastLevelNodes.length; j++) {
            var lastNode = lastLevelNodes[j];
            if (lastNode.nodeType === "NULL") {
                //debugger
                continue;
            }
            if (difIndex === minvd.length) {
                debugger;
                throw new Error("diff index error");
            }
            var dif = [minvd[difIndex], maxvd[difIndex], avevd[difIndex]];
            difIndex++;
            var curNodeType = 'O';
            if (dif[0] === null && dif[1] === null) {
                throw new Error("data error");
                // curNodeType = "NULL";
            }
            else if (dif[0] === null) {
                curNodeType = "LEFTNULL";
                lastNode.gapFlag = 'L';
            }
            else if (dif[1] === null) {
                curNodeType = "RIGHTNULL";
                lastNode.gapFlag = 'R';
            }
            if (curNodeType !== "O") {
                lastNode.nodeType = curNodeType;
            }
            var yArray1 = [undefined, undefined, undefined, undefined, undefined];
            var yArray2 = [undefined, undefined, undefined, undefined, undefined];
            if (curNodeType === 'O') {
                if (dif[0] < 0) {
                    yArray1[1] = lastNode.yArray[1];
                    yArray2[1] = lastNode.yArray[1] - dif[0];
                }
                else {
                    yArray1[1] = lastNode.yArray[1] + dif[0];
                    yArray2[1] = lastNode.yArray[1];
                }
                if (dif[1] < 0) {
                    yArray1[2] = lastNode.yArray[2] + dif[1];
                    yArray2[2] = lastNode.yArray[2];
                }
                else {
                    yArray1[2] = lastNode.yArray[2];
                    yArray2[2] = lastNode.yArray[2] - dif[1];
                }
                if (dif[2] <= 0 || dif[2] >= 0) {
                    yArray1[3] = (lastNode.yArray[3] * 2 + dif[2]) / 2;
                    yArray2[3] = (lastNode.yArray[3] * 2 - dif[2]) / 2;
                }
            }
            else if (curNodeType == "LEFTNULL") {
                yArray2[1] = lastNode.yArray[1];
                yArray2[2] = lastNode.yArray[2];
                yArray2[3] = lastNode.yArray[3] / 2;
            }
            else if (curNodeType == "RIGHTNULL") {
                yArray1[1] = lastNode.yArray[1];
                yArray1[2] = lastNode.yArray[2];
                yArray1[3] = lastNode.yArray[3];
            }
            else if (curNodeType === 'NULL') {
                debugger;
                //console.log("null node")
            }
            else {
                throw new Error("type error");
            }
            //@ts-ignore
            var firstNode = new tend_query_tree_1["default"](lastNode, true, lastNode.index, yArray1, null, "O");
            if (curNodeType === "LEFTNULL") {
                firstNode.nodeType = 'NULL';
            }
            //@ts-ignore
            var secondNode = new tend_query_tree_1["default"](lastNode, false, lastNode.index, yArray2, null, "O");
            if (curNodeType === "RIGHTNULL") {
                secondNode.nodeType = 'NULL';
            }
            currentLevelNodes.push(firstNode);
            currentLevelNodes.push(secondNode);
            nodeNum += 2;
        }
        levelIndex[i] = new level_index_obj_1["default"](currentLevelNodes[0].level, true);
        levelIndex[i].addLoadedDataRange(currentLevelNodes[0], [currentLevelNodes[0].index, currentLevelNodes[currentLevelNodes.length - 1].index]);
        for (var i_1 = 0; i_1 < currentLevelNodes.length - 1; i_1++) {
            currentLevelNodes[i_1].nextSibling = currentLevelNodes[i_1 + 1];
            currentLevelNodes[i_1 + 1].previousSibling = currentLevelNodes[i_1];
        }
        lastLevelNodes = currentLevelNodes;
        currentLevelNodes = [];
    }
    if (difIndex !== minvd.length) {
        debugger;
        throw new Error("diff not uesed");
    }
    var levelDataManager = new level_data_manager_1["default"](levelIndex, "bao");
    console.log(root)
}
exports.constructMinMaxMissTrendTree = constructMinMaxMissTrendTree;
