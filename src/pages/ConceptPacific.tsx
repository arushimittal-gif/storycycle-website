import { WebGLConceptShell } from '../components/concepts/WebGLConceptShell'
import { PacificScene } from '../components/concepts/scenes/PacificScene'

export function ConceptPacific() {
  // Tighter macro DoF for the intimate ground-level opening beats
  return <WebGLConceptShell scene={<PacificScene />} tag="Pacific NW" dofFocus={0.022} dofFocal={0.018} dofBokeh={3.8} />
}
