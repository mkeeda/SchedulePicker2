import { StorageKeys } from '../background/eventtype';

chrome.runtime.onMessage.addListener((events: any) => {
    chrome.storage.sync.get([StorageKeys.IS_INCLUDE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], item => {
        console.log(events);
        // 現在フォーカスが与えられている要素を取得する
        const target = document.activeElement;
        // フォーカスが外れているときactiveElementはnullかbodyを返す
        if (target === null || target.tagName === 'BODY') {
            return;
        }
    });
});
