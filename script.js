function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
        appendMessage('Anda', userMessage, 'user-message');

        switch (userMessage.toLowerCase()) {
            case 'menu':
                simulateTyping('CHATBOT', 'Teks: Kosong');
                userInput.value = '';
                break;
            case 'buka':
                simulateTyping('CHATBOT', 'Pintu berhasil dibuka.');
                userInput.value = '';
                break;
            case 'pesan':
                simulateTyping('CHATBOT', 'Ada pesan baru untuk Anda.');
                userInput.value = '';
                break;
            default:
                fetch(`https://langapi.cyclic.app/api/openai?text=${encodeURIComponent(userMessage)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Terjadi kesalahan saat mengambil data dari server.');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const botResponse = data.result || 'Maaf, saya tidak mengerti pesan Anda.';
                        simulateTyping('CHATBOT', botResponse);
                        userInput.value = '';
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        simulateTyping('CHATBOT', 'Maaf, terjadi kesalahan.');
                    });
                break;
        }
    }
}
