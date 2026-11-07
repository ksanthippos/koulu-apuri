/**
 * Koulu-apuri: Pääsovellus ja tilanhallinta
 * Tallentaa kaiken paikallisesti selaimeen (localStorage).
 */
class KouluApuriApp {
  constructor() {
    this.state = this.loadState();
    this.currentSession = null;
    this.sessionIndex = 0;
    this.sessionCorrect = 0;
    this.isParentUnlocked = false;
    this.enteredPin = '';

    this.init();
  }

  // Oletustila, jos paikallista dataa ei vielä ole
  getDefaultState() {
    return {
      parentPin: '1234',
      profiili: {
        nimi: 'Oppilas',
        avatar: '🦊',
        xp: 0,
        taso: 1,
        kolikot: 0,
        streak: 1,
        viimeisinPelipaiva: new Date().toISOString().split('T')[0],
        paivanTreeniTehty: false
      },
      kokeet: [
        {
          id: 'esimerkki-koe-1',
          nimi: 'Matematiikan jakson koe',
          paivamaara: this.getRelativeDateString(10), // 10 päivän päästä
          aihealueet: ['Kertotaulut 6–9', 'Jakolaskut & jakojäännös', 'Murtoluvut'],
          tavoiteLaskujaPaivassa: 10
        }
      ],
      omatTehtavat: [],
      palkinnot: [
        { id: 'p1', nimi: 'Valitse leffaherkku 🍿', hinta: 250, lunastettu: false },
        { id: 'p2', nimi: '30 min vapaata peliaikaa 🎮', hinta: 500, lunastettu: false },
        { id: 'p3', nimi: 'Toiveruoka viikonloppuna 🍕', hinta: 800, lunastettu: false }
      ],
      saavutukset: {
        ensimmainenLasku: false,
        streak3: false,
        streak7: false,
        kertoassa: false,
        murtolukumestari: false,
        taso5: false
      },
      tilastot: {
        yhteensaLaskettu: 0,
        oikeinLaskettu: 0,
        aiheittain: {}
      }
    };
  }

