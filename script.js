const cards = Array.from(document.querySelectorAll(".stack-card"));
    const positions = ["is-back", "is-main", "is-front"];
    let galleryImages = [];
    let nextImageIndex = 0;
    const fallbackImages = [
      { src: "img/aicanvas-ai-generated-8670480_1920.jpg", alt: "Imagen 1" },
      { src: "img/aicanvas-ai-generated-8670542_1920.jpg", alt: "Imagen 2" },
      { src: "img/alexandra_koch-woman-8439946_1920.png", alt: "Imagen 3" },
      { src: "img/myshoun-ai-generated-8527254_1920.jpg", alt: "Imagen 4" },
      { src: "img/thedigitalartist-ai-generated-8649788_1920.jpg", alt: "Imagen 5" }
    ];

    async function loadLocalImages() {
      try {
        const response = await fetch(`img/manifest.json?ts=${Date.now()}`);

        if (!response.ok) {
          throw new Error("No se pudo cargar el manifest de imagenes");
        }

        const manifest = await response.json();
        const localImages = (manifest.images || [])
          .filter((item) => item && item.src)
          .map((item, index) => ({
            src: item.src,
            alt: item.alt || `Imagen ${index + 1}`
          }));

        applyImages(localImages.length ? localImages : fallbackImages);
      } catch (error) {
        applyImages(fallbackImages);
      }
    }

    function applyImages(imageList) {
      galleryImages = shuffleArray(imageList);

      cards.forEach((card, index) => {
        const image = galleryImages[index % galleryImages.length];
        card.src = image.src;
        card.alt = image.alt;
      });

      nextImageIndex = cards.length % galleryImages.length;
    }

    function shuffleArray(items) {
      const shuffled = [...items];

      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
      }

      return shuffled;
    }

    loadLocalImages();

    setInterval(() => {
      if (!galleryImages.length) {
        return;
      }

      const current = cards.map((card) =>
        positions.find((position) => card.classList.contains(position))
      );

      cards.forEach((card, index) => {
        card.classList.remove(...positions);
        card.classList.add(current[(index + 1) % current.length]);
      });

      const enteringCard = cards.find((card) => card.classList.contains("is-back"));

      if (enteringCard) {
        const nextImage = galleryImages[nextImageIndex % galleryImages.length];
        enteringCard.src = nextImage.src;
        enteringCard.alt = nextImage.alt;
        nextImageIndex += 1;
      }
    }, 4200);