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
const fs = require('fs');
const path = require('path');

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

const listSongOfAlbum = (request, response) =>
{
     // Get albumId
     const albumId = request.params.albumId;

     // Query of songs with album and artist info
     Song.find({album: albumId}).populate({path: 'album', populate: {path: 'artist', model: 'Artist'}}).sort('track').then((songs) =>
     {
          if(!songs || songs <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Songs not found.'
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               songs: songs
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error getting songs from database.'
          });
     });
}

const updateSong = (request, response) =>
{
     // Get songId from url params
     const songId = request.params.id;

     // Get data to update
     const data = request.body;

     // Find and update song
     Song.findByIdAndUpdate(songId, data, {new: true}).then((songUpdated) =>
     {
          if(!songUpdated || songUpdated <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Song to update not found.'
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               song: songUpdated
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error updating song.'
          });
     }); 
}

const deleteSong = (request, response) =>
{
     // Get songId from url params
     const songId = request.params.id;

     // Find and remove song from database
     Song.findByIdAndDelete(songId).then((songDeleted) =>
     {
          if(!songDeleted || songDeleted.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Song to delete not found.'
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               song: songDeleted
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error deleting song.'
          });
     });
}

const uploadMP3File = (request, response) =>
{
     // Get artist Id
     const songId = request.params.id;
     if(!songId)
     {
          return response.status(404).send
          ({
               status: 'Error',
               message: 'Song file not found...'
          });
     }

     // Get image file and check if exists
     if(!request.file)
     {
          return response.status(404).send
          ({
               status: 'Error',
               message: 'Mp3 file not found.'
          });
     }

     // Get file name
     const mp3FileName = request.file.originalname;
     
     // Get and check extension
     const extension = mp3FileName.split('.')[1];
     if(extension != 'mp3' && extension != 'ogg' )
     {
          // Delete file and return response.
          fs.unlinkSync(request.file.path);
          return response.status(400).json
          ({
               status: 'Error',
               message: 'File extension invalid...',
          });
     }
     else
     {
          // Save in database
          Song.findOneAndUpdate({_id: songId}, {file: request.file.filename}, {new: true}).then((songUploaded) =>
          {
               if(!songUploaded || songUploaded.length <= 0)
               {
                    return response.status(404).send
                    ({
                         status: 'Error',
                         message: 'Song to upload is empty...'
                    });
               }

               // Return response
               return response.status(200).send
               ({
                    status: 'Success',
                    song: songUploaded,
                    file: request.file,
               });
          }).catch(() =>
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error finding song to upload...'
               });
          });
     }
}

const getMP3File = (request, response) =>
{
     // Get file from url params
     const file = request.params.file;

     // Show image path
     const filePath = './uploads/songsFiles/' + file;

     // Check if file exists
     fs.stat(filePath, (error, exists) =>
     {
          if(error)
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error checking song...'
               });
          }
          if(!exists)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'File is not exists...'
               });
          }

          // Return file
          return response.sendFile(path.resolve(filePath)); // <-- ABSOLUTE PATH require('path')
     });
}

module.exports = 
{
     testSong,
     saveASong,
     getOneSong,
     listSongOfAlbum,
     updateSong,
     deleteSong,
     uploadMP3File,
     getMP3File
}