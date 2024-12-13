import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleJob, updateHiringtatus } from '@/api/apiJobs'
import useFetch from '@/hooks/useFetch'
import { BarLoader } from 'react-spinners'
import { BriefcaseBusiness, DoorOpen, DoorClosed, MapPinIcon } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ApplyJobDrawer from '@/components/ApplyJobDrawer'
import ApplicationCard from '@/components/ApplicationCard'


function JobPage() {
  const { isLoaded, user } = useUser()
  const { id } = useParams()
  const { fn: fnJob, loading: loadingJob, data: job } = useFetch(getSingleJob, { job_id: id })
  const { fn: fnHiringStatus, loading: loadingHiringStatus } = useFetch(updateHiringtatus, { job_id: id })

  const handleStatusChange = (value) => {
    const isOpen = value === "open"
    fnHiringStatus(isOpen).then(() => fnJob())
  }

  useEffect(() => {
    if (isLoaded) fnJob()
  }, [isLoaded])

  

  if (!isLoaded || loadingJob) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
  }
  return (
    <div className='px-10 sm:px-14 flex flex-col gap-8 mt-5'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'> {job?.title} </h1>
        <img src={job?.company?.logo_url} className='h-12' alt={job?.title} />
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <MapPinIcon />
          {job?.location} 
        </div>
        
        <div className='flex gap-2'>
          <BriefcaseBusiness />
          {job?.applications?.length} Applicants 
        </div>

        <div className='flex gap-2'>
          {job?.isOpen ? (<> <DoorOpen /> Currently Hiring </>) : (<> <DoorClosed /> Closed </>)}
        </div>
      </div>


      {/* hiring status */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#37d7b7" />}
      {job?.recruiter_id === user?.id && 
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950": "bg-red-950"}`}>
            <SelectValue
              placeholder={"Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")}
              />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open"> Open </SelectItem>
            <SelectItem value="closed"> Closed </SelectItem>
          </SelectContent>
        </Select>
      }
      

      <h2 className='text-2xl sm:text-3xl font-bold'> What we are looking for
        <MDEditor.Markdown source={job?.description} className='mt-5 bg-transparent sm:text-lg'/>
      </h2>      
      <h2 className='text-2xl sm:text-3xl font-bold'> Must have skills </h2>
      <p className='sm:text-md'>{job?.requirements} </p>
      
      {/* render applications */}
      
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer  
          job={job} user={user} fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
      
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl sm:text-3xl font-bold'> Applications </h2>
          {job?.applications.map((application) => {
            return <ApplicationCard key={application.id} application={application} />
          })}
        </div>
      )}
    </div>
  )
}

export default JobPage
