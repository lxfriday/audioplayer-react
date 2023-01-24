import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import audioPlayer from "./AudioPlayer";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    audioPlayer,
  },
  middleware: (getDefaultMiddles) => [
    ...getDefaultMiddles(),
    sagaMiddleware,
    createLogger({ diff: true }),
  ],
});

sagaMiddleware.run(sagas);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
