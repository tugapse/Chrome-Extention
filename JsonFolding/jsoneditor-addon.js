class JsonEditorAddon {
  htmlElement = null;
  rootNode = null;
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
    const trimmedLineText = this.sanitizeLine(line);

    if (trimmedLineText.endsWith("{")) {
      return this.createTreeNode(this.htmlElement, nodes, parentIndex, line);
    } else if (
      trimmedLineText.endsWith("}") ||
      trimmedLineText.endsWith("},")
    ) {
      return this.createEndNode(this.htmlElement, nodes, parentIndex, line);
    }
    return parentIndex;
  }

  addListeners() {
    this.htmlElement.onkeyup = () => this.reload();
  }

  sanitizeLine(line) {
    return line.textContent.replace(/\s/g, "");
  }

  createTreeNode(jsonEditor, nodes, index, line) {
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

  createEndNode(editor, nodes, index, line) {
    let startNode = index == 0 ? nodes[0] : nodes.splice(nodes.length - 1)[0];
    const endNode = line.treeNode || new TreeNode(line);
    endNode.initEndFold(editor, startNode);
    return index - 1;
  }
}
