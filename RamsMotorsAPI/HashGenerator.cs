using System;
using BCrypt.Net;

public class HashGenerator
{
    public static void Main(string[] args)
    {
        string password = "admin123";
        string hash = BCrypt.Net.BCrypt.HashPassword(password, 11);
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Hash: {hash}");
        
        // Verify the hash works
        bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
        Console.WriteLine($"Verification: {isValid}");
    }
}
