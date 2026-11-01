const ExcelJS = require('exceljs');
const path = require('path');

// Helper method to extract Excel formula results
function getCellValue(cell) {

    const value = cell.value;

    // Check whether the cell contains a formula
    if (
        value &&
        typeof value === 'object' &&
        Object.prototype.hasOwnProperty.call(value, 'formula')
    ) {

        // Check whether the formula result is available
        if (value.result === undefined || value.result === null) {

            throw new Error(
                `Formula result is missing in Excel cell ${cell.address}. Please recalculate and save the Excel workbook.`
            );

        }

        // Return the calculated formula result
        return value.result;
    }

    // Return normal Excel cell value
    return value;
}


async function getPaymentData(requestJson, sheetName, testCaseNo, testDataNo) {

    const workbook = new ExcelJS.Workbook();

    const filePath = path.join(
        process.cwd(),
        'test-data',
        'TestData.xlsx'
    );

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) {
        throw new Error('Worksheet not found: ' + sheetName);
    }

    const headers = worksheet.getRow(1).values;

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {

        const row = worksheet.getRow(rowNumber);

        const data = {};

        for (
            let columnNumber = 1;
            columnNumber < headers.length;
            columnNumber++
        ) {

            const header = headers[columnNumber];

            if (header) {

                const columnName = String(header).trim();

                const value = getCellValue(row.getCell(columnNumber));

                if (value == null) {
                    data[columnName] = '';
                } else if (typeof value === 'string') {
                    data[columnName] = value.trim();
                } else {
                    data[columnName] = value;
                }
            }
        }

        if (
            String(data.TC_NO).trim() === String(testCaseNo).trim() &&
            String(data.TD_NO).trim() === String(testDataNo).trim()
        ) {

            data.REQUESTJSON = requestJson;

            return data;
        }
    }

    throw new Error(
        'No Excel row found for ' +
        testCaseNo + '/' + testDataNo
    );
}

module.exports = { getPaymentData };