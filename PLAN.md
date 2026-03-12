# CV Generator - Plano de Desenvolvimento

> Aplicacao Next.js de tela unica para criacao, edicao e exportacao de curriculos.
> Sem backend, sem autenticacao. Dados persistidos no localStorage do navegador.

## Visao Geral

| Atributo | Detalhe |
|---|---|
| Framework | Next.js 15+ (App Router) + TypeScript |
| Estado/Persistencia | Zustand + localStorage |
| Estilo | Tailwind CSS 4+ |
| Tema | next-themes (light/dark) |
| i18n | next-intl (PT-BR, EN, ES) |
| Formularios | React Hook Form + Zod |
| Export PDF | pdfmake (100% client-side) |
| Export DOCX | docx (100% client-side) |
| UI Components | shadcn/ui + Radix UI |

## Decisoes de Escopo

- Incluido: aplicacao local, sem backend e sem autenticacao.
- Incluido: pagina unica para edicao + preview + exportacao (sem home).
- Incluido: 3 idiomas (PT-BR, EN, ES).
- Incluido: tema light/dark com persistencia.
- Incluido: exportacao PDF e DOCX no cliente.
- Incluido: visibilidade por secao e por item.
- Incluido: import/export de JSON como backup manual.
- Fora do escopo v1: multiplos templates avancados, colaboracao, nuvem, analytics.

## Modelo de Dados (alto nivel)

```ts
interface CVDocument {
  id: string
  personalInfo: {
    fullName: string
    email: string
    phone?: string
    location?: string
    summary?: string
    website?: string
    linkedIn?: string
    github?: string
    photo?: string
  }
  sections: {
    experience: { items: ExperienceItem[]; visible: boolean }
    education: { items: EducationItem[]; visible: boolean }
    languages: { items: LanguageItem[]; visible: boolean }
    skills: { items: SkillItem[]; visible: boolean }
    volunteer: { items: VolunteerItem[]; visible: boolean }
    projects: { items: ProjectItem[]; visible: boolean }
    extras: { items: ExtraItem[]; visible: boolean }
  }
  metadata: {
    createdAt: string
    updatedAt: string
    schemaVersion: number
  }
}
```

Cada item de lista deve incluir `id` e `visible` para controle fino do que aparece na exportacao.

## Estrutura de Pastas

```text
src/
  app/
    layout.tsx
    [locale]/
      layout.tsx
      page.tsx
    globals.css
  components/
    ui/
    layout/
      AppHeader.tsx
      SectionNav.tsx
    form/
      PersonalInfoSection.tsx
      ExperienceSection.tsx
      EducationSection.tsx
      LanguagesSection.tsx
      SkillsSection.tsx
      VolunteerSection.tsx
      ProjectsSection.tsx
      ExtrasSection.tsx
    preview/
      CVPreview.tsx
    export/
      ExportPanel.tsx
      VisibilityPanel.tsx
  hooks/
    useCVStore.ts
    useExport.ts
  lib/
    storage.ts
    schemas.ts
    utils.ts
    exporters/
      pdf.generator.ts
      docx.generator.ts
  types/
    cv.types.ts
  locales/
    pt-br.json
    en.json
    es.json
  middleware.ts
```

## Fase 0 - Setup do Projeto

Objetivo: base funcional pronta para desenvolvimento.

Checklist:

- [ ] Inicializar projeto com create-next-app (TypeScript + App Router).
- [ ] Configurar Tailwind CSS.
- [ ] Instalar e configurar next-themes.
- [ ] Instalar e configurar next-intl com rotas de locale.
- [ ] Instalar Zustand.
- [ ] Instalar React Hook Form e Zod.
- [ ] Instalar pdfmake e docx.
- [ ] Configurar shadcn/ui com componentes base.
- [ ] Configurar aliases de import no tsconfig.
- [ ] Configurar lint/format.
- [ ] Validar que o projeto sobe sem erros.

Criterio de pronto:

- [ ] Aplicacao inicia corretamente.
- [ ] Rotas de idioma funcionam (PT-BR, EN, ES).
- [ ] Alternancia de tema funciona sem flicker perceptivel.

## Fase 1 - Modelagem de Dados e Store

Objetivo: definir contrato de dados e persistencia local robusta.

Checklist:

- [ ] Criar tipos completos em `src/types/cv.types.ts`.
- [ ] Criar schemas Zod em `src/lib/schemas.ts`.
- [ ] Criar wrapper de localStorage em `src/lib/storage.ts`.
- [ ] Implementar store global com Zustand em `src/hooks/useCVStore.ts`.
- [ ] Implementar autosave em toda mutacao relevante.
- [ ] Implementar reset total com confirmacao de UX.
- [ ] Implementar import/export JSON validado por schema.

Criterio de pronto:

- [ ] Dados persistem apos reload.
- [ ] Dados invalidos no localStorage sao descartados com fallback seguro.

## Fase 2 - Internacionalizacao

Objetivo: cobertura completa de PT-BR, EN e ES.

Checklist:

- [ ] Criar arquivos de traducao `pt-br.json`, `en.json`, `es.json`.
- [ ] Estruturar namespaces (common, form, sections, export, errors).
- [ ] Traduzir labels, placeholders, validacoes e textos de exportacao.
- [ ] Criar LanguageSwitcher no cabecalho.
- [ ] Persistir idioma selecionado.
- [ ] Garantir troca de idioma sem perda dos dados do formulario.

Criterio de pronto:

