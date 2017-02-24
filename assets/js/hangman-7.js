// steeling from underscore.js: http://ericstiles.github.io/posts/underscore-compose-functional-javascript/
//Compose is great function that may not be used often, but provides an easy way to reduce chained functions to a single easily managed-in-one-location function that can be used across the application without duplicating the implementation code. Below is the underscore implementation:

//Notice that the first apply takes any number of arguments.
//Then a loop is entered to apply the remaining arguments (functions) where the input is the result from the previous function.


// STATE LIVES HERE (level)
var theEnd = {
  teleprompter: "You are beautiful.",
}
var levelThree = {
  wordList: ["shenanigans", "bamboozled", "bonkers", "zoinks", "shikaka", "chicago"],
  teleprompter: "LEVEL THREE",
  randomWord: "",
  wordBox: [],
  uniqueGuesses: [],
  misses: 0,
  correct: 0,
  levelUp: false,
  nextLevel: theEnd,
}

var levelTwo = {
  wordList: ["funny", "worry", "bother", "bananas", "cleaning", "swampy"],
  teleprompter: "LEVEL TWO",
  randomWord: "",
  wordBox: [],
  uniqueGuesses: [],
  misses: 0,
  correct: 0,
  levelUp: false,
  nextLevel: levelThree,
}

var levelOne = {
  wordList: ["fun", "spell", "fix", "bird", "play", "jump"],
  teleprompter: "LEVEL ONE",
  randomWord: "",
  wordBox: [],
  uniqueGuesses: [],
  misses: 0,
  correct: 0,
  levelUp: false,
  nextLevel: levelTwo,
}
// // gistboxed (stolen) unique array function using prototpe of array
// Array.prototype.unique = function() {
//   return this.filter(function (value, index, self) {
//     return self.indexOf(value) === index;
//   });
// }

// I: PICK WORD
// random word chooser that parses through the array of words and stores it as a variable
var randWordGen = function(level) {
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

// II: RENDER PAGE
var renderPage = function(level, playerGuess) {
  console.log("renderPage...");
  level = _.clone(level)
  // render results to page
  document.getElementById('bigBox').innerHTML = level.teleprompter
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


// III check STATE for existing guesses


// check the wordBox for matches
var wordBoxer = function(level, playerGuess) {
  level = _.clone(level)
  console.log("wordBoxer...")
  //set a variable to see how many blanks are left in the word
  var blankCount = 0
  console.log("blankCount:" + blankCount)
  // track the missed matches over the iterations
  var missCount = 0
  var newHit = 0
  // count the blanks
  for(var i = 0; i < level.wordBox.length; ++i){
    if(level.wordBox[i] == "<span>_</span>")
    blankCount++
  }
  // if there are no more blanks, levelUp
  if (blankCount === 0) {
    level.levelUp = true
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
      level.wordBox[i] = "<span>" + playerGuess + "</span>"
      console.log(level.wordBox)
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
  }
  // only push one letter to uniqueGuesses if correct
  else if (newHit > 0) {
    level.uniqueGuesses.push(playerGuess)
  }
}



// var levelUp = function(level) {
//   // initialize level's random word
//   randWordGen(level)
//   // render level's page
//   renderPage(level)
//   // initialize the onkeypress event function chain
//   leveler(level)
// }


// assign the results of the STATE transformation to a variable to be evaluated
var stateHolder = _.flowRight(wordBoxer, renderPage)// will contain results from lodash flowRight operation over data

// each time the player hits a key, that variable will be evaluated
var leveler = function(level) {
  randWordGen(level)
  document.onkeypress = function(event) {
  var playerGuess = event.key.toLowerCase()
  console.log(level.uniqueGuesses)
  // if there are guesses recorded, check those first
  if (level.levelUp === true) {
    levelLifter(level.nextLevel)
  }
  if (level.uniqueGuesses.length > 0) {
    //  check to see if this guess has already been made
    var guessedCount = 0
    console.log("guessedCount" + guessedCount)
      // go through existing guessed letters
      for (i = 0; i < level.uniqueGuesses.length; i++) {
        if (playerGuess !== level.uniqueGuesses[i]) {
          guessedCount++
          console.log(guessedCount)
        }
      }
      // if the results of functions feed into other functions in a chain, use lodash flowRight
      // if it went through all the guesses this one's unique, run the matcher
      if (guessedCount === level.uniqueGuesses.length) {
        stateHolder(level, playerGuess)
      }
      // if it's been guessed, alert the user
      else {
        alert("you've already guessed this")
      }
    }
    // if not, go straight to finding a match
    else {
      stateHolder(level, playerGuess)
    }
  }
}
var levelLifter = function(nextLevel) {
  leveler(nextLevel)
}
leveler(levelOne)
// if the eveluation should trigger a subset of functions, set that up HERE
// refactor such functions so that the STATE variable stores changes, while lodash 'clone' is used inside of each chained function
