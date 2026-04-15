(function () {
  "use strict";

  var AVATAR = "images/rob-avatar.png";

  var INDIE_GAMES = [
    { name: "Hollow Knight: Silksong", img: "https://assets.nintendo.com/image/fetch/q_auto/f_auto/https://atum-img-lp1.cdn.nintendo.net/i/c/25953c3a62574e3280a313ee5e244fe1_1024" },
    { name: "Blue Prince", img: "https://assets.nintendo.com/image/fetch/q_auto/f_auto/https://atum-img-lp1.cdn.nintendo.net/i/c/29ace70a4c85417587be2c1c9f938771_1024" },
    { name: "Cult of the Lamb", img: "https://assets.nintendo.com/image/fetch/q_auto/f_auto/https://atum-img-lp1.cdn.nintendo.net/i/c/b62d946e92ca4c3a954ee0fe6f968f0d_1024" },
    { name: "DELTARUNE", img: "https://assets.nintendo.com/image/fetch/q_auto/f_auto/https://atum-img-lp1.cdn.nintendo.net/i/c/9ee52d7019cd4b6593dc9c3c32cc03d1_1024" }
  ];

  var GREETING = "Hi I\u2019m R.O.B., your Robotic Operating Buddy!\nLet me know if there is anything I can help with!\nI\u2019m great at the following:";

  var CANNED = {
    "Switch 2 Availability": "The Nintendo Switch 2 is available now at select retailers! Check your local store or nintendo.com/store for stock updates.",
    "Nintendo Online": "Nintendo Switch Online gives you access to 100+ classic games, online play, cloud saves, and exclusive offers. Plans start at $3.99/month!",
    "Questions": "Sure! Feel free to type any question below and I\u2019ll do my best to help. You can also visit support.nintendo.com for detailed help articles.",
    _default: "Great question! I\u2019ll look into that for you. In the meantime, check out nintendo.com for the latest info!"
  };

  var RECO_MSG = "Great! I\u2019ve made some recommendations for you. Would you like to add one or all of these to your library?";
  var CART_MSG = "Awesome! I\u2019ve added those to your cart. Head to checkout whenever you\u2019re ready!";
  var MORE_MSG = "I\u2019ve got tons more where that came from! Check out the full indie collection on the eShop.";

  var root = document.getElementById("chatbot-root");
  if (!root) return;

  var isOpen = false;
  var isExpanded = false;
  var panel, body, inputField, backdrop;

  buildBubble();

  function buildBubble() {
    var wrap = el("div", "cb-bubble-wrap");

    var tip = el("div", "cb-bubble-tip");
    tip.textContent = "R.O.B., here! Is there anything I can assist with?";
    wrap.appendChild(tip);

    var b = el("div", "cb-bubble");
    b.innerHTML = '<img src="' + AVATAR + '" alt="Chat with R.O.B.">';
    b.addEventListener("click", openChat);
    wrap.appendChild(b);

    root.appendChild(wrap);
  }

  function openChat() {
    if (isOpen) return;
    isOpen = true;
    root.querySelector(".cb-bubble-wrap").style.display = "none";
    panel = buildPanel();
    root.appendChild(panel);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { panel.classList.add("is-open"); });
    });
    showGreeting();
  }

  function closeChat() {
    isOpen = false;
    isExpanded = false;
    panel.classList.remove("is-open", "is-expanded");
    removeBackdrop();
    setTimeout(function () {
      if (panel.parentNode) panel.parentNode.removeChild(panel);
      root.querySelector(".cb-bubble-wrap").style.display = "";
    }, 350);
  }

  function showBackdrop() {
    backdrop = el("div", "cb-backdrop");
    backdrop.addEventListener("click", closeChat);
    root.appendChild(backdrop);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { backdrop.classList.add("is-visible"); });
    });
  }

  function removeBackdrop() {
    if (!backdrop) return;
    backdrop.classList.remove("is-visible");
    var ref = backdrop;
    setTimeout(function () { if (ref.parentNode) ref.parentNode.removeChild(ref); }, 400);
    backdrop = null;
  }

  function buildPanel() {
    var p = el("div", "cb-panel");

    var hdr = el("div", "cb-header");
    hdr.innerHTML =
      '<img class="cb-header__avatar" src="' + AVATAR + '" alt="">' +
      '<span class="cb-header__name">R.O.B.</span>' +
      '<button class="cb-header__close" aria-label="Close chat">&times;</button>';
    hdr.querySelector(".cb-header__close").addEventListener("click", closeChat);
    p.appendChild(hdr);

    body = el("div", "cb-body cb-body--chat");
    p.appendChild(body);

    var bar = buildInputBar();
    p.appendChild(bar);

    return p;
  }

  function buildInputBar() {
    var bar = el("div", "cb-input");
    inputField = document.createElement("input");
    inputField.type = "text";
    inputField.className = "cb-input__field";
    inputField.placeholder = "Enter Text\u2026.";
    bar.appendChild(inputField);

    var send = el("button", "cb-input__send");
    send.innerHTML = "&#10148;";
    send.setAttribute("aria-label", "Send");
    bar.appendChild(send);

    send.addEventListener("click", handleSend);
    inputField.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSend();
    });

    return bar;
  }

  function handleSend() {
    var text = (inputField.value || "").trim();
    if (!text) return;
    inputField.value = "";
    addUserMsg(text);
    var reply = CANNED._default;
    botReply(reply);
  }

  function showGreeting() {
    showTyping(function () {
      addBotMsg(GREETING);
      showOptions(["Find Games For Me", "Switch 2 Availability", "Nintendo Online", "Questions"]);
    }, 1200);
  }

  function showOptions(labels) {
    var wrap = el("div", "cb-options");
    labels.forEach(function (label) {
      var btn = el("button", "cb-options__btn");
      btn.textContent = label;
      btn.addEventListener("click", function () {
        disableOptions(wrap);
        handleOption(label);
      });
      wrap.appendChild(btn);
    });
    setTimeout(function () { getChatContainer().appendChild(wrap); scrollChat(); }, 400);
  }

  function disableOptions(wrap) {
    var btns = wrap.querySelectorAll(".cb-options__btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      btns[i].style.opacity = "0.5";
      btns[i].style.cursor = "default";
    }
  }

  function handleOption(label) {
    addUserMsg(label);

    if (label === "Find Games For Me") {
      showTyping(function () { expandWithRecommendations(); }, 1400);
      return;
    }

    if (label === "Add To Cart") {
      botReply(CART_MSG);
      return;
    }

    if (label === "Show Me More") {
      botReply(MORE_MSG);
      return;
    }

    var reply = CANNED[label] || CANNED._default;
    botReply(reply);
  }

  function botReply(text) {
    showTyping(function () { addBotMsg(text); }, 1000);
  }

  function expandWithRecommendations() {
    isExpanded = true;
    showBackdrop();
    panel.classList.add("is-expanded");

    body.className = "cb-body cb-body--expanded";
    body.innerHTML = "";

    var content = el("div", "cb-content");

    var banner = el("div", "cb-promo-banner");
    banner.innerHTML =
      '<img class="cb-promo-banner__img" src="images/indie-world-banner.png" alt="Indie World">';
    content.appendChild(banner);

    var cards = el("div", "cb-content__cards");
    INDIE_GAMES.forEach(function (g) {
      var c = el("div", "cb-card");
      c.innerHTML =
        '<img class="cb-card__img" src="' + g.img + '" alt="' + esc(g.name) + '" loading="lazy">' +
        '<div class="cb-card__body"><p class="cb-card__title">' + esc(g.name) + "</p></div>";
      cards.appendChild(c);
    });
    content.appendChild(cards);
    body.appendChild(content);

    var chatRail = el("div", "cb-chat-rail");
    var msgs = el("div", "cb-chat-rail__messages");
    chatRail.appendChild(msgs);

    var railInput = buildInputBar();
    chatRail.appendChild(railInput);

    body.appendChild(chatRail);

    var panelInput = panel.querySelector(".cb-input");
    if (panelInput) panelInput.style.display = "none";

    typeMessage(msgs, RECO_MSG, function () {
      var opts = el("div", "cb-options");
      opts.style.padding = "0.25rem 0.75rem 0.5rem";
      ["Add To Cart", "Show Me More"].forEach(function (label) {
        var btn = el("button", "cb-options__btn");
        btn.textContent = label;
        btn.addEventListener("click", function () {
          disableOptions(opts);
          addUserMsgTo(msgs, label);
          showTypingIn(msgs, function () {
            var reply = label === "Add To Cart" ? CART_MSG : MORE_MSG;
            addBotMsgTo(msgs, reply);
          }, 1000);
        });
        opts.appendChild(btn);
      });
      msgs.appendChild(opts);
      scrollChat();
    });
  }

  /* ---- Helpers ---- */

  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function getChatContainer() {
    if (isExpanded) return body.querySelector(".cb-chat-rail__messages") || body;
    return body;
  }

  function scrollChat() {
    var c = getChatContainer();
    if (c) c.scrollTop = c.scrollHeight;
  }

  function addBotMsg(text) {
    addBotMsgTo(getChatContainer(), text);
  }

  function addBotMsgTo(container, text) {
    var wrap = el("div", "cb-msg cb-msg--bot");
    wrap.innerHTML =
      '<img class="cb-msg__avatar" src="' + AVATAR + '" alt="">' +
      '<div class="cb-msg__bubble">' + esc(text).replace(/\n/g, "<br>") + "</div>";
    container.appendChild(wrap);
    scrollChat();
  }

  function addUserMsg(text) {
    addUserMsgTo(getChatContainer(), text);
  }

  function addUserMsgTo(container, text) {
    var wrap = el("div", "cb-msg cb-msg--user");
    wrap.innerHTML = '<div class="cb-msg__bubble">' + esc(text) + "</div>";
    container.appendChild(wrap);
    scrollChat();
  }

  function showTyping(cb, delay) {
    showTypingIn(getChatContainer(), cb, delay);
  }

  function showTypingIn(container, cb, delay) {
    var ind = el("div", "cb-msg cb-msg--bot");
    ind.innerHTML =
      '<img class="cb-msg__avatar" src="' + AVATAR + '" alt="">' +
      '<div class="cb-typing"><span class="cb-typing__dot"></span><span class="cb-typing__dot"></span><span class="cb-typing__dot"></span></div>';
    container.appendChild(ind);
    scrollChat();
    setTimeout(function () {
      if (ind.parentNode) ind.parentNode.removeChild(ind);
      if (cb) cb();
    }, delay || 1200);
  }

  function typeMessage(container, text, cb) {
    var wrap = el("div", "cb-msg cb-msg--bot");
    var avatar = '<img class="cb-msg__avatar" src="' + AVATAR + '" alt="">';
    var bubble = el("div", "cb-msg__bubble");
    wrap.innerHTML = avatar;
    wrap.appendChild(bubble);

    var ind = el("div", "cb-msg cb-msg--bot");
    ind.innerHTML =
      '<img class="cb-msg__avatar" src="' + AVATAR + '" alt="">' +
      '<div class="cb-typing"><span class="cb-typing__dot"></span><span class="cb-typing__dot"></span><span class="cb-typing__dot"></span></div>';
    container.appendChild(ind);
    scrollChat();

    setTimeout(function () {
      if (ind.parentNode) ind.parentNode.removeChild(ind);
      container.appendChild(wrap);
      var i = 0;
      var chars = text.split("");
      function next() {
        if (i >= chars.length) { scrollChat(); if (cb) cb(); return; }
        bubble.innerHTML += chars[i] === "\n" ? "<br>" : esc(chars[i]);
        i++;
        scrollChat();
        setTimeout(next, 30 + Math.random() * 40);
      }
      next();
    }, 1000);
  }
})();
