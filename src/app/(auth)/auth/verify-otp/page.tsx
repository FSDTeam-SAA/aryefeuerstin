import React, { Suspense } from 'react'
import VerifyOTPPage from './_components/verifyotpPage'

const page = () => {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPPage/>
        </Suspense>
    </div>
  )
}

export default page
