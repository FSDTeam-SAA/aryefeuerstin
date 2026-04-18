'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Check, User } from 'lucide-react'
import Link from 'next/link'

const DriverSortcurt = () => {
  return (
    <section className="container mx-auto px-4 py-[100px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Active Orders */}
        <Button
          asChild
          className="
            flex items-center justify-center gap-2
            h-[52px]
            bg-[#31B8FA] text-white text-base font-medium
            hover:bg-[#2BA5D6]
            transition-all
          "
        >
          <Link href="/driver/order-history">
            <Check size={20} />
            Active Orders
          </Link>
        </Button>

        {/* Completed Orders */}
        <Button
          asChild
          className="
            flex items-center justify-center gap-2
            h-[52px]
            bg-[#31B8FA] text-white text-base font-medium
            hover:bg-[#2BA5D6]
            transition-all
          "
        >
          <Link href="/driver/driver-order-request">
            <Check size={20} />
            Completed Orders
          </Link>
        </Button>

        {/* Work Hours */}
        <Button
          asChild
          className="
            flex items-center justify-center gap-2
            h-[52px]
            bg-[#31B8FA] text-white text-base font-medium
            hover:bg-[#2BA5D6]
            transition-all
          "
        >
          <Link href="/driver/work-sation">
            <User size={20} />
            Work Hours
          </Link>
        </Button>

      </div>
    </section>
  )
}

export default DriverSortcurt
