const cards = document.querySelectorAll("li.card");
const card = document.querySelector("ul.deck");
const listOfCards = Array.from(cards);
const deck = document.querySelector(".deck");
const secondStar = document.querySelector("ul.stars .second-star");
const thirdStar = document.querySelector("ul.stars .third-star");
const restartButton = document.querySelector(".restart");
const stopWatch = document.querySelector(".stop-watch");

/** Variables for modal */
const modal = document.querySelector(".modal");
const p = document.querySelector(".modal p");
const playAgainButton = document.querySelector(".modal button");

let moves = document.querySelector(".moves");
let counter = 0;
let stars = 3;

/** Variables for timer */
let secs, mins;
let clearTime;
let seconds = 0,
    minutes = 0;

/** Shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayCardsSymbol(card) {
    card.classList.add("show", "open");
}

function isOpen(card) {
    if (card.classList.value === "card show open") {
        return true;
    }
}

function isMatch(cardA, cardB) {
    let aClasses = cardA.firstChild.nextElementSibling.classList;
    let bClasses = cardB.firstChild.nextElementSibling.classList;
    let result = true;

    aClasses.forEach(c => {
        if (bClasses.contains(c) === false) {
            result = false;
        }
    });
    return result;
}

function applyMatch(cardsArr) {
    cardsArr.forEach(card => {
        card.classList.add("match");
    });
}

function applyNoMatch(cardsArr) {
    cardsArr.forEach(card => {
        card.classList.add("no-match");
    });
}

function hideCard(cardsArr) {
    cardsArr.forEach(card => {
        card.classList.remove("show", "open", "no-match");
    });
}

function incrementMovesCounter() {
    counter += 1;
    if (counter % 2 === 0) {
        counter === 2
            ? (moves.innerHTML = counter / 2 + " Move")
            : (moves.innerHTML = counter / 2 + " Moves");
    }
}

function checkAllCardsMatched() {
    return document.querySelectorAll(".match").length === 16;
}

function restart() {
    window.location.reload(true);
}

restartButton.addEventListener("click", () => {
    restart();
});

/**  create timer to calculate game time */
function startWatch() {
    /** add minute */
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    mins = minutes + " mins ";
    secs = seconds + " secs";
    /** add timer to html */
    stopWatch.innerHTML = mins + secs;
    /** add seconds */
    seconds++;
    /** call startWatch every second */
    clearTime = setTimeout("startWatch()", 1000);
}

/**
 * @description uses counter to change class attribute and count stars
 * @param {number} counter
 */
function displayRating(counter) {
    if (counter >= 26) {
        thirdStar.classList.add("far");
        stars = 2;
    }
    if (counter >= 32) {
        secondStar.classList.add("far");
        stars = 1;
    }
}

/**
 * @description display modal after player wins the game
 * @param {string} time
 */
function displayModal(time) {
    modal.classList.toggle("open");
    p.innerHTML = `In ${time} with ${counter / 2} moves and ${stars} star(s)!`;
}

function selectCard() {
    /** set boolean to fire startWatch only once */
    let invokeStartWatch = true;
    /** set boolean to allow click only */
    let solving = false;
    let openCard = undefined;
    /** shuffle cards */
    const shuffledCards = shuffle(listOfCards);
    shuffledCards.forEach(card => {
        deck.appendChild(card);
    });

    /** listen for click on card deck */
    card.addEventListener("click", e => {
        let clickedCard = e.target;
        /** only listen for click on li element */
        if (clickedCard && clickedCard.nodeName === "LI") {
            let match = false;

            /** using invokeStartWatch to fire startWatch only once */
            if (invokeStartWatch) {
                startWatch();
            }
            invokeStartWatch = false;
            /** block clicking on more than two cards */
            if (solving) {
                return;
            }
            /** avoiding two clicks on the same card */
            if (isOpen(clickedCard)) {
                return;
            }

            displayCardsSymbol(clickedCard);
            incrementMovesCounter();
            displayRating(counter);

            /** run only if one card is already open */
            if (openCard) {
                match = isMatch(clickedCard, openCard);
                if (match) {
                    applyMatch([clickedCard, openCard]);
                    openCard = undefined;
                    if (checkAllCardsMatched()) {
                        /** display modal only after some time so the player can see the entire deck matched */
                        setTimeout(() => {
                            displayModal(stopWatch.innerHTML);
                        }, 1300);

                        clearTimeout(clearTime);
                    }
                    return;
                }
                applyNoMatch([clickedCard, openCard]);
                solving = true;
                /** hide cards after 1.3 seconds and reset openCard and solving */
                setTimeout(() => {
                    hideCard([clickedCard, openCard]);
                    openCard = undefined;
                    solving = false;
                }, 1300);
                return;
            }
            openCard = e.target;
        }
    });
}
/** restart the game */
playAgainButton.addEventListener("click", () => {
    restart();
});

selectCard();
