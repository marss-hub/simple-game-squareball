/**
 * Один Class чтобы править всеми.
 * Управляет процессом игры и настройками.
 */

class Engine {
  #render = null;
  #field = null;
  #plateFirst = null;
  #plateSecond = null;
  #ball = null;
  #renderTimerId = null;
  #keyboardController = null;
  #intervals = {};
  #dropBallTimerId = null;
  #currentScore = null;
  #itReplay = false;
  #settings = {
    general: {
      fieldWidth: 50,
      fieldHeight: 50,
      ballStartCoordX: 24,
      ballStartCoordY: 24,
      ballStartAngle: 15,
      frameRate: 25,
      platesRate: 50,
      ballRate: 30,
      maxScore: 3,
    },
    player1: {
      keyMoveUp: 87,
      keyMoveDown: 83,
      plateStartCoordX: 5,
      plateStartCoordY: 22,
      points: 0,
    },
    player2: {
      keyMoveUp: 38,
      keyMoveDown: 40,
      plateStartCoordX: 44,
      plateStartCoordY: 22,
      points: 0,
    },
  };

  /**
   * Создает объекты классов Render, Field, Plate, Ball, SimpleKeyboardController.
   */
  constructor() {
    this.#render = new Render();
    this.#field = new Field(
      this.#settings.general.fieldWidth,
      this.#settings.general.fieldHeight
    );
    this.#plateFirst = {
      shapeElement: new Plate(this.#field),
      x: this.#settings.player1.plateStartCoordX,
      y: this.#settings.player1.plateStartCoordY,
    };
    this.#plateSecond = {
      shapeElement: new Plate(this.#field),
      x: this.#settings.player2.plateStartCoordX,
      y: this.#settings.player2.plateStartCoordY,
    };
    this.#ball = {
      shapeElement: new Ball(this.#field),
      x: this.#settings.general.ballStartCoordX,
      y: this.#settings.general.ballStartCoordY,
      angle: this.#settings.general.ballStartAngle,
    };
    this.#keyboardController = new SimpleKeyboardController();
  }

  /**
   * запуск процесса игры
   */

  init() {
    if (this.#itReplay === false) {
    alert (`Добро Пожаловать в SquareBall !!!\n♪♬♩♩ *играет MIDI-мелодия* ♪♬♩♩\n\nОтбивайте ракеткой мяч и не дайте ему попасть в ваши ворота!\nДля управления ракетками используйте стрелки "вверх" и "вниз" и клавиши w и s\n\nИгра идет до достижения ${this.#settings.general.maxScore} сумарных очков`)
    }

    //инициализация объектов игры
    this.#plateFirst.shapeElement.setCoords(
      this.#plateFirst.x,
      this.#plateFirst.y
    );
    this.#plateSecond.shapeElement.setCoords(
      this.#plateSecond.x,
      this.#plateSecond.y
    );
    this.#ball.shapeElement.setCoords(this.#ball.x, this.#ball.y);
    this.#currentScore = 0;

    //запуск обновляющегося рендера
    const renderFn = () => {
      this.#render.render(this.#field.getCurrent());
    };
    renderFn(); // беспаузный запуск
    this.#renderTimerId = setInterval(
      renderFn,
      1000 / this.#settings.general.frameRate
    );

    //работа с перемещением ракеток 
    const pressHandler = (keyCode, keyStage) => {
      if (
        keyCode === this.#settings.player2.keyMoveUp ||
        keyCode === this.#settings.player2.keyMoveDown ||
        keyCode === this.#settings.player1.keyMoveUp ||
        keyCode === this.#settings.player1.keyMoveDown
      ) {
        if (keyStage === "keyup") {
          clearInterval(this.#intervals[keyCode]);
          delete this.#intervals[keyCode];
        } else if (this.#intervals[keyCode] === undefined) {
          //если данный setInterval есть (!== undefined) - не запускать снова, пусть работает текущий
          const updatePos = () => {
            const plate =
              keyCode === this.#settings.player2.keyMoveUp ||
              keyCode === this.#settings.player2.keyMoveDown
                ? this.#plateSecond
                : this.#plateFirst;
            const coords = plate.shapeElement.getCoords();
            const newCoords = {
              x: plate.x,
              y:
                keyCode === this.#settings.player2.keyMoveDown ||
                keyCode === this.#settings.player1.keyMoveDown
                  ? plate.y + 1
                  : plate.y - 1,
            };

            plate.shapeElement.setCoords(newCoords.x, newCoords.y);
            if (plate.shapeElement.getCoords().y !== coords.y) {
              plate.y = newCoords.y;
            }
          };

          updatePos(); // беспаузный запуск
          this.#intervals[keyCode] = setInterval(
            updatePos,
            this.#settings.general.platesRate
          );
        }
      }
    };

    this.#keyboardController.setKeyPressHandler(pressHandler); // pressHandler запускается "внутри" метода setKeyPressHandler текущего keyboardController-а
    
    //запуск мяча
    this.#dropBall(this.#ball);
  }

  /**
   * завершение игры
   */
  final() {
    clearInterval(this.#renderTimerId);
    this.#keyboardController.removeKeyPressHandler();
    clearInterval(this.#dropBallTimerId);

    for (let key in this.#intervals) {
      //очистка всех интервалов.
      clearInterval(this.#intervals[key]);
    }

    //вывод итогового сообщения
    let winner = (this.#settings.player1.points > this.#settings.player2.points) ? `ПОБЕДИЛ ИГРОК СЛЕВА!` : `ПОБЕДИЛ ИГРОК СПРАВА!`;
    if (this.#settings.player1.points === this.#settings.player2.points) winner = `НИЧЬЯ!`;

    const replay = confirm(`РАУНД ЗАВЕРШЕН!\nИгрок слева забил гол ${this.#settings.player1.points} раз(а),\nИгрок справа забил гол ${this.#settings.player2.points} раз(а).\n\n${winner}\n\nИграть еще раз?`)
    if (replay) {
      this.#settings.player1.points = 0; 
      this.#settings.player2.points = 0;
      this.#ball.x = this.#settings.general.ballStartCoordX;
      this.#ball.y = this.#settings.general.ballStartCoordY;
      this.#itReplay = true;
      this.init();
    }
  }

  /**
   * управляет поведением мяча на поле, методу необходимо передать объект ball
   * @param {Object} objBall
   */
  #dropBall(objBall) {
    let step = 1;

    this.#dropBallTimerId = setInterval(() => {
      const radians = (objBall.angle * Math.PI) / 180;

      const newX = Math.max(objBall.x + step * Math.sin(radians), 0);
      const newY = Math.max(objBall.y - step * Math.cos(radians), 0); // В этой строке строке формула "инвертирована"  изначальнй "+ step" изменен на "- step". Это сделано, чтобы привести формулу в соответствии с используемой в программе сеткой координат (он "перевернута" по оси Y т е координата 0 находится вверху, а не внизу)

      objBall.shapeElement.setCoords(Math.round(newX), Math.round(newY));
      step++;

      const updateCoordsFun = function () {
        objBall.x = Math.round(newX);
        objBall.y = Math.round(newY);
        step = 1;
      };

      // отражение мяча от ракеток/объектов на поле
      if (
        Math.round(newY) > 0 &&
        Math.round(newY) < this.#field.getHeight() - 1 &&
        Math.round(newX) > 0 &&
        Math.round(newX) < this.#field.getWidth() - 1
      ) {
        const currentArr = this.#field.getCurrent();

        // obstacleToNorth
        if (currentArr[Math.round(newY) - 1][Math.round(newX)] === true) {
          if (objBall.angle > 270 && objBall.angle < 360) {
            // IV четверть
            objBall.angle = ((450 - objBall.angle) * 2 + objBall.angle) % 360;
          } else if (objBall.angle > 0 && objBall.angle < 90) {
            // I четверть
            objBall.angle = (180 - objBall.angle) * 2 + objBall.angle - 180;
          }
          updateCoordsFun();
        }

        // obstacleToEast
        if (currentArr[Math.round(newY)][Math.round(newX) + 1] === true) {
          if (objBall.angle > 0 && objBall.angle < 90) {
            // I четверть
            objBall.angle = (180 - objBall.angle) * 2 + objBall.angle;
          } else if (objBall.angle > 90 && objBall.angle < 180) {
            // II четверть
            objBall.angle = (270 - objBall.angle) * 2 + objBall.angle - 180;
          }
          updateCoordsFun();
        }

        // obstacleToSouth
        if (currentArr[Math.round(newY) + 1][Math.round(newX)] === true) {
          if (objBall.angle > 90 && objBall.angle < 180) {
            // II четверть
            objBall.angle = ((270 - objBall.angle) * 2 + objBall.angle) % 360;
          } else if (objBall.angle > 180 && objBall.angle < 270) {
            // III четверть
            objBall.angle =
              (((360 - objBall.angle) * 2 + objBall.angle) % 360) + 180;
          }
          updateCoordsFun();
        }

        // obstacleToWest
        if (currentArr[Math.round(newY)][Math.round(newX) - 1] === true) {
          if (objBall.angle > 180 && objBall.angle < 270) {
            // III четверть
            objBall.angle = ((360 - objBall.angle) * 2 + objBall.angle) % 360;
          } else if (objBall.angle > 270 && objBall.angle < 360) {
            // IV четверть
            objBall.angle =
              (((450 - objBall.angle) * 2 + objBall.angle) % 360) - 180;
          }
          updateCoordsFun();
        }
      }

      // отражение мяча от стен
      if (
        newX <= 0 ||
        newY <= 0 ||
        newX >= this.#field.getWidth() - 1 ||
        newY >= this.#field.getHeight() - 1
      ) {
        if (objBall.angle < 0) {
          objBall.angle = objBall.angle + 360;
        }

        const multiply45 = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        for (let i = 0; multiply45[i] !== undefined; i++) {
          if (objBall.angle === multiply45[i]) {
            objBall.angle = objBall.angle + 5;
            objBall.angle = objBall.angle % 360;
          }
        }

        if (objBall.angle > 0 && objBall.angle < 90) {
          // I по правилам II ( 0 это ВЕРХ)
          if (newY <= 0) {
            objBall.angle = (180 - objBall.angle) * 2 + objBall.angle - 180; // +/- 180 это перевод в другую половину круга
          } else if (newX >= this.#field.getWidth() - 1) {
            objBall.angle = (180 - objBall.angle) * 2 + objBall.angle;
            this.#currentScore++;
            this.#settings.player1.points++;
          }
        }

        if (objBall.angle > 90 && objBall.angle < 180) {
          // II по правилам III
          if (newX >= this.#field.getWidth() - 1) {
            objBall.angle = (270 - objBall.angle) * 2 + objBall.angle - 180;
            this.#currentScore++;
            this.#settings.player1.points++;
          } else if (newY >= this.#field.getHeight() - 1) {
            objBall.angle = ((270 - objBall.angle) * 2 + objBall.angle) % 360;
          }
        }

        if (objBall.angle > 180 && objBall.angle < 270) {
          // III по правилам IV
          if (newY >= this.#field.getHeight() - 1) {
            objBall.angle =
              (((360 - objBall.angle) * 2 + objBall.angle) % 360) + 180;
          } else if (newX <= 0) {
            objBall.angle = ((360 - objBall.angle) * 2 + objBall.angle) % 360;
            this.#currentScore++;
            this.#settings.player2.points++;
          }
        }

        if (objBall.angle > 270 && objBall.angle < 360) {
          // IV по правилам I
          if (newX <= 0) {
            objBall.angle =
              (((450 - objBall.angle) * 2 + objBall.angle) % 360) - 180;
              this.#currentScore++;
              this.#settings.player2.points++;
          } else if (newY <= 0) {
            objBall.angle = ((450 - objBall.angle) * 2 + objBall.angle) % 360;
          }
        }

        updateCoordsFun();

        //console.log(`CURRENT:`,this.#currentScore, `MAX:`, this.#settings.general.maxScore)
        //console.log(`PLAYER 1:`, this.#settings.player1.points, `PLAYER 2:`, this.#settings.player2.points)

        if (this.#currentScore === this.#settings.general.maxScore) {
          this.final()
        }
      }
    }, this.#settings.general.ballRate);
  }
}
