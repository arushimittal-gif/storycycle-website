import { useEffect, useRef, useState } from 'react'
import { ReactFlow, Background, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const coreStyle: React.CSSProperties = {
  background: '#FBB03B',
  color: '#25282A',
  border: 'none',
  borderRadius: '999px',
  padding: '14px 22px',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.01em',
  textAlign: 'center',
  width: 170,
}

const outerStyle: React.CSSProperties = {
  background: '#FFFFFF',
  color: '#25282A',
  border: '1px solid rgba(37,40,42,0.14)',
  borderRadius: '999px',
  padding: '11px 16px',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.01em',
  textAlign: 'center',
  width: 132,
}

// Three nodes only — Sales, Marketing, Leadership. When these three tell the
// same story, pipeline converts (Round 2, Issue 01: drop Operations/Designers/
// PR so the graphic speaks to the C-suite buyer, not internal brand coherence).
const NODES: Node[] = [
  { id: 'core',       position: { x: 360, y: 170 }, data: { label: 'Your Core Story' }, style: coreStyle },
  { id: 'sales',      position: { x: 650, y: 50  }, data: { label: 'Sales' },           style: outerStyle },
  { id: 'marketing',  position: { x: 650, y: 290 }, data: { label: 'Marketing' },       style: outerStyle },
  { id: 'leadership', position: { x: 60,  y: 175 }, data: { label: 'Leadership' },      style: outerStyle },
]

const EDGES: Edge[] = [
  { id: 'e1', source: 'core', target: 'sales',      animated: true, style: { stroke: '#FBB03B', strokeWidth: 2 } },
  { id: 'e2', source: 'core', target: 'marketing',  animated: true, style: { stroke: '#FBB03B', strokeWidth: 2 } },
  { id: 'e3', source: 'core', target: 'leadership', animated: true, style: { stroke: '#FBB03B', strokeWidth: 2 } },
]

export function NetworkSpread() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: 420,
        transition: 'opacity 1s ease',
        opacity: visible ? 1 : 0,
        borderRadius: 'var(--radius-frame)',
        overflow: 'hidden',
        border: '1px solid rgba(37,40,42,0.1)',
        background: '#FFFFFF',
      }}
    >
      <ReactFlow
        nodes={NODES}
        edges={EDGES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnDrag={false}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        <Background color="rgba(37,40,42,0.08)" gap={36} size={1} />
      </ReactFlow>
    </div>
  )
}
