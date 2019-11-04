import { LitElement, html, property, customElement, TemplateResult } from 'lit-element';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
    @property() name = 'World';

    render(): TemplateResult {
        return html`
            <p>Hello, ${this.name}!</p>
        `;
    }
}
