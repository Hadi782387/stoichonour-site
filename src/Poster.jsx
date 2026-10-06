// 9:16 poster: quote in the top third, figure in the bottom 40%, chiaroscuro light, dark negative space.
const wrap = (t, n = 20) => {
  const L = []; let c = "";
  t.split(" ").forEach((w) => { if ((c + " " + w).trim().length > n) { L.push(c); c = w; } else c = (c + " " + w).trim(); });
  if (c) L.push(c);
  return L;
};

export default function Poster({ p, uid = "p", svgRef }) {
  const L = wrap(p.quote || "");
  const a = `${uid}a`, b = `${uid}b`;
  return (
    <svg ref={svgRef} className="poster" viewBox="0 0 360 640" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={p.quote}>
      <defs>
        <radialGradient id={a} cx="72%" cy="72%" r="80%"><stop offset="0" stopColor="#5a4426" /><stop offset=".42" stopColor="#17120c" /><stop offset="1" stopColor="#050403" /></radialGradient>
        <linearGradient id={b} x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stopColor="#080605" /><stop offset=".55" stopColor="#2b2217" /><stop offset="1" stopColor="#e9cb8f" /></linearGradient>
      </defs>
      <rect width="360" height="640" fill={`url(#${a})`} />
      <rect x="14" y="14" width="332" height="612" fill="none" stroke="#d8b46a" strokeOpacity=".22" />
      {L.map((l, i) => (
        <text key={i} x="180" y={158 + i * 34} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize="23" fill="#f0e4cb">{l}</text>
      ))}
      <line x1="150" y1={176 + L.length * 34} x2="210" y2={176 + L.length * 34} stroke="#d8b46a" strokeOpacity=".6" />
      {p.variant === "column" ? (
        <g fill={`url(#${b})`}>
          <rect x="132" y="392" width="96" height="14" /><rect x="142" y="406" width="76" height="10" />
          <rect x="150" y="416" width="60" height="200" /><rect x="136" y="616" width="88" height="14" />
          <g stroke="#050403" strokeOpacity=".5"><line x1="164" y1="416" x2="164" y2="616" /><line x1="180" y1="416" x2="180" y2="616" /><line x1="196" y1="416" x2="196" y2="616" /></g>
        </g>
      ) : (
        <g fill={`url(#${b})`}>
          <circle cx="190" cy="452" r="40" /><rect x="172" y="486" width="36" height="30" />
          <path d="M60 640 C70 548 136 514 190 514 C244 514 306 548 320 640 Z" />
        </g>
      )}
      <text x="180" y="612" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" letterSpacing="3.5" fill="#d8b46a" fillOpacity=".85">@STOICHONOUR</text>
    </svg>
  );
}
