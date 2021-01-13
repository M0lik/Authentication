import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './app/models';
import dbConfig from "./app/config/db.config";

const Role = db.role;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

import authRoutes from './app/routes/auth.routes';
import userRoutes from './app/routes/user.routes';

authRoutes(app);
userRoutes(app);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}.`);
    const error = await db.mongoose
        .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    if (error) {
        console.log("Successfully connect to MongoDB.");

        //start initial only to create roles in db
        //initial();
    } else {
        console.error("Connection error", err);
        process.exit();
    };

});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}