$(document).ready(function () {
    // Bind the button click event to load data
    $('#downloadButton').click(function () {
        loadDataAndDownload();
    });
});

function loadDataAndDownload() {
    tableau.extensions.initializeAsync().then(function () {
        console.log("Extension initialized. Fetching data...");

        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const worksheets = dashboard.worksheets;

        worksheets.forEach(worksheet => {
            worksheet.getUnderlyingDataAsync().then(dataTable => {
                const csvData = convertToCSV(dataTable);
                downloadCSV(csvData, worksheet.name);
            }).catch(err => {
                console.error("Error fetching data from worksheet:", worksheet.name, err);
            });
        });
    }).catch(function (err) {
        console.error("Error initializing Tableau extension:", err);
    });
}

function convertToCSV(dataTable) {
    const fieldNames = dataTable.columns.map(col => col.fieldName);
    const dataRows = dataTable.data.map(row => row.map(cell => cell.value));
    return [fieldNames, ...dataRows].map(row => row.join(",")).join("\n");
}

function downloadCSV(csvData, worksheetName) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", worksheetName + "_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
