/*
 * Create a list that holds all of your cards
 */

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
let selectedCard = undefined;
let solving = false;
let counter = 0;
let stars = 3;
//Variables for timer
let clearTime;
let seconds = 0,
    minutes = 0,
    hours = 0;
let secs, mins, gethours;
let invokeStartWatch = true;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function displayCardsSymbol(card) {
    card.classList.add("show", "open");
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

// function applyNoMatch(cardsArr) {
//     cardsArr.forEach(card => {
//         card.classList.add("nomatch");
//     });
// }
function hideCard(cardsArr) {
    cardsArr.forEach(card => {
        // card.classList.add("nomatch");
        card.classList.remove("show", "open");
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

// function milisecondToMinute(ms) {
//     let gameTime;
//     // Convert to seconds:
//     let seconds = ms / 1000;
//     // Extract minutes:
//     let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
//     // Keep only seconds not extracted to minutes:
//     seconds = seconds % 60;
//     gameTime = `${minutes} minute(s) and ${Math.floor(seconds)} second(s)`;
//     return gameTime;
// }
function startWatch() {
    if (seconds === 60) {
        seconds = 0;
        minutes += 1;
    }
    mins = minutes < 10 ? "0" + minutes + ": " : minutes + ": ";
    if (minutes === 60) {
        minutes = 0;
        hours += 1;
    }
    gethours = hours < 10 ? "0" + hours + ": " : hours + ": ";
    secs = seconds < 10 ? "0" + seconds : seconds;
    stopWatch.innerHTML = "Time: " + gethours + mins + secs;
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
    p.innerHTML = `In ${time} with ${counter / 2} moves and ${stars} star(s)`;
}

playAgainButton.addEventListener("click", () => {
    restart();
});

function selectCard() {
    // let beginTime = performance.now();

    const card = document.querySelector("ul.deck");

    card.addEventListener("click", e => {
        if (invokeStartWatch) {
            startWatch();
        }
        invokeStartWatch = false;

        if (selectCard && solving) {
            return;
        }
        let match = false;
        let clickedCard = e.target;

        incrementMovesCounter();
        displayRating(counter);
        displayCardsSymbol(e.target);

        if (selectedCard) {
            match = isMatch(clickedCard, selectedCard);
            if (match) {
                applyMatch([clickedCard, selectedCard]);
                selectedCard = undefined;
                if (checkAllCardsMatched()) {
                    // let endTime = performance.now();
                    // let totalTime = milisecondToMinute(beginTime - endTime);
                    // displayModal(totalTime);
                    clearTimeout(clearTime);
                }
                return;
            }

            solving = true;
            setTimeout(() => {
                // applyNoMatch([clickedCard, selectedCard]);
                hideCard([clickedCard, selectedCard]);
                selectedCard = undefined;
                solving = false;
            }, 1500);
            return;
        }
        selectedCard = e.target;
    });
}

selectCard();
