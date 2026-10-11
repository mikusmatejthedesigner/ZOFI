import { useEffect, type RefObject } from 'react'

/* České typografické mezery: jednopísmenné předložky a spojky, číslo + jednotka.
   Nahrazuje mezeru nezlomitelnou, aby nezůstávaly na konci řádku. */
export const NBSP = String.fromCharCode(160)
const PREP = /(?<=^|[\s(„])([ksvzouaiKSVZOUAI])\s+/g
const UNIT = /(\d)\s+(Kč|min|h|s|lekce|lekcí|videí|videa|kurzy|kurzů|%|m²|mm|cm|dnů|z)(?=[\s.,)]|$)/g

/** Opraví mezery v řetězci (pro text, který se dál dělí na slova). */
export const cz = (s: string) => s.replace(PREP, `$1${NBSP}`).replace(UNIT, `$1${NBSP}$2`)

function fixNode(n: Text) {
  const s = n.nodeValue ?? ''
  const t = cz(s)
  if (t !== s) n.nodeValue = t
}

function fixTree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return fixNode(root as Text)
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(n.parentNode?.nodeName ?? '')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  })
  let n: Node | null
  while ((n = w.nextNode())) fixNode(n as Text)
}

/** Hlídá strom pod `ref` a opravuje text i po každém překreslení. */
export function useCzechTypography(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    fixTree(root)
    const mo = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === 'characterData') fixNode(m.target as Text)
        else m.addedNodes.forEach(fixTree)
      }
    })
    mo.observe(root, { subtree: true, childList: true, characterData: true })
    return () => mo.disconnect()
  }, [ref])
}
