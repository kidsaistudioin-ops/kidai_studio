"use client";

import { useState, useEffect } from "react";
import { speak } from "@/lib/voice";

const T = {
  bg: "#07090f",
  card: "#0f1520",
  card2: "#161e30",
  border: "#1e2d45",
  orange: "#ff6b35",
  purple: "#7c3aed",
  cyan: "#06b6d4",
  green: "#10b981",
  yellow: "#f59e0b",
  pink: "#ec4899",
  text: "#f1f5f9",
  muted: "#64748b",
  red: "#ef4444"
};

// ==========================================
// ENGLISH LEARNING GAMES DATA
// ==========================================

const ENGLISH_GAMES = [
  { id: "alphabet", name: "A B C D", icon: "🔤", color: "#7c3aed", desc: "English Alphabets sikhna" },
  { id: "num_spell", name: "1 to 100", icon: "🔢", color: "#06b6d4", desc: "Numbers English me" },
  { id: "tables", name: "Pahada", icon: "✖️", color: "#f59e0b", desc: "1 se 100 tak tables" },
  { id: "words", name: "Word Builder", icon: "🏗️", color: "#06b6d4", desc: "Alphabets se shabd banao" },
  { id: "spelling", name: "Spelling Bee", icon: "🐝", color: "#f59e0b", desc: "Sahi spelling likho" },
  { id: "rhyming", name: "Rhyming Words", icon: "🎵", color: "#ec4899", desc: "Milte julte shabd" },
  { id: "sentence", name: "Sentence Maker", icon: "🧩", color: "#10b981", desc: "Vakya banao" },
  { id: "reading", name: "Reading Practice", icon: "📖", color: "#ff6b35", desc: "Paragraph padho" },
  { id: "conversation", name: "Speak Easy", icon: "🗣️", color: "#7c3aed", desc: "Daily sentences bolo" },
  { id: "picture_word", name: "Pic-Word Match", icon: "🖼️", color: "#06b6d4", desc: "Photo se shabd" },
  { id: "opposites", name: "Opposites", icon: "🔄", color: "#f59e0b", desc: "Ulte shabd" },
  { id: "fill_blank", name: "Fill in Blanks", icon: "🕳️", color: "#ec4899", desc: "Khali jagah bharo" },
  { id: "unscramble", name: "Word Unscramble", icon: "🔀", color: "#10b981", desc: "Ulte shabd theek karo" },
  { id: "listening", name: "Listen & Type", icon: "👂", color: "#ff6b35", desc: "Sun ke likho" },
];

// ==========================================
// INDIVIDUAL GAME COMPONENTS
// ==========================================

// 🔤 Alphabet Game
function AlphabetGame({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const alphabets = [
    { letter: "A", word: "Apple", emoji: "🍎" },
    { letter: "B", word: "Ball", emoji: "⚽" },
    { letter: "C", word: "Cat", emoji: "🐱" },
    { letter: "D", word: "Dog", emoji: "🐕" },
    { letter: "E", word: "Elephant", emoji: "🐘" },
    { letter: "F", word: "Fish", emoji: "🐟" },
    { letter: "G", word: "Grapes", emoji: "🍇" },
    { letter: "H", word: "House", emoji: "🏠" },
  ];

  const playAudio = (text) => speak(text);

  const next = () => {
    if (currentIndex < alphabets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const current = alphabets[currentIndex];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ 
        fontSize: 80, 
        fontWeight: 900, 
        color: T.purple,
        marginBottom: 10,
        animation: "bounce 0.5s"
      }}>
        {current.letter}
      </div>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{current.emoji}</div>
      <div style={{ 
        fontSize: 24, 
        fontWeight: 700, 
        color: T.text,
        marginBottom: 20 
      }}>
        {current.word}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        <button 
          onClick={() => playAudio(current.letter)}
          style={{ ...btnStyle(T.cyan), padding: "12px 20px" }}
        >
          🔊 Letter
        </button>
        <button 
          onClick={() => playAudio(current.word)}
          style={{ ...btnStyle(T.green), padding: "12px 20px" }}
        >
          🔊 Word
        </button>
      </div>
      <button onClick={next} style={{ ...btnStyle(T.orange), padding: "15px 40px", fontSize: 16 }}>
        {currentIndex < alphabets.length - 1 ? "Next →" : "Finish ✅"}
      </button>
      <div style={{ marginTop: 20, color: T.muted }}>
        {currentIndex + 1} / {alphabets.length}
      </div>
    </div>
  );
}

