// 1. Recuperação e Validação do LocalStorage
const dadosSalvosFormulario = localStorage.getItem("dadosFormulario");
console.log("Dados brutos do LocalStorage:", dadosSalvosFormulario);

if (!dadosSalvosFormulario) {
    console.log("Nenhum usuário encontrado no LocalStorage.");
} else {
    try {
        const dadosFormulario = JSON.parse(dadosSalvosFormulario);
        const elementoAverageRating = document.getElementById("average_rating");
        
        // Verifica se a propriedade existe antes de renderizar para evitar "undefined" na tela
        if (dadosFormulario && dadosFormulario.average_rating && elementoAverageRating) {
          elementoAverageRating.textContent = dadosFormulario.average_rating;
        }

    } catch (erro) {
        console.error("Erro ao converter os dados do LocalStorage para JSON:", erro);
    }
}

// 2. Renderizar Serviços Aceitos
function renderizarServicos(servicos) {
    const servicesList = document.getElementById('services-list');
    const servicesCount = document.getElementById('services-count');
    
    if (!servicesList) return;
    
    if (!servicos || servicos.length === 0) {
        servicesList.innerHTML = '<p class="empty-state">Nenhum serviço aceito no momento.</p>';
        if (servicesCount) servicesCount.textContent = '0';
        return;
    }

    if (servicesCount) servicesCount.textContent = servicos.length;

    servicesList.innerHTML = servicos.map(servico => `
        <article class="service-card">
            <div class="service-avatar">${servico.initials || 'US'}</div>
            
            <div class="service-info">
                <h3 class="service-name">${servico.nome || 'Sem nome'} ${servico.rating ? `⭐ ${servico.rating}` : ''}</h3>
                <p class="service-location">${servico.cidade || 'Localização não especificada'}, ${servico.estado || 'BR'}</p>
            </div>

            <div class="service-meta">
                <h4 style="margin: 0; font-size: 0.9rem; color: #6f826a; font-weight: 500;">Informações</h4>
                <div class="service-meta-item">
                    <span class="service-meta-label">Tipo</span>
                    <span class="service-meta-value">${servico.tipo || 'Por hora'}</span>
                </div>
                <div class="service-meta-item">
                    <span class="service-meta-label">Duração</span>
                    <span class="service-meta-value">${servico.duracao || '6 horas'}</span>
                </div>
                <div class="service-meta-item">
                    <span class="service-meta-label">Endereço</span>
                    <span class="service-meta-value">${servico.endereco || 'Não especificado'}</span>
                </div>
            </div>

            <div class="service-description">
                <h4 style="margin: 0; font-size: 0.9rem; color: #6f826a; font-weight: 500;">Descrição</h4>
                <p class="service-description-text">${servico.descricao || 'Sem descrição disponível.'}</p>
            </div>

            <div class="service-pricing">
                <p class="service-price">${servico.preco || 'R$0'}</p>
                <p class="service-price-detail">${servico.preco_total || 'R$0 total'}</p>
                <span class="service-status">${servico.status || 'Faltam 2h'}</span>
            </div>
        </article>
    `).join('');
}

// 3. Carregar Serviços da API
async function carregarServicosSolicitados() {
    try {
        const respostaSolicitados = await fetch("http://localhost:8080/assignments");
        
        if (!respostaSolicitados.ok) {
            throw new Error(`Erro na requisição: ${respostaSolicitados.status}`);
        }

        const servicosSolicitados = await respostaSolicitados.json();
        console.log("Serviços aceitos carregados com sucesso:", servicosSolicitados);
        renderizarServicos(servicosSolicitados);

    } catch (erro) {
        console.error("Não foi possível carregar os serviços da API:", erro);
        
        // Dados de exemplo para desenvolvimento
        const servicosExemplo = [
            {
                nome: 'Italy Caffé',
                initials: 'IC',
                rating: '4.5',
                cidade: 'Curitiba',
                estado: 'PR',
                tipo: 'Por hora',
                duracao: '6 horas',
                endereco: 'Praça Gen. Osório, 125',
                descricao: 'Buscamos barista experiente para turno da tarde no Italy Caffé. Responsável pelo preparo de espresso, cappuccino e drinks especiais. Ambiente descontraído e equipe acolhedora.',
                preco: 'R$18/h',
                preco_total: 'R$108 total (6h)',
                status: 'Faltam 2h até o serviço'
            }
        ];
        
        renderizarServicos(servicosExemplo);
    }
}

// Chamar ao carregar a página
carregarServicosSolicitados();