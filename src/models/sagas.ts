import { takeEvery } from "redux-saga/effects";
import {
  switchAudioToEffect,
  initPlayerEffect,
  deleteFromAudioListEffect,
  initFromStorageEffect,
} from "./AudioPlayer.saga";

export default function* sagas() {
  yield takeEvery("audioPlayer/switchAudioToEffect", switchAudioToEffect);
  yield takeEvery("audioPlayer/initPlayerEffect", initPlayerEffect);
  yield takeEvery(
    "audioPlayer/deleteFromAudioListEffect",
    deleteFromAudioListEffect
  );
  yield takeEvery("audioPlayer/initFromStorageEffect", initFromStorageEffect);
}
