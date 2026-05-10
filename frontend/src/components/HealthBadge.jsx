import Badge from 'react-bootstrap/Badge'

export default function HealthBadge({ score, status }) {
  let bg = 'secondary'
  let text = 'dark'
  if (status === 'healthy' || score >= 75) {
    bg = 'success'
    text = 'dark'
  } else if (status === 'warning' || (score >= 50 && score < 75)) {
    bg = 'warning'
    text = 'dark'
  } else if (status === 'critical' || score < 50) {
    bg = 'danger'
    text = 'dark'
  }

  return (
    <Badge pill bg={bg} text={text} className="font-mono-nums px-3 py-2">
      {score}
    </Badge>
  )
}
