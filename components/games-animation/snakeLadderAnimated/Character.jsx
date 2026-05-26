export default function Character({ emotion }) {
  const getEmoji = () => {
    switch (emotion) {
      case "sad":
        return "😢";
      case "happy":
        return "😄";
      case "win":
        return "🏆";
      default:
        return "🧑";
    }
  };

  return (
    <div className="w-8 h-8 flex items-center justify-center text-2xl transition-all duration-300 drop-shadow-md bg-white/20 rounded-full border border-white/40">
      {getEmoji()}
    </div>
  );
}