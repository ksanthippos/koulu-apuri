/**
 * Koulu-apuri: 4. luokan Ympäristöoppi ja Yhteiskuntaoppi -moottori
 * Perustuu Suomen Opetushallituksen OPS 2016 -perusopetuksen opetussuunnitelmaan.
 * Sisältää laajan kysymyspankin, adaptiiviset tasot 1–3, monivalinnat, totta/tarua -tehtävät
 * sekä visuaaliset SVG-tunnistustehtävät (kompassi, puiden lehdet, kierrätys, elimet, liikennemerkit, ikärajat).
 */

class SubjectEngine {
  constructor() {
    this.customQuestions = [];
    this.initQuestionBanks();
  }

  setCustomQuestions(questions) {
    this.customQuestions = questions || [];
  }

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  pick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ==========================================
  // KYSYMYSPANKIT (OPS 2016 - 4. LUOKKA)
  // ==========================================
  initQuestionBanks() {
    // ----------------------------------------
    // YMPÄRISTÖOPPI
    // ----------------------------------------
    this.ymppiQuestions = {
      ymppi_metsa: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          question: 'Mikä seuraavista puista on havupuu?',
          options: ['Mänty', 'Rauduskoivu', 'Haapa', 'Kotipihlaja'],
          answer: 'Mänty',
          hint: 'Männyllä on vihreät neulaset ympäri vuoden.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mihin metsän kasvillisuuskerrokseen mustikka ja puolukka kuuluvat?',
          options: ['Kenttäkerrokseen', 'Pohjakerrokseen', 'Pensaskerrokseen', 'Puukerrokseen'],
          answer: 'Kenttäkerrokseen',
          hint: 'Kenttäkerroksen muodostavat varvut, heinät ja ruohot.'
        },
        {
          level: 1,
          type: 'choice',
          visual: { type: 'leaf', tree: 'koivu' },
          question: 'Minkä puun lehti on kuvassa?',
          options: ['Koivu', 'Haapa', 'Tammi', 'Mänty'],
          answer: 'Koivu',
          hint: 'Koivun lehti on kolmiomainen ja sahalaitainen. Sen runko on valkoinen tuohi.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä jokaisenoikeuksien (jokamiehenoikeuksien) mukaan SAA tehdä?',
          options: ['Poimia luonnonmarjoja ja sieniä', 'Tehdä nuotio toisen metsään ilman lupaa', 'Katkoa elävistä puista oksia', 'Roskata luontoon'],
          answer: 'Poimia luonnonmarjoja ja sieniä',
          hint: 'Luonnonmarjojen ja ruokasienien poimiminen on jokaisen vapaa oikeus!'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä sammalet ja jäkälät muodostavat metsässä?',
          options: ['Pohjakerroksen', 'Kenttäkerroksen', 'Latvuskerroksen', 'Pensaskerroksen'],
          answer: 'Pohjakerroksen',
          hint: 'Pohjakerros on kaikkein alinna maan pinnassa.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Onko väite totta vai tarua:\n"Kuusen neulaset putoavat joka syksy maahan kuten koivun lehdet."',
          options: ['Tarua', 'Totta'],
          answer: 'Tarua',
          hint: 'Kuusi on ainavihanta havupuu, jonka neulaset pysyvät oksissa vuodesta toiseen.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          visual: { type: 'leaf', tree: 'manty' },
          question: 'Kuvassa on neulasia, jotka kasvavat kaksi kerrallaan. Mikä puu on kyseessä?',
          options: ['Mänty', 'Kuusi', 'Kataja', 'Lehtikuusi'],
          answer: 'Mänty',
          hint: 'Männyn neulaset kasvavat pareittain tuppeen kiinnittyneinä.'
        },
        {
          level: 2,
          type: 'choice',
          visual: {
            type: 'foodchain',
            items: ['Männynkäpy 🌲', 'Orava 🐿️', 'Kanahaukka 🦅']
          },
          question: 'Kuka on kuvan ravintoketjussa TUOTTAJA?',
          options: ['Mänty (käpy)', 'Orava', 'Kanahaukka', 'Ihminen'],
          answer: 'Mänty (käpy)',
          hint: 'Tuottajat ovat vihreitä kasveja, jotka valmistavat ravintoa auringon valon avulla.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mitä jokaisenoikeuksien mukaan EI SAA tehdä ilman maanomistajan lupaa?',
          options: ['Tehdä avotulta metsään', 'Poimia mustikoita', 'Kävellä metsässä', 'Hiihtää talvella metsässä'],
          answer: 'Tehdä avotulta metsään',
          hint: 'Nuotion ja avotulen tekoon tarvitaan aina maanomistajan lupa.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miten karhu viettää Suomen talven?',
          options: ['Nukkuu talviunta pesässään', 'Muuttaa etelään lämpimään', 'On valveilla ja saalistaa normaalisti', 'Menee talvihorrokseen ruumiinlämpö nollassa'],
          answer: 'Nukkuu talviunta pesässään',
          hint: 'Karhu nukkuu talviunta. Sen ruumiinlämpö laskee vain muutaman asteen, ja se voi herätä häirittynä.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä metsän eläin hakkaa nokallaan puuhun koloja ja syö kuoren alla eläviä hyönteisiä?',
          options: ['Käpytikka', 'Varis', 'Metso', 'Kuukkeli'],
          answer: 'Käpytikka',
          hint: 'Tikalla on vahva nokka puun hakkaamiseen ja pitkä kieli hyönteisten poimimiseen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miksi haavan lehdet havisevat ja heiluvat herkästi pienessäkin tuulenvireessä?',
          options: ['Haavan lehtiruoti on litteä ja pitkä', 'Haapa on ontto puu', 'Haavan lehdet ovat tehty vahasta', 'Linnut heiluttavat niitä'],
          answer: 'Haavan lehtiruoti on litteä ja pitkä',
          hint: 'Haavan lehtiruoti on sivuilta litteä, mikä saa lehden värisemään pienestäkin ilmavirtauksesta.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Mikä on hajottajien (esim. sienirihmastot ja lierot) elintärkeä tehtävä metsässä?',
          options: ['Ne palauttavat kuolleen aineksen ravinteet takaisin maaperään kasvien käyttöön', 'Ne tuottavat auringonvaloa kasveille', 'Ne karkottavat pedot pois metsästä', 'Ne estävät puiden kasvamisen liian korkeiksi'],
          answer: 'Ne palauttavat kuolleen aineksen ravinteet takaisin maaperään kasvien käyttöön',
          hint: 'Hajottajat huolehtivat luonnon kiertokulusta pilkkomalla kuolleet kasvit ja eläimet ravinteiksi.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä fotosynteesi eli yhteyttäminen tarkoittaa vihreissä kasveissa?',
          options: ['Kasvi valmistaa auringonvalon avulla vettä ja hiilidioksidia sokeriksi ja hapeksi', 'Kasvi pudottaa lehtensä syksyllä', 'Kasvi ottaa happea ja puhaltaa ilmaan hiilidioksidia', 'Kasvi imee maasta multaa ravinnokseen'],
          answer: 'Kasvi valmistaa auringonvalon avulla vettä ja hiilidioksidia sokeriksi ja hapeksi',
          hint: 'Fotosynteesissä kasvi tuottaa sokeria omaan kasvuunsa ja vapauttaa ilmaan meille elintärkeää happea.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tarkoittaa lajin UHanalaisuus?',
          options: ['Laji on vaarassa kuolla sukupuuttoon, ellei sitä suojella', 'Laji on erittäin yleinen ja haitallinen', 'Laji syö vain lihaa', 'Laji muuttaa talveksi pois Suomesta'],
          answer: 'Laji on vaarassa kuolla sukupuuttoon, ellei sitä suojella',
          hint: 'Uhanalaiset lajit tarvitsevat suojelua, jotta niiden elinympäristö säilyy ja kanta elpyy.'
        },
        {
          level: 3,
          type: 'choice',
          visual: { type: 'leaf', tree: 'tammi' },
          question: 'Tunnista kuvan puulaji, jonka lehdissä on pyöreät liuskat ja hedelmänä terhoja:',
          options: ['Tammi', 'Pihlaja', 'Vaahtera', 'Koivu'],
          answer: 'Tammi',
          hint: 'Tammi on jalo lehtipuu, jonka hedelmiä ovat tammenterhot.'
        }
      ],

