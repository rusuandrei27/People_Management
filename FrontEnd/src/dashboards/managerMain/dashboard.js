const { jsPDF } = window.jspdf;
import api from "../../ApiClient.js";

let savedUserData = localStorage.getItem("userData");

document.addEventListener("DOMContentLoaded", () => {
    if (savedUserData) {
        savedUserData = JSON.parse(savedUserData);

        if (savedUserData.token && savedUserData.idEnterpriseXuser) {
            showDashboard();
        } else {
            goToLoginPage("You have been logged out", "Please login again in the platform").show();
        }
    } else {
        goToLoginPage("You have been logged out", "Please login again in the platform").show();
    }
});

function showDashboard() {

    // show or hide overlay:
    const burgerBtn = document.getElementById("burgerBtn");
    const burgerDropdown = document.getElementById("burgerDropdown");
    const overlay = document.getElementById("overlay");

    burgerBtn.addEventListener("click", () => {
        const isOpen = burgerDropdown.style.display === "block";
        burgerDropdown.style.display = isOpen ? "none" : "block";
        overlay.style.display = isOpen ? "none" : "block";
    });

    window.addEventListener("click", (e) => {
        if (!burgerBtn.contains(e.target) && !burgerDropdown.contains(e.target)) {
            burgerDropdown.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // logout functionality:
    $("#logout").on("click", function () {
        localStorage.clear();
        window.location.href = "../../index.html";
    });

    $("#userConfiguration").on("click", function () {
        window.location.href = "../employeeConfiguration/dashboard.html";
    });

    // name and address:
    const firstName = savedUserData ? savedUserData.firstName : "";
    const cityName = savedUserData ? savedUserData.cityName : "";
    const street = savedUserData ? savedUserData.street : "";
    const streetNo = savedUserData ? savedUserData.streetNo : "";

    if (firstName) {
        $('#user-name').text(firstName);

        const h = new Date().getHours();
        if (h >= 5 && h < 12) {
            $('#greeting').html(`Morning, <span>${firstName}</span> 🌤️`);
        } else if (h >= 12 && h < 19) {
            $('#greeting').html(`Hi, <span>${firstName}</span> ☀️`);
        } else {
            $('#greeting').html(`Evening, <span>${firstName}</span> 🌙`);
        }
    }

    if (cityName && street && streetNo) {
        $('#salon-address').text(cityName + ", " + street + ", " + streetNo);
    }

    // analysis range:
    let startDateRevenueValue = new Date();
    let endDateRevenueValue = new Date();

    $('#startDateRevenue').dxDateBox({
        pickerType: window.innerWidth <= 800 ? "rollers" : "date",
        label: 'Start Date',
        labelMode: 'outside',
        value: new Date(),
        showClearButton: true,
        displayFormat: "dd/MM/yyyy",
        onValueChanged: function (e) {
            if (!e || !e.value || !endDateRevenueValue) {
                DevExpress.ui.notify("Complete both dates in order to dispay revenues", "warning", 2500);
                return;
            }

            const currentDate = new Date(e.value);
            startDateRevenueValue = currentDate;

            if (currentDate > endDateRevenueValue) {
                DevExpress.ui.notify("Start Date is higher than End Date", "error", 3000);
                return;
            }

            modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue);
        }
    });

    $('#endDateRevenue').dxDateBox({
        pickerType: window.innerWidth <= 800 ? "rollers" : "datetime",
        label: 'End Date',
        labelMode: 'outside',
        value: new Date(),
        showClearButton: true,
        displayFormat: "dd/MM/yyyy",
        onValueChanged: function (e) {
            endDateRevenueValue = e.value;
            if (!e || !e.value || !endDateRevenueValue) {
                DevExpress.ui.notify("Complete both dates in order to dispay revenues", "warning", 2500);
                return;
            }

            const currentDate = new Date(e.value);
            endDateRevenueValue = currentDate;

            if (currentDate < startDateRevenueValue) {
                DevExpress.ui.notify("End Date is lower than Start Date", "error", 3000);
                return;
            }

            modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue);
        }
    });

    // display revenue grid:
    const revenueGridInstance = $("#gridContainerRevenue").dxDataGrid({
        dataSource: [],
        key: "idRevenue",
        noDataText: "No available records for specified interval",
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        selection: { mode: "multiple" },
        showRowLines: true,
        paging: { pageSize: 10 },
        filterRow: { visible: true },
        columns: [
            {
                dataField: "startDate", caption: "Start Date", dataType: "datetime", format: "dd/MM/yyyy HH:mm", editorOptions: {
                    type: "datetime",
                    width: "100%",
                    pickerType: window.innerWidth <= 800 ? "rollers" : "datetime"
                },
                minWidth: 150,
                validationRules: [
                    { type: "required", message: "Start Date is required" }
                ]
            },
            {
                dataField: "endDate", caption: "End Date", dataType: "datetime", format: "dd/MM/yyyy HH:mm", editorOptions: {
                    type: "datetime",
                    width: "100%",
                    pickerType: window.innerWidth <= 800 ? "rollers" : "datetime"
                },
                minWidth: 150,
                validationRules: [
                    { type: "required", message: "End Date is required" }
                ]
            },
            { dataField: "cash", caption: "Cash", dataType: "number", minWidth: 130 },
            { dataField: "card", caption: "Card", dataType: "number", minWidth: 130 },
            {
                dataField: "nbClients", caption: "Number of clients", dataType: "number", minWidth: 130,
                editorOptions: {
                    showSpinButtons: true,
                    min: 0,
                    max: 1000,
                    step: 1,
                    format: "#0"
                }
            },
            {
                dataField: "note", caption: "Note", dataType: "string", minWidth: 150,
                editorType: "dxTextArea",
                editorOptions: {
                    maxLength: 500,
                    autoResizeEnabled: true
                }
            },
            { dataField: "isActive", caption: "Is Row Active ?", dataType: "boolean", defaultValue: "true", width: "100" }
        ],
        summary: {
            totalItems: [{
                showInColumn: "cash",
                name: "cash",
                summaryType: "custom",
                displayFormat: "Total cash: {0}",
                precision: 2
            }, {
                showInColumn: "card",
                name: "card",
                summaryType: "custom",
                displayFormat: "Total card: {0}",
                precision: 2
            }, {
                showInColumn: "nbClients",
                name: "nbClients",
                summaryType: "custom",
                displayFormat: "Total clients: {0}",
            }],
            calculateCustomSummary: function (options) {
                if (options.name == "cash") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            if (options.value.isActive) {
                                options.totalValue = options.totalValue + options.value.cash;
                            }
                            break;
                        case "finalize":
                            break;
                    }
                }

                if (options.name == "card") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            if (options.value.isActive) {
                                options.totalValue = options.totalValue + options.value.card;
                            }
                            break;
                        case "finalize":
                            break;
                    }
                }

                if (options.name == "nbClients") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            break;
                        case "calculate":
                            if (options.value.isActive) {
                                options.totalValue = options.totalValue + options.value.nbClients;
                            }
                            break;
                        case "finalize":
                            break;
                    }
                }


            }
        },
        export: {
            enabled: true,
            allowExportSelectedData: true,
            formats: ['pdf', 'xlsx'],
        },
        onExporting: function (e) {
            if (e && e.format == "pdf") {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component
                }).then(function () {
                    doc.save('Revenues.pdf');
                });
            } else {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Main sheet');
                DevExpress.excelExporter.exportDataGrid({
                    worksheet: worksheet,
                    component: e.component,
                    customizeCell: function (options) {
                        options.excelCell.font = { name: 'Arial', size: 12 };
                        options.excelCell.alignment = { horizontal: 'left' };
                    }
                }).then(function () {
                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Revenues.xlsx');
                    });
                });
            }
        },
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: false,
            popup: {
                title: "Modify Record",
                showTitle: true,
                width: "80%"
            }
        },
        onInitNewRow: function (e) {
            const grid = e.component;

            grid.option("columns[0].allowEditing", true);
            grid.option("columns[1].allowEditing", true);
            grid.option("columns[2].allowEditing", true);
            grid.option("columns[3].allowEditing", true);
            grid.option("columns[4].allowEditing", true);
            grid.option("columns[5].allowEditing", true);
            grid.option("columns[6].allowEditing", true);
            e.data.isActive = true;
        },
        onEditingStart: function (e) {
            const grid = e.component;

            grid.option("columns[0].allowEditing", false);
            grid.option("columns[1].allowEditing", false);
            grid.option("columns[2].allowEditing", false);
            grid.option("columns[3].allowEditing", false);
            grid.option("columns[4].allowEditing", false);
            grid.option("columns[5].allowEditing", true);
            grid.option("columns[6].allowEditing", true);
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.isActive == "0") {
                e.rowElement.addClass("inactive-row")
            }
        },
        onContentReady: async function (e) {
            if (!e || !e.component) {
                updateRevenueCard(0, 0, 0);
                return;
            }

            const startDate = $("#startDateRevenue").dxDateBox("instance").option("value");
            const endDate = $("#endDateRevenue").dxDateBox("instance").option("value");

            if (!startDate || !endDate) {
                updateRevenueCard(0, 0, 0);
                return;
            }

            const gridInstance = $("#gridContainerRevenue").dxDataGrid("instance");
            const cashTotal = gridInstance.getTotalSummaryValue("cash") || 0;
            const cardTotal = gridInstance.getTotalSummaryValue("card") || 0;
            const nbClientsTotal = gridInstance.getTotalSummaryValue("nbClients") || 0;

            updateRevenueCard(cashTotal, cardTotal, nbClientsTotal);
        },
        onRowInserting: async function (e) {
            e.cancel = true;
            const newData = e.data;

            if (!newData.startDate) {
                DevExpress.ui.notify("Start Date is mandatory!", "error", 3000);
                return;
            }

            if (!newData.endDate) {
                DevExpress.ui.notify("End Date is mandatory!", "error", 3000);
                return;
            }

            let startDate = new Date(newData.startDate);
            let endDate = new Date(newData.endDate);

            if (startDate > endDate) {
                DevExpress.ui.notify("Start Date is grater than End Date!", "error", 3000);
                return;
            }

            if (
                startDate.getFullYear() != endDate.getFullYear()
                || startDate.getMonth() != endDate.getMonth()
                || startDate.getDate() != endDate.getDate()
            ) {
                DevExpress.ui.notify("You can not add records on multiple days!", "error", 3000);
                return;
            }

            const revenue = {
                idEnterpriseXuser: savedUserData.idEnterpriseXuser,
                startDate: encodeURIComponent(startDate.toISOString()),
                endDate: encodeURIComponent(endDate.toISOString()),
                cash: newData.cash ? newData.cash : 0,
                card: newData.card ? newData.card : 0,
                note: newData.note ? newData.note : null,
                nbClients: newData.nbClients ? newData.nbClients : 0,
                isActive: newData.isActive ? "1" : "0"
            };

            const insertedRevenue = await api.post("revenue/insertRevenue", revenue, savedUserData.token);

            if (!insertedRevenue) {
                DevExpress.ui.notify("Revenue could not be inserted! Please try again!", "warning", 2000);
                return;
            }

            if (insertedRevenue.errorMessage) {
                DevExpress.ui.notify(insertedRevenue.errorMessage, "warning", 2000);
                return;
            }

            if (!insertedRevenue.ok) {
                DevExpress.ui.notify("Server could not be reached! Try again later!", "warning", 2000);
                return;
            }

            const insertedRevenueId = insertedRevenue.data ? insertedRevenue.data.idRevenue : null;

            if (!insertedRevenueId) {
                DevExpress.ui.notify("User can not be associated with this enterprise!", "warning", 2000);
                return;
            }

            DevExpress.ui.notify("Revenue sucessfully added!", "success", 3000);
            e.component.cancelEditData();
            modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue);
        },
        onRowUpdating: async function (e) {
            e.cancel = true;

            if (!e.oldData) {
                DevExpress.ui.notify("You can not update data at this time!", "warning", 2000);
                return;
            }

            const idRevenue = e.oldData.idRevenue;

            if (!idRevenue) {
                DevExpress.ui.notify("You can not update this record at this time!", "warning", 2000);
                return;
            }

            if (!e.newData || Object.keys(e.newData).length < 1) {
                DevExpress.ui.notify("No modifications saved!", "warning", 3000);
                e.component.cancelEditData();
                return;
            }

            const updateData = {
                idRevenue: idRevenue,
                revenue: e.newData
            };
            const updatedRevenue = await api.post("revenue/updateRevenue", updateData, savedUserData.token);

            if (!updatedRevenue) {
                DevExpress.ui.notify("Revenue could not be updated! Please try again!", "warning", 2000);
                return;
            }

            if (updatedRevenue.errorMessage) {
                DevExpress.ui.notify(updatedRevenue.errorMessage, "warning", 2000);
                return;
            }

            if (!updatedRevenue.ok) {
                DevExpress.ui.notify("Server could not be reached! Try again later!", "warning", 2000);
                return;
            }

            const affectedRows = updatedRevenue.data ? updatedRevenue.data.affectedRows : null;

            if (!affectedRows) {
                DevExpress.ui.notify("You can not update this record now. Try again later!", "warning", 2000);
                return;
            }

            DevExpress.ui.notify("Revenue sucessfully updated!", "success", 3000);
            e.component.cancelEditData();
            modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue);
        }
    }).dxDataGrid("instance");

    // call server to get data for default range - today
    modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue);

    function updateRevenueCard(cash, card, clients) {
        if (cash || cash == 0) { $('#cash').text(cash.toFixed(2) + ' RON'); }
        if (card || card == 0) { $('#card').text(card.toFixed(2) + ' RON'); }
        if (clients || clients == 0) { $('#clients').text(clients); }

        card = card ? card : 0;
        cash = cash ? cash : 0;

        $('#total').text((card + cash).toFixed(2) + ' RON');
    }

    async function modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue) {
        if (!startDateRevenueValue || !endDateRevenueValue) {
            DevExpress.ui.notify("You must complete analysis interval!", "error", 3000);
            return;
        }

        if (startDateRevenueValue > endDateRevenueValue) {
            DevExpress.ui.notify("Start Date is higher than End Date", "error", 3000);
            return;
        }

        revenueGridInstance.beginCustomLoading();

        const url = "revenue/getRevenues?idEnterpriseXuser=" + savedUserData.idEnterpriseXuser + "&startDate=" + encodeURIComponent(startDateRevenueValue.toISOString()) + "&endDate=" + encodeURIComponent(endDateRevenueValue.toISOString());
        const revenues = await api.get(url, savedUserData.token);

        if (!revenues) {
            DevExpress.ui.notify("There are no revenues for specified interval!", "error", 2500);
            evenueGridInstance.endCustomLoading();
            return;
        }

        if (revenues.errorMessage) {
            DevExpress.ui.notify(revenues.errorMessage, "error", 2500);
            revenueGridInstance.endCustomLoading();
            return;
        }

        if (!revenues.ok || !revenues.data) {
            DevExpress.ui.notify("The server could not be reached in order to display revenues!", "error", 2500);
            revenueGridInstance.endCustomLoading();
            return;
        }

        revenueGridInstance.option("dataSource", revenues.data);
        revenueGridInstance.endCustomLoading();
    }

    // to be done
    $("#gridContainerSpendings").dxDataGrid({
        dataSource: [],
        noDataText: "No available records for specified interval",
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: false,
        showRowLines: true,
        paging: { pageSize: 10 },
        filterRow: { visible: true },
        allowColumnResizing: true,
        columnHidingEnabled: true,
        export: {
            enabled: true
        },
        editing: {
            mode: "cell",
            allowUpdating: true,
            allowAdding: false,
            allowDeleting: false
        },
        columns: [
            { dataField: "date", caption: "Date", dataType: "datetime", format: "dd/MM/yyyy HH:mm", allowEditing: false },
            { dataField: "totalSpending", caption: "Total", dataType: "number", format: "currency", allowEditing: false },
            { dataField: "note", caption: "Note", dataType: "string" },
            { dataField: "isRowActive", caption: "Is Row Active ?", dataType: "boolean", allowEditing: true, width: "120" }
        ],
    });
}

function goToLoginPage(title, message) {
    return DevExpress.ui.dialog.custom({
        title: title,
        messageHtml: message ? `
        <div class="custom-dialog-message">
            <strong>` + message + `</strong>
        </div>
    ` : "",
        width: 400,
        dragEnabled: false,
        buttons: [
            {
                text: "Ok",
                onClick: () => {
                    localStorage.clear();
                    window.location.href = "../../index.html";
                },
                type: "default",
                stylingMode: "contained"
            }
        ]
    });
}
