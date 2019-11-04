import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';
import './privateschedule';

@customElement('popup-view')
export class PopupView extends LitElement {
    @property({ type: Boolean })
    isInclude = true;

    onClickedCheckbox(e): void {
        this.isInclude = e.currentTarget.checked;
    }

    render(): TemplateResult {
        return html`
            <main>
                <private-schedule
                    .isInclude=${this.isInclude}
                    .onClickedCheckbox=${this.onClickedCheckbox}
                ></private-schedule>
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
