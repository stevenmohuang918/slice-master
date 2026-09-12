/* Anonymous article views. One increment per article and browser calendar day. */
(() => {
  const covers = {
    "how-to-extract-icons": {
      zh: ["article-cover-extract-icons-v2.png", "如何从 UI 截图中提取图标的文章封面", "把截图里的候选图标逐个识别、校对，再整理成可交付的透明 PNG。"],
      en: ["article-cover-extract-icons-v2.png", "Cover for extracting icons from a UI screenshot", "Identify, review, and turn screenshot icons into clean, reusable PNG assets."]
    },
    "design-handoff-assets": {
      zh: ["article-cover-handoff-assets-v2.png", "设计稿交付前资产判断的文章封面", "先判断哪些视觉元素应该导出，再把真正需要的素材交给开发。"],
      en: ["article-cover-handoff-assets-v2.png", "Cover for choosing design handoff assets", "Decide which visual elements belong in the asset handoff before development starts."]
    },
    "png-svg-webp": {
      zh: ["article-cover-format-guide-v2.png", "PNG SVG WebP 资源格式选择的文章封面", "从缩放、清晰度、透明效果和体积出发，选对最适合的资源格式。"],
      en: ["article-cover-format-guide-v2.png", "Cover for the PNG SVG WebP format guide", "Compare sharpness, transparency, scaling, and file size before choosing a format."]
    },
    "ui-screenshot-to-assets": {
      zh: ["article-cover-workflow-v2.png", "从设计截图到可用 UI 资产的文章封面", "从完整界面、选区校对到资产归档，一张截图也能变成清晰的交付流程。"],
      en: ["article-cover-workflow-v2.png", "Cover for turning a screenshot into usable assets", "Follow the journey from a complete screenshot to reviewed, reusable assets."]
    }
  };
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  const slug = lastPart === "index.html" ? pathParts[pathParts.length - 2] : lastPart;
  const article = document.querySelector(".article");
  const h1 = article?.querySelector("h1");
  const meta = article?.querySelector(".meta");
  const locale = document.documentElement.lang === "en" ? "en" : "zh";
  const cover = slug ? covers[slug]?.[locale] : null;
  document.querySelectorAll("[data-article-views]").forEach((metric) => {
    const card = metric.closest(".post");
    const cardCover = covers[metric.dataset.articleViews]?.[locale];
    const image = card?.querySelector(".post-cover img");
    if (!image || !cardCover) return;
    image.src = `/assets/${cardCover[0]}`;
    image.alt = cardCover[1];
  });
  if (article && h1 && meta && cover) {
    if (!article.querySelector(".article-cover")) {
      const figure = document.createElement("figure");
      figure.className = "article-cover";
      const image = document.createElement("img");
      image.src = `/assets/${cover[0]}`;
      image.alt = cover[1];
      figure.append(image);
      const caption = document.createElement("figcaption");
      caption.textContent = cover[2];
      figure.append(caption);
      h1.insertAdjacentElement("afterend", figure);
    }
    if (!meta.querySelector("[data-article-views]")) {
      const divider = document.createElement("span");
      divider.className = "dot";
      const stats = document.createElement("span");
      stats.className = "article-stats";
      stats.dataset.articleViews = slug;
      stats.setAttribute("aria-live", "polite");
      stats.innerHTML = `<span>${locale === "en" ? "Views" : "浏览量"}</span> <strong data-view-count>—</strong>`;
      meta.append(divider, stats);
    }
  }

  const endpoint = "https://slice-master-visit-counter.slicemaster-tools.workers.dev";
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date()).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]));
  const dayKey = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  document.querySelectorAll("[data-article-views]").forEach((metric) => {
    const slug = metric.dataset.articleViews;
    const count = metric.querySelector("[data-view-count]");
    if (!slug || !count) return;
    const lookupOnly = metric.dataset.viewMode === "lookup";
    const storageKey = `slice-master-article-view:${slug}:day-v1`;
    let shouldCount = !lookupOnly;

    try {
      shouldCount = !lookupOnly && localStorage.getItem(storageKey) !== dayKey;
    } catch {
      // Private browsing or disabled storage: still show the remote count.
    }

    const path = shouldCount ? "/v1/article-view" : `/v1/article-views?slug=${encodeURIComponent(slug)}`;
    const options = shouldCount ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }), keepalive: true } : {};
    fetch(`${endpoint}${path}`, options)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(({ total }) => {
        if (!Number.isFinite(total)) return;
        if (shouldCount) {
          try {
            localStorage.setItem(storageKey, dayKey);
          } catch {
            // Counting still succeeded even if the browser cannot persist the key.
          }
        }
        count.textContent = total.toLocaleString(document.documentElement.lang === "en" ? "en-US" : "zh-CN");
        metric.dataset.ready = "true";
      })
      .catch(() => {
        count.textContent = "—";
        metric.dataset.ready = "false";
      });
  });
})();
