var formatSchedule = function (json) {
    // 通常予定の日時処理
    var getNormalSche = function (input) {
        var date = new Date(input);
        console.log(date,input);
        var hour = ("0" + date.getHours()).slice(-2);
        var minute = ("0" + date.getMinutes()).slice(-2);
        var time = hour + ":" + minute;
        // 以下、日付部分(今後機能追加で使うかも)
        // var year = date.getFullYear();
        // var month = ("0" + (date.getMonth() + 1)).slice(-2);
        // var day = ("0" + date.getDate()).slice(-2)
        return time;
    };
    // スケジュールのタイプが通常/繰り返し/帯で分岐させる
    var checkScheduleType = function (array, count) {
        switch (array.eventType) {
            case "REGULAR":
                {
                    //終日予定の場合の分岐
                    if (array.isAllDay === true) {
                        array.start_time = undefined;
                        array.end_time = undefined;
                        break;
                    }
                    //開始時刻のみ記入されている場合 = start_onry
                    if (array.isStartOnly === true) {
                        array.start_time = getNormalSche(array.start.dateTime);
                        array.end_time = undefined;
                        break;
                    }
                    // 普通の通常予定の場合
                    array.start_time = getNormalSche(array.start.dateTime);
                    array.end_time = getNormalSche(array.end.dateTime);
                    break;
                }
            case "REPEAT":
                {
                    //終日予定の場合の分岐
                    if (array.isAllDay === true) {
                        array.start_time = undefined;
                        array.end_time = undefined;
                        break;
                    }
                    //開始時刻のみ記入されている場合 = start_onry
                    if (array.isStartOnly === true) {
                        array.start_time = getNormalSche(array.start.dateTime);
                        array.end_time = undefined;
                    break;
                }
                    // 普通の通常予定の場合
                    array.start_time = getNormalSche(array.start.dateTime);
                    array.end_time = getNormalSche(array.end.dateTime);
                    break;
                }
            case "ALL_DAY":
                {
                    array.start_time = undefined;
                    array.end_time = undefined;
                    break;
                }
        }
        return array;
    };
    // 文字列比較のためにUndefinedを文字列に変更
    var setUndefined = function (a, b) {
        if (a.start_time === undefined) {
            a.start_time = "undefined";
        }
        if (b.start_time === undefined) {
            b.start_time = "undefined";
        }
        if (a.end_time === undefined) {
            a.end_time = "undefined";
        }
        if (b.end_time === undefined) {
            b.end_time = "undefined";
        }
    }
    // Undefinedを元に戻す
    var resetUndefined = function (a, b) {
        if (a.start.dateTime === "undefined") {
            a.start_time = undefined;
        }
        if (b.start_time === "undefined") {
            b.start_time = undefined;
        }
        if (a.end_time === "undefined") {
            a.end_time = undefined;
        }
        if (b.end_time === "undefined") {
            b.end_time = undefined;
        }
    }
    // スケジュールのソート
    var sortTime = function (array) {
        array.sort(function (a, b) {
            checkScheduleType(a);
            checkScheduleType(b);
            setUndefined(a,b);

            // 比較
            if (a.start_time > b.start_time) {
                resetUndefined(a,b);
                return 1;
            }else if(a.start_time < b.start_time) {
                resetUndefined(a,b);
                return -1;
            }
            resetUndefined(a,b);
            return 0;
        });
        return array;
    };
    // メインの処理
    var setSchedule = function () {
        schedule = json[0]["events"];
        return sortTime(schedule);
    }
    return setSchedule();
}