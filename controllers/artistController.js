/*  APIRESTFUL-MUSICMEDIA/controllers/artistController.js
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

const Artist = require('../models/Artist');


// Test endpoint
const testArtist = (request, response) =>
{
     return response.status(200).send
     ({
          status: 'Success',
          message: 'Message sended from: controllers/artistController.js'
     });
}

const saveArtist = (request, response) =>
{
     // Get data from body
     const params = request.body;

     // Create Artist Object to save
     const artist = new Artist(params);

     // Save Artist in database
     artist.save().then((artistStored) =>
     {
          if(!artistStored)
          {
               return response.status(404).json
               ({
                    status: 'Error',
                    message: 'Artist to stored is not exist...'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Artist stored successfuly.',
               artist: artistStored
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Artist was not saved...'
          });
     });
}

const getArtist = (request, response) =>
{
     // Get url param
     const artistId = request.params.id;

     // Find artist in database
     Artist.findById(artistId).then((artist) =>
     {
          if(!artist)
          {
               return response.status(404).json
               ({
                    status: 'Error',
                    message: 'Artist not found.'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               artist
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Error getting artist...'
          });
     });   
}

module.exports = 
{
     testArtist,
     saveArtist,
     getArtist
}