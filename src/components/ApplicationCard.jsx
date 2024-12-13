
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card'
import { Boxes, BriefcaseBusiness, Download, School } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { updateApplicationStatus } from '@/api/apiApplications'
import { BarLoader } from 'react-spinners'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


function ApplicationCard({ application, isCandidate=false}) {
    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = application?.resume
        link.target = "_blank"
        link.click()
    }
    
    const {loading: loadingHiringStatus, fn: fnHiringStatus, } = useFetch(updateApplicationStatus, {
        job_id: application.job_id
    })

    const handleStatusChange = (status) => {
        fnHiringStatus(status)
    }

  return (
    <Card>
        {loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7'/>}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {isCandidate ?
                `${application?.job?.title} at ${application?.job?.company?.name}` : application?.name
                }
                <Download 
                    className='bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer'
                    size={18}
                    onClick={handleDownload}
                /> 
            </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 flex-1">
            <div className='flex flex-col md:flex-row justify-between'>
                <div className='flex items-center gap-2'> <BriefcaseBusiness size={15}/>
                    {application?.experience} years of experience 
                </div>
                <div className='flex items-center gap-2'> <School size={15}/>{application?.education}</div>
                <div className='flex items-center gap-2'> <Boxes size={15}/>{application?.skills}</div>
            </div>
            <hr />
        </CardContent>
        <CardFooter className="flex justify-between">
            <span>{new Date(application?.created_at).toLocaleString()}</span>
            {isCandidate ? (
                    <span className='capitalize font-bold'>Status: {application?.status} </span>
                ) : (
                    <Select onValueChange={handleStatusChange} defaultValue={application.status}>
                        <SelectTrigger className="w-52">
                        <SelectValue
                            placeholder="Application Status"
                        />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Applied"> Applied </SelectItem>
                            <SelectItem value="Interviewing"> Interviewing </SelectItem>
                            <SelectItem value="Hired"> Hired </SelectItem>
                            <SelectItem value="Rejected"> Rejected </SelectItem>
                        </SelectContent>
                    </Select>
                )
            }
        </CardFooter>
    </Card>
  )
}

export default ApplicationCard
