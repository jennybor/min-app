"use client";

import { useEffect, useRef, useState } from "react";
import { kroner, type Bil } from "@/lib/biler";
import { loggKlikk } from "@/lib/klikk";

// Demo-chat med ferdigskrevne svar. Kan senere byttes ut med ekte KI uten å endre utseendet.

type Melding = { fra: "bruker" | "radgiver"; tekst: string };

function forslag(bil: Bil): { sporsmal: string; svar: string }[] {
  const forskjell = bil.pris - bil.prisSnitt;
  let pris: string;
  if (Math.abs(forskjell) < bil.prisSnitt * 0.05) {
    pris = `Prisen på ${kroner(bil.pris)} er omtrent som snittet for lignende biler (${kroner(bil.prisSnitt)}). Det er en rimelig pris, men du kan godt prøve å forhandle litt.`;
  } else if (forskjell < 0) {
    pris = `Ja, prisen ser bra ut. ${kroner(bil.pris)} er ${kroner(-forskjell)} under snittet for ${bil.antallSammenlignet} lignende biler. Sjekk likevel at det ikke er en grunn til at den er billig, for eksempel en tidligere skade.`;
  } else {
    pris = `Prisen er ganske høy. ${kroner(bil.pris)} er ${kroner(forskjell)} over snittet for lignende biler, som selges for ${kroner(bil.prisLav)} til ${kroner(bil.prisHoy)}. Jeg ville forhandlet, eller sett etter andre biler.`;
  }

  const obs = bil.punkter.filter((p) => p.status !== "bra");
  const sjekk =
    obs.length > 0
      ? `Det viktigste å sjekke på denne bilen er: ${obs.map((p) => p.tittel.toLowerCase()).join(", ")}. ${bil.svakheter[0]}`
      : `Bilen ser ryddig ut. ${bil.svakheter[0]} Ta den gjerne med på en prøvetur på både by og motorvei.`;

  const selger = `Her er tre gode spørsmål:\n\n${bil.sporsmal.map((s) => `• ${s}`).join("\n")}`;

  const kjop = {
    godt: `Ut fra det vi vet, ser dette ut som et godt kjøp. ${bil.oppsummering} Vil du være helt trygg, kan du bestille en bruktbiltest før du signerer.`,
    sjekk: `Det kan bli et greit kjøp, men jeg ville fått svar på noen ting først. ${bil.oppsummering} En bruktbiltest vil gi deg svar på det du ikke kan se selv.`,
    forsiktig: `Jeg ville vært forsiktig med denne. ${bil.oppsummering} Hvis du likevel er interessert, bør du forhandle prisen og få bilen testet først.`,
  }[bil.vurdering];

  return [
    { sporsmal: "Er prisen grei?", svar: pris },
    { sporsmal: "Hva bør jeg sjekke før jeg kjøper?", svar: sjekk },
    { sporsmal: "Hva bør jeg spørre selgeren om?", svar: selger },
    { sporsmal: "Bør jeg kjøpe denne bilen?", svar: kjop },
  ];
}

export default function Chat({ bil }: { bil: Bil }) {
  const alle = forslag(bil);
  const [meldinger, setMeldinger] = useState<Melding[]>([
    {
      fra: "radgiver",
      tekst: `Hei! Jeg kan hjelpe deg med ${bil.navn}en fra ${bil.ar}. Hva lurer du på?`,
    },
  ]);
  const [brukt, setBrukt] = useState<string[]>([]);
  const [skriver, setSkriver] = useState(false);
  const [tekst, setTekst] = useState("");
  const bunn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bunn.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [meldinger, skriver]);

  function svar(sporsmal: string, svarTekst: string) {
    setMeldinger((m) => [...m, { fra: "bruker", tekst: sporsmal }]);
    setSkriver(true);
    setTimeout(() => {
      setSkriver(false);
      setMeldinger((m) => [...m, { fra: "radgiver", tekst: svarTekst }]);
    }, 900 + svarTekst.length * 8);
  }

  function velgForslag(f: { sporsmal: string; svar: string }) {
    loggKlikk("chat_forslag", { bil: bil.id, sporsmal: f.sporsmal });
    setBrukt((b) => [...b, f.sporsmal]);
    svar(f.sporsmal, f.svar);
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    const renset = tekst.trim();
    if (!renset || skriver) return;
    loggKlikk("chat_eget_sporsmal", { bil: bil.id, tekst: renset.slice(0, 300) });
    setTekst("");
    svar(
      renset,
      "Godt spørsmål! I denne demoen kan jeg dessverre bare svare på forslagene under. Spørsmålet ditt er notert, så vi kan bruke det til å gjøre rådgiveren bedre."
    );
  }

  const gjenstaende = alle.filter((f) => !brukt.includes(f.sporsmal));

  return (
    <div className="flex h-[70vh] max-h-[600px] flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gul text-sm font-black">KI</span>
        <div>
          <p className="font-bold leading-tight">KI-rådgiver</p>
          <p className="text-xs text-zinc-500">Demo med ferdigskrevne svar. Ikke en ekte person.</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-4">
        {meldinger.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[15px] ${
              m.fra === "bruker" ? "self-end rounded-br-sm bg-black text-white" : "self-start rounded-bl-sm bg-zinc-100"
            }`}
          >
            {m.tekst}
          </div>
        ))}
        {skriver && (
          <div className="self-start rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-3 text-zinc-500">
            <span className="animate-pulse">Skriver …</span>
          </div>
        )}
        <div ref={bunn} />
      </div>

      {!skriver && gjenstaende.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-3">
          {gjenstaende.map((f) => (
            <button
              key={f.sporsmal}
              onClick={() => velgForslag(f)}
              className="rounded-full border-2 border-black px-3 py-1.5 text-sm font-semibold hover:bg-gul"
            >
              {f.sporsmal}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={send} className="flex gap-2">
        <input
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          placeholder="Skriv et spørsmål …"
          className="flex-1 rounded-lg border-2 border-zinc-300 px-3 py-2.5 text-base outline-none focus:border-black"
        />
        <button
          type="submit"
          disabled={skriver || !tekst.trim()}
          className="rounded-lg bg-black px-4 font-bold text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
