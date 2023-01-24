export function getFromStorage(key: string, init: any): any {
  const str = localStorage.getItem(key);
  if (!str) return init;
  let data: any;
  try {
    data = JSON.parse(str as string);
  } catch (e) {
    data = init;
  }
  return data;
}

export function saveToStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}
