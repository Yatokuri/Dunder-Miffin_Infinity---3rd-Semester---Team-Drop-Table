using dataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace dataAccess;

public class PaperContext : DbContext
{
    public PaperContext(DbContextOptions<PaperContext> options) : base(options)
    {
    }

    public virtual DbSet<Paper> Papers { get; set; }
}