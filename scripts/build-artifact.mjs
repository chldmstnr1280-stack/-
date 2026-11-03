// 아티팩트(단일 HTML) 빌드: VITE_ARTIFACT=1 로 빌드한 결과의 CSS·JS를 한 파일에 인라인한다.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist-artifact';
const assets = join(dir, 'assets');
const files = readdirSync(assets);
const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');
const js = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n').replace(/<\/script/gi, '<\\/script');

const html = `<title>MELTING HAM</title>
<meta name="theme-color" content="#F28C78">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap">
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;
writeFileSync(join(dir, 'melting-ham.html'), html);
console.log(`wrote ${dir}/melting-ham.html (${(html.length / 1024).toFixed(0)} KB)`);
