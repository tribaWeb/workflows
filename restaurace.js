function toggleMenu() {
    const menu = document.getElementById('floatingMenu');
    const content = menu.querySelector('.menu-content');
    const arrow = menu.querySelector('.toggle-arrow');

    if (content.style.display === 'none' || !content.style.display) {
      content.style.display = 'block';
      arrow.innerHTML = '&#9654;'; // Změní šipku na "zavírací"
      menu.style.transform = 'translateX(-100%)';
    } else {
      content.style.display = 'none';
      arrow.innerHTML = '&#9664;'; // Změní šipku na "otevření"
      menu.style.transform = 'translateX(0)';
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".menu-track");
    const pages = document.querySelectorAll(".menu-page");
    const pagination = document.getElementById("pagination");
  
    // Vytvoření tlačítek pro stránkování
    pages.forEach((_, index) => {
      const button = document.createElement("button");
      button.textContent = index + 1;
      button.addEventListener("click", () => {
        updateSlider(index);
      });
      if (index === 0) button.classList.add("active");
      pagination.appendChild(button);
    });
  
    const updateSlider = (index) => {
      const offset = -index * 100; // Posun podle aktuální stránky
      track.style.transform = `translateX(${offset}%)`;
  
      // Aktualizace aktivního tlačítka
      document.querySelectorAll("#pagination button").forEach((btn, btnIndex) => {
        btn.classList.toggle("active", btnIndex === index);
      });
    };
  });
  function goHome() {
    window.location.href = "main.html"; // Změň "home.html" na cestu k cílové stránce
  }
    