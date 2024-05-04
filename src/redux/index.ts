import { configureStore } from "@reduxjs/toolkit";
import global from "./modules/global";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist"; //数据持久化
import reduxThunk from "redux-thunk"


// combineReducers合并reducer
const reducers = combineReducers({
    global
})

const presistConfig = {
    // 存入localstorage的ley
    key:'note-pad',
    storage
}

const persistedReducer = persistReducer(presistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [reduxThunk]
})

export const persistor = persistStore(store)