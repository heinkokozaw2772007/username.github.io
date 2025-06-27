const express = require('express')
const app = express();
const QRCode = require('qrcode')
const generatePayload = require('promptpay-qr')
const bodyParser = require('body-parser')
const _= require('lodash')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: true }))

const server = app.listen(3000, () => {
    console.log('server is running...')
})

app.post('/generateQR', (req, res) => {
    const amount = parseFloat(_.get(req, ["body", "amount"]));
    const number = _.get(req, ["body", "number"]);
    if (!number || number.length === 0) {
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Invalid number'
        });
    }
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            RespCode: 400,
            RespMessage: 'Invalid amount'
        });
    }
    const payload = generatePayload( number , { amount });
    const option = {
        color:{
            dark:'#000',
            light: '#fff'
        }
    }
    QRCode.toDataURL(payload, option, (err, url) => {
        if(err) {
            console.log('genarate fail')
            return res.status(400).json({
                RespCode: 400,
                RespMessage: 'bad : ' +err
            })
        }
        else {
             return res.status(200).json({
                RespCode: 200,
                RespMessage: 'good',
               Result: url
            })
        }
    })
})

module.exports = app;