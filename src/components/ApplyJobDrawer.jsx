import React from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/Drawer"
import { Button } from '@/components/ui/Button'
import { Input } from './ui/Input'
import { Label } from "@/components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller } from 'react-hook-form'
import useFetch from '@/hooks/useFetch'
import { applyToJob } from '@/api/apiApplications'
import { BarLoader } from 'react-spinners' 

const schema = z.object({
  experience: z.number().min(1, { message: "Experience must be atleast 1 year"}).int(),
  skills: z.string().min(1, {message: "Skills are required."}),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {message: "Education is required"}),
  resume: z.any().refine(
    (file) => file[0] && (
      file[0].type === "application/pdf" || file[0].type === "application/msword"
    ), {message: "Only PDF and WORD documents allowed"}
  )
})

function ApplyJobDrawer({job, user, applied=false, fetchJob}) {
  const { register, handleSubmit, control, formState: {errors}, reset } = useForm({ 
    resolver: zodResolver(schema)
  })

  const { fn: fnApply, loading: loadingApply, error: errorApply } = useFetch(applyToJob)

  const onSubmit = (data) => {
    fnApply({
      ...data, 
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "Applied", // Comes from supabase where enums are created. Case sensitive
      resume: data.resume[0]
    }).then(() => {
      fetchJob()
      reset()
    })
  }
  return (
    <div>
      <Drawer open={applied ? false : undefined }>
        <DrawerTrigger asChild className="w-full">
          <Button size="lg"
            variant={job?.isOpen && !applied ? "green": "destructive"}
            disabled={!job?.isOpen || applied}  
          >
            {job?.isOpen ? (applied? "Applied Successfully": "Apply") : "Hiring Closed"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Apply for { job?.title } at { job?.company?.name }</DrawerTitle>
            <DrawerDescription>Please fill the form below </DrawerDescription>
          </DrawerHeader>

          <form action="" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
            <Input
              type="number"
              placeholder="Years of experience"
              className="flex-1"
              {...register("experience", { valueAsNumber: true })}
            /> 

            {/* Prints error mesage after every input. If any */}
            {errors.experience && (
              <p className='text-red-500'> {errors.experience.message} </p>
            )}
            
            <Input
              type="text"
              placeholder="Write skills here (Comma seperated)"
              className="flex-1"
              {...register("skills")}
            /> 
            {errors.skills && (
              <p className='text-red-500'> {errors.skills.message} </p>
            )}

            <Controller 
              name="education"
              control={control}
              render={({field}) => (
                <RadioGroup onValueChange={field.onChange} {...field}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Graduate" id="graduate" />
                    <Label htmlFor="graduate">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                    <Label htmlFor="post-graduate">Post Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className='text-red-500'> {errors.education.message} </p>
            )}

            <Input 
              type="file"
              accept=".pdf, .docx, .doc"
              className="flex-1 file:text-gray-500"
              {...register("resume")}
            />
            {errors.resume && (
              <p className='text-red-500'> {errors.resume.message} </p>
            )}

            {errorApply?.message && (
              <p className='text-red-500'> {errorApply?.message} </p>
            )}

            { loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

            <Button variant="blue" size="lg"> Apply </Button>

          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="submit" variant="outline" size="lg"> Cancel </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>  
    </div>
  )
}

export default ApplyJobDrawer
