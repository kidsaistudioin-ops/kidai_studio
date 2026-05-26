const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, 'app');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const LIB_DIR = path.join(__dirname, 'lib');

// Store valid routes and found links
const validRoutes = new Set();
const foundLinks = [];

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();
const isDynamicRoute = (route) => /\[[^\]]+\]/.test(route);

// 1. Next.js App Router ke saare valid pages dhoondhna
function scanAppDir(dir, currentRoute = '') {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (isDir(fullPath)) {
      // Route groups ko ignore karna, e.g., (child), (parent)
      const isRouteGroup = entry.startsWith('(') && entry.endsWith(')');
      const nextRoute = isRouteGroup ? currentRoute : `${currentRoute}/${entry}`;
      scanAppDir(fullPath, nextRoute);
    } else if (entry.startsWith('page.') && /\.(js|jsx|ts|tsx)$/.test(entry)) {
      const route = currentRoute === '' ? '/' : currentRoute;
      validRoutes.add(route);
    }
  }
}

// 2. Code mein use kiye gaye saare links dhoondhna
function scanForLinks(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (isDir(fullPath)) {
      scanForLinks(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // href="/..." aur router.push('/...') dhoondhna
      const linkRegex = /href=["'](\/[^"']+)["']/g;
      const routerRegex = /router\.(push|replace)\(["'](\/[^"']+)["']\)/g;
      const pathRegex = /path:\s*["'](\/[^"']+)["']/g;
      const objHrefRegex = /href:\s*["'](\/[^"']+)["']/g;
      
      let match;
      while ((match = linkRegex.exec(content)) !== null) {
        foundLinks.push({ link: match[1], file: fullPath });
      }
      while ((match = routerRegex.exec(content)) !== null) {
        foundLinks.push({ link: match[2], file: fullPath });
      }
      while ((match = pathRegex.exec(content)) !== null) {
        foundLinks.push({ link: match[1], file: fullPath });
      }
      while ((match = objHrefRegex.exec(content)) !== null) {
        foundLinks.push({ link: match[1], file: fullPath });
      }
    }
  }
}

console.log("🔍 Scanning for Next.js App Routes...");
scanAppDir(APP_DIR);
console.log(`✅ Found ${validRoutes.size} valid routes.\n`);

console.log("🔍 Scanning source files for links...");
scanForLinks(APP_DIR);
scanForLinks(COMPONENTS_DIR);
scanForLinks(LIB_DIR);
console.log(`✅ Found ${foundLinks.length} links.\n`);

// 3. Report Generate Karna
const brokenLinks = {};
const usedRoutes = new Set();

foundLinks.forEach(({ link, file }) => {
  const cleanLink = link.split('?')[0].split('#')[0]; // Query params aur hash hatao

  if (isDynamicRoute(cleanLink)) {
    return;
  }
  
  if (validRoutes.has(cleanLink)) {
    usedRoutes.add(cleanLink);
  } else {
    if (!brokenLinks[cleanLink]) brokenLinks[cleanLink] = new Set();
    brokenLinks[cleanLink].add(file.replace(__dirname, ''));
  }
});

console.log("========== 🚨 404 BROKEN LINKS (Inko Theek Karo) ==========");
Object.keys(brokenLinks).forEach(link => {
  console.log(`\n❌ Missing Page: ${link}`);
  console.log(`   Is link ko in files mein click kiya ja raha hai:`);
  Array.from(brokenLinks[link]).forEach(f => console.log(`    -> ${f}`));
});

console.log("\n========== 👻 ORPHAN PAGES (Bane hue hain, par link nahi hain) ==========");
const ignoreRoutes = ['/', '/login'];
Array.from(validRoutes)
  .filter(r => !isDynamicRoute(r) && !usedRoutes.has(r) && !ignoreRoutes.includes(r))
  .forEach(route => {
    console.log(`⚠️ Unused Page: ${route}`);
  });