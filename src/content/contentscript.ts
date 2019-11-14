import { EventsType } from '../background/eventtype';
import { EventInfo, Participant, RecieveEventMessage, MyGroupEvent } from '../model/event';
import { formatDate } from '../background/dateutil';

const createHtmlForEvent = (eventInfo: EventInfo, date: Date, participants: Participant[] = []): string => {
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    const startTime = formatDate(new Date(eventInfo.startTime), 'HH:mm');
    const endTime = formatDate(new Date(eventInfo.endTime), 'HH:mm');
    return `
    <div>
        <span>${startTime}-${endTime}</span>
        <a href="https://bozuman.cybozu.com/g/schedule/view.csp?event=${eventInfo.id}">${eventInfo.subject}</a>
        ${participants
            .map(
                participant =>
                    `<a style="color: chocolate;"
                        href="https://bozuman.cybozu.com/g/schedule/personal_day.csp?bdate=${formattedDate}&uid=${
                        participant.id
                    }">${participant.name.split(' ')[0]}, </a>`
            )
            .join('')}
    </div>
    `;
};

const createHtmlForEventList = (eventInfoList: EventInfo[], date: Date): string => {
    const title = `<div>【 ${formatDate(date, 'yyyy-MM-dd')} の予定 】</div>`;
    const body = eventInfoList.map(eventInfo => createHtmlForEvent(eventInfo, date)).join('');
    return `${title}${body}`;
};

const createHtmlForMyGroupEventList = (myGroupEventList: MyGroupEvent[], date: Date): string => {
    const title = `<div>【 ${formatDate(date, 'yyyy-MM-dd')} の予定 】</div>`;
    const body = myGroupEventList
        .map(myGroupEvent => createHtmlForEvent(myGroupEvent.eventInfo, date, myGroupEvent.participants))
        .join('');
    return `${title}${body}`;
};

chrome.runtime.sendMessage({ domain: document.domain });

// messageの中の参照型はすべてstringで帰ってくるので注意！！
chrome.runtime.onMessage.addListener((message: RecieveEventMessage) => {
    // 現在フォーカスが与えられている要素を取得する
    const target = document.activeElement;
    // フォーカスが外れているときactiveElementはnullかbodyを返す
    if (target === null || target.tagName === 'BODY' || message.eventType === EventsType.ERROR) {
        return;
    }

    if (message.eventType === EventsType.MY_EVENTS) {
        const html = createHtmlForEventList(message.events, new Date(message.dateStr));
        document.execCommand('insertHtml', false, html);
    }

    if (message.eventType === EventsType.MY_GROUP_EVENTS) {
        const html = createHtmlForMyGroupEventList(message.events, new Date(message.dateStr));
        document.execCommand('insertHtml', false, html);
    }
});
