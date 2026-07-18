import PressPage from '~/components/PressPage/PressPage';

export default function Page({ params }: { params: { press_id: string } }) {
  return <PressPage pressId={params.press_id} />;
}
