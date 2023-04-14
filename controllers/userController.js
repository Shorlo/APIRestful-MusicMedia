/*  APIRESTFUL-MUSICMEDIA/controllers/userController.js
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

const bcrypt = require('bcrypt');
const validate = require('../helpers/validate');
const User = require('../models/User');

// Test endpoint
const testUser = (request, response) =>
{
     return response.status(200).send
     ({
          status: 'Success',
          message: 'Message sended from: controllers/userController.js'
     });
}

// Endpoints

// registerUser endpoint
const registerUser = (request, response) =>
{
     // Get params from request
     const params = request.body;

     // Check params
     if(!params.name || !params.nick || !params.email || !params.password)
     {
          return response.status(400).send
          ({
               status: 'Error',
               message: 'Missing data.'
          });
     }

     // Validate params
     try
     {
          validate(params);
     }
     catch(error)
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Validate failed.'
          });
     }

     // Duplicate user control
     User.find
     ({
          $or:
          [
               {email: params.email.toLowerCase()},
               {nick: params.nick.toLowerCase()}
          ]
     }).then(async(users) =>
     {
          if(users && users.length >= 1)
          {
               return response.status(200).send
               ({
                    status: 'Error',
                    message: 'User already exists'
               });
          }
          // Encode password
          const pwd = await bcrypt.hash(params.password, 10);
          params.password = pwd;

          // Create User object
          const userToSave = new User(params);

          // Save user in database
          userToSave.save().then((userStored) =>
          {
               if(!userStored)
               {
                    return response.status(404).send
                    ({
                         status: 'Error',
                         message: 'User to save not found'
                    });
               }
               // Clean object to return
               const userCreated = userStored.toObject();
               delete userCreated.password;
               delete userCreated.role;
               
               // Return response
               return response.status(200).send
               ({
                    status: 'Success',
                    message: 'User registered successfuly.',
                    user: userCreated
               });
          }).catch(() =>
          {
               return response.status(500).send
               ({
                    status: 'Error',
                    message: 'Save user failed.'
               });
          });
     }).catch(() =>
     {
          return response.status(500).send
          ({
               status: 'Error',
               message: 'Error finding users.'
          });
     });     
}

module.exports = 
{
     testUser,
     registerUser
}