import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading component that displays a skeleton UI while the page is loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero section skeleton */}
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row items-center justify-center">
            <div className="md:w-1/2 text-center">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-8 w-48 mx-auto mb-6" />
              <Skeleton className="h-10 w-40 mx-auto rounded-full" />
              <div className="flex justify-center space-x-4 mt-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full" />
                ))}
              </div>
            </div>
            <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
              <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* About section skeleton */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-40 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Experience section skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-64 mx-auto mb-12" />
          <div className="space-y-12">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Projects section skeleton */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-48 mx-auto mb-12 bg-gray-700" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 bg-gray-800">
                  <Skeleton className="h-6 w-3/4 mb-4 bg-gray-700" />
                  <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-5/6 mb-4 bg-gray-700" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-8 w-8 rounded-full bg-gray-700" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education section skeleton */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-40 mx-auto mb-12" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </section>

      {/* Skills section skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-32 mx-auto mb-12" />
          <div className="flex flex-wrap justify-center gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section skeleton */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <Skeleton className="h-10 w-40 mx-auto mb-8" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            </div>
            <Skeleton className="h-14 w-40 mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer skeleton */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Skeleton className="h-4 w-48 mb-4 md:mb-0 bg-gray-700" />
            <div className="flex space-x-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-24 bg-gray-700" />
              ))}
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-6 rounded-full bg-gray-700" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

