
import React, { useEffect } from 'react'
import { getApplications } from '@/api/apiApplications'
import { BarLoader } from 'react-spinners'
import ApplicationCard from '@/components/ApplicationCard'
import { useUser } from '@clerk/clerk-react'
import useFetch from '@/hooks/useFetch'



function CreatedApplications() {
    const { user } = useUser()

    const {fn: fnApplications, loading: loadingApplications, data: applications} = useFetch(getApplications, {user_id: user.id})

    useEffect(() => { fnApplications() }, [])
     
    if (loadingApplications) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }

    return (
        <div className='flex flex-col gap-2'>
            {applications?.map((application) => {
            return (
                <ApplicationCard 
                    key={application.id} 
                    application={application} 
                    isCandidate
                />
            )})}
        </div>
    )
}

export default CreatedApplications
