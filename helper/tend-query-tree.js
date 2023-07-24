"use strict";
exports.__esModule = true;
var TOTAL_LEVELS = 31;
var TrendTree = /** @class */ (function () {
    //fetcher: TreeNodeFetcher
    function TrendTree(parent, leftChild, index, yArray, dif, nodeType) {
        if (leftChild === void 0) { leftChild = true; }
        if (index === void 0) { index = 0; }
        this.nodeType = 'O';
        if (nodeType) {
            this.nodeType = nodeType;
        }
        this.parent = parent;
        this._leftChild = null;
        this._rightChild = null;
        this.yArray = [0, 0, 0, 0]; //Time-min,Val-min,Val-max,T-max
        this.difference = null;
        this.level = 0;
        this.previousSibling = null;
        this.nextSibling = null;
        this.nextP = null;
        this.preP = null;
        this.trendRange = [0, 0];
        if (yArray) {
            this.yArray = yArray;
        }
        if (dif) {
            this.difference = dif;
        }
        if (parent) {
            this.level = parent.level + 1;
            //this.fetcher = parent.fetcher;
            if (leftChild) {
                this.index = 2 * index;
                //@ts-ignore
                this.parent._leftChild = this;
            }
            else {
                this.index = 2 * index + 1;
                //@ts-ignore
                this.parent._rightChild = this;
            }
        }
        else {
            this.index = 0;
            //this.fetcher = new TreeNodeFetcher()
        }
        if (this.level > TOTAL_LEVELS) {
            throw new Error("This level is protected");
        }
        this.timeRange = [];
    }
    Object.defineProperty(TrendTree.prototype, "isLeafNode", {
        get: function () {
            return this.level >= TOTAL_LEVELS - 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TrendTree.prototype, "levelNums", {
        get: function () {
            return Math.pow(2, this.level);
        },
        enumerable: false,
        configurable: true
    });
    TrendTree.prototype.getTimeRange = function (globalDataLen) {
        if (this.timeRange.length > 0) {
            return [this.timeRange[0], this.timeRange[1]];
        }
        var nodeDataRange = globalDataLen / (Math.pow(2, this.level));
        this.timeRange[0] = this.index * nodeDataRange;
        this.timeRange[1] = this.timeRange[0] + nodeDataRange - 1;
        return [this.timeRange[0], this.timeRange[1]];
    };
    TrendTree.prototype.data = function (startIndex) {
        var _this = this;
        if (this.level <= TOTAL_LEVELS) {
            return this.yArray.map(function (y, i) {
                return {
                    x: _this.index - startIndex,
                    y: y
                };
            });
        }
        else {
            return [{ x: this.index - startIndex, y: this.yArray[0] }, { x: this.index - startIndex, y: this.yArray[3] }];
        }
    };
    return TrendTree;
}());
exports["default"] = TrendTree;
// get leftChild(): TrendTree | null {
//     if (this._leftChild) return this._leftChild
//     try {
//         const child = new TrendTree(this, true, this.index);
//         if (!this.difference) {
//             this.fetcher.fetch(child);
//         }
//         return child;
//     } catch (e) {
//         return null;
//     }
// }
// get rightChild(): TrendTree | null {
//     if (this._rightChild) {
//         return this._rightChild;
//     }
//     try {
//         const child = new TrendTree(this, false, this.index);
//         if (!this.difference) {
//             this.fetcher.fetch(child);
//         }
//         return child;
//     } catch (e) {
//         return null;
//     }
// }
//     get previousSibling(): TrendTree | null {
//         return (
//             this.parent && (this.parent._leftChild === this ? this.parent.previousSibling && this.parent.previousSibling.rightChild : this.parent.leftChild)
//         );
//     }
//     get nextSibling(): TrendTree | null {
//         return (
//             this.parent && (this.parent._rightChild === this ? this.parent.nextSibling && this.parent.nextSibling.leftChild : this.parent.rightChild)
//         );
//     }
// }
// export class TreeNodeFetcher {
//     constructor() {
//     }
//     fetch(child: TrendTree) {
//     }
// }
