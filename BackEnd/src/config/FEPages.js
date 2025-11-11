class FEPages {
    constructor() {
        // authentication pages:
        this.chooseEnterprise = "/FrontEnd/auth/chooseEnterprise/chooseEnterprise.html";
        this.login = "/FrontEnd/auth/login/login.html";
        this.otp = "/FrontEnd/auth/otp/otp.html";
        this.register = "/FrontEnd/auth/register/register.html";
        this.waitingActivation = "/FrontEnd/auth/waitingActivation/waitingActivation.html";

        // dashboards:
        this.employeeMain = "/FrontEnd/dashboards/employeeMain/dashboard.html";
        this.managerMain = "/FrontEnd/dashboards/managerMain/dashboard.html";
        this.adminMain = "/FrontEnd/dashboards/adminMain/dashboard.html";
        this.supervisorMain = "/FrontEnd/dashboards/supervisorMain/dashboard.html";
    }
}

module.exports = new FEPages();
