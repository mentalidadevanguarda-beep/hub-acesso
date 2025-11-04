// ⚠️ AVISO DE SEGURANÇA ⚠️
// Esta chave API está exposta no frontend apenas para TESTES
// Em PRODUÇÃO, mova para variável de ambiente no backend
// Use Vercel Functions ou outro serverless para proteger a chave
const GEMINI_API_KEY = 'AIzaSyBd8RIo2WmCiW70BWA8_jz0NKlxosESUGc';

// Chat State Management (in-memory, no localStorage)
const chatState = {
    currentFlow: 'initial',
    conversationHistory: [],
    isAIMode: false,
    isProcessing: false
};

// Data from application_data_json
const alexData = {
    name: 'Alex',
    role: 'Assistente Vanguarda',
    greeting: 'Olá. Eu sou Alex, o assistente Vanguarda.\n\nPara onde sua mentalidade deseja ir hoje?\n\nDigite sua pergunta ou clique em uma das opções abaixo:'
};

const ALEX_SYSTEM_PROMPT = `IDENTIDADE:
Nome: Alex
Empresa: Mentalidade Vanguarda
Especialidade: Transformação de mentalidade, riqueza, mindset
Personalidade: Profissional, confiante, empático, persuasivo
Idioma: Português Brasileiro

OBJETIVO:
Ajudar usuário a encontrar a solução perfeita no ecossistema Vanguarda.
Identificar intenção e oferecer com precisão.

PRODUTOS:
1. E-book 7 Dias (R$ 17) - Tripwire perfeito para começar
2. Curso Forja Vanguarda (R$ 197) - Principal transformação
3. Comunidade Elite - Suporte contínuo
4. Redes Sociais - Conteúdo gratuito diário
5. Vídeo Viral - https://youtube.com/shorts/XgKIO9UJ8qc?feature=share

REGRAS:
- Nunca pressione, apenas sugira
- Identifique a intenção do usuário
- Personalize recomendações
- Seja empático mas profissional
- Tome: Amigo confiável, não robô
- Respostas concisas e diretas
- Use emojis com moderação

EXEMPLO:
User: "Oi Alex, sou novo aqui"
Alex: "Bem-vindo! 👋 Ótimo estar aqui. Me conta: qual é seu principal desafio com mentalidade?"

User: "Quero começar do zero"
Alex: "Perfeito! Recomendo começar com 'Os 7 Dias' (R$ 17). É nossa entrada ideal. Quer saber mais?"`;

