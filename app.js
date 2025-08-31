// VoiceQuest - Interactive Story Creator
class VoiceQuest {
    constructor() {
        this.currentStory = null;
        this.currentSegment = 'start';
        this.storyPath = [];
        this.apiKey = 'Your Murf API Key';
        this.stories = this.loadStoriesFromStorage();
        this.currentEditingStory = null;
        this.selectedTemplate = null;
        
        this.sampleData = {
            sampleStories: [
                {
                    id: "dragon-choice",
                    title: "The Dragon's Choice",
                    genre: "Fantasy",
                    description: "A brave adventurer encounters a legendary dragon and must choose between courage and wisdom.",
                    characters: [
                        {name: "Narrator", voice: "en-US-marcus", description: "Story narrator with deep, engaging voice"},
                        {name: "Sir Galahad", voice: "en-UK-gabriel", description: "A noble knight with British accent"},
                        {name: "Ancient Dragon", voice: "en-US-sarah", description: "Wise dragon with mysterious tone"}
                    ],
                    segments: [
                        {
                            id: "start",
                            text: "You stand before the entrance to the legendary Dragon's Cave, your sword gleaming in the moonlight.",
                            character: "Narrator",
                            choices: [
                                {text: "Enter the cave boldly", next: "bold-entry"},
                                {text: "Call out to announce your presence", next: "announce"},
                                {text: "Wait and observe first", next: "observe"}
                            ]
                        },
                        {
                            id: "bold-entry",
                            text: "As you stride into the darkness, a massive shadow shifts in the depths. 'So, another bold fool enters my domain,' rumbles a ancient voice.",
                            character: "Ancient Dragon",
                            choices: [
                                {text: "Draw your sword immediately", next: "combat"},
                                {text: "Show respect and bow", next: "respect"}
                            ]
                        },
                        {
                            id: "announce",
                            text: "Your voice echoes through the cavern. 'I seek an audience with the great dragon!' A low chuckle reverberates from within.",
                            character: "Narrator",
                            choices: [
                                {text: "Wait for a response", next: "patience"},
                                {text: "Enter slowly", next: "cautious-entry"}
                            ]
                        }
                    ]
                },
                {
                    id: "detective-mystery",
                    title: "The Missing Jewel",
                    genre: "Mystery",
                    description: "A detective must solve the case of a stolen diamond at a fancy gala.",
                    characters: [
                        {name: "Detective Morgan", voice: "en-US-natalie", description: "Sharp detective with commanding presence"},
                        {name: "Butler James", voice: "en-UK-gabriel", description: "Suspicious butler with formal tone"},
                        {name: "Lady Pemberton", voice: "en-US-sarah", description: "Wealthy socialite, potential victim"}
                    ],
                    segments: [
                        {
                            id: "start",
                            text: "The grand ballroom falls silent as Lady Pemberton's scream pierces the night. Her prized diamond necklace has vanished!",
                            character: "Detective Morgan",
                            choices: [
                                {text: "Question the guests immediately", next: "question-guests"},
                                {text: "Examine the scene for clues", next: "examine-scene"},
                                {text: "Check the security footage", next: "security"}
                            ]
                        }
                    ]
                }
            ],
            voiceOptions: [
                {id: "en-US-marcus", name: "Marcus", language: "English (US)", gender: "Male", style: "Deep, authoritative"},
                {id: "en-US-natalie", name: "Natalie", language: "English (US)", gender: "Female", style: "Professional, clear"},
                {id: "en-UK-gabriel", name: "Gabriel", language: "English (UK)", gender: "Male", style: "British, sophisticated"},
                {id: "en-US-sarah", name: "Sarah", language: "English (US)", gender: "Female", style: "Warm, versatile"},
                {id: "en-UK-lily", name: "Lily", language: "English (UK)", gender: "Female", style: "British, elegant"},
                {id: "en-US-jacob", name: "Jacob", language: "English (US)", gender: "Male", style: "Friendly, engaging"}
            ],
            templates: [
                {
                    id: "fantasy-quest",
                    name: "Fantasy Adventure",
                    description: "Hero's journey with magical elements",
                    structure: {
                        segments: 12,
                        choices: 3,
                        characters: ["Hero", "Mentor", "Villain"],
                        themes: ["courage", "friendship", "good vs evil"]
                    }
                },
                {
                    id: "mystery-detective",
                    name: "Detective Mystery", 
                    description: "Solve crimes and uncover clues",
                    structure: {
                        segments: 10,
                        choices: 2,
                        characters: ["Detective", "Suspect", "Witness"],
                        themes: ["investigation", "deduction", "justice"]
                    }
                },
                {
                    id: "sci-fi-space",
                    name: "Space Adventure",
                    description: "Explore the cosmos and alien worlds",
                    structure: {
                        segments: 15,
                        choices: 3,
                        characters: ["Captain", "Alien", "Crew Member"],
                        themes: ["exploration", "technology", "first contact"]
                    }
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleStories();
        this.showPage('homePage');
        this.populateVoiceOptions();
        this.loadApiKey();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('createStoryCard').addEventListener('click', () => this.showCreateStoryModal());
        document.getElementById('playStoriesCard').addEventListener('click', () => this.showLibraryPage());
        document.getElementById('myStoriesCard').addEventListener('click', () => this.showLibraryPage());
        document.getElementById('backToHome').addEventListener('click', () => this.showPage('homePage'));
        document.getElementById('backToStories').addEventListener('click', () => this.showLibraryPage());
        document.getElementById('backToHomeFromLibrary').addEventListener('click', () => this.showPage('homePage'));
        document.getElementById('createNewFromLibrary').addEventListener('click', () => this.showCreateStoryModal());

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.showModal('settingsModal'));
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        document.getElementById('cancelSettings').addEventListener('click', () => this.hideModal('settingsModal'));
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.hideModal('settingsModal'));

        // Story Creation
        document.getElementById('addCharacterBtn').addEventListener('click', () => this.showModal('characterModal'));
        document.getElementById('addSegmentBtn').addEventListener('click', () => this.showModal('segmentModal'));
        document.getElementById('saveStoryBtn').addEventListener('click', () => this.saveCurrentStory());

        // Character Modal
        document.getElementById('saveCharacter').addEventListener('click', () => this.saveCharacter());
        document.getElementById('cancelCharacter').addEventListener('click', () => this.hideModal('characterModal'));
        document.getElementById('closeCharacterModal').addEventListener('click', () => this.hideModal('characterModal'));

        // Segment Modal
        document.getElementById('addChoiceBtn').addEventListener('click', () => this.addChoiceInput());
        document.getElementById('saveSegment').addEventListener('click', () => this.saveSegment());
        document.getElementById('cancelSegment').addEventListener('click', () => this.hideModal('segmentModal'));
        document.getElementById('closeSegmentModal').addEventListener('click', () => this.hideModal('segmentModal'));

        // Template Modal
        document.getElementById('startFromScratch').addEventListener('click', () => this.startNewStory());
        document.getElementById('closeTemplateModal').addEventListener('click', () => this.hideModal('templateModal'));

        // Voice Preview
        document.getElementById('previewVoiceBtn').addEventListener('click', () => this.previewVoice());

        // Audio Controls
        document.getElementById('playAudioBtn').addEventListener('click', () => this.playCurrentSegmentAudio());

        // Story Player
        document.getElementById('restartStoryBtn').addEventListener('click', () => this.restartStory());

        // Library Filters
        document.getElementById('genreFilter').addEventListener('change', () => this.filterStories());
        document.getElementById('searchStories').addEventListener('input', () => this.filterStories());

        // Global modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.hideModal(openModal.id);
                }
            }
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        
        if (pageId === 'libraryPage') {
            this.populateStoryLibrary();
        }
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        
        if (modalId === 'templateModal') {
            this.populateTemplates();
        } else if (modalId === 'characterModal') {
            this.resetCharacterForm();
        } else if (modalId === 'segmentModal') {
            this.resetSegmentForm();
        }
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    showCreateStoryModal() {
        this.currentEditingStory = {
            id: this.generateId(),
            title: '',
            genre: 'fantasy',
            description: '',
            characters: [],
            segments: []
        };
        this.showModal('templateModal');
    }

