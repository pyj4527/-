const homeTapBox = document.getElementById('box-nav-home');
if (homeTapBox) {
    homeTapBox.addEventListener('click', () => {
        window.location.href = '../main/main.html';
    });
}
const mapTabBox = document.getElementById('box-nav-map');
  if (mapTabBox) {
    mapTabBox.addEventListener('click', () => {
      window.location.href = '../map/map.html';
    });
  }

const saveTabBox = document.getElementById('box-nav-save');
  if (saveTabBox) {
    saveTabBox.addEventListener('click', () => {
      window.location.href = '../map/map.html';
    });
  }

const languageSetting = document.getElementById("languageSetting");
const languageSheet = document.getElementById("languageSheet");
const languageClose = document.getElementById("languageClose");
const selectedLanguage = document.getElementById("selectedLanguage");
const languageOptions = document.querySelectorAll(".language-option");
const languageStorageKey = "seonyulLanguage";

function setLanguage(language) {
  if (selectedLanguage) {
    selectedLanguage.textContent = language;
  }

  languageOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.language === language);
  });
}

function openLanguageSheet() {
  languageSheet?.classList.remove("hidden");
  languageSheet?.setAttribute("aria-hidden", "false");
}

function closeLanguageSheet() {
  languageSheet?.classList.add("hidden");
  languageSheet?.setAttribute("aria-hidden", "true");
}

setLanguage(localStorage.getItem(languageStorageKey) || "한국어");

languageSetting?.addEventListener("click", openLanguageSheet);
languageClose?.addEventListener("click", closeLanguageSheet);
languageSheet?.addEventListener("click", (event) => {
  if (event.target === languageSheet) {
    closeLanguageSheet();
  }
});

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const language = option.dataset.language;
    localStorage.setItem(languageStorageKey, language);
    setLanguage(language);
    closeLanguageSheet();
  });
});
