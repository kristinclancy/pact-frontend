document.querySelectorAll(".js-cross-sell").forEach((element) => {
  // Set up slider
  const viewport = element.querySelector(".js-viewport");
  const prevButton = element.querySelector(".js-prev");
  const nextButton = element.querySelector(".js-next");

  if (!viewport || !prevButton || !nextButton) {
    return;
  }

  const emblaApi = EmblaCarousel(viewport, {
    loop: false,
    align: "start",
  });

  const updateButtons = () => {
    prevButton.disabled = !emblaApi.canScrollPrev();
    nextButton.disabled = !emblaApi.canScrollNext();
  };

  prevButton.addEventListener("click", () => emblaApi.scrollPrev());
  nextButton.addEventListener("click", () => emblaApi.scrollNext());

  emblaApi.on("select", updateButtons);
  emblaApi.on("reInit", updateButtons);

  updateButtons();

  // Hook up product cards

  element.querySelectorAll(".js-cs-product").forEach((product) => {
    const variantSelector = product.querySelector(".js-cs-variant-selector");
    const addBtn = product.querySelector(".js-cs-add");
    const priceElement = product.querySelector(".js-cs-price");
    const compareElement = product.querySelector(".js-cs-compare-price");

    if (!addBtn) {
      return;
    }

    // Grab selected variant and update price and add to cart button

    const updateVariant = () => {
      if (!variantSelector) {
        return;
      }

      const selectedVariant = variantSelector.selectedOptions[0];
      const variantId = selectedVariant.value;

      if (!variantId) {
        addBtn.disabled = true;
        return;
      }

      const { variantPrice, compareAtPrice, available } =
        selectedVariant.dataset;

      addBtn.disabled = available !== "true";

      if (priceElement && variantPrice) {
        priceElement.textContent = formatMoney(variantPrice);
      }

      if (compareElement) {
        if (compareAtPrice && Number(compareAtPrice) > Number(variantPrice)) {
          compareElement.textContent = formatMoney(compareAtPrice);
          compareElement.hidden = false;
        } else {
          compareElement.textContent = "";
          compareElement.hidden = true;
        }
      }
    };

    if (variantSelector) {
      variantSelector.addEventListener("change", updateVariant);
      updateVariant();
    }
  });
});

// Util function for formatting money
const formatMoney = (value) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: window.Shopify.currency.active,
  }).format(Number(value) / 100);
};
