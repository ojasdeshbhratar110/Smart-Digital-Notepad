import './style.css';

/* =========================================
   NOTEX THEME SYSTEM
========================================= */

const savedTheme =
  localStorage.getItem('notexTheme') || 'professional';

const savedAppearance =
  localStorage.getItem('notexAppearance') || 'dark';

function applyNoteXTheme(theme, appearance) {

  document.body.classList.remove(
    'theme-professional',
    'theme-anime',
    'theme-cute',
    'theme-aesthetic',
    'theme-dc',
'theme-football',
    'theme-cyber',
    'theme-marvel',
    'dark-mode',
    'light-mode'
  );

  document.body.classList.add(`theme-${theme}`);
  document.body.classList.add(`${appearance}-mode`);

  localStorage.setItem('notexTheme', theme);
  localStorage.setItem('notexAppearance', appearance);
}

applyNoteXTheme(savedTheme, savedAppearance);

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
              <h2 id="studySessions">0</h2>
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
          <input
  type="text"
  id="noteTags"
  placeholder="Tags e.g. Exam, Important, Revision"
/>
<div class="reminder-field">

  <label for="noteReminder">
    🔔 Reminder
  </label>

  <input
    type="datetime-local"
    id="noteReminder"
  />

  <small>
    Optional — choose when you want NoteX to remind you
  </small>

</div>
<div class="attachment-field">

  <label for="noteAttachment">
    📎 Attachment
  </label>

  <div class="attachment-upload-box">

    <input
      type="file"
      id="noteAttachment"
      accept="image/*,.pdf,.doc,.docx,.txt"
    />

    <label
      for="noteAttachment"
      class="attachment-upload-btn"
    >
      📎 Choose File
    </label>

    <span id="attachmentFileName">
      No file selected
    </span>

  </div>

  <small>
    Add an image, PDF or document to your note
  </small>

</div>
          <textarea
            id="noteContent"
            placeholder="Start writing your note..."
            required
          ></textarea>
<div class="voice-input-section">

  <button
    type="button"
    class="voice-note-btn"
    id="voiceNoteBtn"
  >
    🎤 Start Speaking
  </button>

  <span
    id="voiceStatus"
    class="voice-status"
  >
    Click the microphone and start speaking
  </span>

</div>
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
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const voiceNoteBtn =
  document.getElementById('voiceNoteBtn');

const voiceStatus =
  document.getElementById('voiceStatus');

const noteContent =
  document.getElementById('noteContent');

if (SpeechRecognition) {

  const recognition =
    new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';

  let isListening = false;
  let finalTranscript = '';

  voiceNoteBtn.addEventListener('click', () => {

    if (!isListening) {

      finalTranscript = '';

      recognition.start();

      isListening = true;

      voiceNoteBtn.textContent =
        '⏹ Stop Listening';

      voiceNoteBtn.classList.add('listening');

      voiceStatus.textContent =
        '🔴 Listening... Start speaking';

    } else {

      recognition.stop();

      isListening = false;

      voiceNoteBtn.textContent =
        '🎤 Start Speaking';

      voiceNoteBtn.classList.remove('listening');

      voiceStatus.textContent =
        'Speech added to your note';

    }

  });


  recognition.onresult = (event) => {

    let interimTranscript = '';

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      const transcript =
        event.results[i][0].transcript;

      if (event.results[i].isFinal) {

        finalTranscript +=
          transcript + ' ';

      } else {

        interimTranscript +=
          transcript;

      }

    }

    const existingText =
      noteContent.dataset.originalText || '';

    noteContent.value =
      existingText +
      finalTranscript +
      interimTranscript;

  };


  recognition.onstart = () => {

    noteContent.dataset.originalText =
      noteContent.value
        ? noteContent.value + ' '
        : '';

  };


  recognition.onend = () => {

    isListening = false;

    voiceNoteBtn.textContent =
      '🎤 Start Speaking';

    voiceNoteBtn.classList.remove('listening');

    voiceStatus.textContent =
      'Speech recognition stopped';

  };


  recognition.onerror = (event) => {

    isListening = false;

    voiceNoteBtn.textContent =
      '🎤 Start Speaking';

    voiceNoteBtn.classList.remove('listening');

    if (event.error === 'not-allowed') {

      voiceStatus.textContent =
        '⚠️ Microphone permission denied';

    } else {

      voiceStatus.textContent =
        `⚠️ Speech error: ${event.error}`;

    }

  };

} else {

  voiceNoteBtn.disabled = true;

  voiceStatus.textContent =
    'Speech recognition is not supported in this browser';

}
  document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const category = document.getElementById('noteCategory').value;
    const tags = document.getElementById('noteTags').value;
    const content = document.getElementById('noteContent').value;
const reminderAt =
  document.getElementById('noteReminder').value || null;
  const attachmentInput =
  document.getElementById('noteAttachment');

const attachmentFile =
  attachmentInput.files[0] || null;
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
  category,
  tags,
  content,
  reminderAt,
  reminderDone: false
})
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data || 'Failed to create note');
      }
      // Upload attachment after the note has been created
