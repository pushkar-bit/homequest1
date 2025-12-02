
const STORAGE_KEYS = {
    DELETED_PROPERTIES: 'admin_deleted_properties',
    EDITED_INSIGHTS: 'admin_edited_insights'
};

export const sessionStorage = {
    
    getDeletedProperties: () => {
        const stored = localStorage.getItem(STORAGE_KEYS.DELETED_PROPERTIES);
        return stored ? JSON.parse(stored) : [];
    },

    addDeletedProperty: (propertyId) => {
        const deleted = sessionStorage.getDeletedProperties();
        if (!deleted.includes(propertyId)) {
            deleted.push(propertyId);
            localStorage.setItem(STORAGE_KEYS.DELETED_PROPERTIES, JSON.stringify(deleted));
        }
    },

    removeDeletedProperty: (propertyId) => {
        const deleted = sessionStorage.getDeletedProperties();
        const filtered = deleted.filter(id => id !== propertyId);
        localStorage.setItem(STORAGE_KEYS.DELETED_PROPERTIES, JSON.stringify(filtered));
    },

    isPropertyDeleted: (propertyId) => {
        return sessionStorage.getDeletedProperties().includes(propertyId);
    },

    
    getEditedInsights: () => {
        const stored = localStorage.getItem(STORAGE_KEYS.EDITED_INSIGHTS);
        return stored ? JSON.parse(stored) : {};
    },

    saveEditedInsight: (insightId, data) => {
        const edited = sessionStorage.getEditedInsights();
        edited[insightId] = data;
        localStorage.setItem(STORAGE_KEYS.EDITED_INSIGHTS, JSON.stringify(edited));
    },

    getEditedInsight: (insightId) => {
        const edited = sessionStorage.getEditedInsights();
        return edited[insightId] || null;
    },

    removeEditedInsight: (insightId) => {
        const edited = sessionStorage.getEditedInsights();
        delete edited[insightId];
        localStorage.setItem(STORAGE_KEYS.EDITED_INSIGHTS, JSON.stringify(edited));
    },

    
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEYS.DELETED_PROPERTIES);
        localStorage.removeItem(STORAGE_KEYS.EDITED_INSIGHTS);
    }
};
