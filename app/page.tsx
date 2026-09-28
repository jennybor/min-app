"use client";

import { useState } from "react";

export default function Home() {
  const [antall, setAntall] = useState(0);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 font-sans dark:bg-black">
      <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Hei, Jenny!
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Nå ligger jeg på nett! 🌍
      </p>
      <button
        onClick={() => setAntall(antall + 1)}
        className="rounded-full bg-foreground px-6 py-3 text-lg font-medium text-background transition-transform active:scale-95"
      >
        Trykk på meg
      </button>
      <p className="text-zinc-600 dark:text-zinc-400">
        Du har trykket {antall} {antall === 1 ? "gang" : "ganger"}.
      </p>
    </main>
  );
}
