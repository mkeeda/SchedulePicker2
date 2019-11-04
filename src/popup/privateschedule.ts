import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';

@customElement('private-schedule')
export class PrivateSchedule extends LitElement {
    @property({ type: Boolean })
    isInclude = false;

    @property({ type: Object })
    onClickedCheckbox = (): never => {
        throw new Error('イベントハンドラが登録されていません');
    };

    render(): TemplateResult {
        return html`
            <div>
                <span>非公開予定を含む：</span>
                <input class="checkbox" type="checkbox" .checked=${this.isInclude} @click=${this.onClickedCheckbox} />
            </div>
        `;
    }

    static styles = css`
        div {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        span {
            font-size: 15px;
        }
    `;
}
