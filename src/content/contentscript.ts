import { StorageKeys } from '../background/eventtype';
import { EventInfo } from '../model/event';

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

chrome.runtime.sendMessage({ domain: document.domain });

chrome.runtime.onMessage.addListener((eventInfoList: EventInfo[]) => {
    chrome.storage.sync.get([StorageKeys.IS_INCLUDE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], item => {
        // 現在フォーカスが与えられている要素を取得する
        const target = document.activeElement;
        // フォーカスが外れているときactiveElementはnullかbodyを返す
        if (target === null || target.tagName === 'BODY') {
            return;
        }
        document.execCommand('insertHtml', false, createMyScheduleHtml(eventInfoList));
    });
});
