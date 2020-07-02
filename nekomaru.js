#!/usr/bin/env node

const chalk = require('chalk')
const inquirer = require('inquirer')

const compleat = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const nekoMessage = '(=^･ω･^)ﾉねこはここにする!!'
const board = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const center = [5]
const corner = [1, 3, 7, 9]
const userAnswers = []
const nekoAnswers = []
const leftChoiceNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
var gameResultMessage = ''
var flag = false
var lastPlayTimes = 9

const firstMessage = () => {
  console.log(chalk.yellow('(=^･ω･^=)ネコとまるばつゲームしよう'))
  console.log(chalk.yellow('主は「×」ネコは「○」ね〜'))
  displayBoard()
}

const getFirstUserAnswer = async () => {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'number',
        name: 'int',
        message: chalk.yellow('1~9のうちどれかを入力してね'),
        validate: (input) => {
          if (input >= 1 && input <= 9) {
            return true
          } else {
            return '半角で1~9を入力してね(上矢印↑キーで再入力)'
          }
        }
      }
    ])
    return answer
  } catch (err) {
    console.log(`エラー：${err}`)
  }
}

const displayBoard = () => {
  for (let i = 0; i < board.length;) {
    for (let j = 1; j <= 3; j++) {
      const sideLine = j === 3 ? ' ' : ' | '
      if (board[i] === '○') {
        process.stdout.write(chalk.blue(board[i]) + sideLine)
      } else if (board[i] === '×') {
        process.stdout.write(chalk.red(board[i]) + sideLine)
      } else {
        process.stdout.write(board[i] + sideLine)
      }
      i++
    }
    console.log()
    const underLine = i === 9 ? '' : '----------'
    console.log(underLine)
  }
}

const decideFirstNekoAnswer = () => {
  return new Promise((resolve) => {
    // プレイヤーの回答により最初のネコの回答を決める(これで若干勝率が上がるため)
    if (center.includes(userAnswers[0])) {
      // 角のどこか
      const randomCorner = corner[Math.floor(Math.random() * corner.length)]
      return resolve(randomCorner)
    } else {
      // 真ん中
      return resolve(center[0])
    }
  })
}

const getUserAnswer = async () => {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'number',
        name: 'int',
        message: chalk.yellow('主の番だよ、空いている箇所から選んで入力してね'),
        validate: (input) => {
          if (input >= 1 && input <= 9) {
            return true
          } else {
            return '半角で1~9を入力してね(上矢印↑キーで再入力)'
          }
        }
      }
    ])
    return answer
  } catch (err) {
    console.log(`エラー：${err}`)
  }
}

const decideNekoAnswer = () => {
  return new Promise((resolve) => {
    const randomAnswer = leftChoiceNumber[Math.floor(Math.random() * leftChoiceNumber.length)]
    return resolve(randomAnswer)
  })
}

const afterAnswerProcess = (answer, nekoBoolean) => {
  return new Promise((resolve) => {
    if (nekoBoolean) {
      console.log(chalk.yellow(nekoMessage))
      nekoAnswers.push(answer)
    } else {
      userAnswers.push(answer)
    }
    removeAnswerFromList(answer)
    changeInBoard(answer, nekoBoolean)
    lastPlayTimes--
    const timeOut = nekoBoolean ? 1000 : 500
    setTimeout(() => {
      displayBoard()
      return resolve()
    }, timeOut)
  })
}

const removeAnswerFromList = (answer) => {
  return new Promise((resolve) => {
    const index = leftChoiceNumber.findIndex(n => n === answer)
    leftChoiceNumber.splice(index, 1)
    return resolve()
  })
}

const changeInBoard = (answer, nekoBoolean) => {
  const mark = nekoBoolean ? '○' : '×'
  board.splice(answer - 1, 1, mark)
}

const judge = (player) => {
  return new Promise((resolve) => {
    const mark = player === 'neko' ? '○' : '×'
    const playerName = player === 'neko' ? 'ねこ' : '主'
    for (let i = 0; i < compleat.length; i++) {
      const comp0 = compleat[i][0]
      const comp1 = compleat[i][1]
      const comp2 = compleat[i][2]
      // compleatパターンと「○」or「×」が一致するかどうか
      if (board[comp0] === mark && board[comp1] === mark && board[comp2] === mark) {
        gameResultMessage = `${playerName}の勝ち`
        return resolve(true)
      } else if (lastPlayTimes === 0) {
        gameResultMessage = '引き分け'
        return resolve(true)
      }
    }
    return resolve(false)
  })
}

const endMessage = () => {
  console.log(chalk.yellow('ゲーム終了o(=・ω・=o)=3=3=3=3=3=3'))
  console.log(chalk.yellow(`${gameResultMessage}だよ〜！また遊んでね`))
}

async function main () {
  try {
    firstMessage()
    // ユーザーの最初の回答を受け、ボードを表示
    const firstAnswer = await getFirstUserAnswer()
    await afterAnswerProcess(firstAnswer.int, false)
    // ネコの回答を決め、ボードを表示
    const firstNekoAnswer = await decideFirstNekoAnswer()
    await afterAnswerProcess(firstNekoAnswer, true)

    while (true) {
      // ユーザーの回答を受け、ボードを表示
      const answer = await getUserAnswer()
      await afterAnswerProcess(answer.int, false)
      flag = await judge('user')
      if (flag) break
      // ネコの回答を決め、ボードを表示
      const nekoAnswer = await decideNekoAnswer()
      await afterAnswerProcess(nekoAnswer, true)
      flag = await judge('neko')
      if (flag) break
    }
    endMessage()
  } catch (err) {
    console.log(`エラー：${err}`)
  }
}
main()
