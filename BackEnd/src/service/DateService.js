class DateService {
    static convertMilisecondToDateString(miliseconds) {
        if (!miliseconds) {
            return null;
        }

        const date = new Date(miliseconds);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    static convertDateStringToDate(dateStr) {
        if (!dateStr) {
            return;
        }

        const [datePart, timePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);

        return new Date(year, month - 1, day, hours, minutes);
    }

    static getLoggerTimestamp() {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");
        const second = String(now.getSeconds()).padStart(2, "0");
        const milisecond = String(now.getMilliseconds()).padStart(3, "0");

        return `${year}-${month}-${day} ${hour}:${minute}:${second}:${milisecond}`;
    }
}

module.exports = DateService;
