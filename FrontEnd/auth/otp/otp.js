import api from "../../ApiClient.js";

$('.otp-box').on('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length === 1) {
        $(this).next('.otp-box').focus();
    }
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

$("#register-btn").dxButton({
    text: "Confirm",
    type: "default",
    width: "90%",
    onClick: async function () {
        let otp = '';
        $('.otp-box').each((index, item) => {
            otp += $(item).val();
        });

        if (otp.length != 6) {
            DevExpress.ui.notify("Please complete the otp code!", "warning", 2000);
            return;
        }

        blockUserInterface();

        let userData = sessionStorage.getItem("userData");

        if (!userData) {
            unblockUserInterface();
            DevExpress.ui.notify("The register session expired. Please try again!", "warning", 2000);
            return;
        }

        userData = JSON.parse(userData);
        userData["otp"] = otp;

        const otpResponse = await api.post("api/auth/insertUser", userData);

        unblockUserInterface();

        if (!otpResponse) {
            DevExpress.ui.notify("The register proccess could not be completed. Please try again!", "warning", 2000);
            return;
        }

        if (otpResponse.errorMessage) {
            DevExpress.ui.notify(otpResponse.errorMessage, "warning", 2000);
            return;
        }

        if (!otpResponse.ok) {
            DevExpress.ui.notify("The server could not be reached. Please try again!", "warning", 2000);
            return;
        }

        const idUser = otpResponse.data ? otpResponse.data.idUser : null;

        if (!idUser) {
            DevExpress.ui.notify("The user could not be created. Please try again!", "warning", 2000);
            return;
        }

        userData["idUser"] = idUser;
        sessionStorage.setItem("userData", JSON.stringify(userData));

        DevExpress.ui.notify("Your account has been successfully created!", "success", 2000);
        window.location.href = '../chooseEnterprise/chooseEnterprise.html'
    }
});

function blockUserInterface() {
    $("#register-btn").dxButton("instance").option("disabled", true);
    $("#waitingPanel").dxLoadPanel("instance").option("visible", true);
}

function unblockUserInterface() {
    $("#register-btn").dxButton("instance").option("disabled", false);
    $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
}
