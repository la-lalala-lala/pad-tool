import { configureStore } from "@reduxjs/toolkit";
import global from "./modules/global";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist"; //数据持久化
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";

// combineReducers合并reducer
const reducers = combineReducers({
    global
})

const presistConfig = {
    key:'pad-tool',
    storage
}

const persistedReducer = persistReducer(presistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:{
            ignoreActions:[
                FLUSH,
                REHYDRATE,
                PAUSE,
                PERSIST,
                PURGE,
                REGISTER
            ]
        }
    })
})

export const persistor = persistStore(store)