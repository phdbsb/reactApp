import { combineReducers, configureStore } from "@reduxjs/toolkit";
import examsReducer from "./features/examsSlice";
import authReducer from "./features/authSlice";
import storage from "redux-persist/lib/storage";
import { baseApi } from "@/api";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  exams: examsReducer,
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
