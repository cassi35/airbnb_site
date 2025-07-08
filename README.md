# nome do projeto 
<h1>airbnb clone</h1>

## objetivo 
<p>Este projeto é um clone funcional do Airbnb, permitindo que usuários cadastrem acomodações, reservem estadias, filtrem locais por data e características, e realizem login com autenticação segura. O sistema oferece uma interface moderna, responsiva e interativa. O objetivo é aplicar boas práticas de engenharia de software com arquitetura MVC, React Router e TypeScript fullstack.</p>

## arquitetura
<ul>
<li><strong>frontend:</strong> React + TypeScript + React Router DOM v7 + TailwindCSS + Axios</li>
<li><strong>backend:</strong> Node.js + TypeScript + MVC + Express ou Fastify + MongoDB + Prisma + REST API</li>
<li><strong>deploy:</strong> Vercel (frontend) + Render (backend)</li>
<li><strong>database:</strong> MongoDB (principais entidades: User, Listing, Reservation, Conversation)</li>
<li><strong>autenticação:</strong> JWT + OAuth (Google)</li>
<li><strong>armazenamento de imagem:</strong> Cloudinary</li>
<li><strong>validação:</strong> Zod</li>
<li><strong>email:</strong> Nodemailer (confirmação e notificações)</li>
</ul>

## Requisitos Funcionais
<ol>
<li>Cadastro e login com e-mail/senha ou Google OAuth</li>
<li>Criar listagens de acomodações</li>
<li>Visualizar listagens com filtros (local, preço, tipo, data, hóspedes)</li>
<li>Reservar acomodações disponíveis</li>
<li>Ver histórico de reservas</li>
<li>Editar e deletar próprias acomodações</li>
<li>Entrar em contato com o anfitrião (mensagens)</li>
<li>Receber confirmação de reserva por e-mail</li>
<li>Login persistente via token JWT + cookies</li>
<li>Logout com limpeza de cookies</li>
</ol>

## Requisitos Não Funcionais
<ul>
<li><strong>Desempenho</strong>
  <ul>
    <li>Tempo de resposta inferior a 2 segundos</li>
    <li>Suporte a 500 usuários simultâneos</li>
  </ul>
</li>
<li><strong>Usabilidade</strong>
  <ul>
    <li>Layout moderno e limpo</li>
    <li>Responsivo (mobile, tablet e desktop)</li>
    <li>Figma como base de design</li>
  </ul>
</li>
<li><strong>Segurança</strong>
  <ul>
    <li>Criptografia de senhas com bcrypt</li>
    <li>Validação de dados com Zod</li>
    <li>Proteção contra XSS e CSRF</li>
    <li>CORS configurado</li>
  </ul>
</li>
<li><strong>Confiabilidade</strong>
  <ul>
    <li>Backup diário do banco</li>
    <li>Logs de erro e monitoramento</li>
  </ul>
</li>
<li><strong>Disponibilidade</strong>
  <ul>
    <li>API e frontend disponíveis 24h</li>
    <li>Ambiente de staging para testes</li>
  </ul>
</li>
</ul>

## Restrições
<ul>
<li><strong>Prazos</strong>
  <section>
    <h6>Organização via Trello</h6>
    <ul>
      <li><em>Semana 1</em>: Setup backend MVC + autenticação</li>
      <li><em>Semana 2</em>: Frontend com React Router + pages principais</li>
      <li><em>Semana 3</em>: Integração frontend/backend + deploy</li>
    </ul>
  </section>
</li>
<li><strong>Custos</strong>
  <ul>
    <li>Cloudinary</li>
    <li>Render</li>
    <li>MongoDB Atlas</li>
    <li>Vercel</li>
  </ul>
</li>
<li><strong>Disponibilidade:</strong> 24h por dia</li>
<li><strong>Segurança:</strong> HTTPS obrigatório + headers configurados</li>
</ul>

## condição
<ul>
  <li>Compatível com dispositivos móveis, tablets e desktops</li>
  <li>Compatível com navegadores modernos (Chrome, Firefox, Safari)</li>
  <li>Todos os testes funcionais e visuais devem ser executados antes de publicação</li>
  <li>Imagens devem estar otimizadas via CDN</li>
  <li>Cookies seguros e expirando corretamente</li>
  <li>Backup e logging configurados no backend</li>
</ul>

## Diagramas e Modelos
<ul>
  <li><strong>draw.io:</strong> Relacionamento de entidades (User, Listing, Reservation...)</li>
</ul>

## Critérios de Aceitação
<ul>
  <li>Usuário consegue se cadastrar, criar e reservar acomodações</li>
  <li>Frontend responsivo e funcional</li>
  <li>Backend estruturado com MVC</li>
  <li>Login persistente e logout funcional</li>
  <li>Integração entre frontend e backend testada</li>
</ul>

## Regras de Negócio
<ul>
  <li>Somente usuários autenticados podem criar reservas ou listagens</li>
  <li>Usuário só pode editar/deletar listagens que criou</li>
  <li>Não é permitido reservar acomodações com datas conflitantes</li>
  <li>Listagens só aparecem se estiverem ativas</li>
  <li>Reservas só são criadas se houver disponibilidade de datas</li>
  <li>Mensagens entre usuário e anfitrião devem ser salvas e exibidas corretamente</li>
</ul>
