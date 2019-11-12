import { ScheduleEventType, ContextMenuIds } from './eventtype';
import ScheduleEventsModel from './scheduleeventsmodel';

const createContextMenuItems = async (): Promise<any> => {
    const defaultMenuItems = [
        { id: ContextMenuIds.ROOT.toString(), title: 'SchedulePicker' },
        { id: ContextMenuIds.TODAY.toString(), title: '今日の予定', parentId: ContextMenuIds.ROOT },
        { id: ContextMenuIds.NEXT_BUSINESS_DAY.toString(), title: '翌営業日の予定', parentId: ContextMenuIds.ROOT },
        { id: ContextMenuIds.TEMPLATE.toString(), title: 'テンプレート', parentId: ContextMenuIds.ROOT },
        { id: ContextMenuIds.MYSELF.toString(), title: '自分', parentId: ContextMenuIds.TODAY },
    ];

    const model = new ScheduleEventsModel();
    const myGroups = await model.getMyGroups();
    const myGroupMenuItems = myGroups.map(g => {
        return { id: g.key, title: g.name, parentId: ContextMenuIds.TODAY };
    });
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

const setupContextMenu = async (): Promise<void> => {
    const contextMenuItems = await createContextMenuItems();
    contextMenuItems.forEach(item => {
        addMenu(item);
    });
    chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
        console.log(info);

        switch (info.menuItemId) {
            case ContextMenuIds.MYSELF: {
                chrome.tabs.sendMessage(tab!.id!, ContextMenuIds.MYSELF);
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
            default:
                chrome.tabs.sendMessage(tab!.id!, 'mygroupの何か');
                break;
        }
    });
};

setupContextMenu();
