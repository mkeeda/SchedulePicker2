function makeForm(form, schedule, type, today){
    const str_today = '{today}';
    if ( form.indexOf(str_today) == -1) {
        return form;
    }

    merged_form = form.replace(str_today, makehtml(schedule, type, today.format('YYYY-MM-DD')));
    return merged_form;

}

