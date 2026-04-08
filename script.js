const steps = [
  {
    id: "welcome",
    label: "Welcome",
    kicker: "Step 1",
    title: "Welcome screen shell",
    description: "Entry point for the onboarding sequence. Use this step to introduce the product and orient the user before collecting details.",
    layout: ["large", "default", "default"]
  },
  {
    id: "profile",
    label: "Profile",
    kicker: "Step 2",
    title: "Profile setup shell",
    description: "Placeholder structure for identity or account details. Visual design and actual form fields can be added later from Figma.",
    layout: ["default", "default", "large"]
  },
  {
    id: "preferences",
    label: "Preferences",
    kicker: "Step 3",
    title: "Preferences shell",
    description: "Reserved for user preferences, options, or personalization choices within the onboarding flow.",
    layout: ["default", "large", "default"]
  },
  {
    id: "permissions",
    label: "Permissions",
    kicker: "Step 4",
    title: "Permissions shell",
    description: "Architecture placeholder for consent, notifications, or permission-related screens before activation.",
    layout: ["large", "default"]
  },
  {
    id: "summary",
    label: "Summary",
    kicker: "Step 5",
    title: "Summary review shell",
    description: "Use this screen to review choices gathered in earlier steps. The current build only provides the navigation scaffold.",
    layout: ["default", "default", "default", "large"]
  },
  {
    id: "complete",
    label: "Complete",
    kicker: "Step 6",
    title: "Completion shell",
    description: "Final confirmation screen for the onboarding flow. Replace this placeholder with final visuals and call-to-action content later.",
    layout: ["large", "default"]
  }
];

const appState = {
  currentStep: 0
};

const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const progressSteps = document.getElementById("progress-steps");
const stepKicker = document.getElementById("step-kicker");
const stepTitle = document.getElementById("step-title");
const stepDescription = document.getElementById("step-description");
const stepBody = document.getElementById("step-body");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");

function createPlaceholderBlocks(layout) {
  return layout
    .map((size) => `<div class="placeholder-block${size === "large" ? " large" : ""}"></div>`)
    .join("");
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
  stepBody.innerHTML = `
    <div class="step-placeholder" data-step-id="${step.id}">
      ${createPlaceholderBlocks(step.layout)}
    </div>
  `;

  renderProgress(appState.currentStep);

  backButton.disabled = appState.currentStep === 0;
  nextButton.textContent = appState.currentStep === steps.length - 1 ? "Finish" : "Next";
}

function goNext() {
  if (appState.currentStep < steps.length - 1) {
    appState.currentStep += 1;
    renderStep();
    return;
  }

  appState.currentStep = steps.length - 1;
  renderStep();
}

function goBack() {
  if (appState.currentStep > 0) {
    appState.currentStep -= 1;
    renderStep();
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