const flows = {
    initial: {
        message: alexData.greeting,
        enableInput: true,
        options: [
            { text: '🧠 Dominar Minha Mente', nextFlow: 'produtos' },
            { text: '🌐 Conectar em Outras Redes', nextFlow: 'sociais' },
            { text: '👑 O Segredo da Mentalidade', nextFlow: 'video' },
            { text: '✨ Sou Novo. Por Onde Começo?', nextFlow: 'onboarding' }
        ]
    },
    produtos: {
        message: 'Excelente escolha! A maestria começa com a ferramenta certa.\n\n📚 E-book 7 Dias (R$ 17) - Entrada perfeita\n🎓 Curso A Forja Vanguarda - Transformação completa\n👥 Comunidade Elite - Suporte contínuo\n\nQual interessa?',
        enableInput: true,
        options: [
            { text: '📚 E-book: 7 Dias Mentalidade (R$ 17)', url: 'https://www.kiwify.com.br/', external: true },
            { text: '🎓 Curso: A Forja Vanguarda (Premium)', url: 'https://www.kiwify.com.br/', external: true },
            { text: '👥 Comunidade Elite', url: 'https://wa.me/', external: true },
            { text: '← Voltar', nextFlow: 'initial', isBack: true }
        ]
    },
    sociais: {
        message: 'A disciplina exige constância! Nos encontramos diariamente:\n\n📺 YouTube - @MentalidadeVanguarda\n📱 TikTok - @mentalidadevanguarda\n📷 Instagram - @mentalidadevanguarda\n👍 Facebook - Comunidade\n\nQual rede prefere?',
        enableInput: true,
        options: [
            { text: '📺 YouTube', url: 'https://www.youtube.com/@MentalidadeVanguarda', external: true },
            { text: '📱 TikTok', url: 'https://www.tiktok.com/@mentalidadevanguarda', external: true },
            { text: '📷 Instagram', url: 'https://www.instagram.com/mentalidadevanguarda/', external: true },
            { text: '👍 Facebook', url: 'https://www.facebook.com/mentalidadevanguarda', external: true },
            { text: '← Voltar', nextFlow: 'initial', isBack: true }
        ]
    },
    video: {
        message: 'A jornada começa aqui! 🎬\n\nAssista à lição oculta que 99% das pessoas não perceberam.\n\nVocê já pode clicar na logo acima ou no vídeo para assistir!',
        enableInput: true,
        options: [
            { text: '▶️ Ver o Vídeo Agora', url: 'https://youtube.com/shorts/XgKIO9UJ8qc?feature=share', external: true },
            { text: '← Voltar', nextFlow: 'initial', isBack: true }
        ]
    },
    onboarding: {
        message: 'Bem-vindo à Mentalidade Vanguarda! 🚀\n\nAqui está o caminho recomendado:\n\n1️⃣ Assista o Vídeo (clique acima!)\n2️⃣ Comece com Os 7 Dias (R$ 17)\n3️⃣ Entre na Comunidade\n4️⃣ Explore o Curso Premium\n\nVamo começar?',
        enableInput: true,
        options: [
            { text: '1️⃣ Assista o Vídeo Principal', url: 'https://youtube.com/shorts/XgKIO9UJ8qc?feature=share', external: true },
            { text: '2️⃣ Comece com Os 7 Dias', url: 'https://www.kiwify.com.br/', external: true },
            { text: '3️⃣ Entre na Comunidade', url: 'https://wa.me/', external: true },
            { text: '4️⃣ Explore Produtos Premium', url: 'https://www.kiwify.com.br/', external: true },
            { text: '← Voltar', nextFlow: 'initial', isBack: true }
        ]
    },
    ai_mode: {
        message: 'Modo de conversa livre ativado! 🤖\n\nAgora você pode me fazer qualquer pergunta sobre mentalidade, produtos ou a metodologia Vanguarda. Estou aqui para ajudar.',
        enableInput: true,
        options: [
            { text: '← Voltar ao Menu', nextFlow: 'initial', isBack: true }
        ]
    }
};

