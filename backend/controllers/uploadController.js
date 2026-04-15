import { parseExcel } from '../utils/parser.js';
import { validateData } from '../utils/validator.js';
import { processData } from '../services/dataService.js';
import { REQUIRED_FIELDS, UNIQUE_FIELDS } from '../config/constants.js';

const validateFileName = (file, expectedName) => {
    debugger;
    const fileName = file.originalname.toLowerCase();

    if (!fileName.includes(expectedName.toLowerCase())) {
        throw new Error(`Wrong file uploaded in "${expectedName}" field`);
    }
};

const validateFileType = (data, requiredFields, fileName) => {
    debugger;
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`${fileName} file is empty or invalid`);
    }

    const columns = Object.keys(data[0] || {});

    const missingFields = requiredFields.filter(
        (field) => !columns.includes(field)
    );

    if (missingFields.length > 0) {
        throw new Error(
            `${fileName} file has invalid structure. Missing: ${missingFields.join(', ')}`
        );
    }
};

export const handleUpload = (req, res, next) => {
    debugger;
    try {
        if (!req.files) {
            throw new Error("Files not uploaded");
        }

        const existingFile = req.files['existing']?.[0];
        const newFile = req.files['new']?.[0];
        const salesFile = req.files['sales']?.[0];

        if (!existingFile || !newFile || !salesFile) {
            throw new Error("All three files are required");
        }

        validateFileName(existingFile, "existing");
        validateFileName(newFile, "new");
        validateFileName(salesFile, "sales");

        const existingData = parseExcel(existingFile.path);
        const newData = parseExcel(newFile.path);
        const salesData = parseExcel(salesFile.path);

        validateFileType(existingData, REQUIRED_FIELDS.EXISTING, "EXISTING");
        validateFileType(newData, REQUIRED_FIELDS.NEW, "NEW");
        validateFileType(salesData, REQUIRED_FIELDS.SALES, "SALES");

        const existingErrors = validateData(
            existingData,
            REQUIRED_FIELDS.EXISTING,
            UNIQUE_FIELDS.EXISTING
        );

        const newErrors = validateData(
            newData,
            REQUIRED_FIELDS.NEW,
            UNIQUE_FIELDS.NEW
        );

        const salesErrors = validateData(
            salesData,
            REQUIRED_FIELDS.SALES
        );

        if (
            existingErrors.length > 0 ||
            newErrors.length > 0 ||
            salesErrors.length > 0
        ) {
            return res.status(400).json({
                success: false,
                validation: {
                    existingErrors,
                    newErrors,
                    salesErrors
                }
            });
        }

        const result = processData(existingData, newData, salesData);

        return res.json({
            success: true,
            preview: {
                existing: existingData,
                new: newData,
                sales: salesData
            },
            result
        });

    } catch (err) {
        next(err);
    }
};