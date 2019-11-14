import { DateType, ContextMenuIds, EventsType, StorageKeys } from './eventtype';
import ScheduleEventsLogic from './scheduleeventslogic';
import ScheduleEventsLogicImpl from './scheduleeventslogic';
import { DateRange } from '../model/date';

let previousDomain = '';
let logic: ScheduleEventsLogic;

const showPopupWindow = (): void => {
    window.open('../popup.html', 'extension_popup', 'width=500,height=580,status=no,scrollbars=yes,resizable=no');
};

const defaultMenuItems = [
    { id: ContextMenuIds.ROOT.toString(), title: 'SchedulePicker', type: 'normal' },
    {
        id: ContextMenuIds.TODAY.toString(),
        title: '今日',
        parentId: ContextMenuIds.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuIds.NEXT_BUSINESS_DAY.toString(),
        title: '翌営業日',
        parentId: ContextMenuIds.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuIds.PREVIOUS_BUSINESS_DAY.toString(),
        title: '前営業日',
        parentId: ContextMenuIds.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuIds.SELECT_DATE.toString(),
        title: '指定日',
        parentId: ContextMenuIds.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuIds.MYSELF.toString(),
        title: '自分',
        parentId: ContextMenuIds.ROOT,
        type: 'normal',
    },
    {
        id: ContextMenuIds.MYGROUP.toString(),
        title: 'MYグループ',
        parentId: ContextMenuIds.ROOT,
        type: 'normal',
    },
    {
        id: ContextMenuIds.MYGROUP_UPDATE.toString(),
        title: '【 MYグループの更新 】',
        parentId: ContextMenuIds.MYGROUP,
        type: 'normal',
    },
    {
        id: ContextMenuIds.TEMPLATE.toString(),
        title: 'テンプレート',
        parentId: ContextMenuIds.ROOT,
        type: 'normal',
    },
];

const createContextMenuItems = async (myGroupMenuItems): Promise<any> => {
    return defaultMenuItems.concat(myGroupMenuItems);
};

const findDateRangeFromType = (type: DateType, selectedDate: Date): DateRange => {
    const now = new Date();

    switch (type) {
        case DateType.TODAY: {
            const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            return { startDate: startDate, endDate: endDate };
        }
        case DateType.NEXT_BUSINESS_DAY:
            // TODO: 翌営業日を返す
            return { startDate: now, endDate: now };
        case DateType.PREVIOUS_BUSINESS_DAY:
            // TODO: 前営業日を返す
            return { startDate: now, endDate: now };
        case DateType.SELECT_DAY: {
            const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const endDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                23,
                59,
                59
            );
            return { startDate: startDate, endDate: endDate };
        }
        default: {
            throw new Error('DateTypeが存在しません');
        }
    }
};

const addMenu = (menu: any): void => {
    chrome.contextMenus.create({
        id: menu.id,
        title: menu.title,
        parentId: menu.parentId,
        type: menu.type,
        contexts: ['editable'],
    });
};

const updateContextMenus = (): void => {
    // FIXME 全部消すんじゃなくて、MyGroupのメニューだけを消すようにする popupからの更新
    chrome.contextMenus.removeAll(async () => {
        const myGroups = await logic.getMyGroups();
        const myGroupMenuItems = myGroups.map(g => {
            return { id: g.key, title: g.name, parentId: ContextMenuIds.MYGROUP, type: 'normal' };
        });
        const contextMenuItems = await createContextMenuItems(myGroupMenuItems);
        contextMenuItems.forEach(item => {
            addMenu(item);
        });
    });
};

const setupContextMenus = async (): Promise<void> => {
    defaultMenuItems.forEach(item => {
        addMenu(item);
    });

    chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
        chrome.storage.sync.get(
            [StorageKeys.IS_PRIVATE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT, StorageKeys.DATE_TYPE],
            async items => {
                try {
                    switch (info.menuItemId) {
                        case ContextMenuIds.MYSELF: {
                            const dateRange = findDateRangeFromType(items.dateType, new Date(items.date));
                            const eventInfoList = await logic.getSortedMyEvents(dateRange);
                            chrome.tabs.sendMessage(tab!.id!, {
                                eventType: EventsType.MY_EVENTS,
                                events: eventInfoList,
                            });
                            break;
                        }
                        case ContextMenuIds.TEMPLATE: {
                            chrome.tabs.sendMessage(tab!.id!, ContextMenuIds.TEMPLATE);
                            break;
                        }
                        case ContextMenuIds.MYGROUP_UPDATE: {
                            updateContextMenus();
                            break;
                        }
                        case ContextMenuIds.TODAY: {
                            chrome.storage.sync.set({ dateType: DateType.TODAY });
                            break;
                        }
                        case ContextMenuIds.NEXT_BUSINESS_DAY: {
                            chrome.storage.sync.set({ dateType: DateType.NEXT_BUSINESS_DAY });
                            break;
                        }
                        case ContextMenuIds.PREVIOUS_BUSINESS_DAY: {
                            chrome.storage.sync.set({ dateType: DateType.PREVIOUS_BUSINESS_DAY });
                            break;
                        }
                        case ContextMenuIds.SELECT_DATE: {
                            chrome.storage.sync.set({ dateType: DateType.SELECT_DAY });
                            showPopupWindow();
                            break;
                        }
                        default: {
                            const dateRange = findDateRangeFromType(items.dateType, new Date(items.date));
                            const myGroupEventList = await logic.getMyGroupSchedule(dateRange, info.menuItemId);
                            chrome.tabs.sendMessage(tab!.id!, {
                                eventType: EventsType.MY_GROUP_EVENTS,
                                events: myGroupEventList,
                            });
                            break;
                        }
                    }
                } catch (e) {
                    chrome.tabs.sendMessage(tab!.id!, { eventType: EventsType.ERROR, events: [] });
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

setupContextMenus();
