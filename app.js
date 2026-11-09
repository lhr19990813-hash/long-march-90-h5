(() => {
  "use strict";

  const sections = [...document.querySelectorAll(".chapter")];
  const railButtons = [...document.querySelectorAll(".rail [data-go]")];
  const pageNow = document.getElementById("pageNow");
  const pageLabel = document.getElementById("pageLabel");
  const progressBar = document.getElementById("progressBar");
  let activeIndex = 0;

  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => goTo(button.dataset.go));
  });

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = sections[Math.min(activeIndex + 1, sections.length - 1)];
      next?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const setActive = (index) => {
    if (index === activeIndex && document.body.dataset.ready) return;
    activeIndex = index;
    document.body.dataset.ready = "true";
    const section = sections[index];
    const page = String(index + 1).padStart(2, "0");
    pageNow.textContent = page;
    pageLabel.textContent = section.dataset.label || "";
    progressBar.style.width = `${((index + 1) / sections.length) * 100}%`;
    railButtons.forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
    document.querySelector(".mobile-next span").textContent = index === sections.length - 1 ? "回到首页" : "下一页";
    document.querySelector(".mobile-next b").textContent = index === sections.length - 1 ? "↑" : "↓";
  };

  let scrollTicking = false;
  const updateChapter = () => {
    let closest = 0;
    let distance = Infinity;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const currentDistance = Math.abs(rect.top - 1);
      if (rect.bottom > 0 && rect.top < window.innerHeight && currentDistance < distance) {
        distance = currentDistance;
        closest = index;
      }
    });
    setActive(closest);
    scrollTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateChapter);
      scrollTicking = true;
    }
  }, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { threshold: .16 });
  sections.forEach((section) => revealObserver.observe(section));

  const timelineData = {
    start: { index: "01", date: "1934年10月", title: "中央红军开始长征", body: "中央红军主力从江西于都等地集结出发，开始艰苦卓绝的战略转移。" },
    turn: { index: "02", date: "1935年1月", title: "遵义会议实现伟大转折", body: "遵义会议在极端危急关头挽救了党、挽救了红军、挽救了中国革命。" },
    break: { index: "03", date: "1935年10月", title: "中央红军胜利到达陕北", body: "经过四渡赤水、巧渡金沙江、强渡大渡河、翻越雪山草地等艰苦历程，中央红军胜利到达陕北。" },
    meet: { index: "04", date: "1936年10月", title: "三大主力胜利会师", body: "红一、红四方面军在甘肃会宁会师；红一、红二方面军在将台堡（今宁夏西吉）会师。至此三大主力红军胜利会师，长征胜利结束。" }
  };
  const timelineCard = document.getElementById("timelineCard");
  document.querySelectorAll("[data-timeline]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-timeline]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-selected", String(item === button));
      });
      const item = timelineData[button.dataset.timeline];
      timelineCard.innerHTML = `<span class="timeline-index">${item.index}</span><div><p>${item.date}</p><h3>${item.title}</h3><p>${item.body}</p></div>`;
    });
  });

  const routeData = {
    "于都": "中央红军主力集结出发，伟大远征由此启程。",
    "湘江": "在严重损失中突破封锁线，付出的牺牲提醒人们：方向与决策关乎队伍存亡。",
    "遵义": "在危急关头坚持独立自主、实事求是，中国革命由此实现伟大转折。",
    "赤水": "四渡赤水灵活机动，展现从实际出发、掌握战争主动权的智慧。",
    "金沙江": "巧渡金沙江跳出包围圈，在敌强我弱条件下打开新的局面。",
    "泸定桥": "大渡河畔争分夺秒，前锋部队以英勇行动打开北上通道。",
    "雪山草地": "极端自然环境、疾病与缺粮，都没能动摇队伍继续前进的信念。",
    "陕北": "1935年10月，中央红军胜利到达陕北，完成历时一年的战略转移。",
    "会师": "各路红军相继会师，伟大远征抵达胜利，也开启新的历史征程。"
  };
  const routeCaption = document.getElementById("routeCaption");
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-route]").forEach((item) => item.classList.toggle("active", item === button));
      const key = button.dataset.route;
      document.querySelectorAll("[data-node]").forEach((node) => node.classList.toggle("active", node.dataset.node === key));
      routeCaption.innerHTML = `<b>${key}</b>｜${routeData[key]}`;
    });
  });

  let counted = false;
  const countUp = () => {
    if (counted) return;
    counted = true;
    document.querySelectorAll("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);
      const prefix = element.dataset.prefix || "";
      const suffix = element.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.textContent = `${prefix}${value.toLocaleString("zh-CN")}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  };
  const numberSection = document.getElementById("page-4");
  const numberObserver = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) countUp();
  }, { threshold: .35 });
  numberObserver.observe(numberSection);

  const numberInsight = document.getElementById("numberInsight");
  document.querySelectorAll(".number-card").forEach((card) => {
    card.addEventListener("click", () => {
      numberInsight.innerHTML = `<span>人的尺度</span><p>${card.dataset.detail}</p>`;
    });
  });

  document.querySelectorAll("[data-accordion] article button").forEach((button) => {
    button.addEventListener("click", () => {
      const article = button.closest("article");
      document.querySelectorAll("[data-accordion] article").forEach((item) => {
        const isCurrent = item === article;
        item.classList.toggle("open", isCurrent ? !item.classList.contains("open") : false);
        item.querySelector("button").setAttribute("aria-expanded", String(item.classList.contains("open")));
      });
    });
  });

  const profiles = {
    yang: {
      index: "01", role: "退役军人 · 星火燎原平台创始人", name: "杨树通",
      body: "带队重走长征路，在泸定桥体会夺桥艰险；回到天津后建设退役军人创业孵化基地，把“同行”落实为对战友的支持。",
      link: "https://news.nankai.edu.cn/mtnk/system/2026/10/16/030074812.shtml", linkText: "查看津云公开报道",
      image: "assets/luding-bridge.jpg", alt: "四川泸定桥当代实景", credit: "泸定桥当代实景｜Rolf Müller · CC BY-SA 3.0", source: "https://commons.wikimedia.org/wiki/File:Luding_bridge.jpg"
    },
    guo: {
      index: "02", role: "退役军人 · 天津公安民警", name: "郭志龙",
      body: "处置警情时被汽油爆燃严重烧伤，经历九次植皮后重返公安一线。他用亲身经历说明，“永不言弃”可以落实在每一次职责坚守中。",
      link: "https://www.mva.gov.cn/xinwen/dfdt/202607/t20260728_581889.html", linkText: "查看退役军人事务部报道",
      image: "assets/tianjin-martyrs-cemetery.jpg", alt: "天津市烈士陵园外景", credit: "天津市烈士陵园｜1969社论 · CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Tianjin_Martyrs%27_Cemetery_20260423.jpg"
    },
    wang: {
      index: "03", role: "退役军人 · 天津轨道交通职工", name: "王米佳",
      body: "两度参加阅兵，退役后把阅兵训练中的标准意识、纪律意识带进天津轨道交通岗位，让“高标准”成为日常工作习惯。",
      link: "https://www.mva.gov.cn/xinwen/dfdt/202607/t20260728_581889.html", linkText: "查看天津老兵宣讲报道",
      image: "assets/tianjin-haihe.jpg", alt: "天津海河城市景观", credit: "天津海河｜Mathieu dreo · 公有领域", source: "https://commons.wikimedia.org/wiki/File:Tianjin_haihe.jpg"
    },
    lin: {
      index: "04", role: "退役军人 · 天津市儿童福利院职工", name: "林泉",
      body: "从消防尖兵转岗儿童福利院，他把军人的责任感带到新的岗位，长期守护孤残儿童，在平凡日常中继续服务人民。",
      link: "https://www.mva.gov.cn/xinwen/dfdt/202607/t20260728_581889.html", linkText: "查看天津老兵宣讲报道",
      image: "assets/tianjin-haihe.jpg", alt: "天津海河城市景观", credit: "天津海河｜Mathieu dreo · 公有领域", source: "https://commons.wikimedia.org/wiki/File:Tianjin_haihe.jpg"
    }
  };
  const profileCard = document.getElementById("profileCard");
  document.querySelectorAll("[data-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-profile]").forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-selected", String(item === button));
      });
      const item = profiles[button.dataset.profile];
      profileCard.innerHTML = `<div class="profile-number">${item.index}</div><div class="profile-copy"><p class="profile-role">${item.role}</p><h3>${item.name}</h3><p>${item.body}</p><a href="${item.link}" target="_blank" rel="noreferrer">${item.linkText} ↗</a></div><figure><img src="${item.image}" alt="${item.alt}" loading="lazy"><figcaption><a href="${item.source}" target="_blank" rel="noreferrer">${item.credit}</a></figcaption></figure>`;
    });
  });

  const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"
  }[character]));

  const interviewGrid = document.getElementById("interviewGrid");
  const interviews = Array.isArray(window.INTERVIEWS) ? window.INTERVIEWS.slice(0, 4) : [];
  while (interviews.length < 4) interviews.push({});
  interviewGrid.innerHTML = interviews.map((interview, index) => {
    const hasPhoto = Boolean(interview.photo);
    const photo = hasPhoto
      ? `<img src="${escapeHTML(interview.photo)}" alt="${escapeHTML(interview.name || `第${index + 1}位受访者`)}">`
      : `<div class="photo-placeholder"><b>${String(index + 1).padStart(2, "0")}</b><span>人物照片</span></div>`;
    return `<article class="interview-card">
      <div class="interview-photo">${photo}</div>
      <div class="interview-fields">
        <p><span>姓名</span><b>${escapeHTML(interview.name || "【待补充】")}</b></p>
        <p><span>身份</span><b>${escapeHTML(interview.identity || "【待补充】")}</b></p>
        <p><span>关键词</span><b>${escapeHTML(interview.keyword || "【待提炼】")}</b></p>
        <p><span>真实引语</span><b class="interview-quote">${escapeHTML(interview.quote || "【经本人确认后补充】")}</b></p>
        <p><span>采访信息</span><b>${escapeHTML(interview.meta || "【时间 / 地点 / 方式】")}</b></p>
      </div>
    </article>`;
  }).join("");

  const actionForm = document.getElementById("actionForm");
  const checkboxes = [...actionForm.querySelectorAll("input[type='checkbox']")];
  const promiseText = document.getElementById("promiseText");
  const actionCount = document.getElementById("actionCount");
  const actionBar = document.getElementById("actionBar");
  const actionToast = document.getElementById("actionToast");
  const storageKey = "longMarch90Action";

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    checkboxes.forEach((box) => { box.checked = Array.isArray(saved.actions) && saved.actions.includes(box.value); });
    promiseText.value = saved.promise || "";
  } catch (_) { /* 本地存储不可用时不影响页面 */ }

  const updateActions = () => {
    const selected = checkboxes.filter((box) => box.checked).map((box) => box.value);
    actionCount.textContent = String(selected.length);
    actionBar.style.width = `${selected.length * 25}%`;
    try { localStorage.setItem(storageKey, JSON.stringify({ actions: selected, promise: promiseText.value.trim() })); } catch (_) { /* ignore */ }
    return selected;
  };
  checkboxes.forEach((box) => box.addEventListener("change", updateActions));
  promiseText.addEventListener("input", updateActions);
  updateActions();

  let toastTimer;
  const showToast = (message) => {
    clearTimeout(toastTimer);
    actionToast.textContent = message;
    actionToast.classList.add("show");
    toastTimer = setTimeout(() => actionToast.classList.remove("show"), 3600);
  };
  actionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = updateActions();
    const promise = promiseText.value.trim();
    if (!selected.length || !promise) {
      showToast("请至少选择一项行动，并写下你的第一步。");
      return;
    }
    showToast(`行动卡已保存在本机：从“${selected.join("、")}”出发——${promise}`);
  });

  const sourceDialog = document.getElementById("sourceDialog");
  document.querySelectorAll("[data-open-sources]").forEach((button) => button.addEventListener("click", () => sourceDialog.showModal()));
  document.querySelector("[data-close-sources]").addEventListener("click", () => sourceDialog.close());
  sourceDialog.addEventListener("click", (event) => {
    if (event.target === sourceDialog) sourceDialog.close();
  });

  const stampButton = document.getElementById("stampButton");
  let stampTimer;
  const lightStamp = () => {
    stampButton.classList.add("lit");
    stampButton.querySelector("span").textContent = "已经点亮";
  };
  stampButton.addEventListener("pointerdown", () => { stampTimer = setTimeout(lightStamp, 650); });
  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => stampButton.addEventListener(eventName, () => clearTimeout(stampTimer)));
  stampButton.addEventListener("click", lightStamp);

  document.getElementById("copyLink").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      showToast("链接已复制。");
    } catch (_) {
      const input = document.createElement("textarea");
      input.value = location.href;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      showToast("链接已复制。");
    }
  });

  document.querySelector(".mobile-next").addEventListener("click", (event) => {
    if (activeIndex === sections.length - 1) {
      event.stopImmediatePropagation();
      goTo("page-1");
    }
  }, true);

  updateChapter();
})();

