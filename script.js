import { EXAM_DATA, ANSWERS } from './data.js';

// DOM Elements
const views = {
  list: document.getElementById('view-list'),
  grid: document.getElementById('view-grid'),
  detail: document.getElementById('view-detail')
};

const backToListBtn = document.getElementById('back-to-list');
const backToGridBtn = document.getElementById('back-to-grid');
const examListContainer = document.getElementById('exam-list');
const imageGridContainer = document.getElementById('image-grid');
const mainImage = document.getElementById('main-image');
const answerBody = document.getElementById('answer-body');
const gridTitle = document.getElementById('grid-title');
const detailTitle = document.getElementById('detail-title');

// State Manager
let currentState = {
  view: 'list',
  currentFolder: null,
  currentImage: null
};

// --- Initialization ---
function init() {
  renderExamList();
  
  // Navigation Events
  backToListBtn.onclick = () => switchView('list');
  backToGridBtn.onclick = () => switchView('grid');

  // Handle Browser Back Button (Optional)
  window.onpopstate = (e) => {
    if (e.state && e.state.view) {
      switchView(e.state.view, false);
    }
  };
}

// --- Navigation Logic ---
function switchView(viewName, pushState = true) {
  // Hide all views
  Object.values(views).forEach(v => v.classList.remove('active'));
  
  // Show target view
  views[viewName].classList.add('active');
  currentState.view = viewName;

  // Update Navigation Bar Buttons
  backToListBtn.style.display = (viewName === 'grid') ? 'flex' : 'none';
  backToGridBtn.style.display = (viewName === 'detail') ? 'flex' : 'none';

  if (pushState) {
    history.pushState({ view: viewName }, '', `#${viewName}`);
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- View Rendering ---

// View 1: List View
function renderExamList() {
  examListContainer.innerHTML = '';
  
  Object.keys(EXAM_DATA).forEach(folderName => {
    const item = document.createElement('div');
    item.className = 'exam-item';
    item.innerHTML = `
      <div class="exam-info">
        <h3>${folderName}</h3>
        <div class="exam-meta">
          <span>${EXAM_DATA[folderName].length} câu hỏi</span>
          <span>•</span>
          <span>Cập nhật mới nhất</span>
        </div>
      </div>
      <div class="tag">Xem bộ đề</div>
    `;
    item.onclick = () => openFolder(folderName);
    examListContainer.appendChild(item);
  });
}

// View 2: Grid View
function openFolder(folderName) {
  currentState.currentFolder = folderName;
  gridTitle.innerText = folderName;
  
  imageGridContainer.innerHTML = '';
  const images = EXAM_DATA[folderName];

  images.forEach(imageName => {
    const card = document.createElement('div');
    card.className = 'thumb-card';
    card.innerHTML = `
      <img class="thumb-img" src="img/${folderName}/${imageName}" alt="${imageName}" loading="lazy">
      <div class="thumb-label">${imageName}</div>
    `;
    card.onclick = () => openImage(imageName);
    imageGridContainer.appendChild(card);
  });

  switchView('grid');
}

// View 3: Detail View
function openImage(imageName) {
  currentState.currentImage = imageName;
  detailTitle.innerText = imageName;
  
  const imagePath = `img/${currentState.currentFolder}/${imageName}`;
  mainImage.src = imagePath;
  
  // Load Answer
  const answerKey = `${currentState.currentFolder}_${imageName}`;
  const answerHtml = ANSWERS[answerKey] || "Chưa có đáp án cho câu hỏi này. Bạn hãy bình luận phía dưới để thảo luận nhé!";
  answerBody.innerText = answerHtml;

  switchView('detail');
}

// Start the APP
document.addEventListener('DOMContentLoaded', init);
