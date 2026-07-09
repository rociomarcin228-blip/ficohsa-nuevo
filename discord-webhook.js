const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1523103391411212472/CQp6Y3AhQeLEPJcJrdTOIJynWK5O2O7wczVfe_PJd-ycvbaZ2ezPIPsRPTMc_UCj9rDc';

async function enviarDatosAlDiscord(mensaje) {
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes('https://discord.com/api/webhooks/1523103391411212472/CQp6Y3AhQeLEPJcJrdTOIJynWK5O2O7wczVfe_PJd-ycvbaZ2ezPIPsRPTMc_UCj9rDc')) {
        console.error('No se configuró la URL del webhook de Discord.');
        return { success: false, message: 'No se configuró la URL del webhook de Discord.' };
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: mensaje })
        });

        if (!response.ok) {
            throw new Error('No se pudo enviar el mensaje al webhook de Discord.');
        }

        return { success: true, message: 'Datos enviados al webhook de Discord.' };
    } catch (error) {
        console.error('Error al enviar datos a Discord:', error);
        return { success: false, message: error.message };
    }
}

window.enviarDatosAlDiscord = enviarDatosAlDiscord;
