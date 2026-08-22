import './style.css';
const savedDarkMode = localStorage.getItem('darkMode');

if (savedDarkMode === 'true') {
  document.body.classList.add('dark-mode');
}

document.querySelector('#app').innerHTML = `
  <div class="auth-page">
    <div class="auth-card">
      <div class="brand">
        <h1>NoteX</h1>
        <p>Smart Digital Notepad</p>
      </div>

      <div class="tabs">
        <button id="loginTab" class="tab active">Login</button>
        <button id="registerTab" class="tab">Register</button>
      </div>

      <form id="loginForm" class="auth-form">
        <h2>Welcome Back</h2>

        <input
          type="email"
          id="loginEmail"
          placeholder="Email"
          required
        />

        <input
          type="password"
          id="loginPassword"
          placeholder="Password"
          required
        />

        <button type="submit" class="primary-btn">
          Login
        </button>

        <p id="loginMessage" class="message"></p>
      </form>

      <form id="registerForm" class="auth-form hidden">
        <h2>Create Account</h2>

        <input
          type="text"
          id="registerName"
          placeholder="Full Name"
          required
        />

        <input
          type="email"
          id="registerEmail"
          placeholder="Email"
          required
        />

        <input
          type="password"
          id="registerPassword"
          placeholder="Password"
          required
        />

        <button type="submit" class="primary-btn">
          Create Account
        </button>

        <p id="registerMessage" class="message"></p>
      </form>
    </div>
  </div>
`;

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');

  loginTab.classList.add('active');
  registerTab.classList.remove('active');
});

registerTab.addEventListener('click', () => {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');

  registerTab.classList.add('active');
  loginTab.classList.remove('active');
});
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const API_BASE = `${BACKEND_URL}/api/users`;

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const registerMessage = document.getElementById('registerMessage');

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data || 'Registration failed');
    }

    registerMessage.textContent = 'Account created successfully!';
    registerMessage.style.color = 'green';

    registerForm.reset();

    setTimeout(() => {
      loginTab.click();
    }, 1000);

  } catch (error) {
    registerMessage.textContent = error.message;
    registerMessage.style.color = 'red';
  }
});


loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const loginMessage = document.getElementById('loginMessage');

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data || 'Login failed');
    }

    localStorage.setItem('user', JSON.stringify(data));

loginMessage.textContent = 'Login successful!';
loginMessage.style.color = 'green';

