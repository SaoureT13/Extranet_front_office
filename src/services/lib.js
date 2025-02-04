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

export function HighlightText({ text, keywords }) {
    if (!keywords.length) return <p>{text}</p>;

    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);

    return (
        <p>
            {parts.map((part, index) =>
                keywords.includes(part) ? (
                    <strong key={index}>{part.toUpperCase()}</strong>
                ) : (
                    part
                )
            )}
        </p>
    );
}

export function getMonthName(monthNumber) {
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];

    // Vérifier que le numéro est valide
    if (monthNumber < 1 || monthNumber > 12) {
        return "Numéro de mois invalide";
    }

    // Retourner le mois correspondant
    return months[monthNumber - 1]; // -1 car les indices commencent à 0
}
