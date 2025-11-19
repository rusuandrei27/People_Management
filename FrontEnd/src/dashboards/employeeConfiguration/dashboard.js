const { jsPDF } = window.jspdf;
import api from "../../ApiClient.js";

let savedUserData = localStorage.getItem("userData");

document.addEventListener("DOMContentLoaded", () => {
    if (savedUserData) {
        savedUserData = JSON.parse(savedUserData);

        if (savedUserData.token && savedUserData.idEnterpriseXuser && savedUserData.idEnterprise) {
            showDashboard();
        } else {
            goToLoginPage("You have been logged out", "Please login again in the platform").show();
        }
    } else {
        goToLoginPage("You have been logged out", "Please login again in the platform").show();
    }
});

async function showDashboard() {

    let roles = await api.get("getItems/getAllRoles", savedUserData.token, true); // also for validating if user should see this page.

    if (!roles) {
        goToLoginPage("You have no rights to access this page!", "Please login again in the platform. You have no rights to access this page!").show();
        return;
    }

    if (roles.errorMessage) {
        goToLoginPage("You have no rights to access this page!", "Please login again in the platform. You have no rights to access this page!").show();
        return;
    }

    if (!roles.ok || !roles.data || roles.data.length < 1) {
        DevExpress.ui.notify("The server could not be reached. Please contact administrator!", "error", 2000);
        return;
    }

    roles = roles.data;

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

    // burger menu functionality:
    $("#myRevenues").on("click", function () {
        window.location.href = "../managerMain/dashboard.html";
    });

    $("#userStatistics").on("click", function () {
        window.location.href = "../employeeStatistics/dashboard.html";
    });

    $("#logout").on("click", function () {
        localStorage.clear();
        window.location.href = "../../index.html";
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

    // display employee grid:
    const employeesGridInstance = $("#gridContainerEmployees").dxDataGrid({
        dataSource: [],
        minHeight: 900,
        key: "idEmployeeXUser",
        noDataText: "No registered users",
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        selection: { mode: "multiple" },
        showRowLines: true,
        paging: { pageSize: 10 },
        filterRow: { visible: true },
        columns: [
            { dataField: "firstName", caption: "First Name", dataType: "string", minWidth: 130 },
            { dataField: "lastName", caption: "Last Name", dataType: "string", minWidth: 130 },
            {
                dataField: "idRole", caption: "Role", minWidth: 130,
                lookup: {
                    dataSource: roles,
                    valueExpr: "idRole",
                    displayExpr: "name"
                }
            },
            { dataField: "clientDeduction", caption: "Client Deduction", dataType: "number", minWidth: 130 },
            { dataField: "revenuePercentage", caption: "Revenue Percentage", dataType: "number", minWidth: 130 },
            { dataField: "employmentContractDeduction", caption: "Employment Contract Deduction", dataType: "number", defaultValue: "0", minWidth: 130 },
            { dataField: "isActive", caption: "Is Active Employee ?", dataType: "boolean", defaultValue: "true", width: "100" },
        ],
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowAdding: false,
            allowDeleting: false,
            popup: {
                title: "Modify Employee",
                showTitle: true,
                width: "80%"
            }
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && (e.data.isActive == "0" || !e.data.isActive)) {
                e.rowElement.addClass("inactive-row")
            }
        },
        onRowUpdating: async function (e) {
            // e.cancel = true;

            // if (!e.oldData) {
            //     DevExpress.ui.notify("You can not update data at this time!", "warning", 2000);
            //     return;
            // }

            // const idRevenue = e.oldData.idRevenue;

            // if (!idRevenue) {
            //     DevExpress.ui.notify("You can not update this record at this time!", "warning", 2000);
            //     return;
            // }

            // if (!e.newData || Object.keys(e.newData).length < 1) {
            //     DevExpress.ui.notify("No modifications saved!", "warning", 3000);
            //     e.component.cancelEditData();
            //     return;
            // }

            // const updateData = {
            //     idRevenue: idRevenue,
            //     revenue: e.newData
            // };
            // const updatedRevenue = await api.post("revenue/updateRevenue", updateData, savedUserData.token);

            // if (!updatedRevenue) {
            //     DevExpress.ui.notify("Revenue could not be updated! Please try again!", "warning", 2000);
            //     return;
            // }

            // if (updatedRevenue.errorMessage) {
            //     DevExpress.ui.notify(updatedRevenue.errorMessage, "warning", 2000);
            //     return;
            // }

            // if (!updatedRevenue.ok) {
            //     DevExpress.ui.notify("Server could not be reached! Try again later!", "warning", 2000);
            //     return;
            // }

            // const affectedRows = updatedRevenue.data ? updatedRevenue.data.affectedRows : null;

            // if (!affectedRows) {
            //     DevExpress.ui.notify("You can not update this record now. Try again later!", "warning", 2000);
            //     return;
            // }

            // DevExpress.ui.notify("Revenue sucessfully updated!", "success", 3000);
            // e.component.cancelEditData();
            // modifyRevenueGridDataSource(startDateRevenueValue, endDateRevenueValue);
        }
    }).dxDataGrid("instance");

    modifyEmployeeGridDataSource();

    async function modifyEmployeeGridDataSource() {

        employeesGridInstance.beginCustomLoading();

        const url = "userConfiguration/getUsersFromEnterprise?idEnterprise=" + savedUserData.idEnterprise;
        const usersFromEnterprise = await api.get(url, savedUserData.token);

        if (!usersFromEnterprise) {
            DevExpress.ui.notify("There are no users!", "warning", 2500);
            employeesGridInstance.endCustomLoading();
            return;
        }

        if (usersFromEnterprise.errorMessage) {
            DevExpress.ui.notify(usersFromEnterprise.errorMessage, "error", 2500);
            employeesGridInstance.endCustomLoading();
            return;
        }

        if (!usersFromEnterprise.ok || !usersFromEnterprise.data) {
            DevExpress.ui.notify("The server could not be reached in order to display users!", "error", 2500);
            employeesGridInstance.endCustomLoading();
            return;
        }

        employeesGridInstance.option("dataSource", usersFromEnterprise.data);
        employeesGridInstance.endCustomLoading();
    }
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
