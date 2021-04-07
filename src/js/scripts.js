const url = 'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new'

let playerOnePoints = null
let playerTwoPoints = null
let playerOneTotalPoints = 0
let playerTwoTotalPoints = 0

const fetchAPI = async (player) => {
  const errorPlaceholder = document.querySelector('.js-error')

  try {
    const response = await fetch(url)

    if (response.status === 200) {
      errorPlaceholder.classList.remove('active')
      const playerOne = document.querySelector('.js-points_player-one')
      const playerTwo = document.querySelector('.js-points_player-two')
      const winnerPlaceholder = document.querySelector('.js-winner')
      const data = await response.text()

      if (player === 'one') {
        playerOnePoints = Number(data)
      } else {
        playerTwoPoints = Number(data)
      }

      if (!playerOnePoints || !playerTwoPoints) {
        return
      }

      if (playerOnePoints === playerTwoPoints) {
        winnerPlaceholder.innerHTML = 'No winner'

        return
      } else if (playerOnePoints > playerTwoPoints) {
        winnerPlaceholder.innerHTML = 'Player 1'
      } else {
        winnerPlaceholder.innerHTML = 'Player 2'
      }

      const winner = playerOnePoints > playerTwoPoints ? playerOne : playerTwo
      const points = playerOnePoints > playerTwoPoints ? ++playerOneTotalPoints : ++playerTwoTotalPoints

      playerOnePoints = 0
      playerTwoPoints = 0

      winner.innerHTML = Number(points)
    }
  } catch (error) {
    errorPlaceholder.classList.add('active')
    enableOtherPlayerButton(player)
    console.log(error)
  }
}

const fetchPlayerPoints = (player) => {
  fetchAPI(player)
}

const playerOne = document.querySelector('.js-play-one')
const playerTwo = document.querySelector('.js-play-two')
const roundPlaceholder = document.querySelector('.js-round-nr')
let actualRound = 1

playerOne.addEventListener('click', function() {
  handlePlayerClick(this)
})

playerTwo.addEventListener('click', function() {
  handlePlayerClick(this)

  actualRound = ++actualRound
  roundPlaceholder.innerHTML = actualRound.toString()
})

const handlePlayerClick = button => {
  const player = button.dataset.player

  enableOtherPlayerButton(player)
  fetchPlayerPoints(player)
}

const enableOtherPlayerButton = player => {
  const clickedPlayerButton = player === 'one' ? playerTwo : playerOne
  const otherPlayerButton = player === 'one' ? playerOne : playerTwo

  clickedPlayerButton.disabled = !clickedPlayerButton.disabled ? true : false
  otherPlayerButton.disabled = !otherPlayerButton.disabled ? true : false
}
