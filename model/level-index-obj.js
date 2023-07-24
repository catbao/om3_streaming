"use strict";
exports.__esModule = true;
// import { checkSetType, computeNeedLoadDataRange, isIntersect } from "../helper/util"
var LevelIndexObj = /** @class */ (function () {
    function LevelIndexObj(level, isFull) {
        if (isFull === void 0) { isFull = false; }
        this.level = level;
        this.isFull = isFull;
        this.loadedDataRange = [];
        this.firstNodes = [];
        this.isSelfCheck = false;
    }
    LevelIndexObj.prototype.deleteLoadedDataRange = function (node) {
        if (this.isFull) {
            this.isFull = false;
        }
        for (var i = 0; i < this.loadedDataRange.length; i++) {
            if (this.loadedDataRange[i][0] <= node.index && this.loadedDataRange[i][1] >= node.index) {
                if (this.loadedDataRange[i][0] === this.loadedDataRange[i][1]) {
                    this.loadedDataRange.splice(i, 1);
                    this.firstNodes.splice(i, 1);
                    break;
                }
                if (this.loadedDataRange[i][0] === node.index) {
                    this.loadedDataRange[i][0] += 1;
                    //@ts-ignore
                    node.nextSibling.previousSibling = null;
                    if (node.nextSibling == null) {
                        debugger;
                    }
                    this.firstNodes[i] = node.nextSibling;
                    //this.firstNodes[i].nextSibling.previousSibling = null
                    this.firstNodes[i] = node.nextSibling;
                    break;
                }
                if (this.loadedDataRange[i][1] === node.index) {
                    this.loadedDataRange[i][1] -= 1;
                    if (node.previousSibling != null) {
                        node.previousSibling.nextSibling = null;
                    }
                    break;
                }
                this.firstNodes.splice(i + 1, 0, node.nextSibling);
                //@ts-ignore
                node.previousSibling.nextSibling = null;
                this.loadedDataRange.splice(i + 1, 0, [node.index + 1, this.loadedDataRange[i][1]]);
                this.loadedDataRange[i][1] = node.index - 1;
                break;
            }
        }
    };
    LevelIndexObj.prototype.addLoadedDataRange = function (firstNode, range) {
        if (this.loadedDataRange.length === 0) {
            this.loadedDataRange.push(range);
            this.firstNodes.push(firstNode);
            return;
        }
        var loadedDataRangeLen = this.loadedDataRange.length;
        var isMerge = false;
        var needCheckIndex = [];
        for (var i = 0; i < loadedDataRangeLen; i++) {
            var minHead = Math.min(this.loadedDataRange[i][0], range[0]);
            if (minHead === this.loadedDataRange[i][0] && (this.loadedDataRange[i][1] + 1 === range[0])) {
                isMerge = true;
                var p = this.firstNodes[i];
                while (p.nextSibling) {
                    p = p.nextSibling;
                }
                if (p.index !== firstNode.index - 1) {
                    debugger;
                    throw new Error("index error");
                }
                p.nextSibling = firstNode;
                this.loadedDataRange[i][1] = range[1];
                if (i < loadedDataRangeLen - 1) {
                    if (range[1] + 1 === this.loadedDataRange[i + 1][0]) {
                        this.loadedDataRange[i][1] = this.loadedDataRange[i + 1][1];
                        var m = firstNode;
                        while (m.nextSibling) {
                            m = m.nextSibling;
                        }
                        m.nextSibling = this.firstNodes[i + 1];
                        this.firstNodes.splice(i + 1, 1);
                        this.loadedDataRange.splice(i + 1, 1);
                    }
                    else if (range[1] >= this.loadedDataRange[i + 1][0]) {
                        debugger;
                    }
                }
                break;
            }
            else if (minHead === range[0] && (range[1] + 1 === this.loadedDataRange[i][0])) {
                isMerge = true;
                var p = firstNode;
                while (p.nextSibling) {
                    p = p.nextSibling;
                }
                p.nextSibling = this.firstNodes[i];
                this.firstNodes[i] = firstNode;
                this.loadedDataRange[i][0] = range[0];
                break;
            }
            else {
                if (i === 0 && range[1] < this.loadedDataRange[i][0] - 1) {
                    this.loadedDataRange.unshift([range[0], range[1]]);
                    this.firstNodes.unshift(firstNode);
                    break;
                }
                else if (i === loadedDataRangeLen - 1 && range[0] > this.loadedDataRange[i][1] + 1) {
                    this.loadedDataRange.push([range[0], range[1]]);
                    this.firstNodes.push(firstNode);
                    break;
                }
                else {
                    if (range[0] > this.loadedDataRange[i][1] + 1 && range[1] < this.loadedDataRange[i + 1][0] - 1) {
                        this.loadedDataRange.splice(i + 1, 0, [range[0], range[1]]);
                        this.firstNodes.splice(i + 1, 0, firstNode);
                        break;
                    }
                }
            }
        }
        if (this.firstNodes.length === 1 && (this.loadedDataRange[0][1] - this.loadedDataRange[0][0] + 1) === Math.pow(2, this.level)) {
            this.isFull = true;
        }
    };
    LevelIndexObj.prototype.getDataByIndex = function (start, end) {
        var data = [];
        for (var i = 0; i < this.firstNodes.length; i++) {
            if (this.loadedDataRange[i][0] <= start && this.loadedDataRange[i][1] >= end) {
                var p = this.firstNodes[i];
                while (p) {
                    if (p.index >= start && p.index <= end) {
                        data.push(p.yArray);
                    }
                    if (p.index > end) {
                        break;
                    }
                    //@ts-ignore
                    p = p.nextSibling;
                }
            }
        }
        return { data: data, start: start, end: end, l: this.level };
    };
    // hasDataForRange(start: number, end: number) {
    //     if (this.isFull) {
    //         return {
    //             has: true,
    //             range: [],
    //         }
    //     }
    //     const needDataRange = computeNeedLoadDataRange([start, end], this.loadedDataRange);
    //     if (needDataRange.length === 0) {
    //         return {
    //             has: true,
    //             range: [],
    //         }
    //     } else {
    //         return {
    //             has: false,
    //             range: needDataRange
    //         }
    //     }
    // }
    //// fillLevel(){
    ////     const needDataRes=this.hasDataForRange(0,2**this.level);
    ////     if(needDataRes.has){
    ////         return
    ////     }
    // }
    LevelIndexObj.prototype.getTreeNodeStartIndex = function (start) {
        for (var i = 0; i < this.firstNodes.length; i++) {
            if (this.loadedDataRange[i][0] <= start && this.loadedDataRange[i][1] >= start) {
                var root = this.firstNodes[i];
                while (root) {
                    if (root.index === start) {
                        return root;
                    }
                    //@ts-ignore
                    root = root.nextSibling;
                }
            }
        }
        return null;
    };
    return LevelIndexObj;
}());
exports["default"] = LevelIndexObj;
