/**
 * Создает объект-мяч
 */
class Ball extends Shape {
  /**
   * Создает мяч на объекте-поле класса Field. Size нужен для Shape, в случае мяча захардкожен.
   * @param {Object} objField 
   * @param {number} size 
   */
  constructor(objField, size = 1) {
    super(objField, size); // хардкод размера мяча
  }

  /**
   * возвращает размер мяча (
   * @returns {number}
   */
  getSize() {
    return 1; // !!! хардкод. для упрощения мяч - всегда один пиксель
  }

  /**
   * возвращает форму мяча в виде многомерного массива
   * @returns {array}
   */
  getForm() {
    return [[true]]; // хардкод формы мяча
  }
}
