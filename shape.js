/**
 * Абстрактный класс для наследования свойств в дочерних классах(Plate, Ball).
 * @abstract
 */
class Shape {
  #field = null;
  #size = 0;
  #x = 0;
  #y = 0;

  /**
   * Присваивает новому объекту поле (объект класса Field) и размер
   * @param {Object} objField 
   * @param {number} size 
   */
  constructor(objField, size) {
    // super();
    this.setField(objField);
    this.setSize(size);
  }

  /**
   * Возвращает объект field привязанный к объекту
   * @returns {Object}
   */
  getField() {
    return this.#field;
  }

  /**
   * Устанавливает объект field для этого объекта
   * @param {Object} objField 
   */
  setField(objField) {
    if (objField instanceof Field) this.#field = objField;
    else console.error(`${objField} не объект класса Field`);
  }

  /**
   * Возвращает размер объекта
   * @returns {number}
   */
  getSize() {
    return this.#size;
  }

  /**
   * Устанавливает размер объекта
   * @param {number} value 
   */
  setSize(value) {
    if (value > 0) this.#size = value;
    else console.error(`размер объекта меньше 1`);
  }

  /**
   * метод для переопределения выходной параметр - многомерный массив example: [[]]
   * @abstract
   * @example [[true],[true],[true],[true]]
   */
  getForm() {
    return [];
  }

  /**
   * Устанавливает координаты объекту, вызывает метод поля для добавления объекта на поле
   * @param {number} x 
   * @param {number} y 
   */
  setCoords(x, y) {
    this.#x = x;
    this.#y = y;

    this.getField().addShape(x, y, this);
  }

  /**
   * Возвращает текущие координаты объекта в форме простого объекта
   * @returns {Object}
   */
  getCoords() {
    return { x: this.#x, y: this.#y };
  }
}
