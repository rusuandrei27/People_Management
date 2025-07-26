function showConfirmationMessage(message) {
    return DevExpress.ui.dialog.custom({
        messageHtml: `
        <div class="custom-dialog-message">
            <strong>` + message + `</strong>
        </div>
    `,
        width: 400,
        dragEnabled: true,
        buttons: [
            {
                text: "Ok",
                onClick: () => true,
                type: "default",
                stylingMode: "contained"
            }
        ]
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const dialog = showConfirmationMessage("Your account has been created. In order to be able to use the platform, please tell us where do you work.")

    dialog.show().done(function (result) {
        if (result) {
            applyFormLogic();
        }
    });

});

function applyFormLogic() {

    let savedUserData = sessionStorage.getItem("userData");

    if (savedUserData) {
        savedUserData = JSON.parse(savedUserData);
    }

    $("#waitingPanel").dxLoadPanel({
        shadingColor: "rgba(0,0,0,0.4)",
        message: "Please wait...",
        visible: true,
        showIndicator: true,
        showPane: true,
        shading: true,
        hideOnOutsideClick: false,
    });

    fetch("http://localhost:3000/getItems/getAllEnterprises")
        .then(response => {
            if (!response || !response.ok || response.error) {
                DevExpress.ui.notify(response.error, "error", 2000);
                sessionStorage.removeItem("userData");
                throw (new Error(response.error));
            }

            return response.json();
        })
        .then(response => {
            if (!response || !response.enterprises || response.enterprises.length < 1 || !savedUserData || !savedUserData.idUser || !savedUserData.email) {
                $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
                DevExpress.ui.notify("There are no enterprises available. Please try again later!", "warning", 2000);
                sessionStorage.removeItem("userData");
                return;
            }

            response.enterprises.forEach(enterprise => {
                enterprise["fullName"] = enterprise.name + " " + enterprise.street;
            });

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

            $("#enterprise").dxSelectBox("instance").option("dataSource", response.enterprises);
            $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
            showContinueButton();
        });

    function showContinueButton() {
        $("#confirm-btn").dxButton({
            text: "Confirm",
            type: "default",
            width: "100%",
            onClick: async function () {
                $("#confirm-btn").dxButton("instance").option("disabled", true);
                $("#waitingPanel").dxLoadPanel("instance").option("visible", true);
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
                    $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
                    $("#confirm-btn").dxButton("instance").option("disabled", false);
                    return;
                }

                savedUserData["idEnterprise"] = fields[0].option("value")

                const userToEnterprise = await fetch("http://localhost:3000/api/auth/assignUserToEnterprise", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(savedUserData)
                });

                const userToEnterpriseJSON = await userToEnterprise.json();

                $("#waitingPanel").dxLoadPanel("instance").option("visible", false);

                if (!userToEnterpriseJSON || userToEnterpriseJSON.length < 1 || !userToEnterpriseJSON[0] || !userToEnterpriseJSON[0].insertId) {
                    DevExpress.ui.notify(userToEnterpriseJSON.error, "error", 2000);
                    $("#confirm-btn").dxButton("instance").option("disabled", false);
                    return;
                }

                const dialog = showConfirmationMessage("You have been succesfully added to the selected enterprise. You should contact your manager in order to activate your account. Thank you for using Men Code Employee Management Platform.");
                dialog.show().done(function (result) {
                    if (result) {
                        sessionStorage.clear();
                        window.location.href = '../login/login.html';
                    }
                });
            }
        });
    }
}
