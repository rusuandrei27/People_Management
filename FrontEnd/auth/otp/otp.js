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
        $("#register-btn").dxButton("instance").option("disabled", true);
        let otp = '';
        $('.otp-box').each((index, item) => {
            otp += $(item).val();
        });

        if (otp.length != 6) {
            $("#register-btn").dxButton("instance").option("disabled", false);
            DevExpress.ui.notify("Please complete the otp code!", "warning", 2000);
            return;
        }

        $("#waitingPanel").dxLoadPanel("instance").option("visible", true);

        let userData = sessionStorage.getItem("userData");

        if (!userData) {
            $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
            DevExpress.ui.notify("The register session expired. Please try again!", "warning", 2000);
            return;
        }

        userData = JSON.parse(userData);
        userData["otp"] = otp;

        const otpResponse = await fetch("http://localhost:3000/api/auth/insertUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const otpJSON = await otpResponse.json();

        if (!otpResponse || !otpResponse.ok || otpResponse.error) {
            $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
            DevExpress.ui.notify(otpJSON.error, "error", 2000);
            $("#register-btn").dxButton("instance").option("disabled", false);
            return;
        }

        sessionStorage.removeItem("userData");

        DevExpress.ui.notify("Your account has been successfully created. You are now redirected to login page!", "warning", 3000);

        setTimeout(function () {
            window.location.href = '../login/login.html';
        }, 2000);
    }
});
