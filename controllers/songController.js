/*  APIRESTFUL-MUSICMEDIA/controllers/songController.js
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

const Song = require('../models/Song');

// Test endpoint
const testSong = (request, response) =>
{
     return response.status(200).send
     ({
          status: 'Success',
          message: 'Message sended from: controllers/songController.js'
     });
}

const saveASong = (request, response) =>
{
     // Get data from body
     const params = request.body;

     // Create Song object
     const song = new Song(params);

     // uploadMp3File  

     // Save data in databse
     song.save().then((songStored) =>
     {
          if(!songStored || songStored.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Song to save not found.'
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Song saved in database successfuly.',
               song: songStored
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error saving song in database.'
          });
     });
}

const getOneSong = (request, response) =>
{
     // Get url params
     const songId = request.params.id;

     // Find the song in database and album info
     Song.findById(songId).populate('album').then((song) =>
     {
          if(!song || song.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Song not found.'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               song
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error getting song from database.'
          });
     });
}

module.exports = 
{
     testSong,
     saveASong,
     getOneSong
}