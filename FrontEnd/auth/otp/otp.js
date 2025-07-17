$('.otp-box').on('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length === 1) {
        $(this).next('.otp-box').focus();
    }
});

$("#waitingPanel").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    message: "Please wait...",
    visible: false, // start hidden
    showIndicator: true,
    showPane: true,
    shading: true,
    hideOnOutsideClick: false,
});

$('#confirmOtp').on('click', () => {
    let otp = '';
    $('.otp-box').each((index, item) => {
        otp += $(item).val();
    });

    if (otp.length === 6) {
        $("#waitingPanel").dxLoadPanel("instance").option("visible", true);

        // const emailResponse = await fetch("http://localhost:3000/api/auth/sendRegisterEmail", {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(userData)
        // });

        // const emailJSON = await emailResponse.json();


        return;
        // console.log("OTP:", otp);
        // You can send it to backend here
        // e.g., fetch('/api/auth/verifyOtp', ...)
    }

    DevExpress.ui.notify("Please complete OTP code!", "warning", 2000);
});