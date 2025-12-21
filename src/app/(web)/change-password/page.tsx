"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AccountsPage() {
  return (
    <div className=" px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        
        {/* Page Title */}
        <h1 className="text-center text-2xl font-semibold text-[#131313] sm:text-3xl md:text-[40px]">
          Accounts
        </h1>

        {/* Save Button (Desktop / Tablet) */}
        <div className="mt-6 mb-8 hidden justify-end md:flex">
          <Button className="h-[48px] bg-[#31B8FA] px-[60px] text-white hover:bg-[#31B8FA]/90">
            Save
          </Button>
        </div>

        {/* Card */}
        <Card className="border-none p-4 shadow-none sm:p-6 md:p-8">
          <h2 className="mb-5 text-xl font-semibold text-[#131313] sm:text-2xl">
            Change password
          </h2>

          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <Label
                htmlFor="currentPassword"
                className="mb-2 block text-sm font-medium text-[#131313] sm:text-base"
              >
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="#############"
                className="h-11 border-gray-300"
              />
            </div>

            {/* New & Confirm Password */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-[#131313] sm:text-base"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="#############"
                  className="h-11 border-gray-300"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#131313] sm:text-base"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="#############"
                  className="h-11 border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Save Button (Mobile Only) */}
          <div className="mt-8 md:hidden">
            <Button className="h-[48px] w-full bg-[#31B8FA] text-white hover:bg-[#31B8FA]/90">
              Save
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
