import { LitElement, html, customElement, TemplateResult } from 'lit-element';
import '../components/settingview';

@customElement('popup-view')
export class PopupView extends LitElement {
    render(): TemplateResult {
        return html`
            <setting-view></setting-view>
        `;
    }
}
