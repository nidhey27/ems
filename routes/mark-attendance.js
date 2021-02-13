const router = require('express').Router();
const verifyToken = require('./verifyjwt')
const Attendence = require('../modal/Mark-Attendance')
const { validateEntryAttendance, validateExitAttendance } = require('../validation');
const { route } = require('./auth');
var ObjectID = require('mongodb').ObjectID;
router.get('/', verifyToken, (req, res, next) => {
    res.status(200).json({
        posts: {
            title: "Private Route : Mark Attendence",
            description: "Private Data you shouldn't access!"
        }
    })
});

router.post('/', verifyToken, async (req, res, next) => {

    // Mark Entry
    if (req.body.type == 'entry') {
        // Validating Data
        const { error } = validateEntryAttendance(req.body);
        if (error) return res.status(200).json({ error: error.details[0].message });

        // Checking for "Existing Entry Row using EMP_ID"
        const entryExists = await Attendence.findOne({ $and: [{ entry: req.body.entry, emp_id: req.body.emp_id }] })
        if (entryExists) return res.status(200).json({ message: "Entry data already exists!" })

        const markEntry = new Attendence({
            emp_id: req.body.emp_id,
            emp_name: req.body.emp_name,
            geo_fence_id: req.body.geo_fence_id,
            entry: req.body.entry,
            entry_date_time: Date()
        })
        try {
            let data = await markEntry.save();
            res.status(200).json({ message: "success" });
        } catch (err) {
            // console.log(err)
            res.status(200).json({ err })
        }

    } else if (req.body.type == 'exit') { //Mark Exit
        // Validating Data
        const { error } = validateExitAttendance(req.body);
        if (error) return res.status(200).json({ error: error.details[0].message });

        // Checking for "Existing Entry Row using EMP_ID"
        const entryDontExists = await Attendence.findOne({ $and: [{ entry: 1, emp_id: req.body.emp_id, geo_fence_id: req.body.geo_fence_id }] })
        if (!entryDontExists) return res.status(200).json({ message: "No entry data found!", entryDontExists })

        // Cheching for "Exisiting Exit Row using EMP_ID"
        const exitEntryExists = await Attendence.findOne({ $and: [{ exit: 1, emp_id: req.body.emp_id, geo_fence_id: req.body.geo_fence_id  }] })
        if (exitEntryExists) return res.status(200).json({ message: "Exit data already exists!" })

        // const markExit = new Attendence({

        //     emp_id : req.body.emp_id,
        //     emp_name : req.body.emp_name,
        //     geo_fence_id : req.body.geo_fence_id,
        //     exit : req.body.exit,
        //     exit_date_time : Date() 
        // })


        try {
            console.log({ _id: ObjectID(entryDontExists._id) })
            let data = await Attendence.findOneAndUpdate({ _id: ObjectID(entryDontExists._id) }, {
                $set: {
                    geo_fence_id: req.body.geo_fence_id,
                    exit: req.body.exit,
                    exit_date_time: Date()
                }
            }, { upsert: true });
            res.status(200).json({ message: "success", data });
        } catch (err) {
            console.log(err)
            res.status(200).json({ err })
        }

    } else { // Insufficient Data
        res.status(200).json({ error: 'Insufficient Data' })
    }
})

module.exports = router;