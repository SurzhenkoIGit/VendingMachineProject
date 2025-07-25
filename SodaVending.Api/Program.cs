using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Data;
using SodaVending.Api.Repositories;
using SodaVending.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Добавляем необходимые сервисы
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Подключчаем SodaVendingDbContext к серверу БД
builder.Services.AddDbContext<SodaVendingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Регистрируем репозитории
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<ICoinRepository, CoinRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Регистрируем сервисы
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<ICoinService, CoinService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Добавляем CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseCors("AllowNextJs");

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SodaVendingDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();
