const formatSchedule = function(json) {

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
  const checkScheduleType = function(array, count) {
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

  // 文字列比較のためにUndefinedを文字列に変更
  const setUndefined = function(a, b) {
    if (!a.start_time) a.start_time = "undefined";
    if (!b.start_time) b.start_time = "undefined";
    if (!a.end_time) a.end_time = "undefined";
    if (!b.end_time) b.end_time = "undefined";
  };

  // Undefinedを元に戻す
  const resetUndefined = function (a, b) {
    if (a.start.dateTime === "undefined") a.start_time = undefined;
    if (b.start_time === "undefined") b.start_time = undefined;
    if (a.end_time === "undefined") a.end_time = undefined;
    if (b.end_time === "undefined") b.end_time = undefined;
  };

  // スケジュールのソート
  const sortTime = function (array) {
    array.forEach(function(data) {
      checkScheduleType(data);
    })
    array.sort(function (a, b) {
      setUndefined(a, b);
      // 比較
      if (a.start_time > b.start_time) {
        resetUndefined(a, b);
        return 1;
      } else if (a.start_time < b.start_time) {
        resetUndefined(a, b);
        return -1;
      }
      resetUndefined(a, b);
      return 0;
    });
    return array;
  };

  // メインの処理
  const setSchedule = function () {
    schedule = json[0]["events"];
    return sortTime(schedule);
  };

  return setSchedule();
}