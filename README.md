# 🎓 PDG Cooperalfa — Negociação Estratégica no Agronegócio e Cooperativismo

Sistema completo de avaliação digital e relatório gerencial desenvolvido para o **Programa de Desenvolvimento Gerencial (PDG) — Cooperalfa**, sob coordenação docente do **Prof. Marcelo Saldanha** (24h/aula).

---

## 🚀 Funcionalidades Principais

### 📱 1. Visão do Aluno (Mobile & Desktop)
- **Identificação com Autocomplete & Foto**: Seleção rápida do aluno com foto oficial do espelho da turma ou digitação manual.
- **15 Estudos de Caso de Campo & Balcão**: Questões calibradas com situações reais de cooperativismo, Método de Harvard, MAANA, Perfil Tecnificado vs Relacional, Gestão de Conflitos e Inadimplência.
- **Navegação Dinâmica**: Mapa de questões, timer em tempo real, marcação de questões para revisão e confirmação de envio.
- **Feedback Imediato & Gabarito Comentado**: Cálculo automático da nota (0 a 10.0), taxa de acerto por eixo temático, efeitos visuais comemorativos e justificativa pedagógica de cada questão.

### 👨‍🏫 2. Painel do Professor (Dashboard & Espelho da Turma)
- **Espelho da Turma (25 Alunos com Foto)**: Fotos reais de todos os alunos associadas ao desempenho individual.
- **Parecer Pedagógico Personalizado**: Campo para o professor registrar o feedback individual de cada aluno (com templates rápidos ou texto livre).
- **Indicadores em Tempo Real**: Média geral da turma, maior/menor nota, taxa de aprovação e taxa de acerto por questão (Q1 a Q15).
- **Simulador de Turma Completa (Demo)**: Botão de 1 clique para popular as 25 avaliações com dados calibrados e testar o painel imediatamente.

### 📄 3. Gerador de Relatório Oficial para a Coordenação
- **Formatação A4 Oficial**: Cabeçalho institucional Cooperalfa, sumário executivo, gráficos de domínio por competência, tabela de notas com fotos e pareceres individuais, recomendações pedagógicas e termo de encerramento com assinatura.
- **Exportação para PDF com 1 Clique**: Layout responsivo otimizado para impressão e download de PDF pelo navegador.

---

## 🛠️ Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Executar em ambiente de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build
```

---

## ☁️ Como Hospedar no GitHub e Vercel

1. **Subir no GitHub**:
```bash
git init
git add .
git commit -m "feat: Sistema de Prova e Relatório PDG Cooperalfa"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

2. **Deploy na Vercel**:
- Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
- Clique em **"Add New Project"** e selecione o repositório.
- O Framework Preset será detectado automaticamente como **Vite**.
- Clique em **"Deploy"**. Pronto! O link estará disponível para os alunos acessarem pelo celular.
