class JsonEditorAddon {
  htmlElement = null;
  rootNode = null;
  lastKeyPressTime = null;
  updateTimer = null;
  config = false;

  get lines() {
    return this.htmlElement.querySelectorAll(
      ".CodeMirror-lines pre.CodeMirror-line"
    );
  }

  init(htmlElement, config) {
    this.htmlElement = htmlElement;
    this.config = config || new EditorConfig();
    this.addListeners();
  }

  reload() {
    const nodes = [];
    let index = -1;
    this.lines.forEach(
      (line) => (index = this.processLine(line, index, nodes))
    );
  }

  processLine(line, parentIndex, nodes) {
    const trimmedLineText = this._sanitizeLine(line);

    if (trimmedLineText.endsWith("{")) {
      return this._createTreeNode(this.htmlElement, nodes, parentIndex, line);
    } else if (
      trimmedLineText.endsWith("}") ||
      trimmedLineText.endsWith("},")
    ) {
      return this._createEndNode(this.htmlElement, nodes, parentIndex, line);
    }
    return parentIndex;
  }

  unload() {}

  addListeners() {
    this.htmlElement.keyup = () => this._updateTimer();
  }

  _updateTimer(e) {
    const now = Date.now();
    const validTime = this.lastKeyPressTime + this.config.timeBeforeUpdate;
    if (now > validTime) {
      this.reload();
      clearInterval(this._updateTimer);
    }
  }

  _sanitizeLine(line) {
    return line.textContent.replace(/\s/g, "");
  }

  _createTreeNode(jsonEditor, nodes, index, line) {
    const node = line.treeNode || new TreeNode(line);
    node.initStartFold(jsonEditor);
    const newIndex = index + 1;
    nodes[newIndex] = node;
    if (index == 0) {
      jsonEditor.rootNode = node;
    }
    line.treeNode = node;
    return newIndex;
  }

  _createEndNode(editor, nodes, index, line) {
    let startNode = index == 0 ? nodes[0] : nodes.splice(nodes.length - 1)[0];
    console.debug("[fa] startNode", startNode);
    const endNode = line.treeNode || new TreeNode(line);
    endNode.initEndFold(editor, startNode);
    return index - 1;
  }
}
