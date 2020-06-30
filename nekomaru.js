#!/usr/bin/env node
class Main {
  constructor () {
    this.chalk = require('chalk')
    this.inquirer = require('inquirer')

    this.board = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    this.center = [5]
    this.corner = [1, 3, 7, 9]
    this.side = [2, 4, 6, 8]
    this.userAnswers = []
    this.nekoAnswers = []
    this.leftChoiceNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }

  getRandomInteger (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  firstMessage () {
    console.log('(=^･ω･^=)ネコと○×ゲームをしよう')
    console.log('ご主人様は「×」ネコは「○」ね〜')
    // 表出力
    for (let i = 0; i < this.board.length;) {
      for (let j = 1; j <= 3; j++) {
        const sideLine = j === 3 ? ' ' : ' | '
        process.stdout.write(this.board[i] + sideLine)
        i++
      }
      console.log()
      const underLine = i === 9 ? '' : '----------'
      console.log(underLine)
    }
  }

  firstFight () {
    // プレイヤーの最初の回答を求める
    this.inquirer
      .prompt([
        {
          type: 'number',
          name: 'int',
          message: '1~9のうちどれかを入力してね',
          validate: (input) => {
            if (input >= 1 && input <= 9) {
              return true
            } else {
              return '半角で1~9を入力してね(上矢印↑キーで再入力)'
            }
          }
        }
      ])
      .then(answer => {
        // ユーザーの回答を受け、ボードを表示
        this.userAnswers.push(answer.int)
        this.changeInBoard(answer.int, false)
        console.log(this.displayBoard())
        // ネコの回答を決め、ボードを表示
        console.log('(=^･ω･^)ﾉねこはここにする!!')
        this.decideFirstNekoAnswer()
        console.log(this.displayBoard())
      })
  }

  changeInBoard (answer, nekoBoolean) {
    const mark = nekoBoolean ? '○' : '×'
    this.board.splice(answer - 1, 1, mark)
  }

  displayBoard () {
    for (let i = 0; i < this.board.length;) {
      for (let j = 1; j <= 3; j++) {
        const sideLine = j === 3 ? ' ' : ' | '
        process.stdout.write(this.board[i] + sideLine)
        i++
      }
      console.log()
      const underLine = i === 9 ? '' : '----------'
      console.log(underLine)
    }
  }

  decideFirstNekoAnswer () {
    // プレイヤーの回答により最初のネコの回答を決める
    if (this.center.includes(this.userAnswers[0])) {
      // 角のどこか
      const randomCorner = this.corner[Math.floor(Math.random() * this.corner.length)]
      this.nekoAnswers.push(randomCorner)
    } else {
      // 真ん中
      this.nekoAnswers.push(5)
    }
    // 残りの選択肢からネコ回答をのぞく
    this.leftChoiceNumber.splice(this.nekoAnswers[0] - 1, 1)
    // ボードの数字と○を置き換える
    this.changeInBoard(this.nekoAnswers[0], true)
  }

  judge () {
    // 判定する
  }

  game () {
    this.inquirer
      .prompt([
        {
          type: 'number',
          name: 'int',
          message: `主の番だよ、空いている箇所(${this.leftChoiceNumber})を入力してね`,
          validate: (input) => {
            if (input >= 1 && input <= 9) {
              return true
            } else {
              return '半角で1~9を入力してね(上矢印↑キーで再入力)'
            }
          }
        }
      ])
      .then(answer => {
        // ユーザーの回答を受け、ボードを表示
        this.userAnswers.push(answer.int)
        this.changeInBoard(answer.int, false)
        console.log(this.displayBoard())
        // ネコの回答を決め、ボードを表示
        console.log('(=^･ω･^)ﾉねこはここにする!!')
        this.decideNekoAnswer()
        console.log(this.displayBoard())
      })
  }

  decideNekoAnswer () {
    const randomAnswer = this.leftChoiceNumber[Math.floor(Math.random() * this.leftChoiceNumber.length)]
    this.nekoAnswers.push(randomAnswer)
    // 残りの選択肢からネコ回答をのぞく
    const index = this.leftChoiceNumber.findIndex(n => n === randomAnswer)
    this.leftChoiceNumber.splice(index, 1)
    // ボードの数字と○を置き換える
    this.changeInBoard(this.nekoAnswers[0], true)
  }

  endMessage () {
    // 終了メッセージ表示
  }
}

const pray = new Main()

pray.firstMessage()
pray.firstFight()
pray.game() // ここで非同期がうまくいかない
// while (pray.judge()) {
// pray.game()
//   pray.displayBoard()
// }
// pray.endMessage()
