import { RevealText } from '../components/RevealText'
import { WorkProjectCard } from '../components/WorkProjectCard'
import { workProjects } from '../data/workProjects'

export function WorkSection() {
  return (
    <section id="work" className="section work-section">
      <div className="section-inner work-section-inner">
        <RevealText as="h2" delay={0}>
          What I have done / working on
        </RevealText>
        <ul className="work-grid">
          {workProjects.map((project, index) => (
            <li key={project.id}>
              <RevealText delay={80 + index * 60}>
                <WorkProjectCard project={project} />
              </RevealText>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
