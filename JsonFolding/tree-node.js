class TreeNode {
  static Root;
  editor = null;
  htmlElemnt = null;
  foldElement = null;
  connectedNode = null;
  lines = [];
  parent = null;
  jsonEditor = null;
  collapsed = false;

  constructor(element) {
    this.htmlElemnt = element;
  }

  colapseTree = () => {
    const lines = this.editor.getLines();
    const linesArray = Array.prototype.slice.call(lines);
    const startIndex = linesArray.indexOf(this.htmlElemnt) + 1;
    const endIndex = linesArray.indexOf(this.connectedNode.htmlElemnt);
    const validLines = linesArray.slice(startIndex, endIndex);
    validLines.forEach((line) => this.addLine(line));
    console.debug("index", this.htmlElemnt, startIndex, endIndex);
    this.foldElement.textContent = "+";
  };

  expandTree = () => {
    this.lines.forEach((line) => line.classList.remove("hidden"));
    if (this.connectedNode)
      this.connectedNode.htmlElemnt.style.background = "#fff";
    this.foldElement.textContent = "-";
  };

  addLine(line) {
    line.classList.add("hidden");
    this.lines.push(line);
  }

  initStartFold(editor) {
    
    this.editor = editor;
    this.clear()
    const span = editor
    this.foldElement = document.createElement("span");
    this.foldElement.textContent = "-";
    this.foldElement.classList.add("fold-start");
    this.foldElement.addEventListener("click", this._handleFoldClick);
    this.htmlElemnt.insertBefore(this.foldElement, this.htmlElemnt.firstChild);
  }

  initEndFold(editor, startNode) {
    if (!startNode) startNode = editor.rootNode;
    this.editor = editor;
    this.connectedNode = startNode;
    startNode.connectedNode = this;
    this.htmlElemnt.classList.add("fold-end");
  }
  _handleFoldClick = (e) => {
    if (this.collapsed) {
      this.expandTree();
    } else {
      this.colapseTree();
    }
    this.collapsed = !this.collapsed;
    console.debug(this, e);
    this.connectedNode.htmlElemnt.style.background = "rgba(221 216 221,0.4)";
    window.dispatchEvent(new Event("resize"));
  };
}
