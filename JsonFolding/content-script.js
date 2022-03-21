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
  clearLine() {
    line.classlist.remove("hidden");
  }

  waitUntilPageReady = () => {
    return new Promise((resolve, rej) => {
      this.waitForPublishButtonRowTimeout(3000, resolve);
    });
  };

  waitForPublishButtonRowTimeout = (timeout, resolve) => {
    const elementButttonElement = document.querySelector(
      ".publish-buttons-row"
    );
    if (elementButttonElement) {
      resolve(elementButttonElement);
      return;
    }
    setTimeout(
      () => this.waitForPublishButtonRowTimeout(timeout, resolve),
      timeout
    );
  };
  getParentEditor = (element) => {
    if (!element.parentElement) return element;
    const parent = element.parentElement;
    const editor = element.querySelector(".entity-editor__control-group");
    return editor || this.getParentEditor(parent);
  };
}

new WidgetControler().init();
