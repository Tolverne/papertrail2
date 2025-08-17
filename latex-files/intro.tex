// Main Application Class
class QuizApp {
    constructor() {
        this.fileManager = new FileManager();
        this.latexParser = new LatexParser();
        this.canvasHandler = null;
        this.pdfGenerator = new PDFGenerator(this.latexParser, window.auth);
        this.storage = null;
        this.currentSectionIndex = 0;
        
        this.init();
    }

    async init() {
        // Check authentication
        if (!this.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize components
        this.setupUserInterface();
        await this.initializeApp();
    }

    checkAuth() {
        const user = window.auth.loadSession();
        if (!user) {
            return false;
        }

        // Initialize storage for authenticated user
        this.storage = new CanvasStorage(user.id);
        this.canvasHandler = new CanvasHandler(this.storage);
        
        return true;
    }

    setupUserInterface() {
        const user = window.auth.getCurrentUser();
        if (user) {
            document.getElementById('userDisplay').textContent = user.displayName;
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshTree');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.innerHTML = '⟳';
                refreshBtn.disabled = true;
                await this.fileManager.initializeFileTree();
                refreshBtn.innerHTML = '🔄';
                refreshBtn.disabled = false;
            });
        }

        // PDF generation
        const pdfBtn = document.getElementById('generatePdf');
        if (pdfBtn) {
            pdfBtn.addEventListener('click', () => {
                const currentFile = this.fileManager.getCurrentFile();
                const fileName = currentFile ? currentFile.name : 'quiz';
                this.pdfGenerator.generatePDF(fileName);
            });
        }

        // File loaded event
        window.addEventListener('fileLoaded', (e) => {
            this.handleFileLoaded(e.detail);
        });

        // Canvas storage controls
        this.canvasHandler.setupStorageControls();

