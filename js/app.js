/*
 * Create a list that holds all of your cards
 */

const cards = document.querySelectorAll(".card");
const listOfCards = Array.from(cards);
const deck = document.querySelector(".deck");
let moves = document.querySelector(".moves");
let selectedCard = undefined;
let solving = false;
let counter = 0;

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

function applyMatch(arrCards) {
    arrCards.forEach(card => {
        card.classList.add("match");
    });
}

function hideCard(arrCards) {
    arrCards.forEach(card => {
        card.classList.remove("show", "open");
    });
}

function incrementMovesCounter() {
    counter += 1;
    if (counter % 2 === 0) {
        moves.innerText = counter / 2;
    }
}

function checkAllCardsMatched() {
    return document.querySelectorAll(".match").length === 16;
}

function selectCard() {
    const card = document.querySelector("ul.deck");

    card.addEventListener("click", e => {
        if (selectCard && solving) {
            return;
        }
        incrementMovesCounter();
        displayCardsSymbol(e.target);
        let match = false;
        let clickedCard = e.target;

        if (selectedCard) {
            match = isMatch(clickedCard, selectedCard);
            if (match) {
                applyMatch([clickedCard, selectedCard]);
                selectedCard = undefined;
                checkAllCardsMatched();
                return;
            }

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
selectCard();
