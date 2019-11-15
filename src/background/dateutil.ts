export const formatDate = (date: Date, format): string => {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format;
};

export const toDateFromString = (str: string): Date => {
    // FIXME: items.date が undefined もしくは 空文字の場合はポップアップウインドウを出すようにした方がユーザーに親切
    // 指定日が選択されていないときは今日の日付を出すようにしている。
    if (str === '' || str == null) {
        return new Date();
    } else {
        return new Date(str);
    }
};