// Intelligent Keyword-Based Response System
function getResponse(userText) {
    const text = userText.toLowerCase();
    
    // DICA/CONSELHO
    if (text.includes('dica') || text.includes('conselho') || text.includes('hoje')) {
        return "🔥 **Dica de Hoje:**\n\nA mentalidade vanguarda não é sobre ser o melhor, é sobre evoluir constantemente.\n\nHoje, desafie uma crença limitante. Aquela coisa que você acha que não consegue? Tente!\n\n📚 Quer aprender mais? Comece com nosso E-book 7 Dias - uma jornada de transformação.";
    }
    
    // E-BOOK/PRODUTO
    if (text.includes('e-book') || text.includes('ebook') || text.includes('livro') || text.includes('compra') || text.includes('produto')) {
        return "📚 **Sobre o E-book 7 Dias (R$ 17)**\n\n7 dias de lições práticas para dominar sua mente.\n\n✅ Lição 1: Fundamentos\n✅ Lição 2: Quebrando Padrões\n✅ Lição 3: Ação Disciplinada\n✅ Lição 4: Resiliência\n✅ Lição 5: Visão de Futuro\n✅ Lição 6: Liderança de Si\n✅ Lição 7: Próximos Passos\n\n👉 Pronto para começar? Clique em 'E-book 7 Dias' no acesso rápido!";
    }
    
    // VÍDEO
    if (text.includes('youtube') || text.includes('vídeo') || text.includes('video') || text.includes('shorts') || text.includes('assistir')) {
        return "▶️ **O Vídeo Viral**\n\nAssista a uma lição oculta que 99% das pessoas não percebem.\n\nEste vídeo é onde tudo começa. Uma transformação de perspectiva em menos de 3 minutos.\n\n🎬 Link: https://youtube.com/shorts/XgKIO9UJ8qc\n\nAvise-nos quando assistir! A jornada muda após isso. 🚀";
    }
    
    // REDES SOCIAIS
    if (text.includes('rede') || text.includes('instagram') || text.includes('tiktok') || text.includes('facebook') || text.includes('social')) {
        return "📱 **Nos Encontre**\n\nA comunidade Mentalidade Vanguarda está em crescimento acelerado!\n\n📺 YouTube - Conteúdo profundo e transformador\n📱 TikTok - Dicas rápidas e impactantes\n📷 Instagram - Inspiração diária e histórias\n👍 Facebook - Comunidade engajada\n\nQual rede você prefere? Vamos nos conectar! 💪";
    }
    
    // COMO COMEÇAR
    if (text.includes('como') || text.includes('começar') || text.includes('comecar') || text.includes('primeiro') || text.includes('iniciar')) {
        return "🚀 **Como Começar Sua Jornada**\n\nTrês passos simples:\n\n1️⃣ **Assista o Vídeo** → Entenda a mentalidade\n   Link: https://youtube.com/shorts/XgKIO9UJ8qc\n\n2️⃣ **Comece com o E-book 7 Dias (R$ 17)** → Transformação rápida\n   Acesso Rápido → E-book 7 Dias\n\n3️⃣ **Entre na Comunidade** → Crescimento junto\n   Escolha qualquer rede social acima\n\nQual é seu próximo passo? 💪";
    }
    
    // PREÇOS
    if (text.includes('preço') || text.includes('preco') || text.includes('custa') || text.includes('valor') || text.includes('quanto')) {
        return "💰 **Nossa Proposta de Valor**\n\n📚 E-book 7 Dias - **R$ 17**\n→ 7 lições práticas em 48 horas\n\n🎓 Curso A Forja Vanguarda - **R$ 197**\n→ Transformação completa em 30 dias\n→ Conteúdo premium + comunidade\n\n👥 Comunidade Elite - **Gratuita**\n→ Acesso via WhatsApp\n→ Suporte constante\n\n💡 Investir em si mesmo é o melhor negócio. Qual te atrai?";
    }
    
    // COMUNIDADE
    if (text.includes('comunidade') || text.includes('grupo') || text.includes('whatsapp')) {
        return "👥 **Nossa Comunidade**\n\nA Comunidade Elite Vanguarda é onde acontece a REAL transformação.\n\n✅ Suporte constante\n✅ Trocas de experiências\n✅ Desafios diários\n✅ Networking com guerreiros mentais\n✅ Acesso exclusivo a conteúdo\n\n💬 **Vamos para o WhatsApp?**\nLink: https://wa.me/\n\nLá você não é apenas um número, você é parte da revolução mental! 🔥";
    }
    
    // RESPOSTA GENÉRICA INTELIGENTE (Fallback)
    return "✨ **Ótima pergunta!**\n\nA Mentalidade Vanguarda é sobre questionar tudo, evoluir constantemente e tomar ação.\n\nO que você acabou de perguntar já mostra que você está na jornada certa.\n\nNão tem resposta imediata para isso, mas te convido a explorar:\n\n📚 E-book 7 Dias - Respostas práticas\n🎓 Curso Premium - Transformação profunda\n📱 Nossa comunidade - Trocas reais\n\nQual caminho quer trilhar? 🚀";
}

// Gemini API Integration (backup/optional)
async function callGeminiAPI(userMessage) {
    try {
        // Build conversation history for Gemini
        const contents = [
            {
                role: 'user',
                parts: [{ text: ALEX_SYSTEM_PROMPT }]
            }
        ];

        // Add conversation history
        chatState.conversationHistory.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        });

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                        topP: 0.8,
                        topK: 40
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        return 'Desculpe, estou com dificuldades técnicas no momento. Tente usar os botões de acesso rápido abaixo ou volte ao menu principal.';
    }
}

// Typing Animation
function typeMessage(element, text, speed = 60) {
    return new Promise((resolve) => {
        let index = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);
        
        const interval = setInterval(() => {
            if (index < text.length) {
                cursor.before(text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                cursor.remove();
                resolve();
            }
        }, speed);
    });
}

// Render Chat Message
function renderMessage(message, animate = true, isUser = false) {
    const chatContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'alex'}`;
    
    // Different structure for Alex vs User messages
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">👤</div>
                <div>
                    <div class="message-name">Você</div>
                    <div class="message-role">Usuário</div>
                </div>
            </div>
            <div class="message-content" id="messageContent"></div>
        `;
    } else {
        // Alex messages with photo avatar
        messageDiv.innerHTML = `
            <div class="message-header">
                <img src="https://i.pravatar.cc/150?img=12" alt="Alex" class="message-avatar-img" onerror="this.onerror=null; this.src='https://user-gen-media-assets.s3.amazonaws.com/gemini_images/d5be1d27-83c6-47d7-8acc-f85a8c42f994.png';">
                <div>
                    <div class="message-name">${alexData.name}</div>
                    <div class="message-role">${alexData.role}</div>
                </div>
            </div>
            <div class="message-content" id="messageContent"></div>
        `;
    }
    
    chatContainer.appendChild(messageDiv);
    
    const messageContent = messageDiv.querySelector('#messageContent');
    
    // Auto-scroll to bottom
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 50);
    
    if (animate && !isUser) {
        return typeMessage(messageContent, message).then(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    } else {
        messageContent.textContent = message;
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return Promise.resolve();
    }
}

