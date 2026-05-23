import type { WorkProject } from '../components/WorkProjectCard'
import { workProjectImages } from './workProjectImages'
import workProjectsJson from './workProjects.json'

type WorkProjectJson = Omit<WorkProject, 'image'> & {
  /** Image key from workProjectImages.ts, or "" for placeholder */
  image: string
}

export const workProjects: WorkProject[] = (workProjectsJson as WorkProjectJson[]).map(
  (project) => ({
    ...project,
    image: project.image ? (workProjectImages[project.image] ?? '') : '',
  }),
)
