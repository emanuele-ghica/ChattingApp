using System;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ServiceFilter(typeof(LogUsersActivity))]
[ApiController]
[Route("api/[controller]")]               // /api/users   ==> [controller] is replaced with the part before "Controller" when looking at a class
public class BaseApiController : ControllerBase
{

}
