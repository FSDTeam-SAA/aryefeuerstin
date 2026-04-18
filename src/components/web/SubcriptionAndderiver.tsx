
'use client'
import DriverSortcurt from './DriverSortcurt';
import SubscriptionPackages from './subscription -packages'
import { useSession } from 'next-auth/react'

const SubcriptionAndderiver = () => {
    const session=useSession();
    const role=session?.data?.user?.role
    console.log(role)

  return (
   <div>
  {role === "DRIVER" ? (
    <DriverSortcurt />
  ) : (
    <SubscriptionPackages />
  )}
</div>

  )
}

export default SubcriptionAndderiver