// 🔢 Number Spelling Game (1-100)
function NumberSpellingGame({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // 1-100 numbers with spelling
  const numbers = [
    { num: 1, spell: "ONE" },
    { num: 2, spell: "TWO" },
    { num: 3, spell: "THREE" },
    { num: 4, spell: "FOUR" },
    { num: 5, spell: "FIVE" },
    { num: 6, spell: "SIX" },
    { num: 7, spell: "SEVEN" },
    { num: 8, spell: "EIGHT" },
    { num: 9, spell: "NINE" },
    { num: 10, spell: "TEN" },
    { num: 11, spell: "ELEVEN" },
    { num: 12, spell: "TWELVE" },
    { num: 13, spell: "THIRTEEN" },
    { num: 14, spell: "FOURTEEN" },
    { num: 15, spell: "FIFTEEN" },
    { num: 16, spell: "SIXTEEN" },
    { num: 17, spell: "SEVENTEEN" },
    { num: 18, spell: "EIGHTEEN" },
    { num: 19, spell: "NINETEEN" },
    { num: 20, spell: "TWENTY" },
    { num: 21, spell: "TWENTY ONE" },
    { num: 22, spell: "TWENTY TWO" },
    { num: 25, spell: "TWENTY FIVE" },
    { num: 30, spell: "THIRTY" },
    { num: 35, spell: "THIRTY FIVE" },
    { num: 40, spell: "FORTY" },
    { num: 45, spell: "FORTY FIVE" },
    { num: 50, spell: "FIFTY" },
    { num: 55, spell: "FIFTY FIVE" },
    { num: 60, spell: "SIXTY" },
    { num: 70, spell: "SEVENTY" },
    { num: 80, spell: "EIGHTY" },
    { num: 90, spell: "NINETY" },
    { num: 100, spell: "ONE HUNDRED" },
  ];

  const checkAnswer = () => {
    if (userInput.toUpperCase().trim() === numbers[currentIndex].spell) {
      setFeedback("correct");
      setScore(score + 10);
      speak("Correct!");
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex < numbers.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserInput("");
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback("wrong");
      speak("Try again!");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.cyan, marginBottom: 15 }}>Number Spelling 🔢</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Number ka English spelling likho</p>
      
      <div style={{ 
        fontSize: 80, 
        fontWeight: 900, 
        color: T.orange, 
        marginBottom: 20 
      }}>
        {numbers[currentIndex].num}
      </div>

      <button 
        onClick={() => speak(numbers[currentIndex].spell)}
        style={{ ...btnStyle(T.purple), marginBottom: 20, padding: "10px 20px" }}
      >
        🔊 Listen
      </button>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Write in English..."
        style={{
          padding: "15px 20px",
          fontSize: 18,
          borderRadius: 12,
          border: `2px solid ${feedback === "correct" ? T.green : feedback === "wrong" ? T.red : T.cyan}`,
          background: T.card,
          color: T.text,
          textAlign: "center",
          marginBottom: 15,
          width: "80%",
          maxWidth: 300
        }}
      />

      <button onClick={checkAnswer} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Check
      </button>

      {feedback === "correct" && (
        <div style={{ color: T.green, marginTop: 15, fontSize: 18 }}>🎉 Sahi!</div>
      )}
      {feedback === "wrong" && (
        <div style={{ color: T.red, marginTop: 15, fontSize: 18 }}>
          Galat! Sahi answer: {numbers[currentIndex].spell}
        </div>
      )}

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score} | {currentIndex + 1} / {numbers.length}
      </div>
    </div>
  );
}

