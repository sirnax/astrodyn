"use client"

import * as React from "react"
import { Monitor, Moon, Sun, Palette, Zap } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Render a placeholder or nothing during SSR to avoid mismatch,
  // but since we want layout stability, we might render a disabled state or just null.
  // If we render null, layout shift might occur.
  // But given it's a small component in settings, it might be fine.
  if (!mounted) {
    return (
       <div className="flex items-center justify-between opacity-50">
        <label className="text-sm font-medium">Color Theme</label>
        <div className="h-10 w-[180px] rounded-md border border-input bg-background" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">Color Theme</label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </div>
          </SelectItem>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="calm">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Calm</span>
            </div>
          </SelectItem>
          <SelectItem value="vibrant">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Vibrant</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
