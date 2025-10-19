# TransIP Deployment Instructies

## Optie 1: Via FTP/SFTP (Makkelijkst)

### Stap 1: Download de production build
Download de `tsh-production.tar.gz` file van GitHub of van de checkpoint.

### Stap 2: Upload via FTP
1. Open een FTP client (bijv. FileZilla)
2. Verbind met:
   - Host: `stufbn.ssh.transip.me`
   - Gebruikersnaam: `studiohyranl`
   - Wachtwoord: `$studiohyra01#`
   - Poort: 22 (SFTP)

3. Navigeer naar de `public_html` folder
4. Maak een `tsh` subfolder aan (als die nog niet bestaat)
5. Upload alle bestanden uit `dist/public/` naar `public_html/tsh/`

### Stap 3: Maak .htaccess bestand
Maak een nieuw bestand `public_html/tsh/.htaccess` met de volgende inhoud:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect all requests to index.html for client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /tsh/index.html [L]

# Set correct MIME types
AddType application/javascript .js
AddType text/css .css
AddType application/json .json

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 1 week"
</IfModule>
```

### Stap 4: Test de website
Bezoek https://www.studiohyra.nl/tsh en controleer of alles werkt.

---

## Optie 2: Via SSH + SCP

### Stap 1: Upload via SCP
```bash
# Upload de tarball
scp tsh-production.tar.gz studiohyranl@stufbn.ssh.transip.me:~/

# Verbind via SSH (met password prompt)
ssh studiohyranl@stufbn.ssh.transip.me
```

### Stap 2: Extract op de server
```bash
# Maak tsh folder aan
mkdir -p ~/public_html/tsh

# Extract de tarball
cd ~/public_html/tsh
tar -xzf ~/tsh-production.tar.gz

# Verwijder de tarball
rm ~/tsh-production.tar.gz
```

### Stap 3: Maak .htaccess
```bash
cat > ~/public_html/tsh/.htaccess << 'EOF'
# Enable rewrite engine
RewriteEngine On

# Redirect all requests to index.html for client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /tsh/index.html [L]

# Set correct MIME types
AddType application/javascript .js
AddType text/css .css
AddType application/json .json

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 1 week"
</IfModule>
EOF
```

### Stap 4: Set permissions
```bash
chmod 755 ~/public_html/tsh
chmod 644 ~/public_html/tsh/.htaccess
find ~/public_html/tsh -type f -exec chmod 644 {} \;
find ~/public_html/tsh -type d -exec chmod 755 {} \;
```

---

## Bestandsstructuur na deployment

```
public_html/
└── tsh/
    ├── .htaccess
    ├── index.html
    ├── the-social-hub-logo.png
    ├── assets/
    │   ├── index-[hash].css
    │   └── index-[hash].js
    └── data/
        ├── source_references.json
        └── [alle markdown bestanden]
```

---

## Troubleshooting

### Probleem: 404 errors bij navigatie
**Oplossing**: Controleer of `.htaccess` correct is geüpload en of mod_rewrite enabled is.

### Probleem: CSS/JS laden niet
**Oplossing**: Controleer of de `assets/` folder correct is geüpload met alle bestanden.

### Probleem: Data laadt niet
**Oplossing**: Controleer of de `data/` folder met alle `.md` en `.json` bestanden is geüpload.

### Probleem: Permissie errors
**Oplossing**: Run de chmod commando's uit Stap 4 van Optie 2.

---

## Updates deployen

Om updates te deployen:
1. Build nieuwe versie: `pnpm build`
2. Upload alleen de gewijzigde bestanden via FTP
3. Of upload hele nieuwe tarball en extract opnieuw

**Let op**: De `.htaccess` hoeft maar 1x geüpload te worden, tenzij je wijzigingen hebt gemaakt.