// ✖️ Tables (Pahada) Game
function TablesGame({ onComplete }) {
  const [tableOf, setTableOf] = useState(2);
  const [current, setCurrent] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const checkAnswer = () => {
    const correctAnswer = tableOf * current;
    if (parseInt(userInput) === correctAnswer) {
      setFeedback("correct");
      setScore(score + 10);
      speak("Correct!");
      setTimeout(() => {
        setFeedback(null);
        if (current < 10) {
          setCurrent(current + 1);
          setUserInput("");
        } else {
          // Move to next table
          const currentIndex = tables.indexOf(tableOf);
          if (currentIndex < tables.length - 1) {
            setTableOf(tables[currentIndex + 1]);
            setCurrent(1);
            setUserInput("");
          } else {
            onComplete();
          }
        }
      }, 1500);
    } else {
      setFeedback("wrong");
      speak("Try again!");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.yellow, marginBottom: 15 }}>Pahada (Tables) ✖️</h2>
      
      {/* Table Selector */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: T.muted, marginBottom: 10 }}>Kis number ka pahada sikhna hai?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {tables.map((t) => (
            <button
              key={t}
              onClick={() => { setTableOf(t); setCurrent(1); setUserInput(""); setShowTable(false); }}
              style={{
                background: tableOf === t ? T.yellow : T.card2,
                color: tableOf === t ? "#000" : T.text,
                border: "none",
                borderRadius: 10,
                padding: "10px 15px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Show Full Table Button */}
      <button 
        onClick={() => setShowTable(!showTable)}
        style={{ ...btnStyle(T.purple), marginBottom: 20, padding: "10px 20px" }}
      >
        {showTable ? "🙈 Hide Table" : "📖 Show Full Table"}
      </button>

      {/* Full Table Display */}
      {showTable && (
        <div style={{ 
          background: T.card2, 
          borderRadius: 16, 
          padding: 20, 
          marginBottom: 20,
          maxWidth: 300,
          margin: "0 auto 20px"
        }}>
          <div style={{ color: T.yellow, fontWeight: 700, marginBottom: 10 }}>
            Table of {tableOf}:
          </div>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <div key={i} style={{ 
              color: T.text, 
              fontSize: 18,
              padding: "5px 0",
              borderBottom: `1px solid ${T.border}`
            }}>
              {tableOf} × {i} = {tableOf * i}
            </div>
          ))}
        </div>
      )}

      {/* Question */}
      <div style={{ 
        fontSize: 48, 
        fontWeight: 900, 
        color: T.orange, 
        marginBottom: 20 
      }}>
        {tableOf} × {current} = ?
      </div>

      <input
        type="number"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Answer..."
        style={{
          padding: "15px 20px",
          fontSize: 20,
          borderRadius: 12,
          border: `2px solid ${feedback === "correct" ? T.green : feedback === "wrong" ? T.red : T.yellow}`,
          background: T.card,
          color: T.text,
          textAlign: "center",
          marginBottom: 15,
          width: "80%",
          maxWidth: 200
        }}
      />

      <button onClick={checkAnswer} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Check
      </button>

      {feedback === "correct" && (
        <div style={{ color: T.green, marginTop: 15, fontSize: 18 }}>🎉 Sahi!</div>
      )}
      {feedback === "wrong" && (
        <div style={{ color: T.red, marginTop: 15, fontSize: 18 }}>
          Galat! Sahi answer: {tableOf * current}
        </div>
      )}

      <div style={{ marginTop: 20, color: T.cyan, fontWeight: 700 }}>
        Score: {score} | Table: {tableOf} | Q: {current}/10
      </div>
    </div>
  );
}