        // Keyboard navigation for sections
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSection();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSection();
            }
        });
    }

    async initializeApp() {
        try {
            // Initialize file tree
            await this.fileManager.initializeFileTree();
            
            // Initialize sidebar tools
            this.canvasHandler.initializeSidebarTools();
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize application');
        }
    }

    handleFileLoaded(fileData) {
        console.log('File loaded:', fileData.fileName);
        
        // Parse the LaTeX content
        const parseResult = this.latexParser.parseLatexFile(fileData.content);
        
        if (parseResult.type === 'sections') {
            this.renderSectionCarousel(parseResult.data);
        } else {
            this.renderQuestions(parseResult.data);
        }
        
        // Show PDF button
        document.getElementById('generatePdf').style.display = 'block';
    }

    renderSectionCarousel(sections) {
        const carousel = document.getElementById('sectionCarousel');
        const questionsContainer = document.getElementById('questionsContainer');
        
        questionsContainer.style.display = 'none';
        carousel.style.display = 'block';
        
        this.renderSectionTabs(sections);
        this.renderCarouselSlides(sections);
        this.initializeCarouselControls();
        
        setTimeout(() => {
            this.canvasHandler.initializeCanvasesForSection(0);
            this.latexParser.renderMath();
        }, 100);
        
        this.showSection(0);
    }

    renderSectionTabs(sections) {
        const tabsContainer = document.getElementById('sectionTabs');
        tabsContainer.innerHTML = '';
        
        sections.forEach((section, index) => {
            const tab = document.createElement('button');
            tab.className = `section-tab ${index === 0 ? 'active' : ''}`;
            tab.textContent = section.title;
            tab.addEventListener('click', () => this.showSection(index));
            tabsContainer.appendChild(tab);
        });
    }

    renderCarouselSlides(sections) {
        const container = document.getElementById('carouselContainer');
        container.innerHTML = '';
        
        sections.forEach((section, sectionIndex) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="section-title">${section.title}</div>
                <div class="section-questions" data-section="${sectionIndex}"></div>
            `;
            container.appendChild(slide);
            
            this.renderQuestionsForSection(section.questions, sectionIndex);
        });
    }

    renderQuestionsForSection(questions, sectionIndex) {
        const sectionQuestionsContainer = document.querySelector(`[data-section="${sectionIndex}"]`);
        if (!sectionQuestionsContainer) return;
        
        sectionQuestionsContainer.innerHTML = '';

        if (questions.length === 0) {
            sectionQuestionsContainer.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 40px;">No questions found in this section.</p>';
            return;
        }

        questions.forEach((question) => {
            const questionDiv = this.createQuestionElement(question, sectionIndex);
            sectionQuestionsContainer.appendChild(questionDiv);
        });
    }

    renderQuestions(questions) {
        const container = document.getElementById('questionsContainer');
        const carousel = document.getElementById('sectionCarousel');
        
        carousel.style.display = 'none';
        container.style.display = 'block';
        container.innerHTML = '';

        questions.forEach((question) => {
            const questionDiv = this.createQuestionElement(question);
            container.appendChild(questionDiv);
        });

        this.canvasHandler.initializeCanvases();
        this.latexParser.renderMath();
    }

    createQuestionElement(question, sectionIndex = null) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-container';
        questionDiv.setAttribute('data-question', question.id);
        if (sectionIndex !== null) {
            questionDiv.setAttribute('data-section', sectionIndex);
        }
        
        questionDiv.innerHTML = `
            <div class="question-text">
                <strong>Question ${question.id}:</strong> ${this.latexParser.processLatexText(question.text)}
            </div>
        `;

        question.parts.forEach((part) => {
            const partDiv = this.createPartElement(question, part, sectionIndex);
            questionDiv.appendChild(partDiv);
        });

        return questionDiv;
    }

    createPartElement(question, part, sectionIndex = null) {
        const partDiv = document.createElement('div');
        partDiv.className = 'part-container';
        partDiv.setAttribute('data-question', question.id);
        partDiv.setAttribute('data-part', part.id);
        if (sectionIndex !== null) {
            partDiv.setAttribute('data-section', sectionIndex);
        }
        
        const sectionAttr = sectionIndex !== null ? `data-section="${sectionIndex}"` : '';
        
        const partContent = `
            <div class="part-text">
                ${part.text ? `<strong>Part ${part.id}:</strong> ${this.latexParser.processLatexText(part.text)}` : ''}
            </div>
            <div class="canvas-area">
                <div class="canvas-container">
                    <canvas class="drawing-canvas" width="400" height="300" 
                            data-question="${question.id}" 
                            data-part="${part.id}"
                            ${sectionAttr}></canvas>
                    <div class="resize-handle"></div>
                </div>
            </div>
        `;
        
        partDiv.innerHTML = partContent;
        return partDiv;
    }

    initializeCarouselControls() {
        const prevBtn = document.getElementById('prevSection');
        const nextBtn = document.getElementById('nextSection');
        
        this.updateCarouselControls();
    }

    showSection(index) {
        const sections = this.latexParser.getSections();
        if (index < 0 || index >= sections.length) return;
        
        this.currentSectionIndex = index;
        
        // Update tabs
        document.querySelectorAll('.section-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });
        
        // Move carousel
        const container = document.getElementById('carouselContainer');
        if (container) {
            container.style.transform = `translateX(-${index * 100}%)`;
        }
        
        this.updateCarouselControls();
        
        // Initialize canvases for this section
        setTimeout(() => {
            this.canvasHandler.initializeCanvasesForSection(index);
            this.latexParser.renderMathForSection(index);
        }, 500);
    }

    previousSection() {
        if (this.currentSectionIndex > 0) {
            this.showSection(this.currentSectionIndex - 1);
        }
    }

    nextSection() {
        const sections = this.latexParser.getSections();
        if (this.currentSectionIndex < sections.length - 1) {
            this.showSection(this.currentSectionIndex + 1);
        }
    }

    updateCarouselControls() {
        const prevBtn = document.getElementById('prevSection');
        const nextBtn = document.getElementById('nextSection');
        const counter = document.getElementById('sectionCounter');
        const sections = this.latexParser.getSections();
        
        if (prevBtn) prevBtn.disabled = this.currentSectionIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentSectionIndex === sections.length - 1;
        
        if (counter) {
            counter.textContent = `${this.currentSectionIndex + 1} / ${sections.length}`;
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('fileSidebar');
        const mainContent = document.getElementById('mainContent');
        const toggleBtn = document.getElementById('sidebarToggle');
        
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            toggleBtn.textContent = '◀';
            toggleBtn.title = 'Hide file browser';
        } else {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            toggleBtn.textContent = '▶';
            toggleBtn.title = 'Show file browser';
        }
    }

    logout() {
        try {
            // Clean up canvas handler
            if (this.canvasHandler) {
                this.canvasHandler.destroy();
            }
            
            // Clear parser data
            this.latexParser.clear();
            
            // Logout user
            window.auth.logout();
            
            // Redirect to login
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even if cleanup fails
            window.location.href = 'login.html';
        }
    }

    showError(message) {
        console.error(message);
        alert(message); // You can replace this with a better error display
    }

    showSuccess(message) {
        console.log(message);
        // You can implement a toast notification here
        alert(message);
    }

    // Public methods for external access
    getCurrentFile() {
        return this.fileManager.getCurrentFile();
    }

    getCurrentUser() {
        return window.auth.getCurrentUser();
    }

    getCanvasStorage() {
        return this.storage;
    }

    getCanvasHandler() {
        return this.canvasHandler;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the login page
    if (document.querySelector('.login-page')) {
        return; // Login page has its own initialization
    }
    
    // Initialize main app
    try {
        window.quizApp = new QuizApp();
        console.log('Quiz app initialized successfully');
    } catch (error) {
        console.error('Failed to initialize quiz app:', error);
        alert('Failed to initialize application. Please refresh the page.');
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for global access if needed
window.QuizApp = QuizApp;
