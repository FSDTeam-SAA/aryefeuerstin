import React, { Suspense } from 'react'
import NewPassword from './_components/NewPassword'

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <NewPassword/>
      </Suspense>
    </div>
  )
}

export default page
