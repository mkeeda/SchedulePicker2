export const formatDate = (date: Date): string => {
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    const time = hour + ':' + minute;
    return time; // HH:mm
};

export const sortByTime = (events: any): any => {
    events.sort((event, nextEvent) => {
        const eventStartTime = formatDate(new Date(event.start.dateTime));
        const nextEventStartTime = formatDate(new Date(nextEvent.start.dateTime));

        if (eventStartTime > nextEventStartTime) {
            return 1; // nextEvent, event の順番に並べ替える
        }

        if (eventStartTime < nextEventStartTime) {
            return -1; // event, nextEvent の順番に並べ替える
        }

        return 0;
    });
    return events;
};

// TODO: 使用しなかったら消す
export const eventsDxo = (events: any, participantNameList: string[] = []): any => {
    return events.map(event => {
        return {
            id: event.id,
            subject: event.subject,
            participants: participantNameList,
            startTime: formatDate(new Date(event.start.dateTime)),
            endTime: formatDate(new Date(event.end.dateTime)),
            eventType: event.eventType,
            eventMenu: event.eventMenu,
            visibilityType: event.visibilityType,
            isAllDay: event.isAllDay,
            isStartOnly: event.isStartDay,
        };
    });
};
