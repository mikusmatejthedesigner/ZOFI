import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronRight, Download } from 'lucide-react'
import { PLANS, USER, kc } from '../../data/catalog'
import { progress } from '../../lib/progress'
import { useTitle, useToast } from '../hooks'

const OFF = 'V prototypu zatím nefunguje.'

export function Account() {
  useTitle('Účet')
  const toast = useToast()
  const nav = useNavigate()
  const [notify, setNotify] = useState({ videos: true, news: false })
  const plan = PLANS[USER.plan]

  const [renewStr] = useState(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' })
  })

  return (
    <div className="page narrow">
      <header className="page-head">
        <h1 className="large-title">Účet</h1>
      </header>

      <section className="profile">
        <span className="avatar xl">
          {USER.first[0]}
          {USER.last[0]}
        </span>
        <div>
          <h2>
            {USER.first} {USER.last}
          </h2>
          <p>{USER.email}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => toast(OFF)}>
          Upravit
        </button>
      </section>

      <Group title="Předplatné">
        <Row label="Plán" value={`${plan.name} · ${kc(plan.price)} / ${plan.unit}`} />
        <Row label="Obnoví se" value={renewStr} />
        <Row label="Změnit plán" onClick={() => toast(OFF)} chevron />
        <Row label="Zrušit předplatné" onClick={() => toast(OFF)} danger />
      </Group>

      <Group title="Platby">
        <Row label="Platební karta" value="Visa •••• 4242" onClick={() => toast(OFF)} chevron />
        <Row
          label="Faktura 2026-0142"
          value={kc(plan.price)}
          onClick={() => toast(OFF)}
          icon={<Download aria-hidden />}
        />
      </Group>

      <Group title="Oznámení" note="Posíláme jen to podstatné, nejvýš jednou týdně.">
        <Row label="Nová videa e-mailem">
          <Switch on={notify.videos} onChange={(v) => setNotify({ ...notify, videos: v })} label="Nová videa e-mailem" />
        </Row>
        <Row label="Novinky a akce ZOFI">
          <Switch on={notify.news} onChange={(v) => setNotify({ ...notify, news: v })} label="Novinky a akce ZOFI" />
        </Row>
      </Group>

      <Group title="Průběh" note="Průběh se v prototypu ukládá jen v tomto prohlížeči.">
        <Row
          label="Smazat průběh kurzů"
          danger
          onClick={() => {
            if (window.confirm('Opravdu smazat průběh všech kurzů?')) {
              progress.reset()
              toast('Průběh je smazaný.')
            }
          }}
        />
      </Group>

      <Group>
        <Row label="Odhlásit se" onClick={() => nav('/')} danger />
      </Group>
    </div>
  )
}

function Group({ title, note, children }: { title?: string; note?: string; children: ReactNode }) {
  return (
    <section className="group">
      {title && <h2 className="group-title">{title}</h2>}
      <div className="group-box">{children}</div>
      {note && <p className="group-note">{note}</p>}
    </section>
  )
}

function Row({
  label,
  value,
  onClick,
  chevron,
  danger,
  icon,
  children,
}: {
  label: string
  value?: string
  onClick?: () => void
  chevron?: boolean
  danger?: boolean
  icon?: ReactNode
  children?: ReactNode
}) {
  const inner = (
    <>
      <span className="row-label">{label}</span>
      {value && <span className="row-value">{value}</span>}
      {children}
      {icon}
      {chevron && <ChevronRight className="row-chev" aria-hidden />}
    </>
  )
  const cls = `row${danger ? ' danger' : ''}`
  return onClick ? (
    <button className={cls} onClick={onClick}>
      {inner}
    </button>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className={`switch${on ? ' on' : ''}`} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
      <i />
    </button>
  )
}
