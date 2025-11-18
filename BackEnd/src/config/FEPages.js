class FEPages {
    constructor() {
        // authentication pages:
        this.chooseEnterprise = "/FrontEnd/src/auth/chooseEnterprise/chooseEnterprise.html";
        this.login = "/FrontEnd/src/auth/login/login.html";
        this.otp = "/FrontEnd/src/auth/otp/otp.html";
        this.register = "/FrontEnd/src/auth/register/register.html";
        this.waitingActivation = "/FrontEnd/src/auth/waitingActivation/waitingActivation.html";

        // dashboards:
        this.employeeMain = "/FrontEnd/src/dashboards/employeeMain/dashboard.html";
        this.managerMain = "/FrontEnd/src/dashboards/managerMain/dashboard.html";
        this.adminMain = "/FrontEnd/src/dashboards/adminMain/dashboard.html";
        this.supervisorMain = "/FrontEnd/src/dashboards/supervisorMain/dashboard.html";
    }
}

module.exports = new FEPages();
