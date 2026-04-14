'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { speak } from '@/lib/voice';

const C = {
  bg: '#07090f', card: '#0f1520', card2: '#161e30', border: '#1e2d45',
  orange: '#ff6b35', purple: '#7c3aed', cyan: '#06b6d4', green: '#10b981',
  yellow: '#f59e0b', pink: '#ec4899', text: '#f1f5f9', muted: '#64748b', red: '#ef4444'
};

// ==========================================
// MINI GAMES FOR EACH SUBJECT
// ==========================================

function NumberSpellingGame({ onComplete }) {
  const [num, setNum] = useState(Math.floor(Math.random() * 100) + 1);
  const [ans, setAns] = useState("");
  const [status, setStatus] = useState(null);
  const [mounted, setMounted] = useState(false);

  const numToWords = (n) => {
    if(n === 100) return "one hundred";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    if(n < 20) return ones[n];
    return (tens[Math.floor(n/10)] + (n%10 !== 0 ? " " + ones[n%10] : "")).trim();
  };

  useEffect(() => {
    generateQ();
    setMounted(true);
  }, []);

  const check = () => {
    const correct = numToWords(num);
    if (ans.toLowerCase().trim() === correct) {
      speak("Excellent! " + correct);
      setStatus("correct");
      setTimeout(() => {
        setNum(Math.floor(Math.random() * 100) + 1);
        setAns("");
        setStatus(null);
      }, 2000);
    } else {
      speak("Try again, spelling check karo");
      setStatus("wrong");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: C.pink, marginBottom: 10 }}>1 to 100 Spelling Game</h2>
      <p style={{ color: C.muted, marginBottom: 20 }}>Is number ko English mein likho:</p>
      <div onClick={() => speak(numToWords(num))} style={{ fontSize: 64, fontWeight: 900, color: C.text, marginBottom: 20, cursor: 'pointer', background: C.card2, display: 'inline-block', padding: '10px 30px', borderRadius: 20, border: `2px dashed ${C.pink}` }}>
        {num} 🔊
      </div>
      <div>
        <input 
          value={ans} 
          onChange={e => setAns(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Type spelling here..." 
          style={{ width: '100%', maxWidth: 300, padding: 16, borderRadius: 12, border: `2px solid ${status === 'wrong' ? C.red : status === 'correct' ? C.green : C.pink}`, background: C.card2, color: '#fff', fontSize: 20, textAlign: 'center', marginBottom: 20, outline: 'none' }}
        />
      </div>
      {status === 'correct' && <div style={{ color: C.green, fontWeight: 800, marginBottom: 16, animation: 'pop .3s' }}>🎉 Perfect! Sahi spelling!</div>}
      {status === 'wrong' && <div style={{ color: C.red, fontWeight: 800, marginBottom: 16, animation: 'bounce .3s' }}>❌ Galat spelling, wapas try karo</div>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={check} style={{ background: C.pink, color: '#fff', border: 'none', padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: 'pointer' }}>Check Answer</button>
        <button onClick={onComplete} style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Back</button>
      </div>
    </div>
  );
}

function MathGame({ onComplete }) {
  const [q, setQ] = useState({a: 0, b: 0, ans: 0, op: '+'});
  const [ans, setAns] = useState("");
  const [status, setStatus] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [activeOp, setActiveOp] = useState('+');

  const generateQ = (opToUse) => {
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    let ans = 0;
    if (opToUse === '+') ans = a + b;
    if (opToUse === '-') { 
      const max = Math.max(a, b); 
      const min = Math.min(a, b); 
      a = max; b = min; ans = a - b; 
    }
    if (opToUse === '×') ans = a * b;
    if (opToUse === '÷') { ans = a; a = a * b; } 
    setQ({a, b, ans, op: opToUse});
    setAns("");
    setStatus(null);
  };

  useEffect(() => {
    generateQ(activeOp);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOp]);

  const check = () => {
    if (parseInt(ans) === q.ans) {
      speak("Sahi jawab!");
      setStatus("correct");
      setTimeout(() => {
        generateQ(activeOp);
      }, 1500);
    } else {
      speak("Galat, wapas try karo");
      setStatus("wrong");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.cyan, marginBottom: 15 }}>Maths Magic! 🧮</h2>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
        {['+', '-', '×', '÷'].map(o => (
          <button key={o} onClick={() => setActiveOp(o)} style={{ flex: 1, background: activeOp === o ? C.cyan : C.card2, color: activeOp === o ? '#000' : C.text, border: `1px solid ${C.border}`, padding: '12px', borderRadius: 12, fontSize: 24, fontWeight: 900, cursor: 'pointer', transition: '0.2s' }}>{o}</button>
        ))}
      </div>
      <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 20, background: C.card2, padding: 20, borderRadius: 16, color: C.cyan }}>
        {q.a} {q.op} {q.b} = ?
      </div>
      <input 
        type="number" value={ans} onChange={(e) => setAns(e.target.value)} placeholder="?" onKeyDown={e => e.key === "Enter" && check()}
        style={{ fontSize: 32, width: 120, padding: 10, textAlign: "center", borderRadius: 10, border: `2px solid ${status==='wrong'?C.red:status==='correct'?C.green:C.border}`, background: C.bg, color: C.text, marginBottom: 20, outline: "none" }}
      />
      {status === 'correct' && <div style={{ color: C.green, fontWeight: 800, marginBottom: 16 }}>🎉 Ekdum Sahi!</div>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={check} style={{ background: C.cyan, color: '#000', border: 'none', padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: 'pointer' }}>Check</button>
        <button onClick={onComplete} style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Back</button>
      </div>
    </div>
  );
}