// 🏗️ Word Builder Game
function WordBuilderGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  
  const words = [
    { letters: ["C", "A", "T"], hint: "🐱 A pet animal that says Meow" },
    { letters: ["D", "O", "G"], hint: "🐕 A pet animal that says Woof" },
    { letters: ["S", "U", "N"], hint: "☀️ It gives us light" },
    { letters: ["M", "O", "O", "N"], hint: "🌙 Seen at night" },
    { letters: ["B", "I", "R", "D"], hint: "🐦 It can fly" },
  ];

  const [userInput, setUserInput] = useState("");

  const checkAnswer = () => {
    if (userInput.toUpperCase() === words[currentWord].letters.join("")) {
      setScore(score + 10);
      speak("Correct!");
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        setUserInput("");
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.cyan, marginBottom: 10 }}>Word Builder 🏗️</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>{words[currentWord].hint}</p>
      
      <div style={{ 
        display: "flex", 
        gap: 8, 
        justifyContent: "center", 
        marginBottom: 20 
      }}>
        {words[currentWord].letters.map((letter, i) => (
          <div key={i} style={{
            width: 50,
            height: 50,
            background: T.card2,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
            color: T.text,
            border: `2px solid ${T.border}`
          }}>
            {letter}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.toUpperCase())}
        placeholder="Type the word..."
        style={{
          padding: "15px 20px",
          fontSize: 20,
          borderRadius: 12,
          border: `2px solid ${T.cyan}`,
          background: T.card,
          color: T.text,
          textAlign: "center",
          marginBottom: 15,
          width: "80%",
          maxWidth: 300
        }}
      />

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={checkAnswer} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
          ✅ Check
        </button>
        <button onClick={() => speak(words[currentWord].hint)} style={{ ...btnStyle(T.orange), padding: "12px 20px" }}>
          🔊 Hint
        </button>
      </div>

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// 🐝 Spelling Bee Game
function SpellingBeeGame({ onComplete }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  const words = [
    { word: "APPLE", hint: "🍎 A red fruit" },
    { word: "WATER", hint: "💧 We drink it" },
    { word: "SCHOOL", hint: "🏫 We study here" },
    { word: "FRIEND", hint: "👫 Someone we like" },
    { word: "HAPPY", hint: "😊 Feeling good" },
  ];

  const checkSpelling = () => {
    if (userInput.toUpperCase().trim() === words[currentWord].word) {
      setFeedback("correct");
      speak("Correct!");
      setTimeout(() => {
        if (currentWord < words.length - 1) {
          setCurrentWord(currentWord + 1);
          setUserInput("");
          setFeedback(null);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback("wrong");
      speak("Try again!");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.yellow, marginBottom: 10 }}>Spelling Bee 🐝</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>{words[currentWord].hint}</p>

      <button 
        onClick={() => speak(words[currentWord].word)}
        style={{ ...btnStyle(T.cyan), marginBottom: 20, padding: "10px 20px" }}
      >
        🔊 Listen
      </button>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Write the spelling..."
        style={{
          padding: "15px 20px",
          fontSize: 18,
          borderRadius: 12,
          border: `2px solid ${feedback === "correct" ? T.green : feedback === "wrong" ? T.red : T.border}`,
          background: T.card,
          color: T.text,
          textAlign: "center",
          marginBottom: 15,
          width: "80%",
          maxWidth: 300
        }}
      />

      <button onClick={checkSpelling} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Submit
      </button>

      {feedback === "correct" && (
        <div style={{ color: T.green, marginTop: 15, fontSize: 18 }}>🎉 Perfect!</div>
      )}
      {feedback === "wrong" && (
        <div style={{ color: T.red, marginTop: 15, fontSize: 18 }}>😅 Try again!</div>
      )}
    </div>
  );
}

// 🎵 Rhyming Words Game
function RhymingWordsGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const rhymes = [
    { word: "CAT", options: ["HAT", "DOG", "CAR"], correct: "HAT" },
    { word: "SUN", options: ["FUN", "RUN", "MAN"], correct: "FUN" },
    { word: "DAY", options: ["SAY", "WAY", "KEY"], correct: "SAY" },
    { word: "TREE", options: ["FREE", "FISH", "BALL"], correct: "FREE" },
    { word: "BOOK", options: ["LOOK", "COOK", "FOOD"], correct: "LOOK" },
  ];

  const checkAnswer = (option) => {
    if (option === rhymes[current].correct) {
      setScore(score + 10);
      speak("Correct!");
      if (current < rhymes.length - 1) {
        setCurrent(current + 1);
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.pink, marginBottom: 15 }}>Rhyming Words 🎵</h2>
      <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
        Which word rhymes with <span style={{ color: T.pink }}>{rhymes[current].word}</span>?
      </p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, maxWidth: 400, margin: "0 auto" }}>
        {rhymes[current].options.map((option) => (
          <button 
            key={option}
            onClick={() => checkAnswer(option)}
            style={{ ...btnStyle(T.card2), padding: "15px", fontSize: 16 }}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// 🧩 Sentence Maker Game
function SentenceMakerGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const sentences = [
    { words: ["I", "love", "my", "dog"], correct: "I love my dog" },
    { words: ["The", "cat", "is", "sleeping"], correct: "The cat is sleeping" },
    { words: ["She", "goes", "to", "school"], correct: "She goes to school" },
    { words: ["We", "play", "in", "the", "park"], correct: "We play in the park" },
  ];

  const [arranged, setArranged] = useState([]);
  const [available, setAvailable] = useState([...sentences[current].words]);

  const moveToArranged = (word, index) => {
    setArranged([...arranged, word]);
    setAvailable(available.filter((_, i) => i !== index));
  };

  const moveToAvailable = (word, index) => {
    setAvailable([...available, word]);
    setArranged(arranged.filter((_, i) => i !== index));
  };

  const checkSentence = () => {
    const userSentence = arranged.join(" ");
    if (userSentence === sentences[current].correct) {
      setScore(score + 10);
      speak("Correct!");
      if (current < sentences.length - 1) {
        setCurrent(current + 1);
        setArranged([]);
        setAvailable([...sentences[current + 1].words]);
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.green, marginBottom: 15 }}>Sentence Maker 🧩</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Words ko sahi order me arrange karo</p>

      <div style={{ 
        minHeight: 60, 
        background: T.card2, 
        borderRadius: 12, 
        padding: 15,
        marginBottom: 20,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center"
      }}>
        {arranged.length === 0 ? (
          <span style={{ color: T.muted }}>Tap words to build sentence...</span>
        ) : (
          arranged.map((word, i) => (
            <button 
              key={i} 
              onClick={() => moveToAvailable(word, i)}
              style={{ ...wordChipStyle, background: T.purple }}
            >
              {word}
            </button>
          ))
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {available.map((word, i) => (
          <button 
            key={i} 
            onClick={() => moveToArranged(word, i)}
            style={wordChipStyle}
          >
            {word}
          </button>
        ))}
      </div>

      <button onClick={checkSentence} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Check
      </button>
    </div>
  );
}

// 📖 Reading Practice Game
function ReadingPracticeGame({ onComplete }) {
  const [current, setCurrent] = useState(0);

  const passages = [
    { text: "I am a boy. I go to school. I have a red bag.", difficulty: "Easy" },
    { text: "The sun is bright. Birds are flying in the sky. It is a beautiful day.", difficulty: "Medium" },
    { text: "My mother cooks delicious food. My father works in an office. We are a happy family.", difficulty: "Hard" },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.orange, marginBottom: 15 }}>Reading Practice 📖</h2>
      <div style={{ 
        background: T.card2, 
        borderRadius: 16, 
        padding: 25, 
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 1.8,
        color: T.text
      }}>
        {passages[current].text}
      </div>
      
      <button 
        onClick={() => speak(passages[current].text)}
        style={{ ...btnStyle(T.cyan), marginBottom: 20, padding: "12px 25px" }}
      >
        🔊 Listen & Read
      </button>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {current > 0 && (
          <button onClick={() => setCurrent(current - 1)} style={{ ...btnStyle(T.card2), padding: "10px 20px" }}>
            ← Previous
          </button>
        )}
        {current < passages.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)} style={{ ...btnStyle(T.green), padding: "10px 20px" }}>
            Next →
          </button>
        ) : (
          <button onClick={onComplete} style={{ ...btnStyle(T.orange), padding: "10px 20px" }}>
            Finish ✅
          </button>
        )}
      </div>
    </div>
  );
}

// 🗣️ Speak Easy - Conversation Practice
function SpeakEasyGame({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  const conversations = [
    { question: "What is your name?", answer: "My name is...", hint: "Apna naam bolo" },
    { question: "How are you?", answer: "I am...", hint: "Kaisa hai tu?" },
    { question: "What is your favorite color?", answer: "My favorite color is...", hint: "Favourite rang kya hai?" },
    { question: "What do you eat for breakfast?", answer: "I eat...", hint: "Subah kya khata hai?" },
    { question: "How many brothers/sisters do you have?", answer: "I have...", hint: "Kitne brother/sister hai?" },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.purple, marginBottom: 15 }}>Speak Easy 🗣️</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Mic click karke bolna</p>

      <div style={{ 
        background: T.card2, 
        borderRadius: 16, 
        padding: 30, 
        marginBottom: 20 
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
          {conversations[current].question}
        </div>
        <div style={{ color: T.muted, fontSize: 14 }}>
          Hint: {conversations[current].hint}
        </div>
      </div>

      <button 
        onClick={() => speak(conversations[current].answer)}
        style={{ ...btnStyle(T.cyan), padding: "15px 30px", marginBottom: 20 }}
      >
        🔊 Listen Example
      </button>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {current > 0 && (
          <button onClick={() => setCurrent(current - 1)} style={{ ...btnStyle(T.card2), padding: "10px 20px" }}>
            ← Back
          </button>
        )}
        {current < conversations.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)} style={{ ...btnStyle(T.green), padding: "10px 20px" }}>
            Next Topic →
          </button>
        ) : (
          <button onClick={onComplete} style={{ ...btnStyle(T.orange), padding: "10px 20px" }}>
            Done ✅
          </button>
        )}
      </div>
    </div>
  );
}

