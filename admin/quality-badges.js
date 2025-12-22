// Quality Badges Management Functions

// Add render method to AdminDashboard class
AdminDashboard.prototype.renderQualityBadgesTable = function() {
    const container = document.getElementById('quality-badges-table');
    
    if (!this.data.qualityBadges || this.data.qualityBadges.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No quality badges found. <a href="javascript:void(0)" onclick="openQualityBadgeModal()" class="text-blue-600 hover:underline">Add your first quality badge</a></p>';
        return;
    }

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge Text</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${this.data.qualityBadges.map(badge => `
                        <tr>
                            <td class="px-6 py-4">
                                <div class="flex items-center">
                                    <i class="fas ${badge.icon} text-blue-500 text-2xl mr-3"></i>
                                    <div>
                                        <div class="font-medium text-gray-900">${badge.title_en}</div>
                                        <div class="text-sm text-gray-500">${badge.title_zh}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 max-w-xs">
                                <div class="text-sm text-gray-900 truncate">${badge.description_en}</div>
                                <div class="text-xs text-gray-500 truncate">${badge.description_zh}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-semibold">${badge.badge_text}</span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">${badge.position}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs rounded ${badge.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${badge.active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm font-medium space-x-2">
                                <button onclick="openQualityBadgeModal(${badge.id})" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteQualityBadge(${badge.id})" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
};

// Modal and CRUD functions
async function openQualityBadgeModal(badgeId = null) {
    const badge = badgeId ? admin.data.qualityBadges.find(b => b.id === badgeId) : null;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = badge ? 'Edit Quality Badge' : 'Add New Quality Badge';
    
    content.innerHTML = `
        <form id="quality-badge-form" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Icon (FontAwesome)</label>
                <input type="text" id="badge-icon" value="${badge?.icon || 'fa-shield-alt'}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="fa-shield-alt" required>
                <p class="text-xs text-gray-500 mt-1">FontAwesome icon class (e.g., fa-shield-alt, fa-award, fa-microscope)</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                    <input type="text" id="badge-title-en" value="${badge?.title_en || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title (Chinese)</label>
                    <input type="text" id="badge-title-zh" value="${badge?.title_zh || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea id="badge-desc-en" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>${badge?.description_en || ''}</textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Chinese)</label>
                <textarea id="badge-desc-zh" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>${badge?.description_zh || ''}</textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                    <input type="text" id="badge-text" value="${badge?.badge_text || ''}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Guaranteed, Verified, Compliant" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" id="badge-position" value="${badge?.position || 1}" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
            </div>
            
            <div>
                <label class="flex items-center">
                    <input type="checkbox" id="badge-active" ${!badge || badge.active ? 'checked' : ''} class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <span class="text-sm font-medium text-gray-700">Active (Show on website)</span>
                </label>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    ${badge ? 'Update' : 'Add'} Badge
                </button>
            </div>
        </form>
    `;
    
    document.getElementById('quality-badge-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            id: badgeId || null,
            icon: document.getElementById('badge-icon').value,
            title_en: document.getElementById('badge-title-en').value,
            title_zh: document.getElementById('badge-title-zh').value,
            description_en: document.getElementById('badge-desc-en').value,
            description_zh: document.getElementById('badge-desc-zh').value,
            badge_text: document.getElementById('badge-text').value,
            position: parseInt(document.getElementById('badge-position').value),
            active: document.getElementById('badge-active').checked ? 1 : 0
        };
        
        try {
            const response = await fetch(`${admin.apiBase}/quality-badges.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                admin.showNotification(result.message, 'success');
                closeModal();
                await admin.loadDashboardData();
                admin.renderQualityBadgesTable();
            } else {
                throw new Error(result.error || 'Failed to save quality badge');
            }
        } catch (error) {
            admin.showNotification('Error: ' + error.message, 'error');
        }
    });
    
    modal.classList.remove('hidden');
}

async function deleteQualityBadge(badgeId) {
    if (!confirm('Are you sure you want to delete this quality badge?')) {
        return;
    }
    
    try {
        const response = await fetch(`${admin.apiBase}/quality-badges.php?id=${badgeId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            admin.showNotification('Quality badge deleted successfully', 'success');
            await admin.loadDashboardData();
            admin.renderQualityBadgesTable();
        } else {
            throw new Error(result.error || 'Failed to delete quality badge');
        }
    } catch (error) {
        admin.showNotification('Error: ' + error.message, 'error');
    }
}
