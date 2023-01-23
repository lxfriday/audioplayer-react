// 把毫秒转换成 时:分:秒
export function transformMIllionSecondsToTimeString(ms: number): string {
  ms /= 1000;
  const h = Math.floor(ms / 3600);
  const m = Math.floor((ms - h * 3600) / 60);
  const s = Math.floor(ms - h * 3600 - m * 60);
  if (h > 0) {
    return `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
  } else {
    return `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
  }
}

// 根据作者全程获得用于显示的作者名字
export function genArtistName(fullname: string): string {
  if(fullname.length < 12) return fullname
  const split = fullname.split(' ')
  if(split.length === 1) return fullname
  return split[0]
}