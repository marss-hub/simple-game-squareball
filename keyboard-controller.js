/**
 * фиксирует коды нажатий клавиш
 */
class SimpleKeyboardController {
    #rootDocument;
    #eventListener;
    constructor(rootDocument = document) {
      this.#rootDocument = rootDocument;
    }
  
   /**
   * Запускает внутри себя передаваемую callback-функцию
   * @param {requestCallback} callback callback-функция с аргументами (код клавиши, статус состояния клавиши)
   */
    setKeyPressHandler(callback) {
      const eventListener = (e) => callback(e.keyCode, e.type);
      this.#rootDocument.addEventListener("keydown", eventListener);
      this.#rootDocument.addEventListener("keyup", eventListener);
      this.#eventListener = eventListener;
    }
  
    /**
     * Перестает фиксировать коды нажатий
     */
    removeKeyPressHandler() {
      this.#rootDocument.removeEventListener("keydown", this.#eventListener);
      this.#rootDocument.removeEventListener("keyup", this.#eventListener);
    }
  }
  