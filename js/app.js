const cards = document.querySelectorAll("li.card");
const listOfCards = Array.from(cards);
const deck = document.querySelector(".deck");
const restartButton = document.querySelector(".restart");
const secondStar = document.querySelector("ul.stars .second-star");
const thirdStar = document.querySelector("ul.stars .third-star");
const modal = document.querySelector(".modal");
const p = document.querySelector(".modal p");
const playAgainButton = document.querySelector(".modal button");
const stopWatch = document.querySelector(".stop-watch");
let moves = document.querySelector(".moves");
let counter = 0;
let stars = 3;
//Variables for timer
let secs, mins;
let clearTime;
let seconds = 0,
    minutes = 0;

const shuffledCards = shuffle(listOfCards);

shuffledCards.forEach(card => {
    deck.appendChild(card);
});

// Shuffle function from http://stackoverflow.com/a/2450976
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

function startWatch() {
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    mins = minutes + " mins ";
    if (minutes === 60) {
        minutes = 0;
    }
    secs = seconds + " secs";
    stopWatch.innerHTML = mins + secs;
    seconds++;
    clearTime = setTimeout("startWatch()", 1000);
}

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

function displayModal(time) {
    modal.classList.toggle("open");
    p.innerHTML = `In ${time} with ${counter / 2} moves and ${stars} star(s)!`;
}

function selectCard() {
    const card = document.querySelector("ul.deck");
    let invokeStartWatch = true;
    let solving = false;
    let selectedCard = undefined;

    card.addEventListener("click", e => {
        let match = false;
        let clickedCard = e.target;
        //using invokeStartWatch to fire startWatch only once
        if (invokeStartWatch) {
            startWatch();
        }
        invokeStartWatch = false;

        if (selectCard && solving) {
            return;
        }
        //avoiding two clicks on the same card
        if (isOpen(clickedCard)) {
            return;
        }

        displayCardsSymbol(clickedCard);
        incrementMovesCounter();
        displayRating(counter);

        if (selectedCard) {
            match = isMatch(clickedCard, selectedCard);
            if (match) {
                applyMatch([clickedCard, selectedCard]);
                selectedCard = undefined;
                if (checkAllCardsMatched()) {
                    displayModal(stopWatch.innerHTML);
                    clearTimeout(clearTime);
                }
                return;
            }
            applyNoMatch([clickedCard, selectedCard]);
            solving = true;
            setTimeout(() => {
                hideCard([clickedCard, selectedCard]);
                selectedCard = undefined;
                solving = false;
            }, 1500);
            return;
        }
        selectedCard = e.target;
    });
}
playAgainButton.addEventListener("click", () => {
    restart();
});

selectCard();
