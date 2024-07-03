export default function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            func(...args);
            clearTimeout(timeout);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}