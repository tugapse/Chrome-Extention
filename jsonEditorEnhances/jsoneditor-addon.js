class JsonEditorAddon {
  htmlElement = null;
  rootNode = null;
  config = false;
  lastPressed = null;
  timer = null;

  timerUpdate() {
    if (Date.now() > this.lastPressed + this.config.timeBeforeUpdate) {
      clearInterval(this.timer);
      this.timer = null;
      this.lastPressed = null;
      this.reload();
    }
  }

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

  isStartFold(line){
    const trimmedLineText = this.sanitizeLine(line);
    return trimmedLineText.endsWith("{") 
    // || trimmedLineText.endsWith("[") ;
  }

  isEndFold(line){
    const trimmedLineText = this.sanitizeLine(line);
    return trimmedLineText.endsWith("}") ||  trimmedLineText.endsWith("},")
    //|| trimmedLineText.endsWith("]") ||  trimmedLineText.endsWith("],")
  }

  processLine(line, parentIndex, nodes) {
    const node = nodes[parentIndex];
    if (this.isStartFold(line)) {
      return this.createTreeNode(this.htmlElement, nodes, parentIndex, line);
    } else if (this.isEndFold(line)) {
      return this.createEndNode(this.htmlElement, nodes, parentIndex, line);
    }
    node &&  node.addLine(line);
    return parentIndex;
  }

  addListeners() {
    this.htmlElement.onkeyup = () =>{
      this.lastPressed = Date.now();
      if(!this.timer){
        this.timer = setInterval(() =>this.timerUpdate(), 1000);
      }
    } 
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
