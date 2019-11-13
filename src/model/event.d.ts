export interface EventInfo {
    id: string;
    subject: string;
    startTime: string;
    endTime: string;
    eventType: string;
    eventMenu: string;
    visibilityType: string;
    isAllDay: boolean;
    isStartOnly: boolean;
}

export interface Participant {
    id: string;
    name: string;
}

export interface MyGroupEvent {
    event: EventInfo;
    participants: Participant[];
}
