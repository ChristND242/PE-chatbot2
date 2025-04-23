// Language translations
const translations = {
    en: {
      settings: "Settings",
      darkMode: "Dark Mode",
      switchLanguage: "Switch Language",
      welcomeTitle: "Welcome to AI Nexus",
      welcomeMessage:
        "Start a conversation by typing a message below. I can help with coding, content creation, research, and more!",
      suggestion1: "Explain quantum computing",
      suggestion2: "Write a Python function",
      suggestion3: "Create a marketing plan",
      suggestion4: "Help me debug this code",
      tokenCounter: "Tokens used in this session: ",
      settingsTitle: "Settings",
      providerLabel: "AI Provider",
      apiKeyLabel: "API Key",
      tokenLimitLabel: "Token Limit (per request)",
      modelLabel: "Model",
      cancel: "Cancel",
      save: "Save",
      newChat: "New Chat",
      deleteChat: "Delete Chat",
      confirmDelete: "Are you sure you want to delete this chat?",
      noApiKey: "Please enter your API key in settings first.",
      emptyMessage: "Message cannot be empty.",
      thinking: "Thinking...",
      errorOccurred: "An error occurred. Please try again.",
    },
    fr: {
      settings: "Paramètres",
      darkMode: "Mode Sombre",
      switchLanguage: "Changer de Langue",
      welcomeTitle: "Bienvenue sur AI Nexus",
      welcomeMessage:
        "Commencez une conversation en tapant un message ci-dessous. Je peux aider avec le codage, la création de contenu, la recherche et plus encore!",
      suggestion1: "Expliquer l'informatique quantique",
      suggestion2: "Écrire une fonction Python",
      suggestion3: "Créer un plan marketing",
      suggestion4: "Aidez-moi à déboguer ce code",
      tokenCounter: "Jetons utilisés dans cette session: ",
      settingsTitle: "Paramètres",
      providerLabel: "Fournisseur d'IA",
      apiKeyLabel: "Clé API",
      tokenLimitLabel: "Limite de jetons (par requête)",
      modelLabel: "Modèle",
      cancel: "Annuler",
      save: "Enregistrer",
      newChat: "Nouvelle Discussion",
      deleteChat: "Supprimer la Discussion",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cette discussion?",
      noApiKey:
        "Veuillez d'abord entrer votre clé API dans les paramètres.",
      emptyMessage: "Le message ne peut pas être vide.",
      thinking: "Réflexion...",
      errorOccurred: "Une erreur s'est produite. Veuillez réessayer.",
    },
  };

  // State management
  let state = {
    currentLanguage: "en",
    isDarkMode:
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
    currentChatId: null,
    chats: JSON.parse(localStorage.getItem("chats")) || {},
    settings: JSON.parse(localStorage.getItem("settings")) || {
      aiProvider: "openai",
      apiKey: "",
      tokenLimit: 1000,
      model: "gpt-3.5-turbo",
    },
    tokensUsed: 0,
  };

  // DOM elements
  const elements = {
    sidebarToggle: document.getElementById("sidebar-toggle"),
    sidebar: document.getElementById("sidebar"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    mobileSidebar: document.getElementById("mobile-sidebar"),
    mobileCloseBtn: document.getElementById("mobile-close-btn"),
    newChatBtn: document.getElementById("new-chat-btn"),
    chatList: document.getElementById("chat-list"),
    mobileChatList: document.getElementById("mobile-chat-list"),
    currentChatTitle: document.getElementById("current-chat-title"),
    chatContainer: document.getElementById("chat-container"),
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    deleteChatBtn: document.getElementById("delete-chat-btn"),
    settingsBtn: document.getElementById("settings-btn"),
    mobileSettingsBtn: document.getElementById("mobile-settings-btn"),
    settingsModal: document.getElementById("settings-modal"),
    closeSettings: document.getElementById("close-settings"),
    cancelSettings: document.getElementById("cancel-settings"),
    saveSettings: document.getElementById("save-settings"),
    aiProvider: document.getElementById("ai-provider"),
    apiKey: document.getElementById("api-key"),
    toggleApiKey: document.getElementById("toggle-api-key"),
    tokenLimit: document.getElementById("token-limit"),
    modelSelect: document.getElementById("model-select"),
    themeToggle: document.getElementById("theme-toggle"),
    mobileThemeToggle: document.getElementById("mobile-theme-toggle"),
    themeIcon: document.getElementById("theme-icon"),
    mobileThemeIcon: document.getElementById("mobile-theme-icon"),
    languageToggle: document.getElementById("language-toggle"),
    mobileLanguageToggle: document.getElementById("mobile-language-toggle"),
    suggestionBtns: document.querySelectorAll(".suggestion-btn"),
    tokenCounter: document.getElementById("token-counter"),
    tokenText: document.getElementById("token-text"),
    welcomeTitle: document.getElementById("welcome-title"),
    welcomeMessage: document.getElementById("welcome-message"),
    settingsText: document.getElementById("settings-text"),
    mobileSettingsText: document.getElementById("mobile-settings-text"),
    themeText: document.getElementById("theme-text"),
    mobileThemeText: document.getElementById("mobile-theme-text"),
    languageText: document.getElementById("language-text"),
    mobileLanguageText: document.getElementById("mobile-language-text"),
    settingsModalTitle: document.getElementById("settings-modal-title"),
    providerLabel: document.getElementById("provider-label"),
    apiKeyLabel: document.getElementById("api-key-label"),
    tokenLimitLabel: document.getElementById("token-limit-label"),
    modelLabel: document.getElementById("model-label"),
    cancelText: document.getElementById("cancel-text"),
    saveText: document.getElementById("save-text"),
    suggestion1: document.getElementById("suggestion-1"),
    suggestion2: document.getElementById("suggestion-2"),
    suggestion3: document.getElementById("suggestion-3"),
    suggestion4: document.getElementById("suggestion-4"),
  };

  // Initialize the app
  function init() {
    // Set initial theme
    setTheme(state.isDarkMode);

    // Set initial language
    setLanguage(state.currentLanguage);

    // Load settings into form
    loadSettings();

    // Load chat history
    loadChatList();

    // Create a new chat if none exists
    if (Object.keys(state.chats).length === 0) {
      createNewChat();
    } else {
      // Load the most recent chat
      const chatIds = Object.keys(state.chats);
      state.currentChatId = chatIds[chatIds.length - 1];
      loadChat(state.currentChatId);
    }

    // Set up event listeners
    setupEventListeners();
  }

  // Set up all event listeners
  function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener("click", toggleTheme);
    elements.mobileThemeToggle.addEventListener("click", toggleTheme);

    // Language toggle
    elements.languageToggle.addEventListener("click", toggleLanguage);
    elements.mobileLanguageToggle.addEventListener("click", toggleLanguage);

    // Sidebar toggle
    elements.sidebarToggle.addEventListener("click", () => {
      elements.sidebar.classList.toggle("hidden");
    });

    // Mobile menu
    elements.mobileMenuBtn.addEventListener("click", () => {
      elements.mobileSidebar.classList.remove("hidden");
      document
        .querySelector("#mobile-sidebar > div")
        .classList.remove("-translate-x-full");
    });

    elements.mobileCloseBtn.addEventListener("click", () => {
      document
        .querySelector("#mobile-sidebar > div")
        .classList.add("-translate-x-full");
      setTimeout(() => {
        elements.mobileSidebar.classList.add("hidden");
      }, 300);
    });

    // New chat
    elements.newChatBtn.addEventListener("click", createNewChat);

    // Chat form submission
    elements.chatForm.addEventListener("submit", handleChatSubmit);

    // Delete chat
    elements.deleteChatBtn.addEventListener("click", deleteCurrentChat);

    // Settings
    elements.settingsBtn.addEventListener("click", openSettings);
    elements.mobileSettingsBtn.addEventListener("click", openSettings);
    elements.closeSettings.addEventListener("click", closeSettings);
    elements.cancelSettings.addEventListener("click", closeSettings);
    elements.saveSettings.addEventListener("click", saveSettings);

    // Toggle API key visibility
    elements.toggleApiKey.addEventListener("click", () => {
      const type =
        elements.apiKey.getAttribute("type") === "password"
          ? "text"
          : "password";
      elements.apiKey.setAttribute("type", type);
      elements.toggleApiKey.innerHTML =
        type === "password"
          ? '<i class="fas fa-eye"></i>'
          : '<i class="fas fa-eye-slash"></i>';
    });

    // Suggestion buttons
    elements.suggestionBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const text = e.target
          .closest("button")
          .querySelector("span").textContent;
        elements.chatInput.value = text;
        elements.chatInput.focus();
      });
    });

    // Auto-resize textarea
    elements.chatInput.addEventListener("input", () => {
      elements.chatInput.style.height = "auto";
      elements.chatInput.style.height =
        elements.chatInput.scrollHeight + "px";
    });
  }

  // Toggle between light and dark mode
  function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem("darkMode", state.isDarkMode);
    setTheme(state.isDarkMode);
  }

  // Set theme based on state
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      elements.themeIcon.className = "fas fa-sun";
      elements.mobileThemeIcon.className = "fas fa-sun";
      elements.themeText.textContent =
        state.currentLanguage === "en" ? "Light Mode" : "Mode Clair";
      elements.mobileThemeText.textContent =
        state.currentLanguage === "en" ? "Light Mode" : "Mode Clair";
    } else {
      document.documentElement.classList.remove("dark");
      elements.themeIcon.className = "fas fa-moon";
      elements.mobileThemeIcon.className = "fas fa-moon";
      elements.themeText.textContent =
        state.currentLanguage === "en" ? "Dark Mode" : "Mode Sombre";
      elements.mobileThemeText.textContent =
        state.currentLanguage === "en" ? "Dark Mode" : "Mode Sombre";
    }
  }

  // Toggle between English and French
  function toggleLanguage() {
    state.currentLanguage = state.currentLanguage === "en" ? "fr" : "en";
    setLanguage(state.currentLanguage);
  }

  // Set language based on state
  function setLanguage(language) {
    const t = translations[language];

    // Update all text elements
    elements.settingsText.textContent = t.settings;
    elements.mobileSettingsText.textContent = t.settings;
    elements.themeText.textContent = state.isDarkMode
      ? language === "en"
        ? "Light Mode"
        : "Mode Clair"
      : language === "en"
      ? "Dark Mode"
      : "Mode Sombre";
    elements.mobileThemeText.textContent = state.isDarkMode
      ? language === "en"
        ? "Light Mode"
        : "Mode Clair"
      : language === "en"
      ? "Dark Mode"
      : "Mode Sombre";
    elements.languageText.textContent = t.switchLanguage;
    elements.mobileLanguageText.textContent = t.switchLanguage;
    elements.welcomeTitle.textContent = t.welcomeTitle;
    elements.welcomeMessage.textContent = t.welcomeMessage;
    elements.suggestion1.textContent = t.suggestion1;
    elements.suggestion2.textContent = t.suggestion2;
    elements.suggestion3.textContent = t.suggestion3;
    elements.suggestion4.textContent = t.suggestion4;
    elements.tokenText.textContent = t.tokenCounter + state.tokensUsed;
    elements.settingsModalTitle.textContent = t.settingsTitle;
    elements.providerLabel.textContent = t.providerLabel;
    elements.apiKeyLabel.textContent = t.apiKeyLabel;
    elements.tokenLimitLabel.textContent = t.tokenLimitLabel;
    elements.modelLabel.textContent = t.modelLabel;
    elements.cancelText.textContent = t.cancel;
    elements.saveText.textContent = t.save;

    // Update chat input placeholder
    elements.chatInput.placeholder =
      language === "en" ? "Type your message..." : "Tapez votre message...";

    // Update current chat title if it's "New Chat"
    if (
      elements.currentChatTitle.textContent === "New Chat" ||
      elements.currentChatTitle.textContent === "Nouvelle Discussion"
    ) {
      elements.currentChatTitle.textContent =
        language === "en" ? "New Chat" : "Nouvelle Discussion";
    }
  }

  // Load settings into the settings form
  function loadSettings() {
    elements.aiProvider.value = state.settings.aiProvider;
    elements.apiKey.value = state.settings.apiKey;
    elements.tokenLimit.value = state.settings.tokenLimit;
    elements.modelSelect.value = state.settings.model;
  }

  // Open settings modal
  function openSettings() {
    elements.settingsModal.classList.remove("hidden");
    loadSettings();
  }

  // Close settings modal
  function closeSettings() {
    elements.settingsModal.classList.add("hidden");
  }

  // Save settings from the form
  function saveSettings() {
    state.settings = {
      aiProvider: elements.aiProvider.value,
      apiKey: elements.apiKey.value,
      tokenLimit: parseInt(elements.tokenLimit.value),
      model: elements.modelSelect.value,
    };

    localStorage.setItem("settings", JSON.stringify(state.settings));
    closeSettings();

    // Show success message
    showMessage(
      "success",
      state.currentLanguage === "en"
        ? "Settings saved successfully!"
        : "Paramètres enregistrés avec succès!"
    );
  }

  // Load chat list from state
  function loadChatList() {
    elements.chatList.innerHTML = "";
    elements.mobileChatList.innerHTML = "";

    const chatIds = Object.keys(state.chats);

    if (chatIds.length === 0) return;

    chatIds.forEach((chatId) => {
      const chat = state.chats[chatId];
      const isActive = chatId === state.currentChatId;

      const chatItem = document.createElement("button");
      chatItem.className = `w-full text-left p-2 rounded-lg flex items-center space-x-2 truncate ${
        isActive
          ? "bg-primary-100 dark:bg-primary-900"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`;
      chatItem.innerHTML = `
                <i class="fas fa-comment-alt text-gray-500 dark:text-gray-400"></i>
                <span class="truncate">${
                  chat.title ||
                  (state.currentLanguage === "en"
                    ? "New Chat"
                    : "Nouvelle Discussion")
                }</span>
            `;
      chatItem.addEventListener("click", () => loadChat(chatId));

      const mobileChatItem = chatItem.cloneNode(true);
      mobileChatItem.addEventListener("click", () => {
        loadChat(chatId);
        document
          .querySelector("#mobile-sidebar > div")
          .classList.add("-translate-x-full");
        setTimeout(() => {
          elements.mobileSidebar.classList.add("hidden");
        }, 300);
      });

      elements.chatList.appendChild(chatItem);
      elements.mobileChatList.appendChild(mobileChatItem);
    });
  }

  // Create a new chat
  function createNewChat() {
    const chatId = Date.now().toString();
    const newChat = {
      title:
        state.currentLanguage === "en" ? "New Chat" : "Nouvelle Discussion",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    state.chats[chatId] = newChat;
    state.currentChatId = chatId;

    localStorage.setItem("chats", JSON.stringify(state.chats));
    loadChatList();
    loadChat(chatId);

    // Clear chat container and show welcome message
    elements.chatContainer.innerHTML = `
            <div class="flex justify-center items-center h-full">
                <div class="text-center max-w-md">
                    <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-robot text-white text-2xl"></i>
                    </div>
                    <h2 class="text-xl font-semibold mb-2">${
                      translations[state.currentLanguage].welcomeTitle
                    }</h2>
                    <p class="text-gray-500 dark:text-gray-400 mb-6">${
                      translations[state.currentLanguage].welcomeMessage
                    }</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <span>${
                              translations[state.currentLanguage]
                                .suggestion1
                            }</span>
                        </button>
                        <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <span>${
                              translations[state.currentLanguage]
                                .suggestion2
                            }</span>
                        </button>
                        <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <span>${
                              translations[state.currentLanguage]
                                .suggestion3
                            }</span>
                        </button>
                        <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <span>${
                              translations[state.currentLanguage]
                                .suggestion4
                            }</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

    // Reattach event listeners to suggestion buttons
    document.querySelectorAll(".suggestion-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const text = e.target
          .closest("button")
          .querySelector("span").textContent;
        elements.chatInput.value = text;
        elements.chatInput.focus();
      });
    });

    elements.currentChatTitle.textContent = newChat.title;
  }

  // Load a specific chat
  function loadChat(chatId) {
    if (!state.chats[chatId]) return;

    state.currentChatId = chatId;
    const chat = state.chats[chatId];

    elements.currentChatTitle.textContent = chat.title;

    // Update chat list to reflect active chat
    loadChatList();

    // Display messages
    renderMessages(chat.messages);

    // Scroll to bottom
    setTimeout(() => {
      elements.chatContainer.scrollTop =
        elements.chatContainer.scrollHeight;
    }, 100);
  }

  // Render messages in the chat container
  function renderMessages(messages) {
    elements.chatContainer.innerHTML = "";

    if (messages.length === 0) {
      elements.chatContainer.innerHTML = `
                <div class="flex justify-center items-center h-full">
                    <div class="text-center max-w-md">
                        <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-robot text-white text-2xl"></i>
                        </div>
                        <h2 class="text-xl font-semibold mb-2">${
                          translations[state.currentLanguage].welcomeTitle
                        }</h2>
                        <p class="text-gray-500 dark:text-gray-400 mb-6">${
                          translations[state.currentLanguage].welcomeMessage
                        }</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <span>${
                                  translations[state.currentLanguage]
                                    .suggestion1
                                }</span>
                            </button>
                            <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <span>${
                                  translations[state.currentLanguage]
                                    .suggestion2
                                }</span>
                            </button>
                            <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <span>${
                                  translations[state.currentLanguage]
                                    .suggestion3
                                }</span>
                            </button>
                            <button class="suggestion-btn px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <span>${
                                  translations[state.currentLanguage]
                                    .suggestion4
                                }</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;

      // Reattach event listeners to suggestion buttons
      document.querySelectorAll(".suggestion-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const text = e.target
            .closest("button")
            .querySelector("span").textContent;
          elements.chatInput.value = text;
          elements.chatInput.focus();
        });
      });

      return;
    }

    messages.forEach((message) => {
      appendMessage(message.role, message.content);
    });
  }

  // Delete the current chat
  function deleteCurrentChat() {
    if (
      !state.currentChatId ||
      !confirm(translations[state.currentLanguage].confirmDelete)
    )
      return;

    delete state.chats[state.currentChatId];
    localStorage.setItem("chats", JSON.stringify(state.chats));

    // If no chats left, create a new one
    if (Object.keys(state.chats).length === 0) {
      createNewChat();
    } else {
      // Load the most recent chat
      const chatIds = Object.keys(state.chats);
      state.currentChatId = chatIds[chatIds.length - 1];
      loadChat(state.currentChatId);
    }

    loadChatList();
  }

  // Handle chat form submission
  async function handleChatSubmit(e) {
    e.preventDefault();

    const message = elements.chatInput.value.trim();
    if (!message) {
      showMessage(
        "error",
        translations[state.currentLanguage].emptyMessage
      );
      return;
    }

    if (!state.settings.apiKey) {
      showMessage("error", translations[state.currentLanguage].noApiKey);
      openSettings();
      return;
    }

    // Add user message to chat
    appendMessage("user", message);

    // Clear input and reset height
    elements.chatInput.value = "";
    elements.chatInput.style.height = "auto";

    // Create AI message with typing indicator
    const aiMessageId = "msg-" + Date.now();
    appendMessage("assistant", "", aiMessageId);

    // Add message to chat history
    if (!state.chats[state.currentChatId]) {
      createNewChat();
    }

    state.chats[state.currentChatId].messages.push({
      role: "user",
      content: message,
    });

    localStorage.setItem("chats", JSON.stringify(state.chats));

    try {
      // Call AI API
      const response = await callAIAPI(message);

      // Update AI message with response
      updateMessage(aiMessageId, response);

      // Add AI response to chat history
      state.chats[state.currentChatId].messages.push({
        role: "assistant",
        content: response,
      });

      // Update chat title if it's the first message
      if (state.chats[state.currentChatId].messages.length === 2) {
        const title =
          message.length > 30 ? message.substring(0, 30) + "..." : message;
        state.chats[state.currentChatId].title = title;
        elements.currentChatTitle.textContent = title;
        loadChatList();
      }

      localStorage.setItem("chats", JSON.stringify(state.chats));

      // Update token counter
      state.tokensUsed += estimateTokens(message + response);
      elements.tokenText.textContent =
        translations[state.currentLanguage].tokenCounter + state.tokensUsed;
    } catch (error) {
      console.error("Error calling AI API:", error);
      updateMessage(
        aiMessageId,
        translations[state.currentLanguage].errorOccurred
      );
      showMessage(
        "error",
        translations[state.currentLanguage].errorOccurred
      );
    }
  }

  // Call the appropriate AI API based on settings
  async function callAIAPI(message) {
    const { aiProvider, apiKey, model, tokenLimit } = state.settings;
    const messages = state.chats[state.currentChatId].messages.slice(-4); // Get last 4 messages for context

    // Add the new user message
    messages.push({
      role: "user",
      content: message,
    });

    if (aiProvider === "openai") {
      return callOpenAIAPI(messages, apiKey, model, tokenLimit);
    } else if (aiProvider === "gemini") {
      return callGeminiAPI(messages, apiKey, tokenLimit);
    } else if (aiProvider === "groq") {
      return callGroqAPI(messages, apiKey, model, tokenLimit);
    }

    throw new Error("Unsupported AI provider");
  }

  // Call OpenAI API
  async function callOpenAIAPI(messages, apiKey, model, maxTokens) {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to call OpenAI API");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Call Gemini API (placeholder - would need actual implementation)
  async function callGeminiAPI(messages, apiKey, maxTokens) {
    // This is a placeholder - Gemini API implementation would go here
    // For now, we'll simulate a response
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "This is a simulated response from Google Gemini. In a real implementation, this would call the actual Gemini API.";
  }

  // Call Groq API (placeholder - would need actual implementation)
  async function callGroqAPI(messages, apiKey, model, maxTokens) {
    // This is a placeholder - Groq API implementation would go here
    // For now, we'll simulate a response
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "This is a simulated response from Groq. In a real implementation, this would call the actual Groq API.";
  }

  // Append a message to the chat container
  function appendMessage(role, content, messageId = "") {
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${
      role === "user" ? "justify-end" : "justify-start"
    } mb-4`;

    if (messageId) {
      messageDiv.id = messageId;
    }

    const bubble = document.createElement("div");
    bubble.className = `max-w-3xl rounded-lg px-4 py-3 ${
      role === "user"
        ? "bg-primary-500 text-white"
        : "bg-gray-100 dark:bg-gray-700"
    }`;

    if (content) {
      bubble.innerHTML = formatMessageContent(content);
    } else if (role === "assistant") {
      bubble.innerHTML = `
                <div class="typing-indicator">
                    <span class="mr-2">${
                      translations[state.currentLanguage].thinking
                    }</span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            `;
    }

    messageDiv.appendChild(bubble);
    elements.chatContainer.appendChild(messageDiv);

    // Scroll to bottom
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
  }

  // Update an existing message
  function updateMessage(messageId, content) {
    const messageDiv = document.getElementById(messageId);
    if (!messageDiv) return;

    const bubble = messageDiv.querySelector("div");
    bubble.className = `max-w-3xl rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-700`;
    bubble.innerHTML = formatMessageContent(content);

    // Scroll to bottom
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
  }

  // Format message content (markdown, links, etc.)
  function formatMessageContent(content) {
    // Simple formatting - in a real app you'd use a proper markdown parser
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">$1</code>'
      ) // Inline code
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-200 dark:bg-gray-600 p-3 rounded overflow-x-auto"><code>$1</code></pre>'
      ) // Code blocks
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">$1</a>'
      ); // Links

    // Add line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
  }

  // Show a temporary message (toast)
  function showMessage(type, text) {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
      type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    } z-50 slide-in`;
    toast.textContent = text;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("slide-in");
      toast.classList.add("fade-in");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Estimate tokens (very rough approximation)
  function estimateTokens(text) {
    // Rough estimation: 1 token ~= 4 characters
    return Math.ceil(text.length / 4);
  }

  // Initialize the app when DOM is loaded
  document.addEventListener("DOMContentLoaded", init);