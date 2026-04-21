export default function Cell({ number, children }) {
  return (
    <div className="border h-8 text-xs flex items-center justify-center relative">
      {number}
      {children}
    </div>
  );
}