import { EventInfo } from '../types/event';

export const sortByTimeFunc = (eventInfo: EventInfo, nextEventInfo: EventInfo): number => {
    return eventInfo.startTime.getTime() > nextEventInfo.startTime.getTime() ? 1 : -1;
};
