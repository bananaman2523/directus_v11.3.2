<template>
    <div class="signature-pad-interface">
        <div class="signature-display">
            <div v-if="signatureUrl" class="signature-preview-container">
                <img :src="signatureUrl" alt="Signature" class="signature-preview" />
            </div>
            <div v-else class="no-signature-container">
                <v-icon name="draw" class="no-signature-icon" />
                <span class="no-signature-text">No signature</span>
            </div>
        </div>
        
        <div class="signature-actions">
            <v-button @click="openSignaturePad" :loading="loading">
                <v-icon name="edit" left />
                {{ signatureUrl ? 'Edit Signature' : 'Add Signature' }}
            </v-button>
            <v-button v-if="signatureUrl" @click="clearSignature" kind="danger" outlined>
                <v-icon name="delete" left />
                Clear
            </v-button>
        </div>

        <!-- Signature Pad Popup with Bootstrap-style large modal -->
        <v-dialog v-model="showPopup" @esc="closePopup" persistent>
            <div class="modal-backdrop">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <v-icon name="draw" left />
                                Signature Pad
                            </h5>
                            <button type="button" class="btn-close" @click="closePopup">
                                <v-icon name="close" />
                            </button>
                        </div>
                        
                        <div class="modal-body">
                            <div class="signature-canvas-container" ref="containerRef">
                                <VueSignaturePad
                                    ref="signaturePad"
                                    :options="signaturePadOptions"
                                    @begin-stroke="onBeginStroke"
                                    @end-stroke="onEndStroke"
									height='400px'
									width='950px'
                                />
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button @click="clearCanvas" class="btn btn-outline-secondary me-auto" >
                                <v-icon name="refresh" left />
                                Clear Canvas
                            </button>
                            <button @click="closePopup" class="btn btn-secondary">
                                Cancel
                            </button>
                            <button @click="saveSignature" class="btn btn-primary" :disabled="saving">
                                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                                <v-icon v-else name="check" left />
                                {{ saving ? 'Saving...' : 'Save Signature' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { VueSignaturePad } from "vue-signature-pad";

const props = defineProps({
    value: {
        type: String,
        default: null,
    },
    folder: {
        type: String,
        default: null,
    },
    fileNaming: {
        type: String,
        default: 'timestamp',
    },
    customFileName: {
        type: String,
        default: 'signature',
    },
    format: {
        type: String,
        default: 'png',
    },
    quality: {
        type: Number,
        default: 0.9,
    },
});

const emit = defineEmits(['input']);

const api = useApi();
const { useNotificationsStore } = useStores();
const notificationsStore = useNotificationsStore();

const showPopup = ref(false);
const signaturePad = ref(null);
const containerRef = ref(null);
const signatureUrl = ref(null);
const loading = ref(false);
const saving = ref(false);
const isEmpty = ref(true);
const windowWidth = ref(window.innerWidth);
const containerWidth = ref(800);
const containerHeight = ref(400);

// Signature pad options
const signaturePadOptions = computed(() => ({
    backgroundColor: '#ffffff',
    penColor: '#000000',
    minWidth: 1,
    maxWidth: 3,
    throttle: 0,
    minDistance: 5,
}));

// Event handlers for signature pad
const onBeginStroke = () => {
    isEmpty.value = false;
    console.log('Stroke began, isEmpty set to false'); // Debug log
};

const onEndStroke = () => {
    // Use nextTick to ensure the stroke is fully processed
    nextTick(() => {
        if (signaturePad.value) {
            isEmpty.value = signaturePad.value.isEmpty();
            console.log('Stroke ended, isEmpty:', isEmpty.value); // Debug log
        }
    });
};

const clearCanvas = () => {
    if (signaturePad.value) {
        signaturePad.value.clearSignature();
        isEmpty.value = true;
        console.log('Canvas cleared'); // Debug log
    }
};

const openSignaturePad = async () => {
    showPopup.value = true;
    await nextTick();
    
    // Update container size and initialize signature pad
    setTimeout(() => {
        // updateContainerSize();
        isEmpty.value = true;
        
        // Force re-render of signature pad with new size
        nextTick(() => {
            if (signaturePad.value) {
                signaturePad.value.resizeCanvas();
            }
        });
    }, 150);
};

const closePopup = () => {
    showPopup.value = false;
};

const clearSignature = async () => {
    if (props.value) {
        try {
            await api.delete(`/files/${props.value}`);
        } catch (error) {
            console.warn('Could not delete old signature file:', error);
        }
    }
    
    emit('input', null);
    signatureUrl.value = null;
    
    notificationsStore.add({
        title: 'Signature cleared',
        type: 'success',
    });
};

const generateFileName = () => {
    const extension = props.format === 'jpeg' ? 'jpg' : props.format;
    
    switch (props.fileNaming) {
        case 'uuid':
            return `${crypto.randomUUID()}.${extension}`;
        case 'custom':
            return `${props.customFileName}.${extension}`;
        case 'timestamp':
        default:
            return `signature_${Date.now()}.${extension}`;
    }
};

const saveSignature = async () => {
    if (!signaturePad.value) {
        notificationsStore.add({
            title: 'Error',
            text: 'Signature pad not initialized.',
            type: 'error',
        });
        return;
    }
    
    // Check if signature pad is actually empty using the pad's method
    const isCurrentlyEmpty = signaturePad.value.isEmpty();
    
    if (isCurrentlyEmpty) {
        notificationsStore.add({
            title: 'Empty signature',
            text: 'Please provide a signature before saving.',
            type: 'warning',
        });
        return;
    }
    
    saving.value = true;
    
    try {
        // Get signature data
        const outputSignature = signaturePad.value.saveSignature();
		const dataURL = outputSignature.data;

        // Double check the original dataURL
        if (!dataURL || dataURL === 'data:,' || dataURL.length < 50) {
            throw new Error('Failed to generate signature image or signature is empty');
        }
        
        // Crop the image to remove empty space
        const croppedDataURL = await cropBase64Image(dataURL);

        // Validate the cropped image
        if (!croppedDataURL || croppedDataURL === 'data:,' || croppedDataURL.length < 50) {
            throw new Error('Failed to crop signature image or cropped image is empty');
        }
        
        // Delete old signature if it exists
        if (props.value) {
            try {
                await api.delete(`/files/${props.value}`);
            } catch (error) {
                console.warn('Could not delete old signature file:', error);
            }
        }

		const blob = base64ToBlob(croppedDataURL, "image/png");
        
        // Validate blob
        if (blob.size === 0) {
            throw new Error('Generated signature file is empty');
        }
        
        // Create form data
        const formData = new FormData();
        const fileName = generateFileName();
        formData.append('file', blob, fileName);
        formData.append('title', 'Signature');
        formData.append('description', 'Digital signature');
        
        if (props.folder) {
            formData.append('folder', props.folder);
        }
        
        // Upload file with proper error handling
        const uploadResponse = await api.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000,
        });
        
        if (!uploadResponse.data?.data?.id) {
            throw new Error('Upload response missing file ID');
        }
        
        const fileId = uploadResponse.data.data.id;
        emit('input', fileId);
        
        notificationsStore.add({
            title: 'Signature saved',
            text: `Your signature has been saved successfully as ${fileName}.`,
            type: 'success',
        });
        
        closePopup();
    } catch (error) {
        console.error('Error saving signature:', error);
        notificationsStore.add({
            title: 'Save failed',
            text: error.message || 'Failed to save signature. Please try again.',
            type: 'error',
        });
    } finally {
        saving.value = false;
    }
};