// 🖼️ Picture Word Match
function PictureWordMatchGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const items = [
    { emoji: "🍎", options: ["Apple", "Mango", "Banana"], correct: "Apple" },
    { emoji: "🏠", options: ["House", "School", "Park"], correct: "House" },
    { emoji: "🐕", options: ["Cat", "Dog", "Bird"], correct: "Dog" },
    { emoji: "☀️", options: ["Moon", "Star", "Sun"], correct: "Sun" },
    { emoji: "🚗", options: ["Bus", "Car", "Bike"], correct: "Car" },
  ];

  const checkAnswer = (option) => {
    if (option === items[current].correct) {
      setScore(score + 10);
      speak("Correct!");
      if (current < items.length - 1) {
        setCurrent(current + 1);
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.cyan, marginBottom: 15 }}>Picture Word Match 🖼️</h2>
      <div style={{ fontSize: 80, marginBottom: 20 }}>{items[current].emoji}</div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, maxWidth: 350, margin: "0 auto" }}>
        {items[current].options.map((option) => (
          <button 
            key={option}
            onClick={() => checkAnswer(option)}
            style={{ ...btnStyle(T.card2), padding: "15px", fontSize: 16 }}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// 🔄 Opposites Game
function OppositesGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const opposites = [
    { word: "BIG", options: ["SMALL", "TALL", "OLD"], correct: "SMALL" },
    { word: "HOT", options: ["COLD", "WARM", "COOL"], correct: "COLD" },
    { word: "FAST", options: ["SLOW", "QUICK", "RAPID"], correct: "SLOW" },
    { word: "HAPPY", options: ["SAD", "JOY", "GLAD"], correct: "SAD" },
    { word: "LIGHT", options: ["DARK", "BRIGHT", "CLEAR"], correct: "DARK" },
  ];

  const checkAnswer = (option) => {
    if (option === opposites[current].correct) {
      setScore(score + 10);
      speak("Correct!");
      if (current < opposites.length - 1) {
        setCurrent(current + 1);
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.yellow, marginBottom: 15 }}>Opposites 🔄</h2>
      <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
        Opposite of <span style={{ color: T.yellow }}>{opposites[current].word}</span>?
      </p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, maxWidth: 400, margin: "0 auto" }}>
        {opposites[current].options.map((option) => (
          <button 
            key={option}
            onClick={() => checkAnswer(option)}
            style={{ ...btnStyle(T.card2), padding: "15px", fontSize: 16 }}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20, color: T.cyan, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// 🕳️ Fill in Blanks Game
function FillBlanksGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const sentences = [
    { sentence: "The cat is _____ (sleep/sleeping)", correct: "sleeping" },
    { sentence: "I _____ (go/went) to school yesterday", correct: "went" },
    { sentence: "She _____ (eat/eats) apples every day", correct: "eats" },
    { sentence: "They _____ (play/playing) in the park", correct: "play" },
    { sentence: "He _____ (is/are) a good student", correct: "is" },
  ];

  const [userInput, setUserInput] = useState("");

  const checkAnswer = () => {
    if (userInput.toLowerCase().trim() === sentences[current].correct) {
      setScore(score + 10);
      speak("Correct!");
      if (current < sentences.length - 1) {
        setCurrent(current + 1);
        setUserInput("");
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.pink, marginBottom: 15 }}>Fill in Blanks 🕳️</h2>
      <p style={{ fontSize: 18, marginBottom: 20, lineHeight: 1.6 }}>
        {sentences[current].sentence.split("(")[0]}
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="?"
          style={{
            padding: "8px 15px",
            fontSize: 16,
            borderRadius: 8,
            border: `2px solid ${T.pink}`,
            background: T.card,
            color: T.text,
            textAlign: "center",
            width: 120,
            margin: "0 5px"
          }}
        />
        {sentences[current].sentence.split(")")[1]}
      </p>

      <button onClick={checkAnswer} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Check
      </button>

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// 🔀 Word Unscramble Game
function WordUnscrambleGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  const words = [
    { scrambled: "TEAC", answer: "CAT" },
    { scrambled: "ROF", answer: "FOR" },
    { scrambled: "WON", answer: "NOW" },
    { scrambled: "TAHT", answer: "THAT" },
    { scrambled: "THIS", answer: "THIS" },
  ];

  const [userInput, setUserInput] = useState("");

  const checkAnswer = () => {
    if (userInput.toUpperCase().trim() === words[current].answer) {
      setScore(score + 10);
      speak("Correct!");
      if (current < words.length - 1) {
        setCurrent(current + 1);
        setUserInput("");
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.green, marginBottom: 15 }}>Word Unscramble 🔀</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Shabd theek karo</p>
      
      <div style={{ 
        fontSize: 36, 
        fontWeight: 900, 
        color: T.orange, 
        marginBottom: 20,
        letterSpacing: 5
      }}>
        {words[current].scrambled}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.toUpperCase())}
        placeholder="Type the word..."
        style={{
          padding: "15px 20px",
          fontSize: 18,
          borderRadius: 12,
          border: `2px solid ${T.green}`,
          background: T.card,
          color: T.text,
          textAlign: "center",
          marginBottom: 15,
          width: "80%",
          maxWidth: 250
        }}
      />

      <button onClick={checkAnswer} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Check
      </button>

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// 👂 Listen and Type Game
function ListenTypeGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [userInput, setUserInput] = useState("");

  const words = ["CAT", "DOG", "SUN", "BOOK", "TREE"];

  const checkAnswer = () => {
    if (userInput.toUpperCase().trim() === words[current]) {
      setScore(score + 10);
      speak("Correct!");
      if (current < words.length - 1) {
        setCurrent(current + 1);
        setUserInput("");
      } else {
        onComplete();
      }
    } else {
      speak("Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: T.orange, marginBottom: 15 }}>Listen & Type 👂</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Sun ke likho</p>

      <button 
        onClick={() => speak(words[current])}
        style={{ ...btnStyle(T.cyan), padding: "20px 40px", fontSize: 20, marginBottom: 20 }}
      >
        🔊 Play Sound
      </button>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type what you heard..."
        style={{
          padding: "15px 20px",
          fontSize: 18,
          borderRadius: 12,
          border: `2px solid ${T.orange}`,
          background: T.card,
          color: T.text,
          textAlign: "center",
          marginBottom: 15,
          width: "80%",
          maxWidth: 300
        }}
      />

      <button onClick={checkAnswer} style={{ ...btnStyle(T.green), padding: "12px 30px" }}>
        ✅ Submit
      </button>

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score}
      </div>
    </div>
  );
}

// ==========================================
// AI SCANNED GAME (HOMEWORK TO GAME)
// ==========================================
function AIGeneratedGame({ gameData, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showExplain, setShowExplain] = useState(false);

  if (!gameData || !gameData.questions || gameData.questions.length === 0) {
    return <div style={{ color: T.text, textAlign: 'center', padding: 20 }}>Game load ho raha hai...</div>;
  }

  const question = gameData.questions[current];  
  // AI kabhi 'q' bhejta hai aur kabhi 'gameQ', isliye dono check karenge
  const qText = question.gameQ || question.q || question.question || "Answer this:";
  const qTextHin = question.gameQ_hin || "";
  const options = question.opts || question.options || [];
  const optionsHin = question.opts_hin || [];

  const checkAnswer = (idx) => {
    if (idx === question.correct) {
      setFeedback("correct");
      setScore(score + 10);
      speak("Correct! Bahut badhiya");
      setTimeout(() => {
        setFeedback(null);
        if (current < gameData.questions.length - 1) {
          setCurrent(current + 1);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback("wrong");
      speak("Oops, Try again!");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ color: T.orange, fontWeight: 800, marginBottom: 10, fontSize: 14 }}>
        ✨ AI Magic Game: {gameData.title || gameData.gameTitle || "Scanned Mission"}
      </div>
      <h2 style={{ color: T.cyan, marginBottom: 5, fontSize: 22, lineHeight: 1.4 }}>
        {qText}
      </h2>
      {qTextHin && (
        <div style={{ color: T.muted, fontSize: 16, marginBottom: 15, fontStyle: 'italic', fontWeight: 600 }}>
          ({qTextHin})
        </div>
      )}
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, maxWidth: 400, margin: "20px auto" }}>
        {options.map((opt, idx) => (
          <button 
            key={idx}
            onClick={() => checkAnswer(idx)}
            style={{ 
              ...btnStyle(T.card2), 
              padding: "16px", 
              fontSize: 16, 
              border: `2px solid ${feedback === "correct" && idx === question.correct ? T.green : feedback === "wrong" && idx !== question.correct ? T.red : T.border}`,
              background: feedback === "correct" && idx === question.correct ? T.green + '33' : T.card2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4
            }}
          >
            <span style={{ fontWeight: 800 }}>{opt}</span>
            {optionsHin[idx] && <span style={{ fontSize: 13, color: feedback === "correct" && idx === question.correct ? T.green : T.muted, fontWeight: 600 }}>({optionsHin[idx]})</span>}
          </button>
        ))}
      </div>

      {showExplain && (
        <div style={{ background: T.card2, padding: 15, borderRadius: 12, marginTop: 15, border: `1px solid ${feedback === 'correct' ? T.green : T.red}` }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>{feedback === 'correct' ? '✅ Sahi Jawab!' : '❌ Galat Jawab!'}</div>
          <div style={{ color: T.muted, fontSize: 14, marginBottom: 15 }}>💡 <b>Seekho:</b> {question.explain || "Agli baar dhyan se sochna!"}</div>
          <button onClick={nextQuestion} style={{ ...btnStyle(T.cyan), padding: "10px 20px" }}>Aage Badhein ➔</button>
        </div>
      )}

      <div style={{ marginTop: 20, color: T.yellow, fontWeight: 700 }}>
        Score: {score} | Q: {current + 1} / {gameData.questions.length}
      </div>
    </div>
  );
}

// ==========================================
// GAME MAPPING
// ==========================================

const GAME_COMPONENTS = {
  alphabet: AlphabetGame,
  num_spell: NumberSpellingGame,
  tables: TablesGame,
  words: WordBuilderGame,
  spelling: SpellingBeeGame,
  rhyming: RhymingWordsGame,
  sentence: SentenceMakerGame,
  reading: ReadingPracticeGame,
  conversation: SpeakEasyGame,
  picture_word: PictureWordMatchGame,
  opposites: OppositesGame,
  fill_blank: FillBlanksGame,
  unscramble: WordUnscrambleGame,
  listening: ListenTypeGame,
};

// ==========================================
// STYLES
// ==========================================

const btnStyle = (color) => ({
  background: color,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "12px 24px",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  transition: "transform 0.2s"
});

const wordChipStyle = {
  background: T.card2,
  color: T.text,
  border: `2px solid ${T.border}`,
  borderRadius: 20,
  padding: "10px 20px",
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer"
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SeekhoEnglishPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [xp, setXp] = useState(0);
  const [completedGames, setCompletedGames] = useState([]);
  const [scannedGame, setScannedGame] = useState(null);

  // Check agar Scanner ne koi game banakar bheja hai
  useEffect(() => {
    const saved = localStorage.getItem('kidai_scanned_game');
    if (saved) {
      try {
        setScannedGame(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const handleGameComplete = (gameId) => {
    setXp(xp + 15);
    setCompletedGames([...completedGames, gameId]);
    speak("Great job! You earned 15 XP!");
    setActiveGame(null);
    
    // Agar scanned game khatam ho gaya, toh memory se hata do
    if (gameId === 'ai_scanned') {
      localStorage.removeItem('kidai_scanned_game');
      setScannedGame(null);
    }
  };

  const GameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  if (activeGame === 'ai_scanned' && scannedGame) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, padding: 20, fontFamily: "system-ui, sans-serif" }}>
        <button onClick={() => setActiveGame(null)} style={{ background: T.card2, color: T.text, border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", marginBottom: 20 }}>← Back</button>
        <div style={{ background: T.card, borderRadius: 20, padding: 30, maxWidth: 600, margin: "0 auto", border: `2px solid ${T.orange}`, boxShadow: `0 0 30px ${T.orange}33` }}>
          <AIGeneratedGame gameData={scannedGame} onComplete={() => handleGameComplete('ai_scanned')} />
        </div>
      </div>
    );
  }

  if (GameComponent && activeGame !== 'ai_scanned') {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: T.bg, 
        padding: 20,
        fontFamily: "system-ui, sans-serif"
      }}>
        <button 
          onClick={() => setActiveGame(null)}
          style={{ 
            background: T.card2, 
            color: T.text, 
            border: "none", 
            borderRadius: 10, 
            padding: "10px 20px",
            cursor: "pointer",
            marginBottom: 20
          }}
        >
          ← Back to Games
        </button>
        
        <div style={{ 
          background: T.card, 
          borderRadius: 20, 
          padding: 30,
          maxWidth: 600,
          margin: "0 auto"
        }}>
          <GameComponent onComplete={() => handleGameComplete(activeGame)} />
        </div>

        <div style={{ 
          textAlign: "center", 
          marginTop: 20, 
          color: T.yellow,
          fontWeight: 700,
          fontSize: 18
        }}>
          🎯 XP: {xp}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: T.bg, 
      padding: 20,
      fontFamily: "system-ui, sans-serif"
    }}>
      <style>{`
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 8px 30px #ff6b3566; } 50% { transform: scale(1.02); box-shadow: 0 8px 40px #ff6b3599; } 100% { transform: scale(1); box-shadow: 0 8px 30px #ff6b3566; } }
        @keyframes bounce-sm { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>

      {/* Header */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: 30,
        padding: 20,
        background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
        borderRadius: 20
      }}>
        <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 10 }}>
          📚 Seekho - English Learning
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
          English sikhna ab maze mein!
        </p>
        <div style={{ 
          marginTop: 15, 
          display: "flex", 
          justifyContent: "center", 
          gap: 30 
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{xp}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>XP Earned</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{completedGames.length}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Games Played</div>
          </div>
        </div>
      </div>

      {/* AI Scanned Game Banner - Tab dikhega jab user scan karke aayega */}
      {scannedGame && (
        <div 
          onClick={() => setActiveGame('ai_scanned')}
          style={{ background: `linear-gradient(135deg, ${T.orange}, ${T.pink})`, borderRadius: 20, padding: 3, maxWidth: 800, margin: "0 auto 30px", cursor: "pointer", boxShadow: `0 8px 30px ${T.orange}66`, animation: "pulse 2s infinite" }}
        >
          <div style={{ background: T.card, borderRadius: 18, padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 50, animation: "bounce-sm 2s infinite" }}>🎁</div>
            <div>
              <div style={{ background: T.orange, color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 8px', borderRadius: 8, display: 'inline-block', marginBottom: 8, letterSpacing: 1 }}>NEW SCAN 📸</div>
              <h2 style={{ color: T.text, margin: "0 0 8px", fontSize: 22, fontWeight: 900 }}>Aapka Naya AI Game!</h2>
              <p style={{ color: T.muted, margin: 0, fontSize: 14, lineHeight: 1.5 }}>Jo photo aapne daali thi, Arya ne uska game bana diya hai. <span style={{color: T.orange, fontWeight: 800}}>Tap karke abhi khelo! ▶</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", 
        gap: 15,
        maxWidth: 800,
        margin: "0 auto"
      }}>
        {ENGLISH_GAMES.map((game) => {
          const isCompleted = completedGames.includes(game.id);
          return (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              style={{
                background: isCompleted ? T.green + "20" : T.card,
                border: `2px solid ${isCompleted ? T.green : T.border}`,
                borderRadius: 16,
                padding: 20,
                cursor: "pointer",
                textAlign: "center",
                transition: "transform 0.2s"
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>{game.icon}</div>
              <div style={{ 
                color: T.text, 
                fontWeight: 700, 
                fontSize: 14,
                marginBottom: 5
              }}>
                {game.name}
              </div>
              <div style={{ 
                color: T.muted, 
                fontSize: 11 
              }}>
                {game.desc}
              </div>
              {isCompleted && (
                <div style={{ 
                  marginTop: 10, 
                  color: T.green, 
                  fontSize: 12 
                }}>
                  ✅ Completed
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Section */}
      {completedGames.length > 0 && (
        <div style={{ 
          marginTop: 30, 
          background: T.card, 
          borderRadius: 16, 
          padding: 20,
          maxWidth: 600,
          margin: "30px auto 0"
        }}>
          <h3 style={{ color: T.text, marginBottom: 15 }}>📊 Your Progress</h3>
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: 10 
          }}>
            {completedGames.map((id) => {
              const game = ENGLISH_GAMES.find(g => g.id === id);
              return (
                <div key={id} style={{
                  background: T.green + "20",
                  color: T.green,
                  padding: "8px 15px",
                  borderRadius: 20,
                  fontSize: 13
                }}>
                  {game?.icon} {game?.name}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}