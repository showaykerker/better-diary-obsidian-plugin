import dayjs from 'dayjs';

export function getDailyNoteName(
        assumeSameDayBeforeHour: number,
        dateFormat: string,
        date: Date = new Date(),
        considerAssumeSameDayBeforeHour: boolean = false) {
    // if the current time is before assumeSameDayBeforeHour, assume it is the previous day
    if (dayjs().get('hour') < assumeSameDayBeforeHour &&
            considerAssumeSameDayBeforeHour) {
        date.setDate(date.getDate() - 1);
    }
    return formatDate(dateFormat, date);
}

export function getDailyNotePath(rootDir:string, assumeSameDayBeforeHour: number, dateFormat: string, date: Date = new Date()){
    const noteName = getDailyNoteName(assumeSameDayBeforeHour, dateFormat, date, true);
    const dirPath = getMonthDirPath(rootDir, assumeSameDayBeforeHour, date);
    return `${dirPath}/${noteName}.md`;
}

export function getMonthDirPath(
        rootDir: string,
        assumeSameDayBeforeHour: number,
        date: Date = new Date(),
        considerAssumeSameDayBeforeHour: boolean = false) {
    // if the current time is before assumeSameDayBeforeHour, assume it is the previous day
    if (dayjs().get('hour') + 1 < assumeSameDayBeforeHour &&
            considerAssumeSameDayBeforeHour) {
        date.setDate(date.getDate() - 1);
    }
    const year = date.getFullYear();
    const monthStr = date.toLocaleString('en-GB', { month: 'short' });
    return `${rootDir}/${year}/${monthStr}`;
}

export function formatDate(format: string, date: Date = new Date()): string {
    return dayjs(date).format(format);
}

export function isValidDateFormat(format: string): boolean {
    if (format.match("/")) {
        return false;
    }
    try {
        dayjs().format(format);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

export function checkValidDailyNotePath(notePath: string, dateFormat: string): Date | null{
    // return None if the notePath is not a daily note
    const noteName = notePath.split("/").slice(-1)[0].split(".")[0];
    if (!noteName) {
        console.log("No note name.");
        return null;
    }
    // first check if the file name matches the settings.dateFormat
    const date = dayjs(noteName, dateFormat, true);
    if (!date.isValid()) {
        console.log("Invalid date.");
        return null;
    }
    // then check if the file is monthly note directory
    const monthDir = notePath.split("/").slice(-2, -1);
    if (!monthDir) {
        console.log("No month directory.");
        return null;
    }
    return date.toDate();
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}