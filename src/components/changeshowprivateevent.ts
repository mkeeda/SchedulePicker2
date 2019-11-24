import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';

@customElement('change-show-private-event')
export class ChangeShowPrivateEventg extends LitElement {
    @property({ type: Boolean })
    isIncludePrivateEvent = false;

    @property({ type: Object })
    onClickedCheckbox = (): never => {
        throw new Error('イベントハンドラが登録されていません');
    };

    render(): TemplateResult {
        return html`
            <div>
                <span>非公開予定を表示する：</span>
                <input
                    class="checkbox"
                    type="checkbox"
                    .checked=${this.isIncludePrivateEvent}
                    @click=${this.onClickedCheckbox}
                />
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
