import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import './privateschedule';
import './selectdate';
import './editabletemplate';

@customElement('popup-view')
export class PopupView extends LitElement {
    @property({ type: Boolean })
    isInclude = true;

    @property({ type: String })
    date = '';

    onClickedCheckbox(e): void {
    @property({ type: String })
    templateText = '';

        this.isInclude = e.currentTarget.checked;
    }

    onSelectedDate(e): void {
        this.date = e.currentTarget.value;
    }
    onBlurTemplate = (e): void => {
        this.templateText = e.currentTarget.textContent;
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
