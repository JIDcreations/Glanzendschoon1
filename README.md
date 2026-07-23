# Glanzend Schoon — website

Nieuwe, statische website (geen build-tool nodig) ter vervanging van de oude site. Eén pagina met anchor-navigatie: Hero (met voor/na-schuifknop), Diensten, Werkwijze, Galerij, Over ons, Contact.

## Structuur

```
index.html             – volledige one-pager
css/style.css           – volledig design system (kleuren, typografie, componenten)
js/main.js              – mobiel menu, voor/na-schuifknop, scroll-spy nav, formuliervalidatie, scroll-animaties
assets/img/              – geoptimaliseerde webp-afbeeldingen + favicon
assets/source/           – originele, ongewijzigde foto's van de oude site (referentie, niet gelinkt)
glanzendschoon_tekst.txt – geëxporteerde tekst van de oude site (referentie)
```

## Contactformulier activeren

Het formulier onderaan de pagina (`#contact`) is functioneel opgebouwd (validatie, foutmeldingen, succesmelding) maar heeft nog geen echte verzendbestemming, omdat een statische site geen server heeft om e-mails te versturen.

1. Maak een gratis account op [formspree.io](https://formspree.io).
2. Maak een nieuw formulier aan en kopieer de endpoint-ID.
3. Open `index.html`, zoek `YOUR_FORM_ID` in het `<form action="...">`-attribuut en vervang het door uw eigen ID.

Zonder deze stap toont het formulier na versturen enkel een lokale bevestiging — er komt dan geen e-mail aan. Telefoon (0496 07 20 39) en e-mail (info@glanzendschoon.be) werken sowieso, ook zonder deze stap.

## Lokaal bekijken

```
python3 -m http.server 8000
```
en open `http://localhost:8000`.

## Hosting

De site is 100% statisch (HTML/CSS/JS) en kan zonder aanpassing op elke gewone webhost, Netlify, Vercel of GitHub Pages geplaatst worden — gewoon alle bestanden uploaden.
# Glanzendschoon1
