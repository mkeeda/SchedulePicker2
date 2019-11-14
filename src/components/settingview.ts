import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import { StorageKeys } from '../background/eventtype';
import './privateschedule';
import './selectdate';
import './editabletemplate';
import './savebutton';

@customElement('setting-view')
export class SettingView extends LitElement {
    @property({ type: Boolean })
    isPrivate = false;

    @property({ type: String })
    date = '';

    @property({ type: String })
    templateText = '';

    constructor() {
        super();
        this.initProperties();
    }

    private initProperties = (): void => {
        chrome.storage.sync.get([StorageKeys.IS_PRIVATE, StorageKeys.DATE, StorageKeys.TEMPLATE_TEXT], item => {
            if (item.isPrivate != null) {
                this.isPrivate = item.isPrivate;
            }

            if (item.date != null) {
                this.date = item.date;
            }

            if (item.templateText != null) {
                this.templateText = item.templateText;
            }
        });
    };

    onClickedCheckbox = (e): void => {
        this.isPrivate = e.currentTarget.checked;
    };

    onSelectedDate = (e): void => {
        this.date = e.currentTarget.value;
    };

    onBlurTemplate = (e): void => {
        this.templateText = e.currentTarget.textContent;
    };

    onClickedSave = (): void => {
        chrome.storage.sync.set({
            isPrivate: this.isPrivate,
            date: this.date,
            templateText: this.templateText,
        });
    };

    render(): TemplateResult {
        return html`
            <main>
                <private-schedule
                    .isPrivate=${this.isPrivate}
                    .onClickedCheckbox=${this.onClickedCheckbox}
                ></private-schedule>
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
