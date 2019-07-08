const formatTime = function(object) {
  return object.split('T')[1].split('+')[0].split(':',2).join(':');
};

const checkEventType = function(ele, type) {
  if (ele.visibilityType === 'PRIVATE' && !type) return;
  text += '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'
  if (ele.isAllDay) text += set_eventMenu('終日');
  if (ele.isStartOnly) {
    if (ele.eventType === 'REPESTING') str_start_datetime = formatTime(ele.start.dateTime);
    else str_start_datetime = formatTime(ele.start.dateTime);
    text += str_start_datetime + ' ';
  } else {
    str_start_datetime =formatTime(ele.start.dateTime);
    str_end_datetime = formatTime(ele.end.dateTime);
    text += str_start_datetime+ '-' + str_end_datetime + ' ';
  }

  if (ele.eventMenu !== '') text += set_eventMenu(ele.eventMenu);
  text += '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + ele.id + '" >' + ele.subject + '</a>';
  if (ele.eventType === 'REPESTING') text += '<img src="https://static.cybozu.com/g/F18.8_495/grn/image/cybozu/repeat16.gif?20180719.text" border="0" style="vertical-align: -3px;">';
  text += '</div>'
};

const makehtml = function(schedule, type, date) {
  let html_text = '';
  html_text += '<div>【' + date + '】の予定</div>';

  schedule.forEach(function(element) {
    text = '';
    switch (element.eventType) {
      case 'REPEATING':
      {
        checkEventType(element, type);
        break;
      }
      case 'REGULAR':
      {
        checkEventType(element, type);
        break;
      }
    }
    html_text = html_text + text;
  }, this);
  html_text = html_text + '</div></div>'
  html_text += '<div class="textarea-resize-cybozu"></div>';
  return html_text;
};

const set_eventMenu = function(plan) {
  plan_color = plan_list(plan);
  plan_text = '<span class="event_color1_grn" style="background-color: rgb(' +
  plan_color.r + ',' + plan_color.g + ',' + plan_color.b +
  '); display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">'
  plan_text += plan + '</span>';
  return plan_text;
};

const formatDate = (date) => {
  return moment(date).format("HH:mm");
};

const makeEventHTMLForSOAP = (event) => {
  // FIXME: 繰り返し予定のアイコンを入れたければ入れてください！

  // 終日予定
  if (event.allday) {
    const allDay = set_eventMenu("終日");
    if (event.plan) {
      const planText = set_eventMenu(event.plan);
      return `${allDay} 00:00-23:59 ${planText} ${event.detail}`;
    }
    return `${allDay} 00:00-23:59 ${event.detail}`;
  }

  // 開始時刻のみ指定された予定
  if (event.start_only) {
    const startTime = formatDate(event.when.datetimes[0].start);
    if (event.plan) {
      const planText = set_eventMenu(event.plan);
      return `${startTime} ${planText} ${event.detail}`;
    }
    return `${startTime} ${event.detail}`;
  }

  // 開始時刻も終了時刻も指定された予定
  const startTime = formatDate(event.when.datetimes[0].start);
  const endTime = formatDate(event.when.datetimes[0].end);
  if (event.plan) {
    const planText = set_eventMenu(event.plan);
    return `${startTime}-${endTime} ${planText} ${event.detail}`;
  }
  return `${startTime}-${endTime} ${event.detail}`;
};

const makeHtmlForSoap = (events, showPrivateFlag, date) => {
  //FIXME: document.createElementで作ろう！
  const scheduleTitle = '<div>【' + date + '】の予定</div>';

  // 期間予定は除外する
  events = events.filter(event => {
    return event.eventType !== "banner";
  });

  const eventHtmlList = events.map(makeEventHTMLForSOAP);
  return scheduleTitle + eventHtmlList.join("<br>");
};
