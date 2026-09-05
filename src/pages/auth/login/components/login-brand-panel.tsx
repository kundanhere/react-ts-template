import { Link } from "react-router-dom";

export function LoginBrandPanel() {
  return (
    <div className="dark relative hidden shrink-0 overflow-hidden bg-zinc-950 lg:flex lg:w-lg xl:w-120">
      {/* Subtle dark gradient scrim for crisp contrast */}
      <div className="absolute inset-0 z-1 bg-linear-to-b from-black/50 via-black/25 to-black/60 backdrop-blur-[0.03125rem]" />

      {/* Background Loop Video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        loop
        autoPlay
        muted
        playsInline
      >
        <source src="/videos/wave-video-loop.mp4" type="video/mp4" />
        <source
          src="https://images.shadcnspace.com/assets/video/wave-video-loop.mp4"
          type="video/mp4"
        />
      </video>

      {/* Sidebar Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
        <Link
          to="/"
          aria-label="Go to home"
          className="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
        >
          <img
            src="https://images.shadcnspace.com/assets/logo/logo-icon-white.svg"
            alt="Logo"
            width={36}
            height={36}
            className="size-9"
          />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-base font-semibold tracking-tight text-white">
              Sentry IAM
            </span>
            <span className="text-xs text-zinc-400">Access Console</span>
          </div>
        </Link>

        <div className="max-w-sm space-y-3">
          <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white">
            Welcome back to your workspace
          </h2>
          <p className="text-sm leading-relaxed text-zinc-300">
            Empower your team to manage content, analytics, and platform
            settings with seamless precision.
          </p>
        </div>

        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Sentry IAM. All rights reserved.
        </p>
      </div>
    </div>
  );
}
