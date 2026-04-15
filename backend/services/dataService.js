const buildMap = (data, key) => {
  const map = new Map();
  debugger;
  for (const row of data) {
    const value = row?.[key];
    if (value) map.set(value, row);
  }
  return map;
};

const aggregateSales = (data) => {
  debugger;
  const salesMap = new Map();

  for (const row of data) {
    const sku = row?.Product_SKU;
    const qty = Number(row?.Sold_Qty_UOM) || 0;

    if (!sku) continue;

    salesMap.set(sku, (salesMap.get(sku) || 0) + qty);
  }

  return salesMap;
};

const linkComponents = (existingMap, newMap) => {
  debugger;
  const linked = [];
  const unmatchedExisting = [];
  const unmatchedNew = [];

  const allIds = new Set([
    ...existingMap.keys(),
    ...newMap.keys()
  ]);

  for (const id of allIds) {
    const existing = existingMap.get(id);
    const newItem = newMap.get(id);

    if (existing && newItem) {
      linked.push({
        Component_ID: id,
        existing,
        new: newItem
      });
    } else if (existing) {
      unmatchedExisting.push({
        Product_SKU: existing.Product_SKU,
        Component_ID: existing.Component_ID
      });
    } else if (newItem) {
      unmatchedNew.push({
        Component_ID: newItem.Component_ID
      });
    }
  }

  return { linked, unmatchedExisting, unmatchedNew };
};

const buildMatchedRecords = (linked, salesMap) => {
  debugger;
  return linked.map((item) => {
    const sku =
      item?.existing?.Product_SKU ||
      item?.new?.Product_SKU;

    //const hasSales = sku && salesMap.has(sku);

    return {
      Component_ID: item.Component_ID,
      Product_SKU: sku || null,
      //hasSales,
    };
  });
};

const groupBySKU = (linked, salesMap) => {
  debugger;
  const skuMap = new Map();

  for (const item of linked) {
    const sku =
      item?.existing?.Product_SKU ||
      item?.new?.Product_SKU;

    if (!sku) continue;

    let sales = salesMap.get(sku) || 0
    if (sales == 0) continue;

    if (!skuMap.has(sku)) {
      skuMap.set(sku, {
        Product_SKU: sku,
        totalSales: sales,
        components: []
      });
    }

    skuMap.get(sku).components.push(item.Component_ID);
  }

  return Array.from(skuMap.values()).map((group) => ({
    Product_SKU: group.Product_SKU,
    totalSales: group.totalSales,
    Component_ID: group.components.join(", ") // ✅ Clean output
  }));
};

const getUnmatchedSales = (groupedData, salesMap) => {
  debugger;
  const usedSkus = new Set(
    groupedData.map((item) => item.Product_SKU)
  );

  const unmatched = [];

  for (const [sku, total] of salesMap.entries()) {
    if (!usedSkus.has(sku)) {
      unmatched.push({
        Product_SKU: sku,
        totalSales: total
      });
    }
  }

  return unmatched;
};

export const processData = (
  existingData = [],
  newData = [],
  salesData = []
) => {
  debugger;

  const existingMap = buildMap(existingData, "Component_ID");
  const newMap = buildMap(newData, "Component_ID");

  const salesMap = aggregateSales(salesData);

  const {
    linked,
    unmatchedExisting,
    unmatchedNew
  } = linkComponents(existingMap, newMap);

  const matchedRecords = buildMatchedRecords(linked, salesMap);
  const finalLinked = groupBySKU(linked, salesMap);
  const unmatchedSales = getUnmatchedSales(finalLinked, salesMap);
  debugger;

  return {
    matchedRecords,
    finalLinked,
    unmatchedExisting,
    unmatchedNew,
    unmatchedSales
  };
};