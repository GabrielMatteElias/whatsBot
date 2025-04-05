// ================ // importando libs \\=========== 
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require("qrcode"); // lib de geração de QR Code

const app = express()

// ================ // Configuração do CORS \\=========== 
app.use(cors())
app.use(bodyParser.json())
app.options('*', cors());

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client" }),
    qrMaxRetries: 1
});

client.initialize();

function iniciaWhats() {

    console.log('Acessou iniciaWhats')

    return new Promise((resolve) => {
        client.on("qr", (qr) => {
            resolve(qr)
            console.log("QR Code recebido.");
        });
    })
}

// ================ // Endpoint para conectar o whatsapp \\=========== 
app.get("/conecta-whats", cors(), async (req, res) => {
    try {
        const qrCodeText = await iniciaWhats()
        console.log(qrCodeText);
        // Gera o QR Code como imagem base64
        const qrCodeBase64 = await QRCode.toDataURL(qrCodeText);

        // Retorna HTML com a imagem embutida
        const html = `<img src="${qrCodeBase64}" alt="QR Code do WhatsApp" style="width: 400px; height: 400px;" />`;

        res.status(200).send(html);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao iniciar WhatsApp" });
    }
})

app.get("/verifica-status", cors(), async (req, res) => {
    try {

        let clientNum
        const clientState = await client.getState()
        console.log(clientState);
        
        if(client.info !== undefined) clientNum = client.info.wid.user
        
        res.status(200).json({ res: clientState === 'CONNECTED' ? true : false, numero: clientNum });

    } catch (err) {
        console.error("Erro ao verificar status do WhatsApp:", err);
        res.status(500).json({ error: "Erro ao verificar status do WhatsApp" });
    }
})

// ================ // Endpoint para realizar envio do boleto \\=========== 

// app.post("/envia-whats", upload.single('imagem'), async (req, res) => {
//     console.log("=============================================")
//     console.log("Endpoint envia whats acessado!!")
//     let telefonesRecebidos = req.body.telefones
//     let mensagemTexto = req.body.mensagem
//     console.log('---')
//     usuWhatsApp1.setInfo(telefonesRecebidos, mensagemTexto)
//     let respostaEnviaBoleto = await usuWhatsApp1.enviaBoletoConectado()
//     console.log('aqui', respostaEnviaBoleto)

//     res.json(respostaEnviaBoleto)
// })

app.listen(8000, function () {
    console.warn('WhatsBot está rodando...')
})