import { DateType, EventsType, StorageKeys } from './eventtype';
import ScheduleEventsLogic from './scheduleeventslogic';
import ScheduleEventsLogicImpl from './scheduleeventslogic';
import { DateRange } from '../types/date';
import { toDateFromString, formatDate } from './dateutil';
import * as moment from 'moment';
import { TemplateEvent } from 'src/types/event';

let previousDomain = '';
let logic: ScheduleEventsLogic;

const createContextMenuItems = async (myGroupMenuItems): Promise<any> => {
    return defaultMenuItems.concat(myGroupMenuItems);
};

const makeDataRange = (date: Date): DateRange => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return { startDate: startDate, endDate: endDate };
};

const getIncrementDay = (specificDate: Date, increment: number): Date =>
    new Date(specificDate.getFullYear(), specificDate.getMonth(), specificDate.getDate() + increment);

const getBusinessDate = (specificDate: Date, publicHolidays: string[], increment: number): Date => {
    const incrementDate = getIncrementDay(specificDate, increment);
    const day = moment.weekdays(incrementDate.getDay());
    const incrementDateStr = incrementDate.toLocaleDateString();
    if (day === 'Saturday' || day === 'Sunday' || publicHolidays.indexOf(incrementDateStr) >= 0) {
        return getBusinessDate(incrementDate, publicHolidays, increment);
    } else {
        return incrementDate;
    }
};

const findDateRangeFromType = (type: DateType, selectedDate: Date, publicHolidays: string[]): DateRange => {
    switch (type) {
        case DateType.TODAY: {
            return makeDataRange(new Date());
        }
        case DateType.NEXT_BUSINESS_DAY: {
            return makeDataRange(getBusinessDate(new Date(), publicHolidays, 1));
        }
        case DateType.PREVIOUS_BUSINESS_DAY:
            return makeDataRange(getBusinessDate(new Date(), publicHolidays, -1));
        case DateType.SELECT_DAY:
            return makeDataRange(selectedDate);
        default: {
            throw new Error('DateTypeが存在しません');
        }
    }
};

const addMenu = (menu: any): void => {};

const updateContextMenus = (): void => {
    // FIXME 全部消すんじゃなくて、MyGroupのメニューだけを消すようにする popupからの更新
    chrome.contextMenus.removeAll(async () => {
        const myGroups = await logic.getMyGroups();
        const myGroupMenuItems = myGroups.map(g => {
            return { id: g.key, title: g.name, parentId: ContextMenuId.MYGROUP, type: 'normal' };
        });
        const contextMenuItems = await createContextMenuItems(myGroupMenuItems);
        contextMenuItems.forEach(item => {
            addMenu(item);
        });
    });
};

