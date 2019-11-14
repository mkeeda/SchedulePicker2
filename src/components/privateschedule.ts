import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';

@customElement('private-schedule')
export class PrivateSchedule extends LitElement {
    @property({ type: Boolean })
    isPrivate = false;

    @property({ type: Object })
    onClickedCheckbox = (): never => {
        throw new Error('イベントハンドラが登録されていません');
    };

    render(): TemplateResult {
        return html`
            <div>
                <span>非公開予定を表示しない：</span>
                <input class="checkbox" type="checkbox" .checked=${this.isPrivate} @click=${this.onClickedCheckbox} />
            </div>
        `;
    }

    static styles = css`
        div {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        span {
            font-size: 16px;
        }
    `;
}
