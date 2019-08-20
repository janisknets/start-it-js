
class FormGenerator {
  shadowDom = {}

  init() {
    this.createForm();
    this.render();
  }
  
  createForm() {
    this.shadowDom = {
      self: document.getElementById('root'),
      children: [],
      parent: null,
    }
    var form = this.addItem(this.shadowDom, 'form', 'form-id');
    var submit = this.addItem(form, 'button', 'addRow');
    var div = this.addItem(form, 'div', 'input-div');
    submit.props.onClick = (event) => {
      this.addRow(div, div.children.length)
    }
    submit.props.innerHTML = 'Pievienot rindu';

    for ( var i = 0; i < 5; i++ ){
      this.addRow(div, i);
    }

    return form
  }

  addRow(parent, i) {
    var div = this.addItem(parent, 'div');
    div.props.innerHTML = `${i}) `
    this.addItem(div, 'input');
    this.addItem(div, 'input');
    this.addRemoveButton(div, parent)
  }

  addRemoveButton(div, parent) {
    var button = this.addItem(div, 'button');
    button.props.innerHTML = 'X';
    button.props.onClick = function () {
      var inputDiv = parent
      var children = [ ...inputDiv.children ];
      var idx = children.findIndex(child => div.children.indexOf(child) > -1);
      children.splice(idx, 1);
      inputDiv.children = [ ...children ]
    }
  }

  addItem(parent, type) {
    if (!parent) {
      throw new Error('vecāks netika padots!');
    }
  
    var child = {
      children: [],
      props: {},
      type
    }

    switch (type) {
      case 'form':
        this.applyFormProperties(child.props);
        break;
      case 'input':
        this.applyInputProperties(child.props);
        break;
      default:
        this.applyDefaultProperties(child.props);
        break;
    }
    parent.children.push(child);
    return child;
  }

  applyFormProperties(form){
    return form
  }

  applyInputProperties(input) {
    input.type = 'text';
    return input;
  }

  applyDefaultProperties(item) {
    return item;
  }

  renderItem(elem, idx) {
    var DOMElem = document.createElement(elem.type)
    if (elem && elem.props) {
      Object.keys(elem.props).forEach((key) => {
        if (key === 'onClick') {
          DOMElem.addEventListener('click',  (event) => {
            event.preventDefault()
            elem.props.onClick(idx)
            this.render();
          });
          return;
        }
        DOMElem[key] = elem.props[key];
      })
    }
    elem.children.forEach((child, idx) => {
      var child = this.renderItem(child, idx);
      DOMElem.appendChild(child);
    })
    return DOMElem;
  }

  render() {
    var root = document.getElementById('root');
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    var form = this.renderItem(this.shadowDom, 0);
    root.appendChild(form);
    var json = document.getElementById('json');
    console.log(JSON.stringify(this.shadowDom, null, 2));
    json.innerHTML=JSON.stringify(this.shadowDom, null, 2);
  }
}