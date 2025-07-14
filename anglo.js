// anglo.js — Minimal Angular-style DOM Framework

export function bootstrapAnglo(globalState = {}) {
  const templates = document.querySelectorAll('template[data-component]');
  templates.forEach((tpl) => {
    const name = tpl.dataset.component;
    const cls = customElements.get(name);
    if (!cls) {
      customElements.define(name, class extends HTMLElement {
        constructor() {
          super();
          const clone = tpl.content.cloneNode(true);
          this.attachShadow({ mode: 'open' }).appendChild(clone);
        }

        connectedCallback() {
          const jsPath = `${this.tagName.toLowerCase()}.js`;
          import(jsPath).then((mod) => {
            const componentFn = mod[pascalCase(name)];
            const state = reactive(componentFn({ state: structuredClone(globalState) }));
            bindDirectives(this.shadowRoot, state);
          }).catch(console.error);
        }
      });
    }
  });
}

export function angloComponent(setupFn) {
  return (ctx) => setupFn(ctx);
}

function reactive(obj) {
  return new Proxy(obj, {
    set(target, prop, value) {
      target[prop] = value;
      document.dispatchEvent(new CustomEvent('anglo-update'));
      return true;
    }
  });
}

function bindDirectives(root, state) {
  function updateBindings() {
    root.querySelectorAll('[*ngIf]').forEach(el => {
      const condition = el.getAttribute('*ngIf');
      const show = evalInState(condition, state);
      el.style.display = show ? '' : 'none';
    });

    root.querySelectorAll('[\u005BngModel\u005D]').forEach(el => {
      const prop = el.getAttribute('[ngModel]');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = state[prop];
        el.oninput = (e) => state[prop] = e.target.value;
      }
    });

    root.querySelectorAll('*').forEach(el => {
      el.innerHTML = el.innerHTML.replace(/{{\s*(\w+)\s*}}/g, (_, prop) => state[prop] ?? '');
    });
  }

  updateBindings();
  document.addEventListener('anglo-update', updateBindings);

  root.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      if (attr.name.startsWith('(') && attr.name.endsWith(')')) {
        const event = attr.name.slice(1, -1);
        const handler = attr.value;
        el.addEventListener(event, () => evalInState(handler, state));
      }
    });
  });
}

function evalInState(expr, state) {
  try {
    return Function(...Object.keys(state), `return ${expr}`)(...Object.values(state));
  } catch (e) {
    console.warn('Evaluation error:', expr, e);
    return undefined;
  }
}

function pascalCase(tag) {
  return tag.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

