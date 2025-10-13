import * as fs from 'fs';
import * as path from 'path';

// Resolve repository root (assumes this file is in packages/server/src/ui)
const repoRoot = path.resolve(__dirname, '../../../../');
const uiDistDir = path.join(repoRoot, 'packages/ui/dist');

export function loadVoteWidgetHtml(): string {
  try {
    const indexPath = path.join(uiDistDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return placeholderHtml('[UI build missing: run `npm run build:ui`]');
    }
    let html = fs.readFileSync(indexPath, 'utf8');

    // Inline stylesheets
    html = html.replace(
      /<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
      (_, href) => {
        const cssPath = path.join(uiDistDir, href.replace(/^\//, ''));
        if (fs.existsSync(cssPath)) {
          const css = fs.readFileSync(cssPath, 'utf8');
          return `<style data-inlined="true">${css}</style>`;
        }
        return `<!-- missing stylesheet ${href} -->`;
      }
    );

    // Inline module scripts
    html = html.replace(
      /<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
      (_, src) => {
        const jsPath = path.join(uiDistDir, src.replace(/^\//, ''));
        if (fs.existsSync(jsPath)) {
          const js = fs.readFileSync(jsPath, 'utf8');
          return `<script type="module" data-inlined="true">${js}</script>`;
        }
        return `<!-- missing script ${src} -->`;
      }
    );

    return html;
  } catch (e) {
    return placeholderHtml((e as Error).message);
  }
}

function placeholderHtml(reason?: string) {
  return `<!doctype html><html><head><meta charset="utf-8" /><title>Vote Widget (Placeholder)</title><style>body{font-family:system-ui,sans-serif;margin:0;padding:1rem}</style></head><body><h1>Vote Widget</h1><p>Placeholder widget. ${
    reason ? 'Reason: ' + reason : 'Run the UI build to replace this.'
  }</p></body></html>`;
}
