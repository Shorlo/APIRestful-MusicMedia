/*  APIRESTFUL-MUSICMEDIA/controllers/albumController.js
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

const { request } = require('express');
const Album = require('../models/Album');


// Test endpoint
const testAlbum = (request, response) =>
{
     return response.status(200).send
     ({
          status: 'Success',
          message: 'Message sended from: controllers/albumController.js'
     });
}

const saveAlbum = (request, response) =>
{
     // Get params from body
     const params = request.body;

     // Create album object
     const album = new Album(params);
     
     // Save album in database
     album.save().then((albumStored) =>
     {
          if(!albumStored || albumStored.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Album to stored not found',

               });
          }

          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Album save successfuly.',
               album: albumStored
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error saving album in database.',
          });
     });
}

const getOneAlbum = (request, response) =>
{
     // Get albumId
     const albumId = request.params.id;

     // Find and populate artist info
     //Album.findById(albumId).populate({path: 'artist'}).then((album) =>
     Album.findById(albumId).populate('artist').then((album) =>
     {
          if(!album || album.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Album not found.',
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               album
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error getting album from database.',
          });
     });
}

const listAlbumsByArtist = (request, response) =>
{
     // Get artist id from url
     const artistId = request.params.artistId;

     // Get all albums from database by artist and populate info
     if(!artistId)
     {
          return response.status(404).send
          ({
               status: 'Error',
               message: 'Artist not found.',
          });
     }
     Album.find({artist: artistId}).populate('artist').then((albums) =>
     {
          if(!albums || albums.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Albums not found.',
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               albums: albums
          });

     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error getting albums from database.',
          });
     });
}

const updateAlbum = (request, response) =>
{
     // Get albumId from url
     const albumId = request.params.id;

     // Get data to update from the body
     const data = request.body;

     // Find and update
     Album.findByIdAndUpdate(albumId, data, {new: true}).then((albumUpdated) =>
     {
          if(!albumUpdated || albumUpdated.length <= 0)
          {
               return response.status(404).send
               ({
                    status: 'Error',
                    message: 'Album to update not found.',
               });
          }
          // Return response
          return response.status(200).send
          ({
               status: 'Success',
               message: 'Album update successfuly.',
               albumId: albumId,
               albumUpdated: albumUpdated
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error updating album.',
          });
     });
}

module.exports = 
{
     testAlbum,
     saveAlbum,
     getOneAlbum,
     listAlbumsByArtist,
     updateAlbum
}