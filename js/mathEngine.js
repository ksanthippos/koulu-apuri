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
  // TEHTÄVÄGENERAATTORIT (Adaptiiviset tasot 1–3+)
  // ==========================================

  // 1. Kertolaskut (Taso 1: taulut 2-5 & 10, Taso 2: 6-9 & kympit, Taso 3: kaksinumeroiset 3*12, 4*15 jne.)
  generateMultiplication(level = 1, specificTable = null) {
    let a, b;

    if (specificTable) {
      a = specificTable;
      b = this.randInt(1, 10);
    } else if (level === 1) {
      // Taso 1: Peruskertotaulut 2-5 ja 10
      a = this.pick([2, 3, 4, 5, 10]);
      b = this.randInt(2, 9);
    } else if (level === 2) {
      // Taso 2: 4. luokan standarditaso (kompastuskivet 6, 7, 8, 9 ja kympit)
      const mode = Math.random();
      if (mode < 0.7) {
        a = this.pick([6, 7, 8, 9]);
        b = this.randInt(3, 9);
      } else {
        a = this.pick([20, 30, 40, 50, 60]);
        b = this.randInt(2, 6);
      }
    } else {
      // Taso 3+: Haastavampi / edistynyt taso (kaksinumeroiset x yksinumeroiset 3*12, 4*15, 6*12 tai kymppien tulo)
      const advMode = Math.random();
      if (advMode < 0.6) {
        // Kaksinumeroinen kerrottuna yksinumeroisella (esim. 11–16 × 2–6)
        a = this.pick([11, 12, 13, 14, 15, 16]);
        b = this.randInt(2, 6);
      } else if (advMode < 0.85) {
        // Kymppien tulo: esim. 30 × 40 tai 60 × 70
        a = this.pick([20, 30, 40, 50, 60, 70, 80]);
        b = this.pick([20, 30, 40, 50, 60, 70, 80]);
      } else {
        // Isommat kertolaskut: esim. 4 × 25 tai 5 × 18
        a = this.pick([18, 20, 25, 30]);
        b = this.randInt(3, 6);
      }
    }

    const answer = a * b;
    const questionText = `${a} × ${b} = ?`;

    let hint;
    if (a > 10 && a < 20 && b <= 9) {
      hint = `Vinkki: Jaa ${a} kymppeihin ja ykkösiin: (10 × ${b}) + (${a - 10} × ${b}) = ${10 * b} + ${(a - 10) * b} = ${answer}.`;
    } else if (a >= 20 && b >= 20) {
      hint = `Vinkki: Laske ensin ${a / 10} × ${b / 10} = ${(a * b) / 100}, ja lisää kaksi nollaa: ${answer}.`;
    } else {
      hint = `Muistisääntö: ${a} × ${b} = ${answer}`;
    }

    return {
      topic: 'kertolasku',
      category: `Kertolaskut (Taso ${level})`,
      question: questionText,
      answer: String(answer),
      options: this.generateOptions(answer, 4, a > 10 ? 10 : 2),
      hint: hint,
      type: 'calc'
    };
  }

  // 2. Jakolaskut (Taso 1: helpot tasan jaot, Taso 2: taulut 6-9 & jakojäännös, Taso 3: kaksinumeroisten jako 48:4=12, kympit 360:6=60)
  generateDivision(level = 1) {
    if (level === 1) {
      // Taso 1: Helpot perusjaot (2-5 jakajana)
      const b = this.randInt(2, 5);
      const answer = this.randInt(2, 7);
      const a = b * answer;

      return {
        topic: 'jakolasku',
        category: 'Jakolaskut (Taso 1)',
        question: `${a} : ${b} = ?`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, 1),
        hint: `Ajattele kertolaskuna: mikä luku kerrottuna luvulla ${b} on ${a}? (${b} × ${answer} = ${a})`,
        type: 'calc'
      };
    } else if (level === 2) {
      // Taso 2: 4. luokan perustaso (taulut 6-9 ja helpot jakojäännökset)
      const isRemainder = Math.random() < 0.4;

      if (!isRemainder) {
        const b = this.randInt(6, 9);
        const answer = this.randInt(3, 9);
        const a = b * answer;

        return {
          topic: 'jakolasku',
          category: 'Jakolaskut (Taso 2)',
          question: `${a} : ${b} = ?`,
          answer: String(answer),
          options: this.generateOptions(answer, 4, 1),
          hint: `${b} × ${answer} = ${a}, joten ${a} : ${b} = ${answer}.`,
          type: 'calc'
        };
      } else {
        const b = this.randInt(3, 8);
        const quotient = this.randInt(2, 7);
        const remainder = this.randInt(1, b - 1);
        const dividend = b * quotient + remainder;

        return {
          topic: 'jakolasku',
          category: 'Jakolaskut (Taso 2)',
          question: `Paljonko on jakolaskun ${dividend} : ${b} jakojäännös?`,
          answer: String(remainder),
          options: this.generateOptions(remainder, 4, 1),
          hint: `${b} mahtuu lukuun ${dividend} tasan ${quotient} kertaa (${b} × ${quotient} = ${b * quotient}). Jakojäännös on ${dividend} - ${b * quotient} = ${remainder}.`,
          type: 'calc'
        };
      }
    } else {
      // Taso 3+: Kaksinumeroisten jako yksinumeroisella (48:4=12, 75:5=15) tai kymppijaot (360:6=60)
      const mode = Math.random();

      if (mode < 0.6) {
        const answer = this.randInt(11, 16);
        const b = this.randInt(3, 6);
        const a = b * answer;

        return {
          topic: 'jakolasku',
          category: 'Jakolaskut (Taso 3)',
          question: `${a} : ${b} = ?`,
          answer: String(answer),
          options: this.generateOptions(answer, 4, 1),
          hint: `Vinkki: Jaa luku osiin: ${Math.floor(a / (b * 10)) * b * 10} : ${b} = ${Math.floor(a / (b * 10)) * 10}, ja loput ${a % (b * 10)} : ${b} = ${answer % 10}. Yhteensä ${answer}.`,
          type: 'calc'
        };
      } else {
        const quotientTens = this.randInt(3, 9) * 10;
        const b = this.randInt(3, 9);
        const a = b * quotientTens;

        return {
          topic: 'jakolasku',
          category: 'Jakolaskut (Taso 3)',
          question: `${a} : ${b} = ?`,
          answer: String(quotientTens),
          options: this.generateOptions(quotientTens, 4, 10),
          hint: `Laske ensin ${a / 10} : ${b} = ${quotientTens / 10}, ja lisää nolla perään: ${quotientTens}.`,
          type: 'calc'
        };
      }
    }
  }

  // 3. Murtoluvut (Taso 1: visuaalinen piirakka & 1/2, 1/4, Taso 2: samannimisten yhteenlasku, Taso 3: 2/3 tai 3/4 luvusta & vähennys)
  generateFraction(level = 1) {
    if (level === 1) {
      // Taso 1: Peruskäsitteet ja visuaaliset piirakat
      const den = this.pick([2, 3, 4]);
      const quotient = this.randInt(2, 6);
      const total = den * quotient;
      const num = 1;
      const answer = quotient;

      return {
        topic: 'murtoluvut',
        category: 'Murtoluvut (Taso 1)',
        question: `Paljonko on ${num}/${den} luvusta ${total}?`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, 1),
        hint: `Jaa kokonaisluku ${total} nimittäjällä ${den}: ${total} : ${den} = ${quotient}.`,
        visual: { type: 'pie', num: num, den: den },
        type: 'calc'
      };
    } else if (level === 2) {
      // Taso 2: Samannimisten yhteenlasku ja vertailu
      const subType = this.pick(['part', 'addition', 'compare']);

      if (subType === 'part') {
        const den = this.pick([4, 5, 6, 8]);
        const quotient = this.randInt(3, 8);
        const total = den * quotient;
        const num = 1;

        return {
          topic: 'murtoluvut',
          category: 'Murtoluvut (Taso 2)',
          question: `Paljonko on ${num}/${den} luvusta ${total}?`,
          answer: String(quotient),
          options: this.generateOptions(quotient, 4, 1),
          hint: `Jaa kokonaisluku nimittäjällä: ${total} : ${den} = ${quotient}.`,
          visual: { type: 'pie', num: num, den: den },
          type: 'calc'
        };
      } else if (subType === 'addition') {
        const den = this.pick([5, 6, 7, 8, 9, 10]);
        const num1 = this.randInt(1, den - 3);
        const num2 = this.randInt(1, den - num1 - 1);
        const ansNum = num1 + num2;

        return {
          topic: 'murtoluvut',
          category: 'Murtoluvut (Taso 2)',
          question: `${num1}/${den} + ${num2}/${den} = ?`,
          answer: `${ansNum}/${den}`,
          options: this.shuffle([
            `${ansNum}/${den}`,
            `${ansNum}/${den * 2}`,
            `${Math.min(den, ansNum + 1)}/${den}`,
            `${Math.max(1, ansNum - 1)}/${den}`
          ]),
          hint: 'Kun nimittäjät ovat samat, vain osoittajat (yläpuolen luvut) lasketaan yhteen!',
          type: 'choice'
        };
      } else {
        const den = this.pick([4, 5, 6, 8, 10]);
        let num1 = this.randInt(1, den - 1);
        let num2 = this.randInt(1, den - 1);
        while (num1 === num2) num2 = this.randInt(1, den - 1);

        const bigger = num1 > num2 ? `${num1}/${den}` : `${num2}/${den}`;
        return {
          topic: 'murtoluvut',
          category: 'Murtoluvut (Taso 2)',
          question: `Kumpi on suurempi: ${num1}/${den} vai ${num2}/${den}?`,
          answer: bigger,
          options: [`${num1}/${den}`, `${num2}/${den}`, 'Yhtä suuret'],
          hint: 'Kun kakku on jaettu yhtä moneen palaan, enemmän paloja on suurempi määrä.',
          type: 'choice'
        };
      }
    } else {
      // Taso 3+: Suuremmat osat (2/3, 3/4 tai 2/5 luvusta) tai vähennyslasku
      const isSub = Math.random() < 0.5;

      if (isSub) {
        const den = this.pick([6, 7, 8, 9, 10]);
        const num1 = this.randInt(4, den - 1);
        const num2 = this.randInt(1, num1 - 1);
        const ansNum = num1 - num2;

        return {
          topic: 'murtoluvut',
          category: 'Murtoluvut (Taso 3)',
          question: `${num1}/${den} - ${num2}/${den} = ?`,
          answer: `${ansNum}/${den}`,
          options: this.shuffle([
            `${ansNum}/${den}`,
            `${ansNum}/${den * 2}`,
            `${Math.max(1, ansNum - 1)}/${den}`,
            `${ansNum + 1}/${den}`
          ]),
          hint: `Vähennä vain osoittajat: ${num1} - ${num2} = ${ansNum}, nimittäjä ${den} pysyy samana.`,
          type: 'choice'
        };
      } else {
        const config = this.pick([
          { num: 2, den: 3 },
          { num: 3, den: 4 },
          { num: 2, den: 5 },
          { num: 3, den: 5 }
        ]);
        const quotient = this.randInt(3, 9);
        const total = config.den * quotient;
        const answer = config.num * quotient;

        return {
          topic: 'murtoluvut',
          category: 'Murtoluvut (Taso 3)',
          question: `Paljonko on ${config.num}/${config.den} luvusta ${total}?`,
          answer: String(answer),
          options: this.generateOptions(answer, 4, config.num),
          hint: `Laske kahdessa vaiheessa: 1) ${total} : ${config.den} = ${quotient}. 2) ${quotient} × ${config.num} = ${answer}.`,
          type: 'calc'
        };
      }
    }
  }

  // 4. Lukualue ja Pyöristäminen (Taso 1: 0-1000 kymppiin, Taso 2: 0-100k tuhanteen, Taso 3: 0-1 milj.)
  generateNumbersAndRounding(level = 1) {
    const isRounding = Math.random() < 0.6;

    if (isRounding) {
      let roundTo, base, answer, step;

      if (level === 1) {
        roundTo = 'kymppiin';
        base = this.randInt(123, 989);
        answer = Math.round(base / 10) * 10;
        step = 10;
      } else if (level === 2) {
        roundTo = this.pick(['sataan', 'tuhanteen']);
        if (roundTo === 'sataan') {
          base = this.randInt(1240, 8980);
          answer = Math.round(base / 100) * 100;
          step = 100;
        } else {
          base = this.randInt(12400, 78900);
          answer = Math.round(base / 1000) * 1000;
          step = 1000;
        }
      } else {
        roundTo = this.pick(['tuhanteen', 'kymmentuhanteen']);
        if (roundTo === 'tuhanteen') {
          base = this.randInt(34000, 290000);
          answer = Math.round(base / 1000) * 1000;
          step = 1000;
        } else {
          base = this.randInt(120000, 890000);
          answer = Math.round(base / 10000) * 10000;
          step = 10000;
        }
      }

      return {
        topic: 'lukualue',
        category: `Pyöristäminen (Taso ${level})`,
        question: `Pyöristä luku ${base.toLocaleString('fi-FI')} lähimpään ${roundTo}:`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, step),
        hint: `Tarkista seuraava numero: 0-4 pyöristää alaspäin, 5-9 pyöristää ylöspäin!`,
        type: 'calc'
      };
    } else {
      // Lukujonot
      let step;
      if (level === 1) {
        step = this.pick([5, 10, 20]);
      } else if (level === 2) {
        step = this.pick([50, 100, 250, 500]);
      } else {
        step = this.pick([250, 500, 1000, 2500]);
      }

      const start = this.randInt(2, 20) * step;
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const missingIndex = this.pick([1, 2]);
      const answer = seq[missingIndex];
      seq[missingIndex] = '___';

      return {
        topic: 'lukualue',
        category: `Lukujonot (Taso ${level})`,
        question: `Mikä luku puuttuu jonosta?\n${seq.map(n => typeof n === 'number' ? n.toLocaleString('fi-FI') : n).join(', ')}`,
        answer: String(answer),
        options: this.generateOptions(answer, 4, step),
        hint: `Luku muuttuu joka askeleella ${step.toLocaleString('fi-FI')} verran.`,
        type: 'calc'
      };
    }
  }

  // 5. Mittaaminen ja Geometria (Taso 1: perusmuunnokset, Taso 2: piiri & kello, Taso 3: pinta-ala & aikavälit)
  generateMeasurement(level = 1) {
    if (level === 1) {
      // Taso 1: Perusmittayksiköt
      const conversions = [
        { q: (val) => `${val} m on kuinka monta senttimetriä (cm)?`, calc: (v) => v * 100, range: [2, 9], step: 100 },
        { q: (val) => `${val} l on kuinka monta desilitraa (dl)?`, calc: (v) => v * 10, range: [2, 9], step: 10 },
        { q: (val) => `${val} kg on kuinka monta grammaa (g)?`, calc: (v) => v * 1000, range: [2, 5], step: 1000 }
      ];
      const conv = this.pick(conversions);
      const val = this.randInt(conv.range[0], conv.range[1]);
      const answer = conv.calc(val);

      return {
        topic: 'mittaaminen',
        category: 'Mittayksiköt (Taso 1)',
        question: conv.q(val),
        answer: String(answer),
        options: this.generateOptions(answer, 4, conv.step),
        hint: `1 m = 100 cm | 1 kg = 1000 g | 1 l = 10 dl`,
        type: 'calc'
      };
    } else if (level === 2) {
      // Taso 2: Suorakulmion piiri ja kellonajat
      const isPerimeter = Math.random() < 0.5;

      if (isPerimeter) {
        const length = this.randInt(4, 12);
        const width = this.randInt(2, 7);
        const perimeter = 2 * (length + width);

        return {
          topic: 'geometria',
          category: 'Geometria (piiri)',
          question: `Suorakulmion pituus on ${length} cm ja leveys ${width} cm. Mikä on sen piiri?`,
          answer: String(perimeter),
          options: this.generateOptions(perimeter, 4, 2),
          hint: `Piiri on kaikkien neljän sivun summa: ${length} + ${width} + ${length} + ${width} = ${perimeter} cm.`,
          type: 'calc'
        };
      } else {
        const startHour = this.randInt(12, 17);
        const addHour = this.randInt(1, 2);
        const addMin = this.pick([15, 30, 45]);
        const endHour = startHour + addHour;
        const answer = `${endHour}:${addMin}`;

        return {
          topic: 'aika',
          category: 'Kello ja aika',
          question: `Harjoitus alkaa klo ${startHour}:00 ja kestää ${addHour} h ${addMin} min. Milloin harjoitus päättyy?`,
          answer: answer,
          options: this.shuffle([
            answer,
            `${endHour - 1}:${addMin}`,
            `${endHour}:${addMin === 30 ? 15 : 30}`,
            `${endHour + 1}:${addMin}`
          ]),
          hint: `Lisää tunnit: ${startHour} + ${addHour} = ${endHour}. Lisää sitten minuutit: ${endHour}:${addMin}.`,
          type: 'choice'
        };
      }
    } else {
      // Taso 3+: Suorakulmion pinta-ala (A = a * b) tai aikavälin laskenta
      const isArea = Math.random() < 0.6;

      if (isArea) {
        const length = this.randInt(4, 12);
        const width = this.randInt(3, 8);
        const area = length * width;

        return {
          topic: 'geometria',
          category: 'Pinta-ala (Taso 3)',
          question: `Suorakulmion pituus on ${length} m ja leveys ${width} m. Mikä on sen pinta-ala (m²)?`,
          answer: String(area),
          options: this.generateOptions(area, 4, 2),
          hint: `Pinta-ala lasketaan kertomalla pituus ja leveys: ${length} m × ${width} m = ${area} m².`,
          type: 'calc'
        };
      } else {
        const km = this.randInt(2, 6);
        const m = this.randInt(1, 9) * 100;
        const totalM = km * 1000 + m;

        return {
          topic: 'mittaaminen',
          category: 'Mittayksiköt (Taso 3)',
          question: `Kuinka monta metriä on ${km} km ${m} m?`,
          answer: String(totalM),
          options: this.generateOptions(totalM, 4, 100),
          hint: `1 km = 1000 m, joten ${km} km on ${km * 1000} m. Lisää vielä ${m} m: ${totalM} m.`,
          type: 'calc'
        };
      }
    }
  }

  // 6. Sanalliset tehtävät (Taso 1: 1-vaiheinen, Taso 2: 2-vaiheinen, Taso 3: 3-vaiheinen / murtolukutarina)
  generateWordProblem(level = 1) {
    if (level === 1) {
      const pets = this.pick(['koiranpentua', 'kissanpentua', 'kania']);
      const cageCount = this.randInt(3, 5);
      const perCage = this.randInt(3, 5);
      const total = cageCount * perCage;
      return {
        topic: 'sanalliset',
        category: 'Sanalliset (Taso 1)',
        question: `Eläinhoitolassa on ${cageCount} huonetta. Jokaisessa huoneessa asustaa ${perCage} ${pets}. Kuinka monta eläintä hoitolassa on yhteensä?`,
        answer: String(total),
        options: this.generateOptions(total, 4, perCage),
        hint: `Käytä kertolaskua: ${cageCount} × ${perCage} = ${total}.`,
        type: 'calc'
      };
    } else if (level === 2) {
      const item = this.pick(['kynää', 'tarraa', 'vihkoa', 'omenapussia']);
      const count = this.randInt(3, 6);
      const price = this.randInt(3, 7);
      const paid = 50;
      const total = count * price;
      const change = paid - total;
      return {
        topic: 'sanalliset',
        category: 'Sanalliset (Taso 2)',
        question: `Emilia ostaa ${count} ${item}. Yksi kappale maksaa ${price} euroa. Hän maksaa ${paid} euron setelillä. Kuinka paljon hän saa vaihtorahaa?`,
        answer: String(change),
        options: this.generateOptions(change, 4, 2),
        hint: `Laske ensin ostokset: ${count} × ${price} € = ${total} €. Vähennä 50 eurosta: 50 € - ${total} € = ${change} €.`,
        type: 'calc'
      };
    } else {
      // Taso 3: Monivaiheinen murtolukutarina
      const total = this.pick([24, 30, 36, 40]);
      const den = this.pick([3, 4]);
      const fractionPart = total / den;
      const left = total - fractionPart;
      return {
        topic: 'sanalliset',
        category: 'Sanalliset (Taso 3)',
        question: `Korissa oli ${total} omenaa. Luokalle syötiin niistä 1/${den}. Kuinka monta omenaa koriin jäi jäljelle?`,
        answer: String(left),
        options: this.generateOptions(left, 4, 2),
        hint: `1) Laske syödyt omenat: ${total} : ${den} = ${fractionPart}. 2) Vähennä ne alusta: ${total} - ${fractionPart} = ${left} omenaa.`,
        type: 'calc'
      };
    }
  }

  // 7. Yhdistetyt laskutoimitukset & Laskujärjestys (Taso 1: 2-vaiheinen, Taso 2: sulut, Taso 3: kaksi tuloa rinnakkain)
  generateOrderOfOperations(level = 1) {
    let type;
    if (level === 1) {
      type = this.pick(['mult_second', 'div_second']);
    } else if (level === 2) {
      type = this.pick(['mult_second', 'div_second', 'brackets_add', 'brackets_sub']);
    } else {
      type = this.pick(['brackets_add', 'brackets_sub', 'two_products']);
    }

    let question, answer, trap, hint;

    if (type === 'mult_second') {
      const isSub = Math.random() < 0.5;
      const b = this.randInt(2, level >= 2 ? 8 : 5);
      const c = this.randInt(2, level >= 2 ? 9 : 6);
      const prod = b * c;

      if (isSub) {
        const a = prod + this.randInt(3, 20);
        answer = a - prod;
        trap = Math.max(0, (a - b) * c);
        question = `${a} - ${b} × ${c} = ?`;
        hint = `Laskujärjestys: Kertolasku lasketaan ENNEN vähennyslaskua! Laske ensin ${b} × ${c} = ${prod}, ja sitten ${a} - ${prod} = ${answer}.`;
      } else {
        const a = this.randInt(3, 25);
        answer = a + prod;
        trap = (a + b) * c;
        question = `${a} + ${b} × ${c} = ?`;
        hint = `Laskujärjestys: Kertolasku lasketaan ENNEN yhteenlaskua! Laske ensin ${b} × ${c} = ${prod}, ja sitten ${a} + ${prod} = ${answer}.`;
      }
    } else if (type === 'div_second') {
      const isSub = Math.random() < 0.5;
      const c = this.randInt(2, 6);
      const quot = this.randInt(2, 8);
      const b = c * quot;

      if (isSub) {
        const a = quot + this.randInt(3, 25);
        answer = a - quot;
        trap = Math.max(0, Math.floor((a - b) / c));
        question = `${a} - ${b} : ${c} = ?`;
        hint = `Laskujärjestys: Jakolasku lasketaan ENNEN vähennyslaskua! Laske ensin ${b} : ${c} = ${quot}, ja sitten ${a} - ${quot} = ${answer}.`;
      } else {
        const a = this.randInt(2, 25);
        answer = a + quot;
        trap = Math.floor((a + b) / c);
        question = `${a} + ${b} : ${c} = ?`;
        hint = `Laskujärjestys: Jakolasku lasketaan ENNEN yhteenlaskua! Laske ensin ${b} : ${c} = ${quot}, ja sitten ${a} + ${quot} = ${answer}.`;
      }
    } else if (type === 'brackets_add') {
      const a = this.randInt(2, 6);
      const b = this.randInt(2, 6);
      const c = this.randInt(2, 7);
      const sum = a + b;
      answer = sum * c;
      trap = a + (b * c);

      const isPrefix = Math.random() < 0.5;
      question = isPrefix ? `(${a} + ${b}) × ${c} = ?` : `${c} × (${a} + ${b}) = ?`;
      hint = `Laskujärjestys: Sulkulauseke lasketaan AINA ensin! Laske ensin sulut (${a} + ${b}) = ${sum}, ja kerro sitten: ${sum} × ${c} = ${answer}.`;
    } else if (type === 'brackets_sub') {
      const mode = Math.random() < 0.5 ? 'mult' : 'sub';

      if (mode === 'mult') {
        const a = this.randInt(2, 8);
        const c = this.randInt(2, 5);
        const b = c + this.randInt(2, 6);
        const diff = b - c;
        answer = a * diff;
        trap = (a * b) - c;
        question = `${a} × (${b} - ${c}) = ?`;
        hint = `Laskujärjestys: Sulkulauseke lasketaan ensin! Laske ensin sulut (${b} - ${c}) = ${diff}, ja kerro sitten: ${a} × ${diff} = ${answer}.`;
      } else {
        const b = this.randInt(4, 12);
        const c = this.randInt(3, 10);
        const sum = b + c;
        const a = sum + this.randInt(5, 30);
        answer = a - sum;
        trap = a - b + c;
        question = `${a} - (${b} + ${c}) = ?`;
        hint = `Laskujärjestys: Sulkulauseke lasketaan ensin! Laske sulut (${b} + ${c}) = ${sum}, ja vähennä sitten luvusta ${a}: ${a} - ${sum} = ${answer}.`;
      }
    } else {
      // kaksi tuloa: a * b + c * d
      const a = this.randInt(2, 6);
      const b = this.randInt(2, 6);
      const c = this.randInt(2, 6);
      const d = this.randInt(2, 5);
      const prod1 = a * b;
      const prod2 = c * d;
      answer = prod1 + prod2;
      trap = (prod1 + c) * d;
      question = `${a} × ${b} + ${c} × ${d} = ?`;
      hint = `Laskujärjestys: Kertolaskut lasketaan ensin! Laske ${a} × ${b} = ${prod1} ja ${c} × ${d} = ${prod2}, ja laske ne yhteen: ${prod1} + ${prod2} = ${answer}.`;
    }

    const optionsSet = new Set([answer]);
    if (trap !== answer && trap > 0) {
      optionsSet.add(trap);
    }
    while (optionsSet.size < 4) {
      const offset = this.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 10]);
      const cand = answer + offset;
      if (cand >= 0) optionsSet.add(cand);
    }

    return {
      topic: 'laskujarjestys',
      category: `Laskujärjestys (Taso ${level})`,
      question: question,
      answer: String(answer),
      options: this.shuffle(Array.from(optionsSet).map(String)),
      hint: hint,
      type: 'calc'
    };
  }

  // Generoi tehtävä aiheen mukaan
  generateByTopic(topicId, level = 1) {
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
        return this.generateMultiplication(level);
      case 'jakolaskut':
        return this.generateDivision(level);
      case 'murtoluvut':
        return this.generateFraction(level);
      case 'lukualue':
        return this.generateNumbersAndRounding(level);
      case 'mittaaminen':
        return this.generateMeasurement(level);
      case 'sanalliset':
        return this.generateWordProblem(level);
      case 'laskujarjestys':
        return this.generateOrderOfOperations(level);
      case 'sekoitus':
      default: {
        const generators = [
          () => this.generateMultiplication(level),
          () => this.generateDivision(level),
          () => this.generateFraction(level),
          () => this.generateNumbersAndRounding(level),
          () => this.generateMeasurement(level),
          () => this.generateWordProblem(level),
          () => this.generateOrderOfOperations(level)
        ];
        if (this.customQuestions.length > 0) {
          generators.push(() => this.generateByTopic('omat', level));
        }
        return this.pick(generators)();
      }
    }
  }

  // Generoi tehtävä kokeen aihealueiden perusteella
  generateByTopicList(topicList, levels = {}) {
    if (!topicList || !Array.isArray(topicList) || topicList.length === 0) {
      return this.generateByTopic('sekoitus', 1);
    }

    const generators = [];
    const text = topicList.join(' ').toLowerCase();

    if (text.includes('kerto')) generators.push(() => this.generateMultiplication(levels.kertolaskut || 1));
    if (text.includes('jako')) generators.push(() => this.generateDivision(levels.jakolaskut || 1));
    if (text.includes('murto')) generators.push(() => this.generateFraction(levels.murtoluvut || 1));
    if (text.includes('luku') || text.includes('pyöris') || text.includes('jono')) generators.push(() => this.generateNumbersAndRounding(levels.lukualue || 1));
    if (text.includes('mitta') || text.includes('piiri') || text.includes('kello') || text.includes('geometria')) generators.push(() => this.generateMeasurement(levels.mittaaminen || 1));
    if (text.includes('sanal')) generators.push(() => this.generateWordProblem(levels.sanalliset || 1));
    if (text.includes('järjestys') || text.includes('jarjestys') || text.includes('sulut') || text.includes('yhdistet')) {
      generators.push(() => this.generateOrderOfOperations(levels.laskujarjestys || 1));
    }

    if (this.customQuestions.length > 0) {
      generators.push(() => this.generateByTopic('omat', 1));
    }

    if (generators.length === 0) {
      return this.generateByTopic('sekoitus', 1);
    }

    return this.pick(generators)();
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
