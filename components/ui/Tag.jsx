export default function Tag({ children, color = '#64748b' }) {
  return (
    <span style={{
      background: color + '22',
      color,
      fontSize: 11,
      padding: '3px 10px',
      borderRadius: 99,
      fontWeight: 700,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}