import { ScheduleEventType, ContextMenuIds, EventsType, StorageKeys } from './eventtype';
import ScheduleEventsLogic from './scheduleeventslogic';
import ScheduleEventsLogicImpl from './scheduleeventslogic';

let previousDomain = '';
let logic: ScheduleEventsLogic;
const defaultMenuItems = [
    { id: ContextMenuIds.ROOT.toString(), title: 'SchedulePicker' },
    { id: ContextMenuIds.TODAY.toString(), title: '今日の予定', parentId: ContextMenuIds.ROOT },
    { id: ContextMenuIds.NEXT_BUSINESS_DAY.toString(), title: '翌営業日の予定', parentId: ContextMenuIds.ROOT },
    { id: ContextMenuIds.TEMPLATE.toString(), title: 'テンプレート', parentId: ContextMenuIds.ROOT },
    { id: ContextMenuIds.MYSELF.toString(), title: '自分', parentId: ContextMenuIds.TODAY },
];

const createContextMenuItems = async (myGroupMenuItems): Promise<any> => {
    return defaultMenuItems.concat(myGroupMenuItems);
};

const addMenu = (menu: any): void => {
    chrome.contextMenus.create({
        id: menu.id,
        title: menu.title,
        parentId: menu.parentId,
        type: 'normal',
        contexts: ['all'],
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
        chrome.storage.sync.get([StorageKeys.IS_INCLUDE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], async items => {
            try {
                switch (info.menuItemId) {
                    case ContextMenuIds.MYSELF: {
                        const eventInfoList = await logic.getSortedMyEvents(ScheduleEventType.TODAY);
                        chrome.tabs.sendMessage(tab!.id!, { eventType: EventsType.MY_EVENTS, events: eventInfoList });
                        break;
                    }
                    case ContextMenuIds.NEXT_BUSINESS_DAY: {
                        chrome.tabs.sendMessage(tab!.id!, ContextMenuIds.NEXT_BUSINESS_DAY);
                        break;
                    }
                    case ContextMenuIds.TEMPLATE: {
                        chrome.tabs.sendMessage(tab!.id!, ContextMenuIds.TEMPLATE);
                        break;
                    }
                    default: {
                        const myGroupEventList = await logic.getMyGroupSchedule(
                            ScheduleEventType.TODAY,
                            info.menuItemId
                        );
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

chrome.runtime.onInstalled.addListener(() => {
    setupContextMenus();
});
