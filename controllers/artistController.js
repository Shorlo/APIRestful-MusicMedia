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
const Album = require('../models/Album');
const Song = require('../models/Song');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');



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

const listArtists = (request, response) =>
{
     // Get page
     let page = 1;

     if(request.params.page)
     {
          page = parseInt(request.params.page);
     }

     // Define elements per page
     const itemsPerPage = 5;

     // Find, order and paginate query
     Artist.find().sort('name').paginate(page, itemsPerPage).then(async(artists) =>
     {
          if(!artists || artists <= 0)
          {
               return response.status(404).json
               ({
                    status: 'Error',
                    message: 'Artists not found...'
               });
          }
          const totalArtists = await Artist.countDocuments({}).exec();

          return response.status(200).send
          ({
               status: 'Success',
               message: 'List artists successfuly.',
               page: page,
               pages: Math.ceil(totalArtists/itemsPerPage),
               total: totalArtists,
               artists
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Error getting artists...'
          });
     });
}

const updateArtist = (request, response) =>
{
     // Get id params from url
     const artistId = request.params.id;

     // Get body data
     const data = request.body;

     // Find and update artists
     Artist.findByIdAndUpdate(artistId, data, {new: true}).then((artistUpdated) =>
     {
          if(!artistUpdated)
          {
               return response.status(404).json
               ({
                    status: 'Error',
                    message: 'Artist was not updated.'
               });
          }
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Artist updated successfuly.',
               artist: artistUpdated
          });
     }).catch(() =>
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Error updating artist.'
          });
     });
}

const deleteArtist = async (request, response) =>
{
     // Get artistID from url
     const artistId = request.params.id;

     // Query to find and delete artist with await
     try
     {
          const artistRemoved = await Artist.findByIdAndDelete(artistId);
          
          // Remove albums and songs

          // Not working ---> long method without async await
          const albumRemoved = await Album.findByIdAndDelete({artist: artistId});
          const songRemoved = await Song.findByIdAndDelete({album: albumRemoved._id});

          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Artist removed successfuly.',
               artistRemoved: artistRemoved,
               albumRemoved: albumRemoved,
               songRemoved: songRemoved
          });
     }
     catch(error)
     {
          return response.status(500).json
          ({
               status: 'Error',
               message: 'Error deleting artist.'
          });
     }
}

const uploadArtistImage = (request, response) =>
{
     // Get artist Id
     const artistId = request.params.id;
     if(!artistId)
     {
          return response.status(404).send
          ({
               status: 'Error',
               message: 'Artist not found...'
          });
     }

     // Get image file and check if exists
     if(!request.file)
     {
          return response.status(404).send
          ({
               status: 'Error',
               message: 'No image found.'
          });
     }

     // Get file name
     const imageName = request.file.originalname;
     
     // Get and check extension
     const extension = imageName.split('.')[1];
     if(extension != 'png' && extension != 'jpeg' && extension != 'jpg' && extension != 'gif' && extension != 'PNG' && extension != 'JPEG' && extension != 'JPG' && extension != 'GIF')
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
          Artist.findOneAndUpdate({_id: artistId}, {image: request.file.filename}, {new: true}).then((artistUpdated) =>
          {
               if(!artistUpdated)
               {
                    return response.status(404).send
                    ({
                         status: 'Error',
                         message: 'Artist to update is empty...'
                    });
               }

               // Return response
               return response.status(200).send
               ({
                    status: 'Success',
                    artist: artistUpdated,
                    file: request.file,
               });
          }).catch(() =>
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error finding artst to update...'
               });
          });
     }
}

const getArtistImage = (request, response) =>
{
     // Get file from url params
     const file = request.params.file;

     // Show image path
     const filePath = './uploads/artistsImage/' + file;

     // Check if file exists
     fs.stat(filePath, (error, exists) =>
     {
          if(error)
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Error checking image...'
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
     testArtist,
     saveArtist,
     getArtist,
     listArtists,
     updateArtist,
     deleteArtist,
     uploadArtistImage,
     getArtistImage
}