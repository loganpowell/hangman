


 function level (wordList, name, nextLevel){
  this.wordList = wordList,
  this.name = name,
  this.nextLevel = nextLevel,
  this.randomWord = "",
  this.wordBox = [],
  this.uniqueGuesses = [],
  this.misses = 0,
  this.correct = 0,
  // random word chooser that parses through the array of words and stores it as a variable
  this.randWordGen = function() {
    console.log("randWordGen...")
    // variables to keep track
    var randomWord = wordList[Math.floor(Math.random() * wordList.length)]
    console.log(randomWord)
    // function that creates a blank "<span>_</span>" for the each letter in the chosen word in html
    for (i = 0; i < randomWord.length; i++) {
      wordBox.push("<span>_</span>")
    }
    console.log(wordBox)
  },
  this.leveler = function() {
    console.log("Leveler...")
    initializer(nextLevel)
    randWordGen()
    // renderPage(nextLevel)
  },
  //  check to see if this guess has already been made
  this.guessedCounter = function(playerGuess) {
    console.log("guessedCounter...")
    var guessedCount = 0
    // go through existing guessed letters
    for (i = 0; i < uniqueGuesses.length; i++) {
      if (playerGuess !== uniqueGuesses[i]) {
        guessedCount++
        console.log(guessedCount)
      }
    }
    // if it went through all the guesses this one's unique, run the matcher
    if (guessedCount === uniqueGuesses.length) {
      wordBoxer(playerGuess)
    }
    // if it's been guessed, alert the user
    else {
      alert("you've already guessed this")
    }
  },
  // check the wordBox for matches
  this.wordBoxer = function(playerGuess) {
    console.log("wordBoxer...")
    //set a variable to see how many blanks are left in the word
    var blankCount = 0
    console.log("blankCount:" + blankCount)
    // track the missed matches over the iterations
    var missCount = 0
    var newHit = 0
    // first count initial blanks each time the user presses a key
    for(var h = 0; h < this.wordBox.length; ++h){
      if(this.wordBox[h] == "<span>_</span>")
      this.blankCount++
    }
    if (blankCount === 0) {
      this.leveler()
    }
    else if (blankCount > 0) {
      // if there are no more blanks, levelUp
      // if (blankCount === 0) {
      //   levelUp(level.nextLevel)
      // }
      // iterate over each letter in the wordbox...
      for (var j = 0; j < wordBox.length; j++) {
        console.log(i)
        // check if it's already been assigned
        if (wordBox[j] !== "<span>_</span>") {
          continue
        }
        // if not assigned, see if it's a match
        else if (playerGuess === randomWord[j]) {
          // if so, up the correct score, push the guess to the uniqueGuesses array and update the wordBox
          newHit++
          correct++
          wordBox[j] = "<span>" + playerGuess + "</span>"
          console.log(wordBox)
          renderPage()
        }
        // if it's not a match record a miss to the miss counter
        else {
          missCount++
          console.log(missCount)
        }
      }
      // after all iterations, only record a single miss
      if (blankCount === missCount) {
        uniqueGuesses.push(playerGuess)
        console.log(uniqueGuesses)
        misses++
        renderPage
      }
      // only push one letter to uniqueGuesses if correct
      else if (newHit > 0) {
        uniqueGuesses.push(playerGuess)
        renderPage
      }
    }
  }
}

console.dir(level)


// create an object that changes depending on the levels (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Not_a_constructor)

// setting the inheritance of level to levelFunctions (http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/)



var levelOne = new level (
  ["fun", "spell", "fix", "bird", "play", "jump"],
  "LEVEL ONE",
  levelTwo
)
var levelTwo = new level (
  ["funny", "worry", "bother", "bananas", "cleaning", "swampy"],
  "LEVEL TWO",
  levelThree
)
var levelThree = new level (
  ["shenanigans", "bamboozled", "bonkers", "zoinks", "shikaka", "chicago"],
  "LEVEL THREE",
  undefined
)

// trying my hand at inheritance: objects, prototypes, etc.
// create an object for functions shared by all levels



// levelThree.prototype = new level()
// objects to hold contents at three levels of difficulty (corresponding to levels of game)
console.dir(levelOne)
// get user input
initializer = function(levelX) {
  document.onkeypress = function(event) {
    var playerGuess = event.key.toLowerCase()
    console.log("Rendering page...");
    // render results to page
    document.getElementById('bigBox').innerHTML = levelX.name
    document.getElementById('letters').innerHTML = levelX.wordBox
    document.getElementById('correct').innerHTML = levelX.correct
    document.getElementById('missed').innerHTML = levelX.misses
    document.getElementById('guessed').innerHTML = levelX.uniqueGuesses
    // replace commas in DOM with spaces
    var correctLtrsCln = document.querySelectorAll('h2')
    for (i = 0; i < correctLtrsCln.length; i++) {
      correctLtrsCln[i].innerHTML = correctLtrsCln[i].innerHTML.replace(/,/g, " ")
    }
    console.log(levelX.uniqueGuesses)
    // if there are guesses recorded, check those first
    if (levelX.uniqueGuesses > 0) {
      levelX.guessedCounter(playerGuess)
    }
    // if not, go straight to finding a match
    else {
      levelX.wordBoxer(playerGuess)
    }
  }
}

initializer(levelOne)

//
// levelOne.randWordGen()
// levelOne.renderPage()
// levelOne.leveler()