if (attachmentFile) {

  const formData = new FormData();

  formData.append(
    'file',
    attachmentFile
  );

  const uploadResponse = await fetch(
    `${BACKEND_URL}/api/notes/${data.id}/attachment`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!uploadResponse.ok) {

    const uploadError =
      await uploadResponse.text();

    throw new Error(
      uploadError || 'Attachment upload failed'
    );
  }
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
const studySessions =
  parseInt(
    localStorage.getItem('studySessions') || '0'
  );
  const quizzesCompleted =
  parseInt(
    localStorage.getItem('quizzesCompleted') || '0'
  );
  const totalQuizScore =
  parseInt(
    localStorage.getItem('totalQuizScore') || '0'
  );

const averageQuizScore =
  quizzesCompleted > 0
    ? Math.round(totalQuizScore / quizzesCompleted)
    : 0;

    const quizHistory =
  JSON.parse(
    localStorage.getItem('quizHistory') || '[]'
  );
  const examTestHistory =
  JSON.parse(
    localStorage.getItem('examTestHistory') || '[]'
  );

const totalExamTests =
  examTestHistory.length;

const averageExamAccuracy =
  totalExamTests > 0
    ? Math.round(
        examTestHistory.reduce(
          (sum, test) => sum + test.percentage,
          0
        ) / totalExamTests
      )
    : 0;

const bestExamAccuracy =
  totalExamTests > 0
    ? Math.max(
        ...examTestHistory.map(
          test => test.percentage
        )
      )
    : 0;

const totalExamQuestions =
  examTestHistory.reduce(
    (sum, test) => sum + test.totalQuestions,
    0
  );
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
  <span>🏆</span>
  <h3>${totalExamTests}</h3>
  <p>Exam Tests</p>
</div>

<div class="analytics-card">
  <span>📊</span>
  <h3>${averageExamAccuracy}%</h3>
  <p>Average Exam Accuracy</p>
</div>

<div class="analytics-card">
  <span>🥇</span>
  <h3>${bestExamAccuracy}%</h3>
  <p>Best Exam Accuracy</p>
</div>

<div class="analytics-card">
  <span>📝</span>
  <h3>${totalExamQuestions}</h3>
  <p>Exam Questions Attempted</p>
</div>
          <div class="analytics-card">
            <span>📝</span>
            <h3>${notes.length}</h3>
            <p>Total Notes</p>
          </div>
<div class="analytics-card">
  <span>🎓</span>
  <h3>${studySessions}</h3>
  <p>Study Sessions</p>
</div>

<div class="analytics-card">
  <span>🧠</span>
  <h3>${quizzesCompleted}</h3>
  <p>Quizzes Completed</p>
</div>

<div class="analytics-card">
  <span>📈</span>
  <h3>${averageQuizScore}%</h3>
  <p>Average Quiz Score</p>
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
        <div class="progress-chart-section">

  <div class="progress-chart-header">
    <div>
      <h2>🏆 Exam Performance</h2>
      <p>Your recent timed exam test attempts.</p>
    </div>

    <span class="progress-chart-badge">
      ${examTestHistory.length} Tests
    </span>
  </div>

  ${
    examTestHistory.length > 0
      ? `
          <div class="exam-history-list">

            ${examTestHistory.map((test, index) => `
              <div class="exam-history-card">

                <div>
                  <h3>
                    ${test.exam}
                    •
                    ${test.subject.toUpperCase()}
                  </h3>

                  <p>
                    Attempt ${examTestHistory.length - index}
                  </p>
                </div>

                <div class="exam-history-stats">

                  <span>
                    🏆 ${test.obtainedMarks}/${test.totalMarks}
                  </span>

                  <span>
                    📈 ${test.percentage}%
                  </span>

                  <span>
                    ✅ ${test.correct}
                  </span>

                  <span>
                    ❌ ${test.wrong}
                  </span>

                  <span>
                    ⚪ ${test.unanswered}
                  </span>

                  <span>
                    ⏱️ ${test.timeTaken}
                  </span>

                </div>

              </div>
            `).join('')}

          </div>
        `
      : `
          <div class="progress-chart-empty">
            <span>🏆</span>
            <h3>No exam tests yet</h3>
            <p>Complete an Exam Test to start tracking your performance.</p>
          </div>
        `
  }

</div>
<div class="progress-chart-section">

  <div class="progress-chart-header">
    <div>
      <h2>📈 Quiz Progress</h2>
      <p>Track how your quiz scores improve over time.</p>
    </div>

    <span class="progress-chart-badge">
      ${quizHistory.length} Quizzes
    </span>
  </div>

  ${
    quizHistory.length > 0
      ? `
        <div class="progress-chart">

          ${quizHistory.map((quiz, index) => `
            <div class="progress-column">

              <div class="progress-score">
                ${quiz.score}%
              </div>

              <div class="progress-bar-track">
                <div
                  class="progress-bar-fill"
                  style="height: ${quiz.score}%"
                ></div>
              </div>

              <span class="progress-label">
                Q${index + 1}
              </span>

            </div>
          `).join('')}

        </div>
      `
      : `
        <div class="progress-chart-empty">
          <span>📊</span>
          <h3>No quiz progress yet</h3>
          <p>Complete a quiz to start tracking your progress.</p>
        </div>
      `
  }

</div>
      </div>
    `;

  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
});
const settingsBtn = document.getElementById('settingsBtn');

settingsBtn.addEventListener('click', () => {

  const container =
    document.getElementById('notesContainer');

  const currentTheme =
    localStorage.getItem('notexTheme') || 'professional';

  const currentAppearance =
    localStorage.getItem('notexAppearance') || 'dark';

  container.innerHTML = `
    <div class="settings-panel">

      <div class="settings-header">
        <div>
          <h2>⚙️ Settings</h2>
          <p>Personalize your NoteX workspace.</p>
        </div>
      </div>


      <div class="settings-section">

        <div class="settings-section-title">
          <h3>🎨 Choose Theme</h3>
          <p>Select the visual style you want to use.</p>
        </div>


        <div class="theme-selection-grid">

          <button
            class="theme-card ${
              currentTheme === 'professional'
                ? 'selected-theme'
                : ''
            }"
            data-theme="professional"
          >
            <div class="theme-preview professional-preview">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="theme-card-info">
              <h3>💼 Professional</h3>
              <p>Clean, elegant and focused.</p>
            </div>
          </button>


          <button
            class="theme-card ${
              currentTheme === 'anime'
                ? 'selected-theme'
                : ''
            }"
            data-theme="anime"
          >
            <div class="theme-preview anime-preview">
              <span>🌸</span>
              <span>✨</span>
              <span>🌙</span>
            </div>

            <div class="theme-card-info">
              <h3>🌸 Anime</h3>
              <p>Japanese-inspired aesthetic.</p>
            </div>
          </button>


          <button
            class="theme-card ${
              currentTheme === 'cute'
                ? 'selected-theme'
                : ''
            }"
            data-theme="cute"
          >
            <div class="theme-preview cute-preview">
              <span>🎀</span>
              <span>♡</span>
              <span>🌷</span>
            </div>

            <div class="theme-card-info">
              <h3>🎀 Cute</h3>
              <p>Soft, colorful and cozy.</p>
            </div>
          </button>


          <button
            class="theme-card ${
              currentTheme === 'cyber'
                ? 'selected-theme'
                : ''
            }"
            data-theme="cyber"
          >
            <div class="theme-preview cyber-preview">
              <span>◈</span>
              <span>⚡</span>
              <span>01</span>
            </div>

            <div class="theme-card-info">
              <h3>⚡ Cyber</h3>
              <p>Futuristic neon workspace.</p>
            </div>
          </button>
          <button
  class="theme-card ${
    currentTheme === 'marvel'
      ? 'selected-theme'
      : ''
  }"
  data-theme="marvel"
>
  <div class="theme-preview marvel-preview">
    <span>🛡️</span>
    <span>⚡</span>
    <span>◉</span>
  </div>

  <div class="theme-card-info">
    <h3>🦸 Hero</h3>
    <p>Cinematic superhero command center.</p>
  </div>
</button>

<button
  class="theme-card ${
    currentTheme === 'dc'
      ? 'selected-theme'
      : ''
  }"
  data-theme="dc"
>
  <div class="theme-preview dc-preview">
    <span>🦇</span>
    <span>⚡</span>
    <span>💚</span>
  </div>

  <div class="theme-card-info">
    <h3>🦇 DC</h3>
    <p>Gotham-inspired comic universe.</p>
  </div>
</button>


<button
  class="theme-card ${
    currentTheme === 'football'
      ? 'selected-theme'
      : ''
  }"
  data-theme="football"
>
  <div class="theme-preview football-preview">
    <span>⚽</span>
    <span>🏆</span>
    <span>🥅</span>
  </div>

  <div class="theme-card-info">
    <h3>⚽ Football</h3>
    <p>Stadium night and matchday experience.</p>
  </div>
</button>

<button
  class="theme-card ${
    currentTheme === 'aesthetic'
      ? 'selected-theme'
      : ''
  }"
  data-theme="aesthetic"
>
  <div class="theme-preview aesthetic-preview">
    <span>☕</span>
    <span>📷</span>
    <span>🌿</span>
  </div>

  <div class="theme-card-info">
    <h3>🤎 Aesthetic</h3>
    <p>Warm Pinterest-inspired study space.</p>
  </div>
