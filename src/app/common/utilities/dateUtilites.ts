export class DateUtility {

    static formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    static formatDateTime(date: Date): string {
        const formattedDate = this.formatDate(date); // Reuse formatDate function
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}:${seconds}`;
    }
}