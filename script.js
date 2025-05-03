let faqs = [];
let synonyms = {};
fetch("data/faq.json").then(r => r.json()).then(data => { faqs = data; });
fetch("data/synonyms.json").then(r => r.json()).then(data => { synonyms = data; });

const input = document.getElementById("search");
const results = document.getElementById("results");
const suggestions = document.getElementById("suggestions");

input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    results.innerHTML = "";
    suggestions.innerHTML = "";

    if (query.length < 2) return;

    const expanded = expandQuery(query);
    const matched = faqs.filter(({ pregunta }) =>
        expanded.some(q => pregunta.toLowerCase().includes(q))
    );

    matched.forEach(({ pregunta, respuesta }) => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${pregunta}</h3><p>${respuesta}</p>`;
        results.appendChild(div);
    });

    matched.slice(0, 5).forEach(({ pregunta }) => {
        const li = document.createElement("li");
        li.textContent = pregunta;
        li.onclick = () => {
            input.value = pregunta;
            input.dispatchEvent(new Event('input'));
        };
        suggestions.appendChild(li);
    });
});

function expandQuery(q) {
    const words = q.split(" ");
    const expanded = [...words];
    for (const word of words) {
        if (synonyms[word]) {
            expanded.push(...synonyms[word]);
        }
    }
    return expanded;
}
