/*  APIRESTFUL-MUSICMEDIA/routes/artistRoutes.js
       ____     __           _           _____        __
      / __/_ __/ /  ___ ____(_)__  ___  / ___/__  ___/ /__
 ___ _\ \/ // / _ \/ -_) __/ / _ `/ _ \/ /__/ _ \/ _  / -_)_____________________
|   /___/\_, /_.__/\__/_/ /_/\_,_/_//_/\___/\___/\_,_/\__/                      |
| Shorlo/___/                                                                   |
|                                                                               |
|   Copyright © 2022-2023 Javier Sainz de Baranda Goñi.                         |
|   Released under the terms of the GNU Lesser General Public License v3.       |
|                                                                               |
|   This program is free software: you can redistribute it and/or modify it     |
|   under the terms of the GNU General Public License as published by the Free  |
|   Software Foundation, either version 3 of the License, or (at your option)   |
|   any later version.                                                          |
|   This program is distributed in the hope that it will be useful, but         |
|   WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY  |
|   or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License     |
|   for more details.                                                           |
|                                                                               |
|   You should have received a copy of the GNU General Public License along     |
|   with this program. If not, see <http://www.gnu.org/licenses/>.              |
|                                                                               |
'==============================================================================*/

// Dependencies
const express = require('express');
const check = require('../middlewares/auth');
const uploads = require('../middlewares/uploadsArtist');

// Load router
const router = express.Router();

// Import controller
const ArtistController = require('../controllers/artistController');

// Define routes
router.get('/testArtist', ArtistController.testArtist);
router.post('/saveArtist', check.auth, ArtistController.saveArtist);
router.get('/getArtist/:id', check.auth, ArtistController.getArtist);
router.get('/listArtists/:page?', check.auth, ArtistController.listArtists);
router.put('/updateArtist/:id', check.auth, ArtistController.updateArtist);
router.delete('/deleteArtist/:id', check.auth, ArtistController.deleteArtist);
router.post('/uploadArtistImage/:id', [check.auth, uploads.single('artistImage')], ArtistController.uploadArtistImage);
router.get('/getArtistImage/:file', check.auth, ArtistController.getArtistImage);

// Export router
module.exports = router;