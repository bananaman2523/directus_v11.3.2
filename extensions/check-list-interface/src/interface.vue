<template>
    <div class="checklist-container">
        <div v-if="!checklistData || checklistData.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>ไม่พบ Checklist Template</h3>
            <p>กรุณากำหนด Template Checklist ใน Options</p>
        </div>
        
        <div v-else class="checklist-content">
            <div v-for="(category, categoryIndex) in groupedChecklist" :key="categoryIndex" class="category-section">
                <div class="category-header">
                    <span class="category-title">{{ category.name }}</span>
                </div>
                
                <div class="category-items">
                    <div v-for="(item, itemIndex) in category.items" :key="itemIndex"
                         class="checklist-item"
                         :class="getChecklistItemClass(item)">
                        
                        <div class="item-content">
                            <div class="item-header">
                                <div class="status-indicator" :class="getStatusClass(item.status, item)"></div>
                                <h4 class="item-description">{{ item.description }}</h4>
                            </div>
                            
                            <div class="status-controls">
                                <div class="status-options">
                                    <v-radio
                                        v-for="statusOption in item.statusOptions"
                                        :key="statusOption.value"
                                        v-model="item.status"
                                        :value="statusOption.value"
                                        :disabled="item.disabled"
                                        @update:model-value="updateStatus(categoryIndex, itemIndex, statusOption.value)"
                                    >
                                        <template #label>
                                            <span class="status-label" :class="statusOption.class">{{ statusOption.icon }} {{ statusOption.display }}</span>
                                        </template>
                                    </v-radio>
                                </div>
                            </div>

                            <div v-if="showNote(item)">
                                <v-textarea
                                    v-model="item.note"
                                    placeholder="💬 หมายเหตุ (ถ้ามี)..."
                                    :rows="2"
                                    class="note-input"
                                    @update:model-value="updateNote(categoryIndex, itemIndex, $event)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
    props: {
        value: {
            type: [String, Array],
            default: null,
        },
        template_checklist: {
            type: [Array, String],
            default: null,
        }
    },
    emits: ['input'],
    setup(props, { emit }) {
        // Get checklist-item class from selected statusOption
        const getChecklistItemClass = (item) => {
            if (item.status === '' || item.status === null) return 'status-null';
            const selected = item.statusOptions.find(opt => opt.value === item.status);
            return selected && selected.class ? `status-${selected.class}` : '';
        };
        // Show note only if selected status's description is true
        const showNote = (item) => {
            const selected = item.statusOptions.find(opt => opt.value === item.status);
            return selected && selected.description === true;
        };
        const checklistData = ref([]);

        // Initialize checklist data
        const initializeChecklist = () => {
            if (props.template_checklist) {
                let template;
                if (typeof props.template_checklist === 'string') {
                    try {
                        template = JSON.parse(props.template_checklist);
                    } catch (e) {
                        console.error('Invalid JSON in template_checklist:', e);
                        return;
                    }
                } else if (Array.isArray(props.template_checklist)) {
                    template = props.template_checklist;
                } else {
                    template = [];
                }

                // If we have existing value, merge it
                if (props.value) {
                    let existingData = props.value;
                    if (typeof existingData === 'string') {
                        try {
                            existingData = JSON.parse(existingData);
                        } catch (e) {
                            existingData = [];
                        }
                    }
                    checklistData.value = template.map((templateItem, index) => {
                        const existingItem = existingData[index];
                        // Use statusOptions directly from templateItem
                        return {
                            ...templateItem,
                            statusOptions: templateItem.statusOptions,
                            status: existingItem?.status ?? templateItem.status ?? '',
                            note: existingItem?.note || templateItem.note || '',
                            disabled: templateItem.disabled ?? false
                        };
                    });
                } else {
                    checklistData.value = template.map(templateItem => ({
                        ...templateItem,
                        statusOptions: templateItem.statusOptions,
                        status: templateItem.status ?? '',
                        note: templateItem.note || '',
                        disabled: templateItem.disabled ?? false
                    }));
                }
            }
        };

        // Group checklist by category
        const groupedChecklist = computed(() => {
            const groups = {};
            
            checklistData.value.forEach((item, index) => {
                const category = item.category || 'อื่นๆ';
                if (!groups[category]) {
                    groups[category] = {
                        name: category,
                        items: []
                    };
                }
                groups[category].items.push({
                    ...item,
                    originalIndex: index
                });
            });

            return Object.values(groups);
        });

        const getStatusClass = (status, item) => {
            if (status === '' || status === null) return 'status-null';
            if (!item || !item.statusOptions) return '';
            const selected = item.statusOptions.find(opt => opt.value === status);
            return selected && selected.class ? `status-${selected.class}` : '';
        };

        const updateStatus = (categoryIndex, itemIndex, status) => {
            const item = groupedChecklist.value[categoryIndex].items[itemIndex];
            const originalIndex = item.originalIndex;
            checklistData.value[originalIndex].status = status;
            emitUpdate();
        };

        const updateNote = (categoryIndex, itemIndex, note) => {
            const item = groupedChecklist.value[categoryIndex].items[itemIndex];
            const originalIndex = item.originalIndex;
            
            checklistData.value[originalIndex].note = note;
            emitUpdate();
        };

        const emitUpdate = () => {
            // Output should match the input structure, including statusOptions and all fields
            const output = checklistData.value.map(item => ({
                category: item.category,
                description: item.description,
                statusOptions: item.statusOptions,
                status: item.status,
                note: item.note,
                disabled: item.disabled
            }));
            emit('input', JSON.stringify(output));
        };

        // Watch for template changes
        watch(() => props.template_checklist, initializeChecklist, { immediate: true });
        watch(() => props.value, initializeChecklist);

        initializeChecklist();

        return {
            checklistData,
            groupedChecklist,
            getStatusClass,
            getChecklistItemClass,
            updateStatus,
            updateNote,
            showNote
        };
    },
};
</script>