  getRelativeDateString(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  loadState() {
    try {
      const saved = localStorage.getItem('kouluapuri_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.parentPin) {
          parsed.parentPin = '1234';
        }
        // Tarkistetaan streak päivittyneelle päivälle
        this.checkStreak(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Tilan lataus epäonnistui:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem('kouluapuri_state_v1', JSON.stringify(this.state));
    } catch (e) {
      console.error('Tilan tallennus epäonnistui:', e);
    }
  }

  checkStreak(state) {
    const today = new Date().toISOString().split('T')[0];
    const lastDay = state.profiili.viimeisinPelipaiva;

    if (lastDay !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDay === yesterdayStr) {
        // Pelattu eilen, putki jatkuu
      } else if (lastDay < yesterdayStr) {
        // Yli 1 päivä väliä, putki katkeaa
        state.profiili.streak = 1;
      }
      state.profiili.paivanTreeniTehty = false;
    }
  }

  init() {
    // Alustetaan matikkamoottorin omat tehtävät
    window.mathEngine.setCustomQuestions(this.state.omatTehtavat);

    this.bindEvents();
    this.renderDashboard();
    this.renderRewards();
    this.renderExams();

    // Kuunnellaan fyysistä näppäimistöä (esim. iPad Magic Keyboard)
    window.addEventListener('keydown', (e) => this.handlePhysicalKey(e));
  }

  // ==========================================
  // NAVIGOINTI JA NÄKYMÄT
  // ==========================================

  showView(viewId) {
    document.querySelectorAll('.view-screen').forEach((el) => {
      el.classList.remove('active');
    });
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
    }

    // Päivitetään alapalkin aktiivisuus
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.view === viewId);
    });

    window.sounds.playClick();
  }

  bindEvents() {
    // Alapalkin välilehdet
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        if (view === 'vanhemmat-view') {
          if (this.isParentUnlocked) {
            this.showView('vanhemmat-view');
            this.renderParentView();
          } else {
            this.openPinModal();
          }
        } else {
          this.showView(view);
        }
      });
    });

    // Pika-harjoittelupainikkeet etusivulla
    document.querySelectorAll('[data-start-topic]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const topic = e.currentTarget.dataset.startTopic;
        this.startExerciseSession(topic, 10);
      });
    });

    // Päivän treeni -nappi
    const dailyBtn = document.getElementById('btn-daily-workout');
    if (dailyBtn) {
      dailyBtn.addEventListener('click', () => {
        this.startExerciseSession('sekoitus', 10, true);
      });
    }

    // Numpad-painikkeet harjoitustilassa
    document.querySelectorAll('.numpad-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.val;
        this.handleNumpadInput(val);
      });
    });

    // Vastaa-painike
    const submitBtn = document.getElementById('btn-submit-answer');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitAnswer());
    }

    // Lopeta / palaa harjoituksesta
    const exitSessionBtn = document.getElementById('btn-exit-session');
    if (exitSessionBtn) {
      exitSessionBtn.addEventListener('click', () => {
        if (confirm('Haluatko keskeyttää harjoituksen? Edistymistä ei tallenneta tältä erää.')) {
          this.showView('koti-view');
        }
      });
    }

    // Äänet päälle/pois
    const soundToggle = document.getElementById('btn-toggle-sound');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const isEnabled = window.sounds.toggle();
        soundToggle.textContent = isEnabled ? '🔊' : '🔇';
      });
    }

    // PIN-koodin näppäimistötapahtumat
    document.querySelectorAll('#pin-numpad .pin-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const val = e.currentTarget.dataset.pin;
        this.handlePinInput(val);
      });
    });

    const cancelPinBtn = document.getElementById('btn-cancel-pin');
    if (cancelPinBtn) {
      cancelPinBtn.addEventListener('click', () => this.closePinModal());
    }

    // Vanhempien tilan lukitseminen
    const lockParentBtn = document.getElementById('btn-lock-parent-mode');
    if (lockParentBtn) {
      lockParentBtn.addEventListener('click', () => this.lockParentMode());
    }

    // Vanhempien tilan tapahtumat
    this.bindParentViewEvents();
  }

  // ==========================================
  // ETUSIVU & DASHBOARD
  // ==========================================

  renderDashboard() {
    const p = this.state.profiili;

    // Päivitetään taso ja XP
    p.taso = Math.floor(p.xp / 100) + 1;
    const currentLevelXP = p.xp % 100;

    const elName = document.getElementById('user-name');
    const elAvatar = document.getElementById('user-avatar');
    const elLevel = document.getElementById('user-level');
    const elXpText = document.getElementById('user-xp-text');
    const elXpBar = document.getElementById('user-xp-bar');
    const elStreak = document.getElementById('user-streak');
    const elCoins = document.getElementById('user-coins');

    if (elName) elName.textContent = p.nimi;
    if (elAvatar) elAvatar.textContent = p.avatar;
    if (elLevel) elLevel.textContent = `Taso ${p.taso} • ${this.getLevelTitle(p.taso)}`;
    if (elXpText) elXpText.textContent = `${currentLevelXP} / 100 XP seuraavalle tasolle`;
    if (elXpBar) elXpBar.style.width = `${currentLevelXP}%`;
    if (elStreak) elStreak.textContent = `🔥 ${p.streak} pv putki`;
    if (elCoins) elCoins.textContent = `⭐ ${p.kolikot}`;

    // Päivän treeni -kortti
    const dailyStatus = document.getElementById('daily-workout-status');
    const dailyBtn = document.getElementById('btn-daily-workout');
    if (dailyStatus && dailyBtn) {
      if (p.paivanTreeniTehty) {
        dailyStatus.textContent = '✅ Päivän treeni suoritettu! Voit jatkaa harjoittelua alla olevilla aiheilla.';
        dailyBtn.textContent = 'Harjoittele lisää (+XP)';
      } else {
        dailyStatus.textContent = '🎯 Tee päivän 10 laskun treeni ja ansaitse streak-bonus & tähtiä!';
        dailyBtn.textContent = 'Aloita päivän treeni (10 laskua)';
      }
    }

    // Kertausaikataulu ja tulevat kokeet
    this.renderExamRadar();
  }

  getLevelTitle(level) {
    const titles = [
      'Laskijanoorukki 🌱',
      'Numerohirmu 🐾',
      'Jakomestari ⚡',
      'Murtolukutaituri 🍰',
      'Matikkaraketti 🚀',
      'Päässälaskuhai 🦈',
      'Ongelmanratkaisijavelho 🧙‍♂️',
      'Kymppiluokan sankari 👑',
      'Superlaskija 🌟',
      'Matikkanero 🎓'
    ];
    return titles[Math.min(level - 1, titles.length - 1)];
  }

  renderExamRadar() {
    const container = document.getElementById('exam-radar-container');
    if (!container) return;

    if (!this.state.kokeet || this.state.kokeet.length === 0) {
      container.innerHTML = `
        <div class="empty-notice">
          Ei tulevia kokeita merkittynä. Vanhempi voi lisätä kokeen Vanhempien tilassa!
        </div>
      `;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Etsitään seuraava tuleva koe
    const sortedExams = [...this.state.kokeet]
      .map(k => {
        const examDate = new Date(k.paivamaara);
        examDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
        return { ...k, diffDays };
      })
      .filter(k => k.diffDays >= 0)
      .sort((a, b) => a.diffDays - b.diffDays);

    if (sortedExams.length === 0) {
      container.innerHTML = `<div class="empty-notice">Kaikki aiemmat kokeet on suoritettu! 🎉</div>`;
      return;
    }

    const nextExam = sortedExams[0];
    let badgeColor = 'bg-blue';
    let recommendation = '';

    if (nextExam.diffDays === 0) {
      badgeColor = 'bg-green';
      recommendation = '🚀 Tänään on koepäivä! Muista lukea tehtävät rauhassa ja uskoa itseesi!';
    } else if (nextExam.diffDays <= 2) {
      badgeColor = 'bg-red';
      recommendation = '⚡ Kenraaliharjoitus: Tee 10 laskun kokeen kaltainen simulaatio!';
    } else if (nextExam.diffDays <= 7) {
      badgeColor = 'bg-orange';
      recommendation = `📚 Kertausviikko: Harjoittele tänään aihetta: <strong>${nextExam.aihealueet[0] || 'Perusteet'}</strong>.`;
    } else {
      badgeColor = 'bg-blue';
      recommendation = `🌱 Hyvää aikaa kerrata: Ota tänään 5–10 laskua koealueelta.`;
    }

    container.innerHTML = `
      <div class="exam-card">
        <div class="exam-header">
          <div>
            <h3 class="exam-title">${nextExam.nimi}</h3>
            <span class="exam-date">📅 ${new Date(nextExam.paivamaara).toLocaleDateString('fi-FI')}</span>
          </div>
          <span class="exam-countdown ${badgeColor}">${nextExam.diffDays === 0 ? 'TÄNÄÄN!' : `${nextExam.diffDays} pv aikaa`}</span>
        </div>
        <div class="exam-topics">
          <strong>Koealue:</strong> ${nextExam.aihealueet.join(', ')}
        </div>
        <div class="exam-recommendation">
          ${recommendation}
        </div>
        <button class="btn btn-primary btn-sm" id="btn-start-exam-practice" style="margin-top: 10px;">
          Harjoittele tätä koetta varten 🎯
        </button>
      </div>
    `;

    const startBtn = document.getElementById('btn-start-exam-practice');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startExerciseSession('koe', nextExam.tavoiteLaskujaPaivassa || 10, false, nextExam);
      });
    }
  }

  // ==========================================
  // HARJOITTELUSYLI JA TEHTÄVIEN KULKU
  // ==========================================

  startExerciseSession(topic, count = 10, isDaily = false, examData = null) {
    this.currentSession = {
      topic: topic,
      examData: examData,
      totalCount: count,
      isDaily: isDaily,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      xpGained: 0,
      coinsGained: 0
    };

    // Luodaan sessiolle tehtäväpaketti
    for (let i = 0; i < count; i++) {
      if (examData && examData.aihealueet) {
        this.currentSession.questions.push(window.mathEngine.generateByTopicList(examData.aihealueet));
      } else {
        this.currentSession.questions.push(window.mathEngine.generateByTopic(topic));
      }
    }

    this.showView('harjoitus-view');
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    const s = this.currentSession;
    const q = s.questions[s.currentIndex];

    // Päivitetään edistymispalkki
    const progressText = document.getElementById('exercise-progress-text');
    const progressBar = document.getElementById('exercise-progress-bar');
    const categoryBadge = document.getElementById('exercise-category');
    const questionText = document.getElementById('exercise-question-text');
    const visualContainer = document.getElementById('exercise-visual');
    const inputDisplay = document.getElementById('exercise-answer-display');
    const hintBox = document.getElementById('exercise-hint-box');
    const choiceContainer = document.getElementById('exercise-choice-container');
    const numpadContainer = document.getElementById('exercise-numpad');

    progressText.textContent = `Kysymys ${s.currentIndex + 1} / ${s.totalCount}`;
    progressBar.style.width = `${((s.currentIndex) / s.totalCount) * 100}%`;
    categoryBadge.textContent = s.examData ? `🎯 ${s.examData.nimi}` : q.category;
    questionText.textContent = q.question;
    inputDisplay.value = '';
    hintBox.classList.add('hidden');
    hintBox.textContent = '';

    // Mahdollinen visuaalinen tuki (esim. murtoluvut)
    if (q.visual && q.visual.type === 'pie') {
      visualContainer.classList.remove('hidden');
      visualContainer.innerHTML = this.renderFractionSVG(q.visual.num, q.visual.den);
    } else {
      visualContainer.classList.add('hidden');
      visualContainer.innerHTML = '';
    }

    // Monivalinta vs. Numpad
    if (q.type === 'choice') {
      choiceContainer.classList.remove('hidden');
      numpadContainer.classList.add('hidden');
      inputDisplay.readOnly = true;

      choiceContainer.innerHTML = q.options.map(opt => `
        <button class="choice-btn" data-choice="${opt}">${opt}</button>
      `).join('');

      choiceContainer.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          inputDisplay.value = e.currentTarget.dataset.choice;
          this.submitAnswer();
        });
      });
    } else {
      choiceContainer.classList.add('hidden');
      numpadContainer.classList.remove('hidden');
      inputDisplay.readOnly = false;
    }
  }

  renderFractionSVG(num, den) {
    // Luodaan SVG-murtolukupiirakka
    const size = 120;
    const r = 50;
    const cx = 60;
    const cy = 60;

    let paths = '';
    for (let i = 0; i < den; i++) {
      const startAngle = (i * 2 * Math.PI) / den - Math.PI / 2;
      const endAngle = ((i + 1) * 2 * Math.PI) / den - Math.PI / 2;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
      const fill = i < num ? '#4F46E5' : '#E2E8F0';

      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${fill}" stroke="#ffffff" stroke-width="2" />`;
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;
  }

  handleNumpadInput(val) {
    const inputDisplay = document.getElementById('exercise-answer-display');
    if (!inputDisplay) return;

    window.sounds.playClick();

    if (val === 'DEL') {
      inputDisplay.value = inputDisplay.value.slice(0, -1);
    } else if (val === 'CLEAR') {
      inputDisplay.value = '';
    } else {
      if (inputDisplay.value.length < 12) {
        inputDisplay.value += val;
      }
    }
  }

  handlePhysicalKey(e) {
    // PIN-modaalin näppäimistötuki
    const pinModal = document.getElementById('pin-modal');
    if (pinModal && pinModal.classList.contains('active')) {
      if (e.key >= '0' && e.key <= '9') {
        this.handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        this.handlePinInput('DEL');
      } else if (e.key === 'Escape') {
        this.closePinModal();
      }
      return;
    }

    const harjoitusView = document.getElementById('harjoitus-view');
    if (!harjoitusView || !harjoitusView.classList.contains('active')) return;

    const inputDisplay = document.getElementById('exercise-answer-display');
    if (!inputDisplay) return;

    if (e.key >= '0' && e.key <= '9') {
      inputDisplay.value += e.key;
    } else if (e.key === 'Backspace') {
      inputDisplay.value = inputDisplay.value.slice(0, -1);
    } else if (e.key === 'Enter') {
      this.submitAnswer();
    } else if (e.key === ',' || e.key === '.' || e.key === '/' || e.key === ':') {
      inputDisplay.value += e.key;
    }
  }

  submitAnswer() {
    const s = this.currentSession;
    if (!s) return;

    const inputDisplay = document.getElementById('exercise-answer-display');
    const userVal = inputDisplay.value;
    if (!userVal) return;

    const q = s.questions[s.currentIndex];
    const isCorrect = window.mathEngine.checkAnswer(userVal, q.answer);

    // Kirjataan tilastot
    this.recordStats(q.topic, isCorrect);

    if (isCorrect) {
      window.sounds.playSuccess();
      window.confetti.launch(20);
      s.correctCount++;
      s.xpGained += 10;
      s.coinsGained += 1;

      this.showFeedbackModal(true, 'Mahtavaa! Oikein meni! ⭐ +10 XP', q.hint, () => {
        this.nextQuestion();
      });
    } else {
      window.sounds.playWrong();
      this.showFeedbackModal(false, `Hups! Oikea vastaus oli: <strong>${q.answer}</strong>`, q.hint, () => {
        this.nextQuestion();
      });
    }
  }

  nextQuestion() {
    const s = this.currentSession;
    s.currentIndex++;

    if (s.currentIndex >= s.totalCount) {
      this.finishSession();
    } else {
      this.renderCurrentQuestion();
    }
  }

  showFeedbackModal(isSuccess, message, hint, onContinue) {
    const modal = document.getElementById('feedback-modal');
    const content = document.getElementById('feedback-content');
    const nextBtn = document.getElementById('feedback-next-btn');

    content.innerHTML = `
      <div class="feedback-icon">${isSuccess ? '🎉' : '💡'}</div>
      <div class="feedback-msg ${isSuccess ? 'success' : 'error'}">${message}</div>
      ${hint ? `<div class="feedback-hint">${hint}</div>` : ''}
    `;

    modal.classList.add('active');

    const handleNext = () => {
      modal.classList.remove('active');
      nextBtn.removeEventListener('click', handleNext);
      onContinue();
    };

    nextBtn.addEventListener('click', handleNext);
  }

  finishSession() {
    const s = this.currentSession;
    const p = this.state.profiili;

    // Tallennetaan XP ja tähdet
    p.xp += s.xpGained;
    p.kolikot += s.coinsGained;

    // Päivän treeni bonus
    if (s.isDaily && !p.paivanTreeniTehty) {
      p.paivanTreeniTehty = true;
      p.streak += 1;
      p.viimeisinPelipaiva = new Date().toISOString().split('T')[0];
      p.xp += 25; // Bonus
      p.kolikot += 5;
    }

    // Saavutusten tarkistus
    this.checkBadges();

    this.saveState();
    window.sounds.playLevelUp();
    window.confetti.launch(80);

    // Näytetään yhteenvetonäkymä
    this.showSessionSummary(s);
  }

  showSessionSummary(s) {
    const modal = document.getElementById('summary-modal');
    const scoreText = document.getElementById('summary-score');
    const xpText = document.getElementById('summary-xp');
    const starsText = document.getElementById('summary-stars');
    const closeBtn = document.getElementById('summary-close-btn');

    scoreText.textContent = `${s.correctCount} / ${s.totalCount} oikein!`;
    xpText.textContent = `+${s.xpGained} XP`;
    starsText.textContent = `+${s.coinsGained} Tähteä`;

    modal.classList.add('active');

    closeBtn.onclick = () => {
      modal.classList.remove('active');
      this.showView('koti-view');
      this.renderDashboard();
      this.renderRewards();
    };
  }

  recordStats(topic, isCorrect) {
    const stats = this.state.tilastot;
    stats.yhteensaLaskettu++;
    if (isCorrect) stats.oikeinLaskettu++;

    if (!stats.aiheittain[topic]) {
      stats.aiheittain[topic] = { total: 0, correct: 0 };
    }
    stats.aiheittain[topic].total++;
    if (isCorrect) stats.aiheittain[topic].correct++;

    this.saveState();
  }

  checkBadges() {
    const s = this.state.saavutukset;
    const p = this.state.profiili;
    const stats = this.state.tilastot;

    if (stats.yhteensaLaskettu >= 1) s.ensimmainenLasku = true;
    if (p.streak >= 3) s.streak3 = true;
    if (p.streak >= 7) s.streak7 = true;
    if (p.taso >= 5) s.taso5 = true;
    if (stats.aiheittain['kertolasku'] && stats.aiheittain['kertolasku'].correct >= 20) s.kertoassa = true;
    if (stats.aiheittain['murtoluvut'] && stats.aiheittain['murtoluvut'].correct >= 10) s.murtolukumestari = true;

    this.saveState();
  }

  // ==========================================
  // PALKINNOT & SAAVUTUSSEINÄ
  // ==========================================

  renderRewards() {
    const container = document.getElementById('rewards-list-container');
    const badgesContainer = document.getElementById('badges-container');
    if (!container || !badgesContainer) return;

    // Omat palkinnot
    container.innerHTML = this.state.palkinnot.map(item => `
      <div class="reward-card ${item.lunastettu ? 'redeemed' : ''}">
        <div class="reward-info">
          <h4>${item.nimi}</h4>
          <span class="reward-cost">⭐ ${item.hinta} tähteä</span>
        </div>
        <button class="btn btn-sm ${item.lunastettu ? 'btn-secondary' : 'btn-success'} btn-redeem" 
                data-id="${item.id}" 
                ${item.lunastettu || this.state.profiili.kolikot < item.hinta ? 'disabled' : ''}>
          ${item.lunastettu ? 'Lunastettu ✔' : 'Lunasta'}
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-redeem').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.redeemReward(id);
      });
    });

    // Mitalit / Saavutukset
    const badges = [
      { key: 'ensimmainenLasku', title: 'Ensimmäinen lasku', desc: 'Ratkaise 1 tehtävä', icon: '🌱' },
      { key: 'streak3', title: 'Tulessa!', desc: '3 päivän harjoitteluputki', icon: '🔥' },
      { key: 'streak7', title: 'Viikkomestari', desc: '7 päivän harjoitteluputki', icon: '👑' },
      { key: 'kertoassa', title: 'Kertotauluässä', desc: '20 oikeaa kertolaskua', icon: '⚡' },
      { key: 'murtolukumestari', title: 'Murtolukutaituri', desc: '10 oikeaa murtolukua', icon: '🍰' },
      { key: 'taso5', title: 'Taso 5 saavutettu', desc: 'Nouse tasolle 5', icon: '🚀' }
    ];

    badgesContainer.innerHTML = badges.map(b => {
      const unlocked = this.state.saavutukset[b.key];
      return `
        <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon">${b.icon}</div>
          <div class="badge-title">${b.title}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>
      `;
    }).join('');
  }

  redeemReward(id) {
    const item = this.state.palkinnot.find(p => p.id === id);
    if (!item || item.lunastettu) return;

    if (this.state.profiili.kolikot >= item.hinta) {
      this.state.profiili.kolikot -= item.hinta;
      item.lunastettu = true;
      this.saveState();
      window.sounds.playLevelUp();
      window.confetti.launch(50);
      alert(`Onnittelut! Lunastit palkinnon: "${item.nimi}". Näytä tämä vanhemmalle! 🎁`);
      this.renderDashboard();
      this.renderRewards();
    }
  }

  // ==========================================
  // VANHEMPIEN TILA & PIN-HALLINTA
  // ==========================================

  openPinModal() {
    this.enteredPin = '';
    this.updatePinDots();
    const errorMsg = document.getElementById('pin-error-msg');
    if (errorMsg) errorMsg.textContent = '';
    const modal = document.getElementById('pin-modal');
    if (modal) modal.classList.add('active');
  }

  closePinModal() {
    const modal = document.getElementById('pin-modal');
    if (modal) modal.classList.remove('active');
    this.enteredPin = '';
    this.updatePinDots();
  }

  handlePinInput(val) {
    window.sounds.playClick();
    const errorMsg = document.getElementById('pin-error-msg');
    if (errorMsg) errorMsg.textContent = '';

    if (val === 'DEL') {
      this.enteredPin = this.enteredPin.slice(0, -1);
      this.updatePinDots();
    } else if (val === 'CLEAR') {
      this.enteredPin = '';
      this.updatePinDots();
    } else if (val >= '0' && val <= '9') {
      if (this.enteredPin.length < 4) {
        this.enteredPin += val;
        this.updatePinDots();

        if (this.enteredPin.length === 4) {
          setTimeout(() => this.verifyPin(), 120);
        }
      }
    }
  }

  updatePinDots() {
    const dots = document.querySelectorAll('#pin-dots .pin-dot');
    dots.forEach((dot, index) => {
      if (index < this.enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  verifyPin() {
    const targetPin = this.state.parentPin || '1234';
    if (this.enteredPin === targetPin) {
      window.sounds.playSuccess();
      this.isParentUnlocked = true;
      this.closePinModal();
      this.showView('vanhemmat-view');
      this.renderParentView();
    } else {
      window.sounds.playWrong();
      const dotsContainer = document.getElementById('pin-dots');
      const errorMsg = document.getElementById('pin-error-msg');
      if (errorMsg) errorMsg.textContent = 'Väärä PIN-koodi. Yritä uudelleen.';
      if (dotsContainer) {
        dotsContainer.classList.add('shake');
        setTimeout(() => {
          dotsContainer.classList.remove('shake');
          this.enteredPin = '';
          this.updatePinDots();
        }, 400);
      } else {
        this.enteredPin = '';
        this.updatePinDots();
      }
    }
  }

  lockParentMode() {
    this.isParentUnlocked = false;
    window.sounds.playClick();
    this.showView('koti-view');
  }

  renderParentView() {
    // Asetetaan koepäivämäärän minimipäiväksi tämä päivä
    const dateInput = document.getElementById('input-exam-date');
    if (dateInput && !dateInput.min) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    this.renderParentExamsList();
    this.renderParentAnalytics();
    this.renderParentRewardsList();
  }

  resetExamForm() {
    const form = document.getElementById('form-add-exam');
    if (form) form.reset();
    const idInput = document.getElementById('input-exam-id');
    if (idInput) idInput.value = '';
    const titleEl = document.getElementById('exam-form-title');
    if (titleEl) titleEl.textContent = '📅 Lisää tuleva koe';
    const saveBtn = document.getElementById('btn-save-exam');
    if (saveBtn) saveBtn.textContent = 'Tallenna koe kalenteriin';
    const cancelBtn = document.getElementById('btn-cancel-edit-exam');
    if (cancelBtn) cancelBtn.classList.add('hidden');
    document.querySelectorAll('#exam-topic-chips .topic-chip').forEach(c => c.classList.remove('selected'));
  }

  editExam(id) {
    const exam = this.state.kokeet.find(k => k.id === id);
    if (!exam) return;

    const idInput = document.getElementById('input-exam-id');
    const nameInput = document.getElementById('input-exam-name');
    const dateInput = document.getElementById('input-exam-date');
    const topicsInput = document.getElementById('input-exam-topics');
    const titleEl = document.getElementById('exam-form-title');
    const saveBtn = document.getElementById('btn-save-exam');
    const cancelBtn = document.getElementById('btn-cancel-edit-exam');

    if (idInput) idInput.value = exam.id;
    if (nameInput) nameInput.value = exam.nimi;
    if (dateInput) dateInput.value = exam.paivamaara;
    if (topicsInput) topicsInput.value = exam.aihealueet.join(', ');
    if (titleEl) titleEl.textContent = '✏️ Muokkaa koetta';
    if (saveBtn) saveBtn.textContent = 'Päivitä kokeen tiedot';
    if (cancelBtn) cancelBtn.classList.remove('hidden');

    // Korostetaan valitut aiheet
    const currentTopics = exam.aihealueet.map(t => t.toLowerCase());
    document.querySelectorAll('#exam-topic-chips .topic-chip').forEach(c => {
      c.classList.toggle('selected', currentTopics.includes(c.dataset.topic.toLowerCase()));
    });

    // Vieritys lomakkeeseen
    const form = document.getElementById('form-add-exam');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (nameInput) nameInput.focus();
    }
  }

  bindParentViewEvents() {
    // Aihe-pikavalintojen klikkaukset
    const topicsInput = document.getElementById('input-exam-topics');
    const chips = document.querySelectorAll('#exam-topic-chips .topic-chip');

    const syncChipsWithInput = () => {
      if (!topicsInput) return;
      const current = topicsInput.value
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      chips.forEach(chip => {
        const t = chip.dataset.topic.toLowerCase();
        chip.classList.toggle('selected', current.includes(t));
      });
    };

    if (topicsInput) {
      topicsInput.addEventListener('input', syncChipsWithInput);
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (!topicsInput) return;
        const topic = chip.dataset.topic;
        const list = topicsInput.value
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);

        const foundIndex = list.findIndex(t => t.toLowerCase() === topic.toLowerCase());
        if (foundIndex >= 0) {
          list.splice(foundIndex, 1);
        } else {
          list.push(topic);
        }

        topicsInput.value = list.join(', ');
        syncChipsWithInput();
      });
    });

    // Peruuta muokkaus -painike
    const cancelEditBtn = document.getElementById('btn-cancel-edit-exam');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => this.resetExamForm());
    }

    // Lisää tai muokkaa koe -lomake
    const addExamForm = document.getElementById('form-add-exam');
    if (addExamForm) {
      addExamForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const examId = document.getElementById('input-exam-id').value;
        const nimi = document.getElementById('input-exam-name').value.trim();
        const date = document.getElementById('input-exam-date').value;
        const topics = document.getElementById('input-exam-topics').value
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);

        if (!nimi || !date) return;

        const examTopics = topics.length > 0 ? topics : ['Yleinen kertaus'];

        if (examId) {
          // Muokkaus
          const existingIndex = this.state.kokeet.findIndex(k => k.id === examId);
          if (existingIndex >= 0) {
            this.state.kokeet[existingIndex].nimi = nimi;
            this.state.kokeet[existingIndex].paivamaara = date;
            this.state.kokeet[existingIndex].aihealueet = examTopics;
          }
        } else {
          // Uusi koe
          this.state.kokeet.push({
            id: 'koe-' + Date.now(),
            nimi: nimi,
            paivamaara: date,
            aihealueet: examTopics,
            tavoiteLaskujaPaivassa: 10
          });
        }

        this.saveState();
        this.resetExamForm();
        this.renderParentExamsList();
        this.renderDashboard();
        window.sounds.playSuccess();
      });
    }

    // PIN-koodin vaihto -lomake
    const changePinForm = document.getElementById('form-change-pin');
    if (changePinForm) {
      changePinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currPin = document.getElementById('input-current-pin').value.trim();
        const newPin = document.getElementById('input-new-pin').value.trim();
        const confPin = document.getElementById('input-confirm-pin').value.trim();
        const status = document.getElementById('pin-change-status');

        const activePin = this.state.parentPin || '1234';

        if (currPin !== activePin) {
          status.style.color = 'var(--danger)';
          status.textContent = '❌ Nykyinen PIN-koodi on väärin!';
          return;
        }

        if (!/^\d{4}$/.test(newPin)) {
          status.style.color = 'var(--danger)';
          status.textContent = '❌ Uuden PIN-koodin tulee olla tarkalleen 4 numeroa!';
          return;
        }

        if (newPin !== confPin) {
          status.style.color = 'var(--danger)';
          status.textContent = '❌ Uudet PIN-koodit eivät täsmää!';
          return;
        }

        this.state.parentPin = newPin;
        this.saveState();
        window.sounds.playSuccess();
        status.style.color = 'var(--success)';
        status.textContent = '✅ PIN-koodi vaihdettu onnistuneesti!';
        changePinForm.reset();
        setTimeout(() => {
          if (status) status.textContent = '';
        }, 3500);
      });
    }

    // JSON Tuonti
    const jsonInput = document.getElementById('input-import-json');
    if (jsonInput) {
      jsonInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.kokeet && Array.isArray(data.kokeet)) {
              this.state.kokeet = [...this.state.kokeet, ...data.kokeet];
            }
            if (data.omatTehtavat && Array.isArray(data.omatTehtavat)) {
              this.state.omatTehtavat = [...this.state.omatTehtavat, ...data.omatTehtavat];
              window.mathEngine.setCustomQuestions(this.state.omatTehtavat);
            }
            if (data.palkinnot && Array.isArray(data.palkinnot)) {
              this.state.palkinnot = [...this.state.palkinnot, ...data.palkinnot];
            }
            this.saveState();
            this.renderParentView();
            this.renderDashboard();
            alert('Tiedot tuotu onnistuneesti! Tehtävät ja kokeet tallennettu laitteelle.');
          } catch (err) {
            alert('Tiedoston lukeminen epäonnistui. Tarkista JSON-muoto.');
          }
        };
        reader.readAsText(file);
      });
    }

    // JSON Vienti
    const exportBtn = document.getElementById('btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', 'koulu-apuri-backup.json');
        dlAnchor.click();
      });
    }

    // Nollaa edistyminen
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Haluatko varmasti nollata lapsen suoritushistorian ja aloittaa alusta?')) {
          this.state = this.getDefaultState();
          this.saveState();
          this.renderDashboard();
          this.renderParentView();
          alert('Tiedot nollattu.');
        }
      });
    }
  }

  renderParentExamsList() {
    const container = document.getElementById('parent-exams-list');
    if (!container) return;

    if (this.state.kokeet.length === 0) {
      container.innerHTML = '<p class="text-muted">Ei lisättyjä kokeita. Lisää ensimmäinen koe yllä olevalla lomakkeella!</p>';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Lajitellaan kokeet päivämäärän mukaan
    const sorted = [...this.state.kokeet].sort((a, b) => new Date(a.paivamaara) - new Date(b.paivamaara));

    container.innerHTML = sorted.map(k => {
      const examDate = new Date(k.paivamaara);
      examDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

      let badgeHtml = '';
      if (diffDays < 0) {
        badgeHtml = `<span class="status-badge" style="background: #E2E8F0; color: #64748B; font-size: 11px;">Menneisyydessä</span>`;
      } else if (diffDays === 0) {
        badgeHtml = `<span class="status-badge bg-green" style="font-size: 11px;">TÄNÄÄN!</span>`;
      } else if (diffDays <= 2) {
        badgeHtml = `<span class="status-badge bg-red" style="font-size: 11px;">${diffDays} pv aikaa</span>`;
      } else {
        badgeHtml = `<span class="status-badge bg-blue" style="font-size: 11px;">${diffDays} pv aikaa</span>`;
      }

      return `
        <div class="exam-list-item">
          <div class="exam-item-details">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
              <strong>${k.nimi}</strong>
              ${badgeHtml}
            </div>
            <div class="text-sm text-muted">
              📅 ${new Date(k.paivamaara).toLocaleDateString('fi-FI')} • Aiheet: ${k.aihealueet.join(', ')}
            </div>
          </div>
          <div class="exam-item-actions">
            <button class="btn btn-secondary btn-xs btn-edit-exam" data-id="${k.id}">✏️ Muokkaa</button>
            <button class="btn btn-danger btn-xs btn-delete-exam" data-id="${k.id}">🗑️ Poista</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-edit-exam').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.editExam(id);
      });
    });

    container.querySelectorAll('.btn-delete-exam').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Haluatko varmasti poistaa tämän kokeen?')) {
          this.state.kokeet = this.state.kokeet.filter(k => k.id !== id);
          this.saveState();
          this.renderParentExamsList();
          this.renderDashboard();
        }
      });
    });
  }

  renderParentAnalytics() {
    const container = document.getElementById('parent-analytics-container');
    if (!container) return;

    const stats = this.state.tilastot;
    const accuracy = stats.yhteensaLaskettu > 0 
      ? Math.round((stats.oikeinLaskettu / stats.yhteensaLaskettu) * 100) 
      : 0;

    let topicsHtml = '';
    for (const [topic, data] of Object.entries(stats.aiheittain)) {
      const topicAcc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      topicsHtml += `
        <div class="stat-row">
          <span>${topic.toUpperCase()}</span>
          <span>${data.correct}/${data.total} oikein (${topicAcc}%)</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="stats-overview">
        <div class="stat-box">
          <div class="stat-num">${stats.yhteensaLaskettu}</div>
          <div class="stat-label">Tehtyjä laskuja</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${accuracy}%</div>
          <div class="stat-label">Osumatarkkuus</div>
        </div>
      </div>
      <div class="topic-stats-list">
        ${topicsHtml || '<p class="text-muted">Ei vielä riittävästi suorituksia tilastoihin.</p>'}
      </div>
    `;
  }

  renderParentRewardsList() {
    const container = document.getElementById('parent-rewards-admin');
    if (!container) return;

    container.innerHTML = this.state.palkinnot.map(r => `
      <div class="reward-admin-row">
        <span>${r.nimi} (⭐ ${r.hinta})</span>
        <button class="btn btn-xs ${r.lunastettu ? 'btn-warning' : 'btn-secondary'} btn-toggle-redeem" data-id="${r.id}">
          ${r.lunastettu ? 'Merkkaa käyttämättömäksi' : 'Käytetty'}
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-toggle-redeem').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.state.palkinnot.find(p => p.id === id);
        if (item) {
          item.lunastettu = !item.lunastettu;
          this.saveState();
          this.renderParentRewardsList();
          this.renderRewards();
        }
      });
    });
  }

  renderExams() {
    this.renderExamRadar();
  }
}

// Käynnistetään sovellus kun DOM on ladattu
window.addEventListener('DOMContentLoaded', () => {
  window.app = new KouluApuriApp();

  // Rekisteröidään Service Worker PWA-toiminnallisuutta varten
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker rekisteröity:', reg.scope))
      .catch((err) => console.warn('Service Worker rekisteröinti epäonnistui:', err));
  }
});
