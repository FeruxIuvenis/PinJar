import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <Card className="border border-border">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
        </div>
        <CardDescription>
          Something went wrong with your authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please try signing up again or contact support if the problem persists.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/sign-up" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Back to Sign Up
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
