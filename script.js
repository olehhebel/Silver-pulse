const STEP_ONE_ASSETS = {
  artwork: "./assets/welcome-rings.png",
  logo: "./assets/logo-silver-pulse.png"
};

const STEP_TWO_ASSETS = {
  bgImage: "./assets/signin-hero.png",
  googleIcon: "./assets/google-icon.png",
  appleLogo: "./assets/apple-icon.png"
};

const STEP_THREE_ASSETS = {
  artwork: "./assets/intro-visual.png"
};

const STEP_FOUR_ASSETS = {
  bgImage: "./assets/feature-tour-focus.png"
};

const STEP_FIVE_ASSETS = {
  bgImage: "./assets/feature-tour-journal.png"
};

const STEP_SIX_ASSETS = {
  bgImage: "./assets/screen-6-bg.png",
  pagination: "./assets/screen-6-pagination.png"
};

const STEP_SEVEN_ASSETS = {
  okay: "./assets/mood-okay.png",
  lonely: "./assets/mood-lonely.png",
  worried: "./assets/mood-worried.png",
  tired: "./assets/mood-tired.png"
};

const STEP_ONE_AUTO_ADVANCE_MS = 2000;
const SCREEN_TRANSITION_OUT_MS = 220;
const SCREEN_TRANSITION_IN_MS = 340;

const FEELING_OPTIONS = [
  {
    id: "okay",
    label: "I'm okay",
    image: STEP_SEVEN_ASSETS.okay,
    response: ["That's great!", "Let's make your day even brighter."]
  },
  {
    id: "lonely",
    label: "A little lonely",
    image: STEP_SEVEN_ASSETS.lonely,
    response: ["I'm here with you now.", "You don't have to feel alone today."]
  },
  {
    id: "worried",
    label: "A bit worried",
    image: STEP_SEVEN_ASSETS.worried,
    response: ["I understand.", "Let's take it slow together."]
  },
  {
    id: "tired",
    label: "Tired",
    image: STEP_SEVEN_ASSETS.tired,
    response: ["Got it. We'll keep things", "short and easy."]
  }
];

const steps = [
  {
    id: "welcome",
    label: "Welcome",
    kicker: "Step 1",
    title: "Welcome",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderWelcomeStep
  },
  {
    id: "signin",
    label: "Sign In",
    kicker: "Step 2",
    title: "Sign In",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderSignInStep
  },
  {
    id: "video-intro",
    label: "Intro",
    kicker: "Step 3",
    title: "Intro",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderVideoIntroStep
  },
  {
    id: "feature-tour-1",
    label: "Features",
    kicker: "Step 4",
    title: "Feature Tour",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderFeatureTour1Step
  },
  {
    id: "feature-tour-2",
    label: "Features 2",
    kicker: "Step 5",
    title: "Feature Tour",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderFeatureTour2Step
  },
  {
    id: "feature-tour-3",
    label: "Features 3",
    kicker: "Step 6",
    title: "Feature Tour",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderFeatureTour3Step
  },
  {
    id: "complete",
    label: "Mood",
    kicker: "Step 7",
    title: "How are you feeling today?",
    description: "",
    hideStepHeader: true,
    bodyClass: "step-body--welcome",
    renderBody: renderFeelingStep
  }
];

const appState = {
  currentStep: 0,
  selectedFeeling: null,
  dailyReminder: false,
  autoAdvanceTimer: null,
  isTransitioning: false
};

const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const progressSteps = document.getElementById("progress-steps");
const stepKicker = document.getElementById("step-kicker");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepBody = document.getElementById("step-body");
const stepContent = document.getElementById("step-content");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");

function getFeelingOption(feelingId) {
  return FEELING_OPTIONS.find((option) => option.id === feelingId) ?? null;
}

function renderFeelingCards() {
  return FEELING_OPTIONS
    .map((option) => {
      const isSelected = appState.selectedFeeling === option.id;
      const selectedClass = isSelected ? " emotion-card--selected" : "";

      return `
        <button
          class="emotion-card${selectedClass}"
          data-feeling="${option.id}"
          type="button"
          aria-pressed="${isSelected}"
          onclick="selectFeeling('${option.id}')"
        >
          <span class="emotion-card__media">
            <img class="emotion-card__image" src="${option.image}" alt="" />
          </span>
          <span class="emotion-card__label">${option.label}</span>
        </button>
      `;
    })
    .join("");
}

