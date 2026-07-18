import PromotionPage from '~/components/PromotionPage/PromotionPage';

export default function Page({ params }: { params: { promo_id: string } }) {
  return <PromotionPage promotionId={params.promo_id} />;
}
