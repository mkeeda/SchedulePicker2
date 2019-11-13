import * as util from './util';
import { EventInfo, MyGroupEvent } from '../model/event';

export default class EventConverter {
    static convertToMyGroupEvent(event, participants): MyGroupEvent {
        return {
            event: this.convertToEventInfo(event),
            participants: participants,
        };
    }

    static convertToEventInfo(event: any): EventInfo {
        return {
            id: event.id,
            subject: event.subject,
            startTime: util.formatDate(new Date(event.start.dateTime)),
            endTime: util.formatDate(new Date(event.end.dateTime)),
            eventType: event.eventType,
            eventMenu: event.eventMenu,
            visibilityType: event.visibilityType,
            isAllDay: event.isAllDay,
            isStartOnly: event.isStartDay,
        };
    }
}
