import LevelIndexObj from "../model/level-index-obj"
import TrendTree from "./tend-query-tree"
import LevelDataManager from "../model/level-data-manager"
// / <reference types="node" />
// const Papa : any = require('papaparse');

// // 读取CSV文件
// Papa.parse("./encoded_data/bao_test.csv", {
//     header: true,
//     download: true,
//     complete: function (results) {
//       // 将CSV数据转换为JSON格式
//       var jsonData = results.data;
  
//       // 打印JSON数据
//       console.log(jsonData);
//     }
//   });
  

function constructMinMaxMissTrendTree(data: Array<any>, tableName?: string) {
    const levelIndex = new Array<LevelIndexObj>(Math.ceil(Math.log2(data.length)));

    const minvd: Array<number> = [];
    const maxvd: Array<number> = [];

    data.forEach(v => {
        minvd.push(v.minvd);
        maxvd.push(v.maxvd);
    });

    let tempLast = minvd.pop();
    minvd.unshift(tempLast!);
    tempLast = maxvd.pop();
    maxvd.unshift(tempLast!);

    let lastLevelNodes = new Array<TrendTree>();
    let currentLevelNodes = new Array<TrendTree>();
    let nodeNum = 1;
    //@ts-ignore
    const root = new TrendTree(null, true, 0, [undefined, minvd[0], maxvd[0], undefined], [undefined, minvd[1], maxvd[1],undefined]);
    lastLevelNodes.push(root);
    levelIndex[0] = new LevelIndexObj(0, true);
    levelIndex[0].addLoadedDataRange(root, [0, 0]);
    for (let i = 1; i <= Math.log2(data.length); i++) {
        for (let j = 0; j < 2 ** (i - 1); j++) {

            const lastNode = lastLevelNodes[j];
            let dif = lastNode.difference!;
            let curNodeType: "O" | "NULL" | "LEFTNULL" | "RIGHTNULL" = 'O';
            if (dif[1] === null && dif[2] === null) {
                curNodeType = "NULL";
            } else if (dif[0] === null && dif[1] === null) {
                curNodeType = "LEFTNULL"
            } else if (dif[2] === null && dif[3] === null) {
                curNodeType = "RIGHTNULL";
            }
            lastNode.nodeType = curNodeType;
            const yArray1: [any, any, any, any] = [undefined, undefined, undefined, undefined]
            const yArray2: [any, any, any, any] = [undefined, undefined, undefined, undefined]
            if (curNodeType === 'O') {
                if (lastNode.difference![1] < 0) {
                    yArray1[1] = lastNode.yArray[1];
                    yArray2[1] = lastNode.yArray[1] - lastNode.difference![1];
                } else {
                    yArray1[1] = lastNode.yArray[1] + lastNode.difference![1];
                    yArray2[1] = lastNode.yArray[1];
                }
                if (lastNode.difference![2] < 0) {
                    yArray1[2] = lastNode.yArray[2] + lastNode.difference![2];
                    yArray2[2] = lastNode.yArray[2];
                } else {
                    yArray1[2] = lastNode.yArray[2];
                    yArray2[2] = lastNode.yArray[2] - lastNode.difference![2];
                }
            } else if (curNodeType == "LEFTNULL") {
                yArray2[1] = lastNode.yArray[1];
                yArray2[2] = lastNode.yArray[2];
            } else if (curNodeType == "RIGHTNULL") {
                yArray1[1] = lastNode.yArray[1];
                yArray1[2] = lastNode.yArray[2];
            } else if (curNodeType === 'NULL') {
                //console.log("null node")
            }
            else {
                throw new Error("type error")

            }
            //@ts-ignore
            const firstNode = new TrendTree(lastNode, true, lastNode.index, yArray1, i === Math.log2(data.length) ? null : [undefined, minvd[j * 2 + 2 ** i], maxvd[j * 2 + 2 ** i],undefined]);
            if (lastNode.nodeType === 'LEFTNULL' || lastNode.nodeType === 'NULL') {
                firstNode.nodeType = 'NULL';
            }
            //@ts-ignore
            const secondNode = new TrendTree(lastNode, false, lastNode.index, yArray2, i === Math.log2(data.length) ? null : [undefined, minvd[j * 2 + 1 + 2 ** i], maxvd[j * 2 + 1 + 2 ** i], undefined]);
            if (lastNode.nodeType === 'RIGHTNULL' || lastNode.nodeType == 'NULL') {
                secondNode.nodeType = 'NULL';
            }
            currentLevelNodes.push(firstNode);
            currentLevelNodes.push(secondNode);
            nodeNum += 2
        }
        levelIndex[i] = new LevelIndexObj(currentLevelNodes[0].level, true);
        levelIndex[i].addLoadedDataRange(currentLevelNodes[0], [0, currentLevelNodes.length - 1]);
        for (let i = 0; i < currentLevelNodes.length - 1; i++) {
            currentLevelNodes[i].nextSibling = currentLevelNodes[i + 1];
            currentLevelNodes[i + 1].previousSibling = currentLevelNodes[i];
        
        }
        lastLevelNodes = currentLevelNodes;
        currentLevelNodes = [];
    }
    const levelDataManager = new LevelDataManager(levelIndex,'bao');
    return {
        dataManager: levelDataManager,
        trendTree: root
    }
}

export  {
    constructMinMaxMissTrendTree
}