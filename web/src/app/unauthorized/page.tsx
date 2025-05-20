import Link from "next/link";

export default function UnauthorizedPage() {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
          <p className="mb-6">
            You do not have permission to access this page.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }