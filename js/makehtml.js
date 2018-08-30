function makehtml(schedule, type, date) {
	var html_text = ''
	html_text += "<div>【" + date + "】の予定</div>"
	console.log(schedule);
	schedule.forEach(function (element) {
		text = "";
		console.log(element)

		switch (element.eventType) {
			case "REPEATING":
				{
					if (element.visibilityType === "PRIVATE") {
						if (type === false) {
							break;
						}
					}
					text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'

					if (element.isAllDay == true) {
						text = text + set_eventMenu("終日");
					} else if (element.isStartOnly == true) {
						str_start_datetime = element.start.dateTime.split("T")[1].split("+")[0].split(":",2).join(":");
						text = text + str_start_datetime + " ";
					} else {
						str_start_datetime = element.start.dateTime.split("T")[1].split("+")[0].split(":",2).join(":");
						str_end_datetime = element.end.dateTime.split("T")[1].split("+")[0].split(":",2).join(":");
						text = text + str_start_datetime+ "-" + str_end_datetime + " ";
					}
					if (element.eventMenu !== "") {
						text = text + set_eventMenu(element.eventMenu);
					}
					text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.subject + "</a>";
					text = text + '<img src="https://static.cybozu.com/g/F18.8_495/grn/image/cybozu/repeat16.gif?20180719.text" border="0" style="vertical-align: -3px;">';
					text = text + "</div>"
					break;
				}
			case "REGULAR":
				{
					if (element.visibilityType === "PRIVATE") {
						if (type === false) {
							break;
						}
					}

					text = text + '<div class="listTime" style="line-height: 1.2; white-space: nowrap;">'

					if (element.isAllDay == true) {
						text = text + set_eventMenu("終日");
					} else if (element.isStartOnly == true) {
						str_start_datetime = element.start.dateTime.split("T")[1].split("+")[0].split(":",2).join(":");
						text = text + str_start_datetime + " ";
					} else {
						str_start_datetime = element.start.dateTime.split("T")[1].split("+")[0].split(":",2).join(":");
						str_end_datetime = element.end.dateTime.split("T")[1].split("+")[0].split(":",2).join(":");
						text = text + str_start_datetime+ "-" + str_end_datetime + " ";
					}

					if (element.eventMenu !== "") {
						text = text + set_eventMenu(element.eventMenu);
					}
					text = text + '<a href = "https://bozuman.cybozu.com/g/schedule/view.csp?event=' + element.id + '" >' + element.subject + "</a>";
					text = text + "</div>"
					break;
				}
			case "ALL_DAY":
				{}
				//帯予定についての処理を書く
				break;
		}
		html_text = html_text + text;
	}, this);
	html_text = html_text + "</div></div>"
	html_text += '<div class="textarea-resize-cybozu"></div>';
	return html_text;
}

function set_eventMenu(plan) {
	plan_color = plan_list(plan);

	plan_text = '<span class="event_color1_grn" style="background-color: rgb(' +
		plan_color.r + ',' + plan_color.g + ',' + plan_color.b +
		'); display: inline-block; margin-right: 3px; padding: 2px 2px 1px; color: rgb(255, 255, 255); font-size: 11.628px; border-radius: 2px; line-height: 1.1;">'
	plan_text += plan + '</span>';
	return plan_text;
}

function plan_list(plan) {
	plan_color = new Object();
	plan_color.r = 49;
	plan_color.g = 130;
	plan_color.b = 220;
	switch (plan) {
		//青
		case "打合":
		case "会議":
			plan_color.r = 49;
			plan_color.g = 130;
			plan_color.b = 220;
			break;
			//水色
		case "来訪":
		case "取材/講演":
		case "【履歴】来訪":
			plan_color.r = 87;
			plan_color.g = 179;
			plan_color.b = 237;
			break;
			//オレンジ
		case "出張":
		case "ウルトラワーク":
			plan_color.r = 239;
			plan_color.g = 146;
			plan_color.b = 1;
			break;
			//赤
		case "副業":
		case "複業":
		case "休み":
			plan_color.r = 244;
			plan_color.g = 72;
			plan_color.b = 72;
			break;
			//ピンク
		case "往訪":
		case "【履歴】往訪":
			plan_color.r = 241;
			plan_color.g = 148;
			plan_color.b = 167;
			break;
			//紫
		case "面接":
		case "フェア":
			plan_color.r = 181;
			plan_color.g = 146;
			plan_color.b = 216;
			break;
			//茶色
		case "勉強会":
		case "タスク":
			plan_color.r = 185;
			plan_color.g = 153;
			plan_color.b = 118;
			break;
			//黒
		case "説明会":
		case "セミナー":
		case "その他":
			plan_color.r = 153;
			plan_color.g = 153;
			plan_color.b = 153;
			break;
			//黒
		case "終日":
			plan_color.r = 50;
			plan_color.g = 205;
			plan_color.b = 50;
			break;
	}
	return plan_color;
}