function FractionGame({ onComplete }) {
  const [slices, setSlices] = useState([false, false, false, false]);
  const clickSlice = (i) => {
    const newS = [...slices];
    newS[i] = !newS[i];
    setSlices(newS);
    if (newS.filter(s => s).length === 2) {
      speak("Superb! Aadha pizza ban gaya!", {lang: "hi-IN"});
      setTimeout(onComplete, 3000);
    }
  };
  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.orange, marginBottom: 10 }}>Pizza Math 🍕</h2>
      <p style={{ color: C.muted, marginBottom: 20 }}>2/4 (Aadha Pizza) select karo!</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, width: 150, height: 150, margin: "0 auto", borderRadius: "50%", overflow: "hidden", border: `4px solid ${C.orange}`, marginBottom: 20 }}>
        {slices.map((s, i) => (
          <div key={i} onClick={() => clickSlice(i)} style={{ background: s ? C.orange : C.card2, border: `1px solid ${C.border}`, cursor: "pointer", transition: "0.2s" }} />
        ))}
      </div>
      {slices.filter(s => s).length === 2 && <div style={{ color: C.green, marginTop: 20, fontWeight: 800, fontSize: 18, animation: "pop .3s" }}>🎉 2/4 = 1/2 ! Sahi Jawab!</div>}
      <button onClick={onComplete} style={{ marginTop: 20, background: 'transparent', color: C.muted, border: 'none', fontWeight: 800, cursor: 'pointer' }}>Back</button>
    </div>
  );
}

function ScienceGame({ onComplete }) {
  const [status, setStatus] = useState(null);
  const check = (isCorrect) => {
    if(isCorrect) {
      speak("Ekdum Sahi! Plants khana banate hain photosynthesis se!");
      setStatus('correct');
      setTimeout(onComplete, 3000);
    } else {
      speak("Galat!");
      setStatus('wrong');
      setTimeout(() => setStatus(null), 1500);
    }
  };
  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>🌿</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.green, marginBottom: 20 }}>Paudhe (Plants) apna khana kaise banate hain?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => check(false)} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Maggi Noodles banakar</button>
        <button onClick={() => check(true)} style={{ background: status === 'correct' ? C.green : C.card2, color: status === 'correct' ? '#000' : C.text, border: `1px solid ${status === 'correct' ? C.green : C.border}`, padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>Photosynthesis (Sunlight) se</button>
        <button onClick={() => check(false)} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Mitti kha kar</button>
      </div>
      <button onClick={onComplete} style={{ marginTop: 20, background: 'transparent', color: C.muted, border: 'none', fontWeight: 800, cursor: 'pointer' }}>Back</button>
    </div>
  );
}

