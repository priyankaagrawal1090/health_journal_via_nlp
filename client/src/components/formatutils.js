
export const formatDate = (date) => {
    const dateObj = date.split('-');
    return dateObj[1] + "/" + dateObj[2] + "/" + dateObj[0];
}

export const formatTime = (time) => {
    const timeObj = time.split(':');
    const hours = parseInt(timeObj[0]);
    if (hours > 12) {
        return (hours - 12) + ":" + timeObj[1] + " PM"
    } else {
        return hours + ":" + timeObj[1] + " AM"
    }
}