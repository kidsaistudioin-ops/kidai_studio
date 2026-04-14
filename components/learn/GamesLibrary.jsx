"use client";

import { useState, useEffect } from "react";
import SnakeLadderGame from "@/components/games-animation/snakeLadderAnimated/GameBoard";
import { speak } from "@/lib/voice";

const T = {
  bg: "#07090f", card: "#0f1520", card2: "#161e30", border: "#1e2d45",
  orange: "#ff6b35", purple: "#7c3aed", cyan: "#06b6d4", green: "#10b981",
  yellow: "#f59e0b", pink: "#ec4899", text: "#f1f5f9", muted: "#64748b", red: "#ef4444"
};

// ==========================================
// MOCK DATA FOR 50 GAMES
// ==========================================
const GAME_TYPES = [
  { id: "quiz", name: "Classic Quiz", icon: "📝", color: T.cyan, desc: "4 Options MCQ" },
  { id: "true_false", name: "True or False", icon: "⚖️", color: T.orange, desc: "Sahi ya Galat?" },
  { id: "match_pairs", name: "Match Pairs", icon: "🔗", color: T.purple, desc: "Jode Banao" },
  { id: "sequence", name: "Sequence", icon: "🔢", color: T.green, desc: "Sahi kram me lagao" },
  { id: "flashcards", name: "Flashcards", icon: "🎴", color: T.yellow, desc: "Flip and Learn" },
  { id: "unscramble", name: "Unscramble", icon: "🔀", color: T.pink, desc: "Uljhe shabd theek karo" },
  { id: "odd_one_out", name: "Odd One Out", icon: "🕵️", color: T.cyan, desc: "Sabse alag chuno" },
  { id: "fill_blanks", name: "Fill Blanks", icon: "🕳️", color: T.orange, desc: "Khaali jagah bharo" },
  { id: "story_choice", name: "Story Path", icon: "📖", color: T.purple, desc: "Kahani ka rasta chuno" },
  { id: "image_guess", name: "Emoji Guess", icon: "🤔", color: T.green, desc: "Emoji se pehchano" },
  { id: "drag_drop", name: "Drag & Drop", icon: "🖐️", color: T.yellow, desc: "Uthao aur rakho" },
  { id: "word_hunt", name: "Word Hunt", icon: "🔍", color: T.pink, desc: "Shabd dhoondo" },
  { id: "memory_cards", name: "Memory", icon: "🧠", color: T.cyan, desc: "Yaadash test" },
  { id: "quick_tap", name: "Quick Tap", icon: "⚡", color: T.orange, desc: "Jaldi tap karo!" },
  { id: "anim_math", name: "Anim Math", icon: "🍎", color: T.purple, desc: "Visual Math" },
  { id: "category_sort", name: "Category Sort", icon: "🗑️", color: T.green, desc: "Sahi dabbe me dalo" },
  { id: "math_balance", name: "Balance Eq", icon: "⚖️", color: T.cyan, desc: "Dono side barabar karo" },
  { id: "word_builder", name: "Word Builder", icon: "🏗️", color: T.orange, desc: "Aksar jod ke shabd banao" },
  { id: "color_match", name: "Color Match", icon: "🎨", color: T.pink, desc: "Sahi rang chuno" },
  { id: "timeline", name: "Timeline", icon: "⏳", color: T.purple, desc: "Pehle kya hua?" },
  { id: "balloon_pop", name: "Balloon Pop", icon: "🎈", color: T.cyan, desc: "Sahi gubbara phodo" },
  { id: "sentence_jumble", name: "Sentence Jumble", icon: "🧩", color: T.green, desc: "Vakya theek karo" },
  { id: "pattern_complete", name: "Pattern Match", icon: "🔄", color: T.orange, desc: "Agla kya aayega?" },
  { id: "swipe_tf", name: "Swipe T/F", icon: "👈", color: T.purple, desc: "Sahi ko right swipe" },
  { id: "typing_speed", name: "Fast Typing", icon: "⌨️", color: T.pink, desc: "Jaldi type karo" },
  { id: "shadow_match", name: "Shadow Match", icon: "👤", color: T.cyan, desc: "Parchhai pehchano" },
  { id: "math_runner", name: "Math Runner", icon: "🏃", color: T.green, desc: "Daudte huye solve karo" },
  { id: "missing_vowel", name: "Missing Vowel", icon: "🅰️", color: T.orange, desc: "Maatra dhoondo" },
  { id: "code_breaker", name: "Code Breaker", icon: "🕵️", color: T.purple, desc: "Secret code solve karo" },
  { id: "spot_mistake", name: "Spot Mistake", icon: "🔎", color: T.pink, desc: "Galti pakdo" },
  { id: "word_search", name: "Word Search", icon: "🔡", color: T.cyan, desc: "Grid me dhoondo" },
  { id: "fractions_pie", name: "Pizza Math", icon: "🍕", color: T.orange, desc: "Fraction samjho" },
  { id: "map_explorer", name: "Map Explorer", icon: "🗺️", color: T.green, desc: "Jagah pehchano" },
  { id: "clock_master", name: "Clock Master", icon: "⏰", color: T.purple, desc: "Time batao" },
  { id: "rhyming_words", name: "Rhyming Words", icon: "🎵", color: T.pink, desc: "Milte julte shabd" },
  { id: "spelling_bee", name: "Spelling Bee", icon: "🐝", color: T.yellow, desc: "Sahi spelling" },
  { id: "grammar_sort", name: "Grammar Sort", icon: "🗂️", color: T.cyan, desc: "Noun ya Verb?" },
  { id: "shape_builder", name: "Shape Builder", icon: "📐", color: T.orange, desc: "Geometry maze" },
  { id: "money_math", name: "Money Math", icon: "🪙", color: T.green, desc: "Paise gino" },
  { id: "emotion_reader", name: "EQ Reader", icon: "😊", color: T.purple, desc: "Feeling pehchano" },
  { id: "simon_says", name: "Simon Says", icon: "🔴", color: T.pink, desc: "Pattern yaad rakho" },
  { id: "word_snake", name: "Word Snake", icon: "🐍", color: T.green, desc: "Shabd jodo" },
  { id: "number_line", name: "Number Line", icon: "📏", color: T.cyan, desc: "Sahi jagah rakho" },
  { id: "catch_falling", name: "Catch Drop", icon: "📥", color: T.yellow, desc: "Sahi answer pakdo" },
  { id: "logical_reasoning", name: "Logic Puzzle", icon: "🤔", color: T.purple, desc: "Dimaag lagao" },
  { id: "direction_maze", name: "Maze Path", icon: "⬆️", color: T.orange, desc: "Rasta dhoondo" },
  { id: "pic_word_match", name: "Pic-Word", icon: "🖼️", color: T.green, desc: "Photo se shabd" },
  { id: "syllable_counter", name: "Syllables", icon: "🗣️", color: T.cyan, desc: "Awaaz gino" },
  { id: "fraction_slider", name: "Fraction Slide", icon: "🎚️", color: T.pink, desc: "Slider set karo" },
  { id: "truth_lie_detector", name: "Truth or Lie", icon: "🤥", color: T.purple, desc: "Jhooth pakdo" },
  // NEW FOUNDATIONAL GAMES (Seekho)
  { id: "tech_basics", name: "Tech Basics", icon: "💻", color: T.cyan, desc: "HTML, CSS, JS Sikho" },
  { id: "num_spell", name: "Number Spelling", icon: "🔢", color: T.pink, desc: "1 to 100 Bolna/Likhna" },
  { id: "math_ops", name: "Math Master", icon: "➕", color: T.green, desc: "Jod, Ghataw, Guda, Bhag" },
  { id: "tables", name: "Pahada (Tables)", icon: "✖️", color: T.orange, desc: "1 se 100 tak Pahada" },
  { id: "alphabet", name: "A B C D", icon: "🔤", color: T.purple, desc: "English Alphabets bolna" },
  { id: "hindi_varnamala", name: "Hindi Varnamala", icon: "अ", color: T.yellow, desc: "Swar aur Vyanjan" },
  { id: "hin_eng_trans", name: "Hindi ➔ English", icon: "🔄", color: T.cyan, desc: "Anuvad (Translation)" },
  { id: "code_to_learn", name: "Code & Learn", icon: "👨‍💻", color: "#3b82f6", desc: "Code likh ke Padhai!" }
];

// ==========================================
// INDIVIDUAL GAME COMPONENTS (WORKABLE)
// ==========================================

function ClassicQuizGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  const check = (isCorrect) => {
    setAns(isCorrect ? "correct" : "wrong");
    if (isCorrect) setTimeout(onComplete, 2000);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Duniya ka sabse bada janwar kaunsa hai?</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button onClick={() => check(false)} style={btnStyle(T.card2)}>🐘 Hathi</button>
        <button onClick={() => check(true)} style={{ ...btnStyle(T.card2), border: ans === "correct" ? `2px solid ${T.green}` : "none" }}>🐋 Blue Whale</button>
        <button onClick={() => check(false)} style={btnStyle(T.card2)}>🦒 Giraffe</button>
        <button onClick={() => check(false)} style={btnStyle(T.card2)}>🦈 Shark</button>
      </div>
      {ans === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, animation: "pop .3s" }}>🎉 Sahi Jawab!</div>}
      {ans === "wrong" && <div style={{ color: T.red, marginTop: 20, fontWeight: 800, animation: "pop .3s" }}>❌ Galat, phir se socho!</div>}
    </div>
  );
}

