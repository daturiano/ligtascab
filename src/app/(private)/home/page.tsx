import { getOperator } from '@/db/db';
import Header from '@/features/home/components/header';

export default async function HomePage() {
  const operator = await getOperator();
  if (!operator) return null;
  return (
    <div>
      <Header operator={operator} />
    </div>
  );
}
