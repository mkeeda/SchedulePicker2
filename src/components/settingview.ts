import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import { StorageKeys } from '../background/eventtype';
import './changeshowprivateevent';
import './changeshowalldayevent';
import './selectdate';
import './editabletemplate';
import './savebutton';

@customElement('setting-view')
export class SettingView extends LitElement {
    @property({ type: Boolean })
    isIncludePrivateEvent = true;

    @property({ type: Boolean })
    isIncludeAllDayEvent = true;

    @property({ type: String })
    date = '';

    @property({ type: String })
    templateText = '';

    constructor() {
        super();
        this.initProperties();
    }

    private initProperties = (): void => {
        chrome.storage.sync.get(
            [
                StorageKeys.IS_INCLUDE_PRIVATE_EVENT,
                StorageKeys.IS_INCLUDE_ALL_DAY_EVENT,
                StorageKeys.DATE,
                StorageKeys.TEMPLATE_TEXT,
            ],
            item => {
                if (item.isIncludePrivateEvent != null) {
                    this.isIncludePrivateEvent = item.isIncludePrivateEvent;
                }

                if (item.isIncludeAllDayEvent != null) {
                    this.isIncludeAllDayEvent = item.isIncludeAllDayEvent;
                }

                if (item.date != null) {
                    this.date = item.date;
                }

                if (item.templateText != null) {
                    this.templateText = item.templateText;
                }
            }
        );
    };

    onChangeShowPrivateEvent = (e): void => {
        this.isIncludePrivateEvent = e.currentTarget.checked;
    };

    onChangeShowAllDayEvent = (e): void => {
        this.isIncludeAllDayEvent = e.currentTarget.checked;
    };

    onSelectedDate = (e): void => {
        this.date = e.currentTarget.value;
    };

    onBlurTemplate = (e): void => {
        this.templateText = e.currentTarget.innerHTML;
    };

    onClickedSave = (): void => {
        chrome.storage.sync.set({
            isIncludePrivateEvent: this.isIncludePrivateEvent,
            isIncludeAllDayEvent: this.isIncludeAllDayEvent,
            date: this.date,
            templateText: this.templateText,
        });
    };

    render(): TemplateResult {
        return html`
            <main>
                <change-show-private-event
                    .isIncludeEvent=${this.isIncludePrivateEvent}
                    .onClickedCheckbox=${this.onChangeShowPrivateEvent}
                ></change-show-private-event>
                <change-show-all-day-event
                    .isIncludeEvent=${this.isIncludeAllDayEvent}
                    .onClickedCheckbox=${this.onChangeShowAllDayEvent}
                ></change-show-all-day-event>
                <select-date .date=${this.date} .onSelectedDate=${this.onSelectedDate}></select-date>
                <editable-template
                    .templateText=${this.templateText}
                    .onBlurTemplate=${this.onBlurTemplate}
                ></editable-template>
                <save-button .onClickedSave=${this.onClickedSave}></save-button>
            </main>
        `;
    }

    static styles = css`
        main {
            min-width: 320px;
            max-height: 560px;
        }
    `;
}
