import LevelIndexObj from "./level-index-obj";
import TrendTree from "../helper/tend-query-tree";

let allTimes: any = []
let allSumTimes: any = []

export default class LevelDataManager {
    levelIndexObjs: Array<LevelIndexObj>
    maxLevel: number
    realDataRowNum: number
    dataName: string
    isShow: boolean
    //columnInfos: Array<NoUniformColObj> | null
    curNodeNum: number
    dataCache: Array<TrendTree>
    cacheMap: Map<number, TrendTree>
    cacheHead: TrendTree | null
    cacheTail: TrendTree | null
    maxCacheNodeNum: number
    lruCache: any
    deleteQueue: Array<TrendTree>
    isIntering: boolean
    isEvicting: boolean
    constructor(levelIndexObjs: Array<LevelIndexObj>, dataName: string, maxLevel?: number) {
        this.levelIndexObjs = levelIndexObjs;
        // this.maxLevel = maxLevel ? maxLevel : store.state.controlParams.tableMaxLevel;
        // this.realDataRowNum = 2 ** (maxLevel ? maxLevel : store.state.controlParams.tableMaxLevel);
        this.maxLevel = 20;
        this.realDataRowNum = 2 ** this.maxLevel;
        this.dataName = dataName;
        this.isShow = true;
        //this.columnInfos = null;
        this.curNodeNum = 0;
        this.dataCache = new Array<TrendTree>();
        this.cacheMap = new Map<number, TrendTree>();
        this.cacheHead = null;
        this.cacheTail = null;
        this.maxCacheNodeNum = 100000
        this.lruCache = null;
        //this.initCache();
        this.deleteQueue = [];
        this.isIntering = false;
        this.isEvicting = false
    }
}