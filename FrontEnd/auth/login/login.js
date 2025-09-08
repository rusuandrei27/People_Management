import api from "../../ApiClient.js";

$("#email").dxTextBox({
    placeholder: "Email",
    width: "100%"
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

$("#waitingPanel").dxLoadPanel({
    shadingColor: "rgba(0,0,0,0.4)",
    message: "Please wait...",
    visible: false,
    showIndicator: true,
    showPane: true,
    shading: true,
    hideOnOutsideClick: false
});

$("#login-btn").dxButton({
    text: "Login",
    type: "default",
    width: "100%",
    onClick: async function () {
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

        blockUserInterface();

        const userData = {
            email: fields[0].option("value"),
            password: fields[1].option("value")
        };

        const loginResponse = await api.post("api/auth/login", userData);

        unblockUserInterface();

        if (!loginResponse) {
            DevExpress.ui.notify("Server could not be reached!", "warning", 2000);
            return;
        }

        if (loginResponse.errorMessage) {
            DevExpress.ui.notify(loginResponse.errorMessage, "warning", 2000);
            return;
        }

        if (!loginResponse.ok) {
            DevExpress.ui.notify("You can not login at this time. Please try again later or contact platform administrator!", "warning", 2000);
            return;
        }

        const idUser = loginResponse.data ? loginResponse.data.idUser : null;
        const nextPage = loginResponse.data ? loginResponse.data.nextPage : null;

        if (!idUser || !nextPage) {
            DevExpress.ui.notify("You can not login at this time. Please try again later or contact platform administrator!", "warning", 2000);
            return;
        }

        sessionStorage.setItem("userData", JSON.stringify({ "idUser": idUser, "email": fields[0].option("value") }));
        window.location.href = '../' + nextPage + "/" + nextPage + ".html";
    }
});

function blockUserInterface() {
    $("#login-btn").dxButton("instance").option("disabled", true);
    $("#waitingPanel").dxLoadPanel("instance").option("visible", true);
}

function unblockUserInterface() {
    $("#login-btn").dxButton("instance").option("disabled", false);
    $("#waitingPanel").dxLoadPanel("instance").option("visible", false);
}
