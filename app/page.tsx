import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/sign-up')
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
            Welcome to PinJar, {user.user_metadata?.username || 'User'}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your pin and jar management dashboard will be here soon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Pins</h2>
            <p className="text-muted-foreground">Create and manage your pins</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Jars</h2>
            <p className="text-muted-foreground">Organize pins into jars (boards)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
