import Feed from '@/components/feed'
import Footer from '@/components/Footer2'
import Navbar from '@/components/Navbar'
import React from 'react'

function page() {
  return (
    <div>
      <Navbar/>
        <Feed/>
        <Footer/>
    </div>
  )
}

export default page