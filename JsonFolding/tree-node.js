class TreeNode {
  static Root;
  jsonEditor = null;
  htmlElemnt = null;
  foldElement = null;
  connectedNode = null;
  lines = [];
  parent = null;
  collapsed = false;

  constructor(element) {
    this.htmlElemnt = element;
  }

  collapseTree() {
    const lines = this.jsonEditor.editorAddon.lines;
    const linesArray = Array.prototype.slice.call(lines);
    const startIndex = linesArray.indexOf(this.htmlElemnt) + 1;
    const endIndex = linesArray.indexOf(this.connectedNode.htmlElemnt);
    const validLines = linesArray.slice(startIndex, endIndex);
    this.htmlElemnt.classList.add("collapsed");
    validLines.forEach((line) => this._addLine(line));
    this.foldElement.textContent = "+";
    this.collapsed = true;
  }

  expandTree() {
    this.lines.forEach((line) => line.classList.remove("hidden"));
    this.htmlElemnt.classList.remove("collapsed");
    if (this.connectedNode)
      this.connectedNode.htmlElemnt.style.background = "transparent";
    this.foldElement.textContent = "-";
    this.collapsed = false;
  }

  initStartFold(editor) {
    this.jsonEditor = editor;
    this.foldElement = document.createElement("span");
    this.foldElement.textContent = "-";
    this.foldElement.classList.add("fold-start");
    this.foldElement.onclick = (e) => this._handleFoldClick(e);
    this.htmlElemnt.onclick = (e) =>
      this.collapsed && !e.foldDone && this.expandTree();
    this.htmlElemnt.insertBefore(this.foldElement, this.htmlElemnt.firstChild);
  }

  initEndFold(editor, startNode) {
    this.jsonEditor = editor;
    this.connectedNode = startNode;
    this.htmlElemnt.classList.add("fold-end");
    if (!startNode) {
      console.debug("[fa]", editor, startNode, this);
    }
    startNode.connectedNode = this;
  }
  _handleFoldClick(e) {
    e.foldDone = true;
    if (this.collapsed) {
      this.expandTree();
    } else {
      this.collapseTree();
    }
    window.dispatchEvent(new Event("resize"));
  }

  _addLine(line) {
    line.nodeEditor = this;
    line.classList.add("hidden");
    this.lines.push(line);
  }
}
