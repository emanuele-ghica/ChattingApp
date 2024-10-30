using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


[Authorize]
public class UsersController(IUserRepository userRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers() {       // a method to return all the users
        var users = await userRepository.GetMembersAsync();                    // IEnumerable means that the data received(AppUser) is represented by a collection of elements
        return Ok(users);                                                      // that can be enumerated(looped through)
    }

    [HttpGet("{username}")]  // /api/users/3    we need curly braces {}  because then it's gonna be the values of the username instead of the "username"
      public async Task<ActionResult<MemberDto>> GetUsers(string username) {   // using Action Result allows us to return different response types on the same action method
        var user = await userRepository.GetMemberAsync(username);              // User can be null here

        if(user == null) return NotFound();                                    // we check here if the user returned is null and if it is we send a 404 Not Found to the client

        return user;                                                           // now the compiler knows that users cannot be null here
    }
}
