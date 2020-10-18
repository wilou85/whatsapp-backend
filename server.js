import express from "express";
import mongoose from 'mongoose';
import Messages from "./dbMessages.js";
import Pusher from 'pusher';

// app configuration + pour prendre en compte le format es6 - ajouter "type": "module" dans package.json et lancer la commande node --experimental-modules server.js - nom du fichier et pas NPM start
const app = express ()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: '1092575',
    key: '53c801d90ada0b8103b6',
    secret: 'abdafb40db9ec5a9b638',
    cluster: 'eu',
    encrypted: true
  });

// surveillance de la connexion avec la base de donnée et attention au nom de la collection dans MongoDB et le schéma dans le code et ci-dessous
const db = mongoose.connection;
db.once("open", () => {
    console.log("DB connected");
    const msgCollection = db.collection ("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on('change', (change) => {
        console.log("Ca change", change);
    })
});

// middleware
app.use(express.json());

// DB config
const connection_url = 'mongodb+srv://admin:6LVEd8ouP8HLOYex@cluster0.ob4kh.gcp.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// ???


// api routes
app.get('/', (req, res)=>res.status(200).send("hello world"))

app.post('/messages/new', (req,res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})


// listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));
