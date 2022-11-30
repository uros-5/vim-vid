export function timeAgo(millis: number, float?: boolean) {
  const minutes = Math.floor(millis / 60000);
  let seconds;
  if (float == true) {
    seconds = (millis % 60000) / 1000;
  } else {
    seconds = Math.floor((millis % 60000) / 1000); //.toFixed(0);
  }
  return { minutes, seconds };
  //return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
