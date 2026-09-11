/* Anonymous article views. One increment per article and browser calendar day. */
(() => {
  const covers = {
    "how-to-extract-icons": {
      zh: ["marketing-review-flow.png", "如何从 UI 截图中提取图标的营销封面", "从“素材没有源文件”到“只交付真正需要的 PNG”，先把问题讲清楚，再开始切图。"],
      en: ["marketing-english-card.png", "Cover for extracting icons from a UI screenshot", "From screenshot to reusable UI assets: upload, review, and export only what the handoff needs."]
    },
    "design-handoff-assets": {
      zh: ["marketing-handoff-context.png", "设计稿交付前资产判断的营销封面", "设计交付不只是“切图”，而是把固定视觉、可变内容和使用规则交给正确的人。"],
      en: ["marketing-abstract-asset.png", "Cover for choosing design handoff assets", "A clearer handoff starts with the screenshot, then turns useful visual clues into documented assets."]
    },
    "png-svg-webp": {
      zh: ["marketing-format-compare.png", "PNG SVG WebP 资源格式选择的营销封面", "少一点机械裁剪，多一点基于真实视觉、尺寸和交付场景的判断。"],
      en: ["marketing-format-compare.png", "Cover for the PNG SVG WebP format guide", "Choose a format after checking the visual, the target size, and the delivery context."]
    },
    "ui-screenshot-to-assets": {
      zh: ["marketing-abstract-asset.png", "从设计截图到可用 UI 资产的营销封面", "从一张完整界面图开始，把零散的视觉线索整理成可查、可用、可交付的资产。"],
      en: ["marketing-handoff-context.png", "Cover for turning a screenshot into usable assets", "Turn a complete interface screenshot into a reviewable, reusable asset inventory."]
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
