# Landing Page for martinkanocz.dev

Tato složka obsahuje jednoduchou statickou landing page připravenou pro GitHub Pages.

## Co sem patří

Do publikované verze patří tyto soubory:

- `index.html`
- `styles.css`
- `favicon.svg`
- `CNAME`
- `.nojekyll`

## Nejjednodušší způsob nasazení na GitHub Pages

### Varianta A: samostatný repozitář pro web

Tohle je pro začátek nejjednodušší a nejméně matoucí varianta.

1. Na GitHubu vytvořte nový veřejný repozitář.
2. Pokud chcete, aby web běžel přímo jako osobní stránka, pojmenujte repozitář `martinkanocz.github.io`.
3. Nahrajte do něj obsah této složky `landing-page/` přímo do kořene repozitáře.
4. Na GitHubu otevřete repozitář a jděte do `Settings` -> `Pages`.
5. V části `Build and deployment` nastavte:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. Uložte změny.
7. GitHub Pages web během chvíle publikuje.

### Varianta B: stejný repozitář, ale samostatná publikační větev

Pokud nechcete nový repozitář, můžete obsah `landing-page/` publikovat z jiné větve tak, aby se nepletl s aplikací LocalReach.

1. Vytvořte novou větev například `pages-site`.
2. Do kořene této větve zkopírujte obsah složky `landing-page/`.
3. Na GitHubu otevřete `Settings` -> `Pages`.
4. Nastavte:
   - `Source`: `Deploy from a branch`
   - `Branch`: `pages-site`
   - `Folder`: `/ (root)`
5. Uložte změny.

## Jak připojit doménu martinkanocz.dev

### 1. Nejprve nastavte doménu v GitHub Pages

1. Otevřete GitHub repozitář, ze kterého stránku publikujete.
2. Jděte do `Settings` -> `Pages`.
3. Do pole `Custom domain` napište:

```text
martinkanocz.dev
```

4. Uložte.

Pokud publikujete z větve, GitHub obvykle vytvoří nebo použije soubor `CNAME`. Ten už je v této složce připravený.

### 2. Nastavte DNS u registrátora domény

Pro apex doménu `martinkanocz.dev` GitHub doporučuje `A` záznamy na tyto adresy:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Volitelně můžete přidat i `www` subdoménu jako `CNAME`:

- host: `www`
- target: `martinkanocz.github.io`

Pokud nastavíte apex doménu i `www`, GitHub Pages umí `www` přesměrovat na hlavní doménu správně.

### 3. Zapněte HTTPS

Po správném nastavení DNS:

1. Vraťte se do `Settings` -> `Pages`.
2. Počkejte, až bude dostupná volba `Enforce HTTPS`.
3. Zapněte ji.

Někdy je potřeba počkat několik minut až hodin, než se DNS a certifikát propíšou.

## Doporučené DNS záznamy

Příklad, co budete pravděpodobně potřebovat:

### Apex doména

- typ: `A`
- host: `@`
- hodnota: `185.199.108.153`

- typ: `A`
- host: `@`
- hodnota: `185.199.109.153`

- typ: `A`
- host: `@`
- hodnota: `185.199.110.153`

- typ: `A`
- host: `@`
- hodnota: `185.199.111.153`

### WWW varianta

- typ: `CNAME`
- host: `www`
- hodnota: `martinkanocz.github.io`

## Důležité poznámky

- Nepoužívejte wildcard záznam typu `*.martinkanocz.dev`.
- Pokud GitHub Pages hlásí problém s doménou, zkontrolujte, že soubor `CNAME` zůstal v publikovaném kořeni.
- DNS změny se mohou propisovat až 24 hodin.

## Odkazy na oficiální dokumentaci GitHub

- Custom domain setup: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Troubleshooting: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
- Domain verification: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
