chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	chrome.storage.sync.get(null, function (items) {

		// 現在フォーカスが与えられている要素を取得する
		let active_element = document.activeElement;
		// フォーカスしている部分を取得
		let target_area = active_element.id;
		ta = document.getElementById(target_area);
		// フォーカスしていなかったら処理をやめる
		if (target_area === "") {
			return;
		}

		// 日付処理
		let date = moment();
		let today = date.format("YYYY-MM-DD");
		let tomorrow = moment(today).add(1, 'd').format("YYYY-MM-DD");

		// オプション画面の日付情報を取得
		let selected_date = items.select;

		//date変数にそれぞれの場合の日付を代入
		if ( request === "Today"){date = moment(today)}
		else if (request === "Tomorrow"){date = moment(today).add(1, 'd')}
		else {date = moment(selected_date);}

		//RESTで取得したJSON形式のスケジュール情報をもとに処理を行う
		getSchedule(date).done(function (json) {
			var schedule = new Array();

			console.log(json);
			schedule = formatSchedule($(json));

			// オプション画面の非公開予定の値
			type = items.secret;

			// スケジュールの挿入部分
			if (request == "Today") {
				ta.innerHTML = ta.innerHTML + makehtml(schedule, type, today);
			} else if (request == "Tomorrow") {
				ta.innerHTML = ta.innerHTML + makehtml(schedule[0].events, type, tomorrow);
			} else {
				ta.innerHTML = ta.innerHTML + makehtml(schedule[0].events, type, selected_date);
			}
		});
	});
});

function getSchedule(date) {
	str_month = convertIntToDateFormat(date.month()+1);
	str_date = convertIntToDateFormat(date.date());

	day = date.year() + "-" + str_month + "-" + str_date; 
	url = '/g/api/v1/schedule/events?rangeStart=' + day + 'T00:00:00%2b09:00&rangeEnd=' + day + 'T23:59:59%2b09:00';
	return $.ajax({
		method: 'GET',
		url: url,
		dataType: 'json',
		contentType: 'application/json'
	});
}

function convertIntToDateFormat( num ){
	if(num < 10){
		return "0" + num;
	}
	return num;
}