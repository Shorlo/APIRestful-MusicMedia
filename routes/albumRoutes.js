/*  APIRESTFUL-MUSICMEDIA/routes/albumRoutes.js
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

// Load router
const router = express.Router();

// Import controller
const AlbumController = require('../controllers/albumController');

// Define routes
router.get('/testAlbum', AlbumController.testAlbum);
router.post('/saveAlbum', check.auth, AlbumController.saveAlbum);
router.get('/getOneAlbum/:id', check.auth, AlbumController.getOneAlbum);
router.get('/listAlbumsByArtist/:artistId', check.auth, AlbumController.listAlbumsByArtist);
router.put('/updateAlbum/:id', check.auth, AlbumController.updateAlbum);


// Export router
module.exports = router;