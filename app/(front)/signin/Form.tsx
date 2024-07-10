'use client'
import { signIn, useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import animationData from '@/components/loading.json'
import Lottie from 'react-lottie'

type Inputs = {
  email: string
  password: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  let callbackUrl = params.get('callbackUrl') || '/'
  const router = useRouter()

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form
    signIn('credentials', {
      email,
      password,
    })
  }
  return (
    <div style={{paddingTop:'100px'}}>
      {session && session.user && (
        <div className="h-full flex justify-center items-center w-full">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
      <div className="max-w-sm  mx-auto card bg-base-300 my-4">
        {!(session && session.user) && (
          <div className="card-body">
            <h1 className="card-title text-center">Sign in</h1>
            {params.get('error') && (
              <div className="alert text-error">
                {params.get('error') === 'CredentialsSignin'
                  ? 'Invalid email or password'
                  : params.get('error')}
              </div>
            )}
            {params.get('success') && (
              <div className="alert text-success">{params.get('success')}</div>
            )}
            <form onSubmit={handleSubmit(formSubmit)}>
              <div className="my-2">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                      message: 'Email is invalid',
                    },
                  })}
                  className="input input-bordered w-full max-w-sm"
                />
                {errors.email?.message && (
                  <div className="text-error">{errors.email.message}</div>
                )}
              </div>
              <div className="my-2">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="input input-bordered w-full max-w-sm"
                />
                {errors.password?.message && (
                  <div className="text-error">{errors.password.message}</div>
                )}
              </div>
              <div className="my-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full"
                >
                  {isSubmitting && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Sign in
                </button>
              </div>
            </form>
            <div className="divider"></div>
            <div>
              Need an account?{' '}
              <Link
                className="link"
                href={`/register?callbackUrl=${callbackUrl}`}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Form