function renderFeelingResponse(selectedFeeling) {
  if (!selectedFeeling) {
    return "";
  }

  return selectedFeeling.response.join("<br />");
}

function renderFeelingStep() {
  const selectedFeeling = getFeelingOption(appState.selectedFeeling);
  const isFocused = Boolean(selectedFeeling);

  return `
    <section class="feeling-screen${isFocused ? " feeling-screen--focused" : ""}" aria-label="Choose your current mood" onclick="handleLastScreenTap(event)">
      <div class="feeling-screen__header">
        <h2 class="feeling-screen__title">How are you feeling today?</h2>
        <p class="feeling-screen__subtitle">This will make our chat more helpful<br />for you</p>
      </div>
      <div class="feeling-screen__choices">
        <div class="feeling-screen__grid">
          ${renderFeelingCards()}
        </div>
        <button
          class="reminder-toggle${appState.dailyReminder ? " reminder-toggle--checked" : ""}"
          type="button"
          aria-pressed="${appState.dailyReminder}"
          onclick="toggleDailyReminder()"
        >
          <span class="reminder-toggle__box">
            ${appState.dailyReminder ? `<span class="reminder-toggle__check" aria-hidden="true"></span>` : ""}
          </span>
          <span class="reminder-toggle__label">Remind me daily to stay active</span>
        </button>
      </div>
      <div class="feeling-screen__selection-layer" aria-hidden="true"></div>
      <div class="feeling-screen__focus"${isFocused ? "" : " hidden"}>
        <article class="feeling-focus-card" aria-hidden="true">
          <div class="feeling-focus-card__media">
            <img class="feeling-focus-card__image" src="${selectedFeeling ? selectedFeeling.image : ""}" alt="" />
          </div>
          <p class="feeling-focus-card__label">${selectedFeeling ? selectedFeeling.label : ""}</p>
        </article>
        <p class="feeling-focus-card__response">${renderFeelingResponse(selectedFeeling)}</p>
      </div>
      <p class="feeling-screen__status" aria-live="polite">${renderFeelingResponse(selectedFeeling)}</p>
    </section>
  `;
}

function selectFeeling(feelingId) {
  const feelingScreen = stepBody.querySelector(".feeling-screen");
  const sourceCard = feelingScreen?.querySelector(`[data-feeling="${feelingId}"]`);

  if (!feelingScreen || !sourceCard || appState.selectedFeeling === feelingId) {
    appState.selectedFeeling = feelingId;
    syncFeelingSelection();
    return;
  }

  animateFeelingSelection(feelingId, sourceCard, feelingScreen);
}

function toggleDailyReminder() {
  appState.dailyReminder = !appState.dailyReminder;
  syncFeelingSelection();
}

function animateFeelingSelection(feelingId, sourceCard, feelingScreen) {
  const selectionLayer = feelingScreen.querySelector(".feeling-screen__selection-layer");

  if (!selectionLayer || feelingScreen.classList.contains("feeling-screen--animating")) {
    appState.selectedFeeling = feelingId;
    syncFeelingSelection();
    return;
  }

  const screenRect = feelingScreen.getBoundingClientRect();
  const sourceRect = sourceCard.getBoundingClientRect();
  const scaleRatio = feelingScreen.clientWidth / 375;
  const flyingCard = sourceCard.cloneNode(true);
  let finalized = false;

  selectionLayer.innerHTML = "";
  selectionLayer.append(flyingCard);
  feelingScreen.classList.add("feeling-screen--animating");

  feelingScreen.querySelectorAll(".emotion-card").forEach((card) => {
    if (card !== sourceCard) {
      card.classList.add("emotion-card--ghosted");
    }
  });

  flyingCard.className = "emotion-card emotion-card--flight";
  flyingCard.removeAttribute("onclick");
  flyingCard.style.setProperty("--flight-scale", String(scaleRatio));
  flyingCard.style.left = `${sourceRect.left - screenRect.left}px`;
  flyingCard.style.top = `${sourceRect.top - screenRect.top}px`;
  flyingCard.style.width = `${sourceRect.width}px`;
  flyingCard.style.height = `${sourceRect.height}px`;

  const finalizeSelection = () => {
    if (finalized) {
      return;
    }

    finalized = true;
    appState.selectedFeeling = feelingId;
    feelingScreen.classList.remove("feeling-screen--animating");
    selectionLayer.innerHTML = "";
    syncFeelingSelection();
  };

  requestAnimationFrame(() => {
    flyingCard.classList.add("emotion-card--flight-active");
    flyingCard.style.left = `${86 * scaleRatio}px`;
    flyingCard.style.top = `${261 * scaleRatio}px`;
    flyingCard.style.width = `${220 * scaleRatio}px`;
    flyingCard.style.height = `${308 * scaleRatio}px`;
  });

  flyingCard.addEventListener("transitionend", finalizeSelection, { once: true });
  window.setTimeout(finalizeSelection, 700);
}

