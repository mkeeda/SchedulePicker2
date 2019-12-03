import { DateType, EventsType, StorageKeys } from './eventtype';
import { ContextMenuParentId, ContextMenuDateId, ContextMenuActionId } from './datatype/contextmenu';
import { ContextMenuHelper } from './contextmenuhelper';
import { ContextMenu } from 'src/types/contextmenu';

const showPopupWindow = (): void => {
    window.open('../calendar.html', 'extension_calendar', 'width=300, height=100, status=no');
};

const defaultMenuItems: ContextMenu[] = [
    { id: ContextMenuParentId.ROOT, title: 'SchedulePicker', parentId: '', type: 'normal' },
    {
        id: ContextMenuDateId.TODAY,
        title: '今日',
        parentId: ContextMenuParentId.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuDateId.NEXT_BUSINESS_DAY,
        title: '翌営業日',
        parentId: ContextMenuParentId.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuDateId.PREVIOUS_BUSINESS_DAY,
        title: '前営業日',
        parentId: ContextMenuParentId.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuDateId.SELECT_DATE,
        title: '指定日',
        parentId: ContextMenuParentId.ROOT,
        type: 'radio',
    },
    {
        id: ContextMenuActionId.MYSELF,
        title: '自分',
        parentId: ContextMenuParentId.ROOT,
        type: 'normal',
    },
    {
        id: ContextMenuParentId.MYGROUP,
        title: 'MYグループ',
        parentId: ContextMenuParentId.ROOT,
        type: 'normal',
    },
    {
        id: ContextMenuActionId.MYGROUP_UPDATE,
        title: '【 MYグループの更新 】',
        parentId: ContextMenuParentId.MYGROUP,
        type: 'normal',
    },
    {
        id: ContextMenuActionId.TEMPLATE,
        title: 'テンプレート',
        parentId: ContextMenuParentId.ROOT,
        type: 'normal',
    },
];

const setupContext = (): void => {
    defaultMenuItems.forEach(item => {
        ContextMenuHelper.addMenu(item);
    });
};

setupContext();
