// LocalStorage Manager - FIXED: Consistent prefix 'creator_hub_'
const StorageManager = {
    save: (key, data) => {
        try {
            localStorage.setItem('creator_hub_' + key, JSON.stringify(data));
        } catch (e) {
            console.warn('LocalStorage full:', e);
        }
    },
    load: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem('creator_hub_' + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    getAll: () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('creator_hub_')) {
                data[key.replace('creator_hub_', '')] = JSON.parse(localStorage.getItem(key));
            }
        }
        return data;
    }
};

// Tab Navigation
document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', function () {
        switchTab(this.getAttribute('data-tab'));
    });
});

function switchTab(tabName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const section = document.getElementById(tabName + '-panel');
    const tab = document.querySelector(`[data-tab="${tabName}"]`);

    if (section) section.classList.add('active');
    if (tab) tab.classList.add('active');
}

// Niche Finder - Expanded Quiz Results
const nicheDatabase = {
    'gaming-chaotic-humor': {
        title: '🎮✨ Chaotic and Fun Gaming',
        description: 'Your niche is games with unbridled energy. People come for the action, they stay for the laughter.',
        strategies: ['Unexpected speedruns', 'Genuine reactions to chaos', 'Multiplayer game colabs', 'Compiled clips of silly moments']
    },
    'gaming-cozy-authenticity': {
        title: '🎮☕ Cozy & Authentic Gaming',
        description: 'You play calmly and honestly. Viewers are looking to relax while you watch yourself enjoying yourself.',
        strategies: ['Quiet game streams (Stardew Valley, etc.)', 'Deep conversations during gameplay', 'Community focused on connection', 'Long game series']
    },
    'commentary-analytical-expertise': {
        title: '🔍📊 Analytical Commentator',
        description: 'Your strength is to dismantle and understand. Informed content on VTubers and trends.',
        strategies: ['In-depth analysis videos', 'Creator comparisons', 'Investigative reports', 'Trend predictions']
    },
    'commentary-theatrical-authenticity': {
        title: '🎭💜 Theatrical Commentator',
        description: 'Critiques with dramatic personality. Your opinions are entertainment in themselves.',
        strategies: ['Professionally edited rants', 'Emotional reactions to VTuber news', 'Dramatizations of situations', 'VTuber "case" series']
    },
    'creative-artistic-authenticity': {
        title: '🎨✨ Authentic Creative Artist',
        description: 'Your work is your signature. Followers come for your unique style.',
        strategies: ['Drawing/animation time-lapses', 'Behind-the-scenes of creative process', 'Artistic collaborations', 'Art Challenges']
    },
    'educational-analytical-expertise': {
        title: '📚🧠 Analytical Educator',
        description: 'You teach with precision and clarity. Viewers learn and grow with you.',
        strategies: ['Step by step tutorials', 'Software guides', 'Explanations of complex concepts', 'Structured courses']
    },
    'lifestyle-cozy-community': {
        title: '🌿☕ Cozy Lifestyle',
        description: 'Your daily life is the content. People feel part of your life.',
        strategies: ['Daily Vlogs', 'Morning/evening routines', 'Edited personal diaries', 'Life recommendations']
    },
    'default': {
        title: '✨ Your Unique Niche',
        description: 'Your combination of content + energy is unique. Keep developing this mix.',
        strategies: ['Experiment with crossovers', 'Collaborate with similar creators', 'Ask your community for feedback']
    }
};

