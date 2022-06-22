using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;
using Jose;

namespace encryption_api.Services
{
    public class EncryptionService : IEncryptionService
    {
        private const string Primary = "primary";
        private const string Secondary = "secondary";
        private const string AlgorithmIdentifier = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A";
        private const string PublicKeyHeader = "-----BEGIN PUBLIC KEY-----";
        private const string PublicKeyFooter = "-----END PUBLIC KEY-----";

        private readonly JsonSerializerOptions options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        private readonly Dictionary<string, RSA> _rsaDict;

        public EncryptionService(Dictionary<string, RSA> rsaDict)
        {
            _rsaDict = rsaDict;
        }

        public string Encrypt(object obj)
        {
            var jsonString = JsonSerializer.Serialize(obj);
            var primary = _rsaDict[Primary];
            var recipient = new JweRecipient(JweAlgorithm.RSA1_5, primary);
            var jweString = JWE.Encrypt(jsonString, new[] { recipient }, JweEncryption.A256CBC_HS512, mode: SerializationMode.Compact);
            return jweString;
        }

        public T? Decrypt<T>(string str) where T : new()
        {
            var decryptedData = Decrypt(str, Primary);
            if (decryptedData == null)
            {
                decryptedData = Decrypt(str, Secondary);
            }

            if (decryptedData == null)
            {
                return default(T);
            }
            var decryptedStr = Encoding.UTF8.GetString(decryptedData.PlaintextBytes);
            var data = JsonSerializer.Deserialize<T>(decryptedStr, options);
            return data;
        }

        public string GetPublicKey(string type)
        {
            var primary = _rsaDict[type];
            var publicKey = Convert.ToBase64String(primary.ExportRSAPublicKey());
            return $"{PublicKeyHeader}{AlgorithmIdentifier}{publicKey}{PublicKeyFooter}";
        }

        private JweToken Decrypt(string str, string type)
        {
            try
            {
                var rsaKey = _rsaDict[type];
                return JWE.Decrypt(str, rsaKey);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}