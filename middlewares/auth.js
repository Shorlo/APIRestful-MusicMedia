/*  APIRESTFUL-MUSICMEDIA/middlewares/auth.js
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

const jwt = require('jwt-simple');
const moment = require('moment');

// Import secretKey
const {secretKey} = require('../helpers/jwt');

// Create middleware
exports.auth = (request, response, next) =>
{
    // Check auth header
    if(!request.headers.authorization)
    {
        return response.status(403).send
        ({
            status: 'Error',
            message: 'The request have not authorization header.'
        });
    }

    // Clean token
    let token = request.headers.authorization.replace(/['"]+/g, '');

    try
    {
        // Uncode token
        let payload = jwt.decode(token, secretKey);
        
        // Check token exp date
        if(payload.exp <= moment().unix())
        {
            return response.status(401).send
            ({
                status: 'Error',
                message: 'Token has expired.'
            });
        }

        // Add user data to the request
        request.user = payload;
    }
    catch(error)
    {
        return response.status(404).send
        ({
            status: 'Error',
            message: 'Invalid token.',
            
        });
    }

    // Ejecute action
    next();
}

