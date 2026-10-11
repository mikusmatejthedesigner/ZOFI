import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { attach } from './director'

/** Předá scénáři navigaci aplikace. */
export function Bridge({ touch }: { touch: boolean }) {
  const nav = useNavigate()
  useEffect(() => attach(nav, touch), [nav, touch])
  return null
}
