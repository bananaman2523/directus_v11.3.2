<template>
    <VInput 
        :model-value="props.value" 
        :disabled="isWaitingForDependency"
        :placeholder="placeholderText"
        @update:model-value="handleChange"
        readonly
    />
</template>

<script>
import { inject, watch, computed } from 'vue';

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

        function calcDisplay(val) {
            let jsonData = null;
            let input = val;
            if (typeof input === 'object') {
                try {
                    input = JSON.stringify(input);
                } catch (e) {
                    input = '';
                }
            }
            try {
                jsonData = JSON.parse(input);
            } catch (e) {
                jsonData = null;
            }

            if (jsonData && typeof jsonData === 'object' && Array.isArray(jsonData)) {
                const allPassed = jsonData.every(item => item.status === 'passed');
                const anyNotPassed = jsonData.some(item => item.status === 'not_passed');
                if (allPassed) return 'passed';
                if (anyNotPassed) return 'not_passed';
                return 'pending';
            }

            return input;
        }
            function handleChange(val) {
                const result = calcDisplay(val);
                emit('input', result);
            }

        watch(
            () => values.value?.[props.wait_for_field],
            (newVal) => {
                // คำนวณผลลัพธ์ทุกครั้งที่ค่าเปลี่ยน
                const result = calcDisplay(newVal);
                emit('input', result);
            },
            { immediate: false, deep: true }
        );

        return {
            handleChange,
            isWaitingForDependency,
            placeholderText,
            props
        };
    },
};
</script>