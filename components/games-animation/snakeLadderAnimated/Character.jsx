export default function Character({ emotion }) {
  const getImage = () => {
    switch (emotion) {
      case "sad":
        return "/characters/sad.png";
      case "happy":
        return "/characters/happy.png";
      case "win":
        return "/characters/win.gif";
      default:
        return "/characters/normal.png";
    }
  };

  return (
    <img
      src={getImage()}
      className="w-8 h-8 transition-all duration-300"
    />
  );
}