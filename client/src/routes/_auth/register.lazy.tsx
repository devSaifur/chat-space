import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerSchema,
  RegisterSchema
} from '@server/lib/validators/authValidators'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, Link, useRouter } from '@tanstack/react-router'
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

export const Route = createLazyFileRoute('/_auth/register')({
  component: RegisterPage
})

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

function RegisterPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { register, formState, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: ''
    }
  })

  const { errors } = formState

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (data: RegisterSchema) =>
      await api.auth.register.$post({ json: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'], type: 'all' })
      router.invalidate()
    },
    onError: () => {
      toast.error('Something went wrong, please try again')
    }
  })

  return (
    <Card className="mx-auto mt-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => signUp(data))}>
          <div className="grid gap-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input {...register('name')} placeholder="Max Robinson" />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input {...register('username')} placeholder="max" />
                {errors.username && (
                  <p className="text-red-500">{errors.username.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} placeholder="m@example.com" />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input {...register('password')} type="password" />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
