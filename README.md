# MarsView

Landing page e explorador de Marte em **React 19 + TypeScript + Tailwind CSS 4 + Three.js + Lucide React**. Código completo, componentes modulares e recursos gráficos locais. A interface segue os textos em inglês do briefing.

## Executar

Requer Node.js 22.12+ ou 24 LTS.

```powershell
cd "D:\aresnav-mars-main\Landing Page"
npm.cmd ci
npm.cmd run dev
```

Abra a URL impressa pelo Vite, normalmente `http://127.0.0.1:5173`.
Em macOS/Linux, use `npm` no lugar de `npm.cmd`.

```sh
npm run build       # TypeScript + build estático em dist/
npm run preview     # Servir o build de produção
npm test            # Validação de dados externos
npm run typecheck
```

Publique o conteúdo de `dist/` em um host estático com HTTPS. A navegação do explorador usa `#explorer` e dispensa regras de reescrita de rotas. O projeto assume hospedagem na raiz do domínio; para uma subpasta, ajuste `base` no Vite e os caminhos dos assets. Configure o domínio absoluto nos metadados Open Graph antes da publicação pública.

## O que está implementado

- Hero central, paleta preta/cobre, fontes locais e entrada suave via Tailwind.
- Globo Three.js texturizado, arraste horizontal no toque, arraste livre com mouse, teclado, rotação automática e pausa. Fallback visual quando WebGL não está disponível.
- Exploração de Jezero, Olympus Mons e Valles Marineris com seleção de região, marcador, zoom, malha de coordenadas e reset.
- Ticker infinito com pausa e suporte a `prefers-reduced-motion`.
- Bento assimétrico, inspeção interativa da imagem Mastcam-Z e links para fontes NASA.
- Atlas planetário com período de rotação, ano marciano, gravidade e pressão média, distinguindo referências estáticas de telemetria.
- Regiões Jezero, Olympus Mons e Valles Marineris conectadas ao explorador por links profundos (`#explorer/<região>`), além de um roteiro de leitura entre missão de superfície, observações orbitais e o arquivo PDS.
- Telemetria com modo de demonstração, validação de resposta, timeout, cancelamento, nova tentativa, identificação de dados antigos e atualização a cada 60 segundos.
- Navegação mobile, skip link, foco visível, elementos semânticos e estados acessíveis.
- Carregamento separado do Three.js e do explorador; descarte de recursos gráficos e suspensão da renderização fora da tela ou com a aba oculta.

## Dados reais

Referência informada: [NASA Open APIs](https://api.nasa.gov/). Esse endereço é o portal da NASA e não uma URL JSON de telemetria. É necessário selecionar um serviço disponível e adaptar sua resposta ao contrato abaixo; este projeto não presume que o portal forneça temperatura, pressão e órbita em tempo real numa única API.

Sem endpoint configurado, os números são **demonstrativos e estáticos**, identificados na interface. O SOL 428 do ticker é uma sequência de demonstração; não representa o sol atual. Não há afirmação de conexão ativa com a NASA. As coordenadas demonstrativas representam uma referência de Jezero, não uma órbita ao vivo.

Copie `.env.example` para `.env.local` e configure:

```dotenv
VITE_TELEMETRY_URL=https://seu-dominio.com/api/mars/telemetry
VITE_REPOSITORY_URL=https://github.com/sua-organizacao/marsview
```

`VITE_*` é público no bundle. Mantenha chaves NASA e credenciais no servidor/proxy, nunca nessas variáveis. O endpoint deve permitir a origem do frontend ou ser servido no mesmo domínio. Recompile após alterar as variáveis.

Contrato JSON do proxy (adapte fontes NASA para este formato):

```json
{
  "temperatureC": -63.4,
  "pressurePa": 610,
  "latitude": 18.4446,
  "longitude": 77.4509,
  "sol": 428,
  "observedAt": "2026-01-01T12:00:00Z",
  "source": "Nome real da missão/instrumento",
  "sourceUrl": "https://science.nasa.gov/mars/"
}
```

O exemplo acima não é uma medição real. `observedAt` deve conter a data de **observação**, não a data da requisição. Leituras com mais de 15 minutos são identificadas como arquivadas. Uma falha de rede mantém a última leitura obtida e mostra o erro; nunca substitui silenciosamente uma leitura real por dados inventados. A atualização é suspensa com a aba oculta.

Sem repositório configurado, o rodapé aponta explicitamente para **NASA open source**, sem inventar um repositório MarsView.

## Limites do escopo

O globo é uma visualização de textura de cor, não um modelo científico de elevação. O card Rover Routing Engine ilustra o conceito: não inclui algoritmo de navegação, modelo digital de terreno ou cálculo de rotas. Atmospheric Zoom permite inspecionar uma imagem real; não simula física atmosférica. Esses módulos podem ser conectados sem reescrever a landing page.

## Componentes

```text
src/
  App.tsx                   Navegação landing/explorador e error boundary
  components/
    Header.tsx              Navegação responsiva
    Hero.tsx                Hero e CTAs
    MarsGlobe.tsx            Fronteira substituível do renderizador 3D
    MissionTicker.tsx        Faixa de missão
    Features.tsx             Bento de recursos
    Telemetry.tsx            Cards de dados e estados
    Explorer.tsx             Explorador interativo
    Footer.tsx               Créditos e links
  hooks/
    useTelemetry.ts         Polling, timeout e cancelamento
    useReducedMotion.ts     Preferência de acessibilidade
  lib/
    config.ts               Links e regiões
    telemetry.ts            Contrato, validação e formatação
    telemetry.test.ts       Testes da fronteira de dados
  styles.css                Tokens e utilities Tailwind
```

`MarsGlobe` aceita `paused`, `zoom`, `grid`, `region` e `className`. Use essa fronteira para conectar um `MarsGlobe.tsx` existente.

## Fontes e atribuições

- Textura: [Solar System Scope](https://www.solarsystemscope.com/textures/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Aplicada a uma esfera com iluminação artística; as cores não são uma escala científica.
- Imagem: [Perseverance’s Mastcam-Z First High-Resolution Panorama, PIA23727](https://science.nasa.gov/photojournal/perseverances-mastcam-z-first-high-resolution-panorama/). NASA/JPL-Caltech/ASU/MSSS. Redimensionada para exibição.
- Constantes de raio e gravidade: [NASA Mars Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html).
- Fontes: Manrope e IBM Plex Mono distribuídas via Fontsource; licenças incluídas nos pacotes.
- Ícones: Lucide, ISC. Demais dependências mantêm suas próprias licenças.

Projeto independente destinado ao NASA Space Apps Challenge 2026 conforme o briefing. Não implica endosso, afiliação oficial ou inscrição confirmada.
