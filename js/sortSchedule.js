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