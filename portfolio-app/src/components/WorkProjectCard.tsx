export type WorkProject = {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
}

type WorkProjectCardProps = {
  project: WorkProject
}

export function WorkProjectCard({ project }: WorkProjectCardProps) {
  const hasImage = project.image.trim().length > 0

  return (
    <article className="work-card">
      <div className={`work-card-media${hasImage ? '' : ' is-placeholder'}`}>
        {hasImage ? (
          <img src={project.image} alt={project.title} loading="lazy" />
        ) : (
          <span className="work-card-placeholder-label work-card-title" aria-hidden>
            {project.title}
          </span>
        )}
      </div>
      <div className="work-card-body">
        <h3 className="work-card-title">{project.title}</h3>
        <p className="work-card-description">{project.description}</p>
        <ul className="work-card-tech" aria-label={`${project.title} tech stack`}>
          {project.tech.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
