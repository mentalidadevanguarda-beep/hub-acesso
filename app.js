// Alex Inteligente: mentoragem, dicas premium, funil elegante para o E-book

const dicasPremium = [
  "Sua mentalidade define seus limites. A expansão começa na dúvida: desafie pensamentos automáticos, pergunte 'e se...?'",
  "Você ficou parado numa área da vida? Talvez não seja falta de motivação, mas excesso de perfeccionismo. Comece imperfeito.",
  "Sucesso não é sobre nunca falhar, é sobre aprender a falhar rápido e transformar erro em insight. O que você aprendeu ontem?",
  "Quer pensar grande? Rodeie-se de pessoas que elevam seu padrão, não só que concordam. Coragem para sair do comum!",
  "Sua rotina é a cola do seu progresso. O que você faz todo dia te leva para o topo – ou para o mesmo lugar.",
  "A disciplina é a ponte entre desejo e conquista. Qual microação você pode fazer hoje para sair do modo espera?"
];

const perguntasProvocativas = [
  "Se pudesse transformar um aspecto mental agora, qual seria?",
  "O que está impedindo você de sentir que merece avançar?",
  "Qual seu maior desafio mental recentemente?",
  "Como você lida com autossabotagem no dia a dia?",
  "O que mudaria se tivesse coragem de agir independente da opinião dos outros?",
  "Me conta, qual sensação você gostaria de sentir todos os dias?"
];

function dicaAleatoria() {
  return dicasPremium[Math.floor(Math.random()*dicasPremium.length)];
}
function perguntaAleatoria() {
  return perguntasProvocativas[Math.floor(Math.random()*perguntasProvocativas.length)];
}

document.addEventListener('DOMContentLoaded', function(){
  const mensagens = document.getElementById('mensagens');
  const chatInput = document.getElementById('chatInput');
  const enviarBtn = document.getElementById('enviarBtn');
  let etapa = 0;
  let nomeUser = "";

  // Primeira abordagem estilo mentor
  function primeiraMsg(){
    addAlexMsg("Bem-vindo(a) ao Hub Vanguarda! Eu sou o Alex, mentor virtual.<br><br>Me diga: qual seu nome, pra eu te chamar pessoalmente?");
  }

  function addAlexMsg(texto){
    const div = document.createElement('div');
    div.className = 'alexmsg';
    div.innerHTML = texto;
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
  }
  function addUserMsg(texto){
    const div = document.createElement('div');
    div.className = 'usermsg';
    div.textContent = texto;
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  function responder(userInput){
    etapa++;
    if(etapa === 1){
      nomeUser = userInput;
      setTimeout(()=>addAlexMsg(`Prazer, <strong>${nomeUser}</strong>! Me conta rapidinho: ${perguntaAleatoria()}`),900);
    } else if(etapa === 2){
      setTimeout(()=>addAlexMsg(`Entendi o ponto. Sabe o que funciona pra destravar mentalidade?<br><strong>${dicaAleatoria()}</strong><br><br>Tem outra área que quer evoluir? Pode contar!`),900);
    } else if(etapa <= 5){
      // Após 2 trocas, começa a preparar pro e-book
      setTimeout(()=>addAlexMsg(`${dicaAleatoria()}<br><br>Aliás, essas dicas são aprofundadas no nosso guia prático <u>E-book 7 Dias de Mentalidade</u>: são 7 saltos diários pra quem quer romper padrões e se reinventar. Gostaria de descobrir como funciona?`),1300);
    } else if(etapa === 6){
      setTimeout(()=>addAlexMsg(`<b>Explico o segredo:</b> Cada dia no e-book traz um desafio simples e uma técnica de mentalidade testada. Inclusive, tem bônus especial de ação rápida com exercícios.<br><br>Quer garantir acesso agora por R$ 17? <a href="https://kiwify.app/7diasvanguarda" target="_blank">Acesse aqui</a> ou posso te enviar mais conteúdo!`),900);
    } else {
      setTimeout(()=>addAlexMsg(`Sua jornada mental já começou! Continue interagindo, peça dicas, conte seus desafios, ou clique acima para turbinar seu crescimento com o E-book.`),900);
    }
  }

  enviarBtn.onclick = () => {
    const input = chatInput.value.trim();
    if(!input) return;
    addUserMsg(input);
    chatInput.value = '';
    responder(input);
  };
  chatInput.addEventListener('keydown', ev => {
    if(ev.key === 'Enter') enviarBtn.click();
  });

  // Botão do curso "em produção"
  const btnCurso = document.querySelector('.btn-curso');
  if(btnCurso){
    btnCurso.onclick = () => {
      addAlexMsg(`🚧 O curso Forja Vanguarda está em produção.<br>Se quiser ser avisado do lançamento ou receber dicas exclusivas, é só pedir aqui no chat!`);
    }
  }

  primeiraMsg();
});
