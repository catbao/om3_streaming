// import { emitter, getAvgTime, GlobalState, MultiTimeSeriesObj } from ".";
// import { Commit, ActionContext, ActionHandler } from 'vuex'
// import axios from "axios";
import {constructMinMaxMissTrendTree}  from "../helper/decoder"

// import * as d3 from "d3";

// async function get(state: GlobalState, url: string) {
//     if (!url.includes("influx")) {
//         if (state.controlParams.currentDB === 'DuckDB') {
//             url = 'duckdb' + url;
//         } else {
//             url = 'postgres' + url;
//         }
//     }
//     //const loading = openLoading();
//     const { data } = await axios.get(url);
//     // loading.close();
//     return data;
// }



const loadViewChangeQueryWSMinMaxMissDataInitData: ActionHandler<GlobalState, GlobalState> = (context: ActionContext<GlobalState, GlobalState>, payload: { startTime: number, endTime: number, width: number, height: number }) => {
    console.log("miss")
    //@ts-ignore
    const combinedUrl = `/line_chart/init_wavelet_bench_min_max_miss?width=${2 ** (Math.ceil(Math.log2(payload.width)))}&table_name=${context.state.controlParams.currentTable}`;
    const startT = new Date().getTime();
    const data = get(context.state, combinedUrl);
    console.log(data)
    data.then(res => {

        const currentLevel = Math.ceil(Math.log2(payload.width));

        if (Math.log2(payload.width) !== Math.ceil(Math.log2(payload.width))) {
            //console.log(payload)
            const { trendTree, dataManager } = constructMinMaxTrendTree(res);
            console.log(dataManager);
            //dataManager.realDataRowNum=2**dataManager.maxLevel;
            dataManager.getDataMinMaxMiss(currentLevel, 0, 2 ** (currentLevel) - 1).then(() => {
                const minV = dataManager.levelIndexObjs[0].firstNodes[0].yArray[1];
                const maxV = dataManager.levelIndexObjs[0].firstNodes[0].yArray[2];
                console.log(minV, maxV);
    
                const yScale = d3.scaleLinear().domain([minV, maxV]).range([payload.height, 0]);
                dataManager.viewChangeInteractionFinal(Math.ceil(Math.log2(payload.width)), payload.width, [0, 2 ** (context.state.controlParams.tableMaxLevel) - 1], yScale).then(res => {
                   
                    console.log("view time:", new Date().getTime() - startT);
                    console.log(res)
                    //dataManager.countNodeNum();
                    context.commit("addViewChangeQueryNoPowLineChartObj", { trendTree, dataManager, data: res, startTime: payload.startTime, endTime: payload.endTime, algorithm: "trendtree", width: payload.width, height: payload.height });
                });
            });
        }

    });
}

export {
    loadViewChangeQueryWSMinMaxMissDataInitData,//final method
}



