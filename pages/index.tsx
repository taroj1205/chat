import Link from 'next/link'

const Index = () => {
  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <div className="border-teal p-8 border-t-12 mb-6 rounded-lg shadow-lg bg-gray-900">
          <div className="mb-4">
            <h1 className="font-bold text-3xl text-white mb-2">Welcome to My Chat App!</h1>
            <p className="text-gray-400 text-lg mb-4">Start using the app by signing up or logging in.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/auth" className="bg-indigo-700 hover:bg-teal text-white py-2 px-4 rounded text-center transition duration-150 hover:bg-indigo-600 hover:text-white">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index