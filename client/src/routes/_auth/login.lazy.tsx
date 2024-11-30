import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, loginSchema } from '@server/lib/validators/authValidators'
import { useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createLazyFileRoute('/_auth/login')({
  component: LoginPage
})

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { register, formState, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { errors } = formState

  const login = async (data: LoginSchema) => {
    await signIn.email(
      {
        email: data.email,
        password: data.password
      },
      {
        onRequest: () => {
          setIsLoading(true)
        },
        onError: (ctx) => {
          setIsLoading(false)
          toast.error(ctx.error.message)
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['user'] })
          router.invalidate()
        }
      }
    )
  }

  return (
    <Card className="mx-auto mt-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(login)}>
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                placeholder="m@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                {...register('password')}
                type="password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              Login
            </Button>
          </div>
        </form>
        <div className="mt-8 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
