# ∴ anglo

A **minimal JavaScript framework** with **Angular-style syntax** for declarative and reactive UI development — all without a virtual DOM.

## Features

- Angular-inspired syntax: `*ngIf`, `[(ngModel)]`, `(click)`, `{{ value }}`
- DOM-first approach — no VDOM, no JSX
- Real HTML/CSS separation
- Reactive state with auto-rendering
- Tiny footprint and zero dependencies

---

## Usage

### 1. Define a Component Template
```html
<template data-component="hello-world">
  <h1 *ngIf="show">Hello, {{name}}!</h1>
  <input [ngModel]="name" />
  <button (click)="show = !show">Toggle</button>
</template>
```

### 2. Use the Custom Element
```html
<hello-world></hello-world>
```

### 3. Provide Component Logic
```js
// hello-world.js
import { angloComponent } from './anglo.js';

export const HelloWorld = angloComponent(() => ({
  name: 'World',
  show: true
}));
```

### 4. Bootstrap the App
```js
// main.js
import { bootstrapAnglo } from './anglo.js';

bootstrapAnglo();
```

### 5. Include Scripts in HTML
```html
<script type="module" src="./main.js"></script>
<script type="module" src="./hello-world.js"></script>
```

---

## Minimal Build Setup (Dev Workflow)

### Project Structure:
```
anglo-app/
├── index.html
├── anglo.js
├── main.js
├── hello-world.js
```

### Local Development
You can run your app using a static file server:

#### Option A: Using Python (simple and built-in)
```sh
python3 -m http.server
```
Then open your browser at `http://localhost:8000`

#### Option B: Using Node (via `http-server`)
```sh
npm install -g http-server
http-server
```

#### Option C: Using PHP 
```sh
php -S localhost:3000
```

---

## Roadmap
- [ ] Add `*ngFor` support
- [ ] Add scoped component styles
- [ ] Add lifecycle hooks (`onInit`, `onDestroy`)
- [ ] Build tool to inline and bundle components (optional)

---

## License
MIT

---

Built with <3 by [Aaron Madved](https://github.com/amadv)

