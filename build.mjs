// Build estático: injeta as variáveis públicas do Supabase em src/index.html -> dist/index.html
import fs from "node:fs";
const html = fs.readFileSync(new URL("./index.html", import.meta.url), "utf8");
if (process.argv.includes("--check")) { // verificação de sintaxe do JavaScript embutido
  const js = html.split("<script>")[1].split("</script>")[0];
  new Function(js); console.log("Verificação OK: JavaScript sem erros de sintaxe."); process.exit(0);
}
const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "");
const key = (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();
const fail = m => { console.error("ERRO: " + m); process.exit(1); };
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) fail("Defina SUPABASE_URL (ex.: https://dknxceugxfraagmjwvda.supabase.co).");
if (!key) fail("Defina SUPABASE_ANON_KEY com a chave PÚBLICA (anon ou sb_publishable_...).");
if (/^sb_secret_/.test(key)) fail("Chave secreta detectada. Use apenas a chave pública/anon no frontend.");
try { const p = JSON.parse(Buffer.from(key.split(".")[1] || "", "base64url").toString()); if (p.role === "service_role") fail("Chave service_role detectada. Nunca use no frontend."); } catch {}
fs.mkdirSync(new URL("./dist", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("./dist/index.html", import.meta.url), html.replaceAll("%%SUPABASE_URL%%", url).replaceAll("%%SUPABASE_ANON_KEY%%", key));
console.log("Build concluído: dist/index.html");