function syncFeelingSelection() {
  const feelingScreen = stepBody.querySelector(".feeling-screen");
  const selectedFeeling = getFeelingOption(appState.selectedFeeling);

  if (!feelingScreen) {
    return;
  }

  feelingScreen.style.setProperty("--screen-scale", String(feelingScreen.clientWidth / 375));
  feelingScreen.dataset.selectedFeeling = selectedFeeling ? selectedFeeling.id : "";
  feelingScreen.classList.toggle("feeling-screen--focused", Boolean(selectedFeeling));

  const focusPanel = feelingScreen.querySelector(".feeling-screen__focus");
  const focusImage = feelingScreen.querySelector(".feeling-focus-card__image");
  const focusLabel = feelingScreen.querySelector(".feeling-focus-card__label");
  const focusResponse = feelingScreen.querySelector(".feeling-focus-card__response");
  const status = feelingScreen.querySelector(".feeling-screen__status");
  const reminderToggle = feelingScreen.querySelector(".reminder-toggle");

  if (focusPanel && focusImage && focusLabel && focusResponse) {
    if (selectedFeeling) {
      focusPanel.hidden = false;
      focusImage.src = selectedFeeling.image;
      focusLabel.textContent = selectedFeeling.label;
      focusResponse.innerHTML = renderFeelingResponse(selectedFeeling);
    } else {
      focusPanel.hidden = true;
      focusImage.removeAttribute("src");
      focusLabel.textContent = "";
      focusResponse.innerHTML = "";
    }
  }

  if (status) {
    status.innerHTML = renderFeelingResponse(selectedFeeling);
  }

  if (reminderToggle) {
    reminderToggle.classList.toggle("reminder-toggle--checked", appState.dailyReminder);
    reminderToggle.setAttribute("aria-pressed", String(appState.dailyReminder));

    const reminderBox = reminderToggle.querySelector(".reminder-toggle__box");

    if (reminderBox) {
      reminderBox.innerHTML = appState.dailyReminder
        ? `<span class="reminder-toggle__check" aria-hidden="true"></span>`
        : "";
    }
  }

  feelingScreen.querySelectorAll(".emotion-card").forEach((card) => {
    const isSelected = card.dataset.feeling === appState.selectedFeeling;
    card.classList.toggle("emotion-card--selected", isSelected);
    card.classList.remove("emotion-card--ghosted");
    card.setAttribute("aria-pressed", String(isSelected));
  });
}

function renderFeatureTour1Step() {
  return `
    <section class="feature-tour-screen" aria-label="Feature tour step 1">
      <img class="feature-tour-screen__bg" src="${STEP_FOUR_ASSETS.bgImage}" alt="" aria-hidden="true" />
      <button class="feature-tour-screen__cta" type="button" onclick="goNext()">NEXT</button>
      <div class="feature-tour-screen__pagination" aria-label="Page 1 of 3" role="img">
        <span class="feature-tour-screen__dot feature-tour-screen__dot--active"></span>
        <span class="feature-tour-screen__dot"></span>
        <span class="feature-tour-screen__dot"></span>
      </div>
    </section>
  `;
}

