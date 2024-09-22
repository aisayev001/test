$(document).ready(function () {
    tableau.extensions.initializeAsync().then(function () {
        console.log("Extension initialized. Fetching data...");
        loadDataAndDownload();
    }).catch(function (err) {
        console.error("Error initializing Tableau extension: ", err);
    });
});

// Function to load data from all worksheets and download it as a CSV
function loadDataAndDownload() {
    // Get all the worksheets in the dashboard
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    const worksheets = dashboard.worksheets;

    worksheets.forEach(worksheet => {
        // Get underlying data for each worksheet
        worksheet.getUnderlyingDataAsync().then(dataTable => {
            const csvData = convertToCSV(dataTable);
            // Download the data as CSV
            downloadCSV(csvData, worksheet.name);
        }).catch(err => {
            console.error("Error fetching data from worksheet: ", worksheet.name, err);
        });
    });
}

// Helper function to convert Tableau DataTable to CSV format
function convertToCSV(dataTable) {
    const fieldNames = dataTable.columns.map(col => col.fieldName);
    const dataRows = dataTable.data.map(row => row.map(cell => cell.value));

    // Create CSV content as string
    const csvContent = [fieldNames, ...dataRows].map(row => row.join(",")).join("\n");
    return csvContent;
}

// Helper function to trigger CSV download
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