<style scoped>
.checklist-container {
    max-width: 100%;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: var(--theme--background);
    border-radius: 12px;
    border: 2px dashed var(--theme--border-color-subdued);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.empty-state h3 {
    color: var(--theme--foreground);
    margin-bottom: 8px;
    font-weight: 600;
}

.empty-state p {
    color: var(--theme--foreground-subdued);
}

.checklist-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.category-section {
    background: var(--theme--background);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--theme--border-color-subdued);
}

.category-header {
    display: flex;
    align-items: center;
    padding: 24px 32px;
    background: linear-gradient(135deg, var(--theme--primary) 0%, var(--theme--primary-75) 100%);
    color: white;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.category-icon {
    font-size: 28px;
    margin-right: 8px;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
}

.category-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
    flex: 1;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.08);
    color: var(--theme--foreground);
}

.category-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
}

.category-items {
    padding: 0;
}

.checklist-item {
    border-bottom: 1px solid var(--theme--border-color-subdued);
    transition: all 0.3s ease;
    position: relative;
}

.checklist-item:last-child {
    border-bottom: none;
}

.checklist-item.status-null {
    background: linear-gradient(90deg, rgba(156, 163, 175, 0.10) 0%, transparent 100%);
    border-left: 4px dashed #a3a3a3;
    box-shadow: 0 2px 8px rgba(156,163,175,0.08);
    position: relative;
}
/* Optional: Add a subtle icon for null status */
.checklist-item.status-null::before {
    position: absolute;
    left: 12px;
    top: 24px;
    font-size: 18px;
    color: #a3a3a3;
    opacity: 0.7;
}

.checklist-item.status-pass {
    background: linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%);
    border-left: 4px solid #22c55e;
}

.checklist-item.status-fail {
    background: linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%);
    border-left: 4px solid #ef4444;
}

.checklist-item.status-pending {
    background: linear-gradient(90deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%);
    border-left: 4px solid #f59e0b;
}

.item-content {
    padding: 24px;
}

.item-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
}

.status-indicator.status-pass {
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

.status-indicator.status-fail {
    background: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.status-indicator.status-pending {
    background: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.item-description {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    color: var(--theme--foreground);
    line-height: 1.5;
}

.status-controls {
    margin-bottom: 16px;
}

.status-options {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.status-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    padding: 6px 0;
}

.status-label.pending {
    color: #f59e0b;
}

.status-label.pass {
    color: #22c55e;
}

.status-label.fail {
    color: #ef4444;
}

.note-section {
    background: var(--theme--background-subdued);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--theme--border-color-subdued);
}

.note-input :deep(.v-textarea) {
    background: transparent;
    border: none;
}

.note-input :deep(.v-textarea input),
.note-input :deep(.v-textarea textarea) {
    font-size: 14px;
    line-height: 1.5;
}

:deep(.v-radio) {
    margin: 0;
}

:deep(.v-radio .v-radio__input) {
    margin-right: 8px;
}

@media (max-width: 768px) {
    .checklist-container {
        padding: 16px;
    }
    
    .category-header {
        padding: 16px;
    }
    
    .item-content {
        padding: 20px;
    }
    
    .status-options {
        flex-direction: column;
        gap: 12px;
    }
}
</style>