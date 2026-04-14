export default function Card({ children, color, accent, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#0f1520',
        border: `1px solid ${accent ? '#7c3aed' : color ? color + '44' : '#1e2d45'}`,
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        boxShadow: accent ? '0 0 24px rgba(139,92,246,.12)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all .2s',
        ...style,
      }}
    >
      {children}
    </div>
  )
}