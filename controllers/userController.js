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

// RegisterUser
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
               message: 'Missing data...'
          });
     }

     // Validate params

     // Duplicate user control

     // Encode password

     // Create User object

     // Save user in database

     // Clean object to return

     // Return response


     return response.status(200).send
     ({
          status: 'Success',
          message: 'User registered successfuly.'
     });
}

module.exports = 
{
     testUser,
     registerUser
}