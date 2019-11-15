import { EventInfo } from '../types/event';

export const sortByTimeFunc = (eventInfo: EventInfo, nextEventInfo: EventInfo): number => {
    if (eventInfo.startTime > nextEventInfo.startTime) {
        return 1; // nextEvent, event の順番に並べ替える
    }

    if (eventInfo.startTime < nextEventInfo.startTime) {
        return -1; // event, nextEvent の順番に並べ替える
    }

    return 0;
};
