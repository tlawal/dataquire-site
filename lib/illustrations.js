const strokes = [
  '<rect x="23" y="23" width="50" height="50" rx="2"/><path d="M32 32h32v32H32zM39 39h18v18H39zM16 31h7m-7 13h7m-7 13h7m-7 13h7m50-39h7m-7 13h7m-7 13h7m-7 13h7M31 16v7m13-7v7m13-7v7m13-7v7m-39 50v7m13-7v7m13-7v7m13-7v7"/>',
  '<path d="m17 63 62-39-23 44-15-12-24 7Zm24-7 38-32M31 45l-13-3 16-10 14 4M56 68l-2 12 11-8 3-23"/><circle cx="74" cy="72" r="7"/><path d="M12 73h26M12 80h19"/>',
  '<path d="M26 77h44M30 72h36M48 25v47M24 29h48M22 29 12 52h20L22 29Zm52 0L64 52h20L74 29ZM12 52c2 8 18 8 20 0m32 0c2 8 18 8 20 0M43 18h10v7H43z"/>',
  '<path d="M39 17h18M42 17v24L22 72c-3 5 0 8 6 8h40c6 0 9-3 6-8L54 41V17M32 59h32M43 66h9"/><circle cx="40" cy="74" r="2"/><circle cx="59" cy="70" r="2"/><path d="M65 26h15M72 19v14"/>',
  '<path d="M20 18h56v61H20zM28 28h40M28 37h40M28 46h40M28 55h40M28 64h40M40 24v46M57 24v46"/><path d="M78 28h5v56H29v-5"/>',
  '<path d="M17 34h39v33H17zM56 43l23-10v36L56 58M25 41h23v18H25zM22 25h24M26 74h21"/><circle cx="36" cy="50" r="6"/><path d="M66 16a30 30 0 0 1 19 16M66 23a22 22 0 0 1 13 11"/>',
  '<path d="M22 18h52v62H22zM33 30h30M34 64h28M37 45h7v-7h8v7h7v8h-7v7h-8v-7h-7z"/><path d="M75 28h6v56H30v-4"/>',
  '<path d="M27 17h33l12 12v50H27zM60 17v13h12M36 42h27M36 52h20M36 62h25M17 30v49h10"/><circle cx="72" cy="65" r="12"/><path d="m72 61 4 4-4 4M67 65h9"/>',
  '<path d="m14 44 34-27 34 27M22 39v40h52V39M39 79V56h18v23M14 86h68M29 44h8v9h-8zM60 44h7v9h-7zM61 25v-8h8v14"/><path d="M14 13h18M23 8v10"/>'
];

export function verticalGlyph(index) {
  return '<svg class="vertical-glyph" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + strokes[index] + '</svg>';
}
