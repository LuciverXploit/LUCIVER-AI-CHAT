const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
        appendMessage('Anda', userMessage, 'user-message');

        let botResponse = '';

        

        switch (userMessage.toLowerCase()) {
            case 'menu':
                botResponse = 'Teks: Kosong';
                break;
            case 'buka':
                botResponse = 'Pintu berhasil dibuka.';
                break;
            case 'pesan':
                botResponse = 'Ada pesan baru untuk Anda.';
                break;
            default:
                fetch(`https://langapi.cyclic.app/api/openai?text=${encodeURIComponent(userMessage)}`)
                    .then(response => response.json())
                    .then(data => {
                        botResponse = data.result || 'Maaf, saya tidak mengerti pesan Anda.';
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        botResponse = 'Maaf, terjadi kesalahan.';
                    })
                    .finally(() => {
                        simulateTyping('LuciverXploit', botResponse);
                        userInput.value = '';
                    });
                return;
        }

        simulateTyping('CHATBOT', botResponse);
        userInput.value = '';
    }
}

function simulateTyping(sender, message) {
    const messageType = sender === 'USER' ? 'user-message' : 'chatbot-message';
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType}`;
    chatBox.appendChild(messageElement);

    let i = 0;
    const typingInterval = setInterval(() => {
        const partialMessage = message.substring(0, i);
        const contentToDisplay = isHTML(partialMessage) ? formatCode(partialMessage) : partialMessage;
        messageElement.innerHTML = `${sender}: ${contentToDisplay}|`;
        i++;

        if (i > message.length) {
            clearInterval(typingInterval);
            const finalContent = isHTML(message) ? formatCode(message) : message;
            messageElement.innerHTML = `${sender}: ${finalContent}`;
            appendCopyCodeLink(messageElement, finalContent);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, 50);

    messageElement.onclick = () => showCopyCodeButton(messageElement);
}

function appendCopyCodeLink(element, code) {
    const copyCodeLink = document.createElement('span');
    copyCodeLink.className = 'copy-code';
    copyCodeLink.textContent = 'Copy Code';
    copyCodeLink.onclick = () => copyCodeToClipboard(code);

    const copyCodeContainer = document.createElement('div');
    copyCodeContainer.className = 'copy-code-container';
    copyCodeContainer.appendChild(copyCodeLink);

    element.appendChild(copyCodeContainer);
}

function copyCodeToClipboard(code) {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function isHTML(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

function formatCode(code) {
    return `<pre>${escapeHtml(code)}</pre>`;
}

function escapeHtml(html) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

function appendMessage(sender, message, messageType) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType}`;
    messageElement.innerText = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showCopyCodeButton(messageElement) {
    const copyCodeContainer = messageElement.querySelector('.copy-code-container');
    if (copyCodeContainer) {
        copyCodeContainer.style.display = 'flex';


        setTimeout(() => {
            copyCodeContainer.style.display = 'none';
        }, 10000);
    }
}
