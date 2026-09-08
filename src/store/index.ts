import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import dashboardReducer from "./slices/dashboardSlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";
import chatReducer from "./slices/chatSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
    ui: uiReducer,
    chat: chatReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
