/**
 * Класс занимается итоговом рендером.
 */
class BaseRender {
    #node;
    #defaultNodeTag = "pre";
    #defaultNodeStyle = "font-size: 18px; line-height: 0.5;";
  
    constructor(parentNode = document.body) {
      const node = document.createElement(this.#defaultNodeTag);
      node.setAttribute("style", this.#defaultNodeStyle);
      parentNode.appendChild(node);
      this.#node = node;
    }
  
    render(text) {
      this.#node.innerHTML = text;
    }
  }