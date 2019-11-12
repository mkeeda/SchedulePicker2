import { StorageKeys } from '../background/eventtype';
import { formatDate } from '../background/util';

// FIXME: 変数名とか内部の処理とかmakehtml.jsを見ながら修正必要
const createHtml = (events: any): string => {
    const title = `<div>【date】の予定</div>`;
    const body = events
        .map(event => {
            return `
            <div>
                <span>${formatDate(new Date(event.start.dateTime))}-${formatDate(new Date(event.end.dateTime))}</span>
                <a href="https://bozuman.cybozu.com/g/schedule/view.csp?event=${event.id}">${event.subject}</a>
            </div>
            `;
        })
        .join('');
    return `${title}${body}`;
};

chrome.runtime.onMessage.addListener((events: any) => {
    chrome.storage.sync.get([StorageKeys.IS_INCLUDE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], item => {
        // 現在フォーカスが与えられている要素を取得する
        const target = document.activeElement;
        // フォーカスが外れているときactiveElementはnullかbodyを返す
        if (target === null || target.tagName === 'BODY') {
            return;
        }
        document.execCommand('insertHtml', false, createHtml(events));
    });
});
