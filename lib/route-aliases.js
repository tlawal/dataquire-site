export const routeAliases = {
  "/process":"/#how-it-works",
  "/about":"/",
  "/for-buyers":"/buyers",
  "/industries":"/verticals",
  "/reading-room":"/answers"
};

// Mirror the published Netlify redirects in development and production preview.
export function redirectAlias(req, res, next) {
  const url = new URL(req.url, "http://localhost");
  const target = routeAliases[url.pathname.replace(/\/+$/, "")];
  if (!target) return next();
  const [pathname, fragment] = target.split("#");
  res.writeHead(301, {Location:pathname + url.search + (fragment ? "#" + fragment : "")});
  res.end();
}
