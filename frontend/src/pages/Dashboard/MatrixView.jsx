import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { useNavigate } from 'react-router-dom'

function tileColor(tank) {
  if (tank.status === 'critical' || tank.healthScore < 50) return 'var(--color-critical)'
  if (tank.status === 'warning' || tank.healthScore < 75) return 'color-mix(in oklab, var(--color-warning), transparent 10%)'
  return 'var(--color-healthy)'
}

export default function MatrixView({ tanks }) {
  const navigate = useNavigate()

  return (
    <div
      className="row row-cols-2 row-cols-sm-3 row-cols-lg-6 g-3"
      aria-label="Tank health matrix"
    >
      {tanks.map((tank) => (
        <div className="col" key={tank.id}>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tip-${tank.id}`}>
                <div className="small text-start">
                  <div className="fw-semibold">{tank.name}</div>
                  <div>
                    {tank.clicksPerMinute} cpm · baseline {tank.baselineClicks}
                  </div>
                  <div>
                    {tank.temperature.toFixed(1)}°C · DO {tank.dissolvedOxygen.toFixed(1)}
                  </div>
                </div>
              </Tooltip>
            }
          >
            <button
              type="button"
              className="matrix-cell w-100 border-0 rounded-3 p-3 text-start"
              style={{
                background: tileColor(tank),
                color: tank.healthScore >= 50 && tank.status !== 'critical' ? '#111' : '#231e19',
              }}
              onClick={() => navigate(`/tank/${tank.id}`)}
            >
              <div className="small text-uppercase opacity-75">{tank.name}</div>
              <div className="display-6 font-mono-nums mb-0 lh-1">{tank.healthScore}</div>
              <div className="small mt-1">{tank.species}</div>
            </button>
          </OverlayTrigger>
        </div>
      ))}
    </div>
  )
}
