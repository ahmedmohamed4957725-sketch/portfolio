/* ==========================================================================
   Ahmed Mohamed Saied — portfolio interactions
   Theme switch · compact navigation · header state · scroll reveal
   ========================================================================== */
(function () {
    "use strict";

    var root = document.documentElement;
    var STORAGE_KEY = "ams-theme";
    var themeToggle = document.getElementById("themeToggle");
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ------------------------------------------------------------ theme */
    function storedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    function systemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function applyTheme(theme, animate, persist) {
        if (animate) {
            root.classList.add("theme-anim");
            window.clearTimeout(applyTheme.timer);
            applyTheme.timer = window.setTimeout(function () {
                root.classList.remove("theme-anim");
            }, 520);
        }

        root.setAttribute("data-theme", theme);

        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "dark" ? "#0e1512" : "#f7f7f3");
        }

        if (themeToggle) {
            themeToggle.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
            themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
        }

        if (persist) {
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch (error) {
                /* storage unavailable — the theme still applies for this session */
            }
        }
    }

    applyTheme(root.getAttribute("data-theme") || storedTheme() || systemTheme(), false, false);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true, true);
        });
    }

    var systemMedia = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemThemeChange(event) {
        if (!storedTheme()) {
            applyTheme(event.matches ? "dark" : "light", true, false);
        }
    }
    if (systemMedia.addEventListener) {
        systemMedia.addEventListener("change", onSystemThemeChange);
    } else if (systemMedia.addListener) {
        systemMedia.addListener(onSystemThemeChange);
    }

    /* ----------------------------------------------------- compact menu */
    var navToggle = document.getElementById("navToggle");
    var nav = document.getElementById("nav");

    function setMenu(open) {
        if (!navToggle) {
            return;
        }
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        root.classList.toggle("nav-open", open);
    }

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            setMenu(navToggle.getAttribute("aria-expanded") !== "true");
        });

        nav.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                setMenu(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                setMenu(false);
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                setMenu(false);
            }
        });
    }

    /* ------------------------------------------------------ header state */
    var header = document.getElementById("header");
    function syncHeader() {
        if (header) {
            header.classList.toggle("is-scrolled", window.scrollY > 12);
        }
    }
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    /* ----------------------------------------------------- scroll reveal */
    var revealSelector = [
        ".hero-copy > *",
        ".hero-visual",
        ".tech-strip",
        ".section-heading",
        ".about-content",
        ".skill-card",
        ".other-skills",
        ".project-card",
        ".project-footnote",
        ".timeline-item",
        ".contact-inner > *",
        ".site-footer"
    ].join(",");

    var revealItems = document.querySelectorAll(revealSelector);

    if (prefersReducedMotion || !("IntersectionObserver" in window) || !revealItems.length) {
        root.classList.remove("js-reveal");
        return;
    }

    Array.prototype.forEach.call(revealItems, function (item) {
        item.classList.add("reveal");
    });

    Array.prototype.forEach.call(revealItems, function (item) {
        var siblings = Array.prototype.filter.call(item.parentNode.children, function (child) {
            return child.classList.contains("reveal");
        });
        var index = siblings.indexOf(item);
        if (index > 0) {
            item.style.transitionDelay = Math.min(index, 4) * 90 + "ms";
        }
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    Array.prototype.forEach.call(revealItems, function (item) {
        observer.observe(item);
    });
})();
