import { lazy, Suspense } from 'react'
import { Route, Switch } from 'wouter'

import { PageLoader } from '@/components/page-loader'

const LoadHomePage = lazy(() => import('./pages/index'))
const LoadLoginPage = lazy(() => import('./pages/login'))
const LoadRegisterPage = lazy(() => import('./pages/register'))

const HomePage = () => (
  <Suspense fallback={<PageLoader />}>
    <LoadHomePage />
  </Suspense>
)

const LoginPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LoadLoginPage />
  </Suspense>
)

const RegisterPage = () => (
  <Suspense fallback={<PageLoader />}>
    <LoadRegisterPage />
  </Suspense>
)

export const App = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={RegisterPage} />
    <Route>404: No such page!</Route>
  </Switch>
)
