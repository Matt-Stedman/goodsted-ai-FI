export const colourant = (percentage) => {
    if (percentage < 20) {
        return "red";
    } else if (percentage >= 20 && percentage < 50) {
        return "orange";
    } else if (percentage >= 50 && percentage < 75) {
        return "yellow";
    } else {
        return "green";
    }
};
