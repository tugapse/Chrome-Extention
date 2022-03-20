// nothing to do here just import the css :
console.debug("json folding Loaded");

class WidgetControler {
  editors = null;

  constructor() {
    this.editors = [];
  }

  init() {
    this.waitUntilPageReady().then(() => {
      this.reload(null);
    });
  }

  reload(element) {
    let editors = [element];
    if (!element) {
      editors = document.querySelectorAll(".entity-editor__control-group");
    }
    editors.forEach((jsonEditor) => this.updateJsonEditor(jsonEditor));
  }

  updateJsonEditor(editor) {
    if (!editor.editorAddon) {
      const jsonAddon = new JsonEditorAddon();
      jsonAddon.init(editor);
      editor.editorAddon = jsonAddon;
    }
    editor.editorAddon.reload();
  }
  _clearLine() {
    line.classlist.remove("hidden");
  }

  waitUntilPageReady = () => {
    return new Promise((resolve, rej) => {
      this._waitForPublishButtonRowTimeout(3000, resolve);
    });
  };

  _waitForPublishButtonRowTimeout = (timeout, resolve) => {
    const elementButttonElement = document.querySelector(
      ".publish-buttons-row"
    );
    if (elementButttonElement) {
      resolve(elementButttonElement);
      return;
    }
    setTimeout(
      () => this._waitForPublishButtonRowTimeout(timeout, resolve),
      timeout
    );
  };
  _getParentEditor = (element) => {
    if (!element.parentElement) return element;
    const parent = element.parentElement;
    const editor = element.querySelector(".entity-editor__control-group");
    return editor || this._getParentEditor(parent);
  };
}

new WidgetControler().init();
