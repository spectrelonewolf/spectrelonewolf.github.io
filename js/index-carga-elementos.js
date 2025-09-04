document.addEventListener('DOMContentLoaded', function () {
  fetch('contenido/experiencia.json') // Asegúrate de que la ruta al JSON es correcta
    .then(response => response.json())
    .then(data => {
      const projectsContainer = document.getElementById('proyectos');

      data.projects.forEach(project => {
        const projectElement = createProjectElement(project);
        projectsContainer.appendChild(projectElement);
      });
    })
    .catch(error => console.error('Error loading projects:', error));
});

function createProjectElement(project) {
  // Crear el elemento principal de la tarjeta
  const col = document.createElement('div');
  col.className = 'project-card-wrapper';
  col.id = `card-${project.id}`;

  const card = document.createElement('div');
  card.className = 'card alinear-items fondo-oscuro-gauss border border-warning';

  // Crear el carrusel de medios
  const carousel = createCarousel(project);
  card.appendChild(carousel);

  // Crear el cuerpo de la tarjeta
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body w-100';

  // Título y herramientas
  const titleSection = createTitleSection(project);
  cardBody.appendChild(titleSection);

  // Secciones de contenido (Enunciado, Requerimientos, Desarrollo)
  const accordion = createAccordion(project);
  cardBody.appendChild(accordion);

  card.appendChild(cardBody);

  // Footer con enlace al repositorio
  const footer = createFooter(project);
  card.appendChild(footer);

  // Enlace externo si existe
  if (project.externalLink) {
    const externalLink = document.createElement('a');
    externalLink.className = 'rounded-pill text-bg-warning py-2 px-2 mx-2 mb-3';
    externalLink.href = project.externalLink.url;
    externalLink.target = '_blank';
    externalLink.rel = 'noopener noreferrer';
    externalLink.innerHTML = `<strong>${project.externalLink.text}</strong>`;
    card.appendChild(externalLink);
  }

  col.appendChild(card);
  return col;
}

function createCarousel(project) {
  const carouselId = `carousel-${project.id}`;

  const carouselDiv = document.createElement('div');
  carouselDiv.id = carouselId;
  carouselDiv.className = 'carousel slide';

  const innerDiv = document.createElement('div');
  innerDiv.className = 'carousel-inner card-img-top px-3 py-3';

  project.media.forEach((media, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = `carousel-item ${index === 0 ? 'active' : ''} my-3 px-3`;

    let mediaElement;
    if (media.type === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.className = 'w-100';
      mediaElement.controls = true;
      const source = document.createElement('source');
      source.src = media.src;
      source.type = 'video/mp4';
      mediaElement.appendChild(source);
    } else if (media.type === 'image') {
      mediaElement = document.createElement('img');
      mediaElement.className = 'w-100';
      mediaElement.src = media.src;
    } else if (media.type === 'iframe') {
      mediaElement = document.createElement('iframe');
      mediaElement.className = 'embed-responsive-item';
      mediaElement.src = media.src;
      mediaElement.width = '100%';
      mediaElement.height = '400';
      mediaElement.frameBorder = '0';
    }

    itemDiv.appendChild(mediaElement);
    innerDiv.appendChild(itemDiv);
  });

  carouselDiv.appendChild(innerDiv);

  // Controles del carrusel solo si hay más de un elemento
  if (project.media.length > 1) {
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-control-prev';
    prevButton.type = 'button';
    prevButton.setAttribute('data-bs-target', `#${carouselId}`);
    prevButton.setAttribute('data-bs-slide', 'prev');

    const prevIcon = document.createElement('span');
    prevIcon.className = 'carousel-control-prev-icon';
    prevIcon.setAttribute('aria-hidden', 'true');

    const prevText = document.createElement('span');
    prevText.className = 'visually-hidden';
    prevText.textContent = 'Previous';

    prevButton.appendChild(prevIcon);
    prevButton.appendChild(prevText);

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-control-next';
    nextButton.type = 'button';
    nextButton.setAttribute('data-bs-target', `#${carouselId}`);
    nextButton.setAttribute('data-bs-slide', 'next');

    const nextIcon = document.createElement('span');
    nextIcon.className = 'carousel-control-next-icon';
    nextIcon.setAttribute('aria-hidden', 'true');

    const nextText = document.createElement('span');
    nextText.className = 'visually-hidden';
    nextText.textContent = 'Next';

    nextButton.appendChild(nextIcon);
    nextButton.appendChild(nextText);

    carouselDiv.appendChild(prevButton);
    carouselDiv.appendChild(nextButton);
  }

  return carouselDiv;
}

