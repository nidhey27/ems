// Validation
const Joi = require('@hapi/joi');

const adminReg = (data) => {
    const admin = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required()
    }

    return Joi.validate(data, admin);
}

const adminLogin = (data) => {
    const admin = {
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required()
    }

    return Joi.validate(data, admin);
}

const validateEntryAttendance = (data) => {
    const entryAttendacne = {
        emp_id : Joi.string().required(),
        emp_name : Joi.string().min(3).required(),
        geo_fence_id : Joi.string().required(),
        entry :  Joi.number().required(),
        entry_date_time : Joi.date().required(),
        type : Joi.string().required()
    }
    return Joi.validate(data, entryAttendacne);
}

const validateExitAttendance = (data) => {
    const exitAttendacne = {
        
        emp_id : Joi.string().required(),
        emp_name : Joi.string().min(3).required(),
        geo_fence_id : Joi.string().required(),
        exit :  Joi.number().required(),
        exit_date_time : Joi.date().required(),
        type : Joi.string().required()
    }
    return Joi.validate(data, exitAttendacne);
}

const geoFenceValidation = (data) => {
    const geoFence = {
        location_name : Joi.string().required(),
        longtitude : Joi.number().required(),
        latitude : Joi.number().required(),
        radius : Joi.number().required()
    }
    return Joi.validate(data, geoFence);
}

// module.exports.registerValidation = adminReg;
// module.exports.loginValidation = adminLogin;
// module.exports.validateEntryAttendance = validateEntryAttendance;
// module.exports.validateExitAttendance = validateExitAttendance;

module.exports = {
    registerValidation : adminReg,
    loginValidation : adminLogin,
    validateEntryAttendance : validateEntryAttendance, 
    validateExitAttendance : validateExitAttendance,
    geoFenceValidation : geoFenceValidation
}