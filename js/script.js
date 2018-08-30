chrome.extension.onMessage.addListener(function(request) {
  chrome.storage.sync.get(null, function(items) {
		// 現在フォーカスが与えられている要素を取得する
	 	const active_element = document.activeElement;

		 // フォーカスしている部分を取得
		const target_area = active_element.id;
		const target = document.getElementById(target_area);

		// フォーカスしていなかったら処理をやめる
		if (target_area === '') return;

		// 日付処理
		let date;
		const today = moment().format('YYYY-MM-DD');
		const tomorrow = moment(today).add(1, 'd').format('YYYY-MM-DD');

		// オプション画面の日付情報を取得
		const selected_date = items.select;

		//date変数にそれぞれの場合の日付を代入
		switch (request) {
			case 'Today':
				date = moment(today);
				break;
			case 'Tomorrow':
				date = moment(today).add(1, 'd');
				break;
			default:
				date = moment(selected_date);
				break;
		}

		//RESTで取得したJSON形式のスケジュール情報をもとに処理を行う
		getSchedule(date).done(function(json) {
			const schedule = formatSchedule($(json));
			// オプション画面の非公開予定の値
			const type = items.secret;

			// スケジュールの挿入部分
			switch (request) {
				case 'Today':
					target.innerHTML += makehtml(schedule, type, today);
					break;
				case 'Tomorrow':
					target.innerHTML += makehtml(schedule, type, tomorrow);
					break;
				default:
					target.innerHTML += makehtml(schedule, type, selected_date);
					break;
			}
		});
	});
});
