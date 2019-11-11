import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import './privateschedule';
import './selectdate';
import './editabletemplate';
import './savebutton';

@customElement('popup-view')
export class PopupView extends LitElement {
    @property({ type: Boolean })
    isInclude = true;

    @property({ type: String })
    date = '';

    @property({ type: String })
    templateText = '';

    constructor() {
        super();
        this.initProperties();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private initProperties = () => {
        new Promise((resolve, reject) => {
            chrome.storage.sync.get(['isInclude', 'date', 'templateText'], item => {
                if (item.isInclude != null) {
                    this.isInclude = item.isInclude;
                }

                if (item.date != null) {
                    this.date = item.date;
                }

                if (item.templateText != null) {
                    this.templateText = item.templateText;
                }
                resolve();
            });
        }).catch(e => {
            throw e;
        });
    };

    onClickedCheckbox = (e): void => {
        this.isInclude = e.currentTarget.checked;
    };

    onSelectedDate = (e): void => {
        this.date = e.currentTarget.value;
    };

    onBlurTemplate = (e): void => {
        this.templateText = e.currentTarget.textContent;
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    onClickedSave = () => {
        new Promise((resolve, reject) => {
            chrome.storage.sync.set(
                {
                    isInclude: this.isInclude,
                    date: this.date,
                    templateText: this.templateText,
                },
                () => {
                    resolve();
                }
            );
        }).catch(e => {
            throw e;
        });
    };

    render(): TemplateResult {
        return html`
            <main>
                <private-schedule
                    .isInclude=${this.isInclude}
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
