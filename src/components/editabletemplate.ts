import { LitElement, html, css, property, customElement, TemplateResult } from 'lit-element';

@customElement('editable-template')
export class EditableTemplate extends LitElement {
    @property({ type: String })
    templateText = '';

    @property({ type: Object })
    onBlurTemplate = (): never => {
        throw new Error('イベントハンドラが登録されていません');
    };

    render(): TemplateResult {
        return html`
            <div>
                <p>テンプレート</p>
                <div
                    class="input-form"
                    contenteditable="true"
                    .textContent=${this.templateText}
                    @blur=${this.onBlurTemplate}
                ></div>
            </div>
        `;
    }

    static styles = css`
        .input-form {
            min-width: 400px;
            max-width: 480px;
            min-height: 400px;
            max-height: 480px;
            border: black solid 1px;
            margin-bottom: 8px;
            font-size: 16px;
        }
        p {
            font-size: 16px;
            margin: 0 0 4px 0;
        }
    `;
}