function TrueFalseGame({ onComplete }) {
  const [status, setStatus] = useState(null); 
  const handleAnswer = (ans) => {
    setStatus(ans === true ? "correct" : "wrong");
    if (ans === true) setTimeout(onComplete, 3000); // 3 seconds delay
  };

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>💧</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 30 }}>Paani ka chemical formula H2O hai.</h2>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button onClick={() => handleAnswer(true)} style={btnStyle(T.green)}>✅ True (Sahi)</button>
        <button onClick={() => handleAnswer(false)} style={btnStyle(T.red)}>❌ False (Galat)</button>
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Ekdum Sahi! Awesome!</div>}
      {status === "wrong" && <div style={{ color: T.red, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>😅 Oops! Galat ho gaya.</div>}
    </div>
  );
}

function MatchPairsGame({ onComplete }) {
  const pairs = [ { a: "Apple", b: "🍎" }, { a: "Dog", b: "🐶" }, { a: "Car", b: "🚗" } ];
  const [selectedA, setSelectedA] = useState(null);
  const [matched, setMatched] = useState([]);

  const handleSelectA = (item) => setSelectedA(item);
  const handleSelectB = (item) => {
    if (!selectedA) return;
    const isMatch = pairs.find(p => p.a === selectedA && p.b === item);
    if (isMatch) {
      setMatched([...matched, selectedA]);
      if (matched.length + 1 === pairs.length) setTimeout(onComplete, 3000);
    }
    setSelectedA(null);
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, textAlign: "center", marginBottom: 5 }}>Sahi Jode Banao 🔗</h2>
      <p style={{ textAlign: "center", color: T.muted, fontSize: 12, marginBottom: 20 }}>(Ek naam aur ek photo ko TAP karke match karo)</p>
      
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {["Car", "Apple", "Dog"].map(item => (
            <button key={item} onClick={() => handleSelectA(item)} disabled={matched.includes(item)}
              style={{ ...btnStyle(T.card2), border: `2px solid ${selectedA === item ? T.cyan : matched.includes(item) ? T.green : T.border}`, opacity: matched.includes(item) ? 0.5 : 1 }}>
              {item}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {["🐶", "🚗", "🍎"].map(item => {
            const isMatchedB = matched.includes(pairs.find(p => p.b === item)?.a);
            return (
              <button key={item} onClick={() => handleSelectB(item)} disabled={isMatchedB}
                style={{ ...btnStyle(T.card2), border: `2px solid ${isMatchedB ? T.green : T.border}`, opacity: isMatchedB ? 0.5 : 1 }}>
                {item}
              </button>
            );
          })}
        </div>
      </div>
      {matched.length === pairs.length && <div style={{ color: T.green, textAlign: "center", marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 All Matched! Superb!</div>}
    </div>
  );
}

// ASLI DRAG AND DROP GAME
function DragDropGame({ onComplete }) {
  const [dropped, setDropped] = useState(false);

  const allowDrop = (e) => e.preventDefault();
  const drag = (e) => e.dataTransfer.setData("item", "apple");
  const drop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.getData("item") === "apple") {
      setDropped(true);
      setTimeout(onComplete, 3000); // Wait 3 seconds
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Apple ko Tokri me dalo! 🖐️</h2>
      <div style={{ color: T.muted, marginBottom: 20 }}>(🍎 ko ungli se dabakar kheecho aur 🧺 me chhodo)</div>
      
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 30, alignItems: "center" }}>
        {!dropped ? (
          <div draggable onDragStart={drag} style={{ fontSize: 64, cursor: "grab", animation: "float2 2s infinite" }}>🍎</div>
        ) : <div style={{ width: 64 }}></div>}

        <div onDrop={drop} onDragOver={allowDrop} style={{ width: 120, height: 120, border: `3px dashed ${dropped ? T.green : T.cyan}`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, background: dropped ? T.green+"22" : T.card2, transition: "all 0.3s" }}>
          {dropped ? "🍎" : "🧺"}
        </div>
      </div>
      {dropped && <div style={{ color: T.green, marginTop: 30, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Bohat badhiya! Sahi jagah rakha!</div>}
    </div>
  );
}

function WordBuilderGame({ onComplete }) {
  const [word, setWord] = useState("");
  const target = "AI";
  
  const addLetter = (l) => {
    const newWord = word + l;
    setWord(newWord);
    if (newWord === target) {
      setTimeout(onComplete, 3000);
    } else if (newWord.length >= target.length) {
      alert("Galat word! Wapas try karo.");
      setWord("");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Aksar Jod Ke Shabd Banao 🏗️</h2>
      <div style={{ color: T.muted, marginBottom: 20 }}>Hint: Hamara naya smart robot dost kaun hai?</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: T.cyan, letterSpacing: 10, marginBottom: 30, minHeight: 40 }}>
        {word || "_ _"}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {["I", "B", "A", "M"].map(l => (
          <button key={l} onClick={() => addLetter(l)} style={btnStyle(T.card2)}>{l}</button>
        ))}
      </div>
      {word === target && <div style={{ color: T.green, marginTop: 30, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Shabaash! Sahi jawab!</div>}
    </div>
  );
}

function SequenceGame({ onComplete }) {
  const [items, setItems] = useState(["Bada hona", "Beej (Seed)", "Phool aana", "Poda banna"]);
  const correctSeq = ["Beej (Seed)", "Poda banna", "Bada hona", "Phool aana"];
  const [status, setStatus] = useState(null);
  
  const moveUp = (idx) => {
    if (idx === 0) return;
    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    setItems(newItems);
  };

  const check = () => {
    if (items.join() === correctSeq.join()) {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else alert("Abhi theek nahi hai, dhyan se socho! 🌱");
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>Paudha kaise banta hai? (Sahi kram me lagao)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {items.map((item, i) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card2, padding: 12, borderRadius: 12, border: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 800, color: T.muted, width: 20 }}>{i + 1}.</div>
            <div style={{ flex: 1, fontWeight: 700 }}>{item}</div>
            <button onClick={() => moveUp(i)} style={{ background: T.border, border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>⬆️</button>
          </div>
        ))}
      </div>
      {status !== "correct" ? (
        <button onClick={check} style={{ ...btnStyle(T.green), width: "100%" }}>Check Karo! ✨</button>
      ) : (
        <div style={{ color: T.green, textAlign: "center", fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Perfect Sequence!</div>
      )}
    </div>
  );
}

function FlashcardGame({ onComplete }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Card pe tap karo answer dekhne ke liye!</h2>
      <div 
        onClick={() => setFlipped(!flipped)}
        style={{ background: flipped ? T.cyan : T.card2, color: flipped ? "#000" : "#fff", height: 200, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 20, fontSize: 24, fontWeight: 800, cursor: "pointer", transition: "all 0.3s", border: `2px solid ${T.cyan}` }}
      >
        {flipped ? "New Delhi 🏛️" : "India ki capital kya hai?"}
      </div>
      {flipped && <button onClick={() => { setFlipped(false); setTimeout(onComplete, 1000); }} style={{ ...btnStyle(T.orange), width: "100%", marginTop: 20 }}>Mujhe Yaad Ho Gaya! ✅</button>}
    </div>
  );
}

function UnscrambleGame({ onComplete }) {
  const word = "GRAVITY";
  const scrambled = "V I T R Y G A".split(" ");
  const [ans, setAns] = useState([]);
  const [letters, setLetters] = useState(scrambled);

  const pickLetter = (l, i) => {
    setAns([...ans, l]);
    const newL = [...letters];
    newL.splice(i, 1);
    setLetters(newL);
  };

  useEffect(() => {
    if (letters.length === 0) {
      if (ans.join("") === word) setTimeout(onComplete, 3000);
      else {
        alert("Galat ban gaya, wapas try karo!");
        setAns([]);
        setLetters(scrambled);
      }
    }
  }, [letters]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Shabd ko theek karo! 🔀</h2>
      <div style={{ color: T.muted, marginBottom: 10 }}>Hint: Newton ke apple girne ka reason 🍎</div>
      
      <div style={{ height: 60, borderBottom: `2px solid ${T.border}`, marginBottom: 20, display: "flex", gap: 10, justifyContent: "center", alignItems: "flex-end", paddingBottom: 10 }}>
        {ans.map((a, i) => <div key={i} style={{ fontSize: 24, fontWeight: 800, color: T.cyan }}>{a}</div>)}
      </div>
      
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {letters.map((l, i) => (
          <button key={i} onClick={() => pickLetter(l, i)} style={{ width: 50, height: 50, background: T.card2, border: `2px solid ${T.border}`, borderRadius: 12, fontSize: 20, fontWeight: 800, color: "#fff", cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>
      {ans.join("") === word && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Perfect! Sahi jawaab!</div>}
    </div>
  );
}

function OddOneOutGame({ onComplete }) {
  const items = [
    { name: "Apple", icon: "🍎", isOdd: false },
    { name: "Banana", icon: "🍌", isOdd: false },
    { name: "Car", icon: "🚗", isOdd: true }, // The odd one
    { name: "Grapes", icon: "🍇", isOdd: false }
  ];
  const [status, setStatus] = useState(null);

  const check = (isOdd) => {
    if (isOdd) {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else {
      setStatus("wrong");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Sabse alag kaunsa hai? 🕵️</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => check(item.isOdd)} style={{ background: T.card2, border: `2px solid ${T.border}`, borderRadius: 16, padding: "20px 10px", cursor: "pointer", transition: "transform .2s" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontWeight: 800 }}>{item.name}</div>
          </div>
        ))}
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi pakda! Car fruit nahi hai.</div>}
      {status === "wrong" && <div style={{ color: T.red, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>😅 Oops! Galat hai.</div>}
    </div>
  );
}

function FillBlanksGame({ onComplete }) {
  const [ans, setAns] = useState("");
  const [status, setStatus] = useState(null);
  
  const check = () => {
    if (ans.toLowerCase() === "oxygen") {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else {
      alert("Galat jawab! Hint: O se shuru hota hai.");
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Khaali Jagah Bharo 🕳️</h2>
      <div style={{ fontSize: 20, lineHeight: 1.8, marginBottom: 30 }}>
        Insaan saans lene ke liye <br/>
        <input 
          value={ans} 
          onChange={e => setAns(e.target.value)}
          style={{ background: "transparent", border: "none", borderBottom: `2px dashed ${T.cyan}`, color: T.cyan, fontSize: 20, fontWeight: 800, width: 120, textAlign: "center", outline: "none", margin: "0 10px" }}
          placeholder="_____"
        /> gas ka use karte hain.
      </div>
      {status !== "correct" ? (
        <button onClick={check} style={{ ...btnStyle(T.green), width: "100%" }}>Submit 🚀</button>
      ) : (
        <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Great Job! O2 is Oxygen!</div>
      )}
    </div>
  );
}

function StoryChoiceGame({ onComplete }) {
  const [step, setStep] = useState(0);
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: T.purple }}>Kahani ka Rasta Chuno 📖</h2>
      {step === 0 && (
        <div style={{ animation: "slideIn .3s" }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>Ramu jungle me ja raha tha, achanak use ek sher dikha! Ramu ko kya karna chahiye?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => setStep(1)} style={btnStyle(T.card2)}>A. Ped par chadh jaye 🌳</button>
            <button onClick={() => alert("Sher tez daudta hai! Galat choice 😅")} style={btnStyle(T.card2)}>B. Sher se tez bhaage 🏃</button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div style={{ animation: "slideIn .3s" }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>Sahi! Sher ped pe nahi chadh sakta. Ab ped pe Ramu ko bhook lagi, waha 2 phal hain:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => alert("Ye poisonous berry thi! 🤢")} style={btnStyle(T.card2)}>A. Laal chamakta anjaan phal 🍒</button>
            <button onClick={() => { setStep(2); setTimeout(onComplete, 3000); }} style={btnStyle(T.card2)}>B. Normal Aam (Mango) 🥭</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ textAlign: "center", color: T.green, animation: "pop .5s" }}>
          <div style={{ fontSize: 64, marginBottom: 10 }}>🏆</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Sahi Choice! Ramu safe hai!</div>
        </div>
      )}
    </div>
  );
}

function ImageGuessGame({ onComplete }) {
  const [ans, setAns] = useState("");
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Emoji se shabd pehchano 🤔</h2>
      <div style={{ fontSize: 64, letterSpacing: 20, margin: "30px 0" }}>🌧️🏹</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        <button onClick={() => setAns("Wrong")} style={{ ...btnStyle(T.card2), border: `2px solid ${T.border}` }}>Rain Arrow</button>
        <button onClick={() => { setAns("Rainbow"); setTimeout(onComplete, 3000); }} style={{ ...btnStyle(T.card2), border: ans === "Rainbow" ? `2px solid ${T.green}` : `2px solid ${T.border}` }}>Rainbow</button>
        <button onClick={() => setAns("Wrong")} style={btnStyle(T.card2)}>Water</button>
      </div>
      {ans === "Rainbow" && <div style={{ color: T.green, fontWeight: 800, fontSize: 18 }}>✅ Sahi! Barish (Rain) + Dhanush (Bow) = Rainbow 🌈</div>}
      {ans === "Wrong" && <div style={{ color: T.red, fontWeight: 800, fontSize: 16 }}>❌ Galat hai, wapas try karo!</div>}
    </div>
  );
}

function MemoryCardsGame({ onComplete }) {
  const EMOJIS = ['🚀', '🌍', '🦁', '🍕', '🎸', '🎨']; 
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
  }, []);

  const handleFlip = (index) => {
    if (disabled || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setDisabled(false);
        if (matched.length + 2 === cards.length) {
          setTimeout(onComplete, 2500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Yaadash Test 🧠</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 280, margin: "0 auto", perspective: "1000px" }}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <div key={card.id} onClick={() => handleFlip(i)} style={{ height: 80, position: "relative", cursor: "pointer", transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)", transition: "transform 0.4s ease-in-out" }}>
              {/* Front Side (Hidden) */}
              <div style={{ position: "absolute", width: "100%", height: "100%", background: T.card2, border: `2px solid ${T.cyan}`, borderRadius: 12, backfaceVisibility: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 24 }}>❓</div>
              </div>
              {/* Back Side (Emoji) */}
              <div style={{ position: "absolute", width: "100%", height: "100%", background: T.card2, border: `2px solid ${matched.includes(i) ? T.green : T.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                {card.emoji}
              </div>
            </div>
          );
        })}
      </div>
      {matched.length === cards.length && cards.length > 0 && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, animation: "pop .3s" }}>🎉 Sab Match Ho Gaye!</div>}
    </div>
  );
}

function QuickTapGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (score > 5) setTimeout(onComplete, 2000);
      else alert("Time Up! 5 se zyada score chahiye tha. Wapas try karo!");
    }
  }, [timeLeft, score]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.orange }}>Time: {timeLeft}s</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.cyan }}>Score: {score}</div>
      </div>
      {timeLeft > 0 ? (
        <button 
          onClick={() => setScore(score + 1)}
          style={{ width: 150, height: 150, borderRadius: "50%", background: `linear-gradient(135deg, ${T.purple}, ${T.pink})`, border: "none", color: "#fff", fontSize: 24, fontWeight: 800, cursor: "pointer", animation: "pulse 1s infinite" }}
        >
          TAP ME! ⚡
        </button>
      ) : (
        <div style={{ fontSize: 24, fontWeight: 800, color: score > 5 ? T.green : T.red }}>
          {score > 5 ? "🎉 You Won! Awesome Speed!" : "Game Over! Score: " + score}
        </div>
      )}
    </div>
  );
}

function CategorySortGame({ onComplete }) {
  const [items, setItems] = useState([
    { id: 1, name: "Apple", icon: "🍎", cat: "fruit" },
    { id: 2, name: "Carrot", icon: "🥕", cat: "veg" },
    { id: 3, name: "Banana", icon: "🍌", cat: "fruit" }
  ]);
  const [score, setScore] = useState(0);

  const sortItem = (item, selectedCat) => {
    if (item.cat === selectedCat) {
      setScore(score + 1);
      setItems(items.filter(i => i.id !== item.id));
      if (items.length === 1) setTimeout(onComplete, 3000);
    } else {
      alert("Oops! Galat dabba 😅");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Sahi Dabbe me dalo! 🗑️</h2>
      {items.length > 0 ? (
        <div style={{ animation: "pop 0.3s" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>{items[0].icon}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => sortItem(items[0], "fruit")} style={btnStyle(T.orange)}>Fruits 🍎</button>
            <button onClick={() => sortItem(items[0], "veg")} style={btnStyle(T.green)}>Veggies 🥦</button>
          </div>
        </div>
      ) : (
        <div style={{ color: T.green, fontSize: 24, fontWeight: 800, animation: "pop .3s" }}>🎉 Sab Sort Ho Gaya!</div>
      )}
    </div>
  );
}

function MathBalanceGame({ onComplete }) {
  const [val, setVal] = useState("");
  const [status, setStatus] = useState(null);
  
  const check = () => {
    if (parseInt(val) === 5) {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else alert("Balance nahi hua! Socho 5 + ? = 10");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Dono side barabar karo ⚖️</h2>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontSize: 32, fontWeight: 800, marginBottom: 30 }}>
        <div style={{ background: T.card2, padding: "10px 20px", borderRadius: 12 }}>5 + <input type="number" value={val} onChange={(e)=>setVal(e.target.value)} style={{ width: 50, background: "transparent", border: "none", borderBottom: `3px solid ${T.cyan}`, color: T.cyan, fontSize: 32, fontWeight: 800, textAlign: "center", outline: "none" }}/></div>
        <div style={{ color: T.orange }}>=</div>
        <div style={{ background: T.card2, padding: "10px 20px", borderRadius: 12 }}>10</div>
      </div>
      {status !== "correct" ? (
        <button onClick={check} style={{ ...btnStyle(T.cyan), width: "100%" }}>Check Balance</button>
      ) : (
        <div style={{ color: T.green, fontSize: 18, fontWeight: 800, animation: "pop .3s" }}>🎉 Ekdum balanced! Maza aagaya!</div>
      )}
    </div>
  );
}

function AnimMathGame({ onComplete }) {
  const [ans, setAns] = useState("");
  const check = () => {
    if (ans === "5") setTimeout(onComplete, 2000);
    else alert("Gino dhyan se!");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Visual Math 🍎</h2>
      <div style={{ fontSize: 40, marginBottom: 20 }}>🍎🍎 + 🍎🍎🍎 = ?</div>
      <input type="number" value={ans} onChange={(e) => setAns(e.target.value)} style={{ fontSize: 24, padding: 10, width: 80, textAlign: "center", borderRadius: 10, border: `2px solid ${T.cyan}`, background: T.bg, color: T.text, marginBottom: 20 }} />
      <br/>
      {ans === "5" ? <div style={{ color: T.green, fontWeight: 800 }}>🎉 Sahi! 5 Apples!</div> : <button onClick={check} style={btnStyle(T.green)}>Check</button>}
    </div>
  );
}

function ColorMatchGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Sahi Rang Chuno 🎨</h2>
      <p style={{ color: T.muted, marginBottom: 10 }}>Text ka color kya hai?</p>
      <div style={{ fontSize: 48, fontWeight: 900, color: T.green, marginBottom: 30 }}>RED</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => setAns("wrong")} style={btnStyle(T.red)}>Red</button>
        <button onClick={() => { setAns("correct"); setTimeout(onComplete, 2000); }} style={btnStyle(T.green)}>Green</button>
      </div>
      {ans === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800 }}>🎉 Sahi! Word Red hai par color Green hai!</div>}
    </div>
  );
}

function TimelineGame({ onComplete }) {
  const [step, setStep] = useState(0);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Pehle kya hua? ⏳</h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30, position: "relative" }}>
        <div style={{ position: "absolute", top: 20, left: 0, right: 0, height: 4, background: T.border, zIndex: 0 }} />
        {["Uthna", "School Jana", "Khelna"].map((s, i) => (
          <div key={i} onClick={() => { if(step === i) { setStep(step+1); if(i===2) setTimeout(onComplete, 2000); } }} style={{ position: "relative", zIndex: 1, background: step > i ? T.green : T.card2, padding: "10px", borderRadius: "50%", border: `2px solid ${step > i ? T.green : T.cyan}`, cursor: "pointer", transition: "all 0.3s" }}>
            {s}
          </div>
        ))}
      </div>
      {step > 2 && <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Timeline Complete! Badhiya!</div>}
    </div>
  );
}

function WordHuntGame({ onComplete }) {
  const [found, setFound] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>'CAT' dhoondo 🔍</h2>
      <div style={{ letterSpacing: 10, fontSize: 24, background: T.card2, padding: 20, borderRadius: 12, wordWrap: "break-word" }}>
        X K P L M <span onClick={() => { setFound(true); setTimeout(onComplete, 2000); }} style={{ color: found ? T.green : T.text, cursor: "pointer", fontWeight: found ? 900 : 400 }}>C A T</span> R T Y Q
      </div>
      {found && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Mil gaya! Shabaash!</div>}
    </div>
  );
}

function BalloonPopGame({ onComplete }) {
  const [popped, setPop] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Sahi Gubbara Phodo! 🎈 (2+2=?)</h2>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 40 }}>
        <div onClick={() => alert("Galat!")} style={{ fontSize: 40, cursor: "pointer", animation: "float2 3s infinite" }}>🎈<br/>5</div>
        <div onClick={() => { setPop(true); setTimeout(onComplete, 2000); }} style={{ fontSize: 40, cursor: "pointer", animation: "float2 2s infinite" }}>{popped ? "💥" : "🎈"}<br/>{popped ? "" : "4"}</div>
      </div>
      {popped && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 POP! Sahi Jawab!</div>}
    </div>
  );
}

function SentenceJumbleGame({ onComplete }) {
  const [sentence, setSentence] = useState([]);
  const words = ["Is", "Name", "My", "Arjun"];
  const correct = "My Name Is Arjun";
  
  const addWord = (w) => {
    const newS = [...sentence, w];
    setSentence(newS);
    if (newS.join(" ") === correct) setTimeout(onComplete, 2000);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Vakya theek karo 🧩</h2>
      <div style={{ minHeight: 40, padding: 10, background: T.card2, borderRadius: 10, marginBottom: 20, color: T.cyan, fontWeight: 800 }}>
        {sentence.join(" ")}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {words.filter(w => !sentence.includes(w)).map(w => (
          <button key={w} onClick={() => addWord(w)} style={btnStyle(T.border)}>{w}</button>
        ))}
      </div>
      {sentence.join(" ") === correct && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Sentence!</div>}
    </div>
  );
}

function PatternCompleteGame({ onComplete }) {
  const [ans, setAns] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Agla kya aayega? 🔄</h2>
      <div style={{ fontSize: 40, marginBottom: 20 }}>🔴 🔵 🔴 🔵 🔴 ?</div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <button onClick={() => alert("Galat!")} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>🔴</button>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 2000); }} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>🔵</button>
      </div>
      {ans && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Pattern Complete!</div>}
    </div>
  );
}

function SwipeTrueFalseGame({ onComplete }) {
  const [swipe, setSwipe] = useState(null);
  const [status, setStatus] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Sun East se nikalta hai ☀️</h2>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.card2, padding: 20, borderRadius: 16 }}>
        <button onClick={() => alert("Galat!")} style={btnStyle(T.red)}>👈 False</button>
        <div style={{ fontSize: 40, transform: swipe === 'right' ? 'translateX(50px)' : 'none', transition: 'all 0.3s' }}>{swipe ? "✨" : "☀️"}</div>
        <button onClick={() => { setSwipe('right'); setStatus('correct'); setTimeout(onComplete, 3000); }} style={btnStyle(T.green)}>True 👉</button>
      </div>
      {status === 'correct' && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Ekdum Sahi Jawab!</div>}
    </div>
  );
}

function TypingSpeedGame({ onComplete }) {
  const [text, setText] = useState("");
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Jaldi Type Karo! ⌨️</h2>
      <div style={{ fontSize: 32, fontWeight: 900, color: T.orange, letterSpacing: 5, marginBottom: 20 }}>ELEPHANT</div>
      <input value={text} onChange={(e) => { setText(e.target.value); if(e.target.value.toUpperCase() === "ELEPHANT") setTimeout(onComplete, 1500); }} style={{ fontSize: 24, padding: 10, textAlign: "center", borderRadius: 10, textTransform: "uppercase" }} placeholder="Type here..." />
      {text.toUpperCase() === "ELEPHANT" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 So Fast!</div>}
    </div>
  );
}

function ShadowMatchGame({ onComplete }) {
  const [match, setMatch] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Parchhai Pehchano 👤</h2>
      <div style={{ fontSize: 64, filter: "brightness(0)", marginBottom: 20 }}>🐶</div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <button onClick={() => alert("Nahi!")} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>🐱</button>
        <button onClick={() => { setMatch(true); setTimeout(onComplete, 2000); }} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>🐶</button>
      </div>
      {match && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Perfect Match!</div>}
    </div>
  );
}

function MathRunnerGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState(null);
  const qs = [{q:"2 + 2", a:4}, {q:"5 - 3", a:2}, {q:"3 x 3", a:9}];
  
  const check = (ans) => {
    if(ans === qs[step].a) {
      if(step === qs.length - 1) {
        setStatus("correct");
        setTimeout(onComplete, 3000);
      } else setStep(step + 1);
    } else alert("Oops! Galat. Wapas try karo.");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Daudte huye solve karo! 🏃</h2>
      <div style={{ position: "relative", height: 60, background: T.border, borderRadius: 30, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: `${(step / qs.length) * 100}%`, top: 5, fontSize: 32, transition: "left 0.5s ease" }}>🏃</div>
      </div>
      {status !== "correct" ? (
        <div style={{ animation: "pop .3s" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: T.cyan, marginBottom: 20 }}>{qs[step].q} = ?</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[2, 4, 9, 7].map(n => <button key={n} onClick={() => check(n)} style={btnStyle(T.card2)}>{n}</button>)}
          </div>
        </div>
      ) : (
        <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Race Complete! Shabaash!</div>
      )}
    </div>
  );
}

function MissingVowelGame({ onComplete }) {
  const [ans, setAns] = useState("");
  const check = (v) => {
    if(v === "A") { setAns("A"); setTimeout(onComplete, 3000); }
    else alert("Galat vowel!");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Maatra (Vowel) Dhoondo 🅰️</h2>
      <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: 10, marginBottom: 30 }}>
        P {ans ? <span style={{color: T.green}}>{ans}</span> : "_"} P E R
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {["A","E","I","O","U"].map(v => <button key={v} onClick={() => check(v)} style={btnStyle(T.card2)}>{v}</button>)}
      </div>
      {ans === "A" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Jawab! PAPER 📝</div>}
    </div>
  );
}

function CodeBreakerGame({ onComplete }) {
  const [ans, setAns] = useState("");
  const check = () => {
    if(ans.toUpperCase() === "CAT") { setTimeout(onComplete, 3000); }
    else alert("Secret code match nahi hua!");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Secret Code Solve Karo 🕵️</h2>
      <div style={{ background: T.card2, padding: 12, borderRadius: 12, marginBottom: 20, fontSize: 12, color: T.muted }}>
        💡 <strong>Hint:</strong> English letters ki position socho!<br/>
        A = 1, B = 2, C = 3, D = 4 ... Z = 26<br/>
        Toh 3 = C, 1 = A, 20 = T
      </div>
      <div style={{ fontSize: 32, fontWeight: 900, color: T.cyan, letterSpacing: 5, marginBottom: 20 }}>3 - 1 - 20</div>
      <input value={ans} onChange={e => setAns(e.target.value)} placeholder="Type word..." style={{ fontSize: 20, padding: 10, textAlign: "center", borderRadius: 10, textTransform: "uppercase", marginBottom: 20 }} />
      {ans.toUpperCase() === "CAT" ? <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Code Cracked! It's CAT 🐱</div> : <div><button onClick={check} style={btnStyle(T.purple)}>Crack Code!</button></div>}
    </div>
  );
}

function SpotMistakeGame({ onComplete }) {
  const [status, setStatus] = useState(null);
  const check = (isWrongWord) => {
    if(isWrongWord) { setStatus("correct"); setTimeout(onComplete, 3000); }
    else alert("Ye word theek hai. Galti kahan hai dhoondo!");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Galti Pakdo! 🔎</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>Neeche diye sentence mein jo word galat hai us par tap karo:</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 30 }}>
        <button onClick={() => check(false)} style={btnStyle(T.card2)}>The</button>
        <button onClick={() => check(false)} style={btnStyle(T.card2)}>cow</button>
        <button onClick={() => check(true)} style={{ ...btnStyle(T.card2), border: status === "correct" ? `2px solid ${T.green}` : "none" }}>barked</button>
        <button onClick={() => check(false)} style={btnStyle(T.card2)}>loudly.</button>
      </div>
      {status === "correct" && <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Pakda! Cow "moo" karti hai, "bark" nahi!</div>}
    </div>
  );
}

function WordSearchGame({ onComplete }) {
  const [found, setFound] = useState([]);
  const grid = ["M","A","T","H","X","Z","A","P","P","L","E","B","C","A","T","Y"];
  
  const clickLetter = (l) => {
    if (l === "C" || l === "A" || l === "T") {
      const newF = [...found, l];
      setFound(newF);
      if (newF.length >= 3) setTimeout(onComplete, 3000);
    } else alert("Ye letter shabd mein nahi hai!");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>'CAT' Dhoondo Grid Mein 🔡</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20, background: T.card2, padding: 16, borderRadius: 16 }}>
        {grid.map((l, i) => (
          <button key={i} onClick={() => clickLetter(l)} style={{ fontSize: 24, fontWeight: 800, background: found.includes(l) ? T.green : T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10, color: found.includes(l) ? "#fff" : T.text }}>
            {l}
          </button>
        ))}
      </div>
      {found.length >= 3 && <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sabd Mil Gaya!</div>}
    </div>
  );
}

function FractionsPieGame({ onComplete }) {
  const [slices, setSlices] = useState([false, false, false, false]);
  const clickSlice = (i) => {
    const newS = [...slices];
    newS[i] = !newS[i];
    setSlices(newS);
    if (newS.filter(s => s).length === 2) setTimeout(onComplete, 3000);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Pizza Math 🍕</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>2/4 (Aadha Pizza) select karo!</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, width: 150, height: 150, margin: "0 auto", borderRadius: "50%", overflow: "hidden", border: `4px solid ${T.orange}` }}>
        {slices.map((s, i) => (
          <div key={i} onClick={() => clickSlice(i)} style={{ background: s ? T.orange : T.card2, border: `1px solid ${T.border}`, cursor: "pointer" }} />
        ))}
      </div>
      {slices.filter(s => s).length === 2 && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 2/4 = 1/2 ! Sahi Jawab!</div>}
    </div>
  );
}

function MapExplorerGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Map Explorer 🗺️</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>India ki Rajdhani (Capital) kidhar hai?</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={btnStyle(T.card2)}>⬆️ North (New Delhi)</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>⬇️ South (Chennai)</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>⬅️ West (Mumbai)</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>➡️ East (Kolkata)</button>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Ekdum Sahi! New Delhi!</div>}
      {ans === false && <div style={{ color: T.red, marginTop: 20, fontWeight: 800, fontSize: 16 }}>❌ Galat disha!</div>}
    </div>
  );
}

function ClockMasterGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Time Batao ⏰</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Sawa teen (3:15) kis ghadi mein baj rahe hain?</p>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <div onClick={() => setAns(false)} style={{ fontSize: 48, cursor: "pointer" }}>🕒</div>
        <div onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={{ fontSize: 48, cursor: "pointer" }}>🕞</div>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Time!</div>}
    </div>
  );
}

function RhymingWordsGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Milte Julte Shabd 🎵</h2>
      <div style={{ fontSize: 32, fontWeight: 800, color: T.cyan, marginBottom: 20 }}>CAT 🐱</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>DOG</button>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={btnStyle(T.card2)}>BAT 🦇</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>CAR</button>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 CAT - BAT! Rhyme match!</div>}
    </div>
  );
}

function SpellingBeeGame({ onComplete }) {
  const [text, setText] = useState("");
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Spelling Bee 🐝</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Hint: Seb (Apple) ki spelling likho</p>
      <div style={{ fontSize: 40, marginBottom: 20 }}>🍎</div>
      <input value={text} onChange={(e) => { setText(e.target.value); if(e.target.value.toLowerCase() === "apple") setTimeout(onComplete, 2000); }} style={{ fontSize: 24, padding: 10, textAlign: "center", borderRadius: 10, textTransform: "uppercase" }} placeholder="A _ _ _ E" />
      {text.toLowerCase() === "apple" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Perfect Spelling!</div>}
    </div>
  );
}

function GrammarSortGame({ onComplete }) {
  const [items, setItems] = useState([{id:1, word:"Run"}, {id:2, word:"Jump"}]);
  const sortItem = () => {
    if(items.length === 1) setTimeout(onComplete, 3000);
    setItems(items.slice(1));
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Noun ya Verb? 🗂️</h2>
      {items.length > 0 ? (
        <div style={{ animation: "pop 0.3s" }}>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>{items[0].word}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={() => alert("Galat! Run koi cheez nahi hai.")} style={btnStyle(T.orange)}>Noun (Naam)</button>
            <button onClick={sortItem} style={btnStyle(T.cyan)}>Verb (Kaam)</button>
          </div>
        </div>
      ) : <div style={{ color: T.green, fontSize: 24, fontWeight: 800, animation: "pop .3s" }}>🎉 Grammar Master!</div>}
    </div>
  );
}

function ShapeBuilderGame({ onComplete }) {
  const [built, setBuilt] = useState(false);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Shape Builder 📐</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Ghar banane ke liye sahi chhat (roof) chuno:</p>
      <div style={{ width: 100, height: 100, background: T.orange, margin: "0 auto", position: "relative" }}>
        {built && <div style={{ width: 0, height: 0, borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: `50px solid ${T.cyan}`, position: "absolute", top: -50, left: 0 }} />}
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 30 }}>
        <div onClick={() => alert("Nahi, ye circle hai!")} style={{ width: 50, height: 50, borderRadius: "50%", background: T.card2, cursor: "pointer" }} />
        <div onClick={() => { setBuilt(true); setTimeout(onComplete, 3000); }} style={{ width: 0, height: 0, borderLeft: "25px solid transparent", borderRight: "25px solid transparent", borderBottom: `50px solid ${T.cyan}`, cursor: "pointer" }} />
      </div>
      {built && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Ghar ban gaya!</div>}
    </div>
  );
}

function MoneyMathGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Paise Gino 🪙</h2>
      <div style={{ fontSize: 32, marginBottom: 20 }}>₹20 + ₹10 = ?</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={btnStyle(T.card2)}>₹30</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>₹50</button>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Hisaab!</div>}
    </div>
  );
}

function EmotionReaderGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Feeling Pehchano 😊</h2>
      <div style={{ background: T.card2, padding: 16, borderRadius: 12, marginBottom: 20 }}>
        "Ramu ki favourite ice cream zameen par gir gayi."
      </div>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <button onClick={() => setAns(false)} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>😂</button>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>😭</button>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi pehchana, wo dukhi hoga.</div>}
    </div>
  );
}

function LogicalReasoningGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Logic Puzzle 🤔</h2>
      <div style={{ background: T.card2, padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 14 }}>
        A bada hai B se. B bada hai C se.<br/>Sabse lamba kaun hai?
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={btnStyle(T.card2)}>A</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>B</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>C</button>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Smart dimaag!</div>}
    </div>
  );
}

function TruthLieDetectorGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>2 Sach, 1 Jhooth 🤥</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Inme se jhooth (lie) pakdo:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>1. Earth gol hai 🌍</button>
        <button onClick={() => setAns(false)} style={btnStyle(T.card2)}>2. Sun garam hai ☀️</button>
        <button onClick={() => { setAns(true); setTimeout(onComplete, 3000); }} style={btnStyle(T.card2)}>3. Hathi udta hai 🐘</button>
      </div>
      {ans === true && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Jhooth pakda gaya!</div>}
    </div>
  );
}

function SimonSaysGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const pattern = ["🔴", "🔵", "🟡", "🔴"];
  const [status, setStatus] = useState(null);

  const clickColor = (color) => {
    if(color === pattern[step]) {
      if(step === pattern.length - 1) {
        setStatus("correct");
        setTimeout(onComplete, 3000);
      } else setStep(step + 1);
    } else {
      alert("Oops! Galat sequence. Wapas try karo.");
      setStep(0);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Pattern Yaad Rakho 🔴🔵🟡🔴</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Upar diye gaye pattern me colors dabao:</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {["🔴", "🔵", "🟡"].map(c => (
          <button key={c} onClick={() => clickColor(c)} style={{ fontSize: 40, background: "none", border: "none", cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Perfect Pattern!</div>}
    </div>
  );
}

function WordSnakeGame({ onComplete }) {
  const [status, setStatus] = useState(null);
  const check = (w) => {
    if(w === "TIGER") {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else alert("T se shuru hone wala shabd chuno!");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Word Snake 🐍</h2>
      <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>CA<span style={{ color: T.cyan }}>T</span> ➡️ <span style={{ color: T.orange }}>?</span></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => check("DOG")} style={btnStyle(T.card2)}>DOG</button>
        <button onClick={() => check("TIGER")} style={{ ...btnStyle(T.card2), border: status === "correct" ? `2px solid ${T.green}` : "none" }}>TIGER</button>
        <button onClick={() => check("LION")} style={btnStyle(T.card2)}>LION</button>
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Jawab! TIGER!</div>}
    </div>
  );
}

function NumberLineGame({ onComplete }) {
  const [val, setVal] = useState(0);
  const [status, setStatus] = useState(null);
  const check = () => {
    if(Math.abs(val - 75) < 5) {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else alert("Aur dhyan se set karo, 75 kahan aayega?");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Number Line 📏</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Slider ko 75 par set karo:</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontWeight: 800, color: T.cyan }}><span>0</span><span>50</span><span>100</span></div>
      <input type="range" min="0" max="100" value={val} onChange={e => setVal(e.target.value)} style={{ width: "100%", marginBottom: 20 }} />
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>{val}</div>
      {status !== "correct" ? <button onClick={check} style={btnStyle(T.cyan)}>Check Karo</button> : <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Perfect Position!</div>}
    </div>
  );
}

function CatchFallingGame({ onComplete }) {
  const [status, setStatus] = useState(null);
  return (
    <div style={{ textAlign: "center", position: "relative", height: 250, overflow: "hidden" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Catch Falling 📥</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Sahi answer catch karo: 5 x 5 = ?</p>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20 }}>
        <div onClick={() => alert("Galat!")} style={{ fontSize: 24, padding: 10, background: T.red, borderRadius: 10, cursor: "pointer", animation: "float2 4s infinite" }}>20</div>
        <div onClick={() => { setStatus("correct"); setTimeout(onComplete, 3000); }} style={{ fontSize: 24, padding: 10, background: T.green, borderRadius: 10, cursor: "pointer", animation: "float2 2s infinite" }}>25</div>
      </div>
      {status === "correct" && <div style={{ color: T.green, position: "absolute", bottom: 20, left: 0, right: 0, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Catch!</div>}
    </div>
  );
}

function DirectionMazeGame({ onComplete }) {
  const [pos, setPos] = useState({x:0, y:0});
  const [status, setStatus] = useState(null);
  const move = (dx, dy) => {
    const nx = pos.x + dx, ny = pos.y + dy;
    if(nx >= 0 && nx <= 2 && ny >= 0 && ny <= 2) {
      setPos({x: nx, y: ny});
      if(nx === 2 && ny === 2) {
        setStatus("correct");
        setTimeout(onComplete, 3000);
      }
    }
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Rasta Dhoondo ⬆️</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 40px)", gap: 5, justifyContent: "center", marginBottom: 20 }}>
        {[0,1,2].map(y => [0,1,2].map(x => (
          <div key={`${x}-${y}`} style={{ width: 40, height: 40, background: T.card2, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {pos.x === x && pos.y === y ? "🚗" : x===2 && y===2 ? "🏠" : ""}
          </div>
        )))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
         <button onClick={() => move(0, -1)} style={btnStyle(T.card2)}>⬆️</button>
         <div style={{ display: "flex", gap: 5 }}>
           <button onClick={() => move(-1, 0)} style={btnStyle(T.card2)}>⬅️</button>
           <button onClick={() => move(0, 1)} style={btnStyle(T.card2)}>⬇️</button>
           <button onClick={() => move(1, 0)} style={btnStyle(T.card2)}>➡️</button>
         </div>
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Ghar pahunch gaye!</div>}
    </div>
  );
}

function PicWordMatchGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Pic to Word 🖼️</h2>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🐶</div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => { setAns("correct"); setTimeout(onComplete, 3000); }} style={{ ...btnStyle(T.card2), border: ans==="correct" ? `2px solid ${T.green}` : "none" }}>DOG</button>
        <button onClick={() => alert("Galat!")} style={btnStyle(T.card2)}>CAT</button>
        <button onClick={() => alert("Galat!")} style={btnStyle(T.card2)}>BIRD</button>
      </div>
      {ans === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Jawab!</div>}
    </div>
  );
}

function SyllableCounterGame({ onComplete }) {
  const [status, setStatus] = useState(null);
  const check = (n) => {
    if(n === 3) { setStatus("correct"); setTimeout(onComplete, 3000); }
    else alert("Galat! E-LE-PHANT (3 awaaz)");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Syllables Gino 🗣️</h2>
      <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 5, marginBottom: 20, color: T.orange }}>ELEPHANT</div>
      <p style={{ color: T.muted, marginBottom: 20 }}>Isme kitni awaazein (syllables) hain?</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {[1,2,3,4].map(n => <button key={n} onClick={() => check(n)} style={btnStyle(T.card2)}>{n}</button>)}
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi! 3 Syllables!</div>}
    </div>
  );
}

function FractionSliderGame({ onComplete }) {
  const [val, setVal] = useState(0);
  const [status, setStatus] = useState(null);
  const check = () => {
    if(Math.abs(val - 50) < 5) {
      setStatus("correct");
      setTimeout(onComplete, 3000);
    } else alert("Aadha (Half) kahan hota hai? Try again.");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Fraction Slider 🎚️</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Slider ko 1/2 (Half) par set karo:</p>
      <div style={{ height: 30, background: T.card2, borderRadius: 15, marginBottom: 20, overflow: "hidden" }}>
         <div style={{ width: `${val}%`, height: "100%", background: T.cyan }} />
      </div>
      <input type="range" min="0" max="100" value={val} onChange={e => setVal(e.target.value)} style={{ width: "100%", marginBottom: 20 }} />
      {status !== "correct" ? <button onClick={check} style={btnStyle(T.cyan)}>Check Karo</button> : <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi set kiya!</div>}
    </div>
  );
}

// ==========================================
// NEW FOUNDATIONAL GAMES (SEEKHO)
// ==========================================

function TechBasicsGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const concepts = [
    { title: "HTML (Ghar ki Eent)", icon: "🧱", desc: "HTML website ka structure banata hai. Jaise ghar ki deewarein.", color: T.orange },
    { title: "CSS (Ghar ka Paint)", icon: "🎨", desc: "CSS website ko sundar banata hai. Colors aur design deta hai.", color: T.cyan },
    { title: "JS (Ghar ki Bijli)", icon: "⚡", desc: "JavaScript website ko zinda karta hai. Jaise button dabane pe kya hoga.", color: T.yellow }
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Tech Basics 💻</h2>
      <div style={{ background: concepts[step].color + "22", border: `2px solid ${concepts[step].color}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 10 }}>{concepts[step].icon}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: concepts[step].color, marginBottom: 10 }}>{concepts[step].title}</div>
        <div style={{ fontSize: 15, color: T.text, lineHeight: 1.6 }}>{concepts[step].desc}</div>
      </div>
      <button 
        onClick={() => {
          if (step < 2) setStep(step + 1);
          else onComplete();
        }}
        style={{ ...btnStyle(concepts[step].color), width: "100%" }}
      >
        {step < 2 ? "Aage Badhein ➡️" : "Mujhe Samajh Aa Gaya! ✅"}
      </button>
    </div>
  );
}

function NumberSpellingGame({ onComplete }) {
  const numWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [num, setNum] = useState(Math.floor(Math.random() * 20) + 1);
  const [ans, setAns] = useState("");
  const [status, setStatus] = useState(null);
  
  const check = () => {
    if (ans.toLowerCase().trim() === numWords[num]) {
      speak("Very Good! " + numWords[num]);
      setStatus("correct");
      setScore(s => s + 10);
      setTimeout(() => {
        if (round >= 5) onComplete();
        else {
          setRound(r => r + 1);
          setNum(Math.floor(Math.random() * 20) + 1);
          setAns("");
          setStatus(null);
        }
      }, 1500);
    } else {
      speak("Try again");
      setStatus("wrong");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: T.muted }}>Round {round}/5</div>
        <div style={{ fontWeight: 800, color: T.orange }}>Score: {score}</div>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Number Spelling 🔢</h2>
      
      <div style={{ fontSize: 80, fontWeight: 900, color: T.cyan, marginBottom: 10, cursor: "pointer", background: T.card2, borderRadius: 20, padding: 10 }} onClick={() => speak(numWords[num])} title="Suno">
        {num} 🔊
      </div>
      <input 
        value={ans} onChange={(e) => setAns(e.target.value)}
        placeholder="English spelling likho..." onKeyDown={e => e.key === "Enter" && check()}
        style={{ fontSize: 20, padding: 10, textAlign: "center", borderRadius: 10, border: `2px solid ${status==="wrong"?T.red:status==="correct"?T.green:T.border}`, background: T.card2, color: T.text, marginBottom: 20, textTransform: "lowercase", width: "80%", outline: "none" }}
      />
      {status === "correct" && <div style={{ color: T.green, fontWeight: 800, animation: "pop .3s", marginBottom: 10 }}>🎉 Perfect!</div>}
      {status === "wrong" && <div style={{ color: T.red, fontWeight: 800, animation: "pop .3s", marginBottom: 10 }}>❌ Galat spelling</div>}
      {status === null && <button onClick={check} style={{ ...btnStyle(T.green), width: "100%" }}>Check Karo ✨</button>}
    </div>
  );
}

function MathOpsGame({ onComplete }) {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState({ a: 0, b: 0, op: "+", ans: 0 });
  const [userAns, setUserAns] = useState("");
  const [status, setStatus] = useState(null);
  const [mounted, setMounted] = useState(false);

  const generateQ = () => {
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    let ans = 0;
    if (op === '+') ans = a + b;
    if (op === '-') { 
      const max = Math.max(a, b); 
      const min = Math.min(a, b); 
      a = max; b = min; ans = a - b; 
    }
    if (op === '×') ans = a * b;
    if (op === '÷') { ans = a; a = a * b; }
    setQ({ a, b, op, ans });
  };

  useEffect(() => {
    generateQ();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: T.muted }}>Level {round}/5</div>
        <div style={{ fontWeight: 800, color: T.orange }}>Score: {score}</div>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Math Master ➕➖✖️➗</h2>
      
      <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 20, background: T.card2, padding: 20, borderRadius: 16, color: T.cyan }}>
        {q.a} {q.op} {q.b} = ?
      </div>
      
      <input 
        type="number" value={userAns} onChange={(e) => setUserAns(e.target.value)} placeholder="?" onKeyDown={e => {
          if(e.key === "Enter" && status === null) {
            if(parseInt(userAns) === q.ans) {
              setStatus("correct"); setScore(s => s + 20); speak("Correct!");
              setTimeout(() => {
                if(round >= 5) onComplete();
                else { setRound(r => r + 1); generateQ(); setUserAns(""); setStatus(null); }
              }, 1500);
            } else {
              setStatus("wrong"); speak("Wrong"); setTimeout(() => setStatus(null), 1500);
            }
          }
        }}
        style={{ fontSize: 32, width: 120, padding: 10, textAlign: "center", borderRadius: 10, border: `2px solid ${status==="wrong"?T.red:T.border}`, background: T.bg, color: T.text, marginBottom: 20, outline: "none" }}
      />
      {status === "correct" && <div style={{ color: T.green, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Sahi Jawab! +20</div>}
      {status === "wrong" && <div style={{ color: T.red, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>❌ Oops! Try again.</div>}
    </div>
  );
}

function HindiEnglishGame({ onComplete }) {
  const words = [ { hi: "पानी", en: "Water", opts: ["Fire", "Water", "Air", "Earth"] }, { hi: "कुत्ता", en: "Dog", opts: ["Cat", "Lion", "Dog", "Bird"] } ];
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState(null);

  const check = (opt) => {
    if (opt === words[idx].en) {
      speak(opt);
      setStatus("correct");
      setTimeout(() => {
        if (idx >= words.length - 1) onComplete();
        else { setIdx(i => i + 1); setStatus(null); }
      }, 1500);
    } else {
      setStatus("wrong");
      setTimeout(() => setStatus(null), 1000);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Anuvad (Translation) 🔄</h2>
      <div style={{ color: T.muted, marginBottom: 10 }}>Iska English meaning kya hoga?</div>
      <div onClick={() => speak(words[idx].hi, {lang:'hi-IN'})} style={{ fontSize: 48, fontWeight: 900, color: T.orange, marginBottom: 30, background: T.card2, padding: 20, borderRadius: 20, cursor: "pointer" }}>{words[idx].hi} 🔊</div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {words[idx].opts.map(opt => <button key={opt} onClick={() => check(opt)} style={btnStyle(T.card2)}>{opt}</button>)}
      </div>
      {status === "correct" && <div style={{ color: T.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 Ekdum Sahi!</div>}
      {status === "wrong" && <div style={{ color: T.red, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>❌ Galat jawab</div>}
    </div>
  );
}

function TableGame({ onComplete }) {
  const [step, setStep] = useState(1);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Pahada (Table of 7) ✖️</h2>
      <div style={{ fontSize: 32, background: T.card2, padding: 30, borderRadius: 16, marginBottom: 20 }}>
        <div style={{ color: T.muted, fontSize: 20 }}>7 × {step} = </div>
        <div style={{ color: T.cyan, fontWeight: 900, marginTop: 10, fontSize: 48 }}>{7 * step}</div>
      </div>
      <button onClick={() => {
        speak(`Seven ${step} za ${7 * step}`);
        if(step < 10) setStep(step + 1);
        else onComplete();
      }} style={{ ...btnStyle(T.purple), width: "100%" }}>
        {step < 10 ? "Next ➡️ (Suno)" : "Done! 🎉"}
      </button>
    </div>
  );
}

function AlphabetGame({ onComplete }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [idx, setIdx] = useState(0);
  
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>A B C D Sikho 🔤</h2>
      <div 
        onClick={() => speak(letters[idx])}
        style={{ fontSize: 80, fontWeight: 900, color: T.pink, margin: "20px 0", cursor: "pointer", background: T.card2, borderRadius: 20, padding: 30, border: `2px dashed ${T.pink}` }}
      >
        {letters[idx]} 🔊
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
         <button onClick={() => setIdx(i => i > 0 ? i - 1 : 25)} style={btnStyle(T.card2)}>Peeche</button>
         <button onClick={() => {
            speak(letters[(idx + 1) % 26]);
            setIdx(i => (i + 1) % 26);
            if (idx === 25) setTimeout(onComplete, 2000);
         }} style={{ ...btnStyle(T.cyan), flex: 1 }}>Aage 👉</button>
      </div>
    </div>
  );
}

function HindiVarnamalaGame({ onComplete }) {
  const varnamala = [ { l: "अ", w: "अनार" }, { l: "आ", w: "आम" }, { l: "क", w: "कबूतर" }, { l: "ख", w: "खरगोश" } ];
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Hindi Varnamala 🇮🇳</h2>
      <div onClick={() => speak(varnamala[idx].l + " se " + varnamala[idx].w, { lang: 'hi-IN' })} style={{ background: T.card2, borderRadius: 20, padding: 30, cursor: "pointer", marginBottom: 20, border: `2px dashed ${T.orange}` }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: T.orange, marginBottom: 10 }}>{varnamala[idx].l}</div>
        <div style={{ fontSize: 24, color: T.text, fontWeight: 800 }}>से <span style={{ color: T.green }}>{varnamala[idx].w}</span> 🔊</div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
         <button onClick={() => setIdx(i => i > 0 ? i - 1 : varnamala.length - 1)} style={btnStyle(T.card2)}>Peeche</button>
         <button onClick={() => {
            const next = (idx + 1) % varnamala.length;
            speak(varnamala[next].l + " se " + varnamala[next].w, { lang: 'hi-IN' });
            setIdx(next);
            if (idx === varnamala.length - 1) setTimeout(onComplete, 2000);
         }} style={{ ...btnStyle(T.orange), flex: 1 }}>Aage 👉</button>
      </div>
    </div>
  );
}

function CodeToLearnGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState("");
  const [status, setStatus] = useState(null);

  const levels = [
    { lang: "JavaScript", topic: "Maths", code: "let apples = 5;\nlet boxes = 4;\nlet total = apples * boxes;\nconsole.log( total ); // Answer kya aayega?", correct: "20", hint: "5 x 4" },
    { lang: "HTML", topic: "English", code: "<!-- 'Kutta' ko English me likho -->\n<animal type=\"pet\" name=\"______\"></animal>", correct: "dog", hint: "D _ _" },
    { lang: "CSS", topic: "Hindi", code: "/* 'Red' ko Hindi me kya kehte hain? */\nbody {\n  background-color: ______ ;\n}", correct: "laal", hint: "L a a l" }
  ];

  const check = () => {
    if(ans.toLowerCase().trim() === levels[step].correct.toLowerCase()) {
      setStatus("correct");
      speak("Code Compiled Successfully!");
      setTimeout(() => {
        if(step < 2) { setStep(s => s + 1); setAns(""); setStatus(null); }
        else onComplete();
      }, 2500);
    } else {
      setStatus("wrong");
      speak("Syntax Error");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: T.muted }}>Level {step + 1}/3</div>
        <div style={{ fontWeight: 800, color: "#3b82f6" }}>{levels[step].topic} via {levels[step].lang}</div>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>Hacker Mode On 👨‍💻</h2>
      <div style={{ background: "#000", color: "#10b981", padding: 20, borderRadius: 12, fontFamily: "monospace", fontSize: 16, whiteSpace: "pre-wrap", marginBottom: 20, border: "1px solid #334155", textAlign: "left", lineHeight: 1.6 }}>
        {levels[step].code}
      </div>
      <input value={ans} onChange={e => setAns(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} placeholder="Fill the blank..." style={{ width: "100%", padding: 14, borderRadius: 12, border: `2px solid ${status==="wrong"?T.red:status==="correct"?T.green:T.border}`, background: T.card2, color: T.text, fontSize: 16, marginBottom: 16, outline: "none", fontFamily: "monospace" }} />
      {status === null && <button onClick={check} style={{ ...btnStyle("#3b82f6"), width: "100%", fontFamily: "monospace" }}>&gt; RUN CODE</button>}
      {status === "correct" && <div style={{ color: T.green, fontWeight: 800, textAlign: "center", fontSize: 16, animation: "pop .3s" }}>✅ Compilation Success!</div>}
      {status === "wrong" && <div style={{ color: T.red, fontWeight: 800, textAlign: "center", fontSize: 16, animation: "pop .3s" }}>❌ Error: Line 3. {levels[step].hint} try karo.</div>}
    </div>
  );
}

function GenericPlaceholder({ name, onComplete }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🛠️</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{name} Component</h2>
      <p style={{ color: T.muted, marginBottom: 30 }}>Ye component jaldi hi aane wala hai!</p>
      <button onClick={() => { alert("Testing complete!"); onComplete(); }} style={btnStyle(T.green)}>Close Tester ✅</button>
    </div>
  );
}

// ==========================================
// MAIN LIBRARY COMPONENT
// ==========================================

export default function GamesLibrary() {
  const [activeGame, setActiveGame] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);

  const handleComplete = () => {
    setXpEarned(x => x + 50);
    setActiveGame(null);
    // Yahan Supabase API aayegi: recordQuizAttempt ya saveProgress
  };

  const renderGame = () => {
    const props = { onComplete: handleComplete };
    if (activeGame?.id === "snake_ladder") return <SnakeLadderGame onGameEnd={handleComplete} />;
    switch(activeGame?.id) {
      case "quiz": return <ClassicQuizGame {...props} />;
      case "true_false": return <TrueFalseGame {...props} />;
      case "match_pairs": return <MatchPairsGame {...props} />;
      case "drag_drop": return <DragDropGame {...props} />;
      case "word_builder": return <WordBuilderGame {...props} />;
      case "sequence": return <SequenceGame {...props} />;
      case "flashcards": return <FlashcardGame {...props} />;
      case "unscramble": return <UnscrambleGame {...props} />;
      case "odd_one_out": return <OddOneOutGame {...props} />;
      case "fill_blanks": return <FillBlanksGame {...props} />;
      case "story_choice": return <StoryChoiceGame {...props} />;
      case "image_guess": return <ImageGuessGame {...props} />;
      case "memory_cards": return <MemoryCardsGame {...props} />;
      case "quick_tap": return <QuickTapGame {...props} />;
      case "category_sort": return <CategorySortGame {...props} />;
      case "math_balance": return <MathBalanceGame {...props} />;
      case "anim_math": return <AnimMathGame {...props} />;
      case "color_match": return <ColorMatchGame {...props} />;
      case "timeline": return <TimelineGame {...props} />;
      case "word_hunt": return <WordHuntGame {...props} />;
      case "balloon_pop": return <BalloonPopGame {...props} />;
      case "sentence_jumble": return <SentenceJumbleGame {...props} />;
      case "pattern_complete": return <PatternCompleteGame {...props} />;
      case "swipe_tf": return <SwipeTrueFalseGame {...props} />;
      case "typing_speed": return <TypingSpeedGame {...props} />;
      case "shadow_match": return <ShadowMatchGame {...props} />;
      case "math_runner": return <MathRunnerGame {...props} />;
      case "missing_vowel": return <MissingVowelGame {...props} />;
      case "code_breaker": return <CodeBreakerGame {...props} />;
      case "spot_mistake": return <SpotMistakeGame {...props} />;
      case "word_search": return <WordSearchGame {...props} />;
      case "fractions_pie": return <FractionsPieGame {...props} />;
      case "map_explorer": return <MapExplorerGame {...props} />;
      case "clock_master": return <ClockMasterGame {...props} />;
      case "rhyming_words": return <RhymingWordsGame {...props} />;
      case "spelling_bee": return <SpellingBeeGame {...props} />;
      case "grammar_sort": return <GrammarSortGame {...props} />;
      case "shape_builder": return <ShapeBuilderGame {...props} />;
      case "money_math": return <MoneyMathGame {...props} />;
      case "emotion_reader": return <EmotionReaderGame {...props} />;
      case "logical_reasoning": return <LogicalReasoningGame {...props} />;
      case "truth_lie_detector": return <TruthLieDetectorGame {...props} />;
      case "simon_says": return <SimonSaysGame {...props} />;
      case "word_snake": return <WordSnakeGame {...props} />;
      case "number_line": return <NumberLineGame {...props} />;
      case "catch_falling": return <CatchFallingGame {...props} />;
      case "direction_maze": return <DirectionMazeGame {...props} />;
      case "pic_word_match": return <PicWordMatchGame {...props} />;
      case "syllable_counter": return <SyllableCounterGame {...props} />;
      case "fraction_slider": return <FractionSliderGame {...props} />;
      case "tech_basics": return <TechBasicsGame {...props} />;
      case "num_spell": return <NumberSpellingGame {...props} />;
      case "math_ops": return <MathOpsGame {...props} />;
      case "tables": return <TableGame {...props} />;
      case "alphabet": return <AlphabetGame {...props} />;
      case "hindi_varnamala": return <HindiVarnamalaGame {...props} />;
      case "hin_eng_trans": return <HindiEnglishGame {...props} />;
      case "code_to_learn": return <CodeToLearnGame {...props} />;
      default: return <GenericPlaceholder name={activeGame?.name} {...props} />;
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: T.bg, color: T.text, minHeight: "100vh", maxWidth: 600, margin: "0 auto", paddingBottom: 100 }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pop { 0% { transform: scale(0.9) } 50% { transform: scale(1.1) } 100% { transform: scale(1) } }
        @keyframes float2 { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
      `}</style>

      {/* HEADER WITH SAFE NAVIGATION BACK */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,.97)", borderBottom: `1px solid ${T.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span onClick={() => window.location.href = '/dashboard'} style={{ cursor: "pointer", color: T.muted, fontSize: 20 }}>🏠</span>
          {activeGame ? (
            <span onClick={() => setActiveGame(null)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, color: T.orange }}>
              <span style={{ color: T.muted }}>← Wapas</span> | {activeGame.icon} {activeGame.name}
            </span>
          ) : (
            <span>🎮 Games <span style={{ color: T.orange }}>Library</span></span>
          )}
        </div>
        <div style={{ background: `${T.yellow}22`, color: T.yellow, padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
          ⚡ {xpEarned} XP
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {activeGame ? (
          <div style={{ animation: "slideIn .3s ease" }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, marginBottom: 14 }}>
              {renderGame()}
            </div>
            
            {/* ARYA AI OBSERVER (Tracking bar) */}
            <div style={{ background: `linear-gradient(90deg, ${T.purple}11, ${T.cyan}11)`, border: `1px dashed ${T.purple}55`, borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24, animation: "bounce 2s infinite" }}>🤖</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.purple }}>Arya is observing...</div>
                <div style={{ fontSize: 11, color: T.muted }}>Tracking speed, accuracy & interest in {activeGame.name}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ color: T.muted, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Arya ne tumhari padhai ko mazedar banane ke liye <b>50 types</b> ke interactive games banaye hain. Khel khel me seekho! 🚀
            </p>
            
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, color: '#f59e0b' }}>🌟 Premium Animated Game</div>
            <div onClick={() => setActiveGame({ id: 'snake_ladder', name: 'Snake & Ladder 3D', icon: '🐍' })} style={{ display: 'flex', alignItems: 'center', gap: 14, background: `linear-gradient(135deg, ${T.green}15, ${T.cyan}15)`, border: `1px solid ${T.green}55`, borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ position: 'absolute', top: 12, right: -20, background: T.orange, color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 24px', transform: 'rotate(45deg)' }}>NEW</div>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: T.green+'22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🐍</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: T.green }}>Snake & Ladder 3D</div>
                <div style={{ fontSize: 13, color: T.muted }}>Naya animated 3D snake & ladder khelo!</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 20, color: T.green }}>▶</div>
            </div>

            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16, color: T.text }}>📚 Learning Games Library</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {GAME_TYPES.map(game => (
                <div 
                  key={game.id} 
                  onClick={() => setActiveGame(game)}
                  style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = game.color}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = T.border}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${game.color}22`, color: game.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>
                    {game.icon}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{game.name}</div>
                  <div style={{ fontSize: 11, color: T.muted }}>{game.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper style for buttons
const btnStyle = (color) => ({
  background: color, border: "none", color: "#fff", padding: "12px 20px", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer"
});