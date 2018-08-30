const formatSchedule = function(json) {
  const schedule = json[0]["events"];
  schedule.forEach(function(data) {
    checkScheduleType(data);
  });
  return sortTime(schedule);
};