const setupContextMenus = async (): Promise<void> => {
    chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
        chrome.storage.sync.get(
            [
                StorageKeys.IS_INCLUDE_PRIVATE_EVENT,
                StorageKeys.IS_INCLUDE_ALL_DAY_EVENT,
                StorageKeys.DATE,
                StorageKeys.TEMPLATE_TEXT,
                StorageKeys.DATE_TYPE,
            ],
            async items => {
                // FIXME: radioボタンが選択されたときのイベントと、API接続系のイベントを１つのswitch文で分岐している設計がよろしくない
                // FIXME: try/catchの範囲がでかすぎるので上記の対応をしたあとに適切な例外を投げる
                try {
                    switch (info.menuItemId) {
                        case ContextMenuId.MYSELF: {
                            chrome.tabs.sendMessage(tab!.id!, { eventType: EventsType.NOW_LOADING });
                            const publicHolidays = await logic.getNarrowedDownPublicHolidays(new Date());
                            const dateRange = findDateRangeFromType(
                                items.dateType,
                                toDateFromString(items.date),
                                publicHolidays
                            );
                            const eventInfoList = await logic.getSortedMyEvents(
                                dateRange,
                                items.isIncludePrivateEvent,
                                items.isIncludeAllDayEvent
                            );
                            chrome.tabs.sendMessage(tab!.id!, {
                                eventType: EventsType.MY_EVENTS,
                                dateStr: dateRange.startDate.toString(),
                                events: eventInfoList,
                            });
                            break;
                        }
                        case ContextMenuId.TEMPLATE: {
                            // FIXME: 長過ぎるので仕様を書くService層を追加してコードをコンパクトにする
                            chrome.tabs.sendMessage(tab!.id!, { eventType: EventsType.NOW_LOADING });
                            const publicHolidays = await logic.getNarrowedDownPublicHolidays(new Date());
                            const indexes = logic.getIndexesSpecialTemplateCharactor(items.templateText);
                            const templateEvent: TemplateEvent = {
                                todayEventInfoList: [],
                                nextDayEventInfoList: [],
                                previousDayEventInfoList: [],
                                indexes: indexes,
                            };

                            if (indexes.todayIndexes.length !== 0) {
                                const dateRange = findDateRangeFromType(
                                    DateType.TODAY,
                                    toDateFromString(items.date),
                                    publicHolidays
                                );
                                const eventInfoList = await logic.getSortedMyEvents(
                                    dateRange,
                                    items.isIncludePrivateEvent,
                                    items.isIncludeAllDayEvent
                                );
                                templateEvent.todayEventInfoList = eventInfoList;
                            }

                            if (indexes.nextDayIndexes.length !== 0) {
                                const dateRange = findDateRangeFromType(
                                    DateType.NEXT_BUSINESS_DAY,
                                    toDateFromString(items.date),
                                    publicHolidays
                                );
                                const eventInfoList = await logic.getSortedMyEvents(
                                    dateRange,
                                    items.isIncludePrivateEvent,
                                    items.isIncludeAllDayEvent
                                );
                                templateEvent.nextDayEventInfoList = eventInfoList;
                            }

                            if (indexes.previousDayIndexes.length !== 0) {
                                const dateRange = findDateRangeFromType(
                                    DateType.PREVIOUS_BUSINESS_DAY,
                                    toDateFromString(items.date),
                                    publicHolidays
                                );
                                const eventInfoList = await logic.getSortedMyEvents(
                                    dateRange,
                                    items.isIncludePrivateEvent,
                                    items.isIncludeAllDayEvent
                                );
                                templateEvent.previousDayEventInfoList = eventInfoList;
                            }

                            chrome.tabs.sendMessage(tab!.id!, {
                                eventType: EventsType.TEMPLATE,
                                dateStr: null,
                                events: templateEvent,
                                templateText: items.templateText,
                            });
                            break;
                        }
                        case ContextMenuId.MYGROUP_UPDATE: {
                            updateContextMenus();
                            break;
                        }
                        case ContextMenuId.TODAY: {
                            chrome.storage.sync.set({ dateType: DateType.TODAY });
                            break;
                        }
                        case ContextMenuId.NEXT_BUSINESS_DAY: {
                            chrome.storage.sync.set({ dateType: DateType.NEXT_BUSINESS_DAY });
                            break;
                        }
                        case ContextMenuId.PREVIOUS_BUSINESS_DAY: {
                            chrome.storage.sync.set({ dateType: DateType.PREVIOUS_BUSINESS_DAY });
                            break;
                        }
                        case ContextMenuId.SELECT_DATE: {
                            chrome.storage.sync.set({ dateType: DateType.SELECT_DAY });
                            showPopupWindow();
                            break;
                        }
                        default: {
                            chrome.tabs.sendMessage(tab!.id!, { eventType: EventsType.NOW_LOADING });
                            const publicHolidays = await logic.getNarrowedDownPublicHolidays(new Date());
                            const dateRange = findDateRangeFromType(
                                items.dateType,
                                toDateFromString(items.date),
                                publicHolidays
                            );
                            const myGroupEventList = await logic.getMyGroupEvents(
                                dateRange,
                                items.isIncludePrivateEvent,
                                items.isIncludeAllDayEvent,
                                info.menuItemId
                            );
                            chrome.tabs.sendMessage(tab!.id!, {
                                eventType: EventsType.MY_GROUP_EVENTS,
                                dateStr: dateRange.startDate.toString(),
                                events: myGroupEventList,
                            });
                            break;
                        }
                    }
                } catch (e) {
                    chrome.tabs.sendMessage(tab!.id!, { eventType: EventsType.ERROR });
                    throw new Error(e.message);
                }
            }
        );
    });
};

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.domain === previousDomain) {
        return;
    } else {
        logic = new ScheduleEventsLogicImpl(message.domain);
        previousDomain = message.domain;
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        dateType: DateType.TODAY,
        isIncludePrivateEvent: true,
        isIncludeAllDayEvent: true,
        templateText: `今日の予定を取得できるよ<br>{%TODAY%}<div><br><div>翌営業日の予定を取得できるよ<br>{%NEXT_BUSINESS_DAY%}</div><div><br></div><div>前営業日の予定を取得できるよ<br>{%PREVIOUS_BUSINESS_DAY%}</div></div>`,
    });
});

setupContextMenus();