function StoryGame({ onComplete }) {
  const [step, setStep] = useState(0);
  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>📖</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.purple, marginBottom: 20 }}>Ramu aur Sher</h2>
      
      {step === 0 && (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>Ramu jungle me ja raha tha, achanak use ek sher dikha! Ramu ko kya karna chahiye?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { speak("Sahi! Sher ped pe nahi chadh sakta."); setStep(1); }} style={{ background: C.card2, color: C.text, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer' }}>A. Ped par chadh jaye 🌳</button>
            <button onClick={() => speak("Sher bahut tez daudta hai! Ye galat choice hai.")} style={{ background: C.card2, color: C.text, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer' }}>B. Sher se tez bhaage 🏃</button>
          </div>
        </div>
      )}
      
      {step === 1 && (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>Sahi! Sher ped pe nahi chadh sakta. Ab ped pe Ramu ko bhook lagi, waha 2 phal hain:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => speak("Ye zehreeli berry thi! Kahani khatam.")} style={{ background: C.card2, color: C.text, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer' }}>A. Laal chamakta anjaan phal 🍒</button>
            <button onClick={() => { speak("Sahi choice! Ramu safe hai aur aam kha raha hai."); setStep(2); setTimeout(onComplete, 3000); }} style={{ background: C.green, color: '#000', padding: 16, borderRadius: 12, border: 'none', fontWeight: 800, cursor: 'pointer' }}>B. Normal Aam (Mango) 🥭</button>
          </div>
        </div>
      )}

      {step === 2 && (
         <h2 style={{ color: C.green, fontWeight: 900, animation: 'pop 0.5s' }}>🏆 Kahani Poori Hui! Safe & Sound!</h2>
      )}
      <button onClick={onComplete} style={{ marginTop: 20, background: 'transparent', color: C.muted, border: 'none', fontWeight: 800, cursor: 'pointer' }}>Back</button>
    </div>
  );
}

function HindiGame({ onComplete }) {
  const [status, setStatus] = useState(null);
  const check = (val) => {
    if(val === 'आम') {
      speak("Sahi jawab! Aa se Aam", {lang: 'hi-IN'});
      setStatus('correct');
      setTimeout(onComplete, 3000);
    } else {
      speak("Galat!");
      setStatus('wrong');
      setTimeout(() => setStatus(null), 1500);
    }
  };
  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <div onClick={() => speak("Aa se kya hota hai?", {lang: 'hi-IN'})} style={{ fontSize: 80, fontWeight: 900, color: C.orange, marginBottom: 20, cursor: 'pointer' }}>आ 🔊</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 20 }}>'आ' से क्या होता है?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button onClick={() => check('अनार')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: 20, borderRadius: 12, fontSize: 24, fontWeight: 800, cursor: 'pointer' }}>अनार</button>
        <button onClick={() => check('आम')} style={{ background: status === 'correct' ? C.green : C.card2, color: status === 'correct' ? '#000' : C.text, border: `1px solid ${status === 'correct' ? C.green : C.border}`, padding: 20, borderRadius: 12, fontSize: 24, fontWeight: 800, cursor: 'pointer' }}>आम 🥭</button>
        <button onClick={() => check('इमली')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: 20, borderRadius: 12, fontSize: 24, fontWeight: 800, cursor: 'pointer' }}>इमली</button>
        <button onClick={() => check('उल्लू')} style={{ background: C.card2, color: C.text, border: `1px solid ${C.border}`, padding: 20, borderRadius: 12, fontSize: 24, fontWeight: 800, cursor: 'pointer' }}>उल्लू</button>
      </div>
      <button onClick={onComplete} style={{ marginTop: 20, background: 'transparent', color: C.muted, border: 'none', fontWeight: 800, cursor: 'pointer' }}>Back</button>
    </div>
  );
}

