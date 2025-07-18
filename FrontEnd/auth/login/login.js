$(function () {
    $("#email").dxTextBox({
        placeholder: "Email",
        width: "100%",
        maskInvalidMessage: "This is not a valid email"
    }).dxValidator({
        validationRules: [{
            type: 'required',
            message: 'Email is required',
        }, {
            type: 'email',
            message: 'Email is invalid',
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

    $("#login-btn").dxButton({
        text: "Login",
        type: "default",
        width: "100%",
        onClick: function () {
            const fields = [
                $("#email").dxTextBox("instance"),
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

        }
    });
});