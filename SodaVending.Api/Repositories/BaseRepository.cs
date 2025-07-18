using Microsoft.EntityFrameworkCore;
using SodaVending.Api.Data;

namespace SodaVending.Api.Repositories;

//Базовый репозиторий для предоставления основных CRUD-операций в производных репозиториях
public class BaseRepository<T> : IBaseRepository<T> where T : class 
{
    protected readonly SodaVendingDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(SodaVendingDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    //Получить все записи
    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    //Получить запись по id
    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    //Добавить запись
    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    //Обновить запись
    public virtual async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    //Удалить запись
    public virtual async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