function SSTGame({ onComplete }) {
  const [ans, setAns] = useState(null);
  const check = (isCorrect) => {
    if(isCorrect) {
      speak("Ekdum Sahi! New Delhi!");
      setAns('correct');
      setTimeout(onComplete, 3000);
    } else {
      speak("Galat disha!");
      setAns('wrong');
      setTimeout(() => setAns(null), 1500);
    }
  };
  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>🗺️</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.yellow, marginBottom: 20 }}>India ki Rajdhani (Capital) kahan hai?</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button onClick={() => check(true)} style={{ background: ans === 'correct' ? C.green : C.card2, color: ans === 'correct' ? '#000' : C.text, padding: 16, borderRadius: 12, border: `1px solid ${ans === 'correct' ? C.green : C.border}`, fontWeight: 800, cursor: 'pointer' }}>⬆️ North (New Delhi)</button>
        <button onClick={() => check(false)} style={{ background: C.card2, color: C.text, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer' }}>⬇️ South (Chennai)</button>
        <button onClick={() => check(false)} style={{ background: C.card2, color: C.text, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer' }}>⬅️ West (Mumbai)</button>
        <button onClick={() => check(false)} style={{ background: C.card2, color: C.text, padding: 16, borderRadius: 12, border: `1px solid ${C.border}`, fontWeight: 800, cursor: 'pointer' }}>➡️ East (Kolkata)</button>
      </div>
      <button onClick={onComplete} style={{ marginTop: 20, background: 'transparent', color: C.muted, border: 'none', fontWeight: 800, cursor: 'pointer' }}>Back</button>
    </div>
  );
}

function TechGame({ onComplete }) {
  const [ans, setAns] = useState("");
  const [status, setStatus] = useState(null);
  const check = () => {
    if(ans.toLowerCase().trim() === 'button') {
      speak("Code compiled! Button ban gaya!");
      setStatus('correct');
      setTimeout(onComplete, 3000);
    } else {
      speak("Syntax Error, try again.");
      setStatus('wrong');
      setTimeout(() => setStatus(null), 1500);
    }
  };
  return (
    <div style={{ background: C.card, padding: 30, borderRadius: 20, textAlign: 'center', border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>💻</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: C.cyan, marginBottom: 20 }}>Tech & Coding Basics</h2>
      <p style={{ color: C.muted, marginBottom: 20 }}>Website par ek click karne wala dabha banane ke liye kaunsa HTML tag use hota hai?</p>
      <div style={{ background: "#000", color: "#10b981", padding: 20, borderRadius: 12, fontFamily: "monospace", fontSize: 18, marginBottom: 20, border: "1px solid #334155", textAlign: 'left' }}>
        &lt;<input value={ans} onChange={e=>setAns(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="____" style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #10b981', color: '#10b981', width: 80, outline: 'none', fontSize: 18, textAlign: 'center', fontWeight: 'bold' }} />&gt; <br/> &nbsp;&nbsp;Click Me! <br/> &lt;/{ans || '___'}&gt;
      </div>
      {status === 'correct' && <div style={{ color: C.green, fontWeight: 800, marginBottom: 16, animation: 'pop .3s' }}>✅ Compilation Success!</div>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={check} style={{ background: C.cyan, color: '#000', border: 'none', padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 900, cursor: 'pointer' }}>Run Code</button>
        <button onClick={onComplete} style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, padding: '14px 24px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>Back</button>
      </div>
    </div>
  );
}


export default function PersonalizedLearn() {
  const router = useRouter();
  const [module, setModule] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({ name: 'Arjun', age: 10, address: '' });
  
  const inviteCode = "ARJUN50";

  const SUBJECTS = [
    { id: 'math', n: 'Maths Magic', e: '🧮', d: 'Personalized Math Games', c: C.cyan },
    { id: 'science', n: 'Science Explorer', e: '🔬', d: 'Space & Environment', c: C.purple },
    { id: 'story', n: 'Animated Stories', e: '📖', d: 'Fun Moral Stories', c: C.green },
    { id: 'english_duo', n: 'English Sikho', e: '🔠', d: 'Duolingo Style Game', c: C.pink },
    { id: 'num_spell', n: 'Number Spelling', e: '🔢', d: '1 to 100 Spelling', c: C.pink },
    { id: 'counting', n: 'Ginti (1-100)', e: '💯', d: 'Counting & Voice', c: C.cyan },
    { id: 'tables', n: 'Pahada (Tables)', e: '✖️', d: 'Learn Tables 1-20', c: C.orange },
    { id: 'hindi', n: 'Hindi (हिन्दी)', e: '🇮🇳', d: 'Varnamala & Shabd', c: C.orange },
    { id: 'sst', n: 'Social Studies', e: '🌍', d: 'Maps, History, Earth', c: C.yellow },
    { id: 'tech', n: 'Tech & Coding', e: '💻', d: 'Logic & Computers', c: C.cyan },
    { id: 'library', n: '50+ Games Library', e: '🎮', d: 'Random Fun Games', c: C.purple }
  ];

  const handleSubjectClick = (id) => {
    if (id === 'library') {
      router.push('/library');
    } else {
      // Now ALL subjects trigger their own mini-game on this page
      setModule(id);
    }
  };

  const renderGame = () => {
    const back = () => setModule(null);
    switch(module) {
      case 'math': return <MathGame onComplete={back} />;
      case 'science': return <ScienceGame onComplete={back} />;
      case 'story': return <StoryGame onComplete={back} />;
      case 'hindi': return <HindiGame onComplete={back} />;
      case 'english_duo': return <EnglishDuoGame onComplete={back} />;
      case 'num_spell': return <NumberSpellingGame onComplete={back} />;
      case 'fraction': return <FractionGame onComplete={back} />;
      case 'counting': return <CountingGame onComplete={back} />;
      case 'tables': return <TableGame onComplete={back} />;
      case 'sst': return <SSTGame onComplete={back} />;
      case 'tech': return <TechGame onComplete={back} />;
      default: return null;
    }
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Nunito', sans-serif" }}>
      <Header title={module ? "Learning Session" : "My Learning Plan 📚"} showBack={!!module} onBack={() => module ? setModule(null) : router.back()} />
      
      <div style={{ padding: '20px 20px 100px', maxWidth: 600, margin: '0 auto', animation: 'fadeIn .4s ease' }}>
        
        {module ? (
          <div style={{ animation: 'slideUp .3s ease' }}>
            {renderGame()}
          </div>
        ) : (
          <>
            {/* Profile & Free Premium Banner */}
            <div 
              onClick={() => setShowProfile(true)}
              style={{ background: `linear-gradient(135deg, ${C.yellow}22, ${C.orange}22)`, border: `1px solid ${C.yellow}55`, borderRadius: 24, padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ fontSize: 46 }}>🎁</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', marginBottom: 4 }}>My Profile & Free Premium</div>
                <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.4 }}>Apne doston ko invite karo aur 5 Days Premium bilkul free pao!</div>
              </div>
              <button style={{ background: C.orange, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Open</button>
            </div>

            {/* Arya AI Premium Greeting */}
            <div style={{ background: `linear-gradient(135deg, ${C.card2}, ${C.card})`, border: `1px solid ${C.purple}55`, borderRadius: 24, padding: 20, display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, boxShadow: `0 10px 30px ${C.purple}15` }}>
              <div style={{ fontSize: 48, animation: 'bounce 2s infinite' }}>🤖</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fff' }}>Hi {userData.name}!</h2>
                  <span style={{ background: C.yellow, color: '#000', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 900 }}>PREMIUM 👑</span>
                </div>
                <p style={{ margin: 0, color: C.muted, fontSize: 13, lineHeight: 1.4 }}>Maine tumhari class history analyze kar li hai. Aaj ka personalized plan ready hai!</p>
              </div>
            </div>

            {/* Smart Homework Scanner */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.cyan, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>1. School Homework</h3>
            <div onClick={() => router.push('/scanner')} style={{ background: C.card, border: `2px dashed ${C.cyan}`, borderRadius: 20, padding: 20, textAlign: 'center', cursor: 'pointer', marginBottom: 30, transition: 'all 0.2s', boxShadow: `0 8px 24px rgba(6,182,212,0.1)` }}>
               <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
               <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 4 }}>Homework Scan Karo</div>
               <div style={{ color: C.muted, fontSize: 13 }}>Copy ki photo kheencho, main usko game bana dungi!</div>
            </div>

            {/* Weak Topics (Personalized) */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.orange, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>2. Arya's Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
              {[
                { topic: 'Fractions (Math)', desc: 'Kal isme 2 galatiyan hui thi. Chalo revise karein!', icon: '🍕', color: C.orange, path: 'fraction' },
                { topic: 'Photosynthesis (Science)', desc: 'Class 5 chapter 2. Iska ek animated quiz khele?', icon: '🌿', color: C.green, path: 'science' }
              ].map((item, i) => (
                <div onClick={() => setModule(item.path)} key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: item.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>{item.topic}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{item.desc}</div>
                  </div>
                  <div style={{ color: item.color, fontWeight: 900, fontSize: 20 }}>▶</div>
                </div>
              ))}
            </div>

            {/* Subjects Grid */}
            <div style={{ fontWeight: 900, fontSize: 16, color: C.pink, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              3. Personalized Subjects
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>
              {SUBJECTS.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => handleSubjectClick(m.id)} 
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, transition: '0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: m.c + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                    {m.e}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 15, marginBottom: 4 }}>{m.n}</div>
                    <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.3 }}>{m.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Syllabus Books */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: C.cyan, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>4. Tumhari Books (Class 5)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
               <div onClick={() => setModule('math')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📐</div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>Mathematics</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>NCERT • 12 Chapters</div>
               </div>
               <div onClick={() => setModule('science')} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🔬</div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>Science</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>NCERT • 15 Chapters</div>
               </div>
            </div>

          </>
        )}

      </div>

      {/* Profile & Referral Modal */}
      {showProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, width: '100%', maxWidth: 400, position: 'relative', animation: 'slideUp 0.3s ease' }}>
            <button onClick={() => setShowProfile(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer' }}>✖</button>
            
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 900 }}>👤 Meri Profile</h2>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: C.muted, marginBottom: 4, fontWeight: 700 }}>Tumhara Naam</label>
              <input type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', outline: 'none', fontWeight: 700 }} />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: C.muted, marginBottom: 4, fontWeight: 700 }}>Age (Umar)</label>
              <input type="number" value={userData.age} onChange={e => setUserData({...userData, age: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', outline: 'none', fontWeight: 700 }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: C.muted, marginBottom: 4, fontWeight: 700 }}>Address / City</label>
              <input type="text" value={userData.address} onChange={e => setUserData({...userData, address: e.target.value})} placeholder="e.g. Mumbai, Maharashtra" style={{ width: '100%', padding: 12, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}`, color: '#fff', outline: 'none', fontWeight: 700 }} />
            </div>

            <div style={{ background: `linear-gradient(135deg, ${C.purple}22, ${C.cyan}22)`, border: `1px dashed ${C.cyan}`, padding: 16, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: C.cyan, fontWeight: 800, marginBottom: 8 }}>✨ REFER & EARN PREMIUM ✨</div>
              <div style={{ fontSize: 12, color: '#e2e8f0', marginBottom: 12, lineHeight: 1.5 }}>Ye link apne doston ko bhejo. Jab wo judenge, toh <strong style={{color: C.yellow}}>tum dono ko 50 XP milenge</strong> (Yaani 5 Days Free Premium!) 🎉</div>
              <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2, color: '#fff', marginBottom: 12 }}>{inviteCode}</div>
              <button onClick={() => {
                navigator.clipboard.writeText(`https://kidai.studio/login?ref=${inviteCode}`);
                alert('Link copied! Ab isko WhatsApp pe share karo! 🚀');
              }} style={{ background: C.cyan, color: '#000', border: 'none', padding: '12px 20px', borderRadius: 12, fontWeight: 900, cursor: 'pointer', width: '100%' }}>
                🔗 Copy Invite Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}