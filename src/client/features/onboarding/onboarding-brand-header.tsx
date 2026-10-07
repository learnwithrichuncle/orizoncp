export function OnboardingBrandHeader() {
  return (
    <a className="brand flex items-center gap-2" href="/" aria-label="orizonCP home">
      <span className="logo-word text-[15px] font-bold tracking-tight text-ink flex items-center gap-0.5">
        <svg className="logo-o h-5 w-5 text-ink" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <defs>
            <clipPath id="logoRing"><circle cx="12" cy="12" r="9"></circle></clipPath>
          </defs>
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.4"></circle>
          <g clip-path="url(#logoRing)">
            <circle cx="12" cy="13.5" r="4" fill="currentColor"></circle>
            <rect x="2" y="13.4" width="20" height="9" fill="var(--color-base)"></rect>
            <line x1="3" y1="13.4" x2="21" y2="13.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line>
          </g>
        </svg>
        <span>rizon</span>
      </span>
    </a>
  );
}