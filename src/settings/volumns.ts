document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingvolumnsBtn') as HTMLButtonElement;
    const settingsMenu = document.getElementById('settingsMenuVolumn') as HTMLDivElement;
    const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
    const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement;
  
    // Toggle menu
    settingsBtn.addEventListener('click', () => {
      settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
    });
  
    // Set initial volume
    bgMusic.volume = parseFloat(volumeSlider.value);
  
    // Update volume on slider input
    volumeSlider.addEventListener('input', () => {
      bgMusic.volume = parseFloat(volumeSlider.value);
    });
  
    // Fix autoplay issue (start when user clicks anywhere)
    document.body.addEventListener(
      'click',
      () => {
        if (bgMusic.paused) {
          bgMusic.play().catch((e) => console.log("Can't autoplay music:", e));
        }
      },
      { once: true }
    );
  });
  