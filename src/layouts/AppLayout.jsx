import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'

function AppLayout() {
  return (
    <div>
        <div className='grid-background'></div>
        <main className='min-h-screen container mx-auto'>
            <Header />
            <Outlet /> 
        </main>

        <div className='p-10 text-center bg-gray-950 mt-10 '> Made with love by Akash Panchal</div>
    </div>
  )
}

export default AppLayout
