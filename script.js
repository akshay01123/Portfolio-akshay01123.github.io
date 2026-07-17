// Minimal site script: menu toggle, smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const navList = document.getElementById('nav-list');

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

  function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const lines = [
      'International Sales Engineer',
      'Mechanical Engineer',
      'AI Engineer (Learning)',
      'Japanese Speaker'
    ];

    let currentLine = 0;
    let currentChar = 0;
    let deleting = false;

    function type() {
      const text = lines[currentLine];
      typewriterElement.textContent = text.slice(0, currentChar);

      if (!deleting && currentChar < text.length) {
        currentChar += 1;
        setTimeout(type, 90);
      } else if (!deleting) {
        deleting = true;
        setTimeout(type, 1400);
      } else if (deleting && currentChar > 0) {
        currentChar -= 1;
        setTimeout(type, 45);
      } else {
        deleting = false;
        currentLine = (currentLine + 1) % lines.length;
        setTimeout(type, 250);
      }
    }

    type();
  }

  initTypewriter();

  // Initialize visitor counter
  function initVisitorCounter() {
    const visitorCount = document.getElementById('visitor-count');
    if (!visitorCount) return;

    let count = parseInt(localStorage.getItem('visitorCount') || '0');
    count += 1;
    localStorage.setItem('visitorCount', count);
    visitorCount.textContent = count.toLocaleString();
  }

  initVisitorCounter();

  const githubUsername = 'akshay01123';

  function formatUtcDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function calculateStreaks(contributions) {
    const oneDayMs = 24 * 60 * 60 * 1000;
    const activeDates = contributions
      .filter(item => Number(item.count) > 0 && item.date)
      .map(item => item.date)
      .sort((first, second) => first.localeCompare(second));

    if (activeDates.length === 0) {
      return { current: 0, longest: 0 };
    }

    const activeDateSet = new Set(activeDates);

    let longest = 0;
    let running = 0;
    let previousDate = null;

    activeDates.forEach(dateString => {
      const currentDate = new Date(`${dateString}T00:00:00Z`);
      if (!previousDate) {
        running = 1;
      } else {
        const diff = currentDate.getTime() - previousDate.getTime();
        running = diff === oneDayMs ? running + 1 : 1;
      }
      if (running > longest) longest = running;
      previousDate = currentDate;
    });

    let current = 0;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let cursor = new Date(today);

    if (!activeDateSet.has(formatUtcDate(cursor))) {
      cursor = new Date(cursor.getTime() - oneDayMs);
    }

    while (activeDateSet.has(formatUtcDate(cursor))) {
      current += 1;
      cursor = new Date(cursor.getTime() - oneDayMs);
    }

    return { current, longest };
  }

  async function fetchGitHubStreaks() {
    const streakLine = document.getElementById('github-streak-line');
    if (!streakLine) return;

    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`);
      if (!response.ok) throw new Error('Contribution calendar request failed');

      const data = await response.json();
      const contributions = Array.isArray(data.contributions) ? data.contributions : [];
      const { current, longest } = calculateStreaks(contributions);

      streakLine.textContent = `${current} day current streak · ${longest} day longest streak`;
    } catch (error) {
      console.error('GitHub streak fetch failed:', error);
      streakLine.textContent = 'Streak stats unavailable';
    }
  }

  async function fetchGitHubCounts() {
    const statsLine = document.getElementById('github-stats-line');

    try {
      const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
      if (!userResponse.ok) throw new Error('GitHub user request failed');
      const userData = await userResponse.json();

      const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
      if (!reposResponse.ok) throw new Error('GitHub repos request failed');
      const reposData = await reposResponse.json();

      const totalStars = reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      let commits = '--';
      try {
        const commitResponse = await fetch(`https://api.github.com/search/commits?q=author:${githubUsername}`, {
          headers: { Accept: 'application/vnd.github.cloak-preview' }
        });
        if (commitResponse.ok) {
          const commitData = await commitResponse.json();
          commits = commitData.total_count || 0;
        }
      } catch (commitError) {
        commits = '--';
      }

      const repos = userData.public_repos || reposData.length || '--';
      const followers = userData.followers || '--';
      const stars = totalStars || '--';
      const lineText = `${repos} repos · ${commits} commits · ${followers} followers · ${stars} stars`;
      if (statsLine) statsLine.textContent = lineText;
    } catch (error) {
      console.error('GitHub stats fetch failed:', error);
      if (statsLine) statsLine.textContent = 'GitHub stats unavailable';
    }
  }

  fetchGitHubCounts();
  fetchGitHubStreaks();

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
    },
    hi: {
      title: 'अक्षय — पोर्टफोलियो',
      'nav.home': 'होम',
      'nav.about': 'मेरे बारे में',
      'nav.projects': 'प्रोजेक्ट्स',
      'nav.contact': 'संपर्क',
      'hero.title': 'नमस्ते, मैं अक्षय हूँ',
      'hero.lead': 'IIT स्नातकोत्तर पृष्ठभूमि और जापान में विनिर्माण, इंजीनियरिंग, और अंतरराष्ट्रीय व्यवसाय में 4+ वर्षों के अनुभव के साथ द्विभाषी वैश्विक पेशेवर।',
      'hero.learn_more': 'और जानें',
      'hero.location_title': 'स्थान',
      'hero.location_value': 'फुकुओका, जापान',
      'hero.specialties_title': 'विशेषताएँ',
      'hero.specialties_value': 'प्रोजेक्ट समन्वय · डेटा विश्लेषण · जापानी (JLPT N2) · अंतरराष्ट्रीय व्यवसाय',
      'about.title': 'मेरे बारे में',
      'about.intro': 'IIT गांधीनगर की स्नातकोत्तर पृष्ठभूमि और जापान में विनिर्माण, इंजीनियरिंग, और अंतरराष्ट्रीय व्यवसाय क्षेत्रों में 4+ वर्षों के अनुभव के साथ द्विभाषी वैश्विक पेशेवर। मैं क्रॉस-फ़ंक्शनल टीमों का समन्वय करने, विदेशी परियोजनाओं का प्रबंधन करने, और गुणवत्ता, लागत, और समय पर ध्यान केंद्रित करते हुए डेटा-आधारित निर्णयों का समर्थन करने में सक्षम हूँ।',
      'about.background_title': 'शिक्षा',
      'about.background_text': 'IIT Gandhinagar से मैटीरियल्स साइंस और इंजीनियरिंग में M.Tech (CPI 8.38/10, 2018-20)। Uttarakhand Technical University से प्रोडक्शन इंजीनियरिंग में B.Tech (76.45%, 2014-18)। डेटा-संचालित प्रयोग और तकनीकी विश्लेषण में मजबूत आधार।',
      'about.approach_title': 'मुख्य क्षेत्र',
      'about.approach_text': 'प्रभावी अंतर-सांस्कृतिक संचार के माध्यम से तकनीकी और व्यवसाय कार्यों को जोड़ना। प्रक्रिया सुधार, परियोजना समन्वय, और डेटा-संचालित निर्णय समर्थन में कुशल। JLPT N2 जापानी, अंग्रेज़ी, और हिंदी में दक्ष, और बहुसांस्कृतिक टीमों के साथ काम करने का अनुभव।',
      'experience.title': 'अनुभव',
      'experience.item1.title': 'अंतरराष्ट्रीय सेल्स इंजीनियर',
      'experience.item1.date': 'Kuken Industries, फुकुओका · 2024 – वर्तमान',
      'experience.item1.text': 'ग्राहकों, इंजीनियरिंग, और उत्पादन टीमों के बीच वैश्विक बाजारों में विदेशी परियोजनाओं का समन्वय करता है',
      'experience.item2.title': 'प्रोडक्शन इंजीनियर',
      'experience.item2.date': 'Kuken Industries, मियावाका · 2022 – 2024',
      'experience.item2.text': 'उत्पादन प्रक्रियाओं और घटक डिज़ाइन का समर्थन किया, विनिर्माण संचालन में गुणवत्ता और निरंतरता सुनिश्चित की',
      'experience.item3.title': 'स्नातकोत्तर शोधकर्ता',
      'experience.item3.date': 'IIT Gandhinagar · 2020 – 2021',
      'experience.item3.text': 'डेटा-संचालित प्रयोग किए और सामग्री विज्ञान में प्रदर्शन मूल्यांकन के लिए सांख्यिकीय विश्लेषण लागू किया',
      'skills.title': 'कौशल',
      'skills.list.1': 'प्रोजेक्ट समन्वय और स्टेकहोल्डर संरेखण',
      'skills.list.2': 'डेटा विश्लेषण और Excel (उन्नत)',
      'skills.list.3': 'जापानी (JLPT N2) · अंग्रेज़ी · हिंदी',
      'skills.list.4': 'Python, AutoCAD, SolidWorks',
      'skills.list.5': 'प्रक्रिया सुधार और गुणवत्ता प्रबंधन',
      'projects.title': 'प्रोजेक्ट्स',
      'projects.card1.title': 'पोर्टफोलियो रिफ़्रेश',
      'projects.card1.text': 'मेरी कहानी, कौशल और संपर्क जानकारी साझा करने के लिए एक स्पष्ट, रिस्पॉन्सिव व्यक्तिगत वेबसाइट।',
      'projects.card2.title': 'सेल्स सपोर्ट टूलकिट',
      'projects.card2.text': 'जापानी तकनीकी टीमों और विदेशी ग्राहकों के बीच संचार को सुव्यवस्थित करने के लिए दस्तावेज़ीकरण और प्रक्रिया टेम्पलेट।',
      'contact.title': 'संपर्क',
      'contact.line1': 'सहयोग, वेबसाइट कार्य, या अंतरराष्ट्रीय बिक्री अवसरों पर चर्चा करने के लिए संपर्क करें।',
      'footer.copyright': '© 2026 अक्षय'
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
  const browserLanguage = navigator.language.toLowerCase();
  const defaultLanguage = savedLanguage || (browserLanguage.startsWith('ja') ? 'ja' : browserLanguage.startsWith('hi') ? 'hi' : 'en');
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
    if (/(about me|tell me about|who are you|yourself|your background|your story|what do you do|what are you|about akshay|who is akshay)/.test(normalized)) {
      const section = chatSections.find(item => item.id === 'about');
      return section ? summarizeSection(section) : null;
    }
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
