const request = require('request');
const AES = require('aes256');

const key = '';
const imageToBase64 = require('image-to-base64');

const imageToBase = function(url) {
    return imageToBase64(url);
}

const Routes = (app) => {

    app.post('/rss/newList', function (req, res) {
        const postData = req.body;
        request({
            method: 'POST',
            uri: postData.source,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': ''
            },
            body: {
                "collection": "user",
                "database": "users",
                "dataSource": "Cluster0"
            },
            json: true
        }, function(error,response, body) {
            console.log(response.statusCode) // 200
            console.log(response.headers['content-type']) // 'image/png'
            const obj = body;
            console.log(obj);
            const plaintext = JSON.stringify(obj);
            const buffer = Buffer.from(plaintext);
            const encryptedPlainText = AES.encrypt(key, plaintext);
            imageToBase64(obj.document.personalDetails.picture).then(
                (response) => {
                    console.log(response); // "iVBORw0KGgoAAAANSwCAIA..."
                    res.send({data: encryptedPlainText, pic: response});
                }
            ).catch(
                (error) => {
                    console.log(error); // Logs an error if there was one
                }
            )
            
          });
    });

}

module.exports = Routes;
