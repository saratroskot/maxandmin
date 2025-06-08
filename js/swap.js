document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".item").forEach(el => {
    let variants;
    try {
      variants = JSON.parse(el.dataset.variants);
    } catch (e) {
      console.error("Invalid JSON in data-variants for", el.id);
      return;
    }
    let currentIndex = 0;

    el.addEventListener("click", ev => {
      ev.preventDefault();
      currentIndex = (currentIndex + 1) % variants.length;
      el.src = variants[currentIndex];
      el.blur();  
    });
  });

  requestAnimationFrame(() => {
    document.body.classList.add("fade-in");
  });

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const roomEl = document.getElementById("room");
      if (!roomEl) {
        console.error("#room element not found");
        return;
      }

      const prevTransform = roomEl.style.transform;
      roomEl.style.transform = "none";

      const width  = roomEl.offsetWidth;
      const height = roomEl.offsetHeight;

      html2canvas(roomEl, {
        useCORS: true,
        allowTaint: false,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        scale: window.devicePixelRatio
      })
      .then(canvas => {
        roomEl.style.transform = prevTransform;

        canvas.toBlob(blob => {
          const link = document.createElement("a");
          const page = window.location.pathname;
link.download = page.includes("fashion") ? "my_outfit.png" : "my_room.png";

          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        });
      })
      .catch(err => {
        roomEl.style.transform = prevTransform;
        console.error("html2canvas error:", err);
      });
    });
  }
});
