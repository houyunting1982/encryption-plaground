namespace encryption_api.Models
{
    public class CreditCardData
    {
        public string CardholderName { get; set; }
        public string Number { get; set; }
        public string Cvc { get; set; }
        public int ExpMonth { get; set; }
        public int ExpYear { get; set; }
        public string Zip { get; set; }
    }
}