/**
 * Koulu-apuri: 4. luokan matematiikkamoottori
 * Sisältää Opetushallituksen OPS 2016 -tavoitteisiin perustuvat generaattorit
 * sekä tuen vanhempien omille kustomoiduille koetehtäville.
 */
class MathEngine {
  constructor() {
    this.customQuestions = [];
  }

  setCustomQuestions(questions) {
    this.customQuestions = questions || [];
  }

  // Apufunktio satunnaisluvuille
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Valitse satunnainen alkio
  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Sekoita taulukko
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Luo monivalintavaihtoehdot oikean vastauksen ympärille
  generateOptions(correct, count = 4, step = 1, isNumber = true) {
    if (!isNumber || isNaN(Number(correct))) {
      return [correct];
    }
    const correctNum = Number(correct);
    const options = new Set([correctNum]);
    let tries = 0;

    while (options.size < count && tries < 30) {
      tries++;
      const offset = (this.randInt(1, 4) * (Math.random() > 0.5 ? 1 : -1)) * step;
      const candidate = correctNum + offset;
      if (candidate >= 0 && candidate !== correctNum) {
        options.add(candidate);
      }
    }

    // Täydennetään jos ei löytynyt riittävästi
    let fill = 1;
    while (options.size < count) {
      options.add(correctNum + fill);
      fill++;
    }

    return this.shuffle(Array.from(options).map(String));
  }

  // ==========================================
  // TEHTÄVÄGENERAATTORIT
  // ==========================================

  // 1. Kertolaskut (1-10 tai vaikeat 6,7,8,9 tai kympeillä kertominen)
  generateMultiplication(specificTable = null) {
    let a, b;
    const mode = Math.random();

    if (specificTable) {
      a = specificTable;
      b = this.randInt(1, 10);
    } else if (mode < 0.6) {
      // Painotetaan 4. luokan kompastuskiviä (6, 7, 8, 9)
      a = this.pick([6, 7, 8, 9]);
      b = this.randInt(3, 9);
    } else if (mode < 0.85) {
      // Peruskertotaulut 1-10
      a = this.randInt(2, 9);
      b = this.randInt(2, 10);
    } else {
      // Kympeillä kertominen (esim. 40 * 6 tai 70 * 80)
      a = this.pick([20, 30, 40, 50, 60, 70, 80]);
      b = this.randInt(2, 9);
    }

    const answer = a * b;
    const questionText = `${a} × ${b} = ?`;
    const hint = `Muistisääntö: ${a} × ${b} = ${answer}`;

    return {
      topic: 'kertolasku',
      category: 'Kertolaskut',
      question: questionText,
      answer: String(answer),
      options: this.generateOptions(answer, 4, a > 10 ? 10 : 2),
      hint: hint,
      type: 'calc'
    };
  }

