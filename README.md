# 🦉 Koulu-apuri (PWA 4. luokan matematiikkaan & kokeisiin)

**Koulu-apuri** on iPadille ja mobiililaitteille optimoitu, pelillinen Progressive Web App (PWA) 4. luokkalaisen kokeisiin kertaamiseen ja matematiikan perustaitojen vahvistamiseen.

Sovellus on suunniteltu toimimaan saumattomasti iPadin **Ruutuaika (Screen Time)** -rajoitusten kanssa ilman, että lapselle tarvitsee antaa vapaata pääsyä internetselaimeen.

---

## ✨ Tärkeimmät ominaisuudet

- **Pelillisyys & palkitsevuus:**
  - XP-kokemuspisteet, tasojärjestelmä (Tasot 1–10: *Laskijanoorukista Matikkaneroon*).
  - Päivittäinen harjoitteluputki (Streak 🔥) ja päivän treeni.
  - Ansaitut tähdet ⭐ ja palkintokauppa, jossa sekä virtuaalisia palkintoja että vanhemman määrittelemiä tosielämän palkintoja (esim. *leffaherkku*, *30 min peliaikaa*).
  - Välitön kannustava palaute, sisäänrakennetut ääniefektit (Web Audio API) ja konfettianimaatiot ilman ulkoisia riippuvuuksia.
- **Koe-tutka & älykäs kertausaikataulu:**
  - Tulevien kokeiden päivämäärät ja koealueet.
  - Automaattinen suositus ja laskuri (14 pv $\rightarrow$ 7 pv $\rightarrow$ 2 pv $\rightarrow$ koepäivä).
- **4. luokan opetussuunnitelman (OPS) mukaiset tehtävät:**
  - Kertolaskut (taulut 1–10, kompastuskivet 6–9, kympeillä kertominen).
  - Jakolaskut (jakoviiva, jakojäännös).
  - Murtoluvut (visuaaliset piirakat, osan laskeminen luvusta, vertailu, yhteenlasku).
  - Lukualue 0–100 000 ja pyöristäminen (kymppiin, sataan, tuhanteen, lukujonot).
  - Mittaaminen & geometria (piiri, pituus-, massa- ja tilavuusmuunnokset, kello).
  - Arjen sanalliset monivaihetehtävät.
- **Täysi yksityisyys & Local-First (Tiedot pysyvät omalla koneella/iPadilla):**
  - Kaikki lapsen suoritustiedot tallentuvat paikallisesti laitteen selaimeen (`localStorage`).
  - Omat koemateriaalit, sanalliset kysymykset ja vastausavaimet ovat `.gitignore`-suojattuja, jotta ne eivät päädy julkiseen GitHub-repositorioon.
  - Vanhempi voi tuoda laitteelle omia kysymyspaketteja ja kokeita suoraan JSON-tiedostosta (`materiaali-esimerkki.json`).
- **100 % offline-toimivuus (Service Worker):**
  - Toimii ensilatauksen jälkeen ilman verkkoyhteyttä.

---

## 🚀 Käyttöönotto GitHub Pagesiin

1. **Vie repositorio GitHubiin:**
   ```bash
   cd "/Users/donmiguel/Documents/VS Code/koulu-apuri"
   git add .
   git commit -m "Initial commit: Koulu-apuri PWA"
   # Luo GitHubissa uusi repositorio nimellä 'koulu-apuri' ja yhdistä se:
   # git remote add origin https://github.com/<kayttajatunnus>/koulu-apuri.git
   # git branch -M main
   # git push -u origin main
   ```

2. **Kytke GitHub Pages päälle:**
   - Mene GitHubissa repositorion asetuksiin: **Settings $\rightarrow$ Pages**.
   - Valitse *Branch*: `main` ja kansio `/ (root)`. Paina **Save**.
   - Saat osoitteen muotoa: `https://<kayttajatunnus>.github.io/koulu-apuri/`

---

## 📱 iPadin asennus ja selaimen lukitseminen (Ruutuaika)

Kun sivu on julkaistu GitHub Pagesiin:

1. **Asenna sovellus Koti-valikkoon:**
   - Avaa GitHub Pages -osoite iPadin Safarilla.
   - Paina Safarin jakovalikkoa (neliö ja nuoli ylös) $\rightarrow$ **Lisää Koti-valikkoon** (*Add to Home Screen*).
   - Nyt sovellus näkyy iPadin kotivalikossa omana sovelluksenaan.

2. **Lukitse Safari Ruutuajalla (lapsi ei pääse muualle nettiin):**
   - Avaa iPadin: **Asetukset $\rightarrow$ Ruutuaika $\rightarrow$ Sisältö ja yksityisyys $\rightarrow$ Sisältörajoitukset $\rightarrow$ Verkkosisältö**.
   - Valitse: **Vain sallitut sivustot** (*Allowed Websites Only*).
   - Poista Applen oletuslistalta turhat sivustot ja lisää listaan **vain PWA:si GitHub Pages -osoite**.
   - *(Valinnainen)*: Voit poistaa tavallisen Safari-kuvakkeen kotivalikosta napauttamalla sitä pitkään $\rightarrow$ *Poista appi* $\rightarrow$ *Poista Koti-valikosta*.

3. **(Vaihtoehto) Ohjattu käyttö:**
   - Voit myös käyttää iPadin **Ohjattua käyttöä** (*Asetukset $\rightarrow$ Käyttöapu $\rightarrow$ Ohjattu käyttö*), jolloin virtapainiketta kolmesti painamalla iPad lukittuu pelkästään tähän sovellukseen kertaussession ajaksi.

---

## 🧪 Paikallinen testaus omalla koneella

Voit testata sovellusta tietokoneella suoraan avaamalla `index.html` selaimessa tai käynnistämällä paikallisen palvelimen:

```bash
cd "/Users/donmiguel/Documents/VS Code/koulu-apuri"
python3 -m http.server 8080
```
Avaa sen jälkeen selaimessa: `http://localhost:8080`
