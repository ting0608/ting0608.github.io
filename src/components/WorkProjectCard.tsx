import type { MouseEvent } from 'react'
import { scrollToSection } from '../hooks/useSmoothScroll'

export type WorkProject = {
  id: string
  title: string
  description?: string
  image: string
  /** External URL or in-page hash (e.g. #quotes). Omit for project-eight (home). */
  url?: string
  tech: string[]
}

type WorkProjectCardProps = {
  project: WorkProject
}

function getProjectHref(project: WorkProject): string | null {
  if (project.id === 'project-eight') return '#hero'

  const url = project.url?.trim()
  if (!url) return null

  return url
}

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

function handleCardClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return

  event.preventDefault()
  const sectionId = href.slice(1)
  scrollToSection(sectionId)
}

export function WorkProjectCard({ project }: WorkProjectCardProps) {
  const hasImage = project.image.trim().length > 0
  const href = getProjectHref(project)
  const external = href ? isExternalHref(href) : false

  const content = (
    <>
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
        {project.description ? (
          <p className="work-card-description">{project.description}</p>
        ) : null}
        <ul className="work-card-tech" aria-label={`${project.title} tech stack`}>
          {project.tech.filter(Boolean).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </>
  )

  if (!href) {
    return <article className="work-card">{content}</article>
  }

  return (
    <a
      href={href}
      className="work-card work-card--link"
      aria-label={`${project.title}${external ? ' (opens in new tab)' : ''}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={(event) => handleCardClick(event, href)}
    >
      {content}
    </a>
  )
}
