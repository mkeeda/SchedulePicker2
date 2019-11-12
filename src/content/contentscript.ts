import { StorageKeys } from '../background/eventtype';

chrome.runtime.onMessage.addListener((contextMenuItemName: string) => {
    chrome.storage.sync.get([StorageKeys.IS_INCLUDE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], item => {
        console.log(contextMenuItemName);
        console.log(item);
    });
});
