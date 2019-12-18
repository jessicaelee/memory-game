const cards = [
    `<div class="card"  data-framework="paris">
<div class="card-face card-front"></div>
<div class="card-face card-back paris"></div>
</div>`,
    `<div class="card"  data-framework="japan">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back japan"></div>
                </div>`,
    `<div class="card"  data-framework="paris">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back paris"></div>
                </div>`,
    `<div class="card" data-framework="africa">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back africa"></div>
                </div>`,
    `<div class="card"  data-framework="japan">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back japan"></div>
                </div>`,
    `<div class="card" data-framework="africa">
                <div class="card-face card-front"></div>
                <div class="card-face card-back africa"></div>
              </div>`,
    `<div class="card"  data-framework="india">
            <div class="card-face card-front"></div>
            <div class="card-face card-back india"></div>
        </div>`,

    `<div class="card"  data-framework="india">
            <div class="card-face card-front"></div>
            <div class="card-face card-back india"></div>
        </div>`,
    `<div class="card"  data-framework="london">
                <div class="card-face card-front"></div>
                <div class="card-face card-back london"></div>
            </div>`,
    `<div class="card"  data-framework="london">
            <div class="card-face card-front"></div>
            <div class="card-face card-back london"></div>
        </div>`,
    `<div class="card"  data-framework="iceland">
                <div class="card-face card-front"></div>
                <div class="card-face card-back iceland"></div>
            </div>`,
    `<div class="card"  data-framework="iceland">
            <div class="card-face card-front"></div>
            <div class="card-face card-back iceland"></div>
        </div>`,
    `<div class="card"  data-framework="china">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back china"></div>
                </div>`,
    `<div class="card"  data-framework="china">
                <div class="card-face card-front"></div>
                <div class="card-face card-back china"></div>
            </div>`,
    `<div class="card"  data-framework="newyork">
                        <div class="card-face card-front"></div>
                        <div class="card-face card-back newyork"></div>
                    </div>`,
    `<div class="card"  data-framework="newyork">
                    <div class="card-face card-front"></div>
                    <div class="card-face card-back newyork"></div>
                </div>`,
    `<div class="card"  data-framework="australia">
                                <div class="card-face card-front"></div>
                                <div class="card-face card-back australia"></div>
                            </div>`,
    `<div class="card"  data-framework="australia">
                            <div class="card-face card-front"></div>
                            <div class="card-face card-back australia"></div>
                        </div>`,
    `<div class="card"  data-framework="hawaii">
                                    <div class="card-face card-front"></div>
                                    <div class="card-face card-back hawaii"></div>
                                </div>`,
    `<div class="card"  data-framework="hawaii">
                                <div class="card-face card-front"></div>
                                <div class="card-face card-back hawaii"></div>
                            </div>`
];

function addCardsToDom(cardList) {
    const game = document.getElementById("game");
    cardList.forEach(card => game.insertAdjacentHTML("beforeend", card));
}

function addClickToCards() {
    const cards = document.getElementsByClassName("card");
    for (let card of cards) {
        card.addEventListener("click", flipCard);
    }
}

let hasFlippedCard = false;
let lockCards = false;
let cardOne = null;
let cardTwo = null;
let score = 0;
let highScore = null;
let matches = 0;

function getHighScore() {
    if (localStorage.getItem("highScore") === null) {
        return;
    }
    highScore = localStorage.getItem("highScore");
    addHighScore();
}

getHighScore();

function startGame() {
    resetScore();
    hideButton();
    showCards();
    shuffle(cards);
    addCardsToDom(cards);
    addClickToCards();
}

function hideButton() {
    document.getElementById("start-game").style.display = "none";
}

function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function showCards() {
    document.getElementById("container").style.display = "block";
}

function flipCard() {
    if (lockCards) return;
    addScore();
    toggleCard(this);
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        cardOne = this;
        cardOne.removeEventListener("click", flipCard);
        return;
    }
    hasFlippedCard = false;
    cardTwo = this;
    checkForMatch();
}

function checkForMatch() {
    if (cardOne.dataset.framework === cardTwo.dataset.framework) {
        disableCards();
    } else {
        resetCards();
    }
}

function disableCards() {
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    addMatch();
}

function resetCards() {
    lockCards = true;
    setTimeout(() => {
        toggleCard(cardOne);
        toggleCard(cardTwo);
        cardOne.addEventListener("click", flipCard);
        lockCards = false;
    }, 650);
}

function toggleCard(card) {
    card.classList.toggle("is-flipped");
}

function addMatch() {
    matches++;
    checkForWin();
}

function checkForWin() {
    if (cards.length / 2 === matches) {
        checkForHighScore();
    }
}

function checkForHighScore() {
    if (highScore === null || score < highScore) {
        highScore = score;
        setTimeout(addHighScore, 1500);
        saveToLocalStorage();
    }
    setTimeout(clearGame, 1500);
}

function addHighScore() {
    return (document.getElementById(
        "high-score"
    ).innerHTML = highScore.toString());
}

function saveToLocalStorage() {
    localStorage.setItem("highScore", highScore);
}

function clearGame() {
    document.getElementById("container").style.display = "none";
    document.getElementById("start-game").style.display = "block";
    clearValues();
    clearCards();
}

function clearCards() {
    var elements = document.getElementsByClassName("card");
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function clearValues() {
    hasFlippedCard = false;
    lockCards = false;
    cardOne = null;
    cardTwo = null;
    score = 0;
    matches = 0;
}

function addScore() {
    score++;
    return (document.getElementById(
        "current-score"
    ).innerHTML = score.toString());
}

function resetScore() {
    score = 0;
    return (document.getElementById(
        "current-score"
    ).innerHTML = score.toString());
}
