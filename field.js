/**
 * Создает объект-поле, на котором будет происходить текущая игра
 */
class Field {
  #sizeX = 0;
  #sizeY = 0;
  #currentField = [];
  #shapesKit = []; // [{shape: Object, x: Number, y: Number} ...]

  /**
   * Создает поле
   * @param {number} sizeX размер поля по ширине
   * @param {number} sizeY размер поля по высоте
   */
  constructor(sizeX = 0, sizeY = 0) {
    this.#sizeX = sizeX;
    this.#sizeY = sizeY;
    this.#clear();
  }

  /**
   * создает массив первого состояния (заполненный false), перезаписывает #currentField
   */
  #clear() {
    let initArr = [];
    for (let i = 0; i < this.#sizeY; i++) {
      initArr[i] = [];
      for (let i2 = 0; i2 < this.#sizeX; i2++) {
        initArr[i][i2] = false;
      }
    }
    this.#currentField = initArr;
  }

  /**
   * Метод получает координаты фигуры и объект класса Shape, 
   * запрашивает фигуру в свойстве поступившего объекте, рисует её на поле, перезаписывает #currentField
   * @param {number} coordX
   * @param {number} coordY
   * @param {Object} objShape
   */
  #paintOn(coordX, coordY, objShape) {
    const shapeArr = objShape.getForm();
    // const shapeArr = objShape; // <- раскомментировать для тестирования, передача формы напрямую
    const fieldArr = this.#currentField;

    for (let i = 0; i < shapeArr.length; i++) {
      const finalCoordY = i + coordY;
      if (finalCoordY >= this.getHeight()) break;
      for (let i2 = 0; shapeArr[i][i2] !== undefined; i2++) {
        const finalCoordX = i2 + coordX;
        if (finalCoordX >= this.getWidth()) break;
        fieldArr[finalCoordY][finalCoordX] = shapeArr[i][i2];
      }
    }

    this.#currentField = fieldArr;
  }

  /**
   * Метод получает координаты фигуры и объект класса Shape, 
   * если фигура новая - добавляет на поле, если фигура уже существует для этого поля - изменяет её координаты.
   * "обнуляет" старое состояние поля, перезаписывает #currentField 
   * 
   * @param {number} coordX
   * @param {number} coordY
   * @param {Object} objShape
   */
  addShape(coordX, coordY, objShape) {
    if (!(objShape instanceof Shape)) {
      console.error(`ОШИБКА! ${objShape} не принадлежит классу Shape`); // [object Object] в ошибке
    } else {
      let isNew = true;
      for (let i = 0; this.#shapesKit[i] !== undefined; i++) {
        if (this.#shapesKit[i].shape === objShape) {
          this.#shapesKit[i].x = coordX;
          this.#shapesKit[i].y = coordY;
          isNew = false;
        }
      }

      if (isNew === true) {
        this.#shapesKit.push({ shape: objShape, x: coordX, y: coordY });
      }

      this.#clear();

      for (let i = 0; this.#shapesKit[i] !== undefined; i++) {
        this.#paintOn(
          this.#shapesKit[i].x,
          this.#shapesKit[i].y,
          this.#shapesKit[i].shape
        );
      }
    }
  }

  /**
   * Метод удаляет существующую фигуру перезаписывает #currentField
   * @param {Object} objShape
   */
  removeShape(objShape) {
    if (!(objShape instanceof Shape)) {
      console.error(`ОШИБКА! Объект не принадлежит классу Shape`);
    } else {
      for (let i = 0; this.#shapesKit[i] !== undefined; i++) {
        if (this.#shapesKit[i].shape === objShape) {
          this.#shapesKit.splice(i, 1);

          this.#clear();

          for (let i2 = 0; this.#shapesKit[i2] !== undefined; i2++) {
            this.#paintOn(
              this.#shapesKit[i2].x,
              this.#shapesKit[i2].y,
              this.#shapesKit[i2].shape
            );
          }
        }
      }
    }
  }

  /**
   * Возвращает "текущее состояние" состояния поля в виде массива булевых
   * @returns {Array}
   */
  getCurrent() {
    return this.#currentField;
  }

  /**
   * Возвращает ширину массива-поля (в единицах, не в индексах)
   * @returns {number}
   */
  getWidth() {
    return this.#sizeX;
  }

  /**
   * Возвращает высоту массива-поля (в единицах, не в индексах)
   * @returns {number}
   */
  getHeight() {
    return this.#sizeY;
  }
}
