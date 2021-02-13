const router = require('express').Router();
const jwt = require('jsonwebtoken');
const GeoFence = require('../modal/GeoFence')
const { geoFenceValidation } = require('../validation')

router.get('/', authAdmin, (req, res, next) => {
    res.status(200).json({
        posts: {
            title: "Private Route : Add Geo Fence And Assign To Employees ",
            description: "Private Data you shouldn't access!"
        }
    })
});

router.post('/add-fence', authAdmin, async (req, res, next) => {
    const { error } = geoFenceValidation(req.body);

    if (error) return res.status(200).json({ error: error.details[0].message });

    // Check Already Entry
    const locationExists = await GeoFence.findOne({$and : [{ longtitude: req.body.longtitude, latitude: req.body.latitude, location_name: req.body.location_name }]})
    if (locationExists) return res.status(200).json({ message: 'Location already exists' })

    const geoFence = new GeoFence({
        longtitude: req.body.longtitude, 
        latitude: req.body.latitude, 
        location_name: req.body.location_name,
        radius : req.body.radius
    })

    try {
        let geoFenceData = await geoFence.save();
        res.status(200).json({user : geoFenceData, message : "success"});
    }catch(err){
        // console.log(err)
        res.status(200).json({err})
    }
})

function authAdmin(req, res, next) {
    const token = req.header('auth-token');
    const role = req.header('role');
    // console.trace(token, role)
    if (!token) {
        return res.status(200).json({ message: 'Access Denied!' })
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(200).json({ error: 'Invalid Token' })
    }

}

module.exports = router;