"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import type { DotType } from "qr-code-styling";

export default function QrGenerator() {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [dotColor, setDotColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotType, setDotType] = useState<DotType>("rounded");
  const [logo, setLogo] = useState("");
  const [logoSize, setLogoSize] = useState(0.25);
  const [error, setError] = useState("");

  // Initialisera QR-generatorn i webbläsaren
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "svg",
      data: "https://example.com",
      margin: 2,

      qrOptions: {
        errorCorrectionLevel: "H",
      },

      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },

      backgroundOptions: {
        color: "#ffffff",
      },

      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.25,
        hideBackgroundDots: true,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }

    return () => {
      qrCode.current = null;
    };
  }, []);

  // Uppdatera QR-kodens design
  useEffect(() => {
    if (!generatedUrl) return;

    qrCode.current?.update({
      data: generatedUrl,
      image: logo,

      dotsOptions: {
        color: dotColor,
        type: dotType,
      },

      backgroundOptions: {
        color: bgColor,
      },

      imageOptions: {
        imageSize: logoSize,
        margin: 5,
        hideBackgroundDots: true,
      },
    });
  }, [generatedUrl, dotColor, bgColor, dotType, logo, logoSize]);

  // Generera QR-kod
  const generateQr = () => {
    setError("");

    if (!url.trim()) {
      setError("Ange en länk först.");
      return;
    }

    try {
      let link = url.trim();

      if (!/^https?:\/\//i.test(link)) {
        link = "https://" + link;
      }

      const validUrl = new URL(link);

      if (!["http:", "https:"].includes(validUrl.protocol)) {
        throw new Error("Ogiltig länk");
      }

      setGeneratedUrl(validUrl.href);
    } catch {
      setError("Ange en giltig länk.");
    }
  };

  // Ladda upp logotyp
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Välj en giltig bildfil.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Bilden får vara max 5 MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // Ta bort logotyp
  const removeLogo = () => {
    setLogo("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // Ladda ner QR-kod
  const downloadQr = (extension: "png" | "svg") => {
    if (!generatedUrl) return;

    qrCode.current?.download({
      name: "my-qr-code",
      extension,
    });
  };

  // Återställ design
  const resetDesign = () => {
    setDotColor("#000000");
    setBgColor("#ffffff");
    setDotType("rounded");
    setLogoSize(0.25);
    removeLogo();
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-slate-900">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Fertekz IT - QR Generator
        </h1>

        <p className="text-slate-500 mt-2">
          Skapa, anpassa och ladda ner din egen QR-kod.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inställningar */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">Skapa QR-kod</h2>

          {/* Länk */}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              generateQr();
            }}
          >
            <label className="block text-sm font-medium">Din länk</label>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder="https://example.com"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition cursor-pointer"
            >
              Generera QR-kod
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}

          <hr className="border-slate-200" />

          {/* Färger */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Anpassa design</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  QR-färg
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3">
                  <input
                    type="color"
                    value={dotColor}
                    onChange={(e) => setDotColor(e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />

                  <span className="text-sm uppercase">{dotColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bakgrund
                </label>

                <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />

                  <span className="text-sm uppercase">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR-stil */}
          <div>
            <label className="block text-sm font-medium mb-2">QR-stil</label>

            <select
              value={dotType}
              onChange={(e) => setDotType(e.target.value as DotType)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white cursor-pointer"
            >
              <option value="square">Fyrkantig</option>
              <option value="dots">Prickar</option>
              <option value="rounded">Rundad</option>
              <option value="extra-rounded">Extra rundad</option>
              <option value="classy">Elegant</option>
              <option value="classy-rounded">Elegant rundad</option>
            </select>
          </div>

          {/* Logotyp */}
          <div>
            <label className="block text-sm font-medium mb-2">Logotyp</label>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />

            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:bg-slate-50 transition"
            >
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt="Uppladdad logotyp"
                  className="w-16 h-16 object-contain mb-3"
                />
              ) : (
                <span className="text-3xl mb-2">+</span>
              )}

              <span className="font-medium text-sm">
                {logo ? "Byt logotyp" : "Ladda upp logotyp"}
              </span>

              <span className="text-xs text-slate-400 mt-1">
                PNG, JPG eller SVG. Max 5 MB.
              </span>
            </label>

            {logo && (
              <button
                onClick={removeLogo}
                className="text-red-600 text-sm mt-3 cursor-pointer"
              >
                Ta bort logotyp
              </button>
            )}
          </div>

          {/* Logotypens storlek */}
          {logo && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  Logotypens storlek
                </label>

                <span className="text-sm text-slate-500">
                  {Math.round(logoSize * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0.1"
                max="0.3"
                step="0.01"
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          )}

          <button
            onClick={resetDesign}
            className="w-full border border-slate-300 rounded-xl py-3 text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
          >
            Återställ design
          </button>
        </section>

        {/* Förhandsvisning */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit lg:sticky lg:top-8">
          <h2 className="text-xl font-semibold mb-2">Förhandsvisning</h2>

          <p className="text-sm text-slate-500 mb-6">
            Din QR-kod uppdateras när du ändrar designen.
          </p>

          <div className="min-h-[360px] flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl overflow-auto">
            {!generatedUrl && (
              <div className="text-center p-6">
                <p className="text-4xl mb-3">▦</p>

                <p className="font-medium text-slate-500">
                  Ingen QR-kod genererad
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  Ange en länk och klicka på generera.
                </p>
              </div>
            )}

            <div ref={qrRef} className={generatedUrl ? "block" : "hidden"} />
          </div>

          {generatedUrl && (
            <div className="bg-slate-50 rounded-xl p-3 mt-4">
              <p className="text-xs text-slate-500">Destination</p>

              <p className="text-sm break-all mt-1">{generatedUrl}</p>
            </div>
          )}

          {/* Nedladdning */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              disabled={!generatedUrl}
              onClick={() => downloadQr("png")}
              className="bg-slate-900 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ladda ner PNG
            </button>

            <button
              disabled={!generatedUrl}
              onClick={() => downloadQr("svg")}
              className="border border-slate-300 hover:bg-slate-50 py-3 rounded-xl font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ladda ner SVG
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-5">
            Testa alltid QR-koden med mobilen innan du använder den.
          </p>
        </section>
      </div>

      <footer className="text-center text-sm text-slate-400 mt-12">
        Fertekz IT - QR Generator · Skapa din egen QR-kod
      </footer>
    </div>
  );
}
