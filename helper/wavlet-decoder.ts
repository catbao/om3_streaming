import LevelIndexObj from "../model/level-index-obj"
import TrendTree from "./tend-query-tree"
import LevelDataManager from "../model/level-data-manager"

function constructMinMaxMissTrendTree(data: Array<any>, width: number, tableName?: string) {
    const initLevel = Math.ceil(Math.log2(width));
    //debugger
    const levelIndex = new Array<LevelIndexObj>(Math.ceil(Math.log2(data.length)) + 1);

    const minvd: Array<number> = [];
    const maxvd: Array<number> = [];
    const avevd: Array<number> = [];

    data.forEach(v => {
        minvd.push(v.minvd);
        maxvd.push(v.maxvd);
        avevd.push(v.avevd);
    });


    let tempLast = minvd.pop();
    minvd.unshift(tempLast!);
    tempLast = maxvd.pop();
    maxvd.unshift(tempLast!);
    tempLast = avevd.pop();
    avevd.unshift(tempLast!);

    let lastLevelNodes = new Array<TrendTree>();
    let currentLevelNodes = new Array<TrendTree>();
    let nodeNum = 1;
    //@ts-ignore
    const root = new TrendTree(null, true, 0, [undefined, minvd[0], maxvd[0], avevd[0], undefined], [undefined, minvd[1], maxvd[1], avevd[1], undefined]);
    lastLevelNodes.push(root);
    levelIndex[0] = new LevelIndexObj(0, true);
    levelIndex[0].addLoadedDataRange(root, [0, 0]);

    let difIndex = 1;
    for (let i = 1; i <= initLevel; i++) {
        for (let j = 0; j < lastLevelNodes.length; j++) {
            const lastNode = lastLevelNodes[j];
            if (lastNode.nodeType === "NULL") {
                //debugger
                continue
            }
            if(difIndex===minvd.length){
                debugger
                throw new Error("diff index error")
            }
            let dif = [minvd[difIndex], maxvd[difIndex], avevd[difIndex]];
            difIndex++;
            let curNodeType: "O" | "NULL" | "LEFTNULL" | "RIGHTNULL" = 'O';
            if (dif[0] === null && dif[1] === null) {
                throw new Error("data error")
                // curNodeType = "NULL";
            } else if (dif[0] === null) {
                curNodeType = "LEFTNULL"
                lastNode.gapFlag='L'
            } else if (dif[1] === null) {
                
                curNodeType = "RIGHTNULL";
                lastNode.gapFlag='R'
            }
            if (curNodeType !== "O") {
                lastNode.nodeType = curNodeType
            }
            const yArray1: [any, any, any, any, any] = [undefined, undefined, undefined, undefined, undefined]
            const yArray2: [any, any, any, any, any] = [undefined, undefined, undefined, undefined, undefined]
            if (curNodeType === 'O') {
                if (dif[0] < 0) {
                    yArray1[1] = lastNode.yArray[1];
                    yArray2[1] = lastNode.yArray[1] - dif[0];
                } else {
                    yArray1[1] = lastNode.yArray[1] + dif[0];
                    yArray2[1] = lastNode.yArray[1];
                }
                if (dif[1] < 0) {
                    yArray1[2] = lastNode.yArray[2] + dif[1];
                    yArray2[2] = lastNode.yArray[2];
                } else {
                    yArray1[2] = lastNode.yArray[2];
                    yArray2[2] = lastNode.yArray[2] - dif[1];
                }
                if(dif[2] < 0){
                    yArray1[3] = (lastNode.yArray[3] * 2 + dif[2]) / 2;
                    yArray2[3] = (lastNode.yArray[3] * 2 - dif[2]) / 2;
                }
            } else if (curNodeType == "LEFTNULL") {
                yArray2[1] = lastNode.yArray[1];
                yArray2[2] = lastNode.yArray[2];
                yArray2[3] = lastNode.yArray[3] / 2;
            } else if (curNodeType == "RIGHTNULL") {
                yArray1[1] = lastNode.yArray[1];
                yArray1[2] = lastNode.yArray[2];
                yArray1[3] = lastNode.yArray[3];
            } else if (curNodeType === 'NULL') {
                debugger
                //console.log("null node")
            }
            else {
                throw new Error("type error")

            }

            //@ts-ignore
            const firstNode = new TrendTree(lastNode, true, lastNode.index, yArray1, null, "O");
            if (curNodeType === "LEFTNULL") {
                firstNode.nodeType = 'NULL';
            }

            //@ts-ignore
            const secondNode = new TrendTree(lastNode, false, lastNode.index, yArray2, null,"O");
            if (curNodeType === "RIGHTNULL") {
                secondNode.nodeType = 'NULL';
            }
            currentLevelNodes.push(firstNode);
            currentLevelNodes.push(secondNode);
            nodeNum += 2


        }
        levelIndex[i] = new LevelIndexObj(currentLevelNodes[0].level, true);
        levelIndex[i].addLoadedDataRange(currentLevelNodes[0], [currentLevelNodes[0].index, currentLevelNodes[currentLevelNodes.length-1].index]);
        for (let i = 0; i < currentLevelNodes.length - 1; i++) {
            currentLevelNodes[i].nextSibling = currentLevelNodes[i + 1];
            currentLevelNodes[i + 1].previousSibling = currentLevelNodes[i];

        }
        lastLevelNodes = currentLevelNodes;
        currentLevelNodes = [];
    }
    if(difIndex!==minvd.length){
        debugger
        throw new Error("diff not uesed")
    }

    const levelDataManager = new LevelDataManager(levelIndex, "bao");
    return {
        dataManager: levelDataManager,
        trendTree: root
    }
}

export  {
    constructMinMaxMissTrendTree
}