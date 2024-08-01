import { useCallback, useEffect, useState } from 'react'
import words from './worldList.json'
import HangmanDrawing from './HangmanDrawing'
import HangmanWord from './HangmanWord'
import Keyboard from './Keyboard'


function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}



function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord) 
  console.log(wordToGuess)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])

  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = incorrectLetters.length >=6 
  const isWinner = wordToGuess.split("").every(letter => {
    return guessedLetters.includes(letter)
  })

  const addGuessedLetter = useCallback((letter: string) =>{

    if(guessedLetters.includes(letter) || isLoser || isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters, letter])

  },[guessedLetters, isLoser, isWinner])



  useEffect(() => {
    const handler = (e: KeyboardEvent) =>{
        const key = e.key;

        if(!key.match(/^[a-z]$/)) return;

        e.preventDefault()
        addGuessedLetter(key)
    }
    document.addEventListener("keypress", handler)

    return () => {
      document.removeEventListener("keypress",handler)
    }
  }, [guessedLetters])

  
  useEffect(() => {
    const handler = (e: KeyboardEvent) =>{
      const key = e.key;
      if(key !== "Enter") return;
      setWordToGuess(getWord())
      setGuessedLetters([])
      e.preventDefault()
  }
  document.addEventListener("keypress", handler)

  return () => {
    document.removeEventListener("keypress",handler)
  }
  },[])


  return (
    <div 
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center"
      }}
    >

      <div>
       {isWinner && "WINNER - Refresh to try again click Enter"}
       {isLoser && "You've lost - Refresh to try again click Enter"}
      </div>


      <HangmanDrawing numberOfGuesses={incorrectLetters.length}  />

      <HangmanWord
       guessedLetters={guessedLetters} 
       wordToGuess={wordToGuess} 
       reveal={isLoser}
       />

      <div style={{alignSelf: "stretch"}}>
        <Keyboard 
          disabled={isWinner || isLoser}
          activeLetter={guessedLetters.filter((letter) => wordToGuess.includes(letter) )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
         />


      </div>
      
    </div>
  )
}

export default App