function calculateNiche() {
    const contentType = document.querySelector('input[name="content-type"]:checked')?.value;
    const vibe = document.querySelector('input[name="vibe"]:checked')?.value;
    const retention = document.querySelector('input[name="retention"]:checked')?.value;

    if (!contentType || !vibe || !retention) {
        alert('Please complete all questions');
        return;
    }

    const nicheKey = `${contentType}-${vibe}-${retention}`;
    const niche = nicheDatabase[nicheKey] || nicheDatabase['default'];

    StorageManager.save('niche_result', { nicheKey, ...niche, timestamp: new Date() });

    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('niche-title').textContent = niche.title;
    document.getElementById('niche-description').textContent = niche.description;

    const strategiesHtml = '<strong style="color: var(--accent-lavender); display: block; margin-bottom: 0.5rem;">Content that works for you:</strong>' +
        niche.strategies.map(s => `<div class="recommendation-item" style="border: none; background: transparent; padding: 0.5rem 0; padding-left: 1rem; position: relative;"><span style="position: absolute; left: 0; color: var(--accent-lavender);">→</span>${s}</div>`).join('');
    document.getElementById('niche-strategies').innerHTML = strategiesHtml;
}

function resetNiche() {
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
}

function downloadNicheResult() {
    const result = StorageManager.load('niche_result');
    if (!result) return alert('No result to download');

    const text = `NICHE FINDER RESULT\n\n${result.title}\n\n${result.description}\n\nRecommended Strategies:\n${result.strategies.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    downloadFile(text, 'niche-result.txt');
}

// Content Mix Calculator
function calculateMix() {
    const retention = parseInt(document.getElementById('retention-count').value) || 0;
    const growth = parseInt(document.getElementById('growth-count').value) || 0;
    const experimental = parseInt(document.getElementById('experimental-count').value) || 0;
    const total = retention + growth + experimental;

    if (total === 0) return;

    const retentionPct = Math.round((retention / total) * 100);
    const growthPct = Math.round((growth / total) * 100);
    const experimentalPct = Math.round((experimental / total) * 100);

    document.getElementById('retention-percent').value = retentionPct;
    document.getElementById('growth-percent').value = growthPct;
    document.getElementById('experimental-percent').value = experimentalPct;

    document.getElementById('retention-bar').style.width = retentionPct + '%';
    document.getElementById('retention-bar').textContent = retentionPct + '%';
    document.getElementById('growth-bar').style.width = growthPct + '%';
    document.getElementById('growth-bar').textContent = growthPct + '%';
    document.getElementById('experimental-bar').style.width = experimentalPct + '%';
    document.getElementById('experimental-bar').textContent = experimentalPct + '%';

    StorageManager.save('content_mix', { retention, growth, experimental, retentionPct, growthPct, experimentalPct });
}

// Task Breaker
function breakDownTask(granularity) {
    const task = document.getElementById('task-input').value;
    if (!task) {
        alert('Describe your task');
        return;
    }

    const steps = {
        'gentle': [
            '1. Open the video file',
            '2. Check the editing notes',
            '3. Make a quick first pass',
            '4. Edit audio',
            '5. Add transitions',
            '6. Final export'
        ],
        'medium': [
            '1. Import video',
            '2. Cut unnecessary clips',
            '3. Synchronize audio',
            '4. Add graphics/transitions',
            '5. Color/adjust levels',
            '6. Export and review',
            '7. Upload'
        ],
        'tiny': Array.from({ length: 14 }, (_, i) => `${i + 1}. Detailed subtask`)
    };

    const taskSteps = steps[granularity] || steps['medium'];
    document.getElementById('task-steps').innerHTML = taskSteps.map(step => `<div class="task-item">${step}</div>`).join('');
    document.getElementById('task-breakdown').style.display = 'block';

    StorageManager.save('task_breakdown', { task, granularity, steps: taskSteps });
}

function copyTasks() {
    const tasks = document.getElementById('task-steps').innerText;
    navigator.clipboard.writeText(tasks);
    alert('Copied');
}

function downloadTasks() {
    const task = document.getElementById('task-input').value;
    const steps = document.getElementById('task-steps').innerText;
    const text = `TASK: ${task}\n\n${steps}`;
    downloadFile(text, 'task-breakdown.txt');
}

// Tone Tools
function shiftTone(tone) {
    const input = document.getElementById('tone-input').value;
    if (!input) return alert('Write a message');

    const toneMap = {
        'formal': 'Formal version: ' + input.replace(/[!?]+/g, '.'),
        'casual': 'Hey! ' + input.toLowerCase(),
        'softer': 'Could it be that ' + input + '? I say this carefully.',
        'urgent': '!' + input.toUpperCase() + '!'
    };

    document.getElementById('tone-output').textContent = toneMap[tone];
}

function analyzeTone() {
    const input = document.getElementById('analyze-input').value;
    if (!input) return alert('Write a message');

    let analysis = '📊 Tone Analysis:\n';
    if (input.includes('!')) analysis += '✓ Energy: High\n';
    if (input.includes('?')) analysis += '✓ Questions: Conversational\n';
    if (input.toLowerCase().includes('sorry')) analysis += '⚠️ Tone: Apologetic\n';
    if (input.length < 20) analysis += '📌 Brevity: Very concise\n';

    document.getElementById('analyze-output').textContent = analysis;
}

// Video Analytics
function analyzeVideo() {
    const views = parseInt(document.getElementById('video-views').value) || 0;
    const likes = parseInt(document.getElementById('video-likes').value) || 0;
    const comments = parseInt(document.getElementById('video-comments').value) || 0;
    const shares = parseInt(document.getElementById('video-shares').value) || 0;
    const watchTime = parseFloat(document.getElementById('avg-watch-time').value) || 0;
    const duration = parseFloat(document.getElementById('video-duration').value) || 1;

    if (views === 0) return alert('Enter views');

    const engagement = ((likes + comments + shares) / views * 100).toFixed(2);
    const ctr = ((likes / views) * 100).toFixed(2);
    const retention = ((watchTime / duration) * 100).toFixed(2);
    const shareRatio = ((shares / views) * 100).toFixed(2);

    document.getElementById('engagement-rate').textContent = engagement + '%';
    document.getElementById('ctr').textContent = ctr + '%';
    document.getElementById('retention-rate').textContent = retention + '%';
    document.getElementById('share-ratio').textContent = shareRatio + '%';

    generateRecommendations(engagement, ctr, retention, shareRatio);
    updatePlatformStrategy();

    document.getElementById('analytics-results').style.display = 'block';

    StorageManager.save('video_analytics', {
        title: document.getElementById('video-title').value,
        platform: document.getElementById('video-platform').value,
        views, likes, comments, shares, watchTime, duration,
        engagement, ctr, retention, shareRatio,
        timestamp: new Date()
    });
}

function generateRecommendations(engagement, ctr, retention, shareRatio) {
    const recs = [];

    if (engagement < 2) recs.push({ title: '💬 Low Interaction', text: 'Try asking questions in the video to encourage comments' });
    if (ctr < 3) recs.push({ title: '🎯 Weak Thumbnail', text: 'Consider changing thumbnail/title for greater impact' });
    if (retention < 50) recs.push({ title: '⏱️ Low Retention', text: 'Add breakpoints, hooks or rhythm changes' });
    if (shareRatio < 0.5) recs.push({ title: '📤 Not Shareable', text: 'Create "memeable" or impactful moments' });

    const html = recs.length > 0
        ? recs.map(r => `<div class="recommendation-item"><div class="recommendation-title">${r.title}</div><p style="margin: 0; font-size: var(--font-size-sm);">${r.text}</p></div>`).join('')
        : '<div class="recommendation-item"><strong>✓ Excellent metrics</strong></div>';

    document.getElementById('general-recommendations').innerHTML = html;
}

function updatePlatformStrategy() {
    const platform = document.getElementById('video-platform').value;

    const strategies = {
        'youtube': {
            name: '▶️ YouTube',
            tips: [
                'Optimize tags and description with keywords',
                'Create custom thumbnails with high contrast',
                'Publish during prime time (20:00-23:00)',
                'Add CTA (call-to-action) for subscribers',
                'Use clips 15-60 sec for TikTok/Shorts',
                'Integrations with community (posts, polls)',
                'Ask them to subscribe in the first minute'
            ]
        },
        'twitch': {
            name: '🎮 Twitch',
            tips: [
                'Create clear categories for your channel',
                'Use social media to announce streams',
                'Active moderation for community health',
                'Raids on similar creators',
                'Information panel with links and networks',
                'Automatic clips for TikTok promotion',
                'Consistent streaming schedule'
            ]
        },
        'tiktok': {
            name: '📱 TikTok',
            tips: [
                'First 3 seconds are critical (hook)',
                'Use relevant trending sounds',
                'Post 3-5 videos daily',
                'Large, clear text on screen',
                'Calls to action: "follow me on..."',
                'Respond to comments within 24 hours',
                'Duration: 15-60 seconds ideal'
            ]
        },
        'twitter': {
            name: '𝕏 Twitter/X',
            tips: [
                'Publish during peak hours (12:00-18:00)',
                'Engage with memes and trends',
                'Tweet thread for deep analysis',
                'Cite trending topics when relevant',
                'Respond to verified creators',
                'Shortened URLs for clicks',
                'GIFs and videos for greater engagement'
            ]
        },
        'instagram': {
            name: '📸 Instagram',
            tips: [
                'Stories for behind-the-scenes content',
                'Carousels of 3-5 images',
                'Hashtags: 20-30 relevant',
                '15-90 second reels',
                'Geolocation for discovery',
                'Related content guide',
                'Collaborations with creators'
            ]
        },
        'discord': {
            name: '💬 Discord',
            tips: [
                'Channels organized by topic',
                'Member roles for community',
                'Weekly or monthly events',
                'Bots for engagement (polls, games)',
                'New video announcements',
                'Dedicated admins at key times',
                'Safe spaces without spam'
            ]
        }
    };

    const strategy = strategies[platform] || { name: 'Platform', tips: ['Strategy not configured'] };

    const html = `<div class="sns-platform">
                <div class="sns-platform-name">${strategy.name}</div>
                <ul class="sns-strategies">
                    ${strategy.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>`;

    document.getElementById('sns-recommendations').innerHTML = html;
}

function downloadAnalytics() {
    const data = StorageManager.load('video_analytics');
    if (!data) return alert('No data to download');

    const text = `VIDEO ANALYSIS\n${new Date().toLocaleDateString()}\n\n` +
        `Title: ${data.title}\n` +
        `Platform: ${data.platform}\n\n` +
        `Metrics:\n` +
        `- Views: ${data.views}\n` +
        `- Likes: ${data.likes}\n` +
        `- Comments: ${data.comments}\n` +
        `- Shared: ${data.shares}\n` +
        `- Engagement Rate: ${data.engagement}%\n` +
        `- CTR: ${data.ctr}%\n` +
        `- Retention: ${data.retention}%\n` +
        `- Share Ratio: ${data.shareRatio}%`;

    downloadFile(text, 'video-analytics.txt');
}

function saveAnalytics() {
    alert('Analysis saved in localStorage');
}


// -----------------------------
// Save Media Kit
// -----------------------------
function saveMediaKit() {
    const data = {
        channelName: document.getElementById('channel-name').value.trim(),
        description: document.getElementById('channel-description').value.trim(),
        subscribers: document.getElementById('channel-subscribers').value,
        avgViews: document.getElementById('avg-views').value,
        engagement: document.getElementById('engagement-rate-stat').value,
        platforms: document.getElementById('platforms').value.trim()
    };

    StorageManager.save('media_kit', data);
}


// -----------------------------
// Generate Media Kit Preview
// -----------------------------
function generateMediaKit() {
    saveMediaKit();

    const data = StorageManager.load('media_kit') || {};

    document.getElementById('mk-channel-name').textContent =
        data.channelName || 'My Channel';

    document.getElementById('mk-description').textContent =
        data.description || 'Content Creator';

    document.getElementById('mk-subscribers').textContent =
        (parseInt(data.subscribers) || 0).toLocaleString();

    document.getElementById('mk-views').textContent =
        (parseInt(data.avgViews) || 0).toLocaleString();

    const engagementValue = data.engagement ? data.engagement + '%' : '0%';
    document.getElementById('mk-engagement').textContent = engagementValue;

    document.getElementById('mk-platforms').textContent =
        data.platforms || 'N/A';

    document.getElementById('media-kit-container').style.display = 'block';
}


// -----------------------------
// Generate PDF
// -----------------------------
function generatePDF() {
    const element = document.querySelector('.media-kit-preview');

    html2canvas(element, {
        scale: 2,
        useCORS: true
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // A4 landscape size in points
        const pdfWidth = 841.89;   // landscape width
        const pdfHeight = 595.28;  // landscape height

        const contentWidth = canvas.width;
        const contentHeight = canvas.height;

        // Scale content to fit inside landscape A4
        const scale = Math.min(
            pdfWidth / contentWidth,
            pdfHeight / contentHeight
        );

        const scaledWidth = contentWidth * scale;
        const scaledHeight = contentHeight * scale;

        // Centering offsets
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4'
        });

        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
        pdf.save('media-kit.pdf');
    });
}





// -----------------------------
// Copy Media Kit Text
// -----------------------------
function copyMediaKitText() {
    const preview = document.querySelector('.media-kit-preview');
    const text = preview.innerText.trim();

    navigator.clipboard.writeText(text).then(() => {
        alert('Media Kit copied to clipboard');
    });
}



// Habit Tracker
function toggleHabit(element) {
    element.classList.toggle('completed');
    const status = element.querySelector('div:last-child');
    status.textContent = element.classList.contains('completed') ? '✅' : '❌';
}

function addHabit() {
    const habitName = document.getElementById('new-habit').value;
    if (!habitName) return alert('Write a name');

    const grid = document.getElementById('habit-grid');
    const card = document.createElement('div');
    card.className = 'habit-card';
    card.onclick = function () { toggleHabit(this); };
    card.innerHTML = `<div style="font-weight: bold;">${habitName}</div><div style="font-size: 1.5rem; margin-top: 0.5rem;">❌</div>`;
    grid.appendChild(card);
    document.getElementById('new-habit').value = '';
}

// Data Management
function exportAllData() {
    const data = StorageManager.getAll();
    downloadFile(JSON.stringify(data, null, 2), 'creator-hub-backup.json');
}

function importData() {
    document.getElementById('file-input').click();
}

document.getElementById('file-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const data = JSON.parse(event.target.result);
            Object.keys(data).forEach(key => {
                localStorage.setItem('creator_hub_' + key, JSON.stringify(data[key]));
            });
            alert('✅ Data imported correctly');
            location.reload();
        } catch (e) {
            alert('❌ Error importing file');
        }
    };
    reader.readAsText(file);
});

function clearAllData() {
    if (confirm('Are you sure? This will erase all your data.')) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key.startsWith('creator_hub_')) {
                localStorage.removeItem(key);
            }
        }
        alert('✅ All data has been deleted');
        location.reload();
    }
}

// Utility Functions
function downloadFile(content, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Accessibility
function toggleAccessibilityPanel() {
    document.querySelector('.accessibility-options').classList.toggle('active');
}

function toggleLargerText() {
    if (document.getElementById('larger-text').checked) {
        document.documentElement.style.setProperty('--font-size-base', '18px');
        document.documentElement.style.setProperty('--font-size-sm', '16px');
        document.documentElement.style.setProperty('--font-size-lg', '22px');
    } else {
        document.documentElement.style.setProperty('--font-size-base', '16px');
        document.documentElement.style.setProperty('--font-size-sm', '14px');
        document.documentElement.style.setProperty('--font-size-lg', '18px');
    }
}

// Initialize
calculateMix();

// Load saved data
window.addEventListener('load', () => {
    const mediaKit = StorageManager.load('media_kit');
    if (mediaKit) {
        document.getElementById('channel-name').value = mediaKit.channelName;
        document.getElementById('channel-description').value = mediaKit.description;
        document.getElementById('channel-subscribers').value = mediaKit.subscribers;
        document.getElementById('avg-views').value = mediaKit.avgViews;
        document.getElementById('engagement-rate').value = mediaKit.engagement;
        document.getElementById('platforms').value = mediaKit.platforms;
    }
});