#!/usr/bin/env node

const chalk = require('chalk')
const inquirer = require('inquirer')

const nekoMessage = '(=^･ω･^)ﾉねこはここにする!!'
const board = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const center = [5]
const corner = [1, 3, 7, 9]
const side = [2, 4, 6, 8]
const userAnswers = []
const nekoAnswers = []
const leftChoiceNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
// const judgeFlag = true
const winner = ''

// getRandomInteger (min, max) {
//   return Math.floor(Math.random() * (max - min)) + min
// }

const firstMessage = () => {
  console.log('(=^･ω･^=)ネコと○×ゲームをしよう')
  console.log('ご主人様は「×」ネコは「○」ね〜')
  // 表出力
  for (let i = 0; i < board.length;) {
    for (let j = 1; j <= 3; j++) {
      const sideLine = j === 3 ? ' ' : ' | '
      process.stdout.write(board[i] + sideLine)
      i++
    }
    console.log()
    const underLine = i === 9 ? '' : '----------'
    console.log(underLine)
  }
}

const getFirstUserAnswer = async () => {
// プレイヤーの最初の回答を求める
  const answer = await inquirer.prompt([
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
  return answer
}

const displayBoard = () => {
  for (let i = 0; i < board.length;) {
    for (let j = 1; j <= 3; j++) {
      const sideLine = j === 3 ? ' ' : ' | '
      process.stdout.write(board[i] + sideLine)
      i++
    }
    console.log()
    const underLine = i === 9 ? '' : '----------'
    console.log(underLine)
  }
}

const decideFirstNekoAnswer = () => {
  return new Promise((resolve) => {
    // プレイヤーの回答により最初のネコの回答を決める
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
  const answer = await inquirer.prompt([
    {
      type: 'number',
      name: 'int',
      message: `主の番だよ、空いている箇所(${leftChoiceNumber})から選んでね`,
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
}

const decideNekoAnswer = async () => {
  return new Promise((resolve) => {
    const randomAnswer = leftChoiceNumber[Math.floor(Math.random() * leftChoiceNumber.length)]
    return resolve(randomAnswer)
  })
}

const afterAnswerProcess = async (answer, nekoBoolean) => {
  return new Promise((resolve) => {
    if (nekoBoolean) {
      console.log(nekoMessage)
      nekoAnswers.push(answer)
    } else {
      userAnswers.push(answer)
    }
    removeAnswerFromLeftAnswerList(answer)
    changeInBoard(answer, nekoBoolean)
    console.log(displayBoard())
    return resolve()
  })
}

const removeAnswerFromLeftAnswerList = async (answer) => {
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

const judge = async () => {
  return new Promise((resolve) => {
    if (leftChoiceNumber === []) {
      // winnerに勝者の名前をば・・・
      return resolve(false)
    }
  })
}

const endMessage = () => {
  // 終了メッセージ表示
  console.log('-------ゲーム終了-------')
  console.log(`${winner}の勝ち〜！また遊んでね`)
}

async function main () {
  firstMessage()
  // ユーザーの最初の回答を受け、ボードを表示
  const firstAnswer = await getFirstUserAnswer()
  afterAnswerProcess(firstAnswer.int, false)
  // ネコの回答を決め、ボードを表示
  const firstNekoAnswer = await decideFirstNekoAnswer()
  afterAnswerProcess(firstNekoAnswer.int, true)

  while (true) {
    // ユーザーの回答を受け、ボードを表示
    const answer = await getUserAnswer()
    afterAnswerProcess(answer.int, false)
    if (!judge()) break

    // ネコの回答を決め、ボードを表示
    const nekoAnswer = await decideNekoAnswer()
    afterAnswerProcess(nekoAnswer, true)
    if (!judge()) break
  }

  endMessage()
}
main()
