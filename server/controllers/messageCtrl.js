const bcrypt = require('bcryptjs');
const messages = [];

module.exports = {
    createMessage: (req, res) => {
        console.log(req.body);
        
        const { message, pin } = req.body;

        let tgtIndex = -1;

        messages.forEach((messageObj, index) => {
            let existing = bcrypt.compareSync(pin, messageObj.pinHash)

            if (existing) {
                tgtIndex = index;
            }
        });

        if (tgtIndex === -1) { // new message handling

            const salt = bcrypt.genSaltSync(10);
            const newHash = bcrypt.hashSync(pin, salt);

            const newMsgObj = {
                pinHash: newHash,
                messages: [ message ]
            }

            messages.push(newMsgObj);

            res.status(200).send(newMsgObj)
        } else { // existing message handling
            messages[tgtIndex].messages.push(message)
        
            res.status(200).send({ messages: messages[tgtIndex].messages }) // the front end is expecting an object to come back with a messages property. Also, we needed to update this to just send the messages associated with the correct pin object

        }

        console.log(messages)        
    }
}