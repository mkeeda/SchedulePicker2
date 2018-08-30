 // 通常予定の日時処理
 const getNormalSche = function(input) {
  const date = new Date(input);
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);
  const time = hour + ":" + minute;
  // 以下、日付部分(今後機能追加で使うかも)
  // const year = date.getFullYear();
  // const month = ("0" + (date.getMonth() + 1)).slice(-2);
  // const day = ("0" + date.getDate()).slice(-2)
  return time;
};

// スケジュールのタイプが通常/繰り返し/帯で分岐させる
const checkScheduleType = function(array) {
  //終日予定の場合の分岐
  if (array.isAllDay) return array;;
  //開始時刻のみ記入されている場合 = start_onry
  if (array.isStartOnly) {
    array.start_time = getNormalSche(array.start.dateTime);
    return array;
  }
  // 普通の通常予定の場合
  array.start_time = getNormalSche(array.start.dateTime);
  array.end_time = getNormalSche(array.end.dateTime);
  return array;
};