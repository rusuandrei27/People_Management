$(function () {
    $("#name").dxTextBox({
        placeholder: "First Name",
        width: "100%"
    }).dxValidator({
        validationRules: [{
            type: 'required',
            message: 'First name is required',
        }],
    });

    $("#lastname").dxTextBox({
        placeholder: "Last Name",
        width: "100%"
    }).dxValidator({
        validationRules: [{
            type: 'required',
            message: 'Last name is required',
        }],
    });

    $("#email").dxTextBox({
        placeholder: "Email",
        width: "100%"
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
        width: "100%"
    }).dxValidator({
        validationRules: [{
            type: 'required',
            message: 'Phone is required',
        }],
    });

    $("#password").dxTextBox({
        placeholder: "Password",
        mode: "password",
        width: "100%"
    }).dxValidator({
        validationRules: [{
            type: 'required',
            message: 'Password is required',
        }],
    });

    $("#gdpr").dxCheckBox({
        text: "I agree to the processing of personal data (GDPR)",
        value: false,
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
        visible: false, // start hidden
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
                $("#password").dxTextBox("instance")
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

            $("#register-btn").dxButton("instance").option("disabled", true);
            $("#waitingPanel").dxLoadPanel("instance").option("visible", true);

            const userData = {
                firstName: fields[0].option("value"),
                lastName: fields[1].option("value"),
                email: fields[2].option("value"),
                phone: fields[3].option("value"),
                password: fields[4].option("value"),
            };

            const emailResponse = await fetch("http://localhost:3000/api/auth/sendRegisterEmail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const emailJSON = await emailResponse.json();

            $("#waitingPanel").dxLoadPanel("instance").option("visible", false);

            if (!emailResponse || !emailResponse.ok || emailJSON.error) {
                DevExpress.ui.notify(emailJSON.error, "error", 2000);
                $("#register-btn").dxButton("instance").option("disabled", false);
                return;
            }

            window.location.href = '../otp/otp.html';
        }
    });
});