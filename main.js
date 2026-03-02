document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('file-list');

    // Drag-and-drop event preventions
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // Handle drag highlight
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add('highlight');
            dropzone.style.borderColor = '#00e5ff';
            dropzone.style.background = 'rgba(0, 229, 255, 0.05)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove('highlight');
            dropzone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            dropzone.style.background = 'rgba(255, 255, 255, 0.05)';
        }, false);
    });

    // Handle drop
    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    // Handle input change
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        ([...files]).forEach(file => {
            addFileToList(file);
            createAppCard(file);
        });
    }

    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        fileName.style.fontWeight = '500';

        const fileSize = document.createElement('span');
        fileSize.textContent = formatBytes(file.size);
        fileSize.style.color = 'rgba(255, 255, 255, 0.4)';
        fileSize.style.fontSize = '0.8rem';

        fileItem.appendChild(fileName);
        fileItem.appendChild(fileSize);

        // Simulate "Uploading" state
        const status = document.createElement('span');
        status.textContent = 'Uploaded';
        status.style.color = '#00e5ff';
        status.style.fontSize = '0.7rem';
        status.style.textTransform = 'uppercase';
        status.style.marginLeft = '1rem';

        fileItem.appendChild(status);

        fileList.prepend(fileItem);

        // Visual feedback for successful "Upload"
        fileItem.style.borderLeft = '4px solid #00e5ff';
    }

    function createAppCard(file) {
        const container = document.getElementById('dynamic-apps-container');
        const section = document.getElementById('uploaded-apps');

        section.style.display = 'block';

        const card = document.createElement('div');
        card.className = 'glass-container app-card dynamic-app-card';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.5s ease-out';

        const extension = file.name.split('.').pop().toUpperCase();
        const fileUrl = URL.createObjectURL(file);

        card.innerHTML = `
            <div class="app-icon uploaded">${extension}</div>
            <h4 class="app-title">${file.name}</h4>
            <p>Recently uploaded modeling application. Ready for use within the MR RAAFI dashboard.</p>
            <div class="card-actions">
                <button class="btn btn-secondary open-btn">Run/Open</button>
                <div class="sub-actions">
                    <button class="btn-icon edit-btn" title="Edit Name"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" title="Delete App"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        container.prepend(card);

        // Event Listeners
        const openBtn = card.querySelector('.open-btn');
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const titleEl = card.querySelector('.app-title');

        openBtn.addEventListener('click', () => {
            window.open(fileUrl, '_blank');
        });

        editBtn.addEventListener('click', () => {
            const newName = prompt('Enter new name for the application:', titleEl.textContent);
            if (newName && newName.trim() !== '') {
                titleEl.textContent = newName.trim();
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove this application?')) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.remove();
                    if (container.children.length === 0) {
                        section.style.display = 'none';
                    }
                }, 500);
            }
        });

        // Animate in
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 100);
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Scroll reveal/animation logic (simple version)
    const elementsToReveal = document.querySelectorAll('.glass-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});
