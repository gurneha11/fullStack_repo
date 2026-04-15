import xlsx from 'xlsx';

export const parseExcel = (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);

        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            throw new Error("No sheets found in Excel file");
        }

        const sheet = workbook.Sheets[sheetName];

        const data = xlsx.utils.sheet_to_json(sheet, {
            defval: "",       
            raw: false,       
            trim: true        
        });

        return data;

    } catch (error) {
        console.error("Error parsing Excel:", error.message);
        throw new Error("Failed to parse Excel file");
    }
};