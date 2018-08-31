function makeForm(form, schedule, t_schedule, type, today, tomorrow){
    const str_today = '{today}';
    const str_tomorrow = '{tomorrow}';
    if ( form.indexOf(str_today) == -1 && form.indexOf(str_tomorrow) == -1) {
        return form;
    }

    merged_form = form.replace(str_today, makehtml(schedule, type, today.format('YYYY-MM-DD')));
    merged_form = merged_form.replace(str_tomorrow, makehtml(t_schedule, type, tomorrow.format('YYYY-MM-DD')));
    return merged_form;
}

