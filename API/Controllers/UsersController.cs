using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


public class UsersController(DataContext context) : BaseApiController
{
    [AllowAnonymous]    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers() {       // a method to return all the users
        var users = await context.Users.ToListAsync();                       // IEnumerable emans that the data received(AppUser) is represented by a collection of elements
                                                                             // that can be enumerated(looped through)
        return users;
    }

    [Authorize]
    [HttpGet("{id:int}")]  // /api/users/3    we need curly braces {}  because then it's gonna be the values of the id instead of the "id"
      public async Task<ActionResult<AppUser>> GetUsers(int id) {   // using Action Result allows us to return different response types on the same action method
        var users = await context.Users.FindAsync(id);              // Users.find(id) can return null.

        if(users == null) return NotFound();                        // we check here if the user returned is null and if it is we send a 404 Not Found to the client

        return users;                                               // now the compiler knows that users cannot be null here
    }
}
