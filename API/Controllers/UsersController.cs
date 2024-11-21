using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper,
    IPhotoService photoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams) {       // a method to return all the users
        userParams.CurrentUsername = User.GetUsername();
        var users = await userRepository.GetMembersAsync(userParams); 
        Response.AddPaginationHeader(users);                                   // IEnumerable means that the data received(AppUser) is represented by a collection of elements
        return Ok(users);                                                      // that can be enumerated(looped through)
    }

    [HttpGet("{username}")]  // /api/users/3    we need curly braces {}  because then it's gonna be the values of the username instead of the "username"
      public async Task<ActionResult<MemberDto>> GetUser(string username) 
      {                                                                        // using Action Result allows us to return different response types on the same action method
        var user = await userRepository.GetMemberAsync(username);              // User can be null here

        if(user == null) return NotFound();                                    // we check here if the user returned is null and if it is we send a 404 Not Found to the client

        return user;                                                           // now the compiler knows that users cannot be null here
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto) {

        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null)return BadRequest("Could not find user");

        mapper.Map(memberUpdateDto, user);

        if(await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update the user");
    }


    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file) 
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null)return BadRequest("Cannot update user");

        var result = await photoService.AddPhotoAsync(file);

        if(result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo 
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if(user.Photos.Count == 0) photo.IsMain = true;

        user.Photos.Add(photo);

        if(await userRepository.SaveAllAsync())
            return CreatedAtAction(nameof(GetUser), new {username = user.UserName}, mapper.Map<PhotoDto>(photo));

        return BadRequest("Problem adding photo");
    }

    [HttpPut("set-main-photo/{photoId:int}")]
    public async Task<ActionResult> SetMainPhoto(int photoId) 
    {   
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if(user == null) return BadRequest("Could not find user");

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if(photo == null || photo.IsMain) return BadRequest("Cannot use this as main photo");

        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

        if(currentMain != null) currentMain.IsMain = false;
        photo.IsMain = true;

        if(await userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Problem setting the main photo");
    }

    [HttpDelete("delete-photo/{photoId:int}")]

    public async Task<ActionResult> DeletePhoto(int photoId) 
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return BadRequest("User not found");

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if(photo == null || photo.IsMain) return BadRequest("This photo cannot be deleted");

        if(photo.PublicId !=null) 
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if(result.Error != null) return BadRequest(result.Error.Message);
        }       

        user.Photos.Remove(photo);
        
        if(await userRepository.SaveAllAsync()) return Ok();

        return BadRequest("Problem deleting photo");
    }
};
