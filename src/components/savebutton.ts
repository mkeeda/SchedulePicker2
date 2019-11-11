import { LitElement, html, property, customElement, TemplateResult } from 'lit-element';

@customElement('save-button')
export class SaveButton extends LitElement {
    @property({ type: Object })
    onClickedSave = (): never => {
        throw new Error('イベントハンドラが登録されていません');
    };

    render(): TemplateResult {
        return html`
            <button @click=${this.onClickedSave}>保存</button>
        `;
    }
}
