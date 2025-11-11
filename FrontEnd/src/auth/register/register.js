import api from "../../ApiClient.js";

let savedUserData = sessionStorage.getItem("userData");

if (savedUserData) {
    savedUserData = JSON.parse(savedUserData);
}

$("#name").dxTextBox({
    placeholder: "First Name",
    width: "100%",
    text: savedUserData && savedUserData.firstName ? savedUserData.firstName : null,
    value: savedUserData && savedUserData.firstName ? savedUserData.firstName : null
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'First name is required',
    }],
});

$("#lastname").dxTextBox({
    placeholder: "Last Name",
    width: "100%",
    text: savedUserData && savedUserData.lastName ? savedUserData.lastName : null,
    value: savedUserData && savedUserData.lastName ? savedUserData.lastName : null
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'Last name is required',
    }],
});

$("#email").dxTextBox({
    placeholder: "Email",
    width: "100%",
    text: savedUserData && savedUserData.email ? savedUserData.email : null,
    value: savedUserData && savedUserData.email ? savedUserData.email : null
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'Email is required',
    }, {
        type: 'email',
        message: 'Invalid email format',
    }],
});

$("#phone").dxTextBox({
    placeholder: "Phone",
    width: "100%",
    text: savedUserData && savedUserData.phone ? savedUserData.phone : null,
    value: savedUserData && savedUserData.phone ? savedUserData.phone : null
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'Phone is required',
    }],
});

$("#password").dxTextBox({
    placeholder: "Password",
    mode: "password",
    width: "100%",
    text: savedUserData && savedUserData.password ? savedUserData.password : null,
    value: savedUserData && savedUserData.password ? savedUserData.password : null
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'Password is required',
    }],
});

$("#gdpr").dxCheckBox({
    text: "I agree to the processing of personal data (GDPR)",
    value: savedUserData && savedUserData.gdpr ? true : false,
    width: "100%"
}).dxValidator({
    validationRules: [{
        type: 'required',
        message: 'GDPR is required',
    }],
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
    text: "Register",
    type: "default",
    width: "100%",
    onClick: async function () {
        const fields = [
            $("#name").dxTextBox("instance"),
            $("#lastname").dxTextBox("instance"),
            $("#email").dxTextBox("instance"),
            $("#phone").dxTextBox("instance"),
            $("#password").dxTextBox("instance"),
        ];

        let allFieldsCompleted = true;
        fields.forEach(field => {
            const validator = field.element().dxValidator("instance");
            if (!validator.validate().isValid) {
                allFieldsCompleted = false;
            }
        });

        if (!allFieldsCompleted) {
            DevExpress.ui.notify("Please complete required fields!", "warning", 2000);
            return;
        }

        const gdprChecked = $("#gdpr").dxCheckBox("instance").option("value");
        if (!gdprChecked) {
            DevExpress.ui.notify("You must agree to GDPR terms", "error", 2000);
            return;
        }

        blockUserInterface();

        sessionStorage.removeItem("userData");

        const userData = {
            firstName: fields[0].option("value"),
            lastName: fields[1].option("value"),
            email: fields[2].option("value"),
            phone: fields[3].option("value"),
            password: fields[4].option("value"),
            gdpr: gdprChecked
        };

        const emailResponse = await api.post("api/auth/sendRegisterEmail", userData);

        unblockUserInterface();

        if (!emailResponse) {
            DevExpress.ui.notify("Server is currently unavailable. Please contact platform administrator!", "error", 2000);
            return;
        }

        if (emailResponse.errorMessage) {
            DevExpress.ui.notify(emailResponse.errorMessage, "error", 2000);
            return;
        }

        if (!emailResponse.ok) {
            DevExpress.ui.notify("The server can not be reached. Please contact your system administrator!", "error", 2000);
            return;
        }

        sessionStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = '../otp/otp.html';
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
