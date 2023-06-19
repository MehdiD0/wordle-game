const winLoose = document.querySelector(".win-loose");

let letter = [];
for (let i = 0; i < 30; i++) {
  letter[i] = document.querySelector(`#letter${i}`);
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

const WORD_URL = "https://words.dev-apis.com/word-of-the-day?random=1";
let wordToGuess;

async function chooseRandomWord() {
  const promise = await fetch(WORD_URL);
  const processedResponse = await promise.json();
  wordToGuess = processedResponse.word.toUpperCase();
  console.log(wordToGuess)
}

async function getWordToGuess() {
  await chooseRandomWord()

  let whereToStart = 0;
  let startIndex = whereToStart;
  let whereToStop = whereToStart + 5;
  let done = false ;
  const map = makeMap(wordToGuess);

  window.addEventListener("keyup", (e) => {

    if (!done) { 
    if (e.key === "Enter") {
      if (whereToStart === whereToStop) {
        const wordWritten = `${letter[whereToStop - 5].innerText}${
          letter[whereToStop - 4].innerText
        }${letter[whereToStop - 3].innerText}${
          letter[whereToStop - 2].innerText
        }${letter[whereToStop - 1].innerText}`;

        if (wordToGuess === wordWritten) {
          for (let j = 5; j > 0; j--)
            letter[whereToStop - j].classList.add("cl-cp");
          winLoose.innerText = "Congrats! You've win";
          winLoose.style.color = "green";
          done = true ;
        } else {
          for (let i = 0; i < 5; i++) {
            // mark as correct
            if (wordWritten[i] === wordToGuess[i]) {
              letter[startIndex + i].classList.add("cl-cp");
              map[wordWritten[i]]--;
            }
          }
          for (let i = 0; i < 5; i++) {
            if (wordWritten[i] === wordToGuess[i]) {
              //do nothing , we already did
            } else if (
              wordToGuess.includes(wordWritten[i]) &&
              map[wordWritten[i]] > 0
            ) {
              letter[startIndex + i].classList.add("cl-wp");
              map[wordWritten[i]]--;
            } else {
              letter[startIndex + i].classList.add("wl");
            }
          }
        }

        whereToStop = whereToStart + 5;

        if (whereToStart === 30 && wordWritten != wordToGuess) {
          winLoose.innerHTML = `Game over! You've lost<br><span style="color:black">The word was : ${wordToGuess}</span>`;
          winLoose.style.color = "#BD2A2E";
          for (let i = 0; i < 30; i++) letter[i].style.border = "2px solid red";
          done = true ;
        }

        startIndex += 5;
      }
    }

    if (e.key === "Backspace") {
      if (whereToStart > startIndex) {
        letter[whereToStart - 1].innerText = "";
        whereToStart = whereToStart - 1;
      }
    }

    while (whereToStart < whereToStop) {
      if (isLetter(e.key)) {
        letter[whereToStart].innerText = e.key.toUpperCase();
        whereToStart++;
      }
      break;
    }
  } }
  );
}
getWordToGuess();
