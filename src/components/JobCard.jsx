import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {Link } from 'react-router-dom'
import { MapPinIcon, Trash2Icon, Heart } from 'lucide-react'
import { Button } from './ui/Button'
import { saveJob } from '@/api/apiJobs'
import useFetch from '@/hooks/useFetch'
import { deleteJob } from '@/api/apiJobs'
import { BarLoader } from 'react-spinners'

function JobCard({job, isMyJob=false, savedInit=false, onJobSaved=() => {}}) {

    const [saved, setSaved] = useState(savedInit)
    const {fn: fnSavedJob, data: savedJob, loading: loadingSavedJob} = useFetch(saveJob, {
        alreadySaved: saved
    })

    const { user } = useUser()

    const handleSaveJob = async () => {
        await fnSavedJob({
            user_id: user.id,
            job_id: job.id
        })
        onJobSaved()
    }

    const {fn: fnDeleteJob, loading: loadingDeleteJob} = useFetch(deleteJob, {
        job_id: job.id
    })

    const handleDeleteJob = async () => { 
        await fnDeleteJob()
        onJobSaved()
    }
    useEffect(() => {
        if (savedJob !== undefined) setSaved(savedJob?.length > 0)
    }, [savedJob])
  return (
    <div>
        <Card className="h-full flex flex-col">
            {loadingDeleteJob && (
                <BarLoader className='mt-4' width={"100%"} color="#36d7b7" />
            )}
            <CardHeader>
                <CardTitle className="flex justify-between font-bold"> 
                    { job.title } 
                    { isMyJob && (
                        <Trash2Icon color="red" width={18} className='text-red-300 cursor-pointer' onClick={handleDeleteJob}/>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1">
                <div className='flex justify-between'>
                    { job.company && <img src={job.company.logo_url} className="h-6" alt="" /> }
                    <div className='flex gap-2 items-center'> 
                        <MapPinIcon size={15} /> { job.location } 
                    </div>
                </div>

                <hr />
                {job.description.substring(0, job.description.indexOf("."))}
            </CardContent>

            <CardFooter className="flex gap-2">
                <Link to={`/job/${job.id}`} className='flex-1'>
                    <Button variant="secondary" className="w-full"> More Details </Button>
                </Link>
                {!isMyJob && (
                    <Button 
                        variant="outline"
                        width={15}
                        onClick={handleSaveJob}
                        disabled={loadingSavedJob}
                    > 
                        {saved ? (
                            <Heart size={20} stroke="red" fill="red" className='cursor-pointer'/>
                        ):(
                            <Heart size={20} className='cursor-pointer'/>
                        )}
                    </Button>
                )}
                
            </CardFooter>   
        </Card>
    </div>
  )
}

export default JobCard
