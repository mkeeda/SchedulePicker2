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
            min-width: 380px;
            max-width: 500px;
            min-height: 380px;
            max-height: 500px;
            border: black solid 1px;
            margin-bottom: 10px;
        }
        p {
            font-size: 15px;
            margin: 0;
        }
    `;
}
