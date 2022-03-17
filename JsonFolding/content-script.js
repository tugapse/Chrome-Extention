// nothing to do here just import the css :
console.debug("json folding Loaded");

class WidgetControler {
  editors = null;

  constructor() {
    this.editors = [];
  }

  async init() {
    await this.waitUntilPageReady().then(() => {
      this.reload(null);
    });
  }

  unloadAll() { }

  reload(element) {
    if (!element) {
      const elements = document.querySelectorAll(
        ".entity-editor__control-group"
      );
      elements.forEach((jsonEditor) => this.updateJsonEditor(jsonEditor));
    } else {
      this.updateJsonEditor(jsonEditor);
    }
  }

  setJsonObjectHeader(jsonEditor) {
    const header = jsonEditor.parentElement.querySelector(
      ".entity-editor__field-heading"
    );
    const span = document.createElement("span");
    span.textContent = "collapse/expand";
    span.classList.add("toggle-block");

    jsonEditor.parentElement.insertBefore(span, header);
  }

  updateJsonEditor(jsonEditor) {
    this.setJsonObjectHeader(jsonEditor);
    if (!jsonEditor.hasListner) {
      jsonEditor.addEventListener("keyup", this.updateTimer);
      jsonEditor.hasListner = true;
    }

    jsonEditor.keyup = this.updateTimer
    jsonEditor.getLines = () =>
      jsonEditor.querySelectorAll(".CodeMirror-lines pre.CodeMirror-line");
    const lines = jsonEditor.getLines();
    let nodes = [];
    let index = -1;
    let rootNode;

    lines.forEach((line) => {
      const trimmedLine = line.textContent.replace(/\s/g, '');
      console.debug(line, trimmedLine);

      if (trimmedLine.endsWith("{")) {
        index = this._createTreeNode(jsonEditor, nodes, index, line);
      } else if (
        trimmedLine.endsWith("}") ||
        trimmedLine.endsWith("},")
      ) {
        index = this._createEndNode(jsonEditor, nodes, index, line);
      }
    });
    console.debug(jsonEditor, rootNode);
  }
  _clearLine() {
    line.classlist.remove("hidden")
  }

  _createTreeNode(jsonEditor, nodes, index, element) {
    const node = new TreeNode(element);
    node.initStartFold(jsonEditor);
    const newIndex = index + 1;
    nodes[newIndex] = node;
    if (index == 0) {
      jsonEditor.rootNode = node;
      debugger
    }
    return newIndex;
  }

  _createEndNode(editor, nodes, index, element) {
    const startNode = nodes.splice(nodes.length - 1)[0];
    if (!startNode) debugger;
    const endNode = new TreeNode(element);
    endNode.initEndFold(editor, startNode);
    return index - 1;
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

  updateTimer = (event) => {
    const editor = this._getParentEditor(event.target);
    editor.lastKeyPress = Date.now();
    if (!editor.updatingInterval)
      editor.updatingInterval = setInterval(() => {
        const now = Date.now();
        if (now -  editor.lastKeyPress > 2000) {
          this.updateJsonEditor(editor);
          console.debug("Updating editor", editor);
          clearInterval(editor.updatingInterval);
        }
      }, 2000);
  };

  _getParentEditor = (element) => {
    if (!element.parentElement) return element;
    const parent = element.parentElement;
    const editor = element.querySelector(".entity-editor__control-group");
    return editor || this._getParentEditor(parent);
  };
}

new WidgetControler().init();
