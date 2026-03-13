import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">
        Welcome to the Bun + React Starter!
      </h1>
      <div className="flex flex-col">
        <Link to="/" className="text-blue-500 underline ml-4">
          Go to Home
        </Link>
        <Link to="/apitest" className="text-blue-500 underline ml-4">
          Go to API Tester
        </Link>
        <Link to="/about" className="text-blue-500 underline ml-4">
          Go to About
        </Link>
      </div>
    </div>
  )
}
