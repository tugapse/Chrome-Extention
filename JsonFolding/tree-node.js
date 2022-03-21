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

  collapse() {
    const validLines = this._getValidLines();
    validLines.forEach((line) => this._addLine(line));
    this.htmlElemnt.classList.add("collapsed");
    this.foldElement.textContent = "+";
    this.collapsed = true;
    this.htmlElemnt.foldNode = this;
  }

  expand(updateChildren = true) {
    this.foldElement.textContent = "-";
    this.collapsed = false;
    this.htmlElemnt.classList.remove("collapsed");

    if (updateChildren) {
      this.lines.forEach((line) => this._expandLine(line));
    }
  }

  initStartFold(editor) {
    this.jsonEditor = editor;
    this.addEvents();
    this.htmlElemnt.classList.add("has-fold");
    this._createFoldElement();
    this.htmlElemnt.insertBefore(this.foldElement, this.htmlElemnt.firstChild);
  }
  addEvents() {
    this.htmlElemnt.onclick = (e) => this._checkExpand(e);
    this.htmlElemnt.onmouseenter = (e) => this._highlightNodes();
    this.htmlElemnt.onmouseleave = (e) => this._highlightNodes(false);
  }
  initEndFold(editor, startNode) {
    this.jsonEditor = editor;
    this.connectedNode = startNode;
    this.htmlElemnt.classList.add("fold-end");
    startNode.connectedNode = this;
  }

  _getValidLines() {
    const lines = this.jsonEditor.editorAddon.lines;
    const linesArray = Array.prototype.slice.call(lines);
    const startIndex = linesArray.indexOf(this.htmlElemnt) + 1;
    const endIndex = linesArray.indexOf(this.connectedNode.htmlElemnt);
    const validLines = linesArray.slice(startIndex, endIndex);
    return validLines;
  }
  _highlightNodes(highlight = true) {
    const lineClass = "highlight";

    highlight
      ? this.htmlElemnt.classList.add(lineClass)
      : this.htmlElemnt.classList.remove(lineClass);

    this._getValidLines().forEach((line) => {
      if (highlight) {
        line.classList.add(lineClass);
      } else {
        line.classList.remove(lineClass);
      }
    });
    if (this.connectedNode) {
      const elm = this.connectedNode.htmlElemnt;
      highlight
        ? elm.classList.add(lineClass)
        : elm.classList.remove(lineClass);
    }
  }
  _checkExpand(e) {
    this.collapsed && !e.foldDone && this.expand();
  }

  _createFoldElement() {
    this.foldElement =
      this.htmlElemnt.querySelector(".fold-start") ||
      document.createElement("span");
    this.foldElement.textContent = "-";
    this.foldElement.classList.add("fold-start");
    this.foldElement.onclick = (e) => this._handleFoldClick(e);
  }

  _expandLine(line) {
    line.classList.remove("hidden");
    if (line.foldNode) {
      line.foldNode.expand(false);
    }
  }

  _handleFoldClick(e) {
    e.foldDone = true;
    if (this.collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
    window.dispatchEvent(new Event("resize"));
  }

  _addLine(line) {
    line.nodeEditor = this;
    line.classList.add("hidden");
    this.lines.push(line);
  }
}
