// イベントメニューのカラー設定
const plan_list = function(plan) {
	plan_color = {};
	plan_color.r = 49;
	plan_color.g = 130;
	plan_color.b = 220;
	switch (plan) {
		// 青
		case '打合':
		case '会議':
			plan_color.r = 49;
			plan_color.g = 130;
			plan_color.b = 220;
			break;
		// 水色
		case '来訪':
		case '取材/講演':
		case '【履歴】来訪':
			plan_color.r = 87;
			plan_color.g = 179;
			plan_color.b = 237;
			break;
		// オレンジ
		case '出張':
		case 'ウルトラワーク':
			plan_color.r = 239;
			plan_color.g = 146;
			plan_color.b = 1;
			break;
		// 赤
		case '副業':
		case '複業':
		case '休み':
			plan_color.r = 244;
			plan_color.g = 72;
			plan_color.b = 72;
			break;
		// ピンク
		case '往訪':
		case '【履歴】往訪':
			plan_color.r = 241;
			plan_color.g = 148;
			plan_color.b = 167;
			break;
		// 紫
		case '面接':
		case 'フェア':
			plan_color.r = 181;
			plan_color.g = 146;
			plan_color.b = 216;
			break;
		// 茶色
		case '勉強会':
		case 'タスク':
			plan_color.r = 185;
			plan_color.g = 153;
			plan_color.b = 118;
			break;
		// グレー
		case '説明会':
		case 'セミナー':
		case 'その他':
			plan_color.r = 153;
			plan_color.g = 153;
			plan_color.b = 153;
			break;
		// 黄緑
		case '終日':
			plan_color.r = 50;
			plan_color.g = 205;
			plan_color.b = 50;
			break;
	}
	return plan_color;
};