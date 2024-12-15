import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/Carousel"
import companies from '../data/companies.json'
import faqs from '../data/faqs.json'
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"

function LandingPage() {  
  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20'>
      <section className='text-center'>
        <h1 className='flex flex-col justify-center items-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4'> Find your dream job {" "} <span className='flex items-center gap-2 sm:gap-6'> and get {" "} <img src="/logo.png" alt="Hirrd logo" className='h-14 sm:h-24 lg:h-32' /></span></h1>
        <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
          Explore thousands of job listings or find the perfect candidate.
        </p>
      </section>


      <div className='flex gap-6 justify-center buttons'>
        <Link to="/jobs"> <Button variant="blue" size="xl">Find Jobs</Button></Link>
        <Link to="/post-job"> <Button variant="green" size="xl">Post Job</Button></Link>
      </div>

        {/* carasouel */}

      <Carousel className="w-full py-10 px-10 sm:px-14" 
        plugins={ [Autoplay({ delay: 2000 })] } 
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {
            companies.map(({name, id, path}) => {
              return <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img 
                  src={path} alt={name} className='h-9 sm:h-14 object-contain' 
                />
              </CarouselItem>
            })
          }
        </CarouselContent>
      </Carousel>

      {/* banner */}
      <div>
        <img src="/banner.jpeg" alt="" className='w-full'/>
      </div>

      <section className='grid grid-cols-1 md:grid-cols-2 gap-4 px-10 sm:px-14'>
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers </CardTitle>
          </CardHeader>
          <CardContent> Search and apply for jobs, track applications and more </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Employers </CardTitle>
          </CardHeader>
          <CardContent> Post Jobs, Manage Applications and find the best candidate </CardContent>
        </Card>
      </section>

      {/* Accordian */}

      <Accordion type="single" className='px-10 sm:px-14 background' collapsible>
        {
          faqs.map((faq, index) => {
            return (
            <AccordionItem key={index} value={`item-${index+1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent> {faq.answer} </AccordionContent>
            </AccordionItem>
            );
          })
        }
      </Accordion>
    </main>
  )
}

export default LandingPage
