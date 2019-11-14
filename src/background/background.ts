import { DateType, ContextMenuIds, EventsType, StorageKeys } from './eventtype';
import ScheduleEventsLogic from './scheduleeventslogic';
import ScheduleEventsLogicImpl from './scheduleeventslogic';
import * as util from './util';

let previousDomain = '';
let logic: ScheduleEventsLogic;

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
        chrome.storage.sync.get([StorageKeys.IS_PRIVATE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], async items => {
            try {
                switch (info.menuItemId) {
                    case ContextMenuIds.MYSELF: {
                        const eventInfoList = await logic.getSortedMyEvents(DateType.TODAY);
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
                        chrome.storage.sync.set({ dateType: DateType.SECRET_DAY });
                        util.showPopupWindow();
                        break;
                    }
                    default: {
                        const myGroupEventList = await logic.getMyGroupSchedule(DateType.TODAY, info.menuItemId);
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
        });
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
