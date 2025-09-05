<template>
    <VInput 
        :model-value="value" 
        :disabled="isWaitingForDependency"
        :placeholder="placeholderText"
        @update:model-value="handleChange"
        readonly
    />
</template>

<script>
import { onMounted, inject, watch, computed } from 'vue';

export default {
    props: {
        value: {
            type: String,
            default: null,
        },
        collection_parent: {
            type: String,
            default: '',
        },
        filter: {
            type: Object,
            default: () => ({}),
        },
        display_field: {
            type: String,
            default: '',
        },
        wait_for_field: {
            type: String,
            default: '',
        },
    },
    emits: ['input'],
    setup(props, { emit }) {
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
                return 'Waiting for field input...';
            }
            return 'Auto-filled value';
        });

        async function fetchAndAutoFill() {
            if (!props.collection_parent || !props.display_field) return;
            
            // ถ้ามี wait_for_field แต่ field นั้นยังไม่มีค่า ให้หยุดการทำงาน
            if (isWaitingForDependency.value) {
                // ถ้าค่าปัจจุบันไม่ใช่ empty string ค่อย emit
                if (props.value !== '') {
                    emit('input', '');
                }
                return;
            }

            try {
                // Process filter to replace dynamic field references
                const processedFilter = processFilter(props.filter, values.value);
                
                // ตรวจสอบว่า filter มี placeholder ที่ยังไม่ได้แทนที่หรือไม่
                if (hasEmptyPlaceholders(processedFilter)) {
                    // ถ้าค่าปัจจุบันไม่ใช่ empty string ค่อย emit
                    if (props.value !== '') {
                        emit('input', '');
                    }
                    return;
                }
                
                // สร้าง fields parameter เพื่อ expand relations
                const fields = getFieldsWithRelations(props.display_field);
                
                const response = await api.get(`/items/${props.collection_parent}`, {
                    params: {
                        filter: processedFilter,
                        limit: 1,
                        fields: fields // เอา relation fields มาด้วย
                    }
                });

                const items = response.data.data;
                
                if (items && items.length > 0) {
                    const autoValue = getNestedValue(items[0], props.display_field) || '';
                    
                    // ตรวจสอบว่าค่าใหม่ต่างจากค่าเก่าหรือไม่
                    if (autoValue !== props.value) {
                        emit('input', autoValue);
                    }
                } else {
                    // ถ้าหาข้อมูลไม่เจอและค่าปัจจุบันไม่ใช่ empty string
                    if (props.value !== '') {
                        emit('input', '');
                    }
                }

            } catch (error) {
                console.error('Error fetching auto-fill data:', error);
                // ถ้าเกิด error และค่าปัจจุบันไม่ใช่ empty string
                if (props.value !== '') {
                    emit('input', '');
                }
            }
        }

        // สร้าง fields parameter สำหรับ expand relations
        function getFieldsWithRelations(displayField) {
            if (displayField.includes('.')) {
                // ถ้ามี dot notation (เช่น brand.name) ให้ expand relation
                const parts = displayField.split('.');
                const relationField = parts[0];
                const subField = parts.slice(1).join('.');
                return `*,${relationField}.${subField}`;
            }
            return '*'; // ถ้าไม่มี relation ให้เอาทุก field
        }

        // ดึงค่าจาก nested object (เช่น brand.name)
        function getNestedValue(obj, path) {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : null;
            }, obj);
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
                        fetchAndAutoFill();
                    } else {
                        // ถ้าค่าปัจจุบันไม่ใช่ empty string ค่อย emit
                        if (props.value !== '') {
                            emit('input', '');
                        }
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
                    fetchAndAutoFill();
                }
            }
        }, { deep: true });

        onMounted(() => {
            // เฉพาะเมื่อไม่รอ dependency และยังไม่มีค่า ค่อยไป fetch
            if (!isWaitingForDependency.value && !props.value) {
                fetchAndAutoFill();
            }
        });

        return { 
            handleChange, 
            isWaitingForDependency,
            placeholderText
        };
    },
};
</script>