// Render Buttons
function renderButtons(options) {
    const buttonsContainer = document.getElementById('buttonsContainer');
    buttonsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = `chat-button ${option.isBack ? 'back' : ''} ${option.secondary ? 'secondary' : ''}`;
        
        // Extract emoji and text
        const parts = option.text.match(/([^a-zA-Z0-9]+)?(.+)/);
        const icon = parts && parts[1] ? parts[1].trim() : '▪️';
        const text = parts && parts[2] ? parts[2].trim() : option.text;
        
        button.innerHTML = `
            <span class="button-icon">${icon}</span>
            <span class="button-text">${text}</span>
        `;
        
        button.style.animationDelay = `${index * 0.15}s`;
        
        // Event handler
        if (option.external && option.url) {
            button.addEventListener('click', () => {
                // Show user clicked message
                renderMessage(option.text, false, true);
                // Open link
                setTimeout(() => {
                    window.open(option.url, '_blank', 'noopener,noreferrer');
                }, 300);
            });
        } else if (option.nextFlow) {
            button.addEventListener('click', () => {
                // Show user clicked message
                renderMessage(option.text, false, true);
                // Transition to next flow with delay
                setTimeout(() => {
                    handleFlowTransition(option.nextFlow);
                }, 500);
            });
        }
        
        buttonsContainer.appendChild(button);
    });
}

// Handle Flow Transition
function handleFlowTransition(flowName) {
    const flow = flows[flowName];
    if (!flow) return;
    
    chatState.currentFlow = flowName;
    
    // Handle AI mode
    if (flowName === 'ai_mode') {
        chatState.isAIMode = true;
        chatState.conversationHistory = [];
    } else if (chatState.isAIMode && flowName === 'initial') {
        chatState.isAIMode = false;
    }
    
    // Clear buttons
    const buttonsContainer = document.getElementById('buttonsContainer');
    buttonsContainer.innerHTML = '';
    
    // Show/hide input
    const inputContainer = document.getElementById('inputContainer');
    if (flow.enableInput) {
        inputContainer.style.display = 'flex';
    } else {
        inputContainer.style.display = 'none';
    }
    
    // Render message with typing animation
    renderMessage(flow.message, true).then(() => {
        // Show buttons after message is complete
        renderButtons(flow.options);
    });
}

// Handle user input submission
async function handleUserMessage() {
    if (chatState.isProcessing) return;
    
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Clear input
    input.value = '';
    chatState.isProcessing = true;
    
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    sendButton.textContent = 'Enviando...';
    
    // Show user message
    renderMessage(message, false, true);
    
    // Add to history
    chatState.conversationHistory.push({
        role: 'user',
        text: message
    });
    
    // Get intelligent response using keyword analysis
    const aiResponse = getResponse(message);
    
    // Add to history
    chatState.conversationHistory.push({
        role: 'assistant',
        text: aiResponse
    });
    
    // Show AI response with small delay for natural feel
    setTimeout(async () => {
        await renderMessage(aiResponse, true, false);
        
        // Re-enable input
        chatState.isProcessing = false;
        sendButton.disabled = false;
        sendButton.textContent = 'Enviar';
        input.focus();
    }, 800);
    
}

// Initialize App
function initializeApp() {
    
    // User input handlers
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    sendButton.addEventListener('click', handleUserMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });
    
    // Start initial flow with delays
    setTimeout(() => {
        startInitialFlow();
    }, 2000);
}

// Start Initial Flow
function startInitialFlow() {
    const initialFlow = flows.initial;
    
    // Show input container immediately
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.style.display = 'flex';
    
    renderMessage(initialFlow.message, true).then(() => {
        // Show buttons after message is complete
        setTimeout(() => {
            renderButtons(initialFlow.options);
        }, 500);
    });
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Security warning on console
console.warn('⚠️ AVISO DE SEGURANÇA: Esta aplicação está usando a API key do Gemini no frontend apenas para TESTES. Em produção, mova a chave para o backend usando Vercel Functions ou similar.');