- [ ] Toda UI muda de idioma sem textos hardcoded remanescentes.

## Fase 3 - Tema Light/Dark

Objetivo: suporte consistente a tema claro e escuro.

Checklist:

- [ ] Configurar ThemeProvider no layout raiz.
- [ ] Definir tokens de cor para light/dark.
- [ ] Criar ThemeSwitcher no cabecalho.
- [ ] Aplicar tema em formularios, preview, botoes e modais.
- [ ] Validar contraste e legibilidade em ambos os temas.

Criterio de pronto:

- [ ] Tema persiste apos reload e nao quebra componentes.

## Fase 4 - Editor de CV por Secoes

Objetivo: formulario completo para todas as secoes de curriculo.

Checklist geral:

- [ ] Implementar layout editor + preview responsivo.
- [ ] Implementar navegacao por secoes.
- [ ] Implementar CRUD por secao.
- [ ] Implementar reorder por item.
- [ ] Implementar toggle de visibilidade por secao e por item.

Secoes:

- [ ] Dados Pessoais (nome, email, contatos, resumo, links, foto).
- [ ] Experiencia Profissional.
- [ ] Formacao Academica.
- [ ] Idiomas.
- [ ] Skills.
- [ ] Voluntariado / Outras Experiencias.
- [ ] Projetos.
- [ ] Informacoes Extras.

Criterio de pronto:

- [ ] Usuario consegue preencher e editar todas as secoes.
- [ ] Visibilidade por item funciona no estado local.

## Fase 5 - Preview Dinamico

Objetivo: visualizacao fiel ao CV final exportado.

Checklist:

- [ ] Criar componente principal de preview.
- [ ] Aplicar regra estrita: secao visivel e item visivel.
- [ ] Respeitar ordem dos itens definida no editor.
- [ ] Ajustar hierarquia visual com base no arquivo example.pdf.
- [ ] Definir largura de preview aproximada de A4 para paridade de export.

Criterio de pronto:

- [ ] Conteudo do preview corresponde exatamente ao conteudo exportado.

## Fase 6 - Exportacao PDF e DOCX

Objetivo: gerar arquivos finais com consistencia de conteudo.

Checklist compartilhado:

- [ ] Criar funcao `filterCVForExport` para aplicar filtros de visibilidade.
- [ ] Garantir uso da mesma funcao para PDF e DOCX.

PDF:

- [ ] Implementar gerador em `src/lib/exporters/pdf.generator.ts`.
- [ ] Montar estrutura com estilos de titulo, secao e corpo.
- [ ] Incluir apenas secoes/itens visiveis.
- [ ] Download com nome amigavel de arquivo.

DOCX:

- [ ] Implementar gerador em `src/lib/exporters/docx.generator.ts`.
- [ ] Reproduzir mesma ordem e regras de visibilidade do PDF.
- [ ] Validar abertura no Word e LibreOffice.

UI de exportacao:

- [ ] Criar painel com botoes PDF, DOCX e JSON.
- [ ] Exibir estado de loading e erros amigaveis.

Criterio de pronto:

- [ ] PDF e DOCX exportados com paridade de conteudo e estrutura esperada.

## Fase 7 - UX, Responsividade e Acessibilidade Basica

Objetivo: experiencia solida para uso real em desktop e mobile.

Checklist:

- [ ] Responsividade completa para editor e preview.
- [ ] Confirmacao antes de limpar dados.
- [ ] Feedback visual para salvar/exportar/erros.
- [ ] Labels e foco acessivel em todos os campos.
- [ ] Navegacao por teclado funcional nas acoes principais.

Criterio de pronto:

- [ ] Fluxo completo utilizavel em desktop e mobile sem quebra.

## Fase 8 - Testes e Validacao Final

Objetivo: reduzir regressao e garantir confiabilidade da v1.

Checklist automatizado:

- [ ] Testar schemas Zod.
- [ ] Testar wrapper de localStorage.
- [ ] Testar filtro de exportacao por visibilidade.
- [ ] Testar acoes principais da store.

Checklist manual:

- [ ] Preencher CV completo e validar persistencia apos reload.
- [ ] Ocultar secao/item e validar ausencia no preview e exportacoes.
- [ ] Alternar idioma e validar toda a interface.
- [ ] Alternar tema e validar persistencia visual.
- [ ] Exportar PDF e DOCX com diferentes combinacoes de dados.
- [ ] Importar JSON e confirmar restauracao completa.

Criterio de pronto:

- [ ] Checklist manual executado sem bloqueios criticos.

## Dependencias entre Fases

Ordem recomendada:

1. Fase 0
2. Fase 1
3. Fase 2 e Fase 3 (podem ocorrer em paralelo)
4. Fase 4
5. Fase 5
6. Fase 6
7. Fase 7
8. Fase 8

## Riscos e Mitigacoes

| Risco | Severidade | Mitigacao |
|---|---|---|
| Perda de dados ao limpar navegador | Alta | Import/export JSON e orientacao de backup |
| Divergencia entre preview e exportacao | Alta | Funil unico `filterCVForExport` para ambos geradores |
| Layout ruim em CV muito longo | Media | Ajustar quebrar pagina no PDF e revisar template |
| localStorage com dado invalido | Media | Validacao Zod + fallback seguro |
| Inconsistencia de tema | Baixa | Tokens de tema centralizados + testes visuais |

## Referencia Visual

- Arquivo de referencia no workspace: `example.pdf`
