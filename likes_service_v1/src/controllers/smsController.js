const accountSid = 'AC94bcf76dc2a77cf36054822412e55b46';
const authToken = '426f90bbceabbc9356a4a424d3aeda1d';
const client = require('twilio')(accountSid, authToken);


module.exports = {
    sendSMS : (recipientPhoneNumber) => {
        try {
            return new Promise((resolve, reject) => {
                client.messages.create({
                    body: 'You have achieved 100 likes on this content...Congrats for your century likes',
                    from: '+14847390993', // Replace with my Twilio phone number
                    to: `+91${recipientPhoneNumber}` // Replace with the recipient's phone number
                })
                .then((message) => resolve(message.sid))
                .catch((error) =>  console.log(error));
            })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
};