</button>

        </div>

      </div>


      <div class="settings-section">

        <div class="settings-section-title">
          <h3>☀️ Appearance</h3>
          <p>Choose between light and dark mode.</p>
        </div>

        <div class="appearance-selector">

          <button
            class="appearance-btn ${
              currentAppearance === 'light'
                ? 'active-appearance'
                : ''
            }"
            data-appearance="light"
          >
            ☀️ Light
          </button>

          <button
            class="appearance-btn ${
              currentAppearance === 'dark'
                ? 'active-appearance'
                : ''
            }"
            data-appearance="dark"
          >
            🌙 Dark
          </button>

        </div>

      </div>

    </div>
  `;


  /* THEME BUTTONS */

  document
    .querySelectorAll('.theme-card')
    .forEach(card => {

      card.addEventListener('click', () => {

        const theme =
          card.dataset.theme;

        const appearance =
          localStorage.getItem('notexAppearance')
          || 'dark';

        applyNoteXTheme(
          theme,
          appearance
        );

        document
          .querySelectorAll('.theme-card')
          .forEach(item =>
            item.classList.remove('selected-theme')
          );

        card.classList.add('selected-theme');

      });

    });


  /* LIGHT / DARK BUTTONS */

  document
    .querySelectorAll('.appearance-btn')
    .forEach(button => {

      button.addEventListener('click', () => {

        const appearance =
          button.dataset.appearance;

        const theme =
          localStorage.getItem('notexTheme')
          || 'professional';

        applyNoteXTheme(
          theme,
          appearance
        );

        document
          .querySelectorAll('.appearance-btn')
          .forEach(item =>
            item.classList.remove('active-appearance')
          );

        button.classList.add('active-appearance');

      });

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
<button class="study-option" id="examTestStudyBtn">
  <span>🏆</span>
  <h3>Exam Test</h3>
  <p>Analyze previous-year papers and take a timed exam test.</p>
</button>
      </div>
    </div>
   `;
   document.getElementById('examTestStudyBtn').addEventListener('click', () => {

  const container =
    document.getElementById('notesContainer');

  container.innerHTML = `
    <div class="exam-test-panel">

      <div class="study-mode-header">
        <div class="study-icon">🏆</div>

        <div>
          <h2>Exam Test</h2>
          <p>
            Upload previous-year papers and create
            an exam-focused timed practice test.
          </p>
        </div>
      </div>

      <div class="exam-test-form">

        <div class="exam-field">
          <label for="examType">
            Select Exam
          </label>

          <select id="examType">
            <option value="">Choose an exam</option>
            <option value="jee-main">JEE Main</option>
            <option value="jee-advanced">JEE Advanced</option>
            <option value="neet">NEET</option>
            <option value="other">Other Exam</option>
          </select>
        </div>


        <div class="exam-field">
          <label for="examSubject">
            Select Subject
          </label>

          <select id="examSubject">
            <option value="">Choose a subject</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="mathematics">Mathematics</option>
            <option value="biology">Biology</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>


        <div class="exam-field">
          <label for="examPapers">
            Previous Year Papers
          </label>

          <input
            type="file"
            id="examPapers"
            accept=".pdf"
            multiple
          />

          <small>
            Upload up to 5 previous-year question papers.
          </small>
        </div>


        <div
          id="examFileList"
          class="exam-file-list"
        ></div>


        <button
          type="button"
          class="create-note-btn"
          id="analyzeExamPapersBtn"
        >
          Analyze Papers
        </button>

      </div>

    </div>
  `;
const examPapers =
  document.getElementById('examPapers');

const examFileList =
  document.getElementById('examFileList');

examPapers.addEventListener('change', () => {

  const files =
    Array.from(examPapers.files);

  // Maximum 5 papers
  if (files.length > 5) {

    alert(
      'You can upload a maximum of 5 previous-year papers.'
    );

    examPapers.value = '';
    examFileList.innerHTML = '';

    return;
  }

  // No files selected
  if (files.length === 0) {

    examFileList.innerHTML = '';

    return;
  }

  // Display selected papers
  examFileList.innerHTML = `
    <div class="selected-exam-papers">

      <h3>
        📚 Selected Papers (${files.length}/5)
      </h3>

      ${files.map((file, index) => `
        <div class="exam-paper-item">

          <span>
            📄 ${index + 1}. ${file.name}
          </span>

          <small>
            ${(file.size / 1024 / 1024).toFixed(2)} MB
          </small>

        </div>
      `).join('')}

    </div>
  `;

});
const analyzeExamPapersBtn =
  document.getElementById('analyzeExamPapersBtn');



  analyzeExamPapersBtn.addEventListener('click', async () => {

  const examType =
    document.getElementById('examType').value;

  const examSubject =
    document.getElementById('examSubject').value;

  const files =
    Array.from(examPapers.files);


  if (!examType) {
    alert('Please select an exam first.');
    return;
  }

  if (!examSubject) {
    alert('Please select a subject first.');
    return;
  }

  if (files.length === 0) {
    alert('Please upload at least one previous-year paper.');
    return;
  }

  if (files.length > 5) {
    alert('You can analyze a maximum of 5 papers.');
    return;
  }


  const formData =
    new FormData();

  formData.append(
    'exam',
    examType
  );

  formData.append(
    'subject',
    examSubject
  );

  files.forEach(file => {
    formData.append(
      'files',
      file
    );
  });


  try {

    analyzeExamPapersBtn.disabled = true;

    analyzeExamPapersBtn.textContent =
      '🔍 Analyzing Papers...';


    const response = await fetch(
      `${BACKEND_URL}/api/exam-test/analyze`,
      {
        method: 'POST',
        body: formData
      }
    );


    const result =
      await response.json();


    if (!response.ok) {
      throw new Error(
        result.message ||
        'Failed to analyze papers'
      );
    }


    console.log(
      'EXAM ANALYSIS:',
      result
    );
    console.log(
  'QUESTIONS RECEIVED:',
  result.questions
);

console.log(
  'QUESTION COUNT:',
  result.questions?.length
);
    sessionStorage.setItem(
  'examExtractedQuestions',
  JSON.stringify(result.questions || [])
);
const topicFrequency =
  result.topicFrequency || {};

const sortedTopics =
  Object.entries(topicFrequency)
    .sort((a, b) => b[1] - a[1]);

const analysisHTML =
  sortedTopics.map(([topic, count], index) => {

    let priority = 'Low Priority';

    if (count >= 3) {
      priority = '🔥 High Priority';
    } else if (count === 2) {
      priority = '⭐ Medium Priority';
    }

    return `
      <div class="exam-analysis-topic">

        <div>
          <strong>
            ${index + 1}. ${topic}
          </strong>

          <p>
            Appeared in ${count} of
            ${result.papersAnalyzed} papers
          </p>
        </div>

        <span>
          ${priority}
        </span>

      </div>
    `;
  })
  .join('');


container.innerHTML = `
  <div class="exam-analysis-panel">

    <div class="study-mode-header">

      <div class="study-icon">
        📊
      </div>

      <div>
        <h2>PYQ Analysis</h2>

        <p>
          ${result.papersAnalyzed} previous-year
          papers analyzed for
          ${examType.replace('-', ' ').toUpperCase()}
          ${examSubject.toUpperCase()}.
        </p>
      </div>

    </div>


    <div class="exam-analysis-summary">

      <h3>
        🔥 Repeated & Important Topics
      </h3>

      ${analysisHTML || `
        <p>
          No repeated topics were detected.
        </p>
      `}

    </div>


    <button
      type="button"
      class="create-note-btn"
      id="generateExamTestBtn"
    >
      🎯 Generate Exam Test
    </button>

  </div>
`;
const generateExamTestBtn =
  document.getElementById('generateExamTestBtn');

generateExamTestBtn.addEventListener('click', () => {

  let examDuration = 180;

  if (examType === 'jee-main') {

    examDuration = 180;

  } else if (examType === 'jee-advanced') {

    // One JEE Advanced paper/session
    examDuration = 180;

  } else if (examType === 'neet') {

    examDuration = 180;

  }


  const examName =
    examType === 'jee-main'
      ? 'JEE Main'
      : examType === 'jee-advanced'
        ? 'JEE Advanced'
        : examType === 'neet'
          ? 'NEET'
          : 'Other Exam';


  container.innerHTML = `
    <div class="exam-test-panel">

      <div class="study-mode-header">

        <div class="study-icon">
          🏆
        </div>

        <div>
          <h2>${examName} Practice Test</h2>

          <p>
            Test generated from your previous-year
            paper analysis.
          </p>
        </div>

      </div>


      <div class="exam-test-overview">

        <div class="analytics-card">
          <span>📚</span>
          <h3>${result.papersAnalyzed}</h3>
          <p>Papers Analyzed</p>
        </div>


        <div class="analytics-card">
          <span>🎯</span>
          <h3>${examSubject.toUpperCase()}</h3>
          <p>Subject</p>
        </div>


        <div class="analytics-card">
          <span>⏱️</span>
          <h3>${examDuration / 60} Hours</h3>
          <p>Time Limit</p>
        </div>

      </div>


      <div class="exam-test-ready">

        <h2>
          Ready to Begin?
        </h2>

        <p>
          NoteX will create questions using the
          repeated and important topics detected
          from your uploaded papers.
        </p>

        <p>
          Once the test begins, the timer will
          start immediately.
        </p>


        <button
          type="button"
          class="create-note-btn"
          id="startExamTestBtn"
        >
          🚀 Start Test
        </button>

      </div>

    </div>
  `;


  // Store information needed for the real test
  sessionStorage.setItem(
    'examTestConfig',
    JSON.stringify({
      exam: examType,
      examName: examName,
      subject: examSubject,
      durationMinutes: examDuration,
      topicFrequency: result.topicFrequency || {}
    })
  );
const startExamTestBtn =
  document.getElementById('startExamTestBtn');

startExamTestBtn.addEventListener('click', () => {

  const config =
    JSON.parse(
      sessionStorage.getItem('examTestConfig')
    );
const questions =
  result.questions || [];
  let remainingSeconds =
    config.durationMinutes * 60;


  container.innerHTML = `
    <div class="exam-test-panel">

      <div class="study-mode-header">

        <div class="study-icon">
          🏆
        </div>

        <div>
          <h2>${config.examName} Test</h2>
          <p>${config.subject.toUpperCase()}</p>
        </div>

      </div>


      <div class="exam-live-info">

        <div>
          <strong>⏱️ Time Remaining</strong>

          <h2 id="examTimer">
            03:00:00
          </h2>
        </div>

      </div>


      <div id="examQuestions">

  ${
    questions.length > 0
      ? questions.map((question, index) => `
          <div class="quiz-question-card">

            <h3>
              ${index + 1}. ${question.question}
            </h3>

            <div class="quiz-options-grid">

              ${Object.entries(question.options)
                .map(([letter, text]) => `
                  <label class="quiz-option">

                    <input
                      type="radio"
                      name="exam-question-${index}"
                      value="${letter}"
                    />

                    <span class="quiz-radio-custom"></span>

                    <span class="quiz-option-text">
                      <strong>${letter}.</strong>
                      ${text}
                    </span>

                  </label>
                `)
                .join('')}

            </div>

          </div>
        `)
        .join('')
      : `
          <div class="empty-notes">
            <div>⚠️</div>
            <h3>No questions extracted</h3>
            <p>Try uploading a different PDF format.</p>
          </div>
        `
  }

</div>


      <button
        type="button"
        class="create-note-btn"
        id="submitExamTestBtn"
      >
        Submit Test
      </button>

    </div>
  `;


  const timerElement =
    document.getElementById('examTimer');


  function updateExamTimer() {

    const hours =
      Math.floor(
        remainingSeconds / 3600
      );

    const minutes =
      Math.floor(
        (remainingSeconds % 3600) / 60
      );

    const seconds =
      remainingSeconds % 60;


    timerElement.textContent =
      `${String(hours).padStart(2, '0')}:` +
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}`;
  }


  updateExamTimer();


  const examTimerInterval =
    setInterval(() => {

      remainingSeconds--;

      updateExamTimer();


      if (remainingSeconds <= 0) {

        clearInterval(
          examTimerInterval
        );

        alert(
          'Time is up! Your test will be submitted.'
        );

        document
          .getElementById('submitExamTestBtn')
          ?.click();
      }

    }, 1000);
const submitExamTestBtn =
  document.getElementById('submitExamTestBtn');

submitExamTestBtn.addEventListener('click', () => {

  clearInterval(examTimerInterval);

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
let marksPerCorrect = 4;
let negativeMark = 1;

if (config.exam === 'jee-advanced') {
  marksPerCorrect = 4;
  negativeMark = 1;
}
  const review = [];

  questions.forEach((question, index) => {

    const selected =
      document.querySelector(
        `input[name="exam-question-${index}"]:checked`
      );

    const userAnswer =
      selected ? selected.value : null;

    const correctAnswer =
      question.correctAnswer;

    if (!userAnswer) {

      unanswered++;

    } else if (userAnswer === correctAnswer) {

      correct++;

    } else {

      wrong++;
    }


    review.push({
      question: question.question,
      options: question.options,
      userAnswer,
      correctAnswer
    });

  });


  const totalQuestions =
    questions.length;

  const percentage =
    totalQuestions > 0
      ? Math.round(
          (correct / totalQuestions) * 100
        )
      : 0;
const totalMarks =
  totalQuestions * marksPerCorrect;

const obtainedMarks =
  (correct * marksPerCorrect) -
  (wrong * negativeMark);

  const timeUsedSeconds =
    (config.durationMinutes * 60) -
    remainingSeconds;

  const usedHours =
    Math.floor(timeUsedSeconds / 3600);

  const usedMinutes =
    Math.floor(
      (timeUsedSeconds % 3600) / 60
    );

  const usedSeconds =
    timeUsedSeconds % 60;


  const timeTaken =
    `${String(usedHours).padStart(2, '0')}:` +
    `${String(usedMinutes).padStart(2, '0')}:` +
    `${String(usedSeconds).padStart(2, '0')}`;
const examAttempt = {
  id: Date.now(),
  exam: config.examName,
  subject: config.subject,
  totalQuestions,
  correct,
  wrong,
  unanswered,
  percentage,
  obtainedMarks,
  totalMarks,
  timeTaken,
  completedAt: new Date().toISOString()
};

const examTestHistory =
  JSON.parse(
    localStorage.getItem('examTestHistory') || '[]'
  );

examTestHistory.unshift(examAttempt);

localStorage.setItem(
  'examTestHistory',
  JSON.stringify(examTestHistory)
);

  container.innerHTML = `
    <div class="exam-test-panel">

      <div class="study-mode-header">

        <div class="study-icon">
          📊
        </div>

        <div>
          <h2>Test Results</h2>

          <p>
            ${config.examName}
            ${config.subject.toUpperCase()}
          </p>
        </div>

      </div>


      <div class="exam-test-overview">

        <div class="analytics-card">
          <span>🎯</span>
          <h3>
            ${correct}/${totalQuestions}
          </h3>
          <p>Correct</p>
        </div>


        <div class="analytics-card">
          <span>❌</span>
          <h3>${wrong}</h3>
          <p>Wrong</p>
        </div>


        <div class="analytics-card">
          <span>⚪</span>
          <h3>${unanswered}</h3>
          <p>Unanswered</p>
        </div>


        <div class="analytics-card">
          <span>📈</span>
          <h3>${percentage}%</h3>
          <p>Accuracy</p>
        </div>
<div class="analytics-card">
  <span>🏆</span>
  <h3>
    ${obtainedMarks}/${totalMarks}
  </h3>
  <p>Marks</p>
</div>
      </div>


      <div class="exam-result-time">
        ⏱️ Time Taken:
        <strong>${timeTaken}</strong>
      </div>


      <h2 style="margin-top: 30px;">
        Question Review
      </h2>


      <div id="examQuestions">

        ${review.map((item, index) => {

          const status =
            !item.userAnswer
              ? '⚪ Unanswered'
              : item.userAnswer === item.correctAnswer
                ? '✅ Correct'
                : '❌ Wrong';

          return `
            <div class="quiz-question-card">

              <h3>
                ${index + 1}. ${item.question}
              </h3>

              <p>
                ${status}
              </p>

              <p>
                Your Answer:
                <strong>
                  ${item.userAnswer || 'Not Answered'}
                </strong>
              </p>

              <p>
                Correct Answer:
                <strong>
                  ${item.correctAnswer || 'Unavailable'}
                </strong>
              </p>

            </div>
          `;

        }).join('')}

      </div>


      <button
        type="button"
        class="create-note-btn"
        id="backToStudyAfterExamBtn"
      >
        ← Back to Study Mode
      </button>

    </div>
  `;


  document
    .getElementById('backToStudyAfterExamBtn')
    .addEventListener('click', () => {

      document
        .getElementById('studyModeBtn')
        .click();

    });

});
});
});


  } catch (error) {

    console.error(
      'Exam analysis failed:',
      error
    );

    alert(
      `Analysis failed: ${error.message}`
    );

    analyzeExamPapersBtn.disabled = false;

    analyzeExamPapersBtn.textContent =
      'Analyze Papers';
  }

});
});
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
  document.getElementById('quizStudyBtn').addEventListener('click', async () => {

  try {

    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

    const activeNotes =
      notes.filter(note => !note.archived);

    const container =
      document.getElementById('notesContainer');

    if (activeNotes.length === 0) {

      container.innerHTML = `
        <div class="empty-notes">
          <div>🧠</div>
          <h3>No notes available</h3>
          <p>Create a note first before starting a quiz.</p>
        </div>
      `;

      return;
    }

    container.innerHTML = `
      <div class="study-mode-panel">

        <h2>🧠 Quiz Me</h2>

        <p>
          Select a note to generate a quiz.
        </p>

        <div class="notes-grid">

          ${activeNotes.map(note => `
            <div
              class="note-card"
              onclick="generateQuiz(${note.id})"
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

    console.error(
      'Failed to load notes for Quiz:',
      error
    );

  }

});
});
document.getElementById('flashcardStudyBtn').addEventListener('click', async () => {

  try {

    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    const notes = await response.json();

    const activeNotes =
      notes.filter(note => !note.archived);

    const container =
      document.getElementById('notesContainer');

    if (activeNotes.length === 0) {

      container.innerHTML = `
        <div class="empty-notes">
          <div>🃏</div>
          <h3>No notes available</h3>
          <p>Create a note first before generating flashcards.</p>
        </div>
      `;

      return;
    }

    container.innerHTML = `
      <div class="study-mode-panel">

        <h2>🃏 Create Flashcards</h2>

        <p>
          Select a note to turn into revision flashcards.
        </p>

        <div class="notes-grid">

          ${activeNotes.map(note => `
            <div
              class="note-card"
              onclick="generateFlashcards(${note.id})"
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

    console.error(
      'Failed to load notes for Flashcards:',
      error
    );

  }

});

// ==========================================
// QUIZ MODE - SELECT NOTE
// ==========================================

document
  .getElementById('quizStudyBtn')
  .addEventListener('click', async () => {

    try {

      const response = await fetch(
        `${BACKEND_URL}/api/notes/user/${user.id}`
      );

      if (!response.ok) {
        throw new Error('Failed to load notes');
      }

      const notes = await response.json();

      const activeNotes =
        notes.filter(note => !note.archived);

      const container =
        document.getElementById('notesContainer');


      if (activeNotes.length === 0) {

        container.innerHTML = `
          <div class="empty-notes">

            <div>🧠</div>

            <h3>No notes available</h3>

            <p>
              Create a note first before starting a quiz.
            </p>

          </div>
        `;

        return;
      }


      container.innerHTML = `
        <div class="study-mode-panel">

          <div class="study-mode-header">

            <div class="study-icon">
              🧠
            </div>

            <div>

              <h2>Select a Note</h2>

              <p>
                Choose a note and NoteX will create a quiz from it.
              </p>

            </div>

          </div>


          <div class="notes-grid">

            ${activeNotes.map(note => `

              <div
                class="note-card quiz-note-card"
                data-note-id="${note.id}"
              >

                <div class="note-card-top">

                  <span class="note-category">
                    ${note.category || 'General'}
                  </span>

                  <span>🧠</span>

                </div>


                <h3>
                  ${note.title || 'Untitled Note'}
                </h3>


                <p>
                  ${
                    note.content && note.content.length > 100
                      ? note.content.substring(0, 100) + '...'
                      : note.content || 'No content'
                  }
                </p>


                <div class="note-card-bottom">
                  <span>
                    Click to start quiz
                  </span>
                </div>

              </div>

            `).join('')}

          </div>

        </div>
      `;


      // MAKE EVERY NOTE CLICKABLE
      document
        .querySelectorAll('.quiz-note-card')
        .forEach(card => {

          card.addEventListener('click', () => {

            const noteId =
              Number(card.dataset.noteId);

            generateQuiz(noteId);

          });

        });


    } catch (error) {

      console.error(
        'Failed to load notes for Quiz:',
        error
      );

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
const savedStudySessions =
  parseInt(
    localStorage.getItem('studySessions') || '0'
  );

const studySessionsElement =
  document.getElementById('studySessions');

if (studySessionsElement) {
  studySessionsElement.textContent =
    savedStudySessions;
}
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
        <button type="button" id="closeEditModalBtn">✕</button>
      </div>

      <form id="editNoteForm">

        <input
          type="text"
          id="editNoteTitle"
          value="${note.title || ''}"
          required
        />

        <div class="category-suggestion-row">

          <input
            type="text"
            id="editNoteCategory"
            value="${note.category || ''}"
            placeholder="Category"
          />

          <button
            type="button"
            class="suggest-category-btn"
            id="suggestCategoryBtn"
          >
            ✨ Suggest
          </button>

        </div>

        <p
          id="categorySuggestionMessage"
          class="category-suggestion-message"
        ></p>

        <div class="reminder-field">

          <label for="editNoteReminder">
            🔔 Reminder
          </label>

          <input
            type="datetime-local"
            id="editNoteReminder"
            value="${note.reminderAt ? note.reminderAt.substring(0, 16) : ''}"
          />

          <small>
            Optional — change or remove the reminder
          </small>

        </div>

        ${note.attachmentUrl ? `
          <div class="existing-attachment">

            <div class="existing-attachment-info">
              <span>📎</span>

              <div>
                <strong>
                  ${note.attachmentName || 'Attachment'}
                </strong>

                <small>
                  ${note.attachmentType || 'File'}
                </small>
              </div>
            </div>

            <a
              href="${BACKEND_URL}${note.attachmentUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="attachment-open-btn"
            >
              Open File
            </a>
            
<button
  type="button"
  class="attachment-remove-btn"
  id="removeAttachmentBtn"
>
  🗑️ Remove File
</button>
          </div>
        ` : ''}

        <textarea
          id="editNoteContent"
          required
        >${note.content || ''}</textarea>

        <div class="voice-input-section">

          <button
            type="button"
            class="voice-note-btn"
            id="editVoiceNoteBtn"
          >
            🎤 Start Speaking
          </button>

          <span
            id="editVoiceStatus"
            class="voice-status"
          >
            Click the microphone to continue your note
          </span>

        </div>

        <div class="ai-writing-section">

          <div class="ai-writing-header">
            <span>✨ AI Writing Assistant</span>
            <small>Transform your note instantly</small>
          </div>

          <div class="ai-writing-actions">

            <button
              type="button"
              class="ai-writing-btn"
              data-action="improve"
            >
              ✨ Improve
            </button>

            <button
              type="button"
              class="ai-writing-btn"
              data-action="grammar"
            >
              ✓ Fix Grammar
            </button>

            <button
              type="button"
              class="ai-writing-btn"
              data-action="shorter"
            >
              ✂️ Make Shorter
            </button>

            <button
              type="button"
              class="ai-writing-btn"
              data-action="expand"
            >
              ↗ Expand
            </button>

            <button
              type="button"
              class="ai-writing-btn"
              data-action="bullets"
            >
              • Bullet Points
            </button>

          </div>

          <p
            id="aiWritingStatus"
            class="ai-writing-status"
          ></p>

        </div>

        <div class="edit-note-actions">

          <button
            type="submit"
            class="save-note-btn"
          >
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

const removeAttachmentBtn =
  document.getElementById('removeAttachmentBtn');

if (removeAttachmentBtn) {

  removeAttachmentBtn.addEventListener('click', async () => {

    const confirmed = confirm(
      'Are you sure you want to remove this attachment?'
    );

    if (!confirmed) {
      return;
    }

    try {

      removeAttachmentBtn.disabled = true;
      removeAttachmentBtn.textContent = 'Removing...';

      const response = await fetch(
        `${BACKEND_URL}/api/notes/${noteId}/attachment`,
        {
          method: 'DELETE'
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(
          result || 'Failed to remove attachment'
        );
      }

      alert('Attachment removed successfully!');

      document
        .getElementById('editNoteModal')
        .remove();

      openNote(noteId);

    } catch (error) {

      alert(error.message);

      removeAttachmentBtn.disabled = false;
      removeAttachmentBtn.textContent = '🗑️ Remove File';
    }

  });

}
// ==========================================
// SPEECH TO TEXT - EDIT NOTE
// ==========================================

const EditSpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const editVoiceNoteBtn =
  document.getElementById('editVoiceNoteBtn');

const editVoiceStatus =
  document.getElementById('editVoiceStatus');

const editNoteContent =
  document.getElementById('editNoteContent');

if (EditSpeechRecognition) {

  const editRecognition =
    new EditSpeechRecognition();

  editRecognition.continuous = true;
  editRecognition.interimResults = true;
  editRecognition.lang = 'en-IN';

  let editIsListening = false;
  let editFinalTranscript = '';
  let editOriginalText = '';

  editVoiceNoteBtn.addEventListener('click', () => {

    if (!editIsListening) {

      editFinalTranscript = '';

      editOriginalText =
        editNoteContent.value.trim();

      if (editOriginalText) {
        editOriginalText += ' ';
      }

      editRecognition.start();

      editIsListening = true;

      editVoiceNoteBtn.textContent =
        '⏹ Stop Listening';

      editVoiceNoteBtn.classList.add('listening');

      editVoiceStatus.textContent =
        '🔴 Listening... Continue speaking';

    } else {

      editRecognition.stop();

    }

  });


  editRecognition.onresult = (event) => {

    let interimTranscript = '';

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      const transcript =
        event.results[i][0].transcript;

      if (event.results[i].isFinal) {

        editFinalTranscript +=
          transcript + ' ';

      } else {

        interimTranscript += transcript;

      }

    }

    editNoteContent.value =
      editOriginalText +
      editFinalTranscript +
      interimTranscript;

  };


  editRecognition.onend = () => {

    editIsListening = false;

    editVoiceNoteBtn.textContent =
      '🎤 Start Speaking';

    editVoiceNoteBtn.classList.remove('listening');

    editVoiceStatus.textContent =
      'Speech added to your note';

  };


  editRecognition.onerror = (event) => {

    editIsListening = false;

    editVoiceNoteBtn.textContent =
      '🎤 Start Speaking';

    editVoiceNoteBtn.classList.remove('listening');

    if (event.error === 'not-allowed') {

      editVoiceStatus.textContent =
        '⚠️ Microphone permission denied';

    } else {

      editVoiceStatus.textContent =
        `⚠️ Speech error: ${event.error}`;

    }

  };

} else {

  editVoiceNoteBtn.disabled = true;

  editVoiceStatus.textContent =
    'Speech recognition is not supported in this browser';

}
// ==========================================
// AI WRITING ASSISTANT - EDIT NOTE
// ==========================================

const aiWritingButtons =
  document.querySelectorAll('.ai-writing-btn');

const aiWritingStatus =
  document.getElementById('aiWritingStatus');

aiWritingButtons.forEach((button) => {

  button.addEventListener('click', async () => {

    const action =
      button.dataset.action;

    const contentBox =
      document.getElementById('editNoteContent');

    if (!contentBox.value.trim()) {

      aiWritingStatus.textContent =
        '⚠️ Write something in the note first.';

      return;
    }

    const originalButtonText =
      button.textContent;

    try {

      aiWritingButtons.forEach(btn => {
        btn.disabled = true;
      });

      button.textContent =
        '✨ Working...';

      aiWritingStatus.textContent =
        'AI is improving your note...';

      const controller = new AbortController();

const timeoutId = setTimeout(() => {
  controller.abort();
}, 20000);

const response = await fetch(
  `${BACKEND_URL}/api/ai/writing/${noteId}?action=${encodeURIComponent(action)}`,
  {
    method: 'POST',
    signal: controller.signal
  }
);

clearTimeout(timeoutId);

      const result =
        await response.text();

      if (!response.ok) {

        throw new Error(
          result || 'AI Writing Assistant failed'
        );

      }

      contentBox.value =
        result;

      aiWritingStatus.textContent =
        '✅ Your note has been updated. Review it and click Save Changes.';

    } catch (error) {

  if (error.name === 'AbortError') {
    aiWritingStatus.textContent =
      '⚠️ AI took too long to respond. Please try again.';
  } else {
    aiWritingStatus.textContent =
      `⚠️ ${error.message}`;
  }

}
     finally {

      aiWritingButtons.forEach(btn => {
        btn.disabled = false;
      });

      button.textContent =
        originalButtonText;

    }

  });

});
        const suggestCategoryBtn =
  document.getElementById('suggestCategoryBtn');

suggestCategoryBtn.addEventListener('click', async () => {

  const message =
    document.getElementById('categorySuggestionMessage');

  const categoryInput =
    document.getElementById('editNoteCategory');

  try {

    suggestCategoryBtn.disabled = true;
    suggestCategoryBtn.textContent = '✨ Thinking...';

    message.textContent = 'Analyzing your note...';

    const response = await fetch(
      `${BACKEND_URL}/api/ai/category/${noteId}`,
      {
        method: 'POST'
      }
    );

    const category = await response.text();

    if (!response.ok) {
      throw new Error(
        category || 'Could not suggest a category'
      );
    }

    categoryInput.value = category.trim();

    message.textContent =
      `Suggested category: ${category.trim()}`;

  } catch (error) {

    message.textContent = error.message;

  } finally {

    suggestCategoryBtn.disabled = false;
    suggestCategoryBtn.textContent = '✨ Suggest';

  }

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

          const reminderAt =
  document.getElementById('editNoteReminder').value || null;

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
  content,
  reminderAt,
  reminderDone: false
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
  const container = document.getElementById('notesContainer');

  // Show loading screen
  container.innerHTML = `
    <div class="study-mode-panel">

      <div class="study-mode-header">
        <div class="study-icon">✨</div>

        <div>
          <h2>Generating Summary</h2>
          <p>Please wait while NoteX processes your note.</p>
        </div>
      </div>

      <div class="summary-loading">
        <div class="loader"></div>
        <p>Creating a concise study summary...</p>
      </div>

    </div>
  `;

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

    // Show summary result
    container.innerHTML = `
      <div class="study-mode-panel">

        <div class="study-mode-header">

          <div class="study-icon">✨</div>

          <div>
            <h2>Note Summary</h2>
            <p>
              Your note has been converted into a quick revision summary.
            </p>
          </div>

        </div>


        <div
          class="summary-result collapsed"
          id="summaryResult"
        >
          <pre id="summaryText"></pre>
        </div>


        <button
          class="view-summary-btn"
          id="viewSummaryBtn"
        >
          View Full Summary
        </button>


        <div class="summary-actions">

          <button
            class="create-note-btn"
            id="copySummaryBtn"
          >
            📋 Copy Summary
          </button>

          <button
            class="create-note-btn"
            id="regenerateSummaryBtn"
          >
            🔄 Regenerate
          </button>

          <button
            class="view-all-btn"
            id="backToStudyBtn"
          >
            ← Back
          </button>

        </div>

      </div>
    `;


    // Put summary safely inside the result box
    document.getElementById('summaryText').textContent = summary;


    // VIEW FULL SUMMARY
    const viewSummaryBtn =
      document.getElementById('viewSummaryBtn');

    const summaryResult =
      document.getElementById('summaryResult');

    viewSummaryBtn.addEventListener('click', () => {

      summaryResult.classList.toggle('collapsed');

      if (summaryResult.classList.contains('collapsed')) {

        viewSummaryBtn.textContent =
          'View Full Summary';

      } else {

        viewSummaryBtn.textContent =
          'Show Less';

      }

    });


    // COPY SUMMARY
    document
      .getElementById('copySummaryBtn')
      .addEventListener('click', async () => {

        await navigator.clipboard.writeText(summary);

        const btn =
          document.getElementById('copySummaryBtn');

        btn.textContent = '✅ Copied';

        setTimeout(() => {

          btn.textContent =
            '📋 Copy Summary';

        }, 1500);

      });


    // REGENERATE SUMMARY
    document
      .getElementById('regenerateSummaryBtn')
      .addEventListener('click', () => {

        summarizeNote(noteId);

      });


    // BACK TO STUDY MODE
    document
      .getElementById('backToStudyBtn')
      .addEventListener('click', () => {

        document
          .getElementById('studyModeBtn')
          .click();

      });


  } catch (error) {

    container.innerHTML = `
      <div class="study-mode-panel">

        <div class="study-mode-header">

          <div class="study-icon">⚠️</div>

          <div>
            <h2>Summary Unavailable</h2>
            <p>${error.message}</p>
          </div>

        </div>

        <button
          class="create-note-btn"
          id="retrySummaryBtn"
        >
          Try Again
        </button>

      </div>
    `;


    document
      .getElementById('retrySummaryBtn')
      .addEventListener('click', () => {

        summarizeNote(noteId);

      });

  }
}

async function generateFlashcards(noteId) {

  const container =
    document.getElementById('notesContainer');

  container.innerHTML = `
    <div class="study-mode-panel">

      <div class="study-mode-header">

        <div class="study-icon">
          🃏
        </div>

        <div>
          <h2>Generating Flashcards</h2>
          <p>Please wait while NoteX creates revision cards.</p>
        </div>

      </div>

      <div class="summary-loading">
        <div class="loader"></div>
        <p>Creating flashcards from your note...</p>
      </div>

    </div>
  `;

  try {

    const response = await fetch(
      `${BACKEND_URL}/api/ai/flashcards/${noteId}`,
      {
        method: 'POST'
      }
    );

    const result = await response.text();

    if (!response.ok) {
      throw new Error(
        result || 'Failed to generate flashcards'
      );
    }

    const lines =
  result
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

const cards = [];

let currentQuestion = '';
let currentAnswer = '';

for (const line of lines) {

  if (line.startsWith('Card ')) {
    continue;
  }

  if (line.startsWith('Question:')) {

    if (currentQuestion && currentAnswer) {

      cards.push({
        question: currentQuestion,
        answer: currentAnswer
      });

      currentAnswer = '';
    }

    currentQuestion =
      line.replace('Question:', '').trim();

  } else if (line.startsWith('Answer:')) {

    currentAnswer =
      line.replace('Answer:', '').trim();

  } else if (line.startsWith('Q:')) {

    if (currentQuestion && currentAnswer) {

      cards.push({
        question: currentQuestion,
        answer: currentAnswer
      });

      currentAnswer = '';
    }

    currentQuestion =
      line.replace('Q:', '').trim();

  } else if (line.startsWith('A:')) {

    currentAnswer =
      line.replace('A:', '').trim();

  } else if (currentAnswer) {

    currentAnswer += ' ' + line;
  }

}

if (currentQuestion && currentAnswer) {

  cards.push({
    question: currentQuestion,
    answer: currentAnswer
  });

}


container.innerHTML = `
  <div class="flashcards-panel">

    <div class="flashcards-header">

      <div class="flashcards-header-icon">
        🃏
      </div>

      <div class="flashcards-header-content">

        <div class="flashcards-title-row">

          <h2>Flashcards</h2>

          <span class="flashcards-count">
            ${cards.length} Cards
          </span>

        </div>

        <p>
          Quick revision cards generated from your note.
        </p>

      </div>

    </div>


    <div class="flashcards-grid">

      ${cards.map((card, index) => `

        <div class="notex-flashcard">

          <div class="flashcard-number">
            ${index + 1}
          </div>

          <div class="flashcard-content">

            <p class="flashcard-question">
              <strong>Q:</strong>
              ${card.question}
            </p>

            <p class="flashcard-answer">
              <strong>A:</strong>
              ${card.answer}
            </p>

          </div>

        </div>

      `).join('')}

    </div>


    <div class="flashcards-footer">

      <div class="flashcards-dots">

        <span class="flashcard-dot active"></span>
        <span class="flashcard-dot"></span>
        <span class="flashcard-dot"></span>
        <span class="flashcard-dot"></span>

      </div>


      <div class="flashcards-actions">

        <button
          type="button"
          class="flashcards-regenerate-btn"
          id="regenerateFlashcardsBtn"
        >
          ↻ Regenerate
        </button>

        <button
          type="button"
          class="flashcards-back-btn"
          id="backFromFlashcardsBtn"
        >
          ← Back to Study Mode
        </button>

      </div>

    </div>

  </div>
`;


document
  .getElementById('regenerateFlashcardsBtn')
  .addEventListener('click', () => {

    generateFlashcards(noteId);

  });


document
  .getElementById('backFromFlashcardsBtn')
  .addEventListener('click', () => {

    document
      .getElementById('studyModeBtn')
      .click();

  });

  } catch (error) {

    container.innerHTML = `
      <div class="study-mode-panel">

        <div class="study-mode-header">

          <div class="study-icon">
            ⚠️
          </div>

          <div>
            <h2>Flashcards Unavailable</h2>
            <p>${error.message}</p>
          </div>

        </div>

      </div>
    `;

  }

}

async function generateQuiz(noteId) {

  const container =
    document.getElementById('notesContainer');

  // LOADING SCREEN
  container.innerHTML = `
    <div class="study-mode-panel">

      <div class="study-mode-header">

        <div class="study-icon">
          🧠
        </div>

        <div>
          <h2>Generating Quiz</h2>
          <p>Please wait while NoteX creates your quiz.</p>
        </div>

      </div>

      <div class="summary-loading">
        <div class="loader"></div>
        <p>Creating questions from your note...</p>
      </div>

    </div>
  `;

  try {

    const response = await fetch(
      `${BACKEND_URL}/api/ai/quiz/${noteId}`,
      {
        method: 'POST'
      }
    );

    const result =
      await response.text();

    if (!response.ok) {

      throw new Error(
        result || 'Failed to generate quiz'
      );

    }


    // ==========================================
    // PARSE QUIZ
    // ==========================================

    const blocks =
      result
        .split(/\n\s*\n/)
        .map(block => block.trim())
        .filter(block => block);


    const questions = [];


    for (const block of blocks) {

      const lines =
        block
          .split('\n')
          .map(line => line.trim())
          .filter(line => line);


      const questionLine =
        lines.find(line =>
          line.startsWith('Question:')
        );


      const optionA =
        lines.find(line =>
          line.startsWith('A:')
        );


      const optionB =
        lines.find(line =>
          line.startsWith('B:')
        );


      const optionC =
        lines.find(line =>
          line.startsWith('C:')
        );


      const optionD =
        lines.find(line =>
          line.startsWith('D:')
        );


      const answerLine =
        lines.find(line =>
          line.startsWith('Answer:')
        );


      if (
        questionLine &&
        optionA &&
        optionB &&
        optionC &&
        optionD &&
        answerLine
      ) {

        questions.push({

          question:
            questionLine
              .replace('Question:', '')
              .trim(),

          options: {

            A: optionA
              .replace('A:', '')
              .trim(),

            B: optionB
              .replace('B:', '')
              .trim(),

            C: optionC
              .replace('C:', '')
              .trim(),

            D: optionD
              .replace('D:', '')
              .trim()

          },

          answer:
            answerLine
              .replace('Answer:', '')
              .trim()
              .toUpperCase()

        });

      }

    }


    if (questions.length === 0) {

      throw new Error(
        'Quiz could not be formatted correctly.'
      );

    }

// ==========================================
// SHUFFLE QUIZ OPTIONS
// ==========================================

questions.forEach(question => {

  // Save the actual correct answer text
  const correctAnswerText =
    question.options[question.answer];

  // Get all option texts
  const optionTexts =
    Object.values(question.options);

  // Shuffle them
  for (let i = optionTexts.length - 1; i > 0; i--) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [optionTexts[i], optionTexts[j]] =
      [optionTexts[j], optionTexts[i]];

  }

  // Put shuffled options back into A B C D
  question.options = {
    A: optionTexts[0],
    B: optionTexts[1],
    C: optionTexts[2],
    D: optionTexts[3]
  };

  // Find where the correct answer moved
  question.answer =
    Object.keys(question.options).find(
      letter =>
        question.options[letter] === correctAnswerText
    );

});
    // ==========================================
    // DISPLAY QUIZ
    // ==========================================

    container.innerHTML = `
  <div class="quiz-panel">

    <!-- HEADER -->
    <div class="quiz-header">

      <div class="quiz-header-left">

        <div class="quiz-header-icon">
          🧠
        </div>

        <div>
          <h2>Quiz Me</h2>
          <p>Answer the questions generated from your note.</p>
        </div>

      </div>

      <button
        type="button"
        class="quiz-back-top-btn"
        id="backFromQuizBtn"
      >
        ← Back to Study Mode
      </button>

    </div>


    <!-- QUIZ FORM -->
    <form id="notexQuizForm">

      <div class="quiz-questions-wrapper">

        ${questions.map((question, index) => `

          <div class="quiz-row">

            <div class="quiz-number-column">

              <div class="quiz-number">
                ${index + 1}
              </div>

              ${
                index < questions.length - 1
                  ? '<div class="quiz-number-line"></div>'
                  : ''
              }

            </div>


            <div class="quiz-question-card">

              <h3>
                ${question.question}
              </h3>


              <div class="quiz-options-grid">

                ${Object.entries(question.options)
                  .map(([letter, text]) => `

                    <label class="quiz-option">

                      <input
                        type="radio"
                        name="question-${index}"
                        value="${letter}"
                      />

                      <span class="quiz-radio-custom"></span>

                      <span class="quiz-option-text">

                        <strong>
                          ${letter}.
                        </strong>

                        ${text}

                      </span>

                    </label>

                  `).join('')}

              </div>

            </div>

          </div>

        `).join('')}

      </div>


      <!-- BOTTOM ACTIONS -->
      <div class="quiz-bottom-actions">

        <button
          type="submit"
          class="quiz-submit-btn"
        >
          ➤ Submit Quiz
        </button>

        <button
          type="button"
          class="quiz-clear-btn"
          id="clearQuizBtn"
        >
          ↻ Clear Answers
        </button>

      </div>

    </form>


    <div id="quizResult"></div>

  </div>
`;

document
  .getElementById('clearQuizBtn')
  .addEventListener('click', () => {

    document
      .querySelectorAll(
        '#notexQuizForm input[type="radio"]'
      )
      .forEach(input => {
        input.checked = false;
      });

    const resultBox =
      document.getElementById('quizResult');

    if (resultBox) {
      resultBox.innerHTML = '';
    }

  });
          


    // ==========================================
    // SUBMIT QUIZ
    // ==========================================

    document
  .getElementById('notexQuizForm')
  .addEventListener('submit', (event) => {

    event.preventDefault();

    let score = 0;

    questions.forEach((question, index) => {

      const selected =
        document.querySelector(
          `input[name="question-${index}"]:checked`
        );

      const optionInputs =
        document.querySelectorAll(
          `input[name="question-${index}"]`
        );

      optionInputs.forEach((input) => {

        const optionLabel =
          input.closest('.quiz-option');

        optionLabel.classList.remove(
          'quiz-correct',
          'quiz-wrong'
        );

        if (input.value === question.answer) {
          optionLabel.classList.add('quiz-correct');
        }

        if (
          selected &&
          input.checked &&
          input.value !== question.answer
        ) {
          optionLabel.classList.add('quiz-wrong');
        }

        input.disabled = true;

      });

      if (
        selected &&
        selected.value === question.answer
      ) {
        score++;
      }

    });


    const percentage =
      Math.round(
        (score / questions.length) * 100
      );

      const quizHistory =
  JSON.parse(
    localStorage.getItem('quizHistory') || '[]'
  );
const examTestHistory =
  JSON.parse(
    localStorage.getItem('examTestHistory') || '[]'
  );

const totalExamTests =
  examTestHistory.length;

const averageExamAccuracy =
  totalExamTests > 0
    ? Math.round(
        examTestHistory.reduce(
          (sum, test) => sum + test.percentage,
          0
        ) / totalExamTests
      )
    : 0;

const bestExamAccuracy =
  totalExamTests > 0
    ? Math.max(
        ...examTestHistory.map(
          test => test.percentage
        )
      )
    : 0;

const totalExamQuestions =
  examTestHistory.reduce(
    (sum, test) =>
      sum + test.totalQuestions,
    0
  );
quizHistory.push({
  score: percentage,
  date: new Date().toISOString()
});

localStorage.setItem(
  'quizHistory',
  JSON.stringify(quizHistory)
);

// ==========================================
// UPDATE STUDY SESSION COUNT
// ==========================================

let studySessions =
  parseInt(
    localStorage.getItem('studySessions') || '0'
  );

studySessions++;

localStorage.setItem(
  'studySessions',
  studySessions
);
// ==========================================
// UPDATE QUIZZES COMPLETED
// ==========================================

let quizzesCompleted =
  parseInt(
    localStorage.getItem('quizzesCompleted') || '0'
  );

quizzesCompleted++;

localStorage.setItem(
  'quizzesCompleted',
  quizzesCompleted
);

// ==========================================
// SAVE QUIZ SCORE
// ==========================================

let totalQuizScore =
  parseInt(
    localStorage.getItem('totalQuizScore') || '0'
  );

totalQuizScore += percentage;

localStorage.setItem(
  'totalQuizScore',
  totalQuizScore
);
const studySessionsElement =
  document.getElementById('studySessions');

if (studySessionsElement) {
  studySessionsElement.textContent =
    studySessions;
}

    let resultMessage = '';

    if (percentage >= 80) {

      resultMessage =
        'Excellent work! You have a strong understanding of this note.';

    } else if (percentage >= 60) {

      resultMessage =
        'Good job! Review a few concepts and try again.';

    } else {

      resultMessage =
        'Keep practicing. Review the note and retake the quiz.';

    }


    document
      .getElementById('quizResult')
      .innerHTML = `
        <div class="quiz-result">

          <div class="quiz-result-icon">
            🎯
          </div>

          <h2>
            ${score} / ${questions.length}
          </h2>

          <h3>
            ${percentage}%
          </h3>

          <p>
            ${resultMessage}
          </p>

          <div class="quiz-result-actions">

            <button
              type="button"
              class="quiz-retake-btn"
              id="retakeQuizBtn"
            >
              ↻ Retake Quiz
            </button>

            <button
              type="button"
              class="quiz-result-back-btn"
              id="quizResultBackBtn"
            >
              ← Back to Study Mode
            </button>

          </div>

        </div>
      `;


    document
      .getElementById('retakeQuizBtn')
      .addEventListener('click', () => {

        generateQuiz(noteId);

      });


    document
      .getElementById('quizResultBackBtn')
      .addEventListener('click', () => {

        document
          .getElementById('studyModeBtn')
          .click();

      });


    document
      .getElementById('quizResult')
      .scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

  });


    // BACK

    document
      .getElementById('backFromQuizBtn')
      .addEventListener('click', () => {

        document
          .getElementById('studyModeBtn')
          .click();

      });


  } catch (error) {

    container.innerHTML = `
      <div class="study-mode-panel">

        <div class="study-mode-header">

          <div class="study-icon">
            ⚠️
          </div>

          <div>

            <h2>Quiz Unavailable</h2>

            <p>
              ${error.message}
            </p>

          </div>

        </div>

      </div>
    `;

  }

}

window.generateQuiz = generateQuiz;

window.generateFlashcards = generateFlashcards;

window.summarizeNote = summarizeNote;

// =========================================================
// SMART REMINDER SYSTEM
// =========================================================

let reminderCheckRunning = false;

async function checkSmartReminders() {

  if (reminderCheckRunning) {
    return;
  }

  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch {
    return;
  }

  if (!user || !user.id) {
    return;
  }

  reminderCheckRunning = true;

  try {

    const response = await fetch(
      `${BACKEND_URL}/api/notes/user/${user.id}`
    );

    if (!response.ok) {
      return;
    }

    const notes = await response.json();

    const now = new Date();

    for (const note of notes) {

      if (
        !note.reminderAt ||
        note.reminderDone ||
        note.archived
      ) {
        continue;
      }

      const reminderTime =
        new Date(note.reminderAt);

      if (reminderTime <= now) {

        showSmartReminder(note);

      }

    }

  } catch (error) {

    console.error(
      'Reminder check failed:',
      error
    );

  } finally {

    reminderCheckRunning = false;

  }
}


// =========================================================
// SHOW REMINDER
// =========================================================

function showSmartReminder(note) {

  /*
   * Prevent the same reminder from repeatedly
   * appearing while the user is viewing NoteX.
   */

  const reminderKey =
    `notex-reminder-${note.id}-${note.reminderAt}`;

  if (
    sessionStorage.getItem(reminderKey)
  ) {
    return;
  }

  sessionStorage.setItem(
    reminderKey,
    'shown'
  );


  const oldReminder =
    document.getElementById(
      `smartReminder-${note.id}`
    );

  if (oldReminder) {
    oldReminder.remove();
  }


  const reminder =
    document.createElement('div');

  reminder.className =
    'smart-reminder-popup';

  reminder.id =
    `smartReminder-${note.id}`;


  reminder.innerHTML = `
    <div class="smart-reminder-icon">
      🔔
    </div>

    <div class="smart-reminder-content">

      <span class="smart-reminder-label">
        NoteX Reminder
      </span>

      <h3>
        ${escapeReminderHTML(note.title || 'Untitled Note')}
      </h3>

      <p>
        ${escapeReminderHTML(
          createReminderPreview(note.content)
        )}
      </p>

      <div class="smart-reminder-actions">

        <button
          type="button"
          class="reminder-view-btn"
        >
          View Note
        </button>

        <button
          type="button"
          class="reminder-dismiss-btn"
        >
          Dismiss
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(
    reminder
  );


  /*
   * Small delay allows the CSS animation
   * to run correctly.
   */

  requestAnimationFrame(() => {

    reminder.classList.add(
      'show'
    );

  });


  const viewButton =
    reminder.querySelector(
      '.reminder-view-btn'
    );


  const dismissButton =
    reminder.querySelector(
      '.reminder-dismiss-btn'
    );


  viewButton.addEventListener(
    'click',
    () => {

      reminder.remove();

      /*
       * Uses your existing openNote()
       * function.
       */

      openNote(note.id);

    }
  );


  dismissButton.addEventListener(
    'click',
    () => {

      reminder.classList.remove(
        'show'
      );

      setTimeout(() => {
        reminder.remove();
      }, 250);

    }
  );

}


// =========================================================
// REMINDER PREVIEW
// =========================================================

function createReminderPreview(content) {

  if (!content) {
    return 'You asked NoteX to remind you about this note.';
  }

  const clean =
    content
      .replace(/\s+/g, ' ')
      .trim();

  if (clean.length <= 100) {
    return clean;
  }

  return clean.substring(
    0,
    100
  ) + '...';
}


// =========================================================
// SAFE REMINDER TEXT
// =========================================================

function escapeReminderHTML(text) {

  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

}


// =========================================================
// CHECK REMINDERS
// =========================================================

checkSmartReminders();

/*
 * Check once every 30 seconds while NoteX
 * is open in the browser.
 */

setInterval(
  checkSmartReminders,
  30000
);

// =========================================================
// ATTACHMENT FILE NAME DISPLAY
// =========================================================

document.addEventListener('change', (event) => {

  if (event.target.id !== 'noteAttachment') {
    return;
  }

  const fileName =
    document.getElementById('attachmentFileName');

  if (!fileName) {
    return;
  }

  if (event.target.files.length > 0) {

    fileName.textContent =
      event.target.files[0].name;

  } else {

    fileName.textContent =
      'No file selected';
  }

});