function base64ToBlob(base64, mimeType = '') {
  const BASE64_MARKER = ';base64,';
  let parts = base64.split(BASE64_MARKER);
  let rawBase64 = parts.length === 2 ? parts[1] : base64;
  let byteString = atob(rawBase64);
  let arrayBuffer = new ArrayBuffer(byteString.length);
  let uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
}

// Improved cropBase64Image function with better error handling
const cropBase64Image = (base64) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onerror = () => {
            reject(new Error('Failed to load image for cropping'));
        };
        
        img.onload = () => {
            try {
                const tempCanvas = document.createElement("canvas");
                const tempCtx = tempCanvas.getContext("2d");

                tempCanvas.width = img.width;
                tempCanvas.height = img.height;

                tempCtx.drawImage(img, 0, 0);
                const imgData = tempCtx.getImageData(0, 0, img.width, img.height);

                // หาขอบเขตของ pixel ที่มีข้อมูลจริง (ไม่โปร่งใส)
                let top = img.height, bottom = 0, left = img.width, right = 0;
                let hasContent = false;
                
                for (let y = 0; y < img.height; y++) {
                    for (let x = 0; x < img.width; x++) {
                        const i = (y * img.width + x) * 4;
                        if (imgData.data[i + 3] !== 0) { // ถ้ามี alpha ≠ 0
                            hasContent = true;
                            if (x < left) left = x;
                            if (x > right) right = x;
                            if (y < top) top = y;
                            if (y > bottom) bottom = y;
                        }
                    }
                }

                // ตรวจสอบว่ามีเนื้อหาในภาพหรือไม่
                if (!hasContent) {
                    reject(new Error('No signature content found in image'));
                    return;
                }

                const width = right - left + 1;
                const height = bottom - top + 1;

                // ตรวจสอบขนาดที่ได้
                if (width <= 0 || height <= 0) {
                    reject(new Error('Invalid crop dimensions'));
                    return;
                }

                // ตัดภาพใหม่
                const croppedCanvas = document.createElement("canvas");
                const croppedCtx = croppedCanvas.getContext("2d");
                croppedCanvas.width = width;
                croppedCanvas.height = height;

                croppedCtx.drawImage(tempCanvas, left, top, width, height, 0, 0, width, height);
                
                const croppedDataURL = croppedCanvas.toDataURL("image/png");
                
                // ตรวจสอบผลลัพธ์
                if (!croppedDataURL || croppedDataURL === 'data:,') {
                    reject(new Error('Failed to generate cropped image'));
                    return;
                }
                
                resolve(croppedDataURL);
            } catch (error) {
                reject(new Error(`Error during image cropping: ${error.message}`));
            }
        };

        img.src = base64;
    });
};
</script>

