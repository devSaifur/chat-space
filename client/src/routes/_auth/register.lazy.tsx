import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerSchema,
  RegisterSchema
} from '@server/lib/validators/authValidators'
import { createLazyFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { signUp } from '@/lib/auth'
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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { register, formState, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const { errors } = formState

  const handleSignUp = async (data: RegisterSchema) => {
    await signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password
      },
      {
        onRequest: () => {
          setIsLoading(true)
        },
        onSuccess: () => {
          setIsLoading(false)
          toast.success('Account created successfully')
          router.navigate({ to: '/login' })
        },
        onResponse: () => {
          setIsLoading(false)
        }
      }
    )
  }

  return (
    <Card className="mx-auto mt-40 max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => handleSignUp(data))}>
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input {...register('name')} placeholder="Max Robinson" />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
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
            <Button type="submit" disabled={isLoading} className="w-full">
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
