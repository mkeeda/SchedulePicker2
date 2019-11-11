import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';

@customElement('select-date')
export class SelectDate extends LitElement {
    @property({ type: String })
    date = '';

    @property({ type: Object })
    onSelectedDate = (): never => {
        throw new Error('イベントハンドラが登録されていません');
    };

    render(): TemplateResult {
        return html`
            <div>
                <span>日付：</span>
                <input class="calendar" type="date" .value=${this.date} @change=${this.onSelectedDate} />
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
