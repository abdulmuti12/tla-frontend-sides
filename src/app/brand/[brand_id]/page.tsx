import BrandPage from '~/components/BrandPage/BrandPage';

export default function Page({ params }: { params: { brand_id: string } }) {
  return <BrandPage semanticBrandName={params.brand_id} />;
}
