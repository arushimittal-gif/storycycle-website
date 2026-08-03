import { useState } from 'react'
import { WebGLConceptShell } from '../components/concepts/WebGLConceptShell'
import { WeaveScene, type WeaveVariant } from '../components/concepts/scenes/WeaveScene'

const VARIANTS: { id: WeaveVariant; label: string }[] = [
  { id: 'roots', label: 'Roots' },
  { id: 'vines', label: 'Vines' },
  { id: 'moss', label: 'Moss' },
]

export function ConceptWeave() {
  const [variant, setVariant] = useState<WeaveVariant>('roots')
  return (
    <>
      <WebGLConceptShell key={variant} scene={<WeaveScene variant={variant} />} tag="Thread / Weave" />
      {/* Organic-register sampler */}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 30, display: 'flex', gap: 6 }}>
        {VARIANTS.map((v) => {
          const active = v.id === variant
          return (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                fontWeight: 700, cursor: 'pointer',
                padding: '7px 14px', borderRadius: 999,
                color: active ? '#25282A' : 'rgba(255,255,255,0.7)',
                background: active ? '#FBB03B' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {v.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
