import { get, post } from "../utils/request";

export async function fetchAudioDetailService(id: number) {
  return await get("/song/detail", {
    params: {
      ids: id,
    },
  });
}

export async function fetchAudioUrlService(id: number) {
  return await get("/song/url", {
    params: {
      id: id,
    },
  });
}