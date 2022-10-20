/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const User = require('../models/user')
const authCtrl = require('../controllers/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* RECUPERATION DU ROUTEUR EXPRESS */
let router = express.Router()
/* ROUTAGE de la ressource Auth */
// POST car envoi de formulaire
router.post('/login',authCtrl.loginUser )

module.exports = router