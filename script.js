// Minimal site script: menu toggle, smooth scroll, theme toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const navList = document.getElementById('nav-list');
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  if (menuBtn && navList) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });

    // close menu when a link is clicked
    navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navList.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Theme toggle (light/dark) persisted in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

  function updateThemeButton() {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      updateThemeButton();
    });
    updateThemeButton();
  }

  const translations = {
    en: {
      title: 'Akshay — Portfolio',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.contact': 'Contact',
      'hero.title': "Hi, I'm Akshay",
      'hero.lead': 'Bilingual global professional with an IIT postgraduate background and 4+ years of experience across manufacturing, engineering, and international business operations in Japan.',
      'hero.learn_more': 'Learn more',
      'hero.location_title': 'Location',
      'hero.location_value': 'Fukuoka, Japan',
      'hero.specialties_title': 'Specialties',
      'hero.specialties_value': 'Project Coordination · Data Analysis · Japanese (JLPT N2) · International Business',
      'about.title': 'About',
      'about.intro': 'Bilingual global professional with an IIT postgraduate background and 4+ years of experience across manufacturing, engineering, and international business operations in Japan. Experienced in coordinating cross-functional teams, managing overseas projects, and supporting data-driven decisions with focus on quality, cost, and delivery.',
      'about.background_title': 'Education',
      'about.background_text': 'M.Tech in Materials Science and Engineering from IIT Gandhinagar (CPI 8.38/10, 2018-20). B.Tech in Production Engineering from Uttarakhand Technical University (76.45%, 2014-18). Strong foundation in data-driven experimentation and technical analysis.',
      'about.approach_title': 'Focus Areas',
      'about.approach_text': 'Bridging technical and business functions through effective cross-cultural communication. Skilled in process improvement, project coordination, and data-driven decision support. Fluent in Japanese (JLPT N2), English, and Hindi with experience working in multicultural teams.',
      'experience.title': 'Experience',
      'experience.item1.title': 'International Sales Engineer',
      'experience.item1.date': 'Kuken Industries, Fukuoka · 2024 – Present',
      'experience.item1.text': 'Manages overseas projects, coordinating between customers, engineering, and production teams across global markets',
      'experience.item2.title': 'Production Engineer',
      'experience.item2.date': 'Kuken Industries, Miyawaka · 2022 – 2024',
      'experience.item2.text': 'Supported component design and production processes, ensuring quality and consistency across manufacturing operations',
      'experience.item3.title': 'Postgraduate Researcher',
      'experience.item3.date': 'IIT Gandhinagar · 2020 – 2021',
      'experience.item3.text': 'Conducted data-driven experiments and applied statistical analysis for performance evaluation in materials science',
      'skills.title': 'Skills',
      'skills.list.1': 'Project Coordination & Stakeholder Alignment',
      'skills.list.2': 'Data Analysis & Excel (Advanced)',
      'skills.list.3': 'Japanese (JLPT N2) · English · Hindi',
      'skills.list.4': 'Python, AutoCAD, SolidWorks',
      'skills.list.5': 'Process Improvement & Quality Management',
      'projects.title': 'Projects',
      'projects.card1.title': 'Portfolio Refresh',
      'projects.card1.text': 'A clear, responsive personal website to share my story, skills, and contact information.',
      'projects.card2.title': 'Sales Support Toolkit',
      'projects.card2.text': 'Documentation and process templates to streamline communication between Japanese technical teams and overseas customers.',
      'contact.title': 'Contact',
      'contact.line1': 'Reach out to discuss collaborations, website work, or international sales opportunities.',
      'footer.copyright': '© 2026 Akshay'
    },
    ja: {
      title: 'Akshay — ポートフォリオ',
      'nav.home': 'ホーム',
      'nav.about': '自己紹介',
      'nav.projects': 'プロジェクト',
      'nav.contact': '連絡先',
      'hero.title': 'こんにちは、アクシャイです',
      'hero.lead': 'IIT大学院の背景と、日本での製造・エンジニアリング・国際ビジネス分野における4年以上の経験を持つバイリンガル・グローバル・プロフェッショナル。',
      'hero.learn_more': 'もっと見る',
      'hero.location_title': '場所',
      'hero.location_value': '日本・福岡',
      'hero.specialties_title': '得意分野',
      'hero.specialties_value': 'プロジェクト調整 · データ分析 · 日本語（JLPT N2） · 国際ビジネス',
      'about.title': '自己紹介',
      'about.intro': 'IIT Gandhinagarの大学院背景と、日本での製造・エンジニアリング・国際ビジネス分野における4年以上の経験を有するバイリンガル・グローバル・プロフェッショナル。クロスファンクショナルチームの調整、海外プロジェクト管理、品質・コスト・納期（QCD）に焦点を当てたデータ駆動型の意思決定支援に精通。',
      'about.background_title': '学歴',
      'about.background_text': 'IIT Gandhinagar材料科学・工学修士（CPI 8.38/10、2018-20年）。Uttarakhand Technical University生産エンジニアリング学士（76.45%、2014-18年）。データ駆動型実験と技術分析の強固な基礎を持つ。',
      'about.approach_title': '重点分野',
      'about.approach_text': '効果的な異文化コミュニケーションを通じた技術とビジネス機能のブリッジング。プロセス改善、プロジェクト調整、データ駆動型意思決定支援に精通。JLPT N2の日本語、英語、ヒンディー語に精通し、多文化チームでの豊富な経験を有する。',
      'experience.title': '経歴',
      'experience.item1.title': '国際営業エンジニア',
      'experience.item1.date': 'Kuken Industries, 福岡 · 2024 – 現在',
      'experience.item1.text': 'グローバル市場の顧客、エンジニアリング、製造チーム間の海外プロジェクト管理を調整',
      'experience.item2.title': '製造エンジニア',
      'experience.item2.date': 'Kuken Industries, 宮若 · 2022 – 2024',
      'experience.item2.text': '部品設計と製造プロセスのサポート、品質と一貫性の確保',
      'experience.item3.title': '大学院研究員',
      'experience.item3.date': 'IIT Gandhinagar · 2020 – 2021',
      'experience.item3.text': 'データ駆動型実験の実施と材料科学における性能評価の統計分析を適用',
      'skills.title': 'スキル',
      'skills.list.1': 'プロジェクト調整・ステークホルダー調整',
      'skills.list.2': 'データ分析・Excel（上級）',
      'skills.list.3': '日本語（JLPT N2）・英語・ヒンディー語',
      'skills.list.4': 'Python, AutoCAD, SolidWorks',
      'skills.list.5': 'プロセス改善・品質管理',
      'projects.title': 'プロジェクト',
      'projects.card1.title': 'ポートフォリオ刷新',
      'projects.card1.text': 'ストーリー、スキル、連絡先を伝える明確でレスポンシブなパーソナルサイト。',
      'projects.card2.title': 'セールス支援ツールキット',
      'projects.card2.text': '日本の技術チームと海外顧客のコミュニケーションを効率化するドキュメントとプロセステンプレート。',
      'contact.title': '連絡',
      'contact.line1': 'コラボ、ウェブ制作、国際営業のご相談はお気軽にどうぞ。',
      'footer.copyright': '© 2026 Akshay'
    }
  };

  const languageSelect = document.getElementById('language-select');

  function translatePage(language) {
    const dictionary = translations[language] || translations.en;
    document.documentElement.lang = language;
    document.title = dictionary.title;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });
    if (languageSelect) {
      languageSelect.value = language;
    }
  }

  function setLanguage(language) {
    const nextLanguage = translations[language] ? language : 'en';
    localStorage.setItem('site-language', nextLanguage);
    translatePage(nextLanguage);
  }

  const savedLanguage = localStorage.getItem('site-language');
  const defaultLanguage = savedLanguage || (navigator.language.startsWith('ja') ? 'ja' : 'en');
  setLanguage(defaultLanguage);

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });
  }

  const scrollTargets = [
    ...document.querySelectorAll('.hero, .section-section, .hero-card, .project-card, .experience-list > li, .skills-list li, .connect-card')
  ];

  scrollTargets.forEach((target, index) => {
    target.classList.add('reveal-item');

    if (target.matches('.project-card, .experience-list > li, .connect-card')) {
      target.classList.add('reveal-left');
    }

    if (target.matches('.experience-list > li')) {
      const itemIndex = Array.from(target.parentElement.children).indexOf(target);
      target.style.setProperty('--delay', `${itemIndex * 0.08}s`);
    } else if (target.matches('.project-card, .connect-card, .hero-card, .skills-list li')) {
      const itemIndex = Array.from(target.parentElement.children).indexOf(target);
      target.style.setProperty('--delay', `${itemIndex * 0.06}s`);
    }
  });

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  scrollTargets.forEach(target => scrollObserver.observe(target));

  // Chat widget logic
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  const chatSections = Array.from(document.querySelectorAll('main section')).map(section => {
    const title = section.querySelector('h2')?.textContent?.trim() || section.id;
    const text = Array.from(section.querySelectorAll('h2, h3, p, li')).map(el => el.textContent.trim()).join(' ');
    return { id: section.id, title, text };
  });

  function appendChatMessage(text, sender = 'bot') {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${sender}`;
    const message = document.createElement('div');
    message.className = 'chat-message-text';
    message.textContent = text;
    wrapper.appendChild(message);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function summarizeSection(section) {
    const short = section.text.replace(/\s+/g, ' ').trim();
    return short.length > 320 ? `${short.slice(0, 320).trim()}...` : short;
  }

  function getBestReply(query) {
    const normalized = query.toLowerCase();
    if (/about|background|profile|story|approach/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'about');
      return section ? summarizeSection(section) : null;
    }
    if (/experience|work|job|department|research|role/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'experience');
      return section ? summarizeSection(section) : null;
    }
    if (/skill|skills|ability|strength/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'skills');
      return section ? summarizeSection(section) : null;
    }
    if (/project|portfolio|toolkit/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'projects');
      return section ? summarizeSection(section) : null;
    }
    if (/contact|email|reach|collaboration|opportunity/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'contact');
      return section ? summarizeSection(section) : null;
    }
    if (/location|where|based/.test(normalized)) {
      const hero = chatSections.find(item => item.id === 'hero');
      return hero ? summarizeSection(hero) : null;
    }

    const matches = chatSections.filter(item => item.text.toLowerCase().includes(normalized));
    if (matches.length > 0) {
      return summarizeSection(matches[0]);
    }
    return null;
  }

  function handleChatSubmit(event) {
    event.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;
    appendChatMessage(userText, 'user');
    chatInput.value = '';

    const reply = getBestReply(userText) || 'I could not find a clear answer in the page details. Try asking about Akshay’s background, experience, skills, or contact information.';
    setTimeout(() => appendChatMessage(reply, 'bot'), 250);
  }

  if (chatToggle && chatPanel && chatClose && chatForm && chatInput && chatMessages) {
    chatToggle.addEventListener('click', () => {
      chatPanel.classList.toggle('open');
      if (chatPanel.classList.contains('open')) {
        chatInput.focus();
      }
    });

    chatClose.addEventListener('click', () => {
      chatPanel.classList.remove('open');
    });

    chatForm.addEventListener('submit', handleChatSubmit);
  }
});