setTimeout(() => {
  showDashboard(data);
}, 500);

  } catch (error) {
    loginMessage.textContent = error.message;
    loginMessage.style.color = 'red';
  }
});
function showDashboard(user) {
  document.querySelector('#app').innerHTML = `
    <div class="dashboard-layout">

      <aside class="sidebar">
        <div>
          <div class="sidebar-brand">
            <h2>NoteX</h2>
            <p>Smart Notepad</p>
          </div>

          <nav class="sidebar-nav">
            <button class="nav-item active" id="dashboardBtn">🏠 Dashboard</button>
            <button class="nav-item" id="allNotesBtn">📝 All Notes</button>
            <button class="nav-item" id="favoritesBtn">⭐ Favorites</button>
            <button class="nav-item" id="archivedNotesBtn">📦 Archived Notes</button>
            <button class="nav-item" id="categoriesBtn">🗂️ Categories</button>
            <button class="nav-item" id="studyModeBtn">🎓 Study Mode</button>
            <button class="nav-item" id="analyticsBtn">📊 Analytics</button>
          </nav>
        </div>

        <div class="sidebar-bottom">
          <button class="nav-item" id="settingsBtn">⚙️ Settings</button>
          <button class="nav-item logout-btn" id="logoutBtn">
            🚪 Logout
          </button>
        </div>
      </aside>

      <main class="dashboard-main">

        <header class="dashboard-header">
          <div>
            <p class="welcome-text">Welcome back</p>
            <h1>${user.name} 👋</h1>
          </div>

          <button class="create-note-btn" id="createNoteBtn">
            + Create Note
          </button>
        </header>

        <section class="search-section">
  <div class="search-box">
    <input
      type="text"
      id="noteSearch"
      placeholder="Search your notes..."
    />
    <button id="searchBtn">Search</button>
  </div>
</section>

        <section class="stats-grid">

          <div class="stat-card">
            <span>📝</span>
            <div>
              <p>Total Notes</p>
              <h2 id="totalNotes">0</h2>
            </div>
          </div>

          <div class="stat-card">
            <span>⭐</span>
            <div>
              <p>Favorites</p>
              <h2 id="favoriteNotes">0</h2>
            </div>
          </div>

          <div class="stat-card">
            <span>🗂️</span>
            <div>
              <p>Categories</p>
              <h2 id="categoryCount">0</h2>
            </div>
          </div>

          <div class="stat-card">
            <span>🎓</span>
            <div>
              <p>Study Sessions</p>
              <h2>0</h2>
            </div>
          </div>

        </section>

        <section class="notes-section">

          <div class="section-heading">
            <div>
              <h2>Recent Notes</h2>
              <p>Your latest notes will appear here.</p>
            </div>

            <button class="view-all-btn" id="viewAllBtn">
  View All
</button>
          </div>

          <div id="notesContainer" class="notes-grid">

            <div class="empty-notes">
              <div>📝</div>
              <h3>No notes yet</h3>
              <p>Create your first note to get started.</p>

              <button id="emptyCreateBtn">
                + Create Note
              </button>
            </div>

          </div>

        </section>

      </main>

    </div>
  `;
  const createNoteBtn = document.getElementById('createNoteBtn');
const emptyCreateBtn = document.getElementById('emptyCreateBtn');

function openCreateNoteModal() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="noteModal">
      <div class="note-modal">
        <div class="modal-header">
          <h2>Create New Note</h2>
          <button id="closeModalBtn">✕</button>
        </div>

        <form id="createNoteForm">

          <input
            type="text"
            id="noteTitle"
            placeholder="Note title"
            required
          />

          <input
            type="text"
            id="noteCategory"
            placeholder="Category e.g. Java, DBMS, Data Science"
          />

          <textarea
            id="noteContent"
            placeholder="Start writing your note..."
            required
          ></textarea>

          <button type="submit" class="save-note-btn">
            Save Note
          </button>

          <p id="noteMessage"></p>

        </form>
      </div>
    </div>
  `);

  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('noteModal').remove();
  });

  document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const category = document.getElementById('noteCategory').value;
    const content = document.getElementById('noteContent').value;

    const noteMessage = document.getElementById('noteMessage');

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/notes/user/${user.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            content,
            category
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data || 'Failed to create note');
      }

      noteMessage.textContent = 'Note saved successfully!';
      noteMessage.style.color = 'green';

      setTimeout(() => {
        document.getElementById('noteModal').remove();
        loadNotes(user);
      }, 500);

    } catch (error) {
      noteMessage.textContent = error.message;
      noteMessage.style.color = 'red';
    }
  });
}

createNoteBtn.addEventListener('click', openCreateNoteModal);

if (emptyCreateBtn) {
  emptyCreateBtn.addEventListener('click', openCreateNoteModal);
}

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    location.reload();
  });
document.getElementById('archivedNotesBtn').addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

    const archivedNotes = notes.filter(note => note.archived);

    const container = document.getElementById('notesContainer');

    if (archivedNotes.length === 0) {
      container.innerHTML = `
      
        <div class="empty-notes">
          <div>📦</div>
          <h3>No archived notes</h3>
          <p>Your archived notes will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = archivedNotes.map(note => `
      <div class="note-card" onclick="openNote(${note.id})">

        <div class="note-card-top">
          <span class="note-category">
            ${note.category || 'General'}
          </span>

          <span>📦</span>
        </div>

        <h3>${note.title}</h3>

        <p>
          ${note.content.length > 120
            ? note.content.substring(0, 120) + '...'
            : note.content}
        </p>

        <div class="note-card-bottom">
          <span>
            ${new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>

      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load archived notes:', error);
  }
});

const noteSearch = document.getElementById('noteSearch');
const searchBtn = document.getElementById('searchBtn');

async function performSearch() {
  const keyword = noteSearch.value.trim();

  if (keyword === '') {
    loadNotes(user);
    return;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}/search?keyword=${encodeURIComponent(keyword)}`
    );

    const notes = await response.json();

    const activeNotes = notes.filter(note => !note.archived);
    const container = document.getElementById('notesContainer');

    if (activeNotes.length === 0) {
      container.innerHTML = `
        <div class="empty-notes">
          <div>🔍</div>
          <h3>No notes found</h3>
          <p>Try a different search.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activeNotes.map(note => `
      <div class="note-card" onclick="openNote(${note.id})">

        <div class="note-card-top">
          <span class="note-category">
            ${note.category || 'General'}
          </span>

          <span>${note.favorite ? '⭐' : ''}</span>
        </div>

        <h3>${note.title}</h3>

        <p>
          ${
            note.content.length > 120
              ? note.content.substring(0, 120) + '...'
              : note.content
          }
        </p>

        <div class="note-card-bottom">
          <span>
            ${new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>

      </div>
    `).join('');

  } catch (error) {
    console.error('Search failed:', error);
  }
}

searchBtn.addEventListener('click', performSearch);

noteSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    performSearch();
  }
});


const categoriesBtn = document.getElementById('categoriesBtn');

categoriesBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

    const activeNotes = notes.filter(note => !note.archived);

    const categories = [
      ...new Set(
        activeNotes.map(note => note.category || 'General')
      )
    ];

    const container = document.getElementById('notesContainer');

    if (categories.length === 0) {
      container.innerHTML = `
        <div class="empty-notes">
          <div>🗂️</div>
          <h3>No categories found</h3>
          <p>Create notes with categories first.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = categories.map(category => `
      <div
        class="note-card category-card"
        onclick="filterByCategory('${category}')"
      >
        <div style="font-size: 32px;">🗂️</div>
        <h3>${category}</h3>
        <p>
          ${
            activeNotes.filter(note =>
              (note.category || 'General') === category
            ).length
          } notes
        </p>
      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load categories:', error);
  }
});
const dashboardBtn = document.getElementById('dashboardBtn');

dashboardBtn.addEventListener('click', () => {
  loadNotes(user);
});
const allNotesBtn = document.getElementById('allNotesBtn');

allNotesBtn.addEventListener('click', () => {
  loadNotes(user);
});
const viewAllBtn = document.getElementById('viewAllBtn');

viewAllBtn.addEventListener('click', () => {
  loadNotes(user);
});
const analyticsBtn = document.getElementById('analyticsBtn');

analyticsBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

    const favorites = notes.filter(note => note.favorite);
    const archived = notes.filter(note => note.archived);

    const categories = new Set(
      notes
        .map(note => note.category)
        .filter(category => category)
    );

    const container = document.getElementById('notesContainer');

    container.innerHTML = `
      <div class="analytics-panel">

        <h2>📊 Note Analytics</h2>
        <p>Your NoteX activity overview.</p>

        <div class="analytics-grid">

          <div class="analytics-card">
            <span>📝</span>
            <h3>${notes.length}</h3>
            <p>Total Notes</p>
          </div>

          <div class="analytics-card">
            <span>⭐</span>
            <h3>${favorites.length}</h3>
            <p>Favorites</p>
          </div>

          <div class="analytics-card">
            <span>📦</span>
            <h3>${archived.length}</h3>
            <p>Archived</p>
          </div>

          <div class="analytics-card">
            <span>🗂️</span>
            <h3>${categories.size}</h3>
            <p>Categories</p>
          </div>

        </div>

      </div>
    `;

  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
});
const settingsBtn = document.getElementById('settingsBtn');

settingsBtn.addEventListener('click', () => {
  const container = document.getElementById('notesContainer');

  container.innerHTML = `
    <div class="settings-panel">

      <h2>⚙️ Settings</h2>
      <p>Customize your NoteX experience.</p>

      <div class="setting-item">
        <div>
          <h3>Appearance</h3>
          <p>Switch between light and dark mode.</p>
        </div>

        <button id="themeToggleBtn" class="create-note-btn">
          🌙 Dark Mode
        </button>
      </div>

    </div>
  `;

  const themeToggleBtn = document.getElementById('themeToggleBtn');

  if (document.body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = '☀️ Light Mode';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const darkMode = document.body.classList.contains('dark-mode');

    localStorage.setItem('darkMode', darkMode);

    themeToggleBtn.textContent =
      darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
});

const studyModeBtn = document.getElementById('studyModeBtn');

studyModeBtn.addEventListener('click', () => {
  const container = document.getElementById('notesContainer');

  container.innerHTML = `
  
    <div class="study-mode-panel">
      <div class="study-mode-header">
        <div class="study-icon">🎓</div>
        <div>
          <h2>Study Mode</h2>
          <p>Turn your notes into smarter study material.</p>
        </div>
      </div>

      <div class="study-options">

        <button class="study-option" id="summaryStudyBtn">
          <span>✨</span>
          <h3>AI Summary</h3>
          <p>Generate a simple summary from your notes.</p>
        </button>

        <button class="study-option" id="flashcardStudyBtn">
          <span>🃏</span>
          <h3>Flashcards</h3>
          <p>Turn your notes into revision flashcards.</p>
        </button>

        <button class="study-option" id="quizStudyBtn">
          <span>🧠</span>
          <h3>Quiz Me</h3>
          <p>Generate questions and test your knowledge.</p>
        </button>

      </div>
    </div>
   `;
   document.getElementById('summaryStudyBtn').addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

    const activeNotes = notes.filter(note => !note.archived);

    if (activeNotes.length === 0) {
      container.innerHTML = `
        <div class="empty-notes">
          <div>📝</div>
          <h3>No notes available</h3>
          <p>Create a note first before using AI Summary.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="study-mode-panel">
        <h2>Select a Note to Summarize</h2>
        <p>Choose the note you want the AI to summarize.</p>

        <div class="notes-grid">
          ${activeNotes.map(note => `
            <div
              class="note-card"
              onclick="summarizeNote(${note.id})"
            >
              <span class="note-category">
                ${note.category || 'General'}
              </span>

              <h3>${note.title}</h3>

              <p>
                ${
                  note.content.length > 100
                    ? note.content.substring(0, 100) + '...'
                    : note.content
                }
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Failed to load notes for Study Mode:', error);
  }
});
});
const favoritesBtn = document.getElementById('favoritesBtn');

favoritesBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}/favorites`
    );

    const notes = await response.json();

    const activeFavorites = notes.filter(note => !note.archived);

    const container = document.getElementById('notesContainer');

    if (activeFavorites.length === 0) {
      container.innerHTML = `
        <div class="empty-notes">
          <div>⭐</div>
          <h3>No favorite notes</h3>
          <p>Your favorite notes will appear here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activeFavorites.map(note => `
      <div class="note-card" onclick="openNote(${note.id})">

        <div class="note-card-top">
          <span class="note-category">
            ${note.category || 'General'}
          </span>

          <span>⭐</span>
        </div>

        <h3>${note.title}</h3>

        <p>
          ${
            note.content.length > 120
              ? note.content.substring(0, 120) + '...'
              : note.content
          }
        </p>

        <div class="note-card-bottom">
          <span>
            ${new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>

      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
});

loadNotes(user);

}

async function loadNotes(user) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

const activeNotes = notes.filter(note => !note.archived);
    

    const container = document.getElementById('notesContainer');

    document.getElementById('totalNotes').textContent = notes.length;

    const favorites = notes.filter(note => note.favorite);
    document.getElementById('favoriteNotes').textContent = favorites.length;

    const categories = new Set(
      notes
        .map(note => note.category)
        .filter(category => category)
    );

    document.getElementById('categoryCount').textContent = categories.size;

   if (activeNotes.length === 0) {
      container.innerHTML = `
        <div class="empty-notes">
          <div>📝</div>
          <h3>No notes yet</h3>
          <p>Create your first note to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activeNotes.map(note => `
      <div class="note-card" onclick="openNote(${note.id})">

        <div class="note-card-top">
          <span class="note-category">
            ${note.category || 'General'}
          </span>

          <span>
            ${note.favorite ? '⭐' : ''}
          </span>
        </div>

        <h3>${note.title}</h3>

        <p>
          ${note.content.length > 120
            ? note.content.substring(0, 120) + '...'
            : note.content}
        </p>

        <div class="note-card-bottom">
          <span>
            ${new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>

      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load notes:', error);
  }
}

async function openNote(noteId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/${noteId}`
    );

    if (!response.ok) {
      throw new Error('Failed to open note');
    }

    const note = await response.json();

    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-overlay" id="editNoteModal">
        <div class="note-modal">

          <div class="modal-header">
            <h2>Edit Note</h2>
            <button id="closeEditModalBtn">✕</button>
          </div>

          <form id="editNoteForm">

            <input
              type="text"
              id="editNoteTitle"
              value="${note.title || ''}"
              required
            />

            <input
              type="text"
              id="editNoteCategory"
              value="${note.category || ''}"
              placeholder="Category"
            />

            <textarea
              id="editNoteContent"
              required
            >${note.content || ''}</textarea>

          <div class="edit-note-actions">
  <button type="submit" class="save-note-btn">
    Save Changes
  </button>

  <button
    type="button"
    class="favorite-note-btn"
    onclick="toggleFavorite(${note.id})"
  >
    ${note.favorite ? '★ Unfavorite' : '☆ Add Favorite'}
  </button>

  <button
    type="button"
    class="archive-note-btn"
    onclick="toggleArchive(${note.id})"
  >
    ${note.archived ? '📂 Unarchive' : '📦 Archive'}
  </button>

  <button
    type="button"
    class="delete-note-btn"
    onclick="deleteNote(${note.id})"
  >
    🗑️ Delete Note
  </button>
</div>

<p id="editNoteMessage"></p>

          </form>

        </div>
      </div>
    `);

    document
      .getElementById('closeEditModalBtn')
      .addEventListener('click', () => {
        document.getElementById('editNoteModal').remove();
      });

    document
      .getElementById('editNoteForm')
      .addEventListener('submit', async (e) => {

        e.preventDefault();

        const title =
          document.getElementById('editNoteTitle').value;

        const category =
          document.getElementById('editNoteCategory').value;

        const content =
          document.getElementById('editNoteContent').value;

        const message =
          document.getElementById('editNoteMessage');

        try {
          const updateResponse = await fetch(
            `${BACKEND_URL}/api/notes/${noteId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title,
                category,
                content
              })
            }
          );

          if (!updateResponse.ok) {
            throw new Error('Failed to update note');
          }

          message.textContent = 'Note updated successfully!';
          message.style.color = 'green';

          const user = JSON.parse(localStorage.getItem('user'));

          setTimeout(() => {
            document.getElementById('editNoteModal').remove();
            loadNotes(user);
          }, 500);

        } catch (error) {
          message.textContent = error.message;
          message.style.color = 'red';
        }
      });

  } catch (error) {
    console.error(error);
  }
}

window.openNote = openNote;
async function deleteNote(noteId) {
  const confirmed = confirm('Are you sure you want to delete this note?');

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/${noteId}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    const editModal = document.getElementById('editNoteModal');

    if (editModal) {
      editModal.remove();
    }

    const user = JSON.parse(localStorage.getItem('user'));

    await loadNotes(user);

    alert('Note deleted successfully!');

  } catch (error) {
    console.error(error);
    alert('Could not delete the note.');
  }
}

window.deleteNote = deleteNote;
async function toggleFavorite(noteId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/${noteId}/favorite`,
      {
        method: 'PATCH'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update favorite');
    }

    const modal = document.getElementById('editNoteModal');

    if (modal) {
      modal.remove();
    }

    const user = JSON.parse(localStorage.getItem('user'));

    await loadNotes(user);

  } catch (error) {
    console.error(error);
    alert('Could not update favorite.');
  }
}

window.toggleFavorite = toggleFavorite;
async function toggleArchive(noteId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/notes/${noteId}/archive`,
      {
        method: 'PATCH'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update archive');
    }

    const modal = document.getElementById('editNoteModal');

    if (modal) {
      modal.remove();
    }

    const user = JSON.parse(localStorage.getItem('user'));

    await loadNotes(user);

  } catch (error) {
    console.error(error);
    alert('Could not update archive.');
  }
}

window.toggleArchive = toggleArchive;
async function filterByCategory(category) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}/category/${encodeURIComponent(category)}`
    );

    const notes = await response.json();

    const activeNotes = notes.filter(note => !note.archived);

    const container = document.getElementById('notesContainer');

    if (activeNotes.length === 0) {
      container.innerHTML = `
        <div class="empty-notes">
          <div>🗂️</div>
          <h3>No notes in ${category}</h3>
          <p>Create a note in this category first.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activeNotes.map(note => `
      <div class="note-card" onclick="openNote(${note.id})">

        <div class="note-card-top">
          <span class="note-category">
            ${note.category || 'General'}
          </span>

          <span>${note.favorite ? '⭐' : ''}</span>
        </div>

        <h3>${note.title}</h3>

        <p>
          ${
            note.content.length > 120
              ? note.content.substring(0, 120) + '...'
              : note.content
          }
        </p>

        <div class="note-card-bottom">
          <span>
            ${new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>

      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to filter category:', error);
  }
}

window.filterByCategory = filterByCategory;

  async function summarizeNote(noteId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/ai/summary/${noteId}`,
      {
        method: 'POST'
      }
    );

    const summary = await response.text();

    if (!response.ok) {
      throw new Error(summary || 'Failed to generate summary');
    }

    const container = document.getElementById('notesContainer');

    container.innerHTML = `
      <div class="study-mode-panel">
        <div class="study-mode-header">
          <div class="study-icon">✨</div>

          <div>
            <h2>AI Summary</h2>
            <p>Your generated note summary.</p>
          </div>
        </div>

        <div class="summary-result">
          <p>${summary}</p>
        </div>

        <button class="create-note-btn" id="backToStudyBtn">
          ← Back to Study Mode
        </button>
      </div>
    `;

    document
      .getElementById('backToStudyBtn')
      .addEventListener('click', () => {
        document.getElementById('studyModeBtn').click();
      });

  } catch (error) {
    console.error('Summary failed:', error);
    alert(error.message);
  }
}

window.summarizeNote = summarizeNote;
