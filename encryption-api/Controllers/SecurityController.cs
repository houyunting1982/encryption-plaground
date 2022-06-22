using encryption_api.Models;
using encryption_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace encryption_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityController : ControllerBase
    {
        private const string Primary = "primary";
        private const string Secondary = "secondary";
        private readonly IEncryptionService _encryptionService;

        public SecurityController(IEncryptionService encryptionService)
        {
            _encryptionService = encryptionService;
        }

        [HttpGet("primarykey")]
        public IActionResult GetPrimaryPublicKey()
        {
            return Ok(_encryptionService.GetPublicKey(Primary));
        }

        [HttpGet("secondarykey")]
        public IActionResult GetSecondaryPublicKey()
        {
            return Ok(_encryptionService.GetPublicKey(Secondary));
        }

        [HttpGet("sample")]
        public IActionResult GetEncryptionSample()
        {

            var card = new CreditCardData
            {
                CardholderName = "Test",
                Number = "4111111111111111",
                Cvc = "819",
                ExpMonth = 10,
                ExpYear = 2025,
                Zip = "12346"
            };

            var jweToken = _encryptionService.Encrypt(card);
            return Ok(jweToken);
        }

        [HttpPost]
        public IActionResult Decrypt([FromBody] EncryptedData encryptedData)
        {
            var card = _encryptionService.Decrypt<CreditCardData>(encryptedData.Data);
            if (card == null)
            {
                return BadRequest();
            }
            return Ok(card);
        }
    }
}