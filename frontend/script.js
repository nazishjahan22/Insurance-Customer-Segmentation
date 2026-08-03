/**
 * Insurance Customer Segmentation Frontend Logic
 * Modern Vanilla JavaScript Integration with FastAPI ML Backend
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const API_URL = 'https://insurance-customer-segmentation.onrender.com/predict'

    // Sample Dataset for quick auto-fill functionality
    const sampleData = {
        "Age": 35,
        "Income_Level": 85000,
        "Coverage_Amount": 500000,
        "Premium_Amount": 15000,
        "Gender": "Male",
        "Marital_Status": "Married",
        "Education_Level": "Master's Degree",
        "Geographic_Information": "Punjab",
        "Occupation": "Engineer",
        "Behavioral_Data": "policy2",
        "Interactions_with_Customer_Service": "Email",
        "Insurance_Products_Owned": "policy2",
        "Policy_Type": "Individual",
        "Customer_Preferences": "Phone",
        "Preferred_Communication_Channel": "Phone",
        "Preferred_Contact_Time": "Morning",
        "Preferred_Language": "Spanish"
    };

    // Element References
    const form = document.getElementById('segmentationForm');
    const fillSampleBtn = document.getElementById('fillSampleBtn');
    const predictBtn = document.getElementById('predictBtn');
    const btnText = predictBtn.querySelector('.btn-text');
    const spinner = predictBtn.querySelector('.spinner');

    const resultCard = document.getElementById('resultCard');
    const segmentBadge = document.getElementById('segmentBadge');
    const segmentValue = document.getElementById('segmentValue');
    const clusterValue = document.getElementById('clusterValue');

    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');

    /**
     * Auto-fills the form with sample data
     */
    fillSampleBtn.addEventListener('click', () => {
        Object.keys(sampleData).forEach(key => {
            const field = form.elements[key];
            if (field) {
                field.value = sampleData[key];
                // Clear any lingering error styling on filled fields
                const group = field.closest('.input-group');
                if (group) group.classList.remove('invalid');
            }
        });
        
        // Hide existing cards on new fill
        hideCards();
    });

    /**
     * Form Submit Handler with Validation & Fetch Integration
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        hideCards();

        // Validate form inputs
        if (!validateForm()) {
            return;
        }

        // Collect Form Payload
        const formData = new FormData(form);
        const payload = {};

        formData.forEach((value, key) => {
            // Convert numeric fields to number type
            if (["Age", "Income_Level", "Coverage_Amount", "Premium_Amount"].includes(key)) {
                payload[key] = Number(value);
            } else {
                payload[key] = value;
            }
        });

        // Trigger API Request
        await sendPredictionRequest(payload);
    });

    /**
     * Validates form inputs and updates UI accordingly
     * @returns {boolean} isValid
     */
    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select');

        inputs.forEach(input => {
            const group = input.closest('.input-group');
            let fieldValid = true;

            if (!input.value.trim()) {
                fieldValid = false;
            } else if (input.type === 'number') {
                const val = Number(input.value);
                const min = input.hasAttribute('min') ? Number(input.getAttribute('min')) : -Infinity;
                const max = input.hasAttribute('max') ? Number(input.getAttribute('max')) : Infinity;
                if (isNaN(val) || val < min || val > max) {
                    fieldValid = false;
                }
            }

            if (!fieldValid) {
                group.classList.add('invalid');
                isValid = false;
            } else {
                group.classList.remove('invalid');
            }
        });

        return isValid;
    }

    /**
     * Sends POST request to FastAPI Backend
     * @param {Object} payload 
     */
    async function sendPredictionRequest(payload) {
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            displayResult(data);

        } catch (error) {
            console.error('API Error:', error);
            showError('Unable to connect to backend server. Make sure FastAPI is running on http://127.0.0.1:8000');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Displays result card with prediction details
     * @param {Object} result 
     */
    function displayResult(result) {
        segmentBadge.textContent = result.customer_segment || "Segment Identified";
        segmentValue.textContent = result.customer_segment || "N/A";
        clusterValue.textContent = result.cluster !== undefined ? result.cluster : "N/A";

        resultCard.classList.remove('hidden');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Shows error notification card
     * @param {string} message 
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorCard.classList.remove('hidden');
        errorCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Resets visual card visibility
     */
    function hideCards() {
        resultCard.classList.add('hidden');
        errorCard.classList.add('hidden');
    }

    /**
     * Controls loading state and UI feedback
     * @param {boolean} isLoading 
     */
    function setLoading(isLoading) {
        if (isLoading) {
            btnText.textContent = 'Processing...';
            spinner.classList.remove('hidden');
            predictBtn.disabled = true;
        } else {
            btnText.textContent = 'Predict Customer Segment';
            spinner.classList.add('hidden');
            predictBtn.disabled = false;
        }
    }
});