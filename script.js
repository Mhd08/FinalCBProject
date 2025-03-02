let isLightMode = localStorage.getItem('isLightMode') === 'false';
const contentWrapper = document.querySelector('.content-wrapper');
const lightModeButton = document.querySelector('.light-mode-button');
const themeIcon = document.getElementById('theme-icon');

function changeTheme() {
  if (isLightMode) {
    switchToLightMode();
  } else {
    switchToDarkMode();
  }
}

function switchToLightMode() {
  contentWrapper.classList.add('light-mode');
  lightModeButton.classList.add('light-mode');
  
  themeIcon.src = 'moon-solid.svg';

  isLightMode = !isLightMode;
  localStorage.setItem('isLightMode', isLightMode);
}

function switchToDarkMode() {
  contentWrapper.classList.remove('light-mode');
  lightModeButton.classList.remove('light-mode');
  
  themeIcon.src = 'sun-solid.svg';

  isLightMode = !isLightMode;
  localStorage.setItem('isLightMode', isLightMode);
}

document.addEventListener('DOMContentLoaded', () => {
  if (isLightMode) {
    switchToLightMode();
  } else {
    switchToDarkMode();
  }
});
