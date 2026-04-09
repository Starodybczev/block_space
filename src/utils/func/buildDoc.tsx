interface BuildDocType {
    html: string;
    css: string;
    js: string;
    assets: any;
}

export function buildDocument({ html, css, js, assets }: BuildDocType) {
    return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                            html, body { 
                    margin: 0; 
                    padding: 10px; 
                    min-height: 100vh;
                    /* Используем тот же путь, он подтянется из корня сайта */
                    cursor: url("/cursore.svg") 0 0, auto !important; 
                }
                    </style>
                    ${css}
                </head>
                <body>
                    ${html}
                    <script>
  window.__ASSETS__ = ${JSON.stringify(assets || {})};

  document.addEventListener("DOMContentLoaded", () => {
    const assets = window.__ASSETS__ || {};

    document.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src");
      if (assets[src]) {
        img.src = assets[src];
      }
    });
  });
</script>
                    ${js}
                </body>
            </html>
        `;
}