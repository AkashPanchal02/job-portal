import React, {useEffect} from 'react'
import { addNewJob } from '@/api/apiJobs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { State } from "country-state-city";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useUser } from '@clerk/clerk-react';
import { getCompanies } from '@/api/apiCompanies'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/useFetch'
import { Navigate, useNavigate } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import MDEditor from '@uiw/react-md-editor'
import AddCompanyDrawer from '@/components/AddCompanyDrawer'


const schema = z.object({
  title: z.string().min(1, {messsage: "Title is required"}),
  description: z.string().min(1, {messsage: "Description is required"}),
  location: z.string().min(1, {messsage: "Select a valid location "}),
  company_id: z.string().min(1, {messsage: "Select or add a new company"}),
  requirements: z.string().min(1, {messsage: "Requirements is required"}),

})

function PostJob() {
  const { isLoaded, user } = useUser()
  const navigate = useNavigate()
  const { register, control, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: ""
    },
    resolver: zodResolver(schema)
  })

  const { fn: fnCompanies, data: companies, loading: loadingCompanies } = useFetch(getCompanies)

  useEffect(() => {
      if (isLoaded) fnCompanies()
    }, [isLoaded])
  
  const { fn: fnCreateJob, error: errorCreateJob, data: dataCreateJob, loading: loadingCreateJob } = useFetch(addNewJob)

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true
    })
  }

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate('/jobs')
  }, [loadingCreateJob])

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" /> 
  }


  if (user?.unsafeMetadata?.role !== 'recruiter'){
    return <Navigate to="/jobs" />
  }  
  return (
    <div className=''>
      <h1 className='gradient-title font-extrabold text-4xl sm:text-7xl text-center pb-8'>
        Post a Job
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} action="" className='flex flex-col gap-4 p-4 pb-0'>
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && (
          <p className='text-red-500'> {errors.title.message}</p>
        )}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className='text-red-500'> {errors.description.message}</p>
        )}

        <div className='flex gap-4 items-center'>
        <Controller 
          name="location"
          control={control}
          render={({field}) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({name}) => {
                    return <SelectItem key={name} value={name}> {name} </SelectItem>
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

        <Controller 
          name="company_id"
          control={control}
          render={({field}) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Company Name">
                  {
                    field.value? 
                    companies?.find((com) => com.id === Number(field.value))
                    ?.name : "Company"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies?.map(({name, id}) => {
                    return <SelectItem key={name} value={id}> {name} </SelectItem>
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

        {/* Add company drawer */}
        
        <AddCompanyDrawer fetchCompanies={fnCompanies} />

        </div>
        {errors.location && (
          <p className='text-red-500'> {errors.location.message} </p>
        )}

        {errors.company_id && (
          <p className='text-red-500'> {errors.company_id.message} </p>
        )}
        

        <Controller 
          name="requirements"
          control={control}
          render={({ field }) =>  (
            <MDEditor value={field.value} onChange={field.onChange} />
          )} 
        />
        
        {errors.requirements && (
          <p className='text-red-500'> {errors.requirements.message} </p>
        )}

        {errors.errorCreateJob && (
          <p className='text-red-500'> {errorCreateJob?.message} </p>
        )}

        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button variant="blue" type="submit" size="lg" className="mt-2"> Submit </Button>
      </form>
    </div>
  )
}

export default PostJob