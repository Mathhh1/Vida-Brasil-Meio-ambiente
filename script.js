/* ==========================================================
   A. SUGESTÕES DE BUSCA  (EDITE AQUI PARA ADICIONAR ITENS)
   texto = o que aparece | alvo = id da seção/cartão de destino
   Para levar a OUTRA PÁGINA, use: { texto:"...", url:"pagina.html" }
   ========================================================== */
const SUGESTOES = [
  { texto:"Nova tecnologia de drones planta 10 mil árvores por dia em áreas desmatadas.", alvo:"drones" },
  { texto:"Mutirão de jovens retira 5 toneladas de plástico do litoral brasileiro em um único fim de semana.", alvo:"mutirao" },
  { texto:"Estudantes universitários criam filtro de baixo custo que limpa água de rios poluídos.", alvo:"filtro" },
  { texto:"Pesquisadores descobrem enzima capaz de decompor garrafas PET em poucas horas.", alvo:"enzima" },
  { texto:"Como transformar o lixo orgânico da sua casa em energia limpa.", alvo:"energia" }
];

const painel = document.getElementById('painel-busca');
const lista  = document.getElementById('lista');
const campo  = document.getElementById('campo');

/* Cria os links a partir da lista (filtrando pelo que foi digitado) */
function desenharLista(filtro=""){
  lista.innerHTML = "";
  SUGESTOES.filter(s => s.texto.toLowerCase().includes(filtro.toLowerCase())).forEach(s=>{
    const a = document.createElement('a');
    a.textContent = s.texto;
    a.href = s.url || "#"+s.alvo;
    a.addEventListener('click', e=>{
      painel.classList.remove('aberto');           // fecha o painel
      if(s.alvo){                                   // rolagem animada até o alvo
        e.preventDefault();
        const el = document.getElementById(s.alvo);
        el.scrollIntoView({behavior:'smooth', block:'center'});
        el.classList.remove('destaque'); void el.offsetWidth; el.classList.add('destaque');
      }
    });
    lista.appendChild(a);
  });
}
desenharLista();
campo.addEventListener('input', () => desenharLista(campo.value));

/* Abre/fecha o painel ao clicar na lupa */
document.getElementById('btn-busca').addEventListener('click', ()=>{
  painel.classList.toggle('aberto');
  if(painel.classList.contains('aberto')) campo.focus();
});
document.addEventListener('keydown', e => { if(e.key==='Escape') painel.classList.remove('aberto'); });

/* ==========================================================
   B. EFEITO DE ROLAGEM DO HERO
   progresso p: 0 (topo) → 1 (fim do hero)
   Fase 1 (p 0–0.4): imagem aparece, ainda muito desfocada
   Fase 2 (p 0.4–1): imagem clareia/nítida e o título some
   ========================================================== */
const hero = document.getElementById('hero');
const moldura = document.getElementById('moldura');
const titulo = document.getElementById('titulo');
const setas = document.querySelectorAll('.seta');
const clamp = (v,a=0,b=1) => Math.min(b,Math.max(a,v));

function aoRolar(){
  const total = hero.offsetHeight - window.innerHeight;
  const p = clamp(-hero.getBoundingClientRect().top / total);

  const aparece = clamp(p/0.4);           // 0→1 na fase 1
  const clareia = clamp((p-0.4)/0.6);     // 0→1 na fase 2

  moldura.style.opacity = aparece;
  /* blur: 14px (desfocada) → 2px (quase nítida). Mude os números para ajustar. */
  moldura.style.filter = `blur(${14 - 12*clareia}px) brightness(${0.85 + 0.4*clareia})`;
  titulo.style.opacity = 1 - clareia;     // título desaparece gradualmente
  setas.forEach(s => s.classList.toggle('visivel', p > 0.7)); // setas surgem no fim
}
addEventListener('scroll', aoRolar, {passive:true});
aoRolar();

/* ==========================================================
   C. CARROSSEL (setas avançam/voltam entre os slides)
   Para mais imagens: adicione um <div class="slide sN"> no HTML
   ========================================================== */
const slides = document.querySelectorAll('.slide');
let atual = 0;
function ir(delta){
  slides[atual].classList.remove('ativo');
  atual = (atual + delta + slides.length) % slides.length;
  slides[atual].classList.add('ativo');
}
document.getElementById('prox').onclick = () => ir(1);
document.getElementById('ant').onclick  = () => ir(-1);