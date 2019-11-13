export enum ScheduleEventType {
    TODAY,
    NEXT_BUSINESS_DAY,
    SECRET,
}

export enum ContextMenuIds {
    ROOT = 'root',
    TODAY = 'today',
    NEXT_BUSINESS_DAY = 'next_business_day',
    TEMPLATE = 'template',
    MYSELF = 'myself',
}

export enum EventsType {
    MY_EVENTS,
    MY_GROUP_EVENTS,
    ERROR,
}

export enum StorageKeys {
    IS_INCLUDE = 'isInclude',
    DATE = 'date',
    TEMPLATE_TEXT = 'templateText',
}
