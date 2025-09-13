<template>
    <VInput 
        :model-value="props.value" 
        :disabled="isWaitingForDependency"
        :placeholder="placeholderText"
        @update:model-value="handleChange"
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

        // ใช้ ref และ watch เพื่อให้ reactive กับ array/object mutation
    // Remove displayedValue and displayedValueString, use props.value directly

        function calcDisplay(val) {
            if (!val || val === '') return 'waiting for check';
            if (Array.isArray(val)) {
                if (val.length === 0) return 'waiting for check';
                const hasFail = val.some(item => item.class === 'fail' || item.status === 'not_passed');
                const allPass = val.every(item => item.class === 'pass' || item.status === 'passed');
                if (hasFail) return 'broken';
                if (allPass) return 'passed';
                return 'waiting for check';
            }
            return val;
        }
		function handleChange(val) {
            emit('input', val);
        }

        watch(
            () => values.value?.[props.wait_for_field],
            (newVal) => {
                // คำนวณผลลัพธ์ทุกครั้งที่ค่าเปลี่ยน
                const result = calcDisplay(newVal);
                // emit เฉพาะเมื่อค่าที่คำนวณได้ต่างจาก props.value จริงๆ
                if (typeof result === 'string' && 
                    result.length <= 255 && 
                    result !== props.value &&
                    ['passed', 'broken', 'waiting for check'].includes(result)) {
                    emit('input', result);
                }
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