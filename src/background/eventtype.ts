export enum ScheduleEventType {
    TODAY,
    NEXT_BUSINESS_DAY,
    SECRET,
}

export enum ContextMenuIds {
    ROOT = 'root',
    SELECT_DATE = 'select_date',
    TODAY = 'today',
    NEXT_BUSINESS_DAY = 'next_business_day',
    PREVIOUS_BUSINESS_DAY = 'previous_bisiness_day',
    MYSELF = 'myself',
    MYGROUP = 'mygroup',
    MYGROUP_UPDATE = 'mygroup_update',
    TEMPLATE = 'template',
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