function renderFeatureTour2Step() {
  return `
    <section class="feature-tour-screen" aria-label="Feature tour step 2">
      <img class="feature-tour-screen__bg" src="${STEP_FIVE_ASSETS.bgImage}" alt="" aria-hidden="true" />
      <button class="feature-tour-screen__cta" type="button" onclick="goNext()">NEXT</button>
      <div class="feature-tour-screen__pagination feature-tour-screen__pagination--accent" aria-label="Page 2 of 3" role="img">
        <span class="feature-tour-screen__dot"></span>
        <span class="feature-tour-screen__dot feature-tour-screen__dot--active"></span>
        <span class="feature-tour-screen__dot"></span>
      </div>
    </section>
  `;
}

function renderFeatureTour3Step() {
  return `
    <section class="feature-tour-screen" aria-label="Feature tour step 3">
      <img class="feature-tour-screen__bg" src="${STEP_SIX_ASSETS.bgImage}" alt="" aria-hidden="true" />
      <button class="feature-tour-screen__cta" type="button" onclick="goNext()">NEXT</button>
      <div class="feature-tour-screen__pagination feature-tour-screen__pagination--image" aria-label="Page 3 of 3" role="img">
        <img class="feature-tour-screen__pagination-image" src="${STEP_SIX_ASSETS.pagination}" alt="" aria-hidden="true" />
      </div>
    </section>
  `;
}

function renderVideoIntroStep() {
  return `
    <section class="video-intro-screen" aria-label="Introduction video">
      <img class="video-intro-screen__bg" src="${STEP_THREE_ASSETS.artwork}" alt="" aria-hidden="true" />
      <p class="video-intro-screen__caption">A calm start before your first conversation</p>
      <button class="video-intro-screen__cta" type="button" onclick="goNext()">NEXT</button>
    </section>
  `;
}

function renderSignInStep() {
  return `
    <section class="signin-screen" aria-label="Sign in">
      <img class="signin-screen__bg" src="${STEP_TWO_ASSETS.bgImage}" alt="" aria-hidden="true" />
      <h2 class="signin-screen__title">Sign in to begin your conversation</h2>
      <button class="signin-btn signin-btn--apple" type="button" onclick="goNext()">
        <img class="signin-btn__icon" src="${STEP_TWO_ASSETS.appleLogo}" alt="" width="24" height="24" />
        <span>Continue with Apple</span>
      </button>
      <button class="signin-btn signin-btn--google" type="button" onclick="goNext()">
        <img class="signin-btn__icon signin-btn__icon--google" src="${STEP_TWO_ASSETS.googleIcon}" alt="" width="25" height="26" />
        <span>Continue with Google</span>
      </button>
      <p class="signin-screen__legal">
        <span class="signin-screen__legal-light">By signing in, you agree to our</span>
        <span class="signin-screen__legal-bold">Privacy Policy, Terms of Use, and EULA</span>
      </p>
    </section>
  `;
}

function renderWelcomeStep() {
  return `
    <section class="welcome-screen" aria-label="Silver Pulse welcome screen">
      <div class="welcome-screen__art" aria-hidden="true">
        <img class="welcome-screen__artwork" src="${STEP_ONE_ASSETS.artwork}" alt="" />
      </div>
      <img class="welcome-screen__logo" src="${STEP_ONE_ASSETS.logo}" alt="Silver Pulse" />
      <p class="welcome-screen__tagline">Never alone</p>
    </section>
  `;
}

function createPlaceholderBlocks(layout) {
  return layout
    .map((size) => `<div class="placeholder-block${size === "large" ? " large" : ""}"></div>`)
    .join("");
}

function clearAutoAdvanceTimer() {
  if (appState.autoAdvanceTimer) {
    window.clearTimeout(appState.autoAdvanceTimer);
    appState.autoAdvanceTimer = null;
  }
}

function scheduleAutoAdvance() {
  clearAutoAdvanceTimer();

  if (appState.currentStep !== 0) {
    return;
  }

  appState.autoAdvanceTimer = window.setTimeout(() => {
    if (appState.currentStep === 0 && !appState.isTransitioning) {
      setCurrentStep(1, "forward");
    }
  }, STEP_ONE_AUTO_ADVANCE_MS);
}

function getScreenOffset(direction, phase) {
  if (direction === "restart") {
    return "0px";
  }

  if (direction === "backward") {
    return phase === "exit" ? "24px" : "-24px";
  }

  return phase === "exit" ? "-24px" : "24px";
}

