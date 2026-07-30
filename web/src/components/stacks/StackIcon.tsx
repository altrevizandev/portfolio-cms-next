"use client"

import { useState } from "react"
import type { Stack } from "@/types/stack"
import { cn } from "@/lib/utils"

export function StackIcon({
  stack,
  className,
  iconClassName,
}: {
  stack: Pick<Stack, "name" | "icon_slug" | "color">
  className?: string
  iconClassName?: string
}) {
  const [failed, setFailed] = useState(false)
  const color = stack.color ?? "#6842E8"

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl border",
        className,
      )}
      style={{
        color,
        backgroundColor: `${color}18`,
        borderColor: `${color}40`,
      }}
    >
      {stack.icon_slug && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${encodeURIComponent(stack.icon_slug)}/${color.replace("#", "")}`}
          alt=""
          className={cn("size-6", iconClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-heading text-[0.65rem] font-bold">
          {getInitials(stack.name)}
        </span>
      )}
    </span>
  )
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 4).toUpperCase()
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}