    populateTemplates() {
        const grid = document.getElementById('templateGrid');
        grid.innerHTML = '';
        
        this.sampleData.templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <div class="template-details">
                    <small>Characters: ${template.structure.characters.join(', ')}</small>
                </div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedTemplate = template;
                
                // Add proceed button when template is selected
                this.addProceedButton();
            });
            grid.appendChild(card);
        });
    }

    addProceedButton() {
        let existingBtn = document.getElementById('proceedWithTemplate');
        if (!existingBtn && this.selectedTemplate) {
            const templateActions = document.querySelector('.template-actions');
            const proceedBtn = document.createElement('button');
            proceedBtn.id = 'proceedWithTemplate';
            proceedBtn.className = 'btn btn--primary';
            proceedBtn.textContent = 'Use This Template';
            proceedBtn.addEventListener('click', () => this.startNewStory(this.selectedTemplate));
            templateActions.insertBefore(proceedBtn, document.getElementById('startFromScratch'));
        }
    }

    startNewStory(template = null) {
        this.hideModal('templateModal');
        
        if (template) {
            // Apply template structure
            this.currentEditingStory.characters = template.structure.characters.map(name => ({
                name: name,
                voice: this.sampleData.voiceOptions[Math.floor(Math.random() * this.sampleData.voiceOptions.length)].id,
                description: `A ${name.toLowerCase()} character`
            }));
        }
        
        this.showPage('createPage');
        this.populateCreateInterface();
    }

    populateCreateInterface() {
        this.updateCharacterList();
        this.updateSegmentList();
    }

    updateCharacterList() {
        const list = document.getElementById('characterList');
        list.innerHTML = '';
        
        if (!this.currentEditingStory || !this.currentEditingStory.characters) return;
        
        this.currentEditingStory.characters.forEach((character, index) => {
            const item = document.createElement('div');
            item.className = 'character-item';
            const voice = this.sampleData.voiceOptions.find(v => v.id === character.voice);
            item.innerHTML = `
                <div class="character-info">
                    <h5>${character.name}</h5>
                    <div class="voice-name">${voice ? voice.name : 'No voice assigned'}</div>
                </div>
                <div class="character-actions">
                    <button class="btn btn--outline btn--sm edit-character-btn" data-index="${index}">Edit</button>
                    <button class="btn btn--outline btn--sm delete-character-btn" data-index="${index}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            item.querySelector('.edit-character-btn').addEventListener('click', () => this.editCharacter(index));
            item.querySelector('.delete-character-btn').addEventListener('click', () => this.deleteCharacter(index));
            
            list.appendChild(item);
        });

        // Update character select in segment modal
        this.updateCharacterSelect();
    }

    updateSegmentList() {
        const list = document.getElementById('segmentList');
        list.innerHTML = '';
        
        if (!this.currentEditingStory || !this.currentEditingStory.segments) return;
        
        this.currentEditingStory.segments.forEach((segment, index) => {
            const item = document.createElement('div');
            item.className = 'segment-item';
            item.innerHTML = `
                <div class="segment-info">
                    <h4>Segment: ${segment.id}</h4>
                    <p>Character: ${segment.character} | Choices: ${segment.choices ? segment.choices.length : 0}</p>
                </div>
                <div class="segment-actions">
                    <button class="btn btn--outline btn--sm edit-segment-btn" data-index="${index}">Edit</button>
                    <button class="btn btn--outline btn--sm delete-segment-btn" data-index="${index}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            item.querySelector('.edit-segment-btn').addEventListener('click', () => this.editSegment(index));
            item.querySelector('.delete-segment-btn').addEventListener('click', () => this.deleteSegment(index));
            
            list.appendChild(item);
        });
    }

    updateCharacterSelect() {
        const select = document.getElementById('segmentCharacter');
        if (!select) return;
        
        select.innerHTML = '';
        
        if (this.currentEditingStory && this.currentEditingStory.characters) {
            this.currentEditingStory.characters.forEach(character => {
                const option = document.createElement('option');
                option.value = character.name;
                option.textContent = character.name;
                select.appendChild(option);
            });
        }
    }

    populateVoiceOptions() {
        const select = document.getElementById('characterVoice');
        if (!select) return;
        
        select.innerHTML = '';
        
        this.sampleData.voiceOptions.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.id;
            option.textContent = `${voice.name} (${voice.language}) - ${voice.style}`;
            select.appendChild(option);
        });
    }

    resetCharacterForm() {
        document.getElementById('characterName').value = '';
        document.getElementById('characterDescription').value = '';
        document.getElementById('characterVoice').selectedIndex = 0;
    }

    resetSegmentForm() {
        document.getElementById('segmentId').value = '';
        document.getElementById('segmentText').value = '';
        document.getElementById('choicesContainer').innerHTML = '';
        this.addChoiceInput();
        this.updateCharacterSelect();
    }

    saveCharacter() {
        const name = document.getElementById('characterName').value.trim();
        const description = document.getElementById('characterDescription').value.trim();
        const voice = document.getElementById('characterVoice').value;
        
        if (!name) {
            alert('Please enter a character name');
            return;
        }
        
        if (!this.currentEditingStory.characters) {
            this.currentEditingStory.characters = [];
        }
        
        this.currentEditingStory.characters.push({
            name: name,
            description: description,
            voice: voice
        });
        
        this.updateCharacterList();
        this.hideModal('characterModal');
    }

    addChoiceInput() {
        const container = document.getElementById('choicesContainer');
        const choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice-input';
        choiceDiv.innerHTML = `
            <input type="text" class="form-control" placeholder="Choice text">
            <input type="text" class="form-control" placeholder="Next segment ID">
            <button type="button" class="btn btn--outline btn--sm remove-choice-btn">Remove</button>
        `;
        
        // Add remove functionality
        choiceDiv.querySelector('.remove-choice-btn').addEventListener('click', () => {
            choiceDiv.remove();
        });
        
        container.appendChild(choiceDiv);
    }

    saveSegment() {
        const id = document.getElementById('segmentId').value.trim();
        const character = document.getElementById('segmentCharacter').value;
        const text = document.getElementById('segmentText').value.trim();
        
        if (!id || !character || !text) {
            alert('Please fill in all required fields');
            return;
        }
        
        const choices = [];
        document.querySelectorAll('.choice-input').forEach(choiceDiv => {
            const inputs = choiceDiv.querySelectorAll('input');
            if (inputs[0].value.trim() && inputs[1].value.trim()) {
                choices.push({
                    text: inputs[0].value.trim(),
                    next: inputs[1].value.trim()
                });
            }
        });
        
        if (!this.currentEditingStory.segments) {
            this.currentEditingStory.segments = [];
        }
        
        this.currentEditingStory.segments.push({
            id: id,
            character: character,
            text: text,
            choices: choices
        });
        
        this.updateSegmentList();
        this.hideModal('segmentModal');
    }

    editCharacter(index) {
        // Implementation for editing characters
        console.log('Edit character:', index);
    }

    editSegment(index) {
        // Implementation for editing segments
        console.log('Edit segment:', index);
    }

    deleteCharacter(index) {
        if (confirm('Are you sure you want to delete this character?')) {
            this.currentEditingStory.characters.splice(index, 1);
            this.updateCharacterList();
        }
    }

    deleteSegment(index) {
        if (confirm('Are you sure you want to delete this segment?')) {
            this.currentEditingStory.segments.splice(index, 1);
            this.updateSegmentList();
        }
    }

    saveCurrentStory() {
        const title = document.getElementById('storyTitle').value.trim();
        const genre = document.getElementById('storyGenre').value;
        const description = document.getElementById('storyDescription').value.trim();
        
        if (!title || !description) {
            alert('Please enter a title and description for your story');
            return;
        }
        
        if (!this.currentEditingStory.characters || this.currentEditingStory.characters.length === 0) {
            alert('Please add at least one character');
            return;
        }
        
        if (!this.currentEditingStory.segments || this.currentEditingStory.segments.length === 0) {
            alert('Please add at least one story segment');
            return;
        }
        
        this.currentEditingStory.title = title;
        this.currentEditingStory.genre = genre;
        this.currentEditingStory.description = description;
        
        this.stories.push(this.currentEditingStory);
        this.saveStoriesToStorage();
        
        alert('Story saved successfully!');
        this.showPage('homePage');
    }

    async previewVoice() {
        const text = document.getElementById('previewText').value.trim();
        const voiceSelect = document.getElementById('characterVoice');
        const selectedVoice = voiceSelect.value;
        
        if (!text) {
            alert('Please enter text to preview');
            return;
        }
        
        try {
            this.showLoading();
            await this.generateAudio(text, selectedVoice);
            
            // Use speech synthesis for demo
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Error generating voice preview. Please check your API key and try again.');
        } finally {
            this.hideLoading();
        }
    }

    async generateAudio(text, voiceId) {
        // Simulate Murf API call - replace with actual API integration
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('demo-audio-url');
            }, 1000);
        });
    }

    showLoading() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    loadSampleStories() {
        if (this.stories.length === 0) {
            this.stories = [...this.sampleData.sampleStories];
            this.saveStoriesToStorage();
        }
    }

    populateStoryLibrary() {
        const grid = document.getElementById('storyGrid');
        grid.innerHTML = '';
        
        this.stories.forEach(story => {
            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="story-card-header">
                    <h3 class="story-title">${story.title}</h3>
                    <span class="story-genre">${story.genre}</span>
                </div>
                <p class="story-description">${story.description}</p>
                <div class="story-actions">
                    <button class="btn btn--primary btn--sm play-story-btn" data-story-id="${story.id}">Play Story</button>
                    <button class="btn btn--outline btn--sm edit-story-btn" data-story-id="${story.id}">Edit</button>
                    <button class="btn btn--outline btn--sm delete-story-btn" data-story-id="${story.id}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            card.querySelector('.play-story-btn').addEventListener('click', () => this.playStory(story.id));
            card.querySelector('.edit-story-btn').addEventListener('click', () => this.editStory(story.id));
            card.querySelector('.delete-story-btn').addEventListener('click', () => this.deleteStory(story.id));
            
            grid.appendChild(card);
        });
    }

    playStory(storyId) {
        this.currentStory = this.stories.find(s => s.id === storyId);
        if (!this.currentStory) return;
        
        this.currentSegment = 'start';
        this.storyPath = [];
        
        document.getElementById('currentStoryTitle').textContent = this.currentStory.title;
        this.showPage('playerPage');
        this.displayCurrentSegment();
    }

    displayCurrentSegment() {
        const segment = this.currentStory.segments.find(s => s.id === this.currentSegment);
        if (!segment) {
            alert('Story segment not found!');
            return;
        }
        
        // Update character info
        const characterInfo = document.getElementById('currentCharacter');
        const characterName = characterInfo.querySelector('.character-name');
        characterName.textContent = segment.character;
        
        // Update segment text
        document.getElementById('segmentText').textContent = segment.text;
        
        // Update choices
        const choicesContainer = document.getElementById('storyChoices');
        choicesContainer.innerHTML = '';
        
        if (segment.choices && segment.choices.length > 0) {
            segment.choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                button.addEventListener('click', () => this.makeChoice(choice.next));
                choicesContainer.appendChild(button);
            });
        } else {
            choicesContainer.innerHTML = '<p><em>The End</em></p>';
        }
        
        // Update story path
        this.updateStoryPath();
    }

    makeChoice(nextSegmentId) {
        this.storyPath.push({
            from: this.currentSegment,
            to: nextSegmentId,
            timestamp: new Date()
        });
        
        this.currentSegment = nextSegmentId;
        this.displayCurrentSegment();
    }

    updateStoryPath() {
        const pathContainer = document.getElementById('storyPath');
        pathContainer.innerHTML = '';
        
        this.storyPath.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'path-step';
            stepDiv.textContent = `${index + 1}. ${step.from} → ${step.to}`;
            pathContainer.appendChild(stepDiv);
        });
    }

    async playCurrentSegmentAudio() {
        if (!this.currentStory) return;
        
        const segment = this.currentStory.segments.find(s => s.id === this.currentSegment);
        const character = this.currentStory.characters.find(c => c.name === segment.character);
        
        if (!character) return;
        
        try {
            this.showLoading();
            
            // Use speech synthesis for demo
            const utterance = new SpeechSynthesisUtterance(segment.text);
            speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error playing audio:', error);
            alert('Error playing audio. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    restartStory() {
        if (confirm('Are you sure you want to restart the story?')) {
            this.currentSegment = 'start';
            this.storyPath = [];
            this.displayCurrentSegment();
        }
    }

    editStory(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;
        
        this.currentEditingStory = JSON.parse(JSON.stringify(story));
        
        document.getElementById('storyTitle').value = story.title;
        document.getElementById('storyGenre').value = story.genre;
        document.getElementById('storyDescription').value = story.description;
        
        this.showPage('createPage');
        this.populateCreateInterface();
    }

    deleteStory(storyId) {
        if (confirm('Are you sure you want to delete this story?')) {
            this.stories = this.stories.filter(s => s.id !== storyId);
            this.saveStoriesToStorage();
            this.populateStoryLibrary();
        }
    }

    filterStories() {
        const genre = document.getElementById('genreFilter').value;
        const search = document.getElementById('searchStories').value.toLowerCase();
        
        let filteredStories = this.stories;
        
        if (genre) {
            filteredStories = filteredStories.filter(s => s.genre === genre);
        }
        
        if (search) {
            filteredStories = filteredStories.filter(s => 
                s.title.toLowerCase().includes(search) || 
                s.description.toLowerCase().includes(search)
            );
        }
        
        this.displayFilteredStories(filteredStories);
    }

    displayFilteredStories(stories) {
        const grid = document.getElementById('storyGrid');
        grid.innerHTML = '';
        
        stories.forEach(story => {
            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="story-card-header">
                    <h3 class="story-title">${story.title}</h3>
                    <span class="story-genre">${story.genre}</span>
                </div>
                <p class="story-description">${story.description}</p>
                <div class="story-actions">
                    <button class="btn btn--primary btn--sm play-story-btn" data-story-id="${story.id}">Play Story</button>
                    <button class="btn btn--outline btn--sm edit-story-btn" data-story-id="${story.id}">Edit</button>
                    <button class="btn btn--outline btn--sm delete-story-btn" data-story-id="${story.id}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            card.querySelector('.play-story-btn').addEventListener('click', () => this.playStory(story.id));
            card.querySelector('.edit-story-btn').addEventListener('click', () => this.editStory(story.id));
            card.querySelector('.delete-story-btn').addEventListener('click', () => this.deleteStory(story.id));
            
            grid.appendChild(card);
        });
    }

    saveSettings() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (apiKey) {
            this.apiKey = apiKey;
            localStorage.setItem('voicequest_api_key', apiKey);
            alert('Settings saved successfully!');
        }
        this.hideModal('settingsModal');
    }

    loadApiKey() {
        const savedApiKey = localStorage.getItem('voicequest_api_key');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            document.getElementById('apiKeyInput').value = savedApiKey;
        } else {
            // Set default API key from environment
            this.apiKey = 'ap2_17a87e96-89a3-4a31-8367-9a50e8fe8ec4';
            document.getElementById('apiKeyInput').value = this.apiKey;
        }
    }

    generateId() {
        return 'story_' + Math.random().toString(36).substr(2, 9);
    }

    saveStoriesToStorage() {
        localStorage.setItem('voicequest_stories', JSON.stringify(this.stories));
    }

    loadStoriesFromStorage() {
        const saved = localStorage.getItem('voicequest_stories');
        return saved ? JSON.parse(saved) : [];
    }

    showLibraryPage() {
        this.showPage('libraryPage');
    }
}

// Initialize the application
const voiceQuest = new VoiceQuest();