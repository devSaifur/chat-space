import { valibotResolver } from '@hookform/resolvers/valibot'
import { LoginSchema, loginSchema } from '@server/lib/validators/authValidators'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { api } from '@/lib/api'
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
  const queryClient = useQueryClient()

  const { register, formState, handleSubmit } = useForm<LoginSchema>({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { errors } = formState

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: LoginSchema) =>
      api.auth.login.$post({ json: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      toast.error('Something went wrong, please try again')
    }
  })

  return (
    <Card className="mx-auto mt-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => login(data))}>
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
            <Button type="submit" disabled={isPending} className="w-full">
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
