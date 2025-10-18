# TSH Research Platform - Deployment Instructies

## 📦 Project Informatie

- **Project**: TSH Research Platform
- **Framework**: Next.js (React) + Vite
- **Repository**: https://github.com/maxpinas/tsh
- **Domain**: www.studiohyra.nl/tsh

## 🚀 Deployment naar TransIP Shared Hosting

### Optie 1: Static Export (Aanbevolen voor Shared Hosting)

#### Stap 1: Build het project lokaal
```bash
cd /home/ubuntu/tsh
pnpm install
pnpm build
```

Dit creëert een `dist/public` folder met alle static files.

#### Stap 2: Upload naar TransIP
1. Log in op je TransIP control panel
2. Open File Manager of gebruik FTP/SFTP
3. Navigeer naar: `public_html/tsh/` (of maak deze folder aan)
4. Upload alle bestanden uit `dist/public/` naar deze folder
5. Zorg dat de structuur is:
   ```
   public_html/
   └── tsh/
       ├── index.html
       ├── data/
       │   └── (alle .md en .json bestanden)
       └── assets/
           └── (alle JS en CSS bestanden)
   ```

#### Stap 3: Configureer .htaccess voor SPA routing
Maak een `.htaccess` bestand in `public_html/tsh/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /tsh/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /tsh/index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 1 week"
</IfModule>

# Compress text files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>
```

#### Stap 4: Test de website
Bezoek: https://www.studiohyra.nl/tsh

### Optie 2: Git Deployment (Geavanceerd)

Als je TransIP server SSH toegang heeft:

```bash
# SSH naar je server
ssh username@studiohyra.nl

# Clone repository
cd ~/domains/studiohyra.nl/public_html
git clone https://github.com/maxpinas/tsh.git

# Install dependencies
cd tsh
npm install -g pnpm
pnpm install

# Build
pnpm build

# Symlink of move dist/public naar juiste locatie
```

## 🔄 Updates Deployen

### Methode 1: Handmatig
1. Pull laatste wijzigingen: `git pull origin main`
2. Rebuild: `pnpm build`
3. Upload nieuwe `dist/public/` bestanden

### Methode 2: Automatisch (met GitHub Actions)
Voeg `.github/workflows/deploy.yml` toe:

```yaml
name: Deploy to TransIP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ftp.studiohyra.nl
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/public/
          server-dir: /public_html/tsh/
```

## 📁 Bestandsstructuur na Deployment

```
public_html/tsh/
├── index.html                 # Main HTML file
├── .htaccess                  # Apache config voor routing
├── data/                      # Research data
│   ├── pasted_file_*.md       # Markdown documenten
│   └── pasted_file_*.json     # Sentiment data
└── assets/                    # Compiled JS/CSS
    ├── index-*.js
    └── index-*.css
```

## 🔧 Troubleshooting

### Probleem: 404 errors bij navigatie
**Oplossing**: Controleer of `.htaccess` correct is geconfigureerd

### Probleem: Data laadt niet
**Oplossing**: Controleer of alle bestanden in `data/` folder staan en toegankelijk zijn

### Probleem: Styling werkt niet
**Oplossing**: Controleer of `assets/` folder correct is geüpload met alle CSS bestanden

### Probleem: Base path issues
Als de site onder `/tsh/` draait, zorg dat `vite.config.ts` correct is:

```typescript
export default defineConfig({
  base: '/tsh/',
  // ... rest of config
});
```

## 📊 Performance Optimalisatie

1. **Gzip compressie**: Zorg dat mod_deflate enabled is in Apache
2. **Browser caching**: .htaccess regels zijn al toegevoegd
3. **CDN**: Overweeg Cloudflare voor extra snelheid
4. **Image optimization**: Alle images zijn al geoptimaliseerd

## 🔒 Security

- Alle data is public (geen gevoelige informatie)
- Geen database of backend vereist
- Geen user authentication nodig
- HTTPS wordt automatisch afgehandeld door TransIP

## 📞 Support

Bij problemen:
1. Check browser console voor errors
2. Check Apache error logs op server
3. Verifieer dat alle bestanden correct zijn geüpload
4. Test met `curl https://www.studiohyra.nl/tsh/data/pasted_file_rTnf85_README.md`

## ✅ Deployment Checklist

- [ ] Repository gecloned/geüpload
- [ ] Dependencies geïnstalleerd
- [ ] Build succesvol uitgevoerd
- [ ] `dist/public/` bestanden geüpload naar `/public_html/tsh/`
- [ ] `.htaccess` geconfigureerd
- [ ] Website test op https://www.studiohyra.nl/tsh
- [ ] Alle pagina's werken (Landing, Summary, Brands, Personas, Sentiment, Data Sources)
- [ ] Navigatie werkt correct
- [ ] Data laadt correct
- [ ] Mobile responsive test

## 🎉 Klaar!

Je TSH Research Platform is nu live op https://www.studiohyra.nl/tsh

