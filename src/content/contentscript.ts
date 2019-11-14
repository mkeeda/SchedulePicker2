import { EventsType } from '../background/eventtype';
import { EventInfo, Participant, RecieveEventMessage, MyGroupEvent } from '../model/event';
import { formatDate } from '../background/dateutil';

const isAlldayInRegularEvent = (eventInfo: EventInfo) => {
    const startTime = formatDate(new Date(eventInfo.startTime), 'HH:mm');
    const endTime = formatDate(new Date(eventInfo.endTime), 'HH:mm');
    return startTime === '00:00' && endTime === '23:59';
};

const createHtmlForItem = (eventInfo: EventInfo, date: Date, participants: Participant[] = []): string => {
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    return `
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
    `;
};

const createHtmlForItemWithTimeRange = (eventInfo: EventInfo, date: Date, participants: Participant[] = []): string => {
    const startTime = formatDate(new Date(eventInfo.startTime), 'HH:mm');
    const endTime = formatDate(new Date(eventInfo.endTime), 'HH:mm');
    return `
    <div>
        <span>${startTime}-${endTime}</span>
        ${createHtmlForItem(eventInfo, date, participants)}
    </div>
    `;
};

const createHtmlForEventList = (eventInfoList: EventInfo[], date: Date): string => {
    const title = `<div>【 ${formatDate(date, 'yyyy-MM-dd')} の予定 】</div>`;
    const regularEventList: EventInfo[] = [];
    const allDayEventList: EventInfo[] = []; // 終日予定

    eventInfoList.forEach(eventInfo => {
        if (eventInfo.eventType === 'REGULAR' || eventInfo.eventType === 'REPEATING') {
            regularEventList.push(eventInfo);
        } else if (eventInfo.eventType === 'ALL_DAY') {
            allDayEventList.push(eventInfo);
        } else {
            console.log(eventInfo);
        }
    });

    let body = `${title}`;
    body += regularEventList.map(eventInfo => {
        if (isAlldayInRegularEvent(eventInfo)) {
            return `<div>${createHtmlForItem(eventInfo, date)}</div>`;
        } else {
            return createHtmlForItemWithTimeRange(eventInfo, date);

        }
    }).join('');
    
    if (allDayEventList.length !== 0) {
        body += '<br><div>［終日予定］</div>';
        body += allDayEventList.map(eventInfo => `<div>${createHtmlForItem(eventInfo, date)}</div>`).join('');
    }
    return body;
};

const createHtmlForMyGroupEventList = (myGroupEventList: MyGroupEvent[], date: Date): string => {
    const title = `<div>【 ${formatDate(date, 'yyyy-MM-dd')} の予定 】</div>`;
    const regularEventList: MyGroupEvent[] = [];
    const allDayEventList: MyGroupEvent[] = []; // 終日予定

    myGroupEventList.forEach(groupEvent => {
        if (groupEvent.eventInfo.eventType === 'REGULAR' || groupEvent.eventInfo.eventType === 'REPEATING') {
            regularEventList.push(groupEvent);
        } else if (groupEvent.eventInfo.eventType === 'ALL_DAY') {
            allDayEventList.push(groupEvent);
        } else {
            console.log(groupEvent);
        }
    });

    let body = `${title}`;
    body += regularEventList
        .map(groupEvent => {
            if (isAlldayInRegularEvent(groupEvent.eventInfo)) {
                return `<div>${createHtmlForItem(groupEvent.eventInfo, date, groupEvent.participants)}</div>`;
            } else {
                return createHtmlForItemWithTimeRange(groupEvent.eventInfo, date, groupEvent.participants);
            }
        }).join('');

    if (allDayEventList.length !== 0) {
        body += '<br><div>［終日予定］</div>';
        body += allDayEventList
            .map(groupEvent => `<div>${createHtmlForItem(groupEvent.eventInfo, date, groupEvent.participants)}</div>`)
            .join('');
    }
    return body;
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

    if (message.eventType === EventsType.TEMPLATE) {
        // TODO: テンプレートの解析処理を挟む
        document.execCommand('insertText', false, message.templateText);
    }
});
