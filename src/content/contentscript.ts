import { StorageKeys } from '../background/eventtype';

chrome.runtime.onMessage.addListener((schedule: any) => {
    chrome.storage.sync.get([StorageKeys.IS_INCLUDE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], item => {
        console.log('cs');
        console.log(schedule);
    });
});
