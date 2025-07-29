// app/login/page.tsx
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold">
          Sign In to Your Studio
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
