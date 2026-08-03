import { WebGLConceptShell } from '../components/concepts/WebGLConceptShell'
import { OrbitalScene } from '../components/concepts/scenes/OrbitalScene'

export function ConceptOrbital() {
  return <WebGLConceptShell scene={<OrbitalScene />} tag="Orbital" />
}
