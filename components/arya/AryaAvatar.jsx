export default function AryaAvatar({ size = 50, mood = "happy", animated = true }) {
  const moods = {
    happy: "😊",
    thinking: "🤔",
    talking: "🤖",
    excited: "🤩"
  };
  
  return (
    <div style={{
      width: size, height: size, borderRadius: "25%",
      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.55,
      animation: animated ? "float 3s ease infinite" : "none",
      boxShadow: "0 4px 16px rgba(124, 58, 237, 0.4)",
      flexShrink: 0
    }}>
      {moods[mood] || "🤖"}
    </div>
  );
}