function createTitleSection(project) {
  const titleDiv = document.createElement('div');
  titleDiv.className = 'col text-center';

  // Herramientas
  const toolsRow = document.createElement('div');
  toolsRow.className = 'row px-3';

  const toolsBadge = document.createElement('span');
  toolsBadge.className = 'badge text-secondary bg-warning-subtle badge-light';

  const toolsCol = document.createElement('div');
  toolsCol.className = 'col px-2';

  const toolsTitleRow = document.createElement('div');
  toolsTitleRow.className = 'row py-2';
  toolsTitleRow.textContent = 'Herramientas:';

  const toolsListRow = document.createElement('div');
  toolsListRow.className = 'row';

  project.tools.forEach(tool => {
    const toolBadge = document.createElement('span');
    toolBadge.className = 'badge text-bg-warning herramientas-texto my-1';

    const toolIcon = document.createElement('i');
    toolIcon.className = `bi ${tool.icon}`;

    toolBadge.appendChild(toolIcon);
    toolBadge.appendChild(document.createTextNode(` ${tool.name}`));
    toolsListRow.appendChild(toolBadge);
  });

  toolsCol.appendChild(toolsTitleRow);
  toolsCol.appendChild(toolsListRow);
  toolsBadge.appendChild(toolsCol);
  toolsRow.appendChild(toolsBadge);
  titleDiv.appendChild(toolsRow);

  // Título
  const titleRow = document.createElement('div');
  titleRow.className = 'row herramientas-titulo text-warning text-center my-2';

  const title = document.createElement('p');
  title.innerHTML = `<strong>${project.title}</strong>`;

  titleRow.appendChild(title);
  titleDiv.appendChild(titleRow);

  return titleDiv;
}

function createAccordion(project) {
  const accordionDiv = document.createElement('div');
  accordionDiv.className = 'accordion';
  accordionDiv.id = `accordion-${project.id}`;

  project.sections.forEach((section, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    const header = document.createElement('h2');
    header.className = 'accordion-header';

    const button = document.createElement('button');
    button.className = 'accordion-button text-bg-warning fw-bold collapsed'; // Siempre collapsed
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#collapse-${project.id}-${index}`);
    button.setAttribute('aria-expanded', 'false'); // Siempre false
    button.setAttribute('aria-controls', `collapse-${project.id}-${index}`);
    button.textContent = section.title;

    header.appendChild(button);
    accordionItem.appendChild(header);

    const collapseDiv = document.createElement('div');
    collapseDiv.id = `collapse-${project.id}-${index}`;
    collapseDiv.className = 'accordion-collapse collapse'; // Sin 'show'
    collapseDiv.setAttribute('data-bs-parent', `#accordion-${project.id}`);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'accordion-body';
    bodyDiv.innerHTML = section.content;

    collapseDiv.appendChild(bodyDiv);
    accordionItem.appendChild(collapseDiv);

    accordionDiv.appendChild(accordionItem);
});

return accordionDiv;
}

function createFooter(project) {
  const footerDiv = document.createElement('div');
  footerDiv.className = 'card-footer';

  const repoLink = document.createElement('a');
  repoLink.href = project.repository;
  repoLink.className = 'btn mb-2 btn-warning fw-bold';
  repoLink.textContent = 'Ver Repositorio';

  footerDiv.appendChild(repoLink);
  return footerDiv;
}