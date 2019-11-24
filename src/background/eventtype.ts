export enum DateType {
    TODAY,
    NEXT_BUSINESS_DAY,
    PREVIOUS_BUSINESS_DAY,
    SELECT_DAY,
}

export enum ContextMenuIds {
    ROOT = 'root',
    TODAY = 'today',
    NEXT_BUSINESS_DAY = 'next_business_day',
    PREVIOUS_BUSINESS_DAY = 'previous_business_day',
    SELECT_DATE = 'select_date',
    MYSELF = 'myself',
    MYGROUP = 'mygroup',
    MYGROUP_UPDATE = 'mygroup_update',
    TEMPLATE = 'template',
}

export enum EventsType {
    MY_EVENTS,
    MY_GROUP_EVENTS,
    TEMPLATE,
    NOW_LOADING,
    ERROR,
}

export enum StorageKeys {
    IS_INCLUDE_PRIVATE_EVENT = 'isIncludePrivateEvent',
    IS_INCLUDE_ALL_DAY_EVENT = 'isIncludeAllDayEvent',
    DATE = 'date',
    TEMPLATE_TEXT = 'templateText',
    DATE_TYPE = 'dateType', // 日付のタイプ
}

export enum SpecialTemplateCharactor {
    TODAY = '{%TODAY%}',
    NEXT_BUSINESS_DAY = '{%NEXT_BUSINESS_DAY%}',
    PREVIOUS_BUSINESS_DAY = '{%PREVIOUS_BUSINESS_DAY%}',
}
