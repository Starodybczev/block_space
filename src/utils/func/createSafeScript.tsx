export function createSafeScript(code: string) {
    const safeCode = code.replace(/<\/script>/gi, "<\\/script>");

    return `
<script>
let alertCount = 0;

window.alert = (...args) => {
    alertCount++;
    if (alertCount > 3) {
        throw new Error("Слишком много alert");
    }
    console.log("alert:", ...args);
};

try {
    ${safeCode}
} catch (err) {
    const pre = document.createElement("pre");
    pre.style.color = "red";
    pre.textContent = err.message;
    document.body.appendChild(pre);
}
<\/script>
`;
}