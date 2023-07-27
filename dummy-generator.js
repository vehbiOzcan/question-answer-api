import Question from "./models/Question.js";
import Answer from "./models/Answer.js";
import User from "./models/User.js";
import fs from 'fs'
import { connectDatabase } from "./helpers/database/connectDatabase.js";
import dotenv from 'dotenv'

const path = "./dummy/";

const users = JSON.parse(fs.readFileSync(path + "users.json" ));
const questions = JSON.parse(fs.readFileSync(path + "questions.json" ));
const answers = JSON.parse(fs.readFileSync(path + "answers.json" ));



dotenv.config({
    path : "./config/env/config.env"
});

connectDatabase();

const importAllData = async function(){
    try {
        await User.create(users);
        await Question.create(questions);
        await Answer.create(answers);
        console.log("Import Process Successful");

    }   
    catch(err) {
        console.log(err);
        console.err("There is a problem with import process");
    }
    finally {
        process.exit();
    }
};

const deleteAllData = async function(){
    try {
        await User.deleteMany();
        await Question.deleteMany();
        await Answer.deleteMany();
        console.log("Delete Process Successful");


    }   
    catch(err) {
        console.log(err);
        console.err("There is a problem with delete process");
    }
    finally {
        process.exit();
    }
};

if (process.argv[2] == "--import"){
    importAllData();
}
else if (process.argv[2] == "--delete"){
    deleteAllData();
}
