import { get, post } from "../utils/request";

/**
 * 音频详情
 */
export async function fetchAudioDetailService(id: number) {
  return await get("/song/detail", {
    params: {
      ids: id,
    },
  });
}
/**
 * 获取音频文件地址
 */
export async function fetchAudioUrlService(id: number) {
  return await get("/song/url", {
    params: {
      id: id,
    },
  });
}
/**
 * 获取歌词
 */
export async function fetchAudioLyricService(id: number) {
  return await get("/lyric", {
    params: {
      id: id,
    },
  });
}