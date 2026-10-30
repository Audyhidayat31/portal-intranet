import { getInfoPentingConfig } from '@/lib/info-penting';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LoginPage() {
  const initialInfoPenting = getInfoPentingConfig();

  return <LoginForm initialInfoPenting={initialInfoPenting} />;
}
