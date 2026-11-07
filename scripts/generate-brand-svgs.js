const fs = require('fs');
const path = require('path');

// 1. Logo Icon (Medical Cross + Heart Caduceus Shield)
const logoIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="12" fill="#0B4F8A"/>
  <path d="M24 10V38M10 24H38" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="24" cy="24" r="8" fill="#1E9E8F"/>
  <path d="M21 24.5L23 26.5L27 22.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// 2. Full Horizontal Logo (Navy on Light)
const logoHorizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 54" fill="none">
  <!-- Symbol -->
  <rect x="2" y="3" width="48" height="48" rx="10" fill="#0B4F8A"/>
  <path d="M26 13V41M12 27H40" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="26" cy="27" r="7.5" fill="#1E9E8F"/>
  <path d="M23.5 27.5L25 29L28.5 25.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Typography -->
  <text x="60" y="27" font-family="'Poppins', sans-serif" font-weight="700" font-size="18" fill="#0B4F8A" letter-spacing="-0.02em">NASEEM IJAZ</text>
  <text x="60" y="44" font-family="'Inter', sans-serif" font-weight="600" font-size="10" fill="#1E9E8F" letter-spacing="0.14em">HOSPITAL &bull; LAHORE</text>
</svg>`;

// 3. Full Horizontal Logo (White on Dark/Navy for Sidebar & Footer)
const logoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 54" fill="none">
  <!-- Symbol -->
  <rect x="2" y="3" width="48" height="48" rx="10" fill="#1E9E8F"/>
  <path d="M26 13V41M12 27H40" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
  <circle cx="26" cy="27" r="7.5" fill="#0B3A66"/>
  <path d="M23.5 27.5L25 29L28.5 25.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Typography -->
  <text x="60" y="27" font-family="'Poppins', sans-serif" font-weight="700" font-size="18" fill="#FFFFFF" letter-spacing="-0.02em">NASEEM IJAZ</text>
  <text x="60" y="44" font-family="'Inter', sans-serif" font-weight="600" font-size="10" fill="#A4D7CF" letter-spacing="0.14em">HOSPITAL &bull; LAHORE</text>
</svg>`;

// 4. Stylized Hospital Map for Jail Road Lahore
const hospitalMapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none">
  <rect width="800" height="500" fill="#EBF2F7"/>
  <!-- Roads grid -->
  <path d="M0 240H800" stroke="#D3DFEC" stroke-width="32"/>
  <path d="M0 240H800" stroke="#FFFFFF" stroke-width="20"/>
  <text x="70" y="232" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#71869B">JAIL ROAD (MAIN BOULEVARD)</text>
  
  <path d="M280 0V500" stroke="#D3DFEC" stroke-width="24"/>
  <path d="M280 0V500" stroke="#FFFFFF" stroke-width="14"/>
  <text x="290" y="80" font-family="'Inter', sans-serif" font-size="12" font-weight="500" fill="#71869B" transform="rotate(90 290 80)">CANAL ROAD LINK</text>

  <path d="M560 0V500" stroke="#D3DFEC" stroke-width="24"/>
  <path d="M560 0V500" stroke="#FFFFFF" stroke-width="14"/>
  
  <path d="M0 110H800" stroke="#E3EAF2" stroke-width="16"/>
  <path d="M0 110H800" stroke="#FFFFFF" stroke-width="10"/>

  <path d="M0 380H800" stroke="#E3EAF2" stroke-width="16"/>
  <path d="M0 380H800" stroke="#FFFFFF" stroke-width="10"/>

  <!-- Hospital Campus Polygon -->
  <rect x="340" y="160" width="180" height="130" rx="12" fill="#0B4F8A" opacity="0.08"/>
  <rect x="340" y="160" width="180" height="130" rx="12" stroke="#0B4F8A" stroke-width="2" stroke-dasharray="4 4"/>
  <rect x="350" y="170" width="160" height="80" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 12px rgba(11,79,138,0.12))"/>
  
  <!-- Hospital Building Label inside campus -->
  <text x="365" y="202" font-family="'Poppins', sans-serif" font-weight="700" font-size="14" fill="#0B4F8A">Naseem Ijaz Hospital</text>
  <text x="365" y="222" font-family="'Inter', sans-serif" font-weight="500" font-size="11" fill="#5B6B7B">Plot 14-B, Medical Enclave</text>

  <!-- Marker Pin -->
  <g transform="translate(420, 115)">
    <path d="M20 0C8.954 0 0 8.954 0 20C0 35 20 52 20 52C20 52 40 35 40 20C40 8.954 31.046 0 20 0Z" fill="#D64545"/>
    <circle cx="20" cy="20" r="10" fill="#FFFFFF"/>
    <path d="M20 15V25M15 20H25" stroke="#D64545" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Nearby Landmark labels -->
  <rect x="80" y="290" width="140" height="36" rx="6" fill="#FFFFFF" stroke="#D3DFEC"/>
  <text x="92" y="313" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#5B6B7B">Gulberg Main Market</text>

  <rect x="580" y="290" width="140" height="36" rx="6" fill="#FFFFFF" stroke="#D3DFEC"/>
  <text x="596" y="313" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#5B6B7B">Services Hospital ER</text>

  <!-- Compass / Directions -->
  <g transform="translate(730, 40)">
    <circle cx="24" cy="24" r="22" fill="#FFFFFF" stroke="#D3DFEC"/>
    <text x="21" y="17" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#0B4F8A">N</text>
    <path d="M24 18V34M20 22L24 18L28 22" stroke="#0B4F8A" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

// Write files
fs.writeFileSync('public/images/logo.svg', logoHorizontalSvg);
fs.writeFileSync('public/images/logo-white.svg', logoWhiteSvg);
fs.writeFileSync('public/images/logo-icon.svg', logoIconSvg);
fs.writeFileSync('public/images/hospital-map.svg', hospitalMapSvg);
fs.writeFileSync('public/favicon.svg', logoIconSvg);

console.log('Brand SVGs and Hospital Map generated successfully!');
