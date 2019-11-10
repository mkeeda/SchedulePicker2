import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import './privateschedule';
import './selectdate';

@customElement('popup-view')
export class PopupView extends LitElement {
    @property({ type: Boolean })
    isInclude = true;

    @property({ type: String })
    date = '';

    onClickedCheckbox(e): void {
        this.isInclude = e.currentTarget.checked;
    }

    onSelectedDate(e): void {
        this.date = e.currentTarget.value;
    }

    render(): TemplateResult {
        return html`
            <main>
                <private-schedule
                    .isInclude=${this.isInclude}
                    .onClickedCheckbox=${this.onClickedCheckbox}
                ></private-schedule>
                <select-date .date=${this.date} .onSelectedDate=${this.onSelectedDate}></select-date>
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
