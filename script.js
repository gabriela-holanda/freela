const services = [
  {title:"Identidade visual para pequenos negócios", user:"Ana Martins", category:"Design", rating:"4,9", price:120, cover:"IDENTIDADE VISUAL"},
  {title:"Edição de vídeo para Instagram", user:"Lucas Ferreira", category:"Vídeo", rating:"4,8", price:45, cover:"EDIÇÃO DE VÍDEO"},
  {title:"Site responsivo para seu projeto", user:"Marina Costa", category:"Tecnologia", rating:"5,0", price:180, cover:"DESENVOLVIMENTO"},
  {title:"Aulas de reforço em matemática", user:"Pedro Alves", category:"Estudos", rating:"4,9", price:35, cover:"MATEMÁTICA"},
  {title:"Artes para redes sociais", user:"Bia Santos", category:"Design", rating:"4,7", price:25, cover:"SOCIAL MEDIA"},
  {title:"Configuração e manutenção de PC", user:"Rafael Lima", category:"Tecnologia", rating:"4,9", price:60, cover:"SUPORTE TECH"},
  {title:"Fotografia de produtos", user:"Clara Rocha", category:"Outros", rating:"4,8", price:80, cover:"FOTOGRAFIA"},
  {title:"Apresentação profissional em slides", user:"Davi Melo", category:"Design", rating:"4,9", price:50, cover:"APRESENTAÇÃO"}
];

const grid = document.getElementById("serviceGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");
let activeCategory = "Todos";

function renderServices() {
  const query = search.value.toLowerCase().trim();
  const filtered = services.filter(s =>
    (activeCategory === "Todos" || s.category === activeCategory) &&
    (s.title.toLowerCase().includes(query) || s.user.toLowerCase().includes(query) || s.category.toLowerCase().includes(query))
  );

  grid.innerHTML = filtered.map((s, i) => `
    <article class="service">
      <div class="service-cover"><span>${s.cover}</span></div>
      <h3>${s.title}</h3>
      <div class="service-info"><span>${s.user}</span><span>★ ${s.rating}</span></div>
      <div class="service-bottom"><strong>R$ ${s.price}</strong><button onclick="openService('${s.title.replace(/'/g, "\\'")}')">→</button></div>
    </article>
  `).join("");

  empty.style.display = filtered.length ? "none" : "block";
}

document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderServices();
  });
});

search.addEventListener("input", renderServices);

document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => document.querySelector(btn.dataset.scroll).scrollIntoView({behavior:"smooth"}));
});

const overlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");

function openOffer() {
  modalContent.innerHTML = `
    <h2>Coloque sua habilidade no mundo.</h2>
    <p>Crie um serviço em poucos passos. É só uma demonstração do nosso MVP — nenhum dado será enviado.</p>
    <form id="offerForm">
      <div class="form-group"><label>Seu nome</label><input id="name" required placeholder="Ex.: Ana Martins"></div>
      <div class="form-group"><label>O que você sabe fazer?</label><input id="skill" required placeholder="Ex.: Edição de vídeo"></div>
      <div class="form-group"><label>Categoria</label><select id="cat"><option>Design</option><option>Tecnologia</option><option>Vídeo</option><option>Estudos</option><option>Outros</option></select></div>
      <div class="form-group"><label>Preço inicial</label><input id="price" type="number" min="1" required placeholder="R$"></div>
      <button class="btn btn-primary" type="submit">Publicar meu serviço →</button>
    </form>
  `;
  overlay.classList.add("show");
  document.getElementById("offerForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const skill = document.getElementById("skill").value;
    const cat = document.getElementById("cat").value;
    const price = Number(document.getElementById("price").value);
    services.unshift({title: skill, user:name, category:cat, rating:"Novo", price, cover:cat.toUpperCase()});
    renderServices();
    modalContent.innerHTML = `
      <div class="success">
        <div class="success-icon">✓</div>
        <h2>Serviço publicado!</h2>
        <p>Seu serviço já aparece no marketplace da demonstração. É assim que o Freela transforma habilidade em oportunidade.</p>
        <button class="btn btn-dark" id="seeService">Ver meu serviço</button>
      </div>
    `;
    document.getElementById("seeService").onclick = () => {
      overlay.classList.remove("show");
      document.getElementById("servicos").scrollIntoView({behavior:"smooth"});
    };
  });
}

function openService(title) {
  const s = services.find(x => x.title === title);
  modalContent.innerHTML = `
    <div class="eyebrow">${s.category}</div>
    <h2>${s.title}</h2>
    <p>Serviço oferecido por <strong>${s.user}</strong>. ★ ${s.rating}</p>
    <div class="form-group"><label>Mensagem para o profissional</label><input id="message" placeholder="Olá! Tenho interesse no serviço."></div>
    <button class="btn btn-primary" id="hire">Tenho interesse — R$ ${s.price}</button>
  `;
  overlay.classList.add("show");
  document.getElementById("hire").onclick = () => {
    modalContent.innerHTML = `<div class="success"><div class="success-icon">✓</div><h2>Pedido enviado!</h2><p>Na versão real do Freela, o profissional receberia sua solicitação e vocês poderiam combinar os detalhes.</p><button class="btn btn-dark" id="done">Fechar</button></div>`;
    document.getElementById("done").onclick = () => overlay.classList.remove("show");
  };
}

document.querySelectorAll("[data-open-modal]").forEach(btn => btn.addEventListener("click", openOffer));
document.getElementById("closeModal").addEventListener("click", () => overlay.classList.remove("show"));
overlay.addEventListener("click", e => { if(e.target === overlay) overlay.classList.remove("show"); });
document.addEventListener("keydown", e => { if(e.key === "Escape") overlay.classList.remove("show"); });

document.getElementById("loadMore").addEventListener("click", e => {
  e.currentTarget.textContent = "Todos os serviços carregados ✓";
  e.currentTarget.disabled = true;
});

renderServices();
