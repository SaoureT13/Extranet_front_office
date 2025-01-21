export const generatePageNumbers = (totalPages, currentPage) => {
    const visiblePages = 3;
    const pages = [];

    pages.push(1);

    if (currentPage > visiblePages) {
        pages.push("...");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - visiblePages) {
        pages.push("...");
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }

    return pages;
};

export function verifyImageLink(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url); // Si l'image est chargée correctement, on renvoie le lien
        img.onerror = () => resolve(false); // Si une erreur survient, on renvoie false
        img.src = url;
    });
}
