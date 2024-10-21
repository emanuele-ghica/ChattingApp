using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]               // /api/users   ==> [controller] is replaced with the part before "Controller" when looking at a class
public class BaseApiController : ControllerBase
{

}
