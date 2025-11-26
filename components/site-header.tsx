"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import TargetCursor from "./TargetCursor";
import { useRef } from "react";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="container flex h-14 justify-between mx-auto items-center">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <span className="hidden font-bold sm:inline-block">Auditly</span>
        </Link>

        <nav className="flex items-center gap-8 relative">
          <ModeToggle />

          <TargetCursor
            spinDuration={3}
            hideDefaultCursor={true}
            parallaxOn={true}
            containerRef={headerRef}
          />

          <Link href="/scan" className="cursor-target">
            Scan Project
          </Link>
          <Link href="/team" className="cursor-target">
            Team
          </Link>
        </nav>
      </div>
    </header>
  );
}
