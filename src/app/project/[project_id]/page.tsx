import ProjectPage from '~/components/ProjectPage/ProjectPage';

export default function Page({ params }: { params: { project_id: string } }) {
  return <ProjectPage projectId={params.project_id} />;
}
