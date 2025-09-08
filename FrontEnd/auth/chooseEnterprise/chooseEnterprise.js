import api from "../../ApiClient.js";

let savedUserData = sessionStorage.getItem("userData");

if (savedUserData) {
    savedUserData = JSON.parse(savedUserData);
}

$("#enterprise").dxSelectBox({
    placeholder: "Where do you work ?",
    showClearButton: true,
    valueExpr: "idEnterprise",
    displayExpr: "fullName",
    value: savedUserData && savedUserData.idEnterprise ? savedUserData.idEnterprise : null
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'Enterprise is required',
    }],
});

$("#confirm-btn").dxButton({
    text: "Confirm",
    type: "default",
    width: "100%",
});

$("#waitingPanel").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    message: "Please wait...",
    visible: false,
    showIndicator: true,
    showPane: true,
    shading: true,
    hideOnOutsideClick: false,
});

function showConfirmationMessage(title, message, callback) {
    return DevExpress.ui.dialog.custom({
        title: title,
        messageHtml: `
        <div class="custom-dialog-message">
            <strong>` + message + `</strong>
        </div>
    `,
        width: 400,
        dragEnabled: false,
        buttons: [
            {
                text: "Ok",
                onClick: () => callback(),
                type: "default",
                stylingMode: "contained"
            }
        ]
    });
}

document.addEventListener("DOMContentLoaded", function () {
    showConfirmationMessage("Information needed", "In order to be able to use the platform, please tell us where do you work.", applyFormLogic).show();
});

async function applyFormLogic() {
    blockUserInterface();

    const enterprises = await api.get("getItems/getAllEnterprises");

    unblockUserInterface();

    if (!enterprises) {
        DevExpress.ui.notify("There are no available enterprises. Please contact administrator!", "error", 2000);
        return;
    }

    if (enterprises.error) {
        DevExpress.ui.notify(enterprises.error, "error", 2000);
        return;
    }

    if (!enterprises.ok || !enterprises.data || enterprises.data.length < 1) {
        DevExpress.ui.notify("The server could not be reached. Please contact administrator!", "error", 2000);
        return;
    }

    enterprises.data.forEach(enterprise => {
        enterprise["fullName"] = enterprise.name + " " + enterprise.street;

        if (enterprise["fullName"] != "Men Code Bulevardul Stefan cel Mare") {
            enterprise["disabled"] = true;
        }
    });

    $("#enterprise").dxSelectBox("instance").option("dataSource", enterprises.data);
    $("#confirm-btn").dxButton("instance").option("onClick", confirmEnterprise);

    async function confirmEnterprise() {
        const fields = [
            $("#enterprise").dxSelectBox("instance")
        ];

        let allFieldsCompleted = true;
        fields.forEach(field => {
            const validator = field.element().dxValidator("instance");
            if (!validator.validate().isValid) {
                allFieldsCompleted = false;
            }
        });

        if (!allFieldsCompleted) {
            DevExpress.ui.notify("Please complete enterprise!", "warning", 2000);
            return;
        }

        savedUserData["idEnterprise"] = fields[0].option("value");

        blockUserInterface();

        const userToEnterprise = await api.post("api/auth/assignUserToEnterprise", savedUserData);

        unblockUserInterface();

        if (!userToEnterprise) {
            DevExpress.ui.notify("User could not be associated with this enterprise!", "warning", 2000);
            return;
        }

        if (userToEnterprise.errorMessage) {
            DevExpress.ui.notify(userToEnterprise.errorMessage, "warning", 2000);
            return;
        }

        if (!userToEnterprise.ok) {
            DevExpress.ui.notify("Server could not be reached!", "warning", 2000);
            return;
        }

        const enterpriseXuserId = userToEnterprise.data ? userToEnterprise.data.enterpriseXuserId : null;

        if (!enterpriseXuserId) {
            DevExpress.ui.notify("User can not be associated with this enterprise!", "warning", 2000);
            return;
        }

        showConfirmationMessage("Success!", "You have been succesfully added to the selected enterprise. You should contact your manager in order to activate your account. Thank you for using Men Code Employee Management Platform.",
            function () {
                sessionStorage.clear();
                window.location.href = '../login/login.html';
            }
        ).show();
    }
}

function blockUserInterface() {
    $("#confirm-btn").dxButton("instance").option("disabled", true);
    $("#waitingPanel").dxLoadPanel("instance").option("visible", true);
}

function unblockUserInterface() {
    $("#confirm-btn").dxButton("instance").option("disabled", false);
    $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
}
