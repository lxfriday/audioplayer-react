import axios, { RawAxiosRequestConfig } from "axios";

const ins = axios.create({
  baseURL: "http://124.222.69.190:3000/",
});

ins.interceptors.response.use((config) => {
  return config;
});

export async function get(url: string, config: RawAxiosRequestConfig) {
  return (await ins.get(url, config)).data;
}
export async function post(url: string, config: RawAxiosRequestConfig) {
  return (await ins.post(url, config)).data;
}
