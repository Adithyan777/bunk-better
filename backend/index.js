// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Schema, model } = mongoose;
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Connection URL for your MongoDB database
const mongoURI = process.env.MONGO_URI;

const environment = process.env.ENVIRONMENT;
const frontEndUrl = environment === 'production'
  ? process.env.FRONTEND_URL
  : process.env.DEVELOPMENT_FRONTEND_URL;

// Express application
const app = express();

// Configure CORS
const corsOptions = {
    origin: frontEndUrl,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization,day', // Add any headers you expect from the frontend
    credentials: true, // Allow cookies to be sent across origins
    optionsSuccessStatus: 204
  };
  
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI);

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Define the Subject schema
const subjectSchema = new Schema({
    subname: { type: String, required: true },
    noOfAttended: { type: Number, default: 0 },
    noOfMissed: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastUpdated: { type: String, default: null }, // Add lastUpdated attribute
    lastChange: {type: String, default: null}
});

// Create a unique index based on `subname` and `createdBy`
subjectSchema.index({ subname: 1, createdBy: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

// Define the Timetable schema
const timetableSchema = new Schema({
    day: { type: String, required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

// Create a unique index based on `day` and `createdBy`
timetableSchema.index({ day: 1, createdBy: 1 }, { unique: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log(err);
                res.status(401).send('Token has expired');
            }
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword });
        res.json(user);
    } catch (error) {
        if(error.code == 11000){
            res.status(409).send('Account with given email already exists.');
        }
        else{
            console.error('Error registering user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to insert subjects into the database
async function insertSubjects(subjects, userId) {
    try {
        const entries = [];
        for (const subname of subjects) {
            const entry = await Subject.create({ subname, createdBy: userId });
            console.log(entry);
            entries.push(entry);
        }
        return entries;
    } catch (error) {
        console.error('Error inserting subjects:', error);
        throw error;
    }
}

// // Function to get the ID of a subject by its name
// async function getIdByAttribute(attribute, value, userId) {
//     try {
//         const query = { [attribute]: value, createdBy: userId }; // Include createdBy in the query
//         const document = await Subject.findOne(query);
//         if (document) {
//             return document._id;
//         } else {
//             console.log(`No document found with ${attribute} '${value}' for user '${userId}'.`);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error occurred while finding document:', error);
//     }
// }

// Function to insert timetable into the database
async function insertTimeTable(inputTT, userId) {
    try {
        const { day, subjects } = inputTT;

        console.log(inputTT);
        
        // Ensure that all subjects exist and belong to the user before creating the timetable
        const subjectDocs = await Subject.find({ _id: { $in: subjects }, createdBy: userId });
        
        if (subjectDocs.length !== subjects.length) {
            throw new Error('One or more subjects are invalid or not owned by the user.');
        }

        const entry = await Timetable.create({ day, subjects, createdBy: userId });
        console.log(entry);
        return entry;
    } catch (error) {
        console.error('Error inserting timetable:', error.message);
        throw error;
    }
}

const getCurrentLocalDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


// Function to update attendance
async function updateAttendance(docID, code) {
    try {
        const doc = await Subject.findById(docID);
        if (code === 1) {
            doc.noOfAttended++;
            doc.totalClasses++;
        } else if (code === -1) {
            doc.noOfMissed++;
            doc.totalClasses++;
        }
        const updatedDoc = await doc.save();
        console.log(updatedDoc);
        return updatedDoc;
    } catch (error) {
        console.error('Error updating attendance:', error);
        throw error;
    }
}



// Define a route handler for the '/home' route
app.get('/', (req, res) => {
    res.send('Welcome to attendance tracker!');
});

// Route to insert subjects
app.post('/insertSubjects', authenticateToken, async (req, res) => {
    const subjects = req.body.subjects; // Assuming subjects are passed in the request body
    const result = await insertSubjects(subjects, req.user.id);
    res.send(result);
});

// Route to update subjects
app.put('/insertSubjects', authenticateToken, async (req, res) => {
    const newSubjects = req.body.subjects; // Assuming subjects are passed in the request body
    const userId = req.user.id;

    try {
        // Fetch all current subjects for the user
        const currentSubjects = await Subject.find({ createdBy: userId });

        // Create a set of new subject names
        const newSubjectSet = new Set(newSubjects);

        // Identify subjects to remove (those in current subjects but not in new subjects)
        const subjectsToRemove = currentSubjects.filter(subject => !newSubjectSet.has(subject.subname));

        // Remove the subjects from the database
        await Subject.deleteMany({ _id: { $in: subjectsToRemove.map(subject => subject._id) } });

        // Identify subjects to add (those in new subjects but not in current subjects)
        const currentSubjectSet = new Set(currentSubjects.map(subject => subject.subname));
        const subjectsToAdd = newSubjects.filter(subname => !currentSubjectSet.has(subname));

        // Insert new subjects
        const newEntries = await insertSubjects(subjectsToAdd, userId);

        // Combine the remaining current subjects and new entries to form the updated list
        const updatedSubjects = currentSubjects
            .filter(subject => newSubjectSet.has(subject.subname))
            .concat(newEntries);
        console.log(updatedSubjects);
        res.json(updatedSubjects);
    } catch (error) {
        console.error('Error updating subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to insert timetable
app.post('/insertTimetable', authenticateToken, async (req, res) => {
    try {
        const { day, subjects } = req.body.timetable; // Assuming timetable is passed in the request body
        const result = await insertTimeTable({ day, subjects }, req.user.id);
        res.send(result);
    } catch (error) {
        console.error('Error in insertTimeTable route:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update timetable
app.put('/insertTimetable', authenticateToken, async (req, res) => {
    try {
        const { day, subjects } = req.body.timetable;
        const userId = req.user.id;

        // Delete current timetable for the specific day and user
        await Timetable.deleteOne({day,createdBy:userId});

        // Insert new timetable for the specific day and user
        const result = await insertTimeTable({ day, subjects }, userId);
        console.log(result);
        res.send(result);
    } catch (error) {
        console.error('Error in updateTimetable route:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



// Route to update attendance
app.put('/updateAttendance', authenticateToken, async (req, res) => {
    try {
        const { docID, code } = req.body;
        console.log({ docID, code });
        const updatedDoc = await updateAttendance(docID, code);
        res.send(updatedDoc);
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});


// GET route to get all subjects
app.get('/subjects', authenticateToken, async (req, res) => {
    try {
        const subjects = await Subject.find({ createdBy: req.user.id });
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET route to get subjects for a specific day
app.get('/subjectsByDay', authenticateToken, async (req, res) => {
    try {
        const day = req.headers['day'];
        if (!day) {
            return res.status(400).send('Day header is required');
        }

        const timetable = await Timetable.findOne({ day, createdBy: req.user.id }).populate('subjects');
        if (!timetable) {
            return res.status(404).send('Timetable not found for the specified day');
        }

        const subjects = timetable.subjects;
        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects by day:', error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT route to update subject document with attendance details
app.put('/updateSubject', authenticateToken, async (req, res) => {
    try {
        const { id, attended, missed, total } = req.body;
        console.log({ id, attended, missed, total });
        // Validate input parameters
        if (id == null || attended == null || missed == null || total == null) {
            return res.status(400).send('All fields are required');
        }


        // Find subject document by ID
        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(404).send('Subject not found');
        }

        if (subject.noOfAttended < attended){
            subject.lastChange = "attended";
        }
        else if(subject.noOfMissed < missed){
            subject.lastChange = "missed"
        }
        else if(subject.noOfAttended == attended && subject.noOfMissed == missed){
            subject.lastChange = "noClass"
        }

        // Update attendance details
        subject.noOfAttended = attended;
        subject.noOfMissed = missed;
        subject.totalClasses = total;
        subject.lastUpdated =  getCurrentLocalDate();

        // Save the updated subject document
        const updatedSubject = await subject.save();
        res.json(updatedSubject);
    } catch (error) {
        console.error('Error updating subject:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET route to get user data
app.get('/userData', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
