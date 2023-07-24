"use strict";
exports.__esModule = true;
var allTimes = [];
var allSumTimes = [];
var LevelDataManager = /** @class */ (function () {
    function LevelDataManager(levelIndexObjs, dataName, maxLevel) {
        this.levelIndexObjs = levelIndexObjs;
        // this.maxLevel = maxLevel ? maxLevel : store.state.controlParams.tableMaxLevel;
        // this.realDataRowNum = 2 ** (maxLevel ? maxLevel : store.state.controlParams.tableMaxLevel);
        this.maxLevel = 20;
        this.realDataRowNum = Math.pow(2, this.maxLevel);
        this.dataName = dataName;
        this.isShow = true;
        //this.columnInfos = null;
        this.curNodeNum = 0;
        this.dataCache = new Array();
        this.cacheMap = new Map();
        this.cacheHead = null;
        this.cacheTail = null;
        this.maxCacheNodeNum = 100000;
        this.lruCache = null;
        //this.initCache();
        this.deleteQueue = [];
        this.isIntering = false;
        this.isEvicting = false;
    }
    return LevelDataManager;
}());
exports["default"] = LevelDataManager;