<style scoped>
.signature-pad-interface {
    --v-button-min-width: none;
}

.signature-display {
    margin-bottom: 16px;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.signature-preview-container {
    width: 100%;
    padding: 16px;
    border: 2px solid var(--theme--border-color);
    border-radius: var(--theme--border-radius);
    background-color: var(--theme--background);
}

.signature-preview {
    max-width: 100%;
    max-height: 150px;
    display: block;
    margin: 0 auto;
    border-radius: var(--theme--border-radius);
}

.no-signature-container {
    width: 100%;
    padding: 32px;
    border: 2px dashed var(--theme--border-color-subdued);
    border-radius: var(--theme--border-radius);
    background-color: var(--theme--background-subdued);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.no-signature-icon {
    --v-icon-color: var(--theme--foreground-subdued);
    font-size: 32px;
}

.no-signature-text {
    color: var(--theme--foreground-subdued);
    font-style: italic;
}

.signature-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
}

/* Bootstrap-style Modal */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 1.75rem auto;
    pointer-events: auto;
}

.modal-xl {
    max-width: 95vw;
    width: 1200px;
}

.modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: var(--theme--background);
    border: 1px solid var(--theme--border-color);
    border-radius: var(--theme--border-radius);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--theme--border-color);
}

.modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-close {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: var(--theme--border-radius);
}

.btn-close:hover {
    background-color: var(--theme--background-subdued);
}

.modal-body {
    position: relative;
    flex: 1 1 auto;
    padding: 1.5rem;
    max-height: 75vh;
    overflow-y: auto;
}

.modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--theme--border-color);
}

/* Bootstrap-style Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: var(--theme--border-radius);
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.15s ease-in-out;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    color: #fff;
    background-color: var(--theme--primary);
    border-color: var(--theme--primary);
}

.btn-primary:hover:not(:disabled) {
    background-color: var(--theme--primary-75);
    border-color: var(--theme--primary-75);
}

.btn-secondary {
    color: var(--theme--foreground);
    background-color: var(--theme--background-normal);
    border-color: var(--theme--border-color);
}

.btn-secondary:hover:not(:disabled) {
    background-color: var(--theme--background-subdued);
}

.btn-outline-secondary {
    color: var(--theme--foreground-subdued);
    background-color: transparent;
    border-color: var(--theme--border-color);
}

.btn-outline-secondary:hover:not(:disabled) {
    background-color: var(--theme--background-subdued);
}

.me-auto {
    margin-right: auto;
}

.me-2 {
    margin-right: 0.5rem;
}

.mt-3 {
    margin-top: 1rem;
}

.text-muted {
    color: var(--theme--foreground-subdued);
}

/* Spinner */
.spinner-border {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 0.125rem solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
    width: 0.875rem;
    height: 0.875rem;
    border-width: 0.125rem;
}

@keyframes spinner-border {
    to {
        transform: rotate(360deg);
    }
}

.signature-canvas-container {
    padding: 1rem;
    border: 1px solid var(--theme--border-color);
    border-radius: var(--theme--border-radius);
    background-color: var(--theme--background);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    overflow: hidden;
}

.signature-pad {
    border: 2px solid var(--theme--border-color-subdued);
    border-radius: var(--theme--border-radius);
    background-color: white;
    cursor: crosshair;
    max-width: 100%;
    max-height: 100%;
}

.signature-pad:hover {
    border-color: var(--theme--primary);
}

.canvas-info {
    text-align: center;
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .modal-xl {
        max-width: 98vw;
    }
    
    .modal-dialog {
        margin: 0.5rem auto;
    }
    
    .modal-body {
        max-height: 65vh;
        padding: 1rem;
    }
    
    .signature-canvas-container {
        padding: 0.5rem;
        min-height: 250px;
    }
}

@media (max-width: 576px) {
    .modal-backdrop {
        padding: 0.25rem;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 0.75rem;
    }
    
    .modal-body {
        max-height: 60vh;
    }
    
    .modal-footer {
        flex-direction: column-reverse;
        gap: 0.75rem;
    }
    
    .btn {
        width: 100%;
        justify-content: center;
    }
    
    .me-auto {
        margin-right: 0;
        order: 1;
    }
    
    .signature-canvas-container {
        min-height: 200px;
        padding: 0.25rem;
    }
}
</style>