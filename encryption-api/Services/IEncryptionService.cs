namespace encryption_api.Services
{
    public interface IEncryptionService
    {
        string Encrypt(object obj);
        T Decrypt<T>(string str) where T : new();
        string GetPublicKey(string type);
    }
}