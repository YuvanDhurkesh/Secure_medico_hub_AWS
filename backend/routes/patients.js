const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/', patientController.registerPatient);
router.get('/', patientController.getPatients);

module.exports = router;
