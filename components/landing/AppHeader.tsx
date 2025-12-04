"use client";

import React, { useState } from "react";
import Container from "./Container";

const links = [
  { to: "#features", label: "Features" },
  { to: "#solution", label: "Solution" },
  { to: "#reviews", label: "Reviews" },
  { to: "#blog", label: "Blog" },
];

export default function AppHeader() {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleLinkClick = () => {
    setIsToggled(false);
  };

  return (
    <header>
      <nav
        id="nav"
        data-state={isToggled ? "active" : ""}
        className="absolute group z-10 w-full border-b border-black/5 dark:border-white/5 lg:border-transparent"
      >
        <Container>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 md:gap-0 md:py-4">
            <div className="relative z-20 flex w-full justify-between md:px-0 lg:w-fit">
              <a
                href="#home"
                aria-label="logo"
                className="flex items-center space-x-2"
              >
                <div aria-hidden="true" className="flex space-x-1">
                  <div className="size-4 rounded-full bg-gray-900 dark:bg-white"></div>
                  <div className="h-6 w-2 bg-primary"></div>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  Auditly
                </span>
              </a>

              <div className="relative flex max-h-10 items-center lg:hidden">
                <button
                  aria-label="hamburger"
                  id="hamburger"
                  onClick={handleToggle}
                  className="relative -mr-6 p-6 active:scale-95 duration-300"
                >
                  <div
                    aria-hidden="true"
                    className={`m-auto h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-top ${
                      isToggled ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></div>
                  <div
                    aria-hidden="true"
                    className={`m-auto mt-2 h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-bottom ${
                      isToggled ? "-rotate-45 -translate-y-1" : ""
                    }`}
                  ></div>
                </button>
              </div>
            </div>
            <div
              id="navLayer"
              aria-hidden="true"
              className={`fixed inset-0 z-10 h-screen w-screen origin-bottom bg-white/70 backdrop-blur-2xl transition duration-500 dark:bg-gray-950/70 lg:hidden ${
                isToggled ? "origin-top scale-y-100" : "scale-y-0"
              }`}
            ></div>
            <div
              id="navlinks"
              className={`invisible absolute top-full left-0 z-20 w-full origin-top-right translate-y-1 scale-90 flex-col flex-wrap justify-end gap-6 rounded-3xl border border-gray-100 bg-white p-8 opacity-0 shadow-2xl shadow-gray-600/10 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none lg:visible lg:relative lg:flex lg:w-fit lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center lg:gap-0 lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none lg:dark:bg-transparent ${
                isToggled ? "visible scale-100 opacity-100" : ""
              }`}
            >
              <div className="w-full text-gray-600 dark:text-gray-200 lg:w-auto lg:pr-4 lg:pt-0">
                <div
                  id="links-group"
                  className="flex flex-col gap-6 tracking-wide lg:flex-row lg:gap-0 lg:text-sm"
                >
                  {links.map((link) => (
                    <a
                      key={link.to}
                      href={link.to}
                      onClick={handleLinkClick}
                      className="hover:text-primary block transition dark:hover:text-white md:px-4"
                    >
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-12 lg:mt-0">
                <a
                  href="/scan"
                  className="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                >
                  <span className="relative text-sm font-semibold text-white">
                    Get Started
                  </span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
