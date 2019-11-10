import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import './privateschedule';
import './selectdate';
import './editabletemplate';
import './savebutton';

@customElement('popup-view')
export class PopupView extends LitElement {
    // TODO: constructorで書き換える
    @property({ type: Boolean })
    isInclude = true;

    @property({ type: String })
    date = '';

    @property({ type: String })
    templateText = '';

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private initProperties = async () => {
        await new Promise((resolve, reject) => {
            chrome.storage.sync.get(['isInclude', 'date', 'templateText'], item => {
                if (item.isInclude != null) {
                    this.isInclude = item.isInclude;
                }

                if (item.date != null) {
                    this.date = item.date;
                }

                if (item.templateText != null) {
                    this.templateText = item.template;
                }
                console.log(item);
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
    onClickedSave = async () => {
        chrome.storage.sync.set(
            {
                isInclude: this.isInclude,
                date: this.date,
                templateText: this.templateText,
            },
            () => {
                console.log('saved');
                this.requestUpdate();
            }
        );
    };

    render(): TemplateResult {
        console.log('render');
        return html`
            <main>
                <private-schedule
                    .isInclude=${this.isInclude}
                    .onClickedCheckbox=${this.onClickedCheckbox}
                ></private-schedule>
                <select-date .date=${this.date} .onSelectedDate=${this.onSelectedDate}></select-date>
                <editable-template .onBlurTemplate=${this.onBlurTemplate}></editable-template>
                <save-button .onClickedSave=${this.onClickedSave}></save-button>
            </main>
        `;
    }

    static styles = css`
        main {
            min-width: 320px;
            max-height: 500px;
        }
    `;
}
