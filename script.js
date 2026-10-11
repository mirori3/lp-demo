/* =========================================================
   メニューのデータ
   メニューを入れ替えるときは、この配列を書きかえる
   price：数字のみ（税込・店内価格）／ suffix：「〜」など、価格のあとにつける文字
   ========================================================= */
const menu = [
  {
    name: '本日のハンドドリップ',
    desc: '浅煎りと深煎りから選べます。おかわりは半額です。',
    price: 550,
    img: 'images/menu-01.jpg',
    alt: 'ハンドドリップで淹れたコーヒー',
  },
  {
    name: 'カフェラテ',
    desc: '深煎りのエスプレッソに、地元の牧場の牛乳を合わせます。',
    price: 600,
    img: 'images/menu-02.jpg',
    alt: 'カフェラテ',
  },
  {
    name: 'モーニングセット',
    desc: 'パン2種・スープ・ドリンクのセット。7:00〜10:30限定です。',
    price: 900,
    img: 'images/menu-03.jpg',
    alt: 'パン2種とスープ、ドリンクのモーニングセット',
  },
  {
    name: '天然酵母のカンパーニュ',
    desc: '外はかりっと、中はもっちり。店主のいちばんのおすすめです。',
    price: 480,
    img: 'images/menu-04.jpg',
    alt: '天然酵母のカンパーニュ',
  },
  {
    name: '季節のタルト',
    desc: '旬の果物を使った、月替わりのタルトです。',
    price: 520,
    img: 'images/menu-05.jpg',
    alt: '旬の果物を使った季節のタルト',
  },
  {
    name: 'コーヒー豆（100g）',
    desc: '店内で焙煎した豆を、挽いてお渡しすることもできます。',
    price: 850,
    suffix: '〜',
    note: '産地など、豆の種類によって価格が変わります',
    img: 'images/menu-06.jpg',
    alt: '店内で焙煎したコーヒー豆',
  },
];

/* =========================================================
   お知らせのデータ
   追加するときは、この配列に1件足す（日付の新しい順に、自動で5件まで表示）
   date：「2026.05」の形
   ========================================================= */
const news = [
  {
    date: '2026.05',
    category: 'イベント',
    text: '◯◯公園の朝市マルシェに出店しました（毎月第2日曜）', // 公園名は未確定
  },
  {
    date: '2025.11',
    category: '掲載',
    text: '地域情報誌「◯◯タウン」のパン特集で紹介されました', // 誌名は未確定
  },
  {
    date: '2025.04',
    category: 'コラボ',
    text: '近くの花屋さんと、春の焼き菓子ギフトを作りました',
  },
];

const NEWS_LIMIT = 5;

/* =========================================================
   共通
   ========================================================= */
const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 画像ファイルがまだないときは、img を隠してグレーの「IMAGE」枠を見せる
const watchImage = (img) => {
  const hide = () => img.classList.add('is-missing');
  if (img.complete && img.naturalWidth === 0) {
    hide();
  } else {
    img.addEventListener('error', hide, { once: true });
  }
};

/* =========================================================
   メニューのカードを作る
   ========================================================= */
const renderMenu = () => {
  const list = document.getElementById('menu-list');
  if (!list) return;

  list.innerHTML = menu.map((item) => `
    <li class="card menu-card reveal">
      <div class="menu-card__media media">
        <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.alt)}" width="800" height="600" loading="lazy">
      </div>
      <div class="menu-card__body">
        <h3 class="menu-card__name">${escapeHtml(item.name)}</h3>
        <p class="menu-card__desc">${escapeHtml(item.desc)}</p>
        <p class="menu-card__price">
          <span class="price__num">${item.price.toLocaleString('ja-JP')}</span><span class="price__unit">円${escapeHtml(item.suffix || '')}</span>
        </p>
        ${item.note ? `<p class="menu-card__price-note">${escapeHtml(item.note)}</p>` : ''}
      </div>
    </li>
  `).join('');
};

/* =========================================================
   お知らせの一覧を作る
   ========================================================= */
const renderNews = () => {
  const list = document.getElementById('news-list');
  if (!list) return;

  list.innerHTML = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, NEWS_LIMIT)
    .map((item) => `
      <li class="news-item">
        <time class="news-item__date" datetime="${escapeHtml(item.date.replace('.', '-'))}">${escapeHtml(item.date)}</time>
        <span class="news-item__tag">${escapeHtml(item.category)}</span>
        <p class="news-item__text">${escapeHtml(item.text)}</p>
      </li>
    `).join('');
};

/* =========================================================
   ヘッダー（スクロールで背景を切り替え）
   ========================================================= */
const initHeader = () => {
  const header = document.getElementById('header');
  const pageTop = document.querySelector('.page-top');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    pageTop.classList.toggle('is-visible', y > 600);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  pageTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    document.querySelector('.header__logo').focus({ preventScroll: true });
  });
};

/* =========================================================
   ハンバーガーメニュー（SP）
   ========================================================= */
const initNav = () => {
  const header = document.getElementById('header');
  const toggle = header.querySelector('.header__toggle');
  const nav = document.getElementById('global-nav');
  const spQuery = window.matchMedia('(max-width: 768px)');

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // リンクを押したら閉じる
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // PC幅に戻ったら閉じる
  spQuery.addEventListener('change', (e) => {
    if (!e.matches) setOpen(false);
  });
};

/* =========================================================
   FAQ アコーディオン（開くのは1つだけ）
   ========================================================= */
const initFaq = () => {
  const buttons = document.querySelectorAll('.faq__q');

  const setExpanded = (button, open) => {
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      buttons.forEach((other) => {
        if (other !== button) setExpanded(other, false);
      });
      setExpanded(button, willOpen);
    });
  });
};

/* =========================================================
   SP：ファーストビューを過ぎたら、画面下に予約ボタンを出す
   （ファーストビューのボタン、RESERVE セクションが見えている間は出さない）
   ========================================================= */
const initFixedCta = () => {
  const bar = document.querySelector('.fixed-cta');
  const heroCta = document.getElementById('hero-cta');
  const reserve = document.getElementById('reserve');
  if (!bar || !heroCta || !reserve || !('IntersectionObserver' in window)) return;

  const state = { heroVisible: true, reserveVisible: false, heroPassed: false };
  const link = bar.querySelector('a');

  const update = () => {
    const show = state.heroPassed && !state.heroVisible && !state.reserveVisible;
    bar.classList.toggle('is-visible', show);
    bar.setAttribute('aria-hidden', String(!show));
    link.tabIndex = show ? 0 : -1;
  };

  new IntersectionObserver(([entry]) => {
    state.heroVisible = entry.isIntersecting;
    // ボタンが画面の上へ抜けたときだけ「過ぎた」とみなす
    state.heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(heroCta);

  new IntersectionObserver(([entry]) => {
    state.reserveVisible = entry.isIntersecting;
    update();
  }).observe(reserve);
};

/* =========================================================
   スクロールでフェードイン
   ========================================================= */
const initReveal = () => {
  const targets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  targets.forEach((el) => observer.observe(el));
};

/* =========================================================
   実行
   ========================================================= */
renderMenu();
renderNews();
document.querySelectorAll('.media img').forEach(watchImage);
initHeader();
initNav();
initFaq();
initFixedCta();
initReveal();
