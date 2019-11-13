import { StorageKeys, EventsType } from '../background/eventtype';
import { EventInfo, Participant, RecieveEventMessage, MyGroupEvent } from '../model/event';

const createHtmlForEvent = (eventInfo: EventInfo, participants: Participant[] = []): string => {
    return `
    <div>
        <span>${eventInfo.startTime}-${eventInfo.startTime}</span>
        <a href="https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventInfo.id}">${eventInfo.subject}</a>
        ${participants
            .map(
                participant =>
                    `<a href="https://bozuman.cybozu.com/g/schedule/personal_day.csp?uid=${participant.id}">${participant.name}</a>`
            )
            .join('')}
    </div>
    `;
};

const createHtmlForEventList = (eventInfoList: EventInfo[]): string => {
    const title = `<div>【date】の予定</div>`;
    const body = eventInfoList.map(eventInfo => createHtmlForEvent(eventInfo)).join('');
    return `${title}${body}`;
};

const createHtmlForMyGroupEventList = (myGroupEventList: MyGroupEvent[]): string => {
    const title = `<div>【date】の予定</div>`;
    const body = myGroupEventList
        .map(myGroupEvent => createHtmlForEvent(myGroupEvent.eventInfo, myGroupEvent.participants))
        .join('');
    return `${title}${body}`;
};

chrome.runtime.sendMessage({ domain: document.domain });

chrome.runtime.onMessage.addListener((message: RecieveEventMessage) => {
    // 現在フォーカスが与えられている要素を取得する
    const target = document.activeElement;
    // フォーカスが外れているときactiveElementはnullかbodyを返す
    if (target === null || target.tagName === 'BODY' || message.eventType === EventsType.ERROR) {
        return;
    }

    if (message.eventType === EventsType.MY_EVENTS) {
        const html = createHtmlForEventList(message.events);
        document.execCommand('insertHtml', false, html);
    }

    if (message.eventType === EventsType.MY_GROUP_EVENTS) {
        const html = createHtmlForMyGroupEventList(message.events);
        document.execCommand('insertHtml', false, html);
    }
});
