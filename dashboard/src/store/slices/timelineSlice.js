import {createSlice} from "@reduxjs/toolkit"
import { error } from "console"



const timelineslice=createSlice({
    name:"timeline",
    initialState:{
        loading:false,
        timeline:[],
        error:null,
        message:null,
    },

    reducers:{
        getAllTimelineRequest(state,action){
            state.loading=true;
            state.timeline=[];
            state.error=null;
        },
        getAllTimelineSuccess(state,action){
            state.loading=false;
            state.timeline=action.payload;
            state.error=null;
        },
        getAllTimelineFail(state, action){
            state.loading=false;
            state.timeline=[];
            state.error=action.payload;
        },
        addNewTimelineRequest(state,action){
            state.loading=true;
            state.timeline=[];
            state.error=null;
        },
        addNewTimelineSuccess(state, action){
            state.loading=false;
            state.timeline=action.payload;
            state.error=null;
        },
        addNewTimelineFail(state, action){
            state.loading=false;
            state.timeline=[];
            state.error=action.payload;
        },
        deleteTimelineRequest(state,action){
            state.loading=true;
            state.timeline=[];
            state.error=null;
        },
        deleteTimelineSuccess(state, action){
            state.loading=false;
            state.message=action.payload
            state.error=null;
        },
        deleteTimelineFail(state, action){
            state.loading=false;
            state.message=null;
            state.error=action.payload;
        },
        resetTimelineSlice(state,action){
            state.loading=false;
            state.timeline=action.payload;
            state.error=null;
            state.message=null;
        },
        clearAllErrors(state,action){
            state.error=null;
        }

    }
})