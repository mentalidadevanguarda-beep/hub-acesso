// Alex com "cérebro treinado": respostas contextuais e funil com timing!

const respostasAlex = {
  'Dominar Minha Mente': `Excelente escolha! 🧠\n\nO primeiro passo para dominar sua mente é clareza + disciplina. Veja as opções:\n- 📚 E-book 7 Dias (R$ 17): acesso imediato\n- 🎓 Curso Forja Vanguarda\n- 👥 Comunidade de Mentes Avançadas\nQual quer conhecer melhor?`,
  'Conectar em Outras Redes': `Estamos em várias redes! 🌐\n- YouTube: @MentalidadeVanguarda\n- TikTok: @mentalidadevanguarda\n- Instagram: @mentalidadevanguarda\n- Facebook: Comunidade\nQual mais combina com você?`,
  'Segredo da Mentalidade': `👑 O segredo está em agir enquanto todos duvidam. Veja este vídeo viral (dica oculta):\nhttps://youtube.com/shorts/XgKIO9UJ8qc`,
  'Sou Novo. Por Onde Começo?': `Bem-vindo! ✨ Para iniciantes o melhor caminho é:\n1️⃣ Assistir nosso vídeo inicial\n2️⃣ Baixar o E-book 7 Dias (R$ 17)\n3️⃣ Entrar na comunidade gratuita\nDeseja links para cada etapa?`,
  'dica': `🔥 Dica de Hoje: Enfrente o desconforto deliberadamente. O maior crescimento nasce fora da sua zona de conforto.`,
  'ebook': `O E-book 7 Dias é seu guia de disciplina mental, com lições por cada dia da semana. R$ 17, acesso vitalício!`,
  'grupo': `A Comunidade Vanguarda reúne pessoas iguais a você: crescimento, desafios, networking, apoio diário. Quer entrar?`,
  'default': `Sou Alex, seu guia! Me pergunte sobre mentalidade, livros, vídeo viral, desafios ou como começar.`
};

document.addEventListener('DOMContentLoaded', function() {
  const mensagens = document.getElementById('mensagens');
  const chatInput = document.getElementById('chatInput');
  const enviarBtn = document.getElementById('enviarBtn');

  // Mensagem inicial
  mensagens.innerHTML = `<div class="alexmsg">Olá! 👋 Eu sou Alex, seu assistente Vanguarda.<br>Posso te mostrar nossos melhores conteúdos, dicas ou abrir caminhos! <strong>Pergunte algo:</strong></div>`;

  function addMsg(text, user) {
    const div = document.createElement('div');
    div.className = user ? 'usermsg' : 'alexmsg';
    div.textContent = text;
    mensagens.appendChild(div);
    mensagens.scrollTop = mensagens.scrollHeight;
  }

  function respostaInteligente(pergunta) {
    const lower = pergunta.trim().toLowerCase();
    for (const chave in respostasAlex) {
      if (chave !== 'default' && lower.includes(chave.toLowerCase())) {
        return respostasAlex[chave];
      }
    }
    return respostasAlex['default'];
  }

  enviarBtn.onclick = () => {
    const pergunta = chatInput.value.trim();
    if (!pergunta) return;
    addMsg(pergunta, true);
    chatInput.value = '';
    setTimeout(() => {
      addMsg(respostaInteligente(pergunta), false);
    }, 800);
  };

  // Atalhos nos botões principais
  document.querySelector('.btn-pri').onclick = () => {
    addMsg('Dominar Minha Mente', true);
    setTimeout(() => addMsg(respostasAlex['Dominar Minha Mente'], false), 800);
  };
  document.querySelector('.btn-sec').onclick = () => {
    addMsg('Conectar em Outras Redes', true);
    setTimeout(() => addMsg(respostasAlex['Conectar em Outras Redes'], false), 800);
  };
  document.querySelector('.btn-tri').onclick = () => {
    addMsg('Segredo da Mentalidade', true);
    setTimeout(() => addMsg(respostasAlex['Segredo da Mentalidade'], false), 800);
  };
  document.querySelector('.btn-qua').onclick = () => {
    addMsg('Sou Novo. Por Onde Começo?', true);
    setTimeout(() => addMsg(respostasAlex['Sou Novo. Por Onde Começo?'], false), 800);
  };

  chatInput.addEventListener('keydown', function(ev) {
    if (ev.key === 'Enter') enviarBtn.click();
  });
});
