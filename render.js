/**
 * Предварительный рендер, подготавливающий данные для основного.
 */
class Render extends BaseRender {
  /**
   * Преобразует многомерный массив булевых в строку
   * строку отправляет в родительский рендер
   * @param {(string|boolean[])} iterValue 
   */
  render(iterValue) {
    const symbolFalse = ` `;
    const symbolTrue = `■`;
    let result = "";

    if (Array.isArray(iterValue)) {
      for (let i = 0; iterValue[i] !== undefined; i++) {
        if (i > 0) result += "\n";
        for (let i2 = 0; iterValue[i][i2] !== undefined; i2++) {
          if (iterValue[i][i2] === false) result += symbolFalse;
          else if (iterValue[i][i2] === true) result += symbolTrue;
          else
            console.error("ОШИБКА! В массиве присутствует не булево значение");
        }
      }
    } else {
      if (typeof iterValue === "string") result = iterValue;
      else console.error("ОШИБКА! Значение не является массивом или строкой");
    }

    super.render(result);
  }
}
