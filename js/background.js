chrome.browserAction.onClicked.addListener(function(tab) {
	//chrome.tabs.sendMessage(tab.id, "Action");
});

var parentId = chrome.contextMenus.create({
	"title" : "SchedulePicker",
	"type" : "normal",
	"contexts" : ["all"],
	"id": "parent_id"
});

chrome.contextMenus.create({
	"title" : "Today",
	"type" : "normal",
	"contexts" : ["all"],
	"parentId": parentId,
	"onclick" : Click("Today"),
	"id": "today_id"
});

chrome.contextMenus.create({
	"title" : "Tomorrow",
	"type" : "normal",
	"contexts" : ["all"],
	"parentId": parentId,
	"onclick" : Click("Tomorrow"),
	"id": "tomorrow_id"
});

chrome.contextMenus.create({
	"title" : "Select",
	"type" : "normal",
	"contexts" : ["all"],
	"parentId": parentId,
	"onclick" : Click("Select"),
	"id": "select_id"
});

function Click(date) {
	return function(info, tab) {
		chrome.tabs.sendMessage(tab.id, date);
	};
};
