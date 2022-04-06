/**
 * Создает объект-ракетку(plate) на поле
 */
class Plate extends Shape {
  /**
   * Создает ракетку на объекте-поле класса Field с размером, указанным в size.
   * @param {Object} objField 
   * @param {number} size 
   */
  constructor(objField, size = 6) {
    super(objField, size);
  }

  /**
   * Проверяет и устанавливает объекту plate координаты, но в пределах поля
   * (координаты нужны для установки на поле ч/з родительский метод)
   * @param {number} x 
   * @param {number} y 
   */
  setCoords(x, y) {
    let newX = x;
    let newY = y;

    const field = this.getField();
    if (y > field.getHeight() - this.getForm().length) {
      newY = field.getHeight() - this.getForm().length;
    }
    if (x >= field.getWidth()) {
      newX = field.getWidth() - 1;
    }
    if (x < 0) {
      newX = 0;
    }
    if (y < 0) {
      newY = 0;
    }

    super.setCoords(newX, newY);
  }

  /**
   * возвращает форму ракетки в виде многомерного массива
   * @returns {array}
   */
  getForm() {
    let initArr = [];
    for (let i = 0; i < this.getSize(); i++) {
      initArr[i] = [];
      initArr[i][0] = true;
    }
    return initArr;
  }
}
