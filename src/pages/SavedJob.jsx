import React, { useEffect } from 'react'
import useFetch from '@/hooks/useFetch'
import { getSavedJob } from '@/api/apiJobs'
import { BarLoader } from 'react-spinners'
import { useUser } from '@clerk/clerk-react'
import JobCard from '@/components/JobCard'


function SavedJobs() {
  const { isLoaded } = useUser()
  const {fn: fnSavedJobs, loading: loadingSavedJobs, data: savedJobs} = useFetch(getSavedJob)

  useEffect(() => {
    if (isLoaded) fnSavedJobs()
  }, [isLoaded])

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className='px-10 sm:px-14'>
        <h1 className='gradient-title font-extrabold text-4xl sm:text-7xl text-center pb-8'> Saved Jobs </h1>
        {loadingSavedJobs === false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {savedJobs?.length ? (
            savedJobs.map((saved) => {
              return <JobCard key={saved.id} job={saved?.job} savedInit={true} onJobSaved={fnSavedJobs}/>
            })
          ) : (
            <div> Nothing saved yet! 👀 </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SavedJobs