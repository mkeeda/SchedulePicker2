const convertIntToDateFormat = function(num) {
	if(num < 10){
		return "0" + num;
	}
	return num;
};

const getSchedule = function(date) {
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
};