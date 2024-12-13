
import { getJobs } from '@/api/apiJobs'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import React, { useEffect, useState } from 'react'
import JobCard from '@/components/JobCard'
import { getCompanies } from '@/api/apiCompanies'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
// import { State } from 'country-state-city'


function JobListing() {

  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [company_id, setCompany_id] = useState("")

  const { isLoaded } = useUser()
  const { fn: fnJobs, data: jobs, loading: loadingJobs } = useFetch(getJobs, { location, company_id, searchQuery })

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies)
  
  useEffect(() => {
    if (isLoaded) fnCompanies()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])
  

  useEffect(() => {
    if (isLoaded) fnJobs()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery])
 
  const handleSearch = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)
    const query = formData.get("search-query")
    if (query) setSearchQuery(query)
  }

  const clearFilters = () => {
    setCompany_id("")
    setLocation("")
    setSearchQuery("")
  }
  
  if (!isLoaded){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/> 
  }
  
  return (
    <div className='px-10 sm:px-14'>
      <h1 className='gradient-title font-extrabold text-4xl sm:text-7xl text-center pb-8 mt-5'> 
        Latest Jobs 
      </h1>

      {/* Add Filters here */} 
      <form onSubmit={handleSearch} action="" className='h-14 flex w-full gap-3 items-center mb-3'>
        <Input 
          type="text"
          placeholder="Search jobs by title"
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />    
        <Button variant="blue" className="h-full sm:w-28" type="submit"> Search </Button>
      </form>

      {/* <div className="flex flex-col sm:flex-row gap-3">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({name}) => {
                return (
                  <SelectItem key={name} value={name}> {name} </SelectItem> 
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({name, id}) => {
                return <SelectItem key={name} value={id}> {name} </SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="destructive" className="sm:w-1/2" onClick={clearFilters}> Clear Filters </Button>
      </div> */}

      {loadingJobs && (
        <BarLoader className='mt-4' width={"100%"} color='#36d7b7'/>
      )}

      {loadingJobs === false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobs?.length ? (
            jobs.map((job) => {
              return <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
            })
          ) : (
            <div> No jobs found 😢 </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobListing

