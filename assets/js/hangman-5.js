
// objects to hold contents at three levels of difficulty (corresponding to levels of game)
var levelOne = {
  name: "LEVEL ONE",
  wordList: ["fun", "spell", "fix", "bird", "play", "jump"],
  randomWord: "",
  wordBox: [],
  uniqueGuesses: [],
  misses: 0,
  correct: 0
}
var levelTwo = {
  wordList: ["funny", "worry", "bother", "bananas", "cleaning", "swampy"],

}
var levelThree = {
  wordList: ["shenanigans", "bamboozled", "bonkers", "zoinks", "shikaka", "chicago"],

}

// // gistboxed (stolen) unique array function using prototpe of array
// Array.prototype.unique = function() {
//   return this.filter(function (value, index, self) {
//     return self.indexOf(value) === index;
//   });
// }

// random word chooser that parses through the array of words and stores it as a variable
function randWordGen(level) {
  console.log("randWordGen...")
  // variables to keep track
  level.randomWord = level.wordList[Math.floor(Math.random() * level.wordList.length)]
  console.log(level.randomWord)
  // function that creates a blank "<span>_</span>" for the each letter in the chosen word in html
  for (i = 0; i < level.randomWord.length; i++) {
    level.wordBox.push("<span>_</span>")
  }
  console.log(level.wordBox)
}

function renderPage(level) {
  console.log("Rendering page...");
  // render results to page

  document.getElementById('letters').innerHTML = level.wordBox
  document.getElementById('correct').innerHTML = level.correct
  document.getElementById('missed').innerHTML = level.misses
  document.getElementById('guessed').innerHTML = level.uniqueGuesses
  // replace commas in DOM with spaces
  var correctLtrsCln = document.querySelectorAll('h2')
  for (i = 0; i < correctLtrsCln.length; i++) {
    correctLtrsCln[i].innerHTML = correctLtrsCln[i].innerHTML.replace(/,/g, " ")
  }
}


function leveler(level) {
  console.log("Leveler...")
  // get user input
  document.onkeypress = function(event) {
    var playerGuess = event.key.toLowerCase()
    console.log(level.uniqueGuesses)
    // if there are guesses recorded, check those first
    if (level.uniqueGuesses.length > 0) {
      missCounter(level, playerGuess)
    }
    // if not, go straight to finding a match
    else {
      wordBoxer(level, playerGuess)
    }
  }
}

//  check to see if this guess has already been made
function missCounter(level, playerGuess) {
  console.log("missCounter...")
  var missedCount = 0
    // go through existing guessed letters
    for (i = 0; i < level.uniqueGuesses.length; i++) {
      if (playerGuess !== level.uniqueGuesses[i]) {
        missedCount++
        console.log(missedCount)
      }
    }
    // if it went through all the guesses this one's unique, run the matcher
    if (missedCount === level.uniqueGuesses.length) {
      wordBoxer(level, playerGuess)
    }
    // if it's been guessed, alert the user
    else {
      alert("you've already guessed this")
    }
}

// check the wordBox for matches
function wordBoxer(level, playerGuess) {
  console.log("wordBoxer...")
  //set a variable to see how many blanks are left in the word
  var blankCount = 0
  // track the missed matches over the iterations
  var missCount = 0
  var newHit = 0
  // count the blanks
  for(var i = 0; i < level.wordBox.length; ++i){
    if(level.wordBox[i] == "<span>_</span>")
    blankCount++
  }
  // iterate over each letter in the wordbox...
  for (var i = 0; i < level.wordBox.length; i++) {
    console.log(i)
    // check if it's already been assigned
    if (level.wordBox[i] !== "<span>_</span>") {
      continue
    }
    // if not assigned, see if it's a match
    else if (playerGuess === level.randomWord[i]) {
      // if so, up the correct score, push the guess to the uniqueGuesses array and update the wordBox
      newHit++
      level.correct++
      level.wordBox[i] = playerGuess
      console.log(level.wordBox)
      renderPage(level)
    }
    // if it's not a match record a miss to the miss counter
    else {
      missCount++
      console.log(missCount)
    }
  }
  // after all iterations, only record a single miss
  if (blankCount === missCount) {
    level.uniqueGuesses.push(playerGuess)
    console.log(level.uniqueGuesses)
    level.misses++
    renderPage(level)
  }
  // only push one letter to uniqueGuesses if correct
  else if (newHit > 0) {
    level.uniqueGuesses.push(playerGuess)
    renderPage(level)
  }
}
// initialize level's random word
randWordGen(levelOne)
// render level's page
renderPage(levelOne)
document.getElementById('bigBox').innerHTML = levelOne.name
// initialize the onkeypress event function chain
leveler(levelOne)
