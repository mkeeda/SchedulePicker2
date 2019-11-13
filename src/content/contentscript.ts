import { StorageKeys, EventsType } from '../background/eventtype';
import { EventInfo, Participant, RecieveEventMessage } from '../model/event';

// FIXME: 変数名とか内部の処理とかmakehtml.jsを見ながら修正必要
const createMyScheduleHtml = (eventInfoList: EventInfo[]): string => {
    const title = `<div>【date】の予定</div>`;
    const body = eventInfoList
        .map(eventInfo => {
            return `
            <div>
                <span>${eventInfo.startTime}-${eventInfo.startTime}</span>
                <a href="https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventInfo.id}">${eventInfo.subject}</a>
            </div>
            `;
        })
        .join('');
    return `${title}${body}`;
};

// const createEventHtml = (eventInfoList: EventInfo[], participant: Participant[] = []) => {};

chrome.runtime.sendMessage({ domain: document.domain });

chrome.runtime.onMessage.addListener((message: RecieveEventMessage) => {
    // 現在フォーカスが与えられている要素を取得する
    const target = document.activeElement;
    // フォーカスが外れているときactiveElementはnullかbodyを返す
    if (target === null || target.tagName === 'BODY' || message.eventType === EventsType.ERROR) {
        return;
    }

    if (message.eventType === EventsType.MY_EVENTS) {
        console.log('my sche');
    }

    if (message.eventType === EventsType.MY_GROUP_EVENT) {
        console.log('group');
    }

    // document.execCommand('insertHtml', false, createMyScheduleHtml(eventInfoList));
});
