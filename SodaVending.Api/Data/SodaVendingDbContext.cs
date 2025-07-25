using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Models;

namespace SodaVending.Api.Data;

public class SodaVendingDbContext : DbContext
{
    public SodaVendingDbContext(DbContextOptions<SodaVendingDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Coin> Coins { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        //Создаем валидацию на уровне БД
        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Name).IsUnique();
        });
        
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            
            entity.HasOne(e => e.Brand)
                .WithMany(b => b.Products)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Coin>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nominal).IsRequired();
            entity.Property(e => e.Quantity).IsRequired();
            entity.HasIndex((e => e.Nominal)).IsUnique();
        });
        
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalAmount).HasPrecision(10, 2);
            entity.Property(e => e.PaymentAmount).HasPrecision(10, 2);
            entity.Property(e => e.ChangeAmount).HasPrecision(10, 2);
            entity.Property(e => e.ChangeCoins).HasMaxLength(500);
        });
        
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.BrandName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.TotalPrice).HasPrecision(10, 2);
            
            entity.HasOne(e => e.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        SeedData(modelBuilder);
    }
    
    //Метод для создания записей в таблицы БД (принцип Code First)
    private void SeedData(ModelBuilder modelBuilder)
    {
        var brands = new[]
        {
            new Brand { Id = 1, Name = "Coca-Cola" },
            new Brand { Id = 2, Name = "Pepsi" },
            new Brand { Id = 3, Name = "Sprite" },
            new Brand { Id = 4, Name = "Fanta" }
        };
        
        modelBuilder.Entity<Brand>().HasData(brands);
        
        var products = new[]
        {
            new Product { Id = 1, Name = "Coca-Cola Classic", ImageUrl = "coca-cola.png", Price = 80, Quantity = 10, BrandId = 1 },
            new Product { Id = 2, Name = "Coca-Cola Zero", ImageUrl = "coca-cola-zero.png", Price = 90, Quantity = 15, BrandId = 1 },
            new Product { Id = 3, Name = "Pepsi", ImageUrl = "pepsi.png", Price = 75, Quantity = 20, BrandId = 2 },
            new Product { Id = 4, Name = "Pepsi Light", ImageUrl = "pepsi-light.png", Price = 80, Quantity = 0, BrandId = 2 },
            new Product { Id = 5, Name = "Sprite", ImageUrl = "sprite.png", Price = 70, Quantity = 25, BrandId = 3 },
            new Product { Id = 6, Name = "Sprite Cherry", ImageUrl = "sprite-cherry.png", Price = 75, Quantity = 18, BrandId = 3 },
            new Product { Id = 7, Name = "Fanta Orange", ImageUrl = "fanta.png", Price = 65, Quantity = 30, BrandId = 4 },
            new Product { Id = 8, Name = "Fanta Lemon", ImageUrl = "fanta-lemon.png", Price = 60, Quantity = 22, BrandId = 4 }
        };
        
        modelBuilder.Entity<Product>().HasData(products);
        
        var coins = new[]
        {
            new Coin { Id = 1, Nominal = 1, Quantity = 100 },
            new Coin { Id = 2, Nominal = 2, Quantity = 100 },
            new Coin { Id = 3, Nominal = 5, Quantity = 100 },
            new Coin { Id = 4, Nominal = 10, Quantity = 100 }
        };
        
        modelBuilder.Entity<Coin>().HasData(coins);
    }
}
