/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ProtectedImport } from './routes/_protected'
import { Route as AuthImport } from './routes/_auth'
import { Route as ProtectedIndexImport } from './routes/_protected/index'

// Create Virtual Routes

const AuthRegisterLazyImport = createFileRoute('/_auth/register')()
const AuthLoginLazyImport = createFileRoute('/_auth/login')()

// Create/Update Routes

const ProtectedRoute = ProtectedImport.update({
  id: '/_protected',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const ProtectedIndexRoute = ProtectedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ProtectedRoute,
} as any)

const AuthRegisterLazyRoute = AuthRegisterLazyImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/register.lazy').then((d) => d.Route),
)

const AuthLoginLazyRoute = AuthLoginLazyImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => AuthRoute,
} as any).lazy(() => import('./routes/_auth/login.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_protected': {
      id: '/_protected'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ProtectedImport
      parentRoute: typeof rootRoute
    }
    '/_auth/login': {
      id: '/_auth/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AuthLoginLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/register': {
      id: '/_auth/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof AuthRegisterLazyImport
      parentRoute: typeof AuthImport
    }
    '/_protected/': {
      id: '/_protected/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof ProtectedIndexImport
      parentRoute: typeof ProtectedImport
    }
  }
}

// Create and export the route tree

interface AuthRouteChildren {
  AuthLoginLazyRoute: typeof AuthLoginLazyRoute
  AuthRegisterLazyRoute: typeof AuthRegisterLazyRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthLoginLazyRoute: AuthLoginLazyRoute,
  AuthRegisterLazyRoute: AuthRegisterLazyRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

interface ProtectedRouteChildren {
  ProtectedIndexRoute: typeof ProtectedIndexRoute
}

const ProtectedRouteChildren: ProtectedRouteChildren = {
  ProtectedIndexRoute: ProtectedIndexRoute,
}

const ProtectedRouteWithChildren = ProtectedRoute._addFileChildren(
  ProtectedRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof ProtectedRouteWithChildren
  '/login': typeof AuthLoginLazyRoute
  '/register': typeof AuthRegisterLazyRoute
  '/': typeof ProtectedIndexRoute
}

export interface FileRoutesByTo {
  '': typeof AuthRouteWithChildren
  '/login': typeof AuthLoginLazyRoute
  '/register': typeof AuthRegisterLazyRoute
  '/': typeof ProtectedIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth': typeof AuthRouteWithChildren
  '/_protected': typeof ProtectedRouteWithChildren
  '/_auth/login': typeof AuthLoginLazyRoute
  '/_auth/register': typeof AuthRegisterLazyRoute
  '/_protected/': typeof ProtectedIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/login' | '/register' | '/'
  fileRoutesByTo: FileRoutesByTo
  to: '' | '/login' | '/register' | '/'
  id:
    | '__root__'
    | '/_auth'
    | '/_protected'
    | '/_auth/login'
    | '/_auth/register'
    | '/_protected/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthRoute: typeof AuthRouteWithChildren
  ProtectedRoute: typeof ProtectedRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AuthRoute: AuthRouteWithChildren,
  ProtectedRoute: ProtectedRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/_protected"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/login",
        "/_auth/register"
      ]
    },
    "/_protected": {
      "filePath": "_protected.tsx",
      "children": [
        "/_protected/"
      ]
    },
    "/_auth/login": {
      "filePath": "_auth/login.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/register": {
      "filePath": "_auth/register.lazy.tsx",
      "parent": "/_auth"
    },
    "/_protected/": {
      "filePath": "_protected/index.tsx",
      "parent": "/_protected"
    }
  }
}
ROUTE_MANIFEST_END */
