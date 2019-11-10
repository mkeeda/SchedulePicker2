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

    onClickedCheckbox = (e): void => {
        this.isInclude = e.currentTarget.checked;
    };

    onSelectedDate = (e): void => {
        this.date = e.currentTarget.value;
    };

    onBlurTemplate = (e): void => {
        this.templateText = e.currentTarget.textContent;
    };

    onClickedSave = (): void => {
        console.log(this.isInclude);
        console.log(this.date);
        console.log(this.templateText);
    };

    render(): TemplateResult {
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