      ymppi_vedet: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          question: 'Mikä on Suomen kansalliskala, jolla on tummat pystyraidat ja punaiset vatsaevät?',
          options: ['Ahven', 'Hauki', 'Lohi', 'Särki'],
          answer: 'Ahven',
          hint: 'Ahven on Suomen yleisin ja tunnetuin kala järvissä ja rannikoilla.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Minkälaista vettä Itämeressä on?',
          options: ['Murtovettä (makean ja suolaisen veden seosta)', 'Täysin suolatonta makeaa vettä', 'Yhtä suolaista kuin valtamerissä', 'Kivennäisvettä'],
          answer: 'Murtovettä (makean ja suolaisen veden seosta)',
          hint: 'Itämeren vesi on murtovettä, koska siihen laskee satoja jokia mutta yhteys valtamereen on kapea.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä vedelle tapahtuu, kun aurinko lämmittää järven pintaa?',
          options: ['Vettä haihtuu ilmaan näkymättömäksi vesihöyryksi', 'Vesi jäätyy pohjaan asti', 'Vesi muuttuu kivennäisaineeksi', 'Vesi katoaa maapallolta avaruuteen'],
          answer: 'Vettä haihtuu ilmaan näkymättömäksi vesihöyryksi',
          hint: 'Lämpö saa veden haihtumaan ja nousemaan ilmakehään pilviksi.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Onko väite totta vai tarua:\n"Saimaannorppa on harvinainen hyljelaji, joka elää vain Saimaan makeassa vedessä."',
          options: ['Totta', 'Tarua'],
          answer: 'Totta',
          hint: 'Saimaannorppa jäi jääkauden jälkeen eristyksiin Saimaalle ja se elää vain Suomessa.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          question: 'Mistä järvien ja Itämeren REHEVÖITYMINEN pääasiassa johtuu?',
          options: ['Liiallisista ravinteista (typpi ja fosfori) pelloilta ja jätevesistä', 'Veden liiallisesta kylmyydestä talvella', 'Kaloja kalastetaan liikaa', 'Moottoriveneiden aalloista'],
          answer: 'Liiallisista ravinteista (typpi ja fosfori) pelloilta ja jätevesistä',
          hint: 'Ravinnehuuhtoumat lannoittavat levää ja vesikasveja, mikä johtaa leväkukintoihin ja hapenpuutteeseen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä petokala väijyy saalistaan vesikasvien seassa ja sillä on terävät taaksepäin kaartuvat hampaat?',
          options: ['Hauki', 'Lahna', 'Muikku', 'Kiiski'],
          answer: 'Hauki',
          hint: 'Hauki on vesiemme tehokas peto, jolla on leveä suu ja valtavasti hampaita.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä on veden kiertokulun oikea järjestys?',
          options: [
            'Haihtuminen ➔ Tiivistyminen pilviksi ➔ Sade ➔ Virtaus vesistöihin',
            'Sade ➔ Haihtuminen ➔ Tiivistyminen ➔ Jäätyminen',
            'Tiivistyminen ➔ Virtaus ➔ Sade ➔ Haihtuminen',
            'Haihtuminen ➔ Sade ➔ Tiivistyminen ➔ Haihtuminen'
          ],
          answer: 'Haihtuminen ➔ Tiivistyminen pilviksi ➔ Sade ➔ Virtaus vesistöihin',
          hint: 'Vesi haihtuu auringon lämmöstä, tiivistyy ylhäällä pilviksi, sataa maahan ja virtaa jokia pitkin mereen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miksi Itämeri on erityisen herkkä saastumiselle?',
          options: ['Se on matala sisämeri ja sen vesi vaihtuu valtamerestä hyvin hitaasti', 'Siinä elää liian vähän kaloja', 'Itämeressä ei tuule koskaan', 'Itämeri on maapallon suurin valtameri'],
          answer: 'Se on matala sisämeri ja sen vesi vaihtuu valtamerestä hyvin hitaasti',
          hint: 'Itämeren keskisyvyys on vain n. 55 metriä ja veden uusiutuminen kestää noin 30 vuotta.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tarkoittaa POHJAVESI ja miten se syntyy?',
          options: [
            'Maaperän ja hiekkaharjujen läpi suodattunutta puhdasta vettä',
            'Järven kaikkein syvimmässä pohjamudassa makaavaa vettä',
            'Meriveden suolapitoisinta pohjakerrosta',
            'Kaivoon letkulla laskettua vettä'
          ],
          answer: 'Maaperän ja hiekkaharjujen läpi suodattunutta puhdasta vettä',
          hint: 'Sadevesi suodattuu hiekan ja soran läpi puhdistuen ja varastoituu pohjavedeksi, jota käytetään juomavetenä.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tapahtuu Itämeren syvänteissä, kun kuollutta levää hajoaa suuria määriä pohjassa?',
          options: ['Hajottajabakteerit kuluttavat kaiken hapen ja syntyy happikato', 'Pohjaan syntyy kultaa ja mineraaleja', 'Vesi muuttuu makeaksi juomavedeksi', 'Kalat lisääntyvät ennätysmäärin'],
          answer: 'Hajottajabakteerit kuluttavat kaiken hapen ja syntyy happikato',
          hint: 'Hapenpuute tekee pohjasta elottoman vyöhykkeen, jossa pohjaeläimet eivät pysty selviämään.'
        }
      ],

      ymppi_keho: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          visual: { type: 'organ', name: 'sydan' },
          question: 'Mikä elintärkeä elin on kuvassa ja mitä se tekee?',
          options: ['Sydän – pumppaa verta kehoon', 'Keuhkot – ottavat happea', 'Aivot – ohjaavat ajattelua', 'Munuaiset – puhdistavat verta'],
          answer: 'Sydän – pumppaa verta kehoon',
          hint: 'Sydän on lihas, joka sykkii lakkaamatta ja kuljettaa verta verisuonissa.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mikä on ihmisen suurin aistinelin?',
          options: ['Iho (tuntoaisti)', 'Silmät (näköaisti)', 'Kieli (makuaisti)', 'Korvat (kuuloaisti)'],
          answer: 'Iho (tuntoaisti)',
          hint: 'Iho peittää koko kehoamme ja sen avulla aistimme kosketusta, lämpöä, kylmää ja kipua.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Kuinka paljon 4-luokkalainen tarvitsee unta joka yö voidakseen hyvin ja oppiakseen koulussa?',
          options: ['Noin 9–10 tuntia', 'Noin 5–6 tuntia', 'Noin 14 tuntia', 'Noin 4 tuntia'],
          answer: 'Noin 9–10 tuntia',
          hint: 'Lapsen aivot ja keho tarvitsevat säännöllisesti n. 9–10 tuntia lepoa kasvuun ja palautumiseen.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Miksi pysyviä hampaita pitää harjata kaksi kertaa päivässä fluorihammastahnalla?',
          options: ['Se poistaa bakteerit ja suojaa hampaita reikiintymiseltä', 'Se värjää hampaat keltaisiksi', 'Se tekee hampaista pehmeämmät', 'Hampaita ei tarvitsisi pestä'],
          answer: 'Se poistaa bakteerit ja suojaa hampaita reikiintymiseltä',
          hint: 'Fluori vahvistaa hammaskiillettä ja säännöllinen pesu estää hammaspeikon eli kariesbakteerin tuhoja.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          visual: { type: 'organ', name: 'keuhkot' },
          question: 'Mikä on kuvassa näkyvien keuhkojen tärkein tehtävä?',
          options: [
            'Hapittaa verta hengitysilmasta ja poistaa hiilidioksidia',
            'Pilkkoa ruokaa ja ravintoaineita',
            'Pumpata verta varpaisiin',
            'Valmistaa uusia luita'
          ],
          answer: 'Hapittaa verta hengitysilmasta ja poistaa hiilidioksidia',
          hint: 'Sisäänhengityksessä keuhkorakkuloista siirtyy happea vereen ja uloshengityksessä poistuu hiilidioksidia.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä suojaa herkkää aivokudostamme iskuilta ja vammoilta?',
          options: ['Kallo (pään luusto)', 'Keuhkopussi', 'Kylkiluut', 'Hauislihas'],
          answer: 'Kallo (pään luusto)',
          hint: 'Kallon kovat luut muodostavat kypärämäisen suojakotelon aivoille.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miten lautasmallin mukaan ruokalautanen kannattaa koota lounaalla?',
          options: [
            'Puolet kasviksia/salaattia, 1/4 perunaa/riisiä/pastaa, 1/4 lihaa/kalaa/palkokasveja',
            'Koko lautanen pelkkää lihaa',
            'Puolet karkkia ja puolet pastaa',
            'Vain lasillinen maitoa ilman ruokaa'
          ],
          answer: 'Puolet kasviksia/salaattia, 1/4 perunaa/riisiä/pastaa, 1/4 lihaa/kalaa/palkokasveja',
          hint: 'Lautasmalli takaa, että saat riittävästi vitamiineja, kuituja, energiaa ja rakennusaineita.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miten luut ja lihakset saavat käden koukistumaan?',
          options: [
            'Lihas supistuu ja vetää jänteen avulla luuta kohti toista',
            'Luut liikkuvat itsestään ilman lihaksia',
            'Verisuonet työntävät kättä eteenpäin',
            'Aivot puhaltavat ilmaa niveleen'
          ],
          answer: 'Lihas supistuu ja vetää jänteen avulla luuta kohti toista',
          hint: 'Lihakset kiinnittyvät luihin jänteillä. Kun hauislihas supistuu, kyynärvarsi nousee.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Mikä veren soluista vastaa taudinaiheuttajien (kuten virusten ja bakteerien) torjumisesta kehossa?',
          options: ['Valkosolut', 'Punasolut', 'Verihiutaleet', 'Rasvasolut'],
          answer: 'Valkosolut',
          hint: 'Valkosolut ovat kehomme puolustusarmeija, joka taistelee infektioita vastaan.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tapahtuu hermostossa, kun kosketat vahingossa kuumaa kattilaa ja vedät kätesi salamannopeasti pois?',
          options: [
            'Syntyy nopea suojarefleksi selkäytimen kautta ennen kuin aivot ehtivät pohtia asiaa',
            'Käsi jää odottamaan aivojen hyväksyntää seuraavana päivänä',
            'Sydän lopettaa lyömisen hetkeksi',
            'Iho kytkee lihakset kokonaan pois päältä'
          ],
          answer: 'Syntyy nopea suojarefleksi selkäytimen kautta ennen kuin aivot ehtivät pohtia asiaa',
          hint: 'Refleksikaari kulkee selkäytimen kautta lihakseen salamannopeasti suojellakseen kehoa palovammalta.'
        }
      ],

      ymppi_kartat: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          visual: { type: 'compass', needle: 'pohjoinen' },
          question: 'Mihin pääilmansuuntaan kompassin punainen neula osoittaa kuvassa?',
          options: ['Pohjoinen', 'Etelä', 'Itä', 'Länsi'],
          answer: 'Pohjoinen',
          hint: 'Kompassin herkkä magneettineula hakeutuu aina kohti maapallon pohjoisnapaa (Pohjoinen / North).'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mikä on Suomen valtion pääkaupunki?',
          options: ['Helsinki', 'Tampere', 'Turku', 'Rovaniemi'],
          answer: 'Helsinki',
          hint: 'Helsinki sijaitsee Suomen etelärannikolla ja on maamme hallinnon keskus.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä vihreä väri yleensä esittää tavallisessa maastokartassa?',
          options: ['Metsää tai puistoaluetta', 'Järveä tai merta', 'Asfaltoitua moottoritietä', 'Korkeaa vuorenhuippua'],
          answer: 'Metsää tai puistoaluetta',
          hint: 'Kartalla sininen on vettä, keltainen peltoa ja vihreä metsää.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Jos seisot kasvot kohti Pohjoista, mikä ilmansuunta on oikealla puolellasi?',
          options: ['Itä', 'Länsi', 'Etelä', 'Koillinen'],
          answer: 'Itä',
          hint: 'Muistisääntö kellonsuuntaan ylhäältä alkaen: Pohjoinen, Itä, Etelä, Länsi (P-I-E-L).'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          visual: { type: 'compass', needle: 'ita' },
          question: 'Kompassin neula osoittaa suoraan oikealle (kello 3:een). Mikä pääilmansuunta se on?',
          options: ['Itä', 'Länsi', 'Pohjoinen', 'Etelä'],
          answer: 'Itä',
          hint: 'Kartalla oikealle katsottaessa suunta on Itä (East), josta aurinko aamuisin nousee.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä väli-ilmansuunta sijaitsee Pohjoisen ja Idän puolivälissä?',
          options: ['Koillinen', 'Kaakko', 'Lounas', 'Luode'],
          answer: 'Koillinen',
          hint: 'Pohjoisen ja Idän välissä on Koillinen. (Muistisääntö: Koillinen, Kaakko, Lounas, Luode).'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä valtio sijaitsee Suomesta suoraan LÄNTEEN Pohjanlahden toisella puolella?',
          options: ['Ruotsi', 'Norja', 'Venäjä', 'Viro'],
          answer: 'Ruotsi',
          hint: 'Länsinaapurimme on Ruotsi, pääkaupunkinaan Tukholma.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mitä kartassa tarkoittaa mittakaava 1 : 100 000?',
          options: [
            '1 senttimetri kartalla vastaa luonnossa 1 kilometriä (100 000 cm)',
            'Koko kartta on 100 000 metriä leveä',
            'Alueella asuu 100 000 ihmistä',
            'Kartta on piirretty 100 000 vuotta sitten'
          ],
          answer: '1 senttimetri kartalla vastaa luonnossa 1 kilometriä (100 000 cm)',
          hint: 'Mittakaava kertoo, kuinka paljon todellisuutta on pienennetty kartalle (100 000 cm = 1 000 m = 1 km).'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          visual: { type: 'compass', needle: 'lounas' },
          question: 'Kompassin neula osoittaa Etelän ja Lännen väliin. Mikä väli-ilmansuunta on kyseessä?',
          options: ['Lounas', 'Kaakko', 'Luode', 'Koillinen'],
          answer: 'Lounas',
          hint: 'Etelän ja Lännen välinen suunta on Lounas (South-West).'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä kartan ruskeat KORKEUSKÄYRÄT kertovat maastosta, kun ne ovat piirretty hyvin lähelle toisiaan?',
          options: [
            'Mäki tai rinne on hyvin jyrkkä',
            'Maasto on aivan tasaista peltoa',
            'Alueella virtaa syvä joki',
            'Metsä on hakattu pois'
          ],
          answer: 'Mäki tai rinne on hyvin jyrkkä',
          hint: 'Mitä tiheämmässä korkeuskäyrät kulkevat, sitä jyrkemmin maaston korkeus nousee tai laskee.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Millä maapallon mantereella Suomi sijaitsee?',
          options: ['Eurooppa', 'Aasia', 'Pohjois-Amerikka', 'Afrikka'],
          answer: 'Eurooppa',
          hint: 'Suomi on Pohjois-Euroopan valtio ja osa Skandinaavista aluetta.'
        }
      ],

      ymppi_kierratys: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          visual: { type: 'bin', bin: 'bio' },
          question: 'Mihin kierrätysastiaan banaaninkuoret ja omenankannat lajitellaan?',
          options: ['Biojätteeseen', 'Kartonkikeräykseen', 'Sekajätteeseen', 'Lasinkeräykseen'],
          answer: 'Biojätteeseen',
          hint: 'Biojätteeseen kuuluvat kaikki maatuva ruokajäte, hedelmien kuoret ja kahvinporot.'
        },
        {
          level: 1,
          type: 'choice',
          visual: { type: 'bin', bin: 'kartonki' },
          question: 'Mihin astiaan tyhjä huuhdeltu maitotölkki ja muropaketti kuuluvat?',
          options: ['Kartonkikeräykseen', 'Paperinkeräykseen', 'Muovipakkauksiin', 'Biojätteeseen'],
          answer: 'Kartonkikeräykseen',
          hint: 'Kartonkipakkauksiin kuuluvat nestekartonkipakkaukset, pahvilaatikot ja keksipaketit.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Miksi käytettyjen paristojen navat pitää teipata piiloon ennen kuin ne viedään keräyslaatikkoon?',
          options: ['Jotta vältetään oikosulku ja tulipaloriski', 'Jotta ne eivät karkaa laatikosta', 'Jotta ne alkavat ladata itseään uudestaan', 'Teippaaminen on vain koriste'],
          answer: 'Jotta vältetään oikosulku ja tulipaloriski',
          hint: 'Paristoissa on aina vähän jäännösvirtaa. Jos niiden navat osuvat toisiinsa, voi syntyä kipinä ja tulipalo.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä sanomalehdille ja kotiin jaetuille mainoslehdille tehdään?',
          options: ['Lajitellaan paperinkeräykseen', 'Heitetään luontoon', 'Laitetaan biojäteastiaan', 'Viedään vaarallisen jätteen keräykseen'],
          answer: 'Lajitellaan paperinkeräykseen',
          hint: 'Puhdas ja kuiva postiluukusta tuleva paperi kuuluu siniseen paperinkeräysastiaan.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          visual: { type: 'bin', bin: 'metalli' },
          question: 'Mihin säilyketölkit, metallikorkit ja alumiinivuoat lajitellaan?',
          options: ['Metallikeräykseen', 'Sekajätteeseen', 'Kartonkikeräykseen', 'Lasiastiaan'],
          answer: 'Metallikeräykseen',
          hint: 'Kaikki kodin metallipakkaukset voidaan sulattaa ja käyttää ikuisesti uudelleen metallina.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Voiko rikkinäisen posliinimukin tai juomalasin laittaa lasipakkausten keräysastiaan?',
          options: [
            'Ei, posliini ja juomalasit kuuluvat sekajätteeseen (eri sulamispiste)',
            'Kyllä, kaikki lasinen ja keraaminen kelpaa samaan laatikkoon',
            'Kyllä, jos se rikotaan vielä pienemmiksi paloiksi',
            'Ei, ne pitää viedä paperinkeräykseen'
          ],
          answer: 'Ei, posliini ja juomalasit kuuluvat sekajätteeseen (eri sulamispiste)',
          hint: 'Lasipakkauksiin kuuluu vain purkit ja pullot. Juomalasi, ikkunalasi ja posliini sulavat eri lämmössä ja pilaavat kierrätyksen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä seuraavista energiamuodoista on UUSIUTUVAA ja ympäristöystävällistä?',
          options: ['Aurinko- ja tuulivoima', 'Kivihiilen poltto', 'Maaöljy', 'Turpeen poltto'],
          answer: 'Aurinko- ja tuulivoima',
          hint: 'Aurinko, tuuli ja virtaava vesi ovat ehtymättömiä energianlähteitä, jotka eivät lisää ilmastopäästöjä.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miksi pantilliset juomapullot ja tölkit kannattaa palauttaa kaupan palautusautomaattiin?',
          options: [
            'Materiaalit saadaan 100 % kiertoon ja palauttaja saa panttirahan takaisin',
            'Palautusautomaatit tekevät niistä uusia karkkeja',
            'Ne viedään kaatopaikalle peitettäväksi hiekalla',
            'Laki kieltää pullojen pesemisen kotona'
          ],
          answer: 'Materiaalit saadaan 100 % kiertoon ja palauttaja saa panttirahan takaisin',
          hint: 'Suomessa yli 90 % tölkeistä ja pulloista kiertää uusiokäyttöön erinomaisen panttijärjestelmän ansiosta.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tarkoittaa KIERTOTALOUS?',
          options: [
            'Talousmallia, jossa materiaaleja kierrätetään, korjataan ja käytetään mahdollisimman pitkään hukkaamatta',
            'Rahan kiertämistä vain pankkiautomaatissa',
            'Tavaroiden ostamista ja heti roskiin heittämistä',
            'Kaupassa kiertämistä ympyrää'
          ],
          answer: 'Talousmallia, jossa materiaaleja kierrätetään, korjataan ja käytetään mahdollisimman pitkään hukkaamatta',
          hint: 'Kiertotaloudessa roskia syntyy mahdollisimman vähän, kun tuotteet suunnitellaan kestäviksi ja korjattaviksi.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Miten jokainen 4-luokkalainen voi helposti vähentää omaa hiilijalanjälkeään arjessa?',
          options: [
            'Kävelemällä tai pyöräilemällä koulumatkat ja vähentämällä ruokahävikkiä',
            'Ostamalla joka viikko uusia vaatteita ja leluja',
            'Pitämällä kaikki valot päällä koko yön',
            'Heittämällä syömättömän ruoan aina roskiin'
          ],
          answer: 'Kävelemällä tai pyöräilemällä koulumatkat ja vähentämällä ruokahävikkiä',
          hint: 'Liikkuminen lihasvoimin ja lautasen syöminen tyhjäksi ovat huipputekoja luonnon ja ilmaston puolesta.'
        }
      ]
    };

    // ----------------------------------------
    // YHTEISKUNTAOPPI
    // ----------------------------------------
    this.yhteiskuntaQuestions = {
      yht_perhe: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          question: 'Mikä seuraavista väitteistä perheistä pitää paikkansa?',
          options: [
            'Perheitä on monenlaisia, ja jokainen perhe on arvokas ja tärkeä',
            'Kaikkien maailman perheiden on oltava täsmälleen samanlaisia',
            'Perheeseen voi kuulua vain kaksi aikuista ja yksi lapsi',
            'Lapsella ei saa olla useampaa kotia'
          ],
          answer: 'Perheitä on monenlaisia, ja jokainen perhe on arvokas ja tärkeä',
          hint: 'On ydinperheitä, uusperheitä, yhden vanhemman perheitä, sateenkaariperheitä ja sijaisperheitä – kaikki yhtä oikeita perheitä!'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä tarkoittaa hyvä kaveritaito ja empatia?',
          options: [
            'Kykyä asettua toisen asemaan ja kohdella muita ystävällisesti',
            'Sitä, että määrää aina mitä välitunnilla leikitään',
            'Toisten virheille ääneen nauramista',
            'Kaverin lelujen ottamista ilman lupaa'
          ],
          answer: 'Kykyä asettua toisen asemaan ja kohdella muita ystävällisesti',
          hint: 'Empatia tarkoittaa toisen tunteiden ymmärtämistä: "Miltä minusta tuntuisi hänen tilanteessaan?"'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Miten riita tai erimielisyys ystävän kanssa kannattaa selvittää reilusti?',
          options: [
            'Keskustelemalla rauhassa, kuuntelemalla molempia ja pyytämällä anteeksi',
            'Huutamalla kovempaa kuin toinen',
            'Lähtemällä karkuun ja puhumalla pahaa selän takana',
            'Käyttämällä fyysistä voimaa'
          ],
          answer: 'Keskustelemalla rauhassa, kuuntelemalla molempia ja pyytämällä anteeksi',
          hint: 'Riidat ratkeavat parhaiten rauhallisella puheella ja toista kunnioittamalla.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Onko väite totta vai tarua:\n"Kaikki tunteet, myös suuttumus ja pettymys, ovat sallittuja, mutta toista ei saa vahingoittaa."',
          options: ['Totta', 'Tarua'],
          answer: 'Totta',
          hint: 'Kaikki tunteet ovat normaaleja ihmisen tunteita. Tärkeintä on oppia purkamaan kiukkua turvallisesti satuttamatta muita.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          question: 'Mitä tarkoittaa YHDENVERTAISUUS yhteisössä?',
          options: [
            'Kaikkia ihmisiä kohdellaan tasapuolisesti ja kunnioittavasti ilman syrjintää',
            'Kaikkien pitää pukeutua samoihin vaatteisiin',
            'Vain parhaat urheilijat saavat kertoa mielipiteensä',
            'Kaikkien on pakko harrastaa samaa lajia'
          ],
          answer: 'Kaikkia ihmisiä kohdellaan tasapuolisesti ja kunnioittavasti ilman syrjintää',
          hint: 'Yhdenvertaisuus tarkoittaa, että ketään ei saa syrjiä iän, sukupuolen, syntyperän tai mielipiteen takia.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mitä voit tehdä, jos huomaat koulun pihalla oppilaan seisovan yksin surullisena?',
          options: [
            'Mene kysymään rohkeasti: "Haluatko tulla meidän mukaan leikkiin?"',
            'Osoittele häntä sormella ja naura kaverin kanssa',
            'Kävele ohi äläkä välitä lainkaan',
            'Käske häntä menemään pois paikalta'
          ],
          answer: 'Mene kysymään rohkeasti: "Haluatko tulla meidän mukaan leikkiin?"',
          hint: 'Pieni ystävällinen kysymys voi pelastaa toisen koulupäivän ja luoda uuden hienon ystävyyden.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mihin erilaisiin yhteisöihin 4-luokkalainen voi kuulua?',
          options: [
            'Perheeseen, luokkaan, kouluyhteisöön, harrastusjoukkueeseen ja kotikuntaan',
            'Vain ja ainoastaan omaan perheeseensä',
            'Lapsi ei kuulu mihinkään yhteisöön ennen kuin täyttää 18 vuotta',
            'Vain yhteen tietokonepeliin'
          ],
          answer: 'Perheeseen, luokkaan, kouluyhteisöön, harrastusjoukkueeseen ja kotikuntaan',
          hint: 'Kuulumme elämämme aikana moniin rikkaisiin yhteisöihin, joissa toimimme ja opimme yhdessä toisten kanssa.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tarkoittaa sanonta "kompromissi" riitatilanteen sovittelussa?',
          options: [
            'Ratkaisua, jossa molemmat osapuolet joustavat vähän, jotta päästään yhteiseen sopuun',
            'Sitä, että vahvin voittaa ja heikoin häviää aina',
            'Opettaja päättää kaiken kysymättä keneltäkään mitään',
            'Riidan unohtamista ilman että asialle tehdään mitään'
          ],
          answer: 'Ratkaisua, jossa molemmat osapuolet joustavat vähän, jotta päästään yhteiseen sopuun',
          hint: 'Kompromississa molemmat tulevat hieman vastaan, jolloin lopputulos on reilu molemmille.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä lapsen itsetunto tarkoittaa ja miten sitä voidaan vahvistaa kotona ja koulussa?',
          options: [
            'Käsitystä omasta arvosta ja taidoista – sitä vahvistetaan kannustamalla ja hyväksymällä jokainen omana itsenään',
            'Pelkästään kymppien saamista kokeista',
            'Toisten yläpuolelle asettumista ja kehuskellakseen',
            'Sitä, ettei tarvitse koskaan pyytää anteeksi'
          ],
          answer: 'Käsitystä omasta arvosta ja taidoista – sitä vahvistetaan kannustamalla ja hyväksymällä jokainen omana itsenään',
          hint: 'Terve itsetunto auttaa uskaltamaan kokeilla uutta, kestämään pettymyksiä ja iloitsemaan muidenkin onnistumisista.'
        }
      ],

      yht_koulu: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          question: 'Miksi koulussa ja liikenteessä on olemassa sääntöjä?',
          options: [
            'Jotta kaikilla olisi turvallista, rauhallista ja mukavaa olla',
            'Vain opettajien iloksi',
            'Jotta lapsilla olisi mahdollisimman hankalaa',
            'Säännöt ovat olemassa vain sattumalta'
          ],
          answer: 'Jotta kaikilla olisi turvallista, rauhallista ja mukavaa olla',
          hint: 'Säännöt luovat yhteisen pelikentän ja suojelevat kaikkien turvallisuutta ja työrauhaa.'
        },
        {
          level: 1,
          type: 'choice',
          visual: { type: 'sign', sign: 'suojatie' },
          question: 'Mitä kuvan sininen neliömäinen liikennemerkki tarkoittaa?',
          options: ['Suojatie – jalankulkijat ylittävät tien', 'Moottoritie', 'Pysäköintikielto', 'Polkupyörätie'],
          answer: 'Suojatie – jalankulkijat ylittävät tien',
          hint: 'Suojatiemerkki osoittaa turvallisen tienylityspaikan. Muista silti aina katsoa molempiin suuntiin ennen astumista tielle!'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä teet, jos huomaat koulussa että jotakuta oppilasta kiusataan?',
          options: [
            'Kerron heti luotettavalle aikuiselle (opettajalle, kuraattorille tai vanhemmalle)',
            'Menen mukaan nauramaan kiusaajien kanssa',
            'Kuvaan tilannetta puhelimella ja jaan videon eteenpäin',
            'En tee mitään, koska se ei kuulu minulle'
          ],
          answer: 'Kerron heti luotettavalle aikuiselle (opettajalle, kuraattorille tai vanhemmalle)',
          hint: 'Aikuiselle kertominen ei ole "kantelua" vaan välittämistä ja toisen auttamista pulasta!'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mikä on Suomen hätänumero, johon soitetaan vain oikeissa hätätilanteissa (onnettomuus, tulipalo, sairaskohtaus)?',
          options: ['112', '911', '007', '100'],
          answer: '112',
          hint: '112 on Suomen ja Euroopan maksuton hätänumero hengenvaarallisiin ja kiireellisiin tilanteisiin.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          question: 'Mitä Suomessa tarkoittaa OPPIVELVOLLISUUS?',
          options: [
            'Jokaisella lapsella on oikeus ja velvollisuus suorittaa peruskoulu ja oppia perustiedot',
            'Koulussa on pakko käydä vain jos huvittaa',
            'Oppilaan täytyy opettaa opettajaa',
            'Oppivelvollisuus koskee vain aikuisia yliopistoissa'
          ],
          answer: 'Jokaisella lapsella on oikeus ja velvollisuus suorittaa peruskoulu ja oppia perustiedot',
          hint: 'Oppivelvollisuus takaa jokaiselle Suomessa asuvalle lapselle maksuttoman ja tasokkaan koulutuksen.'
        },
        {
          level: 2,
          type: 'choice',
          visual: { type: 'sign', sign: 'pyora' },
          question: 'Mitä tärkeää varustetta laki edellyttää pyöräilijältä oman pään suojaksi?',
          options: ['Pyöräilykypärää', 'Lippalakkia', 'Aurinkolaseja', 'Kuulosuojaimia'],
          answer: 'Pyöräilykypärää',
          hint: 'Kypärä suojaa päätä ja aivoja vakavilta vammoilta, jos pyörällä kaatuu tai kolaroi.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Miksi pimeällä syyssäällä ulkona liikkuessa pitää käyttää HEIJASTINTA?',
          options: [
            'Autoilija havaitsee heijastinta käyttävän jalankulkijan jopa 3–4 kertaa kauempaa',
            'Heijastin lämmittää jalkoja ja takkia',
            'Heijastin nopeuttaa kävelyä',
            'Se karkottaa hyttysiä'
          ],
          answer: 'Autoilija havaitsee heijastinta käyttävän jalankulkijan jopa 3–4 kertaa kauempaa',
          hint: 'Ilman heijastinta jalankulkija näkyy lähivaloilla vasta 50 metrin päästä, heijastimen kanssa jopa 350 metrin päästä!'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä on koulun oppilaskunnan hallituksen tehtävä?',
          options: [
            'Edustaa koulun kaikkia oppilaita ja suunnitella tapahtumia ja parannuksia kouluun',
            'Määrätä opettajille läksyjä',
            'Valmistaa kouluruoka keittiössä',
            'Päättää kunnan verotuksesta'
          ],
          answer: 'Edustaa koulun kaikkia oppilaita ja suunnitella tapahtumia ja parannuksia kouluun',
          hint: 'Oppilaskunnan kautta oppilaat pääsevät aidosti vaikuttamaan koulun arkeen ja viihtyvyyteen.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Minkä ikäisenä Suomessa alkaa RIKOSOIKEUDELLINEN vastuu ja miten vahingonkorvausvelvollisuus toimii?',
          options: [
            'Rikosoikeudellinen vastuu alkaa 15-vuotiaana, mutta tahallisen vahingon joutuu korvaamaan minkä ikäisenä tahansa',
            'Kaikki vastuut alkavat vasta 30-vuotiaana',
            'Lapsi ei joudu koskaan korvaamaan mitään rikkomaansa',
            'Rikosoikeudellinen vastuu alkaa jo 7-vuotiaana'
          ],
          answer: 'Rikosoikeudellinen vastuu alkaa 15-vuotiaana, mutta tahallisen vahingon joutuu korvaamaan minkä ikäisenä tahansa',
          hint: 'Jos lapsi rikkoo tahallaan toisen ikkunan tai puhelimen, perhe ja lapsi ovat korvausvastuussa iästä riippumatta.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä eroa on koulun järjestyssäännöillä ja Suomen eduskunnan säätämillä laeilla?',
          options: [
            'Koulun säännöt koskevat koulua ja sen aluetta, kun taas lait koskevat koko maata ja kaikkia ihmisiä',
            'Koulun säännöt ovat kovempia kuin Suomen lait',
            'Laeista ei tarvitse välittää, vain koulun säännöistä',
            'Mitään eroa ei ole'
          ],
          answer: 'Koulun säännöt koskevat koulua ja sen aluetta, kun taas lait koskevat koko maata ja kaikkia ihmisiä',
          hint: 'Eduskunta säätää valtakunnalliset lait. Koulut puolestaan laativat järjestyssäännöt lakien pohjalta omaan taloonsa.'
        }
      ],

      yht_media: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          visual: { type: 'agerating', age: '12' },
          question: 'Mitä pelissä tai elokuvassa oleva oranssi K-12 -merkintä tarkoittaa?',
          options: [
            'Sisältö on tarkoitettu 12 vuotta täyttäneille, koska se voi sisältää ahdistavia tai väkivaltaisia kohtauksia',
            'Peli maksaa tasan 12 euroa',
            'Pelissä on 12 kenttää',
            'Peliä saa pelata vain 12 minuuttia kerrallaan'
          ],
          answer: 'Sisältö on tarkoitettu 12 vuotta täyttäneille, koska se voi sisältää ahdistavia tai väkivaltaisia kohtauksia',
          hint: 'Ikärajat perustuvat lakiin ja niiden tarkoitus on suojella lapsen kehitystä haitalliselta sisällöltä.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä seuraavista tiedoista EI SAA KOSKAAN jakaa julkisesti netissä tai tuntemattomille pelikavereille?',
          options: [
            'Kotiosoitetta, omaa koko nimeä, puhelinnumeroa ja salasanoja',
            'Lempiherkkua tai lempiväriä',
            'Pelihahmon nimeä',
            'Tietoa siitä, että tykkää jalkapallosta'
          ],
          answer: 'Kotiosoitetta, omaa koko nimeä, puhelinnumeroa ja salasanoja',
          hint: 'Henkilötiedot ja salasanat kuuluvat vain sinulle ja omille vanhemmillesi – älä luovuta niitä nettiin!'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Saako kaverista ottaa valokuvan ja julkaista sen sosiaalisessa mediassa tai TikTokissa ilman hänen lupaansa?',
          options: [
            'Ei saa, toisen kuvaamiseen ja julkaisemiseen tarvitaan aina hänen suostumuksensa',
            'Kyllä saa, jos kuva on hauska',
            'Kyllä saa, jos kaveri ei huomannut kuvaamista',
            'Saa vain jos saa vähintään 100 tykkäystä'
          ],
          answer: 'Ei saa, toisen kuvaamiseen ja julkaisemiseen tarvitaan aina hänen suostumuksensa',
          hint: 'Jokaisella on oikeus yksityisyyteen. Toisen kuvan julkaisu ilman lupaa on epäkohteliasta ja jopa lainvastaista.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mitä netiketti tarkoittaa?',
          options: [
            'Kohteliaita, toisia kunnioittavia ja turvallisia käytöstapoja internetissä ja peleissä',
            'Tietokoneen virtajohdon kiinnittämistä',
            'Nopeaa nettiyhteyttä',
            'Virustorjuntaohjelmaa'
          ],
          answer: 'Kohteliaita, toisia kunnioittavia ja turvallisia käytöstapoja internetissä ja peleissä',
          hint: 'Netiketti on netin käytöstapa: kohtele toisia ruudun takana yhtä ystävällisesti kuin kasvotusten.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          question: 'Mitä LÄHDEKRITIIKKI tarkoittaa, kun luet uutista tai katsot videota netissä?',
          options: [
            'Tiedon luotettavuuden pohtimista: kuka tekstin teki, miksi ja pitääkö se todella paikkansa',
            'Kaikkien uutisten haukkumista valheiksi',
            'Vain videoiden tykkäysten ja katselukertojen laskemista',
            'Tietokoneen ruudun kirkkauden säätämistä'
          ],
          answer: 'Tiedon luotettavuuden pohtimista: kuka tekstin teki, miksi ja pitääkö se todella paikkansa',
          hint: 'Kuka tahansa voi julkaista netissä mitä tahansa. Mieti aina: onko tekijä asiantuntija vai yrittääkö hän huijata?'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Näet nettisivulla ponnahdusikkunan: "Onneksi olkoon! Olet 1 000 000. kävijä ja voitit uuden iPhonen! Klikkaa tästä heti!" Mitä teet?',
          options: [
            'Suljen ikkunan heti – kyseessä on selvä huijaus ja tietojenkalastelu',
            'Klikkaan innoissani ja annan kotiosoitteeni ja vanhemman korttitiedot',
            'Lainaan kaverille puhelinta että hänkin voi voittaa',
            'Jään odottamaan että puhelin tuodaan postiluukusta'
          ],
          answer: 'Suljen ikkunan heti – kyseessä on selvä huijaus ja tietojenkalastelu',
          hint: 'Kukaan ei jaa ilmaisia kalliita puhelimia netissä. Jos jokin kuulostaa liian hyvältä ollakseen totta, se on huijaus.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä on mainonnan perimmäinen tarkoitus mediassa ja ilmaispeleissä?',
          options: [
            'Saada kuluttaja kiinnostumaan tuotteesta ja ostamaan se, jotta yritys tekee voittoa',
            'Kertoa vain puolueetonta ja tieteellistä tietoa ihmiskunnalle',
            'Kuluttaa kännykän akkua loppuun',
            'Viihdyttää ihmisiä ilmaiseksi ilman mitään hyötyä yritykselle'
          ],
          answer: 'Saada kuluttaja kiinnostumaan tuotteesta ja ostamaan se, jotta yritys tekee voittoa',
          hint: 'Mainos luo mielikuvia ja houkuttelee ostamaan. Tunnista aina milloin kyseessä on maksettu mainos!'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tarkoittaa TEKIJÄNOIKEUS koululaiselle?',
          options: [
            'Toisen ottamaa kuvaa, piirrosta, musiikkia tai tekstiä ei saa kopioida ja esittää omana työnään',
            'Oikeutta rikkoa toisen tietokone ilman lupaa',
            'Oikeutta tehdä läksyt milloin huvittaa',
            'Kaikki netistä löytyvä materiaali on ilmaiseksi ja vapaasti omaa omaisuutta'
          ],
          answer: 'Toisen ottamaa kuvaa, piirrosta, musiikkia tai tekstiä ei saa kopioida ja esittää omana työnään',
          hint: 'Tekijänoikeus suojaa tekijän luovaa työtä. Jos käytät toisen kuvaa esitelmässä, mainitse aina kuvaajan nimi ja lähde!'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Miksi sosiaalisen median sovellukset ja ilmaiset pelit pyrkivät pitämään käyttäjän ruudun ääressä mahdollisimman pitkään?',
          options: [
            'Mitä enemmän aikaa vietät sovelluksessa, sitä enemmän mainoksia he voivat näyttää ja tienata rahaa',
            'Koska he haluavat auttaa sinua tekemään läksyt rauhassa',
            'Sovellukset haluavat parantaa koululaisten yöunta',
            'Pelit haluavat vain säästää perheiden sähkölaskua'
          ],
          answer: 'Mitä enemmän aikaa vietät sovelluksessa, sitä enemmän mainoksia he voivat näyttää ja tienata rahaa',
          hint: 'Sovellusten algoritmit on suunniteltu koukuttamaan. Siksi on tärkeää pitää ruututaukoja ja nauttia tosielämästä!'
        }
      ],

      yht_raha: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          question: 'Mitä eroa on TULOILLA ja MENOILLA perheen tai ihmisen taloudessa?',
          options: [
            'Tulot ovat rahaa jota saadaan (esim. palkka), ja menot ovat rahaa jota kulutetaan (esim. ruoka ja vuokra)',
            'Tulot ja menot tarkoittavat täsmälleen samaa asiaa',
            'Menot ovat palkkarahoja ja tulot laskuja',
            'Tulot tulevat vain joulupukilta'
          ],
          answer: 'Tulot ovat rahaa jota saadaan (esim. palkka), ja menot ovat rahaa jota kulutetaan (esim. ruoka ja vuokra)',
          hint: 'Rahaa tulee palkkana tai tukina sisään (tulot) ja laskuina sekä ostoksina ulos (menot).'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mikä seuraavista on ihmiselle VÄLTTÄMÄTÖN TARVE eikä vain toive tai heräteostos?',
          options: ['Terveellinen ruoka, koti ja säänmukaiset vaatteet', 'Uusin pelikonsoli', 'Karkkipussi joka iltapäivä', 'Merkkikengät leikkikentälle'],
          answer: 'Terveellinen ruoka, koti ja säänmukaiset vaatteet',
          hint: 'Tarpeet ovat asioita, joita ilman emme tule toimeen. Toiveet ja halut tuovat iloa, mutta pärjäämme ilman niitäkin.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Miksi rahaa kannattaa säästää säästöpossuun tai pankkitilille?',
          options: [
            'Jotta rahaa on tulevaisuudessa isompaan toiveeseen tai yllättäviin kuluihin',
            'Koska rahaa ei saisi koskaan käyttää mihinkään',
            'Pankki heittää säästetyt rahat roskiin',
            'Säästetyt rahat vanhenevat viikossa'
          ],
          answer: 'Jotta rahaa on tulevaisuudessa isompaan toiveeseen tai yllättäviin kuluihin',
          hint: 'Säästäminen opettaa kärsivällisyyttä ja antaa turvaa, jos polkupyörä hajoaa tai haluaa ostaa jotain arvokkaampaa.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mistä raha tulee pankkikortille tai MobilePay-sovellukseen kaupassa maksettaessa?',
          options: [
            'Omalta pankkitililtä, jonne on aiemmin talletettu tai ansaittu rahaa työllä',
            'Kortti synnyttää uutta rahaa taikaiskusta loputtomasti',
            'Kauppa antaa kortille ilmaista rahaa',
            'Puhelimen akku toimii rahana'
          ],
          answer: 'Omalta pankkitililtä, jonne on aiemmin talletettu tai ansaittu rahaa työllä',
          hint: 'Pankkikortti ja puhelin ovat vain avaimia pankkitilillesi – sieltä kuluu aina oikeaa oikeasti ansaittua rahaa!'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          question: 'Mitä tarkoittaa BUDJETTI perheen tai koululaisen taloudessa?',
          options: [
            'Suunnitelmaa siitä, paljonko rahaa tulee ja mihin sitä aiotaan käyttää',
            'Lompakkoa jossa ei ole koskaan rahaa',
            'Pelkästään kauppakuittia ostosten jälkeen',
            'Pankin johtajan nimeä'
          ],
          answer: 'Suunnitelmaa siitä, paljonko rahaa tulee ja mihin sitä aiotaan käyttää',
          hint: 'Budjetti varmistaa, että menot eivät ylitä tuloja ja rahaa riittää kaikkeen tarpeelliseen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mistä aikuisten saama PALKKA muodostuu ja miksi sitä maksetaan?',
          options: [
            'Korvauksena tehdystä työstä ja ammattitaidosta työnantajalta',
            'Pankki jakaa palkkaa satunnaisesti arpomalla',
            'Valtio maksaa kaikille palkkaa riippumatta siitä tekeekö työtä',
            'Palkkaa saa vain koulun päättötodistuksesta'
          ],
          answer: 'Korvauksena tehdystä työstä ja ammattitaidosta työnantajalta',
          hint: 'Työntekijä tekee sovitun työn (esim. opettaa, ajaa bussia, rakentaa) ja saa siitä sovitun rahakorvauksen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä on KILOHINTA kaupan hintalapussa ja miksi sitä kannattaa katsoa?',
          options: [
            'Se kertoo tuotteen hinnan yhtä kiloa kohden ja auttaa vertailemaan erikokoisten pakkausten edullisuutta',
            'Se kertoo kauppiaan painon kiloina',
            'Se kertoo kuinka painava ostoskärry on',
            'Sitä tarvitaan vain hedelmävaalla'
          ],
          answer: 'Se kertoo tuotteen hinnan yhtä kiloa kohden ja auttaa vertailemaan erikokoisten pakkausten edullisuutta',
          hint: 'Iso pakkaus ei ole aina halvempi. Kilohinnan vertailu on fiksun ostajan paras työkalu!'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Miksi Suomessa maksetaan VERORAHAT ja mitä niillä yhteiskunnassa kustannetaan?',
          options: [
            'Verorahoilla maksetaan koulutus, kirjastot, sairaalat, tiet, poliisi ja pelastustoimi',
            'Verorahoilla ostetaan vain karkkia eduskuntaan',
            'Verot ovat sakko siitä että käy töissä',
            'Verorahat viedään toiselle planeetalle'
          ],
          answer: 'Verorahoilla maksetaan koulutus, kirjastot, sairaalat, tiet, poliisi ja pelastustoimi',
          hint: 'Verot ovat yhteinen kassa, jolla pidetään huolta suomalaisesta hyvinvointiyhteiskunnasta ja turvaverkosta.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mitä tarkoittaa LAINA ja miksi pankille pitää maksaa takaisin korkoa?',
          options: [
            'Laina on toiselta saatua rahaa, joka täytyy maksaa takaisin; korko on maksu rahan lainaamisesta',
            'Laina on ilmaista lahjarahaa jota ei tarvitse maksaa koskaan',
            'Korko on kaupan kassan antama alennuskuponki',
            'Lainaa voi ottaa vain lelukaupasta'
          ],
          answer: 'Laina on toiselta saatua rahaa, joka täytyy maksaa takaisin; korko on maksu rahan lainaamisesta',
          hint: 'Kun perhe ostaa asunnon tai auton lainarahalla, he maksavat pankille lainatun summan lisäksi korkokulut.'
        }
      ],

      yht_oikeudet: [
        // Taso 1
        {
          level: 1,
          type: 'choice',
          question: 'Mikä on YK:n LAPSEN OIKEUKSIEN sopimuksen tärkein sanoma?',
          options: [
            'Jokaisella lapsella maailmassa on oikeus turvalliseen elämään, leikkiin, oppimiseen ja huolenpitoon',
            'Lapset saavat päättää mihin aikaan he menevät nukkumaan',
            'Lapsilla ei tarvitse olla mitään velvollisuuksia',
            'Kaikkien lasten täytyy osata lentää'
          ],
          answer: 'Jokaisella lapsella maailmassa on oikeus turvalliseen elämään, leikkiin, oppimiseen ja huolenpitoon',
          hint: 'Lapsen oikeudet takaavat turvan, terveydenhoidon, koulutuksen ja oikeuden tulla kuulluksi kaikille lapsille.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Oikeudet ja velvollisuudet kulkevat käsi kädessä. Jos sinulla on oikeus opiskelurauhaan koulussa, mikä on velvollisuutesi?',
          options: [
            'Velvollisuuteni on antaa työrauha myös luokkatovereilleni ja opettajalle',
            'Velvollisuuteni on pitää mahdollisimman kovaa ääntä',
            'Minulla ei ole mitään velvollisuuksia koulussa',
            'Velvollisuuteni on lähteä kotiin kesken oppitunnin'
          ],
          answer: 'Velvollisuuteni on antaa työrauha myös luokkatovereilleni ja opettajalle',
          hint: 'Oikeus hyvään kouluun tarkoittaa, että jokainen kantaa kortensa kekoon ja antaa toisillekin rauhan oppia.'
        },
        {
          level: 1,
          type: 'choice',
          question: 'Mikä juhlapäivä Suomessa on joulukuun 6. päivänä?',
          options: ['Suomen itsenäisyyspäivä', 'Jouluaatto', 'Vappu', 'Juhannus'],
          answer: 'Suomen itsenäisyyspäivä',
          hint: 'Suomi julistautui itsenäiseksi valtioksi 6. joulukuuta 1917.'
        },

        // Taso 2
        {
          level: 2,
          type: 'choice',
          question: 'Mitä DEMOKRATIA tarkoittaa päätöksenteossa?',
          options: [
            'Kansanvaltaa: kaikki saavat ilmaista mielipiteensä ja äänestyksessä enemmistön tahto voittaa',
            'Sitä, että yksi ainoa ihminen päättää kaikesta yksinvaltiaana',
            'Päätöksiä heittämällä noppaa',
            'Vain rikkaimmat saavat päättää laeista'
          ],
          answer: 'Kansanvaltaa: kaikki saavat ilmaista mielipiteensä ja äänestyksessä enemmistön tahto voittaa',
          hint: 'Demokratiassa kansalaiset äänestävät päättäjät ja asioista sovitaan yhdessä reilusti keskustellen.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Kuka tai mikä päättää oman kotikuntasi (kaupunkisi) asioista, kuten koulujen ja puistojen rakentamisesta?',
          options: [
            'Kunnanvaltuusto, jonka kuntalaiset valitsevat kuntavaaleissa',
            'Suomen jääkiekkomaajoukkue',
            'Lähikaupan kauppias yksin',
            'Toisen maan presidentti'
          ],
          answer: 'Kunnanvaltuusto, jonka kuntalaiset valitsevat kuntavaaleissa',
          hint: 'Kunnanvaltuusto päättää kunnan rahoista, palveluista, kouluista ja liikuntapaikoista.'
        },
        {
          level: 2,
          type: 'choice',
          question: 'Mikä on Suomen eduskunnan tärkein tehtävä Helsingin Eduskuntatalossa?',
          options: [
            'Säätää uusia lakeja ja päättää valtion budjetista 200 kansanedustajan voimin',
            'Pelata videopelejä',
            'Valmistaa Suomen kaikkien koulujen ruoat',
            'Toimia pelkästään museona'
          ],
          answer: 'Säätää uusia lakeja ja päättää valtion budjetista 200 kansanedustajan voimin',
          hint: 'Suomen kansa valitsee 200 kansanedustajaa 4 vuoden välein eduskuntavaaleissa säätämään lakejamme.'
        },

        // Taso 3
        {
          level: 3,
          type: 'choice',
          question: 'Miten lapsi tai nuori voi Suomessa vaikuttaa oman kotikuntansa asioihin ennen äänioikeusikää (18 v)?',
          options: [
            'Koulun oppilaskunnan, kunnan nuorisovaltuuston ja asukaspalautteen kautta',
            'Ei mitenkään, lasten mielipiteillä ei ole väliä',
            'Vain rikkomalla koulun sääntöjä',
            'Lapset eivät saa puhua aikuisille'
          ],
          answer: 'Koulun oppilaskunnan, kunnan nuorisovaltuuston ja asukaspalautteen kautta',
          hint: 'Kunnat kuuntelevat nuorisovaltuustoa ja oppilaita esimerkiksi leikkipuistojen, koulureittien ja skeittiparkkien suunnittelussa.'
        },
        {
          level: 3,
          type: 'choice',
          question: 'Mikä on Suomen PERUSTUSLAKI?',
          options: [
            'Valtion tärkein laki, joka määrää miten Suomea johdetaan ja takaa jokaiselle perusoikeudet (kuten sananvapauden)',
            'Laki siitä miten talon perustus valetaan betonista',
            'Koulun rehtorin tekemä lukujärjestys',
            'Poliisin käyttämä käsikirja'
          ],
          answer: 'Valtion tärkein laki, joka määrää miten Suomea johdetaan ja takaa jokaiselle perusoikeudet (kuten sananvapauden)',
          hint: 'Perustuslaki on kaikkien lakien yläpuolella ja se turvaa ihmisoikeudet, tasa-arvon ja sananvapauden Suomessa.'
        }
      ]
    };
  }

  // ==========================================
  // TEHTÄVÄGENERAATTORIT
  // ==========================================

  /**
   * Palauttaa tehtävän annetusta oppiaineesta ja aiheesta annetulla vaikeustasolla.
   */
  generateQuestion(subject, topicId, level = 1) {
    let pool = [];

    if (subject === 'ymparisto') {
      if (topicId === 'ymppi_sekoitus' || !topicId) {
        const allTopics = Object.keys(this.ymppiQuestions);
        const randomTopic = this.pick(allTopics);
        return this.generateQuestion('ymparisto', randomTopic, level);
      }
      pool = this.ymppiQuestions[topicId] || [];
    } else if (subject === 'yhteiskunta') {
      if (topicId === 'yht_sekoitus' || !topicId) {
        const allTopics = Object.keys(this.yhteiskuntaQuestions);
        const randomTopic = this.pick(allTopics);
        return this.generateQuestion('yhteiskunta', randomTopic, level);
      }
      pool = this.yhteiskuntaQuestions[topicId] || [];
    }

    // Suodatetaan tason mukaan: ensisijaisesti pyydetty taso, toissijaisesti lähin taso
    let matching = pool.filter(q => q.level === level);
    if (matching.length === 0) {
      matching = pool.filter(q => Math.abs(q.level - level) <= 1);
    }
    if (matching.length === 0) {
      matching = pool;
    }

    if (matching.length === 0) {
      // Fallback
      return {
        subject: subject,
        topic: topicId,
        category: subject === 'ymparisto' ? '🌿 Ympäristöoppi' : '🏛️ Yhteiskuntaoppi',
        type: 'choice',
        question: 'Tunnistatko oikean toimintatavan luonnossa ja yhteisössä?',
        options: this.shuffle(['Kunnioitan muita ja luontoa', 'Roskaan ympäristöä', 'Kiusaan kavereita', 'Rikon sääntöjä']),
        answer: 'Kunnioitan muita ja luontoa',
        hint: 'Kunnioitus luontoa ja muita ihmisiä kohtaan on kaiken perusta.'
      };
    }

    const template = this.pick(matching);
    const categoryName = this.getTopicTitle(subject, topicId);

    // Palautetaan kloonattu ja satunnaistettu kysymysolio
    return {
      subject: subject,
      topic: topicId,
      category: `${subject === 'ymparisto' ? '🌿 Ymppi' : '🏛️ Yhteiskunta'} • ${categoryName}`,
      type: template.type || 'choice',
      visual: template.visual ? { ...template.visual } : null,
      question: template.question,
      options: template.options ? this.shuffle(template.options) : [],
      answer: template.answer,
      hint: template.hint || ''
    };
  }

  getTopicTitle(subject, topicId) {
    const titles = {
      // Ymppi
      ymppi_metsa: 'Suomen luonto & metsä',
      ymppi_vedet: 'Vedet & Itämeri',
      ymppi_keho: 'Ihmiskeho & aistit',
      ymppi_kartat: 'Kartat & ilmansuunnat',
      ymppi_kierratys: 'Kierrätys & kestävä kehitys',
      ymppi_sekoitus: 'Ymppi-sekoitus',
      // Yhteiskunta
      yht_perhe: 'Perhe & yhteisöt',
      yht_koulu: 'Koulu, säännöt & turva',
      yht_media: 'Media & digiturva',
      yht_raha: 'Raha, työ & kulutus',
      yht_oikeudet: 'Oikeudet & päätöksenteko',
      yht_sekoitus: 'Yhteiskuntaoppi-sekoitus'
    };
    return titles[topicId] || topicId;
  }

  // Generoi tehtävä koeaiheiden perusteella
  generateByTopicList(subject, topicList, levels = {}) {
    if (!topicList || !Array.isArray(topicList) || topicList.length === 0) {
      return this.generateQuestion(subject, subject === 'ymparisto' ? 'ymppi_sekoitus' : 'yht_sekoitus', 1);
    }

    const text = topicList.join(' ').toLowerCase();
    let candidateTopics = [];

    if (subject === 'ymparisto') {
      if (text.includes('metsä') || text.includes('metsa') || text.includes('luonto') || text.includes('puu') || text.includes('eläin')) candidateTopics.push('ymppi_metsa');
      if (text.includes('vesi') || text.includes('meri') || text.includes('itämeri') || text.includes('itameri') || text.includes('kala')) candidateTopics.push('ymppi_vedet');
      if (text.includes('keho') || text.includes('aisti') || text.includes('elin') || text.includes('uni') || text.includes('terveys')) candidateTopics.push('ymppi_keho');
      if (text.includes('kartta') || text.includes('ilmansuunta') || text.includes('suomi') || text.includes('kompassi')) candidateTopics.push('ymppi_kartat');
      if (text.includes('kierrätys') || text.includes('kierratys') || text.includes('jäte') || text.includes('energia')) candidateTopics.push('ymppi_kierratys');
    } else if (subject === 'yhteiskunta') {
      if (text.includes('perhe') || text.includes('kaveri') || text.includes('ystäv') || text.includes('yhteisö')) candidateTopics.push('yht_perhe');
      if (text.includes('koulu') || text.includes('sääntö') || text.includes('saanto') || text.includes('kiusaa') || text.includes('liikenne')) candidateTopics.push('yht_koulu');
      if (text.includes('media') || text.includes('digi') || text.includes('netti') || text.includes('ikäraja') || text.includes('ikaraja')) candidateTopics.push('yht_media');
      if (text.includes('raha') || text.includes('työ') || text.includes('tyo') || text.includes('kulutus') || text.includes('säästö') || text.includes('budjetti')) candidateTopics.push('yht_raha');
      if (text.includes('oikeus') || text.includes('lapsi') || text.includes('demokratia') || text.includes('kunta') || text.includes('laki') || text.includes('eduskunta')) candidateTopics.push('yht_oikeudet');
    }

    if (candidateTopics.length === 0) {
      candidateTopics = subject === 'ymparisto' 
        ? ['ymppi_metsa', 'ymppi_vedet', 'ymppi_keho', 'ymppi_kartat', 'ymppi_kierratys']
        : ['yht_perhe', 'yht_koulu', 'yht_media', 'yht_raha', 'yht_oikeudet'];
    }

    const chosenTopic = this.pick(candidateTopics);
    const lvl = levels[chosenTopic] || 1;
    return this.generateQuestion(subject, chosenTopic, lvl);
  }

  // ==========================================
  // SVG-VEKTORIGRAFIIKAN RENDERÖIJÄ
  // ==========================================
  renderVisualSVG(visual) {
    if (!visual || !visual.type) return '';

    // 1. Kompassi
    if (visual.type === 'compass') {
      return this.renderCompassSVG(visual.needle || 'pohjoinen');
    }

    // 2. Puun lehti / neulaset
    if (visual.type === 'leaf') {
      return this.renderLeafSVG(visual.tree || 'koivu');
    }

    // 3. Ravintoketju
    if (visual.type === 'foodchain') {
      return this.renderFoodChainSVG(visual.items || []);
    }

    // 4. Kierrätysastia
    if (visual.type === 'bin') {
      return this.renderBinSVG(visual.bin || 'bio');
    }

    // 5. Liikenne- tai turvallisuusmerkki
    if (visual.type === 'sign') {
      return this.renderSignSVG(visual.sign || 'suojatie');
    }

    // 6. Ikäraja (K-7, K-12, K-16, K-18)
    if (visual.type === 'agerating') {
      return this.renderAgeRatingSVG(visual.age || '12');
    }

    // 7. Ihmiselimistö (Sydän, keuhkot jne.)
    if (visual.type === 'organ') {
      return this.renderOrganSVG(visual.name || 'sydan');
    }

    return '';
  }

  renderCompassSVG(needleDirection) {
    const angleMap = {
      pohjoinen: 0,
      koillinen: 45,
      ita: 90,
      kaakko: 135,
      etela: 180,
      lounas: 225,
      lansi: 270,
      luode: 315
    };
    const angle = angleMap[needleDirection.toLowerCase()] || 0;

    return `
      <svg width="150" height="150" viewBox="0 0 150 150">
        <!-- Kompassikehä -->
        <circle cx="75" cy="75" r="70" fill="#F8FAFC" stroke="#0F172A" stroke-width="4" />
        <circle cx="75" cy="75" r="63" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
        
        <!-- Pääakselit -->
        <line x1="75" y1="18" x2="75" y2="132" stroke="#E2E8F0" stroke-width="2" />
        <line x1="18" y1="75" x2="132" y2="75" stroke="#E2E8F0" stroke-width="2" />

        <!-- Kirjaimet P, I, E, L -->
        <text x="75" y="32" font-size="16" font-weight="900" fill="#DC2626" text-anchor="middle">P</text>
        <text x="126" y="80" font-size="16" font-weight="800" fill="#334155" text-anchor="middle">I</text>
        <text x="75" y="128" font-size="16" font-weight="800" fill="#334155" text-anchor="middle">E</text>
        <text x="24" y="80" font-size="16" font-weight="800" fill="#334155" text-anchor="middle">L</text>

        <!-- Neula kääntyneenä kulman mukaan -->
        <g transform="rotate(${angle} 75 75)">
          <!-- Punainen pohjoispuoli -->
          <polygon points="75,28 82,75 68,75" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5" />
          <!-- Tummansininen eteläpuoli -->
          <polygon points="75,122 82,75 68,75" fill="#334155" stroke="#0F172A" stroke-width="1.5" />
          <circle cx="75" cy="75" r="6" fill="#F59E0B" stroke="#B45309" stroke-width="2" />
        </g>
      </svg>
    `;
  }

  renderLeafSVG(tree) {
    if (tree === 'koivu') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Koivun lehti -->
          <path d="M 65 15 C 95 35 105 75 80 105 L 65 125 L 50 105 C 25 75 35 35 65 15 Z" fill="#10B981" stroke="#047857" stroke-width="3" />
          <!-- Lehtiruoti ja suonet -->
          <line x1="65" y1="18" x2="65" y2="125" stroke="#065F46" stroke-width="2.5" />
          <line x1="65" y1="45" x2="85" y2="35" stroke="#065F46" stroke-width="1.5" />
          <line x1="65" y1="45" x2="45" y2="35" stroke="#065F46" stroke-width="1.5" />
          <line x1="65" y1="70" x2="88" y2="60" stroke="#065F46" stroke-width="1.5" />
          <line x1="65" y1="70" x2="42" y2="60" stroke="#065F46" stroke-width="1.5" />
          <line x1="65" y1="92" x2="78" y2="85" stroke="#065F46" stroke-width="1.5" />
          <line x1="65" y1="92" x2="52" y2="85" stroke="#065F46" stroke-width="1.5" />
        </svg>
      `;
    }

    if (tree === 'tammi') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Tammen liuskainen lehti -->
          <path d="M 65 10 C 78 20 88 18 80 32 C 96 36 98 52 82 60 C 96 68 94 88 78 94 C 74 106 68 118 65 125 C 62 118 56 106 52 94 C 36 88 34 68 48 60 C 32 52 34 36 50 32 C 42 18 52 20 65 10 Z" fill="#059669" stroke="#065F46" stroke-width="3" />
          <line x1="65" y1="15" x2="65" y2="125" stroke="#047857" stroke-width="3" />
        </svg>
      `;
    }

    if (tree === 'manty') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Männyn neulaspari tuppineen -->
          <path d="M 65 125 Q 75 60 105 15" fill="none" stroke="#047857" stroke-width="5" stroke-linecap="round" />
          <path d="M 65 125 Q 55 60 25 15" fill="none" stroke="#059669" stroke-width="5" stroke-linecap="round" />
          <!-- Tuppi tyvessä -->
          <rect x="58" y="115" width="14" height="12" rx="3" fill="#78350F" />
        </svg>
      `;
    }

    return '';
  }

  renderFoodChainSVG(items) {
    if (!items || items.length < 2) return '';
    return `
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 10px; background: #F0FDF4; border-radius: 12px; border: 1px solid #BBF7D0;">
        ${items.map((item, idx) => `
          <div style="background: #ffffff; padding: 8px 14px; border-radius: 8px; font-weight: 800; color: #166534; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-size: 15px;">
            ${item}
          </div>
          ${idx < items.length - 1 ? '<span style="font-size: 20px; font-weight: 900; color: #10B981;">➔</span>' : ''}
        `).join('')}
      </div>
    `;
  }

  renderBinSVG(binType) {
    const bins = {
      bio: { color: '#78350F', label: 'BIOJÄTE', icon: '🍌' },
      kartonki: { color: '#D97706', label: 'KARTONKI', icon: '📦' },
      paperi: { color: '#2563EB', label: 'PAPERI', icon: '📰' },
      lasi: { color: '#059669', label: 'LASIPAKKAUS', icon: '🫙' },
      metalli: { color: '#475569', label: 'METALLI', icon: '🥫' }
    };
    const b = bins[binType] || bins.bio;

    return `
      <svg width="130" height="130" viewBox="0 0 130 130">
        <!-- Roska-astia pyörillä -->
        <rect x="30" y="40" width="70" height="75" rx="6" fill="${b.color}" stroke="#1E293B" stroke-width="3" />
        <!-- Kansi -->
        <rect x="24" y="28" width="82" height="14" rx="4" fill="${b.color}" stroke="#1E293B" stroke-width="3" />
        <rect x="52" y="20" width="26" height="8" rx="3" fill="#1E293B" />
        <!-- Pyörät -->
        <circle cx="34" cy="118" r="9" fill="#0F172A" />
        <circle cx="96" cy="118" r="9" fill="#0F172A" />
        <!-- Symboli & teksti -->
        <text x="65" y="72" font-size="24" text-anchor="middle">${b.icon}</text>
        <text x="65" y="96" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle">${b.label}</text>
      </svg>
    `;
  }

  renderSignSVG(signType) {
    if (signType === 'suojatie') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Sininen neliö -->
          <rect x="10" y="10" width="110" height="110" rx="12" fill="#2563EB" stroke="#1D4ED8" stroke-width="3" />
          <!-- Valkoinen kolmio -->
          <polygon points="65,22 110,105 20,105" fill="#FFFFFF" />
          <!-- Musta kävelijä ja suojatieraidat -->
          <rect x="36" y="94" width="58" height="6" fill="#0F172A" />
          <circle cx="65" cy="46" r="6" fill="#0F172A" />
          <path d="M 65 52 L 65 72 L 78 88 M 65 72 L 52 88 M 52 62 L 78 62" stroke="#0F172A" stroke-width="4" stroke-linecap="round" fill="none" />
        </svg>
      `;
    }

    if (signType === 'pyora') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Pyöreä sininen polkupyörätie -->
          <circle cx="65" cy="65" r="55" fill="#2563EB" stroke="#1D4ED8" stroke-width="3" />
          <!-- Polkupyörä -->
          <circle cx="42" cy="74" r="14" fill="none" stroke="#FFFFFF" stroke-width="4" />
          <circle cx="88" cy="74" r="14" fill="none" stroke="#FFFFFF" stroke-width="4" />
          <path d="M 42 74 L 60 54 L 88 74 L 70 54 L 52 74 M 60 54 L 60 44 L 52 44" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      `;
    }

    return '';
  }

  renderAgeRatingSVG(age) {
    const bgColors = {
      '7': '#F59E0B',
      '12': '#EA580C',
      '16': '#DC2626',
      '18': '#991B1B'
    };
    const bg = bgColors[age] || '#EA580C';

    return `
      <svg width="130" height="130" viewBox="0 0 130 130">
        <!-- Varoitusympyrä -->
        <circle cx="65" cy="65" r="55" fill="${bg}" stroke="#0F172A" stroke-width="4" />
        <circle cx="65" cy="65" r="48" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6,4" />
        <!-- Teksti -->
        <text x="65" y="52" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">IKÄRAJA</text>
        <text x="65" y="92" font-size="40" font-weight="900" fill="#FFFFFF" text-anchor="middle">K-${age}</text>
      </svg>
    `;
  }

  renderOrganSVG(organ) {
    if (organ === 'sydan') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Sydän -->
          <path d="M 65 35 C 65 20, 35 15, 25 40 C 15 65, 45 90, 65 115 C 85 90, 115 65, 105 40 C 95 15, 65 20, 65 35 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="4" />
          <!-- Aortta ja suonet yläpuolella -->
          <path d="M 52 28 Q 50 12 40 10 M 60 22 Q 62 8 70 8 M 76 25 Q 82 12 90 14" fill="none" stroke="#3B82F6" stroke-width="5" stroke-linecap="round" />
        </svg>
      `;
    }

    if (organ === 'keuhkot') {
      return `
        <svg width="130" height="130" viewBox="0 0 130 130">
          <!-- Henkitorvi -->
          <line x1="65" y1="15" x2="65" y2="48" stroke="#334155" stroke-width="6" stroke-linecap="round" />
          <line x1="65" y1="48" x2="48" y2="65" stroke="#334155" stroke-width="5" stroke-linecap="round" />
          <line x1="65" y1="48" x2="82" y2="65" stroke="#334155" stroke-width="5" stroke-linecap="round" />
          <!-- Vasen ja oikea keuhko -->
          <path d="M 46 60 C 25 65, 20 100, 35 115 C 48 118, 55 95, 52 70 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="3" />
          <path d="M 84 60 C 105 65, 110 100, 95 115 C 82 118, 75 95, 78 70 Z" fill="#F43F5E" stroke="#BE123C" stroke-width="3" />
        </svg>
      `;
    }

    return '';
  }

  // Tarkista vastaus
  checkAnswer(userAns, correctAns) {
    if (typeof userAns === 'undefined' || userAns === null) return false;
    const cleanUser = String(userAns).trim().toLowerCase();
    const cleanCorrect = String(correctAns).trim().toLowerCase();
    return cleanUser === cleanCorrect;
  }
}

window.subjectEngine = new SubjectEngine();
