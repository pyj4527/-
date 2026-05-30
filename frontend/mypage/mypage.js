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
