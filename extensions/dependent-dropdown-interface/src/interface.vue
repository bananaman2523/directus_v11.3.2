<template>
    <VSelect
        :model-value="value"
        :items="items"
        :disabled="isWaitingForDependency"
        :placeholder="placeholderText"
        @update:model-value="handleChange"
    />
</template>

<script>
import { ref, onMounted, inject, watch, computed } from 'vue';

export default {
    props: {
        value: {
            type: String,
            default: null,
        },
        filter: {
            type: Object,
            default: () => ({}),
        },
        collection_parent: {
            type: String,
            default: '',
        },
        display_value_field: {
            type: String,
            default: '',
        },
        display_field: {
            type: String,
            default: '',
        },
        wait_for_field: {
            type: String,
            default: '',
        },
        wait_message: {
            type: String,
            default: 'Please select dependent field first',
        },
    },
    emits: ['input'],
    setup(props, { emit }) {
        const items = ref([]);
        const api = inject('api');
        const values = inject('values');

        // คำนวณว่าต้องรอ field dependency หรือไม่
        const isWaitingForDependency = computed(() => {
            if (!props.wait_for_field) return false;
            const dependentValue = values.value?.[props.wait_for_field];
            return !dependentValue || dependentValue === '';
        });

        const placeholderText = computed(() => {
            if (isWaitingForDependency.value) {
                return props.wait_message;
            }
            return 'Select an option';
        });

        async function fetchItems() {
            if (!props.collection_parent) return;
            
            // ถ้ามี wait_for_field แต่ field นั้นยังไม่มีค่า ให้หยุดการทำงาน
            if (isWaitingForDependency.value) {
                items.value = [];
                return;
            }

            try {
                // Process filter to replace dynamic field references
                const processedFilter = processFilter(props.filter, values.value);
                
                // ตรวจสอบว่า filter มี placeholder ที่ยังไม่ได้แทนที่หรือไม่
                if (hasEmptyPlaceholders(processedFilter)) {
                    items.value = [];
                    return;
                }

                const response = await api.get(`/items/${props.collection_parent}`, {
                    params: {
                        filter: processedFilter
                    }
                });

                const newItems = response.data.data.map(group => ({
                    text: group[props.display_field],
                    value: group[props.display_value_field]
                }));
                
                items.value = newItems;
                
                // ตรวจสอบว่าค่าปัจจุบันยังอยู่ใน items ใหม่หรือไม่
                if (props.value) {
                    const currentValueExists = newItems.some(item => item.value === props.value);
                    if (!currentValueExists) {
                        // ถ้าค่าปัจจุบันไม่อยู่ใน items ใหม่ ให้ clear
                        emit('input', null);
                    }
                }

            } catch (error) {
                console.error('Error fetching items:', error);
                items.value = [];
            }
        }

        function processFilter(filter, formValues) {
            if (!filter || !formValues) return filter;

            const filterString = JSON.stringify(filter);
            const processedString = filterString.replace(/\{\{\$(\w+)\}\}/g, (match, fieldName) => {
                const value = formValues[fieldName];
                return value !== undefined && value !== null ? value : '';
            });

            return JSON.parse(processedString);
        }

        function hasEmptyPlaceholders(filter) {
            const filterString = JSON.stringify(filter);
            return filterString.includes('""') || filterString.includes('null');
        }

        function handleChange(val) {
            emit('input', val);
        }

        // Watch for changes in form values
        watch(() => values.value, (newValues, oldValues) => {
            if (!newValues) return;

            // ตรวจสอบว่า dependent field มีการเปลี่ยนแปลงหรือไม่
            if (props.wait_for_field) {
                const newDependentValue = newValues[props.wait_for_field];
                const oldDependentValue = oldValues?.[props.wait_for_field];
                
                if (newDependentValue !== oldDependentValue) {
                    if (newDependentValue && newDependentValue !== '') {
                        // ไม่ clear value ทันที ให้ fetch ก่อนแล้วค่อยตรวจสอบ
                        fetchItems();
                    } else {
                        items.value = [];
                        emit('input', null);
                    }
                    return;
                }
            }

            // ตรวจสอบการเปลี่ยนแปลงของ field อื่นๆ ที่อยู่ใน filter
            const filterString = JSON.stringify(props.filter);
            const fieldNames = filterString.match(/\{\{\$(\w+)\}\}/g);
            
            if (fieldNames) {
                const hasChanges = fieldNames.some(placeholder => {
                    const fieldName = placeholder.replace(/\{\{\$|\}\}/g, '');
                    return newValues[fieldName] !== oldValues?.[fieldName];
                });
                
                if (hasChanges) {
                    fetchItems();
                }
            }
        }, { deep: true });

        onMounted(() => {
            if (!isWaitingForDependency.value) {
                fetchItems();
            }
        });

        return { 
            items, 
            handleChange, 
            isWaitingForDependency,
            placeholderText
        };
    },
};
</script>