  // 2. Jakolaskut (tasan menevät ja jakojäännös)
  generateDivision() {
    const isRemainder = Math.random() < 0.35;

    if (!isRemainder) {
      // Tasan menevä jakolasku
      const b = this.randInt(2, 9);
      const answer = this.randInt(2, 9);
      const a = b * answer;

      return {
        topic: 'jakolasku',
        category: 'Jakolaskut',
        question: `${a} : ${b} = ?`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, 1),
        hint: `Ajattele käänteisesti: mikä luku kerrottuna luvulla ${b} on ${a}? (${b} × ${answer} = ${a})`,
        type: 'calc'
      };
    } else {
      // Jakojäännöslasku: esim. 23 : 4 = 5 j 3
      const b = this.randInt(3, 8);
      const quotient = this.randInt(2, 7);
      const remainder = this.randInt(1, b - 1);
      const dividend = b * quotient + remainder;

      return {
        topic: 'jakolasku',
        category: 'Jakolaskut (jakojäännös)',
        question: `Paljonko on jakolaskun ${dividend} : ${b} jakojäännös?`,
        answer: String(remainder),
        options: this.generateOptions(remainder, 4, 1),
        hint: `${b} mahtuu lukuun ${dividend} tasan ${quotient} kertaa (${b} × ${quotient} = ${b * quotient}). Jakojäännös on ${dividend} - ${b * quotient} = ${remainder}.`,
        type: 'calc'
      };
    }
  }

  // 3. Murtoluvut (käsite, vertailu, osa luvusta)
  generateFraction() {
    const subType = this.pick(['part_of_number', 'compare', 'addition']);

    if (subType === 'part_of_number') {
      // Esim. 1/4 luvusta 24
      const den = this.pick([2, 3, 4, 5, 6, 8]);
      const quotient = this.randInt(2, 8);
      const total = den * quotient;
      const num = 1; // 4. lk usein yksikkömurtoluvut tai 2/3 jne.

      const answer = quotient * num;
      const questionText = `Paljonko on ${num}/${den} luvusta ${total}?`;

      return {
        topic: 'murtoluvut',
        category: 'Murtoluvut',
        question: questionText,
        answer: String(answer),
        options: this.generateOptions(answer, 4, 1),
        hint: `Jaa ensin kokonaisluku ${total} nimittäjällä ${den}: ${total} : ${den} = ${quotient}.`,
        visual: { type: 'pie', num: num, den: den },
        type: 'calc'
      };
    } else if (subType === 'addition') {
      // Samannimisten murtolukujen yhteenlasku: 2/7 + 3/7 = 5/7
      const den = this.pick([5, 6, 7, 8, 9, 10]);
      const num1 = this.randInt(1, den - 3);
      const num2 = this.randInt(1, den - num1 - 1);
      const ansNum = num1 + num2;

      const questionText = `${num1}/${den} + ${num2}/${den} = ?`;
      const answer = `${ansNum}/${den}`;

      // Luodaan hämääviä vaihtoehtoja (esim. jos vahingossa laskee nimittäjät yhteen)
      const options = this.shuffle([
        `${ansNum}/${den}`,
        `${ansNum}/${den * 2}`,
        `${Math.min(den, ansNum + 1)}/${den}`,
        `${Math.max(1, ansNum - 1)}/${den}`
      ]);

      return {
        topic: 'murtoluvut',
        category: 'Murtoluvut',
        question: questionText,
        answer: answer,
        options: options,
        hint: 'Kun nimittäjät ovat samat, vain osoittajat (yläpuolen luvut) lasketaan yhteen!',
        type: 'choice'
      };
    } else {
      // Vertailu: Kumpi on suurempi?
      const den = this.pick([4, 5, 6, 8, 10]);
      let num1 = this.randInt(1, den - 1);
      let num2 = this.randInt(1, den - 1);
      while (num1 === num2) num2 = this.randInt(1, den - 1);

      const bigger = num1 > num2 ? `${num1}/${den}` : `${num2}/${den}`;
      const questionText = `Kumpi on suurempi: ${num1}/${den} vai ${num2}/${den}?`;

      return {
        topic: 'murtoluvut',
        category: 'Murtoluvut (vertailu)',
        question: questionText,
        answer: bigger,
        options: [`${num1}/${den}`, `${num2}/${den}`, 'Yhtä suuret'],
        hint: 'Kun kakku on jaettu yhtä moneen palaan, enemmän paloja on suurempi määrä.',
        type: 'choice'
      };
    }
  }

  // 4. Lukualue 0-100 000 ja Pyöristäminen
  generateNumbersAndRounding() {
    const isRounding = Math.random() < 0.6;

    if (isRounding) {
      const roundTo = this.pick(['kymppiin', 'sataan', 'tuhanteen']);
      let base, answer;

      if (roundTo === 'kymppiin') {
        base = this.randInt(123, 989);
        answer = Math.round(base / 10) * 10;
      } else if (roundTo === 'sataan') {
        base = this.randInt(1240, 8980);
        answer = Math.round(base / 100) * 100;
      } else {
        base = this.randInt(12400, 78900);
        answer = Math.round(base / 1000) * 1000;
      }

      return {
        topic: 'lukualue',
        category: 'Pyöristäminen',
        question: `Pyöristä luku ${base.toLocaleString('fi-FI')} lähimpään ${roundTo}:`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, roundTo === 'kymppiin' ? 10 : (roundTo === 'sataan' ? 100 : 1000)),
        hint: `Tarkista seuraava numero: 0-4 pyöristää alaspäin, 5-9 pyöristää ylöspäin!`,
        type: 'calc'
      };
    } else {
      // Lukujonot / puuttuva luku
      const step = this.pick([50, 100, 250, 500, 1000]);
      const start = this.randInt(2, 20) * step;
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const missingIndex = this.pick([1, 2]);
      const answer = seq[missingIndex];
      seq[missingIndex] = '___';

      return {
        topic: 'lukualue',
        category: 'Lukujonot',
        question: `Mikä luku puuttuu jonosta?\n${seq.map(n => typeof n === 'number' ? n.toLocaleString('fi-FI') : n).join(', ')}`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, step),
        hint: `Huomaa, että luku kasvaa joka askeleella ${step.toLocaleString('fi-FI')} verran.`,
        type: 'calc'
      };
    }
  }

  // 5. Mittaaminen ja Geometria (piiri, pinta-ala, mittayksiköt)
  generateMeasurement() {
    const subType = this.pick(['perimeter', 'unit_conversion', 'time']);

    if (subType === 'perimeter') {
      const length = this.randInt(4, 12);
      const width = this.randInt(2, 7);
      const perimeter = 2 * (length + width);

      return {
        topic: 'geometria',
        category: 'Geometria (piiri)',
        question: `Suorakulmion pituus on ${length} cm ja leveys ${width} cm. Mikä on sen piiri?`,
        answer: String(perimeter),
        options: this.generateOptions(perimeter, 4, 2),
        hint: `Piiri on kaikkien neljän sivun pituus yhteenlaskettuna: ${length} + ${width} + ${length} + ${width} = ${perimeter} cm.`,
        type: 'calc'
      };
    } else if (subType === 'unit_conversion') {
      const conversions = [
        { q: (val) => `${val} m on kuinka monta senttimetriä (cm)?`, calc: (v) => v * 100, range: [2, 9], step: 100 },
        { q: (val) => `${val} km on kuinka monta metriä (m)?`, calc: (v) => v * 1000, range: [2, 8], step: 1000 },
        { q: (val) => `${val} kg on kuinka monta grammaa (g)?`, calc: (v) => v * 1000, range: [2, 6], step: 1000 },
        { q: (val) => `${val} l on kuinka monta desilitraa (dl)?`, calc: (v) => v * 10, range: [2, 9], step: 10 }
      ];
      const conv = this.pick(conversions);
      const val = this.randInt(conv.range[0], conv.range[1]);
      const answer = conv.calc(val);

      return {
        topic: 'mittaaminen',
        category: 'Mittayksiköt',
        question: conv.q(val),
        answer: String(answer),
        options: this.generateOptions(answer, 4, conv.step),
        hint: `1 m = 100 cm | 1 km = 1000 m | 1 kg = 1000 g | 1 l = 10 dl`,
        type: 'calc'
      };
    } else {
      // Kello ja kulunut aika
      const startHour = this.randInt(12, 17);
      const addHour = this.randInt(1, 2);
      const addMin = this.pick([15, 30, 45]);
      const endHour = startHour + addHour;

      const questionText = `Harjoitus alkaa klo ${startHour}:00 ja kestää ${addHour} h ${addMin} min. Milloin harjoitus päättyy?`;
      const answer = `${endHour}:${addMin}`;

      const options = this.shuffle([
        answer,
        `${endHour - 1}:${addMin}`,
        `${endHour}:${addMin === 30 ? 15 : 30}`,
        `${endHour + 1}:${addMin}`
      ]);

      return {
        topic: 'aika',
        category: 'Kello ja aika',
        question: questionText,
        answer: answer,
        options: options,
        hint: `Lisää ensin tunnit: ${startHour}:00 + ${addHour} h = ${endHour}:00. Lisää sitten minuutit.`,
        type: 'choice'
      };
    }
  }

  // 6. Sanalliset tehtävät (arjen matematiikka)
  generateWordProblem() {
    const templates = [
      () => {
        const item = this.pick(['kynää', 'tarraa', 'keräilykorttia', 'omenapussia']);
        const count = this.randInt(3, 6);
        const price = this.randInt(3, 7);
        const paid = 50;
        const total = count * price;
        const change = paid - total;
        return {
          question: `Emilia ostaa ${count} ${item}. Yksi kappale maksaa ${price} euroa. Hän maksaa ${paid} euron setelillä. Kuinka paljon hän saa takaisin vaihtorahaa?`,
          answer: String(change),
          hint: `Laske ensin ostosten yhteishinta: ${count} × ${price} € = ${total} €. Vähennä se sitten 50 eurosta: 50 € - ${total} € = ${change} €.`
        };
      },
      () => {
        const pets = this.pick(['koiranpentua', 'kissanpentua', 'kania']);
        const cageCount = this.randInt(3, 5);
        const perCage = this.randInt(4, 6);
        const total = cageCount * perCage;
        return {
          question: `Eläinhoitolassa on ${cageCount} huonetta. Jokaisessa huoneessa asustaa ${perCage} ${pets}. Kuinka monta eläintä hoitolassa on yhteensä?`,
          answer: String(total),
          hint: `Käytä kertolaskua: ${cageCount} × ${perCage} = ${total}.`
        };
      },
      () => {
        const pages = this.randInt(60, 90);
        const days = this.pick([3, 4, 5]);
        const perDay = Math.floor(pages / days);
        const cleanPages = perDay * days;
        return {
          question: `Leo aikoo lukea ${cleanPages}-sivuisen kirjan ${days} päivässä. Kuinka monta sivua hänen pitää lukea päivässä, jos hän lukee joka päivä yhtä paljon?`,
          answer: String(perDay),
          hint: `Jaa kirjan sivumäärä päivien lukumäärällä: ${cleanPages} : ${days} = ${perDay} sivua.`
        };
      }
    ];

    const gen = this.pick(templates)();
    return {
      topic: 'sanalliset',
      category: 'Sanalliset tehtävät',
      question: gen.question,
      answer: gen.answer,
      options: this.generateOptions(gen.answer, 4, 2),
      hint: gen.hint,
      type: 'calc'
    };
  }

  // Generoi tehtävä aiheen mukaan
  generateByTopic(topicId) {
    // Jos kyseessä on vanhempien omat tehtävät
    if (topicId === 'omat' && this.customQuestions.length > 0) {
      const q = this.pick(this.customQuestions);
      return {
        topic: 'omat',
        category: q.aihe || 'Oma koeharjoitus',
        question: q.kysymys,
        answer: String(q.oikeaVastaus),
        options: this.generateOptions(q.oikeaVastaus, 4, 1),
        hint: q.vihje || 'Mieti rauhassa tehtävänantoa!',
        type: 'calc'
      };
    }

    switch (topicId) {
      case 'kertolaskut':
        return this.generateMultiplication();
      case 'jakolaskut':
        return this.generateDivision();
      case 'murtoluvut':
        return this.generateFraction();
      case 'lukualue':
        return this.generateNumbersAndRounding();
      case 'mittaaminen':
        return this.generateMeasurement();
      case 'sanalliset':
        return this.generateWordProblem();
      case 'sekoitus':
      default: {
        const generators = [
          () => this.generateMultiplication(),
          () => this.generateDivision(),
          () => this.generateFraction(),
          () => this.generateNumbersAndRounding(),
          () => this.generateMeasurement(),
          () => this.generateWordProblem()
        ];
        // Jos vanhempien tehtäviä on saatavilla, sisällytetään nekin sekoitukseen
        if (this.customQuestions.length > 0) {
          generators.push(() => this.generateByTopic('omat'));
        }
        return this.pick(generators)();
      }
    }
  }

  // Tarkista vastaus
  checkAnswer(userAns, correctAns) {
    if (typeof userAns === 'undefined' || userAns === null) return false;
    const cleanUser = String(userAns).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
    const cleanCorrect = String(correctAns).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
    return cleanUser === cleanCorrect;
  }
}

window.mathEngine = new MathEngine();
