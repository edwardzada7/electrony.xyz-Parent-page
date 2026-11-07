function calculateSolarPackagePricing(solarPackage, products) {
  if (!solarPackage || !Array.isArray(solarPackage.components) || !Array.isArray(products)) {
    throw new TypeError("Solar package components and the energy product catalogue are required.");
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const lines = solarPackage.components.map((component) => {
    if (!Number.isSafeInteger(component.quantity) || component.quantity <= 0) {
      throw new RangeError(`Invalid quantity for ${component.model || component.category}.`);
    }

    const product = component.productId ? productsById.get(component.productId) : null;
    if (component.productId && !product) {
      throw new Error(`Unknown catalogue product "${component.productId}" in solar package "${solarPackage.id}".`);
    }
    const unitPriceNgn = product?.priceNgn ?? null;
    if (unitPriceNgn !== null && (!Number.isSafeInteger(unitPriceNgn) || unitPriceNgn <= 0)) {
      throw new RangeError(`Invalid catalogue price for ${product.brand} ${product.model}.`);
    }
    const lineTotalNgn = unitPriceNgn === null ? null : unitPriceNgn * component.quantity;
    if (lineTotalNgn !== null && !Number.isSafeInteger(lineTotalNgn)) {
      throw new RangeError(`Line total exceeds safe integer precision for ${product.brand} ${product.model}.`);
    }

    return {
      component,
      product,
      manufacturer: product?.brand || component.manufacturer || "Manufacturer to confirm",
      model: product?.model || component.model,
      unitPriceNgn,
      lineTotalNgn
    };
  });

  const pricedLines = lines.filter((line) => line.lineTotalNgn !== null);
  const unpricedLines = lines.filter((line) => line.lineTotalNgn === null);
  const subtotalNgn = pricedLines.length
    ? pricedLines.reduce((total, line) => total + line.lineTotalNgn, 0)
    : null;
  if (subtotalNgn !== null && !Number.isSafeInteger(subtotalNgn)) {
    throw new RangeError(`Component subtotal exceeds safe integer precision for solar package "${solarPackage.id}".`);
  }
  const complete = unpricedLines.length === 0;

  return {
    lines,
    subtotalNgn,
    totalNgn: complete ? subtotalNgn : null,
    complete,
    unpricedLines
  };
}

window.ElectronyEnergyPricing = Object.freeze({ calculateSolarPackagePricing });
