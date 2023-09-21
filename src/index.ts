import { Component, Listen, State, Emitter, CustomElement } from '@readymade/core';

declare type gigya = any;



@Component({
  selector: 'gigya-js',
  template: `
    <div>
      <div id="logged-out" > <h3>Welcome</h3> </div> 
      <div id="logged-in" hidden ><h3>Please Login</h3></div>
      <div id="error" hidden><h3>Heta Pally</h3></div>
      <script id="gigya-script" async crossOrigin="anonymous" src={{src}} ></script>
    </div>
  `,
  style: `
    :host {
      /* Add your styles here */
    }
  `
})

class GigyaElement extends CustomElement {
$state: string;
apiKey: string;
domain: string;
debug: string;
$gigya: gigya;
  constructor() {
    super();
    this.apiKey = null;
    this.domain = null;
    this.debug = null;
    this.$gigya = null;
    this.src = null;
  }
 

  @State()
  getState() {
    return {
      state: this.$state,
      gigya: this.$gigya,
      apiKey: this.apiKey,
      domain: this.domain,
      debug: this.debug,
      src: `https://cdns.${this.domain}/js/gigya.js?apikey=${this.apiKey}`
    };
  }
  
 attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
      this.requestUpdate();
    }
  }
  
  connectedCallback() {
    super.connectedCallback();
    const scriptEl = this.shadowRoot.getElementById('gigya-script');
    scriptEl.src = this.getUrl({ apiKey: this.apiKey, domain: this.domain });
    scriptEl.onload = this.onLoadHandler.bind(this);
  }

  // @Listen('load', 'gigya-script')
  @Listen('onGigyaServiceReady')
  @Emitter('loaded' ) 
  onLoadHandler(event) {
    console.log('Gigya loaded 🥳');
    this.$gigya = (window as any).gigya as gigya;
    this.$gigya.accounts.addEventHandlers({
      onLogin: this.onLoginHandler.bind(this),
      onLogout: this.onLogoutHandler.bind(this)
    });
   
     this.emitter.broadcast(event, "loaded");

  }

  @Emitter('login' ) 
  @Listen('login' ) 
  onLoginHandler(event) {
    console.log('login', event);
    this.$state = "logged-in";
    this.emitter.broadcast(event, "login");
  }

  @Emitter('logout' ) 
  @Listen('logout' ) 
  onLogoutHandler(e) {
    console.log('logout', e);
    this.$state = "logged-out";
    this.emitter.broadcast(e, "logout");
  }

 


 
}
