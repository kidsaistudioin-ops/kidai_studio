export default function ScoreBoard({ position }) {
  return (
    <div className="mt-4 p-2 bg-gray-100 rounded">
      <h2 className="text-lg">Score: {position}</h2>
    </div>
  );
}