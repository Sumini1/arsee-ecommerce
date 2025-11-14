
import AddOrderItem from './_components/add-order-item';

export const metadata = {
  title: "Arsee Wears | Detail Order",
};

export default async  function AddOrderItemrPage({
  params,
}: {
  params:  Promise<{ id: string }>;   
}) {
const { id } = await params;

  return <AddOrderItem id={id} />;
}
