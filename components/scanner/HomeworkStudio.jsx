export default function HomeworkStudio({ children }) {
  return (
    <div style={{ background: '#0f1520', borderRadius: 16, border: '1px solid #1e2d45', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 24 }}>🎒</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#f1f5f9' }}>Homework Studio</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>AI generated games from your books</div>
        </div>
      </div>
      {/* Yahan generated games ke cards aayenge */}
      {children}
    </div>
  );
}