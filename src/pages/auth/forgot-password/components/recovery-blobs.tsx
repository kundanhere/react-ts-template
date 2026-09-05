export function RecoveryBlobs() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto aspect-square w-full max-w-4xl translate-y-2/3">
      <div className="flex min-h-screen w-full items-center justify-center overflow-hidden">
        <div className="grid [grid-template-areas:'stack']">
          {/* Center Text inside the Blob */}
          <div className="pointer-events-none z-10 flex -translate-y-28 flex-col items-center justify-center px-4 text-center select-none [grid-area:stack] sm:-translate-y-36 md:-translate-y-28">
            <span className="text-foreground/15 text-4xl leading-none font-black tracking-tighter uppercase select-none sm:text-5xl md:text-6xl lg:text-7xl dark:text-white/20">
              DON&apos;T WORRY
            </span>
            <h3 className="text-foreground -mt-3 text-lg font-bold tracking-tight sm:-mt-5 sm:text-xl md:text-2xl">
              We&apos;ve Got You Covered
            </h3>
            <p className="text-muted-foreground mt-1 max-w-xs text-[11px] sm:text-xs">
              We&apos;ll help you get back into your account in no time
            </p>
          </div>

          <div className="relative grid animate-[spin_10s_linear_infinite] [grid-area:stack] [grid-template-areas:'stack']">
            {/* Blob 1 - Cyan / Blue */}
            <span
              style={{
                ["--border-radius" as any]:
                  "115% 140% 145% 110% / 125% 140% 110% 125%",
                ["--border-width" as any]: "5vmin",
                aspectRatio: "1",
                display: "block",
                gridArea: "stack",
                backgroundSize: "calc(100% + var(--border-width) * 2)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "var(--border-width) solid transparent",
                borderRadius: "var(--border-radius)",
                WebkitMaskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                maskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                WebkitMaskClip: "padding-box, border-box",
                maskClip: "padding-box, border-box",
                WebkitMaskComposite: "source-over",
                maskComposite: "intersect",
                mixBlendMode: "screen",
                height: "80vmin",
                filter: "blur(1vmin)",
                backgroundColor: "#0074D9",
                backgroundImage: "linear-gradient(#0074D9, #39CCCC, #0074D9)",
                transform: "rotate(30deg) scale(1.03)",
              }}
            />
            {/* Blob 2 - Orange / Red */}
            <span
              style={{
                ["--border-radius" as any]:
                  "115% 140% 145% 110% / 125% 140% 110% 125%",
                ["--border-width" as any]: "5vmin",
                aspectRatio: "1",
                display: "block",
                gridArea: "stack",
                backgroundSize: "calc(100% + var(--border-width) * 2)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "var(--border-width) solid transparent",
                borderRadius: "var(--border-radius)",
                WebkitMaskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                maskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                WebkitMaskClip: "padding-box, border-box",
                maskClip: "padding-box, border-box",
                WebkitMaskComposite: "source-over",
                maskComposite: "intersect",
                mixBlendMode: "screen",
                height: "80vmin",
                filter: "blur(1vmin)",
                backgroundColor: "#FF4136",
                backgroundImage: "linear-gradient(#FF4136, #FF851B, #FF4136)",
                transform: "rotate(60deg) scale(0.95)",
              }}
            />
            {/* Blob 3 - Emerald / Green */}
            <span
              style={{
                ["--border-radius" as any]:
                  "115% 140% 145% 110% / 125% 140% 110% 125%",
                ["--border-width" as any]: "5vmin",
                aspectRatio: "1",
                display: "block",
                gridArea: "stack",
                backgroundSize: "calc(100% + var(--border-width) * 2)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "var(--border-width) solid transparent",
                borderRadius: "var(--border-radius)",
                WebkitMaskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                maskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                WebkitMaskClip: "padding-box, border-box",
                maskClip: "padding-box, border-box",
                WebkitMaskComposite: "source-over",
                maskComposite: "intersect",
                mixBlendMode: "screen",
                height: "80vmin",
                filter: "blur(1vmin)",
                backgroundColor: "#3D9970",
                backgroundImage: "linear-gradient(#3D9970, #01FF70, #3D9970)",
                transform: "rotate(90deg) scale(0.97)",
              }}
            />
            {/* Blob 4 - Magenta / Purple */}
            <span
              style={{
                ["--border-radius" as any]:
                  "115% 140% 145% 110% / 125% 140% 110% 125%",
                ["--border-width" as any]: "5vmin",
                aspectRatio: "1",
                display: "block",
                gridArea: "stack",
                backgroundSize: "calc(100% + var(--border-width) * 2)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "var(--border-width) solid transparent",
                borderRadius: "var(--border-radius)",
                WebkitMaskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                maskImage:
                  "linear-gradient(transparent, transparent), linear-gradient(black, white)",
                WebkitMaskClip: "padding-box, border-box",
                maskClip: "padding-box, border-box",
                WebkitMaskComposite: "source-over",
                maskComposite: "intersect",
                mixBlendMode: "screen",
                height: "80vmin",
                filter: "blur(1vmin)",
                backgroundColor: "#B10DC9",
                backgroundImage: "linear-gradient(#B10DC9, #85144B, #B10DC9)",
                transform: "rotate(120deg) scale(1.02)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
