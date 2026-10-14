export default [
  {ignores:["dist/**","node_modules/**",".qa/**"]},
  {
    files:["**/*.js","**/*.mjs"],
    languageOptions:{ecmaVersion:"latest", sourceType:"module", globals:{
      document:"readonly", window:"readonly", history:"readonly", navigator:"readonly",
      localStorage:"readonly", URL:"readonly", URLSearchParams:"readonly", CSS:"readonly",
      FormData:"readonly", IntersectionObserver:"readonly", requestAnimationFrame:"readonly",
      TextEncoder:"readonly", TextDecoder:"readonly", Uint8Array:"readonly", AbortController:"readonly", AbortSignal:"readonly", Buffer:"readonly",
      fetch:"readonly", Response:"readonly", btoa:"readonly", atob:"readonly", console:"readonly", crypto:"readonly",
      setTimeout:"readonly", clearTimeout:"readonly", clearInterval:"readonly"
    }},
    rules:{"no-undef":"error","no-dupe-keys":"error","no-unreachable":"error"}
  }
];
