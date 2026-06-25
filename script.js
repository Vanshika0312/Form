const form = document.getElementById('record-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const urlInput = document.getElementById('url');
const imageInput = document.getElementById('image');
const notesInput = document.getElementById('notes');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const recordList = document.getElementById('record-list');
const recordCount = document.getElementById('record-count');
const navButtons = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const toggleMenuBtn = document.querySelector('.toggle-menu');
const sidebar = document.querySelector('.sidebar');

const errors = {
    title: document.getElementById('title-error'),
    description: document.getElementById('description-error'),
    url: document.getElementById('url-error'),
    image: document.getElementById('image-error'),
};

let records = [];
let editId = null;

function setActiveSection(sectionId) {
    panels.forEach(panel => panel.id === sectionId ? panel.classList.add('active-panel') : panel.classList.remove('active-panel'));
    navButtons.forEach(btn => btn.dataset.section === sectionId ? btn.classList.add('active') : btn.classList.remove('active'));
    if (window.innerWidth <= 720) {
        sidebar.classList.remove('open');
    }
}

function updateRecordCount() {
    recordCount.textContent = `${records.length} ${records.length === 1 ? 'record' : 'records'}`;
}

function renderRecords() {
    updateRecordCount();
    recordList.innerHTML = '';

    if (records.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-state';
        emptyMessage.textContent = 'No records yet. Add one from the create form.';
        recordList.appendChild(emptyMessage);
        return;
    }

    records.forEach(record => {
        const card = document.createElement('article');
        card.className = 'record-card';

        const imageWrapper = document.createElement('div');
        if (record.image) {
            const image = document.createElement('img');
            image.src = record.image;
            image.alt = record.title;
            imageWrapper.appendChild(image);
        } else {
            imageWrapper.style.background = '#e5e7eb';
            imageWrapper.style.display = 'flex';
            imageWrapper.style.alignItems = 'center';
            imageWrapper.style.justifyContent = 'center';
            imageWrapper.textContent = 'No image';
            imageWrapper.style.color = '#6b7280';
            imageWrapper.style.fontWeight = '700';
        }

        const content = document.createElement('div');
        content.className = 'record-content';

        const title = document.createElement('h3');
        title.textContent = record.title;
        const description = document.createElement('p');
        description.textContent = record.description;

        const metaLine = document.createElement('div');
        metaLine.className = 'record-meta';
        const createdText = document.createElement('span');
        createdText.textContent = `Created: ${record.createdAt}`;
        const sourceText = document.createElement('span');
        sourceText.textContent = record.url ? 'Has link' : 'No link';
        metaLine.append(createdText, sourceText);

        if (record.url) {
            const link = document.createElement('a');
            link.className = 'record-link';
            link.href = record.url;
            link.target = '_blank';
            link.rel = 'noreferrer noopener';
            link.textContent = record.url;
            content.append(title, description, link, metaLine);
        } else {
            content.append(title, description, metaLine);
        }

        if (record.notes) {
            const notes = document.createElement('p');
            notes.textContent = record.notes;
            notes.style.marginTop = '8px';
            notes.style.color = 'var(--muted)';
            content.appendChild(notes);
        }

        const actions = document.createElement('div');
        actions.className = 'record-actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'action-btn edit';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => loadRecordForEdit(record.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'action-btn delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteRecord(record.id));

        actions.append(editBtn, deleteBtn);
        content.appendChild(actions);

        card.append(imageWrapper, content);
        recordList.appendChild(card);
    });
}

function getValidationState() {
    let isValid = true;
    Object.values(errors).forEach(node => (node.textContent = ''));

    if (!titleInput.value.trim()) {
        errors.title.textContent = 'Title is required.';
        isValid = false;
    }

    if (!descriptionInput.value.trim()) {
        errors.description.textContent = 'Description is required.';
        isValid = false;
    }

    if (urlInput.value.trim() && !isValidUrl(urlInput.value.trim())) {
        errors.url.textContent = 'Please enter a valid URL.';
        isValid = false;
    }

    if (imageInput.value.trim() && !isValidUrl(imageInput.value.trim())) {
        errors.image.textContent = 'Please enter a valid image URL.';
        isValid = false;
    }

    return isValid;
}

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function resetForm() {
    form.reset();
    editId = null;
    saveBtn.textContent = 'Save Record';
    Array.from(form.querySelectorAll('.error')).forEach(error => (error.textContent = ''));
}

function loadRecordForEdit(id) {
    const record = records.find(item => item.id === id);
    if (!record) return;

    titleInput.value = record.title;
    descriptionInput.value = record.description;
    urlInput.value = record.url;
    imageInput.value = record.image;
    notesInput.value = record.notes;
    editId = id;
    saveBtn.textContent = 'Update Record';
    setActiveSection('form-section');
}

function deleteRecord(id) {
    records = records.filter(item => item.id !== id);
    renderRecords();
}

function createRecord(data) {
    return {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...data,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
}

form.addEventListener('submit', event => {
    event.preventDefault();

    if (!getValidationState()) {
        return;
    }

    const recordData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        url: urlInput.value.trim(),
        image: imageInput.value.trim(),
        notes: notesInput.value.trim(),
    };

    if (editId) {
        records = records.map(item => item.id === editId ? { ...item, ...recordData } : item);
    } else {
        records.unshift(createRecord(recordData));
    }

    renderRecords();
    resetForm();
    setActiveSection('records-section');
});

resetBtn.addEventListener('click', () => {
    resetForm();
});

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.section;
        setActiveSection(target);
    });
});

toggleMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
        sidebar.classList.remove('open');
    }
});

renderRecords();
