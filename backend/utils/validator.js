export const validateData = (
  data = [],
  requiredFields = [],
  uniqueFields = []
) => {
  const errors = [];


  if (!Array.isArray(data) || data.length === 0) {
    return [
      {
        type: "FILE",
        message: "File is empty or invalid"
      }
    ];
  }

  const headers = Object.keys(data[0]);

  requiredFields.forEach((field) => {
    if (!headers.includes(field)) {
      errors.push({
        type: "COLUMN_MISSING",
        field,
        message: `${field} column is missing`
      });
    }
  });

  data.forEach((row, index) => {
    const rowNumber = index + 1;

    requiredFields.forEach((field) => {
      const value = row[field];

      if (!value || value.toString().trim() === "") {
        errors.push({
          row: rowNumber,
          field,
          type: "REQUIRED",
          message: `${field} is missing`
        });
      }
    });


    if (
      row.Sold_Qty_UOM !== undefined &&
      row.Sold_Qty_UOM !== "" &&
      isNaN(Number(row.Sold_Qty_UOM))
    ) {
      errors.push({
        type: "INVALID_NUMBER",
        row: rowNumber,
        field: "Sold_Qty_UOM",
        message: "Quantity must be a number"
      });
    }
  });

  const seen = {};

  data.forEach((row, index) => {
    const rowNumber = index + 1;

    uniqueFields.forEach((field) => {
      let value = row[field];

      if (!value) return;

      const normalized = value.toString().trim().toLowerCase();

      if (!seen[field]) {
        seen[field] = new Set();
      }

      if (seen[field].has(normalized)) {
        errors.push({
          row: rowNumber,
          field,
          type: "DUPLICATE",
          message: `Duplicate value '${value}' found`
        });
      } else {
        seen[field].add(normalized);
      }
    });
  });
  return errors;
};