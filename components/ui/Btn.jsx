'use client'

export default function Btn({
  children, onClick, color = '#ff6b35',
  ghost, full, small, disabled, type = 'button'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? '8px 14px' : '12px 20px',
        borderRadius: 13,
        border: ghost ? `1.5px solid ${color}` : 'none',
        background: ghost
          ? 'transparent'
          : `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: ghost ? color : '#fff',
        fontSize: small ? 12 : 14,
        fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        width: full ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        boxShadow: ghost ? 'none' : `0 4px 16px ${color}44`,
        transition: 'all .2s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}