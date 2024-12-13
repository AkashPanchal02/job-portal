
import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import useFetch from '@/hooks/useFetch'
import { BarLoader } from 'react-spinners'
import { getMyJobs } from '@/api/apiJobs'
import JobCard from './JobCard'

function CreatedJobs() {
    const { user } = useUser()
    const {fn: fnCreatedJobs, data: createdJobs, loading: loadingCreatedJobs} = useFetch(getMyJobs, {
        recruiter_id: user.id
    })

    useEffect(() => {
        fnCreatedJobs()
    }, [])

    if (loadingCreatedJobs) {
        return <BarLoader width={"100%"} color="#36d7b7" /> 
    }

    return (
        <div>
            <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {createdJobs?.length ? (
                    createdJobs.map((job) => {
                    return ( 
                    <JobCard 
                        key={job.id} 
                        job={job} 
                        onJobSaved={fnCreatedJobs} 
                        isMyJob
                        />)
                    })
                ) : (
                    <div> No jobs found 😢 </div>
                )}
            </div>
        </div>
    )
}

export default CreatedJobs
