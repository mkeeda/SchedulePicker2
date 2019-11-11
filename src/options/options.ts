import { LitElement, html, customElement, TemplateResult } from 'lit-element';
import '../components/settingview';

@customElement('option-view')
export class OptionView extends LitElement {
    render(): TemplateResult {
        return html`
            <setting-view></setting-view>
        `;
    }
}
