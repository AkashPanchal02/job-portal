
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import JobListing from './pages/JobListing'
import JobPage from './pages/JobPage'
import PostJob from './pages/PostJob'
import SavedJobs from './pages/SavedJob'
import MyJobs from './pages/MyJobs'
import { ThemeProvider } from './components/theme-provider'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <AppLayout/>, 
    children: [
      {
        path: '/',
        element: <LandingPage/>
      },
      {
        path: '/onboarding',
        element: (
          <ProtectedRoute> 
            <Onboarding />
          </ProtectedRoute>
        ) 
      },
      {
        path: '/jobs',
        element: (
          <ProtectedRoute> 
            <JobListing />
          </ProtectedRoute>
        )
      },
      {
        path: '/job/:id',
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/post-job',
        element: (
          <ProtectedRoute> 
            <PostJob />
          </ProtectedRoute>
        )
      },
      {
        path: '/saved-jobs',
        element: (
          <ProtectedRoute> 
            <SavedJobs />
          </ProtectedRoute>
        )
      },
      {
        path: '/my-jobs',
        element: (
          <ProtectedRoute> 
            <MyJobs />
          </ProtectedRoute>
        )
      }
    ]
  }
])

function App() {

  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}



// const router = createBrowserRouter([
//   {
//     element: <AppLayout/>, 
//     children: [
//       {
//         path: '/',
//         element: <LandingPage/>
//       },
//       {
//         path: '/onboarding',
//         element: 
//             <Onboarding />
//       },
//       {
//         path: '/jobs',
//         element:
//             <JobListing />


//       },
//       {
//         path: '/job/:id',
//         element: 

//             <JobPage />

        
//       },
//       {
//         path: '/post-job',
//         element: 

//             <PostJob />
        
//       },
//       {
//         path: '/saved-jobs',
//         element: 
//             <SavedJobs />
          
//       },
//       {
//         path: '/my-jobs',
//         element:
//             <MyJobs />
          
//       }
//     ]
//   }
// ])

// function App() {

//   return (

//     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
//       <RouterProvider router={router} />
//     </ThemeProvider>
//   )
// }

export default App