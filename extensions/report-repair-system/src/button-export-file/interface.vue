<template>
	<div>
		<VButton :loading="loading" @click="callApi" :disabled="!canExport">
			{{ hover_text }}
		</VButton>

		<div v-if="error" style="color: #b00020; margin-top: 8px;">Error: {{ error }}</div>
		<div v-if="successMessage" style="color: #00c851; margin-top: 8px;">{{ successMessage }}</div>
	</div>
</template>

<script>
import { ref, computed, inject } from 'vue';

export default {
	props: {
		value: {
			type: String,
			default: null,
		},
		hover_text: {
			type: String,
			default: 'Export to PDF',
		},
		collection: {
            type: String,
            default: '',
        },
		api_url: {
			type: String,
			default: '',
		},
		pdf_handling: {
			type: String,
			default: 'download',
		},
		save_field: {
			type: String,
			default: '',
		},
		collection: {
			type: String,
			default: null,
		},
		primaryKey: {
			type: [String, Number],
			default: null,
		}
	},
	emits: ['input', 'api-result', 'error'],
	setup(props, { emit }) {
		const loading = ref(false);
		const error = ref(null);
		const successMessage = ref(null);

		// Inject Directus values and stores
		const values = inject('values', {});
		const api = inject('api');
		const stores = inject('stores');

		const canExport = computed(() => {
			return props.api_url && (
				props.pdf_handling === 'download' || 
				(props.pdf_handling !== 'download' && props.save_field)
			);
		});

		async function callApi() {
			loading.value = true;
			error.value = null;
			successMessage.value = null;
			
			try {
				if (props.api_url) {
					await handlePdfResponse(props.api_url);		
				} 

			} catch (err) {
				error.value = err?.message ?? String(err);
				emit('error', error.value);
			} finally {
				loading.value = false;
			}
		}

		async function handlePdfResponse(blob, filename) {
			switch (props.pdf_handling) {
				case 'download':
					const response = await api.get(`/items/${props.collection}/${props.primaryKey}`);
					console.log('response', response.data.data);

					const pdfResponse = await fetch('https://internal-service-api.officedesign.co.th/generate-pdf/repairReport', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(response.data.data)
					});
					const pdfBlob = await pdfResponse.blob();
					const pdfUrl = URL.createObjectURL(pdfBlob);
					const link = document.createElement('a');
					link.href = pdfUrl;
					link.download = filename || 'report.pdf';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					URL.revokeObjectURL(pdfUrl);
					
					
					break;
			}
		}

		return { 
			callApi, 
			loading, 
			error, 
			successMessage,
			canExport 
		};
	},
};
</script>
