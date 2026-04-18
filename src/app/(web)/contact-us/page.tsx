import React from 'react'
import Hero from '@/components/shared/Hero'
import ContactSection from './_components/Contact_section'
import Map from './_components/Map'

const page = () => {
  return (
    <div>
         <Hero title="Contact Us" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever " imageUrl="/image/about2.png" height="483px"/>
      <ContactSection/>
      <Map/>
    </div>
  )
}

export default page