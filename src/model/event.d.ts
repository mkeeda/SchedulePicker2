import { EventsType } from '../background/eventtype';

export interface EventInfo {
    id: string;
    subject: string;
    startTime: Date;
    endTime: Date;
    eventType: string;
    eventMenu: string;
    visibilityType: string;
    attendees: Participant[];
    isAllDay: boolean;
    isStartOnly: boolean;
}

export interface Participant {
    id: string;
    name: string;
}

export interface MyGroupEvent {
    eventInfo: EventInfo;
    participants: Participant[];
}

export interface RecieveEventMessage {
    eventType: EventsType;
    dateStr: string;
    events: any;
}