function runStepTransition(nextIndex, direction) {
  if (nextIndex < 0 || nextIndex >= steps.length || appState.isTransitioning) {
    return;
  }

  clearAutoAdvanceTimer();
  appState.isTransitioning = true;

  const finishTransition = () => {
    appState.currentStep = nextIndex;
    renderStep();

    if (!stepBody.animate) {
      appState.isTransitioning = false;
      scheduleAutoAdvance();
      return;
    }

    stepBody.animate(
      [
        {
          opacity: 0,
          transform: `translate3d(${getScreenOffset(direction, "enter")}, 0, 0) scale(1.012)`,
          filter: "blur(5px)"
        },
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
          filter: "blur(0px)"
        }
      ],
      {
        duration: SCREEN_TRANSITION_IN_MS,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both"
      }
    );

    window.setTimeout(() => {
      appState.isTransitioning = false;
      stepBody.getAnimations().forEach((animation) => animation.cancel());
      scheduleAutoAdvance();
    }, SCREEN_TRANSITION_IN_MS);
  };

  if (!stepBody.animate) {
    finishTransition();
    return;
  }

  stepBody.animate(
    [
      {
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
        filter: "blur(0px)"
      },
      {
        opacity: 0,
        transform: `translate3d(${getScreenOffset(direction, "exit")}, 0, 0) scale(0.988)`,
        filter: "blur(5px)"
      }
    ],
    {
      duration: SCREEN_TRANSITION_OUT_MS,
      easing: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
      fill: "both"
    }
  );

  window.setTimeout(finishTransition, SCREEN_TRANSITION_OUT_MS);
}

function setCurrentStep(nextIndex, direction = "forward") {
  if (nextIndex === appState.currentStep) {
    return;
  }

  runStepTransition(nextIndex, direction);
}

function restartFlow() {
  appState.selectedFeeling = null;
  appState.dailyReminder = false;
  setCurrentStep(0, "restart");
}

function handleLastScreenTap(event) {
  if (appState.currentStep !== steps.length - 1) {
    return;
  }

  if (event.target.closest(".emotion-card") || event.target.closest(".reminder-toggle")) {
    return;
  }

  restartFlow();
}

function renderProgress(stepIndex) {
  const progressPercent = ((stepIndex + 1) / steps.length) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressLabel.textContent = `Step ${stepIndex + 1} of ${steps.length}`;

  progressSteps.innerHTML = steps
    .map((step, index) => {
      const stateClass = index < stepIndex
        ? "is-complete"
        : index === stepIndex
          ? "is-active"
          : "";

      return `<li class="progress-step ${stateClass}">${step.label}</li>`;
    })
    .join("");
}

function renderStep() {
  const step = steps[appState.currentStep];

  stepKicker.textContent = step.kicker;
  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;
  stepContent.classList.toggle("step-content--immersive", Boolean(step.hideStepHeader));
  stepKicker.hidden = Boolean(step.hideStepHeader);
  stepTitle.hidden = Boolean(step.hideStepHeader);
  stepDescription.hidden = Boolean(step.hideStepHeader);

  stepBody.className = "step-body";

  if (step.bodyClass) {
    stepBody.classList.add(step.bodyClass);
  }

  stepBody.innerHTML = step.renderBody
    ? step.renderBody()
    : `
      <div class="step-placeholder" data-step-id="${step.id}">
        ${createPlaceholderBlocks(step.layout)}
      </div>
    `;

  if (step.id === "complete") {
    syncFeelingSelection();
  }

  renderProgress(appState.currentStep);

  backButton.disabled = appState.currentStep === 0;
  nextButton.textContent = appState.currentStep === steps.length - 1 ? "Finish" : "Next";

  scheduleAutoAdvance();
}

function goNext() {
  if (appState.currentStep < steps.length - 1) {
    setCurrentStep(appState.currentStep + 1, "forward");
    return;
  }

  setCurrentStep(steps.length - 1, "forward");
}

function goBack() {
  if (appState.currentStep > 0) {
    setCurrentStep(appState.currentStep - 1, "backward");
  }
}

backButton.addEventListener("click", goBack);
nextButton.addEventListener("click", goNext);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    goNext();
  }

  if (event.key === "ArrowLeft") {
    goBack();
  }
});

renderStep();
